import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Loading campus events...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
