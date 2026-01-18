
import { useState, useRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, useColorScheme, AppState, Platform } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming
} from "react-native-reanimated";
import { Analytics } from "@/lib/analytics";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { RestTimer } from "@/components/workout/RestTimer";
import { FaceIndicator } from "@/components/ui/FaceIndicator";
import { PauseOverlay } from "@/components/workout/PauseOverlay";
import { CompletionView } from "@/components/workout/CompletionView";

import { useProgramData } from "@/hooks/useProgramData";
import { useFaceDetector } from "@/hooks/useFaceDetector";
import { useUserStore } from "@/stores/useUserStore";
import { colors, spacing, typography, borderRadius } from "@/constants/theme";
import { hexToRgba } from "@/utils/colors";

export default function WorkoutSessionScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { session } = params;

    // Parse session ID (e.g. "1-1")
    const [weekStr, dayStr] = (session as string || "1-1").split("-");
    const currentWeek = parseInt(weekStr, 10);
    const currentDay = parseInt(dayStr, 10);

    // Global State
    const {
        currentColumn,
        completeSession,
        autoCountEnabled,
        soundEnabled,
        vibrationEnabled
    } = useUserStore();

    // Program Data
    const { getWorkout, restTime } = useProgramData();
    const todayWorkout = getWorkout(currentWeek, currentDay, currentColumn);
    const sets = todayWorkout?.sets || [];
    const totalSets = sets.length;

    // Analytics: Track Workout Start
    useEffect(() => {
        Analytics.track('workout_start', {
            session: params.session,
            autoCount: autoCountEnabled
        });
    }, []);

    // Local State
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [completedReps, setCompletedReps] = useState<number[]>([]);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isSensorAvailable, setIsSensorAvailable] = useState(false);

    // We update ref to handleTap so listener can call it
    const handleTapRef = useRef(() => { });

    // --- Face Detector Hook --- //
    const { hasFace, isAvailable } = useFaceDetector({
        // Always enabled during active workout set, BUT NOT when paused
        enabled: !isResting && !isSessionComplete && !isPaused,
        vibrationEnabled,
        onDown: () => {
            if (vibrationEnabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        },
        onUp: () => {
            handleTapRef.current();
        },
        onStatusChange: (status) => {
            setIsSensorAvailable(status === "Vision Active");
        },
    });

    // --- Animation values --- //
    const scale = useSharedValue(1);

    // --- Validation --- //
    if (!todayWorkout) {
        return (
            <SafeScreen>
                <View style={styles.center}>
                    <Text style={{ color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }}>
                        {t("workout.error")}
                    </Text>
                    <Button onPress={() => router.back()}>{t("workout.goBack")}</Button>
                </View>
            </SafeScreen>
        );
    }

    const targetReps = todayWorkout.sets[currentSetIndex];
    const isMaxSet = todayWorkout.lastSetMax && currentSetIndex === todayWorkout.sets.length - 1;

    // Prevent double counting (Debounce 100ms)
    const lastTapTime = useRef(0);

    // --- Handlers --- //
    const handleTap = () => {
        const now = Date.now();
        if (now - lastTapTime.current < 100) return; // Ignore rapid taps
        lastTapTime.current = now;

        // Prevent counting during rest, completion, or pause
        if (isResting || isSessionComplete || isPaused) return;

        // Feedback
        if (vibrationEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }

        // Animation
        scale.value = withSequence(
            withTiming(1.3, { duration: 50 }),
            withSpring(1, { damping: 12, stiffness: 200 })
        );

        const newCount = currentCount + 1;
        setCurrentCount(newCount);

        // Check for set completion (unless it's a max set)
        if (!isMaxSet && newCount >= targetReps) {
            finishSet(newCount);
        }
    };

    // Update Ref for Sensor
    handleTapRef.current = handleTap;

    const finishSet = (finalCount: number) => {
        const newCompletedReps = [...completedReps, finalCount];
        setCompletedReps(newCompletedReps);

        if (currentSetIndex < totalSets - 1) {
            // Go to rest
            setIsResting(true);
            setCurrentCount(0);
        } else {
            // Finish Session
            handleSessionComplete(newCompletedReps);
        }
    };

    const handleRestComplete = () => {
        if (vibrationEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setIsResting(false);
        setCurrentSetIndex((prev) => prev + 1);
        setCurrentCount(0);
    };

    const handleSessionComplete = (reps: number[]) => {
        setIsSessionComplete(true);
        const total = reps.reduce((a, b) => a + b, 0);
        completeSession(total);

        if (vibrationEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }

        Analytics.track('workout_complete', {
            week: currentWeek,
            day: currentDay,
            totalReps: total,
            sets: reps
        });
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleResume = () => {
        setIsPaused(false);
    };

    const handleQuit = () => {
        setIsPaused(false);
        router.back();
    };

    const handleGoHome = () => {
        router.dismiss();
    };

    // Reanimated styles
    const counterStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // --- Views --- //

    // 1. Session Complete View
    if (isSessionComplete) {
        return (
            <SafeScreen>
                <CompletionView
                    completedReps={completedReps}
                    onGoHome={handleGoHome}
                    isDark={isDark}
                />
            </SafeScreen>
        );
    }

    // 2. Rest Timer View
    if (isResting) {
        const nextSetReps = currentSetIndex + 1 < totalSets ? sets[currentSetIndex + 1] : undefined;
        return (
            <SafeScreen>
                <RestTimer
                    duration={restTime}
                    onComplete={handleRestComplete}
                    onSkip={handleRestComplete}
                    nextSetReps={nextSetReps}
                    currentSet={currentSetIndex}
                    totalSets={totalSets}
                />
            </SafeScreen>
        );
    }

    // 3. Main Workout View
    return (
        <SafeScreen edges={["top", "bottom"]}>
            <View style={styles.header}>
                {!isPaused && (
                    <Pressable onPress={handlePause} style={styles.pauseButton} hitSlop={10}>
                        <Feather name="pause" size={24} color={isDark ? colors.dark.textPrimary : colors.light.textPrimary} />
                    </Pressable>
                )}

                <View style={styles.headerState}>
                    <Text style={[styles.setInfo, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                        {t("workout.set", { current: currentSetIndex + 1, total: totalSets })} •
                    </Text>
                    {/* Always show indicator in workout view */}
                    {!isResting && !isSessionComplete && (
                        <FaceIndicator hasFace={hasFace} isAvailable={isAvailable} style={{ marginLeft: spacing.sm }} />
                    )}
                </View>

                <Text style={[styles.targetInfo, { color: colors.primary }]}>
                    {isMaxSet ? t("workout.max") : t("workout.target", { count: targetReps })}
                </Text>
            </View>

            <View style={styles.container}>
                <Pressable
                    style={styles.touchArea}
                    onPress={handleTap}
                    accessibilityRole="button"
                    accessibilityLabel={t("workout.tapToCount")}
                    accessibilityHint={t("workout.sensorHint")}
                >
                    <Animated.View style={[styles.counterContainer, counterStyle]}>
                        <Text
                            style={[styles.currentCount, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}
                            adjustsFontSizeToFit
                            numberOfLines={1}
                            accessibilityLabel={currentCount + " " + t("workout.reps", { count: currentCount })}
                        >
                            {currentCount}
                        </Text>
                        {!isMaxSet && (
                            <Text style={[styles.targetCount, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                                / {targetReps}
                            </Text>
                        )}
                    </Animated.View>

                    <View style={styles.tapInstructionContainer}>
                        <View style={[styles.tapIconCircle, { backgroundColor: hexToRgba(colors.primary, 0.15) }]}>
                            <Feather name="target" size={24} color={colors.primary} />
                        </View>
                        <Text style={[styles.tapHintPrimary, {
                            color: isDark ? colors.dark.textPrimary : colors.light.textPrimary,
                        }]}>
                            {t("workout.tapToCount")}
                        </Text>
                        {isAvailable && (
                            <Text style={[styles.tapHintSecondary, {
                                color: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
                            }]}>
                                {t("workout.sensorHint")}
                            </Text>
                        )}
                    </View>
                </Pressable>

                {isMaxSet && (
                    <View style={styles.footer}>
                        <Button onPress={() => finishSet(currentCount)} size="large">
                            {t("common.done")}
                        </Button>
                    </View>
                )}
            </View>

            <PauseOverlay
                isVisible={isPaused}
                onResume={handleResume}
                onQuit={handleQuit}
                isDark={isDark}
            />
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.md,
        paddingHorizontal: spacing.md,
        height: 48,
    },
    headerState: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pauseButton: {
        padding: spacing.sm,
    },
    setInfo: {
        ...typography.h3,
    },
    targetInfo: {
        ...typography.h4,
        fontWeight: "700",
    },
    touchArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
    },
    counterContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    currentCount: {
        fontSize: 140,
        fontWeight: "800",
        fontVariant: ["tabular-nums"],
    },
    targetCount: {
        fontSize: 40,
        fontWeight: "500",
        opacity: 0.6,
    },
    footer: {
        padding: spacing.lg,
    },
    tapInstructionContainer: {
        marginTop: spacing.xl,
        alignItems: 'center',
        gap: spacing.sm,
    },
    tapIconCircle: {
        width: spacing["2xl"],
        height: spacing["2xl"],
        borderRadius: borderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    tapHintPrimary: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    tapHintSecondary: {
        fontSize: 13,
        fontWeight: '400',
        textAlign: 'center',
        opacity: 0.7,
        marginTop: 4,
    },
});
