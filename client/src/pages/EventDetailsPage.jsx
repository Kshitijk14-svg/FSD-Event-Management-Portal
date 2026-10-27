import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { fetchEventById } from '../api/events';
import {
  registerForEvent,
  cancelEventRegistration,
  fetchMyRegistrations,
  checkIsRegisteredLocal,
} from '../api/registrations';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import CategoryBadge from '../components/CategoryBadge';
import EventStatusBadge from '../components/EventStatusBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { DEFAULT_EVENT_IMAGE } from '../api/mockEventsAdapter';
import useDocumentTitle from '../utils/useDocumentTitle';

/**
 * Format ISO timestamp into human readable date & time
 */
function formatFullDateTime(dateString) {
  if (!dateString) return 'Date & Time TBD';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    }).format(d);
  } catch {
    return dateString;
  }
}

export default function EventDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [event, setEvent] = useState(null);
  useDocumentTitle(event?.title || 'Event Details');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgSrc, setImgSrc] = useState(null);

  // Registration state & action progress lock
  const [isRegistered, setIsRegistered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [now] = useState(() => Date.now());

  // Load event details
  useEffect(() => {
    let isMounted = true;

    async function loadEvent() {
      try {
        const data = await fetchEventById(id);
        if (isMounted) {
          setEvent(data);
          setImgSrc(data.imageUrl || DEFAULT_EVENT_IMAGE);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load event details');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [id]);

  // Check if current user is already registered for this event
  useEffect(() => {
    let isMounted = true;

    if (!isAuthenticated || !user) {
      return;
    }

    fetchMyRegistrations(user)
      .then((res) => {
        if (!isMounted) return;
        const regs = res.data || [];
        const found = regs.some(
          (r) =>
            String(r.eventId || r.event?._id) === String(id) &&
            r.status === 'confirmed'
        );
        setIsRegistered(found);
      })
      .catch(() => {
        if (isMounted) {
          setIsRegistered(checkIsRegisteredLocal(id, user.email));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id, isAuthenticated, user]);

  if (loading) {
    return (
      <div className="container page-section" style={{ minHeight: '60vh' }}>
        <Loader fullPage size="lg" message="Loading event details..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container page-section">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link to="/" className="btn btn-sm btn-outline">
            ← Back to All Events
          </Link>
        </div>
        <ErrorMessage
          title="Event Not Found"
          message={error || `Could not find an event with ID "${id}".`}
        >
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Link to="/" className="btn btn-sm btn-primary">
              Browse Available Events
            </Link>
          </div>
        </ErrorMessage>
      </div>
    );
  }

  // Determine Event State per Requirement 15
  const isPast = event.date ? new Date(event.date).getTime() < now : false;
  const isFull = event.seatsLeft === 0;
  const isFree = event.price === 0 || !event.price;
  const organizerName =
    typeof event.organizer === 'object'
      ? event.organizer?.name || 'Campus Event Organizer'
      : event.organizer || 'Campus Event Organizer';

  // Handle Event Registration with Optimistic UI & Rollback
  const handleRegister = async () => {
    if (submitting) return;

    setSubmitting(true);
    const previousSeats = event.seatsLeft;

    // Optimistic UI update (Requirement 9)
    setIsRegistered(true);
    setEvent((prev) => ({
      ...prev,
      seatsLeft: Math.max(0, (prev.seatsLeft || 1) - 1),
    }));

    try {
      const response = await registerForEvent(id, user);
      toast.success(
        response.message || `Successfully registered for "${event.title}"!`,
        'Registration Confirmed'
      );
      if (response.data?.seatsLeft !== undefined) {
        setEvent((prev) => ({ ...prev, seatsLeft: response.data.seatsLeft }));
      }
    } catch (err) {
      // Rollback optimistic update on error
      setIsRegistered(false);
      setEvent((prev) => ({ ...prev, seatsLeft: previousSeats }));
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Registration Cancellation with Optimistic UI & Rollback
  const handleCancel = async () => {
    if (submitting) return;

    setSubmitting(true);
    const previousSeats = event.seatsLeft;

    // Optimistic UI update (Requirement 9)
    setIsRegistered(false);
    setEvent((prev) => ({
      ...prev,
      seatsLeft: (prev.seatsLeft || 0) + 1,
    }));

    try {
      const response = await cancelEventRegistration(id, user);
      toast.info(
        response.message || `Registration for "${event.title}" has been cancelled.`,
        'Registration Cancelled'
      );
      if (response.data?.seatsLeft !== undefined) {
        setEvent((prev) => ({ ...prev, seatsLeft: response.data.seatsLeft }));
      }
    } catch (err) {
      // Rollback optimistic update on error
      setIsRegistered(true);
      setEvent((prev) => ({ ...prev, seatsLeft: previousSeats }));
      toast.error(err.message || 'Failed to cancel registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Render Registration Button according to Requirement 15:
   * 1. Login to register
   * 2. Register
   * 3. Registered - Cancel
   * 4. Full
   * 5. Event ended
   */
  const renderRegistrationButton = () => {
    // 5. Event ended
    if (isPast) {
      return (
        <button type="button" className="btn btn-secondary" style={{ width: '100%' }} disabled>
          🚫 Event Ended
        </button>
      );
    }

    // 4. Event Full (seatsLeft === 0) and user is not already registered
    if (isFull && !isRegistered) {
      return (
        <button type="button" className="btn btn-danger" style={{ width: '100%' }} disabled>
          ⛔ Event Full (0 Seats Left)
        </button>
      );
    }

    // 1. Login to register (Guest)
    if (!isAuthenticated) {
      return (
        <Link
          to="/login"
          state={{ from: location }}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          🔒 Log In to Register
        </Link>
      );
    }

    // 3. Registered - Cancel (User is currently registered)
    if (isRegistered) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <div style={{ color: 'var(--color-success)', fontWeight: 700, textAlign: 'center', fontSize: '0.875rem' }}>
            ✓ You are registered for this event
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ width: '100%', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
            onClick={handleCancel}
            disabled={submitting}
          >
            {submitting ? 'Cancelling...' : 'Registered - Cancel'}
          </button>
        </div>
      );
    }

    // 2. Register (Active registration available)
    return (
      <button
        type="button"
        className="btn btn-primary"
        style={{ width: '100%' }}
        onClick={handleRegister}
        disabled={submitting}
      >
        {submitting
          ? 'Processing Registration...'
          : isFree
          ? 'Register for Free'
          : `Register Now • $${Number(event.price).toFixed(2)}`}
      </button>
    );
  };

  return (
    <div className="container page-section">
      {/* Navigation Breadcrumb */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/" className="btn btn-sm btn-outline">
          ← Back to All Events
        </Link>
      </div>

      {/* Offline Mock Notice Banner */}
      {event._isMock && (
        <div className="placeholder-note" style={{ marginBottom: 'var(--space-6)' }}>
          <span className="placeholder-note-icon">ℹ️</span>
          <div>
            <strong>Offline Testing Mode Active</strong>
            <p style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>
              Backend at <code>http://localhost:5000/api/events/{id}</code> is currently offline. Data loaded from <code>mockEventsAdapter</code>.
            </p>
          </div>
        </div>
      )}

      {/* Main Event Details Layout */}
      <div className="event-details-layout">
        {/* Left Column: Details & Media */}
        <div>
          {/* Hero Media Container */}
          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: 'var(--space-6)',
              maxHeight: '400px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <img
              src={imgSrc}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={() => setImgSrc(DEFAULT_EVENT_IMAGE)}
            />
          </div>

          {/* Details Content Box */}
          <div className="event-details-hero">
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap' }}>
              <CategoryBadge category={event.category} />
              <EventStatusBadge seatsLeft={event.seatsLeft} date={event.date} status={event.status} />
              <span className={`badge ${isFree ? 'badge-success' : 'badge-primary'}`}>
                {isFree ? 'Free Admission' : `$${Number(event.price).toFixed(2)}`}
              </span>
            </div>

            <h1 className="page-title" style={{ fontSize: '2.25rem', marginBottom: 'var(--space-4)' }}>
              {event.title}
            </h1>

            <div style={{ marginBottom: 'var(--space-6)', color: 'var(--text-muted)', fontSize: '0.9375rem' }}>
              Hosted by <strong>{organizerName}</strong>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
              About This Event
            </h3>

            <div
              style={{
                fontSize: '1.025rem',
                color: 'var(--text-main)',
                lineHeight: '1.75',
                whiteSpace: 'pre-line',
                marginBottom: 'var(--space-8)',
              }}
            >
              {event.description}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Summary & Registration Card */}
        <aside className="event-sidebar-card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-4)' }}>
            Event Details
          </h3>

          <div className="sidebar-info-row">
            <span className="sidebar-icon">📅</span>
            <div>
              <strong style={{ fontSize: '0.875rem' }}>Date & Time</strong>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {formatFullDateTime(event.date)}
              </p>
            </div>
          </div>

          <div className="sidebar-info-row">
            <span className="sidebar-icon">📍</span>
            <div>
              <strong style={{ fontSize: '0.875rem' }}>Venue Location</strong>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {event.venue}
              </p>
            </div>
          </div>

          <div className="sidebar-info-row">
            <span className="sidebar-icon">🎟️</span>
            <div>
              <strong style={{ fontSize: '0.875rem' }}>Admission Price</strong>
              <p style={{ fontSize: '0.8125rem', color: isFree ? 'var(--color-success)' : 'var(--text-main)', fontWeight: 600 }}>
                {isFree ? 'Free Admission' : `$${Number(event.price).toFixed(2)}`}
              </p>
            </div>
          </div>

          <div className="sidebar-info-row">
            <span className="sidebar-icon">👥</span>
            <div>
              <strong style={{ fontSize: '0.875rem' }}>Seats Availability</strong>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {event.seatsLeft !== undefined ? (
                  <>
                    <strong style={{ color: isFull ? 'var(--color-danger)' : 'var(--text-main)' }}>
                      {event.seatsLeft}
                    </strong>{' '}
                    remaining of {event.capacity || 'unlimited'} seats
                  </>
                ) : (
                  'Registration Open'
                )}
              </p>
            </div>
          </div>

          <div className="sidebar-info-row">
            <span className="sidebar-icon">🎓</span>
            <div>
              <strong style={{ fontSize: '0.875rem' }}>Organized By</strong>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {organizerName}
              </p>
            </div>
          </div>

          {/* Action Button Section with 5 States */}
          <div style={{ marginTop: 'var(--space-6)' }}>
            {renderRegistrationButton()}
          </div>

          {/* Organizer / Admin Quick Edit Link */}
          {(user?.role === 'organizer' || user?.role === 'admin') && (
            <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
              <Link
                to={`/organizer/events/${id}/edit`}
                className="btn btn-sm btn-outline"
                style={{ width: '100%' }}
              >
                ✏️ Edit Event #{id}
              </Link>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
