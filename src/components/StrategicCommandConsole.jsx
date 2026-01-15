import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useNeuro } from '../context/NeuroProvider'

const StrategicCommandConsole = () => {
  const { 
    stressLevel,
    neuralActivity,
    hasKeyToVictory,
    isGoldKeyMode
  } = useNeuro()

  const [isVisible, setIsVisible] = useState(false)
  const [lastSyncStatus, setLastSyncStatus] = useState('Unknown')

  // Handle keyboard shortcut - moved outside useEffect to prevent infinite loop
  const handleKeyPress = useCallback((event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'D') {
      event.preventDefault()
      setIsVisible(prev => !prev)
    }
    if (event.key === 'Escape') {
      setIsVisible(false)
    }
  }, [])

  // Event listener useEffect with proper dependency array and cleanup
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  // Simulate sync status updates
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ['Connected', 'Syncing', 'Offline', 'Error']
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      setLastSyncStatus(randomStatus)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const getPhotonicState = () => {
    if (isGoldKeyMode) return 'Gold'
    if (stressLevel > 70) return 'Combat'
    if (stressLevel > 30) return 'Stressed'
    return 'Linen'
  }

  const getStressColor = () => {
    if (stressLevel > 70) return 'text-red-600'
    if (stressLevel > 30) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-4 z-50 bg-black/90 backdrop-blur-md border border-gray-700 rounded-lg p-4 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white mb-2">
          ⚔️ Strategic Command Console
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-200 text-sm"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3">
        {/* Stress Level */}
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Stress Level:</span>
          <span className={`text-2xl font-bold ${getStressColor()}`}>
            {stressLevel}/100
          </span>
        </div>

        {/* Photonic State */}
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Photonic State:</span>
          <span className={`text-xl font-bold ${
            getPhotonicState() === 'Gold' ? 'text-yellow-400' :
            getPhotonicState() === 'Combat' ? 'text-red-600' :
            getPhotonicState() === 'Stressed' ? 'text-yellow-600' :
            'text-green-600'
          }`}>
            {getPhotonicState()}
          </span>
        </div>

        {/* Key to Victory Status */}
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Key to Victory:</span>
          <span className={`text-xl font-bold ${hasKeyToVictory ? 'text-yellow-400' : 'text-gray-600'}`}>
            {hasKeyToVictory ? 'CLAIMED' : 'NOT CLAIMED'}
          </span>
        </div>

        {/* Neural Activity */}
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Neural Activity:</span>
          <div className="flex items-center">
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${neuralActivity * 100}%` }}
              />
            </div>
            <span className="ml-2 text-green-400 font-bold">
              {Math.round(neuralActivity * 100)}%
            </span>
          </div>
        </div>

        {/* Last Sync Status */}
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Last Sync Status:</span>
          <span className={`text-xl font-bold ${
            lastSyncStatus === 'Connected' ? 'text-green-400' :
            lastSyncStatus === 'Syncing' ? 'text-yellow-600' :
            lastSyncStatus === 'Offline' ? 'text-gray-600' :
            'text-red-600'
          }`}>
            {lastSyncStatus}
          </span>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-600">
          <p className="text-gray-400 text-sm mb-2">
            Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">Ctrl + Shift + D</kbd> to toggle console
          </p>
          <p className="text-gray-400 text-sm mb-2">
            Press <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd> to close
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Monitor Maria's real-time stress levels and system heartbeat
          </p>
        </div>
      </div>
    </div>
  )
}

export default StrategicCommandConsole
