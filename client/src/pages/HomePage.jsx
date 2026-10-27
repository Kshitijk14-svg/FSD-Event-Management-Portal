import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchEvents } from '../api/events';
import EventFilters from '../components/EventFilters';
import EventGrid from '../components/EventGrid';
import Pagination from '../components/Pagination';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle('Browse Events');
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse filters from URL query string (Requirement 8)
  const currentFilters = useMemo(() => {
    return {
      q: searchParams.get('q') || '',
      category: searchParams.get('category') || 'All',
      from: searchParams.get('from') || '',
      to: searchParams.get('to') || '',
      sort: searchParams.get('sort') || 'date',
      page: parseInt(searchParams.get('page') || '1', 10),
      limit: parseInt(searchParams.get('limit') || '6', 10),
    };
  }, [searchParams]);

  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMockMode, setIsMockMode] = useState(false);

  // Fetch events when URL search params change
  useEffect(() => {
    let isMounted = true;

    async function executeFetch() {
      try {
        const result = await fetchEvents(currentFilters);
        if (isMounted) {
          setEvents(result.data || []);
          setPagination({
            page: result.page || 1,
            pages: result.pages || 1,
            total: result.total || 0,
          });
          setIsMockMode(Boolean(result._isMock));
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch events');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    executeFetch();

    return () => {
      isMounted = false;
    };
  }, [currentFilters]);

  // Synchronize new filter changes to URL query string
  const handleFilterChange = useCallback(
    (newValues) => {
      setLoading(true);
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(newValues).forEach(([key, val]) => {
            if (val === undefined || val === null || val === '' || val === 'All') {
              next.delete(key);
            } else {
              next.set(key, String(val));
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  // Clear all filters back to defaults
  const handleResetFilters = useCallback(() => {
    setLoading(true);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // Pagination page change handler
  const handlePageChange = useCallback(
    (newPage) => {
      handleFilterChange({ page: newPage });
      window.scrollTo({ top: 320, behavior: 'smooth' });
    },
    [handleFilterChange]
  );

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchEvents(currentFilters)
      .then((result) => {
        setEvents(result.data || []);
        setPagination({
          page: result.page || 1,
          pages: result.pages || 1,
          total: result.total || 0,
        });
        setIsMockMode(Boolean(result._isMock));
      })
      .catch((err) => setError(err.message || 'Failed to fetch events'))
      .finally(() => setLoading(false));
  }, [currentFilters]);

  return (
    <div className="container page-section">
      {/* Hero Section */}
      <section className="hero-banner">
        <h1 className="hero-heading">
          Discover, Connect & Attend <span>Campus Events</span>
        </h1>
        <p className="hero-lead">
          The central hub for college hackathons, technical workshops, cultural nights, and guest lectures.
        </p>
      </section>

      {/* Notice if Backend is Offline & Mock Adapter is Serving Data */}
      {isMockMode && (
        <div className="placeholder-note" style={{ marginBottom: 'var(--space-6)' }}>
          <span className="placeholder-note-icon">ℹ️</span>
          <div>
            <strong>Offline Testing Mode Active</strong>
            <p style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>
              Backend at <code>http://localhost:5000/api</code> is currently offline. Events and filters are being simulated via the separated <code>mockEventsAdapter</code>.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <EventFilters
        filters={currentFilters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Events Results Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h2 className="page-title">
            {currentFilters.category !== 'All' ? `${currentFilters.category} Events` : 'Upcoming Events'}
          </h2>
          <p className="page-subtitle">
            {loading
              ? 'Loading events...'
              : `Showing ${events.length} of ${pagination.total} events`}
          </p>
        </div>
      </div>

      {/* Event Cards Grid */}
      <EventGrid
        events={events}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        onResetFilters={handleResetFilters}
      />

      {/* Pagination Controls */}
      {!loading && !error && events.length > 0 && (
        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
