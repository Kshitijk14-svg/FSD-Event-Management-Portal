import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import ErrorMessage from '../components/ErrorMessage';
import useDocumentTitle from '../utils/useDocumentTitle';

export default function RegisterPage() {
  useDocumentTitle('Create Account');
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'attendee',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Client-side validation
  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      errors.name = 'Full name is required';
    } else if (trimmedName.length < 2 || trimmedName.length > 60) {
      errors.name = 'Name must be between 2 and 60 characters';
    }

    if (!trimmedEmail) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Security check: Only 'attendee' or 'organizer' permitted publicly
    if (formData.role !== 'attendee' && formData.role !== 'organizer') {
      errors.role = 'Invalid role selected';
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
    const submittedPassword = formData.password;

    // Immediately clear password from state to prevent persistent exposure
    setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));

    try {
      const user = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: submittedPassword,
        role: formData.role,
      });

      // Redirect by role after successful registration
      if (user.role === 'organizer') {
        navigate('/organizer', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon" style={{ margin: '0 auto var(--space-3)' }}>
            <span>⚡</span>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the college event portal network</p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <ErrorMessage
            title="Registration Error"
            message={serverError}
          />
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label form-label-required" htmlFor="reg-name">
              Full Name
            </label>
            <input
              id="reg-name"
              name="name"
              type="text"
              className={`form-input ${fieldErrors.name ? 'border-danger' : ''}`}
              placeholder="e.g. Kunal Sharma"
              value={formData.name}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="name"
            />
            {fieldErrors.name && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label form-label-required" htmlFor="reg-email">
              College Email Address
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              className={`form-input ${fieldErrors.email ? 'border-danger' : ''}`}
              placeholder="student@college.edu"
              value={formData.email}
              onChange={handleChange}
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
            <label className="form-label form-label-required" htmlFor="reg-role">
              Account Role
            </label>
            <select
              id="reg-role"
              name="role"
              className={`form-select ${fieldErrors.role ? 'border-danger' : ''}`}
              value={formData.role}
              onChange={handleChange}
              disabled={submitting}
            >
              <option value="attendee">Student / Attendee</option>
              <option value="organizer">Event Organizer</option>
            </select>
            {fieldErrors.role ? (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.role}
              </span>
            ) : (
              <span className="form-hint">
                Note: Administrative accounts are provisioned via system seed and cannot be chosen publicly.
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label form-label-required" htmlFor="reg-password">
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              className={`form-input ${fieldErrors.password ? 'border-danger' : ''}`}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="new-password"
            />
            {fieldErrors.password && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.password}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label form-label-required" htmlFor="reg-confirm-password">
              Confirm Password
            </label>
            <input
              id="reg-confirm-password"
              name="confirmPassword"
              type="password"
              className={`form-input ${fieldErrors.confirmPassword ? 'border-danger' : ''}`}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={submitting}
              autoComplete="new-password"
            />
            {fieldErrors.confirmPassword && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: 'var(--space-2)' }}
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
