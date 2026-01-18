import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const RecruitmentPage = () => {
  const [callSign, setCallSign] = useState('')
  const [comms, setComms] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!callSign.trim() || !comms.trim()) {
      return
    }

    setIsSubmitting(true)
    
    // Save to localStorage for persistence
    localStorage.setItem('gideon_call_sign', callSign.trim())
    localStorage.setItem('gideon_comms', comms.trim())
    
    // Simulate processing
    setTimeout(() => {
      setIsSubmitting(false)
      navigate('/onboarding')
    }, 1500)
  }

  return (
    <div className="min-h-screen text-white font-mono overflow-x-hidden" style={{backgroundColor: '#0a0a0b'}}>
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
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-6xl mb-6"
            >
              🛡️
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-3xl font-bold mb-4 text-white"
            >
              INITIALIZE RECOVERY
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-gray-400 text-lg"
            >
              Your journey to overcome obstacles begins here
            </motion.p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Call Sign Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                ASSIGN YOUR CALL SIGN
              </label>
              <input
                type="text"
                value={callSign}
                onChange={(e) => setCallSign(e.target.value)}
                placeholder="Enter your name or callsign"
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border-2 border-slate-600 focus:border-orange-500 focus:outline-none focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 font-mono"
                style={{
                  boxShadow: callSign ? '0 0 10px rgba(245, 158, 11, 0.2)' : 'none'
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* Comms Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                ESTABLISH COMMS
              </label>
              <input
                type="email"
                value={comms}
                onChange={(e) => setComms(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-lg border-2 border-slate-600 focus:border-orange-500 focus:outline-none focus:shadow-lg focus:shadow-orange-500/20 transition-all duration-300 font-mono"
                style={{
                  boxShadow: comms ? '0 0 10px rgba(245, 158, 11, 0.2)' : 'none'
                }}
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !callSign.trim() || !comms.trim()}
              className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 disabled:from-slate-600 disabled:to-slate-700 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  INITIALIZING...
                </span>
              ) : (
                'CONFIRM IDENTITY'
              )}
            </motion.button>
          </motion.form>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 text-center text-gray-500 text-sm"
          >
            <p>Your identity creates your personalized recovery path</p>
            <p className="mt-2">No spam • Secure storage • Progress tracking</p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

export default RecruitmentPage
