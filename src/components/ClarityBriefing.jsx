import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ClarityBriefing = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(false)

  // Check if user has seen briefing
  useEffect(() => {
    const hasSeenBriefing = localStorage.getItem('gideon_clarity_briefing_seen')
    if (!hasSeenBriefing) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    localStorage.setItem('gideon_clarity_briefing_seen', 'true')
    setIsVisible(false)
    if (onComplete) {
      onComplete()
    }
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-blue-500 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              {/* Icon */}
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎖️</span>
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold text-white">
                WELCOME, OVERCOMER
              </h2>
              
              {/* Mission Briefing */}
              <div className="bg-black/30 rounded-xl p-6 border border-blue-400/30 space-y-4">
                <div className="space-y-3">
                  {/* Goal */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">🎯</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-green-400 font-semibold text-sm">YOUR GOAL</h3>
                      <p className="text-white text-sm">Get 5 Reps to complete each mission</p>
                    </div>
                  </div>

                  {/* Weapon */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">⚡</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-blue-400 font-semibold text-sm">YOUR WEAPON</h3>
                      <p className="text-white text-sm">The Command Calc - Your tactical advantage</p>
                    </div>
                  </div>

                  {/* Support */}
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">🧠</span>
                    </div>
                    <div className="text-left">
                      <h3 className="text-yellow-400 font-semibold text-sm">YOUR SUPPORT</h3>
                      <p className="text-white text-sm">Mission Coach is here when you get stuck</p>
                    </div>
                  </div>
                </div>

                {/* Final Message */}
                <div className="text-center pt-2">
                  <p className="text-blue-300 text-sm font-medium">
                    Let's win.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={handleDismiss}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  DEPLOY TO BATTLEFIELD
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ClarityBriefing
