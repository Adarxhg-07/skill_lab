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

/* --- Students --- */

async function fetchStudents(params = {}) {
  if (await checkBackend()) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/students?${query}`);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
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
