import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
