import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FinalMissionReport = ({ 
  isOpen, 
  onClose, 
  sessionResults, 
  callSign,
  sectorsConquered = [],
  breakthroughs = 0,
  combatPowerGained = 0
}) => {
  const [showDetails, setShowDetails] = useState(false)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(10, 10, 11, 0.9)' }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl"
          style={{ backgroundColor: '#0a0a0b' }}
        >
          {/* Header */}
          <div className="bg-slate-800 border-b border-slate-700 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white font-mono">MISSION REPORT</h2>
                <p className="text-gray-400 text-sm mt-1">Recovery Engine Analysis</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-2xl"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Salutation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <h3 className="text-xl font-bold text-amber-400" style={{color: '#f59e0b'}}>
                Breakthroughs achieved, {callSign || 'Warrior'}.
              </h3>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700"
              >
                <div className="text-3xl font-bold text-orange-400 mb-2" style={{color: '#f59e0b'}}>
                  {sectorsConquered.length}
                </div>
                <div className="text-sm text-gray-400">Sectors Secured</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700"
              >
                <div className="text-3xl font-bold text-orange-400 mb-2" style={{color: '#f59e0b'}}>
                  {breakthroughs}
                </div>
                <div className="text-sm text-gray-400">Tactical Breakthroughs</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-800 rounded-lg p-4 text-center border border-slate-700"
              >
                <div className="text-3xl font-bold text-orange-400 mb-2" style={{color: '#f59e0b'}}>
                  {combatPowerGained}%
                </div>
                <div className="text-sm text-gray-400">Combat Power Gained</div>
              </motion.div>
            </div>

            {/* Current Combat Power */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-slate-800 rounded-lg p-4 border border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Current Combat Power</span>
                <span className="text-orange-400 font-bold" style={{color: '#f59e0b'}}>{Math.min(100, combatPowerGained + 50)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <motion.div 
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${Math.min(100, combatPowerGained + 50)}%`,
                    backgroundColor: '#f59e0b'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, combatPowerGained + 50)}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                />
              </div>
            </motion.div>

            {/* Sectors Conquered List */}
            {sectorsConquered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700"
              >
                <h4 className="text-white font-bold mb-3">Sectors Secured:</h4>
                <div className="space-y-2">
                  {sectorsConquered.map((sector, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center gap-2 text-gray-300"
                    >
                      <span className="text-green-400">✓</span>
                      <span>{sector}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tactical Breakthroughs Details */}
            {breakthroughs > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700"
              >
                <h4 className="text-white font-bold mb-3">Tactical Breakthroughs:</h4>
                <div className="text-gray-300">
                  <p>Socratic Co-Pilot guided you through {breakthroughs} critical friction points</p>
                  <p className="text-sm text-gray-400 mt-2">Each breakthrough represents overcoming a major obstacle in your learning journey</p>
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex gap-4"
            >
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex-1 border border-gray-400 hover:border-orange-400 hover:text-orange-400 text-gray-400 py-3 px-4 rounded-lg transition-all duration-300"
              >
                {showDetails ? 'HIDE DETAILS' : 'SHOW DETAILS'}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300"
                style={{backgroundColor: '#f59e0b'}}
              >
                CONTINUE RECOVERY
              </button>
            </motion.div>

            {/* Detailed Analysis */}
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-slate-800 rounded-lg p-4 border border-slate-700"
              >
                <h4 className="text-white font-bold mb-3">Detailed Analysis:</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• Recovery Engine performance: {combatPowerGained > 50 ? 'Excellent' : combatPowerGained > 25 ? 'Good' : 'Needs Improvement'}</p>
                  <p>• Friction resolution rate: {breakthroughs > 0 ? `${(breakthroughs / sectorsConquered.length * 100).toFixed(0)}%` : 'N/A'}</p>
                  <p>• Learning momentum: {combatPowerGained > 30 ? 'Strong' : 'Building'}</p>
                  <p>• Next recommended action: {combatPowerGained > 50 ? 'Advanced sectors' : 'Continue practice in current sectors'}</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FinalMissionReport
