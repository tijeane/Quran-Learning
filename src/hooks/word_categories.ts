// src/hooks/wordCategories.ts - Categorization and phrase data for the two-tier system

export type WordType = 'function' | 'content'

export interface WordPhrase {
  arabic: string
  transliteration: string
  english: string
  context?: string // Optional context about when this phrase is used
  category?: 'temporal' | 'spatial' | 'theological' | 'grammatical' | 'conditional' | 'possessive' | 'relational' // Grammatical categorization
  audioUrl?: string // Optional audio URL for pronunciation
}

// Function words that should show phrases instead of verses
export const functionWords = new Set([
  // Articles and particles
  'ال', 'و', 'ب', 'ل', 'ف', 'ك', 'س', 'ت',
  
  // Prepositions
  'في', 'من', 'إلى', 'على', 'عن', 'مع', 'عند', 'بين', 'بعد', 'قبل', 'تحت', 'فوق', 'أمام', 'وراء', 'حول', 'خلال', 'ضد', 'نحو', 'دون', 'سوى', 'غير',
  
  // Common particles and connectors
  'ما', 'لا', 'إن', 'أن', 'كان', 'كانوا', 'كانت', 'لم', 'لن', 'قد', 'قال', 'كل', 'بعض', 'غير', 'سوف', 'لقد', 'لكن', 'أم', 'أو', 'بل', 'لعل', 'عسى', 'ليت', 'كأن', 'إذا', 'إذ', 'لو', 'لولا', 'حتى', 'كي', 'لكي',
  
  // Pronouns and possessive pronouns
  'هو', 'هي', 'هم', 'هن', 'أنت', 'أنتم', 'أنتن', 'أنا', 'نحن', 'إياه', 'إياها', 'إياهم', 'إياهن', 'إياك', 'إياكم', 'إياكن', 'إياي', 'إيانا',
  
  // Possessive and prepositional pronouns
  'لهم', 'لها', 'له', 'لك', 'لكم', 'لكن', 'لنا', 'لي', 'بهم', 'بها', 'به', 'بك', 'بكم', 'بكن', 'بنا', 'بي', 'فيهم', 'فيها', 'فيه', 'فيك', 'فيكم', 'فيكن', 'فينا', 'في', 'عليهم', 'عليها', 'عليه', 'عليك', 'عليكم', 'عليكن', 'علينا', 'علي', 'عنهم', 'عنها', 'عنه', 'عنك', 'عنكم', 'عنكن', 'عنا', 'عني', 'منهم', 'منها', 'منه', 'منك', 'منكم', 'منكن', 'منا', 'مني',
  
  // Relative pronouns
  'الذي', 'الذين', 'التي', 'اللتان', 'اللتين', 'اللواتي', 'اللاتي', 'اللائي',
  
  // Demonstratives
  'هذا', 'هذه', 'هؤلاء', 'ذلك', 'تلك', 'أولئك', 'ذان', 'تان', 'هنا', 'هناك', 'هنالك',
  
  // Question words and interrogatives
  'ماذا', 'من', 'أين', 'كيف', 'متى', 'لماذا', 'لم', 'أي', 'أين', 'أنى', 'كم', 'كيف', 'متى', 'أيان',
  
  // Conditional and temporal particles
  'إذا', 'إذ', 'لما', 'كلما', 'بينما', 'لكن', 'غير', 'سوى', 'إلا', 'سوف', 'قد', 'لقد',
  
  // Negation particles
  'لا', 'لم', 'لن', 'ما', 'غير', 'ليس', 'لات', 'لا'
])

