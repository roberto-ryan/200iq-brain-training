import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatsScreen() {
  const [stats, setStats] = useState({ totalScore: 0, streak: 0, gamesPlayed: 0, avgAccuracy: 0 });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const totalScore = parseInt(await AsyncStorage.getItem('totalScore') || '0');
      const streak = parseInt(await AsyncStorage.getItem('streak') || '0');
      const historyData = JSON.parse(await AsyncStorage.getItem('gameHistory') || '[]');
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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SIZES.padding, gap: 12 },
  statCard: {
    width: '47%', backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  statValue: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  sectionTitle: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.text, padding: SIZES.padding, paddingTop: 24 },
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
