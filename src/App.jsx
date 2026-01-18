import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { NeuroProvider } from './context/NeuroProvider' 
import Initiation from './components/Initiation'
import MasteryMap from './components/MasteryMap'
import SlideInPanel from './components/SlideInPanel'
import StatusBar from './components/StatusBar'
import DailyObjective from './components/DailyObjective'
import WelcomeKit from './components/WelcomeKit'
import TacticalIntel from './components/TacticalIntel'
import TacticalIntelDashboard from './components/TacticalIntelDashboard'
import CommandCalc from './components/CommandCalc/CommandCalc'
import VictoryReport from './components/VictoryReport'
import DiagnosticFlow from './pages/DiagnosticFlow'
import MissionLandingPage from './pages/MissionLandingPage'
import RecruitmentPage from './pages/RecruitmentPage'
import GideonLandingPageV2 from './pages/GideonLandingPageV2'
import { getNodeById } from './data/mathContent'

function App() {
  const [isInitiated, setIsInitiated] = useState(false)
  const [userName, setUserName] = useState('')
  const [selectedNode, setSelectedNode] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [completedNodes, setCompletedNodes] = useState([])
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalReps, setTotalReps] = useState(0)
  const [showWelcomeKit, setShowWelcomeKit] = useState(false)
  const [showTacticalIntel, setShowTacticalIntel] = useState(false)
  const [showGhostCalc, setShowGhostCalc] = useState(false)
  const [showCommandCalc, setShowCommandCalc] = useState(false)

  useEffect(() => {
    // Check for existing user in localStorage
    const savedName = localStorage.getItem('gideon_user_name')
    if (savedName) {
      setUserName(savedName)
      setIsInitiated(true)
      
      // Check if first-time user
      const isFirstTime = localStorage.getItem('isFirstTimeUser')
      if (isFirstTime === null || isFirstTime === 'true') {
        setShowWelcomeKit(true)
      }
    }

    // Load completed nodes
    const savedCompleted = localStorage.getItem('completedNodes')
    if (savedCompleted) {
      setCompletedNodes(JSON.parse(savedCompleted))
    }
  }, [])

  const handleInitiationComplete = (data) => {
    const name = data.userName || data
    // Save to localStorage for persistence
    localStorage.setItem('gideon_user_name', name)
    setUserName(name)
    setIsInitiated(true)
    
    // Show welcome kit for new users
    const isFirstTime = localStorage.getItem('isFirstTimeUser')
    if (isFirstTime === null || isFirstTime === 'true') {
      setShowWelcomeKit(true)
    }
  }

  const handleWelcomeKitComplete = () => {
    setShowWelcomeKit(false)
    localStorage.setItem('isFirstTimeUser', 'false')
  }

  const handleNodeSelect = (nodeId) => {
    const node = getNodeById(nodeId)
    if (node) {
      setSelectedNode(node)
      setIsPanelOpen(true)
    }
  }

  const handlePanelClose = () => {
    setIsPanelOpen(false)
    setSelectedNode(null)
  }

  const handleProblemSuccess = () => {
    setCorrectAnswers(prev => prev + 1)
    setTotalReps(prev => prev + 1) // Increment total reps
  }

  const handleShowIntel = () => {
    setShowTacticalIntel(true)
  }

  const handleCloseIntel = () => {
    setShowTacticalIntel(false)
  }

  const handleShowCommandCalc = () => {
    setShowCommandCalc(true)
  }

  const handleCloseCommandCalc = () => {
    setShowCommandCalc(false)
  }

  const handleTacticalTip = (data) => {
    // Tactical tip received
  }

  return (
    <Router>
      <NeuroProvider>
        <Routes>
          {/* Root Redirect to Landing */}
          <Route path="/" element={<Navigate to="/landing" replace />} />
          
          {/* Landing Page Route */}
          <Route path="/landing" element={<GideonLandingPageV2 />} />
          
          {/* Onboarding Route */}
          <Route path="/onboarding" element={<DiagnosticFlow />} />
          
          {/* Mission Route */}
          <Route path="/mission" element={<MissionLandingPage />} />
          
          {/* Recruitment Route */}
          <Route path="/recruitment" element={<RecruitmentPage />} />
          
          {/* Tactical Intel Dashboard Route */}
          <Route path="/tacticalintel" element={<TacticalIntelDashboard />} />
          
          <Route path="/mastery-map" element={
            <div className="min-h-screen bg-black relative overflow-hidden">
              {/* Background Layer - MasteryMap */}
              <div className="absolute inset-0">
                <MasteryMap 
                  onNodeSelect={handleNodeSelect}
                  selectedNode={selectedNode}
                  completedNodes={completedNodes}
                />
              </div>

              {/* Daily Objective - Shows when no node is selected */}
              {!isPanelOpen && !showWelcomeKit && (
                <DailyObjective 
                  userName={userName}
                  completedNodes={completedNodes}
                  onNodeSelect={handleNodeSelect}
                />
              )}

              {/* Slide-In Studio Panel */}
              <SlideInPanel 
                isOpen={isPanelOpen}
                onClose={handlePanelClose}
                selectedNode={selectedNode}
                userName={userName}
                completedNodes={completedNodes}
                onProblemSuccess={handleProblemSuccess}
                onShowCommandCalc={handleShowCommandCalc}
              />

              {/* Permanent Status Dock */}
              <StatusBar 
                userName={userName}
                completedNodes={completedNodes}
                correctAnswers={correctAnswers}
                isWelcomeKitActive={showWelcomeKit}
                onShowIntel={handleShowIntel}
              />

              {/* Warrior Welcome Kit */}
              {showWelcomeKit && (
                <WelcomeKit onComplete={handleWelcomeKitComplete} />
              )}

              {/* Tactical Intel Overlay */}
              <TacticalIntel 
                isOpen={showTacticalIntel}
                onClose={handleCloseIntel}
                currentStronghold={selectedNode?.title}
              />

              {/* Command Calculator Overlay */}
              <CommandCalc 
                isOpen={showCommandCalc}
                onClose={handleCloseCommandCalc}
                currentStronghold={selectedNode}
                onTacticalTip={handleTacticalTip}
              />

              {/* Victory Report Overlay */}
              <VictoryReport 
                userName={userName}
                completedNodes={completedNodes}
                correctAnswers={correctAnswers}
                onDownloadComplete={() => {
                  // Victory celebration complete
                }}
              />
            </div>
          } />
          
          <Route path="/range-qual" element={<DiagnosticFlow />} />
          
          {/* Commander Dashboard Route */}
          <Route path="/commander" element={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
              <h1 className="text-4xl font-bold">Commander Dashboard - Coming Soon</h1>
            </div>
          } />
          
          {/* 404 Catch-All */}
          <Route path="*" element={
            <div style={{color: 'white', padding: '20px'}}>
              404 - Route Not Found. Current Path: {String(typeof window !== 'undefined' && window.location.pathname || 'Unknown')}
            </div>
          } />
        </Routes>
      </NeuroProvider>
    </Router>
  )
}

export default App