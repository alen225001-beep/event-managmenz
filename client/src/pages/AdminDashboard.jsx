import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  RotateCcw,
} from 'lucide-react';
import adminService from '../services/adminService';
import claimService from '../services/claimService';
import itemService from '../services/itemService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'claims' | 'items' | 'users'
  const [overview, setOverview] = useState(null);
  const [allClaims, setAllClaims] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [overviewRes, claimsRes, itemsRes, usersRes] = await Promise.all([
        adminService.getOverview(),
        adminService.getAllClaims(),
        itemService.getItems({ limit: 50, sort: '-createdAt' }),
        adminService.getUsers({ limit: 50 }),
      ]);

      setOverview(overviewRes.data);
      setAllClaims(claimsRes.data || []);
      setAllItems(itemsRes.data || []);
      setAllUsers(usersRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load administrator records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleClaimStatus = async (claimId, newStatus) => {
    const notes = prompt(
      `Enter admin remarks for marking this claim as ${newStatus}:`,
      newStatus === 'APPROVED' ? 'Proof verified by campus security. Handover complete.' : 'Claim rejected by admin.'
    );
    if (notes === null) return;

    try {
      await claimService.updateClaimStatus(claimId, newStatus, notes);
      setActionSuccess(`Claim ${newStatus.toLowerCase()} successfully.`);
      fetchAdminData();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    }
  };

  const handleItemStatusChange = async (itemId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change item status to ${newStatus}?`)) return;

    try {
      await itemService.updateItem(itemId, { status: newStatus });
      setActionSuccess(`Item status updated to ${newStatus}.`);
      fetchAdminData();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    }
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, { role: newRole });
      setActionSuccess(`User role changed to ${newRole}.`);
      fetchAdminData();
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err) {
      alert(`Role change failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSpinner text="Loading campus security administration records..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <ErrorMessage message={error} onRetry={fetchAdminData} />
      </div>
    );
  }

  const stats = overview?.stats || {};

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <ShieldCheck size={24} style={{ color: 'var(--primary)' }} />
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--gray-900)' }}>
            Campus Administration & Security Console
          </h1>
        </div>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.925rem' }}>
          Sahrdaya College of Engineering & Technology &bull; System-wide oversight, claims disputes, and custody management.
        </p>
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

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
            Registered Users
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.25rem' }}>
            {stats.totalUsers || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
            Total Items Logged
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-800)', marginTop: '0.25rem' }}>
            {stats.totalItems || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
            Pending Verification Claims
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--warning)', marginTop: '0.25rem' }}>
            {stats.totalPendingClaims || 0}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>
            Recovery & Return Rate
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--success)', marginTop: '0.25rem' }}>
            {stats.resolutionRate || 0}%
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '2px solid var(--gray-200)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('overview')}
          className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Overview & Insights
        </button>
        <button
          onClick={() => setActiveTab('claims')}
          className={`btn btn-sm ${activeTab === 'claims' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Claims ({allClaims.length})
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`btn btn-sm ${activeTab === 'items' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Items ({allItems.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`btn btn-sm ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Users ({allUsers.length})
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem' }}>
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1rem' }}>
              Category Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(overview?.categoryBreakdown || []).map((cat) => (
                <div
                  key={cat._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    backgroundColor: 'var(--gray-50)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{cat._id}</span>
                  <span className="badge badge-category">{cat.count} items</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: '1rem' }}>
              Recent Pending Claims Needing Attention
            </h3>
            {overview?.recentClaims?.length === 0 ? (
              <div style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>
                No pending claims at this moment.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(overview?.recentClaims || []).map((claim) => (
                  <div
                    key={claim._id}
                    style={{
                      border: '1px solid var(--gray-200)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem',
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                      {claim.claimant?.name} claiming: "{claim.item?.title}"
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
                      Location: {claim.item?.location}
                    </div>
                    <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleClaimStatus(claim._id, 'APPROVED')}
                        className="btn btn-success btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleClaimStatus(claim._id, 'REJECTED')}
                        className="btn btn-danger btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: All Claims */}
      {activeTab === 'claims' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {allClaims.map((claim) => (
            <div key={claim._id} className="card" style={{ padding: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
                className="md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>
                    Item: <Link to={`/items/${claim.item?._id}`}>{claim.item?.title}</Link> ({claim.item?.type})
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--gray-500)' }}>
                    Claimant: <strong>{claim.claimant?.name}</strong> ({claim.claimant?.email}) &bull; Phone: {claim.contactPhone || 'N/A'}
                  </div>
                </div>
                <div>
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
              </div>

              <div style={{ backgroundColor: 'var(--gray-50)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray-500)' }}>
                  Proof Statement:
                </span>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-800)', marginTop: '0.2rem' }}>
                  "{claim.proofDescription}"
                </p>
              </div>

              {claim.reviewNotes && (
                <div style={{ fontSize: '0.825rem', color: 'var(--gray-600)', marginBottom: '0.75rem' }}>
                  <strong>Review Notes:</strong> {claim.reviewNotes}
                </div>
              )}

              {claim.status === 'PENDING' && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleClaimStatus(claim._id, 'APPROVED')}
                    className="btn btn-success btn-sm"
                  >
                    <CheckCircle size={14} /> Approve Handover
                  </button>
                  <button
                    onClick={() => handleClaimStatus(claim._id, 'REJECTED')}
                    className="btn btn-danger btn-sm"
                  >
                    <XCircle size={14} /> Reject Claim
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: All Items */}
      {activeTab === 'items' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--gray-100)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '0.85rem' }}>Item</th>
                <th style={{ padding: '0.85rem' }}>Type</th>
                <th style={{ padding: '0.85rem' }}>Location</th>
                <th style={{ padding: '0.85rem' }}>Status</th>
                <th style={{ padding: '0.85rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allItems.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '0.85rem' }}>
                    <Link to={`/items/${item._id}`} style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      {item.title}
                    </Link>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                      Reported by {item.reportedBy?.name || 'User'}
                    </div>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <span className={`badge ${item.type === 'LOST' ? 'badge-lost' : 'badge-found'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>{item.location}</td>
                  <td style={{ padding: '0.85rem' }}>
                    <span className="badge badge-category">{item.status}</span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      {item.status !== 'RETURNED' && (
                        <button
                          onClick={() => handleItemStatusChange(item._id, 'RETURNED')}
                          className="btn btn-sm btn-success"
                          style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
                        >
                          Mark Returned
                        </button>
                      )}
                      <Link
                        to={`/items/${item._id}/edit`}
                        className="btn btn-sm btn-secondary"
                        style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem' }}
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--gray-100)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '0.85rem' }}>User</th>
                <th style={{ padding: '0.85rem' }}>Department</th>
                <th style={{ padding: '0.85rem' }}>Role</th>
                <th style={{ padding: '0.85rem' }}>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                  <td style={{ padding: '0.85rem' }}>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '0.85rem' }}>{u.department}</td>
                  <td style={{ padding: '0.85rem' }}>
                    <span className="badge badge-category">{u.role}</span>
                  </td>
                  <td style={{ padding: '0.85rem' }}>
                    <select
                      className="form-select"
                      style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', width: 'auto' }}
                      value={u.role}
                      onChange={(e) => handleUserRoleChange(u._id, e.target.value)}
                    >
                      <option value="student">student</option>
                      <option value="faculty">faculty</option>
                      <option value="security_staff">security_staff</option>
                      <option value="admin">admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
