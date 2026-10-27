import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('404 Not Found');
  return (
    <div className="container page-section">
      <div className="not-found-wrapper">
        <div className="not-found-code">404</div>
        <h1 className="page-title" style={{ marginBottom: 'var(--space-3)' }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6', marginBottom: 'var(--space-6)' }}>
          The page or route you requested does not exist or might have been relocated.
          Check the URL address or return to the main events catalog.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            🏠 Return to Home
          </Link>
          <Link to="/login" className="btn btn-outline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
