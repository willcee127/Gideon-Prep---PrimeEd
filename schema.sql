-- Gideon Prep Prime - Memory System Schema
-- Copy this SQL into your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table - User identity and tier system
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  avatar_url TEXT,
  identity_tier VARCHAR(20) DEFAULT 'initiate' CHECK (identity_tier IN ('initiate', 'apprentice', 'adept', 'master', 'grandmaster')),
  verve_score INTEGER DEFAULT 0 CHECK (verve_score >= 0),
  memory_capacity INTEGER DEFAULT 100 CHECK (memory_capacity >= 0),
  processing_speed INTEGER DEFAULT 1.0 CHECK (processing_speed >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mastery Ledger - Track math topic mastery and progress
CREATE TABLE IF NOT EXISTS mastery_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic VARCHAR(100) NOT NULL,
  subtopic VARCHAR(100),
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  practice_count INTEGER DEFAULT 0 CHECK (practice_count >= 0),
  confidence_score DECIMAL(3,2) DEFAULT 0.0 CHECK (confidence_score >= 0.0 AND confidence_score <= 1.0),
  difficulty_level VARCHAR(20) DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  learning_streak INTEGER DEFAULT 0 CHECK (learning_streak >= 0),
  total_time_spent INTEGER DEFAULT 0 CHECK (total_time_spent >= 0), -- in minutes
  last_practiced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mastered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, topic, subtopic)
);

-- Trauma Logs - Track stress states and emotional patterns
CREATE TABLE IF NOT EXISTS trauma_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stress_level INTEGER NOT NULL CHECK (stress_level >= 1 AND stress_level <= 10),
  trigger_type VARCHAR(50) CHECK (trigger_type IN ('math_anxiety', 'time_pressure', 'social_pressure', 'failure_fear', 'overwhelm', 'other')),
  trigger_description TEXT,
  emotional_state VARCHAR(50) CHECK (emotional_state IN ('calm', 'anxious', 'frustrated', 'confident', 'overwhelmed', 'motivated', 'discouraged')),
  physical_symptoms TEXT[], -- array of symptoms like ['headache', 'tension', 'nausea']
  coping_strategy VARCHAR(100),
  resolution_status VARCHAR(20) DEFAULT 'pending' CHECK (resolution_status IN ('pending', 'resolved', 'mitigated', 'escalated')),
  resolution_time INTEGER, -- time in minutes to resolve
  context VARCHAR(100), -- what was happening when triggered
  location VARCHAR(50), -- physical or digital location
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_identity_tier ON profiles(identity_tier);
CREATE INDEX IF NOT EXISTS idx_mastery_ledger_user_id ON mastery_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_mastery_ledger_topic ON mastery_ledger(topic);
CREATE INDEX IF NOT EXISTS idx_mastery_ledger_mastery_level ON mastery_ledger(mastery_level);
CREATE INDEX IF NOT EXISTS idx_trauma_logs_user_id ON trauma_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_trauma_logs_timestamp ON trauma_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_trauma_logs_stress_level ON trauma_logs(stress_level);
CREATE INDEX IF NOT EXISTS idx_trauma_logs_trigger_type ON trauma_logs(trigger_type);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE trauma_logs ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Mastery Ledger RLS Policies
CREATE POLICY "Users can view own mastery entries" ON mastery_ledger
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own mastery entries" ON mastery_ledger
  FOR ALL USING (auth.uid() = user_id);

-- Trauma Logs RLS Policies
CREATE POLICY "Users can view own trauma logs" ON trauma_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own trauma logs" ON trauma_logs
  FOR ALL USING (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mastery_ledger_updated_at
  BEFORE UPDATE ON mastery_ledger
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Views for analytics and reporting
CREATE OR REPLACE VIEW user_mastery_summary AS
SELECT 
  p.user_id,
  p.username,
  p.identity_tier,
  COUNT(ml.id) as total_topics,
  AVG(ml.mastery_level) as avg_mastery_level,
  SUM(ml.practice_count) as total_practice_sessions,
  SUM(ml.total_time_spent) as total_learning_time,
  MAX(ml.learning_streak) as best_streak
FROM profiles p
LEFT JOIN mastery_ledger ml ON p.id = ml.user_id
GROUP BY p.user_id, p.username, p.identity_tier;

CREATE OR REPLACE VIEW trauma_analytics AS
SELECT 
  user_id,
  AVG(stress_level) as avg_stress_level,
  MAX(stress_level) as peak_stress,
  COUNT(*) as total_episodes,
  AVG(resolution_time) as avg_resolution_time,
  trigger_type,
  DATE_TRUNC('day', timestamp) as episode_date
FROM trauma_logs
WHERE resolution_status = 'resolved'
GROUP BY user_id, trigger_type, DATE_TRUNC('day', timestamp);

-- Sample data for testing (remove in production)
INSERT INTO profiles (user_id, username, full_name, identity_tier, verve_score) VALUES
('00000000-0000-0000-0000-000000000001', 'gideon', 'Gideon Prime', 'apprentice', 150),
('00000000-0000-0000-0000-000000000002', 'test_user', 'Test User', 'initiate', 50);

INSERT INTO mastery_ledger (user_id, topic, subtopic, mastery_level, practice_count, confidence_score, difficulty_level) VALUES
('00000000-0000-0000-0000-000000000001', 'Algebra', 'Linear Equations', 75, 15, 0.85, 'intermediate'),
('00000000-0000-0000-0000-000000000001', 'Calculus', 'Derivatives', 45, 8, 0.60, 'intermediate'),
('00000000-0000-0000-0000-000000000001', 'Geometry', 'Triangles', 90, 25, 0.95, 'beginner');

INSERT INTO trauma_logs (user_id, stress_level, trigger_type, trigger_description, emotional_state, coping_strategy, resolution_status, resolution_time, context) VALUES
('00000000-0000-0000-0000-000000000001', 7, 'math_anxiety', 'Complex calculus problem', 'anxious', 'deep_breathing', 'resolved', 15, 'homework_session'),
('00000000-0000-0000-0000-000000000001', 5, 'time_pressure', 'Timed test approaching', 'frustrated', 'break_timer', 'resolved', 8, 'exam_preparation');

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles with identity tier system for Gideon Prep Prime';
COMMENT ON TABLE mastery_ledger IS 'Tracks user progress and mastery across math topics';
COMMENT ON TABLE trauma_logs IS 'Logs stress events and emotional patterns for memory system';
COMMENT ON COLUMN profiles.identity_tier IS 'User progression: initiate -> apprentice -> adept -> master -> grandmaster';
COMMENT ON COLUMN mastery_ledger.mastery_level IS '0-100 scale of topic mastery';
COMMENT ON COLUMN trauma_logs.stress_level IS '1-10 scale of stress intensity';
