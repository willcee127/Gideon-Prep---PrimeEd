import { createClient } from '@supabase/supabase-js'

// Access Vite-prefixed variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// Defensive check to prevent white-screen crashes
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('DATABASE ERROR: Supabase credentials missing. Check Vercel environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
