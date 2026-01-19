import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const VictorySequence = ({ 
  isActive, 
  onVictoryComplete,
  children 
}) => {
  const canvasRef = useRef(null)
  const [particles, setParticles] = useState([])
  const [showExplosion, setShowExplosion] = useState(false)
  const [showText, setShowText] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    if (isActive) {
      // Create particle explosion effect
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 4 + 2,
        color: Math.random() > 0.5 ? '#FF8C00' : '#FFD700',
        life: 1.0
      }))
      setParticles(newParticles)

      // Show explosion text
      setTimeout(() => setShowText(true), 500)
      setTimeout(() => setShowExplosion(true), 800)
      setTimeout(() => {
        setShowExplosion(false)
        setShowText(false)
        // Trigger victory callback
        if (onVictoryComplete) {
          onVictoryComplete()
        }
      }, 2000)

      // Clean up particles
      setTimeout(() => setParticles([]), 3000)
    } else {
      // Reset when not active
      setParticles([])
      setShowExplosion(false)
      setShowText(false)
    }
  }, [isActive])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.02
        particle.vy += 0.2 // gravity

        if (particle.life > 0) {
          ctx.save()
          ctx.globalAlpha = particle.life
          ctx.fillStyle = particle.color
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      // Remove dead particles
      const aliveParticles = particles.filter(p => p.life > 0)
      setParticles(aliveParticles)

      animationId = requestAnimationFrame(animate)
    }

    // Start animation loop
    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [particles])

  // Play sound effect
  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error('Audio playback failed:', e))
    }
  }

  // Trigger haptic feedback (if available)
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]) // 200ms vibration pattern
    }
  }

  return (
    <>
      {/* Victory Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
          >
            {/* Canvas for particle effects */}
            <canvas
              ref={canvasRef}
              width={window.innerWidth}
              height={window.innerHeight}
              className="absolute inset-0"
              style={{ mixBlendMode: 'screen' }}
            />

            {/* Victory Text */}
            <AnimatePresence>
              {showText && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="victory-text">
                    <div className="glitch-text">FORGE COMMAND ACTIVE</div>
                    <div className="sub-text">TEST READY</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Explosion Effect */}
            <AnimatePresence>
              {showExplosion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="explosion-text">
                    <div className="glitch-text">ENERGY CORE: MAXIMUM</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio element for sound effects */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/forge-power-up.mp3" type="audio/mpeg" />
        <source src="/sounds/forge-power-up.ogg" type="audio/ogg" />
      </audio>

      {/* Hidden button to trigger effects for testing */}
      <button
        onClick={() => {
          playSound()
          triggerHaptic()
        }}
        className="hidden"
      >
        Test Effects
      </button>

      {/* Render children with Forge mode styling */}
      <div className={`forge-mode ${isActive ? 'active' : ''}`}>
        {children}
      </div>
    </>
  )
}

export default VictorySequence
