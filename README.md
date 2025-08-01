# Quran Words App

A modern, interactive web application for learning the 100 most frequently used words in the Holy Quran. Built with React, TypeScript, and Supabase.

## 🎯 Features

- **Interactive Word Learning**: Browse and study Quranic vocabulary with audio pronunciation
- **Progress Tracking**: Visual analytics showing learning progress and statistics
- **Multiple Learning Modes**: Smart learning, flashcards, quizzes, and practice sessions
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Arabic Text Support**: Proper RTL text rendering and Arabic typography

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Fill in your Supabase credentials in `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## 🗄️ Database Setup

Create the following tables in your Supabase database:

### Words Table
```sql
CREATE TABLE words (
  id SERIAL PRIMARY KEY,
  arabic TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  english TEXT NOT NULL,
  frequency INTEGER NOT NULL,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- Allow public read access to words
CREATE POLICY "Words are publicly readable" ON words
  FOR SELECT USING (true);
```

### User Progress Table
```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  mastery_level INTEGER DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 100),
  correct_answers INTEGER DEFAULT 0,
  total_attempts INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_review TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, word_id)
);

-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own progress
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

### Sample Data
```sql
INSERT INTO words (arabic, transliteration, english, frequency) VALUES
('الله', 'Allah', 'God', 2697),
('الرحمن', 'Ar-Rahman', 'The Merciful', 169),
('الرحيم', 'Ar-Raheem', 'The Compassionate', 114),
('ملك', 'Malik', 'King', 48),
('يوم', 'Yawm', 'Day', 365),
('الدين', 'Ad-Deen', 'The Religion', 92),
('إياك', 'Iyyaka', 'You alone', 2),
('نعبد', 'Na''budu', 'We worship', 2),
('نستعين', 'Nasta''een', 'We seek help', 2),
('اهدنا', 'Ihdeena', 'Guide us', 2),
('الصراط', 'As-Sirat', 'The path', 45),
('المستقيم', 'Al-Mustaqeem', 'The straight', 5);
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── WordCard.tsx    # Individual word display
│   ├── ProgressCard.tsx # Progress tracking
│   ├── SearchSection.tsx # Word search and filtering
│   └── QuickActions.tsx # Action buttons
├── lib/
│   └── supabase.ts     # Supabase client and types
├── App.tsx             # Main application component
└── App.css             # Global styles and Arabic typography
```

## 🎨 Design Features

- **Responsive Grid Layout**: Adapts from mobile to desktop
- **Arabic Typography**: Proper RTL support and font rendering
- **Interactive Elements**: Hover states and smooth transitions
- **Accessibility**: Screen reader support and keyboard navigation
- **Dark Mode Ready**: CSS custom properties for theming

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Technologies

- **React 18** - Modern React with hooks
- **TypeScript** - Type safety and better DX
- **Vite** - Fast build tool and dev server
- **Supabase** - Backend as a service
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

## 📱 Mobile Optimization

- Touch-friendly interface with 44px minimum touch targets
- Responsive typography using `clamp()`
- Optimized layouts for portrait and landscape
- Smooth animations with reduced motion support
- High contrast mode compatibility

## 🔮 Roadmap

- [ ] User authentication and profiles
- [ ] Adaptive learning algorithm
- [ ] Spaced repetition system
- [ ] Audio pronunciation with multiple reciters
- [ ] Gamification with points and badges
- [ ] Offline support with PWA
- [ ] Multiple language interfaces
- [ ] Community features and sharing

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests for any improvements.