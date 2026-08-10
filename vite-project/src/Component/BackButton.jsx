import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // If the user is on the Landing Page ('/'), don't render the button at all
  if (location.pathname === '/') {
    return null; 
  }

  return (
    <button 
      onClick={() => navigate(-1)} 
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '20px',
        zIndex: 9999,
        background: '#333',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        padding: '10px 20px',
        fontSize: '15px',
        fontWeight: 'bold',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'transform 0.2s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {/* perfectly matched SVG replacing the text arrow */}
      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}