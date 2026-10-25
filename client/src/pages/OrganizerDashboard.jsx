import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Users,
  CheckCircle,
  PlusCircle,
  Search,
  Printer,
  Edit,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [attendees, setAttendees] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAttendees, setLoadingAttendees] = useState(false);
  const [error, setError] = useState(null);

  const [searchAttendee, setSearchAttendee] = useState('');
  const [checkingInId, setCheckingInId] = useState(null);

  const fetchOrganizerEvents = async () => {
    setLoadingEvents(true);
    setError(null);
    try {
      const res = await eventService.getEvents({ status: 'all', limit: 50 });
      // Filter events where user is organizer (or if admin show all)
      const myEvents = res.events.filter(
        (e) => user?.role === 'admin' || (e.organizer && e.organizer._id === user?._id)
      );
      setEvents(myEvents);
      if (myEvents.length > 0) {
        setSelectedEventId(myEvents[0]._id);
      }
    } catch (err) {
      setError(err.message || 'Failed to load organizer events.');
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchAttendees = async (eventId) => {
    if (!eventId) return;
    setLoadingAttendees(true);
    try {
      const res = await eventService.getEventAttendees(eventId);
      setAttendees(res.attendees || []);
    } catch (err) {
      console.error('Error fetching attendees:', err);
    } finally {
      setLoadingAttendees(false);
    }
  };

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId);
    }
  }, [selectedEventId]);

  const handleCheckIn = async (passId) => {
    setCheckingInId(passId);
    try {
      await registrationService.checkInAttendee(passId);
      // Update attendee list locally
      setAttendees((prev) =>
        prev.map((a) => (a._id === passId ? { ...a, status: 'attended', attendedAt: new Date() } : a))
      );
    } catch (err) {
      alert(err.message || 'Check-in failed');
    } finally {
      setCheckingInId(null);
    }
  };

  const selectedEvent = events.find((e) => e._id === selectedEventId);

  const filteredAttendees = attendees.filter((a) => {
    if (!searchAttendee.trim()) return true;
    const q = searchAttendee.toLowerCase();
    return (
      (a.studentName && a.studentName.toLowerCase().includes(q)) ||
      (a.studentId && a.studentId.toLowerCase().includes(q)) ||
      (a.ticketCode && a.ticketCode.toLowerCase().includes(q)) ||
      (a.studentDepartment && a.studentDepartment.toLowerCase().includes(q))
    );
  });

  const checkedInCount = attendees.filter((a) => a.status === 'attended').length;
  const totalRegistrations = attendees.length;
  const attendancePercent =
    totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0;

  if (loadingEvents) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingSpinner message="Loading your organizer console..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Club Organizer Console
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Manage your hosted campus activities, track real-time attendee registrations, and verify entry passes.
            </p>
          </div>

          <Link
            to="/events/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl shadow-sm transition"
          >
            <PlusCircle className="w-4 h-4" />
            Host New Event
          </Link>
        </div>

        {error && <ErrorMessage message={error} onRetry={fetchOrganizerEvents} />}

        {events.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No events hosted yet"
            description="You haven't published any events under your club account yet. Create your first workshop, hackathon, or seminar."
            actionLabel="Publish First Event"
            actionLink="/events/create"
          />
        ) : (
          <>
            {/* Event Selector & Overview Stats */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Select Active Event Roster:
                  </label>
                  <select
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                    className="w-full sm:w-96 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {events.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.title} ({e.registeredCount} / {e.capacity} booked)
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEvent && (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/events/${selectedEvent._id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Public Page
                    </Link>
                    <Link
                      to={`/events/${selectedEvent._id}/edit`}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Edit Details
                    </Link>
                  </div>
                )}
              </div>

              {/* Statistics Grid for Selected Event */}
              {selectedEvent && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-[11px] text-gray-400 font-bold uppercase block">
                      Max Seating
                    </span>
                    <span className="text-2xl font-black text-gray-900">
                      {selectedEvent.capacity}
                    </span>
                  </div>

                  <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100">
                    <span className="text-[11px] text-indigo-600 font-bold uppercase block">
                      Registered Passes
                    </span>
                    <span className="text-2xl font-black text-indigo-700">
                      {totalRegistrations}
                    </span>
                  </div>

                  <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                    <span className="text-[11px] text-emerald-600 font-bold uppercase block">
                      Checked-In
                    </span>
                    <span className="text-2xl font-black text-emerald-700">
                      {checkedInCount}
                    </span>
                  </div>

                  <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                    <span className="text-[11px] text-purple-600 font-bold uppercase block">
                      Attendance Rate
                    </span>
                    <span className="text-2xl font-black text-purple-700">
                      {attendancePercent}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Attendee Roster Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900">
                    Registered Attendee Roster
                  </h3>
                  <p className="text-xs text-gray-500">
                    Verify student identity and grant entrance admission.
                  </p>
                </div>

                {/* Search attendee */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-72">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchAttendee}
                      onChange={(e) => setSearchAttendee(e.target.value)}
                      placeholder="Search name, student ID, pass..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-2 text-gray-600 hover:text-gray-900 bg-gray-100 rounded-xl transition"
                    title="Print Attendee List"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {loadingAttendees ? (
                <div className="py-12">
                  <LoadingSpinner message="Loading attendee roster..." />
                </div>
              ) : filteredAttendees.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-400">
                  {attendees.length === 0
                    ? 'No students have registered for this event yet.'
                    : 'No attendees match your search query.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                      <tr>
                        <th className="py-3.5 px-6">Student</th>
                        <th className="py-3.5 px-6">ID / Roll</th>
                        <th className="py-3.5 px-6">Department</th>
                        <th className="py-3.5 px-6">Pass Code</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Entrance Verification</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                      {filteredAttendees.map((att) => {
                        const isAttended = att.status === 'attended';
                        return (
                          <tr key={att._id} className="hover:bg-gray-50/80 transition">
                            <td className="py-4 px-6 font-bold text-gray-900">
                              {att.studentName}
                              <span className="block text-[11px] font-normal text-gray-400">
                                {att.studentEmail}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-mono font-medium text-gray-800">
                              {att.studentId || '—'}
                            </td>
                            <td className="py-4 px-6 text-gray-600">
                              {att.studentDepartment || 'General'}
                            </td>
                            <td className="py-4 px-6 font-mono font-bold text-indigo-700">
                              {att.ticketCode}
                            </td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                                  isAttended
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : att.status === 'confirmed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {isAttended ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    Attended
                                  </>
                                ) : (
                                  att.status
                                )}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              {isAttended ? (
                                <span className="text-[11px] text-gray-400 font-medium">
                                  Checked In
                                </span>
                              ) : (
                                <button
                                  disabled={checkingInId === att._id}
                                  onClick={() => handleCheckIn(att._id)}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  {checkingInId === att._id ? 'Verifying...' : 'Check In'}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
