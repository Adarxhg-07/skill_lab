const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/students');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/tasks', taskRoutes);

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'EduSphere API is running', version: '1.0.0' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`EduSphere API running on http://localhost:${PORT}`);
});
