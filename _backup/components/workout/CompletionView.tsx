
import React, { useEffect, useRef } from 'react';
import { View, Share, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { colors } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { GlowButton } from '@/components/ui/GlowButton';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { StreakBadge } from '@/components/ui/StreakBadge';
import { useUserStore, calculateStreak } from '@/stores/useUserStore';

interface CompletionViewProps {
    completedReps: number[];
    targetTotal?: number;
    onGoHome: () => void;
    isDark: boolean;
    currentDay?: number;
    currentWeek?: number;
}

const { width } = Dimensions.get('window');

export function CompletionView({ completedReps, targetTotal = 0, onGoHome, isDark, currentDay = 1, currentWeek = 1 }: CompletionViewProps) {
    const { t } = useTranslation();
    const router = useRouter();
    const total = completedReps.reduce((a, b) => a + b, 0);
    const { completedSessions } = useUserStore();
    const confettiRef = useRef<ConfettiCannon>(null);

    // Calculate streak (assuming this session is already added or will be added)
    // We import calculating logic or just use current session list
    const streak = calculateStreak(completedSessions);

    useEffect(() => {
        // Force start confetti
        setTimeout(() => {
            confettiRef.current?.start();
        }, 100);
    }, []);

    const handleShare = async () => {
        try {
            await Share.share({
                message: t("workout.complete.shareMessage", { count: total }) + " #Hectos #Pushups"
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View className="flex-1 justify-center">
            {/* Full Screen Confetti */}
            <ConfettiCannon
                ref={confettiRef}
                count={200}
                origin={{ x: -10, y: 0 }}
                autoStart={false} // Managed manually
                fadeOut={true}
                fallSpeed={3000}
            />

            <View className="flex-1 items-center justify-center p-6 z-10">
                {/* Header Animation */}
                <Animated.View entering={FadeInDown.delay(300).springify()} className="items-center mb-12">
                    <View className="w-24 h-24 rounded-full bg-green-500 justify-center items-center mb-6 shadow-xl shadow-green-500/40">
                        <Feather name="check" size={48} color={colors.white} />
                    </View>
                    <Text className="text-4xl text-center leading-10 font-black tracking-tighter text-foreground">
                        {t("workout.complete.title")}
                    </Text>
                </Animated.View>

                {/* Glassmorphism Stats Card */}
                <Animated.View entering={ZoomIn.delay(500)} className="w-full rounded-3xl overflow-hidden mb-8 shadow-lg">
                    <BlurView intensity={isDark ? 20 : 40} tint={isDark ? 'dark' : 'light'} className="flex-row p-6 justify-around items-center w-full">
                        <View className="items-center gap-1">
                            <Text className="text-xs font-bold text-muted-foreground tracking-widest">{t("workout.complete.totalPushups").toUpperCase()}</Text>
                            <Text className="text-4xl font-extrabold text-primary font-variant-tabular-nums">{total}</Text>
                        </View>
                        <View className="w-px h-10 bg-muted-foreground/20" />
                        <View className="items-center gap-1">
                            <Text className="text-xs font-bold text-muted-foreground tracking-widest">{t("workout.complete.setsDone").toUpperCase()}</Text>
                            <Text className="text-4xl font-extrabold text-primary font-variant-tabular-nums">{completedReps.length}</Text>
                        </View>
                    </BlurView>
                </Animated.View>

                {/* Streak Badge (if active) */}
                {streak > 0 && (
                    <Animated.View entering={FadeInUp.delay(800)} className="mb-8">
                        <StreakBadge days={streak} size="large" />
                    </Animated.View>
                )}

                <View className="flex-1" />

                {/* Actions with Button */}
                <Animated.View entering={FadeInUp.delay(1000)} className="w-full gap-4 mb-8">
                    {/* Exhaustion Test Button - Day 3 only */}
                    {currentDay === 3 && (
                        <GlowButton
                            onPress={() => router.push("/workout/exhaustion-test")}
                            title={t("progress.exhaustionTest")}
                            subtitle={`Week ${currentWeek} - ${t("workout.max")}`}
                            variant="success"
                            size="lg"
                            glow={true}
                            icon="activity"
                        />
                    )}

                    <Button onPress={onGoHome} size="lg" className="w-full h-14 rounded-full">
                        <Text className="text-lg font-bold">{t("workout.complete.goHome")}</Text>
                    </Button>

                    <Button onPress={handleShare} variant="ghost" className="flex-row items-center justify-center gap-2 p-3">
                        <Feather name="share" size={20} color={isDark ? colors.gray[400] : colors.gray[600]} />
                        <Text className="text-base font-semibold text-muted-foreground">
                            {t("workout.complete.share")}
                        </Text>
                    </Button>
                </Animated.View>
            </View>
        </View>
    );
}


