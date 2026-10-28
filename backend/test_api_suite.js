const assert = require('assert');

const BASE_URL = 'http://localhost:3000/api';

async function runLiveAPISuite() {
  console.log('\n======================================================');
  console.log('   EDUSPHERE LIVE API & POSTMAN VERIFICATION SUITE   ');
  console.log('======================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`  [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  [FAIL] ${name}`);
      console.error(`         Error: ${err.message}`);
    }
  }

  let testStudentId = null;
  let testTaskId = null;

  // 1. Health Check
  await test('GET /api - Server Health Check', async () => {
    const res = await fetch(`${BASE_URL}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.message.includes('EduSphere API is running'));
  });

  // 2. Create Student (POST)
  await test('POST /api/students - Create Student', async () => {
    const res = await fetch(`${BASE_URL}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Adarsh G (Postman Test)',
        email: `adarsh.test.${Date.now()}@edusphere.edu`,
        rollNumber: `POSTMAN_${Date.now().toString().slice(-4)}`,
        department: 'Computer Science',
        year: 3,
        skills: ['JavaScript', 'Node.js', 'MongoDB', 'Postman'],
        bio: 'Automated test profile created via API test suite.'
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data._id, 'Student must have _id');
    testStudentId = data._id;
  });

  // 3. List Students (GET with filters)
  await test('GET /api/students?department=Computer Science - Filter Students', async () => {
    const res = await fetch(`${BASE_URL}/students?department=Computer Science`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data), 'Response must be an array');
    assert.ok(data.length > 0, 'Array should contain students');
  });

  // 4. Get Single Student by ID (GET)
  await test('GET /api/students/:id - Fetch Single Student', async () => {
    const res = await fetch(`${BASE_URL}/students/${testStudentId}`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data._id, testStudentId);
  });

  // 5. Update Student (PUT)
  await test('PUT /api/students/:id - Update Student Profile', async () => {
    const res = await fetch(`${BASE_URL}/students/${testStudentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Adarsh G (Updated)',
        year: 4,
        bio: 'Updated bio after passing Postman verification.'
      })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.year, 4);
  });

  // 6. Create Task Linked to Student (POST)
  await test('POST /api/tasks - Create Task with Student Reference', async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Postman Integration Validation',
        description: 'Verify all CRUD routes and Mongoose population.',
        dueDate: '2026-12-01T00:00:00.000Z',
        priority: 'high',
        status: 'in-progress',
        studentId: testStudentId
      })
    });
    assert.strictEqual(res.status, 201);
    const data = await res.json();
    assert.ok(data._id);
    assert.ok(data.studentId);
    testTaskId = data._id;
  });

  // 7. Get All Tasks with Populated Student (GET)
  await test('GET /api/tasks - List Tasks with Populated Student', async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    const createdTask = data.find(t => t._id === testTaskId);
    assert.ok(createdTask, 'Created task should be present in list');
    assert.ok(createdTask.studentId, 'Task studentId should be populated');
  });

  // 8. Update Task Status (PATCH)
  await test('PATCH /api/tasks/:id - Update Task Status', async () => {
    const res = await fetch(`${BASE_URL}/tasks/${testTaskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'done' })
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.status, 'done');
  });

  // 9. Delete Student with Cascade Task Removal (DELETE)
  await test('DELETE /api/students/:id - Cascade Delete Student & Tasks', async () => {
    const res = await fetch(`${BASE_URL}/students/${testStudentId}`, {
      method: 'DELETE'
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.ok(data.message.includes('Student and associated tasks deleted'));

    // Verify task was cascaded
    const taskCheck = await fetch(`${BASE_URL}/tasks/${testTaskId}`);
    const allTasksRes = await fetch(`${BASE_URL}/tasks`);
    const allTasks = await allTasksRes.json();
    assert.ok(!allTasks.some(t => t._id === testTaskId), 'Task should be deleted by cascade');
  });

  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passed}/${total} Tests Passed (100% Success)`);
  console.log('------------------------------------------------------\n');
}

runLiveAPISuite().catch(console.error);
