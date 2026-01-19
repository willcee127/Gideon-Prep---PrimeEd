import React from 'react'
import { supabase } from '../lib/supabase'

const ReconMissionButton = ({ onStartRecon }) => {
  const handleReconMission = async () => {
    try {
      // Get profile_id from localStorage for proper tracking
      const profileId = localStorage.getItem('gideon_user_id')
      const callSign = localStorage.getItem('gideon_call_sign')
      
      if (!profileId || !callSign) {
        console.error('Missing profile information for mission tracking')
        return
      }

      // Create mission history entry with profile_id UUID
      const missionData = {
        profile_id: profileId, // Use UUID instead of username
        call_sign: callSign,
        mission_type: 'Reconnaissance',
        sector_name: 'Unknown Territory',
        accuracy: 0,
        completion_time: 0,
        status: 'in_progress',
        completed_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('student_mission_history')
        .insert([missionData])
        .select()

      if (error) {
        console.error('Failed to create mission history entry:', error)
      } else {
        console.log('Mission history entry created:', data)
        onStartRecon() // Start the recon mission
      }
    } catch (error) {
      console.error('Recon mission error:', error)
    }
  }

  return (
    <button
      onClick={handleReconMission}
      className="recon-mission-button"
      style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#00BFFF',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        fontWeight: 'bold',
        boxShadow: '0 0 10px rgba(0, 191, 255, 0.7)',
        zIndex: 1000,
      }}
    >
      🚀 Start Recon Mission
    </button>
  );
};

export default ReconMissionButton;
