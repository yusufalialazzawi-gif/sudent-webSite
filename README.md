# Sora Education — Premium Multilingual Turkey Education Platform 🇹🇷

A production-ready educational consulting and university admissions platform built for students wanting to study at prestigious private and public universities in Türkiye (inspired by the aesthetics and architecture of [soraedu-tr.com](https://soraedu-tr.com/)).

The platform includes a **multilingual public portal** (Arabic RTL default, Turkish LTR, English LTR), a **secure administrative control dashboard**, a **complete RESTful API backend**, and a **relational database** with normalized multi-language support.

---

## 🌟 Key Highlights & Capabilities

- **Multilingual By Design:**
  - Arabic (default, authentic RTL typography with Google Cairo font).
  - Turkish (LTR with Turkish educational terminology).
  - English (LTR for global international students).
- **Public Portal:**
  - Fast search with filters (city, degree, language, tuition range).
  - University profiles (campus specs, accreditations, requirements).
  - Academic program catalog (tuition, discounts, duration, career prospects).
  - Student consulting services (equivalency/denklik, visas, housing).
  - Preparation courses & exams (TR-YÖS, TÖMER, SAT, TOEFL).
  - Exclusive agency scholarships & tuition discounts (up to 75%).
  - Multi-step Student Application Form with confidential document upload.
  - Interactive Floating WhatsApp bridge with dynamic localized message pre-fills.
- **Administrative Control Portal (`/admin`):**
  - Live Admissions Pipeline & Metrics (Total leads, reviews, admitted, enrolled).
  - Student Dossiers manager with secure document download stream.
  - University & Program Catalog manager with tabbed multilingual copy editors.
  - Visual Page Builder (CMS) with section reordering and live visibility toggles.
  - Media Library with upload management and localized SEO Alt tags.
  - Multilingual Coverage Matrix auditing missing translations in real-time.
  - Global Platform Settings (WhatsApp numbers, contact emails, branding).
  - Staff Accounts & Role-Based Access Control (RBAC) with system audit logs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons, React Router v6, TanStack Query, i18next |
| **Backend** | Node.js (ESM), Express.js, Prisma ORM, JWT, Bcrypt, Multer, Helmet, Rate Limiter |
| **Database** | SQLite (zero-dependency local development/testing) & PostgreSQL (enterprise production schema) |
| **Testing** | Node native test runner (`node --test`), automated integration test suite |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ or v20+
- npm v9+

### 2. Backend Setup & Startup
```bash
cd backend
npm install
npx prisma generate
node prisma/seed.js
npm start
```
*Backend server runs at `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).*

### 3. Frontend Setup & Startup
```bash
cd frontend
npm install
npm run dev -- --host 127.0.0.1 --port 5173
```
*Public website runs at `http://127.0.0.1:5173/`.*
*Admin portal runs at `http://127.0.0.1:5173/admin`.*

---

## 🔑 Pre-Seeded Administrative Credentials

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@soraedu-tr.com` | `Admin@2026!` | Full platform control, staff management, settings, audit logs |
| **Admissions Officer** | `admissions@soraedu-tr.com` | `Admissions@2026!` | Student applications, documents review, internal notes, pipeline updates |
| **Content Editor** | `editor@soraedu-tr.com` | `Editor@2026!` | Universities, programs, services, scholarships, courses, CMS & blog |

*(The `/admin/login` page features one-click demo account buttons to fast-fill these credentials during review).*

---

## 🧪 Testing & Validation

To execute the automated backend test suite:
```bash
cd backend
npm test
```
*Executes health checks, public university filtering, student application submission, authentication, and admin access control validation.*

To verify frontend production build:
```bash
cd frontend
npm run build
```

---

## 📚 Technical Documentation Index

- [Comprehensive REST API Documentation](docs/API_DOCUMENTATION.md)
- [Database Architecture & Entity Dictionary](docs/DATABASE_ARCHITECTURE.md)
- [Production Deployment & Nginx Guide](docs/DEPLOYMENT_GUIDE.md)
- [Security, KVKK/GDPR & Privacy Architecture](docs/SECURITY_AND_PRIVACY.md)

---

## 📄 License
Proprietary & Confidential — Sora Education Platform 2026.
