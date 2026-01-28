import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
    ios: ['com.hectos.app.program'],
    android: ['com.hectos.app.program'],
    default: [],
}) as string[];

let purchaseUpdateSubscription: any = null;
let purchaseErrorSubscription: any = null;

export const initIAP = async (
    onPurchaseSuccess?: (purchase: RNIap.Purchase) => void,
    onPurchaseError?: (error: any) => void
) => {
    try {
        await RNIap.initConnection();
        // if (Platform.OS === 'android') {
        //     await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
        // }

        // Remove existing listeners to avoid duplicates
        if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
        }
        if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
        }

        // Global Purchase Listener
        purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
            async (purchase: RNIap.Purchase) => {
                const receipt = purchase.transactionId;
                if (receipt) {
                    try {
                        // Handle Consumables vs Non-Consumables
                        const isConsumable = purchase.productId === 'com.hectos.app.analysis_ticket_1';
                        await RNIap.finishTransaction({ purchase, isConsumable });

                        if (__DEV__) {
                            console.log('Purchase Finished & Acknowledged');
                        }
                        if (onPurchaseSuccess) {
                            onPurchaseSuccess(purchase);
                        }
                    } catch (ackErr) {
                        console.warn('Ack Error', ackErr);
                    }
                }
            }
        );

        // Global Error Listener
        purchaseErrorSubscription = RNIap.purchaseErrorListener(
            (error: RNIap.PurchaseError) => {
                console.warn('Purchase Error Listener', error);
                if (onPurchaseError) {
                    onPurchaseError(error);
                }
            }
        );

    } catch (err) {
        console.warn('IAP Init error', err);
    }
};

export const getProducts = async () => {
    try {
        const products = await RNIap.fetchProducts({ skus: itemSkus });
        return products;
    } catch (err) {
        console.warn('IAP GetProducts error', err);
        return [];
    }
};

export const requestPurchase = async (sku: string) => {
    try {
        // This triggers the native UI. The result is handled in purchaseUpdatedListener.
        // However, we wait for the immediate promise for error handling.
        await RNIap.requestPurchase({
            type: 'in-app',
            request: {
                google: { skus: [sku] },
                apple: { sku },
            },
        });
    } catch (err) {
        console.warn('IAP Request Purchase error', err);
        throw err;
    }
};

export const restorePurchases = async () => {
    try {
        const purchases = await RNIap.getAvailablePurchases();
        // Just checking what's available doesn't finish transactions,
        // but often 'restore' logic in apps just checks presence.
        return purchases;
    } catch (err) {
        console.warn('IAP Restore error', err);
        throw err;
    }
};

export const endConnection = () => {
    if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
    }
    try {
        RNIap.endConnection();
    } catch (err) {
        console.warn('IAP EndConnection error', err);
    }
}

export const PurchaseManager = {
    initialize: initIAP,
    getProducts,
    requestPurchase,
    restorePurchases,
    endConnection
};
