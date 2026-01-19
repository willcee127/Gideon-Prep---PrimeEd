import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SocraticCoPilot from './SocraticCoPilot';
import MasteryGauge from './MasteryGauge';
import HexagonalRadar from './HexagonalRadar';
import MissionDebrief from './MissionDebrief';
import useSessionSync from '../hooks/useSessionSync';
import { calculateCombatPower, validateSectorData } from '../utils/combatPowerCalculator';
import { supabase } from '../lib/supabase';

const TacticalIntelDashboard = () => {
  const { sessionData, setSessionData } = useSessionSync({
    combatPower: {
      math: 75,
      rla: 82,
      science: 68,
      socialStudies: 71,
      total: 296,
      average: 74,
      sovereigntyProgress: 145,
      decayedSectors: {
        math: false,
        rla: false,
        science: false,
        socialStudies: false
      }
    },
    radarData: {
      numberSense: 85,
      algebra: 72,
      geometry: 68,
      dataAnalysis: 45,
      fractions: 58,
      appliedMath: 78
    },
    warriorRank: 'Specialist',
    timePerQuestion: {
      math: 60,
      rla: 60,
      science: 60,
      socialStudies: 60
    },
    completedNodes: [],
    hasRegistered: false
  });

  const [showCoPilot, setShowCoPilot] = useState(false);
  const [activeProblem, setActiveProblem] = useState(null);
  const [showMissionDebrief, setShowMissionDebrief] = useState(false);
  const [missionDebriefData, setMissionDebriefData] = useState(null);
  
  const [isMissionActive, setIsMissionActive] = useState(false);
  const [missionTimer, setMissionTimer] = useState(180);
  const [successProbability, setSuccessProbability] = useState(100);

  // Deployment step state for Verve Lavender roadmap
  const [deploymentSteps, setDeploymentSteps] = useState({
    step1: false, // GED.com registration
    step2: false, // Test validation
    step3_govId: false,
    step3_calculator: false,
    step3_location: false
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isMissionActive) {
      root.style.setProperty('--primary-accent', '#FF3131');
      root.style.setProperty('--verve', '#FF3131');
      root.style.setProperty('--aura', '#FF3131');
      root.style.setProperty('--forge', '#FF3131');
      root.style.setProperty('--glass-border', 'rgba(255, 49, 49, 0.3)');
      root.style.setProperty('--glass-bg', 'rgba(255, 49, 49, 0.08)');
    } else {
      root.style.setProperty('--primary-accent', '#00D9FF');
      root.style.setProperty('--verve', '#B19CD9');
      root.style.setProperty('--aura', '#00D9FF');
      root.style.setProperty('--forge', '#FF8C00');
      root.style.setProperty('--glass-border', 'rgba(177, 156, 217, 0.3)');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.08)');
    }
  }, [isMissionActive]);

  useEffect(() => {
    let interval;
    if (isMissionActive && missionTimer > 0) {
      interval = setInterval(() => {
        setMissionTimer(prev => {
          const newTimer = prev - 1;
          if (newTimer <= 0) {
            const event = new CustomEvent('missionComplete', {
              detail: {
                missionSuccess: false,
                elapsed: 180,
                probability: 0,
                sessionData,
                radarData: sessionData.radarData,
                timePerQuestion: sessionData.timePerQuestion
              }
            });
            window.dispatchEvent(event);
            setIsMissionActive(false);
            return 0;
          }
          return newTimer;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMissionActive, missionTimer, sessionData]);

  useEffect(() => {
    const handleMissionComplete = (event) => {
      setMissionDebriefData({
        missionData: event.detail,
        sessionData,
        radarData: sessionData.radarData,
        timePerQuestion: sessionData.timePerQuestion,
        missionSuccess: event.detail.missionSuccess,
        elapsed: event.detail.elapsed
      });
      setShowMissionDebrief(true);
      setIsMissionActive(false);
    };

    window.addEventListener('missionComplete', handleMissionComplete);
    return () => window.removeEventListener('missionComplete', handleMissionComplete);
  }, [sessionData]);

  const repsData = [
    { day: 'Mon', reps: 24 }, 
    { day: 'Tue', reps: 18 }, 
    { day: 'Wed', reps: 32 },
    { day: 'Thu', reps: 28 }, 
    { day: 'Fri', reps: 15 }, 
    { day: 'Sat', reps: 41 }, 
    { day: 'Sun', reps: 37 }
  ];

  const frictionPoints = [
    { concept: 'Quadratic Equations', accuracy: 45, priority: 'high' },
    { concept: 'Linear Functions', accuracy: 78, priority: 'medium' },
    { concept: 'Polynomial Division', accuracy: 52, priority: 'high' },
    { concept: 'Coordinate Geometry', accuracy: 85, priority: 'low' }
  ];

  const totalReps = repsData.reduce((sum, day) => sum + day.reps, 0);
  const maxReps = Math.max(...repsData.map(d => d.reps));

  const handleDeployBreakthrough = () => {
    const highFrictionProblem = frictionPoints.find(point => point.accuracy < 60);
    if (highFrictionProblem) {
      setActiveProblem({
        id: highFrictionProblem.concept.toLowerCase().replace(' ', '_'),
        concept: highFrictionProblem.concept,
        equation: 'x² + 5x + 6 = 0',
        difficulty: highFrictionProblem.accuracy
      });
      setShowCoPilot(true);
    }
  };

  const handleBreakthrough = () => {
    setShowCoPilot(false);
    setActiveProblem(null);
    
    const newCombatPower = {
      ...sessionData.combatPower,
      math: Math.min(100, sessionData.combatPower.math + 10),
      total: sessionData.combatPower.total + 10
    };
    
    // Calculate new average
    const newAverage = Math.round((newCombatPower.math + newCombatPower.rla + newCombatPower.science + newCombatPower.socialStudies) / 4);
    newCombatPower.average = newAverage;
    
    setSessionData({
      ...sessionData,
      combatPower: newCombatPower
    });

    // Monitor 145 threshold and sync with Supabase
    if (newAverage >= 145) {
      // Background database sync without interrupting animation
      supabase.from('profiles').update({ 
        is_mission_ready: true 
      }).eq('user_id', sessionData.user_id || 'anonymous').then(({ error }) => {
        if (error) {
          console.error('Failed to update mission ready status:', error);
        } else {
          console.log('Mission ready status updated successfully');
        }
      });
    }
  };

  // Deployment step handlers for Verve Lavender roadmap
  const handleGEDRegistration = () => {
    window.open('https://ged.com', '_blank');
    setDeploymentSteps(prev => ({ ...prev, step1: true }));
    
    // Sync with Supabase - deployment_step = 1
    supabase.from('profiles').update({ 
      deployment_step: 1 
    }).eq('user_id', sessionData.user_id || 'anonymous').then(({ error }) => {
      if (error) {
        console.error('Failed to update deployment step 1:', error);
      } else {
        console.log('Deployment step 1 updated successfully');
      }
    });
  };

  const handleTestValidation = () => {
    setDeploymentSteps(prev => ({ ...prev, step2: true }));
    
    // Sync with Supabase - deployment_step = 2
    supabase.from('profiles').update({ 
      deployment_step: 2 
    }).eq('user_id', sessionData.user_id || 'anonymous').then(({ error }) => {
      if (error) {
        console.error('Failed to update deployment step 2:', error);
      } else {
        console.log('Deployment step 2 updated successfully');
      }
    });
  };

  const handleSchedulingCheckbox = (checkboxType) => {
    const updatedSteps = { ...deploymentSteps, [`step3_${checkboxType}`]: true };
    setDeploymentSteps(updatedSteps);
    
    // Check if all step 3 checkboxes are complete
    const allStep3Complete = updatedSteps.step3_govId && 
                           updatedSteps.step3_calculator && 
                           updatedSteps.step3_location;
    
    if (allStep3Complete) {
      // All scheduling steps complete - set registration_complete to true
      supabase.from('profiles').update({ 
        deployment_step: 3,
        registration_complete: true 
      }).eq('user_id', sessionData.user_id || 'anonymous').then(({ error }) => {
        if (error) {
          console.error('Failed to complete registration:', error);
        } else {
          console.log('Registration completed successfully');
          setSessionData(prev => ({ ...prev, hasRegistered: true }));
        }
      });
    } else {
      // Update deployment_step to 3 (in progress)
      supabase.from('profiles').update({ 
        deployment_step: 3 
      }).eq('user_id', sessionData.user_id || 'anonymous').then(({ error }) => {
        if (error) {
          console.error('Failed to update deployment step 3:', error);
        } else {
          console.log('Deployment step 3 updated successfully');
        }
      });
    }
  };

  return (
    <div className={`min-h-screen text-white transition-colors duration-700 ${isMissionActive ? 'bg-red-950/20' : ''}`} style={{backgroundColor: '#0b0e14'}}>
      <div className="glass-panel border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <div className="text-sm opacity-50">Warrior Status</div>
                <div className="text-xl font-bold text-aura holographic-text">
                  {sessionData.hasRegistered ? 'FIELD OPERATIVE' : sessionData.warriorRank}
                </div>
                {sessionData.hasRegistered && (
                  <div className="text-sm text-orange-400 ml-2">- EXAM PENDING</div>
                )}
              </div>
            </div>
            <div className="flex-1 max-w-md ml-8">
              <div className="text-sm opacity-50 mb-1">Sovereignty Progress</div>
              <div className="w-full bg-white/10 rounded-full h-3">
                <div 
                  className="h-full rounded-full transition-all duration-500 bg-forge"
                  style={{ 
                    width: `${(sessionData.combatPower.sovereigntyProgress / 200) * 100}%`,
                    boxShadow: '0 0 10px rgba(255, 140, 0, 0.5)'
                  }}
                />
              </div>
              <div className="text-xs opacity-50 mt-1">{sessionData.combatPower.sovereigntyProgress}/200</div>
            </div>
            
            {isMissionActive && (
              <div className="flex items-center gap-4 ml-8">
                <div className="text-center">
                  <div className="text-xs opacity-50 mb-1">MISSION TIMER</div>
                  <div className={`text-2xl font-bold ${missionTimer <= 30 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {Math.floor(missionTimer / 60)}:{(missionTimer % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs opacity-50 mb-1">SUCCESS PROB</div>
                  <div className="text-xl font-bold text-white">
                    {successProbability.toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <div className="neon-card p-6">
              <h2 className="text-xl font-bold mb-6 holographic-text">Mastery Heatmap</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <MasteryGauge masteryPercentage={sessionData.combatPower.math} label="Math" />
                <MasteryGauge masteryPercentage={sessionData.combatPower.rla} label="RLA" />
                <MasteryGauge masteryPercentage={sessionData.combatPower.science} label="Science" />
                <MasteryGauge masteryPercentage={sessionData.combatPower.socialStudies} label="Social Studies" />
              </div>
            </div>

            <div className="neon-card p-6">
              <h2 className="text-xl font-bold mb-6 holographic-text">Reps & Momentum</h2>
              <div className="flex items-end justify-between h-32 gap-2">
                {repsData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <motion.div 
                      className="w-full rounded-t transition-all duration-300"
                      style={{ 
                        height: `${(data.reps / maxReps) * 100}%`,
                        backgroundColor: data.reps === maxReps ? '#ff8c00' : 'rgba(255,255,255,0.1)'
                      }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.reps / maxReps) * 100}%` }}
                    />
                    <div className="text-xs opacity-50 mt-2">{data.day}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className={`neon-card p-6 border-l-4 ${isMissionActive ? 'border-red-600' : 'border-forge'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full animate-pulse ${isMissionActive ? 'bg-red-600' : 'bg-forge'}`} />
                <h2 className="text-xl font-bold holographic-text">{isMissionActive ? 'MISSION ACTIVE' : 'INTEL'}</h2>
              </div>
              <p className="text-sm opacity-80 mb-4">
                You are currently stalling on <span className="text-forge font-bold">Quadratic Equations</span>.
              </p>
              <button onClick={handleDeployBreakthrough} className="w-full bg-forge text-black font-bold py-3 rounded hover:bg-orange-400 transition-colors">
                DEPLOY BREAKTHROUGH
              </button>
            </div>

            <div className="neon-card p-6">
              <h2 className="text-xl font-bold mb-6 holographic-text">Range Qualification</h2>
              <div className="flex justify-center">
                <HexagonalRadar key={JSON.stringify(sessionData.radarData)} data={sessionData.radarData} size={250} />
              </div>
            </div>

            {sessionData.combatPower.average >= 145 && (
              <div className="neon-card p-6" style={{borderLeft: '4px solid #B19CD9'}}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#B19CD9'}} />
                  <h2 className="text-xl font-bold holographic-text" style={{color: '#B19CD9'}}>DEPLOYMENT READINESS</h2>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-3" style={{color: '#B19CD9'}}>Mission Briefing</h3>
                  
                  <div className="p-3 rounded border" style={{borderColor: '#B19CD9', backgroundColor: 'rgba(177, 156, 217, 0.05)'}}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-verve text-black text-xs font-bold flex items-center justify-center">1</div>
                      <h4 className="font-medium">Identity Creation</h4>
                    </div>
                    <p className="text-sm opacity-80 mb-2">Register with official GED testing services</p>
                    <button 
                      onClick={handleGEDRegistration}
                      className="w-full py-2 rounded font-medium transition-colors"
                      style={{backgroundColor: '#B19CD9', color: '#000'}}
                    >
                      GED.COM REGISTRATION
                    </button>
                  </div>

                  <div className="p-3 rounded border" style={{borderColor: '#B19CD9', backgroundColor: 'rgba(177, 156, 217, 0.05)'}}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-verve text-black text-xs font-bold flex items-center justify-center">2</div>
                      <h4 className="font-medium">Tactical Validation</h4>
                    </div>
                    <p className="text-sm opacity-80 mb-2">Take official "GED Ready" practice test using current Forge stats</p>
                    <div className="text-xs opacity-60">
                      <div>• Current Combat Power: {sessionData.combatPower.average}</div>
                      <div>• Recommended Baseline: 145+</div>
                      <div>• Validation Status: Ready</div>
                    </div>
                    <button 
                      onClick={handleTestValidation}
                      className="w-full mt-2 py-2 rounded font-medium transition-colors"
                      style={{backgroundColor: '#B19CD9', color: '#000'}}
                    >
                      COMPLETE VALIDATION
                    </button>
                  </div>

                  <div className="p-3 rounded border" style={{borderColor: '#B19CD9', backgroundColor: 'rgba(177, 156, 217, 0.05)'}}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-verve text-black text-xs font-bold flex items-center justify-center">3</div>
                      <h4 className="font-medium">Scheduling</h4>
                    </div>
                    <p className="text-sm opacity-80 mb-2">Exam Day Essentials Checklist</p>
                    <div className="space-y-1 text-xs opacity-60">
                      <label className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          className="rounded" 
                          checked={deploymentSteps.step3_govId}
                          onChange={() => handleSchedulingCheckbox('govId')}
                        />
                        <span>Valid Government ID</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          className="rounded" 
                          checked={deploymentSteps.step3_calculator}
                          onChange={() => handleSchedulingCheckbox('calculator')}
                        />
                        <span>Approved Calculator</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          className="rounded" 
                          checked={deploymentSteps.step3_location}
                          onChange={() => handleSchedulingCheckbox('location')}
                        />
                        <span>Test Location Confirmed</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <SocraticCoPilot 
        isOpen={showCoPilot}
        problemData={activeProblem}
        onBreakthrough={handleBreakthrough}
        onClose={() => setShowCoPilot(false)}
        isMissionActive={isMissionActive}
        missionTimeLimit={180}
        onMissionComplete={(probability, elapsed) => {
        }}
      />

      <MissionDebrief 
        isOpen={showMissionDebrief}
        missionData={missionDebriefData}
        sessionData={sessionData}
        radarData={sessionData.radarData}
        timePerQuestion={sessionData.timePerQuestion}
        missionSuccess={missionDebriefData?.missionSuccess || false}
        elapsed={missionDebriefData?.elapsed || 0}
        onClose={() => setShowMissionDebrief(false)}
      />
    </div>
  );
};

export default TacticalIntelDashboard;