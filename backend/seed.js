const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Student = require('./models/Student');
const Task = require('./models/Task');
const User = require('./models/User');

const students = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@edusphere.edu',
    rollNumber: 'CS2024001',
    department: 'Computer Science',
    year: 2,
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    bio: 'Passionate about web development and open-source. Built three full-stack projects and contributed to Mozilla Firefox.',
    socialLinks: { github: 'https://github.com/aaravsharma', linkedin: 'https://linkedin.com/in/aaravsharma', email: 'aarav.sharma@edusphere.edu' }
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@edusphere.edu',
    rollNumber: 'CS2024002',
    department: 'Computer Science',
    year: 3,
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    bio: 'Backend engineer at heart. Interned at Flipkart and built scalable microservices.',
    socialLinks: { github: 'https://github.com/priyapatel', linkedin: 'https://linkedin.com/in/priyapatel', email: 'priya.patel@edusphere.edu' }
  },
  {
    name: 'Rohit Kumar',
    email: 'rohit.kumar@edusphere.edu',
    rollNumber: 'EC2024001',
    department: 'Electronics',
    year: 2,
    skills: ['C++', 'Arduino', 'MATLAB', 'PCB Design'],
    bio: 'Embedded systems enthusiast. Won Smart India Hackathon 2024.',
    socialLinks: { github: 'https://github.com/rohitkumar', linkedin: 'https://linkedin.com/in/rohitkumar', email: 'rohit.kumar@edusphere.edu' }
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@edusphere.edu',
    rollNumber: 'IS2024001',
    department: 'Information Science',
    year: 4,
    skills: ['Java', 'Spring Boot', 'AWS', 'Kubernetes'],
    bio: 'Cloud and DevOps focused. AWS Certified Solutions Architect.',
    socialLinks: { github: 'https://github.com/snehareddy', linkedin: 'https://linkedin.com/in/snehareddy', email: 'sneha.reddy@edusphere.edu' }
  },
  {
    name: 'Arjun Nair',
    email: 'arjun.nair@edusphere.edu',
    rollNumber: 'AI2024001',
    department: 'AI & ML',
    year: 3,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision'],
    bio: 'ML researcher. Published at IEEE Conference 2024.',
    socialLinks: { github: 'https://github.com/arjunnair', linkedin: 'https://linkedin.com/in/arjunnair', email: 'arjun.nair@edusphere.edu' }
  },
  {
    name: 'Kavya Iyer',
    email: 'kavya.iyer@edusphere.edu',
    rollNumber: 'CS2024003',
    department: 'Computer Science',
    year: 2,
    skills: ['JavaScript', 'Vue.js', 'Figma', 'UI/UX'],
    bio: 'Frontend developer and designer. Builds intuitive interfaces.',
    socialLinks: { github: 'https://github.com/kavyaiyer', linkedin: 'https://linkedin.com/in/kavyaiyer', email: 'kavya.iyer@edusphere.edu' }
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@edusphere.edu',
    rollNumber: 'ME2024001',
    department: 'Mechanical',
    year: 3,
    skills: ['AutoCAD', 'SolidWorks', 'Python', '3D Printing'],
    bio: 'Mechanical engineer building CAD automation tools.',
    socialLinks: { github: 'https://github.com/vikramsingh', linkedin: 'https://linkedin.com/in/vikramsingh', email: 'vikram.singh@edusphere.edu' }
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@edusphere.edu',
    rollNumber: 'AI2024002',
    department: 'AI & ML',
    year: 2,
    skills: ['Python', 'NLP', 'Hugging Face', 'Data Science'],
    bio: 'NLP enthusiast working on multilingual language models.',
    socialLinks: { github: 'https://github.com/meerajoshi', linkedin: 'https://linkedin.com/in/meerajoshi', email: 'meera.joshi@edusphere.edu' }
  }
];

