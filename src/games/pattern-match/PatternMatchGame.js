import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function PatternMatchGame({ onCorrect, onWrong, isActive }) {
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
    if (!isActive) return;
    const correct = selected === answer;
    if (correct) onCorrect();
    else onWrong();
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

const styles = StyleSheet.create({
  gameArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  patternText: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 40, textAlign: 'center' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  optionBtn: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20,
    minWidth: (width - 60) / 2, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  optionText: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
});
