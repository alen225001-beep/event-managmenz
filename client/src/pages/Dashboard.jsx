import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Mail,
  Building,
  CreditCard,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import itemService from '../services/itemService';
import claimService from '../services/claimService';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

export const Dashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('reports'); // 'reports' | 'claims' | 'profile'

  const [myItems, setMyItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Profile edit state
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    department: user?.department || '',
    studentId: user?.studentId || '',
    phone: user?.phone || '',
  });
  const [profileMsg, setProfileMsg] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [itemsRes, claimsRes] = await Promise.all([
        itemService.getMyReports(),
        claimService.getMyClaims(),
      ]);
      setMyItems(itemsRes.data || []);
      setMyClaims(claimsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      setProfileMsg('Profile updated successfully!');
      setEditProfileMode(false);
      setTimeout(() => setProfileMsg(null), 3000);
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      {/* User Overview Header Banner */}
      <div
        className="card"
        style={{
          padding: '2rem',
          marginBottom: '2rem',
          background: 'linear-gradient(to right, #ffffff, #eff6ff)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
          className="md:flex-row md:items-center md:justify-between"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gray-900)' }}>
                  {user?.name}
                </h1>
                <span className="badge badge-category" style={{ fontSize: '0.725rem' }}>
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.35rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={15} style={{ color: 'var(--primary)' }} />
                  <span>{user?.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building size={15} style={{ color: 'var(--primary)' }} />
                  <span>{user?.department}</span>
                </div>
                {user?.studentId && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CreditCard size={15} style={{ color: 'var(--primary)' }} />
                    <span>ID: {user?.studentId}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/report" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> Report Item
            </Link>
            <button
              onClick={() => setEditProfileMode(!editProfileMode)}
              className="btn btn-secondary btn-sm"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Edit Drawer */}
        {editProfileMode && (
          <form
            onSubmit={handleProfileUpdate}
            style={{
              marginTop: '1.5rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--gray-200)',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.department}
                  onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Student / Staff ID</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.studentId}
                  onChange={(e) => setProfileForm({ ...profileForm, studentId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setEditProfileMode(false)}
                className="btn btn-secondary btn-sm"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Profile
              </button>
            </div>
          </form>
        )}

        {profileMsg && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.65rem 1rem',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            {profileMsg}
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '2px solid var(--gray-200)',
          marginBottom: '2rem',
        }}
      >
        <button
          onClick={() => setActiveTab('reports')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'reports' ? 'var(--primary)' : 'var(--gray-500)',
            borderBottom: activeTab === 'reports' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Package size={18} /> My Reported Items ({myItems.length})
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            color: activeTab === 'claims' ? 'var(--primary)' : 'var(--gray-500)',
            borderBottom: activeTab === 'claims' ? '3px solid var(--primary)' : '3px solid transparent',
            marginBottom: '-2px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <ShieldCheck size={18} /> My Verification Claims ({myClaims.length})
        </button>
      </div>

      {/* Tab 1: My Reported Items */}
      {activeTab === 'reports' && (
        <div>
          {loading ? (
            <LoadingSpinner text="Loading your reports..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchDashboardData} />
          ) : myItems.length === 0 ? (
            <EmptyState
              title="You haven't reported any items yet"
              message="If you lost something on campus or found an item in labs, canteen or classrooms, publish a report to connect with owners."
              actionText="Report an Item"
              actionLink="/report"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
              {myItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Submitted Claims */}
      {activeTab === 'claims' && (
        <div>
          {loading ? (
            <LoadingSpinner text="Loading your submitted claims..." />
          ) : error ? (
            <ErrorMessage message={error} onRetry={fetchDashboardData} />
          ) : myClaims.length === 0 ? (
            <EmptyState
              icon={ShieldCheck}
              title="No ownership claims submitted"
              message="When you spot an item in the Campus Directory that belongs to you, submit a verification claim with identifying marks."
              actionText="Browse Found Items"
              actionLink="/items?type=FOUND"
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myClaims.map((claim) => (
                <div
                  key={claim._id}
                  className="card"
                  style={{
                    padding: '1.5rem',
                    borderLeft: `5px solid ${
                      claim.status === 'APPROVED'
                        ? 'var(--success)'
                        : claim.status === 'REJECTED'
                        ? 'var(--danger)'
                        : 'var(--warning)'
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      marginBottom: '1rem',
                    }}
                    className="md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <span className="badge badge-category" style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }}>
                        {claim.item?.type || 'ITEM'} &bull; {claim.item?.category}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                        <Link to={`/items/${claim.item?._id}`} style={{ color: 'inherit' }}>
                          {claim.item?.title || 'Reported Item'} &rarr;
                        </Link>
                      </h3>
                      <div style={{ fontSize: '0.825rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
                        Found Location: {claim.item?.location} &bull; Custody: {claim.item?.custodyLocation || 'Security Desk'}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        className={`badge ${
                          claim.status === 'APPROVED'
                            ? 'badge-found'
                            : claim.status === 'REJECTED'
                            ? 'badge-lost'
                            : 'badge-pending'
                        }`}
                      >
                        {claim.status === 'APPROVED' && <CheckCircle2 size={13} />}
                        {claim.status === 'REJECTED' && <XCircle size={13} />}
                        {claim.status === 'PENDING' && <Clock size={13} />}
                        {claim.status}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.35rem' }}>
                        Submitted on {new Date(claim.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Claimant's Proof */}
                  <div style={{ backgroundColor: 'var(--gray-50)', padding: '0.85rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.775rem', fontWeight: 700, color: 'var(--gray-600)', marginBottom: '0.25rem' }}>
                      Your Ownership Proof Statement:
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-800)' }}>
                      "{claim.proofDescription}"
                    </p>
                  </div>

                  {/* Review Notes from Finder/Admin */}
                  {claim.reviewNotes && (
                    <div
                      style={{
                        backgroundColor: claim.status === 'APPROVED' ? 'var(--success-bg)' : 'var(--gray-100)',
                        color: claim.status === 'APPROVED' ? 'var(--success)' : 'var(--gray-700)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                      }}
                    >
                      <strong>Reviewer Feedback:</strong> {claim.reviewNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
