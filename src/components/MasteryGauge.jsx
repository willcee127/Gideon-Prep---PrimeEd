import React from 'react'

const MasteryGauge = ({ masteryPercentage, label, size = 200 }) => {
  // Determine phase based on mastery percentage
  const getPhaseConfig = (percentage) => {
    if (percentage <= 30) {
      return {
        color: '#B19CD9', // Verve (Lavender)
        animation: 'pulse 2s infinite',
        glow: '0 0 20px rgba(177, 156, 217, 0.6)',
        label: 'Verve'
      }
    } else if (percentage <= 89) {
      return {
        color: '#00D9FF', // Aura (Cyan)
        animation: 'pulse 1.5s infinite',
        glow: '0 0 15px rgba(0, 217, 255, 0.5)',
        label: 'Aura'
      }
    } else {
      return {
        color: '#FF8C00', // Forge (Orange)
        animation: 'pulse 0.5s infinite',
        glow: '0 0 25px rgba(255, 140, 0, 0.8)',
        label: 'Forge'
      }
    }
  }

  const phaseConfig = getPhaseConfig(masteryPercentage)
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * masteryPercentage) / 100

  return (
    <div className="relative inline-block">
      {/* Gauge Container */}
      <div 
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Background Circle */}
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="20"
          />
          
          {/* Animated Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={phaseConfig.color}
            strokeWidth="20"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 1s ease-in-out',
              filter: `drop-shadow(${phaseConfig.glow})`,
              animation: phaseConfig.animation
            }}
          />
        </svg>

        {/* Center Content */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            color: phaseConfig.color,
            textShadow: phaseConfig.glow
          }}
        >
          <div className="text-3xl font-bold" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            {Math.round(masteryPercentage)}%
          </div>
          <div className="text-xs uppercase tracking-wider mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            {phaseConfig.label}
          </div>
        </div>

        {/* Energy Ring Effect */}
        <div 
          className="absolute inset-0 rounded-full border-2 opacity-50"
          style={{
            borderColor: phaseConfig.color,
            animation: phaseConfig.animation,
            boxShadow: phaseConfig.glow
          }}
        />
      </div>

      {/* Label */}
      <div className="text-center mt-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        {label}
      </div>
    </div>
  )
}

export default MasteryGauge
