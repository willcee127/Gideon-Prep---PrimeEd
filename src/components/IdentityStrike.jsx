import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const IdentityStrike = ({ trigger, onComplete }) => {
  const [particles, setParticles] = useState([])
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger) {
      triggerStrike()
    }
  }, [trigger])

  const triggerStrike = () => {
    setIsActive(true)
    
    // Generate gold particles for explosion effect
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      angle: (Math.PI * 2 * i) / 50 + Math.random() * 0.5,
      velocity: 5 + Math.random() * 10,
      size: 2 + Math.random() * 4,
      lifetime: 1 + Math.random() * 2,
      delay: Math.random() * 0.2,
      type: Math.random() > 0.7 ? 'spark' : 'particle'
    }))

    setParticles(newParticles)

    // Clean up after animation
    setTimeout(() => {
      setIsActive(false)
      setParticles([])
      onComplete?.()
    }, 3000)
  }

  const particleVariants = {
    initial: {
      x: 0,
      y: 0,
      scale: 0,
      opacity: 1,
      rotate: 0
    },
    animate: (custom) => ({
      x: Math.cos(custom.angle) * custom.velocity * 100,
      y: Math.sin(custom.angle) * custom.velocity * 100,
      scale: custom.type === 'spark' ? [0, 1.5, 0.5, 0] : [0, 1, 0],
      opacity: [1, 1, 0.8, 0],
      rotate: custom.type === 'spark' ? 360 : 0,
      transition: {
        duration: custom.lifetime,
        delay: custom.delay,
        ease: custom.type === 'spark' ? 'easeOut' : 'easeOutBack'
      }
    }),
    exit: {
      opacity: 0,
      scale: 0,
      transition: { duration: 0.2 }
    }
  }

  const glowVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: [0, 1.5, 1],
      opacity: [0, 0.8, 0],
      transition: { duration: 1, ease: 'easeOut' }
    },
    exit: { opacity: 0 }
  }

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          {/* Central Glow Burst */}
          <motion.div
            variants={glowVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: 'radial-gradient(circle, #FFD700 0%, rgba(255, 215, 0, 0.4) 40%, transparent 70%)',
              filter: 'blur(20px)',
              boxShadow: '0 0 60px #FFD700, 0 0 100px rgba(255, 215, 0, 0.5)'
            }}
          />

          {/* Gold Ring Expansion */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 2, 3],
              opacity: [1, 0.5, 0],
              borderWidth: [4, 2, 0]
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute w-24 h-24 rounded-full border-2"
            style={{ borderColor: '#FFD700' }}
          />

          {/* Particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              variants={particleVariants}
              custom={particle}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute rounded-full"
              style={{
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.type === 'spark' ? '#FFD700' : '#FFA500',
                boxShadow: particle.type === 'spark' 
                  ? '0 0 10px #FFD700, 0 0 20px rgba(255, 215, 0, 0.5)'
                  : '0 0 5px #FFA500',
                filter: particle.type === 'spark' ? 'blur(1px)' : 'none'
              }}
            />
          ))}

          {/* Lightning Bolts */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`lightning-${i}`}
              initial={{ 
                pathLength: 0, 
                opacity: 0,
                rotate: i * 45
              }}
              animate={{ 
                pathLength: 1, 
                opacity: [0, 1, 0],
                rotate: i * 45 + Math.random() * 10 - 5
              }}
              transition={{ 
                duration: 0.3 + Math.random() * 0.2,
                delay: Math.random() * 0.3
              }}
              className="absolute"
              style={{
                width: '60px',
                height: '2px',
                background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
                transformOrigin: 'center',
                filter: 'blur(1px)'
              }}
            />
          ))}

          {/* Central Flash */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ 
              scale: [0, 5, 0],
              opacity: [1, 0.8, 0]
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute w-4 h-4 rounded-full"
            style={{ 
              backgroundColor: '#FFFFFF',
              boxShadow: '0 0 30px #FFD700, 0 0 60px rgba(255, 215, 0, 0.8)'
            }}
          />
        </div>
      )}
    </AnimatePresence>
  )
}

export default IdentityStrike
