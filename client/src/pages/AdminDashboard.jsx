import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Calendar,
  Ticket,
  CheckCircle,
  BarChart3,
  TrendingUp,
  UserCheck,
  Search,
} from 'lucide-react';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState([]);
  const [clubStats, setClubStats] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchUser, setSearchUser] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getAllUsers(),
      ]);
      setStats(statsRes.stats);
      setCategoryStats(statsRes.categoryStats || []);
      setClubStats(statsRes.clubStats || []);
      setUsers(usersRes.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load college admin analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      await adminService.updateUserStatus(userId, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchUser.trim()) return true;
    const q = searchUser.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.department && u.department.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <LoadingSpinner message="Aggregating campus event analytics..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Sahrdaya EventHub Administration
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            System oversight, attendance analytics, student registrations, and club coordinator roles.
          </p>
        </div>

        {error && <ErrorMessage message={error} onRetry={fetchAdminData} />}

        {/* Analytics Counters */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase mb-1">
                <Calendar className="w-4 h-4" />
                Total Events
              </div>
              <div className="text-3xl font-black text-gray-900">{stats.totalEvents}</div>
              <div className="text-[11px] text-gray-400 mt-1">
                {stats.upcomingEvents} upcoming on campus
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-sky-600 text-xs font-bold uppercase mb-1">
                <Ticket className="w-4 h-4" />
                Passes Issued
              </div>
              <div className="text-3xl font-black text-gray-900">{stats.totalRegistrations}</div>
              <div className="text-[11px] text-gray-400 mt-1">Free admission reserved</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase mb-1">
                <CheckCircle className="w-4 h-4" />
                Checked-In
              </div>
              <div className="text-3xl font-black text-emerald-700">{stats.checkedInCount}</div>
              <div className="text-[11px] text-gray-400 mt-1">
                {stats.checkInRate}% attendance verified
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase mb-1">
                <Users className="w-4 h-4" />
                Campus Users
              </div>
              <div className="text-3xl font-black text-purple-900">
                {stats.totalStudents + stats.totalOrganizers}
              </div>
              <div className="text-[11px] text-gray-400 mt-1">
                {stats.totalOrganizers} student coordinators
              </div>
            </div>
          </div>
        )}

        {/* Charts & Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Event Category Distribution
            </h3>
            <div className="space-y-3">
              {categoryStats.map((c) => (
                <div key={c._id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700">{c._id}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{c.totalSeats} seats</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                      {c.count} {c.count === 1 ? 'event' : 'events'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hosting Student Clubs */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <h3 className="font-extrabold text-gray-900 text-base mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Top Hosting Student Chapters
            </h3>
            <div className="space-y-3">
              {clubStats.map((cl) => (
                <div key={cl._id} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700 line-clamp-1">{cl._id}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">{cl.count} events</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      {cl.attendees} attendees
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* College User Management Table */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-gray-900">College User Directory</h3>
              <p className="text-xs text-gray-500">
                Manage roles and coordinator permissions for Sahrdaya students.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search user name or email..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">Name & Email</th>
                  <th className="py-3.5 px-6">Department</th>
                  <th className="py-3.5 px-6">Role</th>
                  <th className="py-3.5 px-6 text-right">Change Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/80 transition">
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {u.name}
                      <span className="block text-[11px] font-normal text-gray-400">{u.email}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{u.department}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'organizer'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        disabled={updatingUserId === u._id}
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="student">Student</option>
                        <option value="organizer">Organizer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
