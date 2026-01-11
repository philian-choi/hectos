import { View, StyleSheet, useColorScheme } from "react-native";
import { colors, borderRadius } from "@/constants/theme";

interface ProgressBarProps {
    progress: number; // 0 to 1
    height?: number;
}

export function ProgressBar({ progress, height = 8 }: ProgressBarProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const clampedProgress = Math.max(0, Math.min(1, progress));

    return (
        <View
            style={[
                styles.container,
                {
                    height,
                    backgroundColor: isDark ? colors.dark.border : colors.light.border,
                },
            ]}
        >
            <View
                style={[
                    styles.fill,
                    {
                        width: `${clampedProgress * 100}%`,
                        backgroundColor: colors.primary,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: borderRadius.full,
        overflow: "hidden",
    },
    fill: {
        height: "100%",
        borderRadius: borderRadius.full,
    },
});
