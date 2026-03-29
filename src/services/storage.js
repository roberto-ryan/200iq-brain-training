import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOTAL_SCORE: 'totalScore',
  STREAK: 'streak',
  LAST_PLAY_DATE: 'lastPlayDate',
  GAME_HISTORY: 'gameHistory',
  DEVICE_ID: 'deviceId',
  HAS_ONBOARDED: 'hasOnboarded',
  DAILY_SESSION_COUNT: 'dailySessionCount',
  DAILY_SESSION_DATE: 'dailySessionDate',
  LAST_RATING_PROMPT: 'lastRatingPrompt',
  TOTAL_GAMES_PLAYED: 'totalGamesPlayed',
  NOTIFICATION_PREFS: 'notificationPrefs',
  STREAK_FREEZE_USED_TODAY: 'streakFreezeUsedToday',
  STREAK_FREEZE_DATE: 'streakFreezeDate',
};

export async function getDeviceId() {
  let id = await AsyncStorage.getItem(KEYS.DEVICE_ID);
  if (!id) {
    id = 'device_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    await AsyncStorage.setItem(KEYS.DEVICE_ID, id);
  }
  return id;
}

export async function getDailySessionCount() {
  const date = await AsyncStorage.getItem(KEYS.DAILY_SESSION_DATE);
  const today = new Date().toDateString();
  if (date !== today) return 0;
  return parseInt(await AsyncStorage.getItem(KEYS.DAILY_SESSION_COUNT) || '0');
}

export async function incrementDailySession() {
  const today = new Date().toDateString();
  const date = await AsyncStorage.getItem(KEYS.DAILY_SESSION_DATE);
  let count = 0;
  if (date === today) {
    count = parseInt(await AsyncStorage.getItem(KEYS.DAILY_SESSION_COUNT) || '0');
  }
  count += 1;
  await AsyncStorage.setItem(KEYS.DAILY_SESSION_COUNT, count.toString());
  await AsyncStorage.setItem(KEYS.DAILY_SESSION_DATE, today);
  return count;
}

export async function getStreak() {
  return parseInt(await AsyncStorage.getItem(KEYS.STREAK) || '0');
}

export async function getLastPlayDate() {
  return await AsyncStorage.getItem(KEYS.LAST_PLAY_DATE);
}

export async function updateStreak() {
  const today = new Date().toDateString();
  const lastPlay = await AsyncStorage.getItem(KEYS.LAST_PLAY_DATE);
  const currentStreak = parseInt(await AsyncStorage.getItem(KEYS.STREAK) || '0');
  if (lastPlay === today) return currentStreak;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const newStreak = lastPlay === yesterday ? currentStreak + 1 : 1;
  await AsyncStorage.setItem(KEYS.STREAK, newStreak.toString());
  await AsyncStorage.setItem(KEYS.LAST_PLAY_DATE, today);
  return newStreak;
}

export async function hasUsedStreakFreezeToday() {
  const date = await AsyncStorage.getItem(KEYS.STREAK_FREEZE_DATE);
  return date === new Date().toDateString();
}

export async function useStreakFreeze() {
  const today = new Date().toDateString();
  const lastPlay = await AsyncStorage.getItem(KEYS.LAST_PLAY_DATE);
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (lastPlay === yesterday || lastPlay === today) return false;
  await AsyncStorage.setItem(KEYS.LAST_PLAY_DATE, yesterday);
  await AsyncStorage.setItem(KEYS.STREAK_FREEZE_DATE, today);
  return true;
}

export async function getTotalScore() {
  return parseInt(await AsyncStorage.getItem(KEYS.TOTAL_SCORE) || '0');
}

export async function addToTotalScore(points) {
  const current = await getTotalScore();
  const newTotal = current + points;
  await AsyncStorage.setItem(KEYS.TOTAL_SCORE, newTotal.toString());
  return newTotal;
}

export async function getGameHistory() {
  return JSON.parse(await AsyncStorage.getItem(KEYS.GAME_HISTORY) || '[]');
}

export async function addGameToHistory({ score, correct, wrong, accuracy, gameTitle }) {
  const history = await getGameHistory();
  history.unshift({ score, correct, wrong, accuracy, gameTitle, date: new Date().toISOString() });
  await AsyncStorage.setItem(KEYS.GAME_HISTORY, JSON.stringify(history.slice(0, 50)));
  return history;
}

export async function getTotalGamesPlayed() {
  return parseInt(await AsyncStorage.getItem(KEYS.TOTAL_GAMES_PLAYED) || '0');
}

export async function incrementTotalGamesPlayed() {
  const count = (await getTotalGamesPlayed()) + 1;
  await AsyncStorage.setItem(KEYS.TOTAL_GAMES_PLAYED, count.toString());
  return count;
}

export async function hasOnboarded() {
  return (await AsyncStorage.getItem(KEYS.HAS_ONBOARDED)) === 'true';
}

export async function setOnboarded() {
  await AsyncStorage.setItem(KEYS.HAS_ONBOARDED, 'true');
}

export async function shouldShowRatingPrompt() {
  const last = await AsyncStorage.getItem(KEYS.LAST_RATING_PROMPT);
  if (last) {
    const daysSince = (Date.now() - parseInt(last)) / (1000 * 60 * 60 * 24);
    if (daysSince < 30) return false;
  }
  return true;
}

export async function markRatingPromptShown() {
  await AsyncStorage.setItem(KEYS.LAST_RATING_PROMPT, Date.now().toString());
}

export async function getNotificationPrefs() {
  const prefs = await AsyncStorage.getItem(KEYS.NOTIFICATION_PREFS);
  return prefs ? JSON.parse(prefs) : { streak: true, daily: true, weekly: true };
}

export async function setNotificationPrefs(prefs) {
  await AsyncStorage.setItem(KEYS.NOTIFICATION_PREFS, JSON.stringify(prefs));
}
