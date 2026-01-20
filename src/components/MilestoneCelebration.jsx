import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MilestoneCelebration = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.8]
          }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ 
            duration: 3,
            ease: "easeOut",
            times: [0, 0.1, 0.9, 1]
          }}
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
        >
          <div className="relative">
            {/* Gold Flash Overlay */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 2, 1.5],
                opacity: [0, 0.8, 0]
              }}
              transition={{ 
                duration: 2,
                ease: "easeOut",
                times: [0, 0.3, 1]
              }}
              className="absolute inset-0 -z-10"
              style={{
                background: 'radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, transparent 70%)',
                filter: 'blur(20px)'
              }}
            />
            
            {/* Celebration Content */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ 
                y: [50, 0, -20, 0],
                opacity: [0, 1, 1, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2.5,
                ease: "easeOut",
                times: [0, 0.2, 0.8, 1]
              }}
              className="relative z-10"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 720]
                  }}
                  transition={{ 
                    duration: 2,
                    ease: "easeOut",
                    times: [0, 0.5, 1]
                  }}
                  className="text-6xl mb-4"
                >
                  ⭐
                </motion.div>
                <motion.h2
                  initial={{ scale: 0.8 }}
                  animate={{ 
                    scale: [0.8, 1.1, 1],
                    textShadow: [
                      "0 0 0 rgba(251, 191, 36, 0)",
                      "0 0 30px rgba(251, 191, 36, 0.8)",
                      "0 0 50px rgba(251, 191, 36, 0.4)",
                      "0 0 30px rgba(251, 191, 36, 0.8)",
                      "0 0 0 rgba(251, 191, 36, 0)"
                    ]
                  }}
                  transition={{ 
                    duration: 2,
                    ease: "easeOut",
                    times: [0, 0.3, 0.6, 0.8, 1]
                  }}
                  className="text-4xl font-black text-yellow-400 mb-2"
                  style={{ 
                    fontFamily: 'Oswald, sans-serif',
                    textShadow: '0 0 30px rgba(251, 191, 36, 0.8)'
                  }}
                >
                  LEVEL UP!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0, 1, 1, 0] }}
                  transition={{ 
                    duration: 2.5,
                    ease: "easeOut",
                    times: [0, 0.3, 0.5, 0.8, 1]
                  }}
                  className="text-xl text-yellow-300 font-semibold"
                >
                  Combat Power Increased!
                </motion.p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MilestoneCelebration
