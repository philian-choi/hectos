import React from 'react';
import { View, Text, StyleSheet, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

interface CompletionViewProps {
    completedReps: number[];
    onGoHome: () => void;
    isDark: boolean;
}

export function CompletionView({ completedReps, onGoHome, isDark }: CompletionViewProps) {
    const { t } = useTranslation();
    const total = completedReps.reduce((a, b) => a + b, 0);

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
            <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} fadeOut={true} />
            <View style={styles.content}>
                <Feather
                    name="award"
                    size={80}
                    color={colors.primary}
                    style={{ marginBottom: spacing.lg }}
                />
                <Text style={[
                    styles.title,
                    { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }
                ]}>
                    {t("workout.complete.title")}
                </Text>
                <View style={styles.statsContainer}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>
                        {total}
                    </Text>
                    <Text style={[
                        styles.statLabel,
                        { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }
                    ]}>
                        {t("workout.complete.totalPushups", { count: total })}
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
