import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import itemService from '../services/itemService';
import ItemCard from '../components/ItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'ELECTRONICS', label: 'Electronics' },
  { id: 'ID_CARDS_DOCUMENTS', label: 'ID Cards & Docs' },
  { id: 'BOOKS_STATIONERY', label: 'Books & Records' },
  { id: 'KEYS', label: 'Keys' },
  { id: 'CLOTHING_ACCESSORIES', label: 'Accessories' },
  { id: 'BAGS_WALLETS', label: 'Bags & Wallets' },
  { id: 'SPORTS_EQUIPMENT', label: 'Sports Gear' },
  { id: 'OTHER', label: 'Other' },
];

export const ItemList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search parameters from URL or state
  const currentSearch = searchParams.get('search') || '';
  const currentType = searchParams.get('type') || 'ALL';
  const currentCategory = searchParams.get('category') || 'ALL';
  const currentStatus = searchParams.get('status') || 'ALL';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local form state for search input
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Fetch items whenever searchParams change
  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        limit: 9,
        search: currentSearch,
        type: currentType !== 'ALL' ? currentType : undefined,
        category: currentCategory !== 'ALL' ? currentCategory : undefined,
        status: currentStatus !== 'ALL' ? currentStatus : undefined,
      };

      const res = await itemService.getItems(params);
      setItems(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.pages || 1);
    } catch (err) {
      setError(err.message || 'Failed to load items. Please verify your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [searchParams]);

  // Update query params helper
  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (!val || val === 'ALL') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    // Reset to page 1 on filter changes unless changing page directly
    if (!('page' in updates)) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParams({ search: searchInput.trim() });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters =
    currentSearch ||
    currentType !== 'ALL' ||
    currentCategory !== 'ALL' ||
    currentStatus !== 'ALL';

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 4rem' }}>
      {/* Page Title & Stats */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.5rem' }}>
          Campus Lost & Found Directory
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>
          Search and browse verified reports across all departments and blocks of Sahrdaya College.
        </p>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div
        className="card"
        style={{ padding: '1.25rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}
      >
        {/* Row 1: Type Tabs & Search Input */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
          className="md:flex-row md:items-center md:justify-between"
        >
          {/* Type Switcher Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--gray-100)', padding: '0.35rem', borderRadius: 'var(--radius-md)' }}>
            <button
              type="button"
              onClick={() => updateParams({ type: 'ALL' })}
              className={`btn btn-sm ${currentType === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              All Items
            </button>
            <button
              type="button"
              onClick={() => updateParams({ type: 'LOST' })}
              className={`btn btn-sm ${currentType === 'LOST' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              Lost Items
            </button>
            <button
              type="button"
              onClick={() => updateParams({ type: 'FOUND' })}
              className={`btn btn-sm ${currentType === 'FOUND' ? 'btn-success' : 'btn-secondary'}`}
              style={{ border: 'none' }}
            >
              Found Items
            </button>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '420px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Search keywords, items, locations..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </form>
        </div>

        {/* Row 2: Category Selector Bar */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParams({ category: cat.id })}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: currentCategory === cat.id ? 700 : 500,
                backgroundColor: currentCategory === cat.id ? 'var(--primary)' : 'var(--gray-100)',
                color: currentCategory === cat.id ? '#ffffff' : 'var(--gray-700)',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Active Filters Clear Bar */}
        {hasActiveFilters && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--gray-100)',
              fontSize: '0.825rem',
              color: 'var(--gray-600)',
            }}
          >
            <span>Showing filtered results ({total} items found)</span>
            <button
              onClick={clearAllFilters}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <X size={14} /> Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Content Area Handling 4 States (Loading, Error, Empty, Success) */}
      {loading ? (
        <LoadingSpinner text="Searching campus database..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchItems} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No campus items match your criteria"
          message="Try adjusting your search keywords, switching categories, or view both Lost and Found listings."
          actionText="Clear Filters"
          onAction={clearAllFilters}
        />
      ) : (
        <>
          {/* Success Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '1.5rem', marginBottom: '2.5rem' }}>
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: '2rem',
              }}
            >
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage <= 1}
                onClick={() => updateParams({ page: currentPage - 1 })}
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)', fontWeight: 600 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={currentPage >= totalPages}
                onClick={() => updateParams({ page: currentPage + 1 })}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ItemList;
