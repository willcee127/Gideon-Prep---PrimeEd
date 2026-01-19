import React, { useState, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { NeuroProvider } from './context/NeuroProvider' 
import Initiation from './components/Initiation'
import MasteryMap from './components/MasteryMap'
import SlideInPanel from './components/SlideInPanel'
import StatusBar from './components/StatusBar'
import DailyObjective from './components/DailyObjective'
import WelcomeKit from './components/WelcomeKit'
import TacticalIntel from './components/TacticalIntel'
import Settings from './components/Settings'
import TacticalIntelDashboard from './components/TacticalIntelDashboard'
import CommandCalc from './components/CommandCalc/CommandCalc'
import VictoryReport from './components/VictoryReport'
import DiagnosticFlow from './pages/DiagnosticFlow'
import MissionLandingPage from './pages/MissionLandingPage'
import RecruitmentPage from './pages/RecruitmentPage'
import GideonLandingPageV2 from './pages/GideonLandingPageV2'
import RedAlertSimulation from './components/RedAlertSimulation'
import MissionDebrief from './components/MissionDebrief'
import VictorySequence from './components/VictorySequence'
import { getNodeById } from './data/mathContent'
import { calculateCombatPower, validateSectorData } from './utils/combatPowerCalculator'
import useSessionSync from './hooks/useSessionSync'
import { supabase } from './lib/supabase'
import './styles/responsive.css'
import './styles/aura-hud.css'

// Forge Protected Route Component
const ForgeProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  
  useEffect(() => {
    const stage2Complete = localStorage.getItem('gideon_stage_2_complete') === 'true'
    if (!stage2Complete) {
      navigate('/verve') // Redirect to Verve if not qualified
    }
  }, [navigate])
  
  const stage2Complete = localStorage.getItem('gideon_stage_2_complete') === 'true'
  
  if (!stage2Complete) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-red-400 mb-4">🔒 ACCESS DENIED</h1>
          <p className="text-xl text-gray-300 mb-4">Forge Stage Locked</p>
          <p className="text-gray-400 mb-6">You must complete Stage 2 (Aura) to access Stage 3 (Forge)</p>
          <button
            onClick={() => navigate('/verve')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-all"
          >
            Return to Verve
          </button>
        </div>
      </div>
    )
  }
  
  return children
}

