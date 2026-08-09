import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, 'Event slug is required'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['tech', 'cultural', 'sports', 'workshop', 'seminar', 'other'],
        message: '{VALUE} is not a valid category',
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organizer is required'],
      index: true,
    },
    venue: {
      name: { type: String, required: [true, 'Venue name is required'], trim: true },
      address: { type: String, trim: true },
      city: { type: String, required: [true, 'Venue city is required'], trim: true },
    },
    startAt: {
      type: Date,
      required: [true, 'Start date and time is required'],
    },
    endAt: {
      type: Date,
      required: [true, 'End date and time is required'],
      validate: {
        validator: function (value) {
          if (this.startAt && value) {
            return value > this.startAt;
          }
          return true;
        },
        message: 'endAt date ({VALUE}) must be strictly after startAt date',
      },
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    seatsBooked: {
      type: Number,
      default: 0,
      min: [0, 'seatsBooked cannot be negative'],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, 'Price cannot be negative'],
    },
    bannerUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'pending', 'published', 'rejected', 'cancelled'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property for remaining seats calculation
eventSchema.virtual('seatsRemaining').get(function () {
  if (typeof this.capacity === 'number' && typeof this.seatsBooked === 'number') {
    return Math.max(0, this.capacity - this.seatsBooked);
  }
  return undefined;
});

// Indexes to speed up queries
eventSchema.index({ category: 1, status: 1, startAt: 1 });
eventSchema.index({ status: 1, isDeleted: 1 });

export const Event = mongoose.model('Event', eventSchema);
export default Event;
