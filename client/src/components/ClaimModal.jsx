import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle } from 'lucide-react';
import claimService from '../services/claimService';

export const ClaimModal = ({ item, isOpen, onClose, onSuccess }) => {
  const [proofDescription, setProofDescription] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!proofDescription || proofDescription.trim().length < 10) {
      setError('Please provide at least 10 characters detailing your proof of ownership.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await claimService.createClaim({
        itemId: item._id,
        proofDescription: proofDescription.trim(),
        contactPhone: contactPhone.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Failed to submit ownership claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>
            Claim Ownership Verification
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
            aria-label="Close modal"
          >
            <X size={22} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle size={48} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
              Claim Submitted!
            </h4>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>
              Your verification details have been forwarded to the finder / campus security. You will be notified once verified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div
              style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem',
                marginBottom: '1.25rem',
                fontSize: '0.85rem',
                color: 'var(--primary)',
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'flex-start',
              }}
            >
              <ShieldAlert size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Claiming:</strong> {item.title}
                <div style={{ marginTop: '0.2rem', color: 'var(--gray-600)' }}>
                  To prevent fraudulent claims, describe details only the genuine owner would know (e.g. wallpapers, stickers, marks, serial numbers, exact pocket contents).
                </div>
              </div>
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: 'var(--danger-bg)',
                  color: 'var(--danger)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="proofDescription">
                Distinguishing Marks & Proof of Ownership *
              </label>
              <textarea
                id="proofDescription"
                className="form-textarea"
                rows={4}
                placeholder="Describe specific scratches, lock screen image, brand of cover, files inside, serial number, etc."
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                Minimum 10 characters required.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactPhone">
                Contact Phone for Handover Verification
              </label>
              <input
                id="contactPhone"
                type="tel"
                className="form-input"
                placeholder="+91 98470 XXXXX"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button type="button" onClick={onClose} className="btn btn-secondary btn-sm" disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? 'Submitting Claim...' : 'Submit Ownership Claim'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ClaimModal;
