-- Leaderboard table for 200IQ Brain Training
CREATE TABLE IF NOT EXISTS leaderboard (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Player',
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  correct INTEGER DEFAULT 0,
  wrong INTEGER DEFAULT 0,
  accuracy INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast leaderboard queries
CREATE INDEX idx_leaderboard_game_score ON leaderboard(game_id, score DESC);
CREATE INDEX idx_leaderboard_created ON leaderboard(created_at DESC);

-- Weekly leaderboard view
CREATE OR REPLACE VIEW weekly_leaderboard AS
SELECT
  device_id,
  display_name,
  game_id,
  MAX(score) as best_score,
  COUNT(*) as games_played,
  AVG(accuracy) as avg_accuracy
FROM leaderboard
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY device_id, display_name, game_id
ORDER BY best_score DESC;

-- Enable Row Level Security
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Anyone can read leaderboard
CREATE POLICY "Anyone can view leaderboard" ON leaderboard
  FOR SELECT USING (true);

-- Anyone can insert scores (anonymous)
CREATE POLICY "Anyone can submit scores" ON leaderboard
  FOR INSERT WITH CHECK (true);
