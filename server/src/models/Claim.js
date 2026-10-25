const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item ID is required for a claim'],
      index: true,
    },
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Claimant user ID is required'],
      index: true,
    },
    proofDescription: {
      type: String,
      required: [
        true,
        'Please describe proof of ownership (e.g., serial number, unique stickers, wallpaper, identifying marks, contents)',
      ],
      trim: true,
      minlength: [10, 'Proof description must be at least 10 characters'],
      maxlength: [1000, 'Proof description cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['PENDING', 'APPROVED', 'REJECTED'],
        message: '{VALUE} is not a valid claim status',
      },
      default: 'PENDING',
      index: true,
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewNotes: {
      type: String,
      trim: true,
      default: '',
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending claims from the same claimant on the same item
claimSchema.index({ item: 1, claimant: 1, status: 1 });

module.exports = mongoose.model('Claim', claimSchema);
