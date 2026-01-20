import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'

const CapstoneCertificate = ({ isVisible, onClose }) => {
  const [profileData, setProfileData] = useState(null)
  const [showCertificate, setShowCertificate] = useState(false)

  useEffect(() => {
    if (isVisible) {
      loadProfileData()
    }
  }, [isVisible])

  const loadProfileData = async () => {
    try {
      const profileId = localStorage.getItem('gideon_user_id')
      if (!profileId) {
        console.error('No profile ID found in localStorage')
        alert('Profile verification failed. Please restart your session.')
        onClose()
        return
      }

      // Validate UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      if (!uuidRegex.test(profileId)) {
        console.error('Invalid profile ID format:', profileId)
        alert('Profile verification failed. Invalid session data.')
        onClose()
        return
      }

      console.log('Loading profile data for ID:', profileId)

      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, call_sign, email, ai_support_level, current_streak, created_at, updated_at')
        .eq('id', profileId)
        .single()

      if (error) {
        console.error('Database error:', error)
        if (error.code === 'PGRST116') {
          alert('Profile not found. Please complete identity verification.')
        } else {
          alert('Failed to verify profile. Please try again.')
        }
        onClose()
        return
      }

      if (!data) {
        console.error('No profile data returned')
        alert('Profile data incomplete. Please contact support.')
        onClose()
        return
      }

      // Verify required fields
      if (!data.full_name || !data.call_sign) {
        console.error('Missing required profile fields:', data)
        alert('Profile incomplete. Please complete your identity information.')
        onClose()
        return
      }

      console.log('Profile data loaded successfully:', {
        id: data.id,
        call_sign: data.call_sign,
        full_name: data.full_name,
        ai_support_level: data.ai_support_level
      })

      // Check if student is GED Ready (Level 1 / Forge Certified)
      if (data.ai_support_level === 1) {
        setProfileData(data)
        setShowCertificate(true)
        
        // Save capstone achievement
        await saveCapstoneAchievement(data)
      } else {
        console.log('Student not yet GED Ready. Current level:', data.ai_support_level)
        alert(`Capstone Certificate requires Level 1 (Forge Certified). Current level: ${data.ai_support_level}`)
        onClose()
      }
    } catch (error) {
      console.error('Unexpected error in loadProfileData:', error)
      alert('An unexpected error occurred. Please try again.')
      onClose()
    }
  }

  const saveCapstoneAchievement = async (profile) => {
    try {
      const achievementData = {
        type: 'capstone_certificate',
        earned_at: new Date().toISOString(),
        ai_support_level: profile.ai_support_level,
        call_sign: profile.call_sign,
        full_name: profile.full_name,
        readiness_score: calculateReadinessScore(profile)
      }

      await supabase
        .from('profiles')
        .update({
          achievements: achievementData,
          capstone_earned: true
        })
        .eq('id', profile.id)

      console.log('Capstone achievement saved:', achievementData)
    } catch (error) {
      console.error('Failed to save capstone achievement:', error)
    }
  }

  const calculateReadinessScore = (profile) => {
    // Calculate readiness score based on various factors
    let score = 0
    
    // AI Support Level contribution (lower is better)
    score += (6 - profile.ai_support_level) * 20
    
    // Streak contribution
    score += Math.min(profile.current_streak * 10, 30)
    
    // Time-based contribution (simplified)
    score += 25 // Base completion score
    
    return Math.min(score, 100)
  }

  const getStageSummary = (currentLevel) => {
    const stages = [
      { level: 5, name: 'VERVE', description: 'Heavy Support - Building Foundation' },
      { level: 4, name: 'TRANSITION', description: 'Stabilizing - Growing Confidence' },
      { level: 3, name: 'AURA', description: 'Balanced - Finding Your Rhythm' },
      { level: 2, name: 'ADVANCEMENT', description: 'Advancing - Developing Independence' },
      { level: 1, name: 'FORGE', description: 'Independent - GED Ready' }
    ]
    
    return stages.filter(stage => stage.level >= currentLevel)
  }

  if (!showCertificate || !profileData) return null

  const readinessScore = calculateReadinessScore(profileData)
  const stageSummary = getStageSummary(profileData.ai_support_level)
  const certificateDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <AnimatePresence>
      {showCertificate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 300,
              duration: 0.8
            }}
            className="relative bg-gradient-to-br from-amber-50 to-orange-50 border-4 border-orange-400 rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl"
            style={{
              boxShadow: '0 25px 50px -12px rgba(251, 146, 60, 0.25)',
              background: 'linear-gradient(135deg, #fffbeb 0%, #fed7aa 100%)'
            }}
          >
            {/* Certificate Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-block"
              >
                <div className="text-6xl mb-4">🏆</div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-4xl font-bold text-orange-800 mb-2 certificate-title"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                GIDEON CAPSTONE CERTIFICATE
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-lg text-orange-600 font-semibold stage-label"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                GED READY • FORGE CERTIFIED
              </motion.div>
            </div>

            {/* Identity Section */}
            <div className="bg-white/60 rounded-lg p-6 mb-6 border-2 border-orange-300">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">
                    Legal Name
                  </p>
                  <p className="text-xl font-bold text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {profileData.full_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold uppercase tracking-wider mb-1">
                    Operator Designation
                  </p>
                  <p className="text-xl font-bold text-orange-600" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {profileData.call_sign}
                  </p>
                </div>
              </div>
            </div>

            {/* Readiness Score */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="inline-block bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full px-6 py-3 shadow-lg"
              >
                <div className="text-sm font-semibold uppercase tracking-wider" style={{ fontFamily: 'Orbitron, monospace' }}>Readiness Score</div>
                <div className="text-3xl font-bold">{readinessScore}%</div>
              </motion.div>
            </div>

            {/* Stage Summary */}
            <div className="bg-white/40 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-bold text-orange-800 mb-4 text-center" style={{ fontFamily: 'Orbitron, monospace' }}>
                Journey Progression
              </h3>
              <div className="space-y-3">
                {stageSummary.map((stage, index) => (
                  <motion.div
                    key={stage.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/60"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        stage.level <= profileData.ai_support_level 
                          ? 'bg-orange-500' 
                          : 'bg-gray-400'
                      }`}>
                        {6 - stage.level}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800" style={{ fontFamily: 'Orbitron, monospace' }}>{stage.name}</div>
                        <div className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{stage.description}</div>
                      </div>
                    </div>
                    {stage.level <= profileData.ai_support_level && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.3 + index * 0.1, duration: 0.3 }}
                        className="text-green-500 text-xl"
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certificate Footer */}
            <div className="text-center space-y-4">
              <div className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                <p>Issued on {certificateDate}</p>
                <p className="mt-1">Certificate ID: GID-{profileData.id?.slice(0, 8).toUpperCase()}</p>
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="text-xs text-gray-500 italic"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                "The territory is yours because you earned it, one rep at a time."
              </motion.div>
            </div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              onClick={() => {
                setShowCertificate(false)
                if (onClose) onClose()
              }}
              className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full p-2 shadow-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Forge Hammer Seal/Watermark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ delay: 2.2, duration: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                {/* Glow Effect */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 rounded-full"
                  style={{
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle, rgba(255, 140, 0, 0.4) 0%, rgba(255, 140, 0, 0.1) 50%, transparent 100%)',
                    filter: 'blur(20px)',
                    transform: 'translate(-50%, -50%)',
                    left: '50%',
                    top: '50%'
                  }}
                />
                
                {/* Hammer Icon */}
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="relative z-10"
                  style={{ transform: 'rotate(-15deg)' }}
                >
                  <path 
                    d="M3 3L7 7L3 11L7 15L3 19L7 23L11 19L15 23L19 19L23 23L19 19L23 15L19 11L23 7L19 3L15 7L11 3L7 7L3 3Z" 
                    stroke="#FF8C00" 
                    strokeWidth="1.5" 
                    fill="none"
                    opacity="0.8"
                  />
                  <rect 
                    x="10" 
                    y="10" 
                    width="4" 
                    height="4" 
                    fill="#FF8C00" 
                    opacity="0.6"
                  />
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="8" 
                    stroke="#FF8C00" 
                    strokeWidth="0.5" 
                    fill="none"
                    opacity="0.4"
                  />
                </svg>
                
                {/* FORGE CERTIFIED Text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  transition={{ delay: 2.5, duration: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: 'translate(-50%, -50%) rotate(-15deg)',
                    left: '50%',
                    top: '50%'
                  }}
                >
                  <div 
                    className="text-orange-600 font-bold text-xs"
                    style={{ 
                      fontFamily: 'Orbitron, monospace',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase'
                    }}
                  >
                    FORGE CERTIFIED
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(251, 146, 60, 0.1) 10px, rgba(251, 146, 60, 0.1) 20px)',
                borderRadius: '1rem'
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CapstoneCertificate
