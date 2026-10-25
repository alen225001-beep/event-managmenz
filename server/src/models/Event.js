const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed event description'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select event category'],
      enum: [
        'Technical Workshop',
        'Hackathon',
        'Cultural Fest',
        'National Seminar',
        'Sports Tournament',
        'Guest Lecture',
        'Career & Placement',
        'Other',
      ],
      default: 'Technical Workshop',
      index: true,
    },
    venue: {
      type: String,
      required: [true, 'Please specify the campus venue'],
      trim: true,
      maxlength: [150, 'Venue description cannot exceed 150 characters'],
      default: 'Decennial Hall, Main Block',
    },
    date: {
      type: Date,
      required: [true, 'Please select event date'],
      index: true,
    },
    time: {
      type: String,
      required: [true, 'Please specify event timing (e.g. 09:30 AM - 04:30 PM)'],
      trim: true,
      default: '09:30 AM - 04:30 PM',
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please specify registration deadline'],
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify maximum capacity'],
      min: [1, 'Capacity must be at least 1 seat'],
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    bannerImage: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clubName: {
      type: String,
      required: [true, 'Please provide hosting club or student chapter name'],
      trim: true,
      default: 'IEEE Sahrdaya SB',
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
      index: true,
    },
    ticketType: {
      type: String,
      enum: ['free', 'paid'],
      default: 'free',
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    contactEmail: {
      type: String,
      trim: true,
      default: 'events@sahrdaya.ac.in',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '+91 94000 11223',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property: spots remaining
eventSchema.virtual('spotsLeft').get(function () {
  return Math.max(0, this.capacity - this.registeredCount);
});

// Virtual property: is event sold out
eventSchema.virtual('isSoldOut').get(function () {
  return this.registeredCount >= this.capacity;
});

// Compound index for search and category filtering
eventSchema.index({ title: 'text', description: 'text', clubName: 'text', venue: 'text' });

module.exports = mongoose.model('Event', eventSchema);
