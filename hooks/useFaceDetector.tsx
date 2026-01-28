import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useFrameProcessor,
    runAtTargetFps
} from 'react-native-vision-camera';
import { useFaceDetector as useMLKitFaceDetector, FrameFaceDetectionOptions } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';
import { useSharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// 푸쉬업 판별 임계값 (얼굴 너비 기준)
const THRESHOLD_DOWN_PX = 0.50; // 조금 더 민감하게 조정 (0.55 -> 0.50)
const THRESHOLD_UP_PX = 0.38;   // 조금 더 민감하게 조정 (0.35 -> 0.38)

interface UseFaceDetectorOptions {
    enabled: boolean;
    vibrationEnabled: boolean;
    onDown?: () => void;
    onUp?: () => void;
}

interface UseFaceDetectorReturn {
    isAvailable: boolean;
    isDown: boolean;
    hasFace: boolean;
    permission: boolean | null;
    requestPermission: () => Promise<boolean>;
    FaceCountCamera: React.FC<{ style?: any }>;
}

/**
 * 차세대 AI 푸쉬업 카운터 (Vision Camera + ML Kit)
 */
export function useFaceDetector({
    enabled,
    vibrationEnabled,
    onDown,
    onUp,
}: UseFaceDetectorOptions): UseFaceDetectorReturn {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('front');

    // 상태 관리
    const [isDownState, setIsDownState] = useState(false);
    const [hasFaceState, setHasFaceState] = useState(false);

    // Refs for stable callbacks and state tracking
    const isDownRef = useRef(false);
    const onDownRef = useRef(onDown);
    const onUpRef = useRef(onUp);
    const vibrationEnabledRef = useRef(vibrationEnabled);

    useEffect(() => {
        onDownRef.current = onDown;
        onUpRef.current = onUp;
        vibrationEnabledRef.current = vibrationEnabled;
    }, [onDown, onUp, vibrationEnabled]);

    // Worklet shared value to track state across frames
    const isNearShared = useSharedValue(false);

    // 얼굴 인식 옵션
    const faceDetectorOptions = useMemo((): FrameFaceDetectionOptions => ({
        performanceMode: 'fast',
        classificationMode: 'none',
    }), []);

    const { detectFaces } = useMLKitFaceDetector(faceDetectorOptions);

    // 상태 변경 핸들러 (Worklet -> JS Thread 전환용)
    const updateStates = useMemo(() => Worklets.createRunOnJS((isNear: boolean, facesFound: boolean) => {
        setHasFaceState(facesFound);

        if (isNear && !isDownRef.current) {
            isDownRef.current = true;
            setIsDownState(true);
            if (vibrationEnabledRef.current) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            onDownRef.current?.();
        } else if (!isNear && isDownRef.current) {
            isDownRef.current = false;
            setIsDownState(false);
            onUpRef.current?.();
        }
    }), []);

    // 초고속 프레임 프로세서 (Worklet Thread)
    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        runAtTargetFps(10, () => {
            'worklet';
            const faces = detectFaces(frame);
            const facesFound = faces.length > 0;

            if (facesFound) {
                const face = faces[0];
                // 얼굴 너비 비율 계산
                const faceWidthRel = face.bounds.width / frame.width;

                // 임계값 판단 (Hysteresis 적용)
                if (faceWidthRel > THRESHOLD_DOWN_PX) {
                    isNearShared.value = true;
                } else if (faceWidthRel < THRESHOLD_UP_PX) {
                    isNearShared.value = false;
                }
                // Between thresholds? Keep isNearShared.value as is.
            } else {
                // 얼굴이 사라지면 '멂' 상태로 리셋하거나 유지? 
                // 보통 푸쉬업 중 얼굴이 사라지면 올라온 것으로 간주하거나 상태 유지
                // 여기서는 안전하게 상태 유지 (혹은 false로 리셋)
                // isNearShared.value = false; 
            }

            updateStates(isNearShared.value, facesFound);
        });
    }, [detectFaces, updateStates]);

    const handleRequestPermission = async () => {
        return await requestPermission();
    };

    // 카메라 프리뷰 컴포넌트
    const FaceCountCamera = useCallback(({ style }: { style?: any }) => {
        if (!hasPermission || !device || !enabled) {
            return <View style={[style, { backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#555', fontSize: 10 }}> AI Off </Text>
            </View>;
        }

        return (
            <Camera
                style={style || StyleSheet.absoluteFill
                }
                device={device}
                isActive={enabled}
                frameProcessor={frameProcessor}
                pixelFormat="yuv" // ML Kit 호환 포맷
            />
        );
    }, [hasPermission, device, enabled, frameProcessor]);

    return {
        isAvailable: !!device && hasPermission,
        isDown: isDownState,
        hasFace: hasFaceState,
        permission: hasPermission,
        requestPermission: handleRequestPermission,
        FaceCountCamera,
    };
}
