import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNeuro } from '../context/NeuroProvider'
import { supabase } from '../lib/supabase'
import { getNodeById } from '../data/mathContent'

const ExamEngine = ({ nodeId, onComplete, userName }) => {
  const { stressLevel, isStressed } = useNeuro()
  
  const [examState, setExamState] = useState('ready') // ready, active, completed
  const [timeRemaining, setTimeRemaining] = useState(900) // 15 minutes in seconds
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [stressSamples, setStressSamples] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [showAuraGlow, setShowAuraGlow] = useState(false)
  
  // Get stronghold node data
  const strongholdNode = getNodeById(nodeId)
  const problems = strongholdNode?.problems || []
  const currentProblem = problems[currentProblemIndex]

  // Timer effect
  useEffect(() => {
    if (examState === 'active' && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0 && examState === 'active') {
      completeExam()
    }
  }, [examState, timeRemaining])

  // Stress monitoring effect
  useEffect(() => {
    if (examState === 'active') {
      const interval = setInterval(() => {
        setStressSamples(prev => [...prev, stressLevel])
        
        // Show aura glow if stress is high
        if (stressLevel > 75) {
          setShowAuraGlow(true)
        } else {
          setShowAuraGlow(false)
        }
      }, 2000)
      
      return () => clearInterval(interval)
    }
  }, [examState])

  const startExam = () => {
    setExamState('active')
    setStartTime(Date.now())
    setAnswers(new Array(problems.length).fill(null))
    setStressSamples([])
  }

  const handleAnswer = (answer) => {
    const newAnswers = [...answers]
    newAnswers[currentProblemIndex] = {
      answer,
      timestamp: Date.now(),
      stressLevel,
      timeSpent: Date.now() - startTime
    }
    setAnswers(newAnswers)
    
    // Move to next problem or complete
    if (currentProblemIndex < problems.length - 1) {
      setCurrentProblemIndex(prev => prev + 1)
    } else {
      completeExam()
    }
  }

  const completeExam = () => {
    setExamState('completed')
    
    // Calculate metrics
    const correctAnswers = answers.filter((a, i) => 
      a && a.answer === problems[i].answer
    ).length
    
    const accuracy = problems.length > 0 ? (correctAnswers / problems.length) * 100 : 0
    
    // Calculate stability (inverse of average stress)
    const avgStress = stressSamples.length > 0 
      ? stressSamples.reduce((sum, s) => sum + s, 0) / stressSamples.length 
      : 50
    const stability = Math.max(0, 100 - avgStress)
    
    // Calculate efficiency (ideal time = 90 seconds per problem)
    const totalTime = (Date.now() - startTime) / 1000
    const idealTime = problems.length * 90
    const efficiency = Math.max(0, Math.min(100, (idealTime / totalTime) * 100))
    
    // Calculate Gideon Readiness Score
    const readinessScore = (accuracy * 0.5) + (stability * 0.3) + (efficiency * 0.2)
    
    // Log exam results
    logExamResults({
      accuracy,
      stability,
      efficiency,
      readinessScore,
      correctAnswers,
      totalTime,
      stressSamples
    })
    
    if (onComplete) {
      onComplete({
        accuracy,
        stability,
        efficiency,
        readinessScore,
        correctAnswers,
        totalTime,
        passed: readinessScore >= 80
      })
    }
  }

  const logExamResults = async (results) => {
    try {
      const userId = localStorage.getItem('gideon_user_name') || 'anonymous'
      
      await supabase
        .from('exam_results')
        .insert([
          {
            user_id: userId,
            exam_id: nodeId,
            accuracy: results.accuracy,
            stability: results.stability,
            efficiency: results.efficiency,
            readiness_score: results.readinessScore,
            correct_answers: results.correctAnswers,
            total_time: results.totalTime,
            stress_samples: results.stressSamples,
            passed: results.passed,
            created_at: new Date().toISOString()
          }
        ])
      
      console.log('Exam results logged successfully')
    } catch (error) {
      console.error('Failed to log exam results:', error)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (examState === 'ready') {
    return (
      <div className="w-full h-full bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-3xl">🏰</span>
          </div>
          
          <h2 className="text-2xl font-bold text-white">
            GED Stronghold Exam
          </h2>
          
          <div className="bg-black/30 rounded-xl p-4 max-w-md">
            <h3 className="text-red-400 font-semibold mb-2">EXAM PROTOCOL</h3>
            <ul className="text-gray-300 text-sm space-y-1 text-left">
              <li>• 15 minutes timed session</li>
              <li>• 10 problems covering all foundations</li>
              <li>• No review options during exam</li>
              <li>• Stay calm and focused</li>
            </ul>
          </div>
          
          <button
            onClick={startExam}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition transform hover:scale-105"
          >
            BEGIN EXAM
          </button>
        </div>
      </div>
    )
  }

  if (examState === 'active' && currentProblem) {
    return (
      <div className={`w-full h-full bg-gray-800 rounded-lg p-6 relative ${showAuraGlow ? 'ring-4 ring-blue-400/50' : ''}`}>
        {/* Aura Glow Effect */}
        <AnimatePresence>
          {showAuraGlow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
                animation: 'pulse 2s infinite'
              }}
            />
          )}
        </AnimatePresence>
        
        {/* Timer Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-white">
            <span className="text-sm">Problem {currentProblemIndex + 1} of {problems.length}</span>
          </div>
          <div className={`text-xl font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-white'}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>
        
        {/* Problem Display */}
        <div className="bg-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Solve for x:
          </h3>
          <div className="text-2xl text-center text-white font-mono">
            {currentProblem.equation}
          </div>
        </div>
        
        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-4">
          {['5', '6', '8', '10'].map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition"
            >
              x = {option}
            </button>
          ))}
        </div>
        
        {/* Stress Indicator */}
        {stressLevel > 75 && (
          <div className="mt-4 text-center">
            <p className="text-blue-400 text-sm">
              🌊 Remember your breathing techniques
            </p>
          </div>
        )}
      </div>
    )
  }

  return null // Will be handled by parent component for completed state
}

export default ExamEngine
