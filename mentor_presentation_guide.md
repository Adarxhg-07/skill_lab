# EduSphere - Mentor Presentation & Project Architecture Guide

## 1. Project Overview & Elevator Pitch

**What it is**: EduSphere is a full-stack Student Academic and Portfolio Operating System built with vanilla HTML/CSS/JavaScript on the frontend, Node.js + Express REST API on the backend, and MongoDB via Mongoose ODM for persistence.

**Core Problem Solved**: Centralizes student directory management, tracking of academic milestones through an interactive Kanban board, and generation of public student portfolios.

**Key Aesthetic Choice**: Pure editorial minimalism (DM Sans typography, `#292928` dark, `#c3f832` lime accent, light background, thin borders, zero emojis, zero gradients/glassmorphism).

---

## 2. System Architecture & Request-Response Cycle

```
[Browser Client]
  │
  ├── 1. Static UI: HTML5 + CSS Tokens (DM Sans)
  ├── 2. Logic: Vanilla JS modules (app.js, api.js, students.js, tasks.js, portfolio.js)
  │
  │ (HTTP REST via Fetch API / JSON)
  ▼
[Express Server (Node.js) :3000]
  │
  ├── Middleware: cors(), express.json(), request logger
  ├── Routes: /api/students, /api/tasks
  ├── Controllers: studentController.js, taskController.js
  ├── Middleware: errorHandler.js (ValidationError, CastError, duplicate keys)
  │
  ▼
[Mongoose ODM]
  │
  ├── Student Schema (indexing, regex search, cascade delete)
  └── Task Schema (enum validation, student reference ObjectId)
  │
  ▼
[MongoDB :27017] (Database: edusphere)
```

### Dual-Mode Architecture (Mock Fallback)
If the backend or database is offline, `frontend/js/api.js` automatically catches connection timeouts (`AbortSignal.timeout(1500)`) and falls back to `frontend/js/data.js` in-memory mock data. When backend is live, it persists directly to MongoDB.

---

## 3. Syllabus Topic Implementations

### Topic 1: HTML5 Semantic Structure & Native Elements
- **Files**: `frontend/index.html`, `frontend/students.html`, `frontend/tasks.html`, `frontend/portfolio.html`
- **Implementation**:
  - Semantic tags: `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`, `<aside>`.
  - Native `<dialog>` elements for modals (`#studentModal`, `#taskModal`) instead of heavy JS modal libraries. Managed via `.showModal()` and `.close()`.
  - Native form controls with input constraints: `required`, `type="date"`, `type="email"`, `maxlength`.

