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

  // Map data to radar axes
  const axes = [
    { key: 'numberSense', label: 'Number Sense', angle: 90 },
    { key: 'algebra', label: 'Algebra', angle: 30 },
    { key: 'geometry', label: 'Geometry', angle: -30 },
    { key: 'dataAnalysis', label: 'Data Analysis', angle: -90 },
    { key: 'fractions', label: 'Fractions', angle: -150 },
    { key: 'appliedMath', label: 'Applied Math', angle: 150 }
  ]

  // Calculate hexagon points
  const hexPoints = calculateHexPoints(size / 2, size / 2, size * 0.35)

  // Create web lines from center to each vertex
  const webLines = hexPoints.map((point, index) => {
    const axis = axes[index]
    const value = data[axis.key] || 0
    const normalizedValue = Math.min(value / 100, 1) // Normalize to 0-1

    return (
      <g key={axis.key}>
        {/* Web line */}
        <line
          x1={size / 2}
          y1={size / 2}
          x2={point.x}
          y2={point.y}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
        
        {/* Data point */}
        <circle
          cx={point.x}
          cy={point.y}
          r={4 + normalizedValue * 6} // Dynamic radius based on value
          fill="#00D9FF"
          fillOpacity="0.3"
          stroke="#00D9FF"
          strokeWidth="2"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.8))'
          }}
        />
        
        {/* Axis label */}
        <text
          x={point.x + (point.x > size / 2 ? 20 : -20)}
          y={point.y}
          textAnchor={point.x > size / 2 ? 'start' : 'end'}
          className="text-xs fill-current"
          style={{
            fill: '#00D9FF',
            fontSize: '10px',
            fontFamily: 'JetBrains Mono, monospace',
            filter: 'drop-shadow(0 0 5px rgba(0, 217, 255, 0.8))'
          }}
        >
          {axis.label}
        </text>
        
        {/* Value label */}
        <text
          x={point.x + (point.x > size / 2 ? 35 : -35)}
          y={point.y}
          textAnchor={point.x > size / 2 ? 'start' : 'end'}
          className="text-xs font-bold fill-current"
          style={{
            fill: '#00D9FF',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono, monospace',
            filter: 'drop-shadow(0 0 5px rgba(0, 217, 255, 0.8))'
          }}
        >
          {Math.round(value)}%
        </text>
      </g>
    )
  })

  return (
    <div className="relative inline-block">
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
        style={{
          background: 'rgba(11, 14, 20, 0.3)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px'
        }}
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
  )
}

export default HexagonalRadar
