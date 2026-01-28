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
    withTiming,
    withSequence,
    Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Text } from "@/components/ui/text";
import { GlowButton } from "@/components/ui/GlowButton";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { colors } from "@/constants/theme";

/**
 * Premium Welcome Screen
 * 
 * Features:
 * - Floating particles background
 * - Animated pulsing icon with glow
 * - Staggered text animations
 * - Premium GlowButton CTA
 * - Gradient overlays
 */
export default function WelcomeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    // Pulsing animation for the icon
    const iconScale = useSharedValue(1);
    const iconGlow = useSharedValue(0.3);

    useEffect(() => {
        iconScale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
                withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );

        iconGlow.value = withRepeat(
            withSequence(
                withTiming(0.8, { duration: 1500 }),
                withTiming(0.3, { duration: 1500 })
            ),
            -1,
            true
        );
    }, []);

    const iconAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconScale.value }],
    }));

    const glowAnimatedStyle = useAnimatedStyle(() => ({
        opacity: iconGlow.value,
    }));

    const handleStart = () => {
        router.push("/(auth)/initial-test");
    };

    return (
        <SafeScreen>
            {/* Gradient Background */}
            <LinearGradient
                colors={
                    isDark
                        ? ["#0a0a0a", "#1a1a2e", "#16213e"]
                        : ["#fef9e7", "#fff8e1", "#fffde7"]
                }
                style={{ position: "absolute", inset: 0 }}
            />

            {/* Floating Particles */}
            <FloatingParticles
                count={15}
                colors={["#FFB800", "#FF8C00", "#FCD34D", "#FBBF24"]}
                minSize={3}
                maxSize={8}
            />

            <View className="flex-1 justify-between">
                {/* Hero Section */}
                <View className="flex-1 justify-center items-center px-8">
                    {/* Animated Icon with Glow */}
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(800).springify()}
                        className="mb-10"
                    >
                        {/* Glow Layer */}
                        <Animated.View
                            style={[
                                glowAnimatedStyle,
                                {
                                    position: "absolute",
                                    width: 180,
                                    height: 180,
                                    borderRadius: 90,
                                    backgroundColor: colors.primary,
                                    left: -20,
                                    top: -20,
                                },
                            ]}
                        />

                        {/* Icon Container */}
                        <Animated.View style={iconAnimatedStyle}>
                            <LinearGradient
                                colors={["rgba(255, 184, 0, 0.25)", "rgba(255, 140, 0, 0.1)"]}
                                style={{
                                    width: 140,
                                    height: 140,
                                    borderRadius: 70,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderWidth: 2,
                                    borderColor: "rgba(255, 184, 0, 0.3)",
                                }}
                            >
                                <LinearGradient
                                    colors={["#FFB800", "#FF8C00"]}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 40,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        shadowColor: "#FFB800",
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.5,
                                        shadowRadius: 16,
                                        elevation: 10,
                                    }}
                                >
                                    <Feather name="zap" size={40} color="#1a1a1a" />
                                </LinearGradient>
                            </LinearGradient>
                        </Animated.View>
                    </Animated.View>

                    {/* Title */}
                    <Animated.View entering={FadeInDown.delay(250).duration(800)}>
                        <Text
                            className="text-4xl font-black text-center mb-4 leading-tight"
                            style={{
                                color: isDark ? "#ffffff" : "#1a1a1a",
                                textShadowColor: "rgba(255, 184, 0, 0.3)",
                                textShadowOffset: { width: 0, height: 2 },
                                textShadowRadius: 8,
                            }}
                        >
                            {t("onboarding.welcome.slides.slide1.title")}
                        </Text>
                    </Animated.View>

                    {/* Subtitle */}
                    <Animated.View entering={FadeInDown.delay(400).duration(800)}>
                        <Text className="text-lg text-muted-foreground text-center leading-7 max-w-[320px]">
                            {t("onboarding.welcome.slides.slide1.description")}
                        </Text>
                    </Animated.View>

                    {/* Feature Pills */}
                    <Animated.View
                        entering={FadeInUp.delay(550).duration(800)}
                        className="flex-row flex-wrap justify-center gap-3 mt-10"
                    >
                        <FeaturePill
                            icon="eye"
                            text={t("onboarding.welcome.slides.slide2.title")}
                            isDark={isDark}
                        />
                        <FeaturePill
                            icon="bar-chart-2"
                            text={t("onboarding.welcome.slides.slide3.title")}
                            isDark={isDark}
                        />
                    </Animated.View>
                </View>

                {/* CTA Section */}
                <Animated.View
                    entering={FadeInUp.delay(700).duration(800)}
                    className="px-6 pb-10 gap-4"
                >
                    <GlowButton
                        onPress={handleStart}
                        title={t("onboarding.welcome.start")}
                        variant="primary"
                        size="xl"
                        glow={true}
                    />

                    <Text className="text-sm text-muted-foreground text-center opacity-70">
                        {t("onboarding.testIntro.instruction")}
                    </Text>
                </Animated.View>
            </View>
        </SafeScreen>
    );
}

function FeaturePill({
    icon,
    text,
    isDark,
}: {
    icon: any;
    text: string;
    isDark: boolean;
}) {
    return (
        <View
            className="flex-row items-center gap-2 px-4 py-2.5 rounded-full"
            style={{
                backgroundColor: isDark
                    ? "rgba(255, 184, 0, 0.15)"
                    : "rgba(255, 184, 0, 0.2)",
                borderWidth: 1,
                borderColor: "rgba(255, 184, 0, 0.3)",
            }}
        >
            <Feather name={icon} size={16} color={colors.primary} />
            <Text
                className="text-sm font-semibold"
                style={{ color: isDark ? "#FFB800" : "#c57f00" }}
            >
                {text}
            </Text>
        </View>
    );
}
