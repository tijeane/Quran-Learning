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

// Fallback verse data for common Quranic words
const fallbackVerses: Record<string, VerseData> = {
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
  },
  'الذين': {
    arabic: 'الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ لَهُمْ جَنَّاتٌ تَجْرِي مِن تَحْتِهَا الْأَنْهَارُ',
    english: 'Those who believe and do righteous deeds - for them are gardens beneath which rivers flow.',
    reference: 'Surah Al-Baqarah 2:25',
    surahName: 'Al-Baqarah',
    ayahNumber: 25,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/25.mp3'
  },
  'من': {
    arabic: 'مَن يَعْمَلْ سُوءًا يُجْزَ بِهِ وَلَا يَجِدْ لَهُ مِن دُونِ اللَّهِ وَلِيًّا وَلَا نَصِيرًا',
    english: 'Whoever does a wrong will be recompensed for it, and he will not find besides Allah a protector or a helper.',
    reference: 'Surah An-Nisa 4:123',
    surahName: 'An-Nisa',
    ayahNumber: 123,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/623.mp3'
  },
  'إن': {
    arabic: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ',
    english: 'Indeed, Allah will not change the condition of a people until they change what is in themselves.',
    reference: 'Surah Ar-Ra\'d 13:11',
    surahName: 'Ar-Ra\'d',
    ayahNumber: 11,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/1635.mp3'
  },
  'ما': {
    arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
    english: 'And I did not create the jinn and mankind except to worship Me.',
    reference: 'Surah Adh-Dhariyat 51:56',
    surahName: 'Adh-Dhariyat',
    ayahNumber: 56,
    audioUrl: 'https://cdn.islamic.network/quran/audio/128/ar.alafasy/5185.mp3'
  }
}

