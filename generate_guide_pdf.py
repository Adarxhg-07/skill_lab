import os
import json
from fpdf import FPDF

class EduSpherePDF(FPDF):
    def __init__(self):
        super().__init__(orientation='P', unit='mm', format='A4')
        self.set_auto_page_break(auto=True, margin=18)
        self.set_margins(18, 18, 18)
        self.alias_nb_pages()

    def header(self):
        if self.page_no() > 1:
            self.set_font('helvetica', 'I', 8)
            self.set_text_color(100, 116, 139) # slate-500
            self.cell(0, 8, 'EduSphere Full-Stack System Architecture & API Masterclass Guide', border=0, align='L')
            self.cell(0, 8, 'Adarsh G (Skill Lab)', border=0, align='R')
            self.ln(9)
            self.set_draw_color(226, 232, 240)
            self.line(18, self.get_y(), 192, self.get_y())
            self.ln(5)

    def footer(self):
        self.set_y(-14)
        self.set_draw_color(226, 232, 240)
        self.line(18, self.get_y(), 192, self.get_y())
        self.ln(2)
        self.set_font('helvetica', 'I', 8)
        self.set_text_color(148, 163, 184) # slate-400
        self.cell(0, 6, 'EduSphere Project - MongoDB | Express.js | Node.js | Vanilla JS | REST API', border=0, align='L')
        self.cell(0, 6, f'Page {self.page_no()} of {{nb}}', border=0, align='R')

    def chapter_title(self, number, title):
        self.ln(4)
        self.set_fill_color(238, 242, 255) # indigo-50
        self.set_draw_color(99, 102, 241)  # indigo-500
        self.set_line_width(0.8)
        
        # Section pill
        self.set_font('helvetica', 'B', 12)
        self.set_text_color(67, 56, 202) # indigo-700
        self.cell(0, 9, f"  SECTION {number}: {title.upper()}", border=1, fill=True, new_x="LMARGIN", new_y="NEXT")
        self.set_line_width(0.2)
        self.ln(4)

    def sub_title(self, title):
        self.set_font('helvetica', 'B', 11)
        self.set_text_color(15, 23, 42) # slate-900
        self.cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def paragraph(self, text):
        self.set_font('helvetica', '', 9.5)
        self.set_text_color(51, 65, 85) # slate-700
        self.multi_cell(0, 5.2, text)
        self.ln(2.5)

    def bullet(self, label, text):
        self.set_font('helvetica', 'B', 9.5)
        self.set_text_color(30, 41, 59)
        self.write(5.2, f"  * {label}: ")
        self.set_font('helvetica', '', 9.5)
        self.set_text_color(51, 65, 85)
        self.write(5.2, f"{text}\n")
        self.ln(1.5)

    def callout(self, text, title="PRO-TIP / ARCHITECTURE NOTE"):
        self.set_fill_color(240, 253, 250) # teal-50
        self.set_draw_color(20, 184, 166)  # teal-500
        self.set_line_width(0.5)
        self.set_font('helvetica', 'B', 9)
        self.set_text_color(15, 118, 110) # teal-700
        
        self.cell(0, 6, f"  [!] {title}", border='LTR', fill=True, new_x="LMARGIN", new_y="NEXT")
        self.set_font('helvetica', '', 8.8)
        self.set_text_color(19, 78, 74)
        self.multi_cell(0, 4.8, f"  {text}", border='LBR', fill=True)
        self.set_line_width(0.2)
        self.ln(3)

    def code_box(self, code_text):
        self.set_fill_color(248, 250, 252) # slate-50
        self.set_draw_color(203, 213, 225) # slate-300
        self.set_text_color(30, 41, 59)
        self.set_font('courier', '', 8.2)
        
        lines = code_text.strip().split('\n')
        # Measure and wrap if needed
        self.set_line_width(0.3)
        self.multi_cell(0, 4.2, code_text, border=1, fill=True)
        self.ln(3)

    def table_row(self, col1, col2, col3, col4, is_header=False):
        if is_header:
            self.set_fill_color(30, 41, 59)
            self.set_text_color(255, 255, 255)
            self.set_font('helvetica', 'B', 8.5)
            h = 7
        else:
            self.set_fill_color(255, 255, 255)
            self.set_text_color(51, 65, 85)
            self.set_font('helvetica', '', 8.2)
            h = 6.2

        w1, w2, w3, w4 = 22, 52, 45, 55
        self.cell(w1, h, col1, border=1, fill=True)
        self.cell(w2, h, col2, border=1, fill=True)
        self.cell(w3, h, col3, border=1, fill=True)
        self.cell(w4, h, col4, border=1, fill=True, new_x="LMARGIN", new_y="NEXT")

