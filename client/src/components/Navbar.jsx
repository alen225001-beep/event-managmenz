import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  Ticket,
  PlusCircle,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isOrganizer, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & College Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-gray-900 tracking-tight text-lg">
                  Sahrdaya <span className="text-indigo-600">EventHub</span>
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-indigo-200">
                  SCET
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium leading-none">
                Campus Events & Digital Passes
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                isActive('/')
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Explore Events
            </Link>

            {user && (
              <Link
                to="/my-passes"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/my-passes')
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Ticket className="w-4 h-4 text-indigo-500" />
                My Passes
              </Link>
            )}

            {isOrganizer && (
              <>
                <Link
                  to="/organizer/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive('/organizer/dashboard')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-amber-500" />
                  Organizer Hub
                </Link>

                <Link
                  to="/events/create"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                    isActive('/events/create')
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-emerald-500" />
                  Post Event
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition ${
                  isActive('/admin/dashboard')
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Shield className="w-4 h-4 text-purple-600" />
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop Right Side: Auth buttons / User Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span className="text-sm font-bold text-gray-900 leading-tight">
                      {user.name}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === 'organizer'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 block leading-tight">
                    {user.clubName || user.department}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {user && (
            <div className="p-3 bg-gray-50 rounded-xl mb-3 border border-gray-100">
              <div className="font-bold text-gray-900 text-sm">{user.name}</div>
              <div className="text-xs text-gray-500">{user.email}</div>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 uppercase">
                {user.role}
              </span>
            </div>
          )}

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            Explore Events
          </Link>

          {user && (
            <Link
              to="/my-passes"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Ticket className="w-4 h-4 text-indigo-600" />
              My Digital Passes
            </Link>
          )}

          {isOrganizer && (
            <>
              <Link
                to="/organizer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-500" />
                Organizer Hub
              </Link>
              <Link
                to="/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                Publish Event
              </Link>
            </>
          )}

          {isAdmin && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              Admin Console
            </Link>
          )}

          <div className="pt-3 border-t border-gray-100">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center p-2.5 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center p-2.5 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
