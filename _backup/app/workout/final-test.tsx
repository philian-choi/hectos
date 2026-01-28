import { useState, useEffect, useRef } from "react";
import { View, Pressable, useColorScheme, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withSequence,
    withTiming,
    FadeIn,
    FadeInDown,
    FadeInUp,
    runOnJS,
} from "react-native-reanimated";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Text } from "@/components/ui/text";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useUserStore } from "@/stores/useUserStore";
import { colors } from "@/constants/theme";
import { useFaceDetector } from "@/hooks/useFaceDetector";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * Final Test Screen - The 100 Pushup Challenge
 * 
 * This is the ultimate test after completing the 6-week program.
 * Users attempt to do 100 consecutive pushups in a single set.
 * 
 * Features:
 * - Large countdown/count display
 * - Milestone celebrations (25, 50, 75, 100)
 * - Confetti on reaching 100
 * - Personal best tracking
 * - Motivational messages
 */
export default function FinalTestScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const {
        addFinalTestResult,
        personalBest,
        finalTestResults,
        vibrationEnabled,
        autoCountEnabled,
    } = useUserStore();

    const [count, setCount] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [milestone, setMilestone] = useState<number | null>(null);

    // Animation values
    const scale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.3);
    const progressWidth = useSharedValue(0);

    // Face detector for auto-counting
    const { isAvailable, isDown, FaceCountCamera, permission, requestPermission } = useFaceDetector({
        enabled: autoCountEnabled && isActive,
        vibrationEnabled,
        onUp: () => {
            handleCount();
        },
    });

    useEffect(() => {
        if (autoCountEnabled && isActive && !permission) {
            requestPermission();
        }
    }, [autoCountEnabled, isActive, permission]);

    // Milestone messages
    const milestoneMessages: { [key: number]: { ko: string; en: string } } = {
        25: { ko: "25개 달성", en: "25 reps achieved" },
        50: { ko: "50개 돌파", en: "50 reps achieved" },
        75: { ko: "75개 돌파", en: "75 reps achieved" },
        100: { ko: "100개 성공", en: "100 Reps Achieved" },
    };

    // Progress animation
    useEffect(() => {
        progressWidth.value = withTiming((count / 100) * 100, { duration: 300 });
    }, [count]);

    // Check for milestones
    useEffect(() => {
        if ([25, 50, 75, 100].includes(count)) {
            setMilestone(count);

            if (vibrationEnabled) {
                Haptics.notificationAsync(
                    count === 100
                        ? Haptics.NotificationFeedbackType.Success
                        : Haptics.NotificationFeedbackType.Warning
                );
            }

            // Clear milestone after 2 seconds
            setTimeout(() => setMilestone(null), 2500);
        }
    }, [count]);

    const handleCount = () => {
        if (vibrationEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        scale.value = withSequence(
            withSpring(1.15, { damping: 8 }),
            withSpring(1, { damping: 10 })
        );

        setCount((prev) => prev + 1);
        setIsActive(true);
    };

    const handleDone = () => {
        addFinalTestResult(count);
        router.replace("/workout/final-result");
    };

    const animatedScale = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const progressAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    const attemptNumber = finalTestResults.length + 1;
    const isNewRecord = count > personalBest;

    return (
        <SafeScreen edges={["top", "bottom"]}>
            {/* Background Gradient */}
            <LinearGradient
                colors={
                    isDark
                        ? ["#0a0a0a", "#1a0a1a", "#0a1a1a"]
                        : ["#fefce8", "#fef3c7", "#ecfdf5"]
                }
                style={{ position: "absolute", inset: 0 }}
            />

            {/* Removed FloatingParticles */}
            {/* Removed Confetti */}

            {/* 카메라 프리뷰 */}
            {autoCountEnabled && isActive && (
                <View
                    style={{
                        position: 'absolute',
                        top: 60,
                        right: 20,
                        width: 100,
                        height: 130,
                        borderRadius: 12,
                        overflow: 'hidden',
                        borderWidth: 1,
                        borderColor: hasFace ? '#10B981' : 'rgba(255,255,255,0.3)',
                        zIndex: 50,
                        backgroundColor: '#000'
                    }}
                >
                    <FaceCountCamera style={{ flex: 1 }} />
                </View>
            )}

            <View className="flex-1 px-6 pt-4 pb-6">
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.duration(600)}
                    className="items-center mb-4"
                >
                    <View className="flex-row items-center gap-2 mb-2">
                        <LinearGradient
                            colors={["#FFB800", "#FF8C00"]}
                            style={{
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderRadius: 20,
                            }}
                        >
                            <Text className="text-xs font-bold text-black">
                                {t("finalTest.attempt", { number: attemptNumber })}
                            </Text>
                        </LinearGradient>
                    </View>

                    <Text className="text-2xl font-bold text-foreground text-center">
                        {t("finalTest.title")}
                    </Text>
                    <Text className="text-sm text-muted-foreground text-center mt-1">
                        {t("finalTest.subtitle")}
                    </Text>
                </Animated.View>

                {/* Progress Bar to 100 */}
                <Animated.View entering={FadeIn.delay(200)} className="mb-4">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-xs font-medium text-muted-foreground">
                            {t("finalTest.progressTo100")}
                        </Text>
                        <Text className="text-xs font-bold text-primary">
                            {count}/100
                        </Text>
                    </View>
                    <View
                        className="h-3 rounded-full overflow-hidden"
                        style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
                    >
                        <Animated.View style={progressAnimatedStyle}>
                            <LinearGradient
                                colors={
                                    count >= 100
                                        ? ["#10B981", "#059669"]
                                        : ["#FFB800", "#FF8C00"]
                                }
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ height: "100%", borderRadius: 999 }}
                            />
                        </Animated.View>
                    </View>

                    {/* Milestone markers */}
                    <View className="flex-row justify-between mt-1 px-1">
                        {[0, 25, 50, 75, 100].map((m) => (
                            <Text
                                key={m}
                                className={`text-[10px] ${count >= m ? "text-primary font-bold" : "text-muted-foreground"}`}
                            >
                                {m}
                            </Text>
                        ))}
                    </View>
                </Animated.View>

                {/* Main Counter Area */}
                <Pressable
                    className="flex-1 justify-center items-center"
                    onPress={handleCount}
                >
                    <Animated.View style={animatedScale} className="items-center">
                        {/* Count Display */}
                        <Text
                            style={{
                                fontSize: 160,
                                fontWeight: "900",
                                color: count >= 100
                                    ? "#10B981"
                                    : isNewRecord
                                        ? colors.primary
                                        : isDark ? "#fff" : "#1a1a1a",
                                fontVariant: ["tabular-nums"],
                                lineHeight: 180,
                            }}
                        >
                            {count}
                        </Text>

                        {/* New Record Badge */}
                        {isNewRecord && count > 0 && (
                            <Animated.View
                                entering={FadeIn}
                                className="flex-row items-center gap-1 mt-2"
                            >
                                <Feather name="trending-up" size={16} color="#10B981" />
                                <Text className="text-sm font-bold text-emerald-500">
                                    {t("finalTest.newRecord")}
                                </Text>
                            </Animated.View>
                        )}

                        {/* Personal Best Info */}
                        <Text className="text-sm text-muted-foreground mt-2">
                            {t("finalTest.personalBest")}: {personalBest}
                        </Text>
                    </Animated.View>
                </Pressable>

                {/* Milestone Toast */}
                {milestone && (
                    <Animated.View
                        entering={FadeInUp.springify()}
                        className="absolute top-1/3 left-6 right-6"
                    >
                        <GlassCard intensity={80} tint={isDark ? "dark" : "light"}>
                            <View className="items-center py-4">
                                <Text className="text-3xl font-black text-center" style={{ color: colors.primary }}>
                                    {milestone}
                                </Text>
                                <Text className="text-base font-semibold text-center text-foreground mt-2">
                                    {milestoneMessages[milestone][useUserStore.getState().language === "ko" ? "ko" : "en"]}
                                </Text>
                            </View>
                        </GlassCard>
                    </Animated.View>
                )}

                {/* Bottom Section */}
                <View className="gap-4">
                    {/* Sensor Status */}
                    {autoCountEnabled && isAvailable && (
                        <View className="flex-row items-center justify-center gap-2">
                            <View className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <Text className="text-xs text-emerald-500 font-medium">
                                {t("workout.sensorActive", { lux: "---" })}
                            </Text>
                        </View>
                    )}

                    {/* Instructions */}
                    <Text className="text-center text-sm text-muted-foreground">
                        {isActive
                            ? t("finalTest.keepGoing")
                            : t("finalTest.tapToStart")}
                    </Text>

                    {/* Done Button */}
                    <GlowButton
                        onPress={handleDone}
                        title={count >= 100 ? t("finalTest.celebrate") : t("finalTest.imDone")}
                        subtitle={count >= 100 ? t("finalTest.youDidIt") : `${count}${t("finalTest.repsRecorded")}`}
                        variant={count >= 100 ? "success" : "primary"}
                        size="lg"
                        glow={count >= 100}
                    />
                </View>
            </View>
        </SafeScreen>
    );
}
