import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Calendar,
  Users,
  Trophy,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import eventService from '../services/eventService';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const CATEGORIES = [
  'All',
  'Technical Workshop',
  'Hackathon',
  'Cultural Fest',
  'National Seminar',
  'Sports Tournament',
  'Career & Placement',
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventService.getEvents({
        search: searchQuery,
        category: selectedCategory,
        sort: sortBy,
        page,
        limit: 9,
      });
      setEvents(res.events || []);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      setError(err.message || 'Unable to load events from Sahrdaya server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatured = async () => {
    try {
      const res = await eventService.getFeaturedEvents();
      setFeaturedEvents(res.events || []);
    } catch {
      // Non-critical, ignore
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [selectedCategory, sortBy, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchEvents();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('date');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* College Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Sahrdaya College of Engineering & Technology, Kodakara</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            Discover Campus Events & Reserve{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-indigo-200">
              Digital Entry Passes
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Your centralized portal for national hackathons, technical workshops, IEEE seminars, cultural galas, and inter-collegiate sports championships across Sahrdaya campus.
          </p>

          {/* Search Box in Hero */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center bg-white rounded-2xl p-2 shadow-2xl border border-white/20"
          >
            <div className="flex items-center pl-3 flex-1">
              <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event title, club name (IEEE, CSI, IEDC), or venue..."
                className="w-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-indigo-500/20 shrink-0"
            >
              Search
            </button>
          </form>

          {/* Campus Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-14 pt-10 border-t border-slate-800 text-left">
            <div className="bg-slate-800/50 backdrop-blur p-4 rounded-2xl border border-slate-700/60">
              <div className="text-2xl font-black text-indigo-400 mb-0.5">25+</div>
              <div className="text-xs text-slate-400 font-medium">Campus Events Year-Round</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur p-4 rounded-2xl border border-slate-700/60">
              <div className="text-2xl font-black text-sky-400 mb-0.5">6+</div>
              <div className="text-xs text-slate-400 font-medium">Active Student Chapters</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur p-4 rounded-2xl border border-slate-700/60">
              <div className="text-2xl font-black text-emerald-400 mb-0.5">1,200+</div>
              <div className="text-xs text-slate-400 font-medium">Digital Passes Issued</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur p-4 rounded-2xl border border-slate-700/60">
              <div className="text-2xl font-black text-amber-400 mb-0.5">100%</div>
              <div className="text-xs text-slate-400 font-medium">Free Student Registrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        {/* Category Pills & Sort Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            <span className="text-xs text-gray-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="date">Upcoming Date</option>
              <option value="popular">Most Popular</option>
              <option value="newest">Recently Published</option>
            </select>
          </div>
        </div>

        {/* Spotlight / Featured Section */}
        {featuredEvents.length > 0 && selectedCategory === 'All' && !searchQuery && page === 1 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-extrabold text-gray-900">Featured Campus Spotlights</h2>
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                Top Priority
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredEvents.slice(0, 2).map((fe) => (
                <div
                  key={fe._id}
                  className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden group border border-indigo-800"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 uppercase tracking-wider">
                        {fe.category}
                      </span>
                      <span className="text-xs font-bold text-amber-300">
                        {fe.registeredCount} Students Registered
                      </span>
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-white group-hover:text-indigo-300 transition">
                      {fe.title}
                    </h3>
                    <p className="text-slate-300 text-xs line-clamp-2 mb-4 leading-relaxed">
                      {fe.description}
                    </p>
                    <div className="text-xs text-slate-300 space-y-1">
                      <div>📍 {fe.venue}</div>
                      <div>🗓️ {new Date(fe.date).toLocaleDateString()} | {fe.time}</div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between relative z-10">
                    <span className="text-xs font-bold text-indigo-400">
                      Organized by {fe.clubName}
                    </span>
                    <Link
                      to={`/events/${fe._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-indigo-900 rounded-xl text-xs font-extrabold hover:bg-indigo-50 transition shadow"
                    >
                      View & Register
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {selectedCategory === 'All' ? 'All Upcoming Campus Events' : `${selectedCategory}s`}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Instant free seat booking with digital entry passes for Sahrdaya students.
            </p>
          </div>
          {searchQuery && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* 4-State UI Content */}
        {loading ? (
          <LoadingSpinner message="Fetching campus workshops and activities..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchEvents} />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events match your criteria"
            description="We couldn't find any campus events matching this category or keyword. Try resetting your search."
            actionLabel="View All Upcoming Events"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-gray-500 px-3">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
