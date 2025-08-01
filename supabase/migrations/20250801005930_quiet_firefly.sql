/*
  # Create user progress tracking table

  1. New Tables
    - `user_progress`
      - `id` (serial, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `word_id` (integer, foreign key to words)
      - `mastery_level` (integer, 0-100 percentage)
      - `correct_answers` (integer, count of correct answers)
      - `total_attempts` (integer, total quiz attempts)
      - `last_reviewed` (timestamp, when last studied)
      - `next_review` (timestamp, when to review next)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `user_progress` table
    - Add policies for users to manage their own progress
    - Unique constraint on user_id + word_id combination

  3. Indexes
    - Index on user_id for fast user queries
    - Index on word_id for fast word queries
    - Index on next_review for spaced repetition
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE NOT NULL,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  correct_answers INTEGER DEFAULT 0 CHECK (correct_answers >= 0),
  total_attempts INTEGER DEFAULT 0 CHECK (total_attempts >= 0),
  last_reviewed TIMESTAMPTZ DEFAULT NOW(),
  next_review TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own progress
CREATE POLICY "Users can view own progress"
  ON user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_word_id ON user_progress(word_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_next_review ON user_progress(next_review);
CREATE INDEX IF NOT EXISTS idx_user_progress_mastery_level ON user_progress(mastery_level);