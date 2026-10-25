const mongoose = require('mongoose');

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
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'attended', 'cancelled'],
      default: 'confirmed',
      index: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    studentEmail: {
      type: String,
      required: true,
    },
    studentDepartment: {
      type: String,
      default: 'General',
    },
    studentId: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    attendedAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active registrations for the same user and event
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
