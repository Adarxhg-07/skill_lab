const Task = require('../models/Task');

// GET /api/tasks - List all (filter by status, studentId)
exports.getTasks = async (req, res, next) => {
  try {
    const { status, studentId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (studentId) filter.studentId = studentId;

    const tasks = await Task.find(filter)
      .populate('studentId', 'name rollNumber')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const mongoose = require('mongoose');
const Student = require('../models/Student');

// GET /api/students/:id/tasks - Tasks for specific student
exports.getStudentTasks = async (req, res, next) => {
  try {
    let studentId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      const student = await Student.findOne({ rollNumber: studentId });
      if (student) studentId = student._id;
      else return res.json([]);
    }
    const tasks = await Task.find({ studentId }).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks - Create
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    const populated = await Task.findById(task._id).populate('studentId', 'name rollNumber');
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id - Update (status, priority, etc.)
exports.updateTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('studentId', 'name rollNumber');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
