import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  ShieldCheck,
  HelpCircle,
  Clock,
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import itemService from '../services/itemService';
import claimService from '../services/claimService';
import { useAuth } from '../context/AuthContext';
import ClaimModal from '../components/ClaimModal';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const categoryLabels = {
  ELECTRONICS: 'Electronics & Gadgets',
  ID_CARDS_DOCUMENTS: 'ID Cards & Certificates',
  BOOKS_STATIONERY: 'Books & Practical Records',
  KEYS: 'Keys & Keychains',
  CLOTHING_ACCESSORIES: 'Watches & Accessories',
  BAGS_WALLETS: 'Bags & Wallets',
  SPORTS_EQUIPMENT: 'Sports Equipment',
  OTHER: 'Other Belongings',
};

export const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchItemData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await itemService.getItemById(id);
      setItem(res.data);

      // If owner or admin, also fetch claims submitted for this item
      if (
        user &&
        (user.id === res.data.reportedBy?._id ||
          user._id === res.data.reportedBy?._id ||
          isAdmin)
      ) {
        try {
          const claimsRes = await claimService.getItemClaims(id);
          setClaims(claimsRes.data || []);
        } catch (claimErr) {
          console.warn('Could not fetch claims for this item:', claimErr);
        }
      }
    } catch (err) {
      setError(err.message || 'Item could not be found or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemData();
  }, [id, user]);

  const isOwner =
    user && item && (user.id === item.reportedBy?._id || user._id === item.reportedBy?._id);
  const canManage = isOwner || isAdmin;
  const isLost = item?.type === 'LOST';

  const handleDeleteItem = async () => {
    if (!window.confirm('Are you sure you want to delete this lost & found report? This cannot be undone.')) {
      return;
    }
    setActionLoading(true);
    try {
      await itemService.deleteItem(id);
      navigate('/items');
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
      setActionLoading(false);
    }
  };

  const handleClaimStatusUpdate = async (claimId, newStatus) => {
    const reason = prompt(
      `Please provide notes for ${newStatus === 'APPROVED' ? 'approving handover' : 'rejecting claim'}:`,
      newStatus === 'APPROVED' ? 'Proof verified. Handover confirmed.' : 'Proof did not match item features.'
    );

    if (reason === null) return;

    setActionLoading(true);
    try {
      await claimService.updateClaimStatus(claimId, newStatus, reason);
      setActionSuccess(`Claim marked as ${newStatus}`);
      fetchItemData();
    } catch (err) {
      alert(`Status update failed: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSpinner text="Loading item details from campus database..." size="lg" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <ErrorMessage message={error || 'Item not found.'} onRetry={fetchItemData} />
        <Link to="/items" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Return to Campus Directory
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(item.dateLostOrFound).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/items"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--gray-600)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Directory
        </Link>
      </div>

      {actionSuccess && (
        <div
          style={{
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            border: '1px solid var(--success-border)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontWeight: 600,
          }}
        >
          {actionSuccess}
        </div>
      )}

      {/* Main Grid: Left Details & Right Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem' }}>
        {/* Left 2 Cols: Main Info & Claims */}
        <div style={{ gridColumn: 'span 2' }}>
          <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            {/* Top Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span className={`badge ${isLost ? 'badge-lost' : 'badge-found'}`} style={{ fontSize: '0.825rem' }}>
                {isLost ? 'Lost Property' : 'Found Property'}
              </span>
              <span className="badge badge-category">
                {categoryLabels[item.category] || item.category}
              </span>
              {item.status === 'CLAIM_PENDING' && (
                <span className="badge badge-pending">Verification Claim Pending</span>
              )}
              {item.status === 'RETURNED' && (
                <span className="badge badge-returned">Returned to Rightful Owner</span>
              )}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: 'var(--gray-900)',
                marginBottom: '1.25rem',
                lineHeight: 1.25,
              }}
            >
              {item.title}
            </h1>

            {/* Image (if provided) */}
            {item.imageUrl && (
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  maxHeight: '380px',
                  backgroundColor: 'var(--gray-100)',
                  marginBottom: '1.5rem',
                }}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
                Description & Circumstances
              </h3>
              <p style={{ color: 'var(--gray-700)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {item.description}
              </p>
            </div>

            {/* Key Attribute Highlights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                backgroundColor: 'var(--gray-50)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                  {isLost ? 'Estimated Location Lost' : 'Campus Spot Found'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontWeight: 600, color: 'var(--gray-800)' }}>
                  <MapPin size={18} style={{ color: 'var(--primary)' }} />
                  <span>{item.location}</span>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                  Date Reported
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontWeight: 600, color: 'var(--gray-800)' }}>
                  <Calendar size={18} style={{ color: 'var(--primary)' }} />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {item.custodyLocation && (
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
                    Current Safe Custody
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontWeight: 600, color: 'var(--success)' }}>
                    <Building size={18} />
                    <span>{item.custodyLocation}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Distinguishing marks (visible if owner/admin) */}
            {canManage && item.distinguishingMarks && (
              <div
                style={{
                  backgroundColor: 'var(--warning-bg)',
                  border: '1px solid var(--warning-border)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                }}
              >
                <strong style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <ShieldCheck size={16} /> Internal Distinguishing Marks (Confidential):
                </strong>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-800)', marginTop: '0.25rem' }}>
                  {item.distinguishingMarks}
                </p>
              </div>
            )}
          </div>

          {/* Verification Claims Section (for item owner or admin) */}
          {canManage && (
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
                Ownership Verification Claims ({claims.length})
              </h3>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                Review proof provided by students claiming this item before approving physical handover.
              </p>

              {claims.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                  No ownership claims have been submitted yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {claims.map((claim) => (
                    <div
                      key={claim._id}
                      style={{
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.25rem',
                        backgroundColor: claim.status === 'APPROVED' ? 'var(--success-bg)' : '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>
                            {claim.claimant?.name || 'Student'} ({claim.claimant?.studentId || 'N/A'})
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>
                            {claim.claimant?.department} &bull; {claim.claimant?.email} &bull; Phone: {claim.contactPhone || 'N/A'}
                          </div>
                        </div>
                        <span
                          className={`badge ${
                            claim.status === 'APPROVED'
                              ? 'badge-found'
                              : claim.status === 'REJECTED'
                              ? 'badge-lost'
                              : 'badge-pending'
                          }`}
                        >
                          {claim.status}
                        </span>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-600)', marginBottom: '0.2rem' }}>
                          Proof of Ownership Statement:
                        </div>
                        <p style={{ fontSize: '0.875rem', color: 'var(--gray-800)', backgroundColor: 'var(--gray-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                          "{claim.proofDescription}"
                        </p>
                      </div>

                      {claim.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          <button
                            type="button"
                            onClick={() => handleClaimStatusUpdate(claim._id, 'APPROVED')}
                            disabled={actionLoading}
                            className="btn btn-success btn-sm"
                          >
                            <CheckCircle size={15} /> Approve & Return Item
                          </button>
                          <button
                            type="button"
                            onClick={() => handleClaimStatusUpdate(claim._id, 'REJECTED')}
                            disabled={actionLoading}
                            className="btn btn-danger btn-sm"
                          >
                            <XCircle size={15} /> Reject Claim
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Col: Actions & Contact Box */}
        <div>
          {/* Action Card */}
          <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1rem' }}>
              Action & Verification
            </h3>

            {/* If not owner and item not returned, show Claim button */}
            {!isOwner && item.status !== 'RETURNED' && (
              <div style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (!user) {
                      navigate('/login', { state: { from: `/items/${id}` } });
                    } else {
                      setClaimModalOpen(true);
                    }
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%', marginBottom: '0.75rem' }}
                >
                  <ShieldCheck size={18} /> Claim This Item
                </button>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-500)', lineHeight: 1.4 }}>
                  You will be asked to describe confidential identifying details or proof of ownership.
                </p>
              </div>
            )}

            {item.status === 'RETURNED' && (
              <div
                style={{
                  backgroundColor: '#f3f4f6',
                  color: 'var(--gray-700)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  marginBottom: '1rem',
                }}
              >
                &check; This item has been verified and returned to its owner.
              </div>
            )}

            {/* Owner / Admin Management Buttons */}
            {canManage && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--gray-200)', paddingTop: '1rem' }}>
                <Link to={`/items/${id}/edit`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <Edit size={16} /> Edit Report
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteItem}
                  disabled={actionLoading}
                  className="btn btn-danger btn-sm"
                  style={{ width: '100%' }}
                >
                  <Trash2 size={16} /> Delete Report
                </button>
              </div>
            )}
          </div>

          {/* Reporter Information Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1rem' }}>
              Reported By
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}
              >
                {item.reportedBy?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>
                  {item.reportedBy?.name || 'Campus Member'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                  {item.reportedBy?.department || 'Sahrdaya CET'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
              {item.contactEmail && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={15} style={{ color: 'var(--primary)' }} />
                  <span>{item.contactEmail}</span>
                </div>
              )}
              {item.contactPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={15} style={{ color: 'var(--primary)' }} />
                  <span>{item.contactPhone}</span>
                </div>
              )}
            </div>

            <div
              style={{
                marginTop: '1.25rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--gray-100)',
                fontSize: '0.775rem',
                color: 'var(--gray-500)',
                lineHeight: 1.5,
              }}
            >
              For security, handovers of high-value items should always take place at the Main Security Desk or Department HOD Office.
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        item={item}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onSuccess={() => {
          fetchItemData();
          setActionSuccess('Your claim has been submitted to the finder/security desk.');
        }}
      />
    </div>
  );
};

export default ItemDetails;
