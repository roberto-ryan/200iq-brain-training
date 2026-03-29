import React from 'react';
import { Text } from 'react-native';

export default function PremiumBadge({ isPremium }) {
  if (!isPremium) return null;
  return <Text style={{ fontSize: 14, color: '#fdcb6e' }}> 👑</Text>;
}
