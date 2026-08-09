import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event reference is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    ticketCode: {
      type: String,
      required: [true, 'Ticket code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['confirmed', 'cancelled', 'attended'],
        message: '{VALUE} is not a valid registration status',
      },
      default: 'confirmed',
    },
    checkedInAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index to prevent duplicate registrations for the same event by the same user
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

// Pre-save hook to ensure ticketCode is capitalized and trimmed
registrationSchema.pre('save', function (next) {
  if (this.ticketCode) {
    this.ticketCode = this.ticketCode.toUpperCase().trim();
  }
  next();
});

export const Registration = mongoose.model('Registration', registrationSchema);
export default Registration;
