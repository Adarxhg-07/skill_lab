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
            self.set_text_color(100, 116, 139)
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
        self.set_text_color(148, 163, 184)
        self.cell(0, 6, 'EduSphere Project - MongoDB | Express.js | Node.js | Vanilla JS | REST API', border=0, align='L')
        self.cell(0, 6, f'Page {self.page_no()} of {self.page_count_display()}', border=0, align='R')

    def page_count_display(self):
        return '{nb}'

    def chapter_title(self, number, title):
        self.ln(4)
        self.set_fill_color(238, 242, 255)
        self.set_draw_color(99, 102, 241)
        self.set_line_width(0.8)
        self.set_font('helvetica', 'B', 12)
        self.set_text_color(67, 56, 202)
        self.cell(0, 9, f"  SECTION {number}: {title.upper()}", border=1, fill=True, new_x="LMARGIN", new_y="NEXT")
        self.set_line_width(0.2)
        self.ln(4)

    def sub_title(self, title):
        self.set_font('helvetica', 'B', 11)
        self.set_text_color(15, 23, 42)
        self.cell(0, 7, title, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def paragraph(self, text):
        self.set_font('helvetica', '', 9.5)
        self.set_text_color(51, 65, 85)
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
        self.set_fill_color(240, 253, 250)
        self.set_draw_color(20, 184, 166)
        self.set_line_width(0.5)
        self.set_font('helvetica', 'B', 9)
        self.set_text_color(15, 118, 110)
        self.cell(0, 6, f"  [!] {title}", border='LTR', fill=True, new_x="LMARGIN", new_y="NEXT")
        self.set_font('helvetica', '', 8.8)
        self.set_text_color(19, 78, 74)
        self.multi_cell(0, 4.8, f"  {text}", border='LBR', fill=True)
        self.set_line_width(0.2)
        self.ln(3)

    def code_box(self, code_text):
        self.set_fill_color(248, 250, 252)
        self.set_draw_color(203, 213, 225)
        self.set_text_color(30, 41, 59)
        self.set_font('courier', '', 8.2)
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
    pdf.add_page()
    pdf.set_fill_color(15, 23, 42)
    pdf.rect(18, 18, 174, 52, 'F')
    
    pdf.set_xy(22, 24)
    pdf.set_font('helvetica', 'B', 20)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 9, 'EDUSPHERE FULL-STACK GUIDE', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_xy(22, 35)
    pdf.set_font('helvetica', 'B', 11)
    pdf.set_text_color(129, 140, 248)
    pdf.cell(0, 6, 'Architecture, REST APIs, MongoDB, Postman & Topic Interconnections', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_xy(22, 45)
    pdf.set_font('helvetica', '', 9)
    pdf.set_text_color(203, 213, 225)
    pdf.cell(0, 5, 'Author: Adarsh G | Project: Skill Lab Engineering Project | Status: Production-Ready', new_x="LMARGIN", new_y="NEXT")
    pdf.set_xy(22, 52)
    pdf.set_text_color(148, 163, 184)
    pdf.cell(0, 5, 'Stack: Node.js (v24), Express.js 4, MongoDB/Mongoose ODM, Vanilla JS (ES6+), Modern CSS3', new_x="LMARGIN", new_y="NEXT")
    
    pdf.set_y(76)
    pdf.sub_title('Document Overview & Purpose')
    pdf.paragraph(
        'This comprehensive technical manual provides an exhaustive, production-grade breakdown of the EduSphere student '
        'management and task tracking platform. It covers everything from high-level architectural design and client-server '
        'communication down to the raw byte transfers of HTTP verbs, Mongoose ODM schemas, Postman integration testing suites, '
        'and cross-layer data lifecycle management.'
    )
    
    pdf.sub_title('System Specifications at a Glance')
    pdf.table_row('Component', 'Technology Choice', 'Key Role & Responsibilities', 'Architectural Pattern', is_header=True)
    pdf.table_row('Client UI', 'HTML5 + Vanilla CSS3', 'Render reactive dashboards, cards, modals', 'Multi-Page App + SPA dynamic DOM')
    pdf.table_row('API Client', 'Fetch API + Custom Layer', 'Abstract HTTP calls, handle mock fallback', 'Repository / Client Service Pattern')
    pdf.table_row('Web Server', 'Node.js + Express.js 4', 'Routing, CORS, JSON parsing, error handling', 'Layered REST Controller Pattern')
    pdf.table_row('Data Tier', 'MongoDB + Mongoose ODM', 'Persistent document storage, schema validation', 'Document store with ObjectId refs')
    pdf.table_row('Testing Tool', 'Postman / Newman CLI', 'Contract validation, endpoint regression testing', 'Automated assertion test scripts')
    pdf.ln(4)

    pdf.chapter_title('1', 'System Architecture & Topic Interconnections')
    pdf.paragraph(
        'EduSphere is structured as a decoupled 3-tier architecture with an intelligent resilient client layer. '
        'The three primary tiers are the Client Layer (Browser DOM), the Application Server Tier (Node/Express), '
        'and the Persistence Layer (MongoDB).'
    )
    
    pdf.bullet('1. Presentation & Interaction (Browser)',
               'User actions trigger native event listeners in modular scripts (app.js, students.js, tasks.js, portfolio.js).')
    pdf.bullet('2. The Abstraction Bridge (api.js)',
               'Centralizes all HTTP transactions with an active backend health-check (checkBackend()).')
    pdf.bullet('3. The HTTP Network Boundary',
               'Requests traverse over standard HTTP using JSON payloads with Content-Type: application/json.')
    pdf.bullet('4. Express Server Middleware Pipeline',
               'cors() -> express.json() -> Route match -> Controller -> errorHandler.')
    pdf.bullet('5. Mongoose ODM & MongoDB',
               'Validates schemas and executes CRUD operations with referencing and population.')
    
    pdf.output('EduSphere_Complete_Project_Guide.pdf')
    print('EduSphere_Complete_Project_Guide.pdf created')

if __name__ == '__main__':
    build_pdf()
