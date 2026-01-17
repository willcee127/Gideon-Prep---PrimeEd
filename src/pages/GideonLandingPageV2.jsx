import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../supabase'

const GideonLandingPageV2 = () => {
  const navigate = useNavigate()
  const [isClient, setIsClient] = useState(false)
  const [callSign, setCallSign] = useState('')
  const [showSignupForm, setShowSignupForm] = useState(false)
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    callsign: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signupMessage, setSignupMessage] = useState('')

  // Hydration guard - only render on client side
  useEffect(() => {
    setIsClient(true)
    console.log('GideonLandingPageV2: Client-side rendering activated')
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-orange-400 text-xl">🛡️ Initializing Command Center...</div>
      </div>
    )
  }

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

  const handleAlphaRecruit = async () => {
    setIsSubmitting(true)
    setSignupMessage('')
    
    try {
      const { data, error } = await supabase
        .from('waitlist_warriors')
        .insert([
          {
            name: signupData.name,
            email: signupData.email,
            callsign: signupData.callsign,
            recruitment_phase: 'ALPHA',
            status: 'PENDING',
            created_at: new Date().toISOString()
          }
        ])

      if (error) {
        console.error('Signup error:', error)
        setSignupMessage('⚠️ Recruitment system temporarily unavailable. Try again soon.')
      } else {
        setSignupMessage('✅ Welcome to the Alpha Recruit waitlist! Check your email for next steps.')
        setSignupData({ name: '', email: '', callsign: '' })
        setTimeout(() => {
          setShowSignupForm(false)
          setSignupMessage('')
        }, 3000)
      }
    } catch (err) {
      console.error('Network error:', err)
      setSignupMessage('⚠️ Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white font-mono overflow-x-hidden">
      {/* CSS Custom Properties for 3-Phase Color System */}
      <style jsx>{`
        :root {
          --verve-primary: #E6E6FA;
          --verve-secondary: #D8D8E8;
          --verve-glow: rgba(230, 230, 250, 0.3);
          
          --aura-primary: #00FFFF;
          --aura-secondary: #00E5E5;
          --aura-glow: rgba(0, 255, 255, 0.3);
          
          --forge-primary: #FFBF00;
          --forge-secondary: #FFAA00;
          --forge-glow: rgba(255, 191, 0, 0.3);
        }
        
        .verve-bg {
          background: linear-gradient(135deg, var(--verve-glow), transparent);
          box-shadow: 0 0 30px var(--verve-glow);
        }
        
        .aura-bg {
          background: linear-gradient(135deg, var(--aura-glow), transparent);
          box-shadow: 0 0 30px var(--aura-glow);
          border: 1px solid var(--aura-primary);
        }
        
        .forge-bg {
          background: linear-gradient(135deg, var(--forge-glow), transparent);
          box-shadow: 0 0 30px var(--forge-glow);
          border: 1px solid var(--forge-primary);
        }
        
        .tech-grid {
          background-image: 
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .soft-glow {
          box-shadow: 0 0 20px rgba(230, 230, 250, 0.2);
          backdrop-filter: blur(10px);
        }
        
        .warm-amber-glow {
          box-shadow: 0 0 40px rgba(255, 191, 0, 0.3);
          background: radial-gradient(circle, rgba(255, 191, 0, 0.1), transparent);
        }
        
        .glassmorphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        }
        
        .glass-card-hover {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 24px;
          transition: all 0.3s ease;
        }
        
        .peaceful-sanctuary {
          background: radial-gradient(circle, rgba(230,230,250,0.1) 0%, rgba(10,10,10,1) 100%);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(230, 230, 250, 0.2);
          border-radius: 24px;
          box-shadow: 
            0 8px 32px rgba(230, 230, 250, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>
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
            className="absolute -top-8 -right-8 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-orange-500/50"
          >
            🎯 GIDEON COMMAND CENTER
          </motion.div>

          {/* Main Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              STOP HIDING IN<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text">THE WINEPRESS</span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            >
              Transform to Conquer Your GED.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text font-semibold">You're not bad at math. You just had a bad system.</span>
            </motion.p>
          </motion.div>

          {/* Guardian Assembly Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="mb-8"
          >
            <div className="relative w-64 h-64 mx-auto">
              {/* Central Guardian Core */}
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-400/20 backdrop-blur-md border-2 border-amber-400/30 flex items-center justify-center"
              >
                <div className="text-6xl">🛡️</div>
              </motion.div>
              
              {/* Orbiting Guardian Elements */}
              {[0, 120, 240].map((angle, index) => (
                <motion.div
                  key={index}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: index * 5 }}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  <motion.div
                    className="absolute top-8 left-1/2 transform -translate-x-1/2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.7 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-lavender-400/30 to-cyan-400/30 backdrop-blur-sm border border-lavender-400/50 flex items-center justify-center text-2xl">
                      {['🌱', '⚡', '🏆'][index]}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              
              {/* Protective Aura */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.1, 0.3]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border-2 border-amber-400/20"
              />
            </div>
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
              onClick={() => setShowSignupForm(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-orange-500/50 transform hover:scale-105"
            >
              🎯 JOIN ALPHA RECRUIT
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStartMission}
              className="border-2 border-cyan-400 hover:border-cyan-300 hover:bg-cyan-400/10 text-cyan-400 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              🚀 EXISTING WARRIOR
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Alpha Recruit Signup Modal */}
      <AnimatePresence>
        {showSignupForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowSignupForm(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative glassmorphism border-2 border-amber-400/50 rounded-3xl shadow-2xl shadow-amber-400/30 p-8 max-w-md w-full mx-4"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-orange-400 mb-2">
                  ALPHA RECRUIT
                </h2>
                <p className="text-gray-400 text-sm">
                  Join the waitlist for Gideon Prep Prime
                </p>
              </div>
              
              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-orange-300 text-sm font-bold mb-2">
                    Warrior Name
                  </label>
                  <input
                    type="text"
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 glassmorphism border border-amber-400/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-amber-300 text-sm font-bold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 glassmorphism border border-amber-400/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-amber-300 text-sm font-bold mb-2">
                    Call Sign (Optional)
                  </label>
                  <input
                    type="text"
                    value={signupData.callsign}
                    onChange={(e) => setSignupData(prev => ({ ...prev, callsign: e.target.value }))}
                    placeholder="Choose your warrior callsign"
                    className="w-full px-4 py-3 glassmorphism border border-amber-400/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Message */}
              {signupMessage && (
                <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
                  signupMessage.includes('✅') ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {signupMessage}
                </div>
              )}
              
              {/* Actions */}
              <div className="flex justify-center space-x-3 mt-6">
                <button
                  onClick={() => setShowSignupForm(false)}
                  className="px-4 py-2 glassmorphism border border-gray-400/30 hover:bg-gray-600/20 text-white rounded-2xl transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAlphaRecruit}
                  disabled={isSubmitting || !signupData.name || !signupData.email}
                  className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black rounded-2xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-400/30"
                >
                  {isSubmitting ? 'JOINING...' : 'JOIN WAITLIST'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transformation Protocol Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-orange-400 bg-clip-text">
                TRANSFORMATION PROTOCOL
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Three phases to reclaim your mathematical sovereignty
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* PHASE 1 - VERVE (Lavender) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="relative group"
            >
              <div className="peaceful-sanctuary p-8 h-full">
                <div className="text-center">
                  <div className="text-3xl font-black mb-4" style={{ color: 'var(--verve-primary)' }}>
                    PHASE 1
                  </div>
                  <div className="text-xl font-bold mb-2 text-lavender-300">
                    VERVE
                  </div>
                  <div className="text-lg font-semibold mb-6 text-lavender-200">
                    Healing & Foundation
                  </div>
                  <div className="text-gray-300 space-y-3">
                    <p>🌱 Restore mathematical confidence</p>
                    <p>🧘‍♀️ Release calculation anxiety</p>
                    <p>🏛️ Create sanctuary of learning</p>
                    <p>✨ Awaken dormant potential</p>
                  </div>
                </div>
                {/* Peaceful sanctuary effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       background: 'radial-gradient(circle at center, rgba(230, 230, 250, 0.08), transparent)',
                       backdropFilter: 'blur(25px)',
                       boxShadow: 'inset 0 0 30px rgba(230, 230, 250, 0.05)'
                     }}>
                </div>
              </div>
            </motion.div>

            {/* PHASE 2 - AURA (Cyan) */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative group"
            >
              <div className="aura-bg tech-grid rounded-3xl p-8 h-full glassmorphism">
                <div className="text-center">
                  <div className="text-3xl font-black mb-4" style={{ color: 'var(--aura-primary)' }}>
                    PHASE 2
                  </div>
                  <div className="text-xl font-bold mb-2 text-cyan-300">
                    AURA
                  </div>
                  <div className="text-lg font-semibold mb-6 text-cyan-200">
                    Territory & Conquest
                  </div>
                  <div className="text-gray-300 space-y-3">
                    <p>🎯 Master GED sectors systematically</p>
                    <p>⚡ Build operational confidence</p>
                    <p>🗺️ Conquer mathematical territories</p>
                    <p>🔥 Forge tactical precision</p>
                  </div>
                </div>
                {/* Tech grid overlay with glassmorphism */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <div className="w-full h-full tech-grid"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 to-transparent rounded-3xl"></div>
                </div>
              </div>
            </motion.div>

            {/* PHASE 3 - FORGE (Orange) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative group"
            >
              <div className="forge-bg warm-amber-glow rounded-3xl p-8 h-full glassmorphism">
                <div className="text-center">
                  <div className="text-3xl font-black mb-4" style={{ color: 'var(--forge-primary)' }}>
                    PHASE 3
                  </div>
                  <div className="text-xl font-bold mb-2 text-amber-300">
                    FORGE
                  </div>
                  <div className="text-lg font-semibold mb-6 text-amber-200">
                    Integration & Mastery
                  </div>
                  <div className="text-gray-300 space-y-3">
                    <p>🏆 Achieve GED sovereignty</p>
                    <p>👁️ Develop mathematical intuition</p>
                    <p>⚡ Integrate combat-ready skills</p>
                    <p>🎖️ Join the elite warriors</p>
                  </div>
                </div>
                {/* Warm amber glow effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{
                       background: 'radial-gradient(circle at center, rgba(255, 191, 0, 0.15), transparent)',
                       boxShadow: '0 0 60px rgba(255, 191, 0, 0.4)'
                     }}>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
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
            <div className="glass-card p-12 mb-12">
              <div className="text-6xl font-black text-white mb-4">73%</div>
              <h2 className="text-3xl font-bold text-white mb-6">
                of students who fail GED Math exam
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">never retake it.</span>
              </h2>
            </div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="glass-card-hover p-12"
            >
              <h3 className="text-2xl font-bold text-white mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lavender-400 to-cyan-400 bg-clip-text">Adaptive Guidance</span>
              </h3>
              <p className="text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
                Warriors face challenges that grow with you. Our AI provides <span className="font-semibold text-cyan-300">step-by-step guidance</span> instead of just giving answers. We ensure no warrior is left behind through real-time support and adaptive difficulty.
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
              className="glass-card p-8 relative overflow-hidden group"
            >
              {/* Gold Weight Icon */}
              <div className="absolute -top-4 -right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                ⚖️
              </div>
              <div className="relative z-10">
                <div className="text-amber-400 text-3xl mb-4">Adaptive Gravity</div>
                <p className="text-slate-200">
                  Challenges that adapt to your skill level. If you're struggling, the system provides easier problems. If you're excelling, it increases the difficulty to keep you growing.
                </p>
              </div>
            </motion.div>

            {/* Socratic Co-Pilot */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card p-8 relative overflow-hidden group"
            >
              {/* Lavender Pulse Icon */}
              <div className="absolute -top-4 -right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                💜
              </div>
              <div className="relative z-10">
                <div className="text-lavender-400 text-3xl mb-4">Socratic Co-Pilot</div>
                <p className="text-slate-200">
                  AI-powered guidance that asks questions instead of giving answers. Helps you discover solutions yourself, building true understanding and confidence.
                </p>
              </div>
            </motion.div>

            {/* Blue Shield */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="glass-card p-8 relative overflow-hidden group"
            >
              {/* Blue Shield Icon */}
              <div className="absolute -top-4 -right-4 text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                🛡️
              </div>
              <div className="relative z-10">
                <div className="text-cyan-400 text-3xl mb-4">Combat Support</div>
                <p className="text-slate-200">
                  Real-time tactical support when you need it most. Step-by-step guidance, hints, and encouragement to keep you moving forward.
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
            <div className="mb-2">
              <span className="text-orange-400 font-bold">RECRUITMENT PHASE: ALPHA</span>
              <span className="text-gray-400 mx-2">—</span>
              <span className="text-orange-300">gideon-prep-prime.vercel.app</span>
            </div>
            <div className="text-orange-400 font-bold text-lg mb-2">
              JOIN THE ELITE — ENROLLMENT OPENING SOON
            </div>
            © 2026 Gideon Prep - Tactical Training Systems
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GideonLandingPageV2
