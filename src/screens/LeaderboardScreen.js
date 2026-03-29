import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'BrainMaster', score: 12500, badge: '🥇' },
  { rank: 2, name: 'IQGenius', score: 11200, badge: '🥈' },
  { rank: 3, name: 'MindPro', score: 10800, badge: '🥉' },
  { rank: 4, name: 'NeuralNinja', score: 9500, badge: '4' },
  { rank: 5, name: 'ThinkFast', score: 8900, badge: '5' },
  { rank: 6, name: 'PuzzleKing', score: 8200, badge: '6' },
  { rank: 7, name: 'SmartCookie', score: 7600, badge: '7' },
  { rank: 8, name: 'QuizWhiz', score: 7100, badge: '8' },
  { rank: 9, name: 'LogicLord', score: 6500, badge: '9' },
  { rank: 10, name: 'BrainWave', score: 5900, badge: '10' },
];

export default function LeaderboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>Top Players This Week</Text>

        {MOCK_LEADERBOARD.map((player) => (
          <View key={player.rank} style={[styles.row, player.rank <= 3 && styles.topRow]}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{player.badge}</Text>
            </View>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
            </View>
            <Text style={styles.playerScore}>⭐ {player.score.toLocaleString()}</Text>
          </View>
        ))}

        <View style={[styles.row, styles.yourRow]}>
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>--</Text>
          </View>
          <View style={styles.playerInfo}>
            <Text style={[styles.playerName, { color: COLORS.accent }]}>You</Text>
          </View>
          <Text style={styles.playerScore}>Play to rank!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { fontSize: SIZES.xxl, fontWeight: 'bold', color: COLORS.text, padding: SIZES.padding, paddingTop: 20, paddingBottom: 4 },
  subtitle: { fontSize: SIZES.md, color: COLORS.textSecondary, paddingHorizontal: SIZES.padding, marginBottom: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: SIZES.radius, padding: 16, marginHorizontal: SIZES.padding, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  topRow: { borderColor: COLORS.warning + '60' },
  yourRow: { borderColor: COLORS.accent + '60', marginTop: 8 },
  rankBadge: { width: 36, alignItems: 'center' },
  rankText: { fontSize: 20 },
  playerInfo: { flex: 1, marginLeft: 12 },
  playerName: { fontSize: SIZES.md, fontWeight: 'bold', color: COLORS.text },
  playerScore: { fontSize: SIZES.md, color: COLORS.warning, fontWeight: 'bold' },
});
