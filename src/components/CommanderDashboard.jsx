import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCommanderDashboardData, checkSectorLock } from '../services/syncService'
import { supabase } from '../services/supabase'

const CommanderDashboard = () => {
  const [totalCompletions, setTotalCompletions] = useState(0)
  const [lifetimeWealth, setLifetimeWealth] = useState(0)
  const [annualWageBoost, setAnnualWageBoost] = useState(0)
  const [ghostProtocolAlerts, setGhostProtocolAlerts] = useState([])
  const [medalForgeStatus, setMedalForgeStatus] = useState({
    phase01: { completed: 0, total: 15, label: 'Foundations' },
    phase02: { completed: 0, total: 8, label: 'Algebra' },
    phase03: { completed: 0, total: 7, label: 'Applied Math' }
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
        }
        .neon-border {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold text-yellow-400 glow-gold commander-text mb-2"
          >
            COMMANDER DASHBOARD
          </motion.h1>
          <div className="text-gray-400 text-sm commander-text uppercase tracking-widest">
            SYSTEMIC OPERATIONS CENTER
          </div>
        </div>

        {/* Mission Progress Gauge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism rounded-2xl p-8 neon-border"
        >
          <h2 className="text-2xl font-bold text-purple-300 glow-purple mb-6 text-center">
            Systemic Shift: Target 10% of Annual GED Math Failure Pipeline
          </h2>
          
          <div className="relative w-full h-8 bg-slate-800 rounded-full overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${systemicProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {systemicProgress.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white">
                {totalCompletions.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm commander-text uppercase">
                Warriors Served
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-300 glow-cyan">
                100,000
              </div>
              <div className="text-gray-400 text-sm commander-text uppercase">
                Annual Target
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 glow-gold">
                {systemicProgress.toFixed(1)}%
              </div>
              <div className="text-gray-400 text-sm commander-text uppercase">
                Pipeline Progress
              </div>
            </div>
          </div>
        </motion.div>

        {/* Economic Reclamation Ticker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism rounded-2xl p-6 neon-border"
        >
          <h2 className="text-xl font-bold text-cyan-300 glow-cyan mb-4">
            Total Lifetime Wealth Reclaimed
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Completions:</span>
              <span className="text-white font-bold">{totalCompletions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Lifetime Wealth:</span>
              <span className="text-green-400 font-bold text-xl">{formatCurrency(lifetimeWealth)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Annual Wage Boost:</span>
              <span className="text-green-400 font-bold text-xl">{formatCurrency(annualWageBoost)}</span>
            </div>
          </div>
        </motion.div>

        {/* Ghost Protocol Friction Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism rounded-2xl p-6 neon-border"
        >
          <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center">
            ⚠️ Critical Friction Points
          </h2>
          
          <div className="space-y-3">
            {ghostProtocolAlerts.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-2xl mb-2">✓</div>
                <div>No Critical Friction Detected</div>
                <div className="text-sm">All systems operating within normal parameters</div>
              </div>
            ) : (
              ghostProtocolAlerts.map((alert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`rounded-lg p-4 border ${
                    alert.severity === 'critical' ? 'bg-red-900/30 border-red-500/50' : 'bg-orange-900/30 border-orange-500/50'
                  }`}
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
                    {new Date(alert.timestamp).toLocaleString()}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Medal Forge Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glassmorphism rounded-2xl p-6 neon-border"
        >
          <h2 className="text-xl font-bold text-yellow-400 glow-gold mb-6">
            Medal Forge Status
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(medalForgeStatus).map(([phase, data], index) => (
              <motion.div
                key={phase}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                className="glassmorphism rounded-lg p-4 border border-gray-600/30"
              >
                <div className="text-center mb-3">
                  <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">
                    Phase {phase.replace('phase', '').padStart(2, '0')}
                  </div>
                  <div className="text-lg font-bold text-white mb-1">
                    {data.label}
                  </div>
                  <div className="text-xs text-gray-300">
                    {data.total === 55 ? '(55% of exam)' : `(${data.total} territories)`}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Completed:</span>
                    <span className="text-sm font-bold text-green-400">{data.completed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Total:</span>
                    <span className="text-sm font-bold">{data.total}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(data.completed / data.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 + (index * 0.1) }}
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Strategic Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="glassmorphism rounded-2xl p-6 neon-border"
        >
          <h2 className="text-xl font-bold text-purple-300 glow-purple mb-4">
            Strategic Overview
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-white">
                {totalCompletions.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">
                Total Completions
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-cyan-300 glow-cyan">
                {ghostProtocolAlerts.length}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">
                Active Alerts
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400 glow-gold">
                {Object.values(medalForgeStatus).reduce((sum, phase) => sum + phase.completed, 0)}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">
                Medals Forged
              </div>
            </div>
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(lifetimeWealth)}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">
                Wealth Reclaimed
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CommanderDashboard
