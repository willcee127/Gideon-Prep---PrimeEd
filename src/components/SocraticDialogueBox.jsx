import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const SocraticDialogueBox = ({ 
  isVisible, 
  onDismiss, 
  socraticQuestion, 
  conceptId 
}) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false)

  const handleDismiss = async () => {
    setIsAcknowledged(true)
    
    // Log interaction back to friction_logs as 'acknowledged'
    try {
      await supabase
        .from('friction_logs')
        .update({ 
          status: 'acknowledged',
          acknowledged_at: new Date().toISOString()
        })
        .eq('concept_id', conceptId)
        .is('status', 'active')
    } catch (error) {
      console.error('Failed to log acknowledgement:', error)
    }
    
    // Call parent dismiss callback
    onDismiss()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ 
            type: 'spring', 
            damping: 25, 
            stiffness: 400 
          }}
          className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 max-w-md w-full mx-4"
        >
          {/* Semi-transparent dark background with Forge Orange border */}
          <div className="relative">
            {/* Glowing shadow effect */}
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-lg" />
            
            {/* Main container */}
            <div className="relative bg-gray-900/95 backdrop-blur-xl border-2 border-orange-500 rounded-lg shadow-2xl shadow-orange-500/50 p-6">
              
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-orange-500/30">
                <div className="flex items-center space-x-3">
                  {/* Tactical Intelligence Icon */}
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🎯</span>
                  </div>
                  <h2 className="text-orange-400 text-lg font-bold tracking-wider">
                    TACTICAL INTELLIGENCE
                  </h2>
                </div>
                
                {/* Status indicator */}
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  <span className="text-orange-400 text-xs font-mono">LIVE</span>
                </div>
              </div>

              {/* Body area for Socratic question */}
              <div className="mb-6 min-h-[120px]">
                <div className="bg-black/50 rounded-lg p-4 border border-orange-500/20">
                  <p className="text-orange-300 leading-relaxed font-medium">
                    {socraticQuestion}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDismiss}
                  disabled={isAcknowledged}
                  className={`
                    px-6 py-2 rounded-lg font-bold text-sm transition-all duration-200
                    ${isAcknowledged 
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                      : 'bg-orange-500 text-white hover:bg-orange-400 active:scale-95 shadow-lg shadow-orange-500/50'
                    }
                  `}
                >
                  {isAcknowledged ? 'ACKNOWLEDGED' : 'DISMISS'}
                </button>
              </div>

              {/* Tactical metadata */}
              <div className="mt-4 pt-3 border-t border-orange-500/30">
                <div className="flex items-center justify-between text-xs text-orange-500/70 font-mono">
                  <span>SECTOR: {conceptId?.toUpperCase() || 'UNKNOWN'}</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SocraticDialogueBox
