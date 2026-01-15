import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNeuro } from '../../context/NeuroProvider'
import { getNodeById } from '../../data/mathContent'

const CommandCalc = ({ isOpen, onClose, currentStronghold, onTacticalTip }) => {
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState('')
  const [activeKeys, setActiveKeys] = useState({})
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const dragRef = useRef(null)
  const { isInAuraMode } = useNeuro()

  // Get current stronghold's tactical tip
  const nodeContent = getNodeById(currentStronghold?.id)
  const tacticalTip = nodeContent?.tacticalTip || ''

  // TI-30XS Key layout
  const keys = [
    // Row 1
    { id: '2nd', label: '2nd', row: 1, col: 1, color: 'bg-gray-600' },
    { id: 'mode', label: 'MODE', row: 1, col: 2, color: 'bg-gray-600' },
    { id: 'del', label: 'DEL', row: 1, col: 3, color: 'bg-gray-600' },
    { id: 'algebra', label: 'ALGEBRA', row: 1, col: 4, color: 'bg-gray-600' },
    
    // Row 2
    { id: '7', label: '7', row: 2, col: 1, color: 'bg-gray-700' },
    { id: '8', label: '8', row: 2, col: 2, color: 'bg-gray-700' },
    { id: '9', label: '9', row: 2, col: 3, color: 'bg-gray-700' },
    { id: 'div', label: '÷', row: 2, col: 4, color: 'bg-gray-700' },
    { id: 'x', label: '×', row: 2, col: 5, color: 'bg-gray-700' },
    
    // Row 3
    { id: '4', label: '4', row: 3, col: 1, color: 'bg-gray-700' },
    { id: '5', label: '5', row: 3, col: 2, color: 'bg-gray-700' },
    { id: '6', label: '6', row: 3, col: 3, color: 'bg-gray-700' },
    { id: '1', label: '1', row: 3, col: 4, color: 'bg-gray-700' },
    { id: '0', label: '0', row: 3, col: 5, color: 'bg-gray-700' },
    
    // Row 4 - Right side
    { id: 'on', label: 'ON', row: 4, col: 1, color: 'bg-green-600' },
    { id: 'sto', label: 'STO', row: 4, col: 2, color: 'bg-gray-600' },
    { id: 'off', label: 'OFF', row: 4, col: 3, color: 'bg-gray-600' },
    
    // Row 5 - Special functions
    { id: 'frac', label: 'n/d', row: 5, col: 1, color: 'bg-blue-600' },
    { id: 'fd', label: 'f◊►d', row: 5, col: 2, color: 'bg-blue-600' },
    { id: 'power', label: '^', row: 5, col: 3, color: 'bg-blue-600' },
    { id: 'square', label: 'x²', row: 5, col: 4, color: 'bg-blue-600' },
    { id: 'sqrt', label: '√', row: 5, col: 5, color: 'bg-blue-600' },
    
    // Row 6 - Bottom row
    { id: 'enter', label: 'ENTER', row: 6, col: 1, color: 'bg-gray-600', span: 2 },
    { id: 'approx', label: '≈', row: 6, col: 3, color: 'bg-blue-600' },
    { id: 'clear', label: 'CLEAR', row: 6, col: 4, color: 'bg-orange-600' },
    { id: 'ans', label: 'ANS', row: 6, col: 5, color: 'bg-gray-600' }
  ]

  const handleKeyPress = (keyId) => {
    setActiveKeys(prev => ({ ...prev, [keyId]: true }))
    
    // Check for tactical sync with Aura mode
    if (isInAuraMode && tacticalTip) {
      if ((tacticalTip.includes('fraction') && (keyId === 'frac' || keyId === 'fd')) ||
          (tacticalTip.includes('power') && (keyId === 'power' || keyId === 'square'))) {
        // Pulse the relevant keys with gold border
        setTimeout(() => {
          setActiveKeys(prev => ({ ...prev, [keyId]: false }))
        }, 200)
        return
      }
    }

    // Visual feedback
    setTimeout(() => {
      setActiveKeys(prev => ({ ...prev, [keyId]: false }))
    }, 100)

    // Handle actual calculator logic (simplified)
    switch(keyId) {
      case '0': case '1': case '2': case '3': case '4': case '5': case '6': case '7': case '8': case '9':
        setDisplay(prev => prev === '0' ? keyId : prev + keyId)
        break
      case '.':
        setDisplay(prev => prev.includes('.') ? prev : prev + '.')
        break
      case 'clear':
        setDisplay('0')
        setMemory('')
        break
      case 'enter':
        // Calculate result (simplified)
        try {
          const result = eval(display)
          setDisplay(result.toString())
          setMemory(result.toString())
        } catch {
          setDisplay('ERROR')
        }
        break
    }
  }

  const handleMouseDown = (e) => {
    if (isMinimized) return
    setIsDragging(true)
    const startX = e.clientX - position.x
    const startY = e.clientY - position.y

    const handleMouseMove = (e) => {
      if (!isDragging) return
      setPosition({
        x: e.clientX - startX,
        y: e.clientY - startY
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const getGlowClass = (keyId) => {
    if (isInAuraMode && tacticalTip) {
      if ((tacticalTip.includes('fraction') && (keyId === 'frac' || keyId === 'fd')) ||
          (tacticalTip.includes('power') && (keyId === 'power' || keyId === 'square'))) {
        return 'bg-yellow-400 shadow-yellow-400/50 border-2 border-yellow-400'
      }
    }
    return 'bg-gray-600'
  }

  useEffect(() => {
    // Notify parent when tactical tip is relevant
    if (isInAuraMode && tacticalTip) {
      const hasFractionKeys = tacticalTip.includes('fraction')
      const hasPowerKeys = tacticalTip.includes('power') || tacticalTip.includes('square')
      
      if (hasFractionKeys || hasPowerKeys) {
        onTacticalTip({
          type: hasFractionKeys ? 'fraction' : 'power',
          message: `Ghost Calculator keys are glowing for ${hasFractionKeys ? 'fraction' : 'power'} operations`
        })
      }
    }
  }, [isInAuraMode, tacticalTip])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 rounded-2xl shadow-2xl"
            style={{
              width: isMinimized ? '300px' : '500px',
              height: isMinimized ? '200px' : '600px',
              left: position.x,
              top: position.y,
              position: 'fixed'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 bg-gradient-to-r from-blue-900/50 to-blue-800/50 p-3 rounded-lg border border-blue-400/30">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <span className="text-blue-300 text-sm font-bold tracking-wider">COMMAND CALC: TACTICAL HUD</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="w-6 h-6 flex items-center justify-center rounded bg-blue-700/50 hover:bg-blue-600/50 text-blue-300 text-xs border border-blue-400/30"
                >
                  {isMinimized ? '□' : '▢'}
                </button>
                <button
                  onClick={onClose}
                  className="w-6 h-6 flex items-center justify-center rounded bg-red-600/80 hover:bg-red-500/80 text-white text-xs ml-2 border border-red-400/30"
                >
                  ✕
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Display */}
                <div className="bg-gradient-to-br from-black to-blue-950 border border-blue-400/30 rounded-lg p-3 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                  <div className="text-right text-blue-400 text-2xl font-mono min-h-[40px] flex items-center justify-end shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                    {display}
                  </div>
                </div>

                {/* Memory Display */}
                <div className="bg-gray-800 border border-gray-600 rounded p-2 mb-4">
                  <div className="text-gray-400 text-xs font-mono text-center">
                    MEMORY: {memory || 'EMPTY'}
                  </div>
                </div>

                {/* Calculator Keys */}
                <div className="bg-gray-900 rounded-lg p-2">
                  <div className="grid grid-cols-5 gap-1">
                    {keys.map((key) => (
                      <button
                        key={key.id}
                        onMouseDown={() => handleKeyPress(key.id)}
                        className={`
                          relative h-12 rounded transition-all duration-100 font-mono text-xs font-bold
                          ${key.span === 2 ? 'col-span-2' : ''}
                          ${getGlowClass(key.id)}
                          ${activeKeys[key.id] ? 'scale-95 ring-2 ring-white/50' : 'hover:scale-105'}
                          ${key.color}
                        `}
                      >
                        {key.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tactical Sync Indicator */}
                {tacticalTip && (
                  <div className="mt-4 p-3 bg-blue-900/50 border border-blue-400/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <p className="text-blue-300 text-xs">
                        Tactical Sync: {tacticalTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="mt-4 text-center">
                  <p className="text-gray-400 text-xs">
                    Drag to move • Click keys to calculate • Minimize to keep visible • Close to dismiss
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CommandCalc
