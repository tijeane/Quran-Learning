import { useState } from 'react'
import { Word } from '../lib/supabase'

// Toggle this flag to switch between simulated data and real API calls
const USE_SIMULATED_DATA = false

export interface VerseData {
  arabic: string
  english: string
  reference: string
  surahName?: string
  ayahNumber?: number
  audioUrl?: string
}

interface SearchResult {
  count: number
  matches: Array<{
    number: number
    text: string
    edition: {
      identifier: string
      language: string
      name: string
      englishName: string
      format: string
      type: string
    }
    surah: {
      number: number
      name: string
      englishName: string
      englishNameTranslation: string
      numberOfAyahs: number
      revelationType: string
    }
    numberInSurah: number
  }>
}

interface AyahResponse {
  code: number
  status: string
  data: {
    number: number
    text: string
    edition: {
      identifier: string
      language: string
      name: string
      englishName: string
      format: string
      type: string
    }
    surah: {
      number: number
      name: string
      englishName: string
      englishNameTranslation: string
      numberOfAyahs: number
      revelationType: string
    }
    numberInSurah: number
    juz: number
    manzil: number
    page: number
    ruku: number
    hizbQuarter: number
    sajda: boolean
  }
}

export const useQuranVerse = () => {
  const [verseData, setVerseData] = useState<VerseData | null>(null)
  const [verseLoading, setVerseLoading] = useState(false)
  const [verseError, setVerseError] = useState<string | null>(null)

  const fetchVerse = async (word: Word) => {
    setVerseLoading(true)
    setVerseError(null)
    setVerseData(null)

    if (USE_SIMULATED_DATA) {
      // Simulated data with network delay
      setTimeout(() => {
        try {
          const simulatedVerses: Record<string, VerseData> = {
            'الله': {
              arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
              english: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
              reference: 'Surah Al-Fatiha 1:1',
              surahName: 'Al-Fatiha',
              ayahNumber: 1,
              audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3'
            },
            'الرحمن': {
              arabic: 'الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ',
              english: 'The Most Merciful [who is] above the Throne established.',
              reference: 'Surah Ta-Ha 20:5',
              surahName: 'Ta-Ha',
              ayahNumber: 5,
              audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1005.mp3'
            },
            'الرحيم': {
              arabic: 'وَهُوَ الْغَفُورُ الرَّحِيمُ',
              english: 'And He is the Forgiving, the Merciful.',
              reference: 'Surah Al-Mulk 67:2',
              surahName: 'Al-Mulk',
              ayahNumber: 2,
              audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5255.mp3'
            },
            'ملك': {
              arabic: 'مَالِكِ يَوْمِ الدِّينِ',
              english: 'Sovereign of the Day of Recompense.',
              reference: 'Surah Al-Fatiha 1:4',
              surahName: 'Al-Fatiha',
              ayahNumber: 4,
              audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3'
            },
            'يوم': {
              arabic: 'مَالِكِ يَوْمِ الدِّينِ',
              english: 'Sovereign of the Day of Recompense.',
              reference: 'Surah Al-Fatiha 1:4',
              surahName: 'Al-Fatiha',
              ayahNumber: 4,
              audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3'
            },
            'الدين': {
              arabic: 'مَالِكِ يَوْمِ الدِّينِ',
              english: 'Sovereign of the Day of Recompense.',
              reference: 'Surah Al-Fatiha 1:4',
              surahName: 'Al-Fatiha',
              ayahNumber: 4,
              audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/4.mp3'
            }
          }

          const verse = simulatedVerses[word.arabic]
          if (verse) {
            setVerseData(verse)
          } else {
            setVerseError(`No verse found for "${word.arabic}". This is simulated data with limited examples.`)
          }
        } catch (err) {
          setVerseError('Simulated error occurred')
        } finally {
          setVerseLoading(false)
        }
      }, 1500) // Simulate network delay
    } else {
      // Real API implementation using api.alquran.cloud search endpoint
      try {
        console.log('🔍 Starting verse search for word:', word.arabic, word.english)
        
        // Step 1: Search for the word in English translations to find relevant verses
        const searchKeyword = encodeURIComponent(word.english)
        const searchUrl = `https://api.alquran.cloud/v1/search/${searchKeyword}/all/en.sahih`
        
        console.log('📡 Making search API call to:', searchUrl)
        
        const searchResponse = await fetch(searchUrl)
        
        console.log('📥 Search response status:', searchResponse.status)
        console.log('📥 Search response ok:', searchResponse.ok)
        
        if (!searchResponse.ok) {
          console.error('❌ Search API request failed with status:', searchResponse.status)
          throw new Error(`Search API request failed: ${searchResponse.status}`)
        }

        const searchData: SearchResult = await searchResponse.json()
        console.log('📊 Search data received:', searchData)
        console.log('📊 Number of matches found:', searchData.matches?.length || 0)

        if (!searchData.matches || searchData.matches.length === 0) {
          console.warn('⚠️ No matches found for word:', word.english)
          setVerseError(`No verses found containing the word "${word.english}". Try searching for a different word or check the spelling.`)
          setVerseLoading(false)
          return
        }

        // Get the first match
        const firstMatch = searchData.matches[0]
        console.log('🎯 First match:', firstMatch)
        const surahNumber = firstMatch.surah.number
        const ayahNumber = firstMatch.numberInSurah
        console.log('📖 Surah:', surahNumber, 'Ayah:', ayahNumber)

        // Step 2: Fetch the Arabic text for this specific ayah
        const arabicUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/quran-uthmani`
        
        // Step 3: Fetch the audio for this specific ayah (using Mishary Alafasy's recitation)
        const audioUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/ar.alafasy`

        console.log('📡 Making Arabic text API call to:', arabicUrl)
        console.log('📡 Making audio API call to:', audioUrl)
        
        const [arabicResponse, audioResponse] = await Promise.all([
          fetch(arabicUrl),
          fetch(audioUrl)
        ])

        console.log('📥 Arabic response status:', arabicResponse.status, 'ok:', arabicResponse.ok)
        console.log('📥 Audio response status:', audioResponse.status, 'ok:', audioResponse.ok)
        
        if (!arabicResponse.ok) {
          console.error('❌ Arabic text API request failed with status:', arabicResponse.status)
          throw new Error(`Arabic text API request failed: ${arabicResponse.status}`)
        }

        const arabicData: AyahResponse = await arabicResponse.json()
        console.log('📊 Arabic data received:', arabicData)

        if (arabicData.code !== 200) {
          console.error('❌ Arabic text API returned error code:', arabicData.code)
          throw new Error('Arabic text API returned error response')
        }

        // Prepare verse data
        const verseData: VerseData = {
          arabic: arabicData.data.text,
          english: firstMatch.text, // Use the English text from search results
          reference: `Surah ${firstMatch.surah.englishName} ${surahNumber}:${ayahNumber}`,
          surahName: firstMatch.surah.englishName,
          ayahNumber: ayahNumber
        }
        
        console.log('📝 Prepared verse data:', verseData)

        // Handle audio response
        if (audioResponse.ok) {
          const audioData: AyahResponse = await audioResponse.json()
          console.log('🔊 Audio data received:', audioData)
          
          if (audioData.code === 200 && audioData.data.text) {
            // The audio URL is typically in the format returned by the API
            // For Alafasy's recitation, construct the CDN URL
            const ayahGlobalNumber = arabicData.data.number
            console.log('🔊 Ayah global number:', ayahGlobalNumber)
            verseData.audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNumber}.mp3`
            console.log('🔊 Constructed audio URL:', verseData.audioUrl)
          }
        } else {
          console.warn('⚠️ Audio response not ok, skipping audio URL')
        }

        console.log('✅ Final verse data with audio:', verseData)
        setVerseData(verseData)
      } catch (err) {
        console.error('❌ Error fetching verse:', err)
        console.error('❌ Error stack:', err instanceof Error ? err.stack : 'No stack trace')
        setVerseError(
          err instanceof Error 
            ? `Failed to fetch verse: ${err.message}` 
            : 'Network error occurred while fetching verse'
        )
      } finally {
        console.log('🏁 Verse fetching completed')
        setVerseLoading(false)
      }
    }
  }

  const clearVerse = () => {
    setVerseData(null)
    setVerseError(null)
    setVerseLoading(false)
  }

  return {
    verseData,
    verseLoading,
    verseError,
    fetchVerse,
    clearVerse,
    isUsingSimulatedData: USE_SIMULATED_DATA
  }
}