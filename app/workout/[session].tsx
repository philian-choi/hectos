import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, useColorScheme } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";
import { Proximity } from "expo-sensors";
import { Feather } from "@expo/vector-icons";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence
} from "react-native-reanimated";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { RestTimer } from "@/components/workout/RestTimer";
import { useProgramData } from "@/hooks/useProgramData";
import { useUserStore } from "@/stores/useUserStore";
import { colors, spacing, typography } from "@/constants/theme";

export default function WorkoutSessionScreen() {
    const { session } = useLocalSearchParams();
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { todayWorkout, restTime } = useProgramData();
    const { completeSession, vibrationEnabled, soundEnabled, autoCountEnabled } = useUserStore();

    // Sensor Logic (Auto Count)
    const isDown = useRef(false);
    const [isProximityAvailable, setIsProximityAvailable] = useState(false);

    useEffect(() => {
        Proximity.isAvailableAsync().then(setIsProximityAvailable);
    }, []);

    useEffect(() => {
        if (autoCountEnabled && isProximityAvailable && !isResting && !isSessionComplete) {
            const subscription = Proximity.addListener(({ isNear }) => {
                // isNear: Object is close (screen off distance usually ~5cm)
                if (isNear && !isDown.current) {
                    isDown.current = true;
                    if (vibrationEnabled) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Feedback for "Down"
                    }
                } else if (!isNear && isDown.current) {
                    isDown.current = false;
                    handleTap(); // Count up on "Up"
                }
            });
            return () => subscription.remove();
        }
    }, [autoCountEnabled, isProximityAvailable, isResting, isSessionComplete]);

    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentCount, setCurrentCount] = useState(0);
    const [isResting, setIsResting] = useState(false);
    const [completedReps, setCompletedReps] = useState<number[]>([]);
    const [isSessionComplete, setIsSessionComplete] = useState(false);

    // Animation values
    const scale = useSharedValue(1);
    const bgOpacity = useSharedValue(0);

    // Validate session data
    if (!todayWorkout) {
        return (
            <SafeScreen>
                <View style={styles.center}>
                    <Text>Error: No workout data found</Text>
                    <Button onPress={() => router.back()}>Go Back</Button>
                </View>
            </SafeScreen>
        );
    }

    const targetReps = todayWorkout.sets[currentSetIndex];
    const isMaxSet = todayWorkout.lastSetMax && currentSetIndex === todayWorkout.sets.length - 1;
    const totalSets = todayWorkout.sets.length;



    const handleTap = () => {
        // Prevent counting during rest or completion
        if (isResting || isSessionComplete) return;

        // Feedback
        if (vibrationEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Animation
        scale.value = withSequence(
            withSpring(1.1, { damping: 10 }),
            withSpring(1)
        );

        const newCount = currentCount + 1;
        setCurrentCount(newCount);

        // Check for set completion (unless it's a max set)
        if (!isMaxSet && newCount >= targetReps) {
            // Optional: Auto-finish set or let user continue?
            // For now, let's auto-finish after a brief delay if exact match
            // But usually users might do more. Let's provide a "Done" button or auto-trigger rest.
            // Decision: UX spec says "Target Count". Let's wait for user to hit "Done" or max out?
            // UX Spec says: "Goal met -> Auto rest screen transition"
            finishSet(newCount);
        }
    };

    const finishSet = (finalCount: number) => {
        // Save reps
        const newCompletedReps = [...completedReps, finalCount];
        setCompletedReps(newCompletedReps);

        if (currentSetIndex < totalSets - 1) {
            // Go to rest
            setIsResting(true);
            setCurrentCount(0); // Reset for next set strictly speaking, but wait for rest to finish
        } else {
            // Finish Session
            handleSessionComplete(newCompletedReps);
        }
    };

    const handleRestComplete = () => {
        setIsResting(false);
        setCurrentSetIndex((prev) => prev + 1);
        setCurrentCount(0);
    };

    const handleSessionComplete = (reps: number[]) => {
        setIsSessionComplete(true);
        const total = reps.reduce((a, b) => a + b, 0);
        completeSession(total);
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
        const total = completedReps.reduce((a, b) => a + b, 0);
        return (
            <SafeScreen>
                <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />
                <View style={styles.completeContainer}>
                    <Feather name="award" size={80} color={colors.primary} style={{ marginBottom: spacing.lg }} />
                    <Text style={[styles.title, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}>
                        {t("workout.complete.title")}
                    </Text>
                    <View style={styles.statsContainer}>
                        <Text style={[styles.statValue, { color: colors.primary }]}>{total}</Text>
                        <Text style={[styles.statLabel, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                            {t("workout.complete.totalPushups", { count: total })}
                        </Text>
                    </View>
                    <Button onPress={handleGoHome} size="large">
                        {t("workout.complete.goHome")}
                    </Button>
                </View>
            </SafeScreen>
        );
    }

    // 2. Rest Timer View
    if (isResting) {
        return (
            <SafeScreen>
                <RestTimer
                    duration={restTime}
                    onComplete={handleRestComplete}
                    onSkip={handleRestComplete}
                />
            </SafeScreen>
        );
    }

    // 3. Main Workout View
    return (
        <SafeScreen edges={["top", "bottom"]}>
            <View style={styles.container}>
                {/* Auto Count Indicator */}
                {autoCountEnabled && isProximityAvailable && !isResting && !isSessionComplete && (
                    <View style={styles.sensorIndicator}>
                        <Feather name="wifi" size={14} color={colors.primary} />
                        <Text style={[styles.sensorText, { color: colors.primary }]}>Auto Count</Text>
                    </View>
                )}

                {/* Header Information */}
                <View style={styles.header}>
                    <Text style={[styles.setInfo, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                        {t("workout.set", { current: currentSetIndex + 1, total: totalSets })}
                    </Text>
                    <Text style={[styles.targetInfo, { color: colors.primary }]}>
                        {isMaxSet ? t("workout.max") : t("workout.target", { count: targetReps })}
                    </Text>
                </View>

                {/* Touch Area */}
                <Pressable
                    style={styles.touchArea}
                    onPress={handleTap}
                >
                    <Animated.View style={[styles.counterContainer, counterStyle]}>
                        <Text
                            style={[styles.currentCount, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}
                            adjustsFontSizeToFit
                            numberOfLines={1}
                        >
                            {currentCount}
                        </Text>
                        {!isMaxSet && (
                            <Text style={[styles.targetCount, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                                / {targetReps}
                            </Text>
                        )}
                    </Animated.View>
                    <Text style={styles.tapHint}>
                        {autoCountEnabled && isProximityAvailable
                            ? t("workout.hint.sensor")
                            : t("workout.tapToCount")}
                    </Text>
                </Pressable>

                {/* Manual Finish Button (Useful for Max sets or early finish) */}
                {isMaxSet && (
                    <View style={styles.footer}>
                        <Button onPress={() => finishSet(currentCount)} size="large">
                            {t("common.done")}
                        </Button>
                    </View>
                )}
            </View>
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
        padding: spacing.lg,
        alignItems: "center",
    },
    setInfo: {
        ...typography.h3,
        marginBottom: spacing.xs,
    },
    targetInfo: {
        ...typography.h2,
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
    tapHint: {
        marginTop: spacing.xl,
        opacity: 0.5,
    },
    footer: {
        padding: spacing.lg,
    },
    sensorIndicator: {
        position: 'absolute',
        top: spacing.lg,
        right: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        zIndex: 10,
    },
    sensorText: {
        fontSize: 11,
        fontWeight: '600',
    },
    // Complete Screen
    completeContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.xl,
    },
    emoji: {
        fontSize: 80,
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.xl,
        textAlign: "center",
    },
    statsContainer: {
        marginBottom: spacing.xl * 2,
        alignItems: "center",
    },
    statValue: {
        fontSize: 60,
        fontWeight: "800",
    },
    statLabel: {
        ...typography.h3,
    },
});
