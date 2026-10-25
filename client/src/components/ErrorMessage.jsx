import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export const ErrorMessage = ({
  message = 'An error occurred while loading data.',
  onRetry,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem 1.25rem',
        backgroundColor: 'var(--danger-bg)',
        border: '1px solid var(--danger-border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--danger)',
        margin: '1.5rem 0',
        gap: '1rem',
      }}
      role="alert"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-sm"
          style={{
            backgroundColor: '#ffffff',
            color: 'var(--danger)',
            borderColor: 'var(--danger-border)',
            flexShrink: 0,
          }}
        >
          <RotateCcw size={14} /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
