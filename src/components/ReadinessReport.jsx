import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const ReadinessReport = ({ isVisible, onClose, profileId }) => {
  const [readinessData, setReadinessData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isVisible && profileId) {
      fetchReadinessData()
    }
  }, [isVisible, profileId])

  const fetchReadinessData = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('final_readiness_summary')
        .select('*')
        .eq('profile_id', profileId)
        .single()

      if (error) {
        console.error('Failed to fetch readiness data:', error)
        setReadinessData(null)
        return
      }

      setReadinessData(data)
      console.log('Readiness data loaded:', data)
    } catch (error) {
      console.error('Unexpected error fetching readiness data:', error)
      setReadinessData(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isVisible) return null

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <div className="bg-black/90 border border-orange-400 rounded-2xl p-8 max-w-2xl mx-4">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-400 border-t-transparent mx-auto"></div>
            <p className="text-orange-400 text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
              LOADING READINESS REPORT...
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!readinessData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      >
        <div className="bg-black/90 border border-red-400 rounded-2xl p-8 max-w-2xl mx-4">
          <div className="text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <p className="text-red-400 text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
              READINESS DATA UNAVAILABLE
            </p>
            <p className="text-gray-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Unable to load your readiness summary. Please try again later.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const { full_name, call_sign, verve_missions, aura_missions, forge_missions, total_missions, readiness_score } = readinessData

  const isGedReady = forge_missions > 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ 
        type: "spring", 
        damping: 25, 
        stiffness: 300,
        duration: 0.8
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-600 rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #000000 100%)'
        }}
      >
        {/* Report Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            FINAL READINESS REPORT: {full_name} ({call_sign})
          </motion.h1>
          
          {isGedReady && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full"
            >
              <span className="font-bold text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
                GED READY
              </span>
            </motion.div>
          )}
        </div>

        {/* Readiness Score */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="inline-block bg-gray-800 border border-gray-600 rounded-lg px-6 py-3"
          >
            <div className="text-sm text-gray-400 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Overall Readiness
            </div>
            <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron, monospace' }}>
              {readiness_score}%
            </div>
          </motion.div>
        </div>

        {/* Mission Summary */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="text-sm text-gray-400"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Total Missions Completed: {total_missions}
          </motion.div>
        </div>

        {/* Mastery Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Verve Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border border-purple-400/50 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-purple-200 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L4 7V12C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 12V7L12 2Z" stroke="#E6E6FA" strokeWidth="2" fill="none"/>
                  <path d="M12 8L14 10L12 12L10 10L12 8Z" fill="#E6E6FA"/>
                </svg>
              </div>
              <h3 className="text-lg font-bold text-purple-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                VERVE
              </h3>
              <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron, monospace' }}>
                {verve_missions}
              </div>
              <p className="text-xs text-purple-400 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Recovery-Phase Missions
              </p>
            </div>
          </motion.div>

          {/* Aura Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.5 }}
            className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 border border-blue-400/50 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-200 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#7DF9FF" strokeWidth="2" fill="none"/>
                  <circle cx="12" cy="12" r="2" fill="#7DF9FF" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-blue-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                AURA
              </h3>
              <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron, monospace' }}>
                {aura_missions}
              </div>
              <p className="text-xs text-blue-400 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Growth-Phase Missions
              </p>
            </div>
          </motion.div>

          {/* Forge Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 border border-orange-400/50 rounded-xl p-6 backdrop-blur-sm"
          >
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-orange-200 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3L7 7L3 11L7 15L3 19L7 23L11 19L15 23L19 19L23 23L19 19L23 15L19 11L23 7L19 3L15 7L11 3L7 7L3 3Z" stroke="#FF8C00" strokeWidth="2" fill="none"/>
                  <rect x="10" y="10" width="4" height="4" fill="#FF8C00" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-orange-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                FORGE
              </h3>
              <div className="text-3xl font-bold text-white" style={{ fontFamily: 'Orbitron, monospace' }}>
                {forge_missions}
              </div>
              <p className="text-xs text-orange-400 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                Independent-Phase Missions
              </p>
            </div>
          </motion.div>
        </div>

        {/* Achievement Status */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="inline-block"
          >
            {isGedReady ? (
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  MISSION ACCOMPLISHED
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-400">
                <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  IN PROGRESS
                </span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.5 }}
            className="text-xs text-gray-500"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Generated on {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </motion.div>
        </div>

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.5 }}
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-2 shadow-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

export default ReadinessReport
