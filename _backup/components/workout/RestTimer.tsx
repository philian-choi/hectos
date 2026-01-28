import { useEffect, useState } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { colors } from "@/constants/theme";

interface RestTimerProps {
    duration: number;
    onComplete: () => void;
    onSkip: () => void;
    nextSetReps?: number;
    currentSet?: number;
    totalSets?: number;
}

export function RestTimer({ duration, onComplete, onSkip, nextSetReps, currentSet, totalSets }: RestTimerProps) {
    const { t } = useTranslation();
    const [secondsRemaining, setSecondsRemaining] = useState(duration);

    // Motivation messages from i18n
    const motivationKeys = ["1", "2", "3", "4", "5", "6"];
    const [motivationKey] = useState(() => motivationKeys[Math.floor(Math.random() * motivationKeys.length)]);

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
        <View className="flex-1 justify-center items-center p-6">
            {/* Motivation */}
            <Text className="text-lg font-semibold text-primary mb-8 text-center">
                {t(`workout.motivations.${motivationKey}`)}
            </Text>

            {/* Timer */}
            <Text className="text-9xl font-black mb-2 text-foreground font-variant-tabular-nums">
                {secondsRemaining}
            </Text>
            <Text className="text-2xl font-medium mb-12 opacity-80 text-muted-foreground text-center">
                {t("workout.rest", { seconds: secondsRemaining })}
            </Text>

            {/* Progress */}
            <View className="w-full mb-8 max-w-[300px]">
                <ProgressBar progress={progress} height={12} />
            </View>

            {/* Next Set Preview */}
            {nextSetReps !== undefined && currentSet !== undefined && totalSets !== undefined && (
                <View className="bg-primary/10 py-4 px-8 rounded-xl mb-8 items-center">
                    <Text className="text-xs font-bold text-primary tracking-widest mb-1">
                        {t("workout.nextSet", { current: currentSet + 1, total: totalSets }).toUpperCase()}
                    </Text>
                    <Text className="text-4xl font-extrabold text-foreground">
                        {t("workout.reps", { count: nextSetReps })}
                    </Text>
                </View>
            )}

            <Button onPress={onSkip} variant="secondary" size="lg">
                <Text className="text-lg font-bold text-secondary-foreground">{t("workout.skipRest")}</Text>
            </Button>
        </View>
    );
}


