import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

interface CompletionViewProps {
    completedReps: number[];
    targetTotal?: number; // Optional to avoid breaking changes immediately
    onGoHome: () => void;
    isDark: boolean;
}

export function CompletionView({ completedReps, targetTotal = 0, onGoHome, isDark }: CompletionViewProps) {
    const { t } = useTranslation();
    const total = completedReps.reduce((a, b) => a + b, 0);

    // Feedback Logic
    const ratio = targetTotal > 0 ? total / targetTotal : 1;
    let iconName: any = "award";
    let iconColor = colors.primary;
    let feedbackTitle = t("workout.complete.title");
    let feedbackBody = t("home.motivation"); // Default motivation

    if (targetTotal > 0) {
        if (ratio < 0.8) {
            // Struggle
            iconName = "trending-up";
            iconColor = colors.warning || "#F59E0B";
            feedbackTitle = "Keep Building"; // Will localize later
            feedbackBody = "Strength is built in the struggle. Try this workout again soon.";
        } else if (ratio > 1.2) {
            // Overachiever
            iconName = "zap";
            iconColor = "#8B5CF6"; // Purple
            feedbackTitle = "Unstoppable!";
            feedbackBody = "You're crushing it! Next level is waiting.";
        }
        // Normal success uses defaults
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: t("workout.complete.shareMessage", { count: total })
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            {ratio >= 0.8 && <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut={true} />}
            <View style={styles.content}>
                <Feather
                    name={iconName}
                    size={80}
                    color={iconColor}
                    style={{ marginBottom: spacing.lg }}
                />
                <Text style={[
                    styles.title,
                    { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }
                ]}>
                    {feedbackTitle}
                </Text>

                <Text style={{
                    color: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
                    textAlign: 'center',
                    marginBottom: spacing.xl,
                    marginHorizontal: spacing.lg,
                    fontSize: 16
                }}>
                    {feedbackBody}
                </Text>

                <View style={styles.statsContainer}>
                    <Text style={[styles.statValue, { color: iconColor }]}>
                        {total}
                    </Text>
                    <Text style={[
                        styles.statLabel,
                        { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
                    ]}>
                        / {targetTotal > 0 ? targetTotal : total} {t("home.totalPushups")}
                    </Text>
                </View>
                <Button onPress={onGoHome} size="large">
                    {t("workout.complete.goHome")}
                </Button>
                <Button
                    onPress={handleShare}
                    variant="secondary"
                    style={{ marginTop: spacing.md }}
                >
                    {t("workout.complete.share")}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.xl,
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.xl,
        textAlign: "center",
    },
    statsContainer: {
        marginBottom: spacing.xl * 2,
        alignItems: "center",
    },
    statValue: {
        fontSize: 60,
        fontWeight: "800",
    },
    statLabel: {
        ...typography.h3,
    },
});
