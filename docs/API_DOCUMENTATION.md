# Sora Education Platform — Comprehensive REST API Documentation

## Overview
The Sora Education Platform backend is built using Express.js (ESM), Prisma ORM, JSON Web Tokens (JWT), Multer, Helmet, Rate Limiting, and CORS. It provides a full set of public endpoints for prospective students and a role-based administrative API for university advisors, content editors, and system administrators.

- **Base URL:** `http://localhost:5000/api` (or `/api` via Vite frontend proxy)
- **Authentication:** Bearer token (`Authorization: Bearer <token>`)
- **Supported Content Types:** `application/json`, `multipart/form-data` (for file uploads)

---

## 1. Authentication & Session Endpoints

### 1.1 POST `/api/auth/login`
Authenticates a staff user and returns a signed JWT token with their assigned RBAC role.

- **Access:** Public
- **Request Body:**
```json
{
  "email": "admin@soraedu-tr.com",
  "password": "Admin@2026!"
}
```
- **Response `200 OK`:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm0...abc",
    "email": "admin@soraedu-tr.com",
    "fullName": "Super Administrator",
    "role": "SUPER_ADMIN"
  }
}
```

### 1.2 GET `/api/auth/me`
Retrieves profile and role details of the currently authenticated staff member.
- **Access:** Authenticated (`SUPER_ADMIN`, `ADMIN`, `ADMISSIONS_OFFICER`, `CONTENT_EDITOR`)
- **Headers:** `Authorization: Bearer <token>`
- **Response `200 OK`:** Returns user object.

### 1.3 POST `/api/auth/change-password`
Allows an authenticated user to update their account password.
- **Access:** Authenticated
- **Request Body:** `{ "currentPassword": "...", "newPassword": "..." }`

---

## 2. University Catalog Endpoints

### 2.1 GET `/api/universities`
List published Turkish universities with multi-criteria filtering, ranking sort, and pagination.
- **Access:** Public
- **Query Parameters:**
  - `search`: Keyword matching slug, city, or multilingual university name.
  - `city`: Filter by city (e.g. `Istanbul`, `Ankara`).
  - `type`: `PRIVATE` or `PUBLIC`.
  - `featured`: `true` or `false`.
  - `language`: `TURKISH` or `ENGLISH`.
  - `degreeLevel`: `BACHELOR`, `MASTER_WITH_THESIS`, `PHD`, etc.
  - `sortBy`: `ranking`, `establishedYear`, `createdAt`.
  - `order`: `asc` or `desc`.
  - `lang`: Preferred translation language (`ar`, `tr`, `en`).
  - `page`, `limit`: Pagination controls.

### 2.2 GET `/api/universities/:slug`
Full profile of a university including campus specifications, multilingual overviews, admission criteria, and associated academic programs.
- **Access:** Public
- **Query Parameters:** `lang` (`ar`, `tr`, `en`)

### 2.3 Admin Endpoints (`/api/universities/admin/*`)
- **GET `/api/universities/admin/all`**: Returns all universities including drafts, programs counts, and full translations.
- **POST `/api/universities/admin`**: Creates a new university record and multi-language translations (`ar`, `tr`, `en`).
- **PUT `/api/universities/admin/:id`**: Updates university metadata, media URLs, published status, and upserts translations.
- **DELETE `/api/universities/admin/:id`**: Secure deletion with cascading safety checks (`SUPER_ADMIN` only).

---

## 3. Academic Programs & Degrees Endpoints

### 3.1 GET `/api/programs`
List academic offerings across universities with tuition filtering and sorting.
- **Access:** Public
- **Query Parameters:** `category`, `degreeLevel`, `studyLanguage`, `maxTuition`, `universityId`, `city`, `lang`, `page`, `limit`.

### 3.2 GET `/api/programs/:id`
Details of an academic program, faculty, career opportunities, and requirements.

### 3.3 Admin Endpoints (`/api/programs/admin/*`)
- **GET `/api/programs/admin/all`**: Full list with university mappings.
- **POST `/api/programs/admin`**: Create new academic program.
- **PUT `/api/programs/admin/:id`**: Update program and translations.
- **DELETE `/api/programs/admin/:id`**: Remove program.

---

## 4. Student Applications & Pipeline Endpoints

### 4.1 POST `/api/applications/public-submit`
Public multi-step application submission for prospective international students.
- **Access:** Public / Rate-limited
- **Content-Type:** `multipart/form-data`
- **Fields:**
  - `applicantName`, `email`, `phone`, `nationality`, `passportNumber`, `birthDate`, `gender`, `currentCountry`, `address`.
  - `highSchoolGpa`, `graduationYear`, `preferredLanguage`, `degreeLevel`, `desiredMajor`, `universityId`, `programId`.
  - `passport`: File (PDF, JPEG, PNG, max 10MB).
  - `highSchoolDiploma`: File.
  - `transcript`: File.
  - `languageCert`: File (optional).
  - `studentPhoto`: File (optional).
- **Security:** Private student files are stored in an encrypted/private directory not directly served as public static assets.

### 4.2 GET `/api/applications/admin`
List applications with status, search, and staff filter.
- **Access:** `SUPER_ADMIN`, `ADMIN`, `ADMISSIONS_OFFICER`
- **Query Parameters:** `status`, `search`, `assignedToId`, `page`, `limit`.

### 4.3 GET `/api/applications/admin/:id`
Complete student dossier, academic background, uploaded documents manifest, status history audit trail, and internal counselor notes.

### 4.4 PATCH `/api/applications/admin/:id/status`
Update student application pipeline stage.
- **Request Body:**
```json
{
  "status": "ACCEPTED",
  "note": "Official conditional acceptance letter issued by university."
}
```

### 4.5 POST `/api/applications/admin/:id/notes`
Add internal counselor notes to the student dossier.
- **Request Body:** `{ "noteText": "Contacted student via WhatsApp, waiting for apostilled transcript." }`

### 4.6 GET `/api/applications/admin/documents/:docId/download`
Authenticated, secure streaming download of a student's verification document.
- **Access:** `SUPER_ADMIN`, `ADMIN`, `ADMISSIONS_OFFICER`

---

## 5. Services, Prep Courses & Scholarships Endpoints

### 5.1 Student Services (`/api/services`)
- `GET /api/services`: Public listing of admission, visa, equivalency, and housing services.
- `GET /api/services/:slug`: Public service detail.
- `GET /api/services/admin/all`, `POST /api/services/admin`, `PUT /api/services/admin/:id`, `DELETE /api/services/admin/:id`.

### 5.2 Preparation Courses (`/api/courses`)
- `GET /api/courses`: Public exam preparation course listings (YÖS, TÖMER, SAT, TOEFL).
- `POST /api/courses/:id/register`: Public registration request.
- `GET /api/courses/admin/all`: Admin list with registration counts and applicant details.

### 5.3 Scholarships & Discounts (`/api/scholarships`)
- `GET /api/scholarships`: Public list of exclusive agency discount opportunities.
- `GET /api/scholarships/:slug`: Scholarship requirements and quota details.
- Full Admin CRUD endpoints at `/api/scholarships/admin/*`.

---

## 6. Visual CMS, Media Library & System Settings

### 6.1 Visual Page Builder (`/api/page-builder`)
- `GET /api/page-builder/sections/:pageName`: Publicly retrieve active sections.
- `GET /api/page-builder/admin/sections/:pageName`: Admin view of all sections.
- `PUT /api/page-builder/admin/sections/reorder`: Reorder sections order in bulk.
- `PUT /api/page-builder/admin/sections/:id`: Update section copy and JSON configs.

### 6.2 Media Assets (`/api/media`)
- `GET /api/media`: Filter media assets by type (`IMAGE`, `DOCUMENT`, `VIDEO`).
- `POST /api/media/upload`: Upload public marketing media assets with multilingual alt tags.
- `PUT /api/media/:id`: Update SEO alt texts.
- `DELETE /api/media/:id`: Delete record and disk file.

### 6.3 Translations Matrix (`/api/translations/matrix`)
- `GET /api/translations/matrix?modelType=universities|programs|services|articles`: Audits localization coverage across Arabic, Turkish, and English.

### 6.4 Global Settings (`/api/settings`)
- `GET /api/settings/public`: Public branding, WhatsApp number, interactive messages, and contact info.
- `GET /api/settings/admin` & `PUT /api/settings/admin`: Manage global configurations.

### 6.5 Staff & Audit Logs (`/api/staff`)
- `GET /api/staff` & `POST /api/staff`: Create staff accounts and assign RBAC roles.
- `GET /api/staff/audit-logs`: Review immutable system action trail with user and IP tracking.
