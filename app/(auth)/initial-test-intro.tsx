import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { FadeInView } from "@/components/ui/FadeInView";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, typography } from "@/constants/theme";

export default function InitialTestIntroScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const handleStart = () => {
        router.push("/(auth)/initial-test");
    };

    return (
        <SafeScreen>
            <View style={styles.container}>
                <View style={styles.content}>
                    <FadeInView delay={100}>
                        <Feather name="target" size={80} color={colors.primary} style={{ marginBottom: spacing.xl, alignSelf: 'center' }} />
                    </FadeInView>

                    <Text
                        style={[
                            styles.title,
                            { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary },
                        ]}
                    >
                        {t("onboarding.testIntro.title")}
                    </Text>

                    <Text
                        style={[
                            styles.description,
                            { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary },
                        ]}
                    >
                        {t("onboarding.testIntro.description")}
                    </Text>

                    <Text
                        style={[
                            styles.instruction,
                            { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary },
                        ]}
                    >
                        {t("onboarding.testIntro.instruction")}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Button onPress={handleStart} size="large">
                        {t("onboarding.testIntro.start")}
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
        justifyContent: "center",
        alignItems: "center",
    },
    emoji: {
        fontSize: 80,
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h1,
        textAlign: "center",
        marginBottom: spacing.md,
    },
    description: {
        ...typography.h3,
        textAlign: "center",
        marginBottom: spacing.lg,
    },
    instruction: {
        ...typography.body,
        textAlign: "center",
        opacity: 0.7,
    },
    footer: {
        paddingBottom: spacing.lg,
    },
});
