import { useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, useWindowDimensions, Animated, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { Button } from "@/components/ui/Button";
import { colors, spacing, typography } from "@/constants/theme";

export default function WelcomeScreen() {
    const { t } = useTranslation();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const SLIDES = [
        {
            id: "1",
            icon: "activity",
            title: "6 Weeks Challenge",
            description: "Transform your strength with our scientifically designed 6-week program."
        },
        {
            id: "2",
            icon: "camera",
            title: "Auto Detection",
            description: "Place your phone on the floor. Our smart camera counts your pushups automatically."
        },
        {
            id: "3",
            icon: "trending-up",
            title: "Track Progress",
            description: "Take a simple test to find your level and watch your stats grow."
        }
    ];

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.push("/(auth)/initial-test-intro");
        }
    };

    const handleSkip = () => {
        router.push("/(auth)/initial-test-intro");
    };

    const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
        return (
            <View style={[styles.slide, { width }]}>
                <View style={styles.iconContainer}>
                    <Feather name={item.icon as any} size={80} color={colors.primary} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeScreen>
            <View style={styles.container}>
                <View style={styles.header}>
                    {/* Skip Button (Only show if not last slide) */}
                    {currentIndex < SLIDES.length - 1 && (
                        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                            <Text style={styles.skipText}>{t("common.skip")}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <Animated.FlatList
                    ref={flatListRef}
                    data={SLIDES}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    onViewableItemsChanged={useRef(({ viewableItems }: any) => {
                        if (viewableItems[0]) {
                            setCurrentIndex(viewableItems[0].index || 0);
                        }
                    }).current}
                    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                    scrollEventThrottle={32}
                />

                <View style={styles.footer}>
                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {SLIDES.map((_, index) => {
                            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
                            const dotWidth = scrollX.interpolate({
                                inputRange,
                                outputRange: [8, 24, 8],
                                extrapolate: 'clamp',
                            });
                            const opacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp',
                            });

                            return (
                                <Animated.View
                                    key={index.toString()}
                                    style={[styles.dot, { width: dotWidth, opacity, backgroundColor: colors.primary }]}
                                />
                            );
                        })}
                    </View>

                    <Button onPress={handleNext} size="large" style={styles.button}>
                        {currentIndex === SLIDES.length - 1 ? t("onboarding.welcome.start") : t("common.next")}
                    </Button>
                </View>
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.light.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: spacing.lg,
        height: 50,
        alignItems: 'center',
    },
    skipButton: {
        padding: spacing.sm,
    },
    skipText: {
        ...typography.bodySmall,
        color: colors.light.textSecondary,
        fontWeight: '600',
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    iconContainer: {
        marginBottom: spacing.xl * 2,
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: 'rgba(59, 130, 246, 0.1)', // Primary with opacity
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        alignItems: 'center',
        gap: spacing.md,
    },
    title: {
        ...typography.h1,
        color: colors.light.textPrimary,
        textAlign: 'center',
    },
    description: {
        ...typography.body,
        color: colors.light.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
        gap: spacing.xl,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
        height: 10,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    button: {
        width: '100%',
    }
});
