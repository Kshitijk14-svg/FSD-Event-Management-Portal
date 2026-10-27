import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAdminStats,
  fetchAdminUsers,
  updateUserRole,
  deleteUser,
  adminDeleteEvent,
  fetchAdminEvents,
} from '../api/admin';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import CategoryBadge from '../components/CategoryBadge';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import useDocumentTitle from '../utils/useDocumentTitle';

function formatDate(isoString) {
  if (!isoString) return 'Date TBD';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}

export default function AdminDashboardPage() {
  useDocumentTitle('Admin Dashboard');
  const { user } = useAuth();
  const toast = useToast();

  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalRegistrations: 0 });
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'events'
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function loadAdminData() {
      try {
        const [statsRes, usersRes, eventsRes] = await Promise.all([
          fetchAdminStats(),
          fetchAdminUsers(),
          fetchAdminEvents(),
        ]);

        if (isMounted) {
          setStats(statsRes.data || { totalUsers: 0, totalEvents: 0, totalRegistrations: 0 });
          setUsers(usersRes.data || []);
          setEvents(eventsRes.data || []);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load administration data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadAdminData();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  // Handle Role Update (Requirements 19 & 20)
  const handleRoleChange = async (userId, userName, newRole) => {
    if (updatingUserId) return;

    setUpdatingUserId(userId);
    try {
      const response = await updateUserRole(userId, newRole);
      toast.success(
        response.message || `Role for ${userName} updated to ${newRole}`,
        'Role Updated'
      );
      // Update locally in users array
      setUsers((prev) =>
        prev.map((u) => (String(u._id) === String(userId) ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      toast.error(err.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle User Deletion (Requirement 21)
  const handleDeleteUser = async (userId, userName) => {
    if (deletingUserId) return;

    // Prevent admin from deleting their own active session
    if (user?.email && users.find((u) => String(u._id) === String(userId))?.email === user.email) {
      toast.error('You cannot delete your own administrative account.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This cannot be undone.`)) {
      return;
    }

    setDeletingUserId(userId);
    try {
      const response = await deleteUser(userId);
      toast.info(response.message || `User "${userName}" has been deleted.`, 'User Deleted');
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  // Handle Event Deletion by Admin (Requirements 22 & 23)
  const handleDeleteEvent = async (eventId, eventTitle) => {
    if (deletingEventId) return;

    if (!window.confirm(`Are you sure you want to permanently delete event "${eventTitle}"?`)) {
      return;
    }

    setDeletingEventId(eventId);
    try {
      const response = await adminDeleteEvent(eventId, user);
      toast.info(response.message || `Event "${eventTitle}" was deleted.`, 'Event Removed');
      setReloadKey((k) => k + 1);
    } catch (err) {
      toast.error(err.message || 'Failed to delete event');
    } finally {
      setDeletingEventId(null);
    }
  };

  if (loading) {
    return (
      <div className="container page-section" style={{ minHeight: '60vh' }}>
        <Loader fullPage size="lg" message="Loading admin control center..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-section">
        <div className="page-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Platform statistics, user role management, and moderation</p>
          </div>
        </div>
        <ErrorMessage
          title="Could Not Load Admin Panel"
          message={error}
          onRetry={() => {
            setLoading(true);
            setReloadKey((k) => k + 1);
          }}
        />
      </div>
    );
  }

  return (
    <div className="container page-section">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">
            Centralized platform statistics, role assignment, and campus event moderation
          </p>
        </div>
        <div className="page-actions">
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => {
              setLoading(true);
              setReloadKey((k) => k + 1);
            }}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>

      {/* 3 Statistic Cards (Requirements 15 & 16) */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div>
            <div className="stat-value">{stats.totalEvents}</div>
            <div className="stat-label">Total Events</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎟️</div>
          <div>
            <div className="stat-value">{stats.totalRegistrations}</div>
            <div className="stat-label">Total Registrations</div>
          </div>
        </div>
      </section>

      {/* Tabs: Users vs Events */}
      <div className="tabs-navigation">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span>👤 User Directory & Roles</span>
          <span className="badge badge-primary">{users.length}</span>
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <span>🗓️ Platform Events Moderation</span>
          <span className="badge badge-neutral">{events.length}</span>
        </button>
      </div>

      {/* Tab 1: User Management (Requirements 17, 18, 19, 20, 21) */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Platform Users & Access Roles</h2>
            <span className="badge badge-neutral">{users.length} accounts</span>
          </div>

          {users.length > 0 ? (
            <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Department</th>
                    <th>Assigned Role</th>
                    <th>Member Since</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const userId = u._id || u.id;
                    const isUpdating = updatingUserId === userId;
                    const isDeleting = deletingUserId === userId;

                    return (
                      <tr key={userId}>
                        <td>
                          <strong>{u.name}</strong>
                        </td>

                        <td>
                          <a href={`mailto:${u.email}`} style={{ color: 'inherit' }}>
                            {u.email}
                          </a>
                        </td>

                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          {u.department || 'General'}
                        </td>

                        <td>
                          {/* Role Dropdown (Requirements 19 & 20) */}
                          <select
                            className="form-select"
                            style={{
                              padding: '0.35rem 0.65rem',
                              fontSize: '0.8125rem',
                              width: 'auto',
                              fontWeight: 600,
                            }}
                            value={u.role || 'attendee'}
                            onChange={(e) => handleRoleChange(userId, u.name, e.target.value)}
                            disabled={isUpdating || isDeleting}
                            aria-label={`Change role for ${u.name}`}
                          >
                            <option value="attendee">Attendee</option>
                            <option value="organizer">Organizer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>

                        <td style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                          {formatDate(u.createdAt)}
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(userId, u.name)}
                            disabled={isDeleting || isUpdating}
                            title="Delete this user account"
                          >
                            {isDeleting ? 'Deleting...' : '🗑️ Delete'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-6)' }}>
              <EmptyState
                icon="👥"
                title="No Users Registered"
                description="There are currently no registered users on the portal."
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Events Moderation (Requirements 22 & 23) */}
      {activeTab === 'events' && (
        <div className="card">
          <div className="card-header">
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>All Campus Events</h2>
            <span className="badge badge-neutral">{events.length} events</span>
          </div>

          {events.length > 0 ? (
            <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Event Title</th>
                    <th>Category</th>
                    <th>Date & Venue</th>
                    <th>Seats Available</th>
                    <th>Organizer</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt) => {
                    const eventId = evt._id || evt.id;
                    const isDeleting = deletingEventId === eventId;
                    const organizerName =
                      typeof evt.organizer === 'object'
                        ? evt.organizer?.name || 'Faculty Organizer'
                        : evt.organizer || 'Faculty Organizer';

                    return (
                      <tr key={eventId}>
                        <td>
                          <strong>{evt.title}</strong>
                        </td>

                        <td>
                          <CategoryBadge category={evt.category} />
                        </td>

                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{formatDate(evt.date)}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {evt.venue}</div>
                        </td>

                        <td>
                          <div style={{ fontSize: '0.85rem' }}>
                            <strong>{evt.seatsLeft !== undefined ? evt.seatsLeft : evt.capacity}</strong> / {evt.capacity} seats
                          </div>
                        </td>

                        <td style={{ fontSize: '0.8125rem' }}>
                          {organizerName}
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                            <Link to={`/events/${eventId}`} className="btn btn-sm btn-outline">
                              👁️ View
                            </Link>

                            <button
                              type="button"
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteEvent(eventId, evt.title)}
                              disabled={isDeleting}
                              title="Delete event from platform"
                            >
                              {isDeleting ? 'Deleting...' : '🗑️ Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-6)' }}>
              <EmptyState
                icon="📅"
                title="No Events Found"
                description="There are currently no events on the platform."
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
