import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Image,
  Tag,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import eventService from '../services/eventService';
import { useAuth } from '../context/AuthContext';

const PRESET_BANNERS = [
  {
    label: 'Tech / Hackathon',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Workshop / AI',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Cultural / Fest',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Seminar / Biotech',
    url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1200&q=80',
  },
  {
    label: 'Sports Tournament',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
  },
];

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

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical Workshop',
    venue: 'Decennial Hall, Main Block',
    date: '',
    time: '09:30 AM - 04:30 PM',
    registrationDeadline: '',
    capacity: 100,
    clubName: user?.clubName || 'IEEE Sahrdaya Student Branch',
    bannerImage: PRESET_BANNERS[0].url,
    description: '',
    tags: 'workshop, scet, hands-on',
    contactEmail: user?.email || 'events@sahrdaya.ac.in',
    contactPhone: user?.phone || '+91 94000 11223',
    ticketType: 'free',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Please provide an event title.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please provide event description.');
      return;
    }
    if (!formData.date) {
      setError('Please select an event date.');
      return;
    }
    if (!formData.registrationDeadline) {
      setError('Please select a registration deadline.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await eventService.createEvent(formData);
      navigate(`/events/${res.event._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create campus event.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel and Return
        </Link>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-10">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
              Organizer Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Publish New Campus Event
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Host a workshop, hackathon, or seminar. Published events appear immediately in the campus feed.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-xs">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. TechNovus '26: Annual Inter-College Hackathon"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {/* Category & Hosting Club */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
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
                  Hosting Club or Department *
                </label>
                <input
                  type="text"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  placeholder="e.g. IEEE Sahrdaya SB / IEDC"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Venue & Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Campus Venue *
                </label>
                <select
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                >
                  {PRESET_VENUES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Max Seating Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="5"
                  max="2000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Date, Time & Registration Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Timing *
                </label>
                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="09:30 AM - 04:30 PM"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Registration Closes *
                </label>
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Preset Banner Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                Select Cover Banner
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-2">
                {PRESET_BANNERS.map((banner, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, bannerImage: banner.url }))}
                    className={`relative rounded-xl overflow-hidden h-16 border-2 transition ${
                      formData.bannerImage === banner.url
                        ? 'border-indigo-600 scale-95 shadow-md'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={banner.url} alt={banner.label} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white text-center py-0.5 truncate px-1">
                      {banner.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                Detailed Event Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Describe key speakers, agenda, learning outcomes, rules, and prerequisites..."
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed"
              />
            </div>

            {/* Tags & Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="ai, coding, hackathon, certificates"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">
                  Coordinator Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <Link
                to="/"
                className="px-5 py-2.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-xl"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition disabled:opacity-50"
              >
                {submitting ? 'Publishing Event...' : 'Publish Campus Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
