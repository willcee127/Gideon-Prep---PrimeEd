import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getOnboardingStatus, updateOnboardingStatus } from '../services/syncService'

const DashboardPulse = ({ callSign }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [onboardingStatus, setOnboardingStatus] = useState({})

  useEffect(() => {
    if (!callSign) return

    const checkOnboardingStatus = async () => {
      const { data, error } = await getOnboardingStatus(callSign)
      
      if (!error && data) {
        setOnboardingStatus(data)
        
        // Show dashboard pulse if not seen yet
        if (!data.dashboard_seen) {
          setIsVisible(true)
          
          // Auto-hide after 8 seconds
          setTimeout(() => {
            setIsVisible(false)
          }, 8000)
        }
      }
    }

    checkOnboardingStatus()
  }, [callSign])

  const handleDismiss = async () => {
    setIsVisible(false)
    
    // Mark dashboard as seen
    if (callSign) {
      await updateOnboardingStatus(callSign, 'dashboard_seen')
    }
  }

  if (!isVisible) return null

  return (
    <>
      {/* CSS for dashboard pulse styling */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: scale(1.05);
            opacity: 1;
          }
        }

        @keyframes radio-wave {
          0% { 
            box-shadow: 0 0 0 0 rgba(230, 230, 250, 0.7),
                        0 0 0 10px rgba(230, 230, 250, 0.5),
                        0 0 0 20px rgba(230, 230, 250, 0.3);
          }
          100% { 
            box-shadow: 0 0 0 10px rgba(230, 230, 250, 0.5),
                        0 0 0 20px rgba(230, 230, 250, 0.3),
                        0 0 0 30px rgba(230, 230, 250, 0.1);
          }
        }

        .radio-pulse {
          animation: pulse 2s infinite, radio-wave 2s infinite;
        }

        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }

        .glow-lavender {
          text-shadow: 0 0 20px rgba(230, 230, 250, 0.5);
        }

        .dashboard-pulse {
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(12px);
          border: 2px solid rgba(230, 230, 250, 0.3);
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 dashboard-pulse rounded-2xl p-6 max-w-md w-full mx-4"
            style={{
              boxShadow: '0 0 50px rgba(230, 230, 250, 0.3), inset 0 0 30px rgba(230, 230, 250, 0.1)'
            }}
          >
            <div className="text-center space-y-4">
              {/* Radio Icon with Pulse */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-lavender-500/20 rounded-full flex items-center justify-center radio-pulse">
                    <span className="text-3xl">📻</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                </div>
              </div>

              {/* Message Header */}
              <div>
                <h3 className="text-lavender-400 text-lg font-bold warrior-text glow-lavender mb-2">
                  RADIO MESSAGE // COMMANDER
                </h3>
                <div className="text-gray-400 text-xs warrior-text uppercase tracking-widest">
                  BASE OF OPERATIONS BRIEFING
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-black/50 rounded-lg p-4 border border-lavender-500/20">
                <p className="text-white text-sm warrior-text leading-relaxed">
                  Warrior, this is your Base of Operations. Select a Sector below to begin your first Recovery Mission.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleDismiss}
                  className="flex-1 py-3 bg-lavender-600 hover:bg-lavender-700 text-white rounded-lg font-bold transition-all transform hover:scale-105 warrior-text"
                >
                  ROGER THAT
                </button>
              </div>

              {/* Auto-dismiss Timer */}
              <div className="text-gray-500 text-xs warrior-text">
                Auto-dismiss in 8 seconds...
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DashboardPulse
