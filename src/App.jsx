import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
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
import ExamEngine from './components/ExamEngine'
import VictoryReport from './components/VictoryReport'
import DiagnosticFlow from './pages/DiagnosticFlow'
import MissionLandingPage from './pages/MissionLandingPage'
import RecruitmentPage from './pages/RecruitmentPage'
import GideonLandingPageV2 from './pages/GideonLandingPageV2'
import RedAlertSimulation from './components/RedAlertSimulation'
import MissionDebrief from './components/MissionDebrief'
import VictorySequence from './components/VictorySequence'
import StatusReport from './components/StatusReport'
import CapstoneCertificate from './components/CapstoneCertificate'
import ReadinessReport from './components/ReadinessReport'
import { StatusReportErrorBoundary, CapstoneCertificateErrorBoundary } from './components/ErrorBoundaries'
import { getNodeById } from './data/mathContent'
import { calculateCombatPower, validateSectorData } from './utils/combatPowerCalculator'
import useSessionSync from './hooks/useSessionSync'
import { supabase } from './lib/supabase'
import './styles/responsive.css'
import './styles/aura-hud.css'
import './styles/tactical-typography.css'
import './styles/global-branding.css'
import assetPreloader from './utils/assetPreloader'

// Forge Protected Route Component
const ForgeProtectedRoute = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  useEffect(() => {
    const stage2Complete = localStorage.getItem('gideon_stage_2_complete') === 'true'
    if (!stage2Complete && location.pathname !== '/verve') {
      navigate('/verve') // Redirect to Verve if not qualified and not already there
    }
  }, [navigate, location])
  
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
  const navigate = useNavigate()
  const location = useLocation()
  
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

  // State declarations - consolidated at top
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [streak, setStreak] = useState(0)
  const [aiSupportLevel, setAiSupportLevel] = useState(() => {
    return parseInt(localStorage.getItem('gideon_ai_support_level') || '3')
  })
  const [selectedNode, setSelectedNode] = useState(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [showWelcomeKit, setShowWelcomeKit] = useState(false)
  const [showTacticalIntel, setShowTacticalIntel] = useState(false)
  const [showGhostCalc, setShowGhostCalc] = useState(false)
  const [showCommandCalc, setShowCommandCalc] = useState(false)
  const [showCapstoneCertificate, setShowCapstoneCertificate] = useState(false)
  const [showReadinessReport, setShowReadinessReport] = useState(false)
  const [isMissionActive, setIsMissionActive] = useState(false)
  const [missionTimer, setMissionTimer] = useState(180)
  const [successProbability, setSuccessProbability] = useState(100)
  const [forgeModeActive, setForgeModeActive] = useState(false)
  const [victorySequenceActive, setVictorySequenceActive] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  // Identity State for Status Report
  const [identityData, setIdentityData] = useState(() => {
    return {
      fullName: localStorage.getItem('gideon_full_name') || '',
      callSign: localStorage.getItem('gideon_call_sign') || '',
      email: localStorage.getItem('gideon_email') || ''
    }
  })

  // Session tracking timer
  const startTime = useRef(Date.now())

  // Dynamic Aura HUD System
  const getAuraStyles = () => {
    const level = aiSupportLevel
    
    switch(level) {
      case 5: // Verve - Lavender HUD
        return {
          primaryColor: 'var(--verve-lavender)',
          secondaryColor: 'var(--verve-lavender-light)',
          accentColor: 'var(--verve-ghost-white)',
          borderColor: 'var(--verve-lavender)',
          glowColor: 'var(--verve-glow)',
          hudIntensity: 'high',
          theme: 'verve'
        }
      case 3: // Aura - Electric Blue HUD
        return {
          primaryColor: 'var(--aura-electric-blue)',
          secondaryColor: 'var(--aura-electric-blue-light)',
          accentColor: 'var(--aura-light-blue)',
          borderColor: 'var(--aura-electric-blue)',
          glowColor: 'var(--aura-glow)',
          hudIntensity: 'medium',
          theme: 'aura'
        }
      case 1: // Forge - Forge Orange HUD
        return {
          primaryColor: 'var(--forge-orange)',
          secondaryColor: 'var(--forge-orange-light)',
          accentColor: 'var(--forge-orange-accent)',
          borderColor: 'var(--forge-orange)',
          glowColor: 'var(--forge-glow)',
          hudIntensity: 'minimal',
          theme: 'forge'
        }
      default: // Default to Aura
        return {
          primaryColor: 'var(--aura-electric-blue)',
          secondaryColor: 'var(--aura-electric-blue-light)',
          accentColor: 'var(--aura-light-blue)',
          borderColor: 'var(--aura-electric-blue)',
          glowColor: 'var(--aura-glow)',
          hudIntensity: 'medium',
          theme: 'aura'
        }
    }
  }

  const auraStyles = getAuraStyles()

  // Apply dynamic HUD styles globally
  useEffect(() => {
    const root = document.documentElement
    
    // Update CSS custom properties for dynamic theming
    root.style.setProperty('--aura-primary', auraStyles.primaryColor)
    root.style.setProperty('--aura-secondary', auraStyles.secondaryColor)
    root.style.setProperty('--aura-accent', auraStyles.accentColor)
    root.style.setProperty('--aura-border', auraStyles.borderColor)
    root.style.setProperty('--aura-glow', auraStyles.glowColor)
    root.style.setProperty('--aura-intensity', auraStyles.hudIntensity)
    
    // Add theme class to body for CSS targeting
    document.body.className = document.body.className.replace(/aura-\w+/g, '')
    document.body.classList.add(`aura-${auraStyles.theme}`)
    
    console.log(`Dynamic HUD Applied: ${auraStyles.theme.toUpperCase()} (Level ${aiSupportLevel})`)
    
  }, [aiSupportLevel, auraStyles])

  // Update identity data when localStorage changes
  useEffect(() => {
    const updateIdentityFromStorage = () => {
      setIdentityData({
        fullName: localStorage.getItem('gideon_full_name') || '',
        callSign: localStorage.getItem('gideon_call_sign') || '',
        email: localStorage.getItem('gideon_email') || ''
      })
    }

    // Initial load
    updateIdentityFromStorage()

    // Listen for storage changes (for cross-tab sync)
    const handleStorageChange = (e) => {
      if (e.key?.startsWith('gideon_')) {
        updateIdentityFromStorage()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Asset preloading initialization
  useEffect(() => {
    assetPreloader.initialize()
  }, [])

  // Auth hydration logic - check session and fetch profile
  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        // Check current auth session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session check error:', sessionError)
          setIsAuthLoading(false)
          return
        }
        
        if (session?.user) {
          // User is authenticated - fetch their profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          if (profileError) {
            console.error('Profile fetch error:', profileError)
            setIsAuthLoading(false)
            return
          }
          
          if (profile) {
            // Profile exists - update localStorage and navigate
            localStorage.setItem('gideon_user_id', profile.id)
            localStorage.setItem('gideon_call_sign', profile.call_sign)
            localStorage.setItem('gideon_full_name', profile.full_name)
            localStorage.setItem('gideon_email', profile.email)
            localStorage.setItem('gideon_ai_support_level', String(profile.ai_support_level || 3))
            
            setIdentityData({
              fullName: profile.full_name,
              callSign: profile.call_sign,
              email: profile.email
            })
            
            // Navigate to appropriate page based on combat power
            if (sessionData.combatPower.average >= 90) {
              if (location.pathname !== '/mastery-map') {
                navigate('/mastery-map')
              }
            } else if (sessionData.combatPower.average >= 75) {
              if (location.pathname !== '/tacticalintel') {
                navigate('/tacticalintel')
              }
            } else {
              if (location.pathname !== '/mission') {
                navigate('/mission')
              }
            }
          } else {
            // No profile found - user needs to complete initiation
            if (location.pathname !== '/recruitment') {
              navigate('/recruitment')
            }
          }
        } else {
          // No session - go to recruitment
          if (location.pathname !== '/recruitment') {
            navigate('/recruitment')
          }
        }
      } catch (error) {
        console.error('Auth hydration error:', error)
      } finally {
        setIsAuthLoading(false)
        setIsInitialLoading(false)
      }
    }
    
    checkAuthAndProfile()
  }, [])

  // Forge Command Victory Logic
  useEffect(() => {
    // Trigger Forge Mode when average score crosses 174
    if (sessionData?.combatPower?.average >= 174 && !forgeModeActive) {
      setForgeModeActive(true)
      console.log('FORGE COMMAND ACTIVATED')
    }
  }, [sessionData?.combatPower?.average])

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
  const checkForgeAccess = () => {
    const stage2Complete = localStorage.getItem('gideon_stage_2_complete') === 'true'
    if (!stage2Complete) {
      navigate('/verve') // Redirect to Verve if not qualified
      return false
    }
    return true
  }

  // Event handlers
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

  const handleShowCapstoneCertificate = () => {
    setShowCapstoneCertificate(true)
  }

  const handleCloseCapstoneCertificate = () => {
    setShowCapstoneCertificate(false)
  }

  const handleShowReadinessReport = () => {
    setShowReadinessReport(true)
  }

  const handleCloseReadinessReport = () => {
    setShowReadinessReport(false)
  }

  const handleTacticalTip = (data) => {
    // Tactical tip received
  }

  // Study session logging
  const logStudySession = async (subject) => {
    const endTime = Date.now()
    const minutes = Math.round((endTime - startTime.current) / 60000)
    
    if (minutes < 1) return // Don't log sessions shorter than a minute
    
    try {
      const userId = localStorage.getItem('gideon_user_id') || sessionData?.user_id || 'anonymous'
      
      await supabase.from('study_sessions').insert({
        profile_id: userId,
        duration_minutes: minutes,
        subject_area: subject,
        created_at: new Date().toISOString()
      })
      
      console.log(`Study session logged: ${minutes} minutes in ${subject}`)
    } catch (error) {
      console.error('Failed to log study session:', error)
    }
    
    startTime.current = Date.now() // Reset timer for the next subject
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
          .eq('id', userId) // Use profile_id instead of call_sign
      
        console.log(`AI Support Level reduced to ${newSupportLevel} - Student becoming more independent`)
        
        // Show UI feedback
        showLevelUpNotification(newSupportLevel)
      }
    } catch (error) {
      console.error('Failed to sync AI support level:', error)
    }
  }

  const showLevelUpNotification = (newLevel) => {
    // Get notification color based on new level
    const getNotificationColor = (level) => {
      if (level >= 5) return 'bg-purple-600' // Lavender for Verve
      if (level >= 3) return 'bg-blue-500' // Electric Blue for Aura
      return 'bg-orange-600' // Forge Orange for Forge
    }

    // Create notification element
    const notification = document.createElement('div')
    notification.className = `fixed top-4 right-4 ${getNotificationColor(newLevel)} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse`
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

  // Defensive destructuring for completedNodes to prevent ReferenceError
  const completedNodes = sessionData?.completedNodes || []
  const userName = sessionData?.userName || 'Scholar'

  return (
    <NeuroProvider>
      <div className="min-h-screen bg-black text-white">
        {isInitialLoading ? (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <h2 className="text-2xl font-bold text-purple-400">Re-establishing Command Connection...</h2>
              <p className="text-gray-400">Securing your operator profile</p>
            </div>
          </div>
        ) : isAuthLoading ? (
          <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center space-y-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
              <h2 className="text-2xl font-bold text-purple-400">Loading Operator Data...</h2>
              <p className="text-gray-400">Securing your command interface</p>
            </div>
          </div>
        ) : (
          <>
            <StatusReportErrorBoundary callSign={identityData.callSign} aiSupportLevel={aiSupportLevel}>
              <StatusReport 
                userName={userName}
                fullName={identityData.fullName}
                callSign={identityData.callSign}
                streak={streak}
                aiSupportLevel={aiSupportLevel}
              />
            </StatusReportErrorBoundary>

          {/* Capstone Certificate Modal */}
          <CapstoneCertificateErrorBoundary onClose={handleCloseCapstoneCertificate}>
            <CapstoneCertificate 
              isVisible={showCapstoneCertificate}
              onClose={handleCloseCapstoneCertificate}
            />
          </CapstoneCertificateErrorBoundary>

          {/* Readiness Report Modal */}
          <ReadinessReport 
            isVisible={showReadinessReport}
            onClose={handleCloseReadinessReport}
            profileId={localStorage.getItem('gideon_user_id')}
          />

          {/* Main Routes */}
          <Routes>
            <Route path="/" element={<Navigate to="/recruitment" replace />} />
            <Route path="/recruitment" element={<Initiation onComplete={(data) => {
              // Handle initiation completion
              console.log('Initiation completed:', data)
            }} />} />
            <Route path="/initiation" element={<Initiation onComplete={(data) => {
              // Handle initiation completion
              console.log('Initiation completed:', data)
            }} />} />
            <Route path="/verve" element={<MissionLandingPage />} />
            <Route path="/mission" element={<MissionLandingPage />} />
            <Route path="/tacticalintel" element={<TacticalIntelDashboard />} />
            <Route path="/forge" element={
              <ForgeProtectedRoute>
                <MasteryMap />
              </ForgeProtectedRoute>
            } />
            <Route path="/mastery-map" element={
              <ForgeProtectedRoute>
                <MasteryMap />
              </ForgeProtectedRoute>
            } />
            <Route path="/diagnostic" element={<DiagnosticFlow />} />
            <Route path="/exam" element={<ExamEngine />} />
          </Routes>

          {/* Slide-in Panel */}
          <SlideInPanel
            isOpen={isPanelOpen}
            onClose={handlePanelClose}
            selectedNode={selectedNode}
            onProblemSuccess={handleProblemSuccessWithStreak}
            onProblemMiss={handleProblemMiss}
            onShowIntel={handleShowIntel}
            onShowCommandCalc={handleShowCommandCalc}
          />

          {/* Other Modals */}
          {showWelcomeKit && <WelcomeKit onClose={() => setShowWelcomeKit(false)} />}
          {showTacticalIntel && <TacticalIntel onClose={handleCloseIntel} />}
          {showCommandCalc && <CommandCalc onClose={handleCloseCommandCalc} />}
          
          {/* Red Alert Simulation */}
          {isMissionActive && (
            <RedAlertSimulation
              timer={missionTimer}
              successProbability={successProbability}
              onComplete={() => setIsMissionActive(false)}
            />
          )}

          {/* Victory Sequence */}
          {victorySequenceActive && (
            <VictorySequence
              onComplete={() => setVictorySequenceActive(false)}
            />
          )}
          </>
        )}
      </div>
    </NeuroProvider>
  )
}

export default App
