import { useState, useEffect } from 'react'
import { supabase, UserProgress, UserStats } from '../lib/supabase'
import { useAuth } from './useAuth'

export const useUserProgress = () => {
  const { user } = useAuth()
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProgress()
      fetchStats()
    } else {
      setProgress([])
      setStats(null)
      setLoading(false)
    }
  }, [user])

  const fetchProgress = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Supabase error details:', error)
        throw error
      }
      setProgress(data || [])
    } catch (err) {
      console.error('Error fetching progress:', err)
      // Set empty array on error to prevent app crashes
      setProgress([])
    }
  }

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Get stats from the view with proper headers
      const { data: statsData, error } = await supabase
        .from('user_stats_view')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Stats fetch error:', error)
        throw error
      }

      if (statsData && statsData.length > 0) {
        const userStats = statsData[0]
        const realStats: UserStats = {
          words_learned: userStats.words_mastered || 0,
          days_streak: 15, // This would need daily activity tracking
          accuracy: userStats.accuracy_percentage || 0,
          surahs_completed: Math.floor((userStats.words_mastered || 0) / 10),
          total_points: userStats.total_points || 0,
          current_level: userStats.current_level || 1,
        }
        setStats(realStats)
      } else {
        // Default stats for new users
        const defaultStats: UserStats = {
          words_learned: 0,
          days_streak: 0,
          accuracy: 0,
          surahs_completed: 0,
          total_points: 0,
          current_level: 1,
        }
        setStats(defaultStats)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
      // Set default stats on error
      setStats({
        words_learned: 0,
        days_streak: 0,
        accuracy: 0,
        surahs_completed: 0,
        total_points: 0,
        current_level: 1,
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (wordId: number, correct: boolean) => {
    if (!user) return

    try {
      // Get existing progress or create new with proper headers
      const { data: existing, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('word_id', wordId)
        .maybeSingle() // Use maybeSingle instead of single to avoid errors when no record exists

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        console.error('Error fetching existing progress:', fetchError)
        throw fetchError
      }

      const existingRecord = existing || null
      const newCorrectAnswers = (existingRecord?.correct_answers || 0) + (correct ? 1 : 0)
      const newTotalAttempts = (existingRecord?.total_attempts || 0) + 1
      const newMasteryLevel = Math.min(100, Math.round((newCorrectAnswers / newTotalAttempts) * 100))

      const progressData = {
        user_id: user.id,
        word_id: wordId,
        mastery_level: newMasteryLevel,
        correct_answers: newCorrectAnswers,
        total_attempts: newTotalAttempts,
        last_reviewed: new Date().toISOString(),
        next_review: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Next day
      }

      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert(progressData, {
          onConflict: 'user_id,word_id'
        })

      if (upsertError) {
        console.error('Error upserting progress:', upsertError)
        throw upsertError
      }

      // Refresh data
      await fetchProgress()
      await fetchStats()
    } catch (err) {
      console.error('Error updating progress:', err)
    }
  }

  const getWordProgress = (wordId: number): UserProgress | undefined => {
    return progress.find(p => p.word_id === wordId)
  }

  return {
    progress,
    stats,
    loading,
    updateProgress,
    getWordProgress,
    fetchProgress,
    fetchStats,
  }
}