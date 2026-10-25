import React from 'react';

export const LoadingSpinner = ({ text = 'Loading data...', size = 'md' }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        gap: '1rem',
        color: 'var(--gray-500)',
      }}
      role="status"
      aria-live="polite"
    >
      <div className="spinner" style={size === 'lg' ? { width: '3rem', height: '3rem' } : {}} />
      <p style={{ fontSize: '0.925rem', fontWeight: 500 }}>{text}</p>
    </div>
  );
};

export default LoadingSpinner;
