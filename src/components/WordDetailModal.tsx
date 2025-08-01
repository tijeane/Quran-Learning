import React, { useState } from 'react'
import { X, Volume2, Star, BookOpen, Clock, TrendingUp } from 'lucide-react'
import { Word, UserProgress } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useUserProgress } from '../hooks/useUserProgress'

interface WordDetailModalProps {
  isOpen: boolean
  onClose: () => void
  word: Word | null
}

export const WordDetailModal: React.FC<WordDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  word 
}) => {
  const { user } = useAuth()
  const { getWordProgress, updateProgress } = useUserProgress()
  const [isPlaying, setIsPlaying] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [quizResult, setQuizResult] = useState<boolean | null>(null)

  if (!isOpen || !word) return null

  const progress = getWordProgress?.(word.id)
  const masteryLevel = progress?.mastery_level || 0

  const playAudio = () => {
    setIsPlaying(true)
    
    if (word.audio_url) {
      const audio = new Audio(word.audio_url)
      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => {
        setIsPlaying(false)
        // Fallback to text-to-speech
        playTextToSpeech()
      }
      audio.play()
    } else {
      playTextToSpeech()
    }
  }

  const playTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.arabic)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.8
      utterance.onend = () => setIsPlaying(false)
      utterance.onerror = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setIsPlaying(false), 1000)
    }
  }

  const getMasteryColor = (level: number) => {
    if (level >= 80) return 'text-green-500 bg-green-50'
    if (level >= 60) return 'text-yellow-500 bg-yellow-50'
    if (level >= 40) return 'text-orange-500 bg-orange-50'
    return 'text-gray-500 bg-gray-50'
  }

  const getMasteryLabel = (level: number) => {
    if (level >= 80) return 'Mastered'
    if (level >= 60) return 'Good'
    if (level >= 40) return 'Learning'
    return 'New'
  }

  const handleQuizAnswer = async (answer: string) => {
    setSelectedAnswer(answer)
    const isCorrect = answer === word.english
    setQuizResult(isCorrect)

    if (user) {
      await updateProgress(word.id, isCorrect)
    }

    // Auto-close quiz after 2 seconds
    setTimeout(() => {
      setShowQuiz(false)
      setSelectedAnswer(null)
      setQuizResult(null)
    }, 2000)
  }

  const startQuiz = () => {
    setShowQuiz(true)
    setSelectedAnswer(null)
    setQuizResult(null)
  }

  // Generate quiz options (simplified for single word)
  const generateQuizOptions = () => {
    const options = [word.english, 'Peace', 'Prayer', 'Book']
    return options.sort(() => Math.random() - 0.5)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Word Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Main Word Display */}
          <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8">
            <div className="text-5xl font-bold mb-4 text-gray-800" dir="rtl">
              {word.arabic}
            </div>
            <div className="text-xl text-gray-600 mb-2">
              {word.transliteration}
            </div>
            <div className="text-lg font-semibold text-gray-800 mb-4">
              {word.english}
            </div>
            
            <button
              onClick={playAudio}
              disabled={isPlaying}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isPlaying 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              {isPlaying ? 'Playing...' : 'Listen'}
            </button>
          </div>

          {/* Progress Section */}
          {user && progress && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Your Progress
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getMasteryColor(masteryLevel)}`}>
                    <Star className="w-3 h-3" />
                    {getMasteryLabel(masteryLevel)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{masteryLevel}% Mastery</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {progress.correct_answers}/{progress.total_attempts}
                  </div>
                  <div className="text-xs text-gray-500">Correct Answers</div>
                </div>
              </div>
            </div>
          )}

          {/* Word Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Frequency</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{word.frequency}</div>
              <div className="text-xs text-blue-700">
                Appears {word.frequency} times in the Quran
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-900">Added</span>
              </div>
              <div className="text-sm text-purple-600">
                {new Date(word.created_at).toLocaleDateString()}
              </div>
              <div className="text-xs text-purple-700">
                To your vocabulary
              </div>
            </div>
          </div>

          {/* Quick Quiz Section */}
          {!showQuiz ? (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Quick Practice</h3>
              <p className="text-gray-600 text-sm mb-3">
                Test your knowledge of this word
              </p>
              <button
                onClick={startQuiz}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Start Quick Quiz
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">What does this word mean?</h3>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-800" dir="rtl">
                  {word.arabic}
                </div>
              </div>
              
              {quizResult === null ? (
                <div className="space-y-2">
                  {generateQuizOptions().map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(option)}
                      className="w-full p-3 text-left rounded-lg border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <div className={`text-center p-4 rounded-lg ${
                  quizResult ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="text-lg font-semibold mb-1">
                    {quizResult ? '✅ Correct!' : '❌ Incorrect'}
                  </div>
                  <div className="text-sm">
                    The correct answer is: <strong>{word.english}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={playAudio}
              disabled={isPlaying}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              Practice Pronunciation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}