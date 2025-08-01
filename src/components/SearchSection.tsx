import React, { useState, useMemo } from 'react'
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { WordCard } from './WordCard'
import type { Word, UserProgress } from '../lib/supabase'

interface SearchSectionProps {
  words: Word[]
  onWordClick?: (word: Word) => void
  getWordProgress?: (wordId: number) => UserProgress | undefined
}

export const SearchSection: React.FC<SearchSectionProps> = ({ 
  words, 
  onWordClick,
  getWordProgress
}) => {
  const { user } = useAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'mastered' | 'learning'>('all')
  const [showAll, setShowAll] = useState(false)
  const [wordsPerPage] = useState(12) // Show 12 words initially

  // For anonymous users, limit to first 20 words (lesson 1 + preview)
  const availableWords = user ? words : words.slice(0, 20)

  const filteredWords = useMemo(() => {
    return availableWords.filter(word => {
      const matchesSearch = 
        word.arabic.includes(searchTerm) ||
        word.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.english.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Get actual mastery level from user progress
      const progress = getWordProgress?.(word.id)
      const masteryLevel = progress?.mastery_level || 0
      
      const matchesFilter = 
        filterBy === 'all' ||
        (filterBy === 'mastered' && masteryLevel >= 80) ||
        (filterBy === 'learning' && masteryLevel < 80)
      
      return matchesSearch && matchesFilter
    })
  }, [availableWords, searchTerm, filterBy, getWordProgress])

  const displayedWords = showAll ? filteredWords : filteredWords.slice(0, wordsPerPage)
  const hasMoreWords = filteredWords.length > wordsPerPage

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Search className="w-5 h-5 text-blue-600" />
        Search Words
      </h2>
      
      {!user && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-amber-800 text-sm">
            📚 <strong>Lesson 1 Preview:</strong> You're viewing the first 20 most common Quranic words. 
            Sign up to access all 100+ words and track your progress!
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search Arabic words, transliteration, or meanings..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
          >
            <option value="all">All Words</option>
            <option value="learning">Learning</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedWords.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            masteryLevel={getWordProgress?.(word.id)?.mastery_level || 0}
            onClick={() => {
              console.log('Word card clicked:', word.arabic)
              onWordClick?.(word)
            }}
          />
        ))}
      </div>
      
      {hasMoreWords && !showAll && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            Show More Words ({filteredWords.length - wordsPerPage} remaining)
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {showAll && hasMoreWords && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(false)}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
          >
            Show Less
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {displayedWords.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No words found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}