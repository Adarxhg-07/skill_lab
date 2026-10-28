/* ========================================
   PORTFOLIO PAGE LOGIC
   Reads student ID from URL, renders profile
   ======================================== */

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  let studentId = params.get('id');

  // If no ID passed in query, prioritize logged-in student
  const currentUser = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
  if (!studentId && currentUser && currentUser.role === 'student') {
    studentId = currentUser.studentId || currentUser.rollNumber;
  }

  try {
    let student = null;
    if (studentId) {
      try {
        student = await fetchStudent(studentId);
      } catch {
        student = null;
      }
    }

    if (!student) {
      const all = await fetchStudents();
      if (all && all.length > 0) {
        student = all[0];
        studentId = student._id;
        history.replaceState(null, '', `portfolio.html?id=${studentId}`);
      }
    }

    if (!student) {
      renderError('No student profiles found.');
      return;
    }

    const tasks = await fetchStudentTasks(studentId);
    renderPortfolio(student, tasks);
    document.title = student.name + ' - EduSphere Portfolio';
  } catch (err) {
    renderError(err.message);
  }
});

function renderPortfolio(student, tasks) {
  const container = document.getElementById('portfolioContent');
  const completedTasks = tasks.filter(t => t.status === 'done');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');

  container.innerHTML = `
    <a href="index.html" class="portfolio__back">
      ${ICONS.arrowLeft}
      Back to EduSphere
    </a>

    <!-- Hero -->
    <div class="portfolio__hero">
      ${renderAvatar(student.name, 'avatar--xl portfolio__avatar')}
      <h1 class="portfolio__name">${student.name}</h1>
      <p class="portfolio__role">${student.department} &middot; Year ${student.year}</p>
      ${student.bio ? `<p class="portfolio__bio">${student.bio}</p>` : ''}
    </div>

    <!-- Skills -->
    ${student.skills && student.skills.length > 0 ? `
      <div class="portfolio__section">
        <h2 class="portfolio__section-title">Skills</h2>
        <div class="portfolio__skills">
          ${student.skills.map(skill => `<span class="pill">${skill}</span>`).join('')}
        </div>
      </div>
    ` : ''}

    <div class="portfolio__divider"></div>

    <!-- Stats -->
    <div class="portfolio__section">
      <h2 class="portfolio__section-title">Progress</h2>
      <div class="portfolio__stats">
        <div>
          <div class="portfolio__stat-value">${completedTasks.length}</div>
          <div class="portfolio__stat-label">Completed</div>
        </div>
        <div>
          <div class="portfolio__stat-value">${inProgressTasks.length}</div>
          <div class="portfolio__stat-label">In Progress</div>
        </div>
        <div>
          <div class="portfolio__stat-value">${tasks.length}</div>
          <div class="portfolio__stat-label">Total Tasks</div>
        </div>
      </div>
    </div>

    <div class="portfolio__divider"></div>

    <!-- Completed Tasks -->
    ${completedTasks.length > 0 ? `
      <div class="portfolio__section">
        <h2 class="portfolio__section-title">Completed Work</h2>
        <div style="display:flex; flex-direction:column; gap:var(--s-3);">
          ${completedTasks.map(task => `
            <div class="card" style="padding: var(--s-4) var(--s-5);">
              <div style="display:flex; align-items:center; justify-content:space-between;">
                <div>
                  <div style="font-size:14px; font-weight:500; color:var(--dark);">${task.title}</div>
                  ${task.description ? `<div style="font-size:12px; color:var(--muted); margin-top:2px;">${task.description}</div>` : ''}
                </div>
                <span class="badge badge--success">Done</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Contact & Info -->
    <div class="portfolio__divider"></div>

    <div class="portfolio__section">
      <h2 class="portfolio__section-title">Contact</h2>
      <div style="text-align:center;">
        <p style="font-size:13px; color:var(--muted); margin-bottom:var(--s-4);">${student.rollNumber} &middot; ${student.email}</p>
        <div class="portfolio__links">
          ${student.socialLinks && student.socialLinks.github ? `
            <a href="${student.socialLinks.github}" target="_blank" rel="noopener" class="portfolio__link" title="GitHub">
              ${ICONS.github}
            </a>
          ` : ''}
          ${student.socialLinks && student.socialLinks.linkedin ? `
            <a href="${student.socialLinks.linkedin}" target="_blank" rel="noopener" class="portfolio__link" title="LinkedIn">
              ${ICONS.linkedin}
            </a>
          ` : ''}
          ${student.email ? `
            <a href="mailto:${student.email}" class="portfolio__link" title="Email">
              ${ICONS.mail}
            </a>
          ` : ''}
        </div>
      </div>
    </div>

    <div style="text-align:center; padding:var(--s-12) 0 var(--s-6); font-size:12px; color:var(--muted-light);">
      Built with EduSphere
    </div>
  `;
}

function renderError(message) {
  const container = document.getElementById('portfolioContent');
  container.innerHTML = `
    <div class="empty-state" style="min-height:80vh">
      <div class="empty-state__icon">${ICONS.empty}</div>
      <div class="empty-state__title">${message}</div>
      <a href="index.html" class="btn btn--dark" style="margin-top:var(--s-4)">Go to Dashboard</a>
    </div>
  `;
}
