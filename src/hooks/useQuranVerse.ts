import { useState } from 'react'
import { Word } from '../lib/supabase'

// Toggle this flag to switch between simulated data and real API calls
const USE_SIMULATED_DATA = true

export interface VerseData {
  arabic: string
  english: string
  reference: string
  surahName?: string
  ayahNumber?: number
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
              ayahNumber: 1
            },
            'الرحمن': {
              arabic: 'الرَّحْمَٰنُ عَلَى الْعَرْشِ اسْتَوَىٰ',
              english: 'The Most Merciful [who is] above the Throne established.',
              reference: 'Surah Ta-Ha 20:5',
              surahName: 'Ta-Ha',
              ayahNumber: 5
            },
            'الرحيم': {
              arabic: 'وَهُوَ الْغَفُورُ الرَّحِيمُ',
              english: 'And He is the Forgiving, the Merciful.',
              reference: 'Surah Al-Mulk 67:2',
              surahName: 'Al-Mulk',
              ayahNumber: 2
            },
            'ملك': {
              arabic: 'مَالِكِ يَوْمِ الدِّينِ',
              english: 'Sovereign of the Day of Recompense.',
              reference: 'Surah Al-Fatiha 1:4',
              surahName: 'Al-Fatiha',
              ayahNumber: 4
            },
            'يوم': {
              arabic: 'مَالِكِ يَوْمِ الدِّينِ',
              english: 'Sovereign of the Day of Recompense.',
              reference: 'Surah Al-Fatiha 1:4',
              surahName: 'Al-Fatiha',
              ayahNumber: 4
            },
            'الدين': {
              arabic: 'مَالِكِ يَوْمِ الدِّينِ',
              english: 'Sovereign of the Day of Recompense.',
              reference: 'Surah Al-Fatiha 1:4',
              surahName: 'Al-Fatiha',
              ayahNumber: 4
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
      // Real API implementation using api.alquran.cloud
      try {
        // For demonstration, we'll fetch specific verses for known words
        // In a real implementation, you'd need a backend service for comprehensive word search
        const knownVerses: Record<string, { surah: number; ayah: number }> = {
          'الله': { surah: 1, ayah: 1 }, // Al-Fatiha, Ayah 1
          'الرحمن': { surah: 20, ayah: 5 }, // Ta-Ha, Ayah 5
          'الرحيم': { surah: 67, ayah: 2 }, // Al-Mulk, Ayah 2
          'ملك': { surah: 1, ayah: 4 }, // Al-Fatiha, Ayah 4
          'يوم': { surah: 1, ayah: 4 }, // Al-Fatiha, Ayah 4
          'الدين': { surah: 1, ayah: 4 }, // Al-Fatiha, Ayah 4
        }

        const verseLocation = knownVerses[word.arabic]
        
        if (!verseLocation) {
          setVerseError(`Direct word search not available for "${word.arabic}". Consider implementing a backend search service for comprehensive word lookup.`)
          setVerseLoading(false)
          return
        }

        const { surah, ayah } = verseLocation
        
        // Fetch Arabic text and English translation in parallel
        const arabicEdition = 'quran-uthmani' // Uthmani script
        const englishEdition = 'en.sahih' // Sahih International translation
        
        const arabicUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${arabicEdition}`
        const englishUrl = `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/${englishEdition}`

        const [arabicResponse, englishResponse] = await Promise.all([
          fetch(arabicUrl),
          fetch(englishUrl)
        ])

        if (!arabicResponse.ok || !englishResponse.ok) {
          throw new Error(`API request failed: ${arabicResponse.status} / ${englishResponse.status}`)
        }

        const arabicData = await arabicResponse.json()
        const englishData = await englishResponse.json()

        if (arabicData.code === 200 && englishData.code === 200) {
          const verseData: VerseData = {
            arabic: arabicData.data.text,
            english: englishData.data.text,
            reference: `Surah ${arabicData.data.surah.englishName} ${arabicData.data.surah.number}:${arabicData.data.numberInSurah}`,
            surahName: arabicData.data.surah.englishName,
            ayahNumber: arabicData.data.numberInSurah
          }
          setVerseData(verseData)
        } else {
          throw new Error('API returned error response')
        }
      } catch (err) {
        console.error('Error fetching verse:', err)
        setVerseError(
          err instanceof Error 
            ? `Failed to fetch verse: ${err.message}` 
            : 'Network error occurred while fetching verse'
        )
      } finally {
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