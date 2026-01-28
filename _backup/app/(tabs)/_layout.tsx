import { useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useColorScheme, Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { colors, spacing } from "@/constants/theme";
import { TabIcon } from "@/components/ui/TabIcon";
import { useUserStore } from "@/stores/useUserStore";

export default function TabsLayout() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { hasCompletedOnboarding } = useUserStore();

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
                tabBarShowLabel: false, // Cleaner look without labels
                tabBarStyle: styles.tabBar,
                tabBarBackground: () => (
                    Platform.OS === 'ios' ? (
                        <BlurView
                            tint={isDark ? "dark" : "light"}
                            intensity={80}
                            style={StyleSheet.absoluteFill}
                        />
                    ) : (
                        <View style={[StyleSheet.absoluteFill, {
                            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)'
                        }]} />
                    )
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t("tabs.home"),
                    tabBarIcon: ({ color, size, focused }) => <TabIcon name="home" size={size} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="progress"
                options={{
                    title: t("tabs.progress"),
                    tabBarIcon: ({ color, size, focused }) => <TabIcon name="bar-chart-2" size={size} color={color} focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t("tabs.settings"),
                    tabBarIcon: ({ color, size, focused }) => <TabIcon name="settings" size={size} color={color} focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 24,
        left: 20,
        right: 20,
        height: 64,
        borderRadius: 32,
        backgroundColor: Platform.OS === 'android' ? 'transparent' : 'transparent', // BlurView handles bg
        borderTopWidth: 0,
        elevation: 0, // Remove default shadow to add custom one via shadow props below doesn't work well on Tabs, need container
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        // For Android elevation in absolute tab bar
        ...Platform.select({
            android: {
                elevation: 8,
            }
        })
    }
});
