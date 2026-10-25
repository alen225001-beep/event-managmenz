import React from 'react';
import { CalendarX, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = CalendarX,
  title = 'No events found',
  description = 'Try adjusting your search criteria or category filters to find upcoming campus activities.',
  actionLabel,
  actionLink,
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-4 max-w-md mx-auto">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{description}</p>
      {actionLabel && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}
      {actionLabel && onAction && !actionLink && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          {actionLabel}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;
