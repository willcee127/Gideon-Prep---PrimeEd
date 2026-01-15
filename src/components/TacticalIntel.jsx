import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TacticalIntel = ({ isOpen, onClose, currentStronghold }) => {
  const [highlightedTip, setHighlightedTip] = useState(null)

  const intelTips = [
    {
      id: 'fractions',
      category: 'Fractions',
      icon: '🍕',
      tip: 'Use [n/d] to enter, [2nd][f<>d] to convert to decimals.',
      keys: ['[n/d]', '[2nd][f<>d]'],
      description: 'Direct fraction entry and conversion'
    },
    {
      id: 'powers',
      category: 'Powers',
      icon: '⚡',
      tip: 'Use [^] for any exponent and [x²] for squares.',
      keys: ['[^]', '[x²]'],
      description: 'Exponent shortcuts for speed'
    },
    {
      id: 'signs',
      category: 'Signs',
      icon: '➕',
      tip: 'Use [(-)] (bottom right) for negative numbers, NOT the minus key.',
      keys: ['[(-)]'],
      description: 'Negative number entry'
    },
    {
      id: 'clear',
      category: 'Clear All',
      icon: '🔄',
      tip: 'Use [on] + [clear] to reset the memory if it gets glitchy.',
      keys: ['[on] + [clear]'],
      description: 'Memory reset troubleshooting'
    },
    {
      id: 'toggle',
      category: 'Toggle',
      icon: '🔄',
      tip: 'Use the [≈] key above \'enter\' to switch between exact answers and decimals.',
      keys: ['[≈]'],
      description: 'Answer format switching'
    }
  ]

  const getRelevantTip = () => {
    if (!currentStronghold) return null
    
    const strongholdLower = currentStronghold.toLowerCase()
    if (strongholdLower.includes('frac') || strongholdLower.includes('fraction')) {
      return intelTips[0] // Fractions
    } else if (strongholdLower.includes('quad') || strongholdLower.includes('power') || strongholdLower.includes('square')) {
      return intelTips[1] // Powers
    } else if (strongholdLower.includes('equation') || strongholdLower.includes('algebra')) {
      return intelTips[1] // Powers
    } else if (strongholdLower.includes('data') || strongholdLower.includes('graph')) {
      return intelTips[4] // Toggle
    }
    return null
  }

  const handleCopyToStrategy = () => {
    const relevantTip = getRelevantTip()
    if (relevantTip) {
      setHighlightedTip(relevantTip.id)
      setTimeout(() => setHighlightedTip(null), 3000)
    }
  }

  const relevantTip = getRelevantTip()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-to-br from-blue-900/90 to-blue-800/90 backdrop-blur-xl border border-blue-400/50 rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🛠️</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-blue-300">
                    TACTICAL INTEL
                  </h2>
                  <p className="text-blue-400 text-sm">
                    TI-30XS Calculator Hacks
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-700 hover:bg-red-500 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Intel Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {intelTips.map((tip) => (
                <motion.div
                  key={tip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: tip.id * 0.1 }}
                  className={`bg-blue-950/50 border rounded-xl p-4 transition-all duration-300 ${
                    highlightedTip === tip.id
                      ? 'border-yellow-400/50 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                      : 'border-blue-400/30 hover:border-blue-400/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{tip.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-blue-300 font-semibold text-sm mb-1">
                        {tip.category}
                      </h3>
                      <p className="text-blue-200 text-xs mb-2">
                        {tip.tip}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {tip.keys.map((key, index) => (
                          <span
                            key={index}
                            className="bg-blue-800/70 text-blue-300 text-xs px-2 py-1 rounded border border-blue-400/30 font-mono"
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                      <p className="text-blue-400/60 text-xs mt-2 italic">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <div className="text-blue-300 text-sm">
                <p className="mb-1">Current Stronghold: {currentStronghold || 'None'}</p>
                {relevantTip && (
                  <p className="text-yellow-400 text-xs">
                    Relevant: {relevantTip.category}
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3">
                {relevantTip && (
                  <button
                    onClick={handleCopyToStrategy}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-semibold transition transform hover:scale-105 active:scale-95"
                  >
                    📋 Copy to Strategy
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition transform hover:scale-105 active:scale-95"
                >
                  Close Intel
                </button>
              </div>
            </div>

            {/* Manual Note */}
            <div className="mt-4 pt-4 border-t border-blue-400/30">
              <p className="text-blue-400/80 text-xs text-center italic">
                📚 Master these shortcuts to become a GED calculator warrior. Speed matters on test day.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TacticalIntel
