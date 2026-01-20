import React from 'react'
import { motion } from 'framer-motion'

const AuraPowerBar = ({ value = 75, max = 100, label = "COMBAT POWER" }) => {
  const percentage = (value / max) * 100
  
  return (
    <div className="relative">
      <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full relative overflow-hidden"
          style={{
            boxShadow: value > 80 
              ? '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(0, 255, 255, 0.1), 0 0 60px rgba(0, 255, 255, 0.05)'
              : '0 0 10px rgba(0, 255, 255, 0.2)'
          }}
        >
          {/* Scanline Effect */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.1) 2px, transparent 50%, rgba(0, 255, 255, 0.1) 2px, transparent 80%, rgba(0, 255, 255, 0.1) 2px, transparent)`,
              animation: 'scanline 2s linear infinite',
            }}
          />
        </motion.div>
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-sm text-gray-400">0%</span>
        <span className="text-sm font-bold text-purple-400">{percentage}%</span>
        <span className="text-sm text-gray-400">100%</span>
      </div>
    </div>
  )
}

export default AuraPowerBar
