import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getCommanderDashboardData, checkSectorLock } from '../services/syncService'
import { supabase } from '../services/supabase'

const CommanderDashboard = () => {
  const [totalCompletions, setTotalCompletions] = useState(0)
  const [lifetimeWealth, setLifetimeWealth] = useState(0)
  const [annualWageBoost, setAnnualWageBoost] = useState(0)
  const [ghostProtocolAlerts, setGhostProtocolAlerts] = useState([])
  const [medalForgeStatus, setMedalForgeStatus] = useState({
    sector1: { completed: 0, total: 15, label: 'Foundations', description: 'Fractions, Decimals, Ratios' },
    sector2: { completed: 0, total: 8, label: 'Algebra', description: 'The Strategic Core' },
    sector3: { completed: 0, total: 7, label: 'Applied Math', description: 'Geometry and Final Boss Word Problem Decoding' }
  })
  const [systemicProgress, setSystemicProgress] = useState(0)

  // Calculate economic metrics
  useEffect(() => {
    const wealth = totalCompletions * 266760
    const wageBoost = totalCompletions * 8892
    setLifetimeWealth(wealth)
    setAnnualWageBoost(wageBoost)
  }, [totalCompletions])

  // Calculate systemic progress toward 100,000 goal
  useEffect(() => {
    const progress = (totalCompletions / 100000) * 100
    setSystemicProgress(Math.min(progress, 100))
  }, [totalCompletions])

  // Fetch dashboard data
  useEffect(() => {
    const loadCommanderData = async () => {
      try {
        const data = await getCommanderDashboardData()
        
        if (!data.error) {
          setTotalCompletions(data.totalMedals || 0)
          
          // Generate Ghost Protocol alerts based on friction data
          const alerts = []
          data.topFriction?.forEach(concept => {
            if (concept.count > 2) { // More than 2 failures
              alerts.push({
                concept: concept.concept,
                failureCount: concept.count,
                probabilityDrop: '60%',
                status: 'Intervention Required: Identity Protection Active',
                severity: 'critical',
                timestamp: new Date().toISOString()
              })
            }
          })
          setGhostProtocolAlerts(alerts)
        } else {
          console.error('Failed to load commander data:', data.error)
        }
      } catch (error) {
        console.error('Commander data load error:', error)
      }
    }

    loadCommanderData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadCommanderData, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <style jsx>{`
        .commander-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .glow-gold {
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        .glow-purple {
          text-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
        }
        .glow-cyan {
          text-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
        }
        .glassmorphism {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .neon-border {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }
        .boot-sequence {
          animation-delay: calc(var(--stagger) * 0.1s);
        }
        .drop-shadow-lg {
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <motion.h1
            className="text-6xl font-bold text-yellow-400 glow-gold commander-text"
            style={{ '--stagger': 0 }}
          >
            COMMANDER DASHBOARD
          </motion.h1>
          <motion.div
            className="text-gray-400 text-sm commander-text uppercase tracking-widest"
            style={{ '--stagger': 0.1 }}
          >
            MISSION CONTROL CENTER
          </motion.div>
        </motion.div>

        {/* Systemic Shift Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism rounded-2xl p-8 neon-border"
          style={{ '--stagger': 0.2 }}
        >
          <div className="text-center mb-6">
            <motion.h2
              className="text-3xl font-bold text-purple-300 glow-purple mb-2"
            >
              SYSTEMIC SHIFT GAUGE
            </motion.h2>
            <motion.p
              className="text-gray-400 text-sm mb-4"
            >
              The 100K Goal: Target 10% of Annual GED Math Failure Pipeline
            </motion.p>
            <motion.p
              className="text-xs text-gray-500 uppercase tracking-wider mb-6"
            >
              The Why: 22 million adults are currently locked out of the 2026 labor market; this gauge tracks our reclamation of that territory.
            </motion.p>
          </div>
          
          <div className="relative w-full h-12 bg-slate-800 rounded-full overflow-hidden mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${systemicProgress}%` }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 rounded-full relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-lg drop-shadow-lg">
                  {systemicProgress.toFixed(1)}%
                </span>
              </div>
              {/* Milestone markers */}
              <div className="absolute top-2 left-1/4 w-1/4 h-1/4 bg-yellow-400 rounded-full" style={{ left: '10%' }} />
              <div className="absolute top-2 left-1/4 w-1/4 h-1/4 bg-yellow-400 rounded-full" style={{ left: '25%' }} />
              <div className="absolute top-2 left-1/4 w-1/4 h-1/4 bg-yellow-400 rounded-full" style={{ left: '50%' }} />
              <div className="absolute top-2 left-1/4 w-1/4 h-1/4 bg-yellow-400 rounded-full" style={{ left: '75%' }} />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <motion.div
                style={{ '--stagger': 0.3 }}
                className="text-4xl font-bold text-white"
              >
                {totalCompletions.toLocaleString()}
              </motion.div>
              <div className="text-gray-400 text-sm commander-text uppercase">
                Warriors Served
              </div>
            </div>
            <div>
              <motion.div
                style={{ '--stagger': 0.4 }}
                className="text-4xl font-bold text-cyan-300 glow-cyan"
              >
                100,000
              </motion.div>
              <div className="text-gray-400 text-sm commander-text uppercase">
                Annual Target
              </div>
            </div>
            <div>
              <motion.div
                style={{ '--stagger': 0.5 }}
                className="text-4xl font-bold text-yellow-400 glow-gold"
              >
                {systemicProgress.toFixed(1)}%
              </motion.div>
              <div className="text-gray-400 text-sm commander-text uppercase">
                Pipeline Progress
              </div>
            </div>
          </div>
        </motion.div>

        {/* Economic Reclamation Ticker */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism rounded-2xl p-8 neon-border"
          style={{ '--stagger': 0.3 }}
        >
          <motion.h2
            className="text-2xl font-bold text-cyan-300 glow-cyan mb-6"
          >
            LIFETIME WEALTH RECLAIMED
          </motion.h2>
          <motion.p
              className="text-gray-400 text-sm mb-2"
            >
              Completions × $266,760 (The 30-year career cost of missing a GED)
            </motion.p>
          
          <div className="space-y-6">
            <motion.div
              className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-gray-400">Total Completions:</span>
              <motion.span
                className="text-white font-bold text-xl"
              >
                {totalCompletions.toLocaleString()}
              </motion.span>
            </motion.div>
            <motion.div
              className="text-green-400 font-bold text-2xl"
              style={{ '--stagger': 0.4 }}
            >
                {formatCurrency(lifetimeWealth)}
              </motion.div>
            </motion.div>
            
            <motion.div
              className="flex justify-between items-center p-4 bg-slate-800/50 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-gray-400">Annual Earnings Boost:</span>
              <motion.span
                className="text-green-400 font-bold text-2xl"
                style={{ '--stagger': 0.5 }}
              >
                {formatCurrency(annualWageBoost)}
              </motion.span>
            </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Ghost Protocol Live Feed */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism rounded-2xl p-8 neon-border"
          style={{ '--stagger': 0.4 }}
        >
          <motion.h2
            className="text-2xl font-bold text-red-400 mb-6 flex items-center"
          >
            ⚠️ CRITICAL FRICTION POINTS
          </motion.h2>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {ghostProtocolAlerts.length === 0 ? (
              <motion.div
                className="text-center text-gray-400 py-8"
                style={{ '--stagger': 0.5 }}
              >
                <motion.div
                  className="text-6xl mb-2"
                >
                  ✓
                </motion.div>
                <div>No Critical Friction Detected</div>
                <div className="text-sm">All systems operating within normal parameters</div>
              </motion.div>
            </motion.div>
            ) : (
              <div className="space-y-3">
                {ghostProtocolAlerts.map((alert, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`rounded-lg p-4 border ${
                      alert.severity === 'critical' ? 'bg-red-900/30 border-red-500/50' : 'bg-orange-900/30 border-orange-500/50'
                    } boot-sequence`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-white">{alert.concept}</div>
                        <div className="text-sm text-gray-300">{alert.failureCount} failures</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-bold ${
                          alert.severity === 'critical' ? 'text-red-400' : 'text-orange-400'
                        }`}>
                          {alert.probabilityDrop}
                        </div>
                        <div className={`text-xs ${
                          alert.severity === 'critical' ? 'text-red-300' : 'text-orange-300'
                        }`}>
                          probability drop
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${
                      alert.severity === 'critical' ? 'text-red-300' : 'text-orange-300'
                    }`}>
                      {alert.status}
                    </div>
                    <div className="text-xs text-gray-400">
                      {alert.why}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* The Territories: Medal Forge Board */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glassmorphism rounded-2xl p-8 neon-border"
          style={{ '--stagger': 0.5 }}
        >
          <motion.h2
            className="text-2xl font-bold text-yellow-400 glow-gold mb-6"
          >
            THE TERRITORIES: MEDAL FORGE BOARD
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(medalForgeStatus).map(([sector, data], index) => (
              <motion.div
                key={sector}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                className="glassmorphism rounded-lg p-6 border border-gray-600/30 boot-sequence"
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center mb-4">
                  <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">
                    Sector {sector.replace('sector', '')} 
                  </div>
                  <motion.div
                    className="text-2xl font-bold text-white"
                    style={{ '--stagger': 0.7 + (index * 0.1) }}
                  >
                    {data.label}
                  </motion.div>
                  <div className="text-xs text-gray-300">
                    {data.description}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Completed:</span>
                    <motion.span
                      className="text-sm font-bold text-green-400"
                      style={{ '--stagger': 0.8 + (index * 0.1) }}
                    >
                      {data.completed}
                    </motion.span>
                    <span className="text-sm text-gray-400"> / {data.total}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Progress:</span>
                    <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.completed / data.total) * 100}%` }}
                        transition={{ duration: 1, delay: 0.9 + (index * 0.1) }}
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Sector-specific accent colors */}
                <div className={`mt-4 p-3 rounded-lg border-2 ${
                  sector === 'sector1' ? 'border-purple-500/50 bg-purple-900/20' :
                  sector === 'sector2' ? 'border-cyan-500/50 bg-cyan-900/20' :
                  'border-orange-500/50 bg-orange-900/20'
                }`}>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      sector === 'sector1' ? 'text-purple-300 glow-purple' :
                      sector === 'sector2' ? 'text-cyan-300 glow-cyan' :
                      'text-orange-300'
                    }`}>
                      {data.completed} / {data.total}
                    </div>
                    <div className={`text-xs ${
                      sector === 'sector1' ? 'text-purple-400' :
                      sector === 'sector2' ? 'text-cyan-400' :
                      'text-orange-400'
                    }`}>
                      {sector === 'sector2' ? '(55% of exam—The Strategic Core)' : 'Final Boss Territory'}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CommanderDashboard
