import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { getTotalScore, getStreak, getGameHistory } from '../services/storage';
import AppBannerAd from '../components/BannerAd';
import UpsellBanner from '../components/UpsellBanner';
import usePremium from '../hooks/usePremium';
import useAuth from '../hooks/useAuth';
import { ADS } from '../constants/config';

const STREAK_MILESTONES = [
  { days: 7, icon: '🔥', label: '1 Week' },
  { days: 30, icon: '⚡', label: '1 Month' },
  { days: 100, icon: '💎', label: '100 Days' },
];

export default function StatsScreen({ navigation }) {
  const [stats, setStats] = useState({ totalScore: 0, streak: 0, gamesPlayed: 0, avgAccuracy: 0 });
  const [history, setHistory] = useState([]);
  const { isPremium } = usePremium();
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadStats);
    return unsubscribe;
  }, [navigation]);

  const loadStats = async () => {
    try {
      const totalScore = await getTotalScore();
      const streak = await getStreak();
      const historyData = await getGameHistory();
      const gamesPlayed = historyData.length;
      const avgAccuracy = gamesPlayed > 0 ? Math.round(historyData.reduce((a, g) => a + g.accuracy, 0) / gamesPlayed) : 0;
      setStats({ totalScore, streak, gamesPlayed, avgAccuracy });
      setHistory(historyData);
    } catch (e) {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>📊 Your Stats</Text>

        <AppBannerAd unitId={ADS.BANNER_STATS} isPremium={isPremium} />

        {!user && (
          <TouchableOpacity
            style={styles.signInBanner}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.signInText}>🔗 Sign in to sync your stats across devices</Text>
          </TouchableOpacity>
        )}

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>⭐ {stats.totalScore}</Text>
            <Text style={styles.statLabel}>Total Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🔥 {stats.streak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🎮 {stats.gamesPlayed}</Text>
            <Text style={styles.statLabel}>Games Played</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>🎯 {stats.avgAccuracy}%</Text>
            <Text style={styles.statLabel}>Avg Accuracy</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Streak Milestones</Text>
        <View style={styles.milestonesRow}>
          {STREAK_MILESTONES.map((m) => (
            <View key={m.days} style={[styles.milestone, stats.streak >= m.days && styles.milestoneAchieved]}>
              <Text style={styles.milestoneIcon}>{m.icon}</Text>
              <Text style={styles.milestoneLabel}>{m.label}</Text>
              {stats.streak >= m.days && <Text style={styles.milestoneCheck}>✓</Text>}
            </View>
          ))}
        </View>

        {!isPremium && (
          <UpsellBanner message="Get detailed accuracy trends with Premium" navigation={navigation} />
        )}

        <Text style={styles.sectionTitle}>Recent Games</Text>
        {history.length === 0 ? (
          <Text style={styles.emptyText}>No games played yet. Start training!</Text>
        ) : (
          history.slice(0, 20).map((game, i) => (
            <View key={i} style={styles.historyItem}>
              <View>
                <Text style={styles.historyGame}>{game.gameTitle}</Text>
                <Text style={styles.historyDate}>{new Date(game.date).toLocaleDateString()}</Text>
              </View>
              <View style={styles.historyStats}>
                <Text style={styles.historyScore}>⭐ {game.score}</Text>
                <Text style={styles.historyAccuracy}>{game.accuracy}%</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { fontSize: SIZES.xxl, fontWeight: 'bold', color: COLORS.text, padding: SIZES.padding, paddingTop: 20 },
  signInBanner: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 14,
    marginHorizontal: SIZES.padding, marginBottom: 12, borderWidth: 1, borderColor: COLORS.accent + '40',
    alignItems: 'center',
  },
  signInText: { fontSize: SIZES.sm, color: COLORS.accent },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SIZES.padding, gap: 12 },
  statCard: {
    width: '47%', backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  statValue: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.text, padding: SIZES.padding, paddingTop: 24 },
  milestonesRow: { flexDirection: 'row', paddingHorizontal: SIZES.padding, gap: 12 },
  milestone: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 12,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder, opacity: 0.5,
  },
  milestoneAchieved: { opacity: 1, borderColor: COLORS.accent + '60' },
  milestoneIcon: { fontSize: 24, marginBottom: 4 },
  milestoneLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  milestoneCheck: { fontSize: 12, color: COLORS.success, marginTop: 2 },
  emptyText: { color: COLORS.textSecondary, textAlign: 'center', padding: 40, fontSize: SIZES.md },
  historyItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16,
    marginHorizontal: SIZES.padding, marginBottom: 8, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  historyGame: { fontSize: SIZES.md, fontWeight: 'bold', color: COLORS.text },
  historyDate: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
  historyStats: { alignItems: 'flex-end' },
  historyScore: { fontSize: SIZES.md, fontWeight: 'bold', color: COLORS.warning },
  historyAccuracy: { fontSize: SIZES.sm, color: COLORS.accent, marginTop: 2 },
});
