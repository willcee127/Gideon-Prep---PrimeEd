import React from 'react'
import CommandCalc from './CommandCalc/CommandCalc'
import { motion, AnimatePresence } from 'framer-motion'
import PrimeStudioCard from '../PrimeStudioCard'

const SlideInPanel = ({ 
  isOpen, 
  onClose, 
  selectedNode, 
  userName, 
  completedNodes,
  onProblemSuccess,
  onShowCommandCalc
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 bottom-0 w-2/5 max-w-2xl z-40 bg-black/95 backdrop-blur-xl border-l border-white/20 shadow-2xl"
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="text-white">
              <h3 className="text-lg font-bold">
                {selectedNode?.title || 'Neural Practice Engine'}
              </h3>
              {selectedNode && (
                <p className="text-xs text-gray-400">
                  {selectedNode.sector} • {selectedNode.difficulty}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 hover:text-white transition-colors"
              >
                ✕
              </button>
              <button
                onClick={onShowCommandCalc}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                🎯 COMMAND CALC
              </button>
            </div>
          </div>

          {/* Panel Content - Pass practiceMode and selectedNode */}
          <div className="h-full overflow-y-auto">
            <PrimeStudioCard 
              userName={userName}
              practiceMode={true}
              selectedNode={selectedNode}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SlideInPanel
