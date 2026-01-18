import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/constants/theme';
import { Button } from '@/components/ui/Button';

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
            style={[
                styles.overlay,
                { backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.9)' }
            ]}
            accessibilityViewIsModal={true}
            accessibilityLabel={t("common.pause")}
        >
            <View style={styles.center}>
                <Feather
                    name="pause-circle"
                    size={64}
                    color={colors.primary}
                    style={{ marginBottom: spacing.lg }}
                />
                <Text style={[
                    styles.title,
                    { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }
                ]}>
                    {t("common.pause")}
                </Text>
                <View style={[styles.buttonContainer, { gap: spacing.md, paddingHorizontal: spacing.xl }]}>
                    <Button onPress={onResume} size="large">
                        {t("common.resume")}
                    </Button>
                    <Button onPress={onQuit} variant="secondary">
                        {t("common.quit")}
                    </Button>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
    },
    title: {
        ...typography.h1,
        marginBottom: spacing.xl,
        textAlign: "center",
    },
    buttonContainer: {
        width: '100%',
    }
});