// Phrase collections for function words
export const functionWordPhrases: Record<string, WordPhrase[]> = {
  'من': [
    {
      arabic: 'من الله',
      transliteration: 'min Allah',
      english: 'from Allah',
      context: 'Divine origin or source',
      category: 'theological'
    },
    {
      arabic: 'من قبل',
      transliteration: 'min qabl',
      english: 'from before / previously',
      context: 'Temporal reference',
      category: 'temporal'
    },
    {
      arabic: 'من ربكم',
      transliteration: 'min rabbikum',
      english: 'from your Lord',
      context: 'Divine guidance or command',
      category: 'theological'
    },
    {
      arabic: 'من كل شيء',
      transliteration: 'min kulli shay\'',
      english: 'from everything',
      context: 'Comprehensive scope',
      category: 'spatial'
    },
    {
      arabic: 'من دون الله',
      transliteration: 'min duni Allah',
      english: 'besides Allah',
      context: 'Exclusivity of worship',
      category: 'theological'
    },
    {
      arabic: 'من بعد',
      transliteration: 'min ba\'d',
      english: 'after / following',
      context: 'Sequential time reference',
      category: 'temporal'
    },
    {
      arabic: 'من أجل',
      transliteration: 'min ajl',
      english: 'for the sake of',
      context: 'Purpose or cause',
      category: 'relational'
    }
  ],
  
  'في': [
    {
      arabic: 'في السماوات',
      transliteration: 'fi\'s-samawat',
      english: 'in the heavens',
      context: 'Cosmic scope'
    },
    {
      arabic: 'في الأرض',
      transliteration: 'fi\'l-ard',
      english: 'in the earth',
      context: 'Earthly domain'
    },
    {
      arabic: 'في الآخرة',
      transliteration: 'fi\'l-akhirah',
      english: 'in the Hereafter',
      context: 'Eschatological reference'
    },
    {
      arabic: 'في قلوبهم',
      transliteration: 'fi qulubihim',
      english: 'in their hearts',
      context: 'Internal spiritual state'
    },
    {
      arabic: 'في الدنيا',
      transliteration: 'fi\'d-dunya',
      english: 'in this world',
      context: 'Temporal worldly life'
    }
  ],
  
  'على': [
    {
      arabic: 'على الله',
      transliteration: '\'ala Allah',
      english: 'upon Allah / Allah\'s responsibility',
      context: 'Divine guarantee or trust'
    },
    {
      arabic: 'على العرش',
      transliteration: '\'ala\'l-\'arsh',
      english: 'upon the Throne',
      context: 'Divine sovereignty'
    },
    {
      arabic: 'على المؤمنين',
      transliteration: '\'ala\'l-mu\'minin',
      english: 'upon the believers',
      context: 'Obligation or blessing for believers'
    },
    {
      arabic: 'على كل شيء',
      transliteration: '\'ala kulli shay\'',
      english: 'over everything',
      context: 'Divine omnipotence'
    },
    {
      arabic: 'على الصراط',
      transliteration: '\'ala\'s-sirat',
      english: 'upon the path',
      context: 'Guidance and direction'
    }
  ],
  
  'إلى': [
    {
      arabic: 'إلى الله',
      transliteration: 'ila Allah',
      english: 'to Allah',
      context: 'Return or direction to Allah'
    },
    {
      arabic: 'إلى ربك',
      transliteration: 'ila rabbik',
      english: 'to your Lord',
      context: 'Personal relationship with Allah'
    },
    {
      arabic: 'إلى الصراط المستقيم',
      transliteration: 'ila\'s-sirat al-mustaqim',
      english: 'to the straight path',
      context: 'Guidance and direction'
    },
    {
      arabic: 'إلى يوم الدين',
      transliteration: 'ila yawm ad-din',
      english: 'until the Day of Judgment',
      context: 'Temporal endpoint'
    },
    {
      arabic: 'إلى الجنة',
      transliteration: 'ila\'l-jannah',
      english: 'to Paradise',
      context: 'Ultimate destination for believers'
    }
  ],
  
  'ما': [
    {
      arabic: 'ما شاء الله',
      transliteration: 'ma sha\' Allah',
      english: 'what Allah wills',
      context: 'Divine will and decree'
    },
    {
      arabic: 'ما في السماوات',
      transliteration: 'ma fi\'s-samawat',
      english: 'what is in the heavens',
      context: 'Cosmic contents'
    },
    {
      arabic: 'ما عند الله',
      transliteration: 'ma \'inda Allah',
      english: 'what is with Allah',
      context: 'Divine treasures or rewards'
    },
    {
      arabic: 'ما كان لهم',
      transliteration: 'ma kana lahum',
      english: 'it was not for them',
      context: 'Negation of right or ability'
    },
    {
      arabic: 'ما أنزل الله',
      transliteration: 'ma anzala Allah',
      english: 'what Allah revealed',
      context: 'Divine revelation'
    }
  ],
  
  'لا': [
    {
      arabic: 'لا إله إلا الله',
      transliteration: 'la ilaha illa Allah',
      english: 'There is no god but Allah',
      context: 'Declaration of monotheism'
    },
    {
      arabic: 'لا شريك له',
      transliteration: 'la sharika lah',
      english: 'He has no partner',
      context: 'Divine uniqueness'
    },
    {
      arabic: 'لا خوف عليهم',
      transliteration: 'la khawfun \'alayhim',
      english: 'no fear upon them',
      context: 'Divine reassurance'
    },
    {
      arabic: 'لا يظلم ربك',
      transliteration: 'la yazlimu rabbuk',
      english: 'your Lord does not wrong',
      context: 'Divine justice'
    },
    {
      arabic: 'لا ريب فيه',
      transliteration: 'la rayba fih',
      english: 'no doubt in it',
      context: 'Certainty about the Quran'
    }
  ],
  
  'الذين': [
    {
      arabic: 'الذين آمنوا',
      transliteration: 'alladhina amanu',
      english: 'those who believe',
      context: 'Believers are often referenced this way'
    },
    {
      arabic: 'الذين كفروا',
      transliteration: 'alladhina kafaru',
      english: 'those who disbelieve',
      context: 'Disbelievers are often referenced this way'
    },
    {
      arabic: 'الذين عملوا الصالحات',
      transliteration: 'alladhina \'amilu\'s-salihat',
      english: 'those who do righteous deeds',
      context: 'Description of the righteous'
    },
    {
      arabic: 'الذين من قبلهم',
      transliteration: 'alladhina min qablihim',
      english: 'those who came before them',
      context: 'Reference to previous generations'
    },
    {
      arabic: 'الذين أنعم الله عليهم',
      transliteration: 'alladhina an\'ama Allah \'alayhim',
      english: 'those upon whom Allah bestowed favor',
      context: 'Blessed by Allah'
    }
  ],
  
  'كان': [
    {
      arabic: 'كان الله غفوراً رحيماً',
      transliteration: 'kana Allah ghafuran rahima',
      english: 'Allah is Forgiving and Merciful',
      context: 'Common ending emphasizing Allah\'s attributes'
    },
    {
      arabic: 'كان على كل شيء قديراً',
      transliteration: 'kana \'ala kulli shay\'in qadira',
      english: 'He is able to do all things',
      context: 'Emphasis on Allah\'s omnipotence'
    },
    {
      arabic: 'كان بهم رحيماً',
      transliteration: 'kana bihim rahima',
      english: 'He is merciful to them',
      context: 'Allah\'s mercy toward people'
    },
    {
      arabic: 'كان عليماً حكيماً',
      transliteration: 'kana \'aliman hakima',
      english: 'He is Knowing and Wise',
      context: 'Allah\'s knowledge and wisdom'
    },
    {
      arabic: 'كان بما تعملون بصيراً',
      transliteration: 'kana bima ta\'maluna basira',
      english: 'He is Seeing of what you do',
      context: 'Allah\'s awareness of human actions'
    }
  ],
  
  'و': [
    {
      arabic: 'والله أعلم',
      transliteration: 'wa\'llahu a\'lam',
      english: 'and Allah knows best',
      context: 'Acknowledgment of Allah\'s superior knowledge'
    },
    {
      arabic: 'والآخرة خير',
      transliteration: 'wa\'l-akhiratu khayr',
      english: 'and the Hereafter is better',
      context: 'Comparison between this life and the next'
    },
    {
      arabic: 'والله غني',
      transliteration: 'wa\'llahu ghaniyy',
      english: 'and Allah is Self-Sufficient',
      context: 'Allah\'s independence from creation'
    },
    {
      arabic: 'وهو العزيز الحكيم',
      transliteration: 'wa huwa\'l-\'aziz al-hakim',
      english: 'and He is the Exalted in Might, the Wise',
      context: 'Common combination of Allah\'s attributes'
    },
    {
      arabic: 'والله بكل شيء عليم',
      transliteration: 'wa\'llahu bi kulli shay\'in \'alim',
      english: 'and Allah is Knowing of all things',
      context: 'Allah\'s comprehensive knowledge'
    }
  ],
  
  'ب': [
    {
      arabic: 'بسم الله',
      transliteration: 'bismi\'llah',
      english: 'in the name of Allah',
      context: 'Beginning of chapters and actions'
    },
    {
      arabic: 'بإذن الله',
      transliteration: 'bi\'idhni\'llah',
      english: 'by Allah\'s permission',
      context: 'Things happen only with Allah\'s permission'
    },
    {
      arabic: 'برحمة من الله',
      transliteration: 'bi rahmatin mina\'llah',
      english: 'by mercy from Allah',
      context: 'Divine grace and compassion'
    },
    {
      arabic: 'بما كانوا يعملون',
      transliteration: 'bima kanu ya\'malun',
      english: 'for what they used to do',
      context: 'Divine recompense based on actions'
    },
    {
      arabic: 'بالحق',
      transliteration: 'bil-haqq',
      english: 'with truth / in truth',
      context: 'Divine actions are always truthful'
    }
  ],
  
  'لهم': [
    {
      arabic: 'لهم جنات',
      transliteration: 'lahum jannat',
      english: 'for them are gardens',
      context: 'Promise of Paradise for believers',
      category: 'theological'
    },
    {
      arabic: 'لهم أجر عظيم',
      transliteration: 'lahum ajrun \'azim',
      english: 'for them is a great reward',
      context: 'Divine reward for good deeds',
      category: 'theological'
    },
    {
      arabic: 'لهم ما يشاءون',
      transliteration: 'lahum ma yasha\'un',
      english: 'for them is whatever they wish',
      context: 'Abundance in Paradise',
      category: 'theological'
    },
    {
      arabic: 'لهم البشرى',
      transliteration: 'lahum al-bushra',
      english: 'for them is good news',
      context: 'Glad tidings for the righteous',
      category: 'theological'
    },
    {
      arabic: 'لهم عذاب أليم',
      transliteration: 'lahum \'adhabun alim',
      english: 'for them is a painful punishment',
      context: 'Warning for wrongdoers',
      category: 'theological'
    }
  ],
  
  // Add some more common function words with categorized phrases
  'إذا': [
    {
      arabic: 'إذا جاء نصر الله',
      transliteration: 'idha ja\'a nasru Allah',
      english: 'when the help of Allah comes',
      context: 'Conditional statement about divine help',
      category: 'conditional'
    },
    {
      arabic: 'إذا قرئ القرآن',
      transliteration: 'idha quri\'a al-qur\'an',
      english: 'when the Quran is recited',
      context: 'Proper etiquette during recitation',
      category: 'conditional'
    },
    {
      arabic: 'إذا دعاك',
      transliteration: 'idha da\'ak',
      english: 'when He calls you',
      context: 'Response to divine call',
      category: 'conditional'
    }
  ],
  
  'بل': [
    {
      arabic: 'بل الله',
      transliteration: 'bal Allah',
      english: 'rather, Allah',
      context: 'Correction emphasizing Allah\'s role',
      category: 'grammatical'
    },
    {
      arabic: 'بل أنتم',
      transliteration: 'bal antum',
      english: 'rather, you',
      context: 'Contradiction or emphasis',
      category: 'grammatical'
    },
    {
      arabic: 'بل هو الحق',
      transliteration: 'bal huwa al-haqq',
      english: 'rather, it is the truth',
      context: 'Affirming the truth',
      category: 'grammatical'
    }
  ],
  
  'حتى': [
    {
      arabic: 'حتى يأتيهم',
      transliteration: 'hatta ya\'tiyahum',
      english: 'until it comes to them',
      context: 'Temporal endpoint',
      category: 'temporal'
    },
    {
      arabic: 'حتى الموت',
      transliteration: 'hatta al-mawt',
      english: 'until death',
      context: 'Ultimate temporal boundary',
      category: 'temporal'
    },
    {
      arabic: 'حتى تؤمنوا',
      transliteration: 'hatta tu\'minu',
      english: 'until you believe',
      context: 'Condition for change',
      category: 'conditional'
    }
  ],
  
  'له': [
    {
      arabic: 'له ما في السماوات',
      transliteration: 'lahu ma fi\'s-samawat',
      english: 'to Him belongs what is in the heavens',
      context: 'Allah\'s ownership of all creation'
    },
    {
      arabic: 'له الحمد',
      transliteration: 'lahu\'l-hamd',
      english: 'to Him is praise',
      context: 'All praise belongs to Allah'
    },
    {
      arabic: 'له الملك',
      transliteration: 'lahu\'l-mulk',
      english: 'to Him belongs sovereignty',
      context: 'Allah\'s absolute authority'
    },
    {
      arabic: 'له الأسماء الحسنى',
      transliteration: 'lahu\'l-asma\' al-husna',
      english: 'to Him belong the most beautiful names',
      context: 'Allah\'s perfect attributes'
    },
    {
      arabic: 'له ما يشاء',
      transliteration: 'lahu ma yasha\'',
      english: 'to Him belongs whatever He wills',
      context: 'Allah\'s absolute will'
    }
  ],
  
  'لها': [
    {
      arabic: 'لها ما كسبت',
      transliteration: 'laha ma kasabat',
      english: 'for it is what it earned',
      context: 'Each soul gets what it deserves'
    },
    {
      arabic: 'لها عذاب',
      transliteration: 'laha \'adhab',
      english: 'for it is punishment',
      context: 'Consequence for wrongdoing'
    },
    {
      arabic: 'لها أجر',
      transliteration: 'laha ajr',
      english: 'for it is reward',
      context: 'Recompense for good deeds'
    },
    {
      arabic: 'لها ما تشاء',
      transliteration: 'laha ma tasha\'',
      english: 'for it is whatever it wishes',
      context: 'Fulfillment of desires'
    }
  ],
  
  'بهم': [
    {
      arabic: 'والله بهم عليم',
      transliteration: 'wa\'llahu bihim \'alim',
      english: 'and Allah is Knowing of them',
      context: 'Allah\'s complete awareness'
    },
    {
      arabic: 'كان بهم رحيماً',
      transliteration: 'kana bihim rahima',
      english: 'He is merciful to them',
      context: 'Allah\'s mercy toward people'
    },
    {
      arabic: 'فعل بهم',
      transliteration: 'fa\'ala bihim',
      english: 'He did to them',
      context: 'Divine action or intervention'
    },
    {
      arabic: 'ما بهم من نعمة',
      transliteration: 'ma bihim min ni\'ma',
      english: 'whatever blessing they have',
      context: 'Recognition of Allah\'s blessings'
    }
  ],
  
  'عليهم': [
    {
      arabic: 'عليهم دائرة السوء',
      transliteration: '\'alayhim da\'iratu\'s-su\'',
      english: 'upon them is the evil turn of fortune',
      context: 'Consequence for wrongdoing'
    },
    {
      arabic: 'أنعم الله عليهم',
      transliteration: 'an\'ama\'llahu \'alayhim',
      english: 'Allah bestowed favor upon them',
      context: 'Divine blessing and guidance'
    },
    {
      arabic: 'لا خوف عليهم',
      transliteration: 'la khawfun \'alayhim',
      english: 'no fear upon them',
      context: 'Divine reassurance for believers'
    },
    {
      arabic: 'السلام عليهم',
      transliteration: 'as-salamu \'alayhim',
      english: 'peace be upon them',
      context: 'Greeting and blessing'
    },
    {
      arabic: 'غضب الله عليهم',
      transliteration: 'ghadiba\'llahu \'alayhim',
      english: 'Allah\'s wrath is upon them',
      context: 'Divine displeasure with wrongdoers'
    }
  ]
}

// Helper function to determine if a word is a function word
export const isFunction = (arabicWord: string): boolean => {
  return functionWords.has(arabicWord)
}

// Helper function to get word type
export const getWordType = (arabicWord: string): WordType => {
  return isFunction(arabicWord) ? 'function' : 'content'
}

// Helper function to get phrases for a function word
export const getFunctionWordPhrases = (arabicWord: string): WordPhrase[] => {
  return functionWordPhrases[arabicWord] || []
}