/*
  # Create user statistics view for dashboard

  1. Views
    - `user_stats_view` - Aggregated statistics per user
      - Calculates words learned, accuracy, total points
      - Provides data for progress dashboard

  2. Security
    - Enable RLS on view
    - Users can only see their own stats
*/

CREATE OR REPLACE VIEW user_stats_view AS
SELECT 
  user_id,
  COUNT(*) as total_words_studied,
  COUNT(*) FILTER (WHERE mastery_level >= 80) as words_mastered,
  COUNT(*) FILTER (WHERE mastery_level >= 60 AND mastery_level < 80) as words_learning,
  COUNT(*) FILTER (WHERE mastery_level < 60) as words_struggling,
  COALESCE(ROUND(AVG(mastery_level)), 0) as average_mastery,
  SUM(correct_answers) as total_correct_answers,
  SUM(total_attempts) as total_attempts,
  CASE 
    WHEN SUM(total_attempts) > 0 
    THEN ROUND((SUM(correct_answers)::DECIMAL / SUM(total_attempts)) * 100)
    ELSE 0 
  END as accuracy_percentage,
  SUM(correct_answers * 10) as total_points,
  GREATEST(1, FLOOR(COUNT(*) FILTER (WHERE mastery_level >= 80) / 20.0) + 1) as current_level,
  MAX(last_reviewed) as last_activity
FROM user_progress 
GROUP BY user_id;

-- Enable RLS on the view
ALTER VIEW user_stats_view SET (security_invoker = true);

-- Grant access to authenticated users
GRANT SELECT ON user_stats_view TO authenticated;