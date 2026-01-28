import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { asyncStorageAdapter } from "@/lib/storage";

export interface ExhaustionTest {
    week: number;
    result: number;
    date: string;
}

export interface CompletedSession {
    week: number;
    day: number;
    pushups: number;
    date: string;
    maxSingleSet?: number;
}

export interface FinalTestResult {
    result: number;
    date: string;
    attempts: number;
}

export interface MicroChallengeResult {
    target: number; // 25, 40, 50, 60, 75, 80, 90
    result: number;
    date: string;
    success: boolean;
}

// Micro Challenge milestones before attempting 100
// More gradual steps for users who struggle
export const MICRO_CHALLENGE_TARGETS = [25, 40, 50, 60, 75, 80, 90] as const;

interface UserState {
    // Onboarding
    hasCompletedOnboarding: boolean;
    hasPurchased: boolean;
    analysisTickets: number;
    language: "ko" | "en";

    // Program Progress
    currentColumn: 1 | 2 | 3;
    currentWeek: number;
    currentDay: number;
    isProgramComplete: boolean;

    // Final Test (100 Challenge)
    hasFinalTestUnlocked: boolean;
    finalTestResults: FinalTestResult[];
    hasReached100: boolean;

    // Micro Challenge System (50 → 75 → 90 → 100)
    currentMicroChallenge: number | null; // Current target (50, 75, 90, null for 100)
    microChallengeResults: MicroChallengeResult[];

    // Week Repeat System
    weekRepeatCount: number;
    shouldRepeatWeek: boolean;

    // Encouragement System
    consecutiveFailures: number;
    lastEncouragementDate: string | null;

    // Comeback Detection
    lastActiveDate: string | null;

    // Records
    initialTestResult: number;
    exhaustionTests: ExhaustionTest[];
    completedSessions: CompletedSession[];
    totalPushups: number;
    personalBest: number;

    // Settings
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    autoCountEnabled: boolean;

    // Actions
    setOnboardingComplete: () => void;
    setPurchased: (purchased: boolean) => void;
    addAnalysisTicket: (count: number) => void;
    setColumn: (column: 1 | 2 | 3) => void;
    setInitialTestResult: (result: number) => void;
    completeSession: (pushups: number, maxSingleSet?: number) => void;
    addExhaustionTest: (result: number) => void;
    addFinalTestResult: (result: number) => void;
    nextDay: () => void;
    repeatWeek: () => void;

    // New Actions
    setShouldRepeatWeek: (should: boolean) => void;
    confirmRepeatWeek: () => void;
    addMicroChallengeResult: (target: number, result: number) => void;
    getNextMicroChallenge: () => number | null;
    incrementFailure: () => void;
    resetFailures: () => void;
    markEncouragementShown: () => void;

    // Settings Actions
    setSoundEnabled: (enabled: boolean) => void;
    setVibrationEnabled: (enabled: boolean) => void;
    setAutoCountEnabled: (enabled: boolean) => void;
    toggleSound: () => void;
    toggleVibration: () => void;
    resetProgress: () => void;
    reset: () => void;
}

const getColumnFromTestResult = (result: number): 1 | 2 | 3 => {
    if (result <= 5) return 1;
    if (result <= 10) return 2;
    return 3;
};

/**
 * Calculate streak (consecutive workout days)
 */
export const calculateStreak = (sessions: CompletedSession[]): number => {
    if (sessions.length === 0) return 0;

    const uniqueDates = [...new Set(
        sessions.map(s => s.date.split('T')[0])
    )].sort().reverse();

    if (uniqueDates.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const lastWorkoutDate = uniqueDates[0];
    if (lastWorkoutDate !== today && lastWorkoutDate !== yesterday) {
        return 0;
    }

    let streak = 1;
    let currentDate = new Date(lastWorkoutDate);

    for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(currentDate);
        prevDate.setDate(prevDate.getDate() - 1);
        const expectedDate = prevDate.toISOString().split('T')[0];

        if (uniqueDates[i] === expectedDate) {
            streak++;
            currentDate = prevDate;
        } else {
            break;
        }
    }

    return streak;
};

/**
 * Calculate progress towards 100 push-ups goal
 */
export const calculateProgressTo100 = (
    personalBest: number,
    exhaustionTests: ExhaustionTest[],
    finalTestResults: FinalTestResult[]
): number => {
    const exhaustionMax = exhaustionTests.length > 0
        ? Math.max(...exhaustionTests.map(t => t.result))
        : 0;
    const finalMax = finalTestResults.length > 0
        ? Math.max(...finalTestResults.map(t => t.result))
        : 0;

    const maxEver = Math.max(personalBest, exhaustionMax, finalMax);
    return Math.min(maxEver, 100);
};

