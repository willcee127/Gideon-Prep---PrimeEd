import React from 'react';

const ReconMissionButton = ({ onStartRecon }) => {
  return (
    <button
      onClick={onStartRecon}
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
