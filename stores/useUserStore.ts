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
}

interface UserState {
    // Onboarding
    hasCompletedOnboarding: boolean;
    hasPurchased: boolean;
    language: "ko" | "en";

    // Program Progress
    currentColumn: 1 | 2 | 3;
    currentWeek: number;
    currentDay: number;

    // Records
    initialTestResult: number;
    exhaustionTests: ExhaustionTest[];
    completedSessions: CompletedSession[];
    totalPushups: number;

    // Settings
    soundEnabled: boolean;
    vibrationEnabled: boolean;
    autoCountEnabled: boolean;

    // Actions
    setOnboardingComplete: () => void;
    setPurchased: (purchased: boolean) => void;
    setColumn: (column: 1 | 2 | 3) => void;
    setInitialTestResult: (result: number) => void;
    completeSession: (pushups: number) => void;
    addExhaustionTest: (result: number) => void;
    nextDay: () => void;
    repeatWeek: () => void;
    reset: () => void;
    setSoundEnabled: (enabled: boolean) => void;
    setVibrationEnabled: (enabled: boolean) => void;
    setAutoCountEnabled: (enabled: boolean) => void;
}

const getColumnFromTestResult = (result: number): 1 | 2 | 3 => {
    if (result <= 5) return 1;
    if (result <= 10) return 2;
    return 3;
};

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            // Initial State
            hasCompletedOnboarding: false,
            hasPurchased: false,
            language: "en",
            currentColumn: 1,
            currentWeek: 1,
            currentDay: 1,
            initialTestResult: 0,
            exhaustionTests: [],
            completedSessions: [],
            totalPushups: 0,
            soundEnabled: true,
            vibrationEnabled: true,
            autoCountEnabled: false,

            // Actions
            setOnboardingComplete: () =>
                set({ hasCompletedOnboarding: true }),

            setPurchased: (purchased) =>
                set({ hasPurchased: purchased }),

            setColumn: (column) =>
                set({ currentColumn: column }),

            setInitialTestResult: (result) =>
                set({
                    initialTestResult: result,
                    currentColumn: getColumnFromTestResult(result),
                }),

            completeSession: (pushups) => {
                const state = get();
                const session: CompletedSession = {
                    week: state.currentWeek,
                    day: state.currentDay,
                    pushups,
                    date: new Date().toISOString(),
                };
                set({
                    completedSessions: [...state.completedSessions, session],
                    totalPushups: state.totalPushups + pushups,
                });
            },

            addExhaustionTest: (result) => {
                const state = get();
                const test: ExhaustionTest = {
                    week: state.currentWeek,
                    result,
                    date: new Date().toISOString(),
                };
                set({
                    exhaustionTests: [...state.exhaustionTests, test],
                    currentColumn: getColumnFromTestResult(result),
                });
            },

            nextDay: () =>
                set((state) => {
                    if (state.currentDay >= 3) {
                        return {
                            currentDay: 1,
                            currentWeek: Math.min(state.currentWeek + 1, 6),
                        };
                    }
                    return { currentDay: state.currentDay + 1 };
                }),

            repeatWeek: () =>
                set({ currentDay: 1 }),

            reset: () =>
                set({
                    hasCompletedOnboarding: false,
                    hasPurchased: false,
                    currentColumn: 1,
                    currentWeek: 1,
                    currentDay: 1,
                    initialTestResult: 0,
                    exhaustionTests: [],
                    completedSessions: [],
                    totalPushups: 0,
                }),

            setSoundEnabled: (enabled) =>
                set({ soundEnabled: enabled }),

            setVibrationEnabled: (enabled) =>
                set({ vibrationEnabled: enabled }),

            setAutoCountEnabled: (enabled) =>
                set({ autoCountEnabled: enabled }),
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => asyncStorageAdapter),
        }
    )
);
