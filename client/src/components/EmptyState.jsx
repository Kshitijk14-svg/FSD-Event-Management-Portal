import React from 'react';
import { Link } from 'react-router-dom';
import './EmptyState.css';

/**
 * Reusable EmptyState Component
 * @param {string|React.ReactNode} icon - Display icon or emoji
 * @param {string} title - Main headline
 * @param {string} description - Supporting text
 * @param {string} actionLabel - Button label
 * @param {string} actionLink - Router link destination
 * @param {Function} onAction - Click handler if not using link
 */
export default function EmptyState({
  icon = '🗓️',
  title = 'No records found',
  description = 'There are currently no items to display in this view.',
  actionLabel = null,
  actionLink = null,
  onAction = null,
  children = null,
}) {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {children}
      {actionLabel && (
        <div className="empty-state-action">
          {actionLink ? (
            <Link to={actionLink} className="btn btn-primary">
              {actionLabel}
            </Link>
          ) : (
            <button className="btn btn-primary" onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
