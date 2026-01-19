import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const AuraProfile = () => {
  const [growthLog, setGrowthLog] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Get identity data from global state (passed via context or props)
  const identityData = JSON.parse(localStorage.getItem('gideon_identity_data') || '{}')

  useEffect(() => {
    const fetchGrowthLog = async () => {
      try {
        const userId = localStorage.getItem('gideon_user_id')
        if (!userId) {
          setIsLoading(false)
          return
        }

        // Fetch recent profile updates from Supabase
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
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto space-y-8"
      >
        {/* Header with Identity Display */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-purple-400 mb-2" style={{ fontFamily: 'Oswald, sans-serif' }}>
            AURA HUB
          </h1>
          <div className="bg-purple-900/30 border border-purple-500/50 rounded-2xl p-6 inline-block">
            <div className="text-2xl font-black text-purple-400">
              {identityData.callSign || 'WARRIOR'}
            </div>
            <div className="mt-4 text-purple-300">
              <span className="font-mono text-sm">LVL 3 AURA</span>
            </div>
          </div>
        </div>

        {/* Power Progress */}
        <div className="bg-black/60 border border-purple-500/30 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            COMBAT POWER
          </h2>
          <div className="w-full bg-purple-900/50 rounded-lg h-4 mb-2">
            <div className="bg-purple-600 h-full rounded-lg" style={{ width: '75%' }}>
              <div className="h-full flex items-center justify-center text-white font-mono text-xs">
                AURA POWER
              </div>
            </div>
          </div>
        </div>

        {/* Growth Log */}
        <div className="bg-black/60 border border-purple-500/30 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-purple-400 mb-4" style={{ fontFamily: 'Oswald, sans-serif' }}>
            GROWTH LOG
          </h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-purple-300">Loading growth history...</p>
            </div>
          ) : growthLog.length > 0 ? (
            <div className="space-y-3">
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
            <div className="text-center py-8">
              <p className="text-gray-400">No growth history available</p>
              <p className="text-purple-300 text-sm mt-2">Complete missions to build your growth log</p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/60 border border-purple-500/30 rounded-2xl p-4">
            <h3 className="text-purple-400 font-bold mb-2">MISSIONS</h3>
            <p className="text-3xl font-black text-white">12</p>
          </div>
          <div className="bg-black/60 border border-purple-500/30 rounded-2xl p-4">
            <h3 className="text-purple-400 font-bold mb-2">STREAK</h3>
            <p className="text-3xl font-black text-white">5</p>
          </div>
          <div className="bg-black/60 border border-purple-500/30 rounded-2xl p-4">
            <h3 className="text-purple-400 font-bold mb-2">ACCURACY</h3>
            <p className="text-3xl font-black text-white">87%</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AuraProfile
