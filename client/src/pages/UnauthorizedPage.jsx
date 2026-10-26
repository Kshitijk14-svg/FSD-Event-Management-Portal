import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

/**
 * 403 Forbidden / Unauthorized Page
 * Displayed when an authenticated user attempts to access a route restricted to another role.
 */
export default function UnauthorizedPage({ requiredRoles = [] }) {
  const { user } = useAuth();

  return (
    <div className="container page-section">
      <div className="not-found-wrapper">
        <div className="not-found-code" style={{ color: 'var(--color-danger)' }}>
          403
        </div>
        <h1 className="page-title" style={{ marginBottom: 'var(--space-3)' }}>
          Access Denied
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: 'var(--space-4)',
          }}
        >
          You do not have the required permissions to access this page.
        </p>

        <div
          className="card"
          style={{
            maxWidth: '480px',
            margin: '0 auto var(--space-6)',
            textAlign: 'left',
            padding: 'var(--space-4) var(--space-5)',
            backgroundColor: 'var(--bg-surface-elevated)',
          }}
        >
          <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
            <strong>Your Active Account:</strong>{' '}
            <span>{user?.name || 'Unknown'}</span>{' '}
            <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
              {user?.role || 'Guest'}
            </span>
          </div>
          {requiredRoles.length > 0 && (
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <strong>Required Role:</strong>{' '}
              {requiredRoles.map((r) => (
                <span
                  key={r}
                  className="badge badge-warning"
                  style={{ textTransform: 'capitalize', marginRight: '0.35rem' }}
                >
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            🏠 Return to Events
          </Link>
          {user?.role === 'organizer' && (
            <Link to="/organizer" className="btn btn-secondary">
              Organizer Dashboard
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="btn btn-secondary">
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
