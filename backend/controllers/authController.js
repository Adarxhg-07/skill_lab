const User = require('../models/User');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, studentId: user.studentId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role = 'student', rollNumber, department, year, skills, bio } = req.body;

    // Basic validation
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in.' });
    }

    let linkedStudentId = null;

    // Student role processing
    if (role === 'student') {
      if (!rollNumber || !rollNumber.trim()) {
        return res.status(400).json({ error: 'Roll number is required for student registration' });
      }

      const cleanRollNumber = rollNumber.trim().toUpperCase();

      // Check if student record exists or create one
      let student = await Student.findOne({
        $or: [{ email: normalizedEmail }, { rollNumber: cleanRollNumber }]
      });

      if (!student) {
        student = await Student.create({
          name: name.trim(),
          email: normalizedEmail,
          rollNumber: cleanRollNumber,
          department: department ? department.trim() : 'Computer Science',
          year: year ? Number(year) : 1,
          skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map(s => s.trim()).filter(Boolean) : []),
          bio: bio ? bio.trim() : ''
        });
      }

      linkedStudentId = student._id;
    }

    // Create user account
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: password, // Pre-save hook will hash this
      role: role === 'mentor' ? 'mentor' : 'student',
      studentId: linkedStudentId,
      department: department ? department.trim() : '',
      rollNumber: rollNumber ? rollNumber.trim().toUpperCase() : ''
    });

    const token = generateToken(user);

    // Fetch linked student profile if applicable
    let studentProfile = null;
    if (linkedStudentId) {
      studentProfile = await Student.findById(linkedStudentId);
    }

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        rollNumber: user.rollNumber,
        studentProfile
      }
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // Invalid email check
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Password comparison check
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    // Fetch student profile if user is a student
    let studentProfile = null;
    if (user.studentId) {
      studentProfile = await Student.findById(user.studentId);
    }

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        rollNumber: user.rollNumber,
        studentProfile
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me (Protected)
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let studentProfile = null;
    if (user.studentId) {
      studentProfile = await Student.findById(user.studentId);
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        department: user.department,
        rollNumber: user.rollNumber,
        studentProfile
      }
    });
  } catch (err) {
    next(err);
  }
};
