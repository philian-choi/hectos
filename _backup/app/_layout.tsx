import "@/global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import "../lib/i18n";
import { ErrorBoundary } from '@/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

// [THEME] Dynamic Mode handled by system
// import { Appearance } from "react-native";
// Appearance.setColorScheme("dark");

export default function RootLayout() {
    const { colorScheme } = useColorScheme();

    const [loaded, error] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
    });

    if (__DEV__) console.log("RootLayout rendering. loaded:", loaded, "error:", error);

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <ThemeProvider value={NAV_THEME[colorScheme === "dark" || colorScheme === "light" ? colorScheme : "light"]}>
            <ErrorBoundary>
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        animation: "slide_from_right",
                    }}
                >
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                    <Stack.Screen
                        name="workout"
                        options={{
                            presentation: "fullScreenModal",
                            animation: "slide_from_bottom",
                        }}
                    />
                </Stack>
                <PortalHost />
            </ErrorBoundary>
        </ThemeProvider>
    );
}
