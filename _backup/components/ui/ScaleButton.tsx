import React from 'react';
import { Pressable, StyleProp, ViewStyle, GestureResponderEvent } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface ScaleButtonProps {
    children: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
    scaleTo?: number; // How much to scale down (0.9 to 0.98 usually)
    haptic?: boolean; // Whether to trigger haptic on press in
    disabled?: boolean;
}

/**
 * iOS-style Scale Button
 * 
 * Mimics the physical feel of iOS system buttons (Control Center, App Store).
 * Scales down on press, springs back on release.
 */
export function ScaleButton({
    children,
    onPress,
    style,
    scaleTo = 0.96,
    haptic = true,
    disabled = false
}: ScaleButtonProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        if (disabled) return;
        scale.value = withTiming(scaleTo, { duration: 100 });
        if (haptic) {
            Haptics.selectionAsync();
        }
    };

    const handlePressOut = () => {
        if (disabled) return;
        // Spring physics for that "bouncy" feel
        scale.value = withSpring(1, {
            damping: 10,
            stiffness: 300,
            mass: 0.5,
        });
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
        >
            <Animated.View style={[style, animatedStyle]}>
                {children}
            </Animated.View>
        </Pressable>
    );
}
