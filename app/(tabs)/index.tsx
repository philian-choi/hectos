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

export default function HomeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { todayWorkout } = useProgramData();
    const { totalPushups, currentWeek, currentDay } = useUserStore();

    // Date formatting
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase();

    const handleStartWorkout = () => {
        router.push({
            pathname: "/workout/[session]",
            params: { session: `${currentWeek}-${currentDay}` }
        });
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
                            <Text style={styles.weekBadgeText}>WEEK {currentWeek}</Text>
                        </View>
                    </View>
                    <Text style={[styles.subtitle, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                        Day {currentDay} Challenge
                    </Text>
                </FadeInView>

                {/* Main Hero Card */}
                <FadeInView delay={200} style={styles.heroSection}>
                    <LinearGradient
                        colors={[colors.primary, '#2563EB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroCard}
                    >
                        <View style={styles.heroHeader}>
                            <View style={styles.iconCircle}>
                                <Feather name="activity" size={24} color={colors.primary} />
                            </View>
                            <View>
                                <Text style={styles.heroLabel}>Total Target</Text>
                                <Text style={styles.heroValue}>
                                    {todayWorkout ? todayWorkout.totalReps : 0} Pushups
                                </Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.setContainer}>
                            <Text style={styles.setLabel}>{todayWorkout?.sets.length || 0} Sets breakdown</Text>
                            <View style={styles.setRow}>
                                {todayWorkout?.sets.map((reps, index) => (
                                    <View key={index} style={styles.setChip}>
                                        <Text style={styles.setChipText}>{reps}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity style={styles.startButton} onPress={handleStartWorkout}>
                            <Text style={styles.startButtonText}>{t("home.startWorkout")}</Text>
                            <Feather name="arrow-right" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </LinearGradient>
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
        fontSize: 32, // explicit large size
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
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 2,
    },
    heroValue: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '800',
        fontFamily: typography.h1.fontFamily,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: spacing.lg,
    },
    setContainer: {
        marginBottom: spacing.xl,
    },
    setLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: spacing.sm,
    },
    setRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    setChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    setChipText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
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
        // Card shadow
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
