/* ========================================
   API LAYER
   Tries backend first, falls back to mock data.
   ======================================== */

const API_BASE = 'http://localhost:3000/api';
let isBackendAvailable = null;

async function checkBackend() {
  if (isBackendAvailable !== null) return isBackendAvailable;
  try {
    const res = await fetch(API_BASE + '/students', { signal: AbortSignal.timeout(1500) });
    isBackendAvailable = res.ok;
  } catch {
    isBackendAvailable = false;
  }
  return isBackendAvailable;
}

/* --- Authentication --- */

function getAuthToken() {
  return localStorage.getItem('edusphere_token');
}

function getCurrentUser() {
  try {
    const raw = localStorage.getItem('edusphere_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setAuthSession(token, user) {
  if (token) localStorage.setItem('edusphere_token', token);
  if (user) localStorage.setItem('edusphere_user', JSON.stringify(user));
}

function clearAuthSession() {
  localStorage.removeItem('edusphere_token');
  localStorage.removeItem('edusphere_user');
}

async function loginUser(email, password) {
  if (await checkBackend()) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid email or password');
    }
    setAuthSession(data.token, data.user);
    return data;
  }

  // Mock Fallback Auth
  const em = (email || '').toLowerCase().trim();
  if (em === 'mentor@edusphere.edu' && password === 'password123') {
    const user = {
      _id: 'usr_mentor_01',
      name: 'Dr. Vikram Sarabhai',
      email: 'mentor@edusphere.edu',
      role: 'mentor'
    };
    setAuthSession('mock_jwt_token_mentor', user);
    return { token: 'mock_jwt_token_mentor', user };
  } else if ((em === 'aarav.sharma@edusphere.edu' || em === 'aarav@edusphere.edu') && password === 'password123') {
    const student = (typeof MOCK_STUDENTS !== 'undefined' && MOCK_STUDENTS[0]) || { _id: 'STU001', name: 'Aarav Sharma', rollNumber: 'CS2024001', department: 'Computer Science' };
    const user = {
      _id: 'usr_student_01',
      name: student.name,
      email: student.email,
      role: 'student',
      studentId: student._id,
      rollNumber: student.rollNumber,
      department: student.department,
      studentProfile: student
    };
    setAuthSession('mock_jwt_token_student', user);
    return { token: 'mock_jwt_token_student', user };
  } else {
    throw new Error('Invalid email or password');
  }
}

async function registerUser(userData) {
  if (await checkBackend()) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register account');
    }
    setAuthSession(data.token, data.user);
    return data;
  }

  // Mock Registration Fallback
  const role = userData.role || 'student';
  let student = null;
  if (role === 'student' && typeof MOCK_STUDENTS !== 'undefined') {
    student = {
      _id: 'STU' + String(MOCK_STUDENTS.length + 1).padStart(3, '0'),
      name: userData.name,
      email: userData.email,
      rollNumber: userData.rollNumber || 'STU' + (MOCK_STUDENTS.length + 1),
      department: userData.department || 'Computer Science',
      year: Number(userData.year) || 1,
      skills: userData.skills || [],
      bio: userData.bio || '',
      createdAt: new Date().toISOString()
    };
    MOCK_STUDENTS.push(student);
  }

  const user = {
    _id: 'usr_' + Date.now(),
    name: userData.name,
    email: userData.email,
    role: role,
    studentId: student ? student._id : null,
    rollNumber: userData.rollNumber || '',
    department: userData.department || '',
    studentProfile: student
  };
  setAuthSession('mock_jwt_token_' + Date.now(), user);
  return { token: 'mock_jwt_token', user };
}

function logoutUser() {
  clearAuthSession();
  window.location.reload();
}

/* --- Students --- */

async function fetchStudents(params = {}) {
  if (await checkBackend()) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/students?${query}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    const data = await res.json();
    if (typeof setStudentsCache === 'function') setStudentsCache(data);
    return data;
  }
  // Mock fallback
  let students = [...MOCK_STUDENTS];
  if (params.search) {
    const s = params.search.toLowerCase();
    students = students.filter(st =>
      st.name.toLowerCase().includes(s) ||
      st.rollNumber.toLowerCase().includes(s)
    );
  }
  if (params.department) {
    students = students.filter(st => st.department === params.department);
  }
  if (params.year) {
    students = students.filter(st => st.year === Number(params.year));
  }
  if (typeof setStudentsCache === 'function') setStudentsCache(students);
  return students;
}

async function fetchStudent(id) {
  if (await checkBackend()) {
    const res = await fetch(`${API_BASE}/students/${id}`);
    if (!res.ok) throw new Error('Student not found');
    return res.json();
  }
  return MOCK_STUDENTS.find(s => s._id === id) || null;
}

async function createStudent(data) {
  if (await checkBackend()) {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create student');
    }
    return res.json();
  }
  // Mock fallback
  const student = {
    _id: 'STU' + String(MOCK_STUDENTS.length + 1).padStart(3, '0'),
    ...data,
    createdAt: new Date().toISOString()
  };
  MOCK_STUDENTS.push(student);
  return student;
}

async function updateStudent(id, data) {
  if (await checkBackend()) {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update student');
    }
    return res.json();
  }
  // Mock fallback
  const idx = MOCK_STUDENTS.findIndex(s => s._id === id);
  if (idx === -1) throw new Error('Student not found');
  MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], ...data };
  return MOCK_STUDENTS[idx];
}

async function deleteStudent(id) {
  if (await checkBackend()) {
    const res = await fetch(`${API_BASE}/students/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete student');
    return res.json();
  }
  // Mock fallback
  const idx = MOCK_STUDENTS.findIndex(s => s._id === id);
  if (idx === -1) throw new Error('Student not found');
  MOCK_STUDENTS.splice(idx, 1);
  // Also remove their tasks
  for (let i = MOCK_TASKS.length - 1; i >= 0; i--) {
    if (MOCK_TASKS[i].studentId === id) MOCK_TASKS.splice(i, 1);
  }
  return { message: 'Deleted' };
}

/* --- Tasks --- */

async function fetchTasks(params = {}) {
  if (await checkBackend()) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/tasks?${query}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  }
  let tasks = [...MOCK_TASKS];
  if (params.status) {
    tasks = tasks.filter(t => t.status === params.status);
  }
  if (params.studentId) {
    tasks = tasks.filter(t => t.studentId === params.studentId);
  }
  return tasks;
}

async function createTask(data) {
  if (await checkBackend()) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create task');
    }
    return res.json();
  }
  const task = {
    _id: 'TSK' + String(MOCK_TASKS.length + 1).padStart(3, '0'),
    ...data,
    createdAt: new Date().toISOString()
  };
  MOCK_TASKS.push(task);
  return task;
}

async function updateTask(id, data) {
  if (await checkBackend()) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update task');
    }
    return res.json();
  }
  const idx = MOCK_TASKS.findIndex(t => t._id === id);
  if (idx === -1) throw new Error('Task not found');
  MOCK_TASKS[idx] = { ...MOCK_TASKS[idx], ...data };
  return MOCK_TASKS[idx];
}

async function deleteTask(id) {
  if (await checkBackend()) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
    return res.json();
  }
  const idx = MOCK_TASKS.findIndex(t => t._id === id);
  if (idx === -1) throw new Error('Task not found');
  MOCK_TASKS.splice(idx, 1);
  return { message: 'Deleted' };
}

async function fetchStudentTasks(studentId) {
  return fetchTasks({ studentId });
}
