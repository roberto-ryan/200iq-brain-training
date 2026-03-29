import { supabase } from '../lib/supabase';
import { getDeviceId, getTotalScore, getStreak, getGameHistory } from './storage';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) return { success: false, error };
  return { success: true, data };
}

export async function signInWithApple() {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'apple' });
  if (error) return { success: false, error };
  return { success: true, data };
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session || null;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

export async function migrateLocalData(userId) {
  const deviceId = await getDeviceId();
  const totalScore = await getTotalScore();
  const streak = await getStreak();
  const history = await getGameHistory();

  await supabase.from('users').upsert({
    id: userId,
    device_id: deviceId,
    total_score: totalScore,
    streak: streak,
  }, { onConflict: 'id' });

  if (history.length > 0) {
    const rows = history.map(h => ({
      user_id: userId,
      device_id: deviceId,
      game_id: h.gameTitle,
      score: h.score,
      correct: h.correct,
      wrong: h.wrong,
      accuracy: h.accuracy,
      created_at: h.date,
    }));
    await supabase.from('game_history').insert(rows);
  }
}
