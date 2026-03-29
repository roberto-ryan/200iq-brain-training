import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function MemoryGridGame({ onCorrect, onWrong, isActive }) {
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
    if (!isActive) return;
    if (phase !== 'input') return;
    if (userSelections.includes(index)) return;
    const newSelections = [...userSelections, index];
    setUserSelections(newSelections);

    if (!highlighted.includes(index)) {
      onWrong();
      generateGrid();
      return;
    }

    if (newSelections.length === highlighted.length) {
      onCorrect();
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

const styles = StyleSheet.create({
  gameArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SIZES.padding },
  memoryLabel: { fontSize: SIZES.lg, color: COLORS.accent, marginBottom: 20, fontWeight: 'bold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 },
  gridCell: {
    backgroundColor: COLORS.card, borderRadius: 8, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
});
