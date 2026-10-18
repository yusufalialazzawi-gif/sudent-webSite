# Sora Education Platform — Security & Data Privacy Architecture

## 1. Regulatory Compliance (KVKK / GDPR Standards)
As an educational admissions platform processing international student data, the Sora Education Platform implements comprehensive privacy protections adhering to Turkey's Personal Data Protection Law (KVKK) and the European Union General Data Protection Regulation (GDPR):

1. **Lawful Basis for Processing:** Explicit student consent collected on the multi-step application form before processing identity and academic records.
2. **Data Minimization:** Only documents necessary for Turkish university admission (passport, diploma, transcript, language certificate) are stored.
3. **Right to Erasure & Access:** Built-in administrative workflows allow data export or permanent deletion upon verified student request.

---

## 2. Authentication & Cryptography
- **Password Hashing:** Passwords are never stored in plaintext. They are salted and hashed using **bcrypt** with a work factor of 10 rounds.
- **Session Tokens:** Stateless JSON Web Tokens (JWT) signed using HMAC SHA-256 (`HS256`) with configurable expiration (`JWT_EXPIRES_IN=7d`).
- **Token Invalidation:** Client tokens are discarded on sign out; API returns standard `401 Unauthorized` headers if tokens are malformed or expired.

---

## 3. Role-Based Access Control (RBAC) Matrix

| Endpoint Group | `SUPER_ADMIN` | `ADMIN` | `ADMISSIONS_OFFICER` | `CONTENT_EDITOR` | Public |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Public Site & Search** | Full | Full | Full | Full | Read-Only |
| **Submit Application / Lead** | Yes | Yes | Yes | Yes | Create |
| **View Student Dossiers & Docs**| Full | Full | Assigned/All | No | No |
| **Update Application Status** | Full | Full | Full | No | No |
| **Manage Universities & Programs**| Full | Full | View Only | Full CRUD | View Only |
| **CMS & Media Library** | Full | Full | View Only | Full CRUD | View Only |
| **Manage Staff & Roles** | Full | View Only | No | No | No |
| **System Audit Logs** | Full | View Only | No | No | No |
| **Site Settings & Branding** | Full | View Only | No | No | No |

---

## 4. Protected Storage for Student Documents
To prevent unauthorized indexing or scraping of confidential identity papers:

```
backend/
├── uploads/                        <-- Public Marketing Media (served via /uploads/...)
│   └── campus-medipol.jpg
└── uploads/
    └── private/                    <-- Confidential Student Data (BLOCKED from static serving)
        └── applications/
            ├── passport-1718000000.pdf
            └── transcript-1718000000.pdf
```

- **Protection Guarantee:** The static file server (`express.static`) only serves the root `uploads/` directory. The `uploads/private/` directory is deliberately excluded from static routing.
- **Controlled Access:** Documents are accessed exclusively via authenticated endpoints (`GET /api/applications/admin/documents/:docId/download`) which verify valid JWT tokens and log the access in the audit ledger.

---

## 5. Network Defense & Threat Prevention
- **Helmet Headers:** Secures HTTP headers, prevents MIME sniffing, disables browser DNS prefetching, and mitigates clickjacking via `X-Frame-Options: SAMEORIGIN`.
- **CORS White-listing:** Restricts cross-origin resource sharing to designated client domains (`CORS_ORIGIN`).
- **Rate Limiting:** Protects `/api/auth/login` and `/api/applications/public-submit` against credential stuffing and denial-of-service spam using `express-rate-limit`.
- **Audit Logging:** Every critical modification (create, update, delete, role assignment) writes an immutable record to the `AuditLog` table capturing user identity and originating IP address.