def build_pdf():
    pdf = EduSpherePDF()
    
    # ------------------ COVER PAGE / BANNER ------------------
    pdf.add_page()
    
    # Header Banner Box
    pdf.set_fill_color(15, 23, 42) # Slate-900
    pdf.rect(18, 18, 174, 52, 'F')
    
    pdf.set_xy(22, 24)
    pdf.set_font('helvetica', 'B', 20)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 9, 'EDUSPHERE FULL-STACK GUIDE', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_xy(22, 35)
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(129, 140, 248) # Indigo-300
    pdf.cell(0, 6, 'Architecture, REST APIs, MongoDB, Postman & Topic Interconnections', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_xy(22, 45)
    pdf.set_font('helvetica', '', 9)
    pdf.set_text_color(203, 213, 225)
    pdf.cell(0, 5, 'Author: Adarsh G | Project: Skill Lab Engineering Project | Status: Production-Ready', new_x="LMARGIN", new_y="NEXT")
    pdf.set_xy(22, 52)
    pdf.set_text_color(148, 163, 184)
    pdf.cell(0, 5, 'Stack: Node.js (v24), Express.js 4, MongoDB/Mongoose ODM, Vanilla JS (ES6+), Modern CSS3', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_y(76)
    
    # Executive Summary
    pdf.sub_title('Document Overview & Purpose')
    pdf.paragraph(
        'This comprehensive technical manual provides an exhaustive, production-grade breakdown of the EduSphere student '
        'management and task tracking platform. It covers everything from high-level architectural design and client-server '
        'communication down to the raw byte transfers of HTTP verbs, Mongoose ODM schemas, Postman integration testing suites, '
        'and cross-layer data lifecycle management. Whether you are presenting to project mentors, preparing for an engineering viva, '
        'or onboarding developers, this guide provides complete technical depth.'
    )
    
    # Key Highlights Table
    pdf.sub_title('System Specifications at a Glance')
    pdf.table_row('Component', 'Technology Choice', 'Key Role & Responsibilities', 'Architectural Pattern', is_header=True)
    pdf.table_row('Client UI', 'HTML5 + Vanilla CSS3', 'Render reactive dashboards, cards, modals', 'Multi-Page App + SPA dynamic DOM')
    pdf.table_row('API Client', 'Fetch API + Custom Layer', 'Abstract HTTP calls, handle mock fallback', 'Repository / Client Service Pattern')
    pdf.table_row('Web Server', 'Node.js + Express.js 4', 'Routing, CORS, JSON parsing, error handling', 'Layered REST Controller Pattern')
    pdf.table_row('Data Tier', 'MongoDB + Mongoose ODM', 'Persistent document storage, schema validation', 'Document store with ObjectId refs')
    pdf.table_row('Testing Tool', 'Postman / Newman CLI', 'Contract validation, endpoint regression testing', 'Automated assertion test scripts')
    pdf.ln(4)

    # ------------------ SECTION 1 ------------------
    pdf.chapter_title('1', 'System Architecture & Topic Interconnections')
    
    pdf.paragraph(
        'EduSphere is structured as a decoupled 3-tier architecture with an intelligent resilient client layer. '
        'The three primary tiers are the Client Layer (Browser DOM), the Application Server Tier (Node/Express), '
        'and the Persistence Layer (MongoDB). Below is the precise operational flow explaining how all components connect:'
    )
    
    pdf.bullet('1. Presentation & Interaction (Browser)',
               'The user opens the application (Dashboard, Students Directory, Tasks Kanban, or Student Portfolio). '
               'User actions like typing a search term, applying filters, or submitting forms trigger native event listeners in modular scripts (app.js, students.js, tasks.js, portfolio.js).')
    
    pdf.bullet('2. The Abstraction Bridge (api.js)',
               'Instead of scattering fetch() URLs across UI files, all HTTP transactions are centralized in frontend/js/api.js. '
               'This file features an active backend health-check (checkBackend()). If the Node server or MongoDB is running, it performs live network calls. If offline, it seamlessly activates MOCK_STUDENTS and MOCK_TASKS in memory, ensuring 100% zero-crash resilience during live demos.')
    
    pdf.bullet('3. The HTTP Network Boundary',
               'Requests traverse over standard HTTP using JSON payloads (serialized via JSON.stringify). Every request defines headers such as Content-Type: application/json and specifies standard REST verbs (GET, POST, PUT, PATCH, DELETE).')
    
    pdf.bullet('4. Express Server Middleware Pipeline',
               'Incoming requests at http://localhost:3000 hit backend/server.js. The pipeline executes: cors() -> express.json() body parsing -> custom router matching (/api/students or /api/tasks) -> Controller business logic -> centralized errorHandler.')
    
    pdf.bullet('5. Business Logic & Controller Layer',
               'Controllers (studentController.js, taskController.js) isolate business rules from HTTP transport. They validate incoming params, enforce data consistency (e.g., verifying ObjectId validity with mongoose.Types.ObjectId.isValid), and orchestrate database mutations.')
    
    pdf.bullet('6. ODM & Database Layer (Mongoose + MongoDB)',
               'Controllers interact with Mongoose Models (Student, Task). Mongoose enforces strict schema typings, regex validators, uniqueness constraints, and performs automatic referencing and population (.populate("studentId", "name rollNumber")).')
    
    pdf.callout(
        'Dual-Key Identifier Resilience: In EduSphere, students have both an internal 24-character hex MongoDB ObjectId (_id) '
        'and a human-readable unique rollNumber (e.g., "STU001"). Controllers dynamically inspect req.params.id: if it is a valid '
        '24-hex ObjectId, it performs findById(); if it is a string like "STU001", it seamlessly resolves via findOne({ rollNumber }). '
        'This prevents 500 cast errors and makes frontend routing intuitive!',
        'ARCHITECTURAL INNOVATION'
    )

    # ------------------ SECTION 2 ------------------
    pdf.add_page()
    pdf.chapter_title('2', 'How Web APIs & REST Architecture Work in Depth')
    
    pdf.sub_title('2.1 What is an API? The Fundamental Concept')
    pdf.paragraph(
        'An API (Application Programming Interface) is a formal contract between two software systems. Just as a restaurant menu '
        'allows a patron (Client) to request dishes from the kitchen (Server) through a waiter (Network Protocol) without knowing '
        'how the kitchen stoves operate, a Web API allows the frontend to request and modify data on the server without direct '
        'access to the underlying database engine.'
    )
    
    pdf.sub_title('2.2 The 6 Architectural Constraints of REST')
    pdf.paragraph(
        'REST (Representational State Transfer) is not a protocol or language; it is an architectural style designed by Roy Fielding in 2000. '
        'To be truly RESTful, a service must adhere to six core principles:'
    )
    pdf.bullet('1. Client-Server Separation', 'User interface concerns are separated from data storage concerns. The frontend can be rewritten in React or Flutter without altering a single Express route.')
    pdf.bullet('2. Statelessness', 'Each request from client to server must contain all information required to understand and process the request. The server never stores session context in memory.')
    pdf.bullet('3. Cacheability', 'Responses must explicitly define themselves as cacheable or non-cacheable to optimize network overhead.')
    pdf.bullet('4. Uniform Interface', 'Resources are identified by standard URIs (e.g., /api/students/123), manipulated via standard representations (JSON), and self-descriptive messages.')
    pdf.bullet('5. Layered System', 'The client cannot tell whether it is connected directly to the end server or to an intermediary such as a proxy, load balancer, or API gateway.')
    pdf.bullet('6. Code on Demand (Optional)', 'Servers may temporarily extend client functionality by transferring executable code (e.g., JavaScript).')

    pdf.sub_title('2.3 HTTP Verbs & Idempotency Rules')
    pdf.table_row('Method', 'CRUD Operation', 'Idempotent?', 'Safe?', is_header=True)
    pdf.table_row('GET', 'Read / Retrieve resources', 'YES (calling N times gives same result)', 'YES (does not alter server state)')
    pdf.table_row('POST', 'Create new resource', 'NO (calling N times creates N records)', 'NO (mutates database state)')
    pdf.table_row('PUT', 'Full replacement of resource', 'YES (repeated calls produce identical state)', 'NO (mutates database state)')
    pdf.table_row('PATCH', 'Partial modification of fields', 'NO (or situational)', 'NO (mutates database state)')
    pdf.table_row('DELETE', 'Remove resource', 'YES (deleting resource once or 5 times leaves it deleted)', 'NO (mutates database state)')
    pdf.ln(3)

    pdf.sub_title('2.4 HTTP Status Codes in EduSphere')
    pdf.bullet('200 OK', 'Standard successful response for GET, PUT, and PATCH queries.')
    pdf.bullet('201 Created', 'Resource successfully created via POST. Returned when creating a Student or Task.')
    pdf.bullet('400 Bad Request', 'Client sent malformed data, failed Mongoose schema validation (e.g. invalid email or missing title).')
    pdf.bullet('404 Not Found', 'Requested resource (Student ID or Task ID) does not exist in MongoDB.')
    pdf.bullet('500 Internal Error', 'Unhandled server-side crash. Intercepted by middleware/errorHandler.js returning clean JSON.')

    # ------------------ SECTION 3 ------------------
    pdf.add_page()
    pdf.chapter_title('3', 'EduSphere Complete REST API Reference')
    
    pdf.paragraph(
        'The EduSphere backend exposes 8 production endpoints across two distinct resources: Students and Tasks. '
        'All endpoints reside under the /api prefix and consume and produce application/json.'
    )
    
    pdf.sub_title('Student Resource Endpoints')
    pdf.bullet('GET /api/students', 'Query Params: ?search=john&department=CSE&year=3&page=1&limit=50. Returns an array of student documents matching criteria, sorted by createdAt descending.')
    pdf.bullet('GET /api/students/:id', 'Accepts either MongoDB ObjectId or rollNumber. Returns a single student document or 404 JSON.')
    pdf.bullet('POST /api/students', 'Creates a new student. Validates required fields: name, email (unique), rollNumber (unique), department, year (1-4).')
    pdf.bullet('PUT /api/students/:id', 'Updates all fields of an existing student with runValidators: true enabled.')
    pdf.bullet('DELETE /api/students/:id', 'Deletes the student and performs a cascade cleanup: automatically executes Task.deleteMany({ studentId: req.params.id })!')

    pdf.sub_title('Task Resource Endpoints')
    pdf.bullet('GET /api/tasks', 'Query Params: ?status=todo&studentId=<ObjectId>. Returns tasks with populated studentId (name & rollNumber).')
    pdf.bullet('GET /api/students/:id/tasks', 'Returns all tasks assigned specifically to the student identified by ObjectId or rollNumber.')
    pdf.bullet('POST /api/tasks', 'Creates a task. Body must include title, dueDate, priority (low/medium/high), status (todo/in-progress/done), and optional studentId.')
    pdf.bullet('PATCH /api/tasks/:id', 'Performs partial updates, primarily used for dragging Kanban cards to update status or changing priority.')
    pdf.bullet('DELETE /api/tasks/:id', 'Permanently removes a task document by its ObjectId.')

    pdf.sub_title('Sample JSON Payloads')
    pdf.paragraph('Student Creation Payload (POST /api/students):')
    pdf.code_box('''{
  "name": "Aarav Sharma",
  "email": "aarav.sharma@college.edu",
  "rollNumber": "STU101",
  "department": "Computer Science & Engineering",
  "year": 3,
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "bio": "Passionate full-stack developer and open source enthusiast.",
  "socialLinks": {
    "github": "https://github.com/aarav-sharma",
    "linkedin": "https://linkedin.com/in/aarav-sharma"
  }
}''')

    pdf.paragraph('Task Creation Payload (POST /api/tasks):')
    pdf.code_box('''{
  "title": "Complete Database Schema Design",
  "description": "Design normalized Mongoose schemas with indexing on rollNumber and text search.",
  "dueDate": "2026-11-15T18:30:00.000Z",
  "priority": "high",
  "status": "in-progress",
  "studentId": "65f1234abcd567890ef12345"
}''')

    # ------------------ SECTION 4 ------------------
    pdf.add_page()
    pdf.chapter_title('4', 'Mastering Postman: Step-by-Step API Testing Guide')
    
    pdf.paragraph(
        'Postman is an industry-standard API client and testing platform. It allows engineers to simulate client requests, '
        'inspect headers and raw response payloads, mock servers, and write automated assertion scripts before connecting a frontend.'
    )
    
    pdf.sub_title('4.1 Setting Up Postman for EduSphere')
    pdf.bullet('Step 1: Create a Workspace', 'Open Postman -> Workspaces -> New Workspace -> Name it "EduSphere Dev".')
    pdf.bullet('Step 2: Create an Environment', 'Click "Environments" -> Add -> Name it "Localhost". Add variable:')
    pdf.bullet('        Variable Name', 'base_url | Initial Value: http://localhost:3000/api | Current Value: http://localhost:3000/api')
    pdf.bullet('Step 3: Create a Collection', 'Collections -> "+" -> Name it "EduSphere API Suite". Set Collection Auth to "Inherit auth from parent".')

    pdf.sub_title('4.2 Executing Requests Step-by-Step')
    pdf.paragraph(
        'To test any endpoint in Postman, follow this precise sequence:\n'
        '1. Set the Method selector to the appropriate verb (GET, POST, PUT, PATCH, DELETE).\n'
        '2. Enter the URL with environment variables: {{base_url}}/students or {{base_url}}/tasks.\n'
        '3. Go to the "Headers" tab: Ensure Key: Content-Type, Value: application/json is present.\n'
        '4. Go to the "Body" tab (for POST, PUT, PATCH): Select "raw", then in the right dropdown pick "JSON".\n'
        '5. Paste the JSON payload and click the blue "Send" button.\n'
        '6. Inspect the lower pane: Check Status (e.g., 201 Created), Response Time (< 50ms), and Response Body.'
    )

    pdf.sub_title('4.3 Automated Postman Test Scripts & Environment Variables')
    pdf.paragraph(
        'Postman allows JavaScript execution in the "Tests" tab after a response arrives. '
        'Here is the automated test script used in EduSphere to validate status codes, assert schema integrity, '
        'and automatically capture the generated MongoDB _id into an environment variable for subsequent requests:'
    )
    pdf.code_box('''// In Postman -> Tests tab of "POST /api/students"
pm.test("Status code is 201 Created", function () {
    pm.response.to.have.status(201);
});

pm.test("Response contains valid MongoDB _id and rollNumber", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property("_id");
    pm.expect(jsonData.rollNumber).to.eql("STU101");
    
    // Automatically save created student ID into environment for subsequent requests!
    pm.environment.set("created_student_id", jsonData._id);
    console.log("Saved student ID to environment:", jsonData._id);
});''')

    pdf.callout(
        'Chain Requests Like a Pro: By using pm.environment.set("created_student_id", jsonData._id), '
        'your next request in the collection (such as "POST /api/tasks") can simply reference {{created_student_id}} '
        'in its request body! This eliminates all manual copying and pasting of MongoDB ObjectIds.',
        'POSTMAN AUTOMATION WORKFLOW'
    )

    # ------------------ SECTION 5 ------------------
    pdf.add_page()
    pdf.chapter_title('5', 'Database Modeling: MongoDB & Mongoose Deep Dive')
    
    pdf.sub_title('5.1 NoSQL Document Store vs Relational SQL')
    pdf.paragraph(
        'Traditional SQL databases (PostgreSQL, MySQL) store data in rigid rows and columns with foreign keys. '
        'MongoDB is a document-oriented database that stores records as BSON (Binary JSON) documents inside collections. '
        'This allows flexible, nested structures (such as storing skills as an array ["React", "Node"] directly within the student document '
        'without needing an auxiliary join table).'
    )
    
    pdf.sub_title('5.2 Relational Design in NoSQL: Referencing vs Embedding')
    pdf.paragraph(
        'A critical architectural decision in MongoDB is whether to embed child data inside a parent document or reference it by ID.'
    )
    pdf.bullet('Embedding (Pros & Cons)',
               'Storing tasks directly inside student.tasks array. Pros: Single read retrieves student and tasks. '
               'Cons: Document size limit (16MB in MongoDB), difficult to query tasks globally across all students (e.g. Kanban board), '
               'and poor scalability when students have hundreds of tasks.')
    pdf.bullet('Referencing (EduSphere Choice)',
               'Tasks are stored in their own dedicated tasks collection with a studentId field containing a mongoose.Schema.Types.ObjectId '
               'referencing the Student model. This allows the global Kanban board to query tasks across all students efficiently, '
               'while Mongoose .populate("studentId") dynamically resolves the student name when needed.')

    pdf.sub_title('5.3 Schema Indexing for Blazing Search Performance')
    pdf.paragraph(
        'To ensure sub-millisecond search performance even as student records grow into tens of thousands, '
        'EduSphere defines a compound text index in Student.js:'
    )
    pdf.code_box('// backend/models/Student.js - Line 52\nstudentSchema.index({ name: "text", rollNumber: "text" });')
    pdf.paragraph(
        'In addition, the unique: true declaration on email and rollNumber automatically creates unique B-tree indexes '
        'in MongoDB, ensuring O(log N) lookup time and hardware-level enforcement against duplicate entries.'
    )

    # ------------------ SECTION 6 ------------------
    pdf.add_page()
    pdf.chapter_title('6', 'Frontend Architecture & Offline Fallback Engine')
    
    pdf.sub_title('6.1 Why Vanilla JavaScript & CSS Variables?')
    pdf.paragraph(
        'Instead of adding massive bundle sizes and compilation steps with heavy frameworks, EduSphere is built with '
        'pure ES6+ JavaScript and modern CSS custom properties (design tokens). This delivers instantaneous page loads (0ms build time), '
        'native browser debugging, and complete control over DOM operations.'
    )
    
    pdf.sub_title('6.2 The Resilient Hybrid Fallback Pattern')
    pdf.paragraph(
        'A common failure in academic demonstrations is when MongoDB is not running locally, causing the entire UI to crash. '
        'EduSphere implements a defensive dual-mode data layer in frontend/js/api.js:'
    )
    pdf.code_box('''// Resilient Backend Check with 1500ms Abort Controller Timeout
async function checkBackend() {
  if (isBackendAvailable !== null) return isBackendAvailable;
  try {
    const res = await fetch(API_BASE + '/students', { signal: AbortSignal.timeout(1500) });
    isBackendAvailable = res.ok;
  } catch {
    isBackendAvailable = false;
  }
  return isBackendAvailable;
}''')
    pdf.paragraph(
        'If the backend is reachable, fetch() dispatches over the network. If unreachable or timeout occurs, '
        'the function transparently redirects queries to MOCK_STUDENTS and MOCK_TASKS arrays in memory. '
        'The UI remains 100% interactive and functional without errors!'
    )

    # ------------------ SECTION 7 ------------------
    pdf.chapter_title('7', 'Viva & Technical Interview Masterclass (Top Q&A)')
    
    pdf.sub_title('Q1: What is the purpose of CORS and where is it configured?')
    pdf.paragraph(
        'Answer: CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks web pages from making AJAX/Fetch '
        'requests to a domain, port, or protocol different from the one that served the page. Since our frontend can run on '
        'http://localhost:5500 (Live Server) and the backend on http://localhost:3000, the browser would block requests by default. '
        'We configure app.use(cors()) in backend/server.js to send the Access-Control-Allow-Origin header.'
    )
    
    pdf.sub_title('Q2: What is the difference between PUT and PATCH in your API?')
    pdf.paragraph(
        'Answer: PUT replaces the entire resource with the incoming payload (used in /api/students/:id to replace all profile attributes). '
        'PATCH applies partial updates without modifying untouched fields (used in /api/tasks/:id when a user only drags a task to "done" '
        'or changes its priority without resending title or dueDate).'
    )
    
    pdf.sub_title('Q3: How do you handle cascade deletes in MongoDB?')
    pdf.paragraph(
        'Answer: Unlike relational SQL with ON DELETE CASCADE foreign key triggers, MongoDB does not automatically delete related documents. '
        'In EduSphere, we implement programmatic cascading inside studentController.deleteStudent: when a student is deleted via '
        'findByIdAndDelete, we immediately run Task.deleteMany({ studentId: req.params.id }) before returning the response.'
    )
    
    pdf.sub_title('Q4: How does Mongoose .populate() work under the hood?')
    pdf.paragraph(
        'Answer: In Task.find().populate("studentId", "name rollNumber"), Mongoose first queries the tasks collection. '
        'It collects all unique studentId ObjectIds from the results, executes a secondary batch query on the students collection '
        '(similar to SELECT name, rollNumber FROM students WHERE _id IN (...)), and seamlessly replaces the ObjectId reference '
        'with the resolved student object before returning the JSON.'
    )

    pdf.output('EduSphere_Complete_Project_Guide.pdf')
    print('EduSphere_Complete_Project_Guide.pdf successfully created!')

if __name__ == '__main__':
    build_pdf()
