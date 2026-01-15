import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FieldPromotionModal = ({ isOpen, onClose, studentStats, onPromotion }) => {
  const [isVisible, setIsVisible] = useState(false)

  // Auto-show when promotion occurs
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const getRankInfo = (rank) => {
    const ranks = {
      RECRUIT: {
        title: 'RECRUIT',
        color: 'from-gray-600 to-gray-700',
        borderColor: 'border-gray-400',
        icon: '🎖️',
        description: 'New warrior ready for tactical training'
      },
      TACTICAL_SPECIALIST: {
        title: 'TACTICAL SPECIALIST',
        color: 'from-blue-600 to-blue-700',
        borderColor: 'border-blue-400',
        icon: '🎯',
        description: 'Advanced tactical operations and strategic thinking'
      },
      TACTICAL_EXPERT: {
        title: 'TACTICAL EXPERT',
        color: 'from-purple-600 to-purple-700',
        borderColor: 'border-purple-400',
        icon: '⚡',
        description: 'Elite tactical mastery and battlefield command'
      },
      FIELD_COMMANDER: {
        title: 'FIELD COMMANDER',
        color: 'from-green-600 to-green-700',
        borderColor: 'border-green-400',
        icon: '🏆',
        description: 'Sector patrol leadership and tactical supremacy'
      }
    }
    
    return ranks[rank] || ranks.RECRUIT
  }

  const getPromotionMessage = (rank) => {
    const messages = {
      RECRUIT: `🎖️ FIELD PROMOTION! Welcome to the ranks, warrior. Your tactical growth has earned you the RECRUIT rank. Continue your training with honor and precision.`,
      TACTICAL_SPECIALIST: `🎯 TACTICAL PROMOTION! Outstanding tactical awareness, warrior. You've been promoted to TACTICAL SPECIALIST. Your strategic thinking is battlefield-ready.`,
      TACTICAL_EXPERT: `⚡ ELITE PROMOTION! Exceptional tactical mastery, warrior. You've achieved TACTICAL EXPERT status. Your command of the battlefield is absolute.`,
      FIELD_COMMANDER: `🏆 FIELD COMMANDER! Supreme tactical leadership, warrior. You've been promoted to FIELD COMMANDER. Your sector patrol leadership is unmatched.`
    }
    
    return messages[rank] || messages.RECRUIT
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center space-y-6">
              {/* Rank Icon */}
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1.2, 1],
                    rotate: [0, 360, -360, 360],
                    opacity: [0, 0.5, 1, 0.5, 1]
                  }}
                  className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center"
                >
                  <span className="text-3xl font-bold text-yellow-300">
                    {getRankInfo(onPromotion.rank).icon}
                  </span>
                </motion.div>
              </div>
              
              {/* Rank Title */}
              <h2 className={`text-2xl font-bold mb-2 ${getRankInfo(onPromotion.rank).color}`}>
                {getRankInfo(onPromotion.rank).title}
              </h2>
              
              {/* Rank Description */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {getRankInfo(onPromotion.rank).description}
              </p>
              
              {/* Promotion Message */}
              <div className="bg-black/30 rounded-xl p-6 border border-gray-600/30 mt-6">
                <div className="text-center space-y-4">
                  <p className="text-yellow-300 text-lg font-semibold mb-2">
                    🎖️ FIELD PROMOTION
                  </p>
                  <p className="text-white text-lg font-medium">
                    {getPromotionMessage(onPromotion.rank)}
                  </p>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    setIsVisible(false)
                    onClose()
                    onPromotion()
                  }}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  ACCEPT PROMOTION
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FieldPromotionModal
