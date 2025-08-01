import React from 'react'
import { TrendingUp, Target, Award, Calendar } from 'lucide-react'
import type { UserStats } from '../lib/supabase'

interface ProgressCardProps {
  stats: UserStats
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ stats }) => {
  const progressPercentage = Math.round((stats.words_learned / 100) * 100)

  const StatItem: React.FC<{
    icon: React.ReactNode
    value: string | number
    label: string
    color: string
  }> = ({ icon, value, label, color }) => (
    <div className={`bg-gradient-to-br ${color} p-4 rounded-lg text-white`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  )

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-600" />
        Your Progress
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatItem
          icon={<Target className="w-5 h-5" />}
          value={stats.words_learned}
          label="Words Learned"
          color="from-blue-500 to-blue-600"
        />
        <StatItem
          icon={<Calendar className="w-5 h-5" />}
          value={stats.days_streak}
          label="Days Streak"
          color="from-green-500 to-green-600"
        />
        <StatItem
          icon={<Award className="w-5 h-5" />}
          value={`${stats.accuracy}%`}
          label="Accuracy"
          color="from-purple-500 to-purple-600"
        />
        <StatItem
          icon={<TrendingUp className="w-5 h-5" />}
          value={stats.total_points}
          label="Total Points"
          color="from-orange-500 to-orange-600"
        />
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm text-gray-600">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {stats.words_learned} of 100 words mastered
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Current Level</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
            Level {stats.current_level}
          </span>
        </div>
        <div className="mt-2 text-xs text-gray-600">
          {stats.total_points} points earned
        </div>
      </div>
    </div>
  )
}