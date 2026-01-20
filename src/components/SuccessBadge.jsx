import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const SuccessBadge = ({ userName, isVisible, onClose, isFirstNode }) => {
  const [showBadge, setShowBadge] = useState(false)
  const [profileId, setProfileId] = useState(null)

  useEffect(() => {
    if (isVisible && isFirstNode) {
      setShowBadge(true)
      setProfileId(localStorage.getItem('gideon_user_id'))
      
      // Save badge achievement to profiles table
      saveBadgeAchievement()
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowBadge(false)
        if (onClose) onClose()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, isFirstNode, onClose])

  const saveBadgeAchievement = async () => {
    try {
      const profileId = localStorage.getItem('gideon_user_id')
      const callSign = localStorage.getItem('gideon_call_sign')
      const aiSupportLevel = parseInt(localStorage.getItem('gideon_ai_support_level') || '3')
      
      if (!profileId) return

      // Get brand-accurate color based on current level
      const getBadgeColor = (level) => {
        if (level >= 5) return 'from-purple-400 to-purple-600 border-purple-300' // Lavender (Verve)
        if (level >= 3) return 'from-blue-400 to-blue-600 border-blue-300' // Electric Blue (Aura)
        return 'from-orange-400 to-orange-600 border-orange-300' // Forge Orange (Forge)
      }

      // Save achievement to profiles achievements JSON column
      const achievementData = {
        type: 'first_success_badge',
        earned_at: new Date().toISOString(),
        ai_support_level: aiSupportLevel,
        call_sign: callSign
      }

      await supabase
        .from('profiles')
        .update({
          achievements: achievementData
        })
        .eq('id', profileId)

      console.log('Badge achievement saved:', achievementData)
    } catch (error) {
      console.error('Failed to save badge achievement:', error)
    }
  }

  if (!showBadge || !isFirstNode) return null

  const aiSupportLevel = parseInt(localStorage.getItem('gideon_ai_support_level') || '3')
  const badgeColorClass = aiSupportLevel >= 5 ? 'from-purple-400 to-purple-600 border-purple-300' :
                         aiSupportLevel >= 3 ? 'from-blue-400 to-blue-600 border-blue-300' :
                         'from-orange-400 to-orange-600 border-orange-300'

  return (
    <AnimatePresence>
      {showBadge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.6
            }}
            className={`bg-gradient-to-r ${badgeColorClass} border-2 rounded-2xl p-6 shadow-2xl min-w-[300px]`}
          >
            <div className="text-center space-y-4">
              {/* Badge Icon */}
              <motion.div
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-6xl"
              >
                🏆
              </motion.div>
              
              {/* Badge Title */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-white">
                  First Victory!
                </h3>
              </motion.div>
              
              {/* Badge Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
              >
                <p className="text-white/90 text-sm">
                  Welcome to your journey, {userName || 'Warrior'}!
                </p>
                <p className="text-white/80 text-xs mt-2">
                  Level {aiSupportLevel} • {aiSupportLevel >= 5 ? 'Verve' : aiSupportLevel >= 3 ? 'Aura' : 'Forge'}
                </p>
              </motion.div>
              
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => {
                  setShowBadge(false)
                  if (onClose) onClose()
                }}
                className="bg-white/30 hover:bg-white/50 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
              >
                Continue Mission
              </motion.button>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${10 + Math.random() * 80}%`
                  }}
                />
              ))}
            </div>
            
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={() => {
                setShowBadge(false)
                if (onClose) onClose()
              }}
              className="bg-black/30 hover:bg-black/50 text-black px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Continue Journey
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SuccessBadge