/**
 * Get weekly target for single-set based on week and column
 */
export const getWeeklyTarget = (week: number, column: 1 | 2 | 3): number => {
    const targets: Record<number, Record<1 | 2 | 3, number>> = {
        1: { 1: 5, 2: 10, 3: 15 },
        2: { 1: 8, 2: 15, 3: 20 },
        3: { 1: 12, 2: 20, 3: 30 },
        4: { 1: 18, 2: 30, 3: 45 },
        5: { 1: 25, 2: 40, 3: 60 },
        6: { 1: 35, 2: 55, 3: 80 },
    };
    return targets[week]?.[column] ?? 50;
};

/**
 * Analyze if user should repeat the week
 */
export const analyzePerformance = (
    result: number,
    weekTarget: number
): { shouldRepeat: boolean; percentage: number } => {
    const percentage = Math.round((result / weekTarget) * 100);
    return {
        shouldRepeat: percentage < 70,
        percentage,
    };
};

/**
 * Check if user is a comeback user (away for 3+ days)
 * Returns days since last activity, or 0 if active recently
 */
export const getDaysSinceLastActivity = (lastActiveDate: string | null): number => {
    if (!lastActiveDate) return 0;

    const last = new Date(lastActiveDate);
    const now = new Date();
    const diffTime = now.getTime() - last.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
};

/**
 * Get recommended restart week for comeback users
 * If away 3-6 days: go back 1 week
 * If away 7-13 days: go back 2 weeks  
 * If away 14+ days: restart from week 1
 */
export const getRecommendedRestartWeek = (currentWeek: number, daysAway: number): number => {
    if (daysAway < 3) return currentWeek;
    if (daysAway < 7) return Math.max(1, currentWeek - 1);
    if (daysAway < 14) return Math.max(1, currentWeek - 2);
    return 1;
};


