import { View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { cn } from "@/lib/utils";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: number;
    tint?: "light" | "dark" | "default";
    borderGradient?: boolean;
    style?: ViewStyle;
}

/**
 * Premium Glassmorphism Card Component
 * 
 * Features:
 * - Blur effect background
 * - Optional gradient border
 * - Customizable intensity
 * - Works on both iOS and Android
 */
export function GlassCard({
    children,
    className,
    intensity = 40,
    tint = "dark",
    borderGradient = true,
    style,
}: GlassCardProps) {
    return (
        <View
            className={cn("overflow-hidden rounded-3xl", className)}
            style={[
                {
                    borderWidth: borderGradient ? 1 : 0,
                    borderColor: "rgba(255, 255, 255, 0.1)",
                },
                style,
            ]}
        >
            <BlurView
                intensity={intensity}
                tint={tint}
                style={{
                    padding: 24,
                    backgroundColor:
                        tint === "dark"
                            ? "rgba(0, 0, 0, 0.3)"
                            : "rgba(255, 255, 255, 0.3)",
                }}
            >
                {/* Gradient Highlight */}
                <LinearGradient
                    colors={[
                        "rgba(255, 255, 255, 0.15)",
                        "rgba(255, 255, 255, 0.02)",
                        "transparent",
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 80,
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                    }}
                />
                {children}
            </BlurView>
        </View>
    );
}
