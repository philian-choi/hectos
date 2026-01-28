import { Pressable, View, ViewStyle } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface GlowButtonProps {
    onPress: () => void;
    title: string;
    subtitle?: string;
    icon?: React.ReactNode | string; // Can be a component or Feather icon name
    variant?: "primary" | "secondary" | "success" | "locked";
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    disabled?: boolean;
    glow?: boolean;
}

const VARIANTS = {
    primary: {
        gradient: ["#FFB800", "#FF8C00"] as const,
        glowColor: "rgba(255, 184, 0, 0.4)",
        textColor: "#1a1a1a",
    },
    secondary: {
        gradient: ["#3B82F6", "#2563EB"] as const,
        glowColor: "rgba(59, 130, 246, 0.4)",
        textColor: "#ffffff",
    },
    success: {
        gradient: ["#10B981", "#059669"] as const,
        glowColor: "rgba(16, 185, 129, 0.4)",
        textColor: "#ffffff",
    },
    locked: {
        gradient: ["#64748B", "#475569"] as const,
        glowColor: "rgba(100, 116, 139, 0.2)",
        textColor: "#ffffff",
    },
};

const SIZES = {
    sm: { height: 44, paddingHorizontal: 20, fontSize: 14, borderRadius: 12 },
    md: { height: 52, paddingHorizontal: 24, fontSize: 16, borderRadius: 14 },
    lg: { height: 60, paddingHorizontal: 32, fontSize: 18, borderRadius: 16 },
    xl: { height: 72, paddingHorizontal: 40, fontSize: 22, borderRadius: 20 },
};

export function GlowButton({
    onPress,
    title,
    subtitle,
    icon,
    variant = "primary",
    size = "lg",
    className,
    disabled = false,
    glow = true,
}: GlowButtonProps) {
    const scale = useSharedValue(1);
    const pressed = useSharedValue(0);

    const variantStyle = VARIANTS[variant];
    const sizeStyle = SIZES[size];

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: withTiming(pressed.value === 1 ? 0.8 : 0.5, { duration: 150 }),
        transform: [{ scale: withSpring(pressed.value === 1 ? 1.1 : 1) }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
        pressed.value = 1;
        if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, { damping: 15, stiffness: 400 });
        pressed.value = 0;
    };

    const handlePress = () => {
        if (!disabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress();
        }
    };

    return (
        <Animated.View style={animatedStyle} className={className}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handlePress}
                disabled={disabled}
            >
                {/* Glow Effect */}
                {glow && !disabled && (
                    <Animated.View
                        style={[
                            glowStyle,
                            {
                                position: "absolute",
                                top: -8,
                                left: -8,
                                right: -8,
                                bottom: -8,
                                borderRadius: sizeStyle.borderRadius + 8,
                                backgroundColor: variantStyle.glowColor,
                            },
                        ]}
                    />
                )}

                {/* Button Body */}
                <LinearGradient
                    colors={variantStyle.gradient as any}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        height: sizeStyle.height,
                        paddingHorizontal: sizeStyle.paddingHorizontal,
                        borderRadius: sizeStyle.borderRadius,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 12,
                        // 3D Effect
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 8,
                    }}
                >
                    {icon && (
                        typeof icon === "string"
                            ? <Feather name={icon as any} size={sizeStyle.fontSize + 2} color={variantStyle.textColor} />
                            : icon
                    )}
                    <View style={{ alignItems: subtitle ? "flex-start" : "center" }}>
                        <Text
                            style={{
                                fontSize: sizeStyle.fontSize,
                                fontWeight: "800",
                                color: variantStyle.textColor,
                                letterSpacing: 1,
                            }}
                        >
                            {title}
                        </Text>
                        {subtitle && (
                            <Text
                                style={{
                                    fontSize: sizeStyle.fontSize * 0.7,
                                    fontWeight: "500",
                                    color: variantStyle.textColor,
                                    opacity: 0.8,
                                    marginTop: 2,
                                }}
                            >
                                {subtitle}
                            </Text>
                        )}
                    </View>
                </LinearGradient>
            </Pressable>
        </Animated.View>
    );
}
