import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { FadeInView } from "@/components/ui/FadeInView";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useUserStore } from "@/stores/useUserStore";
import { colors, spacing, typography } from "@/constants/theme";

const AnalysisBar = ({ label, value, color, isDark }: { label: string, value: number, color: string, isDark: boolean }) => (
    <View style={{ marginBottom: 12, width: '100%' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ color: isDark ? colors.dark.textSecondary : colors.light.textSecondary, fontSize: 12, fontWeight: '600' }}>{label}</Text>
            <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{value}/10</Text>
        </View>
        <View style={{ height: 8, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ width: `${value * 10}%`, height: '100%', backgroundColor: color }} />
        </View>
    </View>
);

export default function TestResultScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { initialTestResult, currentColumn, setOnboardingComplete } = useUserStore();

    const themeColors = isDark ? colors.dark : colors.light;

    // AI Analysis Simulation
    const strengthScore = Math.min(Math.round((initialTestResult / 30) * 10), 10);
    const enduranceScore = Math.min(Math.round((initialTestResult / 40) * 10), 10);
    const potentialScore = Math.min(Math.max(10 - strengthScore + 2, 4), 10);

    const handleStart = () => {
        setOnboardingComplete();
        router.replace("/(tabs)");
    };

    return (
        <SafeScreen>
            <View style={styles.container}>
                <View style={styles.content}>
                    <FadeInView delay={100}>
                        <View style={[styles.badgeContainer, { shadowColor: colors.primary }]}>
                            <Feather name="award" size={40} color="#FFF" />
                        </View>
                    </FadeInView>

                    <Text style={[styles.title, { color: themeColors.textPrimary }]}>{t('onboarding.result.title')}</Text>

                    {/* Main Score Card */}
                    <Card style={[styles.resultCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                        <Text style={[styles.scoreLabel, { color: themeColors.textSecondary }]}>{t('onboarding.result.baseline')}</Text>
                        <Text style={[styles.resultCount, { color: themeColors.textPrimary }]}>{initialTestResult}</Text>
                        <Text style={[styles.unit, { color: themeColors.textSecondary }]}>{t('onboarding.result.pushups')}</Text>

                        <View style={{ marginTop: 24, width: '100%' }}>
                            <AnalysisBar label={t('onboarding.result.muscleEndurance')} value={strengthScore} color={colors.primary} isDark={isDark} />
                            <AnalysisBar label={t('onboarding.result.coreStability')} value={enduranceScore} color={colors.secondary} isDark={isDark} />
                            <AnalysisBar label={t('onboarding.result.growthPotential')} value={potentialScore} color={colors.accent} isDark={isDark} />
                        </View>
                    </Card>

                    {/* Recommendation */}
                    <View style={styles.recommendation}>
                        <Text style={styles.recTitle}>{t('onboarding.result.recommendedPlan')}</Text>
                        <Text style={[styles.recText, { color: themeColors.textPrimary }]}>
                            {t('onboarding.result.levelAssigned', { count: initialTestResult, level: currentColumn })}
                        </Text>
                        <Text style={[styles.recSub, { color: themeColors.textSecondary }]}>
                            "{t('onboarding.result.potential')}"
                        </Text>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Button onPress={handleStart} size="large">
                        {t('onboarding.result.unlock')}
                    </Button>
                </View>
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: spacing.lg,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: 'center',
    },
    badgeContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.lg,
        textAlign: 'center',
    },
    resultCard: {
        width: '100%',
        alignItems: "center",
        padding: spacing.xl,
        marginBottom: spacing.xl,
        borderWidth: 1,
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 8,
    },
    resultCount: {
        fontSize: 56,
        fontWeight: "800",
        lineHeight: 60,
    },
    unit: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    recommendation: {
        width: '100%',
        paddingHorizontal: spacing.md,
    },
    recTitle: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 8,
    },
    recText: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    recSub: {
        fontSize: 14,
        fontStyle: 'italic',
        lineHeight: 20,
    },
    footer: {
        paddingBottom: spacing.lg,
        width: '100%',
    },
});

