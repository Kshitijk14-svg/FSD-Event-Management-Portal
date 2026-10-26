import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchEventById } from '../api/events';
import { updateEvent } from '../api/organizer';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import EventForm from '../components/EventForm';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function EditEventPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadEventData() {
      try {
        const data = await fetchEventById(id);
        if (isMounted) {
          setEvent(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load event data for editing');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadEventData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleEditSubmit = async (formData) => {
    const response = await updateEvent(id, formData, user);
    toast.success(
      response.message || `Changes to "${formData.title}" saved successfully!`,
      'Event Updated'
    );
    navigate('/organizer');
  };

  if (loading) {
    return (
      <div className="container container-narrow page-section" style={{ minHeight: '60vh' }}>
        <Loader fullPage size="lg" message="Loading event details for editing..." />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container container-narrow page-section">
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <Link to="/organizer" className="btn btn-sm btn-outline">
            ← Back to Organizer Dashboard
          </Link>
        </div>
        <ErrorMessage
          title="Could Not Load Event"
          message={error || `Event #${id} could not be found.`}
        >
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Link to="/organizer" className="btn btn-sm btn-primary">
              Return to Organizer Dashboard
            </Link>
          </div>
        </ErrorMessage>
      </div>
    );
  }

  return (
    <div className="container container-narrow page-section">
      {/* Navigation Breadcrumb */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <Link to="/organizer" className="btn btn-sm btn-outline">
          ← Back to Organizer Dashboard
        </Link>
      </div>

      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Event #{id}</h1>
          <p className="page-subtitle">
            Update schedule, capacity, venue, or description for <strong>{event.title}</strong>
          </p>
        </div>
      </div>

      {/* Reusable Event Form pre-populated with existing event values */}
      <EventForm
        initialValues={event}
        onSubmit={handleEditSubmit}
        submitLabel="Save Changes"
        cancelPath="/organizer"
      />
    </div>
  );
}
