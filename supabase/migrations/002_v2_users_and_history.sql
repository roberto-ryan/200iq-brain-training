-- Users table for optional sign-in
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  device_id TEXT,
  display_name TEXT NOT NULL DEFAULT 'Player',
  total_score INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game history table
CREATE TABLE IF NOT EXISTS game_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  device_id TEXT NOT NULL,
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  correct INTEGER DEFAULT 0,
  wrong INTEGER DEFAULT 0,
  accuracy INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_game_history_user ON game_history(user_id, created_at DESC);
CREATE INDEX idx_game_history_device ON game_history(device_id, created_at DESC);

-- Add optional user_id to existing leaderboard table
ALTER TABLE leaderboard ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS for game_history table
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view game history" ON game_history
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own history" ON game_history
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
