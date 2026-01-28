import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    Easing,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { colors } from '@/constants/theme';

interface CircularProgressProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
}

export function CircularProgress({
    progress,
    size = 100,
    strokeWidth = 10,
    color = colors.primary,
    backgroundColor = 'rgba(255,255,255,0.2)',
    children
}: CircularProgressProps) {
    const animatedProgress = useSharedValue(0);
    const radius = size / 2;
    const halfSize = size / 2;

    useEffect(() => {
        animatedProgress.value = withTiming(Math.min(Math.max(progress, 0), 1), {
            duration: 1000,
            easing: Easing.out(Easing.cubic),
        });
    }, [progress]);

    // We use two semi-circles to create the full circle
    // First half covers 0-50%, Second half covers 50-100%

    // Rotation logic
    // 0% -> 0deg
    // 50% -> 180deg
    // 100% -> 360deg

    const firstHalfStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            animatedProgress.value,
            [0, 0.5, 1],
            [0, 180, 180],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ rotate: `${rotate}deg` }],
        };
    });

    const secondHalfStyle = useAnimatedStyle(() => {
        const rotate = interpolate(
            animatedProgress.value,
            [0, 0.5, 1],
            [0, 0, 180],
            Extrapolate.CLAMP
        );
        return {
            transform: [{ rotate: `${rotate}deg` }],
            opacity: animatedProgress.value > 0.5 ? 1 : 0, // Hide until needed
        };
    });

    return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            {/* Background Circle */}
            <View
                style={{
                    width: size,
                    height: size,
                    borderRadius: radius,
                    borderWidth: strokeWidth,
                    borderColor: backgroundColor,
                    position: 'absolute',
                }}
            />

            {/* Left Half Container (Everything > 50%) */}
            <View style={{ width: size, height: size, position: 'absolute', overflow: 'hidden' }}>
                {/* Mask for right half */}
                <View style={{ width: halfSize, height: size, overflow: 'hidden', position: 'absolute', left: 0 }}>
                    <Animated.View
                        style={[
                            {
                                width: size,
                                height: size,
                                borderRadius: radius,
                                borderWidth: strokeWidth,
                                borderColor: color,
                                borderRightColor: 'transparent',
                                borderBottomColor: 'transparent',
                                transform: [{ rotate: '45deg' }] // Adjust starting point
                            },
                            // This logic is tricky without SVG.
                            // Simplified approach: Revert to basic Border Visualization or install SVG.
                            // Since we promised NO SVG, let's try a simpler reliable trick:
                            // Two half-circles.
                        ]}
                    />
                </View>
            </View>

            {/* 
               Attempting complex CSS geometry for circles is prone to bugs across Android/iOS without SVG.
               Let's pivot to a "Conic Gradient" simulation or just use a standard library if possible.
               Wait, "react-native-svg" is standard in Expo. Is it really not in package.json?
               Double check.
            */}

            {children}
        </View>
    );
}
