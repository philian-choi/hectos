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

export default function InitialTestScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { setInitialTestResult, vibrationEnabled } = useUserStore();

    const [count, setCount] = useState(0);
    const scale = useSharedValue(1);

    const handleTap = () => {
        // Haptic feedback
        if (vibrationEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Animation
        scale.value = withSpring(1.1, { damping: 10 }, () => {
            scale.value = withSpring(1);
        });

        // Increment
        setCount((prev) => prev + 1);
    };

    const handleDone = () => {
        setInitialTestResult(count);
        router.push("/(auth)/test-result");
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <SafeScreen edges={["top", "bottom"]}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.headerText,
                            { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary },
                        ]}
                    >
                        {t("onboarding.test.title")}
                    </Text>
                </View>

                {/* Counter - Full screen tap area */}
                <Pressable style={styles.counterArea} onPress={handleTap}>
                    <Animated.View style={animatedStyle}>
                        <Text
                            style={[
                                styles.count,
                                { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary },
                            ]}
                        >
                            {count}
                        </Text>
                    </Animated.View>
                </Pressable>

                {/* Footer */}
                <View style={styles.footer}>
                    <Button onPress={handleDone} size="large">
                        {t("onboarding.test.done")}
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
    headerText: {
        ...typography.body,
    },
    counterArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    count: {
        fontSize: 150,
        fontWeight: "700",
        fontVariant: ["tabular-nums"],
    },
    footer: {
        padding: spacing.lg,
    },
});
