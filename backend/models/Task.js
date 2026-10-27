const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
