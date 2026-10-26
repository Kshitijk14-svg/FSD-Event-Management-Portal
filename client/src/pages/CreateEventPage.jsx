import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createEvent } from '../api/organizer';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import EventForm from '../components/EventForm';

export default function CreateEventPage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleCreateSubmit = async (formData) => {
    const response = await createEvent(formData, user);
    toast.success(
      response.message || `Event "${formData.title}" has been published!`,
      'Event Created'
    );
    navigate('/organizer');
  };

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
          <h1 className="page-title">Create New Event</h1>
          <p className="page-subtitle">
            Publish a workshop, hackathon, competition, or seminar for the student community
          </p>
        </div>
      </div>

      {/* Reusable Event Form */}
      <EventForm
        initialValues={{
          title: '',
          category: 'Technology',
          date: '',
          venue: '',
          capacity: '50',
          price: '0',
          imageUrl: '',
          description: '',
        }}
        onSubmit={handleCreateSubmit}
        submitLabel="Publish Event"
        cancelPath="/organizer"
      />
    </div>
  );
}
