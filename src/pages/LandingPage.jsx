import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const LandingPage = () => {
  const [callSign, setCallSign] = useState('')
  const [showSealModal, setShowSealModal] = useState(false)
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

  const handleWatchIntel = () => {
    // Navigate to intelligence briefing or demo
    navigate('/intel')
  }

  const fullSealContent = `I am one who showed up. I am not the score I once got—I am the effort I'm putting in right now. The territory is mine because I earned it, one rep at a time. Every problem is a rep. Every mistake is a recalibration. I am rewiring my mind to see patterns where I once saw walls. The math is just the language of my victory. The calculator is just the tool of my intent. I have stayed when I wanted to leave. I have focused when I wanted to fade. I am an Overcomer, not because it was easy, but because I am still here. The territory is mine because I earned it, one rep at a time. No shame, just reps. No excuses, just execution. No retreat, just advance. This is my recovery. This is my victory. This is my territory.`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl mx-auto"
      >
        {/* Hero Section with Dual CTA */}
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
            The GED Math Recovery Engine. Built for Warriors who have failed before.
          </motion.p>
          
          {/* Dual CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
            
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleWatchIntel}
              className="px-12 py-4 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-lg shadow-cyan-500/25"
            >
              🎥 WATCH INTEL
            </motion.button>
          </div>
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

          {/* Mode Differentiator Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* LISTEN (Verve) Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 border-2 border-purple-500/50 rounded-lg p-6 hover:bg-purple-900/20 hover:border-purple-400/70 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🟣</span>
                <h3 className="text-lg font-bold text-purple-300">LISTEN (Verve)</h3>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                Work at your own pace. The app adapts to your energy and learning style without pressure.
              </p>
              <p className="text-purple-400 text-xs font-medium">
                For recovery & support.
              </p>
            </motion.div>

            {/* LEARN (Aura) Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 border-2 border-cyan-500/50 rounded-lg p-6 hover:bg-cyan-900/20 hover:border-cyan-400/70 hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🔵</span>
                <h3 className="text-lg font-bold text-cyan-300">LEARN (Aura)</h3>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                Turn every challenge into a lesson. Learn from mistakes and build confidence through understanding.
              </p>
              <p className="text-cyan-400 text-xs font-medium">
                For building momentum.
              </p>
            </motion.div>

            {/* LEAD (Forge) Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.02 }}
              className="bg-slate-900/50 border-2 border-orange-500/50 rounded-lg p-6 hover:bg-orange-900/20 hover:border-orange-400/70 hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">🟠</span>
                <h3 className="text-lg font-bold text-orange-300">LEAD (Forge)</h3>
              </div>
              <p className="text-gray-300 text-sm mb-2">
                You are the architect of your success. Map your way to reclaim territory and achieve mastery.
              </p>
              <p className="text-orange-400 text-xs font-medium">
                For aggressive mastery.
              </p>
            </motion.div>
          </div>

          {/* Condensed Seal of Reps */}
          <div className="mb-8 p-6 bg-slate-900/50 border border-slate-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              🛡️ SEAL OF REPS
            </h3>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-lg">"</span>
                <div>
                  <p className="italic">I am one who showed up.</p>
                </div>
                <span className="text-green-400 text-lg">"</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-400 text-lg">"</span>
                <div>
                  <p className="italic">I am not the score I once got—I am the effort I'm putting in right now.</p>
                </div>
                <span className="text-blue-400 text-lg">"</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400 text-lg">"</span>
                <div>
                  <p className="italic">The territory is mine because I earned it, one rep at a time.</p>
                </div>
                <span className="text-yellow-400 text-lg">"</span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSealModal(true)}
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

        {/* The Signature */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p className="mb-2">
            Built by William M. Council II — Mission-Critical Automation Logic.
          </p>
          <p>© 2026 Gideon Prep - Tactical Training Systems</p>
        </div>
      </motion.div>

      {/* Full Seal Modal */}
      <AnimatePresence>
        {showSealModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowSealModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  🛡️ FULL SEAL OF REPS
                </h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowSealModal(false)}
                  className="text-gray-400 hover:text-white text-2xl transition-colors"
                >
                  ×
                </motion.button>
              </div>
              
              <div className="text-gray-300 leading-relaxed space-y-4">
                <p className="text-lg italic">
                  {fullSealContent}
                </p>
              </div>
              
              <div className="mt-6 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowSealModal(false)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                >
                  UNDERSTOOD
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LandingPage
