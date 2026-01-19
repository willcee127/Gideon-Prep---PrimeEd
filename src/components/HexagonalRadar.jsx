import React from 'react'

const HexagonalRadar = ({ data, size = 300 }) => {
  // Calculate positions for hexagonal layout
  const calculateHexPoints = (centerX, centerY, radius) => {
    const angles = [0, 60, 120, 180, 240, 300]
    return angles.map(angle => {
      const radian = (angle * Math.PI) / 180
      return {
        x: center + radius * Math.cos(radian),
        y: centerY + radius * Math.sin(radian)
      }
    })
  }

  const axes = [
    'numberSense', 'algebra', 'geometry', 'dataAnalysis', 'fractions', 'appliedMath'
  ]

  // Calculate radar values with dynamic scaling
  const maxValue = Math.max(...Object.values(data))
  const minValue = Math.min(...Object.values(data))
  const range = maxValue - minValue

  return (
    <div className="radar-container">
      <div className="hexagonal-radar" style={{ 
        width: '100%', 
        maxWidth: '400px',
        height: 'auto',
        viewBox: `0 0 ${400} ${400}`,
        transform: 'scale(1)',
        transformOrigin: 'center'
      }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${400} ${400}`}
          style={{ filter: 'drop-shadow(0 0 10px rgba(177, 156, 217, 0.3))' }}
        >
          {/* Hexagon outline */}
          <polygon
          points={hexPoints.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="2"
        />
        
        {/* Web lines and data points */}
        {webLines}
        
        {/* Center point */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="8"
          fill="#FF8C00"
          fillOpacity="0.8"
          stroke="#FF8C00"
          strokeWidth="3"
          style={{
            filter: 'drop-shadow(0 0 15px rgba(255, 140, 0, 0.8))'
          }}
        />
        
        {/* Center label */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          className="text-sm font-bold fill-current"
          style={{
            fill: '#FF8C00',
            fontSize: '14px',
            fontFamily: 'JetBrains Mono, monospace',
            filter: 'drop-shadow(0 0 8px rgba(255, 140, 0, 0.8))'
          }}
        >
          RANGE QUAL
        </text>
      </svg>
    </div>
    </div>
  )
}

export default HexagonalRadar
