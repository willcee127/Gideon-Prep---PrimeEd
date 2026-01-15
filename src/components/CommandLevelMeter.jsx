import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CommandLevelMeter = ({ currentLevel = 0, maxLevel = 100 }) => {
  const [displayLevel, setDisplayLevel] = useState(currentLevel)
  const [isAnimating, setIsAnimating] = useState(false)

  // Update display level with animation
  useEffect(() => {
    if (currentLevel !== displayLevel) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setDisplayLevel(currentLevel)
        setIsAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentLevel, displayLevel])

  const percentage = Math.min((displayLevel / maxLevel) * 100, 100)
  const isNearMax = percentage >= 80
  const isMidLevel = percentage >= 50 && percentage < 80

  return (
    <div className="bg-slate-900 border-2 border-blue-500 rounded-lg p-4 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">⚡</span>
          </div>
          <h3 className="text-white font-bold text-lg">COMMAND LEVEL</h3>
        </div>
        <div className="text-white font-bold">
          {displayLevel}/{maxLevel}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        {/* Background */}
        <div className="w-full h-6 bg-slate-800 rounded-full overflow-hidden">
          {/* Gold Progress */}
          <motion.div
            initial={{ width: `${(displayLevel - 5) / maxLevel * 100}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`h-full rounded-full transition-all duration-300 ${
              isNearMax 
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/50' 
                : isMidLevel 
                  ? 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg shadow-blue-500/50'
                  : 'bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-500/50'
            }`}
          >
            {/* Animated shine effect */}
            {isAnimating && (
              <motion.div
                initial={{ x: -100 }}
                animate={{ x: 100 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
            )}
          </motion.div>
        </div>

        {/* Level Markers */}
        <div className="absolute inset-0 flex items-center justify-between px-2">
          <span className="text-white/60 text-xs font-medium">0</span>
          <span className="text-white/60 text-xs font-medium">25</span>
          <span className="text-white/60 text-xs font-medium">50</span>
          <span className="text-white/60 text-xs font-medium">75</span>
          <span className="text-white/60 text-xs font-medium">100</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-3 flex items-center justify-center">
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          isNearMax 
            ? 'bg-yellow-500 text-black' 
            : isMidLevel 
              ? 'bg-blue-500 text-white'
              : 'bg-green-500 text-white'
        }`}>
          {isNearMax 
            ? '⚡ ELITE COMMAND' 
            : isMidLevel 
              ? '🎯 TACTICAL READY' 
              : '🚀 BUILDING COMMAND'
          }
        </div>
      </div>

      {/* Tooltip */}
      <div className="mt-2 text-center">
        <p className="text-white/60 text-xs">
          Use [bracketed] buttons to increase Command Level
        </p>
        <p className="text-white/80 text-xs font-medium mt-1">
          Master your tools to unlock Elite Command.
        </p>
      </div>
    </div>
  )
}

export default CommandLevelMeter
