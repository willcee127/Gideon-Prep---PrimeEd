import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getNodeById } from '../data/mathContent'
import { getAllNodes } from '../data/mathContent'

const DailyObjective = ({ userName, completedNodes, onNodeSelect }) => {
  const [nextNode, setNextNode] = useState(null)

  useEffect(() => {
    // Get all available nodes
    const allNodes = getAllNodes()
    
    // Find the next available node (not completed)
    const nextAvailableNode = allNodes.find(n => !completedNodes.includes(n.id))
    
    if (nextAvailableNode) {
      setNextNode(nextAvailableNode)
    }
  }, [completedNodes])

  if (!nextNode) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
      >
        <div className="bg-gradient-to-br from-yellow-500/95 to-yellow-600/95 border-2 border-yellow-400/50 rounded-3xl p-8 max-w-md mx-4 shadow-2xl">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="text-2xl font-bold text-black">
              All Territories Reclaimed!
            </h3>
            <p className="text-black/70">
              Congratulations, {userName || 'Warrior'}! You've mastered all available territories.
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
    >
      <div className="bg-gradient-to-br from-purple-500/95 to-purple-600/95 border-2 border-purple-400/50 rounded-3xl p-8 max-w-md mx-4 shadow-2xl">
        <div className="text-center space-y-6">
          {/* Node Icon */}
          <div className="w-16 h-16 mx-auto bg-purple-400 rounded-full flex items-center justify-center">
            <span className="text-3xl">{nextNode.icon}</span>
          </div>
          
          {/* Welcome Message */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">
              Welcome back, {userName || 'Warrior'}!
            </h3>
            <p className="text-purple-200 text-sm">
              Your next territory is:
            </p>
            <p className="text-2xl font-bold text-yellow-300">
              {nextNode.title}
            </p>
          </div>
          
          {/* Node Details */}
          <div className="bg-black/30 rounded-xl p-4 border border-purple-400/30">
            <div className="flex justify-between text-xs text-purple-300 mb-2">
              <span>Sector: {nextNode.sector}</span>
              <span>Difficulty: {nextNode.difficulty}</span>
            </div>
            <p className="text-purple-200 text-sm">
              {nextNode.description}
            </p>
          </div>
          
          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNodeSelect(nextNode.id)}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-bold transition transform"
          >
            Ready to engage?
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default DailyObjective
