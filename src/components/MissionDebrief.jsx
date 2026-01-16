import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Flame, Target, Award, ArrowLeft, Shield, Zap } from 'lucide-react'
import { supabase } from '../supabase'

const MissionDebrief = ({ 
  sessionData, 
  onReturnToCommand, 
  userName 
}) => {
  const [achievements, setAchievements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [typewriterText, setTypewriterText] = useState('')
  const [currentCharIndex, setCurrentCharIndex] = useState(0)

  // Fetch user achievements for current session
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('warrior_achievements')
          .select('*')
          .eq('user_id', userName)
          .eq('session_id', sessionData?.sessionId || 'current')
          .order('earned_at', { ascending: false })

        if (error) {
          console.error('Error fetching achievements:', error)
        } else {
          setAchievements(data || [])
        }
      } catch (err) {
        console.error('Failed to fetch achievements:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (userName && sessionData) {
      fetchAchievements()
    }
  }, [userName, sessionData])

  // Typewriter effect for mission stats
  useEffect(() => {
    const missionText = `Sector: ${sessionData?.conceptId || 'UNKNOWN'}\nFriction Level: ${sessionData?.failureCount || 0}\nStatus: ${sessionData?.status || 'CONQUERED'}`
    
    if (currentCharIndex < missionText.length) {
      const timeout = setTimeout(() => {
        setTypewriterText(prev => prev + missionText[currentCharIndex])
        setCurrentCharIndex(prev => prev + 1)
      }, 50)
      
      return () => clearTimeout(timeout)
    }
  }, [currentCharIndex, sessionData])

  const getAchievementIcon = (achievementType) => {
    switch (achievementType) {
      case 'IRON_WILL':
        return <Flame className="w-8 h-8 text-orange-400" />
      case 'PERFECT_RUN':
        return <Target className="w-8 h-8 text-green-400" />
      case 'SPEED_DEMON':
        return <Zap className="w-8 h-8 text-yellow-400" />
      case 'TACTICAL_MASTER':
        return <Shield className="w-8 h-8 text-blue-400" />
      default:
        return <Trophy className="w-8 h-8 text-purple-400" />
    }
  }

  const getAchievementColor = (achievementType) => {
    switch (achievementType) {
      case 'IRON_WILL':
        return 'border-orange-400 shadow-orange-400/50'
      case 'PERFECT_RUN':
        return 'border-green-400 shadow-green-400/50'
      case 'SPEED_DEMON':
        return 'border-yellow-400 shadow-yellow-400/50'
      case 'TACTICAL_MASTER':
        return 'border-blue-400 shadow-blue-400/50'
      default:
        return 'border-purple-400 shadow-purple-400/50'
    }
  }

  const handleReturnToCommand = async () => {
    // Save achievements to permanent profile
    try {
      await supabase
        .from('warrior_achievements')
        .update({ 
          is_permanent: true,
          saved_at: new Date().toISOString()
        })
        .eq('user_id', userName)
        .eq('session_id', sessionData?.sessionId || 'current')
    } catch (error) {
      console.error('Failed to save achievements:', error)
    }

    // Reset local session state and return to command
    onReturnToCommand()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
      >
        {/* Full-screen tactical overlay */}
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
        
        {/* Main debrief container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 400 
          }}
          className="relative w-full max-w-4xl mx-auto"
        >
          {/* Pulsing Forge Orange border */}
          <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-lg animate-pulse" />
          
          <div className="relative bg-slate-900/95 backdrop-blur-xl border-4 border-orange-500 rounded-lg shadow-2xl shadow-orange-500/50 p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center space-x-3 mb-4"
              >
                <Trophy className="w-8 h-8 text-orange-400" />
                <h1 className="text-3xl font-bold text-orange-400 font-mono tracking-wider">
                  MISSION DEBRIEF
                </h1>
                <Trophy className="w-8 h-8 text-orange-400" />
              </motion.div>
              
              <div className="text-sm text-gray-400 font-mono">
                WARRIOR: {userName?.toUpperCase() || 'UNKNOWN'}
              </div>
            </div>

            {/* Mission Stats with Typewriter Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="bg-black/50 rounded-lg p-6 border border-orange-500/30">
                <h2 className="text-lg font-bold text-orange-400 mb-4 font-mono flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>MISSION STATISTICS</span>
                </h2>
                
                <div className="font-mono text-green-400 whitespace-pre-line leading-relaxed">
                  {typewriterText}
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            </motion.div>

            {/* Medal Rack Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h2 className="text-lg font-bold text-orange-400 mb-4 font-mono flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>MEDAL RACK</span>
              </h2>
              
              {isLoading ? (
                <div className="text-center text-gray-400 font-mono">
                  LOADING ACHIEVEMENTS...
                </div>
              ) : achievements.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.8 + (index * 0.1),
                        type: 'spring',
                        damping: 20,
                        stiffness: 400
                      }}
                      className={`
                        relative bg-black/50 rounded-lg p-4 border-2
                        ${getAchievementColor(achievement.achievement_type)}
                        ${achievement.achievement_type === 'IRON_WILL' ? 'animate-pulse' : ''}
                      `}
                    >
                      {/* Hexagonal background for IRON_WILL */}
                      {achievement.achievement_type === 'IRON_WILL' && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <div className="w-16 h-16 bg-orange-500 transform rotate-45" />
                        </div>
                      )}
                      
                      <div className="relative flex flex-col items-center space-y-2">
                        {getAchievementIcon(achievement.achievement_type)}
                        <div className="text-xs text-orange-400 font-bold font-mono text-center">
                          {achievement.achievement_type.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-400 font-mono text-center">
                          {new Date(achievement.earned_at).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 font-mono bg-black/50 rounded-lg p-6 border border-gray-600/30">
                  NO ACHIEVEMENTS EARNED THIS SESSION
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              className="flex justify-center"
            >
              <button
                onClick={handleReturnToCommand}
                className="flex items-center space-x-3 px-8 py-3 bg-orange-500 hover:bg-orange-400 text-black rounded-lg font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-orange-500/50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-mono">RETURN TO COMMAND</span>
              </button>
            </motion.div>

            {/* Tactical Metadata */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-6 pt-4 border-t border-orange-500/30"
            >
              <div className="flex items-center justify-between text-xs text-orange-500/70 font-mono">
                <span>SESSION: {sessionData?.sessionId || 'UNKNOWN'}</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default MissionDebrief
