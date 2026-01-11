import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { colors, spacing, typography } from "@/constants/theme";

interface RestTimerProps {
    duration: number;
    onComplete: () => void;
    onSkip: () => void;
}

export function RestTimer({ duration, onComplete, onSkip }: RestTimerProps) {
    const { t } = useTranslation();
    const [secondsRemaining, setSecondsRemaining] = useState(duration);

    useEffect(() => {
        if (secondsRemaining <= 0) {
            onComplete();
            return;
        }

        const interval = setInterval(() => {
            setSecondsRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [secondsRemaining, onComplete]);

    const progress = 1 - secondsRemaining / duration;

    return (
        <View style={styles.container}>
            <Text style={styles.timerText}>{secondsRemaining}</Text>
            <Text style={styles.label}>
                {t("workout.rest", { seconds: secondsRemaining })}
            </Text>

            <View style={styles.progressContainer}>
                <ProgressBar progress={progress} height={12} />
            </View>

            <Button onPress={onSkip} variant="secondary" size="medium">
                {t("workout.skipRest")}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.xl,
    },
    timerText: {
        ...typography.display,
        fontSize: 80,
        lineHeight: 100,
        marginBottom: spacing.sm,
        fontVariant: ["tabular-nums"],
    },
    label: {
        ...typography.h3,
        marginBottom: spacing.xl,
        opacity: 0.8,
    },
    progressContainer: {
        width: "100%",
        marginBottom: spacing.xl,
        maxWidth: 300,
    },
});
