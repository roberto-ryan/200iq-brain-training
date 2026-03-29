import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function SpeedMathGame({ onCorrect, onWrong, isActive }) {
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
    if (!isActive) return;
    const correct = selected === problem.answer;
    if (correct) onCorrect();
    else onWrong();
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

const styles = StyleSheet.create({
  gameArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  problemText: { fontSize: 48, fontWeight: 'bold', color: COLORS.text, marginBottom: 40 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  optionBtn: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20,
    minWidth: (width - 60) / 2, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  optionText: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
});