export const useQuranVerse = () => {
  const [verseData, setVerseData] = useState<VerseData | null>(null)
  const [verseLoading, setVerseLoading] = useState(false)
  const [verseError, setVerseError] = useState<string | null>(null)

  // Helper function to make API requests with timeout and retry
  const makeApiRequest = async (url: string, timeout = 5000): Promise<Response> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  const fetchVerse = async (word: Word) => {
    setVerseLoading(true)
    setVerseError(null)
    setVerseData(null)

    if (USE_SIMULATED_DATA) {
      // Simulated data with network delay
      setTimeout(() => {
        try {
          const verse = fallbackVerses[word.arabic]
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
      return
    }

    // Check fallback data first for immediate response
    const fallbackVerse = fallbackVerses[word.arabic]
    if (fallbackVerse) {
      console.log('📚 Using fallback verse data for:', word.arabic)
      setVerseData(fallbackVerse)
      setVerseLoading(false)
      return
    }

    // Try real API with multiple fallback strategies
    try {
      console.log('🔍 Starting verse search for word:', word.arabic, word.english)
      
      // Create multiple search strategies for better results
      const searchStrategies = [
        // Strategy 1: Use transliteration (often more specific than English)
        { term: word.transliteration, type: 'transliteration' },
        // Strategy 2: Use English meaning (but filter out very common words)
        ...(word.english.length > 2 && !['in', 'of', 'the', 'and', 'to', 'a', 'is', 'it', 'he', 'she', 'we', 'you', 'they'].includes(word.english.toLowerCase()) 
          ? [{ term: word.english, type: 'english' }] 
          : []),
        // Strategy 3: Use Arabic text directly (fallback)
        { term: word.arabic, type: 'arabic' }
      ]
      
      console.log('🎯 Search strategies:', searchStrategies)
      
      let searchData: SearchResult | null = null
      let usedStrategy = null
      
      // Try each search strategy until we find results
      for (const strategy of searchStrategies) {
        console.log(`🔍 Trying ${strategy.type} search with term:`, strategy.term)
        
        try {
          const searchKeyword = encodeURIComponent(strategy.term)
          // Try multiple API endpoints
          const apiEndpoints = [
            `https://api.alquran.cloud/v1/search/${searchKeyword}/2/en.sahih`,
            `https://api.alquran.cloud/v1/search/${searchKeyword}/all/en.sahih`,
            `https://api.alquran.cloud/v1/search/${searchKeyword}/en.sahih`
          ]
          
          for (const endpoint of apiEndpoints) {
            console.log('📡 Making search API call to:', endpoint)
            
            const searchResponse = await makeApiRequest(endpoint, 8000)
            
            console.log('📥 Search response status:', searchResponse.status)
            console.log('📥 Search response ok:', searchResponse.ok)
            
            if (searchResponse.ok) {
              const tempSearchData: SearchResult = await searchResponse.json()
              console.log(`📊 Search data received for ${strategy.type}:`, tempSearchData)
              
              if (tempSearchData.matches && tempSearchData.matches.length > 0) {
                searchData = tempSearchData
                usedStrategy = strategy
                console.log(`✅ Found results using ${strategy.type} strategy with endpoint: ${endpoint}`)
                break
              }
            }
          }
          
          if (searchData) break // Found results, exit strategy loop
          
        } catch (err) {
          console.error(`❌ Error with ${strategy.type} strategy:`, err)
          continue // Try next strategy
        }
      }
      
      if (!searchData || !searchData.matches || searchData.matches.length === 0) {
        console.warn('⚠️ No matches found for word with any strategy:', word.arabic, word.english, word.transliteration)
        setVerseError(`No verses found containing "${word.english}" or "${word.transliteration}". The word might be rare or the API might be temporarily unavailable.`)
        setVerseLoading(false)
        return
      }
      
      console.log(`🎉 Successfully found ${searchData.matches.length} matches using ${usedStrategy?.type} strategy`)

      // Get the first match
      const firstMatch = searchData.matches[0]
      console.log('🎯 First match:', firstMatch)
      const surahNumber = firstMatch.surah.number
      const ayahNumber = firstMatch.numberInSurah
      console.log('📖 Surah:', surahNumber, 'Ayah:', ayahNumber)

      // Try to fetch Arabic text with fallback
      let arabicText = firstMatch.text // Use search result as fallback
      try {
        const arabicUrl = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/quran-uthmani`
        console.log('📡 Making Arabic text API call to:', arabicUrl)
        
        const arabicResponse = await makeApiRequest(arabicUrl, 5000)
        
        if (arabicResponse.ok) {
          const arabicData: AyahResponse = await arabicResponse.json()
          if (arabicData.code === 200 && arabicData.data?.text) {
            arabicText = arabicData.data.text
            console.log('✅ Got Arabic text from API')
          }
        }
      } catch (err) {
        console.warn('⚠️ Could not fetch Arabic text, using search result text')
      }

      // Prepare verse data
      const verseData: VerseData = {
        arabic: arabicText,
        english: firstMatch.text,
        reference: `Surah ${firstMatch.surah.englishName} ${surahNumber}:${ayahNumber}`,
        surahName: firstMatch.surah.englishName,
        ayahNumber: ayahNumber
      }
      
      // Try to add audio URL
      try {
        const ayahGlobalNumber = (surahNumber - 1) * 1000 + ayahNumber // Rough calculation
        verseData.audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahGlobalNumber}.mp3`
        console.log('🔊 Constructed audio URL:', verseData.audioUrl)
      } catch (err) {
        console.warn('⚠️ Could not construct audio URL')
      }

      console.log('✅ Final verse data:', verseData)
      setVerseData(verseData)
      
    } catch (err) {
      console.error('❌ Error fetching verse:', err)
      
      // Final fallback: try to find a similar word in fallback data
      const similarWord = Object.keys(fallbackVerses).find(key => 
        key.includes(word.arabic) || word.arabic.includes(key)
      )
      
      if (similarWord) {
        console.log('📚 Using similar fallback verse for:', similarWord)
        setVerseData(fallbackVerses[similarWord])
      } else {
        setVerseError(
          `Unable to fetch verse data. The API might be temporarily unavailable. Please try again later.`
        )
      }
    } finally {
      console.log('🏁 Verse fetching completed')
      setVerseLoading(false)
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