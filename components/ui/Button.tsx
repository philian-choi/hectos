import { Pressable, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { colors, borderRadius, spacing } from "@/constants/theme";

interface ButtonProps {
    children: React.ReactNode;
    onPress: () => void;
    variant?: "primary" | "secondary" | "ghost";
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    style?: ViewStyle;
}

export function Button({
    children,
    onPress,
    variant = "primary",
    size = "medium",
    disabled = false,
    style,
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
                base.fontSize = 14;
                break;
            case "large":
                base.fontSize = 18;
                break;
            default:
                base.fontSize = 16;
        }

        // Variant
        switch (variant) {
            case "secondary":
            case "ghost":
                base.color = colors.primary;
                break;
            default:
                base.color = "#FFFFFF";
        }

        return base;
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
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
