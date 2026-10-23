# 🚀 Render.com Tek Domain Yayınlama Rehberi

Bu rehber, projenizi **Render.com** üzerinde tek bir servis ve tek bir alan adı (domain) altında ücretsiz yayınlamanız için hazırlanmıştır.

---

## 🌟 Avantajlar
- **Tek Domain:** Hem ana site (`/`) hem de admin paneli (`/admin`) aynı alan adı altında çalışır.
- **Sıfır CORS Hatası:** Frontend ve Backend aynı sunucudan sunulduğu için bağlantı sorunu yaşanmaz.
- **Ücretsiz SSL:** Render otomatik olarak HTTPS (yeşil kilit) sertifikası tanımlar.

---

## 1. Adım: Kodları GitHub'a Yükleyin
Projeyi henüz bir GitHub deposuna yüklemediyseniz:
```bash
git add .
git commit -m "Render deployment setup"
git branch -M main
# GitHub'da oluşturduğunuz depoya gönderin:
git remote add origin https://github.com/KULLANICI_ADINIZ/DEPO_ADINIZ.git
git push -u origin main
```

---

## 2. Adım: Render.com'da Web Service Oluşturun
1. [dashboard.render.com](https://dashboard.render.com/) adresine gidin ve **GitHub ile giriş yapın**.
2. Sağ üstteki **"New +"** butonuna tıklayın ve **"Web Service"** seçin.
3. GitHub deponuzu (repository) listeden seçin ve **"Connect"** deyin.

---

## 3. Adım: Servis Ayarlarını Girin
Açılan ekranda şu alanları doldurun:

| Alan | Değer |
| :--- | :--- |
| **Name** | `majid-student` |
| **Region** | `Frankfurt (EU Central)` *(Türkiye'ye en yakın ve en hızlı lokasyon)* |
| **Branch** | `main` |
| **Root Directory** | *(Boş bırakın)* |
| **Runtime** | `Node` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` |

---

## 4. Adım: Ortam Değişkenlerini (Environment Variables) Ekleyin
Sayfanın altındaki **"Advanced"** -> **"Add Environment Variable"** kısmına şunları ekleyin:

- `NODE_ENV` = `production`
- `DATABASE_URL` = `file:./dev.db`
- `JWT_SECRET` = `super_guclu_jwt_anahtari_2026_xyz`
- `CORS_ORIGIN` = `*`

Ardından sayfanın en altındaki **"Create Web Service"** butonuna tıklayın.

---

## 5. Adım: Yayındasınız! 🎉
Render birkaç dakika içinde projeyi derler ve size bir link verir (Örnek: `https://sora-education.onrender.com`).

- **Ziyaretçi Ana Sayfası:** `https://sora-education.onrender.com/`
- **Yönetici Paneli:** `https://sora-education.onrender.com/admin`
- **Giriş Bilgileri:**
  - E-posta: `admin@soraedu-tr.com`
  - Şifre: `Admin@2026!`

---

## 6. Kendi Özel Domaininizi Bağlama (Örn: `siteniz.com`)
1. Render'da servis sayfanıza gidin, sol menüden **Settings**'e tıklayın.
2. **Custom Domains** bölümünde **"Add Custom Domain"** butonuna basın ve domaininizi yazın (örn: `siteniz.com`).
3. Render'ın size göstereceği CNAME / A kayıtlarını domain firmanızın (GoDaddy, Natro vb.) DNS ayarlarına ekleyin.
4. Render 5-10 dakika içinde ücretsiz SSL sertifikanızı da otomatik aktif edecektir.
