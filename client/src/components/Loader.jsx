import React from 'react';
import './Loader.css';

/**
 * Reusable Loader Component
 * @param {'sm' | 'md' | 'lg'} size - Spinner size
 * @param {string} message - Optional text message below spinner
 * @param {boolean} fullPage - Centers in a full height viewport container
 */
export default function Loader({ size = 'md', message = 'Loading...', fullPage = false }) {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`} role="status" aria-live="polite">
      <div className={`loader-spinner ${size}`} />
      {message && <p className="loader-message">{message}</p>}
      <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {message}
      </span>
    </div>
  );
}
