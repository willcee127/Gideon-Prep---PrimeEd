import { createClient } from '@supabase/supabase-js'

// Robust key check: Use the VITE keys if they exist, otherwise use a safe placeholder
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.startsWith('https') 
  ? import.meta.env.VITE_SUPABASE_URL 
  : 'https://placeholder-project.supabase.co'

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Memory System API Functions
export const memoryAPI = {
  // Profile Management
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      return data
    } catch (e) {
      console.warn("Supabase not connected - using mock profile");
      return { id: userId, username: 'Maria', level: 1 };
    }
  },

  async createProfile(profile) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateProfile(userId, updates) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Mastery Ledger Functions
  async getMasteryEntries(userId) {
    const { data, error } = await supabase
      .from('mastery_ledger')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async addMasteryEntry(entry) {
    const { data, error } = await supabase
      .from('mastery_ledger')
      .insert([entry])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateMasteryProgress(entryId, progress) {
    const { data, error } = await supabase
      .from('mastery_ledger')
      .update({ 
        mastery_level: progress.level,
        practice_count: progress.practiceCount,
        confidence_score: progress.confidence,
        last_practiced: new Date().toISOString()
      })
      .eq('id', entryId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Trauma Log Functions
  async getTraumaLogs(userId, limit = 50) {
    const { data, error } = await supabase
      .from('trauma_logs')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  async logTraumaEvent(logEntry) {
    const { data, error } = await supabase
      .from('trauma_logs')
      .insert([logEntry])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async getStressPatterns(userId, days = 30) {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('trauma_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Analytics Functions
  async getMasteryStats(userId) {
    const { data, error } = await supabase
      .from('mastery_ledger')
      .select('topic, mastery_level, practice_count, confidence_score')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },

  async getRecentActivity(userId, limit = 10) {
    const { data, error } = await supabase
      .from('trauma_logs')
      .select('timestamp, stress_level, trigger_type, resolution_status')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}

export default supabase