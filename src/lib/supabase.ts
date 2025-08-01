import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Word {
  id: number
  arabic: string
  transliteration: string
  english: string
  frequency: number
  audio_url?: string
  created_at: string
}

export interface UserProgress {
  id: number
  user_id: string
  word_id: number
  mastery_level: number
  correct_answers: number
  total_attempts: number
  last_reviewed: string
  next_review: string
  created_at: string
}

export interface UserStats {
  words_learned: number
  days_streak: number
  accuracy: number
  surahs_completed: number
  total_points: number
  current_level: number
}