# 🚀 Render.com Canlı Yayınlama Rehberi (Render Deployment Guide)

Bu rehber, **شركة المجد للقبولات الجامعية** projenizi Render.com üzerinde **tek tıkla, ücretsiz ve kesintisiz (uykusuz)** olarak yayına almanız için hazırlanmıştır.

---

## 🌟 1. Adım: Render'a Giriş Yapın
1. **[render.com](https://render.com)** adresine gidin.
2. **"Sign In" ➔ "GitHub"** ile hesabınıza giriş yapın.

---

## 🌟 2. Adım: Yeni Bir Servis Oluşturun
1. Render panosunda sağ üstteki mavi **"New +"** butonuna tıklayın.
2. **"Web Service"** seçeneğini seçin.
3. **`yusufalialazzawi-gif/sudent-webSite`** reponuzu bulun ve yanındaki **"Connect"** butonuna tıklayın.

---

## 🌟 3. Adım: Ayarları Girin (Çok Basit!)
Açılan sayfada şu bilgileri doldurun:

- **Name:** `majid-student`
- **Region:** `Frankfurt (EU Central)` *(Türkiye ve Orta Doğu için en hızlı bölge)*
- **Branch:** `main`
- **Root Directory:** *(BOŞ BIRAKIN - Boş bıraktığınızda tüm site ve API tek linkte çalışır)*
- **Runtime:** `Node`
- **Build Command:** `npm run build`
- **Start Command:** `npm start`
- **Instance Type:** `Free` (Ücretsiz)

### 🔑 Ortam Değişkenleri (Environment Variables):
Aşağı kaydırıp **"Add Environment Variable"** butonuna basarak şunları ekleyin:
- `NODE_ENV` ➔ `production`
- `DATABASE_URL` ➔ `file:./dev.db`
- `JWT_SECRET` ➔ `majid_secret_2026_guclu_anahtar`
- `CORS_ORIGIN` ➔ `*`

En alttaki **"Deploy Web Service"** butonuna tıklayın! 🚀

---

## 🌟 4. Adım: Render'ı Uykusuz Yapın (7/24 Kesintisiz)
Render ücretsiz planda 15 dakika istek gelmezse uykuya geçer. Bunu engellemek ve **sitenin 7/24 anında açılmasını sağlamak için**:

1. Render'da projeniz açılınca size verilen linki kopyalayın:  
   *(Örnek: `https://majid-student.onrender.com`)*
2. **[uptimerobot.com](https://uptimerobot.com)** adresine gidin ve ücretsiz hesap açın.
3. **"+ Add New Monitor"** butonuna tıklayın:
   - **Monitor Type:** `HTTP(s)`
   - **Friendly Name:** `Majid Platform`
   - **URL:** `https://majid-student.onrender.com/api/health`
   - **Monitoring Interval:** `5 minutes` (Her 5 dakikada bir)
4. **"Create Monitor"** deyin.

🎉 **Tebrikler!** Siteniz artık **7/24 hiç uyumadan**, tüm üniversite verileri, admin paneli ve başvuru sistemiyle birlikte dünya genelinde ücretsiz yayında!
