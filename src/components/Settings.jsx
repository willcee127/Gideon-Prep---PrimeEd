import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useSessionSync from '../hooks/useSessionSync'

const Settings = () => {
  const navigate = useNavigate()
  const { sessionData, setSessionData } = useSessionSync()
  const [callSign, setCallSign] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [userId, setUserId] = useState(null)

  // Initialize with current call sign
  useEffect(() => {
    const currentCallSign = sessionData?.userName || localStorage.getItem('gideon_call_sign') || 'Scholar'
    setCallSign(currentCallSign)
    
    // Get user ID from localStorage or session
    const storedUserId = localStorage.getItem('gideon_user_id') || sessionData?.user_id
    setUserId(storedUserId)
  }, [sessionData])

  const handleUpdateCallSign = async () => {
    if (!callSign.trim()) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(''), 3000)
      return
    }

    setIsLoading(true)
    setSaveStatus('')

    try {
      // Update Supabase profiles table
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          call_sign: callSign.trim()
        })
        .eq('id', userId)

      if (error) {
        console.error('Failed to update call sign:', error)
        setSaveStatus('error')
        return
      }

      // Update local sessionData so the header changes immediately
      setSessionData(prev => ({ ...prev, userName: callSign.trim() }))
      
      // Update localStorage
      localStorage.setItem('gideon_call_sign', callSign.trim())
      
      setSaveStatus('success')
      console.log('Call sign updated successfully:', callSign.trim())
      
      // Navigate back after successful save
      setTimeout(() => {
        navigate('/mastery-map')
      }, 1500)

    } catch (error) {
      console.error('Error updating call sign:', error)
      setSaveStatus('error')
    } finally {
      setIsLoading(false)
      setTimeout(() => setSaveStatus(''), 3000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUpdateCallSign()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="max-w-md w-full"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-cyan-500/30 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-cyan-400 mb-2">Warrior Settings</h1>
            <p className="text-gray-400 text-sm">Update your Call Sign for the battlefield</p>
          </div>

          {/* Call Sign Input */}
          <div className="mb-6">
            <label className="block text-cyan-300 text-sm font-semibold mb-3">
              CALL SIGN
            </label>
            <div className="relative">
              <input
                type="text"
                value={callSign}
                onChange={(e) => setCallSign(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your warrior call sign..."
                className="w-full px-4 py-3 bg-slate-800 border-2 border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300"
                style={{
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)',
                }}
              />
              
              {/* Neon glow effect */}
              <div 
                className="absolute inset-0 rounded-lg pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, transparent, rgba(6, 182, 212, 0.1), transparent)',
                  animation: 'pulse 2s infinite',
                }}
              />
            </div>
          </div>

          {/* Status Messages */}
          {saveStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm"
            >
              ✓ Call sign updated successfully! Redirecting...
            </motion.div>
          )}

          {saveStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
            >
              ✗ Failed to update call sign. Please try again.
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdateCallSign}
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
              style={{
                boxShadow: '0 4px 20px rgba(6, 182, 212, 0.3)',
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/mastery-map')}
              className="px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 transition-all duration-300"
            >
              Cancel
            </motion.button>
          </div>

          {/* Current Status */}
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-gray-400 text-xs mb-1">Current Status</p>
            <p className="text-cyan-300 text-sm">
              User ID: {userId || 'Not set'}
            </p>
            <p className="text-cyan-300 text-sm">
              Current Call Sign: {sessionData?.userName || 'Scholar'}
            </p>
          </div>
        </div>

        {/* Back Navigation */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/mastery-map')}
            className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors duration-200"
          >
            ← Back to Mission
          </button>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}

export default Settings
