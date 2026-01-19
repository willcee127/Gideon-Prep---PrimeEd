import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const ProgressLedger = ({ userName, isOpen, onClose }) => {
  const [stats, setStats] = useState({
    totalTerritories: 0,
    neuralStability: 0,
    consistencyStreak: 0,
    weeklyChallenges: 0,
    stressResilience: 0,
    isLoading: true
  })

  useEffect(() => {
    if (isOpen) {
      loadProgressData()
    }
  }, [isOpen])

  const loadProgressData = async () => {
    try {
      const userId = localStorage.getItem('gideon_user_name') || 'anonymous'
      
      // Fetch mastery data
      const { data: masteryData, error: masteryError } = await supabase
        .from('mastery_ledger')
        .select('node_id, created_at')
        .eq('user_id', userId)
        .eq('status', 'mastered')
      
      // Fetch trauma logs for breathing sessions
      const { data: traumaData, error: traumaError } = await supabase
        .from('trauma_logs')
        .select('created_at, stress_level_before, trigger')
        .eq('user_id', userId)
        .eq('event_type', 'self_regulation_win')
        .eq('trigger', 'high_stress_breather')
      
      // Calculate stats
      const totalTerritories = masteryData?.length || 0
      const neuralStability = traumaData?.length || 0
      
      // Calculate consistency streak (days in a row with activity)
      const consistencyStreak = await calculateConsistencyStreak(userId)
      
      // Calculate weekly challenges (last 7 days)
      const weeklyChallenges = await calculateWeeklyChallenges(userId)
      
      // Calculate stress resilience (based on breathing sessions)
      const stressResilience = Math.min(100, neuralStability * 10)
      
      setStats({
        totalTerritories,
        neuralStability,
        consistencyStreak,
        weeklyChallenges,
        stressResilience,
        isLoading: false
      })
    } catch (error) {
      console.error('Failed to load progress data:', error)
      setStats(prev => ({ ...prev, isLoading: false }))
    }
  }

  const calculateConsistencyStreak = async (userId) => {
    try {
      // Get the last 30 days of activity
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      
      const { data: masteryData } = await supabase
        .from('mastery_ledger')
        .select('created_at')
        .eq('user_id', userId)
        .eq('status', 'mastered')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', 'asc')
      
      if (!masteryData || masteryData.length === 0) return 0
      
      // Group by day and count consecutive days with activity
      const dailyActivity = {}
      masteryData.forEach(record => {
        const day = new Date(record.created_at).toDateString()
        dailyActivity[day] = true
      })
      
      const dates = Object.keys(dailyActivity).sort((a, b) => new Date(a) - new Date(b))
      
      let streak = 0
      const today = new Date().toDateString()
      
      // Count backwards from today
      for (let i = dates.length - 1; i >= 0; i--) {
        const currentDate = dates[i]
        const expectedDate = new Date()
        expectedDate.setDate(expectedDate.getDate() - (dates.length - 1 - i))
        
        if (currentDate === expectedDate.toDateString()) {
          streak++
        } else {
          break
        }
      }
      
      return streak
    } catch (error) {
      console.error('Failed to calculate consistency streak:', error)
      return 0
    }
  }

  const calculateWeeklyChallenges = async (userId) => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      
      const { data: masteryData } = await supabase
        .from('mastery_ledger')
        .select('created_at')
        .eq('user_id', userId)
        .eq('status', 'mastered')
        .gte('created_at', sevenDaysAgo)
      
      return masteryData?.length || 0
    } catch (error) {
      console.error('Failed to calculate weekly challenges:', error)
      return 0
    }
  }

  const AnimatedCounter = ({ value, duration = 2000 }) => {
    const [displayValue, setDisplayValue] = useState(0)
    
    useEffect(() => {
      if (isOpen) {
        const startTime = Date.now()
        const endTime = startTime + duration
        
        const animate = () => {
          const now = Date.now()
          const progress = Math.min((now - startTime) / duration, 1)
          const current = Math.floor(progress * value)
          
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
          
          setDisplayValue(current)
        }
        
        requestAnimationFrame(animate)
      }
    }, [isOpen, value, duration])
    
    return displayValue
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-purple-900/95 to-blue-900/95 border-2 border-purple-400/50 rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl"
      >
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-purple-300">
              Warrior Progress Ledger
            </h2>
            <button
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full transition"
            >
              ✕
            </button>
          </div>
          
          {/* Warrior Icon */}
          <div className="w-20 h-20 mx-auto bg-purple-400 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">⚔️</span>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Total Territories */}
            <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/30">
              <div className="text-yellow-400 text-xs font-semibold mb-1">TOTAL TERRITORIES</div>
              <div className="text-3xl font-bold text-yellow-300">
                <AnimatedCounter value={stats.totalTerritories} duration={1500} />
              </div>
              <div className="text-yellow-200 text-xs">Reclaimed</div>
            </div>
            
            {/* Neural Stability */}
            <div className="bg-black/30 rounded-xl p-4 border border-blue-400/30">
              <div className="text-blue-400 text-xs font-semibold mb-1">NEURAL STABILITY</div>
              <div className="text-3xl font-bold text-blue-300">
                <AnimatedCounter value={stats.neuralStability} duration={1800} />
              </div>
              <div className="text-blue-200 text-xs">Sessions</div>
            </div>
            
            {/* Consistency Streak */}
            <div className="bg-black/30 rounded-xl p-4 border border-green-400/30">
              <div className="text-green-400 text-xs font-semibold mb-1">CONSISTENCY</div>
              <div className="text-3xl font-bold text-green-300">
                <AnimatedCounter value={stats.consistencyStreak} duration={1200} />
              </div>
              <div className="text-green-200 text-xs">Day Streak</div>
            </div>
            
            {/* Weekly Challenges */}
            <div className="bg-black/30 rounded-xl p-4 border border-purple-400/30">
              <div className="text-purple-400 text-xs font-semibold mb-1">WEEKLY</div>
              <div className="text-3xl font-bold text-purple-300">
                <AnimatedCounter value={stats.weeklyChallenges} duration={1000} />
              </div>
              <div className="text-purple-200 text-xs">Challenges</div>
            </div>
          </div>
          
          {/* Stress Resilience Graph */}
          <div className="bg-black/30 rounded-xl p-4 border border-cyan-400/30 mb-6">
            <h3 className="text-cyan-400 text-sm font-semibold mb-3">STRESS RESILIENCE</h3>
            <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${stats.stressResilience}%` }}
                transition={{ duration: 2000, ease: "easeOut" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">{stats.stressResilience}%</span>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          
          {/* Encouraging Summary */}
          <div className="bg-gradient-to-r from-purple-800/50 to-blue-800/50 rounded-xl p-4 border border-purple-400/30">
            <p className="text-purple-200 text-sm leading-relaxed">
              {userName || 'Wil'}, you have successfully navigated <span className="text-purple-300 font-bold">{stats.weeklyChallenges}</span> challenges this week. Your focus is becoming your strongest tool.
            </p>
          </div>
          
          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition transform hover:scale-105"
          >
            Continue Mission
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ProgressLedger
