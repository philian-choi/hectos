import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Badge, BADGES } from '@/constants/badges';
import { colors, spacing, typography } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface BadgeGridProps {
    earnedBadgeIds: string[];
    onBadgePress?: (badge: Badge) => void;
}

export function BadgeGrid({ earnedBadgeIds, onBadgePress }: BadgeGridProps) {
    // Group badges by tier for visual hierarchy if needed, 
    // but for now just grid display

    const getBadgeStyle = (tier: Badge['tier']): [string, string, ...string[]] => {
        switch (tier) {
            case 'platinum': return ['#E5E4E2', '#B3B3B3'];
            case 'gold': return ['#FFD700', '#FDB931'];
            case 'silver': return ['#C0C0C0', '#A9A9A9'];
            case 'bronze': return ['#CD7F32', '#8B4513'];
            default: return ['#333', '#111'];
        }
    };

    return (
        <View style={styles.grid}>
            {BADGES.map((badge, index) => {
                const isUnlocked = earnedBadgeIds.includes(badge.id);
                const gradientColors = isUnlocked
                    ? getBadgeStyle(badge.tier)
                    : ['#1F2937', '#111827']; // Dark gray for locked

                return (
                    <Animated.View
                        key={badge.id}
                        entering={FadeInDown.delay(index * 50)}
                        style={styles.badgeWrapper}
                    >
                        <TouchableOpacity
                            onPress={() => onBadgePress?.(badge)}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={gradientColors as any}
                                style={[styles.badgeContainer, !isUnlocked && styles.lockedBadge]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={[styles.icon, !isUnlocked && styles.lockedIcon]}>
                                    {badge.icon}
                                </Text>
                                {!isUnlocked && (
                                    <View style={styles.lockOverlay}>
                                        <Text style={styles.lockIcon}>🔒</Text>
                                    </View>
                                )}
                            </LinearGradient>
                            <Text style={[styles.badgeTitle, !isUnlocked && styles.lockedText]} numberOfLines={1}>
                                {badge.title}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'center', // Center grid items
        paddingVertical: spacing.md,
    },
    badgeWrapper: {
        width: '30%', // 3 columns approx
        aspectRatio: 0.8,
        alignItems: 'center',
    },
    badgeContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xs,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    lockedBadge: {
        opacity: 0.5,
        borderWidth: 1,
        borderColor: '#333',
    },
    icon: {
        fontSize: 32,
    },
    lockedIcon: {
        opacity: 0.3,
        filter: 'grayscale(100%)', // Web only, but good intent
    },
    lockOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#000',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockIcon: {
        fontSize: 12,
    },
    badgeTitle: {
        ...typography.caption,
        textAlign: 'center',
        color: colors.gray[100],
        fontSize: 11,
        fontWeight: '600',
    },
    lockedText: {
        color: colors.gray[500],
    },
});
