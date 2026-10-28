/* ========================================
   TASKS PAGE LOGIC
   Kanban columns, drag-and-drop, CRUD,
   JSON export/import
   ======================================== */

document.addEventListener('DOMContentLoaded', async () => {
  // Inject sidebar
  document.getElementById('sidebar-root').innerHTML = getSidebarHTML();
  initSidebarActiveState();

  // Populate student dropdown in modal
  const studentSelect = document.getElementById('taskStudentInput');
  const students = await fetchStudents();
  students.forEach(s => {
    studentSelect.innerHTML += `<option value="${s._id}">${s.name}</option>`;
  });

  // Load tasks
  await loadTasks();

  // Setup drag-and-drop
  setupDragAndDrop();

  // Modal controls
  const modal = document.getElementById('taskModal');
  document.getElementById('addTaskBtn').addEventListener('click', () => openTaskModal());
  document.getElementById('taskModalClose').addEventListener('click', () => modal.close());
  document.getElementById('taskModalCancel').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

  // Form submission
  document.getElementById('taskForm').addEventListener('submit', handleTaskFormSubmit);

  // Export / Import
  document.getElementById('exportBtn').addEventListener('click', exportTasks);
  document.getElementById('importFile').addEventListener('change', importTasks);

  // Student-specific "My Tasks" filter button
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (currentUser && currentUser.role === 'student') {
    const actionsBar = document.querySelector('.task-actions-bar');
    if (actionsBar) {
      const myBtn = document.createElement('button');
      myBtn.id = 'myTasksFilterBtn';
      myBtn.className = 'btn btn--outline';
      myBtn.style.fontWeight = '600';
      myBtn.innerHTML = `<span>My Tasks Only</span>`;
      myBtn.onclick = () => {
        myTasksFilterActive = !myTasksFilterActive;
        myBtn.classList.toggle('btn--primary', myTasksFilterActive);
        myBtn.classList.toggle('btn--outline', !myTasksFilterActive);
        applyTasksFilterAndRender();
      };
      actionsBar.prepend(myBtn);
    }
  }
});

let editingTaskId = null;
let rawTasksCache = [];
let myTasksFilterActive = false;

async function loadTasks() {
  rawTasksCache = await fetchTasks();
  applyTasksFilterAndRender();
}

function applyTasksFilterAndRender() {
  let filtered = [...rawTasksCache];
  const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

  if (myTasksFilterActive && user && user.role === 'student') {
    const sId = user.studentId;
    const rNum = (user.rollNumber || '').toUpperCase();
    filtered = filtered.filter(t => {
      if (!t.studentId) return false;
      if (typeof t.studentId === 'object') {
        return (sId && t.studentId._id === sId) || (rNum && t.studentId.rollNumber && t.studentId.rollNumber.toUpperCase() === rNum);
      }
      return (sId && t.studentId === sId) || (rNum && t.studentId.toUpperCase() === rNum);
    });
  }

  renderColumns(filtered);
}

