import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Reusable Footer Component
 */
export default function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="container footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="footer-brand-title">
              <span>⚡</span> EventPortal
            </div>
            <p className="footer-brand-desc">
              Campus Event Management Portal built with the MERN stack. Discover, register, and organize college workshops, hackathons, and cultural fests.
            </p>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Browse Events</Link>
              </li>
              <li>
                <Link to="/my-registrations">My Registrations</Link>
              </li>
              <li>
                <Link to="/organizer">Organizer Portal</Link>
              </li>
              <li>
                <Link to="/admin">Admin Panel</Link>
              </li>
            </ul>
          </div>

          {/* Portals Column */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link to="/login">Sign In</Link>
              </li>
              <li>
                <Link to="/register">Create Account</Link>
              </li>
              <li>
                <Link to="/organizer/events/new">Publish New Event</Link>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="footer-col-title">Project Info</h4>
            <ul className="footer-links">
              <li>
                <span>FSD Capstone Project</span>
              </li>
              <li>
                <span>React 18 + Vite + Node/Express</span>
              </li>
              <li>
                <span className="footer-meta-pill">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-success)' }} />
                  Phase F2: Routing & Layout
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {CURRENT_YEAR} EventPortal — College Project Demonstration. All rights reserved.</p>
          <div className="footer-meta-pill">
            Frontend by <strong>Kunal</strong>
          </div>
        </div>
      </div>
    </footer>
  );
}