async function seed() {
  await connectDB();

  // Clear existing data
  await Student.deleteMany({});
  await Task.deleteMany({});
  await User.deleteMany({});
  console.log('Cleared existing data');

  // Insert students
  const inserted = await Student.insertMany(students);
  console.log(`Inserted ${inserted.length} students`);

  // Insert demo user accounts
  const demoUsers = [
    {
      name: 'Dr. Vikram Sarabhai (Mentor)',
      email: 'mentor@edusphere.edu',
      password: 'password123',
      role: 'mentor'
    },
    {
      name: 'Aarav Sharma',
      email: 'aarav.sharma@edusphere.edu',
      password: 'password123',
      role: 'student',
      studentId: inserted[0]._id,
      rollNumber: 'CS2024001',
      department: 'Computer Science'
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@edusphere.edu',
      password: 'password123',
      role: 'student',
      studentId: inserted[1]._id,
      rollNumber: 'CS2024002',
      department: 'Computer Science'
    }
  ];

  for (const u of demoUsers) {
    await User.create(u);
  }
  console.log('Inserted default demo user accounts (Mentor & Students)');

  // Create tasks referencing real student IDs
  const tasks = [
    { title: 'Complete DBMS Assignment', description: 'Normalize relational schema to 3NF with ER diagrams.', dueDate: '2024-11-05', priority: 'high', status: 'in-progress', studentId: inserted[0]._id },
    { title: 'Build REST API with Express', description: 'CRUD REST API with error handling middleware.', dueDate: '2024-11-10', priority: 'high', status: 'todo', studentId: inserted[0]._id },
    { title: 'Django Blog Application', description: 'Blog with auth, comments, and markdown support.', dueDate: '2024-11-08', priority: 'medium', status: 'done', studentId: inserted[1]._id },
    { title: 'Arduino Weather Station', description: 'Temperature, humidity sensors with ThingSpeak dashboard.', dueDate: '2024-11-12', priority: 'medium', status: 'in-progress', studentId: inserted[2]._id },
    { title: 'AWS Deployment Lab', description: 'Deploy Spring Boot on ECS with load balancing.', dueDate: '2024-11-03', priority: 'high', status: 'done', studentId: inserted[3]._id },
    { title: 'Computer Vision Project', description: 'Train YOLOv8 on Indian road sign dataset.', dueDate: '2024-11-20', priority: 'high', status: 'in-progress', studentId: inserted[4]._id },
    { title: 'Portfolio Website', description: 'Personal portfolio with HTML, CSS, JavaScript.', dueDate: '2024-10-28', priority: 'low', status: 'done', studentId: inserted[5]._id },
    { title: 'Prepare DSA Questions', description: 'Solve 50 LeetCode problems on arrays, trees, graphs.', dueDate: '2024-11-30', priority: 'medium', status: 'todo', studentId: inserted[1]._id },
    { title: 'CAD Assembly Project', description: 'Gear train in SolidWorks with motion analysis.', dueDate: '2024-11-15', priority: 'medium', status: 'todo', studentId: inserted[6]._id },
    { title: 'NLP Sentiment Analyzer', description: 'Hindi tweet sentiment using Hugging Face transformers.', dueDate: '2024-11-18', priority: 'high', status: 'in-progress', studentId: inserted[7]._id },
    { title: 'MongoDB Schema Design', description: 'Efficient schemas with indexing for capstone project.', dueDate: '2024-11-02', priority: 'medium', status: 'done', studentId: inserted[0]._id },
    { title: 'React Component Library', description: 'Reusable button, modal, form components.', dueDate: '2024-11-22', priority: 'low', status: 'todo', studentId: inserted[5]._id },
    { title: 'PCB Layout Design', description: 'Two-layer PCB for IoT module in KiCad.', dueDate: '2024-11-25', priority: 'medium', status: 'todo', studentId: inserted[2]._id },
    { title: 'Docker Compose Setup', description: 'Containerize microservices with Redis and Nginx.', dueDate: '2024-11-08', priority: 'low', status: 'done', studentId: inserted[3]._id },
    { title: 'Research Paper Review', description: 'Review transformer architecture papers for lab seminar.', dueDate: '2024-11-01', priority: 'low', status: 'done', studentId: inserted[4]._id }
  ];

  await Task.insertMany(tasks);
  console.log(`Inserted ${tasks.length} tasks`);
  console.log('Seed complete');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
