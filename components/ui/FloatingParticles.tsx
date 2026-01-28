import { useEffect } from "react";
import { View, useWindowDimensions } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    Easing,
    interpolate,
} from "react-native-reanimated";

interface FloatingParticle {
    id: number;
    size: number;
    initialX: number;
    initialY: number;
    delay: number;
    duration: number;
    color: string;
}

interface FloatingParticlesProps {
    count?: number;
    colors?: string[];
    minSize?: number;
    maxSize?: number;
}

/**
 * Floating Particles Background
 * 
 * Creates a subtle, elegant floating particles effect
 * for backgrounds. Perfect for onboarding and landing screens.
 */
export function FloatingParticles({
    count = 20,
    colors = ["#FFB800", "#FF8C00", "#FBBF24", "#F59E0B"],
    minSize = 4,
    maxSize = 12,
}: FloatingParticlesProps) {
    const { width, height } = useWindowDimensions();

    const particles: FloatingParticle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        size: Math.random() * (maxSize - minSize) + minSize,
        initialX: Math.random() * width,
        initialY: Math.random() * height,
        delay: Math.random() * 3000,
        duration: 4000 + Math.random() * 4000,
        color: colors[Math.floor(Math.random() * colors.length)],
    }));

    return (
        <View
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
            }}
            pointerEvents="none"
        >
            {particles.map((particle) => (
                <Particle key={particle.id} {...particle} />
            ))}
        </View>
    );
}

function Particle({
    size,
    initialX,
    initialY,
    delay,
    duration,
    color,
}: FloatingParticle) {
    const progress = useSharedValue(0);
    const opacity = useSharedValue(0);

    useEffect(() => {
        // Fade in
        opacity.value = withDelay(
            delay,
            withTiming(0.6, { duration: 1000 })
        );

        // Float animation
        progress.value = withDelay(
            delay,
            withRepeat(
                withTiming(1, {
                    duration,
                    easing: Easing.inOut(Easing.ease),
                }),
                -1,
                true
            )
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const translateY = interpolate(progress.value, [0, 1], [0, -60]);
        const translateX = interpolate(progress.value, [0, 0.5, 1], [0, 15, 0]);
        const scale = interpolate(progress.value, [0, 0.5, 1], [1, 1.2, 1]);

        return {
            opacity: opacity.value,
            transform: [
                { translateY },
                { translateX },
                { scale },
            ],
        };
    });

    return (
        <Animated.View
            style={[
                animatedStyle,
                {
                    position: "absolute",
                    left: initialX,
                    top: initialY,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: color,
                    shadowColor: color,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.8,
                    shadowRadius: size,
                },
            ]}
        />
    );
}
