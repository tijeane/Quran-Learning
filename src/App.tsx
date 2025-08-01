import React, { useState, useEffect } from 'react'
import { BookOpen, Settings, User, LogOut } from 'lucide-react'
import { SearchSection } from './components/SearchSection'
import { ProgressCard } from './components/ProgressCard'
import { QuickActions } from './components/QuickActions'
import { AuthModal } from './components/AuthModal'
import { QuizModal } from './components/QuizModal'
import { AddWordModal } from './components/AddWordModal'
import { useAuth } from './hooks/useAuth'
import { useWords } from './hooks/useWords'
import { useUserProgress } from './hooks/useUserProgress'
import './App.css'

function App() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { words, loading: wordsLoading } = useWords()
  const { stats, loading: progressLoading, getWordProgress } = useUserProgress()
  
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [quizModalOpen, setQuizModalOpen] = useState(false)
  const [addWordModalOpen, setAddWordModalOpen] = useState(false)

  const handleWordClick = (word: any) => {
    console.log('Word clicked:', word)
    // TODO: Navigate to word detail view or start learning session
  }

  const handleSmartLearning = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    console.log('Starting smart learning session...')
    // TODO: Implement adaptive learning algorithm
  }

  const handleQuiz = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    if (words.length === 0) {
      alert('No words available for quiz. Please add some words first.')
      return
    }
    setQuizModalOpen(true)
  }

  const handleFlashcards = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    console.log('Starting flashcard review...')
    // TODO: Navigate to flashcard interface
  }

  const handleReviewWords = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    console.log('Starting spaced repetition review...')
    // TODO: Implement spaced repetition logic
  }

  const handlePracticeMode = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    console.log('Starting practice mode...')
    // TODO: Navigate to practice interface
  }

  const handleAddWord = () => {
    if (!user) {
      setAuthModalOpen(true)
      return
    }
    setAddWordModalOpen(true)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
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
              {user ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:block">
                    Welcome, {user.email}
                  </span>
                  <button 
                    onClick={handleSignOut}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wordsLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading words...</p>
          </div>
        ) : (
        <div className="space-y-8">
          {/* Quick Actions - Now at the top */}
          <QuickActions
            onSmartLearning={handleSmartLearning}
            onStartQuiz={handleQuiz}
            onFlashcards={handleFlashcards}
            onReviewWords={handleReviewWords}
            onPracticeMode={handlePracticeMode}
            onAddWord={handleAddWord}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Search Section - Full width on mobile, spans 2 columns on desktop */}
            <div className="lg:col-span-2">
              <SearchSection 
                words={words} 
                onWordClick={handleWordClick}
                getWordProgress={getWordProgress}
              />
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
            {user && stats && (
              <ProgressCard stats={stats} />
            )}
            {!user && (
              <div className="bg-white rounded-lg p-6 shadow-md text-center">
                <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Track Your Progress
                </h3>
                <p className="text-gray-600 mb-4">
                  Sign in to save your learning progress and access personalized features.
                </p>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
            </div>
          </div>
        </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
      <QuizModal 
        isOpen={quizModalOpen} 
        onClose={() => setQuizModalOpen(false)}
        words={words}
      />
      <AddWordModal 
        isOpen={addWordModalOpen} 
        onClose={() => setAddWordModalOpen(false)} 
      />
    </div>
  )
}

export default App