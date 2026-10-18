# Sora Education Platform — Production Deployment Guide

## 1. System Requirements & Architecture
- **Node.js:** v18.x or v20.x (LTS recommended)
- **Database:** PostgreSQL v14+ (or SQLite for lightweight instances)
- **Web Server:** Nginx (Reverse Proxy & SSL termination)
- **Process Manager:** PM2 or Docker Compose

---

## 2. Environment Configuration

Create production `.env` files in `backend/` and `frontend/`:

### Backend `.env`:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL="postgresql://sora_user:StrongPassword2026!@localhost:5432/sora_edu_prod?schema=public"
JWT_SECRET="SuperSecureSecretKeyChangeThisInProduction2026!"
JWT_EXPIRES_IN="7d"
UPLOAD_DIR="./uploads"
PRIVATE_UPLOAD_DIR="./uploads/private"
CORS_ORIGIN="https://soraedu-tr.com"
MAX_FILE_SIZE_MB=15
```

### Frontend `.env`:
```env
VITE_API_BASE_URL="https://soraedu-tr.com/api"
```

---

## 3. Database Migration & Seeding

```bash
cd backend

# Generate Prisma client
npx prisma generate

# If using PostgreSQL in production:
# Copy the PostgreSQL schema definition:
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Deploy database migrations
npx prisma migrate deploy

# Seed baseline catalogs, universities, and administrative accounts
node prisma/seed.js
```

---

## 4. Building the Applications

### 4.1 Build Frontend:
```bash
cd frontend
npm install
npm run build
# Generates optimized static assets in frontend/dist
```

### 4.2 Start Backend with PM2:
```bash
cd backend
npm install --production
pm2 start server.js --name "sora-backend" -i max
pm2 save
pm2 startup
```

---

## 5. Nginx Production Configuration

```nginx
server {
    listen 80;
    server_name soraedu-tr.com www.soraedu-tr.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name soraedu-tr.com www.soraedu-tr.com;

    ssl_certificate /etc/letsencrypt/live/soraedu-tr.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/soraedu-tr.com/privkey.pem;

    client_max_body_size 25M;

    # Frontend Single Page App
    location / {
        root /var/www/sora-platform/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Public Uploaded Assets
    location /uploads/ {
        alias /var/www/sora-platform/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 6. Verification Checklist
- [x] SSL certificate is active via Certbot (`certbot --nginx -d soraedu-tr.com`).
- [x] `/api/health` returns `{"status":"ok","mode":"production"}`.
- [x] Public homepage renders in Arabic RTL with Cairo font.
- [x] Student application file uploads persist to the private uploads folder.
- [x] Admin dashboard queries load metrics without CORS errors.
