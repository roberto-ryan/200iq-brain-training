import React from 'react';
import { Platform, View } from 'react-native';

let BannerAdComponent, BannerAdSize;
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

if (isNative) {
  const admob = require('react-native-google-mobile-ads');
  BannerAdComponent = admob.BannerAd;
  BannerAdSize = admob.BannerAdSize;
}

export default function AppBannerAd({ unitId, isPremium }) {
  if (!isNative || isPremium) return null;

  return (
    <View style={{ alignItems: 'center', paddingVertical: 8 }}>
      <BannerAdComponent
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
