import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Linking, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useUserStore } from "@/stores/useUserStore";
import { colors, spacing, typography } from "@/constants/theme";
import { restorePurchases } from "@/lib/iap";

export default function SettingsScreen() {
    const { t, i18n } = useTranslation();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const {
        soundEnabled, toggleSound,
        vibrationEnabled, toggleVibration,
        autoCountEnabled, setAutoCountEnabled,
        resetProgress
    } = useUserStore();

    const isKorean = i18n.language === 'ko';

    const toggleLanguage = () => {
        const newLang = isKorean ? 'en' : 'ko';
        i18n.changeLanguage(newLang);
    };

    const handleRestore = async () => {
        try {
            await restorePurchases();
            Alert.alert(t("common.success") || "Success", "Purchases restored.");
        } catch (e) {
            Alert.alert(t("common.error") || "Error", "Failed to restore purchases.");
        }
    };

    const handleReset = () => {
        Alert.alert(
            t("settings.reset"),
            "Are you sure? This cannot be undone.",
            [
                { text: t("common.cancel"), style: "cancel" },
                {
                    text: t("settings.reset"),
                    style: "destructive",
                    onPress: () => {
                        resetProgress();
                        Alert.alert("Reset", "All data has been cleared.");
                    }
                }
            ]
        );
    };

    const renderSectionHeader = (title: string) => (
        <Text style={[styles.sectionHeader, { color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }]}>
            {title}
        </Text>
    );

    const renderItem = (icon: any, label: string, trailing: React.ReactNode, onPress?: () => void, color: string = colors.primary) => (
        <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: isDark ? colors.dark.surface : colors.light.surface }]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                    <Feather name={icon} size={20} color={isDark ? colors.dark.textPrimary : colors.light.textPrimary} />
                </View>
                <Text style={[styles.itemLabel, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}>
                    {label}
                </Text>
            </View>
            <View style={styles.itemRight}>
                {trailing}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeScreen>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? colors.dark.textPrimary : colors.light.textPrimary }]}>
                        {t("settings.title")}
                    </Text>
                </View>

                {/* General Section */}
                {renderSectionHeader(t("settings.general"))}
                <View style={styles.section}>
                    {renderItem(
                        "globe",
                        t("settings.language"),
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Text style={{ color: isDark ? colors.dark.textSecondary : colors.light.textSecondary, fontSize: 14 }}>
                                {isKorean ? "한국어" : "English"}
                            </Text>
                            <Feather name="chevron-right" size={16} color={colors.light.textSecondary} />
                        </View>,
                        toggleLanguage
                    )}
                </View>

                {/* Preferences Section */}
                {renderSectionHeader(t("settings.preferences"))}
                <View style={styles.section}>
                    {renderItem(
                        "volume-2",
                        t("settings.sound"),
                        <Switch
                            value={soundEnabled}
                            onValueChange={toggleSound}
                            trackColor={{ false: '#767577', true: colors.primary }}
                        />,
                        undefined
                    )}
                    {renderItem(
                        "smartphone",
                        t("settings.vibration"),
                        <Switch
                            value={vibrationEnabled}
                            onValueChange={toggleVibration}
                            trackColor={{ false: '#767577', true: colors.primary }}
                        />,
                        undefined
                    )}
                    {renderItem(
                        "wifi",
                        t("settings.autoCount"),
                        <Switch
                            value={autoCountEnabled}
                            onValueChange={setAutoCountEnabled}
                            trackColor={{ false: '#767577', true: colors.primary }}
                        />,
                        undefined
                    )}
                </View>

                {/* Data & Purchase */}
                {renderSectionHeader(t("settings.data"))}
                <View style={styles.section}>
                    {renderItem(
                        "refresh-cw",
                        t("settings.restorePurchase"),
                        <Feather name="chevron-right" size={16} color={colors.light.textSecondary} />,
                        handleRestore
                    )}
                    {renderItem(
                        "trash-2",
                        t("settings.reset"),
                        <Feather name="chevron-right" size={16} color={colors.light.textSecondary} />,
                        handleReset
                    )}
                </View>

                {/* App Info */}
                {renderSectionHeader(t("settings.about"))}
                <View style={styles.section}>
                    {renderItem(
                        "info",
                        t("settings.version"),
                        <Text style={{ color: isDark ? colors.dark.textSecondary : colors.light.textSecondary }}>1.0.1</Text>
                    )}
                </View>

            </ScrollView>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
    header: {
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.h1,
    },
    sectionHeader: {
        ...typography.bodySmall,
        fontWeight: '600',
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
        marginTop: spacing.md,
        textTransform: 'uppercase',
        opacity: 0.7,
    },
    section: {
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: spacing.md,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 1, // separator effect
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemLabel: {
        ...typography.body,
        fontSize: 16,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
