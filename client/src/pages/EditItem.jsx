import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Save } from 'lucide-react';
import itemService from '../services/itemService';
import LoadingSpinner from '../components/LoadingSpinner';

const SAHRDAYA_LOCATIONS = [
  'Central Library 1st Floor',
  'Central Library 2nd Floor Reading Room',
  'Decennial Block Room 204',
  'Decennial Block (Ground Floor)',
  'College Canteen & Cafeteria',
  'Student Vehicle Parking Shed',
  'Main Security Gate Desk',
  'Computer Science Dept Lab 1',
  'Computer Science Dept Lab 2',
  'Biomedical Engineering Lab',
  'Electronics & Comm. Lab',
  'Civil Engineering Block',
  'Main Football Ground & Pavilion',
  'Basketball & Badminton Court',
  'Auditorium / Central Seminar Hall',
  'Other / Campus Pathway',
];

export const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'ELECTRONICS',
    location: '',
    status: 'REPORTED',
    description: '',
    custodyLocation: '',
    distinguishingMarks: '',
    contactPhone: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await itemService.getItemById(id);
        const item = res.data;
        setFormData({
          title: item.title || '',
          category: item.category || 'ELECTRONICS',
          location: item.location || '',
          status: item.status || 'REPORTED',
          description: item.description || '',
          custodyLocation: item.custodyLocation || '',
          distinguishingMarks: item.distinguishingMarks || '',
          contactPhone: item.contactPhone || '',
          imageUrl: item.imageUrl || '',
        });
      } catch (err) {
        setError(err.message || 'Failed to load item for editing.');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
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
      await itemService.updateItem(id, formData);
      navigate(`/items/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update report.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSpinner text="Loading item data..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem', maxWidth: '780px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to={`/items/${id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--gray-600)',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Cancel & Return to Item
        </Link>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '1.5rem' }}>
          Edit Report
        </h1>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.9rem',
            }}
          >
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Item Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="ELECTRONICS">Electronics & Gadgets</option>
                <option value="ID_CARDS_DOCUMENTS">ID Cards & Official Docs</option>
                <option value="BOOKS_STATIONERY">Books & Lab Records</option>
                <option value="KEYS">Keys & Lockers</option>
                <option value="CLOTHING_ACCESSORIES">Accessories & Watches</option>
                <option value="BAGS_WALLETS">Bags, Wallets & Pouches</option>
                <option value="SPORTS_EQUIPMENT">Sports Equipment</option>
                <option value="OTHER">Other Belongings</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="REPORTED">REPORTED (Active)</option>
                <option value="CLAIM_PENDING">CLAIM_PENDING (Verification in progress)</option>
                <option value="RETURNED">RETURNED (Handover completed)</option>
                <option value="ARCHIVED">ARCHIVED (Closed)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Campus Location *
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="custodyLocation">
              Custody Location / Desk
            </label>
            <input
              id="custodyLocation"
              name="custodyLocation"
              type="text"
              className="form-input"
              value={formData.custodyLocation}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="distinguishingMarks">
              Distinguishing Marks (Confidential)
            </label>
            <textarea
              id="distinguishingMarks"
              name="distinguishingMarks"
              className="form-textarea"
              rows={2}
              value={formData.distinguishingMarks}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">
                Image URL
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                className="form-input"
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactPhone">
                Contact Phone
              </label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                className="form-input"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
            <Link to={`/items/${id}`} className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ minWidth: '150px' }}>
              <Save size={16} /> {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
