import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getUserProfile } from '../services/syncService'

const Dashboard = ({ callSign, onDeploy }) => {
  const [intelArchive, setIntelArchive] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  const medalDefinitions = [
    { id: 'basic_ops', name: 'Basic Ops', icon: '🔧', color: 'from-amber-700 to-amber-600' },
    { id: 'decimal_raider', name: 'Decimal Raider', icon: '⚡', color: 'from-gray-400 to-gray-300' },
    { id: 'percent_master', name: 'Percent Master', icon: '📊', color: 'from-yellow-600 to-yellow-500' },
    { id: 'algebra_initiate', name: 'Algebra Initiate', icon: '🧮', color: 'from-purple-400 to-purple-300' }
  ]

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load user profile from database
        const { data: profile, error } = await getUserProfile(callSign)
        
        if (!error && profile) {
          setUserProfile(profile)
          
          // Set intel archive from user's unlocked intel
          if (profile.intel_unlocked && profile.intel_unlocked.length > 0) {
            setIntelArchive(profile.intel_unlocked)
          }
        }
        
        setIsLoading(false)
      } catch (error) {
        console.error('Dashboard data load error:', error)
        setIsLoading(false)
      }
    }

    if (callSign) {
      loadDashboardData()
    }
  }, [callSign])

  const handleIntelClick = (intel) => {
    // Open video in modal or navigate to extraction
    console.log('Opening intel:', intel)
  }

  const getSectorName = (sector) => {
    const sectorNames = {
      1: 'WHOLE NUMBERS',
      2: 'BASIC ARITHMETIC',
      3: 'DECIMAL OPERATIONS',
      4: 'FRACTION BASICS',
      5: 'ADVANCED FRACTIONS',
      6: 'PERCENTAGE FUNDAMENTALS',
      7: 'RATIO PROBLEMS',
      8: 'ADVANCED PERCENTS',
      9: 'ALGEBRA BASICS',
      10: 'LINEAR EQUATIONS'
    }
    return sectorNames[sector] || 'UNKNOWN SECTOR'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-lavender-400 text-xl" style={{ fontFamily: 'Courier New, monospace' }}>
          LOADING COMMAND CENTER...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <style jsx>{`
        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
        .glow-lavender {
          text-shadow: 0 0 20px rgba(230, 230, 250, 0.5);
        }
        .war-room-panel {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(230, 230, 250, 0.2);
        }
        .medal-display {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(230, 230, 250, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.3);
        }
        .medal-earned {
          animation: medal-glow 2s infinite alternate-reverse;
        }
        @keyframes medal-glow {
          0% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
          100% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.6); }
        }
        .intel-item {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(230, 230, 250, 0.1);
          transition: all 0.3s ease;
        }
        .intel-item:hover {
          background: rgba(230, 230, 250, 0.1);
          border-color: rgba(230, 230, 250, 0.3);
          transform: translateY(-2px);
        }
        .deploy-button {
          background: linear-gradient(135deg, rgba(230, 230, 250, 0.2), rgba(230, 230, 250, 0.1));
          border: 2px solid rgba(230, 230, 250, 0.3);
          animation: deploy-pulse 2s infinite;
        }
        @keyframes deploy-pulse {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(230, 230, 250, 0.3);
            border-color: rgba(230, 230, 250, 0.3);
          }
          50% { 
            box-shadow: 0 0 30px rgba(230, 230, 250, 0.5);
            border-color: rgba(230, 230, 250, 0.5);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-lavender-400 glow-lavender warrior-text mb-2">
            COMMAND CENTER
          </h1>
          <div className="text-gray-400 text-sm warrior-text uppercase tracking-widest">
            HOME BASE // WARRIOR {callSign?.toUpperCase()}
          </div>
        </div>

        {/* Deployment Zone */}
        <div className="war-room-panel rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-lavender-400 glow-lavender warrior-text mb-6">
            DEPLOYMENT ZONE
          </h2>
          
          <div className="text-center space-y-4">
            <div className="text-white text-lg warrior-text">
              Current Mission: <span className="text-yellow-400 font-bold">SECTOR_{String(userProfile?.starting_sector || 1).padStart(2, '0')}</span>
            </div>
            <div className="text-gray-400 warrior-text">
              {getSectorName(userProfile?.starting_sector || 1)}
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDeploy(userProfile?.starting_sector || 1)}
              className="deploy-button w-full max-w-md mx-auto py-6 rounded-2xl text-white font-bold text-xl warrior-text transition-all"
            >
              🚀 DEPLOY TO {getSectorName(userProfile?.starting_sector || 1).toUpperCase()}
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Intel Archive */}
          <div className="war-room-panel rounded-2xl p-6">
            <h2 className="text-xl font-bold text-lavender-400 glow-lavender warrior-text mb-4">
              INTEL ARCHIVE
            </h2>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {intelArchive.map((intel) => (
                <motion.div
                  key={intel.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleIntelClick(intel)}
                  className="intel-item rounded-lg p-4 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="text-white font-bold warrior-text mb-1">
                        {intel.concept}
                      </div>
                      <div className="text-gray-400 text-xs warrior-text">
                        Duration: {intel.duration}
                      </div>
                    </div>
                    <div className="text-lavender-300 text-xs warrior-text">
                      {new Date(intel.viewedAt).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {intelArchive.length === 0 && (
                <div className="text-center py-8 text-gray-500 warrior-text">
                  No intel archived yet
                </div>
              )}
            </div>
          </div>

          {/* Medal Case */}
          <div className="war-room-panel rounded-2xl p-6">
            <h2 className="text-xl font-bold text-yellow-400 warrior-text mb-4" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5)' }}>
              MEDAL CASE
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              {medalDefinitions.map((medal) => {
                const isUnlocked = userProfile?.medals_earned?.includes(medal.id)
                return (
                  <div
                    key={medal.id}
                    className={`medal-display rounded-xl p-6 text-center transition-all duration-500 ${
                      isUnlocked ? 'medal-earned' : 'opacity-30'
                    }`}
                  >
                    <div className="text-4xl mb-3">
                      {isUnlocked ? medal.icon : '🔒'}
                    </div>
                    <div className={`text-sm font-bold warrior-text ${
                      isUnlocked ? 'text-white' : 'text-gray-500'
                    }`}>
                      {isUnlocked ? medal.name : 'LOCKED'}
                    </div>
                    {isUnlocked && (
                      <div className="text-yellow-400 text-xs warrior-text mt-2">
                        EARNED
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            
            <div className="mt-6 text-center">
              <div className="text-yellow-400 text-lg warrior-text">
                {userProfile?.medals_earned?.length || 0}/4 MEDALS EARNED
              </div>
              <div className="text-gray-400 text-sm warrior-text">
                Complete Range Qual to unlock more
              </div>
            </div>
          </div>
        </div>

        {/* Status Panel */}
        <div className="war-room-panel rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-lavender-400 text-2xl font-bold warrior-text">
                {userProfile?.starting_sector || 1}
              </div>
              <div className="text-gray-400 text-sm warrior-text uppercase tracking-widest">
                Current Sector
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-yellow-400 text-2xl font-bold warrior-text">
                {userProfile?.medals_earned?.length || 0}
              </div>
              <div className="text-gray-400 text-sm warrior-text uppercase tracking-widest">
                Medals Earned
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-green-400 text-2xl font-bold warrior-text">
                {intelArchive.length}
              </div>
              <div className="text-gray-400 text-sm warrior-text uppercase tracking-widest">
                Intel Archived
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
