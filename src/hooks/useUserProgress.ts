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

      if (error) throw error
      setProgress(data || [])
    } catch (err) {
      console.error('Error fetching progress:', err)
    }
  }

  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(true)
      
      // Calculate stats from user progress
      const { data: progressData, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      const wordsLearned = progressData?.filter(p => p.mastery_level >= 80).length || 0
      const totalAttempts = progressData?.reduce((sum, p) => sum + p.total_attempts, 0) || 0
      const correctAnswers = progressData?.reduce((sum, p) => sum + p.correct_answers, 0) || 0
      const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0

      // Mock some stats for now
      const mockStats: UserStats = {
        words_learned: wordsLearned,
        days_streak: 15, // This would need to be calculated from daily activity
        accuracy,
        surahs_completed: Math.floor(wordsLearned / 10), // Rough estimate
        total_points: correctAnswers * 10,
        current_level: Math.floor(wordsLearned / 20) + 1,
      }

      setStats(mockStats)
    } catch (err) {
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (wordId: number, correct: boolean) => {
    if (!user) return

    try {
      // Get existing progress or create new
      const { data: existing } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('word_id', wordId)
        .single()

      const newCorrectAnswers = (existing?.correct_answers || 0) + (correct ? 1 : 0)
      const newTotalAttempts = (existing?.total_attempts || 0) + 1
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

      const { error } = await supabase
        .from('user_progress')
        .upsert(progressData)

      if (error) throw error

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