import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import AuraPowerBar from '../components/AuraPowerBar'

const AuraProfile = () => {
  const [growthLog, setGrowthLog] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [powerBarWidth, setPowerBarWidth] = useState(0)
  
  const identityData = JSON.parse(localStorage.getItem('gideon_identity_data') || '{}')

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 0 0 0 rgba(0, 255, 255, 0)",
        "0 0 0 0 rgba(0, 255, 255, 0)",
        "0 0 0 0 rgba(0, 255, 255, 0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  useEffect(() => {
    const fetchGrowthLog = async () => {
      try {
        const userId = localStorage.getItem('gideon_user_id')
        if (!userId) {
          setIsLoading(false)
          return
        }

        const { data: profileUpdates, error } = await supabase
          .from('profile_updates')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Growth log fetch error:', error)
          setGrowthLog([])
        } else {
          setGrowthLog(profileUpdates || [])
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Growth log error:', error)
        setIsLoading(false)
      }
    }

    fetchGrowthLog()
    const timer = setTimeout(() => setPowerBarWidth(75), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-8"
          >
            <div className="inline-block">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative inline-block"
              >
                <div className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-3 rounded-full shadow-2xl border-2 border-white/30 backdrop-blur-lg relative overflow-hidden">
                  <div className="flex items-center space-x-3 relative z-10">
                    <span className="text-2xl font-black">✨</span>
                    <div>
                      <div className="text-lg font-bold relative">LEVEL 3</div>
                      <div className="text-sm opacity-80">AURA</div>
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full bg-white/20 rounded-full blur-sm"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <h1 className="text-5xl font-black text-purple-400 mt-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            AURA COMMAND CENTER
          </h1>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-[0_0_20px_rgba(0,242,255,0.3)]"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 mx-auto">
                {identityData.callSign || 'WARRIOR'}
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 font-mono text-sm">CALL SIGN</p>
                <p className="text-2xl font-black text-purple-400">{identityData.callSign || 'WARRIOR'}</p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-purple-400 mb-4">COMBAT POWER</h3>
              <div className="relative">
                <motion.div
                  variants={pulseVariants}
                  animate={identityData.combat_power > 80 ? "pulse" : "static"}
                  style={{ width: `${identityData.combat_power}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-400">0%</span>
                  <span className="text-sm font-bold text-purple-400">{identityData.combat_power}%</span>
                  <span className="text-sm text-gray-400">100%</span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-[0_0_20px_rgba(0,242,255,0.3)] lg:col-span-2"
          >
            <h3 className="text-lg font-bold text-purple-400 mb-4">GROWTH LOG</h3>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p className="text-purple-300">Loading growth history...</p>
              </div>
            ) : growthLog.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {growthLog.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-300 font-mono text-sm">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-white font-semibold">
                          {entry.achievement || 'Level Progress'}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-purple-400 font-mono text-xs">
                          +{entry.power_gained || 0} POWER
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No growth history available</p>
                <p className="text-purple-300 text-sm mt-2">Complete missions to build your growth log</p>
              </div>
            )}
          </motion.div>
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-black text-purple-400 mb-2">12</div>
              <p className="text-gray-600 font-mono text-sm">MISSIONS</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-black text-purple-400 mb-2">5</div>
              <p className="text-gray-600 font-mono text-sm">CHALLENGE</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center"
            >
              <div className="text-3xl font-black text-purple-400 mb-2">87%</div>
              <p className="text-gray-600 font-mono text-sm">ACCURACY</p>
            </motion.div>
          </div>
        </div>
      </AnimatePresence>
    </div>
  )
}

export default AuraProfile
