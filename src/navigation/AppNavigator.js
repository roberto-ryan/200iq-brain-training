import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, ActivityIndicator } from 'react-native';
import { COLORS } from '../constants/theme';
import { hasOnboarded } from '../services/storage';

import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import ResultsScreen from '../screens/ResultsScreen';
import StatsScreen from '../screens/StatsScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import PremiumScreen from '../screens/PremiumScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }) {
  const icons = { Home: '🧠', Stats: '📊', Rank: '🏆', Settings: '⚙️' };
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 22 }}>{icons[label]}</Text>
      <Text style={{ color: focused ? COLORS.accent : COLORS.textSecondary, fontSize: 10 }}>{label}</Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bg,
          borderTopColor: COLORS.cardBorder,
          height: 65,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Home" focused={focused} /> }} />
      <Tab.Screen name="Stats" component={StatsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Stats" focused={focused} /> }} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Rank" focused={focused} /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ focused }) => <TabIcon label="Settings" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [isReady, setIsReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    hasOnboarded().then(done => {
      setShowOnboarding(!done);
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={COLORS.accent} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {showOnboarding && (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        )}
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="Premium" component={PremiumScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
