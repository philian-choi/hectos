
import { useState, useRef, useEffect } from "react";
import { View, Pressable, useColorScheme } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { RestTimer } from "@/components/workout/RestTimer";
import { PauseOverlay } from "@/components/workout/PauseOverlay";
import { CompletionView } from "@/components/workout/CompletionView";

import { useProgramData } from "@/hooks/useProgramData";
import { useFaceDetector } from "@/hooks/useFaceDetector";
import { useUserStore } from "@/stores/useUserStore";
import { colors } from "@/constants/theme";

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
    const { hasFace, isAvailable, FaceCountCamera, permission, requestPermission } = useFaceDetector({
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
    });

    useEffect(() => {
        if (!isResting && !isSessionComplete && !isPaused && permission === false && requestPermission) {
            requestPermission();
        }
    }, [isResting, isSessionComplete, isPaused, permission]);

    // --- Animation values --- //
    const scale = useSharedValue(1); // Re-added: scale is used for animation

    // --- Validation --- //
    if (!todayWorkout) {
        return (

            <SafeScreen>
                <View className="flex-1 justify-center items-center p-6 gap-6">
                    <Text className="text-xl font-bold text-center text-foreground">
                        {t("workout.error")}
                    </Text>
                    <Button onPress={() => router.back()} size="lg">
                        <Text className="font-bold">{t("workout.goBack")}</Text>
                    </Button>
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
        const targetTotalSum = sets.reduce((a, b) => a + b, 0);
        return (
            <SafeScreen>
                <CompletionView
                    completedReps={completedReps}
                    targetTotal={targetTotalSum}
                    onGoHome={handleGoHome}
                    isDark={isDark}
                    currentDay={currentDay}
                    currentWeek={currentWeek}
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
            {/* Top Bar with Set Progress */}
            <View className="flex-row justify-between items-center px-6 pt-4 h-[60px]">
                <Button variant="ghost" size="icon" onPress={handlePause} className="bg-muted/30 hover:bg-muted/50 w-10 h-10 rounded-full">
                    <Feather name="pause" size={24} color={isDark ? "white" : "black"} />
                </Button>

                <View className="flex-row items-center bg-muted/30 py-1.5 px-3 rounded-full gap-2">
                    <Text className="text-sm font-bold text-muted-foreground tracking-widest">
                        {t("workout.set", { current: currentSetIndex + 1, total: totalSets }).toUpperCase()}
                    </Text>
                    {/* 차세대 AI 카메라 프리뷰 */}
                    {!isResting && !isSessionComplete && (
                        <View style={{ width: 50, height: 66, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: hasFace ? '#10B981' : '#555', backgroundColor: '#000' }}>
                            <FaceCountCamera style={{ flex: 1 }} />
                        </View>
                    )}
                </View>

                {/* Dummy for alignment */}
                <View className="w-10" />
            </View>

            {/* Main Content */}
            <View className="flex-1 justify-center">
                <Pressable
                    className="flex-1 justify-center items-center w-full"
                    onPress={handleTap}
                    accessibilityRole="button"
                    accessibilityLabel={t("workout.tapToCount")}
                    accessibilityHint={t("workout.sensorHint")}
                >
                    {/* Progress Ring Background Effect (Optional) */}
                    <View className="absolute w-[300px] h-[300px] rounded-full border-2 border-primary/5 justify-center items-center pointer-events-none" />

                    <Animated.View style={[counterStyle, { alignItems: 'center', justifyContent: 'center', zIndex: 10 }]}>
                        <Text
                            className="text-foreground font-black tracking-tighter"
                            style={{ fontSize: 160, lineHeight: 160, fontFamily: "Inter_900Black", fontVariant: ["tabular-nums"] }}
                            adjustsFontSizeToFit
                            numberOfLines={1}
                        >
                            {currentCount}
                        </Text>

                        <Badge variant="outline" className="mt-4 px-4 py-1.5 bg-primary/10 border-primary/20 rounded-xl">
                            <Text className="text-primary text-base font-bold">
                                {isMaxSet ? t("workout.maxReps", "MAX REPS") : `/ ${targetReps} ${t("workout.goal", "GOAL")}`}
                            </Text>
                        </Badge>
                    </Animated.View>

                    {/* Instruction Area at Bottom */}
                    <View className="absolute bottom-20 items-center gap-2">
                        <Text className="text-sm font-medium text-muted-foreground">
                            {t("workout.tapToCount")}
                        </Text>
                        {isAvailable && (
                            <View className="flex-row items-center gap-1.5 bg-green-500/10 px-2.5 py-1 rounded-xl">
                                <Feather name="eye" size={12} color={colors.primary} />
                                <Text className="text-xs font-semibold text-green-600 dark:text-green-400">
                                    {t("workout.sensorHint")}
                                </Text>
                            </View>
                        )}
                    </View>
                </Pressable>

                {isMaxSet && (
                    <View className="absolute bottom-10 left-6 right-6">
                        <Button onPress={() => finishSet(currentCount)} size="lg" className="w-full rounded-full">
                            <Text className="font-bold text-lg">{t("common.done")}</Text>
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
        </SafeScreen >
    );
}


