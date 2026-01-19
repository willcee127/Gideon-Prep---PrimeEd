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
    <div className="min-h-screen text-white overflow-x-hidden" style={{backgroundColor: 'var(--bg-dark)'}}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="glass-panel p-8 mb-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-6xl mb-6 holographic-text text-verve"
              >
                ⚡
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-3xl font-bold mb-4 holographic-text"
              >
                INITIALIZE RECOVERY
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-lg data-text-secondary"
              >
                Your journey to overcome obstacles begins here
              </motion.p>
            </div>
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
              <label className="block text-sm font-medium data-text-secondary mb-2">
                ASSIGN YOUR CALL SIGN
              </label>
              <input
                type="text"
                value={callSign}
                onChange={(e) => setCallSign(e.target.value)}
                placeholder="Enter your name or callsign"
                className="w-full neon-input px-4 py-3 text-lg"
                disabled={isSubmitting}
              />
            </div>

            {/* Comms Input */}
            <div>
              <label className="block text-sm font-medium data-text-secondary mb-2">
                ESTABLISH COMMS
              </label>
              <input
                type="email"
                value={comms}
                onChange={(e) => setComms(e.target.value)}
                placeholder="Enter your email"
                className="w-full neon-input px-4 py-3 text-lg"
                disabled={isSubmitting}
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting || !callSign.trim() || !comms.trim()}
              className="w-full phase-btn verve-glow text-black font-bold py-4 px-6 text-lg disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  INITIALIZING...
                </span>
              ) : (
                <span className="font-bold">CONFIRM IDENTITY</span>
              )}
            </motion.button>
          </motion.form>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 text-center data-text-secondary text-sm glass-panel p-4"
          >
            <p className="data-text">Your identity creates your personalized recovery path</p>
            <p className="mt-2">No spam • Secure storage • Progress tracking</p>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

export default RecruitmentPage;
