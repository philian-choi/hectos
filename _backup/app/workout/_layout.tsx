import { Stack } from 'expo-router';

export default function WorkoutLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="[session]" />
            <Stack.Screen name="exhaustion-test" />
            <Stack.Screen name="exhaustion-result" />
            <Stack.Screen name="final-test" />
            <Stack.Screen name="final-result" />
            <Stack.Screen name="micro-challenge" />
            <Stack.Screen name="micro-result" />
        </Stack>
    );
}
