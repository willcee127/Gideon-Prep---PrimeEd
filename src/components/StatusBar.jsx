import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNeuro } from '../context/NeuroProvider'
import { supabase } from '../supabase'

const StatusBar = ({ userName, completedNodes, correctAnswers, isWelcomeKitActive, onShowIntel }) => {
  const { stressLevel, isStressed } = useNeuro()
  const [totalReclaimed, setTotalReclaimed] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [nextTerritory, setNextTerritory] = useState('Foundation')
  const [gedReadiness, setGedReadiness] = useState(0)
  const [totalReps, setTotalReps] = useState(0)

  // Calculate metrics
  useEffect(() => {
    setTotalReclaimed(completedNodes.length)
    setTotalReps(correctAnswers) // Each correct answer is a rep
    
    // Calculate GED Readiness (percentage of 50 strongholds)
    const readinessPercentage = Math.round((completedNodes.length / 50) * 100)
    setGedReadiness(readinessPercentage)
    
    // Calculate current streak (consecutive days with activity)
    const calculateStreak = () => {
      if (completedNodes.length === 0) return 0
      
      const today = new Date().toISOString().split('T')[0]
      let streak = 0
      let currentDate = new Date(today)
      
      while (streak < completedNodes.length) {
        const dateStr = currentDate.toISOString().split('T')[0]
        const hasActivity = completedNodes.some(node => 
          node.created_at && node.created_at.startsWith(dateStr)
        )
        
        if (hasActivity) {
          streak++
          currentDate.setDate(currentDate.getDate() - 1)
        } else {
          break
        }
      }
      
      return streak
    }

    setCurrentStreak(calculateStreak())
  }, [completedNodes])

  // Determine next territory
  useEffect(() => {
    if (completedNodes.length === 0) {
      setNextTerritory('Foundation')
    } else if (completedNodes.length < 5) {
      setNextTerritory('Foundation')
    } else if (completedNodes.length < 10) {
      setNextTerritory('Advanced')
    } else if (completedNodes.length < 15) {
      setNextTerritory('Expert')
    } else {
      setNextTerritory('Mixed Practice')
    }
  }, [completedNodes])

  const getGrowthCompass = () => {
    if (stressLevel > 75) return 'High stress detected. Consider a breather.'
    if (correctAnswers > 10) return 'You\'re building momentum! Keep going!'
    if (totalReclaimed > 5) return 'Progress is excellent. Stay focused.'
    return 'Ready to grow. Choose your next territory.'
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/20 ${
        isWelcomeKitActive ? 'animate-pulse' : ''
      }`}
    >
      <div className="flex items-center justify-between px-6 py-3 text-white">
        {/* Growth Compass */}
        <div className="flex items-center space-x-4">
          <div className="text-xs font-bold text-purple-400">
            GROWTH COMPASS
          </div>
          <div className="text-xs text-gray-300">
            {getGrowthCompass()}
          </div>
        </div>

        {/* Current Streak */}
        <div className="flex items-center space-x-4">
          <div className="text-xs font-bold text-green-400">
            CURRENT STREAK
          </div>
          <div className="text-xs text-gray-300">
            {currentStreak} days
          </div>
        </div>

        {/* Total Reclaimed */}
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-yellow-400">
            TOTAL RECLAIMED
          </span>
          <div className="text-xs text-gray-300">
            {totalReclaimed} strongholds
          </div>
        </div>

        {/* Total Reps */}
        <div className="flex items-center space-x-4">
          <span className="text-xs font-bold text-green-400">
            TOTAL REPS
          </span>
          <div className="text-xs text-gray-300">
            {totalReps} completed
          </div>
        </div>

        {/* GED Readiness Meter */}
        <div className="flex items-center space-x-4">
          <div className="text-xs font-bold text-red-400">
            OVERCOMER READINESS
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-red-400"
                initial={{ width: 0 }}
                animate={{ width: `${gedReadiness}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <div className="text-xs text-gray-300 font-mono">
              {gedReadiness}%
            </div>
          </div>
        </div>

        {/* Intel Button */}
        <button
          onClick={onShowIntel}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition transform hover:scale-105 active:scale-95 flex items-center space-x-1"
        >
          <span className="text-sm">🛠️</span>
          <span>INTEL</span>
        </button>

        {/* User Name */}
        <div className="text-xs text-gray-500">
          {userName || 'Warrior'}
        </div>
      </div>
    </motion.div>
  )
}

export default StatusBar
