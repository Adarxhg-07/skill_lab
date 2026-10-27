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

// GET /api/students/:id/tasks - Tasks for specific student
exports.getStudentTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ studentId: req.params.id })
      .sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

// POST /api/tasks - Create
exports.createTask = async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/tasks/:id - Update (status, priority, etc.)
exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};
