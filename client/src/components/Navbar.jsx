import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import './Navbar.css';

/**
 * Responsive Navbar Component
 * Supports dynamic role-based navigation states (Guest, Attendee, Organizer, Admin)
 */
export default function Navbar() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close mobile drawer on Escape key for accessibility
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Helper to determine active link styling
  const getNavLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <header className="navbar-wrapper">
      <div className="container navbar-container">
        {/* Brand / Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <div className="brand-icon">
            <span>⚡</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">EventPortal</span>
            <span className="brand-subtitle">Campus Events</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav desktop-nav" aria-label="Main navigation">
          {/* Always visible: Browse Events */}
          <NavLink to="/" end className={getNavLinkClass}>
            Browse Events
          </NavLink>

          {/* Attendee Role Link */}
          {isAuthenticated && role === 'attendee' && (
            <NavLink to="/my-registrations" className={getNavLinkClass}>
              My Registrations
            </NavLink>
          )}

          {/* Organizer Role Links */}
          {isAuthenticated && role === 'organizer' && (
            <>
              <NavLink to="/organizer" end className={getNavLinkClass}>
                Organizer Dashboard
              </NavLink>
              <NavLink to="/organizer/events/new" className={getNavLinkClass}>
                + Create Event
              </NavLink>
            </>
          )}

          {/* Admin Role Link */}
          {isAuthenticated && role === 'admin' && (
            <NavLink to="/admin" className={getNavLinkClass}>
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        {/* Desktop User Section / Auth Actions */}
        <div className="navbar-actions desktop-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          ) : (
            <>
              <div className="user-profile-badge" title={user?.email || ''}>
                <div className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.name || 'User'}</span>
                  <span className="user-role-tag">{role}</span>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={`mobile-toggle-btn ${mobileMenuOpen ? 'is-active' : ''}`}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span className="toggle-bar bar-1" />
          <span className="toggle-bar bar-2" />
          <span className="toggle-bar bar-3" />
        </button>
      </div>

      {/* Backdrop overlay to close menu on outside tap */}
      {mobileMenuOpen && (
        <div
          className="mobile-menu-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav" className="mobile-menu-drawer">
          <ul className="mobile-nav-links">
            <li>
              <NavLink to="/" end className={getNavLinkClass} onClick={closeMobileMenu}>
                Browse Events
              </NavLink>
            </li>

            {isAuthenticated && role === 'attendee' && (
              <li>
                <NavLink to="/my-registrations" className={getNavLinkClass} onClick={closeMobileMenu}>
                  My Registrations
                </NavLink>
              </li>
            )}

            {isAuthenticated && role === 'organizer' && (
              <>
                <li>
                  <NavLink to="/organizer" end className={getNavLinkClass} onClick={closeMobileMenu}>
                    Organizer Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/organizer/events/new" className={getNavLinkClass} onClick={closeMobileMenu}>
                    + Create Event
                  </NavLink>
                </li>
              </>
            )}

            {isAuthenticated && role === 'admin' && (
              <li>
                <NavLink to="/admin" className={getNavLinkClass} onClick={closeMobileMenu}>
                  Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          <div className="mobile-user-section">
            {!isAuthenticated ? (
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm"
                  style={{ flex: 1 }}
                  onClick={closeMobileMenu}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            ) : (
              <>
                <div className="user-profile-badge">
                  <div className="user-avatar">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="user-details">
                    <span className="user-name">{user?.name}</span>
                    <span className="user-role-tag">{role}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
