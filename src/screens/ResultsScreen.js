import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import {
  addToTotalScore, updateStreak, addGameToHistory,
  incrementTotalGamesPlayed, getTotalGamesPlayed,
  shouldShowRatingPrompt, markRatingPromptShown,
} from '../services/storage';
import { showInterstitial, showRewarded, shouldShowInterstitial, trackGameCompleted } from '../services/ads';
import usePremium from '../hooks/usePremium';
import ScoreCard, { captureScoreCard } from '../components/ScoreCard';
import UpsellBanner from '../components/UpsellBanner';
import { RATING } from '../constants/config';

export default function ResultsScreen({ route, navigation }) {
  const { score, correct, wrong, gameTitle, gameId } = route.params;
  const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
  const { isPremium } = usePremium();
  const scoreCardRef = useRef(null);

  useEffect(() => { saveAndProcess(); }, []);

  const saveAndProcess = async () => {
    try {
      await addToTotalScore(score);
      await updateStreak();
      await addGameToHistory({ score, correct, wrong, accuracy, gameTitle });
      const totalGames = await incrementTotalGamesPlayed();
      trackGameCompleted();

      if (!isPremium && shouldShowInterstitial()) {
        await showInterstitial();
      }

      if (totalGames >= RATING.MIN_GAMES_BEFORE_PROMPT && await shouldShowRatingPrompt()) {
        await triggerRatingPrompt();
      }
    } catch (e) {}
  };

  const triggerRatingPrompt = async () => {
    if (Platform.OS === 'web') return;
    try {
      const StoreReview = require('expo-store-review');
      if (await StoreReview.hasAction()) {
        await StoreReview.requestReview();
        await markRatingPromptShown();
      }
    } catch (e) {}
  };

  const shareScore = async () => {
    if (Platform.OS === 'web') return;
    try {
      const uri = await captureScoreCard(scoreCardRef);
      if (uri) {
        const Sharing = require('expo-sharing');
        await Sharing.shareAsync(uri);
      }
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

        <View style={{ position: 'absolute', left: -1000 }}>
          <ScoreCard
            ref={scoreCardRef}
            score={score} correct={correct} wrong={wrong}
            accuracy={accuracy} gameTitle={gameTitle} streak={0}
          />
        </View>

        <TouchableOpacity style={styles.shareBtn} onPress={shareScore} activeOpacity={0.7}>
          <Text style={styles.shareBtnText}>📤 Share Score Card</Text>
        </TouchableOpacity>

        {!isPremium && (
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={async () => { await showRewarded(); }}
            activeOpacity={0.7}
          >
            <Text style={styles.shareBtnText}>🎬 Watch Ad for Bonus</Text>
          </TouchableOpacity>
        )}

        {!isPremium && score >= 100 && (
          <UpsellBanner message="Track your improvement trends with Premium" navigation={navigation} />
        )}

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
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 24 },
  statItem: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16, minWidth: 100,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  statValue: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  statLabel: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  shareBtn: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, paddingVertical: 14,
    paddingHorizontal: 40, borderWidth: 1, borderColor: COLORS.cardBorder, marginBottom: 12,
    width: '100%', alignItems: 'center',
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
