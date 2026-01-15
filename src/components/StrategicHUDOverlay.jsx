import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const StrategicHUDOverlay = ({ 
  currentSector, 
  completedSectors = 0, 
  totalSectors = 10, 
  strikeReadiness = 0,
  gritMultiplier = 0,
  isSectorActive = true 
}) => {
  const [currentPhase, setCurrentPhase] = useState('PHASE_01')
  const [sectorWeight, setSectorWeight] = useState('HIGH (12% of EXAM)')

  // Calculate sector map pips
  const generateSectorMap = () => {
    const pips = []
    for (let i = 0; i < totalSectors; i++) {
      if (i < completedSectors) {
        pips.push('completed')
      } else if (i === completedSectors && isSectorActive) {
        pips.push('current')
      } else {
        pips.push('empty')
      }
    }
    return pips
  }

  const sectorMap = generateSectorMap()

  return (
    <>
      {/* CSS for HUD styling */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(230, 230, 250, 0.5); }
          50% { box-shadow: 0 0 20px rgba(230, 230, 250, 0.8); }
        }

        .hud-element {
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(230, 230, 250, 0.2);
          border-radius: 8px;
          font-family: 'Courier New', monospace;
        }

        .hud-text {
          font-family: 'Courier New', monospace;
          letter-spacing: 0.05em;
        }

        .glow-lavender {
          box-shadow: 0 0 15px rgba(230, 230, 250, 0.3);
        }

        .glow-gold {
          box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
        }

        .pip-completed {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
        }

        .pip-current {
          background: linear-gradient(135deg, #E6E6FA, #9370DB);
          animation: pulse 2s infinite;
          box-shadow: 0 0 12px rgba(230, 230, 250, 0.6);
        }

        .pip-empty {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .strike-progress {
          background: linear-gradient(90deg, #E6E6FA 0%, #FFD700 100%);
          box-shadow: 0 0 20px rgba(230, 230, 250, 0.4);
        }
      `}</style>

      {/* Mission Identity - Top Left */}
      <div className="fixed top-4 left-4 z-40 hud-element px-4 py-3 glow-lavender">
        <div className="text-lavender-400 text-xs font-bold hud-text uppercase tracking-widest">
          OPERATIONS // MATH RECOVERY
        </div>
        <div className="text-white text-sm font-bold hud-text">
          {currentPhase} // SECTOR_ACTIVE
        </div>
        <div className="text-gray-500 text-xs hud-text mt-1">
          [LOCKED] PHASE_02: RLA | [LOCKED] PHASE_03: OUTBOARDING
        </div>
      </div>

      {/* Intelligence Tags - Top Right */}
      <div className="fixed top-4 right-4 z-40 hud-element px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Sector Weight Badge */}
          <div className="text-right">
            <div className="text-yellow-400 text-xs font-bold hud-text uppercase">
              GED IMPACT: {sectorWeight}
            </div>
            <div className="text-gray-400 text-xs hud-text">
              Current Sector: {currentSector || 'ACTIVE'}
            </div>
          </div>

          {/* Grit Multiplier */}
          <div className="flex items-center gap-2">
            <div className="text-orange-400 text-lg hud-text">
              🔥
            </div>
            <div className="text-orange-400 text-sm font-bold hud-text">
              GRIT: {gritMultiplier}x
            </div>
          </div>
        </div>
      </div>

      {/* Strike Readiness - Center Top */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 hud-element px-6 py-3 glow-gold">
        <div className="text-center">
          <div className="text-yellow-400 text-xs font-bold hud-text uppercase tracking-widest mb-2">
            STRIKE READINESS
          </div>
          <div className="w-64 h-3 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full strike-progress"
              initial={{ width: 0 }}
              animate={{ width: `${strikeReadiness}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          <div className="text-white text-xs hud-text mt-1">
            {strikeReadiness}% SECTOR MASTERY
          </div>
        </div>
      </div>

      {/* Mission Breadcrumbs - Bottom Center */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 hud-element px-6 py-3">
        <div className="text-center">
          <div className="text-lavender-400 text-xs font-bold hud-text uppercase tracking-widest mb-3">
            SECTOR MAP
          </div>
          <div className="flex gap-2 justify-center">
            {sectorMap.map((status, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-sm transition-all duration-300 ${
                  status === 'completed' ? 'pip-completed' :
                  status === 'current' ? 'pip-current' :
                  'pip-empty'
                }`}
              />
            ))}
          </div>
          <div className="text-gray-400 text-xs hud-text mt-2">
            {completedSectors}/{totalSectors} SECTORS CLEARED
          </div>
        </div>
      </div>

      {/* Additional Tactical Elements */}
      <div className="fixed bottom-4 left-4 z-40 hud-element px-3 py-2">
        <div className="text-green-400 text-xs hud-text">
          // SYSTEM ONLINE //
        </div>
        <div className="text-gray-500 text-xs hud-text">
          TACTICAL HUD ACTIVE
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-40 hud-element px-3 py-2">
        <div className="text-blue-400 text-xs hud-text">
          // RECOVERY MODE //
        </div>
        <div className="text-gray-500 text-xs hud-text">
          ADAPTIVE SYSTEMS ENGAGED
        </div>
      </div>
    </>
  )
}

export default StrategicHUDOverlay
