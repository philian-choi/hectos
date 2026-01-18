import { useEffect, useRef, useCallback, useState } from 'react';
import { Platform, NativeModules, NativeEventEmitter, AppState } from 'react-native';
import * as Haptics from 'expo-haptics';

// Face detection thresholds (normalized 0.0 ~ 1.0)
const THRESHOLDS = {
    DOWN: 0.35,  // 35% of screen filled by face = close (down position)
    UP: 0.20,    // 20% of screen filled by face = far (up position)
} as const;

interface UseFaceDetectorOptions {
    enabled: boolean;
    vibrationEnabled: boolean;
    onDown?: () => void;  // Called when face gets close (pushup down)
    onUp?: () => void;    // Called when face gets far (pushup up / count)
    onStatusChange?: (status: string) => void;
}

interface UseFaceDetectorReturn {
    isAvailable: boolean;
    isDown: boolean;
    hasFace: boolean;
}

/**
 * Custom hook for face-based pushup detection using iOS Vision Framework.
 * Detects pushup motion by tracking face size changes in camera view.
 */
export function useFaceDetector({
    enabled,
    vibrationEnabled,
    onDown,
    onUp,
    onStatusChange,
}: UseFaceDetectorOptions): UseFaceDetectorReturn {
    const isDownRef = useRef(false);
    const isAvailableRef = useRef(false);
    const [hasFace, setHasFace] = useState(false);
    const isMounted = useRef(true);

    // Use refs for options to prevent effect re-running on prop changes
    const optionsRef = useRef({ enabled, vibrationEnabled, onDown, onUp, onStatusChange });
    useEffect(() => {
        optionsRef.current = { enabled, vibrationEnabled, onDown, onUp, onStatusChange };
    }, [enabled, vibrationEnabled, onDown, onUp, onStatusChange]);

    useEffect(() => {
        isMounted.current = true;
        if (Platform.OS !== 'ios') return;

        const { FaceDetectorModule } = NativeModules;
        if (!FaceDetectorModule) {
            console.warn('[useFaceDetector] FaceDetectorModule not found');
            isAvailableRef.current = false;
            return;
        }

        isAvailableRef.current = true;

        let subscription: { remove: () => void } | null = null;
        let isRunning = false;

        const startDetection = () => {
            if (isRunning || !optionsRef.current.enabled) return;
            FaceDetectorModule.start();
            isRunning = true;
            if (isMounted.current) {
                optionsRef.current.onStatusChange?.('Vision Active');
            }
        };

        const stopDetection = () => {
            if (!isRunning) return;
            FaceDetectorModule.stop();
            isRunning = false;
            if (isMounted.current) {
                optionsRef.current.onStatusChange?.('Vision Paused');
            }
        };

        // AppState Handling
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'active') {
                startDetection();
            } else {
                stopDetection();
            }
        };

        const subscriptionAppState = AppState.addEventListener('change', handleAppStateChange);

        // Initial Start
        if (enabled) {
            startDetection();
        }

        const emitter = new NativeEventEmitter(FaceDetectorModule);
        subscription = emitter.addListener('FaceUpdate', (event: { hasFace: boolean; faceRatio: number }) => {
            if (!isMounted.current) return;

            // Throttle Debug Info update (optional: e.g. every 10 frames)
            // But here we rely on the component using React.memo or not rendering debug info in production

            const { hasFace: faceDetected, faceRatio } = event;
            const { vibrationEnabled, onDown, onUp, onStatusChange } = optionsRef.current;

            // Update hasFace state for UI (optimized to avoid too many re-renders? 
            // setHasFace causes re-render. Maybe throttle usage or specific component?)
            // Since it's boolean, it only updates on change.
            // Update hasFace state only if changed
            setHasFace(prev => prev === faceDetected ? prev : faceDetected);

            // Only update debug info occasionally or if status changes significantly would be better
            // For now, we keep it but users should be careful rendering it.
            // onStatusChange?.(`Face: ${ faceDetected ? (faceRatio * 100).toFixed(0) + '%' : 'None' } `);

            if (!faceDetected) {
                // Face lost - reset state safely? 
                // Decision: If face is lost, we assume user moved away, so treat as "Up" if they were "Down"?
                // Or just keep state? For pushups, better to reset to avoid getting stuck in "Down"
                if (isDownRef.current) {
                    isDownRef.current = false;
                    // Optionally call onUp? No, that might trigger false count.
                    // Just reset internal state so next "Down" is valid.
                }
                return;
            }

            if (faceRatio > THRESHOLDS.DOWN) {
                if (!isDownRef.current) {
                    isDownRef.current = true;
                    if (vibrationEnabled) {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    onDown?.();
                }
            } else if (faceRatio < THRESHOLDS.UP) {
                if (isDownRef.current) {
                    isDownRef.current = false;
                    onUp?.();
                }
            }
        });

        return () => {
            isMounted.current = false;
            stopDetection();
            subscription?.remove();
            subscriptionAppState.remove();
        };
    }, [enabled]); // Re-run only if 'enabled' toggle explicitly changes logic structure significantly

    return {
        isAvailable: isAvailableRef.current,
        isDown: isDownRef.current,
        hasFace // New export
    };
}
