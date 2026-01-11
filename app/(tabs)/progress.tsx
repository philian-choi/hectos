import { View, Text, StyleSheet, ScrollView, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { FadeInView } from "@/components/ui/FadeInView";
import { useUserStore } from "@/stores/useUserStore";
import { colors, spacing, typography } from "@/constants/theme";

const WEEKS = [1, 2, 3, 4, 5, 6];

export default function ProgressScreen() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { currentWeek, currentDay, exhaustionTests } = useUserStore();

    // Calculate overall progress (Simply based on Current Week/Day)
    const totalDays = 6 * 3; // 18 sessions
    const completedDays = ((currentWeek - 1) * 3) + (currentDay - 1);
    const progressPercent = Math.min(Math.round((completedDays / totalDays) * 100), 100);

    return (
        <SafeScreen>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header Title */}
                <FadeInView delay={100} style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}>
                        {t("progress.title")}
                    </Text>
                </FadeInView>

                {/* Overall Progress Card */}
                <FadeInView delay={200}>
                    <View style={[styles.progressCard, { backgroundColor: colors.primary }]}>
                        <View style={styles.progressRow}>
                            <View>
                                <Text style={styles.progressLabel}>Total Progress</Text>
                                <Text style={styles.progressValue}>{progressPercent}%</Text>
                            </View>
                            <View style={styles.trophyIcon}>
                                <Feather name="award" size={32} color={colors.primary} />
                            </View>
                        </View>
                        {/* Progress Bar Container */}
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                        </View>
                        <Text style={styles.progressSub}>
                            {progressPercent === 100 ? "You did it!" : "Consistent effort is key!"}
                        </Text>
                    </View>
                </FadeInView>

                {/* Timeline / Weeks */}
                <View style={styles.timelineContainer}>
                    {WEEKS.map((week, index) => {
                        const isPast = week < currentWeek;
                        const isCurrent = week === currentWeek;
                        const isLocked = week > currentWeek;

                        return (
                            <FadeInView key={week} delay={300 + (index * 50)} style={styles.weekRow}>
                                {/* Timeline Line & Dot */}
                                <View style={styles.timelineLeft}>
                                    {index !== WEEKS.length - 1 && (
                                        <View style={[styles.timelineLine, {
                                            backgroundColor: isLocked ? (isDark ? '#333' : '#E5E7EB') : colors.primary
                                        }]} />
                                    )}
                                    <View style={[styles.timelineDot, {
                                        backgroundColor: isCurrent ? colors.primary : (isPast ? colors.primary : (isDark ? '#444' : '#E5E7EB')),
                                        borderColor: isDark ? colors.dark.background : colors.light.background
                                    }]}>
                                        {isPast && <Feather name="check" size={12} color="#FFF" />}
                                    </View>
                                </View>

                                {/* Content Card */}
                                <View style={[styles.weekCard, {
                                    backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
                                    opacity: isLocked ? 0.5 : 1
                                }]}>
                                    <View style={styles.weekHeader}>
                                        <Text style={[styles.weekTitle, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}>
                                            {t("progress.week", { week })}
                                        </Text>
                                        <View style={styles.daysContainer}>
                                            {[1, 2, 3].map(day => {
                                                // Logic: if past week, all done. if current week, check day.
                                                let isDone = false;
                                                let isToday = false;

                                                if (isPast) isDone = true;
                                                else if (isCurrent) {
                                                    if (day < currentDay) isDone = true;
                                                    else if (day === currentDay) isToday = true;
                                                }

                                                return (
                                                    <View key={day} style={[
                                                        styles.dayDot,
                                                        isDone ? styles.dayDone : (isToday ? styles.dayCurrent : styles.dayLocked),
                                                        isToday && { borderColor: colors.primary, borderWidth: 2, backgroundColor: 'transparent' }
                                                    ]}>
                                                        {isDone && <Feather name="check" size={10} color="#FFF" />}
                                                    </View>
                                                )
                                            })}
                                        </View>
                                    </View>

                                    {/* Test Indicator */}
                                    {[2, 4, 5, 6].includes(week) && (
                                        <View style={styles.testBadgeContainer}>
                                            <View style={[styles.testBadge, { backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : '#FEF3C7' }]}>
                                                <Feather name="flag" size={10} color={colors.warning} />
                                                <Text style={[styles.testText, { color: colors.warning }]}>{t("progress.exhaustionTest")}</Text>
                                            </View>
                                            {/* Done check for test logic roughly */}
                                            {exhaustionTests.some(t => t.week === week) && (
                                                <Feather name="check-circle" size={14} color={colors.success} />
                                            )}
                                        </View>
                                    )}
                                </View>
                            </FadeInView>
                        );
                    })}
                </View>
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
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        fontSize: 32,
    },
    progressCard: {
        borderRadius: 24,
        padding: spacing.xl,
        marginBottom: spacing.xl * 1.5,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.lg,
    },
    progressLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    progressValue: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: '800',
    },
    trophyIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: spacing.sm,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 4,
    },
    progressSub: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        fontWeight: '500',
    },
    timelineContainer: {
        paddingLeft: spacing.sm,
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: spacing.lg,
        minHeight: 80,
    },
    timelineLeft: {
        alignItems: 'center',
        width: 24,
        marginRight: spacing.md,
    },
    timelineLine: {
        position: 'absolute',
        top: 24,
        bottom: -24, // Connect to next
        width: 2,
        backgroundColor: '#E5E7EB',
        zIndex: 0,
    },
    timelineDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        borderWidth: 4, // create gap effect
    },
    weekCard: {
        flex: 1,
        borderRadius: 16,
        padding: spacing.md,
        justifyContent: 'center',
        // Card shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    weekHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    weekTitle: {
        ...typography.h3,
        fontSize: 16,
    },
    daysContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    dayDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dayDone: {
        backgroundColor: colors.success,
    },
    dayCurrent: {
        // Handled in style prop
    },
    dayLocked: {
        backgroundColor: 'rgba(150, 150, 150, 0.2)',
    },
    testBadgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: spacing.sm,
        gap: spacing.sm,
        justifyContent: 'space-between'
    },
    testBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
        alignSelf: 'flex-start',
    },
    testText: {
        fontSize: 10,
        fontWeight: '700',
    }
});
