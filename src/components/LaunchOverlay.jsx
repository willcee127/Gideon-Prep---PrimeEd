import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LaunchOverlay = ({ 
  isActive, 
  countdownDuration = 10, // seconds
  onLaunchComplete,
  forgeSpeeds 
}) => {
  const [showOverlay, setShowOverlay] = useState(false)
  const [countdown, setCountdown] = useState(countdownDuration)
  const [launchPhase, setLaunchPhase] = useState('preparing')
  const [showTypewriter, setShowTypewriter] = useState(false)

  useEffect(() => {
    if (isActive) {
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 0) {
            setShowOverlay(true)
            setLaunchPhase('launching')
            setTimeout(() => setLaunchPhase('launch'), 1000)
            setTimeout(() => setLaunchPhase('ready'), 2000)
            setTimeout(() => setLaunchPhase('go'), 500)
            setTimeout(() => {
              setCountdown(prev => prev - 1)
              if (prev <= 3) {
                setShowTypewriter(true)
                setTimeout(() => setShowTypewriter(false), 500)
              }
            }, 1000)
          }
        }, 100)

      // Show overlay after 1 second
      const overlayTimer = setTimeout(() => {
        setShowOverlay(true)
        setCountdown(countdownDuration)
      }, 1000)

      // Cleanup
      return () => {
        clearInterval(timer)
        clearTimeout(overlayTimer)
      }
    }
  }, [isActive, countdownDuration, launchPhase, showOverlay, countdown, showTypewriter])

  const getPhaseText = () => {
    switch (launchPhase) {
      case 'preparing':
        return 'SYSTEM PREPARING'
      case 'launching':
        return 'LAUNCH SEQUENCE INITIATED'
      case 'ready':
        return 'FORGE SPEED ACHIEVED'
      case 'go':
        return 'SYSTEMS GO'
      default:
        return 'READY'
    }
  }

  const getTypewriterText = (text) => {
    return text.split('').map((char, index) => (
      <motion.span
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: index * 0.1 }}
        style={{ color: index < text.length ? 'rgba(255, 140, 0, 0.8)' : 'rgba(255, 255, 255, 0.3)' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))
  }

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ 
            backgroundColor: 'rgba(255, 0, 0, 0.9)',
            backgroundImage: `
              radial-gradient(circle at 50% 50%, rgba(255, 0, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(255, 140, 0, 0.1) 0%, transparent 50%)
            `
          }}
        >
          {/* Countdown Display */}
          <div className="launch-countdown">
            <div className="countdown-text">
              {showTypewriter && getPhaseText().substring(0, countdownDuration - countdown + 1))}
            </div>
            <div className="phase-text">
              {getPhaseText()}
            </div>
          </div>

          {/* Main Launch Text */}
          <div className="launch-text">
            <div className="glitch-text">GOOD LUCK, COMMANDER</div>
            <div className="sub-text">FORGE SPEED ACHIEVED</div>
            <div className="sub-text">ALL 6 AXES: < 90s</div>
            <div className="sub-text">ENERGY CORE: MAXIMUM</div>
          </div>

          {/* Typewriter Effect */}
          <AnimatePresence>
            {showTypewriter && (
              <div className="typewriter-container">
                {getTypewriterText('FORGE COMMAND ACTIVE: TEST READY')}
              </div>
            )}
          </AnimatePresence>

          {/* Launch Button */}
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="launch-btn"
            onClick={() => {
              setLaunchPhase('launching')
              setTimeout(() => {
                setLaunchPhase('ready')
                setTimeout(() => setLaunchPhase('go'), 500)
                setTimeout(() => {
                  setLaunchPhase('launched')
                  onLaunchComplete()
                }, 3000)
              }}
            >
              {launchPhase === 'launching' && (
                <span className="btn-text">INITIATING LAUNCH</span>
              )}
              {launchPhase === 'ready' && (
                <span className="btn-text">READY</span>
              )}
              {launchPhase === 'go' && (
                <span className="btn-text">GO!</span>
              )}
              {launchPhase === 'launched' && (
                <span className="btn-text">LAUNCHED!</span>
              )}
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LaunchOverlay
