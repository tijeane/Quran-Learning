/*
  # Create words table for Quran vocabulary

  1. New Tables
    - `words`
      - `id` (serial, primary key)
      - `arabic` (text, Arabic word)
      - `transliteration` (text, romanized pronunciation)
      - `english` (text, English meaning)
      - `frequency` (integer, how often it appears in Quran)
      - `audio_url` (text, optional audio file URL)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `words` table
    - Add policy for public read access to words
*/

CREATE TABLE IF NOT EXISTS words (
  id SERIAL PRIMARY KEY,
  arabic TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  english TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 1,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE words ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Words are publicly readable"
  ON words
  FOR SELECT
  USING (true);

-- Insert the 100 most frequent words in the Quran
INSERT INTO words (arabic, transliteration, english, frequency) VALUES
('الله', 'Allah', 'God/Allah', 2697),
('في', 'fi', 'in', 1691),
('من', 'min', 'from/of', 1595),
('إلى', 'ila', 'to', 1164),
('على', 'ala', 'on/upon', 1139),
('ما', 'ma', 'what/not', 1033),
('أن', 'an', 'that', 1007),
('لا', 'la', 'no/not', 990),
('قال', 'qala', 'he said', 529),
('الذين', 'alladhina', 'those who', 510),
('كان', 'kana', 'was/were', 506),
('هو', 'huwa', 'he/it', 485),
('لهم', 'lahum', 'for them', 484),
('أو', 'aw', 'or', 483),
('عند', 'inda', 'with/at', 482),
('قد', 'qad', 'indeed/already', 481),
('التي', 'allati', 'which/that (feminine)', 422),
('هم', 'hum', 'they', 421),
('بعد', 'baad', 'after', 420),
('كل', 'kull', 'all/every', 382),
('لم', 'lam', 'did not', 378),
('أم', 'am', 'or (in questions)', 377),
('عن', 'an', 'about/from', 376),
('يوم', 'yawm', 'day', 365),
('بين', 'bayna', 'between', 364),
('ذلك', 'dhalika', 'that', 362),
('كانوا', 'kanu', 'they were', 359),
('فإن', 'fa-in', 'so if', 358),
('أهل', 'ahl', 'people/family', 357),
('الأرض', 'al-ard', 'the earth', 356),
('إن', 'inna', 'indeed', 355),
('كتاب', 'kitab', 'book', 319),
('الذي', 'alladhi', 'who/which (masculine)', 318),
('بما', 'bima', 'with what', 317),
('رب', 'rabb', 'Lord', 316),
('هذا', 'hadha', 'this (masculine)', 315),
('فلا', 'fa-la', 'so do not', 314),
('إذا', 'idha', 'when/if', 313),
('أولئك', 'ula-ika', 'those', 312),
('لكم', 'lakum', 'for you (plural)', 311),
('بل', 'bal', 'rather/but', 310),
('عليه', 'alayhi', 'upon him', 309),
('كيف', 'kayfa', 'how', 308),
('أين', 'ayna', 'where', 307),
('لو', 'law', 'if', 306),
('حتى', 'hatta', 'until', 305),
('لك', 'laka', 'for you (singular)', 304),
('منها', 'minha', 'from it (feminine)', 303),
('فيها', 'fiha', 'in it (feminine)', 302),
('عليها', 'alayha', 'upon it (feminine)', 301),
('الرحمن', 'ar-Rahman', 'The Most Merciful', 169),
('الرحيم', 'ar-Raheem', 'The Most Compassionate', 114),
('ملك', 'malik', 'king', 48),
('الدين', 'ad-din', 'the religion/judgment', 92),
('إياك', 'iyyaka', 'You alone', 2),
('نعبد', 'nabudu', 'we worship', 2),
('نستعين', 'nastaeen', 'we seek help', 2),
('اهدنا', 'ihdina', 'guide us', 2),
('الصراط', 'as-sirat', 'the path', 45),
('المستقيم', 'al-mustaqeem', 'the straight', 5),
('صراط', 'sirat', 'path', 45),
('أنعمت', 'anamta', 'You have blessed', 1),
('عليهم', 'alayhim', 'upon them', 1),
('غير', 'ghayr', 'other than', 23),
('المغضوب', 'al-maghdub', 'those who earned wrath', 1),
('ولا', 'wa-la', 'and not', 1),
('الضالين', 'ad-dalleen', 'those who went astray', 1),
('آمين', 'ameen', 'Amen', 1),
('بسم', 'bismi', 'in the name of', 114),
('الحمد', 'al-hamd', 'praise', 38),
('رب', 'rabb', 'Lord', 316),
('العالمين', 'al-alameen', 'the worlds', 73),
('مالك', 'maliki', 'master', 11),
('نور', 'nur', 'light', 49),
('سبيل', 'sabeel', 'way/path', 176),
('حق', 'haqq', 'truth/right', 287),
('باطل', 'batil', 'falsehood', 36),
('خير', 'khayr', 'good', 180),
('شر', 'sharr', 'evil', 30),
('رحمة', 'rahma', 'mercy', 79),
('عذاب', 'adhab', 'punishment', 373),
('جنة', 'janna', 'paradise', 147),
('نار', 'nar', 'fire', 145),
('دنيا', 'dunya', 'worldly life', 115),
('آخرة', 'akhira', 'hereafter', 115),
('موت', 'mawt', 'death', 165),
('حياة', 'hayah', 'life', 145),
('علم', 'ilm', 'knowledge', 105),
('حكمة', 'hikma', 'wisdom', 20),
('صبر', 'sabr', 'patience', 103),
('شكر', 'shukr', 'gratitude', 75),
('توبة', 'tawba', 'repentance', 87),
('مغفرة', 'maghfira', 'forgiveness', 234),
('رزق', 'rizq', 'provision', 123),
('فضل', 'fadl', 'favor/grace', 83),
('نعمة', 'nima', 'blessing', 142),
('آية', 'aya', 'sign/verse', 382),
('قرآن', 'quran', 'Quran', 70),
('رسول', 'rasul', 'messenger', 333),
('نبي', 'nabi', 'prophet', 75),
('ملائكة', 'malaika', 'angels', 88),
('شيطان', 'shaytan', 'Satan', 88),
('إبليس', 'iblis', 'Iblis', 11),
('جن', 'jinn', 'jinn', 22),
('إنس', 'ins', 'mankind', 18),
('قوم', 'qawm', 'people/nation', 383),
('أمة', 'umma', 'community/nation', 64);