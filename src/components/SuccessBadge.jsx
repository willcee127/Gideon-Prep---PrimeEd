import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SuccessBadge = ({ userName, isVisible, onClose, isFirstNode }) => {
  const [showBadge, setShowBadge] = useState(false)

  useEffect(() => {
    if (isVisible && isFirstNode) {
      setShowBadge(true)
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowBadge(false)
        if (onClose) onClose()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, isFirstNode, onClose])

  if (!showBadge || !isFirstNode) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 50 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 border-2 border-yellow-400 rounded-2xl p-6 shadow-2xl min-w-[300px]">
          <div className="text-center space-y-4">
            {/* Badge Icon */}
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
              className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-4xl">🏆</span>
            </motion.div>
            
            {/* Badge Title */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-black mb-1">
                FIRST TERRITORY
              </h2>
              <h3 className="text-xl font-bold text-black">
                RECLAIMED
              </h3>
            </motion.div>
            
            {/* Badge Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-black/20 rounded-lg p-3"
            >
              <p className="text-black font-semibold text-sm">
                You are officially a <span className="text-yellow-800">Gideon Warrior</span>
              </p>
              <p className="text-black text-xs mt-1">
                {userName || 'Warrior'}, your journey has begun!
              </p>
            </motion.div>
            
            {/* Sparkle Effects */}
            <div className="absolute inset-0 pointer-events-none">
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
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default SuccessBadge
