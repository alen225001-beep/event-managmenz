import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ShieldCheck, HelpCircle } from 'lucide-react';

const categoryLabels = {
  ELECTRONICS: 'Electronics',
  ID_CARDS_DOCUMENTS: 'ID & Documents',
  BOOKS_STATIONERY: 'Books & Stationery',
  KEYS: 'Keys',
  CLOTHING_ACCESSORIES: 'Accessories',
  BAGS_WALLETS: 'Bags & Wallets',
  SPORTS_EQUIPMENT: 'Sports Gear',
  OTHER: 'Other',
};

export const ItemCard = ({ item }) => {
  const isLost = item.type === 'LOST';
  const formattedDate = new Date(item.dateLostOrFound).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Image or Category Placeholder */}
      <div
        style={{
          height: '180px',
          width: '100%',
          backgroundColor: isLost ? '#fef2f2' : '#ecfdf5',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isLost ? 'var(--danger)' : 'var(--success)',
            }}
          >
            {isLost ? <HelpCircle size={48} strokeWidth={1.5} /> : <ShieldCheck size={48} strokeWidth={1.5} />}
          </div>
        )}

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            gap: '0.35rem',
          }}
        >
          <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`}>
            {item.type}
          </span>
          {item.status === 'CLAIM_PENDING' && (
            <span className="badge badge-pending">Claim Pending</span>
          )}
          {item.status === 'RETURNED' && (
            <span className="badge badge-returned">Returned</span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span className="badge badge-category" style={{ fontSize: '0.7rem' }}>
            {categoryLabels[item.category] || item.category}
          </span>
        </div>

        <h4
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--gray-900)',
            marginBottom: '0.5rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </h4>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--gray-600)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flexGrow: 1,
          }}
        >
          {item.description}
        </p>

        {/* Metadata Details */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            fontSize: '0.825rem',
            color: 'var(--gray-500)',
            borderTop: '1px solid var(--gray-100)',
            paddingTop: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.location}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} style={{ flexShrink: 0 }} />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Action Link */}
        <Link
          to={`/items/${item._id}`}
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', fontWeight: 600 }}
        >
          View Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
