import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

// Dynamic Stage Icons
const StageIcon = ({ level, isPulsing = false }) => {
  const getIconColor = (level) => {
    if (level >= 5) return 'var(--verve-lavender)' // Lavender for Verve
    if (level >= 3) return 'var(--aura-electric-blue)' // Electric Blue for Aura
    return 'var(--forge-orange)' // Forge Orange for Forge
  }

  const getStageName = (level) => {
    if (level >= 5) return 'VERVE'
    if (level >= 3) return 'AURA'
    return 'FORGE'
  }

  const color = getIconColor(level)
  const stageName = getStageName(level)

  const renderIcon = () => {
    switch (stageName) {
      case 'VERVE':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2L4 7V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V7L12 2Z" 
              stroke="var(--verve-lavender)" 
              strokeWidth="2" 
              fill="none"
            />
            <path 
              d="M12 8L14 10L12 12L10 10L12 8Z" 
              fill="var(--verve-lavender)"
            />
          </svg>
        )
      case 'AURA':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M13 2L3 14H12L11 22L21 10H12L13 2Z" 
              stroke="var(--aura-electric-blue)" 
              strokeWidth="2" 
              fill="none"
            />
            <circle cx="12" cy="12" r="2" fill="var(--aura-electric-blue)" />
          </svg>
        )
      case 'FORGE':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M3 3L7 7L3 11L7 15L3 19L7 23L11 19L15 23L19 19L23 23L19 19L23 15L19 11L23 7L19 3L15 7L11 3L7 7L3 3Z" 
              stroke="var(--forge-orange)" 
              strokeWidth="2" 
              fill="none"
            />
            <rect x="10" y="10" width="4" height="4" fill="var(--forge-orange)" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      animate={isPulsing ? {
        scale: [1, 1.2, 1],
        opacity: [1, 0.7, 1],
      } : {}}
      transition={{
        duration: 0.6,
        repeat: isPulsing ? 2 : 0,
        ease: "easeInOut"
      }}
      className="stage-icon"
    >
      {renderIcon()}
    </motion.div>
  )
}

