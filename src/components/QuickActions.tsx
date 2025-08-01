import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { 
  Brain, 
  BookOpen, 
  Trophy, 
  Plus, 
  Play, 
  RotateCcw 
} from 'lucide-react'

interface QuickActionsProps {
  onStartQuiz?: () => void
  onReviewWords?: () => void
  onAddWord?: () => void
  onPracticeMode?: () => void
  onSmartLearning?: () => void
  onFlashcards?: () => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onStartQuiz,
  onReviewWords,
  onAddWord,
  onPracticeMode,
  onSmartLearning,
  onFlashcards
}) => {
  const { user } = useAuth()

  const ActionButton: React.FC<{
    icon: React.ReactNode
    title: string
    description: string
    onClick?: () => void
    variant?: 'primary' | 'secondary'
    requiresAuth?: boolean
  }> = ({ icon, title, description, onClick, variant = 'secondary', requiresAuth = false }) => (
    <button
      onClick={onClick}
      type="button"
      className={`p-4 rounded-lg text-left transition-all duration-300 hover:scale-105 relative ${
        requiresAuth && !user ? 'opacity-75' : ''
      } ${
        variant === 'primary'
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl'
          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <p className={`text-sm ${variant === 'primary' ? 'text-white/90' : 'text-gray-600'}`}>
        {requiresAuth && !user && (
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full mb-1 inline-block">
            Login Required
          </span>
        )}
        {description}
      </p>
      {requiresAuth && !user && (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-lg flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600">🔒</span>
        </div>
      )}
    </button>
  )

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Play className="w-5 h-5 text-blue-600" />
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <ActionButton
          icon={<Brain className="w-5 h-5" />}
          title="Smart Learning"
          description={user ? "AI-adaptive learning session" : "Try lesson 1 - no signup needed!"}
          onClick={onSmartLearning}
          variant="primary"
        />
        
        <ActionButton
          icon={<Trophy className="w-5 h-5" />}
          title="Quiz Mode"
          description={user ? "Test your knowledge" : "Take the lesson 1 quiz!"}
          onClick={onStartQuiz}
          variant="primary"
        />
        
        <ActionButton
          icon={<BookOpen className="w-5 h-5" />}
          title="Flashcards"
          description={user ? "Review at your own pace" : "Try flashcards for lesson 1"}
          onClick={onFlashcards}
        />
        
        <ActionButton
          icon={<RotateCcw className="w-5 h-5" />}
          title="Review Words"
          description="Spaced repetition review"
          requiresAuth={true}
          onClick={onReviewWords}
        />
        
        <ActionButton
          icon={<Play className="w-5 h-5" />}
          title="Practice Mode"
          description={user ? "Interactive practice session" : "Try basic practice mode"}
          onClick={onPracticeMode}
        />
        
        <ActionButton
          icon={<Plus className="w-5 h-5" />}
          title="Add Word"
          description="Expand your vocabulary"
          requiresAuth={true}
          onClick={onAddWord}
        />
      </div>
    </div>
  )
}