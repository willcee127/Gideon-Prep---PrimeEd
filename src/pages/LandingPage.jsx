import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const LandingPage = () => {
  const [callSign, setCallSign] = useState('')
  const navigate = useNavigate()

  const handleStartMission = () => {
    if (!callSign.trim()) {
      alert('Warrior, please enter your Call Sign to begin your mission.')
      return
    }

    // Save Call Sign to localStorage
    localStorage.setItem('gideon_call_sign', callSign.trim())
    
    // Navigate to mission briefing
    navigate('/mission')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-white mb-2"
          >
            🎖️ GIDEON PREP
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300"
          >
            Tactical Training for GED Command
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600 rounded-2xl p-8 shadow-2xl">
          {/* Call Sign Input */}
          <div className="mb-8">
            <label htmlFor="callSign" className="block text-sm font-medium text-gray-300 mb-2">
              CALL SIGN (Warrior Name)
            </label>
            <input
              id="callSign"
              type="text"
              value={callSign}
              onChange={(e) => setCallSign(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleStartMission()
                }
              }}
              placeholder="Enter your warrior name..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              autoFocus
            />
          </div>

          {/* Intelligence Brief */}
          <div className="mb-8 p-6 bg-slate-900/50 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              🧠 INTELLIGENCE BRIEF
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-green-400">🎯</span>
                <div>
                  <strong className="text-white">Mission Coach:</strong> AI-powered tactical guidance for every problem
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-400">🛡️</span>
                <div>
                  <strong className="text-white">Strategic Bypass:</strong> Circuit breaker when you're stuck
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400">⚡</span>
                <div>
                  <strong className="text-white">Real-time Support:</strong> Live monitoring and encouragement
                </div>
              </div>
            </div>
          </div>

          {/* Safety Guarantee */}
          <div className="mb-8 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2 flex items-center">
              🛡️ SAFETY GUARANTEE
            </h3>
            <p className="text-gray-300">
              No warrior gets left behind. Our AI coach provides tactical support, 
              strategic bypass options, and real-time monitoring to ensure your success.
            </p>
          </div>

          {/* Start Mission Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartMission}
            className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-lg"
          >
            🚀 START MISSION
          </motion.button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>No Shame, Just Reps.</p>
          <p className="mt-1">© 2026 Gideon Prep - Tactical Training Systems</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LandingPage
