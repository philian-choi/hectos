import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, borderRadius } from "@/constants/theme";

interface FaceIndicatorProps {
    hasFace: boolean;
    isAvailable: boolean;
    style?: any;
}

export function FaceIndicator({ hasFace, isAvailable, style }: FaceIndicatorProps) {
    if (!isAvailable) {
        // Show warning/error state
        return (
            <View style={[styles.container, styles.error, style]}>
                <Feather name="camera-off" size={14} color={colors.white} />
            </View>
        );
    }

    return (
        <View style={[
            styles.container,
            hasFace ? styles.active : styles.inactive,
            style
        ]}>
            <Feather
                name="smile"
                size={14}
                color={hasFace ? colors.white : colors.gray[500]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
    },
    active: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondaryDark,
    },
    inactive: {
        backgroundColor: "transparent",
        borderColor: colors.gray[300],
    },
    error: {
        backgroundColor: colors.error,
        borderColor: colors.error,
    }
});
