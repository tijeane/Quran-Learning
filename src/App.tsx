import React, { useState, useEffect } from 'react'
import { BookOpen, Settings, User } from 'lucide-react'
import { SearchSection } from './components/SearchSection'
import { ProgressCard } from './components/ProgressCard'
import { QuickActions } from './components/QuickActions'
import type { Word, UserStats } from './lib/supabase'
import './App.css'

// Mock data - replace with real Supabase data later
const mockWords: Word[] = [
  { id: 1, arabic: 'الله', transliteration: 'Allah', english: 'God', frequency: 2697, created_at: '' },
  { id: 2, arabic: 'الرحمن', transliteration: 'Ar-Rahman', english: 'The Merciful', frequency: 169, created_at: '' },
  { id: 3, arabic: 'الرحيم', transliteration: 'Ar-Raheem', english: 'The Compassionate', frequency: 114, created_at: '' },
  { id: 4, arabic: 'ملك', transliteration: 'Malik', english: 'King', frequency: 48, created_at: '' },
  { id: 5, arabic: 'يوم', transliteration: 'Yawm', english: 'Day', frequency: 365, created_at: '' },
  { id: 6, arabic: 'الدين', transliteration: 'Ad-Deen', english: 'The Religion', frequency: 92, created_at: '' },
  { id: 7, arabic: 'إياك', transliteration: 'Iyyaka', english: 'You alone', frequency: 2, created_at: '' },
  { id: 8, arabic: 'نعبد', transliteration: 'Na\'budu', english: 'We worship', frequency: 2, created_at: '' },
  { id: 9, arabic: 'نستعين', transliteration: 'Nasta\'een', english: 'We seek help', frequency: 2, created_at: '' },
  { id: 10, arabic: 'اهدنا', transliteration: 'Ihdeena', english: 'Guide us', frequency: 2, created_at: '' },
  { id: 11, arabic: 'الصراط', transliteration: 'As-Sirat', english: 'The path', frequency: 45, created_at: '' },
  { id: 12, arabic: 'المستقيم', transliteration: 'Al-Mustaqeem', english: 'The straight', frequency: 5, created_at: '' },
]

const mockStats: UserStats = {
  words_learned: 47,
  days_streak: 15,
  accuracy: 89,
  surahs_completed: 12,
  total_points: 2847,
  current_level: 3
}

function App() {
  const [words] = useState<Word[]>(mockWords)
  const [stats] = useState<UserStats>(mockStats)

  const handleWordClick = (word: Word) => {
    console.log('Word clicked:', word)
    // TODO: Navigate to word detail view or start learning session
  }

  const handleSmartLearning = () => {
    console.log('Starting smart learning session...')
    // TODO: Implement adaptive learning algorithm
  }

  const handleQuiz = () => {
    console.log('Starting quiz mode...')
    // TODO: Navigate to quiz interface
  }

  const handleFlashcards = () => {
    console.log('Starting flashcard review...')
    // TODO: Navigate to flashcard interface
  }

  const handleReviewWords = () => {
    console.log('Starting spaced repetition review...')
    // TODO: Implement spaced repetition logic
  }

  const handlePracticeMode = () => {
    console.log('Starting practice mode...')
    // TODO: Navigate to practice interface
  }

  const handleAddWord = () => {
    console.log('Adding new word...')
    // TODO: Open add word modal or form
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Quran Words</h1>
                <p className="text-sm text-gray-600">Master Quranic vocabulary</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Section - Full width on mobile, spans 2 columns on desktop */}
          <div className="lg:col-span-2">
            <SearchSection 
              words={words} 
              onWordClick={handleWordClick}
            />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <ProgressCard stats={stats} />
            <QuickActions
              onSmartLearning={handleSmartLearning}
              onStartQuiz={handleQuiz}
              onFlashcards={handleFlashcards}
              onReviewWords={handleReviewWords}
              onPracticeMode={handlePracticeMode}
              onAddWord={handleAddWord}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App