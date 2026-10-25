import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import eventService from '../services/eventService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PRESET_VENUES = [
  'Decennial Hall, Main Block',
  'BME Seminar Hall, Biotech Block',
  'Central Computing Facility (CCF) - Lab 1',
  'Central Computing Facility (CCF) - Lab 3',
  'College Main Open Air Auditorium',
  'Indoor Sports Complex & Gymnasium',
  'Civil Seminar Hall',
  'General Workshop Shed',
];

const CATEGORIES = [
  'Technical Workshop',
  'Hackathon',
  'Cultural Fest',
  'National Seminar',
  'Sports Tournament',
  'Guest Lecture',
  'Career & Placement',
  'Other',
];

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical Workshop',
    venue: '',
    date: '',
    time: '',
    registrationDeadline: '',
    capacity: 100,
    clubName: '',
    bannerImage: '',
    description: '',
    tags: '',
    status: 'upcoming',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await eventService.getEventById(id);
        const e = res.event;
        setFormData({
          title: e.title || '',
          category: e.category || 'Technical Workshop',
          venue: e.venue || '',
          date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
          time: e.time || '',
          registrationDeadline: e.registrationDeadline
            ? new Date(e.registrationDeadline).toISOString().split('T')[0]
            : '',
          capacity: e.capacity || 100,
          clubName: e.clubName || '',
          bannerImage: e.bannerImage || '',
          description: e.description || '',
          tags: Array.isArray(e.tags) ? e.tags.join(', ') : '',
          status: e.status || 'upcoming',
        });
      } catch (err) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await eventService.updateEvent(id, formData);
      navigate(`/events/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update event.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingSpinner message="Loading event details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event Details
        </Link>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Edit Campus Event
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Update timing, venue, capacity, or event lifecycle status.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Event Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Time
                </label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Deadline
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm leading-relaxed"
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <Link
                to={`/events/${id}`}
                className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
