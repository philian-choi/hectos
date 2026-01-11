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

export default function TestResultScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { initialTestResult, currentColumn } = useUserStore();

    const getColumnDescription = () => {
        switch (currentColumn) {
            case 1:
                return t("onboarding.result.column1");
            case 2:
                return t("onboarding.result.column2");
            case 3:
                return t("onboarding.result.column3");
            default:
                return "";
        }
    };

    const handleStart = () => {
        router.push("/(auth)/purchase");
    };

    return (
        <SafeScreen>
            <View style={styles.container}>
                <View style={styles.content}>
                    <FadeInView delay={100}>
                        <Feather name="award" size={80} color={colors.primary} style={{ marginBottom: spacing.lg, alignSelf: 'center' }} />
                    </FadeInView>

                    <Text
                        style={[
                            styles.title,
                            { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary },
                        ]}
                    >
                        {t("onboarding.result.title")}
                    </Text>

                    {/* Result Card */}
                    <Card style={styles.resultCard}>
                        <Text style={styles.resultCount}>
                            {t("onboarding.result.count", { count: initialTestResult })}
                        </Text>
                    </Card>

                    {/* Column Assignment */}
                    <Text
                        style={[
                            styles.columnText,
                            { color: colors.primary },
                        ]}
                    >
                        {t("onboarding.result.columnAssigned", { column: currentColumn })}
                    </Text>

                    <Text
                        style={[
                            styles.description,
                            { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary },
                        ]}
                    >
                        {getColumnDescription()}
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Button onPress={handleStart} size="large">
                        {t("onboarding.result.startProgram")}
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
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h1,
        textAlign: "center",
        marginBottom: spacing.xl,
    },
    resultCard: {
        alignItems: "center",
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing["2xl"],
        marginBottom: spacing.xl,
    },
    resultCount: {
        fontSize: 48,
        fontWeight: "700",
        color: colors.primary,
    },
    columnText: {
        ...typography.h2,
        textAlign: "center",
        marginBottom: spacing.sm,
    },
    description: {
        ...typography.body,
        textAlign: "center",
    },
    footer: {
        paddingBottom: spacing.lg,
    },
});
