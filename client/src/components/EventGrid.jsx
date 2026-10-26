import React from 'react';
import EventCard from './EventCard';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import './EventGrid.css';

/**
 * Reusable EventGrid Component
 * Displays grid of events with loading skeletons, error message, and empty state
 */
export default function EventGrid({
  events = [],
  loading = false,
  error = null,
  onRetry = null,
  onResetFilters = null,
}) {
  if (loading) {
    return (
      <div style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <Loader size="lg" message="Loading college events..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Events"
        message={typeof error === 'string' ? error : error?.message || 'An error occurred while fetching events.'}
        onRetry={onRetry}
      />
    );
  }

  if (!events || events.length === 0) {
    return (
      <EmptyState
        icon="🔍"
        title="No Events Found"
        description="We couldn't find any events matching your selected search query or filters. Try adjusting your parameters or clear all filters."
        actionLabel={onResetFilters ? 'Clear All Filters' : null}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <EventCard key={event._id || event.id} event={event} />
      ))}
    </div>
  );
}
