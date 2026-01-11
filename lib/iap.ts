import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';

const itemSkus = Platform.select({
    ios: ['com.hectos.app.program'],
    android: ['com.hectos.app.program'],
    default: [],
}) as string[];

export const initIAP = async () => {
    try {
        await RNIap.initConnection();
        if (Platform.OS === 'android') {
            await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
        }
    } catch (err) {
        console.warn('IAP Init error', err);
    }
};

export const getProducts = async () => {
    try {
        const products = await RNIap.getProducts({ skus: itemSkus });
        return products;
    } catch (err) {
        console.warn('IAP GetProducts error', err);
        return [];
    }
};

export const requestPurchase = async (sku: string) => {
    try {
        const purchase = await RNIap.requestPurchase({ sku });
        return purchase;
    } catch (err) {
        console.warn('IAP Purchase error', err);
        throw err;
    }
};

export const restorePurchases = async () => {
    try {
        const purchases = await RNIap.getAvailablePurchases();
        return purchases;
    } catch (err) {
        console.warn('IAP Restore error', err);
        throw err;
    }
};

export const endConnection = () => {
    try {
        RNIap.endConnection();
    } catch (err) {
        console.warn('IAP EndConnection error', err);
    }
}
