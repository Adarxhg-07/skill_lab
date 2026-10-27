const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  rollNumber: {
    type: String,
    required: [true, 'Roll number is required'],
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: 1,
    max: 4
  },
  skills: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    email: { type: String, default: '' }
  }
}, {
  timestamps: true
});

// Index for search
studentSchema.index({ name: 'text', rollNumber: 'text' });

module.exports = mongoose.model('Student', studentSchema);
