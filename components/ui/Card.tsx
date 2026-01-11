import { View, StyleSheet, ViewStyle, useColorScheme } from "react-native";
import { ReactNode } from "react";
import { colors, borderRadius, spacing } from "@/constants/theme";

interface CardProps {
    children: ReactNode;
    style?: import("react-native").StyleProp<import("react-native").ViewStyle>;
}

export function Card({ children, style }: CardProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: isDark ? colors.dark.surface : colors.light.surface,
                    borderColor: isDark ? colors.dark.border : colors.light.border,
                },
                style,
            ]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.md,
        borderWidth: 1,
        padding: spacing.md,
    },
});
