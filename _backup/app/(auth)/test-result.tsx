import { View, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withDelay,
    Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import ConfettiCannon from "react-native-confetti-cannon";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Text } from "@/components/ui/text";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { useUserStore } from "@/stores/useUserStore";
import { useNotifications } from "@/hooks/useNotifications";
import { colors } from "@/constants/theme";

/**
 * Premium Test Result Screen
 * 
 * Features:
 * - Celebration confetti
 * - Animated counter
 * - Gradient badges
 * - Journey visualization
 * - Premium GlowButton CTA
 */
export default function TestResultScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { initialTestResult, currentColumn, setOnboardingComplete } = useUserStore();
    const { registerForPushNotificationsAsync, scheduleDailyReminder } = useNotifications();

    // Animated counter
    const displayCount = useSharedValue(0);
    const countScale = useSharedValue(1);

    useEffect(() => {
        // Animate counter from 0 to actual result
        displayCount.value = withDelay(
            500,
            withTiming(initialTestResult || 0, {
                duration: 1500,
                easing: Easing.out(Easing.exp),
            })
        );

        // Pulse animation for the count
        countScale.value = withDelay(
            2000,
            withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 600 }),
                    withTiming(1, { duration: 600 })
                ),
                -1,
                true
            )
        );
    }, []);

    const countAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: countScale.value }],
    }));

    const handleStart = async () => {
        try {
            await registerForPushNotificationsAsync();
            await scheduleDailyReminder(8, 0);
        } catch (e) {
            console.log("Notification setup failed", e);
        }

        setOnboardingComplete();
        router.replace("/(tabs)");
    };

    const getLevelText = () => {
        switch (currentColumn) {
            case 1:
                return t("onboarding.result.column1");
            case 2:
                return t("onboarding.result.column2");
            case 3:
                return t("onboarding.result.column3");
            default:
                return t("onboarding.result.column1");
        }
    };

    const getLevelEmoji = () => {
        switch (currentColumn) {
            case 1:
                return "🌱";
            case 2:
                return "💪";
            case 3:
                return "🔥";
            default:
                return "🌱";
        }
    };

    return (
        <SafeScreen>
            {/* Background Gradient */}
            <LinearGradient
                colors={
                    isDark
                        ? ["#0a0a0a", "#1a0f00", "#1a1a2e"]
                        : ["#fffbeb", "#fef3c7", "#fffde7"]
                }
                style={{ position: "absolute", inset: 0 }}
            />

            {/* Floating Particles */}
            <FloatingParticles
                count={12}
                colors={["#FFB800", "#10B981", "#FCD34D", "#059669"]}
                minSize={3}
                maxSize={8}
            />

            {/* Confetti */}
            <ConfettiCannon
                count={100}
                origin={{ x: -10, y: 0 }}
                autoStart={true}
                fadeOut={true}
                colors={["#FFB800", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899"]}
            />

            <View className="flex-1 px-6 pt-8 pb-6">
                {/* Success Badge */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(800).springify()}
                    className="items-center mb-8"
                >
                    <LinearGradient
                        colors={["#10B981", "#059669"]}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: "#10B981",
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.5,
                            shadowRadius: 24,
                            elevation: 12,
                            borderWidth: 4,
                            borderColor: "rgba(255,255,255,0.2)",
                        }}
                    >
                        <Feather name="check" size={50} color="#FFF" />
                    </LinearGradient>
                </Animated.View>

                {/* Result Display */}
                <Animated.View
                    entering={FadeInDown.delay(400).duration(800)}
                    className="items-center mb-8"
                >
                    <Text className="text-xs font-bold tracking-widest text-primary text-center mb-3 uppercase">
                        {t("onboarding.result.baseline")}
                    </Text>

                    {/* Journey Visualization */}
                    <Animated.View
                        style={countAnimatedStyle}
                        className="flex-row items-center justify-center"
                    >
                        <View className="items-center">
                            <Text
                                style={{
                                    fontSize: 72,
                                    fontWeight: "900",
                                    color: isDark ? "#fff" : "#1a1a1a",
                                    fontVariant: ["tabular-nums"],
                                }}
                            >
                                {initialTestResult}
                            </Text>
                            <Text className="text-sm font-semibold text-muted-foreground -mt-2">
                                NOW
                            </Text>
                        </View>

                        <View className="mx-6">
                            <LinearGradient
                                colors={["#FFB800", "#FF8C00"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{
                                    width: 60,
                                    height: 4,
                                    borderRadius: 2,
                                }}
                            />
                            <Feather
                                name="chevron-right"
                                size={28}
                                color={colors.primary}
                                style={{ position: "absolute", right: -6, top: -12 }}
                            />
                        </View>

                        <View className="items-center">
                            <Text
                                style={{
                                    fontSize: 72,
                                    fontWeight: "900",
                                    color: colors.primary,
                                    fontVariant: ["tabular-nums"],
                                }}
                            >
                                100
                            </Text>
                            <Text className="text-sm font-semibold text-primary -mt-2">
                                GOAL
                            </Text>
                        </View>
                    </Animated.View>
                </Animated.View>

                {/* Recommended Plan Card */}
                <Animated.View
                    entering={FadeInUp.delay(600).duration(800)}
                    className="flex-1"
                >
                    <GlassCard
                        intensity={isDark ? 40 : 60}
                        tint={isDark ? "dark" : "light"}
                        style={{
                            borderColor: isDark
                                ? "rgba(255, 184, 0, 0.2)"
                                : "rgba(255, 184, 0, 0.3)",
                        }}
                    >
                        <View className="flex-row items-center gap-3 mb-4">
                            <LinearGradient
                                colors={["#FFB800", "#FF8C00"]}
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 12,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Feather name="trending-up" size={20} color="#1a1a1a" />
                            </LinearGradient>
                            <Text className="text-xs font-bold tracking-widest text-primary uppercase">
                                {t("onboarding.result.recommendedPlan")}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-3 mb-3">
                            <Text style={{ fontSize: 32 }}>{getLevelEmoji()}</Text>
                            <Text className="text-xl font-bold text-foreground flex-1">
                                {getLevelText()}
                            </Text>
                        </View>

                        <Text className="text-base text-muted-foreground leading-6">
                            {t("onboarding.result.potential")}
                        </Text>

                        {/* Progress Preview */}
                        <View className="flex-row gap-2 mt-5">
                            {[1, 2, 3, 4, 5, 6].map((week) => (
                                <View
                                    key={week}
                                    style={{
                                        flex: 1,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor:
                                            week === 1
                                                ? colors.primary
                                                : isDark
                                                    ? "rgba(255,255,255,0.1)"
                                                    : "rgba(0,0,0,0.08)",
                                    }}
                                />
                            ))}
                        </View>
                        <Text className="text-xs text-muted-foreground text-center mt-2">
                            6 {t("progress.week", { week: "" }).trim()}
                        </Text>
                    </GlassCard>
                </Animated.View>

                {/* CTA */}
                <Animated.View
                    entering={FadeInUp.delay(800).duration(800)}
                    className="mt-6"
                >
                    <GlowButton
                        onPress={handleStart}
                        title={t("onboarding.result.startProgram")}
                        subtitle="6주 후, 100개 달성"
                        variant="success"
                        size="xl"
                        glow={true}
                    />
                </Animated.View>
            </View>
        </SafeScreen>
    );
}
