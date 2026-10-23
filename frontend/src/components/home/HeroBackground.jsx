import React, { useEffect, useMemo, useState } from 'react';
import useSiteText from '../../hooks/useSiteText';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=70',
];

// Hero arka planı: admin "slider / image / video" modunu, fotoğrafları, geçiş süresini
// ve koyu katman opaklığını ayarlardan seçer.
export default function HeroBackground({ videoReady }) {
  const { str, num, json, currentLang } = useSiteText();

  const mode = str('hero_background_mode', 'slider');
  const interval = Math.max(2, num('hero_slider_interval', 6)) * 1000;
  const overlay = Math.min(95, Math.max(0, num('hero_overlay_opacity', 70)));
  const poster = str('hero_poster_url', '');
  const videoUrl = str('hero_video_url', '/media/hero-campus.mp4');

  const images = useMemo(() => {
    const list = json('hero_background_images', []);
    const urls = (Array.isArray(list) ? list : [])
      .map((item) => (typeof item === 'string' ? { url: item } : item))
      .filter((item) => item && item.url);
    return urls.length > 0 ? urls : [{ url: poster || FALLBACK_IMAGES[0] }];
  }, [json, poster]);

  const [active, setActive] = useState(0);

  useEffect(() => {
    if (mode !== 'slider' || images.length < 2) return undefined;
    const id = setInterval(() => setActive((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [mode, images.length, interval]);

  const altFor = (img) =>
    img[`alt${currentLang === 'ar' ? 'Ar' : currentLang === 'tr' ? 'Tr' : 'En'}`] || img.alt || 'Campus';

  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top Gradient Buffer between Navbar and Hero Images */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-navy-950/80 via-brand-navy-950/40 to-transparent pointer-events-none z-10" />

        {mode === 'video' && videoReady ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster={poster || images[0].url}
            className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : mode === 'slider' && images.length > 1 ? (
          images.map((img, idx) => (
            <img
              key={`${img.url}-${idx}`}
              src={img.url}
              alt={altFor(img)}
              decoding="async"
              fetchpriority={idx === 0 ? 'high' : 'low'}
              className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-1000 ${
                idx === active ? 'opacity-70' : 'opacity-0'
              }`}
            />
          ))
        ) : (
          <img
            src={images[0].url}
            alt={altFor(images[0])}
            decoding="async"
            fetchpriority="high"
            className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105"
          />
        )}
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
