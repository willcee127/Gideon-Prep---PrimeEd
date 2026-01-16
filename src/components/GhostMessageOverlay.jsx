import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabaseClient'

const TacticalIntelOverlay = () => {
  const [tacticalIntelMessage, setTacticalIntelMessage] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get current user's call sign from localStorage
    const currentCallSign = localStorage.getItem('gideon_call_sign')
    
    if (!currentCallSign) return

    // Set up subscription to comms_uplink
    const subscription = supabase
      .channel('tactical-intel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        table: 'comms_uplink' 
      }, (payload) => {
        // Check if message is for current user
        if (payload.new.target_call_sign === currentCallSign) {
          setTacticalIntelMessage(payload.new)
          setIsVisible(true)
          
          // Play radio static chirp
          playRadioStatic()
          
          // Auto-hide after 5 seconds
          setTimeout(() => {
            setIsVisible(false)
            setTacticalIntelMessage(null)
          }, 5000)
        }
      })
      .subscribe()

    // Check for pending commander replies on component mount
    const checkPendingReplies = async () => {
      try {
        const { data: pendingReplies } = await supabase
          .from('comms_uplink')
          .select('*')
          .eq('target_call_sign', currentCallSign)
          .eq('is_reply', true)
          .order('sent_at', { ascending: false })
          .limit(5)

        if (pendingReplies && pendingReplies.length > 0) {
          // Show the most recent reply
          const latestReply = pendingReplies[0]
          setTacticalIntelMessage(latestReply)
          setIsVisible(true)
          
          // Play radio static chirp
          playRadioStatic()
          
          // Auto-hide after 7 seconds for replies (longer display)
          setTimeout(() => {
            setIsVisible(false)
            setTacticalIntelMessage(null)
          }, 7000)
          
          // Mark as delivered (optional - could add delivered_at field)
          console.log('Commander reply delivered to:', currentCallSign)
        }
      } catch (error) {
        console.error('Failed to check pending replies:', error)
      }
    }

    // Check for pending replies immediately
    checkPendingReplies()

    return () => supabase.removeChannel(subscription)
  }, [])

  // Play radio static chirp
  const playRadioStatic = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVohDbB2MAA')
      audio.volume = 0.1
      audio.play().catch(() => {
        console.log('Radio static failed')
      })
    } catch (error) {
      console.log('Radio static not supported:', error)
    }
  }

  if (!isVisible || !ghostMessage) {
    return null
  }

  return (
    <>
      {/* CSS for holographic glitch effect */}
      <style jsx>{`
        @keyframes glitch {
          0% { clip-path: inset(40% 0 61% 0); transform: translate(-20px, -10px); }
          20% { clip-path: inset(92% 0 1% 0); transform: translate(20px, 10px); }
          40% { clip-path: inset(43% 0 1% 0); transform: translate(-20px, -10px); }
          60% { clip-path: inset(25% 0 58% 0); transform: translate(20px, 10px); }
          80% { clip-path: inset(54% 0 7% 0); transform: translate(-20px, -10px); }
          100% { clip-path: inset(58% 0 43% 0); transform: translate(20px, 10px); }
        }

        .ghost-overlay {
          border: 2px solid #00ff00;
          background: rgba(0, 20, 0, 0.9);
          text-shadow: 2px 2px #ff0000, -2px -2px #0000ff;
          animation: glitch 1s infinite alternate-reverse;
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        {/* Ghost Message Overlay */}
        <div className="relative">
          {/* Glitch/Tactical Background */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          
          {/* Message Container */}
          <div className="relative ghost-overlay border-2 border-green-500/50 rounded-lg p-6 max-w-md mx-4">
            {/* Glitch Effect */}
            <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
            
            {/* Tactical Header */}
            <div className="flex items-center mb-4">
              <span className="text-orange-400 text-xs font-mono mr-2">⚡ TACTICAL INTEL</span>
              <div className="flex-1 h-px bg-green-500/30" />
            </div>
            
            {/* Message Content */}
            <div className="text-green-300 font-mono text-sm leading-relaxed">
              {ghostMessage.message}
            </div>
            
            {/* Timestamp */}
            <div className="mt-4 text-green-500/70 text-xs font-mono">
              {new Date(ghostMessage.sent_at).toLocaleString()}
            </div>
            
            {/* From Indicator */}
            <div className="mt-2 text-green-400/80 text-xs font-mono">
              FROM: COMMANDER
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default GhostMessageOverlay
