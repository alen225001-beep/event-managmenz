import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({
  message = 'Failed to load event data. Please verify your network connection.',
  onRetry,
}) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto my-8">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-red-900 mb-1">Something went wrong</h4>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Request
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
