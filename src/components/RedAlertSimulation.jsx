import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const RedAlertSimulation = ({ 
  isMissionActive, 
  missionTimer, 
  successProbability,
  children 
}) => {
  const [scanningPosition, setScanningPosition] = useState(0)

  // Scanning line animation
  useEffect(() => {
    if (isMissionActive) {
      const interval = setInterval(() => {
        setScanningPosition(prev => (prev + 2) % 100)
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isMissionActive])

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes scanning {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      
      @keyframes radial-pulse {
        0% { transform: scale(1); opacity: 0.1; }
        50% { transform: scale(1.1); opacity: 0.3; }
        100% { transform: scale(1); opacity: 0.1; }
      }
      
      .scanning-line {
        animation: scanning 2s linear infinite;
      }
      
      .radial-pulse {
        animation: radial-pulse 3s ease-in-out infinite;
      }
      
      .red-alert-bg {
        background: radial-gradient(circle at center, rgba(255, 49, 49, 0.1) 0%, transparent 70%);
      }
      
      .red-alert-border {
        border-color: #FF3131;
        box-shadow: 0 0 20px rgba(255, 49, 49, 0.3);
      }
      
      .red-alert-text {
        color: #FF3131;
        text-shadow: 0 0 10px rgba(255, 49, 49, 0.8);
      }
      
      .mission-critical {
        animation: pulse 1s ease-in-out infinite;
        border-color: #FF3131;
      }
      
      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 10px rgba(255, 49, 49, 0.3); }
        50% { box-shadow: 0 0 20px rgba(255, 49, 49, 0.8); }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className={`relative min-h-screen ${isMissionActive ? 'red-alert-bg' : ''}`}>
      {/* Scanning Line Animation */}
      {isMissionActive && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 opacity-50">
            <div 
              className="h-full bg-red-500 scanning-line"
              style={{
                transform: `translateX(${scanningPosition - 50}%)`,
                boxShadow: '0 0 10px rgba(255, 49, 49, 0.8)'
              }}
            />
          </div>
        </div>
      )}

      {/* Mission Timer Display */}
      {isMissionActive && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-4 py-2 rounded-lg neon-card ${
            successProbability < 72.5 ? 'mission-critical' : ''
          }`}>
            <div className="text-center">
              <div className="text-xs data-text-secondary mb-1">MISSION TIMER</div>
              <div className={`text-2xl font-mono font-bold ${
                successProbability < 72.5 ? 'red-alert-text' : 'text-verve'
              }`}>
                {Math.floor(missionTimer / 60)}:{(missionTimer % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm data-text-secondary mt-1">
                SUCCESS PROBABILITY: {successProbability.toFixed(1)}%
              </div>
              {successProbability < 72.5 && (
                <div className="text-xs red-alert-text font-bold mt-2">
                  ⚠️ MISSION CRITICAL
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={isMissionActive ? 'radial-pulse' : ''}>
        {children}
      </div>
    </div>
  )
}

export default RedAlertSimulation
