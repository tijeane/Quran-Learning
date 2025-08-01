{/* Display Phrases for Function Words */}
            {phraseData && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg border border-indigo-200">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        <span className="font-medium text-indigo-900">
                          Common Phrases with "{word.arabic}"
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {phraseData.phrases.length} patterns
                      </div>
                    </div>
                    
                    {/* Progressive Disclosure: Show 3 initially, then all */}
                    <div className="space-y-3">
                      {(showAllPhrases ? phraseData.phrases : phraseData.phrases.slice(0, 3)).map((phrase, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-indigo-300">
                          {/* Category Badge */}
                          {phrase.category && (
                            <div className="flex items-center gap-1 mb-2">
                              <span className="text-sm">{getCategoryIcon(phrase.category)}</span>
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(phrase.category)}`}>
                                {phrase.category}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-lg font-bold text-gray-800" dir="rtl">
                              {phrase.arabic}
                            </div>
                            {/* Audio button for each phrase */}
                            <button
                              onClick={() => playPhraseAudio(index, phrase.arabic)}
                              disabled={isPlayingPhrase === index}
                              className={`p-1 rounded-full transition-colors ${
                                isPlayingPhrase === index 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'hover:bg-blue-100 text-blue-600'
                              }`}
                              title="Play phrase pronunciation"
                            >
                              {isPlayingPhrase === index ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Volume2 className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-1 italic">
                            {phrase.transliteration}
                          </div>
                          <div className="text-sm font-medium text-gray-800 mb-1">
                            {phrase.english}
                          </div>
                          {phrase.context && (
                            <div className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                              💡 {phrase.context}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {/* Progressive Disclosure Controls */}
                    {phraseData.phrases.length > 3 && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setShowAllPhrases(!showAllPhrases)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 mx-auto"
                        >
                          {showAllPhrases ? (
                            <>
                              Show Less
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </>
                          ) : (
                            <>
                              Show {phraseData.phrases.length - 3} More Patterns
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchVerse(word)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Refresh Patterns
                  </button>
                  <button
                    onClick={clearVerse}
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => {
                      // Play all phrases in sequence
                      phraseData.phrases.forEach((phrase, index) => {
                        setTimeout(() => playPhraseAudio(index, phrase.arabic), index * 2000)
                      })
                    }}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Play className="w-3 h-3import React, { useState } from 'react'
import { X, Volume2, Star, BookOpen, Clock, TrendingUp, Search, Loader2, Play, MessageSquare } from 'lucide-react'
import { Word, UserProgress } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { useUserProgress } from '../hooks/useUserProgress'
import { useQuranVerse } from '../hooks/useQuranVerse'
import { getWordType } from '../hooks/wordCategories'

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
  const { contextData, verseData, phraseData, verseLoading, verseError, fetchVerse, clearVerse, isUsingSimulatedData } = useQuranVerse()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPlayingVerse, setIsPlayingVerse] = useState(false)
  const [isPlayingPhrase, setIsPlayingPhrase] = useState<number | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [quizResult, setQuizResult] = useState<boolean | null>(null)
  const [showAllPhrases, setShowAllPhrases] = useState(false)

  // Clear context data when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      clearVerse()
    }
  }, [isOpen, clearVerse])

  if (!isOpen || !word) return null

  const progress = getWordProgress?.(word.id)
  const masteryLevel = progress?.mastery_level || 0
  const wordType = getWordType(word.arabic)

  const playAudio = () => {
    setIsPlaying(true)
    
    // Prioritize word.audio_url from database, fallback to text-to-speech
    if (word.audio_url && word.audio_url.trim() !== '') {
      const audio = new Audio(word.audio_url)
      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => {
        setIsPlaying(false)
        // Fallback to text-to-speech if audio URL fails
        playTextToSpeech()
      }
      audio.play()
    } else {
      playTextToSpeech()
    }
  }

  const playVerseAudio = () => {
    if (!verseData?.audioUrl) return
    
    console.log('🔊 Playing verse audio:', verseData.audioUrl)
    setIsPlayingVerse(true)
    const audio = new Audio(verseData.audioUrl)
    audio.onended = () => setIsPlayingVerse(false)
    audio.onerror = () => {
      setIsPlayingVerse(false)
      console.error('❌ Failed to play verse audio:', verseData.audioUrl)
    }
    audio.play()
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

  const playPhraseAudio = (phraseIndex: number, arabicText: string) => {
    setIsPlayingPhrase(phraseIndex)
    
    // Use text-to-speech for Arabic phrases
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(arabicText)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.7 // Slightly slower for learning
      utterance.onend = () => setIsPlayingPhrase(null)
      utterance.onerror = () => setIsPlayingPhrase(null)
      speechSynthesis.speak(utterance)
    } else {
      setTimeout(() => setIsPlayingPhrase(null), 1000)
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'theological': return 'bg-purple-100 text-purple-700'
      case 'temporal': return 'bg-blue-100 text-blue-700'
      case 'spatial': return 'bg-green-100 text-green-700'
      case 'grammatical': return 'bg-gray-100 text-gray-700'
      case 'conditional': return 'bg-yellow-100 text-yellow-700'
      case 'possessive': return 'bg-pink-100 text-pink-700'
      case 'relational': return 'bg-indigo-100 text-indigo-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'theological': return '🕌'
      case 'temporal': return '⏰'
      case 'spatial': return '📍'
      case 'grammatical': return '📝'
      case 'conditional': return '❓'
      case 'possessive': return '👥'
      case 'relational': return '🔗'
      default: return '💭'
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
    setTimeout(()