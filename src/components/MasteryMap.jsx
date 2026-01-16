import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { mathContent, getNodeById, getAllNodes } from '../data/mathContent'
import { supabase } from '../supabase'

const MasteryMap = ({ onNodeSelect, selectedNode, completedNodes = [] }) => {
  const [isClient, setIsClient] = useState(false)
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, scale: 1 })
  const [hoveredNode, setHoveredNode] = useState(null)
  const [reclaimedNodes, setReclaimedNodes] = useState([])
  const mapRef = useRef(null)

  // Hydration guard - only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div style={{ background: '#0a0a0a', height: '100vh' }} />
  }

  // Load reclaimed nodes from database on mount
  useEffect(() => {
    const loadReclaimedNodes = async () => {
      try {
        const userId = localStorage.getItem('gideon_user_name') || 'anonymous'
        
        // First, try to fetch from Supabase mastery_ledger
        const { data, error } = await supabase
          .from('mastery_ledger')
          .select('node_id')
          .eq('user_id', userId)
          .eq('status', 'mastered')
        
        if (data && data.length > 0) {
          const reclaimedNodeIds = data.map(record => record.node_id)
          setReclaimedNodes(reclaimedNodeIds)
          // Also update localStorage for offline persistence
          localStorage.setItem('completedNodes', JSON.stringify(reclaimedNodeIds))
        } else {
          // Fallback to localStorage if database fetch fails
          const saved = localStorage.getItem('completedNodes')
          if (saved) {
            setReclaimedNodes(JSON.parse(saved))
          }
        }
      } catch (error) {
        console.error('Failed to load reclaimed nodes:', error)
        // Fallback to localStorage
        const saved = localStorage.getItem('completedNodes')
        if (saved) {
          setReclaimedNodes(JSON.parse(saved))
        }
      }
    }
    loadReclaimedNodes()
  }, [])

  // Handle zoom and pan
  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setViewBox(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(2, prev.scale * delta))
    }))
  }

  const handlePan = (e) => {
    if (e.buttons === 1) { // Left mouse button
      const startX = e.clientX - viewBox.x
      const startY = e.clientY - viewBox.y
      
      const handleMouseMove = (moveEvent) => {
        setViewBox(prev => ({
          ...prev,
          x: moveEvent.clientX - startX,
          y: moveEvent.clientY - startY
        }))
      }
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
      
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  const getNodeStatus = (nodeId) => {
    const isReclaimed = reclaimedNodes.includes(nodeId)
    const node = getNodeById(nodeId)
    
    if (!node) return 'locked'
    
    const prerequisitesMet = node.prerequisites.every(prereq => reclaimedNodes.includes(prereq))
    
    if (isReclaimed) {
      return 'reclaimed'
    } else if (prerequisitesMet) {
      return 'unlocked'
    } else {
      return 'locked'
    }
  }

  const getNodeStyles = (status) => {
    switch (status) {
      case 'reclaimed':
        return {
          bgColor: 'rgba(212, 175, 55, 0.3)',
          borderColor: '#D4AF37',
          textColor: '#FFD700',
          shadowColor: 'rgba(212, 175, 55, 0.5)'
        }
      case 'unlocked':
        return {
          bgColor: 'rgba(34, 197, 94, 0.2)',
          borderColor: '#22C55E',
          textColor: '#22C55E',
          shadowColor: 'rgba(34, 197, 94, 0.3)'
        }
      case 'locked':
        return {
          bgColor: 'rgba(107, 114, 128, 0.2)',
          borderColor: '#6B7280',
          textColor: '#6B7280',
          shadowColor: 'rgba(107, 114, 128, 0.3)'
        }
      default:
        return {
          bgColor: 'rgba(107, 114, 128, 0.2)',
          borderColor: '#6B7280',
          textColor: '#6B7280',
          shadowColor: 'rgba(107, 114, 128, 0.3)'
        }
    }
  }

  const getSectorColor = (sectorName) => {
    const sectorColors = {
      'Foundations': '#9333ea',
      'Advanced': '#22c55e',
      'Expert': '#ef4444'
    }
    return sectorColors[sectorName] || '#9333ea'
  }

  // Recon Mission - Future functionality for reviewing conquered concepts
  const reconMission = (nodeId) => {
    console.log(`Recon Mission: Reviewing conquered concept ${nodeId}`)
    // TODO: Implement concept review interface
    // - Load historical performance data
    // - Show mastery progression
    // - Offer refresher challenges
    // - Display achievement badges
  }

  const renderConnections = () => {
    const nodes = getAllNodes()
    const connections = []
    
    // Create connections based on prerequisites
    nodes.forEach(node => {
      node.prerequisites.forEach(prereqId => {
        connections.push({
          from: prereqId,
          to: node.id
        })
      })
    })
    
    return connections.map((connection, index) => {
      const fromNode = getNodeById(connection.from)
      const toNode = getNodeById(connection.to)
      
      if (!fromNode || !toNode) return null
      
      const fromStatus = getNodeStatus(connection.from)
      const toStatus = getNodeStatus(connection.to)
      
      return (
        <motion.line
          key={index}
          x1={fromNode.coordinates?.x || 0}
          y1={fromNode.coordinates?.y || 0}
          x2={toNode.coordinates?.x || 0}
          y2={toNode.coordinates?.y || 0}
          stroke={fromStatus.borderColor}
          strokeWidth="2"
          strokeOpacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: index * 0.1 }}
        />
      )
    }).filter(Boolean)
  }

  const renderNodes = () => {
    return getAllNodes().map((node, index) => {
      const status = getNodeStatus(node.id)
      const sectorColor = getSectorColor(node.sector)
      const isSelected = selectedNode?.id === node.id
      const isHovered = hoveredNode?.id === node.id
      
      // Special handling for Node 1 (Molten Gold) and Node 2 (Gold pulse when unlocked)
      const isNode1 = node.id === 'ged-001'
      const isNode2 = node.id === 'ged-002'
      const shouldShowGoldPulse = isNode2 && !status.isLocked
      
      return (
        <motion.g key={node.id}>
          {/* Shimmer effect for reclaimed nodes */}
          {status === 'reclaimed' && (
            <motion.circle
              cx={node.coordinates.x}
              cy={node.coordinates.y}
              r={35}
              fill="none"
              stroke="url(#goldShimmer)"
              strokeWidth="3"
              animate={{
                rotate: [0, 360],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{ 
                transformOrigin: `${node.coordinates.x}px ${node.coordinates.y}px`,
                pointerEvents: 'none'
              }}
            />
          )}
          
          {/* Node Glow */}
          <motion.circle
            cx={node.coordinates.x}
            cy={node.coordinates.y}
            r={isSelected ? 35 : isHovered ? 30 : 25}
            fill={status.glowColor}
            stroke={status.borderColor}
            strokeWidth="3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isSelected ? 1.2 : isHovered ? 1.1 : 1,
              opacity: 0.8 
            }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            style={{ filter: 'blur(8px)' }}
            whileHover={{ scale: status.isLocked ? 1 : 1.1 }}
            whileTap={{ scale: status.isLocked ? 1 : 0.95 }}
            onClick={() => !status.isLocked && onNodeSelect(node)}
            onHoverStart={() => setHoveredNode(node)}
            onHoverEnd={() => setHoveredNode(null)}
          />
          
          {/* Node Core */}
          <motion.circle
            cx={node.coordinates.x}
            cy={node.coordinates.y}
            r={20}
            fill={status.bgColor}
            stroke={status.borderColor}
            strokeWidth="3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            style={{ 
              cursor: status.isLocked ? 'not-allowed' : 'pointer',
              filter: status.isLocked ? 'grayscale(100%)' : 'none'
            }}
          />
          
          {/* Node Icon */}
          <motion.text
            x={node.coordinates.x}
            y={node.coordinates.y}
            textAnchor="middle"
            fontSize="16"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
            style={{ pointerEvents: 'none' }}
          >
            {node.icon}
          </motion.text>
          
          {/* Node Title */}
          {isHovered && (
            <motion.text
              x={node.coordinates.x}
              y={node.coordinates.y + 40}
              textAnchor="middle"
              fontSize="12"
              fill="white"
              initial={{ opacity: 0, y: node.coordinates.y + 40 }}
              animate={{ opacity: 1, y: node.coordinates.y + 40 }}
              transition={{ duration: 0.2 }}
              style={{ pointerEvents: 'none' }}
            >
              {node.title}
            </motion.text>
          )}
          
          {/* Progress Ring for unlocked nodes */}
          {!status.isLocked && node.masteryLevel > 0 && (
            <motion.circle
              cx={node.coordinates.x}
              cy={node.coordinates.y}
              r={23}
              fill="none"
              stroke={sectorColor}
              strokeWidth="3"
              strokeDasharray={`${node.masteryLevel * 1.5} ${150 - node.masteryLevel * 1.5}`}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
              transform={`rotate(-90 ${node.coordinates.x} ${node.coordinates.y})`}
              style={{ transformOrigin: `${node.coordinates.x}px ${node.coordinates.y}px` }}
            />
          )}
          
          {/* Gold Pulse for Node 2 when unlocked */}
          {shouldShowGoldPulse && (
            <motion.circle
              cx={node.coordinates.x}
              cy={node.coordinates.y}
              r={30}
              fill="none"
              stroke="#FFD700"
              strokeWidth="2"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ 
                filter: 'blur(0px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
        </motion.g>
      )
    })
  }

  return (
    <div className="mastery-map-container">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 'px',
              height: Math.random() * 3 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
      </div>
      
      {/* SVG Map */}
      <svg
        ref={mapRef}
        className="w-full h-full relative z-10"
        viewBox={`${viewBox.x} ${viewBox.y} 1200 600`}
        onWheel={handleWheel}
        onMouseDown={handlePan}
        style={{ cursor: 'grab' }}
      >
        {/* Grid Lines */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(147, 51, 234, 0.1)" strokeWidth="1"/>
          </pattern>
          <linearGradient id="goldShimmer" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8"/>
            <stop offset="50%" stopColor="#FFA500" stopOpacity="1"/>
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8"/>
          </linearGradient>
        </defs>
        <rect width="1200" height="600" fill="url(#grid)" />
        
        {/* Four Strongholds Background Regions */}
        <g opacity="0.15">
          {/* Zone Alpha: Foundations Frontier */}
          <rect x="50" y="350" width="500" height="200" fill="none" stroke="#CD7F32" strokeWidth="2" strokeDasharray="10,5" rx="20" />
          <text x="300" y="380" textAnchor="middle" fill="#CD7F32" fontSize="16" fontWeight="bold">ZONE ALPHA: FOUNDATIONS FRONTIER</text>
          <text x="300" y="400" textAnchor="middle" fill="#CD7F32" fontSize="12" opacity="0.8">The basics they must own</text>
          
          {/* Zone Bravo: Algebra Highlands */}
          <rect x="600" y="50" width="500" height="200" fill="none" stroke="#C0C0C0" strokeWidth="2" strokeDasharray="10,5" rx="20" />
          <text x="850" y="80" textAnchor="middle" fill="#C0C0C0" fontSize="16" fontWeight="bold">ZONE BRAVO: ALGEBRA HIGHLANDS</text>
          <text x="850" y="100" textAnchor="middle" fill="#C0C0C0" fontSize="12" opacity="0.8">The heart of the battle</text>
          
          {/* Zone Charlie: Measurement Outposts */}
          <rect x="750" y="350" width="400" height="200" fill="none" stroke="#FFD700" strokeWidth="2" strokeDasharray="10,5" rx="20" />
          <text x="950" y="380" textAnchor="middle" fill="#FFD700" fontSize="16" fontWeight="bold">ZONE CHARLIE: MEASUREMENT OUTPOSTS</text>
          <text x="950" y="400" textAnchor="middle" fill="#FFD700" fontSize="12" opacity="0.8">Geometry and Shapes</text>
          
          {/* Zone Delta: Data Stronghold */}
          <rect x="300" y="50" width="400" height="200" fill="none" stroke="#E5E4E2" strokeWidth="2" strokeDasharray="10,5" rx="20" />
          <text x="500" y="80" textAnchor="middle" fill="#E5E4E2" fontSize="16" fontWeight="bold">ZONE DELTA: DATA STRONGHOLD</text>
          <text x="500" y="100" textAnchor="middle" fill="#E5E4E2" fontSize="12" opacity="0.8">Graphs and Stats</text>
        </g>
        
        {/* Connections */}
        <g>{renderConnections()}</g>
        
        {/* Nodes */}
        <g>{renderNodes()}</g>
      </svg>
      
      {/* Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
        <button
          onClick={() => setViewBox(prev => ({ ...prev, scale: Math.min(2, prev.scale * 1.2) }))}
          className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition"
        >
          +
        </button>
        <span className="text-white text-xs px-2">
          {Math.round(viewBox.scale * 100)}%
        </span>
        <button
          onClick={() => setViewBox(prev => ({ ...prev, scale: Math.max(0.5, prev.scale * 0.8) }))}
          className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition"
        >
          -
        </button>
        <button
          onClick={() => setViewBox({ x: 0, y: 0, scale: 1 })}
          className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition"
        >
          Reset
        </button>
      </div>
      
      {/* Legend */}
      {renderLegend()}
      
      {/* Map Legend */}
      <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20">
        <h4 className="text-xs font-bold text-white mb-2">MAP LEGEND</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-xs text-yellow-400">Gold (Gilded): Mastery Reclaimed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            <span className="text-xs text-purple-400">Purple (Unlocked): Current Objective</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <span className="text-xs text-gray-400">Gray (Locked): Future Territory</span>
          </div>
        </div>
      </div>
      
      {/* Selected Node Info */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-4 right-4 z-20 bg-black/80 backdrop-blur-md rounded-lg p-4 max-w-xs"
          >
            <h3 className="text-white font-semibold mb-2">{selectedNode.title}</h3>
            <p className="text-gray-300 text-xs mb-2">{selectedNode.description}</p>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Territory:</span>
              <span 
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: getSectorColor(selectedNode.sector) }}
              >
                {selectedNode.sector}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">Difficulty:</span>
              <span className="text-yellow-400 text-xs">{selectedNode.difficulty}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-xs">Est. Time:</span>
              <span className="text-blue-400 text-xs">{selectedNode.estimatedTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs">XP Required:</span>
              <span className="text-purple-400 text-sm font-semibold">{selectedNode.xpRequired}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MasteryMap
