import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBrandLoading, setShowBrandLoading] = useState(false)

  useEffect(() => {
    // Check for existing auth flag on mount
    const authFlag = localStorage.getItem('gideon_auth_flag')
    if (authFlag) {
      setShowBrandLoading(true)
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session)
      
      switch (event) {
        case 'SIGNED_IN':
          setUser(session.user)
          localStorage.setItem('gideon_auth_flag', 'true')
          setShowBrandLoading(false)
          setIsLoading(false)
          break
          
        case 'SIGNED_OUT':
          setUser(null)
          localStorage.removeItem('gideon_auth_flag')
          localStorage.removeItem('gideon_user_id')
          localStorage.removeItem('gideon_call_sign')
          localStorage.removeItem('gideon_identity_data')
          setIsLoading(false)
          break
          
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            setUser(session.user)
            setShowBrandLoading(false)
          }
          setIsLoading(false)
          break
          
        case 'INITIAL_SESSION':
          if (session?.user) {
            setUser(session.user)
            localStorage.setItem('gideon_auth_flag', 'true')
          }
          setShowBrandLoading(false)
          setIsLoading(false)
          break
          
        default:
          setIsLoading(false)
          setShowBrandLoading(false)
          break
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    setIsLoading,
    showBrandLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
