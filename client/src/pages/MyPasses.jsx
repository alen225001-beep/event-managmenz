import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Eye,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import registrationService from '../services/registrationService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import TicketPassModal from '../components/TicketPassModal';

const MyPasses = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'all'
  const [selectedPass, setSelectedPass] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchPasses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await registrationService.getMyPasses();
      setPasses(res.passes || []);
    } catch (err) {
      setError(err.message || 'Unable to retrieve your digital passes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasses();
  }, []);

  const handleCancelPass = async (passId) => {
    if (
      !window.confirm(
        'Are you sure you want to cancel this event pass? This will release your seat for other students.'
      )
    ) {
      return;
    }

    setCancellingId(passId);
    try {
      await registrationService.cancelRegistration(passId, 'Student voluntary cancellation');
      await fetchPasses();
    } catch (err) {
      alert(err.message || 'Failed to cancel registration.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredPasses = passes.filter((p) => {
    if (activeTab === 'upcoming') {
      return p.status === 'confirmed';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Ticket className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                My Digital Entry Passes
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Access and print your admission tickets for Sahrdaya workshops, hackathons, and cultural fests.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm text-xs font-bold">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'upcoming'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active Passes ({passes.filter((p) => p.status === 'confirmed').length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-xl transition ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All History ({passes.length})
            </button>
          </div>
        </div>

        {/* 4-State UI Content */}
        {loading ? (
          <LoadingSpinner message="Loading your digital passes..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchPasses} />
        ) : filteredPasses.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title={activeTab === 'upcoming' ? 'No active entry passes' : 'No pass history found'}
            description="You don't have any event registrations at this time. Browse our upcoming campus events and reserve your free pass today!"
            actionLabel="Explore Campus Events"
            actionLink="/"
          />
        ) : (
          <div className="space-y-4">
            {filteredPasses.map((pass) => {
              const event = pass.event || {};
              const eventDate = event.date ? new Date(event.date) : new Date();
              const formattedDate = eventDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={pass._id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  {/* Left: Thumbnail & Event Info */}
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        event.bannerImage ||
                        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={event.title}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-gray-100 shadow-sm"
                    />

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase">
                          {event.category || 'Event'}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            pass.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : pass.status === 'attended'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {pass.status === 'attended' ? 'Checked In' : pass.status}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-2">
                        {event.title}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="line-clamp-1">{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Pass Code & Actions */}
                  <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                        Pass Code
                      </span>
                      <span className="font-mono text-base font-black text-indigo-700 tracking-wider">
                        {pass.ticketCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedPass(pass)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-400" />
                        View Pass
                      </button>

                      {pass.status === 'confirmed' && (
                        <button
                          disabled={cancellingId === pass._id}
                          onClick={() => handleCancelPass(pass._id)}
                          className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition"
                        >
                          {cancellingId === pass._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Pass Modal */}
      {selectedPass && (
        <TicketPassModal pass={selectedPass} onClose={() => setSelectedPass(null)} />
      )}
    </div>
  );
};

export default MyPasses;
