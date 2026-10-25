import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Lock, Mail, User, Phone, BookOpen, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Biomedical Engineering',
  'Electronics & Communication Engineering',
  'Biotechnology',
  'Civil Engineering',
  'Electrical & Electronics Engineering',
  'Artificial Intelligence & Data Science',
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science & Engineering',
    role: 'student',
    clubName: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.role === 'organizer' && !formData.clubName.trim()) {
      setError('Please provide the name of your student club or chapter.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        department: formData.department,
        role: formData.role,
        clubName: formData.clubName,
        phone: formData.phone || '+91 94000 00000',
      });
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-100">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Create Sahrdaya Account
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Register to book admission passes and join campus tech fests
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alen"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                College Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alen225001@sahrdaya.ac.in"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Academic Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Account Purpose / Role *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: 'student' }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    formData.role === 'student'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  Student (Attendee)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, role: 'organizer' }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                    formData.role === 'organizer'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  Club Organizer
                </button>
              </div>
            </div>

            {formData.role === 'organizer' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Student Club / Chapter Name *
                </label>
                <input
                  type="text"
                  name="clubName"
                  value={formData.clubName}
                  onChange={handleChange}
                  placeholder="e.g. IEEE Sahrdaya SB / IEDC / CSI"
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Confirm *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••"
                  required
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-indigo-100 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-800">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
