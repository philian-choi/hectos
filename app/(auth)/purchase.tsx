import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, useColorScheme, Linking, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import * as RNIap from 'react-native-iap';

import { SafeScreen } from '@/components/layout/SafeScreen';
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { colors } from '@/constants/theme';
import { useUserStore } from '@/stores/useUserStore';
import { PurchaseManager } from '@/lib/iap';
import { Analytics } from '@/lib/analytics';

// Product ID from App Store Connect - Use the registered product
const PRODUCT_ID = 'com.hectos.app.program';

export default function PurchaseScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { setPurchased, hasPurchased, setOnboardingComplete } = useUserStore();

    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<RNIap.Product[]>([]);

    // Pro Badge Animation
    const scale = useSharedValue(1);
    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1000 }),
                withTiming(1, { duration: 1000 })
            ),
            -1,
            true
        );
    }, []);

    const animatedBadgeStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const themeColors = isDark ? colors.dark : colors.light;

    useEffect(() => {
        setupIAP();
        Analytics.track('purchase_view');
    }, []);

    const setupIAP = async () => {
        try {
            await PurchaseManager.initialize(
                (purchase) => {
                    // Purchase Success Callback
                    if (__DEV__) console.log("Purchase Success Callback Triggered");
                    setPurchased(true); // Unlock the app
                    setOnboardingComplete();
                    Analytics.track('purchase_success');
                    Alert.alert(t('common.success'), t('purchase.success'), [
                        { text: t('common.ok'), onPress: () => router.replace('/(tabs)') }
                    ]);
                    setLoading(false);
                },
                (error) => {
                    // Purchase Error Callback
                    console.warn("Purchase Error Callback", error);
                    setLoading(false);
                    if (error.code !== 'E_USER_CANCELLED') {
                        Alert.alert(t('common.error'), t('purchase.failed'));
                    }
                }
            );
            const items = await PurchaseManager.getProducts();
            setProducts(items as RNIap.Product[]);
        } catch (e) {
            console.warn('IAP Setup Error', e);
        }
    };

    const handlePurchase = async () => {
        setLoading(true);
        Analytics.track('purchase_attempt');
        try {
            await PurchaseManager.requestPurchase(PRODUCT_ID);
        } catch (error: any) {
            if (__DEV__) console.log('Purchase Request Failed', error);
            setLoading(false);
        }
    };

    const handleRestore = async () => {
        setLoading(true);
        Analytics.track('restore_attempt');
        try {
            const purchases = await PurchaseManager.restorePurchases();

            // Check if user has purchased the specific non-consumable product
            const hasExistingPurchase = purchases.some(
                (p) => p.id === PRODUCT_ID || p.id === 'com.hectos.app.program'
            );

            if (hasExistingPurchase) {
                setPurchased(true);
                setOnboardingComplete();
                Analytics.track('restore_success');
                Alert.alert(t('common.success'), t('purchase.restoreSuccess'), [
                    { text: t('common.ok'), onPress: () => router.replace('/(tabs)') }
                ]);
            } else {
                Analytics.track('restore_empty');
                Alert.alert(t('common.info'), t('purchase.noPurchasesFound'));
            }
        } catch (e) {
            console.warn('Restore Error', e);
            Alert.alert(t('common.error'), t('purchase.restoreFailed'));
        } finally {
            setLoading(false);
        }
    };

    const product = products.find(p => p.id === PRODUCT_ID);
    const price = product ? product.displayPrice : "$2.99";

    return (

        <SafeScreen>
            <View className="flex-row items-center justify-between px-4 py-2">
                <Button variant="ghost" size="icon" onPress={() => router.back()}>
                    <Feather name="x" size={24} color={themeColors.textPrimary} />
                </Button>
                <Text className="text-lg font-semibold text-foreground">{t('purchase.title')}</Text>
                <View className="w-11" />
            </View>

            <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center', paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                <Animated.View style={[animatedBadgeStyle, { zIndex: 10, marginBottom: -16 }]}>
                    <View className="bg-amber-500 px-3 py-1.5 rounded-xl border-2 border-white dark:border-slate-900">
                        <Text className="text-white font-black text-xs tracking-widest">{t('purchase.proAccess')}</Text>
                    </View>
                </Animated.View>

                <View className="w-32 h-32 rounded-full justify-center items-center mb-6 bg-primary/10 border-4 border-primary/10 shadow-lg shadow-primary/30">
                    <Feather name="zap" size={64} color={colors.primary} />
                </View>

                <Text className="text-3xl font-black text-center mb-2 text-foreground">{t('purchase.aiAnalysis')}</Text>
                <Text className="text-base text-center mb-8 px-4 text-muted-foreground leading-6">
                    {t('purchase.description')}
                </Text>

                <Card className="w-full gap-4 p-0 bg-transparent border-0 shadow-none">
                    <BenefitItem icon="check" text={t('purchase.benefit1')} />
                    <BenefitItem icon="check" text={t('purchase.benefit2')} />
                    <BenefitItem icon="check" text={t('purchase.benefit3')} />
                </Card>
            </ScrollView>

            <View className="p-6 pt-6 border-t border-border">
                {loading ? (
                    <View className="h-14 rounded-2xl bg-primary justify-center items-center">
                        <ActivityIndicator color="white" />
                    </View>
                ) : (
                    <Button
                        onPress={handlePurchase}
                        size="lg"
                        className="h-14 rounded-2xl w-full"
                        disabled={loading}
                        accessibilityRole="button"
                        accessibilityLabel={`${t('purchase.buyButton')} ${price}`}
                    >
                        <Text className="text-lg font-bold text-primary-foreground">
                            {`${t('purchase.buyButton')} - ${price}`}
                        </Text>
                    </Button>
                )}

                <Button
                    variant="ghost"
                    onPress={handleRestore}
                    className="mt-3"
                    accessibilityRole="button"
                    accessibilityLabel={t('purchase.restore')}
                >
                    <Text className="text-muted-foreground font-medium">{t('purchase.restore')}</Text>
                </Button>

                <View className="flex-row justify-center items-center mt-4 gap-2">
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://hectos.app/terms')}
                        accessibilityRole="link"
                        accessibilityLabel={t('settings.termsOfService')}
                    >
                        <Text className="text-xs text-muted-foreground underline">{t('settings.termsOfService')}</Text>
                    </TouchableOpacity>
                    <Text className="text-xs text-muted-foreground">|</Text>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://hectos.app/privacy')}
                        accessibilityRole="link"
                        accessibilityLabel={t('settings.privacyPolicy')}
                    >
                        <Text className="text-xs text-muted-foreground underline">{t('settings.privacyPolicy')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
}

function BenefitItem({ icon, text }: { icon: string, text: string }) {
    return (
        <View className="flex-row items-center gap-4 p-4 rounded-2xl bg-muted/40">
            <View className="w-7 h-7 rounded-full bg-primary/15 justify-center items-center">
                <Feather name={icon as any} size={16} color={colors.primary} />
            </View>
            <Text className="text-base font-medium text-foreground flex-1">{text}</Text>
        </View>
    );
}

const styles = {};

