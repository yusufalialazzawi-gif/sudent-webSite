import React, { useEffect, useMemo, useState } from 'react';
import useSiteText from '../../hooks/useSiteText';

// قائمة الجامعات التركية الحقيقية المعتمدة - صور الحرم الجامعي
const TURKISH_UNIVERSITIES_HERO = [
  {
    url: '/uploads/universities/istanbul-universitesi.webp',
    nameAr: 'جامعة إسطنبول العريقة',
    nameTr: 'İstanbul Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/bogazici-universitesi.webp',
    nameAr: 'جامعة بوغازيتشي',
    nameTr: 'Boğaziçi Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/istanbul-teknik-universitesi.webp',
    nameAr: 'جامعة إسطنبول التقنية (İTÜ)',
    nameTr: 'İstanbul Teknik Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/koc-university.webp',
    nameAr: 'جامعة كوتش',
    nameTr: 'Koç Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/bilkent-university.webp',
    nameAr: 'جامعة بيلكنت',
    nameTr: 'Bilkent Üniversitesi',
    cityAr: 'أنقرة',
    cityTr: 'Ankara',
  },
  {
    url: '/uploads/universities/sabanci-university.webp',
    nameAr: 'جامعة سابانجي',
    nameTr: 'Sabancı Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/bahcesehir-university.webp',
    nameAr: 'جامعة بهتشه شهير',
    nameTr: 'Bahçeşehir Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/orta-dogu-teknik-universitesi.webp',
    nameAr: 'جامعة الشرق الأوسط التقنية (ODTÜ)',
    nameTr: 'Orta Doğu Teknik Üniversitesi',
    cityAr: 'أنقرة',
    cityTr: 'Ankara',
  },
  {
    url: '/uploads/universities/hacettepe-universitesi.webp',
    nameAr: 'جامعة حجة تبة',
    nameTr: 'Hacettepe Üniversitesi',
    cityAr: 'أنقرة',
    cityTr: 'Ankara',
  },
  {
    url: '/uploads/universities/ankara-universitesi.webp',
    nameAr: 'جامعة أنقرة',
    nameTr: 'Ankara Üniversitesi',
    cityAr: 'أنقرة',
    cityTr: 'Ankara',
  },
  {
    url: '/uploads/universities/yildiz-teknik-universitesi.webp',
    nameAr: 'جامعة يلدز التقنية',
    nameTr: 'Yıldız Teknik Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/marmara-universitesi.webp',
    nameAr: 'جامعة مرمرة',
    nameTr: 'Marmara Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/istanbul-medipol-university.webp',
    nameAr: 'جامعة إسطنبول ميدي بول',
    nameTr: 'İstanbul Medipol Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/istanbul-aydin-university.webp',
    nameAr: 'جامعة إسطنبول أيدن',
    nameTr: 'İstanbul Aydın Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/ege-universitesi.webp',
    nameAr: 'جامعة إيجة',
    nameTr: 'Ege Üniversitesi',
    cityAr: 'إزمير',
    cityTr: 'İzmir',
  },
  {
    url: '/uploads/universities/galatasaray-universitesi.webp',
    nameAr: 'جامعة غلطة سراي',
    nameTr: 'Galatasaray Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/yeditepe-university.webp',
    nameAr: 'جامعة يدي تبه',
    nameTr: 'Yeditepe Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/uskudar-university.webp',
    nameAr: 'جامعة أوسكودار',
    nameTr: 'Üsküdar Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/istinye-university.webp',
    nameAr: 'جامعة إستينيا',
    nameTr: 'İstinye Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
  {
    url: '/uploads/universities/altinbas-university.webp',
    nameAr: 'جامعة ألتن باش',
    nameTr: 'Altınbaş Üniversitesi',
    cityAr: 'إسطنبول',
    cityTr: 'İstanbul',
  },
];

// Hero arka planı: her 1 saniyede bir değişen gerçek Türk üniversiteleri slaytı
export default function HeroBackground() {
  const { num, json, currentLang } = useSiteText();

  // Kesin olarak 1 saniye (1000ms) aralık
  const interval = Math.max(1, num('hero_slider_interval', 1)) * 1000;

  const images = useMemo(() => {
    const list = json('hero_background_images', []);
    const customUrls = (Array.isArray(list) ? list : [])
      .map((item) => (typeof item === 'string' ? { url: item } : item))
      .filter((item) => item && item.url && !item.url.includes('unsplash.com'));
    return customUrls.length > 0 ? customUrls : TURKISH_UNIVERSITIES_HERO;
  }, [json]);

  const [active, setActive] = useState(0);

  // Görselleri önceden belleğe yükle (pre-fetch) ki 1 saniyelik geçişlerde hiç takılma olmasın
  useEffect(() => {
    images.forEach((img) => {
      const preload = new Image();
      preload.src = img.url;
    });
  }, [images]);

  // Her 1 saniyede bir sonraki Türk üniversitesi fotoğrafına geç
  useEffect(() => {
    if (images.length < 2) return undefined;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  const current = images[active] || images[0];
  const isAr = currentLang === 'ar';
  const universityName = isAr ? current.nameAr || current.nameTr : current.nameTr || current.nameAr;
  const cityName = isAr ? current.cityAr || current.cityTr : current.cityTr || current.cityAr;

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Üst Karartma Geçişi - Navbar ile uyum */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-navy-950/90 via-brand-navy-950/40 to-transparent pointer-events-none z-10" />

        {/* Gerçek Üniversite Fotoğrafları - Her 1 saniyede ultra akıcı 450ms crossfade */}
        {images.map((img, idx) => {
          const isActive = idx === active;
          return (
            <img
              key={`${img.url}-${idx}`}
              src={img.url}
              alt={img.nameTr || img.nameAr || 'Turkish University Campus'}
              decoding="async"
              loading="eager"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out will-change-[opacity] ${
                isActive ? 'opacity-85 z-[1]' : 'opacity-0 z-0 pointer-events-none'
              }`}
            />
          );
        })}

        {/* Canlı Üniversite İsim Rozeti - Sağ veya Sol altta şık görünüm */}
        {universityName && (
          <div className="absolute bottom-3 end-3 sm:bottom-6 sm:end-6 z-20 flex items-center gap-1.5 sm:gap-2 bg-brand-navy-950/85 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20 text-[11px] sm:text-xs text-brand-navy-100 shadow-lg pointer-events-none transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">{universityName}</span>
            {cityName && <span className="text-brand-amber-300">({cityName})</span>}
          </div>
        )}
      </div>

      {/* Şeffaf ve canlı Koyu Katman — Üniversite binalarının net görünmesini sağlar */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy-950/80 via-brand-navy-950/65 to-brand-navy-950/50 pointer-events-none z-[2]" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-transparent to-brand-navy-950/30 pointer-events-none z-[2]" />
    </>
  );
}
