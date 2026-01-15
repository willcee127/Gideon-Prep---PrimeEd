import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const MissionLandingPage = () => {
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
    <div className="min-h-screen bg-black text-white font-mono overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-orange-900/20" />
          <div className="grid grid-cols-12 gap-px h-full">
            {[...Array(144)].map((_, i) => (
              <div 
                key={i} 
                className="border border-cyan-500/10 opacity-30"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '2s',
                  animationIterationCount: 'infinite'
                }}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          {/* Alert Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -top-8 -right-8 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
          >
            ⚠️ LIVE SYSTEMS ACTIVE
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
          >
            Math is the #1 Reason Students
            <span className="text-orange-500">Fail</span> GED.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
          >
            We Built a Recovery Engine to Fix It.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartMission}
              className="bg-cyan-600 hover:bg-cyan-700 text-black px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg shadow-cyan-500/50"
            >
              🚀 START MISSION (FREE)
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSupport}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg shadow-orange-500/50"
            >
              💪 SUPPORT THE BUILD
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stop the Bleed Section */}
      <section className="bg-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            {/* Visual Stat */}
            <div className="text-6xl font-black text-orange-500 mb-4">
              73%
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              of students who fail GED Math exam
              <span className="text-cyan-400">never retake it.</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Gideon Prep stops the bleed by identifying the exact moment you struggle and intervening before you quit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Three Pillars Section */}
      <section className="bg-black py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center text-white mb-12"
          >
            THE THREE PILLARS OF RECOVERY
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Adaptive Gravity */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-900 border border-cyan-500/30 rounded-lg p-8"
            >
              <div className="text-cyan-400 text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold text-white mb-4">Adaptive Gravity</h3>
              <p className="text-gray-300">
                Difficulty shifts in real-time based on your wins. If you're struggling, the system adapts. If you're excelling, it challenges you harder.
              </p>
            </motion.div>

            {/* Socratic Co-Pilot */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-900 border border-cyan-500/30 rounded-lg p-8"
            >
              <div className="text-cyan-400 text-4xl mb-4">🧭</div>
              <h3 className="text-xl font-bold text-white mb-4">Socratic Co-Pilot</h3>
              <p className="text-gray-300">
                Breaks walls into steps instead of just giving answers. We guide you through the process so you learn the method, not just memorize solutions.
              </p>
            </motion.div>

            {/* Ghost Protocol */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-gray-900 border border-cyan-500/30 rounded-lg p-8"
            >
              <div className="text-cyan-400 text-4xl mb-4">👻</div>
              <h3 className="text-xl font-bold text-white mb-4">Ghost Protocol</h3>
              <p className="text-gray-300">
                Live Commander monitoring for high-friction moments. When you're stuck, Command intervenes with tactical guidance to keep you moving forward.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Warrior Identity Section */}
      <section className="bg-gray-900 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-8">
              THE WARRIOR IDENTITY
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              A section explaining the shift from 'Student' to 'Warrior.' Use icons for Combat Power, Sectors, and Reps.
            </p>

            {/* Warrior Icons */}
            <div className="grid grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl mb-2">⚔️</div>
                <div className="text-white font-bold">Combat Power</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <div className="text-white font-bold">Sectors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">💪</div>
                <div className="text-white font-bold">Reps</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission Builder Section */}
      <section className="bg-black py-20 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-400 mb-4">
              THE MISSION BUILDER
            </h2>
            <p className="text-lg text-gray-500 italic">
              Built by William M. Council II. I use the same high-stakes automation logic I build for businesses to ensure no warrior is left behind.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-400">
            <a
              href="https://ko-fi.com/willcee127"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              💪 Support the Mission
            </a>
            
            {callSign && (
              <button
                onClick={() => navigate('/commander?access=will_prime')}
                className="hover:text-cyan-400 transition-colors"
              >
                🎖️ Commander Dashboard
              </button>
            )}
            
            <a
              href="/privacy"
              className="hover:text-cyan-400 transition-colors"
            >
              📋 Privacy
            </a>
            
            <a
              href="/terms"
              className="hover:text-cyan-400 transition-colors"
            >
              📜 Terms
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

export default MissionLandingPage
