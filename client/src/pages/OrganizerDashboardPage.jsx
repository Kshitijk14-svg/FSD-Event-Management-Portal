import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrganizerEvents, deleteEvent } from '../api/organizer';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import CategoryBadge from '../components/CategoryBadge';
import StatusBadge from '../components/StatusBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import AttendeesModal from '../components/AttendeesModal';

function formatEventDate(dateString) {
  if (!dateString) return 'Date TBD';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function OrganizerDashboardPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Attendees modal state
  const [viewingAttendeesEvent, setViewingAttendeesEvent] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadEvents() {
      try {
        const response = await fetchOrganizerEvents(user);
        if (isMounted) {
          setEvents(response.data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load organizer events');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, [user, reloadKey]);

  // Handle Event Deletion with Confirmation (Requirements 10 & 11)
  const handleDeleteEvent = async (id, title) => {
    if (deletingId) return;

    if (!window.confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await deleteEvent(id, user);
      toast.info(response.message || `Event "${title}" has been deleted.`, 'Event Deleted');
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message || 'Failed to delete event. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  }, []);

  if (loading) {
    return (
      <div className="container page-section" style={{ minHeight: '60vh' }}>
        <Loader fullPage size="lg" message="Loading your organized events..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-section">
        <div className="page-header">
          <div>
            <h1 className="page-title">Organizer Dashboard</h1>
            <p className="page-subtitle">Manage campus activities, track attendees, and publish events</p>
          </div>
        </div>
        <ErrorMessage
          title="Could Not Load Dashboard"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Calculate statistics across organized events
  const totalCapacity = events.reduce((sum, e) => sum + (e.capacity || 0), 0);
  const totalRegistered = events.reduce((sum, e) => {
    const registered = Math.max(0, (e.capacity || 0) - (e.seatsLeft !== undefined ? e.seatsLeft : 0));
    return sum + registered;
  }, 0);

  return (
    <div className="container page-section">
      {/* Dashboard Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Organizer Dashboard</h1>
          <p className="page-subtitle">
            Welcome back, <strong>{user?.name}</strong>. Manage your events and review registration attendance.
          </p>
        </div>
        <div className="page-actions">
          <Link to="/organizer/events/new" className="btn btn-primary">
            + Create New Event
          </Link>
        </div>
      </div>

      {/* Summary Metrics Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-value">{events.length}</div>
            <div className="stat-label">Organized Events</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <div className="stat-value">{totalRegistered}</div>
            <div className="stat-label">Total Registered Attendees</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div>
            <div className="stat-value">{totalCapacity}</div>
            <div className="stat-label">Total Seat Capacity</div>
          </div>
        </div>
      </section>

      {/* Events Management Table / List */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Your Published & Managed Events</h2>
          <span className="badge badge-primary">{events.length} total</span>
        </div>

        {events.length > 0 ? (
          <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Event Title & Category</th>
                  <th>Date & Time</th>
                  <th>Attendance / Capacity</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => {
                  const eventId = evt._id || evt.id;
                  const registered = Math.max(0, (evt.capacity || 0) - (evt.seatsLeft !== undefined ? evt.seatsLeft : 0));
                  const isProcessingDelete = deletingId === eventId;

                  return (
                    <tr key={eventId}>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <Link to={`/events/${eventId}`} style={{ fontWeight: 700, color: 'inherit' }}>
                            {evt.title}
                          </Link>
                          <div>
                            <CategoryBadge category={evt.category} />
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{formatEventDate(evt.date)}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {evt.venue}</div>
                      </td>

                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <strong style={{ fontSize: '0.9rem' }}>{registered}</strong>
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>/ {evt.capacity}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {evt.seatsLeft !== undefined ? `${evt.seatsLeft} seats left` : ''}
                        </div>
                      </td>

                      <td>
                        <StatusBadge
                          label={evt.seatsLeft === 0 ? 'Full' : evt.status || 'Published'}
                          status={evt.seatsLeft === 0 ? 'warning' : 'success'}
                        />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                          {/* View Attendees Action (Requirement 3 & 12) */}
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => setViewingAttendeesEvent(evt)}
                            title="View registered attendees list"
                          >
                            👥 Attendees
                          </button>

                          {/* Edit Action (Requirement 3) */}
                          <Link
                            to={`/organizer/events/${eventId}/edit`}
                            className="btn btn-sm btn-outline"
                            title="Edit event details"
                          >
                            ✏️ Edit
                          </Link>

                          {/* Delete Action (Requirements 3 & 10) */}
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteEvent(eventId, evt.title)}
                            disabled={isProcessingDelete}
                            title="Delete this event"
                          >
                            {isProcessingDelete ? 'Deleting...' : '🗑️ Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ padding: 'var(--space-6)' }}>
            <EmptyState
              icon="📅"
              title="No Events Created Yet"
              description="You have not published any college events yet. Click below to create your first workshop, hackathon, or cultural activity."
              actionLabel="+ Create New Event"
              actionLink="/organizer/events/new"
            />
          </div>
        )}
      </div>

      {/* Attendees Modal */}
      {viewingAttendeesEvent && (
        <AttendeesModal
          eventId={viewingAttendeesEvent._id || viewingAttendeesEvent.id}
          eventTitle={viewingAttendeesEvent.title}
          onClose={() => setViewingAttendeesEvent(null)}
        />
      )}
    </div>
  );
}
