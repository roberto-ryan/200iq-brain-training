import { Platform } from 'react-native';
import { REVENUECAT } from '../constants/config';

let Purchases;
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

if (isNative) {
  Purchases = require('react-native-purchases').default;
}

let initialized = false;

export async function initPurchases() {
  if (!isNative || initialized) return;
  try {
    const apiKey = REVENUECAT.GOOGLE_API_KEY;
    await Purchases.configure({ apiKey });
    initialized = true;
  } catch (e) {}
}

export async function checkPremium() {
  if (!isNative) return false;
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[REVENUECAT.ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    return false;
  }
}

export async function getOfferings() {
  if (!isNative) return null;
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (e) {
    return null;
  }
}

export async function purchasePackage(pkg) {
  if (!isNative) return false;
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return customerInfo.entitlements.active[REVENUECAT.ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    return false;
  }
}

export async function restorePurchases() {
  if (!isNative) return false;
  try {
    const customerInfo = await Purchases.restorePurchases();
    return customerInfo.entitlements.active[REVENUECAT.ENTITLEMENT_ID] !== undefined;
  } catch (e) {
    return false;
  }
}
