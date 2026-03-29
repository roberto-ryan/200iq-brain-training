import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';
import { getOfferings, purchasePackage, restorePurchases } from '../services/purchases';

const BENEFITS = [
  { icon: '🚫', text: 'No ads ever' },
  { icon: '♾️', text: 'Unlimited daily sessions' },
  { icon: '📊', text: 'Detailed stats & accuracy trends' },
  { icon: '🏆', text: 'Daily challenge bonus points' },
  { icon: '❄️', text: 'Free daily streak freeze' },
  { icon: '👑', text: 'Premium leaderboard badge' },
];

export default function PremiumScreen({ navigation }) {
  const [offerings, setOfferings] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => { loadOfferings(); }, []);

  const loadOfferings = async () => {
    const current = await getOfferings();
    setOfferings(current);
    if (current?.annual) setSelectedPkg(current.annual);
    setLoading(false);
  };

  const handlePurchase = async () => {
    if (!selectedPkg) return;
    setPurchasing(true);
    const success = await purchasePackage(selectedPkg);
    setPurchasing(false);
    if (success) navigation.goBack();
  };

  const handleRestore = async () => {
    setPurchasing(true);
    const success = await restorePurchases();
    setPurchasing(false);
    if (success) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.crown}>👑</Text>
        <Text style={styles.title}>200IQ Premium</Text>
        <Text style={styles.subtitle}>Unlock your full brain potential</Text>

        <View style={styles.benefits}>
          {BENEFITS.map((b, i) => (
            <View key={i} style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>{b.icon}</Text>
              <Text style={styles.benefitText}>{b.text}</Text>
            </View>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.accent} size="large" />
        ) : offerings ? (
          <View style={styles.packages}>
            {offerings.annual && (
              <TouchableOpacity
                style={[styles.packageCard, selectedPkg === offerings.annual && styles.packageSelected]}
                onPress={() => setSelectedPkg(offerings.annual)}
                activeOpacity={0.7}
              >
                <Text style={styles.packageBadge}>BEST VALUE</Text>
                <Text style={styles.packagePrice}>{offerings.annual.product.priceString}/yr</Text>
                <Text style={styles.packageDesc}>7-day free trial</Text>
              </TouchableOpacity>
            )}
            {offerings.monthly && (
              <TouchableOpacity
                style={[styles.packageCard, selectedPkg === offerings.monthly && styles.packageSelected]}
                onPress={() => setSelectedPkg(offerings.monthly)}
                activeOpacity={0.7}
              >
                <Text style={styles.packagePrice}>{offerings.monthly.product.priceString}/mo</Text>
                <Text style={styles.packageDesc}>Cancel anytime</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.subtitle}>Subscriptions not available on this platform</Text>
        )}

        <TouchableOpacity
          style={[styles.purchaseBtn, purchasing && { opacity: 0.5 }]}
          onPress={handlePurchase}
          disabled={purchasing || !selectedPkg}
          activeOpacity={0.7}
        >
          {purchasing ? (
            <ActivityIndicator color={COLORS.text} />
          ) : (
            <Text style={styles.purchaseBtnText}>Start Free Trial</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRestore} style={styles.restoreBtn}>
          <Text style={styles.restoreBtnText}>Restore Purchases</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { alignItems: 'center', padding: SIZES.padding, paddingTop: 10 },
  closeBtn: { alignSelf: 'flex-start', padding: 8 },
  closeBtnText: { fontSize: 24, color: COLORS.textSecondary },
  crown: { fontSize: 64, marginTop: 10 },
  title: { fontSize: SIZES.xxl, fontWeight: 'bold', color: COLORS.text, marginTop: 12 },
  subtitle: { fontSize: SIZES.md, color: COLORS.textSecondary, marginTop: 8, textAlign: 'center' },
  benefits: { width: '100%', marginTop: 30, marginBottom: 30 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  benefitIcon: { fontSize: 24, width: 40 },
  benefitText: { fontSize: SIZES.md, color: COLORS.text, flex: 1 },
  packages: { flexDirection: 'row', gap: 12, marginBottom: 24, width: '100%' },
  packageCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: SIZES.radius, padding: 20,
    alignItems: 'center', borderWidth: 2, borderColor: COLORS.cardBorder,
  },
  packageSelected: { borderColor: COLORS.accent },
  packageBadge: { fontSize: 10, color: COLORS.accent, fontWeight: 'bold', marginBottom: 8 },
  packagePrice: { fontSize: SIZES.xl, fontWeight: 'bold', color: COLORS.text },
  packageDesc: { fontSize: SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },
  purchaseBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius, paddingVertical: 16,
    width: '100%', alignItems: 'center', marginBottom: 12,
  },
  purchaseBtnText: { fontSize: SIZES.lg, fontWeight: 'bold', color: COLORS.text },
  restoreBtn: { paddingVertical: 12 },
  restoreBtnText: { fontSize: SIZES.sm, color: COLORS.textSecondary },
});
