// AdMob unit IDs — use test IDs during development
export const ADS = {
  BANNER_HOME: __DEV__
    ? 'ca-app-pub-3940256099942544/6300978111'
    : 'ca-app-pub-XXXXX/YYYYY',
  BANNER_STATS: __DEV__
    ? 'ca-app-pub-3940256099942544/6300978111'
    : 'ca-app-pub-XXXXX/YYYYY',
  INTERSTITIAL: __DEV__
    ? 'ca-app-pub-3940256099942544/1033173712'
    : 'ca-app-pub-XXXXX/YYYYY',
  REWARDED: __DEV__
    ? 'ca-app-pub-3940256099942544/5224354917'
    : 'ca-app-pub-XXXXX/YYYYY',
};

export const REVENUECAT = {
  GOOGLE_API_KEY: 'goog_XXXXX',
  ENTITLEMENT_ID: 'premium',
  MONTHLY_PRODUCT_ID: 'rc_monthly_499',
  ANNUAL_PRODUCT_ID: 'rc_annual_2999',
};

export const FREE_TIER = {
  DAILY_SESSION_LIMIT: 5,
  INTERSTITIAL_FREQUENCY: 3,
};

export const NOTIFICATIONS = {
  STREAK_REMINDER_HOUR: 20,
  DAILY_CHALLENGE_HOUR: 9,
};

export const RATING = {
  MIN_GAMES_BEFORE_PROMPT: 5,
  MIN_DAYS_BETWEEN_PROMPTS: 30,
  STREAK_MILESTONE_FOR_PROMPT: 7,
};
