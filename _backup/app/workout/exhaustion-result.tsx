import { useState, useEffect } from "react";
import { View, useColorScheme, Modal, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, {
    FadeInDown,
    FadeInUp,
    SlideInUp,
} from "react-native-reanimated";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Text } from "@/components/ui/text";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import { useUserStore, getWeeklyTarget, analyzePerformance } from "@/stores/useUserStore";
import { colors } from "@/constants/theme";

/**
 * Exhaustion Test Result Screen
 * 
 * Shows:
 * - Result vs Weekly Target
 * - Personal Best update
 * - Week Repeat recommendation (if <70%)
 */
export default function ExhaustionResultScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const {
        exhaustionTests,
        currentWeek,
        currentColumn,
        personalBest,
        shouldRepeatWeek,
        setShouldRepeatWeek,
        confirmRepeatWeek,
        vibrationEnabled,
    } = useUserStore();

    // Get latest test result
    const latestTest = exhaustionTests[exhaustionTests.length - 1];
    const result = latestTest?.result || 0;
    const weekTarget = getWeeklyTarget(currentWeek, currentColumn);
    const { percentage } = analyzePerformance(result, weekTarget);

    const isNewRecord = result === personalBest && result > 0;
    const isGoodPerformance = percentage >= 70;

    const [showRepeatModal, setShowRepeatModal] = useState(false);

    useEffect(() => {
        if (shouldRepeatWeek) {
            // Delay modal to let user see results first
            const timer = setTimeout(() => {
                setShowRepeatModal(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [shouldRepeatWeek]);

    useEffect(() => {
        if (isNewRecord && vibrationEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, []);

    const handleContinue = () => {
        setShouldRepeatWeek(false);
        router.replace("/(tabs)/progress");
    };

    const handleRepeat = () => {
        confirmRepeatWeek();
        setShowRepeatModal(false);
        router.replace("/(tabs)");
    };

    const handleSkipRepeat = () => {
        setShouldRepeatWeek(false);
        setShowRepeatModal(false);
        router.replace("/(tabs)/progress");
    };

    return (
        <SafeScreen>
            <LinearGradient
                colors={
                    isGoodPerformance
                        ? isDark ? ["#0a0a0a", "#0a1a0a"] : ["#ecfdf5", "#d1fae5"]
                        : isDark ? ["#0a0a0a", "#1a1a0a"] : ["#fffbeb", "#fef3c7"]
                }
                style={{ position: "absolute", inset: 0 }}
            />

            <FloatingParticles
                count={10}
                colors={isGoodPerformance ? ["#10B981", "#059669"] : ["#FFB800", "#FF8C00"]}
                minSize={2}
                maxSize={6}
            />

            <View className="flex-1 px-6 pt-8 pb-6">
                {/* Header */}
                <Animated.View
                    entering={FadeInDown.delay(200)}
                    className="items-center mb-6"
                >
                    <LinearGradient
                        colors={isGoodPerformance ? ["#10B981", "#059669"] : ["#FFB800", "#FF8C00"]}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: isGoodPerformance ? "#10B981" : "#FFB800",
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.4,
                            shadowRadius: 16,
                        }}
                    >
                        {isGoodPerformance ? (
                            <Text style={{ fontSize: 44 }}>💪</Text>
                        ) : (
                            <Text style={{ fontSize: 44 }}>🌱</Text>
                        )}
                    </LinearGradient>
                </Animated.View>

                {/* Title */}
                <Animated.View
                    entering={FadeInDown.delay(300)}
                    className="items-center mb-6"
                >
                    <Text className="text-2xl font-black text-center text-foreground">
                        {t("progress.exhaustionTest")} {t("common.done")}
                    </Text>
                    <Text className="text-sm text-muted-foreground text-center mt-1">
                        {t("progress.week", { week: currentWeek })}
                    </Text>
                </Animated.View>

                {/* Result Card */}
                <Animated.View entering={FadeInUp.delay(400)} className="flex-1">
                    <GlassCard intensity={isDark ? 40 : 60} tint={isDark ? "dark" : "light"}>
                        {/* Main Result */}
                        <View className="items-center mb-6">
                            <Text
                                style={{
                                    fontSize: 72,
                                    fontWeight: "900",
                                    color: isGoodPerformance ? "#10B981" : colors.primary,
                                    fontVariant: ["tabular-nums"],
                                }}
                            >
                                {result}
                            </Text>
                            <Text className="text-sm text-muted-foreground">
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
                        <View className="flex-row gap-4 mb-6">
                            <View className="flex-1 items-center p-4 rounded-xl bg-background/50">
                                <Feather name="target" size={20} color={colors.primary} />
                                <Text className="text-2xl font-bold text-foreground mt-1">
                                    {weekTarget}
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    {t("finalTest.weeklyGoal")}
                                </Text>
                            </View>

                            <View className="flex-1 items-center p-4 rounded-xl bg-background/50">
                                <Feather
                                    name={percentage >= 100 ? "check-circle" : "percent"}
                                    size={20}
                                    color={isGoodPerformance ? "#10B981" : "#FFB800"}
                                />
                                <Text
                                    className="text-2xl font-bold mt-1"
                                    style={{ color: isGoodPerformance ? "#10B981" : colors.primary }}
                                >
                                    {percentage}%
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    {t("microChallenge.achieved")}
                                </Text>
                            </View>
                        </View>

                        {/* Feedback Message */}
                        <View
                            className="p-4 rounded-xl"
                            style={{
                                backgroundColor: isGoodPerformance
                                    ? "rgba(16, 185, 129, 0.1)"
                                    : "rgba(255, 184, 0, 0.1)"
                            }}
                        >
                            <Text className="text-sm text-center font-medium text-foreground">
                                {isGoodPerformance
                                    ? t("encouragement.awesome") + " " + t("progress.ongoingMessage")
                                    : t("encouragement.goodEffort")}
                            </Text>
                        </View>
                    </GlassCard>
                </Animated.View>

                {/* CTA */}
                <Animated.View entering={FadeInUp.delay(600)} className="mt-6">
                    <GlowButton
                        onPress={handleContinue}
                        title={t("common.done")}
                        variant={isGoodPerformance ? "success" : "primary"}
                        size="lg"
                        glow={isGoodPerformance}
                    />
                </Animated.View>
            </View>

            {/* Week Repeat Modal */}
            <Modal
                visible={showRepeatModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowRepeatModal(false)}
            >
                <Pressable
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                    onPress={() => { }}
                >
                    <Animated.View
                        entering={SlideInUp.springify()}
                        style={{ width: 320, borderRadius: 28, overflow: "hidden" }}
                    >
                        <BlurView
                            intensity={isDark ? 60 : 80}
                            tint={isDark ? "dark" : "light"}
                            style={{ padding: 24 }}
                        >
                            <View className="items-center mb-4">
                                <LinearGradient
                                    colors={["#3B82F6", "#2563EB"]}
                                    style={{
                                        width: 72,
                                        height: 72,
                                        borderRadius: 36,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 36 }}>🌱</Text>
                                </LinearGradient>
                            </View>

                            <Text className="text-xl font-black text-foreground text-center mb-2">
                                {t("weekRepeat.title")}
                            </Text>

                            <Text className="text-sm text-muted-foreground text-center mb-6 leading-5">
                                {t("weekRepeat.message", { result, target: weekTarget, percentage })}
                            </Text>

                            <View className="gap-3">
                                <GlowButton
                                    onPress={handleRepeat}
                                    title={t("weekRepeat.repeat")}
                                    variant="primary"
                                    size="md"
                                    glow={false}
                                />
                                <Pressable onPress={handleSkipRepeat} className="py-3">
                                    <Text className="text-center text-sm text-muted-foreground font-medium">
                                        {t("weekRepeat.continue")}
                                    </Text>
                                </Pressable>
                            </View>
                        </BlurView>
                    </Animated.View>
                </Pressable>
            </Modal>
        </SafeScreen>
    );
}
