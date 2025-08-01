import React, { useState } from 'react'
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
            
            {/* Word Type Badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                wordType === 'function' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {wordType === 'function' ? <MessageSquare className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                {wordType === 'function' ? 'Function Word' : 'Content Word'}
              </span>
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

          {/* Context Section - Different display based on word type */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              {wordType === 'function' ? (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Common Usage Patterns
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Find in Quran
                </>
              )}
              {isUsingSimulatedData && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Demo Mode
                </span>
              )}
            </h3>
            
            {!contextData && !verseLoading && !verseError && (
              <div>
                <p className="text-gray-600 text-sm mb-3">
                  {wordType === 'function' 
                    ? 'See how this function word is commonly used in Quranic phrases and expressions.'
                    : 'See how this word appears in the Quran with context and translation.'
                  }
                </p>
                <button
                  onClick={() => fetchVerse(word)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  {wordType === 'function' ? (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      Show Usage Patterns
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Show in Verse
                    </>
                  )}
                </button>
              </div>
            )}

            {verseLoading && (
              <div className="flex items-center gap-2 text-indigo-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">
                  {wordType === 'function' ? 'Loading usage patterns...' : 'Finding verse...'}
                </span>
              </div>
            )}

            {verseError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{verseError}</p>
                <button
                  onClick={() => fetchVerse(word)}
                  className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Try Again
                </button>
              </div>
            )}

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
                    <Play className="w-3 h-3" />
                    Play All
                  </button>
                </div>
              </div>
            )}

            {/* Display Verses for Content Words */}
            {verseData && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-indigo-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">
                      <BookOpen className="w-3 h-3" />
                      {verseData.reference}
                    </span>
                    {verseData.audioUrl && (
                      <button
                        onClick={playVerseAudio}
                        disabled={isPlayingVerse}
                        className={`p-2 rounded-full transition-colors ${
                          isPlayingVerse 
                            ? 'bg-indigo-100 text-indigo-600' 
                            : 'hover:bg-indigo-100 text-indigo-600'
                        }`}
                        title="Play verse audio"
                      >
                        {isPlayingVerse ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="text-center mb-3">
                    <div className="text-2xl font-bold text-gray-800 mb-2 leading-relaxed" dir="rtl">
                      {verseData.arabic}
                    </div>
                    <div className="text-gray-600 text-sm italic">
                      {verseData.english}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchVerse(word)}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Find Another
                  </button>
                  <button
                    onClick={clearVerse}
                    className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                  >
                    Clear
                  </button>
                  {verseData.audioUrl && (
                    <button
                      onClick={playVerseAudio}
                      disabled={isPlayingVerse}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1"
                    >
                      <Volume2 className="w-3 h-3" />
                      {isPlayingVerse ? 'Playing...' : 'Play Audio'}
                    </button>
                  )}
                </div>
              </div>
            )}
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
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Volume2 className="w-4 h-4" />
              {isPlaying ? 'Playing Word...' : 'Practice Word'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}