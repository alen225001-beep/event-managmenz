import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarX, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-4 shadow-sm border border-indigo-100">
        <CalendarX className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Campus Page Not Found</h2>
      <p className="text-sm text-gray-500 max-w-sm mb-6">
        The campus event, entry pass, or console page you requested could not be located on Sahrdaya EventHub.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition shadow-sm"
      >
        <Home className="w-4 h-4" />
        Return to Campus Events Feed
      </Link>
    </div>
  );
};

export default NotFound;
