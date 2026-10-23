import React, { useEffect, useMemo, useState } from 'react';
import useSiteText from '../../hooks/useSiteText';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80', // مبنى الحرم الجامعي التاريخي
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600&auto=format&fit=crop&q=80', // مكتبة جامعية ضخمة وكتب
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=80', // الحرم الجامعي الحديث
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1600&auto=format&fit=crop&q=80', // رفوف كتب دراسية وبحث علمي
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80', // طلاب جامعيين يدرسون معاً
  'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=1600&auto=format&fit=crop&q=80', // صرح جامعي عريق
  'https://images.unsplash.com/photo-1507842229451-7f01be7fe7ab?w=1600&auto=format&fit=crop&q=80', // قاعة المطالعة والمكتبة الهادئة
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=1600&auto=format&fit=crop&q=80', // ساحة الحرم وبرج الساعة الجامعي
];

// Hero arka planı: 8 fotoğraflı dinamik Ken-Burns geçişli arka plan
export default function HeroBackground({ videoReady }) {
  const { str, num, json, currentLang } = useSiteText();

  const mode = str('hero_background_mode', 'slider');
  const interval = Math.max(3, num('hero_slider_interval', 4.5)) * 1000;
  const overlay = Math.min(95, Math.max(0, num('hero_overlay_opacity', 70)));
  const poster = str('hero_poster_url', '');
  const videoUrl = str('hero_video_url', '/media/hero-campus.mp4');

  const images = useMemo(() => {
    const list = json('hero_background_images', []);
    const urls = (Array.isArray(list) ? list : [])
      .map((item) => (typeof item === 'string' ? { url: item } : item))
      .filter((item) => item && item.url);
    return urls.length > 0 ? urls : FALLBACK_IMAGES.map((url) => ({ url }));
  }, [json]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  const altFor = (img) =>
    img[`alt${currentLang === 'ar' ? 'Ar' : currentLang === 'tr' ? 'Tr' : 'En'}`] || img.alt || 'Campus';

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Gradient Buffer between Navbar and Hero Images */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-brand-navy-950 via-brand-navy-950/60 to-transparent pointer-events-none z-10" />

        {images.map((img, idx) => (
          <img
            key={`${img.url}-${idx}`}
            src={img.url}
            alt={altFor(img)}
            decoding="async"
            fetchpriority={idx === 0 ? 'high' : 'low'}
            className={`absolute inset-0 w-full h-full object-cover transform duration-[2000ms] ease-out will-change-transform ${
              idx === active
                ? 'opacity-70 scale-110 translate-x-1 translate-y-0.5'
                : 'opacity-0 scale-100 transition-opacity duration-1000'
            }`}
          />
        ))}
      </div>

      {/* Koyu katman — opaklığı admin ayarından gelir */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-brand-navy-950 via-brand-navy-950/90 to-brand-navy-950/75 pointer-events-none"
        style={{ opacity: overlay / 100 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/90 via-transparent to-brand-navy-950/40 pointer-events-none" />
      <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-brand-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 end-0 w-[600px] h-[600px] bg-brand-navy-700/25 rounded-full blur-3xl pointer-events-none" />
    </>
  );
}
