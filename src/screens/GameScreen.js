import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';

const { width } = Dimensions.get('window');
const GAME_DURATION = 30; // seconds per round

// Speed Math Game
function SpeedMathGame({ onScore, onAnswer }) {
  const [problem, setProblem] = useState(null);
  const [options, setOptions] = useState([]);

  const generateProblem = useCallback(() => {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    if (op === '+') { a = Math.floor(Math.random() * 50) + 1; b = Math.floor(Math.random() * 50) + 1; answer = a + b; }
    else if (op === '-') { a = Math.floor(Math.random() * 50) + 20; b = Math.floor(Math.random() * a); answer = a - b; }
    else { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; answer = a * b; }

    const wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
      const wrong = answer + (Math.floor(Math.random() * 20) - 10);
      if (wrong !== answer && wrong >= 0) wrongAnswers.add(wrong);
    }
    const allOptions = [answer, ...wrongAnswers].sort(() => Math.random() - 0.5);
    setProblem({ text: `${a} ${op} ${b}`, answer });
    setOptions(allOptions);
  }, []);

  useEffect(() => { generateProblem(); }, []);

  const handleAnswer = (selected) => {
    const correct = selected === problem.answer;
    onAnswer(correct);
    if (correct) onScore(10);
    generateProblem();
  };

  if (!problem) return null;
  return (
    <View style={styles.gameArea}>
      <Text style={styles.problemText}>{problem.text}</Text>
      <View style={styles.optionsGrid}>
        {options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.optionBtn} onPress={() => handleAnswer(opt)} activeOpacity={0.7}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Pattern Match Game
function PatternMatchGame({ onScore, onAnswer }) {
  const [sequence, setSequence] = useState([]);
  const [options, setOptions] = useState([]);
  const [answer, setAnswer] = useState(null);

  const generatePattern = useCallback(() => {
    const patternType = Math.floor(Math.random() * 3);
    let seq, ans;
    if (patternType === 0) { // arithmetic
      const start = Math.floor(Math.random() * 10);
      const step = Math.floor(Math.random() * 5) + 2;
      seq = Array.from({ length: 4 }, (_, i) => start + step * i);
      ans = start + step * 4;
    } else if (patternType === 1) { // multiply
      const start = Math.floor(Math.random() * 3) + 2;
      const mult = Math.floor(Math.random() * 2) + 2;
      seq = [start]; for (let i = 1; i < 4; i++) seq.push(seq[i - 1] * mult);
      ans = seq[3] * mult;
    } else { // alternating add
      const start = Math.floor(Math.random() * 10) + 1;
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      seq = [start];
      for (let i = 1; i < 4; i++) seq.push(seq[i - 1] + (i % 2 === 1 ? a : b));
      ans = seq[3] + (4 % 2 === 1 ? a : b);
    }
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const w = ans + (Math.floor(Math.random() * 10) - 5);
      if (w !== ans && w >= 0) wrongs.add(w);
    }
    setSequence(seq);
    setAnswer(ans);
    setOptions([ans, ...wrongs].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => { generatePattern(); }, []);

  const handleAnswer = (selected) => {
    const correct = selected === answer;
    onAnswer(correct);
    if (correct) onScore(15);
    generatePattern();
  };

  return (
    <View style={styles.gameArea}>
      <Text style={styles.patternText}>{sequence.join('  →  ')}  →  ?</Text>
      <View style={styles.optionsGrid}>
        {options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.optionBtn} onPress={() => handleAnswer(opt)} activeOpacity={0.7}>
            <Text style={styles.optionText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Memory Grid Game
function MemoryGridGame({ onScore, onAnswer }) {
  const [gridSize] = useState(4);
  const [highlighted, setHighlighted] = useState([]);
  const [userSelections, setUserSelections] = useState([]);
  const [phase, setPhase] = useState('show'); // show, input
  const [level, setLevel] = useState(3);

  const generateGrid = useCallback(() => {
    const cells = [];
    while (cells.length < level) {
      const cell = Math.floor(Math.random() * (gridSize * gridSize));
      if (!cells.includes(cell)) cells.push(cell);
    }
    setHighlighted(cells);
    setUserSelections([]);
    setPhase('show');
    setTimeout(() => setPhase('input'), 1500);
  }, [level, gridSize]);

  useEffect(() => { generateGrid(); }, [level]);

  const handleCellPress = (index) => {
    if (phase !== 'input') return;
    if (userSelections.includes(index)) return;
    const newSelections = [...userSelections, index];
    setUserSelections(newSelections);

    if (!highlighted.includes(index)) {
      onAnswer(false);
      generateGrid();
      return;
    }

    if (newSelections.length === highlighted.length) {
      onAnswer(true);
      onScore(20);
      setLevel(prev => Math.min(prev + 1, 8));
      setTimeout(generateGrid, 500);
    }
  };

  return (
    <View style={styles.gameArea}>
      <Text style={styles.memoryLabel}>{phase === 'show' ? 'Memorize!' : `Tap ${level} cells`}</Text>
      <View style={[styles.grid, { width: width - 60 }]}>
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const isHighlighted = phase === 'show' && highlighted.includes(i);
          const isSelected = userSelections.includes(i);
          const isCorrect = isSelected && highlighted.includes(i);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleCellPress(i)}
              style={[
                styles.gridCell,
                { width: (width - 80) / gridSize, height: (width - 80) / gridSize },
                isHighlighted && { backgroundColor: COLORS.accent },
                isCorrect && { backgroundColor: COLORS.success },
                isSelected && !isCorrect && { backgroundColor: COLORS.danger },
              ]}
              activeOpacity={0.7}
            />
          );
        })}
      </View>
    </View>
  );
}

