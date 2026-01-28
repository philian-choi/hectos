import { useState } from "react";
import { View, StyleSheet, Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import * as Haptics from "expo-haptics";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring
} from "react-native-reanimated";

import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useUserStore } from "@/stores/useUserStore";
import { colors } from "@/constants/theme";

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

        // Navigate to result screen for feedback
        router.replace("/workout/exhaustion-result");
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <SafeScreen edges={["top", "bottom"]}>
            <View className="flex-1">
                <View className="p-6 items-center">
                    <Text className="text-2xl font-bold mb-1 text-foreground">
                        {t("progress.exhaustionTest")}
                    </Text>
                    <Text className="text-base font-normal opacity-70 text-muted-foreground">
                        {t("progress.week", { week: currentWeek })}
                    </Text>
                </View>

                <Pressable className="flex-1 justify-center items-center" onPress={handleTap}>
                    <Animated.View style={animatedStyle}>
                        <Text className="text-9xl font-extrabold font-variant-tabular-nums text-foreground" style={{ fontSize: 140 }}>
                            {count}
                        </Text>
                        <Text className="text-xl font-medium text-center opacity-60 mt-4 text-muted-foreground">
                            {t("workout.max")}
                        </Text>
                    </Animated.View>
                </Pressable>

                <View className="p-6 gap-6">
                    <Text className="text-center opacity-70 text-muted-foreground">
                        {t("onboarding.testIntro.instruction")}
                    </Text>
                    <Button onPress={handleDone} size="lg" className="mb-6 w-full h-14 rounded-full">
                        <Text className="text-lg font-bold">
                            {t("common.done")}
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeScreen>
    );
}


