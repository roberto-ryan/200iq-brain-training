# 200IQ Brain Training v2.0 — Launch Checklist

## Status: Waiting on Google Identity Verification

Everything is built, tested on device, and pushed to GitHub. These steps complete the Play Store launch once Google clears your developer identity verification.

---

## Step 1: Generate New Google OAuth Client Secret

The existing secret is masked and can't be viewed.

1. Go to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials?project=lockin-e2d75)
2. Click **"Supabase Auth"** under OAuth 2.0 Client IDs
3. Scroll to **Client secrets** → click **"Add secret"**
4. Copy the new secret (store it securely — you won't be able to view it again)

**Client ID (already set):** `321569580716-0ta7aq0snvf3jno16u3fopbit647khpr.apps.googleusercontent.com`

**Redirect URIs (already added):**
- `https://szvnfvqixyosfoxtnuiz.supabase.co/auth/v1/callback` (LockIn)
- `https://eoewkjfvrhiieenedimb.supabase.co/auth/v1/callback` (200IQ)

## Step 2: Enable Google Auth in Supabase

1. Go to [Supabase → Auth → Providers](https://supabase.com/dashboard/project/eoewkjfvrhiieenedimb/auth/providers)
2. Click **Google** → toggle **Enabled**
3. Paste the **Client ID** and **Client Secret** from Step 1
4. Click **Save**

## Step 3: Upload Production Build to Play Console

```bash
cd 200iq-brain-training
eas build --platform android --profile production
```

This creates an AAB (Android App Bundle). Once built:

1. Go to [Play Console → 200IQ → Test and release → Internal testing](https://play.google.com/console/u/0/developers/4812703546597309515/app/4974831532082517276/tracks/internal-testing)
2. Click **"Create new release"**
3. Upload the AAB from the EAS build
4. Fill in release notes: "v2.0 — Premium subscriptions, daily challenges, streak tracking"
5. **Review and roll out**

## Step 4: Create Subscription Products

Requires: AAB uploaded (Step 3)

1. Go to [Play Console → 200IQ → Monetize → Products → Subscriptions](https://play.google.com/console/u/0/developers/4812703546597309515/app/4974831532082517276/managed-products/subscriptions)
2. Click **"Create subscription"**
3. Create **Monthly**:
   - Product ID: `rc_monthly_499`
   - Name: 200IQ Premium Monthly
   - Base plan: $4.99/month, auto-renewing
4. Create **Annual**:
   - Product ID: `rc_annual_2999`
   - Name: 200IQ Premium Annual
   - Base plan: $29.99/year, auto-renewing
   - Add a 7-day free trial
5. **Activate** both subscriptions

## Step 5: Connect RevenueCat to Google Play

1. **Create a service account** in Google Cloud:
   - Go to [IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=lockin-e2d75)
   - Click **"Create Service Account"**
   - Name: `revenuecat-200iq`
   - Grant role: **none** (will be added in Play Console)
   - Click **"Create Key"** → JSON → Download
2. **Grant Play Console access**:
   - Go to [Play Console → Users and permissions](https://play.google.com/console/u/0/developers/4812703546597309515/users-and-permissions)
   - Click **"Invite new users"**
   - Paste the service account email (e.g., `revenuecat-200iq@lockin-e2d75.iam.gserviceaccount.com`)
   - Grant permissions: **Financial data**, **Manage orders and subscriptions**
   - Apply to **200IQ Brain Training** app
3. **Upload to RevenueCat**:
   - Go to [RevenueCat → Apps & providers → Google Play Store config](https://app.revenuecat.com/projects/6f1ad6a2/apps)
   - Complete the Play Store configuration
   - Upload the service account JSON from step 1
   - Enter package name: `com.brainiq200.app`
4. **Swap test key for production**:
   - In RevenueCat → API keys, note the production Google API key
   - Update `src/constants/config.js`: replace `test_DWVUlPNNYXwtnvKcQxLcNdMyejf` with the production key
   - Commit and rebuild

## Step 6: Update Store Listing

1. Go to [Play Console → 200IQ → Grow users → Store listing](https://play.google.com/console/u/0/developers/4812703546597309515/app/4974831532082517276/store-listing)
2. Update **short description**: "Train your brain in 30 seconds. 4 games, daily challenges, streaks & premium stats."
3. Update **full description** to mention v2 features: premium, daily challenges, streak milestones
4. Take new screenshots from the device showing v2 UI (onboarding, home, gameplay, results, stats)
5. Update **feature graphic** if desired

## Step 7: AdMob (When Compatible)

`react-native-google-mobile-ads` is currently incompatible with React Native 0.81. When a compatible version ships:

1. `npm install react-native-google-mobile-ads@latest`
2. Add plugin back to `app.json`:
   ```json
   ["react-native-google-mobile-ads", {
     "androidAppId": "ca-app-pub-YOUR_REAL_APP_ID~YOUR_REAL_ID"
   }]
   ```
3. Restore `src/services/ads.js` with the full SDK integration (see git history, commit before `015cdbd`)
4. Restore `src/components/BannerAd.js` with the full SDK integration
5. Create ad units at [apps.admob.com](https://apps.admob.com):
   - Banner (Home + Stats)
   - Interstitial (Results)
   - Rewarded (Results bonus)
6. Update `src/constants/config.js` production ad unit IDs
7. Rebuild: `eas build --platform android --profile production`

## Step 8: Go Live

1. Complete closed testing with 12+ testers for 14+ days (Play Console requirement)
2. Apply for production access in Play Console
3. Once approved, create a **production release** with the final AAB
4. Submit for review

---

## Quick Reference

| Service | Dashboard | Account |
|---------|-----------|---------|
| Play Console | [play.google.com/console](https://play.google.com/console) | robbiepryan@gmail.com |
| RevenueCat | [app.revenuecat.com](https://app.revenuecat.com/projects/6f1ad6a2/overview) | robbiepryan@gmail.com |
| Supabase | [supabase.com/dashboard](https://supabase.com/dashboard/project/eoewkjfvrhiieenedimb) | GitHub (roberto-ryan) |
| Google Cloud | [console.cloud.google.com](https://console.cloud.google.com/?project=lockin-e2d75) | robbiepryan@gmail.com |
| EAS | [expo.dev](https://expo.dev/accounts/robbiepryan/projects/200iq-brain-training) | robbiepryan |

| Config Value | Location | Current |
|---|---|---|
| RevenueCat API Key | `src/constants/config.js` | `test_DWVUlPNNYXwtnvKcQxLcNdMyejf` (test) |
| AdMob App ID | `app.json` plugins | Removed (incompatible) |
| AdMob Ad Units | `src/constants/config.js` | Google test IDs (dev only) |
| Supabase URL | env `EXPO_PUBLIC_SUPABASE_URL` | `https://eoewkjfvrhiieenedimb.supabase.co` |
| Google OAuth Client ID | Google Cloud Console | `321569580716-0ta7...` |
