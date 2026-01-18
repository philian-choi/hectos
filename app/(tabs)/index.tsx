import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { FadeInView } from "@/components/ui/FadeInView";
import { useProgramData } from "@/hooks/useProgramData";
import { useUserStore } from "@/stores/useUserStore";
import { colors, spacing, typography } from "@/constants/theme";
import { WeeklyMiniChart } from "@/components/ui/WeeklyMiniChart";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withSpring } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
    const { t, i18n } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { todayWorkout } = useProgramData();
    const { totalPushups, currentWeek, currentDay, isProgramComplete, resetProgress, completedSessions, hasPurchased } = useUserStore();

    // Pulse Animation for Start Button
    const scale = useSharedValue(1);

    // Freemium Logic: Free for Week 1, Day 1-3
    const isFreeTrial = currentWeek === 1 && currentDay <= 3;
    const isLocked = !hasPurchased && !isFreeTrial;

    // Start pulsing when mounted
    if (scale.value === 1) {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.05, { duration: 800 }),
                withTiming(1, { duration: 800 })
            ),
            -1, // Infinite
            true // Reverse
        );
    }

    const animatedButtonStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Shake Animation for Lock
    const shakeTranslateX = useSharedValue(0);
    const animatedShakeStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: shakeTranslateX.value }]
    }));

    // Date formatting (using current locale)
    const today = new Date();
    const currentLang = i18n.language === 'ko' ? 'ko-KR' : 'en-US';
    const dateString = today.toLocaleDateString(currentLang, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

    const targetPushups = todayWorkout ? todayWorkout.sets.reduce((a, b) => a + b, 0) : 0;

    // Weekly Data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });
    const weeklyData = last7Days.map(dateStr => {
        // Safe check for completedSessions array
        const sessions = completedSessions || [];
        return sessions
            .filter(s => s.date.startsWith(dateStr))
            .reduce((sum, s) => sum + s.pushups, 0);
    });
    const maxPushups = Math.max(...weeklyData, 50);

    const handleStartWorkout = () => {
        if (isLocked) {
            // Haptic Feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

            // Shake Animation
            shakeTranslateX.value = withSequence(
                withTiming(10, { duration: 50 }),
                withTiming(-10, { duration: 50 }),
                withTiming(10, { duration: 50 }),
                withTiming(0, { duration: 50 })
            );

            // Delay navigation slightly to show animation
            setTimeout(() => {
                router.push("/(auth)/purchase");
            }, 300);
            return;
        }

        router.push({
            pathname: "/workout/[session]",
            params: { session: `${currentWeek}-${currentDay}` }
        });
    };

    const handleRestart = () => {
        resetProgress();
    };

    return (
        <SafeScreen>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <FadeInView delay={100} style={styles.header}>
                    <Text style={styles.date}>{dateString}</Text>
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}>
                            {t("home.title")}
                        </Text>
                        <View style={styles.weekBadge}>
                            <Text style={styles.weekBadgeText}>{t("progress.week", { week: currentWeek }).toUpperCase()}</Text>
                        </View>
                    </View>
                    <Text style={[styles.subtitle, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                        {t("home.progress", { week: currentWeek, day: currentDay })} • {t("home.goal")}: {targetPushups}
                    </Text>
                </FadeInView>

                {/* Main Hero Card */}
                <FadeInView delay={200} style={styles.heroSection}>
                    {isProgramComplete ? (
                        /* 🎉 Program Complete Card */
                        <LinearGradient
                            colors={['#10B981', '#059669']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroCard}
                        >
                            <View style={{ alignItems: 'center', gap: 16 }}>
                                <View style={[styles.progressCircle, { borderColor: 'rgba(255,255,255,0.5)' }]}>
                                    <Feather name="award" size={40} color="#FFF" />
                                </View>
                                <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '800', textAlign: 'center' }}>
                                    {t("home.programComplete.title")}
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, textAlign: 'center' }}>
                                    {t("home.programComplete.message", { count: totalPushups })}
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={handleRestart}
                                activeOpacity={0.9}
                                accessibilityRole="button"
                                accessibilityLabel={t("home.programComplete.restart")}
                                accessibilityHint="Resets all progress to start over"
                            >
                                <Text style={styles.startButtonText}>{t("home.programComplete.restart")}</Text>
                                <Feather name="refresh-cw" size={20} color={colors.primary} />
                            </TouchableOpacity>
                        </LinearGradient>
                    ) : (
                        /* Normal Workout Card */
                        <LinearGradient
                            colors={isLocked ? [colors.gray[600], colors.gray[800]] : [colors.primary, '#2563EB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.heroCard}
                        >
                            <View style={styles.heroContent}>
                                {/* Left: Circular Progress Placeholder (Visual) */}
                                <View style={styles.progressCircle}>
                                    {isLocked ? (
                                        <Feather name="lock" size={32} color="rgba(255,255,255,0.8)" />
                                    ) : (
                                        <>
                                            <Text style={styles.progressValue}>{targetPushups}</Text>
                                            <Text style={styles.progressLabel}>{t("home.goal")}</Text>
                                        </>
                                    )}
                                </View>

                                {/* Right: Info */}
                                <View style={{ flex: 1, gap: 8 }}>
                                    <Text style={styles.setLabel}>
                                        {t("home.setsBreakdown", { count: todayWorkout?.sets.length || 0 })}
                                    </Text>
                                    <View style={styles.setRow}>
                                        {todayWorkout?.sets.map((reps, index) => (
                                            <View key={index} style={styles.setChip}>
                                                <Text style={styles.setChipText}>{reps}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    <Text style={styles.motivationText}>
                                        "{t("home.motivation")}"
                                    </Text>
                                </View>
                            </View>

                            <Animated.View style={[animatedButtonStyle, animatedShakeStyle]}>
                                <TouchableOpacity
                                    style={styles.startButton}
                                    onPress={handleStartWorkout}
                                    activeOpacity={0.9}
                                    accessibilityRole="button"
                                    accessibilityLabel={isLocked ? t("purchase.title") : t("home.startWorkout")}
                                >
                                    <Text style={[styles.startButtonText, { color: isLocked ? colors.gray[800] : colors.primary }]}>
                                        {isLocked ? t("purchase.title") : t("home.startWorkout")}
                                    </Text>
                                    <Feather name={isLocked ? "lock" : "arrow-right"} size={20} color={isLocked ? colors.gray[800] : colors.primary} />
                                </TouchableOpacity>
                            </Animated.View>
                        </LinearGradient>
                    )}
                </FadeInView>

                {/* Stats Section */}
                <FadeInView delay={300} style={styles.statsSection}>
                    <View style={[styles.statCard, { backgroundColor: isDark ? colors.dark.surface : colors.light.surface }]}>
                        <View style={[styles.statIcon, { backgroundColor: '#ECFDF5' }]}>
                            <Feather name="trending-up" size={24} color="#10B981" />
                        </View>
                        <View style={styles.statContent}>
                            <Text style={[styles.statLabel, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                                {t("home.totalPushups")}
                            </Text>
                            <Text style={[styles.statValue, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}>
                                {totalPushups}
                            </Text>
                        </View>
                    </View>

                    {/* Weekly Chart Card */}
                    <View style={[styles.statCard, {
                        backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        padding: 20
                    }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <View style={[styles.statIcon, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                <Feather name="bar-chart-2" size={24} color={colors.primary} />
                            </View>
                            <Text style={[styles.statLabel, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary, marginBottom: 0, fontSize: 16 }]}>
                                {t("home.weeklyActivity")}
                            </Text>
                        </View>
                        <WeeklyMiniChart data={weeklyData} max={maxPushups} color={colors.primary} />
                    </View>
                </FadeInView>
            </ScrollView>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing.xl * 2,
    },
    header: {
        marginBottom: spacing.xl,
    },
    date: {
        ...typography.caption,
        color: colors.primary,
        marginBottom: spacing.xs,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.xs,
    },
    title: {
        ...typography.h1,
        fontSize: 32,
    },
    weekBadge: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        paddingHorizontal: spacing.sm + 4,
        paddingVertical: 4,
        borderRadius: 12,
    },
    weekBadgeText: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: '700',
    },
    subtitle: {
        ...typography.h3,
        fontSize: 18,
        fontWeight: '500',
    },
    heroSection: {
        marginBottom: spacing.xl,
    },
    heroCard: {
        borderRadius: 24,
        padding: spacing.xl,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.lg,
        marginBottom: spacing.xl,
    },
    progressCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 6,
        borderColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    progressValue: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: '800',
    },
    progressLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '700',
        marginTop: -4,
    },
    setLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    setRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    setChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    setChipText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 14,
    },
    motivationText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 4,
    },
    startButton: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
    },
    startButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '700',
    },
    statsSection: {
        gap: spacing.md,
    },
    statCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 20,
        gap: spacing.md,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statContent: {
        flex: 1,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
    }
});