const StatusReport = ({ 
  callSign, 
  fullName, 
  aiSupportLevel, 
  streak 
}) => {
  const navigate = useNavigate()
  const [showMissionLogs, setShowMissionLogs] = useState(false)
  const [missionHistory, setMissionHistory] = useState([])
  const [isProfileVerified, setIsProfileVerified] = useState(false)
  const [previousStreak, setPreviousStreak] = useState(streak)
  const [isLevelUpPulsing, setIsLevelUpPulsing] = useState(false)

  // Get stage name based on AI support level
  const getStageName = (level) => {
    if (level >= 5) return 'VERVE'
    if (level >= 3) return 'AURA'
    return 'FORGE'
  }

  // Get level description based on AI support level
  const getLevelDescription = (level) => {
    switch(level) {
      case 5: return 'HEAVY SUPPORT'
      case 4: return 'STABILIZING'
      case 3: return 'BALANCED'
      case 2: return 'ADVANCING'
      case 1: return 'INDEPENDENT'
      default: return 'BALANCED'
    }
  }

  // Get level color based on AI support level
  const getLevelColor = (level) => {
    switch(level) {
      case 5: return 'text-purple-400'
      case 4: return 'text-purple-300'
      case 3: return 'text-emerald-400'
      case 2: return 'text-cyan-400'
      case 1: return 'text-cyan-300'
      default: return 'text-emerald-400'
    }
  }

  // Generate streak visual
  const getStreakVisual = (currentStreak, maxStreak) => {
    const streakArray = []
    for (let i = 0; i < maxStreak; i++) {
      if (i < currentStreak) {
        streakArray.push('🔥')
      } else {
        streakArray.push('⚫')
      }
    }
    return streakArray
  }

  // Fetch mission history with optimized query
  const fetchMissionHistory = async () => {
    setIsLoadingMissions(true)
    
    // Show Lavender pulse loading state
    const loadingIndicator = document.createElement('div')
    loadingIndicator.className = 'fixed top-4 right-4 z-50'
    loadingIndicator.innerHTML = '<div class="w-3 h-3 rounded-full lavender-pulse"></div>'
    document.body.appendChild(loadingIndicator)
    
    try {
      const profileId = localStorage.getItem('gideon_user_id')
      if (!profileId) {
        console.warn('No profile ID found for mission history')
        setMissionHistory([])
        return
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(profileId)) {
        console.error('Invalid profile ID format:', profileId)
        setMissionHistory([])
        return
      }

      console.log('Fetching mission history for profile:', profileId)

      // Optimized query - select only required fields using profile_id
      const { data, error } = await supabase
        .from('student_mission_history')
        .select('id, mission_type, sector_name, accuracy, completion_time, status, completed_at')
        .eq('profile_id', profileId) // Use profile_id instead of call_sign
        .order('completed_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('Mission history query error:', error)
        setMissionHistory([])
        return
      }

      setMissionHistory(data || [])
      console.log(`Loaded ${data?.length || 0} mission records`)
    } catch (error) {
      console.error('Failed to fetch mission history:', error)
      setMissionHistory([])
    } finally {
      setIsLoadingMissions(false)
      // Remove loading indicator
      if (loadingIndicator.parentNode) {
        loadingIndicator.parentNode.removeChild(loadingIndicator)
      }
    }
  }

  // Verify profile UUID on component mount
  useEffect(() => {
    const verifyProfile = () => {
      const profileId = localStorage.getItem('gideon_user_id')
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      
      if (profileId && uuidRegex.test(profileId)) {
        setIsProfileVerified(true)
      } else {
        setIsProfileVerified(false)
        console.warn('Profile verification failed:', profileId)
      }
    }

    verifyProfile()
  }, [])

  // Open mission logs
  const handleMissionLogsClick = () => {
    setShowMissionLogs(true)
    fetchMissionHistory()
  }

  // Open Aura Status
  const handleAuraStatusClick = () => {
    navigate('/aura')
  }

  // Detect streak changes for animations
  useEffect(() => {
    if (streak !== previousStreak) {
      setPreviousStreak(streak)
      
      // Check for level-up trigger (5 correct in a row)
      if (streak >= 5 && previousStreak < 5) {
        setIsLevelUpPulsing(true)
        setTimeout(() => setIsLevelUpPulsing(false), 1200) // Pulse duration
      }
    }
  }, [streak, previousStreak])

  const streakVisual = getStreakVisual(streak, maxStreak)
  const stageName = getStageName(aiSupportLevel)
  const levelDescription = getLevelDescription(aiSupportLevel)
  const levelColor = getLevelColor(aiSupportLevel)
  const streakPercentage = (streak / maxStreak) * 100
  const isStreakReset = streak < previousStreak
  const isStreakMaxed = streak === maxStreak

  return (
    <>
      {/* Profile Verification Loading State */}
      {!isProfileVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="w-3 h-3 rounded-full bg-purple-200 animate-pulse shadow-[0_0_10px_rgba(230, 230, 250, 0.8)]" />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-4 right-4 z-50 pointer-events-none"
      >
        {/* Glass-morphism status panel */}
        <div className="aura-hud-panel rounded-2xl p-6 min-w-[320px] backdrop-blur-xl border-2 shadow-2xl pointer-events-auto">
          
          {/* Identity Badge */}
          <div className="mb-4 pb-4 border-b border-white/20">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <div>
                <p className="text-xs text-gray-400 font-mono uppercase tracking-widest operator-label">OPERATOR</p>
                <p className="text-lg font-bold text-white font-mono">
                  {callSign || 'WARRIOR'}
                </p>
                {fullName && (
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    {fullName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Level Status */}
          <div className="mb-4 pb-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest hud-label">STATUS</p>
              <div className="flex items-center space-x-2">
                <StageIcon level={aiSupportLevel} isPulsing={isLevelUpPulsing} />
                <span className={`text-sm font-bold font-mono ${levelColor} level-label`}>
                  LVL {aiSupportLevel}
                </span>
                <span className="text-xs text-gray-400 font-mono stage-label">
                  {stageName}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 font-mono">
              {levelDescription}
            </p>
          </div>

          {/* Progress Power Bar */}
          <div className="mb-4 pb-4 border-b border-white/20">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400 font-mono uppercase tracking-widest power-label">POWER</p>
              <p className="text-sm font-mono text-white">
                {streak}/{maxStreak}
              </p>
            </div>
            
            {/* Power Bar with dynamic styling */}
            <div className="relative w-full bg-black/50 rounded-full h-3 overflow-hidden">
              <motion.div
                key={`power-bar-${streak}`}
                initial={{ 
                  width: isStreakReset ? `${(previousStreak / maxStreak) * 100}%` : '0%',
                  opacity: isStreakReset ? 1 : 0
                }}
                animate={{ 
                  width: `${streakPercentage}%`,
                  opacity: 1
                }}
                transition={{ 
                  duration: isStreakReset ? 0.3 : 0.5,
                  ease: isStreakReset ? 'easeIn' : 'easeOut'
                }}
                className="h-full rounded-full relative overflow-hidden"
                style={{ backgroundColor: 'var(--aura-primary)' }}
              >
                {/* Flash effect when maxed */}
                {isStreakMaxed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.6, repeat: 2 }}
                    className="absolute inset-0 bg-white"
                  />
                )}
                
                {/* Shatter effect when reset */}
                {isStreakReset && (
                  <motion.div
                    initial={{ x: 0, opacity: 1 }}
                    animate={{ x: '100%', opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeIn' }}
                    className="absolute inset-0 bg-red-500"
                  />
                )}
              </motion.div>
            </div>
            
            {/* Visual Streak Indicators */}
            <div className="flex items-center space-x-1 mt-2">
              {streakVisual.map((symbol, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="text-sm"
                >
                  {symbol}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Mission History Button */}
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMissionLogsClick}
              className="w-full py-2 px-4 aura-hud-button rounded-lg text-xs font-mono uppercase tracking-widest flex items-center justify-center space-x-2"
            >
              <span>📋</span>
              <span>Mission Logs</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAuraStatusClick}
              className="w-full py-2 px-4 aura-hud-button rounded-lg text-xs font-mono uppercase tracking-widest flex items-center justify-center space-x-2"
            >
              <span>⚡</span>
              <span>Aura Status</span>
            </motion.button>
          </div>

          {/* Status Pulse Effect */}
          <div className="absolute -top-1 -right-1">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.8, 0.3, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-4 h-4 rounded-full aura-bg-primary"
            />
          </div>
        </div>

        {/* Floating Status Badge */}
        <motion.div
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-2 -right-2"
        >
          <div className="w-8 h-8 rounded-full aura-bg-primary flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-bold">
              {aiSupportLevel}
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Mission Logs Slide-over Panel */}
      <AnimatePresence>
        {showMissionLogs && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setShowMissionLogs(false)}
          >
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-black/95 backdrop-blur-xl border-l border-white/20 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <h2 className="text-xl font-bold text-white font-mono">Mission Logs</h2>
                <button
                  onClick={() => setShowMissionLogs(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 hover:text-white transition-all"
                >
                  ✕
                </button>
              </div>

              {/* Mission History Content */}
              <div className="p-6 overflow-y-auto h-full">
                {isLoadingMissions ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                  </div>
                ) : missionHistory.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <p className="text-sm font-mono">No missions completed yet</p>
                    <p className="text-xs mt-2">Complete training missions to see your history</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {missionHistory.map((mission, index) => (
                      <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="aura-hud-panel rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-bold text-white font-mono">
                            {mission.mission_type}
                          </h3>
                          <span className="text-xs text-gray-400 font-mono">
                            {new Date(mission.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Sector:</span>
                            <span className="text-white font-mono">{mission.sector_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Accuracy:</span>
                            <span className="text-white font-mono">{mission.accuracy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Time:</span>
                            <span className="text-white font-mono">{mission.completion_time}s</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={`font-mono ${
                              mission.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              {mission.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default StatusReport
