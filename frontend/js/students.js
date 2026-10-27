/* ========================================
   STUDENTS PAGE LOGIC
   DOM manipulation, search, CRUD, modal
   ======================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // Inject sidebar
  document.getElementById('sidebar-root').innerHTML = getSidebarHTML();
  initSidebarActiveState();

  // Populate filter dropdowns
  const deptFilter = document.getElementById('deptFilter');
  const yearFilter = document.getElementById('yearFilter');
  const deptInput = document.getElementById('deptInput');

  DEPARTMENTS.forEach(dept => {
    deptFilter.innerHTML += `<option value="${dept}">${dept}</option>`;
    deptInput.innerHTML += `<option value="${dept}">${dept}</option>`;
  });

  YEARS.forEach(y => {
    yearFilter.innerHTML += `<option value="${y}">Year ${y}</option>`;
  });

  // Initial render
  await loadStudents();

  // Event listeners
  const searchInput = document.getElementById('studentSearch');
  searchInput.addEventListener('input', debounce(loadStudents, 250));
  deptFilter.addEventListener('change', loadStudents);
  yearFilter.addEventListener('change', loadStudents);

  // Modal controls
  const modal = document.getElementById('studentModal');
  const form = document.getElementById('studentForm');

  document.getElementById('addStudentBtn').addEventListener('click', () => openModal());
  document.getElementById('modalClose').addEventListener('click', () => modal.close());
  document.getElementById('modalCancel').addEventListener('click', () => modal.close());

  // Close modal on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  // Form submission
  form.addEventListener('submit', handleFormSubmit);
});

let editingStudentId = null;

async function loadStudents() {
  const search = document.getElementById('studentSearch').value;
  const department = document.getElementById('deptFilter').value;
  const year = document.getElementById('yearFilter').value;

  const params = {};
  if (search) params.search = search;
  if (department) params.department = department;
  if (year) params.year = year;

  const students = await fetchStudents(params);
  renderStudentGrid(students);
  document.getElementById('studentCount').textContent = students.length + ' students';
}

function renderStudentGrid(students) {
  const grid = document.getElementById('studentsGrid');

  if (students.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1">
        <div class="empty-state__icon">${ICONS.empty}</div>
        <div class="empty-state__title">No students found</div>
        <div class="empty-state__text">Try adjusting your search or filters</div>
      </div>`;
    return;
  }

  grid.innerHTML = students.map(student => `
    <div class="student-card" data-id="${student._id}" onclick="viewPortfolio('${student._id}')">
      <div class="student-card__top">
        ${renderAvatar(student.name)}
        <div>
          <div class="student-card__name">${student.name}</div>
          <div class="student-card__roll">${student.rollNumber}</div>
        </div>
      </div>
      <div class="student-card__details">
        <span class="student-card__detail">
          ${ICONS.department}
          ${student.department}
        </span>
        <span class="student-card__detail">
          ${ICONS.year}
          Year ${student.year}
        </span>
      </div>
      ${student.skills && student.skills.length > 0 ? `
        <div class="student-card__skills">
          ${student.skills.slice(0, 4).map(skill => `<span class="pill">${skill}</span>`).join('')}
          ${student.skills.length > 4 ? `<span class="pill">+${student.skills.length - 4}</span>` : ''}
        </div>
      ` : ''}
      <div class="student-card__actions" onclick="event.stopPropagation()">
        <button class="btn btn--outline btn--sm" onclick="editStudent('${student._id}')">
          ${ICONS.edit} Edit
        </button>
        <button class="btn btn--danger btn--sm" onclick="handleDeleteStudent('${student._id}')">
          ${ICONS.trash} Delete
        </button>
      </div>
    </div>
  `).join('');
}

function viewPortfolio(id) {
  window.location.href = `portfolio.html?id=${id}`;
}

function openModal(student = null) {
  const modal = document.getElementById('studentModal');
  const title = document.getElementById('modalTitle');
  const submit = document.getElementById('modalSubmit');
  const form = document.getElementById('studentForm');

  form.reset();
  editingStudentId = null;

  if (student) {
    editingStudentId = student._id;
    title.textContent = 'Edit Student';
    submit.textContent = 'Save Changes';

    document.getElementById('nameInput').value = student.name || '';
    document.getElementById('emailInput').value = student.email || '';
    document.getElementById('rollInput').value = student.rollNumber || '';
    document.getElementById('deptInput').value = student.department || '';
    document.getElementById('yearInput').value = student.year || '';
    document.getElementById('skillsInput').value = (student.skills || []).join(', ');
    document.getElementById('bioInput').value = student.bio || '';
    document.getElementById('githubInput').value = (student.socialLinks && student.socialLinks.github) || '';
    document.getElementById('linkedinInput').value = (student.socialLinks && student.socialLinks.linkedin) || '';
  } else {
    title.textContent = 'Add Student';
    submit.textContent = 'Add Student';
  }

  modal.showModal();
}

async function editStudent(id) {
  const students = await fetchStudents();
  const student = students.find(s => s._id === id);
  if (student) openModal(student);
}

async function handleFormSubmit(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('nameInput').value.trim(),
    email: document.getElementById('emailInput').value.trim(),
    rollNumber: document.getElementById('rollInput').value.trim(),
    department: document.getElementById('deptInput').value,
    year: parseInt(document.getElementById('yearInput').value),
    skills: document.getElementById('skillsInput').value
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
    bio: document.getElementById('bioInput').value.trim(),
    socialLinks: {
      github: document.getElementById('githubInput').value.trim(),
      linkedin: document.getElementById('linkedinInput').value.trim(),
      email: document.getElementById('emailInput').value.trim()
    }
  };

  try {
    if (editingStudentId) {
      await updateStudent(editingStudentId, data);
    } else {
      await createStudent(data);
    }
    document.getElementById('studentModal').close();
    await loadStudents();
  } catch (err) {
    alert(err.message);
  }
}

async function handleDeleteStudent(id) {
  if (!confirm('Delete this student? This will also remove all their tasks.')) return;
  try {
    await deleteStudent(id);
    await loadStudents();
  } catch (err) {
    alert(err.message);
  }
}
