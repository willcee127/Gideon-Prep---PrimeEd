import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const GraduationModal = ({ isOpen, onClose, studentStats, onGraduation }) => {
  const [isVisible, setIsVisible] = useState(false)

  // Auto-show when graduation occurs
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose()
        onGraduation()
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            {/* Header */}
            <div className="text-center space-y-6">
              {/* Graduation Icon */}
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
                  <span className="text-3xl font-bold text-yellow-300">🎓</span>
                </motion.div>
              </div>
              
              {/* Graduation Title */}
              <h2 className="text-2xl font-bold text-white mb-2">
                🎓 GRADUATION COMPLETE
              </h2>
              
              {/* Graduation Message */}
              <div className="bg-black/30 rounded-xl p-6 border border-gray-600/30 mt-6">
                <div className="text-center space-y-4">
                  <p className="text-yellow-300 text-lg font-semibold mb-2">
                    🎖️ WARRIOR, YOU HAVE ACHIEVED 100% PREPAREDNESS
                  </p>
                  <p className="text-white text-lg font-medium">
                    The Testing Center is now your terrain. Go claim your sovereignty. You are ready for the official GED mission.
                  </p>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    setIsVisible(false)
                    onClose()
                    onGraduation()
                  }}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  CLAIM YOUR SOVEREIGNTY
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GraduationModal
