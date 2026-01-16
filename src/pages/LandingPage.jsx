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
    
    // Navigate to onboarding
    navigate('/mission')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto"
      >
        {/* Header with Primary CTA */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold text-white mb-3"
          >
            🎖️ GIDEON PREP
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto"
          >
            Built for adults retaking GED Math exam. Adaptive, judgment-free, and built for your pace.
          </motion.p>
          
          {/* Primary CTA Button at Top */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleStartMission}
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-lg shadow-purple-500/25"
          >
            🚀 START MISSION
          </motion.button>
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
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              autoFocus
            />
          </div>

          {/* Verve, Aura, Forge Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Verve Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-6 hover:bg-purple-900/40 transition-all duration-300"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🟣</span>
                <h3 className="text-lg font-bold text-purple-300">VERVE</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Work at your own pace. The app adapts to your energy and learning style without pressure.
              </p>
            </motion.div>

            {/* Aura Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-cyan-900/30 border border-cyan-600/50 rounded-lg p-6 hover:bg-cyan-900/40 transition-all duration-300"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🔵</span>
                <h3 className="text-lg font-bold text-cyan-300">AURA</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Turn every challenge into a lesson. Learn from mistakes and build confidence through understanding.
              </p>
            </motion.div>

            {/* Forge Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-orange-900/30 border border-orange-600/50 rounded-lg p-6 hover:bg-orange-900/40 transition-all duration-300"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🟠</span>
                <h3 className="text-lg font-bold text-orange-300">FORGE</h3>
              </div>
              <p className="text-gray-300 text-sm">
                You are the architect of your success. Map your way to reclaim territory and achieve mastery.
              </p>
            </motion.div>
          </div>

          {/* Condensed Seal of Reps */}
          <div className="mb-8 p-6 bg-slate-900/50 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              🛡️ SEAL OF REPS
            </h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-green-400">✓</span>
                <div>
                  <strong className="text-white">No Shame, Just Reps:</strong> Every mistake is a recalibration, not a failure.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-400">✓</span>
                <div>
                  <strong className="text-white">Adaptive Intelligence:</strong> AI-powered tactical guidance that learns your style.
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400">✓</span>
                <div>
                  <strong className="text-white">Mission-Critical Focus:</strong> Built for adults who need results, not games.
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              Read Full Seal →
            </motion.button>
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
        </div>

        {/* Trust Bar */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p className="mb-2">
            Built by William M. Council II — Using high-stakes automation logic trusted by mission-critical businesses.
          </p>
          <p>© 2026 Gideon Prep - Tactical Training Systems</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LandingPage
