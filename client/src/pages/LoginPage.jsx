import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ErrorMessage from '../components/ErrorMessage';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('Sign In');
  const { login, isMockSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Client-side validation
  const validateForm = () => {
    const errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    const submittedPassword = password;
    // Clear password input immediately to avoid storing/persisting sensitive credentials
    setPassword('');

    try {
      const user = await login({ email: email.trim(), password: submittedPassword });

      // Determine post-login redirect destination
      const fromPath = location.state?.from?.pathname;
      if (fromPath && fromPath !== '/login' && fromPath !== '/register') {
        navigate(fromPath, { replace: true });
      } else {
        // Role-based redirection per requirement 14
        if (user.role === 'organizer') {
          navigate('/organizer', { replace: true });
        } else if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  // Helper for quick filling test accounts
  const prefillTestAccount = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setFieldErrors({});
    setServerError('');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon" style={{ margin: '0 auto var(--space-3)' }}>
            <span>⚡</span>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your EventPortal account</p>
        </div>

        {/* Server Error Display */}
        {serverError && (
          <ErrorMessage
            title="Authentication Error"
            message={serverError}
          />
        )}

        {/* Mock Adapter Banner when active */}
        {isMockSession && (
          <div className="placeholder-note" style={{ fontSize: '0.8125rem', marginBottom: 'var(--space-4)' }}>
            <span className="placeholder-note-icon">ℹ️</span>
            <div>
              <strong>Mock Auth Adapter Active</strong>
              <p>Backend at port 5000 is offline. Using local testing adapter with simulated credentials.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label form-label-required" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className={`form-input ${fieldErrors.email ? 'border-danger' : ''}`}
              placeholder="e.g. attendee@college.edu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
              }}
              disabled={submitting}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label form-label-required" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className={`form-input ${fieldErrors.password ? 'border-danger' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
              }}
              disabled={submitting}
              autoComplete="current-password"
            />
            {fieldErrors.password && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            disabled={submitting}
          >
            {submitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Testing Persona Selector for Ease of Evaluation */}
        <div style={{ marginTop: 'var(--space-5)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }}>
            Fill Credentials for Testing:
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => prefillTestAccount('attendee@college.edu')}
              disabled={submitting}
            >
              Attendee
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => prefillTestAccount('organizer@college.edu')}
              disabled={submitting}
            >
              Organizer
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={() => prefillTestAccount('admin@college.edu')}
              disabled={submitting}
            >
              Admin
            </button>
          </div>
        </div>

        <div className="auth-footer">
          Don't have an account yet?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
