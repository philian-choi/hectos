import { ReactNode } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";

interface SafeScreenProps {
    children: ReactNode;
    edges?: ("top" | "bottom" | "left" | "right")[];
}

export function SafeScreen({ children, edges = ["top"] }: SafeScreenProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <SafeAreaView
            edges={edges}
            style={[
                styles.container,
                { backgroundColor: isDark ? colors.dark.background : colors.light.background },
            ]}
        >
            <View style={styles.content}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
