import { Platform } from 'react-native';
import { ADS, FREE_TIER } from '../constants/config';

let MobileAds, InterstitialAd, RewardedAd, AdEventType, RewardedAdEventType;

const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

if (isNative) {
  const admob = require('react-native-google-mobile-ads');
  MobileAds = admob.default;
  InterstitialAd = admob.InterstitialAd;
  RewardedAd = admob.RewardedAd;
  AdEventType = admob.AdEventType;
  RewardedAdEventType = admob.RewardedAdEventType;
}

let interstitial = null;
let rewarded = null;
let adsInitialized = false;

export async function initAds() {
  if (!isNative || adsInitialized) return;
  try {
    await MobileAds().initialize();
    adsInitialized = true;
    loadInterstitial();
    loadRewarded();
  } catch (e) {}
}

function loadInterstitial() {
  if (!isNative) return;
  interstitial = InterstitialAd.createForAdRequest(ADS.INTERSTITIAL);
  interstitial.load();
}

function loadRewarded() {
  if (!isNative) return;
  rewarded = RewardedAd.createForAdRequest(ADS.REWARDED);
  rewarded.load();
}

export function showInterstitial() {
  return new Promise((resolve) => {
    if (!isNative || !interstitial) { resolve(false); return; }
    const unsubClose = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      unsubClose();
      loadInterstitial();
      resolve(true);
    });
    const unsubError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
      unsubError();
      loadInterstitial();
      resolve(false);
    });
    interstitial.show().catch(() => resolve(false));
  });
}

export function showRewarded() {
  return new Promise((resolve) => {
    if (!isNative || !rewarded) { resolve(false); return; }
    const unsubEarn = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      unsubEarn();
      resolve(true);
    });
    const unsubClose = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
      unsubClose();
      loadRewarded();
    });
    const unsubError = rewarded.addAdEventListener(AdEventType.ERROR, () => {
      unsubError();
      loadRewarded();
      resolve(false);
    });
    rewarded.show().catch(() => resolve(false));
  });
}

let gamesCompletedSinceLastAd = 0;

export function trackGameCompleted() {
  gamesCompletedSinceLastAd += 1;
}

export function shouldShowInterstitial() {
  if (gamesCompletedSinceLastAd >= FREE_TIER.INTERSTITIAL_FREQUENCY) {
    gamesCompletedSinceLastAd = 0;
    return true;
  }
  return false;
}
