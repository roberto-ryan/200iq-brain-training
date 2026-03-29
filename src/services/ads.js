import { FREE_TIER } from '../constants/config';

// Ad SDK integration is disabled until react-native-google-mobile-ads
// is compatible with RN 0.81. All exports are no-ops that resolve gracefully.
// To re-enable: npm install react-native-google-mobile-ads, add plugin to
// app.json, and restore the require() + SDK calls in this file.

export async function initAds() {}

export function showInterstitial() {
  return Promise.resolve(false);
}

export function showRewarded() {
  return Promise.resolve(false);
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
