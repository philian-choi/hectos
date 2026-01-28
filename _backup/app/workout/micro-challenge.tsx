import { useState, useEffect, useRef } from "react";
import { View, Pressable, useColorScheme } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
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
} from "react-native-reanimated";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Text } from "@/components/ui/text";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useUserStore, MICRO_CHALLENGE_TARGETS } from "@/stores/useUserStore";
import { colors } from "@/constants/theme";
import { useFaceDetector } from "@/hooks/useFaceDetector";

/**
 * Micro Challenge Screen
 * 
 * Intermediate milestones before attempting 100:
 * - 50 push-ups challenge
 * - 75 push-ups challenge  
 * - 90 push-ups challenge
 * 
 * This builds confidence and ensures no one is left behind.
 */
export default function MicroChallengeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams<{ target: string }>();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const target = parseInt(params.target || "50", 10);

    const {
        addMicroChallengeResult,
        personalBest,
        vibrationEnabled,
        autoCountEnabled,
    } = useUserStore();

    const [count, setCount] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [milestone, setMilestone] = useState<number | null>(null);

    // Animation values
    const scale = useSharedValue(1);
    const progressWidth = useSharedValue(0);

    // Proximity counter for auto-counting
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

    // Progress animation
    useEffect(() => {
        progressWidth.value = withTiming((count / target) * 100, { duration: 300 });
    }, [count, target]);

    // Check for milestones (25%, 50%, 75%, 100%)
    useEffect(() => {
        const milestonePoints = [
            Math.floor(target * 0.25),
            Math.floor(target * 0.5),
            Math.floor(target * 0.75),
            target,
        ];

        if (milestonePoints.includes(count) && count > 0) {
            setMilestone(count);

            if (vibrationEnabled) {
                Haptics.notificationAsync(
                    count === target
                        ? Haptics.NotificationFeedbackType.Success
                        : Haptics.NotificationFeedbackType.Warning
                );
            }

            // Removed confetti logic

            setTimeout(() => setMilestone(null), 2500);
        }
    }, [count, target]);

    const handleCount = () => {
        if (vibrationEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Toned down animation
        scale.value = withSequence(
            withSpring(1.05, { damping: 15 }), // Reduced scale and increased damping
            withSpring(1, { damping: 15 })
        );

        setCount((prev) => prev + 1);
        setIsActive(true);
    };

    const handleDone = () => {
        addMicroChallengeResult(target, count);
        router.replace({
            pathname: "/workout/micro-result",
            params: { target: target.toString(), result: count.toString() },
        });
    };

    const animatedScale = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const progressAnimatedStyle = useAnimatedStyle(() => ({
        width: `${progressWidth.value}%`,
    }));

    const isSuccess = count >= target;
    const isNewRecord = count > personalBest;

    // Get color based on target
    const getTargetColor = () => {
        if (target === 50) return ["#3B82F6", "#2563EB"]; // Blue
        if (target === 75) return ["#8B5CF6", "#7C3AED"]; // Purple
        return ["#10B981", "#059669"]; // Green for 90
    };

    return (
        <SafeScreen edges={["top", "bottom"]}>
            {/* Background Gradient */}
            <LinearGradient
                colors={
                    isDark
                        ? ["#0a0a0a", "#0a0f1a", "#0a1a1a"]
                        : ["#f0f9ff", "#e0f2fe", "#ecfdf5"]
                }
                style={{ position: "absolute", inset: 0 }}
            />

            {/* Removed FloatingParticles */}
            {/* Removed ConfettiCannon */}

            <View className="flex-1 px-6 pt-4 pb-6">
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.duration(400)} // Reduced duration
                    className="items-center mb-4"
                >
                    <LinearGradient
                        colors={getTargetColor() as any}
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 20,
                            marginBottom: 8,
                        }}
                    >
                        <Text className="text-xs font-bold text-white">
                            {t("microChallenge.step", { target })}
                        </Text>
                    </LinearGradient>

                    <Text className="text-2xl font-bold text-foreground text-center">
                        {t("microChallenge.title", { target })}
                    </Text>
                    <Text className="text-sm text-muted-foreground text-center mt-1">
                        {t("microChallenge.subtitle")}
                    </Text>
                </Animated.View>

                {/* Progress Bar */}
                <Animated.View entering={FadeIn.delay(100)} className="mb-4">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-xs font-medium text-muted-foreground">
                            {t("microChallenge.progress")}
                        </Text>
                        <Text className="text-xs font-bold" style={{ color: getTargetColor()[0] }}>
                            {count}/{target}
                        </Text>
                    </View>
                    <View
                        className="h-3 rounded-full overflow-hidden"
                        style={{ backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
                    >
                        <Animated.View style={progressAnimatedStyle}>
                            <LinearGradient
                                colors={getTargetColor() as any}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ height: "100%", borderRadius: 999 }}
                            />
                        </Animated.View>
                    </View>
                </Animated.View>

                {/* Main Counter */}
                <Pressable
                    className="flex-1 justify-center items-center"
                    onPress={handleCount}
                >
                    <Animated.View style={animatedScale} className="items-center">
                        <Text
                            style={{
                                fontSize: 120, // Slightly reduced font size to prevent truncation
                                fontWeight: "900",
                                color: isSuccess
                                    ? "#10B981"
                                    : isNewRecord
                                        ? getTargetColor()[0]
                                        : isDark ? "#fff" : "#1a1a1a",
                                fontVariant: ["tabular-nums"],
                                lineHeight: 140,
                            }}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                        >
                            {count}
                        </Text>

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
                                <Text className="text-3xl font-black text-center" style={{ color: getTargetColor()[0] }}>
                                    {milestone}
                                </Text>
                                <Text className="text-base font-semibold text-center text-foreground mt-2">
                                    {milestone >= target
                                        ? t("microChallenge.success", { target })
                                        : t("microChallenge.keepGoing")}
                                </Text>
                            </View>
                        </GlassCard>
                    </Animated.View>
                )}

                {/* 카메라 프리뷰 */}
                {autoCountEnabled && isActive && (
                    <View
                        style={{
                            position: 'absolute',
                            top: 20,
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

                {/* Bottom Section */}
                <View className="gap-4">
                    {autoCountEnabled && permission === false && (
                        <Pressable onPress={requestPermission}>
                            <Text className="text-center text-xs text-red-500 font-bold mb-2">
                                {t("onboarding.test.cameraRequired")}
                            </Text>
                        </Pressable>
                    )}

                    <Text className="text-center text-sm text-muted-foreground">
                        {isActive
                            ? t("finalTest.keepGoing")
                            : t("finalTest.tapToStart")}
                    </Text>

                    <GlowButton
                        onPress={handleDone}
                        title={isSuccess ? t("microChallenge.celebrate") : t("finalTest.imDone")}
                        subtitle={`${count}${t("finalTest.repsRecorded")}`}
                        variant={isSuccess ? "success" : "primary"}
                        size="lg"
                        glow={isSuccess}
                    />
                </View>
            </View>
        </SafeScreen>
    );
}
