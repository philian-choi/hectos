import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

interface PauseOverlayProps {
    isVisible: boolean;
    onResume: () => void;
    onQuit: () => void;
    isDark: boolean;
}

export function PauseOverlay({ isVisible, onResume, onQuit, isDark }: PauseOverlayProps) {
    const { t } = useTranslation();

    if (!isVisible) return null;

    return (

        <View
            className="absolute inset-0 z-50 justify-center items-center"
            style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }}
            accessibilityViewIsModal={true}
            accessibilityLabel={t("common.pause")}
        >
            <View className="flex-1 justify-center items-center w-full">
                <Feather
                    name="pause-circle"
                    size={64}
                    color={colors.primary}
                    style={{ marginBottom: 24 }}
                />
                <Text className="text-4xl font-bold mb-8 text-center text-foreground">
                    {t("common.pause")}
                </Text>
                <View className="w-full gap-4 px-8">
                    <Button onPress={onResume} size="lg" className="w-full">
                        <Text className="font-bold text-primary-foreground">{t("common.resume")}</Text>
                    </Button>
                    <Button onPress={onQuit} variant="secondary" size="lg" className="w-full">
                        <Text className="font-bold text-secondary-foreground">{t("common.quit")}</Text>
                    </Button>
                </View>
            </View>
        </View>
    );
}
