import React from 'react'
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
  const ActionButton: React.FC<{
    icon: React.ReactNode
    title: string
    description: string
    onClick?: () => void
    variant?: 'primary' | 'secondary'
  }> = ({ icon, title, description, onClick, variant = 'secondary' }) => (
    <button
      onClick={onClick}
      type="button"
      className={`p-4 rounded-lg text-left transition-all duration-300 hover:scale-105 ${
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
        {description}
      </p>
    </button>
  )

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Play className="w-5 h-5 text-blue-600" />
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ActionButton
          icon={<Brain className="w-5 h-5" />}
          title="Smart Learning"
          description="AI-adaptive learning session"
          onClick={onSmartLearning}
          variant="primary"
        />
        
        <ActionButton
          icon={<Trophy className="w-5 h-5" />}
          title="Quiz Mode"
          description="Test your knowledge"
          onClick={onStartQuiz}
          variant="primary"
        />
        
        <ActionButton
          icon={<BookOpen className="w-5 h-5" />}
          title="Flashcards"
          description="Review at your own pace"
          onClick={onFlashcards}
        />
        
        <ActionButton
          icon={<RotateCcw className="w-5 h-5" />}
          title="Review Words"
          description="Spaced repetition review"
          onClick={onReviewWords}
        />
        
        <ActionButton
          icon={<Play className="w-5 h-5" />}
          title="Practice Mode"
          description="Interactive practice session"
          onClick={onPracticeMode}
        />
        
        <ActionButton
          icon={<Plus className="w-5 h-5" />}
          title="Add Word"
          description="Expand your vocabulary"
          onClick={onAddWord}
        />
      </div>
    </div>
  )
}