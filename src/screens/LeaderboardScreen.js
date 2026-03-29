import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { getLeaderboard } from '../lib/supabase';
import { getDeviceId } from '../services/storage';
import useAuth from '../hooks/useAuth';
import usePremium from '../hooks/usePremium';

export default function LeaderboardScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myDeviceId, setMyDeviceId] = useState(null);
  const { user } = useAuth();
  const { isPremium } = usePremium();

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [data, deviceId] = await Promise.all([
      getLeaderboard('speed-math', 20),
      getDeviceId(),
    ]);
    setEntries(data);
    setMyDeviceId(deviceId);
    setLoading(false);
  };

  const getBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>Top Players This Week</Text>

        {loading ? (
          <ActivityIndicator color={COLORS.accent} size="large" style={{ marginTop: 40 }} />
        ) : entries.length === 0 ? (
          <Text style={styles.emptyText}>No scores yet this week. Be the first!</Text>
        ) : (
          entries.map((entry, i) => {
            const rank = i + 1;
            const isMe = entry.device_id === myDeviceId;
            return (
              <View key={i} style={[styles.row, rank <= 3 && styles.topRow, isMe && styles.myRow]}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>{getBadge(rank)}</Text>
                </View>
                <View style={styles.playerInfo}>
                  <Text style={[styles.playerName, isMe && { color: COLORS.accent }]}>
                    {entry.display_name || 'Player'}
                    {isMe ? ' (You)' : ''}
                  </Text>
                </View>
                <Text style={styles.playerScore}>⭐ {(entry.best_score || 0).toLocaleString()}</Text>
              </View>
            );
          })
        )}

        {!user && (
          <TouchableOpacity
            style={styles.signInPrompt}
            onPress={() => navigation.navigate('Settings')}
            activeOpacity={0.7}
          >
            <Text style={styles.signInText}>🔗 Sign in to set your display name and compete!</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { fontSize: SIZES.xxl, fontWeight: 'bold', color: COLORS.text, padding: SIZES.padding, paddingTop: 20, paddingBottom: 4 },
  subtitle: { fontSize: SIZES.md, color: COLORS.textSecondary, paddingHorizontal: SIZES.padding, marginBottom: 16 },
  emptyText: { color: COLORS.textSecondary, textAlign: 'center', padding: 40, fontSize: SIZES.md },
  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card,
    borderRadius: SIZES.radius, padding: 16, marginHorizontal: SIZES.padding, marginBottom: 8,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  topRow: { borderColor: COLORS.warning + '60' },
  myRow: { borderColor: COLORS.accent + '60' },
  rankBadge: { width: 36, alignItems: 'center' },
  rankText: { fontSize: 20 },
  playerInfo: { flex: 1, marginLeft: 12 },
  playerName: { fontSize: SIZES.md, fontWeight: 'bold', color: COLORS.text },
  playerScore: { fontSize: SIZES.md, color: COLORS.warning, fontWeight: 'bold' },
  signInPrompt: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 16,
    marginHorizontal: SIZES.padding, marginTop: 16, borderWidth: 1, borderColor: COLORS.accent + '40',
    alignItems: 'center',
  },
  signInText: { fontSize: SIZES.md, color: COLORS.accent },
});
