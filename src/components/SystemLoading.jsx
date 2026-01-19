import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './styles/systemLoading.css'

const SystemLoading = ({ 
  isActive, 
  onComplete,
  isInitiating = false 
}) => {
  const [loadingPhase, setLoadingPhase] = useState('scanning')
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    if (isActive) {
      // Mimic Red Alert HUD sweep but in Verve Lavender
      const phaseSequence = ['scanning', 'analyzing', 'calibrating', 'ready']
      let currentPhase = 0
      
      const phaseTimer = setInterval(() => {
        setLoadingPhase(phaseSequence[currentPhase])
        setScanProgress((currentPhase + 1) / phaseSequence.length * 100)
        
        currentPhase++
        if (currentPhase >= phaseSequence.length) {
          clearInterval(phaseTimer)
          setLoadingPhase('ready')
          setTimeout(() => {
            if (onComplete) onComplete()
          }, 1000)
        }
      }, 800)
      
      return () => clearInterval(phaseTimer)
    }
  }, [isActive, onComplete])

  // Trigger haptic feedback
  useEffect(() => {
    if (isActive && 'vibrate' in navigator) {
      // Short haptic pulse for system engagement
      navigator.vibrate([50, 30, 50])
    }
  }, [isActive])

  // Trigger audio feedback
  useEffect(() => {
    if (isActive) {
      // Create and play subtle electronic chime
      const audio = new Audio('/sounds/system-engaged.mp3')
      audio.volume = 0.3
      audio.play().catch(e => console.log('Audio playback failed:', e))
    }
  }, [isActive])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ 
            backgroundColor: 'rgba(11, 14, 20, 0.95)',
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(177, 156, 217, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(177, 156, 217, 0.1) 0%, transparent 50%)
            `
          }}
        >
          {/* Scanning Lines */}
          <div className="scanning-container">
            <div className="scanning-line scanning-line-1"></div>
            <div className="scanning-line scanning-line-2"></div>
            <div className="scanning-line scanning-line-3"></div>
            <div className="scanning-line scanning-line-4"></div>
          </div>

          {/* Loading Content */}
          <div className="loading-content">
            <div className="loading-header">
              <div className="loading-title">
                <div className="glitch-text">SYSTEM</div>
                <div className="loading-subtitle">
                  {isInitiating ? 'INITIATING RANGE QUAL' : 'SYSTEM LOADING'}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="progress-container">
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  style={{ 
                    width: `${scanProgress}%`,
                    background: 'linear-gradient(90deg, #B19CD9 0%, #00D9FF 100%)'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                />
              </div>
              <div className="progress-text">
                {Math.round(scanProgress)}%
              </div>
            </div>

            {/* Phase Indicator */}
            <div className="phase-indicator">
              <div className={`phase-dot ${loadingPhase}`}></div>
              <div className="phase-text">
                {loadingPhase.toUpperCase()}
              </div>
            </div>

            {/* Status Messages */}
            <div className="status-messages">
              <AnimatePresence>
                {loadingPhase === 'scanning' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="status-message"
                  >
                    SCANNING TACTICAL SYSTEMS...
                  </motion.div>
                )}
                {loadingPhase === 'analyzing' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="status-message"
                  >
                    ANALYZING COMBAT READINESS...
                  </motion.div>
                )}
                {loadingPhase === 'calibrating' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="status-message"
                  >
                    CALIBRATING RANGE PARAMETERS...
                  </motion.div>
                )}
                {loadingPhase === 'ready' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="status-message ready"
                  >
                    SYSTEM READY
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Loading Animation */}
            <div className="loading-animation">
              <div className="loading-ring">
                <div className="loading-ring-inner"></div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SystemLoading
