import React from 'react'
import { motion } from 'framer-motion'

const BrandLoading = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1, 0.9]
        }}
        transition={{ 
          duration: 2,
          ease: "easeOut",
          times: [0, 0.3, 0.8, 1]
        }}
        className="text-center"
      >
        {/* Neon Logo */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 3,
            ease: "linear",
            repeat: Infinity
          }}
          className="mb-8"
        >
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <div className="text-white text-3xl font-black">G</div>
            </div>
            {/* Neon Glow */}
            <div 
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(147, 51, 234, 0.3), transparent)',
                filter: 'blur(20px)',
                transform: 'scale(1.2)'
              }}
            />
          </div>
        </motion.div>
        
        {/* Loading Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ 
            y: [20, 0, -5, 0],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 2.5,
            ease: "easeOut",
            times: [0, 0.4, 0.8, 1]
          }}
        >
          <div className="space-y-4">
            <motion.h1
              animate={{ 
                textShadow: [
                  "0 0 0 rgba(147, 51, 234, 0)",
                  "0 0 20px rgba(147, 51, 234, 0.8)",
                  "0 0 40px rgba(147, 51, 234, 0.4)",
                  "0 0 20px rgba(147, 51, 234, 0.8)",
                  "0 0 0 rgba(147, 51, 234, 0)"
                ]
              }}
              transition={{ 
                duration: 2,
                ease: "easeOut",
                times: [0, 0.3, 0.6, 0.8, 1]
              }}
              className="text-4xl font-black text-purple-400 mb-2"
              style={{ fontFamily: 'Oswald, sans-serif' }}
            >
              GIDEON
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 1, 0] }}
              transition={{ 
                duration: 2.5,
                ease: "easeOut",
                times: [0, 0.5, 0.7, 0.9, 1]
              }}
              className="text-xl text-purple-300 font-mono"
            >
              Initializing Command Center...
            </motion.p>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: [0, 100, 100, 0] }}
              transition={{ 
                duration: 2,
                ease: "easeOut",
                times: [0, 0.4, 0.8, 1]
              }}
              className="h-1 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto rounded-full"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default BrandLoading
