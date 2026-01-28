import { View, StyleSheet } from "react-native";
import { colors, spacing, borderRadius } from "@/constants/theme";

interface WeeklyMiniChartProps {
    data: number[]; // 7 days data
    max: number;
    color?: string;
}

export function WeeklyMiniChart({ data, max, color = colors.white }: WeeklyMiniChartProps) {
    // If max is 0, avoid division by zero
    const safeMax = max > 0 ? max : 1;

    return (
        <View style={styles.container}>
            {data.map((value, index) => {
                // Min height 4px for visibility if value > 0
                const percent = (value / safeMax) * 100;

                return (
                    <View key={index} style={styles.barContainer}>
                        <View style={[
                            styles.bar,
                            {
                                height: `${Math.max(percent, value > 0 ? 10 : 0)}%`,
                                backgroundColor: value > 0 ? color : 'rgba(0,0,0,0.05)',
                                opacity: value > 0 ? 1 : 1
                            }
                        ]} />
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 48,
        gap: spacing.sm - 2, // 6px
        flex: 1,
    },
    barContainer: {
        flex: 1,
        height: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bar: {
        width: spacing.sm,
        borderRadius: borderRadius.xs,
    }
});
