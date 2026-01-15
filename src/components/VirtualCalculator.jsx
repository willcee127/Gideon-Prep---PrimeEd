import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNeuro } from '../context/NeuroProvider'
import { getNodeById } from '../data/mathContent'

const VirtualCalculator = ({ isOpen, onClose, currentStronghold }) => {
  const [display, setDisplay] = useState('0')
  const [memory, setMemory] = useState('')
  const [activeKeys, setActiveKeys] = useState({})
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef(null)
  const { stressLevel } = useNeuro()

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
    
    // Row 4
    { id: '3', label: '3', row: 4, col: 1, color: 'bg-gray-700' },
    { id: '2', label: '2', row: 4, col: 2, color: 'bg-gray-700' },
    { id: '.', label: '.', row: 4, col: 3, color: 'bg-gray-700' },
    { id: 'neg', label: '(-)', row: 4, col: 4, color: 'bg-blue-600' },
    
    // Row 5 - Right side
    { id: 'on', label: 'ON', row: 5, col: 1, color: 'bg-green-600' },
    { id: 'sto', label: 'STO', row: 5, col: 2, color: 'bg-gray-600' },
    { id: 'off', label: 'OFF', row: 5, col: 3, color: 'bg-gray-600' },
    
    // Row 6 - Special functions
    { id: 'frac', label: 'n/d', row: 6, col: 1, color: 'bg-blue-600' },
    { id: 'fd', label: 'f◊►d', row: 6, col: 2, color: 'bg-blue-600' },
    { id: 'power', label: '^', row: 6, col: 3, color: 'bg-blue-600' },
    { id: 'square', label: 'x²', row: 6, col: 4, color: 'bg-blue-600' },
    { id: 'sqrt', label: '√', row: 6, col: 5, color: 'bg-blue-600' },
    
    // Row 7 - Bottom row
    { id: 'enter', label: 'ENTER', row: 7, col: 1, color: 'bg-gray-600', span: 2 },
    { id: 'approx', label: '≈', row: 7, col: 3, color: 'bg-blue-600' },
    { id: 'clear', label: 'CLEAR', row: 7, col: 4, color: 'bg-orange-600' },
    { id: 'ans', label: 'ANS', row: 7, col: 5, color: 'bg-gray-600' }
  ]

  const handleKeyPress = (keyId) => {
    setActiveKeys(prev => ({ ...prev, [keyId]: true }))
    
    // Visual feedback
    if (keyId === 'frac' || keyId === 'fd' || keyId === 'power' || keyId === 'square') {
      // Highlight fraction and power keys when tactical tip mentions them
      if (tacticalTip.includes('fraction') || tacticalTip.includes('power') || tacticalTip.includes('square')) {
        setTimeout(() => {
          setActiveKeys(prev => ({ ...prev, [keyId]: false }))
        }, 200)
      }
    } else {
      setTimeout(() => {
        setActiveKeys(prev => ({ ...prev, [keyId]: false }))
      }, 100)
    }

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

  const handleDeepDive = () => {
    // Trigger Mission Coach Deep Dive
    if (window.missionCoach && window.missionCoach.generateTacticalMasterclass) {
      window.missionCoach.generateTacticalMasterclass(currentStronghold).then(response => {
        console.log('Deep Dive response:', response)
        // You can show a modal with the response here
        alert(`TACTICAL MASTERCLASS: ${response.message}`)
      })
    }
  }

  const getGlowClass = (keyId) => {
    if (tacticalTip.includes('fraction') && (keyId === 'frac' || keyId === 'fd')) {
      return 'bg-yellow-400 shadow-yellow-400/50'
    }
    if (tacticalTip.includes('power') && (keyId === 'power' || keyId === 'square')) {
      return 'bg-yellow-400 shadow-yellow-400/50'
    }
    return 'bg-gray-600'
  }

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
            className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 rounded-2xl p-6 max-w-4xl w-full mx-4 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-400 text-sm font-mono">GHOST TI-30XS</span>
              </div>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 hover:bg-red-500 text-white text-xs"
              >
                ✕
              </button>
              
              <button
                onClick={handleDeepDive}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
              >
                <span className="text-lg">🧠</span>
                DEEP DIVE ON THIS TOPIC
              </button>
            </div>

            {/* Display */}
            <div className="bg-black border border-gray-600 rounded-lg p-3 mb-4">
              <div className="text-right text-green-400 text-2xl font-mono min-h-[40px] flex items-center justify-end">
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
                Drag to move • Click keys to calculate • Close when done
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default VirtualCalculator
