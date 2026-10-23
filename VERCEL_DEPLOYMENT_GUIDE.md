# 🚀 Vercel Canlı Yayınlama Rehberi (Vercel Deployment Guide)

Bu rehber, **شركة المجد للقبولات الجامعية** projenizi Vercel üzerinde 2 dakikada yayına almanız için hazırlanmıştır.

---

## ⚡ Adım 1: Vercel'e Giriş Yapın
1. [vercel.com](https://vercel.com) adresine gidin.
2. **Continue with GitHub** seçeneği ile GitHub hesabınızla giriş yapın.

---

## ⚡ Adım 2: Projeyi İçe Aktarın (Import Project)
1. Vercel panonuzda **"Add New..."** butonuna ve ardından **"Project"** seçeneğine tıklayın.
2. Açılan listeden **`yusufalialazzawi-gif/sudent-webSite`** reponuzu bulun ve **"Import"** butonuna tıklayın.

---

## ⚡ Adım 3: Yapılandırma Ayarları (Otomatik Hazırlandı)
Sizin için hazırladığımız `vercel.json` sayesinde ayarlar otomatik algılanır:
- **Framework Preset**: `Vite`
- **Root Directory**: `.` (veya `frontend` seçebilirsiniz; her iki durum için de `vercel.json` eklendi)
- **Build Command**: `npm --prefix frontend install && npm --prefix frontend run build`
- **Output Directory**: `frontend/dist`

---

## ⚡ Adım 4: Ortam Değişkenleri (Environment Variables) - Opsiyonel
Eğer Backend'inizi (Node.js API) Render / Railway / kendi VPS sunucunuzda yayınladıysanız:
- **Name**: `VITE_API_URL`
- **Value**: `https://api-sunucunuz.com` (örneğin: `https://majid-backend.onrender.com`)

*(Eğer henüz bir backend URL girmezseniz, site statik fallback verileri ve tüm üniversiteler, görseller ve WhatsApp butonlarıyla eksiksiz çalışır).*

---

## ⚡ Adım 5: "Deploy" Butonuna Basın
- **"Deploy"** butonuna tıklayın.
- Yaklaşık 45-60 saniye içinde siteniz dünya çapında **`.vercel.app`** uzantılı ücretsiz ve SSL sertifikalı (https) olarak yayına girecektir! 🎉
- Dilerseniz Vercel Settings -> Domains kısmından kendi `.com` alan adınızı da bağlayabilirsiniz.
