import React, { useState, useEffect } from 'react'
import { X, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { Word } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useUserProgress } from '../hooks/useUserProgress'

interface QuizModalProps {
  isOpen: boolean
  onClose: () => void
  words: Word[]
}

interface QuizQuestion {
  word: Word
  options: string[]
  correctAnswer: string
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, words }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const { user } = useAuth()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  
  const { updateProgress } = useUserProgress()

  useEffect(() => {
    if (isOpen && words.length > 0) {
      generateQuiz()
    }
  }, [isOpen, words])

  const generateQuiz = () => {
    // For anonymous users, use first 10 words (lesson 1)
    // For logged-in users, use random selection
    const quizWords = user 
      ? [...words].sort(() => Math.random() - 0.5).slice(0, 10)
      : words.slice(0, Math.min(10, words.length))
    
    
    const quizQuestions: QuizQuestion[] = shuffledWords.map(word => {
      // Get 3 random wrong answers
      const wrongAnswers = words
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.english)
      
      // Combine with correct answer and shuffle
      const options = [word.english, ...wrongAnswers].sort(() => Math.random() - 0.5)
      
      return {
        word,
        options,
        correctAnswer: word.english
      }
    })
    
    setQuestions(quizQuestions)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = async () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer
    const newAnswers = [...answers, isCorrect]
    setAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
    }

    // Update progress in database
    if (user) {
      await updateProgress(questions[currentQuestion].word.id, isCorrect)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      setShowResult(true)
    }
  }

  const handleRestart = () => {
    generateQuiz()
  }

  const handleClose = () => {
    onClose()
    // Reset state when closing
    setTimeout(() => {
      setQuestions([])
      setCurrentQuestion(0)
      setSelectedAnswer(null)
      setShowResult(false)
      setScore(0)
      setAnswers([])
    }, 300)
  }

  if (!isOpen) return null

  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Preparing your quiz...</p>
          </div>
        </div>
      </div>
    )
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="text-center">
            <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
              percentage >= 80 ? 'bg-green-100' : percentage >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              {percentage >= 80 ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
            <p className="text-gray-600 mb-4">
              You scored {score} out of {questions.length} ({percentage}%)
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            
            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm text-center">
                  🎉 Great job completing Lesson 1! 
                  <br />
                  <strong>Sign up to track your progress and unlock more lessons!</strong>
                </p>
              </div>
            )}
            
            <div className="flex gap-3">
              {!user && (
                <button
                  onClick={() => {
                    handleClose()
                    // You can trigger auth modal here if needed
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign Up to Continue
                </button>
              )}
              <button
                onClick={handleRestart}
                className={`${!user ? 'flex-1' : 'flex-1'} bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2`}
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>
              <button
                onClick={handleClose}
                className={`${!user ? 'flex-1' : 'flex-1'} bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl font-bold mb-4 text-gray-800" dir="rtl">
            {question.word.arabic}
          </div>
          <p className="text-gray-600 mb-2">{question.word.transliteration}</p>
          <p className="text-lg font-semibold text-gray-800">
            What does this word mean?
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                selectedAnswer === option
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{option}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  )
}