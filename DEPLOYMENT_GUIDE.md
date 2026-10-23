# 🚀 SoraEdu Platform - Production Deployment Guide (Yayınlama Rehberi)

Bu rehber, projenizi canlı sunucuda (Ubuntu / VPS / Cloud) yayına almak için adım adım hazırlanmıştır.

---

## 1. Sistem Gereksinimleri
- **Node.js**: v18.x veya v20.x LTS
- **NPM**: v9+ veya v10+
- **PM2**: Node.js süreç yöneticisi (`npm install -g pm2`)
- **Nginx**: Web sunucusu ve ters vekil (Reverse Proxy)
- **Certbot**: Ücretsiz SSL sertifikası (Let's Encrypt)

---

## 2. Ortam Değişkenleri (.env)

### Backend (`/backend/.env`)
```ini
PORT=5000
NODE_ENV=production
DATABASE_URL="file:./dev.db" # veya PostgreSQL: "postgresql://user:pass@localhost:5432/dbname"
JWT_SECRET=guclu_ve_rastgele_bir_anahtar_buraya_yazilmalidir_2026
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://siteniz.com
UPLOAD_DIR=./uploads
PRIVATE_DOCS_DIR=./storage/private_documents
```

---

## 3. Kurulum ve Derleme Adımları

### A) Backend Hazırlığı
```bash
cd backend
npm install --production=false
npx prisma generate
npx prisma db push
npm run seed  # (Opsiyonel: İlk defa kuruluyorsa varsayılan verileri ve admin hesabını yükler)
```

### B) Frontend Derlemesi (Production Build)
```bash
cd ../frontend
npm install
npm run build
```
Derleme sonucunda `frontend/dist` klasörü oluşur. Bu klasör Nginx tarafından doğrudan sunulacaktır.

---

## 4. PM2 ile Backend Servisini Başlatma
```bash
cd ../backend
pm2 start server.js --name "soraedu-backend"
pm2 save
pm2 startup
```

---

## 5. Nginx Yapılandırması (Örnek `/etc/nginx/sites-available/soraedu`)

```nginx
server {
    server_name siteniz.com www.siteniz.com;

    # Frontend Statik Dosyaları
    root /var/www/soraedu/frontend/dist;
    index index.html;

    # SPA Yönlendirmesi
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Yönlendirmesi
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Yüklenen Medyalar ve Dosyalar
    location /uploads/ {
        proxy_pass http://127.0.0.1:5000/uploads/;
        proxy_set_header Host $host;
    }

    # Güvenlik ve İstemci Boyutu (Büyük evrak yüklemeleri için)
    client_max_body_size 25M;
}
```

Nginx servisini test edin ve yeniden başlatın:
```bash
sudo ln -s /etc/nginx/sites-available/soraedu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 6. SSL Sertifikası Kurulumu (HTTPS)
```bash
sudo certbot --nginx -d siteniz.com -d www.siteniz.com
```

---

## 7. Yönetici (Admin) Giriş Bilgileri
- **Admin Giriş Paneli:** `https://siteniz.com/admin/login`
- **E-posta:** `admin@soraedu-tr.com`
- **Şifre:** `Admin@2026!`
*(Giriş yaptıktan sonra "Ekip / Staff" bölümünden şifrenizi değiştirebilirsiniz).*

---

## 8. Üç Dilli İçerik Yönetimi Özeti
1. **Veritabanı Öğeleri:** Üniversiteler, Programlar, Hizmetler, Kurslar, Burslar ve Makaleler için form doldurulduğunda sistem Arapça, Türkçe ve İngilizce kayıtları otomatik olarak eksiksiz kaydeder.
2. **Site Ayarları:** Logo, üst menü, hero görselleri, footer ve iletişim bilgileri Admin Panelindeki `Site Ayarları` sayfasından anında güncellenir.
3. **Sayfa Düzeni:** `Sayfa Yapıcı (Page Builder)` ile ana sayfa bölümlerinin sırasını ve görünürlüğünü değiştirebilirsiniz.
