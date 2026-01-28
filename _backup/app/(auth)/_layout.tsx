import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="welcome" />
            <Stack.Screen name="initial-test-intro" />
            <Stack.Screen name="initial-test" />
            <Stack.Screen name="test-result" />
            <Stack.Screen name="purchase" />
        </Stack>
    );
}
