const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?sahrdaya\.ac\.in$|^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid college email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'organizer', 'admin'],
      default: 'student',
    },
    department: {
      type: String,
      required: [true, 'Please select your academic department'],
      enum: [
        'Computer Science & Engineering',
        'Biomedical Engineering',
        'Electronics & Communication Engineering',
        'Biotechnology',
        'Civil Engineering',
        'Electrical & Electronics Engineering',
        'Artificial Intelligence & Data Science',
        'General Administration',
      ],
      default: 'Computer Science & Engineering',
    },
    studentId: {
      type: String,
      trim: true,
      default: function () {
        return this.email ? this.email.split('@')[0] : '';
      },
    },
    phone: {
      type: String,
      trim: true,
      default: '+91 94000 00000',
    },
    clubName: {
      type: String,
      trim: true,
      default: '', // e.g. "IEEE Sahrdaya SB", "IEDC", "CSI Student Chapter"
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare candidate password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
