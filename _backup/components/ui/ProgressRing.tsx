import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
    withTiming,
    useSharedValue,
    withDelay,
    Easing
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { colors } from '@/constants/theme';

interface ProgressRingProps {
    progress: number; // 0-1
    size?: number;
    strokeWidth?: number;
    color?: string;
    backgroundColor?: string;
    children?: React.ReactNode;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Apple Fitness+ Style Progress Ring
 * 
 * Displays a circular progress indicator with smooth animation.
 * Inspired by Apple's Activity Rings design.
 */
export function ProgressRing({
    progress,
    size = 120,
    strokeWidth = 12,
    color = colors.primary,
    backgroundColor = 'rgba(255, 255, 255, 0.1)',
    children
}: ProgressRingProps) {
    const animatedProgress = useSharedValue(0);

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const center = size / 2;

    useEffect(() => {
        animatedProgress.value = withDelay(
            200,
            withTiming(progress, {
                duration: 1000,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            })
        );
    }, [progress]);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = circumference * (1 - animatedProgress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} style={styles.svg}>
                {/* Background Circle */}
                <Circle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress Circle */}
                <AnimatedCircle
                    cx={center}
                    cy={center}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    rotation="-90"
                    origin={`${center}, ${center}`}
                />
            </Svg>
            {/* Center Content */}
            {children && (
                <View style={styles.centerContent}>
                    {children}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    svg: {
        position: 'absolute',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});
