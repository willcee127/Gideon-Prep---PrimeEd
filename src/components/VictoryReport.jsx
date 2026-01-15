import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNeuro } from '../context/NeuroProvider'
import { supabase } from '../supabase'

const VictoryReport = ({ userName, completedNodes, correctAnswers, onDownloadComplete }) => {
  const [showConfetti, setShowConfetti] = useState(false)
  const { stressLevel, triggerIdentityStrike } = useNeuro()

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const neuralStability = Math.round(((100 - stressLevel) + 100) / 2) // Normalize to 0-100 scale

  const downloadCertificate = () => {
    // Create print-specific styles for two-page certificate
    const printStyles = `
      @media print {
        @page {
          size: landscape;
          margin: 0.5in;
        }
        
        body {
          margin: 0;
          padding: 0;
          background: white;
          font-family: 'Georgia', serif;
          color: #1a1a1a;
        }
        
        .no-print {
          display: none !important;
        }
        
        .certificate-container {
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: white;
        }
        
        .certificate-page {
          width: 90vw;
          max-width: 1200px;
          height: 80vh;
          background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
          border: 8px solid #1e3a8a;
          border-radius: 15px;
          padding: 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
        }
        
        .certificate-page::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFD700" stop-opacity="0.05"/><stop offset="50%" stop-color="%23FFD700" stop-opacity="0.15"/><stop offset="100%" stop-color="%23FFD700" stop-opacity="0.05"/></linearGradient></defs><rect width="100" height="100" fill="url(%23gold)"/></svg>');
          opacity: 0.3;
        }
        
        .torch-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150px;
          height: 150px;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="torch" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFA500" stop-opacity="0.3"/><stop offset="50%" stop-color="%23FF6347" stop-opacity="0.6"/><stop offset="100%" stop-color="%23FFA500" stop-opacity="0.3"/></linearGradient></defs><path d="M50 20 L50 60 L45 70 L30 85 L50 90 L70 85 L55 70 L50 60" fill="url(%23torch)" stroke="%23FF8C00" stroke-width="2"/><circle cx="50" cy="20" r="8" fill="%23FFD700" opacity="0.8"/></svg>');
          opacity: 0.15;
          z-index: 1;
        }
        
        .certificate-header {
          border-bottom: 4px solid #1e3a8a;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .certificate-title {
          font-size: 2.8rem;
          font-weight: bold;
          color: #1e3a8a;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          font-family: 'Georgia', serif;
        }
        
        .certificate-subtitle {
          font-size: 1.4rem;
          color: #666;
          margin: 10px 0 30px 0;
          font-family: 'Georgia', serif;
        }
        
        .certificate-body {
          margin: 30px 0;
        }
        
        .certificate-name {
          font-size: 2.2rem;
          font-weight: bold;
          color: #1a1a1a;
          margin: 0 0 20px 0;
          font-family: 'Georgia', serif;
        }
        
        .certificate-date {
          font-size: 1.1rem;
          color: #666;
          margin: 0 0 30px 0;
          font-family: 'Georgia', serif;
        }
        
        .certificate-content {
          font-size: 1.1rem;
          color: #333;
          line-height: 1.6;
          margin: 20px 0;
          font-family: 'Georgia', serif;
        }
        
        .overcomer-seal {
          width: 140px;
          height: 140px;
          margin: 30px auto;
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 6px solid #1e3a8a;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
          position: relative;
        }
        
        .overcomer-seal .top-text {
          font-size: 1.3rem;
          font-weight: bold;
          color: #1a1a1a;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .overcomer-seal .bottom-text {
          font-size: 0.9rem;
          font-weight: bold;
          color: #1a1a1a;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .signature-section {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 3px solid #1e3a8a;
          text-align: right;
        }
        
        .signature {
          font-family: 'Brush Script MT', cursive;
          font-size: 2.2rem;
          color: #1a1a1a;
          font-style: italic;
        }
        
        .signature-title {
          font-size: 0.9rem;
          color: #666;
          font-family: 'Georgia', serif;
          margin-right: 10px;
        }
        
        /* Page 2 - Test Day Intel */
        .page-break {
          page-break-before: always;
        }
        
        .test-day-intel {
          width: 90vw;
          max-width: 1200px;
          height: 80vh;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border: 8px solid #1e3a8a;
          border-radius: 15px;
          padding: 40px;
          text-align: left;
          position: relative;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
        }
        
        .test-day-intel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="blue" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e3a8a" stop-opacity="0.05"/><stop offset="50%" stop-color="%231e3a8a" stop-opacity="0.15"/><stop offset="100%" stop-color="%231e3a8a" stop-opacity="0.05"/></linearGradient></defs><rect width="100" height="100" fill="url(%23blue)"/></svg>');
          opacity: 0.2;
        }
        
        .intel-header {
          text-align: center;
          border-bottom: 4px solid #1e3a8a;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .intel-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: #1e3a8a;
          margin: 0;
          font-family: 'Georgia', serif;
        }
        
        .combat-record {
          background: rgba(30, 58, 138, 0.1);
          border: 2px solid #1e3a8a;
          border-radius: 10px;
          padding: 25px;
          margin: 20px 0;
        }
        
        .combat-record h3 {
          font-size: 1.3rem;
          color: #1e3a8a;
          margin: 0 0 15px 0;
          font-family: 'Georgia', serif;
        }
        
        .combat-record p {
          font-size: 1.1rem;
          color: #333;
          margin: 5px 0;
          font-family: 'Georgia', serif;
        }
        
        .seal-of-reps-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FFD700" stop-opacity="0.1"/><stop offset="50%" stop-color="%23FFD700" stop-opacity="0.3"/><stop offset="100%" stop-color="%23FFD700" stop-opacity="0.1"/></linearGradient></defs><circle cx="50" cy="50" r="40" fill="none" stroke="%23FFD700" stroke-width="2"/><text x="50" y="50" text-anchor="middle" dy="0.3em" fill="%23FFD700" font-family="serif" font-size="12">🏋️</text></svg>');
          opacity: 0.1;
          z-index: 1;
        }
      }
    `

    // Create and inject print styles
    const styleSheet = document.createElement('style')
    styleSheet.textContent = printStyles
    document.head.appendChild(styleSheet)

    // Create print content
    const printContent = `
      <div class="certificate-container">
        <div class="certificate-page">
          <div class="certificate-header">
            <h1 class="certificate-title">SEAL OF REPS</h1>
            <p class="certificate-subtitle">GED COMMAND LEVEL ATTAINED</p>
          </div>
          
          <div class="certificate-body">
            <p class="certificate-name">${userName || 'Overcomer'}</p>
            <p class="certificate-date">${currentDate}</p>
            <p class="certificate-content">
              ${userName || 'Overcomer'}, you have successfully reclaimed all 50 Strongholds across Zones Alpha, Bravo, Charlie, and Delta. 
              Your Neural Stability is recorded at ${neuralStability}%.
            </p>
          </div>
          
          <div class="overcomer-seal">
            <div class="top-text">OVERCOMER</div>
            <div class="bottom-text">WARRIOR</div>
          </div>
          
          <div class="signature-section">
            <div class="signature">Gideon Command</div>
            <div class="signature-title">Commanding Officer</div>
          </div>
        </div>
      </div>
      
      <div class="certificate-container page-break">
        <div class="test-day-intel">
          <div class="intel-header">
            <h1 class="intel-title">COMBAT RECORD</h1>
          </div>
          
              <li>Valid ID (Driver's License, State ID, or Passport)</li>
              <li>TI-30XS Calculator (if allowed/provided)</li>
              <li>Two #2 pencils and eraser</li>
              <li>20-minute early arrival</li>
              <li>Light jacket (testing centers can be cold)</li>
              <li>Water bottle (if allowed)</li>
              <li>Positive mindset - You've already won</li>
            </ul>
          </div>
          
          <div class="tactical-tip">
            <p>One final Aura Breath in the parking lot. You have already won.</p>
          </div>
        </div>
      </div>
    `

    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificate of Command Level - ${userName || 'Overcomer'}</title>
          <style>${printStyles}</style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `)
    printWindow.document.close()

    // Trigger print dialog
    setTimeout(() => {
      printWindow.print()
      
      // Clean up
      setTimeout(() => {
        printWindow.close()
        document.head.removeChild(styleSheet)
        onDownloadComplete()
      }, 100)
    }, 100)
  }

  const triggerConfetti = () => {
    setShowConfetti(true)
    triggerIdentityStrike()
    
    setTimeout(() => {
      setShowConfetti(false)
    }, 5000)
  }

  // Check if user has achieved 100% readiness
  const gedReadiness = Math.round((completedNodes.length / 50) * 100)
  const isVictory = gedReadiness === 100

  useEffect(() => {
    if (isVictory && !showConfetti) {
      triggerConfetti()
    }
  }, [isVictory, showConfetti])

  if (!isVictory) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-yellow-600/95 to-yellow-700/95 border-2 border-yellow-400/50 rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl"
        >
          {/* Victory Icon */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-4xl">🏆</span>
            </motion.div>
          </div>

          {/* Victory Message */}
          <div className="text-center space-y-4 mb-6">
            <h2 className="text-3xl font-bold text-yellow-300 mb-2">
              COMMAND LEVEL ACHIEVED
            </h2>
            <p className="text-yellow-200 text-lg">
              You have successfully reclaimed all 50 Strongholds and achieved your GED command level!
            </p>
            <p className="text-yellow-300 text-sm">
              Neural Stability: {neuralStability}%
            </p>
          </div>

          {/* Certificate Preview */}
          <div className="bg-white/10 backdrop-blur-sm border border-yellow-400/30 rounded-xl p-4 mb-6">
            <div className="text-center space-y-2">
              <p className="text-yellow-300 text-sm font-semibold">
                📜 CERTIFICATE OF COMMAND LEVEL READY
              </p>
              <p className="text-yellow-200 text-xs">
                Professional two-page credential with Test Day Intel
              </p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="bg-black/30 rounded-xl p-4 border border-yellow-400/30 mb-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-yellow-300 text-sm font-semibold">Strongholds Reclaimed</p>
                <p className="text-yellow-400 text-2xl font-bold">{completedNodes.length}/50</p>
              </div>
              <div>
                <p className="text-yellow-300 text-sm font-semibold">Resilience Wins</p>
                <p className="text-yellow-400 text-2xl font-bold">{correctAnswers}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={downloadCertificate}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-bold transition transform hover:scale-105 active:scale-95"
            >
              📥 DOWNLOAD CERTIFICATE
            </button>
            <button
              onClick={() => {
                // Navigate back to map or close
                window.location.reload()
              }}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition transform hover:scale-105 active:scale-95"
            >
              Continue Journey
            </button>
          </div>
        </motion.div>

        {/* Golden Confetti Effect */}
        <AnimatePresence>
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {/* Gold Confetti */}
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={`gold-${i}`}
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: -50,
                    rotate: Math.random() * 360
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotate: Math.random() * 720
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    ease: 'linear',
                    repeat: Infinity
                  }}
                  className="absolute w-4 h-4 bg-yellow-400 rounded-full shadow-lg"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
              
              {/* Red Confetti */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={`red-${i}`}
                  initial={{ 
                    x: Math.random() * window.innerWidth,
                    y: -50,
                    rotate: Math.random() * 360
                  }}
                  animate={{
                    y: window.innerHeight + 100,
                    rotate: Math.random() * 720
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    ease: 'linear',
                    repeat: Infinity
                  }}
                  className="absolute w-4 h-4 bg-red-400 rounded-full shadow-lg"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

export default VictoryReport
