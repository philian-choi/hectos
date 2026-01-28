import { View, Modal, useColorScheme, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated, { FadeIn, FadeInUp, SlideInUp } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { GlowButton } from "@/components/ui/GlowButton";
import { useUserStore } from "@/stores/useUserStore";

interface EncouragementModalProps {
    visible: boolean;
    onClose: () => void;
    type: "failure" | "smallWin" | "streak" | "weekRepeat";
    data?: {
        result?: number;
        target?: number;
        streak?: number;
        improvement?: number;
    };
}

/**
 * Encouragement Modal
 * 
 * Shows motivational messages based on context:
 * - After consecutive failures
 * - After small wins (+1 improvement)
 * - After reaching streaks
 * - When week repeat is recommended
 */
export function EncouragementModal({
    visible,
    onClose,
    type,
    data = {},
}: EncouragementModalProps) {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const { markEncouragementShown, consecutiveFailures } = useUserStore();

    const handleClose = () => {
        markEncouragementShown();
        onClose();
    };

    const getContent = () => {
        switch (type) {
            case "failure":
                return {
                    icon: "cloud-drizzle" as const, // Changed to Feather icon name
                    title: t("encouragement.failureTitle"),
                    message: consecutiveFailures >= 3
                        ? t("encouragement.keepTrying")
                        : t("encouragement.goodEffort"),
                    buttonText: t("encouragement.gotIt"),
                    gradient: ["#FFB800", "#FF8C00"],
                };
            case "smallWin":
                return {
                    icon: "trending-up" as const,
                    title: t("encouragement.smallWinTitle"),
                    message: t("encouragement.smallWinMessage", { count: data.improvement || 1 }),
                    buttonText: t("encouragement.awesome"),
                    gradient: ["#10B981", "#059669"],
                };
            case "streak":
                return {
                    icon: "activity" as const,
                    title: t("encouragement.streakTitle", { days: data.streak || 3 }),
                    message: t("encouragement.streakMessage"),
                    buttonText: t("encouragement.keepGoing"),
                    gradient: ["#F59E0B", "#D97706"],
                };
            case "weekRepeat":
                return {
                    icon: "refresh-cw" as const,
                    title: t("weekRepeat.title"),
                    message: t("weekRepeat.message", {
                        result: data.result || 0,
                        target: data.target || 0,
                        percentage: data.target ? Math.round(((data.result || 0) / data.target) * 100) : 0,
                    }),
                    buttonText: t("weekRepeat.repeat"),
                    secondaryButton: t("weekRepeat.continue"),
                    gradient: ["#3B82F6", "#2563EB"],
                };
            default:
                return {
                    icon: "thumbs-up" as const,
                    title: t("encouragement.default"),
                    message: "",
                    buttonText: t("common.ok"),
                    gradient: ["#FFB800", "#FF8C00"],
                };
        }
    };

    const content = getContent();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <Pressable
                className="flex-1 justify-center items-center"
                style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                onPress={handleClose}
            >
                <Pressable onPress={(e) => e.stopPropagation()}>
                    <Animated.View
                        entering={SlideInUp.duration(300)}
                        style={{
                            width: 320,
                            borderRadius: 28,
                            overflow: "hidden",
                        }}
                    >
                        <BlurView
                            intensity={isDark ? 60 : 80}
                            tint={isDark ? "dark" : "light"}
                            style={{ padding: 24 }}
                        >
                            {/* Icon Badge - Replaces Emoji */}
                            <View className="items-center mb-4">
                                <LinearGradient
                                    colors={content.gradient as any}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: 40,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        shadowColor: content.gradient[0],
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: 0.4,
                                        shadowRadius: 16,
                                        elevation: 8,
                                    }}
                                >
                                    <Feather name={content.icon} size={40} color="white" />
                                </LinearGradient>
                            </View>

                            {/* Title */}
                            <Text className="text-xl font-black text-foreground text-center mb-2">
                                {content.title}
                            </Text>

                            {/* Message */}
                            <Text className="text-sm text-muted-foreground text-center mb-6 leading-5">
                                {content.message}
                            </Text>

                            {/* Buttons */}
                            <View className="gap-3">
                                <GlowButton
                                    onPress={handleClose}
                                    title={content.buttonText}
                                    variant="primary"
                                    size="md"
                                    glow={false}
                                />
                                {content.secondaryButton && type === "weekRepeat" && (
                                    <Pressable
                                        onPress={handleClose}
                                        className="py-3"
                                    >
                                        <Text className="text-center text-sm text-muted-foreground font-medium">
                                            {content.secondaryButton}
                                        </Text>
                                    </Pressable>
                                )}
                            </View>
                        </BlurView>
                    </Animated.View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

/**
 * Hook to determine what encouragement to show
 */
export function useEncouragement() {
    const {
        consecutiveFailures,
        lastEncouragementDate,
        personalBest,
        exhaustionTests,
        completedSessions,
    } = useUserStore();

    const today = new Date().toISOString().split('T')[0];
    const shouldShow = lastEncouragementDate !== today;

    // Get the last improvement
    const getImprovement = (): number => {
        if (exhaustionTests.length < 2) return 0;
        const sorted = [...exhaustionTests].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return sorted[0].result - sorted[1].result;
    };

    const improvement = getImprovement();

    return {
        shouldShowEncouragement: shouldShow && (consecutiveFailures >= 2 || improvement > 0),
        type: consecutiveFailures >= 2
            ? "failure" as const
            : improvement > 0
                ? "smallWin" as const
                : null,
        improvement,
    };
}
