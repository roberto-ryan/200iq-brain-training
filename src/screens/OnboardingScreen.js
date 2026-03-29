import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { setOnboarded } from '../services/storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '🧠',
    title: 'Train Your Brain\nin 30 Seconds',
    subtitle: 'Quick daily challenges that sharpen your mind — math, patterns, memory, and more.',
  },
  {
    icon: '🎮',
    title: '4 Game Modes',
    subtitle: '⚡ Speed Math  ·  🔷 Pattern Match\n🧩 Memory Grid  ·  🎨 Color Match',
  },
  {
    icon: '🔔',
    title: 'Stay Sharp',
    subtitle: 'Get daily reminders to keep your streak alive and track your progress.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      if (Platform.OS !== 'web') {
        try {
          const Notifications = require('expo-notifications');
          await Notifications.requestPermissionsAsync();
        } catch (e) {}
      }
      await setOnboarded();
      navigation.replace('Main');
    }
  };

  const renderSlide = ({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.slideIcon}>{item.icon}</Text>
      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        keyExtractor={(_, i) => i.toString()}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity style={styles.nextBtn} onPress={handleNext} activeOpacity={0.7}>
          <Text style={styles.nextBtnText}>
            {currentIndex === SLIDES.length - 1 ? 'Start Training' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  slide: { width, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding * 2, flex: 1 },
  slideIcon: { fontSize: 80, marginBottom: 30 },
  slideTitle: { fontSize: SIZES.xxl, fontWeight: 'bold', color: COLORS.text, textAlign: 'center', marginBottom: 16 },
  slideSubtitle: { fontSize: SIZES.md, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 24 },
  footer: { padding: SIZES.padding * 2 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.cardBorder },
  dotActive: { backgroundColor: COLORS.accent, width: 24 },
  nextBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius, paddingVertical: 16,
    alignItems: 'center',
  },
  nextBtnText: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.text },
});
