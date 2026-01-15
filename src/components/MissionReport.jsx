import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const MissionReport = ({ 
  isOpen, 
  onClose, 
  studentStats = {}, 
  missionData = {}, 
  onPrintReport = () => {}
}) => {
  const [isPrinting, setIsPrinting] = useState(false)
  const printRef = useRef(null)

  // Calculate mission statistics
  const calculateMissionStats = () => {
    const totalReps = studentStats.totalCorrect || 0
    const commandLevel = studentStats.commandLevel || 0
    const accuracy = studentStats.accuracyRate || 0
    const zonesCompleted = studentStats.zonesCompleted || []
    const currentRank = studentStats.rank || 'RECRUIT'
    
    return {
      totalReps,
      commandLevel,
      accuracy,
      zonesCompleted,
      currentRank,
      missionData
    }
  }

  // Generate printable mission report
  const generatePrintableReport = () => {
    const stats = calculateMissionStats()
    
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Mission Report - ${studentStats.userName || 'Warrior'}</title>
  <style>
    @media print {
      @page {
        margin: 0.5in;
        size: A4;
      }
      
      body {
        font-family: 'Courier New, monospace';
        font-size: 12pt;
        line-height: 1.2;
        color: #000;
        background: #fff;
      }
      
      .certificate-page {
        width: 100%;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 20px;
        box-sizing: border-box;
      }
      
      .certificate-header {
        text-align: center;
        margin-bottom: 30px;
      }
      
      .certificate-title {
        font-size: 28pt;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 10px;
      }
      
      .certificate-subtitle {
        font-size: 16pt;
        color: #666;
        margin-bottom: 5px;
      }
      
      .certificate-body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 0%, #667eea 100%);
        border: 2px solid #2c3e50;
        border-radius: 10px;
        padding: 30px;
        margin-bottom: 20px;
      }
      
      .certificate-name {
        font-size: 20pt;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 15px;
      }
      
      .certificate-content {
        font-size: 14pt;
        line-height: 1.4;
        color: #333;
        margin-bottom: 20px;
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 30px;
      }
      
      .stat-item {
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #f9f9f9;
      }
      
      .stat-label {
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 5px;
      }
      
      .stat-value {
        font-size: 18pt;
        color: #333;
      }
      
      .rank-badge {
        display: inline-block;
        padding: 4px 8px;
        background: ${getRankColor(stats.currentRank)};
        border-radius: 4px;
        color: #fff;
        font-weight: bold;
        font-size: 12px;
        margin-left: 10px;
      }
      
      .zones-list {
        margin-top: 15px;
      }
      
      .zone-item {
        padding: 8px;
        margin-bottom: 5px;
        border-left: 3px solid ${getRankColor(stats.currentRank)};
        padding-left: 10px;
      }
      
      .zone-name {
        font-weight: bold;
        color: #2c3e50;
      }
      
      .clear-both {
        clear: both;
      }
      
      .footer {
        margin-top: 40px;
        text-align: center;
        font-size: 12px;
        color: #666;
        border-top: 2px solid #2c3e50;
        padding-top: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="certificate-page">
    <div class="certificate-header">
      <h1 class="certificate-title">OFFICIAL MISSION COMMENDATION</h1>
      <p class="certificate-subtitle">GED COMMAND LEVEL ATTAINED</p>
    </div>
    
    <div class="certificate-body">
      <p class="certificate-name">${studentStats.userName || 'Warrior'}</p>
      <p class="certificate-date">${new Date().toLocaleDateString()}</p>
      <div class="certificate-content">
        <h3>Mission Summary</h3>
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Total Reps Secured</div>
            <div class="stat-value">${stats.totalReps}</div>
          </div>
          
          <div class="stat-item">
            <div class="stat-label">Command Level</div>
            <div class="stat-value">${stats.commandLevel}%</div>
            <div class="rank-badge">${getRankInfo(stats.currentRank).icon}</div>
            <div class="stat-value">${getRankInfo(stats.currentRank).title}</div>
          </div>
          
          <div class="stat-item">
            <div class="stat-label">Accuracy Rate</div>
            <div class="stat-value">${stats.accuracy}%</div>
          </div>
          
          <div class="stat-item">
            <div class="stat-label">Current Rank</div>
            <div class="rank-badge">${getRankInfo(stats.currentRank).icon}</div>
            <div class="stat-value">${getRankInfo(stats.currentRank).title}</div>
          </div>
        </div>
        
        <h3>Zones Secured</h3>
        <div class="zones-list">
          ${stats.zonesCompleted.map(zone => `
            <div class="zone-item">
              <div class="zone-name">${zone}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="clear-both"></div>
      
      <div class="footer">
        <p>Signed: Mission Commander</p>
        <p>No Shame, Just Reps.</p>
      </div>
    </div>
  </body>
</html>
    `
  }

  const handlePrint = () => {
    setIsPrinting(true)
    
    // Create print window and write content
    const printWindow = window.open('', '_blank')
    printWindow.document.write(generatePrintableReport())
    printWindow.document.close()
    
    // Trigger print dialog
    window.print()
    
    // Clean up
    setTimeout(() => {
      setIsPrinting(false)
      if (onPrintReport) {
        onPrintReport()
      }
    }, 1000)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4"
        >
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-600 rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                🎖️ MISSION COMPLETE
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Tactical operations completed successfully. Your command of the battlefield is absolute.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <button
                  onClick={handlePrint}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                >
                  �️ PRINT REPORT
                </button>
                
                <button
                  onClick={() => {
                    setIsPrinting(false)
                    onClose()
                  }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MissionReport
