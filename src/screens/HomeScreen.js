import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { getStreak, getTotalScore, getDailySessionCount } from '../services/storage';
import { getGames, getDailyChallenge } from '../games/registry';
import AppBannerAd from '../components/BannerAd';
import PremiumBadge from '../components/PremiumBadge';
import usePremium from '../hooks/usePremium';
import { ADS, FREE_TIER } from '../constants/config';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [streak, setStreak] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const { isPremium } = usePremium();
  const dailyGame = getDailyChallenge();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadStats);
    return unsubscribe;
  }, [navigation]);

  const loadStats = async () => {
    try {
      const [s, t, sc] = await Promise.all([
        getStreak(),
        getTotalScore(),
        getDailySessionCount(),
      ]);
      setStreak(s);
      setTotalScore(t);
      setSessionCount(sc);
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.logo}>🧠 200IQ</Text>
            <PremiumBadge isPremium={isPremium} />
          </View>
          <Text style={styles.subtitle}>Brain Training</Text>
        </View>

        <AppBannerAd unitId={ADS.BANNER_HOME} isPremium={isPremium} />

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🔥 {streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>⭐ {totalScore}</Text>
            <Text style={styles.statLabel}>Total Score</Text>
          </View>
        </View>

        {!isPremium && (
          <Text style={styles.sessionCounter}>
            🎮 {sessionCount} / {FREE_TIER.DAILY_SESSION_LIMIT} games today
          </Text>
        )}

        <TouchableOpacity
          style={styles.dailyChallenge}
          onPress={() => navigation.navigate('Game', { gameId: 'daily', gameTitle: `Daily: ${dailyGame.title}` })}
          activeOpacity={0.7}
        >
          <Text style={styles.dailyIcon}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.dailyTitle}>Daily Challenge</Text>
            <Text style={styles.dailyDesc}>Today: {dailyGame.icon} {dailyGame.title}</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Choose Your Challenge</Text>

        <View style={styles.gamesGrid}>
          {getGames().map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, { borderColor: game.color + '60' }]}
              onPress={() => navigation.navigate('Game', { gameId: game.id, gameTitle: game.title })}
              activeOpacity={0.7}
            >
              <Text style={styles.gameIcon}>{game.icon}</Text>
              <Text style={styles.gameTitle}>{game.title}</Text>
              <Text style={styles.gameDesc}>{game.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 10 },
  logo: { fontSize: 42, fontWeight: 'bold', color: COLORS.text },
  subtitle: { fontSize: SIZES.lg, color: COLORS.primaryLight, marginTop: 4 },
  statsRow: { flexDirection: 'row', paddingHorizontal: SIZES.padding, gap: 12, marginTop: 16 },
  statCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: SIZES.radius,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  statValue: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  sessionCounter: { textAlign: 'center', color: COLORS.textSecondary, fontSize: SIZES.sm, marginTop: 12 },
  sectionTitle: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.text, paddingHorizontal: SIZES.padding, marginTop: 24, marginBottom: 12 },
  gamesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SIZES.padding, gap: 12 },
  gameCard: {
    width: (width - SIZES.padding * 2 - 12) / 2,
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20,
    alignItems: 'center', borderWidth: 1,
  },
  gameIcon: { fontSize: 40, marginBottom: 8 },
  gameTitle: { fontSize: SIZES.md, fontWeight: 'bold', color: COLORS.text },
  gameDesc: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4, textAlign: 'center' },
  dailyChallenge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: SIZES.radius, padding: 20, marginHorizontal: SIZES.padding,
    marginTop: 16, borderWidth: 1, borderColor: COLORS.accent + '40',
  },
  dailyIcon: { fontSize: 40, marginRight: 16 },
  dailyTitle: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.accent },
  dailyDesc: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
});
