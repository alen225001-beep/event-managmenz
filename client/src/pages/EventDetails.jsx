import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Ticket,
  ArrowLeft,
  Mail,
  Phone,
  Edit,
  ShieldCheck,
  AlertCircle,
  CreditCard,
  Lock,
  Sparkles,
} from 'lucide-react';
import eventService from '../services/eventService';
import registrationService from '../services/registrationService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TicketPassModal from '../components/TicketPassModal';
import PaymentModal from '../components/PaymentModal';
import { WhatsAppShareButton, CopyLinkButton } from '../components/ShareButtons';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Registration & Payment state
  const [isRegistered, setIsRegistered] = useState(false);
  const [userPass, setUserPass] = useState(null);
  const [registering, setRegistering] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await eventService.getEventById(id);
      setEvent(res.event);
      setIsRegistered(res.isRegistered);
      setUserPass(res.userPass);
    } catch (err) {
      setError(err.message || 'Unable to load event details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const isPaidEvent = event?.ticketType === 'paid' && Number(event?.price) > 0;
  const isPendingPayment = userPass && userPass.status === 'pending_payment';

  // Trigger registration or open payment portal
  const handleInitiateBooking = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    if (isPaidEvent) {
      // Open Payment Portal modal
      setRegisterError(null);
      setShowPaymentModal(true);
    } else {
      // Free event instant booking
      handleFreeBooking();
    }
  };

  // Free event booking
  const handleFreeBooking = async () => {
    setRegistering(true);
    setRegisterError(null);
    try {
      const res = await registrationService.registerForEvent(id);
      setIsRegistered(true);
      setUserPass(res.registration);
      setShowPassModal(true);
      fetchEvent();
    } catch (err) {
      setRegisterError(err.message || 'Failed to complete registration.');
    } finally {
      setRegistering(false);
    }
  };

  // Payment completed callback from PaymentModal
  const handlePaymentSuccess = async (paymentData) => {
    setShowPaymentModal(false);
    setRegistering(true);
    setRegisterError(null);

    try {
      let res;
      if (isPendingPayment && userPass?._id) {
        // Complete payment on existing pending registration
        res = await registrationService.processPayment(userPass._id, paymentData);
      } else {
        // Create new registration with payment
        res = await registrationService.registerForEvent(id, {
          paymentMethod: paymentData.paymentMethod,
          paymentId: paymentData.paymentId,
          paymentAmount: paymentData.paymentAmount,
        });
      }

      setIsRegistered(true);
      setUserPass(res.registration);
      setShowPassModal(true);
      fetchEvent();
    } catch (err) {
      setRegisterError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingSpinner message="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <ErrorMessage message={error || 'Event not found.'} onRetry={fetchEvent} />
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const deadlineDate = new Date(event.registrationDeadline);
  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const isSoldOut = event.registeredCount >= event.capacity;
  const spotsLeft = Math.max(0, event.capacity - event.registeredCount);
  const percentFilled = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  const isOrganizerOrAdmin =
    user && (user.role === 'admin' || (event.organizer && event.organizer._id === user._id));

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Link & Admin controls */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-indigo-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Events
          </Link>

          {isOrganizerOrAdmin && (
            <div className="flex items-center gap-2">
              <Link
                to={`/events/${event._id}/edit`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition"
              >
                <Edit className="w-3.5 h-3.5 text-indigo-500" />
                Edit Event
              </Link>
              <Link
                to={`/organizer/dashboard`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition"
              >
                <Users className="w-3.5 h-3.5" />
                Attendee Roster
              </Link>
            </div>
          )}
        </div>

        {/* Main Grid: Left Event Details, Right Booking Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Banner Image Card */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-100">
                <img
                  src={event.bannerImage}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/95 backdrop-blur text-indigo-700 shadow-md border border-gray-100">
                    {event.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-md ${
                      isPaidEvent
                        ? 'bg-amber-400 text-slate-900 border border-amber-300'
                        : 'bg-slate-900/90 text-white'
                    }`}
                  >
                    {isPaidEvent ? `₹${event.price} (Paid Entry)` : 'Free Admission'}
                  </span>
                </div>
              </div>

              {/* Event Header Info */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                  <span>Hosted by {event.clubName}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight leading-snug mb-4">
                  {event.title}
                </h1>

                {/* Date / Time / Venue quick bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900 block">{formattedDate}</span>
                      <span className="text-gray-500">{event.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <span className="font-bold text-gray-900 block">{event.venue}</span>
                      <span className="text-gray-500">Sahrdaya Campus, Kodakara</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-gray-900 tracking-tight">
                About This Campus Event
              </h2>
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 block mb-2 uppercase tracking-wider">
                    Topics & Keywords
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Organizer Contact Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-black text-lg shrink-0">
                  SCET
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{event.clubName}</h4>
                  <p className="text-xs text-gray-500">
                    Coordinator:{' '}
                    {event.organizer ? event.organizer.name : 'Alen (Student Lead)'}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-gray-500 space-y-1">
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{event.contactEmail || 'events@sahrdaya.ac.in'}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{event.contactPhone || '+91 94000 11223'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ticket Reservation & Payment Box */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm sticky top-24 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block mb-1">
                  Admission & Passes
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900">
                    {isPaidEvent ? `₹${event.price}` : 'FREE'}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Per Student Entry Pass</span>
                </div>
                {isPaidEvent && (
                  <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Instant Digital Pass on Payment Confirmation</span>
                  </div>
                )}
              </div>

              {/* Deadline alert */}
              <div className="text-xs text-gray-600 p-3 bg-amber-50 border border-amber-200/60 rounded-xl">
                ⏳ Registration closes on <span className="font-bold">{formattedDeadline}</span>
              </div>

              {/* Capacity Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-gray-600">Reserved Spots:</span>
                  <span className="text-gray-900">
                    {event.registeredCount} / {event.capacity}
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
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
                <div className="text-right text-[11px] font-bold text-gray-500">
                  {spotsLeft === 0 ? 'Housefull (0 Remaining)' : `${spotsLeft} seats available`}
                </div>
              </div>

              {/* Registration Actions */}
              {isRegistered && !isPendingPayment ? (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>You hold a confirmed entry pass for this event!</span>
                  </div>

                  <button
                    onClick={() => setShowPassModal(true)}
                    className="w-full py-3 bg-slate-900 hover:bg-black text-white font-bold text-sm rounded-2xl transition shadow flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-4 h-4 text-indigo-400" />
                    View & Print Entry Pass
                  </button>
                </div>
              ) : isPendingPayment ? (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      Payment Pending (₹{event.price})
                    </div>
                    <p className="text-[11px] text-amber-700">
                      Your ticket is awaiting payment authorization. Please complete payment to confirm your admission.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-black text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Complete Payment (₹{event.price})
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {registerError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{registerError}</span>
                    </div>
                  )}

                  <button
                    disabled={isSoldOut || registering}
                    onClick={handleInitiateBooking}
                    className={`w-full py-3.5 text-sm font-black rounded-2xl transition shadow-lg flex items-center justify-center gap-2 ${
                      isSoldOut
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                        : isPaidEvent
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-indigo-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                    }`}
                  >
                    {registering ? (
                      'Securing Pass...'
                    ) : isSoldOut ? (
                      'Event Sold Out'
                    ) : isPaidEvent ? (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Proceed to Payment (₹{event.price})
                      </>
                    ) : (
                      <>
                        <Ticket className="w-4 h-4" />
                        Book Free Entry Pass
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-gray-400 text-center leading-tight">
                    {isPaidEvent
                      ? 'Secure 256-bit payment via UPI, Debit/Credit Card or Net Banking. Tickets confirmed immediately.'
                      : 'Requires verified Sahrdaya student account. Digital passes are validated at the entrance.'}
                  </p>
                </div>
              )}

              {/* WhatsApp Sharing Card */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <span className="text-xs font-bold text-gray-700 block">
                  Share Event With Friends
                </span>
                <div className="flex flex-col gap-2">
                  <WhatsAppShareButton event={event} />
                  <CopyLinkButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Portal Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          event={event}
          user={user}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Ticket Pass Modal */}
      {showPassModal && (
        <TicketPassModal
          pass={
            userPass || {
              event,
              studentName: user?.name,
              studentEmail: user?.email,
              ticketCode: 'CONFIRMED',
              isPaid: isPaidEvent,
              paymentAmount: event.price,
            }
          }
          onClose={() => setShowPassModal(false)}
        />
      )}
    </div>
  );
};

export default EventDetails;
