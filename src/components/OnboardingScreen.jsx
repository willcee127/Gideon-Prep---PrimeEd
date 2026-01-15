import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../utils/supabaseClient'
import { createUserRecord } from '../services/syncService'

const OnboardingScreen = () => {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    callSign: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [callSignError, setCallSignError] = useState('')
  const navigate = useNavigate()

  const checkCallSignUniqueness = async (callSign) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('call_sign')
        .eq('call_sign', callSign.toUpperCase())
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = row not found
        console.error('Call sign check error:', error)
        return false
      }
      
      return !data // Return true if call sign is available (no data found)
    } catch (error) {
      console.error('Call sign check error:', error)
      return false
    }
  }

  const validateCallSign = async (callSign) => {
    if (!callSign.trim()) {
      setCallSignError('Call Sign is required')
      return false
    }
    
    if (callSign.length < 3) {
      setCallSignError('Call Sign must be at least 3 characters')
      return false
    }
    
    // Check uniqueness
    const isUnique = await checkCallSignUniqueness(callSign.trim())
    if (!isUnique) {
      setCallSignError('This Call Sign is already taken. Try adding a number or choose a different one.')
      return false
    }
    
    setCallSignError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (step === 1) {
      // Validate email form
      if (!formData.name.trim() || !formData.email.trim()) {
        alert('Warrior, please enter your name and email to continue.')
        return
      }
      setStep(2)
    } else if (step === 2) {
      // Validate call sign form
      const isValidCallSign = await validateCallSign(formData.callSign)
      if (!isValidCallSign) {
        return
      }
      
      setIsLoading(true)
      
      try {
        // Create user record in Supabase
        const { data, error } = await createUserRecord({
          real_name: formData.name,
          email: formData.email,
          call_sign: formData.callSign
        })
        
        if (error) {
          console.error('User creation error:', error)
          alert('Mission setup failed. Please try again.')
        } else {
          // Save call sign to localStorage for immediate use
          localStorage.setItem('gideon_call_sign', formData.callSign)
          
          // Navigate to activation sequence
          navigate('/activation')
        }
      } catch (error) {
        console.error('Onboarding error:', error)
        alert('System error. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const getRankIcon = (callSign) => {
    const icons = {
      RECRUIT: '🎖️',
      TACTICAL_SPECIALIST: '🎯',
      TACTICAL_EXPERT: '⚡',
      FIELD_COMMANDER: '🏆'
    }
    return icons[callSign?.toUpperCase()?.includes('COMMANDER') ? 'FIELD_COMMANDER' : 'RECRUIT'] || icons.RECRUIT
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
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
            Tactical Training for GED Recovery
          </motion.p>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-600 rounded-2xl p-8 shadow-2xl">
          {/* Step 1: Email Collection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-2">1.</span>
                WARRIOR REGISTRATION
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    FULL NAME
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    EMAIL ADDRESS
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (formData.name.trim() && formData.email.trim()) {
                    setStep(2)
                  }
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-lg"
              >
                CONTINUE TO CALL SIGN
              </motion.button>
            </motion.div>
          )}

          {/* Step 2: Call Sign Selection */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-2">2.</span>
                CHOOSE YOUR CALL SIGN
              </h2>
              
              <div className="space-y-4">
                <p className="text-gray-300 mb-4">
                  Your Call Sign is your warrior identity. This will be displayed in the top-right corner of your HUD and used to track your progress.
                </p>
                
                <div>
                  <label htmlFor="callSign" className="block text-sm font-medium text-gray-300 mb-2">
                    CALL SIGN (Warrior Name)
                  </label>
                  <input
                    id="callSign"
                    type="text"
                    value={formData.callSign}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, callSign: e.target.value }))
                      setCallSignError('') // Clear error when user types
                    }}
                    placeholder="Enter your warrior name..."
                    className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg uppercase ${
                      callSignError ? 'border-red-500' : 'border-slate-600'
                    }`}
                    maxLength={20}
                    autoFocus
                  />
                  {callSignError && (
                    <p className="mt-2 text-sm text-red-400">{callSignError}</p>
                  )}
                </div>
                
                {/* Call Sign Suggestions */}
                <div className="mt-6 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">POPULAR CALL SIGNS</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {['Shadow', 'Viper', 'Phoenix', 'Titan', 'Eagle', 'Wolf'].map(sign => (
                      <button
                        key={sign}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, callSign: sign }))}
                        className={`p-3 bg-slate-700 border border-slate-600 rounded-lg text-left hover:bg-slate-600 transition-colors ${
                          formData.callSign === sign ? 'bg-blue-600 border-blue-500' : ''
                        }`}
                      >
                        <span className="text-lg mr-2">{getRankIcon(sign)}</span>
                        <span>{sign}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || !formData.callSign.trim()}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold text-lg transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'SETTING UP YOUR MISSION...' : 'BEGIN TRAINING'}
              </motion.button>
            </motion.div>
          )}
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

export default OnboardingScreen
