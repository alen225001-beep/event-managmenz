import React from 'react';
import { X, Printer, Calendar, Clock, MapPin, CheckCircle, ShieldCheck, Share2 } from 'lucide-react';
import { WhatsAppIcon } from './ShareButtons';

const TicketPassModal = ({ pass, onClose }) => {
  if (!pass) return null;

  const event = pass.event || {};
  const eventDate = event.date ? new Date(event.date) : new Date();
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isPaidTicket = pass.isPaid || pass.paymentStatus === 'completed' || (pass.paymentAmount && pass.paymentAmount > 0);

  const handlePrint = () => {
    window.print();
  };

  const handleSharePass = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sahrdaya-eventhub.onrender.com';
    const eventUrl = event._id ? `${origin}/events/${event._id}` : origin;
    const text = `🎉 I'm attending *${event.title || 'Campus Event'}* at Sahrdaya College of Engineering & Technology!\n` +
      `🎟️ *Admission Pass Code:* ${pass.ticketCode}\n` +
      `📅 *Date:* ${formattedDate} at ${event.time || 'TBA'}\n` +
      `📍 *Venue:* ${event.venue || 'Sahrdaya Campus'}\n\n` +
      `Join me and reserve your pass on Sahrdaya EventHub:\n👉 ${eventUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full flex items-center justify-center transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Ticket Area */}
        <div className="p-6 sm:p-8 print:p-0">
          {/* Ticket Header */}
          <div className="text-center pb-5 border-b border-dashed border-gray-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sahrdaya College of Engineering & Technology
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              CAMPUS EVENT ENTRY PASS
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              Official Digital Admission Ticket • Kodakara, Thrissur
            </p>
          </div>

          {/* Ticket Body */}
          <div className="py-6 space-y-4">
            {/* Ticket Code & Status */}
            <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Unique Pass Code
                </span>
                <span className="text-xl font-mono font-black text-indigo-400">
                  {pass.ticketCode}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    pass.status === 'attended'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : pass.status === 'pending_payment'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  <CheckCircle className="w-3 h-3" />
                  {pass.status === 'attended'
                    ? 'Checked In'
                    : pass.status === 'pending_payment'
                    ? 'Payment Pending'
                    : 'Confirmed Pass'}
                </span>
              </div>
            </div>

            {/* Payment Verification Receipt Strip */}
            {isPaidTicket ? (
              <div className="bg-emerald-50/80 rounded-2xl p-3 border border-emerald-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Payment Confirmed: ₹{pass.paymentAmount || event.price}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {pass.paymentMethod || 'UPI / QR'}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-700/80 font-mono">
                  <span>Txn: {pass.paymentId || 'SHR-PAY-VERIFIED'}</span>
                  <span>{pass.paymentDate ? new Date(pass.paymentDate).toLocaleDateString() : 'Paid'}</span>
                </div>
              </div>
            ) : (
              <div className="bg-indigo-50/70 rounded-2xl p-2.5 border border-indigo-100 text-xs flex items-center justify-between">
                <span className="text-indigo-800 font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                  Free Campus Admission Pass
                </span>
                <span className="text-[11px] text-indigo-600 font-bold">₹0.00 (Standard Entry)</span>
              </div>
            )}

            {/* Event Name */}
            <div>
              <span className="text-xs font-bold text-indigo-600 block mb-0.5">
                {event.clubName || 'College Student Council'}
              </span>
              <h3 className="text-lg font-extrabold text-gray-900 leading-snug">
                {event.title}
              </h3>
            </div>

            {/* Event Meta Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <div>
                <span className="text-gray-400 font-medium block flex items-center gap-1 mb-0.5">
                  <Calendar className="w-3 h-3 text-indigo-500" />
                  Date
                </span>
                <span className="font-bold text-gray-800">{formattedDate}</span>
              </div>

              <div>
                <span className="text-gray-400 font-medium block flex items-center gap-1 mb-0.5">
                  <Clock className="w-3 h-3 text-indigo-500" />
                  Timing
                </span>
                <span className="font-bold text-gray-800">{event.time}</span>
              </div>

              <div className="col-span-2 pt-2 border-t border-gray-200/60">
                <span className="text-gray-400 font-medium block flex items-center gap-1 mb-0.5">
                  <MapPin className="w-3 h-3 text-indigo-500" />
                  Venue
                </span>
                <span className="font-bold text-gray-800">{event.venue}</span>
              </div>
            </div>

            {/* Attendee Info */}
            <div className="border-t border-b border-dashed border-gray-200 py-3 text-xs flex justify-between items-center">
              <div>
                <span className="text-gray-400 block font-medium">Attendee</span>
                <span className="font-bold text-gray-900 text-sm">{pass.studentName}</span>
                <span className="text-gray-500 block">{pass.studentDepartment || 'B.Tech Student'}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block font-medium">Student ID</span>
                <span className="font-mono font-bold text-gray-800">{pass.studentId || 'SCET'}</span>
                <span className="text-gray-500 block text-[11px]">{pass.studentEmail}</span>
              </div>
            </div>

            {/* Simulated Barcode */}
            <div className="text-center pt-2">
              <div className="h-12 w-full max-w-xs mx-auto flex items-center justify-between px-3 bg-gray-100 rounded-lg overflow-hidden font-mono tracking-widest text-[9px] text-gray-400 border border-gray-200">
                <span>||||| || |||||| | ||||| ||| ||||||| | ||||</span>
                <span className="font-bold text-gray-700">{pass.ticketCode}</span>
                <span>||| |||||| || | ||||</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">
                Present this digital pass or printed QR at the entrance desk for automated check-in.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 print:hidden">
          <button
            type="button"
            onClick={handleSharePass}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Share Pass</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-xl transition"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Pass
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPassModal;
