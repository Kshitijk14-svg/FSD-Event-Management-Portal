const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['registered', 'cancelled'],
        message: '{VALUE} is not a valid registration status',
      },
      default: 'registered',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound Unique Index: Prevents duplicate registration records for the same user and event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

// Performance Indexes: Quick lookup of active attendees for an event, or an attendee's registrations
registrationSchema.index({ event: 1, status: 1 });
registrationSchema.index({ user: 1, status: 1 });

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;
