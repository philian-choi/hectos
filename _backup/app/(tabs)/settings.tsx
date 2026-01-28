import { View, Switch, ScrollView, Alert, Linking, useColorScheme } from "react-native";
import { useTranslation } from "react-i18next";
import { Feather } from "@expo/vector-icons";
import { SafeScreen } from "@/components/layout/SafeScreen";
import { useUserStore } from "@/stores/useUserStore";
import { restorePurchases } from "@/lib/iap";

// RNR Components
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
            Alert.alert(t("common.success"), t("settings.purchasesRestored"));
        } catch (e) {
            Alert.alert(t("common.error"), t("settings.restoreFailed"));
        }
    };

    const handleReset = () => {
        Alert.alert(
            t("settings.reset"),
            t("settings.resetConfirmMessage"),
            [
                { text: t("common.cancel"), style: "cancel" },
                {
                    text: t("settings.reset"),
                    style: "destructive",
                    onPress: () => {
                        resetProgress();
                        Alert.alert(t("common.success"), t("settings.resetSuccess"));
                    }
                }
            ]
        );
    };

    const renderSectionHeader = (title: string) => (
        <Text className="text-muted-foreground text-xs font-semibold uppercase ml-1 mb-2 mt-4 tracking-wider">
            {title}
        </Text>
    );

    const renderItem = (icon: any, label: string, trailing: React.ReactNode, onPress?: () => void) => (
        <Button
            variant="ghost"
            className="flex-row items-center justify-between p-3 h-auto"
            onPress={onPress}
            disabled={!onPress}
        >
            <View className="flex-row items-center gap-4">
                <View className="w-8 h-8 rounded-md bg-muted justify-center items-center">
                    <Feather name={icon} size={18} color={isDark ? "white" : "black"} />
                </View>
                <Text className="text-base font-medium text-foreground">
                    {label}
                </Text>
            </View>
            <View className="flex-row items-center">
                {trailing}
            </View>
        </Button>
    );

    return (
        <SafeScreen>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
                {/* Header */}
                <View className="mb-6">
                    <Text className="text-4xl font-black text-foreground mb-1">
                        {t("settings.title")}
                    </Text>
                    <Text className="text-muted-foreground text-sm font-medium">
                        앱 환경을 내 취향에 맞게 설정하세요
                    </Text>
                </View>

                {/* General Section */}
                {renderSectionHeader(t("settings.general"))}
                <Card className="rounded-2xl border-0 bg-muted/30 overflow-hidden">
                    {renderItem(
                        "globe",
                        t("settings.language"),
                        <View className="flex-row items-center gap-2">
                            <Text className="text-muted-foreground text-sm">
                                {isKorean ? t("settings.languageKorean") : t("settings.languageEnglish")}
                            </Text>
                            <Feather name="chevron-right" size={16} color="gray" />
                        </View>,
                        toggleLanguage
                    )}
                </Card>

                {/* Preferences Section */}
                {renderSectionHeader(t("settings.preferences"))}
                <Card className="rounded-2xl border-0 bg-muted/30 overflow-hidden">
                    {renderItem(
                        "volume-2",
                        t("settings.sound"),
                        <Switch
                            value={soundEnabled}
                            onValueChange={toggleSound}
                            // Using inline styling for switch colors as they don't accept classes directly usually
                            trackColor={{ false: '#64748B', true: '#FFB800' }}
                        />,
                        undefined
                    )}
                    <Separator className="bg-border/50" />
                    {renderItem(
                        "smartphone",
                        t("settings.vibration"),
                        <Switch
                            value={vibrationEnabled}
                            onValueChange={toggleVibration}
                            trackColor={{ false: '#64748B', true: '#FFB800' }}
                        />,
                        undefined
                    )}
                    <Separator className="bg-border/50" />
                    {renderItem(
                        "wifi",
                        t("settings.autoCount"),
                        <Switch
                            value={autoCountEnabled}
                            onValueChange={setAutoCountEnabled}
                            trackColor={{ false: '#64748B', true: '#FFB800' }}
                        />,
                        undefined
                    )}
                </Card>

                {/* Data & Purchase */}
                {renderSectionHeader(t("settings.data"))}
                <Card className="rounded-2xl border-0 bg-muted/30 overflow-hidden">
                    {renderItem(
                        "refresh-cw",
                        t("settings.restorePurchase"),
                        <Feather name="chevron-right" size={16} color="gray" />,
                        handleRestore
                    )}
                    <Separator className="bg-border/50" />
                    {renderItem(
                        "trash-2",
                        t("settings.reset"),
                        <Feather name="chevron-right" size={16} color="gray" />,
                        handleReset
                    )}
                </Card>

                {/* App Info */}
                {renderSectionHeader(t("settings.about"))}
                <Card className="rounded-2xl border-0 bg-muted/30 overflow-hidden">
                    {renderItem(
                        "info",
                        t("settings.version"),
                        <Text className="text-muted-foreground">1.0.2</Text>
                    )}
                    <Separator className="bg-border/50" />
                    {renderItem(
                        "shield",
                        t("settings.privacyPolicy"),
                        <Feather name="external-link" size={16} color="gray" />,
                        () => Linking.openURL('https://landing-nine-black.vercel.app/privacy')
                    )}
                    <Separator className="bg-border/50" />
                    {renderItem(
                        "file-text",
                        t("settings.termsOfService"),
                        <Feather name="external-link" size={16} color="gray" />,
                        () => Linking.openURL('https://landing-nine-black.vercel.app/terms')
                    )}
                </Card>

            </ScrollView>
        </SafeScreen>
    );
}
