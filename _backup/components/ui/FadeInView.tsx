import { useEffect } from "react";
import { ViewProps } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    Easing
} from "react-native-reanimated";

interface FadeInViewProps extends ViewProps {
    children: React.ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

export function FadeInView({
    children,
    delay = 0,
    duration = 500,
    style,
    className,
    ...props
}: FadeInViewProps) {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(20);

    useEffect(() => {
        opacity.value = withDelay(
            delay,
            withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
        );
        translateY.value = withDelay(
            delay,
            withTiming(0, { duration, easing: Easing.out(Easing.cubic) })
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <Animated.View className={className} style={[style, animatedStyle]} {...props}>
            {children}
        </Animated.View>
    );
}
