import { Platform } from 'react-native';
import { NOTIFICATIONS } from '../constants/config';
import { getNotificationPrefs, getStreak, getLastPlayDate } from './storage';

let Notifications;
const isNative = Platform.OS === 'ios' || Platform.OS === 'android';

if (isNative) {
  Notifications = require('expo-notifications');
}

export async function registerForNotifications() {
  if (!isNative) return;
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function scheduleNotifications() {
  if (!isNative) return;
  const prefs = await getNotificationPrefs();

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (prefs.streak) {
    await scheduleStreakReminder();
  }

  if (prefs.daily) {
    await scheduleDailyChallenge();
  }
}

async function scheduleStreakReminder() {
  const streak = await getStreak();
  const lastPlay = await getLastPlayDate();
  const today = new Date().toDateString();

  if (lastPlay === today || streak === 0) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🔥 Don\'t lose your streak!',
      body: `Your ${streak}-day streak expires soon. Play a quick game to keep it alive!`,
    },
    trigger: {
      type: 'daily',
      hour: NOTIFICATIONS.STREAK_REMINDER_HOUR,
      minute: 0,
      repeats: true,
    },
  });
}

async function scheduleDailyChallenge() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🧠 Daily Challenge Ready!',
      body: 'A new brain training challenge is waiting for you.',
    },
    trigger: {
      type: 'daily',
      hour: NOTIFICATIONS.DAILY_CHALLENGE_HOUR,
      minute: 0,
      repeats: true,
    },
  });
}
