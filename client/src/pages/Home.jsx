import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldAlert, CheckCircle2, ArrowRight, HelpCircle, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import itemService from '../services/itemService';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';

export const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [recentItems, setRecentItems] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    totalLost: 0,
    totalFound: 0,
    totalReturned: 0,
    returnRate: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, itemsRes] = await Promise.all([
          itemService.getStats(),
          itemService.getItems({ limit: 6, sort: '-createdAt' }),
        ]);
        if (statsRes.stats) setStats(statsRes.stats);
        if (itemsRes.data) setRecentItems(itemsRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0369a1 100%)',
          color: '#ffffff',
          padding: '4.5rem 0 5rem',
          position: 'relative',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '850px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.825rem',
              fontWeight: 600,
              marginBottom: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <Sparkles size={16} style={{ color: '#fef08a' }} />
            <span>Sahrdaya College Campus Lost & Found System</span>
          </div>

          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Lost Something on Campus? <br />
            Find and Claim It Safely.
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: '#cbd5e1',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
            }}
          >
            A dedicated, verified digital repository for students and faculty of Sahrdaya College of Engineering & Technology. Report lost items, search recovered belongings, and verify ownership with security staff.
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-full)',
              padding: '0.4rem 0.5rem 0.4rem 1.25rem',
              boxShadow: 'var(--shadow-xl)',
              maxWidth: '620px',
              margin: '0 auto 2.5rem',
            }}
          >
            <Search size={20} style={{ color: 'var(--gray-400)', marginRight: '0.5rem' }} />
            <input
              type="text"
              placeholder="Search by item name, ID number, Casio calculator, keys, library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                color: 'var(--gray-800)',
                fontFamily: 'inherit',
              }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ borderRadius: 'var(--radius-full)' }}>
              Search Campus
            </button>
          </form>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              to="/report?type=LOST"
              className="btn btn-danger btn-lg"
              style={{ backgroundColor: '#e11d48', borderColor: '#e11d48' }}
            >
              <HelpCircle size={18} /> I Lost An Item
            </Link>
            <Link
              to="/report?type=FOUND"
              className="btn btn-success btn-lg"
              style={{ backgroundColor: '#059669', borderColor: '#059669' }}
            >
              <ShieldCheck size={18} /> I Found An Item
            </Link>
          </div>
        </div>
      </section>

      {/* Campus Statistics Banner */}
      <section style={{ transform: 'translateY(-2rem)', marginBottom: '1rem' }}>
        <div className="container">
          <div
            className="grid grid-cols-2 md:grid-cols-4"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--gray-200)',
              padding: '1.5rem',
              gap: '1.5rem',
            }}
          >
            <div style={{ textAlign: 'center', borderRight: '1px solid var(--gray-100)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                {stats.totalReports}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                Total Items Logged
              </div>
            </div>

            <div style={{ textAlign: 'center', borderRight: '1px solid var(--gray-100)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
                {stats.totalFound}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                Found Belongings
              </div>
            </div>

            <div style={{ textAlign: 'center', borderRight: '1px solid var(--gray-100)' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#e11d48' }}>
                {stats.totalLost}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                Lost Reports
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0d9488' }}>
                {stats.returnRate}%
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                Recovery & Return Rate
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section style={{ padding: '2.5rem 0 4rem' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
                Live Campus Feed
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)' }}>
                Recent Lost & Found Reports
              </h2>
              <p style={{ color: 'var(--gray-500)', fontSize: '0.925rem' }}>
                Latest items reported by students, faculty, and campus security staff.
              </p>
            </div>
            <Link
              to="/items"
              className="btn btn-outline btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              Browse All Listings <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading recent campus reports..." />
          ) : recentItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)' }}>
              No campus items have been reported yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem' }}>
              {recentItems.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works / 3-Step Verification Section */}
      <section
        style={{
          backgroundColor: '#ffffff',
          padding: '4rem 0',
          borderTop: '1px solid var(--gray-200)',
          borderBottom: '1px solid var(--gray-200)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <span className="badge badge-category" style={{ marginBottom: '0.5rem' }}>
              Standard Operating Procedure
            </span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.75rem' }}>
              How Sahrdaya Campus Lost & Found Works
            </h2>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem' }}>
              Preventing fraudulent claims through our two-tier ownership verification workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: '2rem' }}>
            {/* Step 1 */}
            <div
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Report an Item
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
                Report lost items or log found belongings with category, exact campus spot (e.g. Decennial Block, Canteen), and date.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--warning-bg)',
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Verify Ownership Proof
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
                Claimants describe unique distinguishing marks only the genuine owner knows (lockscreen photo, serial number, stickers).
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card"
              style={{
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Secure Campus Handover
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>
                Once verified, collect your belonging from the Main Campus Security Desk or the finder, and item is marked as Returned.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