// Color Match Game (Stroop)
function ColorMatchGame({ onScore, onAnswer }) {
  const [colorWord, setColorWord] = useState(null);
  const [options, setOptions] = useState([]);

  const GAME_COLORS = [
    { name: 'RED', value: '#ff7675' },
    { name: 'BLUE', value: '#74b9ff' },
    { name: 'GREEN', value: '#00b894' },
    { name: 'YELLOW', value: '#fdcb6e' },
    { name: 'PURPLE', value: '#a29bfe' },
    { name: 'ORANGE', value: '#e17055' },
  ];

  const generate = useCallback(() => {
    const wordColor = GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)];
    const displayColor = GAME_COLORS[Math.floor(Math.random() * GAME_COLORS.length)];
    setColorWord({ word: wordColor.name, color: displayColor.value, correctAnswer: displayColor.name });

    const wrongOptions = GAME_COLORS.filter(c => c.name !== displayColor.name)
      .sort(() => Math.random() - 0.5).slice(0, 3);
    setOptions([{ name: displayColor.name }, ...wrongOptions].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => { generate(); }, []);

  const handleAnswer = (selected) => {
    const correct = selected === colorWord.correctAnswer;
    onAnswer(correct);
    if (correct) onScore(12);
    generate();
  };

  if (!colorWord) return null;
  return (
    <View style={styles.gameArea}>
      <Text style={styles.colorHint}>What COLOR is this text?</Text>
      <Text style={[styles.colorWord, { color: colorWord.color }]}>{colorWord.word}</Text>
      <View style={styles.optionsGrid}>
        {options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.optionBtn} onPress={() => handleAnswer(opt.name)} activeOpacity={0.7}>
            <Text style={styles.optionText}>{opt.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// Main Game Screen
export default function GameScreen({ route, navigation }) {
  const { gameId, gameTitle } = route.params;
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const timerRef = useRef(null);

  useEffect(() => {
    // Countdown before game starts
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

  const handleScore = (points) => setScore(prev => prev + points);
  const handleAnswer = (isCorrect) => {
    if (isCorrect) setCorrect(prev => prev + 1);
    else setWrong(prev => prev + 1);
  };

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

  const GameComponent = {
    'speed-math': SpeedMathGame,
    'pattern-match': PatternMatchGame,
    'memory-grid': MemoryGridGame,
    'color-match': ColorMatchGame,
    'daily': SpeedMathGame, // daily cycles through games
  }[gameId] || SpeedMathGame;

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

      <GameComponent onScore={handleScore} onAnswer={handleAnswer} />

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
  gameArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  problemText: { fontSize: 48, fontWeight: 'bold', color: COLORS.text, marginBottom: 40 },
  patternText: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 40, textAlign: 'center' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  optionBtn: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20,
    minWidth: (width - 60) / 2, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  optionText: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  memoryLabel: { fontSize: SIZES.lg, color: COLORS.accent, marginBottom: 20, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  gridCell: {
    backgroundColor: COLORS.card, borderRadius: 8, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  colorHint: { fontSize: SIZES.md, color: COLORS.textSecondary, marginBottom: 20 },
  colorWord: { fontSize: 56, fontWeight: 'bold', marginBottom: 40 },
  gameStats: { flexDirection: 'row', justifyContent: 'center', gap: 30, paddingBottom: 20 },
  gameStatText: { fontSize: SIZES.lg, color: COLORS.success, fontWeight: 'bold' },
});
