import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const { width } = Dimensions.get('window');

const GAME_COLORS = [
  { name: 'RED', value: '#ff7675' },
  { name: 'BLUE', value: '#74b9ff' },
  { name: 'GREEN', value: '#00b894' },
  { name: 'YELLOW', value: '#fdcb6e' },
  { name: 'PURPLE', value: '#a29bfe' },
  { name: 'ORANGE', value: '#e17055' },
];

export default function ColorMatchGame({ onCorrect, onWrong, isActive }) {
  const [colorWord, setColorWord] = useState(null);
  const [options, setOptions] = useState([]);

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
    if (!isActive) return;
    const correct = selected === colorWord.correctAnswer;
    if (correct) onCorrect();
    else onWrong();
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

const styles = StyleSheet.create({
  gameArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  colorHint: { fontSize: SIZES.md, color: COLORS.textSecondary, marginBottom: 20 },
  colorWord: { fontSize: 56, fontWeight: 'bold', marginBottom: 40 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12 },
  optionBtn: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20,
    minWidth: (width - 60) / 2, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  optionText: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
});
