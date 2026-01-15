import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getOnboardingStatus, updateOnboardingStatus } from '../services/syncService'

const DebriefGuidance = ({ callSign, isFirstMission }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [onboardingStatus, setOnboardingStatus] = useState({})

  useEffect(() => {
    if (!callSign || !isFirstMission) return

    const checkOnboardingStatus = async () => {
      const { data, error } = await getOnboardingStatus(callSign)
      
      if (!error && data) {
        setOnboardingStatus(data)
        
        // Show debrief guidance if not seen yet and this is first mission
        if (!data.debrief_seen && isFirstMission) {
          setIsVisible(true)
          
          // Auto-hide after 6 seconds
          setTimeout(() => {
            setIsVisible(false)
          }, 6000)
        }
      }
    }

    checkOnboardingStatus()
  }, [callSign, isFirstMission])

  const handleDismiss = async () => {
    setIsVisible(false)
    
    // Mark debrief as seen
    if (callSign) {
      await updateOnboardingStatus(callSign, 'debrief_seen')
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* CSS for debrief guidance styling */}
      <style jsx>{`
        @keyframes gold-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
          }
        }

        @keyframes highlight-pulse {
          0%, 100% { 
            border-color: rgba(255, 215, 0, 0.5);
            background-color: rgba(255, 215, 0, 0.05);
          }
          50% { 
            border-color: rgba(255, 215, 0, 0.8);
            background-color: rgba(255, 215, 0, 0.1);
          }
        }

        .gold-border {
          border: 2px solid #FFD700;
          animation: gold-glow 2s infinite, highlight-pulse 2s infinite;
        }

        .glow-gold {
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }

        .guidance-tip {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-50 guidance-tip rounded-2xl p-6 max-w-md w-full mx-4"
            style={{
              boxShadow: '0 0 50px rgba(255, 215, 0, 0.3), inset 0 0 30px rgba(255, 215, 0, 0.1)'
            }}
          >
            <div className="text-center space-y-4">
              {/* Intel Icon */}
              <div className="flex justify-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
              </div>

              {/* Message Header */}
              <div>
                <h3 className="text-yellow-400 text-lg font-bold warrior-text glow-gold mb-2">
                  INTEL IS VITAL
                </h3>
                <div className="text-gray-400 text-xs warrior-text uppercase tracking-widest">
                  FIRST MISSION DEBRIEF
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-black/50 rounded-lg p-4 border border-yellow-500/20">
                <p className="text-white text-sm warrior-text leading-relaxed">
                  Tell the Commander where the friction was. Your feedback helps improve the Recovery Engine for all Warriors.
                </p>
              </div>

              {/* Highlight Arrow */}
              <div className="flex justify-center">
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-yellow-400 text-2xl"
                >
                  ↓
                </motion.div>
              </div>

              {/* Action Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 text-black rounded-lg font-bold transition-all transform hover:scale-105 warrior-text"
                >
                  UNDERSTOOD
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DebriefGuidance
