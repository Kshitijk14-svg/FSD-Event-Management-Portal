import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyRegistrations, cancelEventRegistration } from '../api/registrations';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import CategoryBadge from '../components/CategoryBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { DEFAULT_EVENT_IMAGE } from '../api/mockEventsAdapter';

/**
 * Format registration date and event date cleanly
 */
function formatEventSchedule(dateString) {
  if (!dateString) return 'Date TBD';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
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

export default function MyRegistrationsPage() {
  const { user } = useAuth();
  const toast = useToast();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [cancellingId, setCancellingId] = useState(null);
  const [now] = useState(() => Date.now());

  // Load user registrations on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const response = await fetchMyRegistrations(user);
        if (isMounted) {
          setRegistrations(response.data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load your registrations');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  // Handle Cancellation from My Registrations (Requirement 14)
  const handleCancelRegistration = async (eventId, eventTitle) => {
    if (cancellingId) return; // Prevent duplicate clicks

    if (!window.confirm(`Are you sure you want to cancel your registration for "${eventTitle}"?`)) {
      return;
    }

    setCancellingId(eventId);
    try {
      const response = await cancelEventRegistration(eventId, user);
      toast.info(
        response.message || `Registration for "${eventTitle}" was successfully cancelled.`,
        'Registration Cancelled'
      );
      // Refresh registrations list
      const freshResponse = await fetchMyRegistrations(user);
      setRegistrations(freshResponse.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to cancel registration. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  const handleRetry = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchMyRegistrations(user)
      .then((res) => {
        setRegistrations(res.data || []);
      })
      .catch((err) => setError(err.message || 'Failed to load your registrations'))
      .finally(() => setLoading(false));
  }, [user]);

  // Separate upcoming and past registrations (Requirement 13)
  const upcomingRegistrations = registrations.filter((r) => {
    const eventDate = r.event?.date ? new Date(r.event.date).getTime() : 0;
    return eventDate >= now;
  });

  const pastRegistrations = registrations.filter((r) => {
    const eventDate = r.event?.date ? new Date(r.event.date).getTime() : 0;
    return eventDate < now;
  });

  const currentList = activeTab === 'upcoming' ? upcomingRegistrations : pastRegistrations;

  if (loading) {
    return (
      <div className="container page-section" style={{ minHeight: '60vh' }}>
        <Loader fullPage size="lg" message="Loading your event registrations..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-section">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Event Registrations</h1>
            <p className="page-subtitle">View your booked tickets and campus passes</p>
          </div>
        </div>
        <ErrorMessage
          title="Could Not Load Registrations"
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="container page-section">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Event Registrations</h1>
          <p className="page-subtitle">
            Manage your booked event tickets, schedules, and passes
          </p>
        </div>
        <div className="page-actions">
          <Link to="/" className="btn btn-primary">
            + Discover More Events
          </Link>
        </div>
      </div>

      {/* Tabs for Upcoming vs Past (Requirement 13) */}
      <div className="tabs-navigation">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          <span>🎟️ Upcoming Events</span>
          <span className="badge badge-primary">{upcomingRegistrations.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          <span>📜 Past Events</span>
          <span className="badge badge-neutral">{pastRegistrations.length}</span>
        </button>
      </div>

      {/* Registrations List */}
      {currentList.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {currentList.map((reg) => {
            const event = reg.event || {};
            const eventId = reg.eventId || event._id || event.id;
            const isEligibleToCancel = activeTab === 'upcoming';
            const isProcessingThis = cancellingId === eventId;

            return (
              <article key={reg._id} className="registration-card">
                {/* Event Image */}
                <img
                  src={event.imageUrl || DEFAULT_EVENT_IMAGE}
                  alt={event.title || 'Event thumbnail'}
                  className="registration-card-img"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_EVENT_IMAGE;
                  }}
                />

                {/* Event & Registration Details */}
                <div className="registration-card-info">
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <CategoryBadge category={event.category} />
                    <span className="badge badge-success">
                      ✓ {reg.status || 'Confirmed'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '4px 0 2px' }}>
                    <Link to={`/events/${eventId}`} style={{ color: 'inherit' }}>
                      {event.title || 'Untitled Event'}
                    </Link>
                  </h3>

                  <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    📅 {formatEventSchedule(event.date)}
                  </div>

                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    📍 {event.venue || 'Venue TBD'}
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                    Registration Reference: <code>{reg._id}</code>
                  </div>
                </div>

                {/* Actions: View & Cancel */}
                <div className="registration-card-actions">
                  <Link to={`/events/${eventId}`} className="btn btn-sm btn-outline">
                    View Event Details →
                  </Link>

                  {isEligibleToCancel ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary"
                      style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                      onClick={() => handleCancelRegistration(eventId, event.title)}
                      disabled={isProcessingThis}
                    >
                      {isProcessingThis ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Past Event (Completed)
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={activeTab === 'upcoming' ? '🎟️' : '📜'}
          title={activeTab === 'upcoming' ? 'No Upcoming Event Registrations' : 'No Past Event Registrations'}
          description={
            activeTab === 'upcoming'
              ? "You haven't registered for any upcoming campus events yet. Explore our workshops, hackathons, and cultural fests to reserve your tickets!"
              : 'You do not have any past completed event registrations in your history.'
          }
          actionLabel={activeTab === 'upcoming' ? 'Explore Upcoming Events' : null}
          actionLink="/"
        />
      )}
    </div>
  );
}
