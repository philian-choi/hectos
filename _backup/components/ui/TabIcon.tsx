import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

interface TabIconProps {
    name: any;
    color: string;
    size: number;
    focused: boolean;
}

export function TabIcon({ name, color, size, focused }: TabIconProps) {
    const scale = useSharedValue(1);

    useEffect(() => {
        if (focused) {
            // Bouncy pop effect
            scale.value = withSequence(
                withTiming(1.2, { duration: 150 }),
                withSpring(1, { damping: 12, stiffness: 200 })
            );
        } else {
            scale.value = withTiming(1, { duration: 150 });
        }
    }, [focused]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        shadowColor: color,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: focused ? 0.5 : 0,
        shadowRadius: focused ? 10 : 0,
    }));

    return (
        <Animated.View style={[{ alignItems: 'center', justifyContent: 'center' }, animatedStyle]}>
            <Feather name={name} size={size} color={color} />
        </Animated.View>
    );
}
