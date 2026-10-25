const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
      maxlength: [1500, 'Description cannot exceed 1500 characters'],
    },
    type: {
      type: String,
      enum: {
        values: ['LOST', 'FOUND'],
        message: 'Type must be either LOST or FOUND',
      },
      required: [true, 'Please specify whether the item is LOST or FOUND'],
      index: true,
    },
    category: {
      type: String,
      enum: {
        values: [
          'ELECTRONICS',
          'ID_CARDS_DOCUMENTS',
          'BOOKS_STATIONERY',
          'KEYS',
          'CLOTHING_ACCESSORIES',
          'BAGS_WALLETS',
          'SPORTS_EQUIPMENT',
          'OTHER',
        ],
        message: '{VALUE} is not a supported category',
      },
      required: [true, 'Category is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['REPORTED', 'CLAIM_PENDING', 'RETURNED', 'ARCHIVED'],
        message: '{VALUE} is not a valid status',
      },
      default: 'REPORTED',
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Campus location is required'],
      trim: true,
      maxlength: [150, 'Location description cannot exceed 150 characters'],
    },
    dateLostOrFound: {
      type: Date,
      required: [true, 'Date when item was lost or found is required'],
      default: Date.now,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter user ID is required'],
      index: true,
    },
    custodyLocation: {
      type: String,
      trim: true,
      default: 'With Finder / Security Office',
    },
    distinguishingMarks: {
      type: String,
      trim: true,
      default: '',
    },
    contactEmail: {
      type: String,
      trim: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for campus keyword search
itemSchema.index({ title: 'text', description: 'text', location: 'text' });
// Compound index for frequent feed queries
itemSchema.index({ type: 1, status: 1, createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);
