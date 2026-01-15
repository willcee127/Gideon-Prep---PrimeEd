import React, { useState, useEffect } from 'react';

const ActivationSequence = ({ callSign, onComplete }) => {
  const [statusText, setStatusText] = useState("INITIALIZING NEURAL LINK...");
  const [progress, setProgress] = useState(0);

  const sequences = [
    "UPLINKING TO COMMANDER...",
    "SYNCING HEARTBEAT PROTOCOL...",
    `WARRIOR [${callSign.toUpperCase()}] VERIFIED...`,
    "CALIBRATING MATH TANK...",
    "MISSION AUTHORIZED. DEPLOYING."
  ];

  useEffect(() => {
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < sequences.length) {
        setStatusText(sequences[currentStep]);
        setProgress((prev) => prev + 20);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000); // Deploy to Math Tarmac
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [callSign]);

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 font-mono">
      <div className="w-64 h-64 mb-8 border-2 border-cyan-500/30 rounded-full flex items-center justify-center animate-pulse">
        {/* Shadow Protocol Silhouette Placeholder */}
        <div className="w-48 h-48 bg-cyan-500/10 rounded-full blur-xl absolute" />
        <span className="text-cyan-400 text-5xl font-black">?</span>
      </div>
      
      <div className="w-80 bg-slate-800 h-1 border border-cyan-500/50 mb-4 overflow-hidden">
        <div 
          className="bg-cyan-400 h-full transition-all duration-500 shadow-[0_0_15px_#22d3ee]" 
          style={{ width: `${progress}%` }} 
        />
      </div>

      <p className="text-cyan-400 tracking-widest text-sm animate-pulse">
        {statusText}
      </p>
    </div>
  );
};

export default ActivationSequence;
