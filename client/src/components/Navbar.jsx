import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, PlusCircle, Search, LayoutDashboard, LogOut, LogIn, Menu, X, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--gray-200)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4.25rem' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--gray-900)', lineHeight: 1.1 }}>
              Campus Lost & Found
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: 600 }}>
              Sahrdaya College of Engineering & Technology
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="md:flex">
          <Link to="/" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-700)' }}>
            Home
          </Link>
          <Link to="/items" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Search size={16} /> Browse Items
          </Link>
          <Link to="/report" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <PlusCircle size={16} /> Report Item
          </Link>

          {user && (
            <Link to="/dashboard" style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--gray-700)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <LayoutDashboard size={16} /> Dashboard
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="badge"
              style={{
                backgroundColor: 'var(--warning-bg)',
                color: 'var(--warning)',
                border: '1px solid var(--warning-border)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
              }}
            >
              <ShieldCheck size={14} /> Admin Console
            </Link>
          )}
        </nav>

        {/* Auth Actions (Desktop) */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="md:flex">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gray-900)' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                  {user.role === 'admin' ? 'Administrator' : user.role === 'security_staff' ? 'Campus Security' : 'Student'}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out of account"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} /> Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: 'var(--gray-700)',
            cursor: 'pointer',
          }}
          className="md:none"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderTop: '1px solid var(--gray-200)',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--gray-800)', padding: '0.5rem 0' }}
          >
            Home
          </Link>
          <Link
            to="/items"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--gray-800)', padding: '0.5rem 0' }}
          >
            Browse Campus Items
          </Link>
          <Link
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontWeight: 600, color: 'var(--primary)', padding: '0.5rem 0' }}
          >
            + Report Lost or Found Item
          </Link>
          {user && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, color: 'var(--gray-800)', padding: '0.5rem 0' }}
            >
              My Dashboard
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontWeight: 600, color: 'var(--warning)', padding: '0.5rem 0' }}
            >
              Admin Console
            </Link>
          )}

          <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1rem' }}>
            {user ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{user.email}</div>
                </div>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
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
