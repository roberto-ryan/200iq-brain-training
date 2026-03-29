import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

let captureRef;
if (Platform.OS !== 'web') {
  captureRef = require('react-native-view-shot').captureRef;
}

function getGrade(score) {
  if (score >= 200) return { grade: 'S', color: COLORS.accent };
  if (score >= 150) return { grade: 'A', color: COLORS.success };
  if (score >= 100) return { grade: 'B', color: COLORS.primaryLight };
  if (score >= 50) return { grade: 'C', color: COLORS.warning };
  return { grade: 'D', color: COLORS.danger };
}

const ScoreCard = React.forwardRef(({ score, correct, wrong, accuracy, gameTitle, streak }, ref) => {
  const { grade, color } = getGrade(score);

  return (
    <View ref={ref} style={styles.card} collapsable={false}>
      <Text style={styles.brand}>🧠 200IQ Brain Training</Text>
      <Text style={styles.game}>{gameTitle}</Text>
      <Text style={[styles.grade, { color }]}>{grade}</Text>
      <View style={styles.statsRow}>
        <Text style={styles.stat}>⭐ {score}</Text>
        <Text style={styles.stat}>✓ {correct}</Text>
        <Text style={styles.stat}>🎯 {accuracy}%</Text>
      </View>
      {streak > 0 && <Text style={styles.streak}>🔥 {streak} day streak</Text>}
    </View>
  );
});

export default ScoreCard;

export async function captureScoreCard(viewRef) {
  if (!captureRef || !viewRef?.current) return null;
  try {
    const uri = await captureRef(viewRef, { format: 'png', quality: 1 });
    return uri;
  } catch (e) {
    return null;
  }
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bg, borderRadius: 16, padding: 24, alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.accent, width: 300,
  },
  brand: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 },
  game: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
  grade: { fontSize: 64, fontWeight: 'bold', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 8 },
  stat: { fontSize: 16, color: COLORS.text, fontWeight: 'bold' },
  streak: { fontSize: 14, color: COLORS.warning, marginTop: 4 },
});
