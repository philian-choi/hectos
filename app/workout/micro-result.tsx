import { Share, View, useColorScheme } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
    FadeInDown,
    FadeInUp,
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withDelay,
} from "react-native-reanimated";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Text } from "@/components/ui/text";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { useUserStore, MICRO_CHALLENGE_TARGETS } from "@/stores/useUserStore";
import { colors } from "@/constants/theme";

/**
 * Micro Challenge Result Screen
 */
export default function MicroResultScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useLocalSearchParams<{ target: string; result: string }>();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const target = parseInt(params.target || "50", 10);
    const result = parseInt(params.result || "0", 10);
    const isSuccess = result >= target;

    const {
        personalBest,
        initialTestResult,
        vibrationEnabled,
        getNextMicroChallenge,
        consecutiveFailures,
    } = useUserStore();

    const nextChallenge = getNextMicroChallenge();
    const celebrationScale = useSharedValue(1);

    useEffect(() => {
        if (isSuccess && vibrationEnabled) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Reduced animation intensity
            celebrationScale.value = withDelay(
                200,
                withSequence(
                    withTiming(1.1, { duration: 300 }),
                    withTiming(1, { duration: 300 })
                )
            );
        }
    }, []);

    const celebrationAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: celebrationScale.value }],
    }));

    const handleShare = async () => {
        try {
            await Share.share({
                message: t("microChallenge.shareMessage", { count: result, target }),
            });
        } catch (error) {
            console.log("Share failed:", error);
        }
    };

    const handleNextChallenge = () => {
        if (nextChallenge) {
            router.replace({
                pathname: "/workout/micro-challenge",
                params: { target: nextChallenge.toString() },
            });
        } else {
            router.replace("/workout/final-test");
        }
    };

    const handleRetry = () => {
        router.replace({
            pathname: "/workout/micro-challenge",
            params: { target: target.toString() },
        });
    };

    const handleGoHome = () => {
        router.replace("/(tabs)");
    };

    // Get color based on target
    const getTargetColor = () => {
        if (target === 50) return ["#3B82F6", "#2563EB"];
        if (target === 75) return ["#8B5CF6", "#7C3AED"];
        return ["#10B981", "#059669"];
    };

    const improvement = result - initialTestResult;

    // Encouragement messages for failures
    const getEncouragementMessage = () => {
        if (consecutiveFailures >= 3) {
            return t("encouragement.keepTrying");
        } else if (consecutiveFailures >= 2) {
            return t("encouragement.almostThere");
        }
        return t("encouragement.goodEffort");
    };

    return (
        <SafeScreen>
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

            {/* Removed FloatingParticles */}
            {/* Removed ConfettiCannon */}

            <View className="flex-1 px-6 pt-8 pb-6">
                {/* Result Badge */}
                <Animated.View
                    entering={FadeInDown.delay(200).springify()}
                    style={celebrationAnimatedStyle}
                    className="items-center mb-6"
                >
                    <LinearGradient
                        colors={isSuccess ? ["#10B981", "#059669"] : getTargetColor() as any}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            justifyContent: "center",
                            alignItems: "center",
                            shadowColor: isSuccess ? "#10B981" : getTargetColor()[0],
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.4,
                            shadowRadius: 20,
                            elevation: 12,
                            borderWidth: 4,
                            borderColor: "rgba(255,255,255,0.3)",
                        }}
                    >
                        {isSuccess ? (
                            <Feather name="award" size={44} color="#FFF" />
                        ) : (
                            <Feather name="trending-up" size={44} color="#FFF" />
                        )}
                    </LinearGradient>
                </Animated.View>

                {/* Title */}
                <Animated.View
                    entering={FadeInDown.delay(400).duration(600)}
                    className="items-center mb-6"
                >
                    <Text className="text-3xl font-black text-center text-foreground">
                        {isSuccess
                            ? t("microChallenge.successTitle", { target })
                            : t("microChallenge.resultTitle")}
                    </Text>
                    <Text className="text-base text-muted-foreground text-center mt-2">
                        {isSuccess
                            ? nextChallenge
                                ? t("microChallenge.nextUp", { target: nextChallenge })
                                : t("microChallenge.readyFor100")
                            : getEncouragementMessage()}
                    </Text>
                </Animated.View>

                {/* Result Card */}
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
                        <View className="items-center mb-6">
                            <Text
                                style={{
                                    fontSize: 72,
                                    fontWeight: "900",
                                    color: isSuccess ? "#10B981" : colors.primary,
                                    fontVariant: ["tabular-nums"],
                                }}
                            >
                                {result}
                            </Text>
                            <Text className="text-sm font-semibold text-muted-foreground">
                                / {target} {t("microChallenge.goal")}
                            </Text>
                        </View>

                        {/* Stats */}
                        <View className="flex-row gap-4">
                            <View className="flex-1 items-center p-4 rounded-xl bg-background/50">
                                <Feather name="target" size={20} color={getTargetColor()[0]} />
                                <Text className="text-2xl font-bold text-foreground mt-1">
                                    {Math.round((result / target) * 100)}%
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    {t("microChallenge.achieved")}
                                </Text>
                            </View>

                            <View className="flex-1 items-center p-4 rounded-xl bg-background/50">
                                <Feather name="trending-up" size={20} color="#10B981" />
                                <Text className="text-2xl font-bold text-foreground mt-1">
                                    +{improvement}
                                </Text>
                                <Text className="text-xs text-muted-foreground">
                                    {t("finalTest.fromStart")}
                                </Text>
                            </View>
                        </View>

                        {/* Progress to 100 */}
                        <View className="mt-6">
                            <Text className="text-xs font-bold text-muted-foreground mb-2 text-center">
                                {t("microChallenge.journeyTo100")}
                            </Text>
                            <View className="flex-row items-center justify-between gap-2">
                                {[50, 75, 90, 100].map((milestone) => (
                                    <View
                                        key={milestone}
                                        className="items-center"
                                    >
                                        <View
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 20,
                                                backgroundColor: personalBest >= milestone
                                                    ? "#10B981"
                                                    : isDark
                                                        ? "rgba(255,255,255,0.1)"
                                                        : "rgba(0,0,0,0.08)",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            {personalBest >= milestone ? (
                                                <Feather name="check" size={20} color="#FFF" />
                                            ) : (
                                                <Text className="text-xs font-bold text-muted-foreground">
                                                    {milestone}
                                                </Text>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </GlassCard>
                </Animated.View>

                {/* Actions */}
                <Animated.View
                    entering={FadeInUp.delay(800).duration(600)}
                    className="gap-3 mt-6"
                >
                    {isSuccess ? (
                        <>
                            <GlowButton
                                onPress={handleNextChallenge}
                                title={
                                    nextChallenge
                                        ? t("microChallenge.nextChallenge", { target: nextChallenge })
                                        : t("finalTest.startChallenge")
                                }
                                subtitle={
                                    nextChallenge
                                        ? t("microChallenge.youGotThis")
                                        : t("microChallenge.goFor100")
                                }
                                variant="success"
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
                    ) : (
                        <>
                            <GlowButton
                                onPress={handleRetry}
                                title={t("finalTest.tryAgain")}
                                subtitle={t("microChallenge.remainingReps", { count: target - result })}
                                variant="primary"
                                size="lg"
                                glow={true}
                            />
                            <GlowButton
                                onPress={handleGoHome}
                                title={t("microChallenge.restAndReturn")}
                                variant="secondary"
                                size="md"
                            />
                        </>
                    )}
                </Animated.View>
            </View>
        </SafeScreen>
    );
}
