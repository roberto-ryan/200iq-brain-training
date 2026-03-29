import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { initAds } from './src/services/ads';
import { initPurchases } from './src/services/purchases';
import { registerForNotifications, scheduleNotifications } from './src/services/notifications';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    (async () => {
      await initAds();
      await initPurchases();
      await registerForNotifications();
      await scheduleNotifications();
      await SplashScreen.hideAsync();
    })();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
