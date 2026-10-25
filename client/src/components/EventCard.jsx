import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WhatsAppShareButton } from './ShareButtons';

const categoryColors = {
  'Technical Workshop': 'bg-blue-100 text-blue-800 border-blue-200',
  Hackathon: 'bg-purple-100 text-purple-800 border-purple-200',
  'Cultural Fest': 'bg-pink-100 text-pink-800 border-pink-200',
  'National Seminar': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Sports Tournament': 'bg-amber-100 text-amber-800 border-amber-200',
  'Career & Placement': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Guest Lecture': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Other: 'bg-gray-100 text-gray-800 border-gray-200',
};

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day = eventDate.getDate();

  const isSoldOut = event.registeredCount >= event.capacity;
  const isPaid = event.ticketType === 'paid' && Number(event.price) > 0;
  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  const categoryBadgeClass =
    categoryColors[event.category] || 'bg-gray-100 text-gray-800 border-gray-200';

  const eventUrl = typeof window !== 'undefined' ? `${window.location.origin}/events/${event._id}` : `/events/${event._id}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col group">
      {/* Card Header & Banner Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2.5 py-1.5 rounded-xl shadow-md text-center border border-gray-100 leading-tight">
          <div className="text-[11px] font-black text-indigo-600 tracking-wider">{month}</div>
          <div className="text-lg font-black text-gray-900">{day}</div>
        </div>

        {/* Category & Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${categoryBadgeClass}`}
          >
            {event.category}
          </span>
          {isSoldOut ? (
            <span className="text-[11px] font-black bg-red-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider shadow">
              Sold Out
            </span>
          ) : isPaid ? (
            <span className="text-[11px] font-black bg-amber-500 text-slate-900 px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow border border-amber-300">
              ₹{event.price} Entry
            </span>
          ) : (
            <span className="text-[11px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md uppercase tracking-wider shadow">
              Free Pass
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Hosting Club */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>{event.clubName}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 mb-2 group-hover:text-indigo-600 transition">
          {event.title}
        </h3>

        {/* Description snippet */}
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
          {event.description}
        </p>

        {/* Event Meta Details */}
        <div className="space-y-1.5 text-xs text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>

        {/* Capacity Meter */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="text-gray-500 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {event.registeredCount} / {event.capacity} registered
            </span>
            <span className={spotsLeft <= 10 && spotsLeft > 0 ? 'text-amber-600 font-bold' : 'text-gray-500'}>
              {spotsLeft === 0 ? 'Housefull' : `${spotsLeft} seats left`}
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isSoldOut
                  ? 'bg-red-500'
                  : percentFilled > 80
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${percentFilled}%` }}
            />
          </div>
        </div>

        {/* Action Buttons: View Details + WhatsApp Share */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            to={`/events/${event._id}`}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm ${
              isSoldOut
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : isPaid
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100'
            }`}
          >
            {isSoldOut ? 'View Event Details' : isPaid ? `Book Pass (₹${event.price})` : 'Book Free Pass'}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <WhatsAppShareButton
            event={event}
            url={eventUrl}
            variant="icon"
          />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