export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            // Initial State
            hasCompletedOnboarding: false,
            hasPurchased: false,
            analysisTickets: 0,
            language: "en",
            currentColumn: 1,
            currentWeek: 1,
            currentDay: 1,
            isProgramComplete: false,

            // Final Test State
            hasFinalTestUnlocked: false,
            finalTestResults: [],
            hasReached100: false,

            // Micro Challenge State
            currentMicroChallenge: null,
            microChallengeResults: [],

            // Week Repeat State
            weekRepeatCount: 0,
            shouldRepeatWeek: false,

            // Encouragement State
            consecutiveFailures: 0,
            lastEncouragementDate: null,

            // Comeback Detection
            lastActiveDate: null,

            // Records
            initialTestResult: 0,
            exhaustionTests: [],
            completedSessions: [],
            totalPushups: 0,
            personalBest: 0,

            soundEnabled: true,
            vibrationEnabled: true,
            autoCountEnabled: true,

            // Actions
            setOnboardingComplete: () =>
                set({ hasCompletedOnboarding: true }),

            setPurchased: (purchased) =>
                set({ hasPurchased: purchased }),

            addAnalysisTicket: (count) =>
                set((state) => ({ analysisTickets: state.analysisTickets + count })),

            setColumn: (column) =>
                set({ currentColumn: column }),

            setInitialTestResult: (result) =>
                set({
                    initialTestResult: result,
                    currentColumn: getColumnFromTestResult(result),
                    personalBest: result,
                }),

            completeSession: (pushups, maxSingleSet) => {
                const state = get();
                const session: CompletedSession = {
                    week: state.currentWeek,
                    day: state.currentDay,
                    pushups,
                    date: new Date().toISOString(),
                    maxSingleSet,
                };

                const newPersonalBest = maxSingleSet && maxSingleSet > state.personalBest
                    ? maxSingleSet
                    : state.personalBest;

                set({
                    completedSessions: [...state.completedSessions, session],
                    totalPushups: state.totalPushups + pushups,
                    personalBest: newPersonalBest,
                    lastActiveDate: new Date().toISOString().split('T')[0],
                });

                get().nextDay();
            },

            addExhaustionTest: (result) => {
                const state = get();
                const test: ExhaustionTest = {
                    week: state.currentWeek,
                    result,
                    date: new Date().toISOString(),
                };

                const newPersonalBest = result > state.personalBest ? result : state.personalBest;

                // Check if should repeat week
                const weekTarget = getWeeklyTarget(state.currentWeek, state.currentColumn);
                const { shouldRepeat } = analyzePerformance(result, weekTarget);

                set({
                    exhaustionTests: [...state.exhaustionTests, test],
                    currentColumn: getColumnFromTestResult(result),
                    personalBest: newPersonalBest,
                    shouldRepeatWeek: shouldRepeat,
                });
            },

            addFinalTestResult: (result) => {
                const state = get();
                const attempt = state.finalTestResults.length + 1;
                const testResult: FinalTestResult = {
                    result,
                    date: new Date().toISOString(),
                    attempts: attempt,
                };

                const newPersonalBest = result > state.personalBest ? result : state.personalBest;
                const reachedGoal = result >= 100;

                // Track failures for encouragement
                if (result < 100) {
                    set({
                        finalTestResults: [...state.finalTestResults, testResult],
                        personalBest: newPersonalBest,
                        totalPushups: state.totalPushups + result,
                        consecutiveFailures: state.consecutiveFailures + 1,
                    });
                } else {
                    set({
                        finalTestResults: [...state.finalTestResults, testResult],
                        personalBest: newPersonalBest,
                        hasReached100: true,
                        totalPushups: state.totalPushups + result,
                        consecutiveFailures: 0,
                    });
                }
            },

            nextDay: () =>
                set((state) => {
                    if (state.currentWeek >= 6 && state.currentDay >= 3) {
                        return {
                            isProgramComplete: true,
                            hasFinalTestUnlocked: true,
                        };
                    }

                    if (state.currentDay >= 3) {
                        return {
                            currentDay: 1,
                            currentWeek: Math.min(state.currentWeek + 1, 6),
                            weekRepeatCount: 0,
                        };
                    }
                    return { currentDay: state.currentDay + 1 };
                }),

            repeatWeek: () =>
                set({ currentDay: 1 }),

            // Week Repeat Actions
            setShouldRepeatWeek: (should) =>
                set({ shouldRepeatWeek: should }),

            confirmRepeatWeek: () =>
                set((state) => ({
                    currentDay: 1,
                    weekRepeatCount: state.weekRepeatCount + 1,
                    shouldRepeatWeek: false,
                })),

            // Micro Challenge Actions
            addMicroChallengeResult: (target, result) => {
                const state = get();
                const success = result >= target;
                const newResult: MicroChallengeResult = {
                    target,
                    result,
                    date: new Date().toISOString(),
                    success,
                };

                const newPersonalBest = result > state.personalBest ? result : state.personalBest;

                set({
                    microChallengeResults: [...state.microChallengeResults, newResult],
                    personalBest: newPersonalBest,
                    totalPushups: state.totalPushups + result,
                    consecutiveFailures: success ? 0 : state.consecutiveFailures + 1,
                });
            },

            getNextMicroChallenge: () => {
                const state = get();
                // Find the first target that hasn't been achieved
                for (const target of MICRO_CHALLENGE_TARGETS) {
                    if (state.personalBest < target) {
                        return target;
                    }
                }
                return null; // Ready for 100
            },

            // Encouragement Actions
            incrementFailure: () =>
                set((state) => ({ consecutiveFailures: state.consecutiveFailures + 1 })),

            resetFailures: () =>
                set({ consecutiveFailures: 0 }),

            markEncouragementShown: () =>
                set({ lastEncouragementDate: new Date().toISOString().split('T')[0] }),

            reset: () =>
                set({
                    hasCompletedOnboarding: false,
                    hasPurchased: false,
                    analysisTickets: 0,
                    currentColumn: 1,
                    currentWeek: 1,
                    currentDay: 1,
                    initialTestResult: 0,
                    exhaustionTests: [],
                    completedSessions: [],
                    totalPushups: 0,
                    isProgramComplete: false,
                    hasFinalTestUnlocked: false,
                    finalTestResults: [],
                    hasReached100: false,
                    personalBest: 0,
                    currentMicroChallenge: null,
                    microChallengeResults: [],
                    weekRepeatCount: 0,
                    shouldRepeatWeek: false,
                    consecutiveFailures: 0,
                    lastEncouragementDate: null,
                } as Partial<UserState>),

            resetProgress: () => get().reset(),

            setSoundEnabled: (enabled) =>
                set({ soundEnabled: enabled }),

            setVibrationEnabled: (enabled) =>
                set({ vibrationEnabled: enabled }),

            setAutoCountEnabled: (enabled) =>
                set({ autoCountEnabled: enabled }),

            toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
            toggleVibration: () => set((state) => ({ vibrationEnabled: !state.vibrationEnabled })),
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => asyncStorageAdapter),
        }
    )
);
