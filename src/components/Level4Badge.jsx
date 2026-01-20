import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Level4Badge = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ 
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1, 0.8],
            rotate: [-180, 0, 10, 0]
          }}
          exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
          transition={{ 
            duration: 5,
            ease: "easeOut",
            times: [0, 0.1, 0.9, 1]
          }}
          className="fixed top-20 right-8 z-40 pointer-events-none"
        >
          <div className="relative">
            {/* SVG Crest with Gold Drop Shadow */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              className="drop-shadow-2xl"
              style={{
                filter: 'drop-shadow(0 0 15px #FFD700)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            >
              {/* Outer Ring */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#goldGradient)"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              
              {/* Inner Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="35"
                fill="url(#goldGradient)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.1, 1] }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              
              {/* Star Symbol */}
              <motion.g
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: [0, 1.2, 1],
                  rotate: [-180, 0, 360]
                }}
                transition={{ 
                  duration: 2,
                  ease: "easeOut",
                  times: [0, 0.5, 1]
                }}
              >
                <path
                  d="M50 25 L55 35 L70 35 L57 50 L65 65 L50 55 L35 65 L43 50 L30 35 L45 35 Z"
                  fill="#FFF"
                  stroke="#FFD700"
                  strokeWidth="2"
                />
                <circle cx="50" cy="50" r="3" fill="#FFD700" />
              </motion.g>
              
              {/* Level Text */}
              <motion.text
                x="50"
                y="85"
                textAnchor="middle"
                className="text-xs font-black"
                fill="#FFD700"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: [0, 0, 1, 1, 0],
                  scale: [0.5, 0.5, 1.2, 1, 0.8]
                }}
                transition={{ 
                  duration: 3,
                  ease: "easeOut",
                  times: [0, 0.3, 0.5, 0.8, 1]
                }}
              >
                LEVEL 4
              </motion.text>
              
              {/* Gradients */}
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FFA500" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
                <radialGradient id="goldRadial">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#FFA500" stopOpacity="0.3" />
                </radialGradient>
              </defs>
            </svg>
            
            {/* Glow Effect */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.5, 1, 1.2],
                opacity: [0, 0.8, 0.6, 0]
              }}
              transition={{ 
                duration: 4,
                ease: "easeOut",
                times: [0, 0.2, 0.5, 1]
              }}
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%)',
                filter: 'blur(15px)'
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Level4Badge
