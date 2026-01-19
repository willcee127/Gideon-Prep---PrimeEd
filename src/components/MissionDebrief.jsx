import React from 'react'
import { motion } from 'framer-motion'
import { getProjectedGEDScore, analyzeFrictionPoints } from '../utils/gededScoreCalculator'

const MissionDebrief = ({ 
  missionData, 
  sessionData, 
  radarData, 
  timePerQuestion,
  missionSuccess,
  elapsed 
}) => {
  const { projectedScore, breakdown, lowestSectors, recommendations } = analyzeFrictionPoints(radarData, timePerQuestion)
  const isPassed = missionSuccess && projectedScore >= 145
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{ backgroundColor: 'rgba(11, 14, 20, 0.95)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`w-full max-w-4xl neon-card p-8 ${
          isPassed ? 'border-green-400' : 'border-red-500'
        }`}
        style={{
          boxShadow: isPassed 
            ? '0 0 30px rgba(34, 197, 94, 0.5)' 
            : '0 0 30px rgba(255, 49, 49, 0.8)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`text-3xl font-bold mb-4 ${
            isPassed ? 'text-green-400' : 'text-red-500'
          }`}>
            {isPassed ? 'MISSION COMPLETE' : 'MISSION FAILED'}
          </div>
          <div className="text-xl data-text-secondary mb-6">
            Final Simulation Results
          </div>
        </div>

        {/* Call Sign Display */}
        <div className="text-center mb-8">
          <div className="inline-block px-6 py-3 neon-card rounded-lg">
            <div className="text-sm data-text-secondary mb-2">CALL SIGN:</div>
            <div className="text-2xl font-mono text-verve font-bold">
              {sessionData.warriorRank || 'WARRIOR'}
            </div>
          </div>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <div className="text-lg data-text-secondary mb-2">PROJECTED GED SCORE</div>
            <div className={`text-5xl font-bold ${
              projectedScore >= 145 ? 'text-green-400' : 'text-red-500'
            }`}>
              {projectedScore}/200
            </div>
            <div className="text-sm data-text-secondary mt-2">
              {projectedScore >= 145 ? 'PASSING SCORE' : 'BELOW PASSING THRESHOLD'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-lg data-text-secondary mb-2">MISSION TIME</div>
            <div className="text-3xl font-mono text-verve">
              {Math.floor(elapsed / 60)}:{(elapsed % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm data-text-secondary mt-2">
              {isPassed ? 'COMPLETED WITHIN TIME LIMIT' : 'TIME EXPIRED'}
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-verve">Performance Breakdown</h3>
          <div className="space-y-3">
            {breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 neon-card rounded">
                <div className="flex-1">
                  <div className="font-medium data-text">{item.axis}</div>
                  <div className="text-sm data-text-secondary">
                    Score: {item.score}/100 | Weight: {(item.weight * 100).toFixed(0)}% | Contribution: {item.weightedContribution.toFixed(1)}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    item.percentage >= 70 ? 'text-green-400' : 
                    item.percentage >= 50 ? 'text-yellow-400' : 'text-red-500'
                  }`}>
                    {item.percentage.toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Friction Analysis */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-verve">Friction Analysis</h3>
          <div className="space-y-2">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 neon-card rounded ${
                rec.priority === 'critical' ? 'border-red-500' :
                rec.priority === 'high' ? 'border-orange-400' :
                'border-yellow-400'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    rec.priority === 'critical' ? 'bg-red-500' :
                    rec.priority === 'high' ? 'bg-orange-400' :
                    'bg-yellow-400'
                  }`} />
                  <div className="flex-1">
                    <div className={`font-medium ${
                      rec.priority === 'critical' ? 'text-red-500' :
                      rec.priority === 'high' ? 'text-orange-400' :
                      'text-yellow-400'
                    }`}>
                      {rec.axis.toUpperCase()} - {rec.priority.toUpperCase()}
                    </div>
                    <div className="text-sm data-text-secondary mt-1">
                      {rec.action}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Study Plan */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-verve">Immediate Action Items</h3>
          <div className="space-y-2">
            {lowestSectors.map((sector, index) => (
              <div key={index} className="p-4 neon-card rounded border-red-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium text-red-500">
                      {sector.axis.toUpperCase()} - CRITICAL FRICTION
                    </div>
                    <div className="text-sm data-text-secondary">
                      Speed: {sector.speed.toFixed(1)} q/min | Efficiency: {sector.efficiency.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="text-sm data-text-secondary">
                  Return to Verve-Sector 3 for re-verification and speed drills.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={() => {
              // Close debrief and return to dashboard
              window.location.href = '/tacticalintel'
            }}
            className={`phase-btn font-bold py-4 px-8 text-lg ${
              isPassed 
                ? 'bg-green-400 text-black hover:bg-green-500' 
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {isPassed ? 'RETURN TO TACTICAL DASHBOARD' : 'RETURN TO TRAINING'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default MissionDebrief
