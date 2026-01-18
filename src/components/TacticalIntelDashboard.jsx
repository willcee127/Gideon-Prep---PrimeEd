import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const TacticalIntelDashboard = () => {
  const [combatPower, setCombatPower] = useState({
    math: 75,
    rla: 82,
    science: 68,
    socialStudies: 71
  })
  
  const [frictionPoints, setFrictionPoints] = useState([
    { concept: 'Quadratic Equations', accuracy: 45, priority: 'high' },
    { concept: 'Linear Functions', accuracy: 78, priority: 'medium' },
    { concept: 'Polynomial Division', accuracy: 52, priority: 'high' },
    { concept: 'Coordinate Geometry', accuracy: 85, priority: 'low' }
  ])
  
  const [repsData, setRepsData] = useState([
    { day: 'Mon', reps: 24 },
    { day: 'Tue', reps: 18 },
    { day: 'Wed', reps: 32 },
    { day: 'Thu', reps: 28 },
    { day: 'Fri', reps: 15 },
    { day: 'Sat', reps: 41 },
    { day: 'Sun', reps: 37 }
  ])
  
  const [warriorRank, setWarriorRank] = useState('Specialist')
  const [sovereigntyProgress, setSovereigntyProgress] = useState(145)

  const totalReps = repsData.reduce((sum, day) => sum + day.reps, 0)
  const maxReps = Math.max(...repsData.map(d => d.reps))

  // Calculate rank based on total reps
  useEffect(() => {
    if (totalReps < 100) setWarriorRank('Recruit')
    else if (totalReps < 300) setWarriorRank('Specialist')
    else if (totalReps < 600) setWarriorRank('Elite Warrior')
    else setWarriorRank('Commander')
  }, [totalReps])

  const MasteryRing = ({ progress, subject }) => {
    const radius = 40
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (circumference * progress) / 100

    return (
      <div className="flex flex-col items-center">
        <svg width="100" height="100" className="transform -rotate-90">
          <circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="#374151"
            strokeWidth="8"
          />
          <motion.circle
            cx="50" cy="50" r={radius}
            fill="transparent"
            stroke="#f59e0b"
            strokeWidth="8"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeInOut" }}
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.5))'
            }}
          />
        </svg>
        <div className="text-xs text-gray-400 mt-2">{subject}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white font-mono overflow-x-hidden" style={{backgroundColor: '#0a0a0b'}}>
      {/* Warrior Status Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-sm text-gray-400">Warrior Status</div>
                <div className="text-xl font-bold text-amber-400" style={{color: '#f59e0b'}}>{warriorRank}</div>
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">Sovereignty Progress</div>
                <div className="w-full bg-slate-800 rounded-full h-3">
                  <div 
                    className="h-full rounded-full transition-all duration-500 tactical-transition"
                    style={{ 
                      width: `${(sovereigntyProgress / 200) * 100}%`,
                      backgroundColor: '#f59e0b'
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{sovereigntyProgress}/200</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Mastery Heatmap - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-bold mb-6 text-white">Mastery Heatmap</h2>
              <div className="grid grid-cols-4 gap-6">
                <MasteryRing progress={combatPower.math} subject="Math" />
                <MasteryRing progress={combatPower.rla} subject="RLA" />
                <MasteryRing progress={combatPower.science} subject="Science" />
                <MasteryRing progress={combatPower.socialStudies} subject="Social Studies" />
              </div>
            </div>
          </div>

          {/* Tactical Intel Widget - Takes 1 column */}
          <div>
            <div className="bg-slate-800 rounded-2xl p-6 border-2 border-orange-500/50" style={{border: '2px solid #f59e0b', boxShadow: '0 0 20px rgba(245, 158, 11, 0.1)'}}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-bold text-white">INTEL: High-Friction Sector Detected</h2>
              </div>
              <div className="space-y-3">
                <div className="text-gray-300">
                  You are currently stalling on <span className="text-orange-400 font-bold">Quadratic Equations</span>.
                </div>
                <div className="text-sm text-gray-400">
                  Deploy Socratic Co-Pilot?
                </div>
                <button className="w-full mt-4 bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 tactical-transition orange-glow-hover">
                  DEPLOY BREAKTHROUGH
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Second Row - Reps & Momentum Chart */}
        <div className="mt-8">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-6 text-white">Reps & Momentum</h2>
            <div className="flex items-end justify-between h-32 gap-2">
              {repsData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <motion.div 
                    className="w-full bg-slate-600 rounded-t transition-all duration-300 tactical-transition hover:bg-orange-500/20"
                    style={{ 
                      height: `${(data.reps / maxReps) * 100}%`,
                      backgroundColor: data.reps === maxReps ? '#f59e0b' : '#4b5563'
                    }}
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.reps / maxReps) * 100}%` }}
                    transition={{ delay: index * 0.1 }}
                    title={`${data.reps} reps on ${data.day}`}
                  />
                  <div className="text-xs text-gray-400 mt-2">{data.day}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-gray-400">
              Total: <span className="text-orange-400 font-bold">{totalReps}</span> reps this week
            </div>
          </div>
        </div>

        {/* Friction Points Detail */}
        <div className="mt-8">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-6 text-white">Friction Analysis</h2>
            <div className="space-y-4">
              {frictionPoints.map((point, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-white">{point.concept}</div>
                    <div className="text-sm text-gray-400">Accuracy: {point.accuracy}%</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    point.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    point.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {point.priority.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx>{`
        .tactical-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .orange-glow-hover:hover {
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
          border-color: #f59e0b;
        }
      `}</style>
    </div>
  )
}

export default TacticalIntelDashboard
