import React, { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

// Official WhatsApp icon SVG
export const WhatsAppIcon = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export const formatEventShareText = (event, customUrl) => {
  const url = customUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const eventDate = event?.date ? new Date(event.date) : new Date();
  const formattedDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const priceBadge =
    event?.ticketType === 'paid' && event?.price > 0 ? `₹${event.price} (Paid Entry)` : 'FREE Entry Pass';

  return `🎓 *${event?.title || 'Campus Event'}*
🏛️ *Organized by:* ${event?.clubName || 'Sahrdaya Student Council'} | Sahrdaya CET
📅 *Date:* ${formattedDate} at ${event?.time || 'TBA'}
📍 *Venue:* ${event?.venue || 'Sahrdaya Campus, Kodakara'}
🎟️ *Admission:* ${priceBadge}

✨ Register now and get your verified digital entry pass on Sahrdaya EventHub:
👉 ${url}`;
};

export const WhatsAppShareButton = ({
  event,
  url,
  variant = 'full', // 'full' | 'compact' | 'icon'
  className = '',
}) => {
  const handleShare = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const shareText = formatEventShareText(event, url);
    const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={handleShare}
        title="Share event on WhatsApp"
        className={`w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition shadow-sm hover:scale-105 ${className}`}
      >
        <WhatsAppIcon className="w-4 h-4" />
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition ${className}`}
      >
        <WhatsAppIcon className="w-4 h-4 text-emerald-600" />
        <span>WhatsApp</span>
      </button>
    );
  }

  // Full default variant
  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200 hover:shadow-lg transition ${className}`}
    >
      <WhatsAppIcon className="w-5 h-5 text-white" />
      <span>Share on WhatsApp</span>
    </button>
  );
};

export const CopyLinkButton = ({ url, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const link = url || (typeof window !== 'undefined' ? window.location.href : '');
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition shadow-sm ${className}`}
      title="Copy event URL"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-700">Link Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 text-gray-500" />
          <span>Copy Link</span>
        </>
      )}
    </button>
  );
};

export default WhatsAppShareButton;
