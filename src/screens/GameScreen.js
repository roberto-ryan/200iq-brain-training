import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { getGameById, getDailyChallenge } from '../games/registry';
import { getDailySessionCount, incrementDailySession } from '../services/storage';
import usePremium from '../hooks/usePremium';
import { FREE_TIER } from '../constants/config';

const GAME_DURATION = 30; // seconds per round

export default function GameScreen({ route, navigation }) {
  const { gameId, gameTitle } = route.params;
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef(null);
  const { isPremium } = usePremium();

  // Session limit check
  useEffect(() => {
    (async () => {
      if (isPremium) return;
      const count = await getDailySessionCount();
      if (count >= FREE_TIER.DAILY_SESSION_LIMIT) {
        navigation.replace('Premium');
        return;
      }
      await incrementDailySession();
    })();
  }, []);

  const resolvedId = gameId === 'daily' ? getDailyChallenge().id : gameId;
  const game = getGameById(resolvedId);
  const GameComponent = game ? game.GameComponent : null;
  const pointsPerCorrect = game ? game.metadata.pointsPerCorrect : 10;

  useEffect(() => {
    const cdInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(cdInterval);
          setGameStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cdInterval);
  }, []);

  useEffect(() => {
    if (!gameStarted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          navigation.replace('Results', { score, correct, wrong, gameId, gameTitle });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [gameStarted, score, correct, wrong]);

  const handleCorrect = () => {
    setScore(prev => prev + pointsPerCorrect);
    setCorrect(prev => prev + 1);
  };
  const handleWrong = () => { setWrong(prev => prev + 1); };

  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>{countdown}</Text>
          <Text style={styles.countdownLabel}>{gameTitle}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gameHeader}>
        <TouchableOpacity onPress={() => { clearInterval(timerRef.current); navigation.goBack(); }}>
          <Text style={styles.backBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.gameHeaderTitle}>{gameTitle}</Text>
        <Text style={styles.scoreText}>⭐ {score}</Text>
      </View>

      <View style={styles.timerBar}>
        <View style={[styles.timerFill, { width: `${(timeLeft / GAME_DURATION) * 100}%` }]} />
      </View>
      <Text style={styles.timerText}>{timeLeft}s</Text>

      {GameComponent && (
        <GameComponent onCorrect={handleCorrect} onWrong={handleWrong} isActive={gameStarted} />
      )}

      <View style={styles.gameStats}>
        <Text style={styles.gameStatText}>✓ {correct}</Text>
        <Text style={[styles.gameStatText, { color: COLORS.danger }]}>✗ {wrong}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  countdownContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  countdownText: { fontSize: 80, fontWeight: 'bold', color: COLORS.accent },
  countdownLabel: { fontSize: SIZES.xl, color: COLORS.textSecondary, marginTop: 10 },
  gameHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.padding, paddingVertical: 12 },
  backBtn: { fontSize: 24, color: COLORS.textSecondary },
  gameHeaderTitle: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.text },
  scoreText: { fontSize: SIZES.lg, color: COLORS.warning },
  timerBar: { height: 6, backgroundColor: COLORS.card, marginHorizontal: SIZES.padding, borderRadius: 3, overflow: 'hidden' },
  timerFill: { height: '100%', backgroundColor: COLORS.accent, borderRadius: 3 },
  timerText: { textAlign: 'center', color: COLORS.textSecondary, fontSize: SIZES.sm, marginTop: 4 },
  gameStats: { flexDirection: 'row', justifyContent: 'center', gap: 30, paddingBottom: 20 },
  gameStatText: { fontSize: SIZES.lg, color: COLORS.success, fontWeight: 'bold' },
});
