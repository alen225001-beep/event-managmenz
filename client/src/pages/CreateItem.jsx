import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { HelpCircle, ShieldCheck, ArrowLeft, Upload, MapPin, Calendar, AlertCircle } from 'lucide-react';
import itemService from '../services/itemService';
import { useAuth } from '../context/AuthContext';

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

export const CreateItem = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const initialType = searchParams.get('type') === 'FOUND' ? 'FOUND' : 'LOST';

  const [formData, setFormData] = useState({
    title: '',
    type: initialType,
    category: 'ELECTRONICS',
    location: '',
    customLocation: '',
    dateLostOrFound: new Date().toISOString().split('T')[0],
    description: '',
    custodyLocation: initialType === 'FOUND' ? 'Main Security Gate Desk' : '',
    distinguishingMarks: '',
    contactPhone: user?.phone || '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Auto adjust custody default when type switches
      ...(name === 'type' && value === 'FOUND' && !prev.custodyLocation
        ? { custodyLocation: 'Main Security Gate Desk' }
        : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const finalLocation =
      formData.location === 'Other / Campus Pathway' || !formData.location
        ? formData.customLocation.trim()
        : formData.location;

    if (!formData.title.trim()) {
      setError('Please provide an item title.');
      return;
    }

    if (!finalLocation) {
      setError('Please specify the campus location where the item was lost or found.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please provide a description of the item.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        type: formData.type,
        category: formData.category,
        location: finalLocation,
        dateLostOrFound: formData.dateLostOrFound,
        description: formData.description.trim(),
        custodyLocation: formData.custodyLocation.trim(),
        distinguishingMarks: formData.distinguishingMarks.trim(),
        contactPhone: formData.contactPhone.trim(),
        imageUrl: formData.imageUrl.trim(),
      };

      const res = await itemService.createItem(payload);
      navigate(`/items/${res.data._id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit item report. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const isLost = formData.type === 'LOST';

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem', maxWidth: '780px' }}>
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
          <ArrowLeft size={16} /> Cancel & Return
        </Link>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
            {isLost ? 'Report a Lost Item' : 'Log a Found Item'}
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.925rem' }}>
            Provide complete details to help Sahrdaya campus security and fellow students identify and return belongings.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              border: '1px solid var(--danger-border)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.75rem',
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
          {/* Item Type Selector */}
          <div className="form-group">
            <label className="form-label">Report Category *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'LOST' }))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: isLost ? '2px solid #e11d48' : '1px solid var(--gray-300)',
                  backgroundColor: isLost ? '#fef2f2' : '#ffffff',
                  color: isLost ? '#e11d48' : 'var(--gray-600)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <HelpCircle size={18} /> I Lost An Item
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type: 'FOUND' }))}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: !isLost ? '2px solid #059669' : '1px solid var(--gray-300)',
                  backgroundColor: !isLost ? '#ecfdf5' : '#ffffff',
                  color: !isLost ? '#059669' : 'var(--gray-600)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <ShieldCheck size={18} /> I Found An Item
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Item Title / Name *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="form-input"
              placeholder="e.g. Casio fx-991EX Calculator, Sahrdaya College ID Card, Honda Bike Key"
              value={formData.title}
              onChange={handleChange}
              maxLength={120}
              required
            />
          </div>

          {/* Category & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="category">
                Category *
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
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
              <label className="form-label" htmlFor="dateLostOrFound">
                Date {isLost ? 'Lost' : 'Found'} *
              </label>
              <input
                id="dateLostOrFound"
                name="dateLostOrFound"
                type="date"
                className="form-input"
                value={formData.dateLostOrFound}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Campus Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Campus Location Spot *
            </label>
            <select
              id="location"
              name="location"
              className="form-select"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Sahrdaya Campus Location --</option>
              {SAHRDAYA_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Custom location if other */}
          {(formData.location === 'Other / Campus Pathway' || !formData.location) && (
            <div className="form-group">
              <label className="form-label" htmlFor="customLocation">
                Specific Location Details *
              </label>
              <input
                id="customLocation"
                name="customLocation"
                type="text"
                className="form-input"
                placeholder="e.g. Near Basketball Court water cooler, Mechanical Workshop entrance..."
                value={formData.customLocation}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Custody Location (Found item only) */}
          {!isLost && (
            <div className="form-group">
              <label className="form-label" htmlFor="custodyLocation">
                Where is the item currently deposited? *
              </label>
              <input
                id="custodyLocation"
                name="custodyLocation"
                type="text"
                className="form-input"
                placeholder="e.g. Main Security Gate Desk (Token #12), Central Library Desk, or With Me"
                value={formData.custodyLocation}
                onChange={handleChange}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                Items left with campus security desk have the highest retrieval rate.
              </span>
            </div>
          )}

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-textarea"
              rows={4}
              placeholder="Color, brand, general physical description, time of day, approximate period..."
              value={formData.description}
              onChange={handleChange}
              maxLength={1500}
              required
            />
          </div>

          {/* Distinguishing Marks (Confidential) */}
          <div className="form-group">
            <label className="form-label" htmlFor="distinguishingMarks">
              Distinguishing Marks / Secret Identifying Features (Optional)
            </label>
            <textarea
              id="distinguishingMarks"
              name="distinguishingMarks"
              className="form-textarea"
              rows={2}
              placeholder="e.g. Specific sticker, scratch at corner, lock screen wallpaper, initials inside book. (Will be used to verify claimant proof)"
              value={formData.distinguishingMarks}
              onChange={handleChange}
            />
          </div>

          {/* Image URL & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="imageUrl">
                Photo Image URL (Optional)
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                className="form-input"
                placeholder="https://images.unsplash.com/..."
                value={formData.imageUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contactPhone">
                Contact Phone for Handover
              </label>
              <input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                className="form-input"
                placeholder="+91 98470 XXXXX"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <Link to="/items" className="btn btn-secondary">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className={`btn ${isLost ? 'btn-danger' : 'btn-success'}`}
              style={{ minWidth: '180px' }}
            >
              {loading ? 'Submitting Report...' : isLost ? 'Publish Lost Report' : 'Log Found Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;
