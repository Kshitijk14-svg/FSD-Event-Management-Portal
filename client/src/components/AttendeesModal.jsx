import React, { useState, useEffect } from 'react';
import { fetchEventAttendees } from '../api/organizer';
import { useAuth } from '../context/useAuth';
import Loader from './Loader';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import './AttendeesModal.css';

function formatRegistrationTime(isoString) {
  if (!isoString) return 'Time not recorded';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * AttendeesModal Component
 * Fetches and displays registered attendee roster for an event
 */
export default function AttendeesModal({ eventId, eventTitle, onClose }) {
  const { user } = useAuth();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAttendees() {
      try {
        const response = await fetchEventAttendees(eventId, user);
        if (isMounted) {
          const list = response.data?.attendees || response.data || [];
          setAttendees(list);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load attendee roster');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAttendees();

    return () => {
      isMounted = false;
    };
  }, [eventId, user]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-attendees-title">
      <div className="attendees-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 id="modal-attendees-title" className="modal-title">
              Attendee Roster
            </h2>
            <p className="modal-subtitle">
              Event: <strong>{eventTitle}</strong> (ID: #{eventId})
            </p>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div style={{ padding: 'var(--space-8) 0' }}>
              <Loader size="md" message="Loading registered attendees..." />
            </div>
          ) : error ? (
            <ErrorMessage
              title="Failed to Load Attendees"
              message={error}
            />
          ) : attendees.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No Registrations Yet"
              description="No students or attendees have registered for this event so far."
            />
          ) : (
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Attendee Name</th>
                    <th>College Email</th>
                    <th>Registered At</th>
                    <th>Ticket Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {attendees.map((att, idx) => (
                    <tr key={att.attendeeId || att.ticketId || idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <strong>{att.name || 'Anonymous Student'}</strong>
                      </td>
                      <td>
                        <a href={`mailto:${att.email}`} style={{ color: 'inherit' }}>
                          {att.email || 'N/A'}
                        </a>
                      </td>
                      <td style={{ fontSize: '0.8125rem' }}>
                        {formatRegistrationTime(att.registeredAt || att.createdAt)}
                      </td>
                      <td>
                        <code>{att.ticketId || att.ticketRef || `TKT-${idx + 101}`}</code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
}
