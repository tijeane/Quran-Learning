import { useState, useEffect } from 'react'
import { supabase, Word } from '../lib/supabase'

export const useWords = () => {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWords()
  }, [])

  const fetchWords = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('words')
        .select('*')
        .order('frequency', { ascending: false })

      if (error) throw error

      setWords(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addWord = async (word: Omit<Word, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('words')
        .insert([word])
        .select()
        .single()

      if (error) throw error

      setWords(prev => [...prev, data])
      return { data, error: null }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An error occurred'
      return { data: null, error }
    }
  }

  return {
    words,
    loading,
    error,
    fetchWords,
    addWord,
  }
}