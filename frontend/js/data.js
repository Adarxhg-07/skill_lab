/* ========================================
   MOCK DATA
   App works without backend using this data.
   JSON format matches MongoDB schema exactly.
   ======================================== */

const AVATAR_COLORS = [
  '#264653', '#2a9d8f', '#606c38', '#bc6c25',
  '#6d6875', '#e76f51', '#457b9d', '#1d3557'
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const MOCK_STUDENTS = [
  {
    _id: 'STU001',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@edusphere.edu',
    rollNumber: 'CS2024001',
    department: 'Computer Science',
    year: 2,
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    bio: 'Passionate about web development and open-source. Built three full-stack projects and contributed to Mozilla Firefox.',
    socialLinks: {
      github: 'https://github.com/aaravsharma',
      linkedin: 'https://linkedin.com/in/aaravsharma',
      email: 'aarav.sharma@edusphere.edu'
    },
    createdAt: '2024-08-15T10:00:00Z'
  },
  {
    _id: 'STU002',
    name: 'Priya Patel',
    email: 'priya.patel@edusphere.edu',
    rollNumber: 'CS2024002',
    department: 'Computer Science',
    year: 3,
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker'],
    bio: 'Backend engineer at heart. Interned at Flipkart and built scalable microservices handling 10k requests per second.',
    socialLinks: {
      github: 'https://github.com/priyapatel',
      linkedin: 'https://linkedin.com/in/priyapatel',
      email: 'priya.patel@edusphere.edu'
    },
    createdAt: '2024-08-16T10:00:00Z'
  },
  {
    _id: 'STU003',
    name: 'Rohit Kumar',
    email: 'rohit.kumar@edusphere.edu',
    rollNumber: 'EC2024001',
    department: 'Electronics',
    year: 2,
    skills: ['C++', 'Arduino', 'MATLAB', 'PCB Design'],
    bio: 'Embedded systems enthusiast. Won Smart India Hackathon 2024 with an IoT-based water quality monitor.',
    socialLinks: {
      github: 'https://github.com/rohitkumar',
      linkedin: 'https://linkedin.com/in/rohitkumar',
      email: 'rohit.kumar@edusphere.edu'
    },
    createdAt: '2024-08-17T10:00:00Z'
  },
  {
    _id: 'STU004',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@edusphere.edu',
    rollNumber: 'IS2024001',
    department: 'Information Science',
    year: 4,
    skills: ['Java', 'Spring Boot', 'AWS', 'Kubernetes'],
    bio: 'Cloud and DevOps focused. AWS Certified Solutions Architect. Building infrastructure tools for startups.',
    socialLinks: {
      github: 'https://github.com/snehareddy',
      linkedin: 'https://linkedin.com/in/snehareddy',
      email: 'sneha.reddy@edusphere.edu'
    },
    createdAt: '2024-08-18T10:00:00Z'
  },
  {
    _id: 'STU005',
    name: 'Arjun Nair',
    email: 'arjun.nair@edusphere.edu',
    rollNumber: 'AI2024001',
    department: 'AI & ML',
    year: 3,
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Computer Vision'],
    bio: 'Machine learning researcher. Published a paper on real-time object detection at IEEE Conference 2024.',
    socialLinks: {
      github: 'https://github.com/arjunnair',
      linkedin: 'https://linkedin.com/in/arjunnair',
      email: 'arjun.nair@edusphere.edu'
    },
    createdAt: '2024-09-01T10:00:00Z'
  },
  {
    _id: 'STU006',
    name: 'Kavya Iyer',
    email: 'kavya.iyer@edusphere.edu',
    rollNumber: 'CS2024003',
    department: 'Computer Science',
    year: 2,
    skills: ['JavaScript', 'Vue.js', 'Figma', 'UI/UX'],
    bio: 'Frontend developer and designer. Believes in building interfaces that feel invisible and intuitive.',
    socialLinks: {
      github: 'https://github.com/kavyaiyer',
      linkedin: 'https://linkedin.com/in/kavyaiyer',
      email: 'kavya.iyer@edusphere.edu'
    },
    createdAt: '2024-09-05T10:00:00Z'
  },
  {
    _id: 'STU007',
    name: 'Vikram Singh',
    email: 'vikram.singh@edusphere.edu',
    rollNumber: 'ME2024001',
    department: 'Mechanical',
    year: 3,
    skills: ['AutoCAD', 'SolidWorks', 'Python', '3D Printing'],
    bio: 'Mechanical engineer with a software twist. Building CAD automation tools and robotics prototypes.',
    socialLinks: {
      github: 'https://github.com/vikramsingh',
      linkedin: 'https://linkedin.com/in/vikramsingh',
      email: 'vikram.singh@edusphere.edu'
    },
    createdAt: '2024-09-10T10:00:00Z'
  },
  {
    _id: 'STU008',
    name: 'Meera Joshi',
    email: 'meera.joshi@edusphere.edu',
    rollNumber: 'AI2024002',
    department: 'AI & ML',
    year: 2,
    skills: ['Python', 'NLP', 'Hugging Face', 'Data Science'],
    bio: 'NLP enthusiast working on multilingual language models for Indian regional languages.',
    socialLinks: {
      github: 'https://github.com/meerajoshi',
      linkedin: 'https://linkedin.com/in/meerajoshi',
      email: 'meera.joshi@edusphere.edu'
    },
    createdAt: '2024-09-12T10:00:00Z'
  }
];

const MOCK_TASKS = [
  {
    _id: 'TSK001',
    title: 'Complete DBMS Assignment',
    description: 'Normalize the given relational schema to 3NF and submit ER diagrams with proper cardinality notations.',
    dueDate: '2024-11-05',
    priority: 'high',
    status: 'in-progress',
    studentId: 'STU001',
    createdAt: '2024-10-01T10:00:00Z'
  },
  {
    _id: 'TSK002',
    title: 'Build REST API with Express',
    description: 'Create a complete CRUD REST API using Node.js and Express with proper error handling middleware.',
    dueDate: '2024-11-10',
    priority: 'high',
    status: 'todo',
    studentId: 'STU001',
    createdAt: '2024-10-02T10:00:00Z'
  },
  {
    _id: 'TSK003',
    title: 'Django Blog Application',
    description: 'Build a full-featured blog with user authentication, comments, and markdown support.',
    dueDate: '2024-11-08',
    priority: 'medium',
    status: 'done',
    studentId: 'STU002',
    createdAt: '2024-10-03T10:00:00Z'
  },
  {
    _id: 'TSK004',
    title: 'Arduino Weather Station',
    description: 'Assemble temperature, humidity, and pressure sensors. Upload readings to ThingSpeak dashboard.',
    dueDate: '2024-11-12',
    priority: 'medium',
    status: 'in-progress',
    studentId: 'STU003',
    createdAt: '2024-10-04T10:00:00Z'
  },
  {
    _id: 'TSK005',
    title: 'AWS Deployment Lab',
    description: 'Deploy a containerized Spring Boot application on AWS ECS with load balancing and auto-scaling.',
    dueDate: '2024-11-03',
    priority: 'high',
    status: 'done',
    studentId: 'STU004',
    createdAt: '2024-10-05T10:00:00Z'
  },
  {
    _id: 'TSK006',
    title: 'Computer Vision Project',
    description: 'Train a YOLOv8 model to detect traffic signs from the Indian road sign dataset with 90%+ mAP.',
    dueDate: '2024-11-20',
    priority: 'high',
    status: 'in-progress',
    studentId: 'STU005',
    createdAt: '2024-10-06T10:00:00Z'
  },
  {
    _id: 'TSK007',
    title: 'Portfolio Website',
    description: 'Design and develop a personal portfolio using HTML, CSS, and JavaScript with responsive layout.',
    dueDate: '2024-10-28',
    priority: 'low',
    status: 'done',
    studentId: 'STU006',
    createdAt: '2024-10-07T10:00:00Z'
  },
  {
    _id: 'TSK008',
    title: 'Prepare DSA Questions',
    description: 'Solve 50 LeetCode problems covering arrays, trees, graphs, and dynamic programming.',
    dueDate: '2024-11-30',
    priority: 'medium',
    status: 'todo',
    studentId: 'STU002',
    createdAt: '2024-10-08T10:00:00Z'
  },
  {
    _id: 'TSK009',
    title: 'CAD Assembly Project',
    description: 'Model a complete gear train assembly in SolidWorks with proper constraints and motion analysis.',
    dueDate: '2024-11-15',
    priority: 'medium',
    status: 'todo',
    studentId: 'STU007',
    createdAt: '2024-10-09T10:00:00Z'
  },
  {
    _id: 'TSK010',
    title: 'NLP Sentiment Analyzer',
    description: 'Build a sentiment analysis pipeline for Hindi tweets using Hugging Face transformers.',
    dueDate: '2024-11-18',
    priority: 'high',
    status: 'in-progress',
    studentId: 'STU008',
    createdAt: '2024-10-10T10:00:00Z'
  },
  {
    _id: 'TSK011',
    title: 'MongoDB Schema Design',
    description: 'Design efficient schemas with proper indexing for the student management system capstone project.',
    dueDate: '2024-11-02',
    priority: 'medium',
    status: 'done',
    studentId: 'STU001',
    createdAt: '2024-10-11T10:00:00Z'
  },
  {
    _id: 'TSK012',
    title: 'React Component Library',
    description: 'Create reusable button, modal, and form components with proper prop validation and documentation.',
    dueDate: '2024-11-22',
    priority: 'low',
    status: 'todo',
    studentId: 'STU006',
    createdAt: '2024-10-12T10:00:00Z'
  },
  {
    _id: 'TSK013',
    title: 'PCB Layout Design',
    description: 'Design a two-layer PCB for the IoT sensor module using KiCad with proper ground planes.',
    dueDate: '2024-11-25',
    priority: 'medium',
    status: 'todo',
    studentId: 'STU003',
    createdAt: '2024-10-13T10:00:00Z'
  },
  {
    _id: 'TSK014',
    title: 'Docker Compose Setup',
    description: 'Containerize the microservices architecture with Docker Compose including Redis cache and Nginx.',
    dueDate: '2024-11-08',
    priority: 'low',
    status: 'done',
    studentId: 'STU004',
    createdAt: '2024-10-14T10:00:00Z'
  },
  {
    _id: 'TSK015',
    title: 'Research Paper Review',
    description: 'Review and summarize three recent papers on transformer architectures for the weekly lab seminar.',
    dueDate: '2024-11-01',
    priority: 'low',
    status: 'done',
    studentId: 'STU005',
    createdAt: '2024-10-15T10:00:00Z'
  }
];

/* Departments for filter dropdowns */
const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Information Science',
  'AI & ML',
  'Mechanical'
];

const YEARS = [1, 2, 3, 4];
