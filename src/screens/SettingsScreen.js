import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import usePremium from '../hooks/usePremium';
import useAuth from '../hooks/useAuth';
import { signOut } from '../services/auth';
import { restorePurchases } from '../services/purchases';
import { getNotificationPrefs, setNotificationPrefs } from '../services/storage';

export default function SettingsScreen({ navigation }) {
  const { isPremium } = usePremium();
  const { user } = useAuth();
  const [notifPrefs, setNotifPrefs] = useState({ streak: true, daily: true, weekly: true });

  useEffect(() => {
    getNotificationPrefs().then(setNotifPrefs);
  }, []);

  const toggleNotif = async (key) => {
    const updated = { ...notifPrefs, [key]: !notifPrefs[key] };
    setNotifPrefs(updated);
    await setNotificationPrefs(updated);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>⚙️ Settings</Text>

        <Text style={styles.sectionTitle}>Account</Text>
        {user ? (
          <View style={styles.card}>
            <Text style={styles.cardText}>Signed in as {user.email}</Text>
            <TouchableOpacity style={styles.linkBtn} onPress={signOut}>
              <Text style={styles.linkBtnText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardText}>Sign in to sync your stats and compete on leaderboards</Text>
            <TouchableOpacity style={styles.actionBtn} onPress={() => {}} activeOpacity={0.7}>
              <Text style={styles.actionBtnText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionTitle}>Subscription</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            {isPremium ? '👑 Premium Active' : 'Free Plan'}
          </Text>
          {!isPremium && (
            <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Premium')} activeOpacity={0.7}>
              <Text style={styles.actionBtnText}>Upgrade to Premium</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.linkBtn} onPress={restorePurchases}>
            <Text style={styles.linkBtnText}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>🔥 Streak Reminder</Text>
            <Switch value={notifPrefs.streak} onValueChange={() => toggleNotif('streak')} trackColor={{ false: COLORS.cardBorder, true: COLORS.accent }} thumbColor={COLORS.text} />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>📅 Daily Challenge</Text>
            <Switch value={notifPrefs.daily} onValueChange={() => toggleNotif('daily')} trackColor={{ false: COLORS.cardBorder, true: COLORS.accent }} thumbColor={COLORS.text} />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>📊 Weekly Summary</Text>
            <Switch value={notifPrefs.weekly} onValueChange={() => toggleNotif('weekly')} trackColor={{ false: COLORS.cardBorder, true: COLORS.accent }} thumbColor={COLORS.text} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.linkBtn} onPress={() => Linking.openURL('https://200iq.app/privacy')}>
            <Text style={styles.linkBtnText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>200IQ Brain Training v2.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  title: { fontSize: SIZES.xxl, fontWeight: 'bold', color: COLORS.text, padding: SIZES.padding, paddingTop: 20 },
  sectionTitle: { fontSize: SIZES.md, fontWeight: 'bold', color: COLORS.textSecondary, paddingHorizontal: SIZES.padding, marginTop: 24, marginBottom: 8 },
  card: {
    backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: SIZES.padding,
    marginHorizontal: SIZES.padding, borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  cardText: { fontSize: SIZES.md, color: COLORS.text, marginBottom: 12 },
  actionBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius, paddingVertical: 12,
    alignItems: 'center', marginBottom: 8,
  },
  actionBtnText: { fontSize: SIZES.md, fontWeight: 'bold', color: COLORS.text },
  linkBtn: { paddingVertical: 8 },
  linkBtnText: { fontSize: SIZES.md, color: COLORS.accent },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  switchLabel: { fontSize: SIZES.md, color: COLORS.text },
  versionText: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 8 },
});
