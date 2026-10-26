import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';
import EventStatusBadge from './EventStatusBadge';
import { DEFAULT_EVENT_IMAGE } from '../api/mockEventsAdapter';
import './EventCard.css';

/**
 * Helper to format ISO date strings into readable human timestamps
 */
function formatEventDate(dateString) {
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

/**
 * Reusable EventCard Component
 * Displays event details, imagery with fallback, seats counter, and link.
 */
export default function EventCard({ event }) {
  const [imgSrc, setImgSrc] = useState(event?.imageUrl || DEFAULT_EVENT_IMAGE);
  const eventId = event?._id || event?.id;

  const isFull = event?.seatsLeft === 0;
  const isFree = event?.price === 0 || !event?.price;

  return (
    <article className="event-card">
      {/* Event Image Banner with Overlay Badges */}
      <div className="event-card-media">
        <img
          src={imgSrc}
          alt={event?.title || 'Event thumbnail'}
          className="event-card-img"
          loading="lazy"
          onError={() => setImgSrc(DEFAULT_EVENT_IMAGE)}
        />
        <div className="event-card-badges-overlay">
          <CategoryBadge category={event?.category} />
          <div className={`event-card-price-pill ${isFree ? 'is-free' : ''}`}>
            {isFree ? 'Free' : `$${Number(event?.price).toFixed(2)}`}
          </div>
        </div>
      </div>

      {/* Event Content Body */}
      <div className="event-card-body">
        <div className="event-card-date">
          <span aria-hidden="true">📅</span>
          <span>{formatEventDate(event?.date)}</span>
        </div>

        <h3 className="event-card-title">
          <Link to={`/events/${eventId}`}>{event?.title}</Link>
        </h3>

        <div className="event-card-venue">
          <span aria-hidden="true">📍</span>
          <span>{event?.venue || 'Campus Venue TBD'}</span>
        </div>

        {/* Footer: Seats left & Action Link */}
        <div className="event-card-footer">
          <div className="event-card-seats">
            <span className="event-card-seats-label">Availability</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '2px' }}>
              <EventStatusBadge
                seatsLeft={event?.seatsLeft}
                date={event?.date}
                status={event?.status}
              />
              {!isFull && event?.seatsLeft !== undefined && (
                <span className="event-card-seats-count">
                  {event.seatsLeft} left
                </span>
              )}
            </div>
          </div>

          <Link to={`/events/${eventId}`} className="btn btn-sm btn-outline">
            View Details →
          </Link>
        </div>
      </div>
    </article>
  );
}
