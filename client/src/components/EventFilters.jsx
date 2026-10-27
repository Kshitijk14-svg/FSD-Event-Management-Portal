import React, { useState, useEffect } from 'react';
import './EventFilters.css';

const CATEGORIES = [
  'All',
  'Technology',
  'Cultural',
  'Workshop',
  'Sports',
  'Academic',
];

const SORT_OPTIONS = [
  { value: 'date', label: '📅 Date: Earliest First' },
  { value: '-date', label: '📅 Date: Latest First' },
  { value: 'newest', label: '✨ Recently Published' },
];

/**
 * Reusable EventFilters Component
 * Provides debounced search keyword input, category, date range, and sorting.
 */
export default function EventFilters({
  filters = {},
  onFilterChange,
  onResetFilters,
}) {
  const [searchInputValue, setSearchInputValue] = useState(filters.q || '');
  const [prevQ, setPrevQ] = useState(filters.q || '');

  // Synchronize during render when filters.q changes externally (official React pattern)
  if (filters.q !== prevQ) {
    setPrevQ(filters.q || '');
    setSearchInputValue(filters.q || '');
  }

  // Debounce search input to avoid issuing API calls on every single keystroke (Requirement 4)
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentParam = filters.q || '';
      const trimmed = searchInputValue.trim();
      if (trimmed !== currentParam) {
        onFilterChange({ q: trimmed, page: 1 });
      }
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInputValue, filters.q, onFilterChange]);

  const hasActiveFilters = Boolean(
    (filters.q && filters.q.trim()) ||
    (filters.category && filters.category !== 'All') ||
    filters.from ||
    filters.to ||
    (filters.sort && filters.sort !== 'date')
  );

  return (
    <div className="event-filters-card">
      {/* Top Search Input Row */}
      <div className="filters-top-row">
        <div className="filter-search-box">
          <label htmlFor="filter-search-input" className="sr-only">
            Search events
          </label>
          <span className="filter-search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            id="filter-search-input"
            type="text"
            className="filter-search-input"
            placeholder="Search events by title, keyword, or venue..."
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            aria-label="Search events"
          />
          {searchInputValue && (
            <button
              type="button"
              className="filter-search-clear"
              onClick={() => {
                setSearchInputValue('');
                onFilterChange({ q: '', page: 1 });
              }}
              title="Clear search query"
              aria-label="Clear search query"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Bottom Filter Controls Row */}
      <div className="filters-bottom-row">
        {/* Category Filter */}
        <div className="filter-control-group">
          <label className="filter-control-label" htmlFor="filter-category">
            Category
          </label>
          <select
            id="filter-category"
            className="filter-control-select"
            value={filters.category || 'All'}
            onChange={(e) => onFilterChange({ category: e.target.value, page: 1 })}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date (from) */}
        <div className="filter-control-group">
          <label className="filter-control-label" htmlFor="filter-from">
            From Date
          </label>
          <input
            id="filter-from"
            type="date"
            className="filter-control-date"
            value={filters.from || ''}
            onChange={(e) => onFilterChange({ from: e.target.value, page: 1 })}
          />
        </div>

        {/* End Date (to) */}
        <div className="filter-control-group">
          <label className="filter-control-label" htmlFor="filter-to">
            To Date
          </label>
          <input
            id="filter-to"
            type="date"
            className="filter-control-date"
            value={filters.to || ''}
            onChange={(e) => onFilterChange({ to: e.target.value, page: 1 })}
          />
        </div>

        {/* Sort Order */}
        <div className="filter-control-group">
          <label className="filter-control-label" htmlFor="filter-sort">
            Sort By
          </label>
          <select
            id="filter-sort"
            className="filter-control-select"
            value={filters.sort || 'date'}
            onChange={(e) => onFilterChange({ sort: e.target.value, page: 1 })}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Action */}
        {hasActiveFilters && (
          <div className="filter-actions">
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={onResetFilters}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
