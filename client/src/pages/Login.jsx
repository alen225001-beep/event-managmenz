import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Lock, Mail, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-100">
            <Calendar className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Sign in to Sahrdaya EventHub
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Access your student passes and registered campus workshops
          </p>
        </div>

        {/* Demo Accounts Box for Viva Evaluators */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>1-Click Demo Accounts (Viva & Evaluation)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('alen225001@sahrdaya.ac.in', 'password123')}
              className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 text-indigo-800 rounded-xl text-[11px] font-bold border border-indigo-200 transition shadow-xs text-center"
            >
              Alen (Organizer)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@sahrdaya.ac.in', 'password123')}
              className="px-2.5 py-1.5 bg-white hover:bg-purple-50 text-purple-800 rounded-xl text-[11px] font-bold border border-purple-200 transition shadow-xs text-center"
            >
              Admin Dean
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('anjali@sahrdaya.ac.in', 'password123')}
              className="px-2.5 py-1.5 bg-white hover:bg-sky-50 text-sky-800 rounded-xl text-[11px] font-bold border border-sky-200 transition shadow-xs text-center"
            >
              Student (Anjali)
            </button>
          </div>
        </div>

        {/* Login Form */}
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
                College Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alen225001@sahrdaya.ac.in"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-indigo-100 disabled:opacity-50"
            >
              {loading ? 'Verifying Credentials...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center text-xs text-gray-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-800">
              Create Student Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