function renderColumns(tasks) {
  const columns = {
    'todo': document.getElementById('todoColumn'),
    'in-progress': document.getElementById('inProgressColumn'),
    'done': document.getElementById('doneColumn')
  };

  const counts = { 'todo': 0, 'in-progress': 0, 'done': 0 };

  // Clear columns
  Object.values(columns).forEach(col => col.innerHTML = '');

  // Sort tasks by priority weight then due date
  const priorityWeight = { high: 0, medium: 1, low: 2 };
  const sorted = [...tasks].sort((a, b) => {
    const pw = (priorityWeight[a.priority] || 1) - (priorityWeight[b.priority] || 1);
    if (pw !== 0) return pw;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  sorted.forEach(task => {
    if (!columns[task.status]) return;
    counts[task.status]++;
    columns[task.status].innerHTML += renderTaskCard(task);
  });

  // Update counts
  document.getElementById('todoCount').textContent = counts['todo'];
  document.getElementById('inProgressCount').textContent = counts['in-progress'];
  document.getElementById('doneCount').textContent = counts['done'];

  // Show empty state for empty columns
  Object.entries(columns).forEach(([status, col]) => {
    if (counts[status] === 0) {
      col.innerHTML = `
        <div style="padding: var(--s-6); text-align: center; color: var(--muted-light); font-size: 13px;">
          No tasks
        </div>`;
    }
  });
}

function renderTaskCard(task) {
  const studentName = getStudentName(task.studentId);
  const dueLabel = getDueLabel(task.dueDate);
  const dueClass = getDueClass(task.dueDate);

  return `
    <div class="task-card" draggable="true" data-id="${task._id}" data-status="${task.status}">
      <div class="task-card__title">${task.title}</div>
      ${task.description ? `<div class="task-card__desc">${task.description}</div>` : ''}
      <div class="task-card__footer">
        <div style="display:flex; align-items:center; gap:8px;">
          ${priorityBadge(task.priority)}
          ${dueLabel ? `<span class="task-card__due ${dueClass}">${ICONS.calendar} ${dueLabel}</span>` : ''}
        </div>
        <div class="task-card__actions">
          <button class="btn btn--icon btn--outline" onclick="editTask('${task._id}')" title="Edit">
            ${ICONS.edit}
          </button>
          <button class="btn btn--icon btn--danger" onclick="handleDeleteTask('${task._id}')" title="Delete">
            ${ICONS.trash}
          </button>
        </div>
      </div>
      ${task.studentId && studentName !== 'Unassigned' ? `
        <div style="display:flex; align-items:center; gap:6px; margin-top:8px; padding-top:8px; border-top:1px solid var(--border);">
          ${renderAvatar(studentName, 'avatar--sm')}
          <span class="text-xs text-muted">${studentName}</span>
        </div>
      ` : ''}
    </div>`;
}

/* --- Drag and Drop (HTML5 API) --- */
function setupDragAndDrop() {
  const columns = document.querySelectorAll('.task-column__body');

  // Delegate dragstart to task cards
  document.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.task-card');
    if (!card) return;
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', card.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
  });

  document.addEventListener('dragend', (e) => {
    const card = e.target.closest('.task-card');
    if (card) card.classList.remove('dragging');
    columns.forEach(col => col.classList.remove('drag-over'));
  });

  columns.forEach(col => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('drag-over');
    });

    col.addEventListener('dragleave', (e) => {
      if (!col.contains(e.relatedTarget)) {
        col.classList.remove('drag-over');
      }
    });

    col.addEventListener('drop', async (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      const taskId = e.dataTransfer.getData('text/plain');
      const newStatus = col.dataset.status;
      if (!taskId || !newStatus) return;

      try {
        await updateTask(taskId, { status: newStatus });
        await loadTasks();
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

/* --- Task Modal --- */
function openTaskModal(task = null) {
  const modal = document.getElementById('taskModal');
  const title = document.getElementById('taskModalTitle');
  const submit = document.getElementById('taskModalSubmit');
  const form = document.getElementById('taskForm');

  form.reset();
  editingTaskId = null;

  if (task) {
    editingTaskId = task._id;
    title.textContent = 'Edit Task';
    submit.textContent = 'Save Changes';

    document.getElementById('taskTitleInput').value = task.title || '';
    document.getElementById('taskDescInput').value = task.description || '';
    document.getElementById('taskDueInput').value = task.dueDate ? task.dueDate.split('T')[0] : '';
    document.getElementById('taskPriorityInput').value = task.priority || 'medium';
    const sId = typeof task.studentId === 'object' && task.studentId !== null ? task.studentId._id : (task.studentId || '');
    document.getElementById('taskStudentInput').value = sId;
  } else {
    title.textContent = 'Add Task';
    submit.textContent = 'Add Task';
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user && user.role === 'student' && user.studentId) {
      document.getElementById('taskStudentInput').value = user.studentId;
    } else {
      document.getElementById('taskStudentInput').value = '';
    }
  }

  modal.showModal();
}

async function editTask(id) {
  const tasks = await fetchTasks();
  const task = tasks.find(t => t._id === id);
  if (task) openTaskModal(task);
}

async function handleTaskFormSubmit(e) {
  e.preventDefault();

  const data = {
    title: document.getElementById('taskTitleInput').value.trim(),
    description: document.getElementById('taskDescInput').value.trim(),
    dueDate: document.getElementById('taskDueInput').value,
    priority: document.getElementById('taskPriorityInput').value,
    status: document.getElementById('taskStatusInput').value,
    studentId: document.getElementById('taskStudentInput').value || null
  };

  try {
    if (editingTaskId) {
      await updateTask(editingTaskId, data);
    } else {
      await createTask(data);
    }
    document.getElementById('taskModal').close();
    await loadTasks();
  } catch (err) {
    alert(err.message);
  }
}

async function handleDeleteTask(id) {
  if (!confirm('Delete this task?')) return;
  try {
    await deleteTask(id);
    await loadTasks();
  } catch (err) {
    alert(err.message);
  }
}

/* --- JSON Export / Import --- */
async function exportTasks() {
  const tasks = await fetchTasks();
  const json = JSON.stringify(tasks, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'edusphere-tasks.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function importTasks(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const imported = JSON.parse(event.target.result);
      if (!Array.isArray(imported)) {
        alert('Invalid JSON format. Expected an array of tasks.');
        return;
      }

      // Add each imported task
      for (const task of imported) {
        const data = {
          title: task.title,
          description: task.description || '',
          dueDate: task.dueDate,
          priority: task.priority || 'medium',
          status: task.status || 'todo',
          studentId: task.studentId || null
        };
        await createTask(data);
      }

      await loadTasks();
      alert(`Imported ${imported.length} tasks successfully.`);
    } catch (err) {
      alert('Failed to parse JSON file: ' + err.message);
    }
  };
  reader.readAsText(file);

  // Reset file input so same file can be re-imported
  e.target.value = '';
}
