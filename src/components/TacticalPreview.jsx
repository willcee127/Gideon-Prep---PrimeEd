import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import SystemLoading from './SystemLoading'
import './styles/tacticalPreview.css'

const TacticalPreview = () => {
  const [radarData, setRadarData] = useState({
    numberSense: 85,
    algebra: 72,
    geometry: 68,
    dataAnalysis: 45,
    fractions: 58,
    appliedMath: 78
  })

  const [energyData, setEnergyData] = useState({
    math: 75,
    rla: 82,
    science: 68,
    socialStudies: 71,
    total: 296,
    average: 74
  })

  const [isSystemLoading, setIsSystemLoading] = useState(false)
  const [isInitiating, setIsInitiating] = useState(false)

  // Animation refs for continuous animation
  const radarRef = useRef(null)
  const energyGaugeRef = useRef(null)

  useEffect(() => {
    // Animate radar data points
    const radarInterval = setInterval(() => {
      const newRadarData = { ...radarData }
      const axes = ['numberSense', 'algebra', 'geometry', 'dataAnalysis', 'fractions', 'appliedMath']
      
      axes.forEach(axis => {
        const currentValue = radarData[axis]
        const targetValue = Math.random() * 30 + 70 // Random target between current and max
        const newValue = currentValue + (targetValue - currentValue) * 0.1
        newRadarData[axis] = Math.min(100, Math.max(0, newValue))
      })

      setRadarData(newRadarData)
    }, 2000)

    // Animate energy gauges
    const energyInterval = setInterval(() => {
      const newEnergyData = { ...energyData }
      const sectors = ['math', 'rla', 'science', 'socialStudies']
      
      sectors.forEach(sector => {
        const currentValue = energyData[sector]
        const targetValue = Math.random() * 20 + 80 // Random target between current and max
        const newValue = currentValue + (targetValue - currentValue) * 0.1
        newEnergyData[sector] = Math.min(100, Math.max(0, newValue))
      })

      setEnergyData(newEnergyData)
    }, 1500)

    return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 w-full h-full">
          <div className="parallax-layer"></div>
          <div className="parallax-bg"></div>
          <div className="parallax-layer"></div>
          <div className="parallax-layer"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-verve mb-4 holographic-text">
              INITIATE RANGE QUAL
            </h1>
            <p className="text-lg data-text-secondary mb-8">
              Your journey to GED mastery begins here. Forge your speed, sharpen your skills, and claim your sovereignty.
            </p>
          </div>

          {/* Radar and Energy Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Hexagonal Radar */}
            <div className="radar-container">
              <div className="hexagonal-radar" ref={radarRef}>
                <svg width="100%" height="100%" viewBox={`0 0 400 400`}>
                  {/* Animated hexagon paths */}
                  {Object.entries(radarData).map(([axis, value], index) => {
                    const angle = (index * 60) - 90
                    const radius = (value / 100) * 0.4
                    const x = 200 + radius * Math.cos(angle * Math.PI / 180)
                    const y = 200 + radius * Math.sin(angle * Math.PI / 180)
                    
                    return (
                      <g key={axis}>
                        {/* Hexagon path with animated stroke */}
                        <polygon
                          points={`${x},${y}`}
                          fill={`rgba(${getAxisColor(index, value)}, 0.2)`}
                          stroke={getAxisColor(index, value)}
                          strokeWidth="2"
                          className="radar-hexagon"
                          style={{
                            filter: 'drop-shadow(0 0 10px rgba(177, 156, 217, 0.3))',
                            animation: 'radarPulse 3s ease-in-out infinite'
                          }}
                        />
                        
                        {/* Axis label */}
                        <text
                          x={x + radius * 1.5 * Math.cos(angle * Math.PI / 180)}
                          y={y + radius * 1.5 * Math.sin(angle * Math.PI / 180)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="radar-axis-label"
                          fill={getAxisColor(index, value)}
                          fontSize="12"
                          fontWeight="bold"
                        >
                          {axis.toUpperCase()}
                        </text>
                        
                        {/* Value label */}
                        <text
                          x={x + radius * 0.8 * Math.cos(angle * Math.PI / 180)}
                          y={y + radius * 0.8 * Math.sin(angle * Math.PI / 180)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {Math.round(value)}
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* Center circle */}
                  <circle
                    cx="200"
                    cy="200"
                    r="8"
                    fill="none"
                    stroke="rgba(255, 140, 0, 0.5)"
                    strokeWidth="2"
                    className="radar-center-circle"
                  />
                </svg>
              </div>
            </div>

            {/* Energy Gauges */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(energyData).map(([sector, value], index) => (
                <div key={index} className="energy-gauge">
                  <div className="gauge-header">
                    <div className="text-sm data-text-secondary">{sector.toUpperCase()}</div>
                    <div className="text-2xl font-bold text-verve">{value}%</div>
                  </div>
                  <div className="w-full neon-card rounded-full h-4 mt-2">
                    <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${value}%`,
                        background: `conic-gradient(90deg, ${getGaugeColor(value)} 0%, transparent 50%)`
                      }}
                    >
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                        style={{
                          width: `${value}%`,
                          overflow: 'hidden'
                        }}
                      >
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${value}%`,
                            background: `conic-gradient(90deg, ${getGaugeColor(value)} 0%, transparent 50%)`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="phase-btn aura-glow text-black font-bold py-4 px-8"
              style={{
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.8)',
                background: 'linear-gradient(135deg, #B19CD9 0%, #FFD700 100%)'
              }}
              onClick={() => {
                console.log('Tactical Preview: User initiated range qualification')
                setIsSystemLoading(true)
                setIsInitiating(true)
                
                // Route to recruitment page
                setTimeout(() => {
                  window.location.href = '/recruitment?isInitiating=true'
                }, 1000)
              }}
            >
              INITIATE RANGE QUAL
            </motion.button>
          </div>
        </div>
      </div>

      {/* System Loading Overlay */}
      <SystemLoading 
        isActive={isSystemLoading}
        isInitiating={isInitiating}
        onComplete={() => {
          setIsSystemLoading(false)
          setIsInitiating(false)
        }}
      />
    </div>
  )
}

// Helper functions for colors and animations
const getAxisColor = (index, value) => {
  const colors = [
    'rgba(0, 217, 255, 0.8)',   // Number Sense - Blue
    'rgba(255, 140, 0, 0.8)',   // Algebra - Orange
    'rgba(140, 255, 0, 0.8)',   // Geometry - Green
    'rgba(255, 255, 255, 0.8)',   // Data Analysis - White
    'rgba(255, 255, 255, 0.8)',   // Fractions - Orange
    'rgba(255, 255, 255, 0.8)'    // Applied Math - Orange
  ]
  
  const baseOpacity = 0.3
  const valueOpacity = Math.max(0.2, Math.min(1, value / 100))
  
  return colors[index % colors.length].replace('0.8', `${baseOpacity + valueOpacity}`)
}

const getGaugeColor = (value) => {
  if (value >= 90) return '#FFD700' // Forge - Gold
  if (value >= 75) return '#FF8C00' // Aura - Cyan
  if (value >= 60) return '#00D9FF' // Verve - Lavender
  return '#B19CD9' // Default - Blue
}

export default TacticalPreview