### Topic 2: CSS Custom Properties & Component Architecture
- **Files**: `frontend/css/tokens.css`, `frontend/css/components.css`, `frontend/css/layout.css`, `frontend/css/pages.css`
- **Implementation**:
  - Design tokens defined under `:root` for colors (`--dark`, `--accent`, `--light`, `--border`), spacing scales (`--s-1` to `--s-12`), radii (`--r-sm` to `--r-full`), and transition durations.
  - BEM-inspired utility & component classes: `.btn`, `.btn--dark`, `.card`, `.badge`, `.badge--accent`, `.avatar`, `.pill`.
  - Pure CSS responsive layouts using CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`) and Flexbox without UI frameworks.

### Topic 3: JavaScript DOM Manipulation & Event Handling
- **Files**: `frontend/js/students.js`, `frontend/js/tasks.js`, `frontend/js/app.js`
- **Implementation**:
  - Dynamic template literal generation: maps student and task arrays into HTML strings and assigns via `.innerHTML`.
  - Live filtering: `studentSearch` input bound to `input` event listener with `debounce(fn, 300)` to limit re-filtering cycles.
  - Event delegation: used on cards and Kanban columns (`e.target.closest('.task-card')`) for optimal memory footprint.

### Topic 4: Client-Side File I/O (Blob API & FileReader)
- **Files**: `frontend/js/tasks.js`
- **Implementation**:
  - **Export**: Converts tasks array to JSON via `JSON.stringify(tasks, null, 2)`. Creates in-memory file using `new Blob([json], { type: 'application/json' })`, creates a dynamic `<a>` tag with `URL.createObjectURL(blob)`, triggers `.click()`, and cleans up with `URL.revokeObjectURL()`.
  - **Import**: Uses HTML `<input type="file" accept=".json">`. Reads file content using native `FileReader.readAsText(file)` via `onload` callback, parses JSON, and updates state.

### Topic 5: HTML5 Drag and Drop API
- **Files**: `frontend/js/tasks.js`
- **Implementation**:
  - Task cards marked `draggable="true"`.
  - `dragstart` sets payload: `e.dataTransfer.setData('text/plain', card.dataset.id)`.
  - Column bodies listen for `dragover` (`e.preventDefault()` required by specification to allow dropping) and `drop`.
  - `drop` event reads task ID, determines destination column status (`todo`, `in-progress`, `done`), and updates status via `updateTask(id, { status })` through PATCH API.

### Topic 6: Node.js & Express Server Setup with Middleware
- **Files**: `backend/server.js`, `backend/middleware/errorHandler.js`
- **Implementation**:
  - Server bootstrapped with `express()`.
  - Middleware chain:
    1. `cors()`: Enables cross-origin requests from frontend port/file scheme.
    2. `express.json()`: Built-in body parser for incoming JSON payloads.
  - Centralized error handler middleware `(err, req, res, next)` at the bottom of the stack to catch Mongoose `ValidationError` (400), `CastError` (400), duplicate keys `11000` (409), and unexpected 500 errors.

### Topic 7: REST API Design & CRUD Endpoints
- **Files**: `backend/routes/students.js`, `backend/routes/tasks.js`, `backend/controllers/`
- **Implementation**:
  - `GET /api/students`: Lists students with query params for name/rollNumber regex search and department/year filters.
  - `GET /api/students/:id`: Retrieves student by MongoDB ObjectId or rollNumber.
  - `POST /api/students`: Creates student with schema validation.
  - `PUT /api/students/:id`: Replaces/updates student fields.
  - `DELETE /api/students/:id`: Deletes student and triggers cascade task deletion (`Task.deleteMany({ studentId: req.params.id })`).
  - `GET /api/tasks`: Lists tasks with status and student filters, populated with student details.
  - `POST /api/tasks`: Creates task.
  - `PATCH /api/tasks/:id`: Partial update (status transition or priority).
  - `DELETE /api/tasks/:id`: Removes task.

### Topic 8: MongoDB & Mongoose ODM
- **Files**: `backend/config/db.js`, `backend/models/Student.js`, `backend/models/Task.js`, `backend/seed.js`
- **Implementation**:
  - Database connection via `mongoose.connect()`.
  - Schemas defined with strong typing, validators (`enum: ['todo', 'in-progress', 'done']`, `min: 1, max: 4`), and custom error messages.
  - Relational references: `Task.studentId` has `type: mongoose.Schema.Types.ObjectId, ref: 'Student'`.
  - Schema indexing: compound or unique index on `Student.rollNumber` and `Student.email`.
  - Population: `Task.find().populate('studentId', 'name rollNumber')` joins documents efficiently.

---

## 4. Step-by-Step Mentor Demo Script

1. **Start Backend**: Show terminal running `node server.js` showing MongoDB connection.
2. **Dashboard (`index.html`)**:
   - Point out key metrics: Total Students, Active Tasks, Completion Rate.
   - Show recent students and status progress bars.
   - Highlight design: editorial typography, lime accent, clean cards, no emojis.
3. **Student Management (`students.html`)**:
   - Filter by department and year dropdowns.
   - Live search by typing student name or roll number.
   - Click "Add Student" to trigger native `<dialog>` modal. Create a new student.
   - Click "Edit" to modify skills or bio.
4. **Task Manager & Kanban (`tasks.html`)**:
   - Show three columns: To Do, In Progress, Done.
   - Drag a task card from "To Do" to "In Progress". Explain native HTML5 Drag and Drop API.
   - Click "Export JSON": inspect downloaded `.json` file.
   - Add/edit task and assign to student.
5. **Student Portfolio (`portfolio.html?id=...`)**:
   - Click any student card from directory or recent list.
   - Show generated portfolio view: centered avatar, skills pills, completed projects, contact links.
6. **Code Walkthrough**:
   - Show Mongoose schemas (`models/Student.js`, `models/Task.js`).
   - Show controllers with error handling and population.
   - Show frontend Fetch API layer with dual-mode fallback.

---

## 5. Likely Mentor Questions & Bulletproof Answers

**Q: Why choose vanilla JavaScript instead of React or Vue?**
*Answer*: Vanilla JS eliminates bundle size and tooling overhead. It demonstrates mastery of DOM manipulation, event loops, Web APIs (Drag and Drop, Blob, FileReader, Dialog), and native browser standards before adding framework abstraction.

**Q: How does relational integrity work in MongoDB without foreign keys?**
*Answer*: We enforce references at the application layer using Mongoose ObjectIds with `ref: 'Student'`. When deleting a student in `studentController.js`, we run `Task.deleteMany({ studentId: id })` to ensure no orphan tasks remain.

**Q: How does the application handle backend downtime?**
*Answer*: The frontend `api.js` layer uses an active backend health check with `AbortSignal.timeout()`. If the server is unreachable, methods gracefully route to client-side mock data arrays in `data.js`.

**Q: Why use native `<dialog>` over custom modal wrappers?**
*Answer*: `<dialog>` is standard HTML5. Calling `showModal()` automatically provides top-layer rendering, backdrop management, focus trapping, and native Escape key dismissal without custom accessibility boilerplate.
