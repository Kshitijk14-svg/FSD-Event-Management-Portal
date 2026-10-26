import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';
import { DEFAULT_EVENT_IMAGE } from '../api/mockEventsAdapter';
import './EventForm.css';

const CATEGORIES = [
  'Technology',
  'Cultural',
  'Workshop',
  'Sports',
  'Academic',
];

function toDatetimeLocal(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
}

/**
 * Reusable EventForm Component
 * Shared between Create Event (/organizer/events/new) and Edit Event (/organizer/events/:id/edit)
 */
export default function EventForm({
  initialValues = {},
  onSubmit,
  submitLabel = 'Save Event',
  cancelPath = '/organizer',
}) {
  const [formData, setFormData] = useState({
    title: initialValues.title || '',
    description: initialValues.description || '',
    category: initialValues.category || 'Technology',
    date: toDatetimeLocal(initialValues.date),
    venue: initialValues.venue || '',
    capacity: initialValues.capacity !== undefined ? String(initialValues.capacity) : '50',
    price: initialValues.price !== undefined ? String(initialValues.price) : '0',
    imageUrl: initialValues.imageUrl || '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (name === 'imageUrl') {
      setPreviewError(false);
    }
  };

  // Comprehensive Form Validation (Requirement 7)
  const validateForm = () => {
    const errors = {};
    const trimmedTitle = formData.title.trim();
    const trimmedDescription = formData.description.trim();
    const trimmedVenue = formData.venue.trim();

    // 1. Required fields & Title length
    if (!trimmedTitle) {
      errors.title = 'Event title is required';
    } else if (trimmedTitle.length < 2 || trimmedTitle.length > 100) {
      errors.title = 'Title must be between 2 and 100 characters';
    }

    if (!trimmedDescription) {
      errors.description = 'Event description is required';
    } else if (trimmedDescription.length < 10) {
      errors.description = 'Description must be at least 10 characters long';
    }

    // 2. Category validation
    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      errors.category = 'Please select a valid event category';
    }

    // 3. Date validation
    if (!formData.date) {
      errors.date = 'Event date and time are required';
    } else {
      const parsedDate = new Date(formData.date);
      if (isNaN(parsedDate.getTime())) {
        errors.date = 'Invalid date and time selected';
      }
    }

    // 4. Venue validation
    if (!trimmedVenue) {
      errors.venue = 'Venue or location is required';
    } else if (trimmedVenue.length < 2) {
      errors.venue = 'Venue must be at least 2 characters';
    }

    // 5. Capacity validation (integer >= 1)
    const capacityNum = Number(formData.capacity);
    if (!formData.capacity || isNaN(capacityNum) || !Number.isInteger(capacityNum) || capacityNum < 1) {
      errors.capacity = 'Capacity must be an integer greater than or equal to 1';
    }

    // 6. Price validation (number >= 0)
    const priceNum = Number(formData.price);
    if (formData.price === '' || isNaN(priceNum) || priceNum < 0) {
      errors.price = 'Price must be a number greater than or equal to 0 (0 for free)';
    }

    // 7. Image URL validation when provided
    if (formData.imageUrl && formData.imageUrl.trim()) {
      const urlPattern = /^(https?:\/\/|\/|data:image\/)/i;
      if (!urlPattern.test(formData.imageUrl.trim())) {
        errors.imageUrl = 'Please enter a valid HTTP/HTTPS image URL or data URI';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!validateForm()) {
      return;
    }

    // Prevent duplicate submissions (Requirement 28)
    if (submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setFormError(err.message || 'Operation failed. Please review your fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeImagePreview = formData.imageUrl?.trim() && !previewError
    ? formData.imageUrl.trim()
    : DEFAULT_EVENT_IMAGE;

  return (
    <div className="event-form-container">
      {formError && (
        <ErrorMessage
          title="Submission Error"
          message={formError}
        />
      )}

      <form onSubmit={handleSubmit} className="event-form-card" noValidate>
        {/* Section 1: Basic Event Information */}
        <h3 className="event-form-section-title">
          <span>📝</span> Basic Event Information
        </h3>

        <div className="form-group">
          <label className="form-label form-label-required" htmlFor="event-title">
            Event Title
          </label>
          <input
            id="event-title"
            name="title"
            type="text"
            className={`form-input ${fieldErrors.title ? 'border-danger' : ''}`}
            placeholder="e.g. Annual Hackathon 2026: Code The Future"
            value={formData.title}
            onChange={handleChange}
            disabled={submitting}
          />
          {fieldErrors.title && (
            <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
              {fieldErrors.title}
            </span>
          )}
        </div>

        <div className="grid grid-2" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label form-label-required" htmlFor="event-category">
              Category
            </label>
            <select
              id="event-category"
              name="category"
              className={`form-select ${fieldErrors.category ? 'border-danger' : ''}`}
              value={formData.category}
              onChange={handleChange}
              disabled={submitting}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {fieldErrors.category && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.category}
              </span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label form-label-required" htmlFor="event-venue">
              Venue / Campus Location
            </label>
            <input
              id="event-venue"
              name="venue"
              type="text"
              className={`form-input ${fieldErrors.venue ? 'border-danger' : ''}`}
              placeholder="e.g. Auditorium Hall 1 & Lab 4"
              value={formData.venue}
              onChange={handleChange}
              disabled={submitting}
            />
            {fieldErrors.venue && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.venue}
              </span>
            )}
          </div>
        </div>

        {/* Section 2: Date, Schedule & Capacity */}
        <h3 className="event-form-section-title" style={{ marginTop: 'var(--space-6)' }}>
          <span>📅</span> Schedule & Capacity
        </h3>

        <div className="grid grid-3" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label form-label-required" htmlFor="event-date">
              Date & Start Time
            </label>
            <input
              id="event-date"
              name="date"
              type="datetime-local"
              className={`form-input ${fieldErrors.date ? 'border-danger' : ''}`}
              value={formData.date}
              onChange={handleChange}
              disabled={submitting}
            />
            {fieldErrors.date && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.date}
              </span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label form-label-required" htmlFor="event-capacity">
              Total Capacity (Seats)
            </label>
            <input
              id="event-capacity"
              name="capacity"
              type="number"
              min="1"
              step="1"
              className={`form-input ${fieldErrors.capacity ? 'border-danger' : ''}`}
              placeholder="e.g. 100"
              value={formData.capacity}
              onChange={handleChange}
              disabled={submitting}
            />
            {fieldErrors.capacity && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.capacity}
              </span>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label form-label-required" htmlFor="event-price">
              Ticket Price ($ USD, 0 for free)
            </label>
            <input
              id="event-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              className={`form-input ${fieldErrors.price ? 'border-danger' : ''}`}
              placeholder="0"
              value={formData.price}
              onChange={handleChange}
              disabled={submitting}
            />
            {fieldErrors.price && (
              <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
                {fieldErrors.price}
              </span>
            )}
          </div>
        </div>

        {/* Section 3: Media & Imagery */}
        <h3 className="event-form-section-title" style={{ marginTop: 'var(--space-6)' }}>
          <span>🖼️</span> Banner Image
        </h3>

        <div className="form-group">
          <label className="form-label" htmlFor="event-image-url">
            Image URL (Optional)
          </label>
          <input
            id="event-image-url"
            name="imageUrl"
            type="url"
            className={`form-input ${fieldErrors.imageUrl ? 'border-danger' : ''}`}
            placeholder="https://images.unsplash.com/photo-..."
            value={formData.imageUrl}
            onChange={handleChange}
            disabled={submitting}
          />
          {fieldErrors.imageUrl ? (
            <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
              {fieldErrors.imageUrl}
            </span>
          ) : (
            <span className="form-hint">
              Provide an image URL for the event banner, or leave blank to use the default portal banner.
            </span>
          )}

          {/* Live Image Preview */}
          <div className="image-preview-container">
            <img
              src={activeImagePreview}
              alt="Event banner preview"
              className="image-preview-img"
              onError={() => setPreviewError(true)}
            />
          </div>
        </div>

        {/* Section 4: Detailed Description */}
        <h3 className="event-form-section-title" style={{ marginTop: 'var(--space-6)' }}>
          <span>📄</span> Detailed Description & Agenda
        </h3>

        <div className="form-group">
          <label className="form-label form-label-required" htmlFor="event-description">
            Event Description
          </label>
          <textarea
            id="event-description"
            name="description"
            rows="6"
            className={`form-textarea ${fieldErrors.description ? 'border-danger' : ''}`}
            placeholder="Provide full event overview, rules, schedule, keynote speakers, eligibility, and perks..."
            value={formData.description}
            onChange={handleChange}
            disabled={submitting}
          />
          {fieldErrors.description && (
            <span className="form-hint" style={{ color: 'var(--color-danger)' }}>
              {fieldErrors.description}
            </span>
          )}
        </div>

        {/* Form Actions */}
        <div className="event-form-actions">
          <Link to={cancelPath} className="btn btn-secondary" tabIndex={submitting ? -1 : 0}>
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Processing...' : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
