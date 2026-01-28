import { useState, useCallback, useRef, useEffect } from "react";
import { View, StyleSheet, Pressable, useColorScheme, Alert } from "react-native";
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
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/useUserStore";
import { useFaceDetector } from "@/hooks/useFaceDetector";
import { colors, spacing, typography } from "@/constants/theme";

export default function InitialTestScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { setInitialTestResult, vibrationEnabled } = useUserStore();

    const [count, setCount] = useState(0);
    const [milestoneReached, setMilestoneReached] = useState(false);
    const scale = useSharedValue(1);
    const [debugInfo, setDebugInfo] = useState("");
    const [isSensorActive, setIsSensorActive] = useState(false);
    const [showPermissionHint, setShowPermissionHint] = useState(false);

    // Show permission hint after 3 seconds if sensor isn't active
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isSensorActive) {
                setShowPermissionHint(true);
            }
        }, 3000);
        return () => clearTimeout(timer);
    }, [isSensorActive]);

    // --- Auto Counter Hook --- //
    const { hasFace, isAvailable, isDown, FaceCountCamera, permission, requestPermission } = useFaceDetector({
        enabled: true,
        vibrationEnabled,
        onDown: () => {
            if (vibrationEnabled) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
        },
        onUp: () => {
            handleTap();
        },
    });

    useEffect(() => {
        if (permission === false && requestPermission) {
            requestPermission();
        }
        if (permission) {
            setIsSensorActive(true);
            setShowPermissionHint(false);
        }
    }, [permission]);

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
        setCount((prev) => {
            const next = prev + 1;
            if (next === 10 && !milestoneReached) {
                setMilestoneReached(true);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            return next;
        });
    };

    const handleDone = () => {
        setInitialTestResult(count);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (count >= 1) {
            router.replace("/(auth)/test-result");
        } else {
            Alert.alert(t("common.confirm"), t("onboarding.test.confirmZero"), [
                { text: t("common.cancel"), style: "cancel" },
                { text: t("common.ok"), onPress: () => router.replace("/(auth)/test-result") }
            ]);
        }
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <SafeScreen>
            <View className="flex-1">
                {/* Header */}
                <View className="p-6 items-center">
                    <Text className="text-base text-muted-foreground font-medium mb-4">
                        {t("onboarding.test.title")}
                    </Text>
                    {isSensorActive && (
                        <View style={{ width: 100, height: 130, borderRadius: 12, overflow: 'hidden', borderWidth: 2, borderColor: hasFace ? '#10B981' : '#333', backgroundColor: '#000' }}>
                            <FaceCountCamera style={{ flex: 1 }} />
                        </View>
                    )}
                </View>

                {/* Counter - Full screen tap area */}
                <Pressable className="flex-1 justify-center items-center" onPress={handleTap}>
                    <Animated.View style={[animatedStyle, { alignItems: 'center', paddingHorizontal: 20 }]}>
                        {milestoneReached && (
                            <Text className="text-lg font-bold text-primary mb-2 text-center">{t("onboarding.test.milestoneReached")}</Text>
                        )}
                        <Text
                            className="text-9xl font-bold text-foreground font-variant-tabular-nums"
                            style={{ fontSize: 150 }}
                        >
                            {count}
                        </Text>

                        {!isSensorActive && showPermissionHint ? (
                            <View className="mt-5 items-center px-6">
                                <Text className="text-sm text-center leading-5 mb-4 text-muted-foreground">{t("onboarding.test.cameraRequired")}</Text>
                                <Pressable
                                    className="py-2.5 px-5 bg-primary/10 rounded-xl border border-primary"
                                    onPress={() => {/* In real app: Linking.openSettings() */ }}
                                >
                                    <Text className="text-primary font-bold text-sm">{t("onboarding.test.openSettings")}</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <Text className={cn(
                                "text-sm font-medium text-center opacity-60 mt-2.5",
                                isDark ? "text-muted-foreground" : "text-muted-foreground"
                            )}>
                                {isSensorActive
                                    ? t("onboarding.test.sensorHint")
                                    : t("onboarding.test.tapHint")}
                            </Text>
                        )}
                    </Animated.View>
                </Pressable>

                {/* Footer */}
                <View className="p-6 gap-2">
                    <Text className="text-xs text-center mb-1 text-muted-foreground">
                        {count > 0 ? t("onboarding.test.footerHintActive") : t("onboarding.test.footerHintInactive")}
                    </Text>
                    <Button onPress={handleDone} size="lg" variant={count > 0 ? "default" : "secondary"}>
                        <Text className={cn(
                            "font-bold",
                            count > 0 ? "text-primary-foreground" : "text-secondary-foreground"
                        )}>
                            {t("onboarding.test.done")}
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeScreen>
    );
}

const styles = {};
