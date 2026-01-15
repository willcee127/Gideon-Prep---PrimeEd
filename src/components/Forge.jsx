import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Forge = ({ startingSector, onSectorSelect }) => {
  const [unlockedMedals, setUnlockedMedals] = useState([])
  const [selectedSector, setSelectedSector] = useState(startingSector)

  // Medal definitions based on RangeQual performance
  const medalDefinitions = [
    { id: 'basic_ops', name: 'Basic Ops', requirement: 2, icon: '🔧', color: 'bronze' },
    { id: 'decimal_raider', name: 'Decimal Raider', requirement: 5, icon: '⚡', color: 'silver' },
    { id: 'percent_master', name: 'Percent Master', requirement: 8, icon: '📊', color: 'gold' },
    { id: 'algebra_initiate', name: 'Algebra Initiate', requirement: 10, icon: '🧮', color: 'platinum' }
  ]

  // Sector definitions
  const sectors = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `SECTOR_${String(i + 1).padStart(2, '0')}`,
    status: i + 1 < startingSector ? 'secured' : i + 1 === startingSector ? 'active' : 'locked'
  }))

  useEffect(() => {
    // Calculate unlocked medals based on starting sector
    const medals = medalDefinitions.filter(medal => startingSector >= medal.requirement)
    setUnlockedMedals(medals)
  }, [startingSector])

  const getMedalColor = (color) => {
    switch (color) {
      case 'bronze': return 'from-amber-700 to-amber-600'
      case 'silver': return 'from-gray-400 to-gray-300'
      case 'gold': return 'from-yellow-600 to-yellow-500'
      case 'platinum': return 'from-purple-400 to-purple-300'
      default: return 'from-gray-700 to-gray-600'
    }
  }

  const getSectorStatus = (status) => {
    switch (status) {
      case 'secured': return 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-500/50'
      case 'active': return 'bg-gradient-to-br from-lavender-500/20 to-lavender-600/20 border-lavender-500/50 animate-pulse'
      case 'locked': return 'bg-gray-800/50 border-gray-600/50'
      default: return 'bg-gray-800/50 border-gray-600/50'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <style jsx>{`
        .warrior-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }
        .glow-lavender {
          text-shadow: 0 0 20px rgba(230, 230, 250, 0.5);
        }
        .glow-gold {
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        .forge-panel {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(230, 230, 250, 0.2);
        }
        .medal-slot {
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 215, 0, 0.3);
        }
        .medal-unlocked {
          animation: medal-glow 2s infinite alternate-reverse;
        }
        @keyframes medal-glow {
          0% { box-shadow: 0 0 15px rgba(255, 215, 0, 0.3); }
          100% { box-shadow: 0 0 25px rgba(255, 215, 0, 0.6); }
        }
        .sector-secured {
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
        }
        .sector-active {
          box-shadow: 0 0 25px rgba(230, 230, 250, 0.5);
          animation: sector-pulse 2s infinite;
        }
        @keyframes sector-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-lavender-400 glow-lavender warrior-text mb-2">
            THE FORGE
          </h1>
          <div className="text-gray-400 text-sm warrior-text uppercase tracking-widest">
            MEDAL CASE & POWER GRID
          </div>
        </div>

        {/* Medal Rack */}
        <div className="forge-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-yellow-400 glow-gold warrior-text mb-4">
            LEGACY MEDALS
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {medalDefinitions.map((medal) => {
              const isUnlocked = unlockedMedals.some(m => m.id === medal.id)
              return (
                <div
                  key={medal.id}
                  className={`medal-slot rounded-lg p-4 text-center transition-all duration-500 ${
                    isUnlocked ? 'medal-unlocked' : 'opacity-30'
                  }`}
                >
                  <div className="text-3xl mb-2">
                    {isUnlocked ? medal.icon : '🔒'}
                  </div>
                  <div className={`text-sm font-bold warrior-text ${
                    isUnlocked ? 'text-white' : 'text-gray-500'
                  }`}>
                    {isUnlocked ? medal.name : 'LOCKED'}
                  </div>
                  {isUnlocked && (
                    <div className="text-xs text-yellow-400 warrior-text mt-1">
                      UNLOCKED
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Power Grid */}
        <div className="forge-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-lavender-400 glow-lavender warrior-text mb-4">
            SECTOR POWER GRID
          </h2>
          <div className="grid grid-cols-5 gap-4">
            {sectors.map((sector) => (
              <motion.div
                key={sector.id}
                whileHover={{ scale: sector.status !== 'locked' ? 1.05 : 1 }}
                whileTap={{ scale: sector.status !== 'locked' ? 0.95 : 1 }}
                onClick={() => sector.status !== 'locked' && onSectorSelect(sector.id)}
                className={`relative rounded-lg p-4 text-center cursor-pointer transition-all duration-300 border-2 ${
                  getSectorStatus(sector.status)
                } ${
                  sector.status === 'secured' ? 'sector-secured' :
                  sector.status === 'active' ? 'sector-active' : ''
                }`}
              >
                <div className="text-lg font-bold warrior-text mb-1">
                  {sector.name}
                </div>
                <div className="text-sm warrior-text">
                  {sector.status === 'secured' && '✅ SECURED'}
                  {sector.status === 'active' && '🎯 ACTIVE'}
                  {sector.status === 'locked' && '🔒 LOCKED'}
                </div>
                
                {/* Status indicator */}
                <div className="absolute top-2 right-2">
                  {sector.status === 'secured' && (
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  )}
                  {sector.status === 'active' && (
                    <div className="w-3 h-3 bg-lavender-400 rounded-full animate-pulse" />
                  )}
                  {sector.status === 'locked' && (
                    <div className="w-3 h-3 bg-gray-600 rounded-full" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mission Briefing */}
        <div className="forge-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white warrior-text mb-4">
            MISSION BRIEFING
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lavender-300 warrior-text">Starting Sector:</span>
              <span className="text-yellow-400 font-bold warrior-text">SECTOR_{String(startingSector).padStart(2, '0')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lavender-300 warrior-text">Medals Earned:</span>
              <span className="text-yellow-400 font-bold warrior-text">{unlockedMedals.length}/4</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lavender-300 warrior-text">Sectors Secured:</span>
              <span className="text-yellow-400 font-bold warrior-text">{startingSector - 1}/10</span>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => onSectorSelect(startingSector)}
              className="px-8 py-3 bg-gradient-to-r from-lavender-600 to-lavender-700 hover:from-lavender-700 hover:to-lavender-800 text-white rounded-lg font-bold transition-all transform hover:scale-105 warrior-text glow-lavender"
            >
              DEPLOY TO SECTOR_{String(startingSector).padStart(2, '0')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forge
