import { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { TabIcon } from "@/components/ui/TabIcon";
import { useUserStore } from "@/stores/useUserStore";

export default function TabsLayout() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { hasPurchased, hasCompletedOnboarding } = useUserStore();

    // Redirect to onboarding if not completed
    useEffect(() => {
        if (!hasCompletedOnboarding) {
            router.replace("/(auth)/welcome");
        }
    }, [hasCompletedOnboarding]);

    // Don't render tabs until onboarding check is done
    if (!hasCompletedOnboarding) {
        return null;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
                tabBarStyle: {
                    backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
                    borderTopColor: isDark ? colors.dark.border : colors.light.border,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t("tabs.home"),
                    tabBarLabel: t("tabs.home"),
                    tabBarIcon: ({ color, size, focused }) => <TabIcon name="home" size={size} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: t("tabs.progress"),
                    tabBarLabel: t("tabs.progress"),
                    tabBarIcon: ({ color, size, focused }) => <TabIcon name="bar-chart-2" size={size} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t("tabs.settings"),
                    tabBarLabel: t("tabs.settings"),
                    tabBarIcon: ({ color, size, focused }) => <TabIcon name="settings" size={size} color={color} focused={focused} />,
                }}
            />
        </Tabs>
    );
}
