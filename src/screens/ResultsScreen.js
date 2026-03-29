import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ResultsScreen({ route, navigation }) {
  const { score, correct, wrong, gameTitle } = route.params;
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

  useEffect(() => {
    saveScore();
  }, []);

  const saveScore = async () => {
    try {
      const totalScore = await AsyncStorage.getItem('totalScore');
      const newTotal = (parseInt(totalScore) || 0) + score;
      await AsyncStorage.setItem('totalScore', newTotal.toString());

      const today = new Date().toDateString();
      const lastPlay = await AsyncStorage.getItem('lastPlayDate');
      const streak = await AsyncStorage.getItem('streak');
      const currentStreak = parseInt(streak) || 0;

      if (lastPlay !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastPlay === yesterday ? currentStreak + 1 : 1;
        await AsyncStorage.setItem('streak', newStreak.toString());
        await AsyncStorage.setItem('lastPlayDate', today);
      }

      // Save game history
      const history = JSON.parse(await AsyncStorage.getItem('gameHistory') || '[]');
      history.unshift({ score, correct, wrong, accuracy, gameTitle, date: new Date().toISOString() });
      await AsyncStorage.setItem('gameHistory', JSON.stringify(history.slice(0, 50)));
    } catch (e) {}
  };

  const shareScore = async () => {
    try {
      await Share.share({
        message: `🧠 I scored ${score} points on ${gameTitle} in 200IQ Brain Training with ${accuracy}% accuracy! Can you beat me? Download: https://200iq.app`,
      });
    } catch (e) {}
  };

  const getGrade = () => {
    if (score >= 200) return { grade: 'S', color: COLORS.accent, label: 'Genius!' };
    if (score >= 150) return { grade: 'A', color: COLORS.success, label: 'Brilliant!' };
    if (score >= 100) return { grade: 'B', color: COLORS.primaryLight, label: 'Great!' };
    if (score >= 50) return { grade: 'C', color: COLORS.warning, label: 'Good effort!' };
    return { grade: 'D', color: COLORS.danger, label: 'Keep practicing!' };
  };

  const { grade, color, label } = getGrade();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Results</Text>
        <Text style={styles.gameTitle}>{gameTitle}</Text>

        <View style={[styles.gradeCircle, { borderColor: color }]}>
          <Text style={[styles.gradeText, { color }]}>{grade}</Text>
          <Text style={styles.gradeLabel}>{label}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>⭐ {score}</Text>
            <Text style={styles.statLabel}>Score</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>✓ {correct}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: COLORS.danger }]}>✗ {wrong}</Text>
            <Text style={styles.statLabel}>Wrong</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={shareScore} activeOpacity={0.7}>
          <Text style={styles.shareBtnText}>📤 Share Score</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.playAgainBtn} onPress={() => navigation.replace('Game', route.params)} activeOpacity={0.7}>
          <Text style={styles.playAgainText}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Main')} activeOpacity={0.7}>
          <Text style={styles.homeBtnText}>Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding },
  title: { fontSize: SIZES.xxl, fontWeight: 'bold', color: COLORS.text },
  gameTitle: { fontSize: SIZES.md, color: COLORS.textSecondary, marginBottom: 24 },
  gradeCircle: {
    width: 120, height: 120, borderRadius: 60, borderWidth: 4,
    justifyContent: 'center', alignItems: 'center', marginBottom: 30,
  },
  gradeText: { fontSize: 48, fontWeight: 'bold' },
  gradeLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 30 },
  statItem: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16, minWidth: 100,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  statValue: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  shareBtn: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, paddingVertical: 14,
    paddingHorizontal: 40, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 12,
  },
  shareBtnText: { fontSize: SIZES.md, color: COLORS.text, fontWeight: 'bold' },
  playAgainBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius, paddingVertical: 14,
    paddingHorizontal: 40, marginBottom: 12, width: '100%', alignItems: 'center',
  },
  playAgainText: { fontSize: SIZES.lg, color: COLORS.text, fontWeight: 'bold' },
  homeBtn: { paddingVertical: 14 },
  homeBtnText: { fontSize: SIZES.md, color: COLORS.textSecondary },
});
