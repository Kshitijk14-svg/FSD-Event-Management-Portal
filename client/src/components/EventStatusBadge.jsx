import React, { useState } from 'react';
import './EventStatusBadge.css';

/**
 * Reusable EventStatusBadge Component
 * @param {number} seatsLeft - Number of available seats remaining
 * @param {string|Date} date - Event date to check if ended
 * @param {string} status - Optional explicit status string
 */
export default function EventStatusBadge({ seatsLeft, date, status }) {
  // Use state initializer for pure render evaluation
  const [now] = useState(() => Date.now());
  const isPast = date ? new Date(date).getTime() < now : false;
  const isFull = seatsLeft === 0 || status === 'Full';

  if (isPast || status === 'Completed' || status === 'Ended') {
    return (
      <span className="event-status-badge status-ended">
        <span className="status-indicator-dot" />
        Ended
      </span>
    );
  }

  if (isFull) {
    return (
      <span className="event-status-badge status-full">
        <span className="status-indicator-dot" />
        Full
      </span>
    );
  }

  if (seatsLeft !== undefined && seatsLeft <= 10) {
    return (
      <span className="event-status-badge status-almost-full">
        <span className="status-indicator-dot" />
        {seatsLeft} Seats Left
      </span>
    );
  }

  return (
    <span className="event-status-badge status-open">
      <span className="status-indicator-dot" />
      Open
    </span>
  );
}
