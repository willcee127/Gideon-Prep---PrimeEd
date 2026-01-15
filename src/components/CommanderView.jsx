import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const CommanderView = () => {
  const [logs, setLogs] = useState([]);
  const [bypassCount, setBypassCount] = useState(0);
  const [sessionGaps, setSessionGaps] = useState([]);

  useEffect(() => {
    // Initial Fetch
    const fetchLogs = async () => {
      const { data } = await supabase.from('mission_logs').select('*');
      setLogs(data || []);
      
      // Calculate bypass count and session gaps
      const bypasses = data?.filter(log => log.last_event === 'BYPASS_USED')?.length || 0;
      setBypassCount(bypasses);
      
      // Calculate session gaps (simplified logic)
      const gaps = data?.filter(log => log.last_event === 'SESSION_START')?.map((log, index) => {
        if (index === 0) return null;
        const prevSession = data[index - 1];
        const gapHours = (new Date(log.timestamp) - new Date(prevSession.timestamp)) / (1000 * 60 * 60);
        return gapHours > 24 ? gapHours : null; // Gaps longer than 24 hours
      }).filter(Boolean) || [];
      setSessionGaps(gaps);
    };
    fetchLogs();

    // Realtime Subscription
    const subscription = supabase
      .channel('any')
      .on('postgres_changes', { event: '*', table: 'mission_logs' }, payload => {
        setLogs(prev => {
          const index = prev.findIndex(item => item.call_sign === payload.new.call_sign);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = payload.new;
            return updated;
          }
          return [payload.new, ...prev];
        });
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const calculateMorale = (log) => {
    const recentLogins = logs.filter(l => 
      l.call_sign === log.call_sign && 
      l.last_event === 'SESSION_START' &&
      (new Date() - new Date(l.timestamp)) < (7 * 24 * 60 * 60 * 1000) // Last 7 days
    ).length;
    
    const userBypasses = logs.filter(l => 
      l.call_sign === log.call_sign && 
      l.last_event === 'BYPASS_USED' &&
      (new Date() - new Date(l.timestamp)) < (7 * 24 * 60 * 60 * 1000)
    ).length;
    
    const longGaps = sessionGaps.filter(gap => gap > 48).length; // Gaps longer than 48 hours
    
    // High morale = consistent logins (5+ per week), low bypasses (<2), minimal gaps
    const moraleScore = (recentLogins * 10) - (userBypasses * 15) - (longGaps * 10);
    
    if (moraleScore >= 40) return { level: 'HIGH', color: 'text-green-400' };
    if (moraleScore >= 20) return { level: 'MEDIUM', color: 'text-yellow-400' };
    return { level: 'LOW', color: 'text-red-400' };
  };

  const getScript = (log) => {
    const morale = calculateMorale(log);
    
    if (log.last_event === 'BYPASS_USED') return "Text: 'Hey, saw that last sector was tough. Those reps still count toward your grit! Take a breather.'";
    if (log.command_level > 80) return "Text: 'Warrior! Your recovery level is elite. You're ready for testing center.'";
    if (morale.level === 'LOW') return "Text: 'Warrior, I see you're facing some challenges. Let's recalibrate our approach together.'";
    if (morale.level === 'HIGH') return "Text: 'Outstanding consistency! Your recovery power is building rapidly.'";
    return "Text: 'Solid work today. Consistency is how we win. Keep securing those reps!'";
  };

  return (
    <div className="p-6 bg-slate-900 min-h-screen text-white font-mono">
      <h1 className="text-2xl mb-6 border-b border-green-500">RECOVERY COMMAND: LIVE OPERATIONS</h1>
      {logs.map(log => {
        const morale = calculateMorale(log);
        return (
          <div key={log.call_sign} className="mb-4 p-4 border border-slate-700 bg-slate-800 rounded">
            <div className="flex justify-between items-center">
              <span className="text-green-400">CALL SIGN: {log.call_sign}</span>
              <span className="text-blue-400">RECOVERY LEVEL: {log.rank}</span>
              <span className={morale.color}>MORALE: {morale.level}</span>
            </div>
            <div className="my-2 bg-slate-700 h-2 rounded overflow-hidden">
               <div className="bg-green-500 h-full" style={{ width: `${log.command_level}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>LAST EVENT: {log.last_event}</span>
              <span>BYPASSES: {bypassCount}/3</span>
            </div>
            <div className="mt-4 p-2 bg-slate-900 border-l-4 border-yellow-500 italic text-sm">
              {getScript(log)}
            </div>
          </div>
        );
      })}
      
      {/* Session Statistics */}
      <div className="mt-8 p-4 border border-slate-700 bg-slate-800 rounded">
        <h3 className="text-lg font-semibold text-white mb-4">SESSION ANALYTICS</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Total Bypasses:</span>
            <span className="text-white ml-2">{bypassCount}/3</span>
          </div>
          <div>
            <span className="text-gray-400">Session Gaps:</span>
            <span className="text-white ml-2">{sessionGaps.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Active Warriors:</span>
            <span className="text-green-400 ml-2">{logs.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommanderView;
