import { View, useColorScheme, Share, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import ConfettiCannon from "react-native-confetti-cannon";
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
} from "react-native-reanimated";
import { useEffect, useRef } from "react";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Text } from "@/components/ui/text";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { useUserStore } from "@/stores/useUserStore";
import { colors } from "@/constants/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/**
 * Final Test Result Screen
 * 
 * Shows the result of the 100 pushup challenge attempt
 * with celebration effects for success and encouragement for retries.
 */
export default function FinalResultScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const confettiRef = useRef<ConfettiCannon | null>(null);

    const {
        finalTestResults,
        personalBest,
        hasReached100,
        initialTestResult,
        vibrationEnabled,
    } = useUserStore();

    // Get the latest result
    const latestResult = finalTestResults[finalTestResults.length - 1];
    const result = latestResult?.result || 0;
    const attemptNumber = latestResult?.attempts || 1;
    const isSuccess = result >= 100;
    const isNewRecord = result === personalBest && result > 0;

    // Animation values
    const celebrationScale = useSharedValue(1);
    const glowOpacity = useSharedValue(0.5);

    useEffect(() => {
        if (isSuccess) {
            // Success haptic feedback
            if (vibrationEnabled) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

            // Celebration animation
            celebrationScale.value = withDelay(
                500,
                withRepeat(
                    withSequence(
                        withTiming(1.1, { duration: 400 }),
                        withTiming(1, { duration: 400 })
                    ),
                    3,
                    true
                )
            );

            // Start confetti
            setTimeout(() => {
                confettiRef.current?.start();
            }, 300);
        }

        // Glow animation
        glowOpacity.value = withRepeat(
            withSequence(
                withTiming(0.8, { duration: 1000 }),
                withTiming(0.4, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const celebrationAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: celebrationScale.value }],
    }));

    const handleShare = async () => {
        try {
            await Share.share({
                message: isSuccess
                    ? t("finalTest.shareSuccess", { count: result })
                    : t("finalTest.shareProgress", { count: result }),
            });
        } catch (error) {
            console.log("Share failed:", error);
        }
    };

    const handleRetry = () => {
        router.replace("/workout/final-test");
    };

    const handleGoHome = () => {
        router.replace("/(tabs)");
    };

    // Calculate improvement from initial test
    const improvement = result - initialTestResult;
    const improvementMultiple = initialTestResult > 0
        ? (result / initialTestResult).toFixed(1)
        : "∞";

    return (
        <SafeScreen>
            {/* Background Gradient */}
            <LinearGradient
                colors={
                    isSuccess
                        ? isDark
                            ? ["#0a0a0a", "#0a1a0a", "#001a10"]
                            : ["#ecfdf5", "#d1fae5", "#a7f3d0"]
                        : isDark
                            ? ["#0a0a0a", "#1a0f00", "#1a1a2e"]
                            : ["#fffbeb", "#fef3c7", "#fffde7"]
                }
                style={{ position: "absolute", inset: 0 }}
            />

            {/* Floating Particles */}
            <FloatingParticles
                count={15}
                colors={
                    isSuccess
                        ? ["#10B981", "#059669", "#34D399", "#6EE7B7"]
                        : ["#FFB800", "#10B981", "#FCD34D", "#059669"]
                }
                minSize={3}
                maxSize={8}
            />

            {/* Confetti for success */}
            {isSuccess && (
                <ConfettiCannon
                    ref={confettiRef}
                    count={300}
                    origin={{ x: SCREEN_WIDTH / 2, y: -20 }}
                    autoStart={false}
                    fadeOut={true}
                    explosionSpeed={400}
                    fallSpeed={3000}
                    colors={["#10B981", "#FFB800", "#3B82F6", "#8B5CF6", "#EC4899", "#F43F5E"]}
                />
            )}

            <View className="flex-1 px-6 pt-8 pb-6">
                {/* Result Badge */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(800).springify()}
                    style={celebrationAnimatedStyle}
                    className="items-center mb-6"
                >
                    <LinearGradient
                        colors={
                            isSuccess
                                ? ["#10B981", "#059669"]
                                : ["#FFB800", "#FF8C00"]
                        }
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: isSuccess ? "#10B981" : "#FFB800",
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.5,
                            shadowRadius: 24,
                            elevation: 12,
                            borderWidth: 4,
                            borderColor: "rgba(255,255,255,0.3)",
                        }}
                    >
                        {isSuccess ? (
                            <Text style={{ fontSize: 60 }}>🏆</Text>
                        ) : (
                            <Text style={{ fontSize: 60 }}>💪</Text>
                        )}
                    </LinearGradient>
                </Animated.View>

                {/* Title */}
                <Animated.View
                    entering={FadeInDown.delay(400).duration(600)}
                    className="items-center mb-6"
                >
                    <Text className="text-3xl font-black text-center text-foreground">
                        {isSuccess ? t("finalTest.successTitle") : t("finalTest.resultTitle")}
                    </Text>
                    <Text className="text-base text-muted-foreground text-center mt-2">
                        {isSuccess
                            ? t("finalTest.successSubtitle")
                            : t("finalTest.resultSubtitle", { remaining: 100 - result })}
                    </Text>
                </Animated.View>

                {/* Result Display */}
                <Animated.View
                    entering={FadeInUp.delay(600).duration(800)}
                    className="flex-1"
                >
                    <GlassCard
                        intensity={isDark ? 40 : 60}
                        tint={isDark ? "dark" : "light"}
                        style={{
                            borderColor: isSuccess
                                ? "rgba(16, 185, 129, 0.3)"
                                : "rgba(255, 184, 0, 0.3)",
                        }}
                    >
                        {/* Main Result */}
                        <View className="items-center mb-6">
                            <Text
                                style={{
                                    fontSize: 80,
                                    fontWeight: "900",
                                    color: isSuccess ? "#10B981" : colors.primary,
                                    fontVariant: ["tabular-nums"],
                                }}
                            >
                                {result}
                            </Text>
                            <Text className="text-sm font-semibold text-muted-foreground">
                                {t("finalTest.pushups")}
                            </Text>

                            {isNewRecord && (
                                <View className="flex-row items-center gap-1 mt-2 px-3 py-1 rounded-full bg-emerald-500/20">
                                    <Feather name="award" size={14} color="#10B981" />
                                    <Text className="text-xs font-bold text-emerald-500">
                                        {t("finalTest.newPersonalBest")}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Stats Grid */}
                        <View className="flex-row gap-4">
                            {/* Attempt */}
                            <View className="flex-1 items-center p-4 rounded-xl bg-background/50">
                                <Feather name="repeat" size={20} color={colors.primary} />
                                <Text className="text-2xl font-bold text-foreground mt-1">
                                    {attemptNumber}
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    {t("finalTest.attempt", { number: "" }).trim()}
                                </Text>
                            </View>

                            {/* Improvement */}
                            <View className="flex-1 items-center p-4 rounded-xl bg-background/50">
                                <Feather name="trending-up" size={20} color="#10B981" />
                                <Text className="text-2xl font-bold text-foreground mt-1">
                                    +{improvement}
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    {t("finalTest.fromStart")}
                                </Text>
                            </View>

                            {/* Multiplier */}
                            <View className="flex-1 items-center p-4 rounded-xl bg-background/50">
                                <Feather name="zap" size={20} color="#8B5CF6" />
                                <Text className="text-2xl font-bold text-foreground mt-1">
                                    {improvementMultiple}x
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    {t("finalTest.growth")}
                                </Text>
                            </View>
                        </View>

                        {/* Journey Summary */}
                        <View className="mt-6 p-4 rounded-xl" style={{ backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}>
                            <View className="flex-row items-center justify-between">
                                <View className="items-center">
                                    <Text className="text-sm text-muted-foreground">{t("finalTest.started")}</Text>
                                    <Text className="text-xl font-bold text-foreground">{initialTestResult}</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <View className="w-8 h-0.5 bg-muted-foreground/30" />
                                    <Feather name="arrow-right" size={16} color={colors.primary} />
                                    <View className="w-8 h-0.5 bg-muted-foreground/30" />
                                </View>
                                <View className="items-center">
                                    <Text className="text-sm text-muted-foreground">{t("finalTest.now")}</Text>
                                    <Text className="text-xl font-bold" style={{ color: isSuccess ? "#10B981" : colors.primary }}>
                                        {result}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </GlassCard>
                </Animated.View>

                {/* Action Buttons */}
                <Animated.View
                    entering={FadeInUp.delay(800).duration(600)}
                    className="gap-3 mt-6"
                >
                    {isSuccess ? (
                        <>
                            <GlowButton
                                onPress={handleShare}
                                title={t("finalTest.shareVictory")}
                                subtitle={t("finalTest.tellTheWorld")}
                                variant="success"
                                size="lg"
                                glow={true}
                                icon="share-2"
                            />
                            <GlowButton
                                onPress={handleGoHome}
                                title={t("finalTest.goHome")}
                                variant="secondary"
                                size="md"
                            />
                        </>
                    ) : (
                        <>
                            <GlowButton
                                onPress={handleRetry}
                                title={t("finalTest.tryAgain")}
                                subtitle={t("finalTest.youCanDoIt")}
                                variant="primary"
                                size="lg"
                                glow={true}
                            />
                            <View className="flex-row gap-3">
                                <View className="flex-1">
                                    <GlowButton
                                        onPress={handleShare}
                                        title={t("workout.complete.share")}
                                        variant="secondary"
                                        size="md"
                                        icon="share-2"
                                    />
                                </View>
                                <View className="flex-1">
                                    <GlowButton
                                        onPress={handleGoHome}
                                        title={t("workout.complete.goHome")}
                                        variant="secondary"
                                        size="md"
                                    />
                                </View>
                            </View>
                        </>
                    )}
                </Animated.View>
            </View>
        </SafeScreen>
    );
}
