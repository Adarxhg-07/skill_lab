const Student = require('../models/Student');
const Task = require('../models/Task');

// GET /api/students - List all (search, filter, paginate)
exports.getStudents = async (req, res, next) => {
  try {
    const { search, department, year, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { rollNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) filter.department = department;
    if (year) filter.year = Number(year);

    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(students);
  } catch (err) {
    next(err);
  }
};

const mongoose = require('mongoose');

// GET /api/students/:id - Single student
exports.getStudent = async (req, res, next) => {
  try {
    let student = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      student = await Student.findById(req.params.id);
    }
    if (!student) {
      student = await Student.findOne({ rollNumber: req.params.id });
    }
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

// POST /api/students - Create
exports.createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    next(err);
  }
};

// PUT /api/students/:id - Update
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/students/:id - Delete + cascade tasks
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    await Task.deleteMany({ studentId: req.params.id });
    res.json({ message: 'Student and associated tasks deleted' });
  } catch (err) {
    next(err);
  }
};
