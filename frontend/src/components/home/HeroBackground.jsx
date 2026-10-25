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

// Hero arka planı: Yavaş yavaş şeffaflaşma ve diğerinin yavaşça belirmesi (Smooth Cinematic Cross-Dissolve)
export default function HeroBackground() {
  const { json, currentLang } = useSiteText();

  // Fotoğrafın ekranda kalma süresi: 4800ms
  // Geçiş süresi (biri yavaşça şeffaflaşırken diğerinin yavaşça belirmesi): 2000ms (2 saniye)
  const DISSOLVE_DURATION = 2000;
  const DISPLAY_INTERVAL = 4800;

  const images = useMemo(() => {
    const list = json('hero_background_images', []);
    const customUrls = (Array.isArray(list) ? list : [])
      .map((item) => (typeof item === 'string' ? { url: item } : item))
      .filter((item) => item && item.url && !item.url.includes('unsplash.com'));
    return customUrls.length > 0 ? customUrls : TURKISH_UNIVERSITIES_HERO;
  }, [json]);

  const [active, setActive] = useState(0);
  const [prevActive, setPrevActive] = useState(null);

  // prefers-reduced-motion tespiti
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const listener = (e) => setReducedMotion(e.matches);
    media.addEventListener?.('change', listener);
    return () => media.removeEventListener?.('change', listener);
  }, []);

  // Pre-load images for seamless cross dissolve
  useEffect(() => {
    images.forEach((img) => {
      const preload = new Image();
      preload.src = img.url;
    });
  }, [images]);

  // Yavaşça şeffaflaşıp diğerinin yavaşça belirmesi için interval döngüsü
  useEffect(() => {
    if (reducedMotion || images.length < 2) return undefined;
    const id = setInterval(() => {
      setActive((current) => {
        setPrevActive(current);
        return (current + 1) % images.length;
      });
    }, DISPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [images.length, reducedMotion]);

  const current = images[active] || images[0];
  const isAr = currentLang === 'ar';
  const universityName = isAr ? current.nameAr || current.nameTr : current.nameTr || current.nameAr;
  const cityName = isAr ? current.cityAr || current.cityTr : current.cityTr || current.cityAr;

  return (
    <>
      {/* 1) Fotoğraflar Katmanı — Biri yavaş yavaş şeffaf olurken diğeri yavaş yavaş belirir */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {images.map((img, idx) => {
          const isActive = idx === active;
          const isPrev = idx === prevActive;
          const isVisible = isActive || isPrev;

          return (
            <img
              key={`${img.url}-${idx}`}
              src={img.url}
              alt={img.nameTr || img.nameAr || 'Turkish University Campus'}
              decoding="async"
              loading={idx === 0 ? 'eager' : 'lazy'}
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none will-change-[opacity,transform]"
              style={{
                zIndex: isActive ? 2 : isPrev ? 1 : 0,
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1.02)' : 'scale(1.0)',
                transition: `opacity ${DISSOLVE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${DISPLAY_INTERVAL}ms ease-out`,
                visibility: isVisible ? 'visible' : 'hidden',
              }}
            />
          );
        })}
      </div>

      {/* 2) Sabit Karartma Katmanı — Fotoğrafların net ve tüm detaylarıyla görünmesi için hafif gradyan */}
      <div
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: 'linear-gradient(180deg, rgba(11, 37, 69, 0.30) 0%, rgba(11, 37, 69, 0.62) 100%)',
        }}
      />

      {/* 3) Canlı Üniversite İsim Rozeti — Sağ-alt / Sol-alt */}
      {universityName && (
        <div
          className="absolute bottom-3 end-3 sm:bottom-6 sm:end-6 z-10 flex items-center gap-1.5 sm:gap-2 bg-[#14171D]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-[11px] sm:text-xs text-[#9AA4B2] shadow-lg pointer-events-none"
          style={{ transition: 'opacity 600ms ease-in-out' }}
        >
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="font-semibold text-white">{universityName}</span>
          {cityName && <span className="text-[#E9B949]">({cityName})</span>}
        </div>
      )}
    </>
  );
}
