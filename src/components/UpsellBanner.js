import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function UpsellBanner({ message, navigation }) {
  return (
    <TouchableOpacity
      style={styles.banner}
      onPress={() => navigation.navigate('Premium')}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>👑 {message}</Text>
      <Text style={styles.cta}>Try Free →</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.primary + '30', borderRadius: SIZES.radius, padding: 14,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.primary + '60',
  },
  text: { fontSize: SIZES.sm, color: COLORS.text, flex: 1 },
  cta: { fontSize: SIZES.sm, color: COLORS.accent, fontWeight: 'bold', marginLeft: 8 },
});
