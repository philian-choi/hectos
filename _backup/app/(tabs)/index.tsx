import { View, ScrollView, useColorScheme, Pressable, Modal } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useProgramData } from "@/hooks/useProgramData";
import { useUserStore, calculateStreak, getDaysSinceLastActivity, getRecommendedRestartWeek } from "@/stores/useUserStore";
import { colors } from "@/constants/theme";
import { WeeklyMiniChart } from "@/components/ui/WeeklyMiniChart";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { GlowButton } from "@/components/ui/GlowButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withSpring,
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useState, useEffect } from "react";

import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomeScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { todayWorkout } = useProgramData();
    const {
        totalPushups,
        currentWeek,
        currentDay,
        isProgramComplete,
        resetProgress,
        completedSessions,
        hasPurchased,
        hasFinalTestUnlocked,
        personalBest,
        hasReached100,
        getNextMicroChallenge,
        lastActiveDate,
    } = useUserStore();

    // Comeback User Detection
    const [showComebackModal, setShowComebackModal] = useState(false);
    const daysAway = getDaysSinceLastActivity(lastActiveDate);
    const recommendedWeek = getRecommendedRestartWeek(currentWeek, daysAway);
    const isComeback = daysAway >= 3 && currentWeek > 1;

    useEffect(() => {
        // Show comeback modal if user has been away
        if (isComeback && !isProgramComplete) {
            const timer = setTimeout(() => setShowComebackModal(true), 500);
            return () => clearTimeout(timer);
        }
    }, []);

    // Freemium Logic
    const isFreeTrial = currentWeek === 1 && currentDay <= 3;
    const isLocked = !hasPurchased && !isFreeTrial;

    // Shake Animation for Lock
    const shakeTranslateX = useSharedValue(0);
    const animatedShakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeTranslateX.value }],
    }));

    // Date formatting
    const today = new Date();
    const currentLang = i18n.language === "ko" ? "ko-KR" : "en-US";
    const dateString = today
        .toLocaleDateString(currentLang, {
            weekday: "long",
            month: "long",
            day: "numeric",
        })
        .toUpperCase();

    const targetPushups = todayWorkout
        ? todayWorkout.sets.reduce((a, b) => a + b, 0)
        : 0;

    // Calculate streak
    const streak = calculateStreak(completedSessions || []);

    // Weekly Data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split("T")[0];
    });
    const weeklyData = last7Days.map((dateStr) => {
        const sessions = completedSessions || [];
        return sessions
            .filter((s) => s.date.startsWith(dateStr))
            .reduce((sum, s) => sum + s.pushups, 0);
    });
    const maxPushups = Math.max(...weeklyData, 50);

    const handleStartWorkout = () => {
        if (isLocked) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            shakeTranslateX.value = withSequence(
                withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );
            setTimeout(() => {
                router.push("/(auth)/purchase");
            }, 300);
            return;
        }

        router.push({
            pathname: "/workout/[session]",
            params: { session: `${currentWeek}-${currentDay}` },
        });
    };

    const handleRestart = () => {
        resetProgress();
    };

    return (
        <SafeScreen>
            {/* Background Gradient */}
            <LinearGradient
                colors={
                    isDark
                        ? ["#0a0a0a", "#0f0f23", "#1a1a2e"]
                        : ["#fefefe", "#f8f8ff", "#f0f0ff"]
                }
                style={{ position: "absolute", inset: 0 }}
            />

            {/* Subtle Floating Particles */}
            <FloatingParticles
                count={8}
                colors={isDark ? ["#FFB800", "#FF8C00"] : ["#FFD54F", "#FFCA28"]}
                minSize={2}
                maxSize={5}
            />

            <ScrollView
                contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View entering={FadeInDown.delay(100).duration(600)}>
                    <Text className="text-primary font-bold mb-1 tracking-wider text-xs uppercase">
                        {dateString}
                    </Text>
                    <View className="flex-row items-center gap-3 mb-1">
                        <Text className="text-3xl font-black text-foreground">
                            {t("home.title")}
                        </Text>
                        <Badge
                            variant="outline"
                            className="bg-primary/15 border-primary/30 px-3 py-1"
                        >
                            <Text className="text-primary text-xs font-bold">
                                {t("progress.week", { week: currentWeek }).toUpperCase()}
                            </Text>
                        </Badge>
                    </View>
                    <Text className="text-base font-medium text-muted-foreground">
                        {t("home.progress", { week: currentWeek, day: currentDay })} •{" "}
                        {t("home.goal")}: {targetPushups}
                    </Text>
                </Animated.View>

                {/* Main Hero Card */}
                <Animated.View
                    entering={FadeInDown.delay(200).duration(600)}
                    className="mt-6"
                >
                    {isProgramComplete ? (
                        /* 🎉 Program Complete - Show Micro Challenge or Final Test */
                        <View className="gap-4">
                            {(() => {
                                const nextMicro = getNextMicroChallenge();
                                const showMicroChallenge = nextMicro !== null && !hasReached100;

                                // Get gradient colors based on target
                                const getGradient = () => {
                                    if (hasReached100) return ["#10B981", "#059669"];
                                    if (nextMicro === 50) return ["#3B82F6", "#2563EB"];
                                    if (nextMicro === 75) return ["#8B5CF6", "#7C3AED"];
                                    if (nextMicro === 90) return ["#10B981", "#059669"];
                                    return ["#FFB800", "#FF8C00"];
                                };

                                const getEmoji = () => {
                                    if (hasReached100) return "🏆";
                                    if (nextMicro === 50) return "🎯";
                                    if (nextMicro === 75) return "💪";
                                    if (nextMicro === 90) return "🔥";
                                    return "🎯";
                                };

                                return (
                                    <LinearGradient
                                        colors={getGradient() as any}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={{
                                            borderRadius: 28,
                                            padding: 28,
                                            shadowColor: getGradient()[0],
                                            shadowOffset: { width: 0, height: 12 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 20,
                                            elevation: 12,
                                        }}
                                    >
                                        <View className="items-center gap-4">
                                            <View className="w-24 h-24 rounded-full border-4 border-white/30 justify-center items-center bg-white/15">
                                                <Text style={{ fontSize: 44 }}>{getEmoji()}</Text>
                                            </View>

                                            <Text className="text-white text-2xl font-black text-center">
                                                {hasReached100
                                                    ? t("finalTest.successTitle")
                                                    : showMicroChallenge
                                                        ? t("microChallenge.title", { target: nextMicro })
                                                        : t("finalTest.unlocked")}
                                            </Text>

                                            <Text className="text-white/90 text-base text-center">
                                                {hasReached100
                                                    ? t("finalTest.successSubtitle")
                                                    : showMicroChallenge
                                                        ? t("microChallenge.subtitle")
                                                        : t("finalTest.unlockedDesc")}
                                            </Text>

                                            {/* Progress Milestones */}
                                            {!hasReached100 && (
                                                <View className="flex-row items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                                                    {[50, 75, 90, 100].map((m, i) => (
                                                        <View key={m} className="flex-row items-center">
                                                            <View
                                                                style={{
                                                                    width: 24,
                                                                    height: 24,
                                                                    borderRadius: 12,
                                                                    backgroundColor: personalBest >= m ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                }}
                                                            >
                                                                {personalBest >= m ? (
                                                                    <Feather name="check" size={14} color="#1a1a1a" />
                                                                ) : (
                                                                    <Text style={{ fontSize: 8, fontWeight: "bold", color: "#FFF" }}>{m}</Text>
                                                                )}
                                                            </View>
                                                            {i < 3 && <View style={{ width: 12, height: 2, backgroundColor: "rgba(255,255,255,0.3)" }} />}
                                                        </View>
                                                    ))}
                                                </View>
                                            )}

                                            {/* Personal Best */}
                                            <View className="flex-row items-center gap-2">
                                                <Feather name="award" size={16} color="#FFF" />
                                                <Text className="text-white font-bold">
                                                    {t("finalTest.personalBest")}: {personalBest}
                                                </Text>
                                            </View>

                                            {/* CTA Button */}
                                            <GlowButton
                                                onPress={() => {
                                                    if (hasReached100) {
                                                        router.push("/workout/final-test");
                                                    } else if (showMicroChallenge) {
                                                        router.push({
                                                            pathname: "/workout/micro-challenge",
                                                            params: { target: nextMicro!.toString() },
                                                        });
                                                    } else {
                                                        router.push("/workout/final-test");
                                                    }
                                                }}
                                                title={
                                                    hasReached100
                                                        ? t("finalTest.tryAgain")
                                                        : showMicroChallenge
                                                            ? t("microChallenge.nextChallenge", { target: nextMicro })
                                                            : t("finalTest.startChallenge")
                                                }
                                                variant="secondary"
                                                size="lg"
                                                glow={true}
                                            />
                                        </View>
                                    </LinearGradient>
                                );
                            })()}

                            {/* Restart Program Option */}
                            <Pressable
                                onPress={handleRestart}
                                className="flex-row items-center justify-center gap-2 py-3"
                            >
                                <Feather name="refresh-cw" size={16} color={isDark ? "#9CA3AF" : "#6B7280"} />
                                <Text className="text-muted-foreground text-sm font-medium">
                                    {t("home.programComplete.restart")}
                                </Text>
                            </Pressable>
                        </View>
                    ) : (
                        /* Main Workout Card */
                        <View
                            style={{
                                borderRadius: 28,
                                overflow: "hidden",
                                borderWidth: 1,
                                borderColor: isDark
                                    ? "rgba(255, 184, 0, 0.2)"
                                    : "rgba(255, 184, 0, 0.3)",
                            }}
                        >
                            <BlurView
                                intensity={isDark ? 40 : 80}
                                tint={isDark ? "dark" : "light"}
                                style={{
                                    padding: 28,
                                    backgroundColor: isDark
                                        ? "rgba(255, 184, 0, 0.08)"
                                        : "rgba(255, 184, 0, 0.12)",
                                }}
                            >
                                {/* Week/Day Header */}
                                <Text className="text-muted-foreground text-sm tracking-[3px] text-center mb-6 font-bold uppercase">
                                    {t("progress.week", { week: currentWeek }).toUpperCase()} • {t("progress.day", { day: currentDay }).toUpperCase()}
                                </Text>

                                {/* Progress Ring */}
                                <View className="items-center justify-center mb-6">
                                    <ProgressRing
                                        progress={0}
                                        size={160}
                                        strokeWidth={16}
                                        color={isLocked ? "#64748B" : colors.primary}
                                        backgroundColor={
                                            isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"
                                        }
                                    >
                                        <View className="items-center justify-center">
                                            {isLocked ? (
                                                <Feather name="lock" size={36} color="#94A3B8" />
                                            ) : (
                                                <>
                                                    <Text
                                                        className="font-black text-foreground"
                                                        style={{
                                                            fontSize: 56,
                                                            lineHeight: 60,
                                                            letterSpacing: -2,
                                                        }}
                                                    >
                                                        {targetPushups}
                                                    </Text>
                                                    <Text className="text-xs font-bold text-muted-foreground tracking-widest -mt-1">
                                                        PUSHUPS
                                                    </Text>
                                                </>
                                            )}
                                        </View>
                                    </ProgressRing>
                                </View>

                                {/* Set Chips */}
                                <View className="flex-row justify-center gap-2.5 mb-6">
                                    {todayWorkout?.sets.map((reps, index) => (
                                        <View
                                            key={index}
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 18,
                                                backgroundColor: isDark
                                                    ? "rgba(255,255,255,0.1)"
                                                    : "rgba(0,0,0,0.08)",
                                                borderWidth: 1,
                                                borderColor: isDark
                                                    ? "rgba(255,255,255,0.15)"
                                                    : "rgba(0,0,0,0.1)",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Text className="text-foreground font-bold text-sm">
                                                {reps}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Streak Badge */}
                                {streak > 0 && (
                                    <View className="items-center mb-6">
                                        <StreakBadge days={streak} size="medium" />
                                    </View>
                                )}

                                {/* CTA Button */}
                                <Animated.View style={animatedShakeStyle}>
                                    <GlowButton
                                        onPress={handleStartWorkout}
                                        title={isLocked ? t("purchase.title") : "START"}
                                        variant={isLocked ? "locked" : "primary"}
                                        size="xl"
                                        glow={!isLocked}
                                    />
                                </Animated.View>
                            </BlurView>
                        </View>
                    )}
                </Animated.View>

                {/* Stats Section */}
                <Animated.View
                    entering={FadeInUp.delay(350).duration(600)}
                    className="mt-6 gap-4"
                >
                    {/* Total Pushups */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            padding: 18,
                            borderRadius: 20,
                            backgroundColor: isDark
                                ? "rgba(255,255,255,0.05)"
                                : "rgba(0,0,0,0.03)",
                            borderWidth: 1,
                            borderColor: isDark
                                ? "rgba(255,255,255,0.08)"
                                : "rgba(0,0,0,0.06)",
                            gap: 16,
                        }}
                    >
                        <LinearGradient
                            colors={["#10B981", "#059669"]}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 16,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Feather name="trending-up" size={22} color="#FFF" />
                        </LinearGradient>
                        <View className="flex-1">
                            <Text className="text-xs font-semibold mb-1 text-muted-foreground uppercase tracking-wider">
                                {t("home.totalPushups")}
                            </Text>
                            <Text
                                className="text-2xl font-black text-foreground"
                                style={{ fontVariant: ["tabular-nums"] }}
                            >
                                {totalPushups.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Weekly Chart */}
                <Animated.View entering={FadeInUp.delay(450).duration(600)}>
                    <WeeklyMiniChart
                        data={weeklyData}
                        max={maxPushups}
                        color={colors.primary}
                    />
                </Animated.View>
            </ScrollView>

            {/* Comeback User Modal */}
            <Modal
                visible={showComebackModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowComebackModal(false)}
            >
                <Pressable
                    className="flex-1 justify-center items-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                    onPress={() => { }}
                >
                    <View style={{ width: 320, borderRadius: 28, overflow: "hidden" }}>
                        <BlurView
                            intensity={isDark ? 60 : 80}
                            tint={isDark ? "dark" : "light"}
                            style={{ padding: 24 }}
                        >
                            <View className="items-center mb-4">
                                <LinearGradient
                                    colors={["#3B82F6", "#2563EB"]}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 40,
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text style={{ fontSize: 40 }}>👋</Text>
                                </LinearGradient>
                            </View>

                            <Text className="text-xl font-black text-foreground text-center mb-2">
                                {t("comeback.title")}
                            </Text>

                            <Text className="text-sm text-muted-foreground text-center mb-4 leading-5">
                                {t("comeback.message", { days: daysAway })}
                            </Text>

                            {recommendedWeek < currentWeek && (
                                <View className="bg-blue-500/10 rounded-xl p-3 mb-4">
                                    <Text className="text-sm text-center text-foreground">
                                        {t("comeback.recommendation", { week: recommendedWeek })}
                                    </Text>
                                </View>
                            )}

                            <View className="gap-3">
                                {recommendedWeek < currentWeek && (
                                    <GlowButton
                                        onPress={() => {
                                            // Go back to recommended week
                                            useUserStore.setState({
                                                currentWeek: recommendedWeek,
                                                currentDay: 1,
                                                lastActiveDate: new Date().toISOString().split('T')[0],
                                            });
                                            setShowComebackModal(false);
                                        }}
                                        title={t("comeback.restart", { week: recommendedWeek })}
                                        variant="primary"
                                        size="md"
                                        glow={true}
                                    />
                                )}
                                <Pressable
                                    onPress={() => {
                                        useUserStore.setState({
                                            lastActiveDate: new Date().toISOString().split('T')[0],
                                        });
                                        setShowComebackModal(false);
                                    }}
                                    className="py-3"
                                >
                                    <Text className="text-center text-sm text-muted-foreground font-medium">
                                        {t("comeback.continue")}
                                    </Text>
                                </Pressable>
                            </View>
                        </BlurView>
                    </View>
                </Pressable>
            </Modal>
        </SafeScreen>
    );
}
