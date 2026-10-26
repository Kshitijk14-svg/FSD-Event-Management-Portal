import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

/**
 * Reusable Root Application Layout
 * Provides consistent Navbar, content viewport, and Footer across all routes.
 */
export default function Layout({ children }) {
  return (
    <div className="app-layout">
      {/* Persistent Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="app-main">
        {children || <Outlet />}
      </main>

      {/* Persistent Footer */}
      <Footer />
    </div>
  );
}
