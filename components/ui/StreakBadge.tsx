import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    useSharedValue,
    withDelay
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Feather } from '@expo/vector-icons';
import { colors, spacing } from '@/constants/theme';

interface StreakBadgeProps {
    days: number;
    size?: 'small' | 'medium' | 'large';
    animated?: boolean;
}

/**
 * Streak Badge Component
 * 
 * Displays the user's consecutive workout days with a fire icon and glow effect.
 * Inspired by Duolingo and Strava streak displays.
 */
export function StreakBadge({
    days,
    size = 'medium',
    animated = true
}: StreakBadgeProps) {
    const scale = useSharedValue(1);
    const glowOpacity = useSharedValue(0.3);

    const sizeConfig = {
        small: { iconSize: 14, fontSize: 12, padding: 6, gap: 4 },
        medium: { iconSize: 18, fontSize: 16, padding: 10, gap: 6 },
        large: { iconSize: 24, fontSize: 20, padding: 14, gap: 8 },
    };

    const config = sizeConfig[size];

    useEffect(() => {
        if (animated && days > 0) {
            // Pulse animation
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.05, { duration: 1000 }),
                    withTiming(1, { duration: 1000 })
                ),
                -1,
                true
            );

            // Glow animation
            glowOpacity.value = withRepeat(
                withSequence(
                    withTiming(0.6, { duration: 1500 }),
                    withTiming(0.3, { duration: 1500 })
                ),
                -1,
                true
            );
        }
    }, [animated, days]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    if (days <= 0) {
        return null;
    }

    return (
        <Animated.View style={[styles.container, animatedStyle]}>
            {/* Glow Effect */}
            <Animated.View style={[styles.glow, glowStyle]} />

            {/* Badge Content */}
            <View style={[
                styles.badge,
                {
                    paddingHorizontal: config.padding,
                    paddingVertical: config.padding - 2,
                    gap: config.gap,
                }
            ]}>
                <Text style={styles.fireIcon}>🔥</Text>
                <Text style={[styles.daysText, { fontSize: config.fontSize }]}>
                    {days}일
                </Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    glow: {
        position: 'absolute',
        top: -4,
        left: -4,
        right: -4,
        bottom: -4,
        borderRadius: 20,
        backgroundColor: '#FF6B35',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 107, 53, 0.2)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 53, 0.4)',
    },
    fireIcon: {
        fontSize: 16,
    },
    daysText: {
        color: '#FF6B35',
        fontWeight: '800',
    },
});
