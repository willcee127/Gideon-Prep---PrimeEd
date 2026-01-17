import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Force redeploy - asset pathing fix

const GideonLandingPageV2 = () => {
  const navigate = useNavigate()
  const [isClient, setIsClient] = useState(false)
  const [callSign, setCallSign] = useState('')
  const [showSignupForm, setShowSignupForm] = useState(false)
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    callsign: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [signupMessage, setSignupMessage] = useState('')

  // Hydration guard - only render on client side
  useEffect(() => {
    setIsClient(true)
    console.log('GideonLandingPageV2: Client-side rendering activated')
  }, [])

  // Force render safety check - if isClient is false for more than 2 seconds, force it to true
  useEffect(() => {
    const forceRenderTimer = setTimeout(() => {
      if (!isClient) {
        console.log('GideonLandingPageV2: Force rendering activated after 2 seconds')
        setIsClient(true)
      }
    }, 2000)

    return () => clearTimeout(forceRenderTimer)
  }, [isClient])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-blue-800 to-slate-900 flex items-center justify-center">
        <div className="text-amber-400 text-xl">🛡️ Initializing Command Center...</div>
      </div>
    )
  }

  useEffect(() => {
    // Check if user is already logged in
    const val = localStorage.getItem('gideon_call_sign');
    setCallSign(typeof val === 'string' ? val : '');
  }, [])

  const handleStartMission = () => {
    if (callSign.trim()) {
      localStorage.setItem('gideon_call_sign', callSign.trim())
      navigate('/mission')
    } else {
      // If no call sign, redirect to onboarding first
      navigate('/onboarding')
    }
  }

  const handleSupport = () => {
    window.open('https://ko-fi.com/willcee127', '_blank')
  }

  return (
    <div style={{color: 'white', padding: '50px'}}>
      <h1>GIDEON LIVE - VERSION 1.0.6</h1>
      <p>If you see this, the engine is fixed.</p>
    </div>
  )
}

export default GideonLandingPageV2
