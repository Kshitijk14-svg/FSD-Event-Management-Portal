const mongoose = require('mongoose');

const urlRegex = /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?(\?.*)?(#.*)?$/i;

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Tech',
          'Music',
          'Sports',
          'Workshop',
          'Cultural',
          'Business',
          'Other',
        ],
        message: '{VALUE} is not an allowed event category',
      },
    },
    date: {
      type: Date,
      required: [true, 'Event date and time is required'],
    },
    venue: {
      type: String,
      required: [true, 'Venue location is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      validate: {
        validator: function (val) {
          return Number.isInteger(val) && val >= 1;
        },
        message: 'Capacity must be an integer of at least 1',
      },
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator: function (val) {
          if (!val || val.trim() === '') return true;
          return urlRegex.test(val);
        },
        message: 'Image URL must be a valid http or https URL',
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event organizer reference is required'],
      index: true,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: [0, 'Registered count cannot be negative'],
      validate: {
        validator: function (val) {
          // If capacity is defined on this document or being updated
          if (this.capacity !== undefined && val > this.capacity) {
            return false;
          }
          return true;
        },
        message: 'Registered count cannot exceed total capacity',
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: isFull
eventSchema.virtual('isFull').get(function () {
  return this.registeredCount >= this.capacity;
});

// Virtual: seatsLeft
eventSchema.virtual('seatsLeft').get(function () {
  return Math.max(0, this.capacity - this.registeredCount);
});

// Phase D3 Indexes:
// Single field and compound indexes for fast sorting and category filtering
eventSchema.index({ date: 1 });
eventSchema.index({ category: 1, date: 1 });

// Full-text search index across title, description, and venue
eventSchema.index(
  {
    title: 'text',
    description: 'text',
    venue: 'text',
  },
  {
    weights: {
      title: 5,
      venue: 2,
      description: 1,
    },
    name: 'EventTextIndex',
  }
);

// Phase D6: Cascade delete registrations when an event is deleted
eventSchema.pre(['deleteOne', 'findOneAndDelete'], { document: true, query: true }, async function () {
  const query = this.getQuery ? this.getQuery() : { _id: this._id };
  const eventId = query._id || this._id;
  if (eventId) {
    const Registration = mongoose.model('Registration');
    await Registration.deleteMany({ event: eventId });
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
