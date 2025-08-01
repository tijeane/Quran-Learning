import React, { useState } from 'react'
import { Volume2, Star, CheckCircle } from 'lucide-react'
import type { Word } from '../lib/supabase'

interface WordCardProps {
  word: Word
  masteryLevel?: number
  onClick?: () => void
}

export const WordCard: React.FC<WordCardProps> = ({ 
  word, 
  masteryLevel = 0, 
  onClick 
}) => {
  const [isPlaying, setIsPlaying] = useState(false)

  const playAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(true)
    
    // Use text-to-speech as fallback
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.arabic)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.8
      utterance.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setIsPlaying(false), 1000)
    }
  }

  const getMasteryColor = (level: number) => {
    if (level >= 80) return 'text-green-500'
    if (level >= 60) return 'text-yellow-500'
    if (level >= 40) return 'text-orange-500'
    return 'text-gray-400'
  }

  const getMasteryIcon = (level: number) => {
    if (level >= 80) return <CheckCircle className="w-4 h-4" />
    return <Star className="w-4 h-4" />
  }

  return (
    <div 
      className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-1 ${getMasteryColor(masteryLevel)}`}>
          {getMasteryIcon(masteryLevel)}
          <span className="text-xs font-medium">{masteryLevel}%</span>
        </div>
        <button
          onClick={playAudio}
          className={`p-1 rounded-full transition-colors ${
            isPlaying 
              ? 'bg-blue-100 text-blue-600' 
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          disabled={isPlaying}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold mb-2 text-gray-800" dir="rtl">
          {word.arabic}
        </div>
        <div className="text-sm text-gray-600 mb-1">
          {word.transliteration}
        </div>
        <div className="text-xs text-gray-500">
          {word.english}
        </div>
      </div>
      
      <div className="mt-3 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Frequency: {word.frequency}</span>
          <span className="group-hover:text-blue-500 transition-colors">
            Click to study
          </span>
        </div>
      </div>
    </div>
  )
}