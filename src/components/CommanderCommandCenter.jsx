import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabaseClient'

const CommanderCommandCenter = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalWarriors: 0,
    activeTrauma: 0,
    resolvedTrauma: 0,
    globalGrit: 0
  })
  const [tacticalData, setTacticalData] = useState([])
  const [feedbackData, setFeedbackData] = useState([])
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [alertActive, setAlertActive] = useState(false)

  // Secret access gate
  useEffect(() => {
    const accessKey = searchParams.get('access')
    if (accessKey !== 'will_prime') {
      navigate('/')
      return
    }
  }, [searchParams, navigate])

  // Play tactical audio alert
  const playTacticalAlert = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVohDbB2MAA')
      audio.volume = 0.3
      audio.play().catch(() => {
        // Fallback: create visual alert if audio fails
        console.log('Audio alert failed, using visual only')
      })
    } catch (error) {
      console.log('Audio not supported:', error)
    }
  }

  // Play sonar ping for encouragement
  const playSonarPing = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVohDbB2MAA')
      audio.volume = 0.2
      audio.play().catch(() => {
        console.log('Sonar ping failed')
      })
    } catch (error) {
      console.log('Sonar audio not supported:', error)
    }
  }

  // Send encouragement to warrior
  const sendEncouragement = async (callSign) => {
    try {
      const { error } = await supabase
        .from('comms_uplink')
        .insert({
          target_call_sign: callSign,
          message: "Commander's Note: I see you're pushing through the friction. Keep your head up, Warrior.",
          sent_at: new Date(),
          commander_id: 'will_prime'
        })

      if (!error) {
        playSonarPing()
      } else {
        console.error('Failed to send encouragement:', error)
      }
    } catch (error) {
      console.error('Encouragement send error:', error)
    }
  }

  // Mark feedback as read
  const markAsRead = async (feedbackId) => {
    try {
      const { error } = await supabase
        .from('warrior_feedback')
        .update({ is_read: true })
        .eq('id', feedbackId)

      if (!error) {
        // Update local state to remove gold pulse
        setFeedbackData(prev => 
          prev.map(feedback => 
            feedback.id === feedbackId 
              ? { ...feedback, is_read: true }
              : feedback
          )
        )
      }
    } catch (error) {
      console.error('Failed to mark as read:', error)
    }
  }

  // Send reply to warrior
  const sendReply = async () => {
    if (!replyText.trim() || !replyingTo) return

    try {
      const { error } = await supabase
        .from('comms_uplink')
        .insert({
          target_call_sign: replyingTo.call_sign,
          message: `Commander's Reply: ${replyText}`,
          sent_at: new Date(),
          commander_id: 'will_prime',
          is_reply: true
        })

      if (!error) {
        playSonarPing()
        setReplyText('')
        setReplyingTo(null)
      } else {
        console.error('Failed to send reply:', error)
      }
    } catch (error) {
      console.error('Reply send error:', error)
    }
  }

  useEffect(() => {
    const fetchCommanderData = async () => {
      try {
        // Fetch total warriors
        const { data: usersData } = await supabase
          .from('users')
          .select('count')
          .single()

        // Fetch active trauma points
        const { data: activeTraumaData } = await supabase
          .from('trauma_logs')
          .select('count')
          .eq('resolved', false)
          .single()

        // Fetch resolved trauma points
        const { data: resolvedTraumaData } = await supabase
          .from('trauma_logs')
          .select('count')
          .eq('resolved', true)
          .single()

        // Fetch global grit (average independence ratio)
        const { data: missionData } = await supabase
          .from('mission_logs')
          .select('independence_ratio')

        // Fetch last 10 tactical entries
        const { data: tacticalEntries } = await supabase
          .from('mission_logs')
          .select('call_sign, friction_score, current_gravity, created_at')
          .order('created_at', { ascending: false })
          .limit(10)

        // Fetch recent warrior feedback
        const { data: feedbackEntries } = await supabase
          .from('warrior_feedback')
          .select('id, call_sign, sector_name, friction_rating, warrior_notes, created_at, is_read')
          .order('created_at', { ascending: false })
          .limit(10)

        // Calculate global grit
        const independenceRatios = missionData?.map(entry => entry.independence_ratio) || []
        const globalGrit = independenceRatios.length > 0 
          ? (independenceRatios.reduce((sum, ratio) => sum + ratio, 0) / independenceRatios.length) 
          : 0

        const totalWarriors = usersData?.count || 0
        const activeTrauma = activeTraumaData?.count || 0
        const resolvedTrauma = resolvedTraumaData?.count || 0

        // Set alert state if active trauma detected
        setAlertActive(activeTrauma > 0)

        setStats({
          totalWarriors,
          activeTrauma,
          resolvedTrauma,
          globalGrit
        })

        setTacticalData(tacticalEntries || [])
        setFeedbackData(feedbackEntries || [])
      } catch (error) {
        console.error('Commander data fetch error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommanderData()

    // Set up real-time subscription
    const subscription = supabase
      .channel('commander-updates')
      .on('postgres_changes', { 
        event: '*', 
        table: 'trauma_logs' 
      }, (payload) => {
        // Play tactical alert for new trauma
        if (payload.eventType === 'INSERT' && !payload.new.resolved) {
          playTacticalAlert()
        }
        // Refresh data when changes occur
        fetchCommanderData()
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])

  const copyWeeklyBrief = () => {
    const traumaRecoveryRate = stats.activeTrauma + stats.resolvedTrauma > 0 
      ? ((stats.resolvedTrauma / (stats.activeTrauma + stats.resolvedTrauma)) * 100).toFixed(1)
      : 0

    const brief = `
🎖️ GIDEON PREP COMMANDER BRIEF
Date: ${new Date().toLocaleDateString()}

📊 MISSION STATISTICS:
• Total Warriors: ${stats.totalWarriors}
• Active Trauma Points: ${stats.activeTrauma}
• Resolved Trauma Points: ${stats.resolvedTrauma}
• Trauma Recovery Rate: ${traumaRecoveryRate}%
• Global Grit (Independence Ratio): ${(stats.globalGrit * 100).toFixed(1)}%

🔥 RECENT TACTICAL ACTIVITY:
${tacticalData.map((entry, index) => 
  `${index + 1}. ${entry.call_sign} - Gravity: ${entry.current_gravity || 'N/A'} - Friction: ${entry.friction_score || 'N/A'} - ${new Date(entry.created_at).toLocaleDateString()}`
).join('\n')}

📋 COMMANDER NOTES:
${stats.activeTrauma > 0 ? 
  `⚠️ ${stats.activeTrauma} trauma points require immediate attention` : 
  '✅ All systems operational - no active trauma points'
}

💪 TRAUMA RECOVERY STATUS: ${traumaRecoveryRate >= 80 ? 'EXCELLENT' : traumaRecoveryRate >= 60 ? 'GOOD' : traumaRecoveryRate >= 40 ? 'NEEDS ATTENTION' : 'CRITICAL'}

💪 MISSION STATUS: ${stats.globalGrit >= 0.7 ? 'HIGH READINESS' : stats.globalGrit >= 0.4 ? 'MEDIUM READINESS' : 'NEEDS SUPPORT'}

---
Support mission: https://ko-fi.com/willcee127
    `.trim()

    navigator.clipboard.writeText(brief)
      .then(() => {
        alert('Weekly Brief copied to clipboard! Ready for Ko-fi update.')
      })
      .catch(() => {
        alert('Failed to copy. Please select and copy manually.')
      })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-500 text-2xl font-mono animate-pulse">
          SYNCING COMMANDER DATA...
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-black text-gray-100 font-mono relative ${
      alertActive ? 'animate-pulse' : ''
    }`}>
      {/* Red Alert Background Glow */}
      {alertActive && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 border-4 border-red-500/30 animate-pulse" />
          <div className="absolute inset-0 border-8 border-red-400/20 animate-pulse" />
          <div className="absolute inset-0 border-16 border-red-300/10 animate-pulse" />
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900 border-b border-orange-500/30 p-6 relative z-10">
        <h1 className={`text-3xl font-bold mb-2 ${
          alertActive ? 'text-red-500 animate-pulse' : 'text-orange-500'
        }`}>
          🎖️ COMMANDER COMMAND CENTER
        </h1>
        <p className="text-gray-400">Real-time Tactical Operations Dashboard</p>
      </div>

      {/* Stats Overview */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">TOTAL WARRIORS</h3>
            <p className="text-3xl font-bold text-green-400">{stats.totalWarriors}</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">ACTIVE TRAUMA</h3>
            <p className="text-3xl font-bold text-orange-500">{stats.activeTrauma}</p>
          </div>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">GLOBAL GRIT</h3>
            <p className="text-3xl font-bold text-blue-400">{(stats.globalGrit * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Tactical Table */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">TACTICAL ACTIVITY LOG</h2>
            <button
              onClick={copyWeeklyBrief}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              📋 COPY WEEKLY BRIEF
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-400">CALL SIGN</th>
                  <th className="text-left p-3 text-gray-400">FRICTION SCORE</th>
                  <th className="text-left p-3 text-gray-400">CURRENT GRAVITY</th>
                  <th className="text-left p-3 text-gray-400">TIMESTAMP</th>
                  <th className="text-left p-3 text-gray-400">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {tacticalData.map((entry, index) => {
                  const hasRecentMessage = feedbackData.some(feedback => 
                    feedback.call_sign === entry.call_sign && 
                    new Date(feedback.created_at) > new Date(Date.now() - 10 * 60 * 1000)
                  )
                  
                  return (
                    <tr 
                      key={index} 
                      className={`border-b border-gray-800 ${
                        entry.friction_score > 0.7 ? 'bg-orange-950/20' : 'hover:bg-gray-800/50'
                      }`}
                    >
                      <td className="p-3 text-gray-200 font-semibold">
                        <div className="flex items-center gap-2">
                          {entry.call_sign}
                          {hasRecentMessage && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                          )}
                        </div>
                      </td>
                      <td className={`p-3 ${
                        entry.friction_score > 0.7 ? 'text-orange-400 font-bold' : 'text-gray-300'
                      }`}>
                        {entry.friction_score || 'N/A'}
                      </td>
                      <td className="p-3 text-gray-300">{entry.current_gravity || 'N/A'}</td>
                      <td className="p-3 text-gray-400 text-xs">
                        {new Date(entry.created_at).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => sendEncouragement(entry.call_sign)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                        >
                          SEND ENCOURAGEMENT
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            {tacticalData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tactical activity recorded yet
              </div>
            )}
          </div>
        </div>

        {/* Mission Status */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">MISSION STATUS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">SYSTEM HEALTH</h4>
              <div className={`text-lg font-bold ${
                stats.activeTrauma > 0 ? 'text-orange-500' : 'text-green-400'
              }`}>
                {stats.activeTrauma > 0 ? '⚠️ TRAUMA DETECTED' : '✅ ALL SYSTEMS OPERATIONAL'}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">READINESS LEVEL</h4>
              <div className={`text-lg font-bold ${
                stats.globalGrit >= 0.7 ? 'text-green-400' : 
                stats.globalGrit >= 0.4 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {stats.globalGrit >= 0.7 ? '🔥 HIGH READINESS' : 
                 stats.globalGrit >= 0.4 ? '⚡ MEDIUM READINESS' : '❗ NEEDS SUPPORT'}
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Inbox */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-200">FEEDBACK INBOX</h2>
            <div className="text-xs text-gray-400">
              Recent Warrior Messages
            </div>
          </div>
          
          <div className="space-y-3">
            {feedbackData.map((feedback, index) => {
              const isRecent = new Date(feedback.created_at) > new Date(Date.now() - 10 * 60 * 1000)
              return (
                <div 
                  key={index} 
                  className={`bg-gray-800 rounded-lg p-4 border ${
                    isRecent ? 'border-yellow-500/50' : 'border-gray-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${
                        isRecent ? 'text-yellow-400' : 'text-gray-300'
                      }`}>
                        {feedback.call_sign}
                      </span>
                      {isRecent && (
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(feedback.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs text-gray-400">
                      Sector: {feedback.sector_name}
                    </span>
                    <span className="text-xs text-gray-400">
                      Friction: {feedback.friction_rating}/5
                    </span>
                  </div>
                  
                  {feedback.warrior_notes && (
                    <div className="text-sm text-gray-300 italic">
                      "{feedback.warrior_notes}"
                    </div>
                  )}
                </div>
              )
            })}
            
            {feedbackData.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No warrior feedback received yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {replyingTo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
          <div className="bg-gray-800 border border-green-500/50 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-green-400">
                Reply to {replyingTo.call_sign}
              </h3>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-xs text-gray-400 mb-2">
                Original Message: "{replyingTo.warrior_notes}"
              </div>
              <div className="text-xs text-gray-400">
                Sector: {replyingTo.sector_name} • Friction: {replyingTo.friction_rating}/5
              </div>
            </div>
            
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply to the Warrior..."
              className="w-full h-24 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              maxLength={300}
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-gray-500">
                {replyText.length}/300
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setReplyingTo(null)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReply}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors"
                >
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CommanderCommandCenter
