import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AdminCommandCenter = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUserEmail(session.user.email);
          
          // Check if user is admin
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin, email')
            .eq('email', session.user.email)
            .single();
          
          setIsAdmin(profile?.is_admin || false);
        } else {
          setUserEmail(null);
          setIsAdmin(false);
          setError('Access denied: Please log in first');
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Authentication failed');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!isAdmin) {
        setError('Access denied: Admin privileges required');
        return;
      }

      try {
        const { data } = await supabase
          .from('profiles')
          .select('username, combat_power, is_mission_ready, deployment_step, registration_complete')
          .order('combat_power', { ascending: false });
        
        setStudents(data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch students:', err);
        setError('Failed to load student data');
      }
    };

    fetchStudents();
  }, [isAdmin]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUserEmail(null);
      setIsAdmin(false);
      setStudents([]);
      setError(null);
    } catch (err) {
      console.error('Logout failed:', err);
        setError('Logout failed');
      }
    }
  };

  // Redirect non-admin users
  if (!isAdmin && !isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-red-500 mb-4">ACCESS DENIED</h1>
          <p className="text-lg mb-4">Admin privileges required to access this command center.</p>
          <p className="text-sm opacity-75">Please contact your system administrator if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-aura-hologram">SQUAD DEPLOYMENT MONITOR</h1>
      
      {isLoading ? (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-600"></div>
          <p className="mt-4 text-gray-400">Loading squad data...</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <div className="text-red-500 mb-4">ERROR</div>
          <p className="text-lg mb-2">{error}</p>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">Welcome, {userEmail}</h2>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-900">
                <th className="p-3 border border-gray-800">Operative</th>
                <th className="p-3 border border-gray-800">Combat Power</th>
                <th className="p-3 border border-gray-800">Status</th>
                <th className="p-3 border border-gray-800">GED Roadmap</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.username} className={s.is_mission_ready ? "bg-[#B19CD9]/20" : ""}>
                  <td className="p-3 border border-gray-800 font-bold">{s.username}</td>
                  <td className="p-3 border border-gray-800 text-center">{s.combat_power}</td>
                  <td className="p-3 border border-gray-800 text-center">
                    {s.is_mission_ready ? 
                      <span className="text-[#B19CD9] font-bold">MISSION READY</span> : 
                      <span className="text-orange-400">TRAINING</span>}
                  </td>
                  <td className="p-3 border border-gray-800 text-center">
                    {s.registration_complete ? "✅ DEPLOYED" : `Step ${s.deployment_step} / 3`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminCommandCenter;
