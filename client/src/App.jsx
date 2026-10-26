import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Preserved Phase F1 Verification Harness
import ScaffoldHome from './pages/ScaffoldHome';

import './App.css';

/**
 * Root Application Component
 * Configured with React Router DOM & Protected Routes for Phase F3.
 */
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Main App Routes wrapped in reusable Layout (Navbar, Outlet, Footer) */}
            <Route element={<Layout />}>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="/scaffold-f1" element={<ScaffoldHome />} />

              {/* Protected Routes: Attendee / Admin */}
              <Route element={<ProtectedRoute allowedRoles={['attendee', 'admin']} />}>
                <Route path="/my-registrations" element={<MyRegistrationsPage />} />
              </Route>

              {/* Protected Routes: Organizer / Admin */}
              <Route element={<ProtectedRoute allowedRoles={['organizer', 'admin']} />}>
                <Route path="/organizer" element={<OrganizerDashboardPage />} />
                <Route path="/organizer/events/new" element={<CreateEventPage />} />
                <Route path="/organizer/events/:id/edit" element={<EditEventPage />} />
              </Route>

              {/* Protected Routes: Admin Only */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>

              {/* Catch-All / Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