function App() {
  // Use session sync hook for robust state persistence
  const { sessionData, setSessionData } = useSessionSync({
    combatPower: {
      math: 75,
      rla: 82,
      science: 68,
      socialStudies: 71
    },
    radarData: {
      numberSense: 85,
      algebra: 72,
      geometry: 68,
      dataAnalysis: 45,
      fractions: 58,
      appliedMath: 78
    },
    warriorRank: 'Specialist'
  })

  // Defensive destructuring for completedNodes to prevent ReferenceError
  const completedNodes = sessionData?.completedNodes || [];
  const userName = sessionData?.userName || 'Scholar';
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Adaptive AI Auto-Leveler State
  const [streak, setStreak] = useState(0);
  const [aiSupportLevel, setAiSupportLevel] = useState(() => {
    return parseInt(localStorage.getItem('gideon_ai_support_level') || '3');
  });

  // Dynamic Aura HUD System
  const getAuraStyles = () => {
    const level = aiSupportLevel;
    
    switch(level) {
      case 5: // Verve - Heavy-duty Purple HUD
        return {
          primaryColor: '#9333ea', // Purple-600
          secondaryColor: '#7c3aed', // Purple-700
          accentColor: '#a855f7', // Purple-500
          borderColor: '#9333ea',
          glowColor: 'rgba(147, 51, 234, 0.5)',
          hudIntensity: 'high',
          theme: 'verve'
        };
      case 3: // Aura - Balanced Emerald Green HUD
        return {
          primaryColor: '#10b981', // Emerald-500
          secondaryColor: '#059669', // Emerald-600
          accentColor: '#34d399', // Emerald-400
          borderColor: '#10b981',
          glowColor: 'rgba(16, 185, 129, 0.5)',
          hudIntensity: 'medium',
          theme: 'aura'
        };
      case 1: // Forge - Minimalist Electric Cyan HUD
        return {
          primaryColor: '#06b6d4', // Cyan-500
          secondaryColor: '#0891b2', // Cyan-600
          accentColor: '#22d3ee', // Cyan-400
          borderColor: '#06b6d4',
          glowColor: 'rgba(6, 182, 212, 0.3)',
          hudIntensity: 'minimal',
          theme: 'forge'
        };
      default: // Default to Aura
        return {
          primaryColor: '#10b981',
          secondaryColor: '#059669',
          accentColor: '#34d399',
          borderColor: '#10b981',
          glowColor: 'rgba(16, 185, 129, 0.5)',
          hudIntensity: 'medium',
          theme: 'aura'
        };
    }
  };

  const auraStyles = getAuraStyles();

  // Apply dynamic HUD styles globally
  useEffect(() => {
    const root = document.documentElement;
    
    // Update CSS custom properties for dynamic theming
    root.style.setProperty('--aura-primary', auraStyles.primaryColor);
    root.style.setProperty('--aura-secondary', auraStyles.secondaryColor);
    root.style.setProperty('--aura-accent', auraStyles.accentColor);
    root.style.setProperty('--aura-border', auraStyles.borderColor);
    root.style.setProperty('--aura-glow', auraStyles.glowColor);
    root.style.setProperty('--aura-intensity', auraStyles.hudIntensity);
    
    // Add theme class to body for CSS targeting
    document.body.className = document.body.className.replace(/aura-\w+/g, '');
    document.body.classList.add(`aura-${auraStyles.theme}`);
    
    console.log(`Dynamic HUD Applied: ${auraStyles.theme.toUpperCase()} (Level ${aiSupportLevel})`);
    
  }, [aiSupportLevel, auraStyles]);

  // Session tracking timer
  const startTime = useRef(Date.now());

  const logStudySession = async (subject) => {
    const endTime = Date.now();
    const minutes = Math.round((endTime - startTime.current) / 60000);
    
    if (minutes < 1) return; // Don't log sessions shorter than a minute
    
    try {
      const userId = localStorage.getItem('gideon_user_id') || sessionData?.user_id || 'anonymous';
      
      await supabase.from('study_sessions').insert({
        profile_id: userId,
        duration_minutes: minutes,
        subject_area: subject,
        created_at: new Date().toISOString()
      });
      
      console.log(`Study session logged: ${minutes} minutes in ${subject}`);
    } catch (error) {
      console.error('Failed to log study session:', error);
    }
    
    startTime.current = Date.now(); // Reset timer for the next subject
  };

  const [selectedNode, setSelectedNode] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [showWelcomeKit, setShowWelcomeKit] = useState(false)
  const [showTacticalIntel, setShowTacticalIntel] = useState(false)
  const [showGhostCalc, setShowGhostCalc] = useState(false)
  const [showCommandCalc, setShowCommandCalc] = useState(false)
  
  // Global mission state for Red Alert Simulation
  const [isMissionActive, setIsMissionActive] = useState(false)
  const [missionTimer, setMissionTimer] = useState(180)
  const [successProbability, setSuccessProbability] = useState(100)
  const [forgeModeActive, setForgeModeActive] = useState(false)
  const [victorySequenceActive, setVictorySequenceActive] = useState(false)

  // Hydration logic - check for existing Call Sign and route appropriately
  useEffect(() => {
    const savedCallSign = localStorage.getItem('gideon_call_sign')
    if (savedCallSign) {
      // User has Call Sign - skip recruitment, go to last active sector
      const lastActiveSector = sessionData.lastActiveSector
      if (lastActiveSector) {
        // Route to appropriate sector based on last active phase
        if (sessionData.combatPower.average >= 90) {
          // Forge phase - go to mastery map
          window.location.href = '/mastery-map'
        } else if (sessionData.combatPower.average >= 75) {
          // Aura phase - go to tactical intel
          window.location.href = '/tacticalintel'
        } else {
          // Verve phase - go to mission
          window.location.href = '/mission'
        }
      } else {
        // No Call Sign - redirect to recruitment
        window.location.href = '/recruitment'
      }
    }
  }, [sessionData.combatPower.average, sessionData.lastActiveSector])

  // Forge Command Victory Logic
  useEffect(() => {
    // Trigger Forge Mode when average score crosses 174
    if (sessionData?.combatPower?.average >= 174 && !forgeModeActive) {
      setForgeModeActive(true)
      console.log('FORGE COMMAND ACTIVATED')
    }
  }, [sessionData?.combatPower?.average, forgeModeActive])

  // Check for diagnostic fallback node on mount
  useEffect(() => {
    const fallbackNode = localStorage.getItem('gideon_selected_node')
    if (fallbackNode) {
      const node = getNodeById(fallbackNode)
      if (node) {
        setSelectedNode(node)
        setIsPanelOpen(true)
        // Clear the fallback after using it
        localStorage.removeItem('gideon_selected_node')
      }
    }
  }, [])

  // Forge access protection - Stage 3 requires Stage 2 Complete
  const navigate = useNavigate();
  const checkForgeAccess = () => {
    const stage2Complete = localStorage.getItem('gideon_stage_2_complete') === 'true'
    if (!stage2Complete) {
      navigate('/verve') // Redirect to Verve if not qualified
      return false
    }
    return true
  }

  const handleNodeSelect = (nodeId) => {
    const node = getNodeById(nodeId)
    if (node) {
      // Log the previous session before switching
      if (selectedNode) {
        const previousSubject = selectedNode.title || 'General Practice'
        logStudySession(previousSubject)
      }
      
      setSelectedNode(node)
      setIsPanelOpen(true)
      // Update session data with new sector activity
      setSessionData(prev => ({
        ...prev,
        lastActiveSector: node.title
      }))
    }
  }

  const handlePanelClose = () => {
    setIsPanelOpen(false)
    setSelectedNode(null)
  }

  const handleProblemSuccess = () => {
    // Update session data with completed node
    setSessionData(prev => ({
      ...prev,
      combatPower: {
        ...prev.combatPower,
        // Increment score for completed node (simplified logic)
        total: prev.combatPower.total + 25
      }
    }))
    
    // Also increment correctAnswers for progress tracking
    setCorrectAnswers(prev => prev + 1)
    
    // Log study session for the current subject
    const currentSubject = selectedNode?.title || 'General Practice'
    logStudySession(currentSubject)
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

  // Adaptive AI Auto-Leveler Functions
  const updateStreak = (isCorrect) => {
    if (isCorrect) {
      const newStreak = streak + 1
      setStreak(newStreak)
      
      // Check for level-down trigger (5 correct in a row)
      if (newStreak >= 5) {
        levelDownSupport()
      }
    } else {
      setStreak(0)
    }
  }

  const levelDownSupport = async () => {
    const newSupportLevel = Math.max(1, aiSupportLevel - 1)
    
    // Update local state
    setAiSupportLevel(newSupportLevel)
    setStreak(0)
    
    // Update localStorage
    localStorage.setItem('gideon_ai_support_level', String(newSupportLevel))
    
    // Update sessionData for UI reflection
    setSessionData(prev => ({
      ...prev,
      aiSupportLevel: newSupportLevel
    }))
    
    // Sync to Supabase
    try {
      const userId = localStorage.getItem('gideon_user_id') || sessionData?.user_id || 'anonymous'
      const callSign = localStorage.getItem('gideon_call_sign')
      
      if (callSign) {
        await supabase
          .from('profiles')
          .update({ 
            ai_support_level: newSupportLevel,
            current_streak: 0,
            updated_at: new Date().toISOString()
          })
          .eq('call_sign', callSign)
        
        console.log(`AI Support Level reduced to ${newSupportLevel} - Student becoming more independent`)
        
        // Show UI feedback
        showLevelUpNotification(newSupportLevel)
      }
    } catch (error) {
      console.error('Failed to sync AI support level:', error)
    }
  }

  const showLevelUpNotification = (newLevel) => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse'
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <span class="text-xl">🎯</span>
        <div>
          <div class="font-bold">Level Up!</div>
          <div class="text-sm">AI Support Reduced to Level ${newLevel}</div>
        </div>
      </div>
    `
    
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)
  }

  const handleProblemSuccessWithStreak = () => {
    handleProblemSuccess()
    updateStreak(true) // Increment streak on correct answer
  }

  const handleProblemMiss = () => {
    updateStreak(false) // Reset streak on incorrect answer
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
          
          {/* Verve Route - Stage 1 */}
          <Route path="/verve" element={<DiagnosticFlow />} />
          
          {/* Mission Route */}
          <Route path="/mission" element={<MissionLandingPage />} />
          
          {/* Recruitment Route */}
          <Route path="/recruitment" element={<RecruitmentPage />} />
          
          {/* Tactical Intel Dashboard Route */}
          <Route path="/tacticalintel" element={
            <RedAlertSimulation 
              isMissionActive={isMissionActive}
              missionTimer={missionTimer}
              successProbability={successProbability}
            >
              <TacticalIntelDashboard />
            </RedAlertSimulation>
          } />
          
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
                onProblemSuccess={handleProblemSuccessWithStreak}
                onProblemMiss={handleProblemMiss}
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
          
          {/* Forge Route - Stage 3 (Protected) */}
          <Route path="/forge" element={
            <ForgeProtectedRoute />
          } />
          
          {/* Settings Route */}
          <Route path="/settings" element={<Settings />} />
          
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