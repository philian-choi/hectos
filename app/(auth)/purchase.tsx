import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator, useColorScheme, Linking, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import * as RNIap from 'react-native-iap';

import { SafeScreen } from '@/components/layout/SafeScreen';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/constants/theme';
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
            setProducts(items);
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
                (p) => p.productId === PRODUCT_ID || p.productId === 'com.hectos.app.program'
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

    const product = products.find(p => p.productId === PRODUCT_ID);
    const price = product ? product.localizedPrice : "$2.99";

    return (
        <SafeScreen>
            <View style={styles.header}>
                <Button variant="ghost" onPress={() => router.back()} style={styles.closeButton}>
                    <Feather name="x" size={24} color={themeColors.textPrimary} />
                </Button>
                <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>{t('purchase.title')}</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Animated.View style={[styles.proBadgeContainer, animatedBadgeStyle]}>
                    <Text style={styles.proBadgeText}>PRO ACCESS</Text>
                </Animated.View>

                <View style={[styles.iconContainer, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' }]}>
                    <Feather name="zap" size={64} color={colors.primary} />
                </View>

                <Text style={[styles.title, { color: themeColors.textPrimary }]}>{t('purchase.aiAnalysis')}</Text>
                <Text style={[styles.description, { color: themeColors.textSecondary }]}>
                    {t('purchase.description')}
                </Text>

                <View style={styles.benefitList}>
                    <BenefitItem icon="check" text={t('purchase.benefit1')} isDark={isDark} />
                    <BenefitItem icon="check" text={t('purchase.benefit2')} isDark={isDark} />
                    <BenefitItem icon="check" text={t('purchase.benefit3')} isDark={isDark} />
                </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                {loading ? (
                    <View style={[styles.buyButton, { backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator color="white" />
                    </View>
                ) : (
                    <Button
                        onPress={handlePurchase}
                        size="large"
                        disabled={loading}
                        accessibilityRole="button"
                        accessibilityLabel={`${t('purchase.buyButton')} ${price}`}
                    >
                        {`${t('purchase.buyButton')} - ${price}`}
                    </Button>
                )}

                <Button
                    variant="ghost"
                    onPress={handleRestore}
                    style={{ marginTop: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel={t('purchase.restore')}
                >
                    <Text style={{ color: themeColors.textSecondary, fontWeight: '500' }}>{t('purchase.restore')}</Text>
                </Button>

                <View style={styles.legalLinks}>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://hectos.app/terms')}
                        accessibilityRole="link"
                        accessibilityLabel={t('settings.termsOfService')}
                    >
                        <Text style={styles.legalText}>{t('settings.termsOfService')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.legalSeparator}>|</Text>
                    <TouchableOpacity
                        onPress={() => Linking.openURL('https://hectos.app/privacy')}
                        accessibilityRole="link"
                        accessibilityLabel={t('settings.privacyPolicy')}
                    >
                        <Text style={styles.legalText}>{t('settings.privacyPolicy')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeScreen>
    );
}

function BenefitItem({ icon, text, isDark }: { icon: string, text: string, isDark: boolean }) {
    const themeColors = isDark ? colors.dark : colors.light;
    return (
        <View style={[styles.benefitItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }]}>
            <View style={styles.benefitIconCircle}>
                <Feather name={icon as any} size={16} color={colors.primary} />
            </View>
            <Text style={[styles.benefitText, { color: themeColors.textPrimary }]}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.sm,
    },
    closeButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    container: {
        padding: spacing.xl,
        alignItems: 'center',
        paddingBottom: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
        borderWidth: 4,
        borderColor: 'rgba(59, 130, 246, 0.1)',
    },
    proBadgeContainer: {
        backgroundColor: '#F59E0B', // Amber 500
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginBottom: -16, // Overlap
        zIndex: 10,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    proBadgeText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 12,
        letterSpacing: 1,
    },
    title: {
        ...typography.h1,
        textAlign: 'center',
        marginBottom: spacing.sm,
        fontSize: 28,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: spacing.xl * 2,
        lineHeight: 24,
        paddingHorizontal: spacing.md,
    },
    benefitList: {
        width: '100%',
        gap: spacing.md,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: 16,
    },
    benefitIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(59, 130, 246, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    benefitText: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    footer: {
        padding: spacing.xl,
        paddingTop: spacing.lg,
        borderTopWidth: 1,
    },
    buyButton: {
        height: 56,
        borderRadius: 16,
    },
    buyButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    legalLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    legalText: {
        fontSize: 12,
        color: colors.dark.textSecondary,
        textDecorationLine: 'underline',
    },
    legalSeparator: {
        fontSize: 12,
        color: colors.dark.textSecondary,
    }
});

