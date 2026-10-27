# EduSphere

Student Academic and Portfolio Operating System.

Full-stack web application built with HTML, CSS, JavaScript, Node.js, Express, and MongoDB.

---

## Features

- **Dashboard** -- Stats overview, recent students, task progress
- **Student Management** -- Full CRUD with search, department/year filters
- **Interactive Task Manager** -- Kanban board with drag-and-drop, JSON export/import
- **Student Portfolio** -- Public profile page with skills, completed work, social links
- **REST API** -- 10 endpoints for students and tasks with validation and error handling

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose ODM |
| Design | DM Sans font, custom design tokens |

## Project Structure

```
skill_lab_project/
  frontend/
    index.html          Dashboard
    students.html       Student Management
    tasks.html          Task Manager
    portfolio.html      Student Portfolio
    css/                Design system (tokens, components, layout)
    js/                 App logic (data, api, page modules)
  backend/
    server.js           Express entry point
    config/db.js        MongoDB connection
    models/             Mongoose schemas (Student, Task)
    controllers/        Business logic
    routes/             API route handlers
    middleware/          Error handler
    seed.js             Database seeder
```

## Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally on port 27017)

### Install and Run

```bash
# Install backend dependencies
cd backend
npm install

# Seed the database with sample data
npm run seed

# Start the API server
npm start
```

API runs on `http://localhost:3000`.

### Frontend
Open `frontend/index.html` directly in any browser. Works with or without the backend -- falls back to built-in mock data automatically.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/students | List students (search, filter by dept/year) |
| GET | /api/students/:id | Get single student |
| POST | /api/students | Create student |
| PUT | /api/students/:id | Update student |
| DELETE | /api/students/:id | Delete student + cascade tasks |
| GET | /api/tasks | List tasks (filter by status, studentId) |
| POST | /api/tasks | Create task |
| PATCH | /api/tasks/:id | Update task status/priority |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api | Health check |

## Topics Covered

- HTML5 semantic structure and responsive design
- CSS custom properties, component architecture, mobile-first media queries
- JavaScript DOM manipulation, event handling, async/await, Fetch API
- JSON data parsing, Blob API for file export, FileReader for import
- HTML5 Drag and Drop API
- Native `<dialog>` element for modals
- Node.js and Express server setup
- Express middleware (CORS, JSON parser, error handler)
- REST API design (GET, POST, PUT, PATCH, DELETE)
- MongoDB with Mongoose ODM (schemas, validation, indexing, references)
- Git version control

## License
MIT
