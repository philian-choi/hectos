import { useState } from "react";
import { View, Text, StyleSheet, Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from "react-native-reanimated";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { useUserStore } from "@/stores/useUserStore";
import { colors, spacing, typography } from "@/constants/theme";

export default function ExhaustionTestScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { addExhaustionTest, currentWeek, vibrationEnabled } = useUserStore();

    const [count, setCount] = useState(0);
    const scale = useSharedValue(1);

    const handleTap = () => {
        if (vibrationEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        scale.value = withSpring(1.1, { damping: 10 }, () => {
            scale.value = withSpring(1);
        });

        setCount((prev) => prev + 1);
    };

    const handleDone = () => {
        // Save result and auto-assign column
        addExhaustionTest(count);

        // Show result alert or simple transition
        // For MVP, just go back to home or progress
        router.replace("/(tabs)/progress");
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <SafeScreen edges={["top", "bottom"]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}>
                        {t("progress.exhaustionTest")}
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                        Week {currentWeek}
                    </Text>
                </View>

                <Pressable style={styles.counterArea} onPress={handleTap}>
                    <Animated.View style={animatedStyle}>
                        <Text style={[styles.count, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}>
                            {count}
                        </Text>
                        <Text style={[styles.hint, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                            {t("workout.max")}
                        </Text>
                    </Animated.View>
                </Pressable>

                <View style={styles.footer}>
                    <Text style={[styles.instruction, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
                        {t("onboarding.testIntro.instruction")}
                    </Text>
                    <Button onPress={handleDone} size="large" style={styles.button}>
                        {t("common.done")}
                    </Button>
                </View>
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: spacing.lg,
        alignItems: "center",
    },
    title: {
        ...typography.h2,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        opacity: 0.7,
    },
    counterArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    count: {
        fontSize: 140,
        fontWeight: "800",
        fontVariant: ["tabular-nums"],
    },
    hint: {
        ...typography.h3,
        textAlign: 'center',
        opacity: 0.6,
        marginTop: spacing.md,
    },
    footer: {
        padding: spacing.lg,
        gap: spacing.lg,
    },
    instruction: {
        textAlign: "center",
        opacity: 0.7,
    },
    button: {
        marginBottom: spacing.lg,
    }
});
