import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getOnboardingStatus, updateOnboardingStatus } from '../services/syncService'

const CoPilotHandshake = ({ callSign, onCoPilotTriggered }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [onboardingStatus, setOnboardingStatus] = useState({})

  useEffect(() => {
    if (!callSign) return

    const checkOnboardingStatus = async () => {
      const { data, error } = await getOnboardingStatus(callSign)
      
      if (!error && data) {
        setOnboardingStatus(data)
      }
    }

    checkOnboardingStatus()
  }, [callSign])

  useEffect(() => {
    if (!onCoPilotTriggered || !callSign) return

    const handleFirstCoPilotUse = async () => {
      const { data, error } = await getOnboardingStatus(callSign)
      
      if (!error && data && !data.copilot_seen) {
        // Show handshake message
        setIsVisible(true)
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setIsVisible(false)
        }, 3000)
        
        // Mark copilot as seen
        await updateOnboardingStatus(callSign, 'copilot_seen')
      }
    }

    handleFirstCoPilotUse()
  }, [onCoPilotTriggered, callSign])

  if (!isVisible) return null

  return (
    <>
      {/* CSS for CoPilot handshake styling */}
      <style jsx>{`
        @keyframes slide-in {
          0% { 
            transform: translateX(100%);
            opacity: 0;
          }
          100% { 
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes glow-green {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
          }
        }

        .copilot-message {
          animation: slide-in 0.5s ease-out;
        }

        .glow-green {
          text-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
        }

        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }

        .ghost-overlay {
          background: rgba(0, 20, 0, 0.9);
          border: 2px solid #00ff00;
          text-shadow: 2px 2px #ff0000, -2px -2px #0000ff;
          animation: glow-green 1s infinite alternate-reverse;
        }
      `}</style>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            className="fixed top-20 right-4 z-50 ghost-overlay rounded-lg p-4 max-w-sm mx-4 copilot-message"
          >
            <div className="space-y-3">
              {/* CoPilot Header */}
              <div className="flex items-center gap-2">
                <span className="text-green-400 text-lg">🧭</span>
                <div className="text-green-400 text-xs font-bold warrior-text uppercase tracking-widest">
                  CO-PILOT ACTIVE
                </div>
              </div>

              {/* Message Content */}
              <div className="text-green-300 text-sm warrior-text leading-relaxed">
                Don't panic—follow the logic prompts to rebuild your sector knowledge.
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <div className="text-green-500 text-xs warrior-text">
                  SYSTEMS ONLINE
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default CoPilotHandshake
