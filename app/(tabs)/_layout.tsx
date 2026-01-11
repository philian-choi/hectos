import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

export default function TabsLayout() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

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
                    tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: t("tabs.progress"),
                    tabBarLabel: t("tabs.progress"),
                    tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t("tabs.settings"),
                    tabBarLabel: t("tabs.settings"),
                    tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
