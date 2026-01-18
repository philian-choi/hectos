import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, AccessibilityRole, Platform } from "react-native";
import * as Haptics from "expo-haptics";
import { colors, borderRadius, spacing, typography } from "@/constants/theme";

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: "primary" | "secondary" | "ghost";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    style?: ViewStyle;
    accessibilityRole?: AccessibilityRole;
    accessibilityLabel?: string;
    accessibilityHint?: string;
}

export function Button({
    children,
    onPress,
    variant = "primary",
    size = "medium",
    disabled = false,
    style,
    accessibilityRole = "button",
    accessibilityLabel,
    accessibilityHint,
}: ButtonProps) {
    const getContainerStyle = (): ViewStyle => {
        const base: ViewStyle = {
            borderRadius: borderRadius.sm,
            alignItems: "center",
            justifyContent: "center",
        };

        // Size
        switch (size) {
            case "small":
                base.paddingVertical = spacing.sm;
                base.paddingHorizontal = spacing.md;
                break;
            case "large":
                base.paddingVertical = spacing.lg;
                base.paddingHorizontal = spacing.xl;
                break;
            default:
                base.paddingVertical = spacing.md;
                base.paddingHorizontal = spacing.lg;
        }

        // Variant
        switch (variant) {
            case "secondary":
                base.backgroundColor = "transparent";
                base.borderWidth = 2;
                base.borderColor = colors.primary;
                break;
            case "ghost":
                base.backgroundColor = "transparent";
                break;
            default:
                base.backgroundColor = disabled ? colors.light.textSecondary : colors.primary;
        }

        return base;
    };

    const getTextStyle = (): TextStyle => {
        const base: TextStyle = {
            fontWeight: "600",
        };

        // Size
        switch (size) {
            case "small":
                base.fontSize = typography.bodySmall.fontSize;
                break;
            case "large":
                base.fontSize = typography.h4.fontSize;
                break;
            default:
                base.fontSize = typography.body.fontSize;
        }

        // Variant
        switch (variant) {
            case "secondary":
            case "ghost":
                base.color = colors.primary;
                break;
            default:
                base.color = colors.white;
        }

        return base;
    };

    return (
        <Pressable
            onPress={(e) => {
                if (!disabled) {
                    if (Platform.OS !== 'web') {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    onPress();
                }
            }}
            disabled={disabled}
            accessibilityRole={accessibilityRole}
            accessibilityLabel={accessibilityLabel}
            accessibilityHint={accessibilityHint}
            style={({ pressed }) => [
                getContainerStyle(),
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                style,
            ]}
        >
            {typeof children === "string" ? (
                <Text style={getTextStyle()}>{children}</Text>
            ) : (
                children
            )}
        </Pressable>
    );
}
