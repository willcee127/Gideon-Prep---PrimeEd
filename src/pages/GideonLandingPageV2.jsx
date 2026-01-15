import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const GideonLandingPageV2 = () => {
  const navigate = useNavigate()
  const [callSign, setCallSign] = useState('')

  useEffect(() => {
    // Check if user is already logged in
    const savedCallSign = localStorage.getItem('gideon_call_sign')
    if (savedCallSign) {
      setCallSign(savedCallSign)
    }
  }, [])

  const handleStartMission = () => {
    if (callSign.trim()) {
      localStorage.setItem('gideon_call_sign', callSign.trim())
      navigate('/mission')
    }
  }

  const handleSupport = () => {
    window.open('https://ko-fi.com/willcee127', '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white font-mono overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Glow */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-blue-600/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-lavender-500/10 via-blue-500/5 to-transparent animate-pulse" />
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 max-w-5xl mx-auto text-center"
        >
          {/* Alert Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -top-8 -right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-purple-500/50"
          >
            🛡️ SYSTEMS ONLINE
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Math is the <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-400 to-blue-400 bg-clip-text">Reason</span> Students Fail GED.
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              We Built a <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-400 to-blue-400 bg-clip-text font-semibold">Recovery Engine</span> to Fix It.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartMission}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-yellow-500/50 transform hover:scale-105"
            >
              🚀 START MISSION
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSupport}
              className="border-2 border-white/50 hover:border-white hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              💪 SUPPORT THE BUILD
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Simplified Mission Language Section */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* The Problem */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 mb-12 border border-white/20">
              <div className="text-6xl font-black text-gray-400 mb-4">73%</div>
              <h2 className="text-3xl font-bold text-black mb-6">
                of students who fail GED Math exam
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text">never retake it.</span>
              </h2>
            </div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-gradient-to-br from-blue-50 to-lavender-100 rounded-2xl p-12 border border-lavender-300/50"
            >
              <h3 className="text-2xl font-bold text-black mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-500 to-blue-500 bg-clip-text">Adaptive Guidance</span>
              </h3>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                Warriors face challenges that grow with you. Our AI provides <span className="font-semibold">step-by-step guidance</span> instead of just giving answers. We ensure no warrior is left behind through real-time support and adaptive difficulty.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="bg-gradient-to-br from-slate-900 to-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            THE THREE PILLARS OF RECOVERY
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Adaptive Gravity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-500/30 rounded-2xl p-8 relative overflow-hidden group"
            >
              {/* Gold Weight Icon */}
              <div className="absolute -top-4 -right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                ⚖️
              </div>
              <div className="relative z-10">
                <div className="text-yellow-400 text-3xl mb-4">Adaptive Gravity</div>
                <p className="text-gray-300">
                  Challenges that adapt to your skill level. If you're struggling, the system provides easier problems. If you're excelling, it increases the difficulty to keep you growing.
                </p>
              </div>
            </motion.div>

            {/* Socratic Co-Pilot */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-lavender-500/30 rounded-2xl p-8 relative overflow-hidden group"
            >
              {/* Lavender Pulse Icon */}
              <div className="absolute -top-4 -right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                🧭
              </div>
              <div className="relative z-10">
                <div className="text-lavender-400 text-3xl mb-4">Socratic Co-Pilot</div>
                <p className="text-gray-300">
                  An AI that guides, never just gives answers. Breaks complex problems into manageable steps so you learn the method, not just memorize solutions.
                </p>
              </div>
            </motion.div>

            {/* Ghost Protocol */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/30 rounded-2xl p-8 relative overflow-hidden group"
            >
              {/* Blue Shield Icon */}
              <div className="absolute -top-4 -right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                🛡️
              </div>
              <div className="relative z-10">
                <div className="text-blue-400 text-3xl mb-4">Ghost Protocol</div>
                <p className="text-gray-300">
                  Real-time commander monitoring for high-friction moments. When you're stuck, command intervenes with tactical guidance to keep you moving forward.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Identity Section */}
      <section className="bg-gradient-to-br from-black to-slate-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-8">
              THE WARRIOR IDENTITY
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              A section explaining the shift from <span className="text-red-400 line-through">Victim (Student)</span> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text font-bold">Hero (Warrior)</span>. Use Gold accents to signify value and strength.
            </p>

            {/* Warrior Icons */}
            <div className="grid grid-cols-3 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-5xl mb-2 text-yellow-400">⚔️</div>
                <div className="text-white font-bold">Combat Power</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-5xl mb-2 text-yellow-400">🎯</div>
                <div className="text-white font-bold">Sectors</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center"
              >
                <div className="text-5xl mb-2 text-yellow-400">💪</div>
                <div className="text-white font-bold">Reps</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-gradient-to-br from-slate-900 to-black py-20 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-400 mb-4">
              THE ARCHITECT
            </h2>
            <p className="text-lg text-gray-500 italic max-w-2xl mx-auto">
              William M. Council II: Architect of Gideon Prep. I use the same high-stakes automation logic I build for businesses to ensure no warrior is left behind.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black to-slate-900 py-12 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-400">
            <a
              href="https://ko-fi.com/willcee127"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors flex items-center gap-2"
            >
              <span>💪 Support the Mission</span>
            </a>
            
            {callSign && (
              <button
                onClick={() => navigate('/commander?access=will_prime')}
                className="hover:text-yellow-400 transition-colors flex items-center gap-2"
              >
                <span>🎖️ Commander Dashboard</span>
              </button>
            )}
            
            <a
              href="/privacy"
              className="hover:text-yellow-400 transition-colors flex items-center gap-2"
            >
              <span>📋 Privacy</span>
            </a>
            
            <a
              href="/terms"
              className="hover:text-yellow-400 transition-colors flex items-center gap-2"
            >
              <span>📜 Terms</span>
            </a>
          </div>
          
          <div className="text-center mt-8 text-gray-500 text-sm">
            © 2026 Gideon Prep - Tactical Training Systems
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GideonLandingPageV2
