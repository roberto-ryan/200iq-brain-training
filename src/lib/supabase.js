import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Get or create a device ID for anonymous leaderboard
export async function getDeviceId() {
  let id = await AsyncStorage.getItem('deviceId');
  if (!id) {
    id = 'device_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    await AsyncStorage.setItem('deviceId', id);
  }
  return id;
}

// Submit a score to the leaderboard
export async function submitScore({ gameId, score, correct, wrong, accuracy, displayName }) {
  const deviceId = await getDeviceId();
  const { error } = await supabase.from('leaderboard').insert({
    device_id: deviceId,
    display_name: displayName || 'Player',
    game_id: gameId,
    score,
    correct,
    wrong,
    accuracy,
  });
  return !error;
}

// Get weekly leaderboard
export async function getLeaderboard(gameId, limit = 20) {
  const { data, error } = await supabase
    .from('weekly_leaderboard')
    .select('*')
    .eq('game_id', gameId)
    .order('best_score', { ascending: false })
    .limit(limit);
  return error ? [] : data;
}
