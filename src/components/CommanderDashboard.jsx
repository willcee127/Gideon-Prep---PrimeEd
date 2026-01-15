import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCommanderDashboardData, checkSectorLock } from '../services/syncService'
import { supabase } from '../services/supabase'

const CommanderDashboard = () => {
  const [totalMedals, setTotalMedals] = useState(0)
  const [topFriction, setTopFriction] = useState([])
  const [activeWarriors, setActiveWarriors] = useState([])
  const [extractionHeatmap, setExtractionHeatmap] = useState([])
  const [gritFeed, setGritFeed] = useState([])
  const [safetyValveLog, setSafetyValveLog] = useState([])

  // Fetch extraction heatmap data
  const fetchExtractionHeatmap = async () => {
    try {
      const { data: intelData } = await supabase
        .from('users')
        .select('intel_unlocked')

      const conceptCounts = {}
      const totalUsers = intelData?.length || 0

      intelData?.forEach(user => {
        if (user.intel_unlocked) {
          user.intel_unlocked.forEach(intel => {
            const concept = intel.concept_id
            conceptCounts[concept] = (conceptCounts[concept] || 0) + 1
          })
        }
      })

      const heatmap = Object.entries(conceptCounts)
        .map(([concept, count]) => ({
          concept: concept.replace('_', ' ').toUpperCase(),
          count,
          failureRate: (count / totalUsers) * 100,
          isHighFailure: (count / totalUsers) > 0.5
        }))
        .sort((a, b) => b.failureRate - a.failureRate)

      setExtractionHeatmap(heatmap)
    } catch (error) {
      console.error('Extraction heatmap fetch error:', error)
    }
  }

  // Fetch grit feed (recent medals)
  const fetchGritFeed = async () => {
    try {
      const { data: usersData } = await supabase
        .from('users')
        .select('call_sign, medals_earned, updated_at')
        .not('medals_earned', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(10)

      const feed = []
      usersData?.forEach(user => {
        if (user.medals_earned && user.medals_earned.length > 0) {
          user.medals_earned.forEach(medal => {
            feed.push({
              call_sign: user.call_sign,
              medal: medal.replace('_', ' ').toUpperCase(),
              timestamp: user.updated_at
            })
          })
        }
      })

      setGritFeed(feed.slice(0, 10))
    } catch (error) {
      console.error('Grit feed fetch error:', error)
    }
  }

  // Fetch safety valve log
  const fetchSafetyValveLog = async () => {
    try {
      const { data: lockedUsers } = await supabase
        .from('users')
        .select('call_sign, lock_reason, locked_at, starting_sector')
        .eq('sector_locked', true)
        .order('locked_at', { ascending: false })

      setSafetyValveLog(lockedUsers || [])
    } catch (error) {
      console.error('Safety valve log fetch error:', error)
    }
  }

  // Mock data - would come from Supabase
  const mockData = {
    totalMedals: 47,
    topFriction: [
      { concept: 'Division', count: 23 },
      { concept: 'Linear Equations', count: 18 },
      { concept: 'Fraction Operations', count: 15 }
    ],
    activeWarriors: [
      { call_sign: 'WOLF_07', combat_power: 850 },
      { call_sign: 'EAGLE_12', combat_power: 720 },
      { call_sign: 'TIGER_03', combat_power: 680 }
    ]
  }

  useEffect(() => {
    const loadCommanderData = async () => {
      try {
        const data = await getCommanderDashboardData()
        
        if (!data.error) {
          setTotalMedals(data.totalMedals)
          setTopFriction(data.topFriction)
          setActiveWarriors(data.activeWarriors)
        } else {
          console.error('Failed to load commander data:', data.error)
        }

        // Load additional data
        await Promise.all([
          fetchExtractionHeatmap(),
          fetchGritFeed(),
          fetchSafetyValveLog()
        ])
      } catch (error) {
        console.error('Commander data load error:', error)
      }
    }

    loadCommanderData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadCommanderData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <style jsx>{`
        .commander-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
        .glow-gold {
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        .command-panel {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 215, 0, 0.2);
        }
        .gold-accent {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1));
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-yellow-400 glow-gold commander-text mb-2">
            COMMANDER DASHBOARD
          </h1>
          <div className="text-gray-400 text-sm commander-text uppercase tracking-widest">
            STRATEGIC OPERATIONS CENTER
          </div>
        </div>

        {/* Total Medals Forged */}
        <div className="command-panel rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-yellow-400 glow-gold commander-text mb-6">
            TOTAL MEDALS FORGED
          </h2>
          
          <div className="text-center">
            <div className="text-6xl font-bold text-yellow-300 commander-text">
              {totalMedals}
            </div>
            <div className="text-gray-400 text-sm commander-text uppercase tracking-widest">
              ACROSS ALL WARRIORS
            </div>
          </div>
        </div>

        {/* Extraction Heatmap */}
        <div className="command-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-400 glow-gold commander-text mb-4">
            EXTRACTION HEATMAP
          </h2>
          
          <div className="space-y-2">
            {extractionHeatmap.map((item, index) => (
              <div key={index} className={`rounded-lg p-3 ${
                item.isHighFailure 
                  ? 'bg-red-900/30 border border-red-500/50' 
                  : 'gold-accent'
              }`}>
                <div className="flex justify-between items-center">
                  <div className={`font-bold commander-text ${
                    item.isHighFailure ? 'text-red-400' : 'text-white'
                  }`}>
                    {item.concept}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`text-sm commander-text ${
                      item.isHighFailure ? 'text-red-300' : 'text-yellow-400'
                    }`}>
                      {item.count} unlocks
                    </div>
                    <div className={`text-sm font-bold commander-text ${
                      item.isHighFailure ? 'text-red-400' : 'text-yellow-400'
                    }`}>
                      {item.failureRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
                {item.isHighFailure && (
                  <div className="text-red-300 text-xs commander-text mt-1">
                    HIGH FAILURE RATE - Requires Intervention
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* The Grit Feed */}
        <div className="command-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-400 glow-gold commander-text mb-4">
            THE GRIT FEED
          </h2>
          
          <div className="space-y-2">
            {gritFeed.map((item, index) => (
              <div key={index} className="gold-accent rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="text-white font-bold commander-text">
                    {item.call_sign}
                  </div>
                  <div className="text-yellow-400 text-sm commander-text">
                    {item.medal}
                  </div>
                </div>
                <div className="text-gray-400 text-xs commander-text">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Valve Log */}
        <div className="command-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-400 glow-gold commander-text mb-4">
            SAFETY VALVE LOG
          </h2>
          
          <div className="space-y-2">
            {safetyValveLog.map((user, index) => (
              <div key={index} className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="text-red-400 font-bold commander-text">
                    {user.call_sign}
                  </div>
                  <div className="text-red-300 text-sm commander-text">
                    Sector {user.starting_sector}
                  </div>
                </div>
                <div className="text-red-300 text-xs commander-text">
                  {user.lock_reason}
                </div>
                <div className="text-gray-400 text-xs commander-text">
                  {new Date(user.locked_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Overview */}
        <div className="command-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-400 glow-gold commander-text mb-4">
            STRATEGIC OVERVIEW
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-yellow-400 text-2xl font-bold commander-text">
                {activeWarriors.length}
              </div>
              <div className="text-gray-400 text-sm commander-text uppercase tracking-widest">
                Active Warriors
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-yellow-400 text-2xl font-bold commander-text">
                {topFriction.reduce((sum, item) => sum + item.count, 0)}
              </div>
              <div className="text-gray-400 text-sm commander-text uppercase tracking-widest">
                Total Intel Unlocks
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-yellow-400 text-2xl font-bold commander-text">
                {Math.round(totalMedals / activeWarriors.length)}
              </div>
              <div className="text-gray-400 text-sm commander-text uppercase tracking-widest">
                Avg Medals Per Warrior
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommanderDashboard
