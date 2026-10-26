import React from 'react';
import './ErrorMessage.css';

/**
 * Reusable ErrorMessage Component
 * @param {string} title - Error heading
 * @param {string} message - Detailed error message
 * @param {Function} onRetry - Optional callback to retry failed operation
 * @param {string} retryLabel - Label for retry button
 */
export default function ErrorMessage({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section.',
  onRetry = null,
  retryLabel = 'Try Again',
  children = null,
}) {
  return (
    <div className="error-message-card" role="alert">
      <div className="error-icon-wrapper" aria-hidden="true">
        !
      </div>
      <div className="error-content">
        <h4 className="error-title">{title}</h4>
        <p className="error-text">{message}</p>
        {children}
        {onRetry && (
          <div className="error-actions">
            <button className="btn btn-sm btn-danger" onClick={onRetry}>
              {retryLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
