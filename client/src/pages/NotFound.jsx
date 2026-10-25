import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      className="container"
      style={{
        padding: '5rem 1rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '4.5rem',
          height: '4.5rem',
          borderRadius: '50%',
          backgroundColor: 'var(--danger-bg)',
          color: 'var(--danger)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <HelpCircle size={36} />
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--gray-900)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-700)', margin: '0.75rem 0' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--gray-500)', maxWidth: '420px', marginBottom: '2rem' }}>
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <ArrowLeft size={16} /> Return to Campus Home
      </Link>
    </div>
  );
};

export default NotFound;
