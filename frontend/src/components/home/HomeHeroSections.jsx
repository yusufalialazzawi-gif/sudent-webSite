import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, CheckCircle2, BookOpen, Building2, GraduationCap, FileText } from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';
import { api } from '../../services/api';
import QuickSearch from '../common/QuickSearch';
import AnimatedCounter from '../common/AnimatedCounter';
import UniversityAdmissionSlider from '../common/UniversityAdmissionSlider';
import ScrollReveal from '../common/ScrollReveal';
import HeroBackground from './HeroBackground';
import { pickLang } from './homeShared';
import { DEFAULT_HERO_PILLARS, STATS_LABELS, SITE_NAME_FALLBACK } from './homeDefaults';

// Ağır hero videosunu sayfa boşta kalana kadar ertele.
function useDeferredVideo(mode) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (mode !== 'video') return undefined;
    const conn = navigator.connection;
    if (conn?.saveData || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let idleId;
    const start = () => {
      idleId =
        'requestIdleCallback' in window
          ? window.requestIdleCallback(() => setReady(true), { timeout: 2500 })
          : setTimeout(() => setReady(true), 1500);
    };
    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
    return () => {
      window.removeEventListener('load', start);
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
  }, [mode]);
  return ready;
}

// 1) HERO — شركة المجد للخدمات الطلابية
export function HomeHero() {
  const { t } = useTranslation();
  const { text, str, currentLang } = useSiteText();
  const mode = str('hero_background_mode', 'slider');
  const videoReady = useDeferredVideo(mode);

  const whatsappNumber = '905313971022';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحباً شركة المجد للخدمات الطلابية، أود الاستفسار عن القبولات والجامعات المتاحة في تركيا.'
  )}`;

  return (
    <section className="relative overflow-hidden bg-brand-navy-950 text-white pt-8 pb-16 lg:pt-14 lg:pb-24">
      <HeroBackground videoReady={videoReady} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-start flex flex-col items-center lg:items-start">
            {/* Small Top Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-amber-500/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-amber-500/30 text-brand-amber-400 text-xs sm:text-sm font-bold shadow-inner mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-brand-amber-400 shrink-0" />
              <span>شركة المجد للخدمات الطلابية 🇹🇷</span>
            </div>

            {/* Clear, Concise Punchy Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-cairo leading-[1.3] text-center lg:text-start">
              <span className="text-white drop-shadow">
                قبولك الجامعي في تركيا{' '}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber-400 via-amber-300 to-brand-amber-500">
                بأسهل وأسرع الطرق
              </span>
            </h1>

            {/* Clean Concise Description */}
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl font-normal text-center lg:text-start drop-shadow">
              وكيلكم الرسمي المعتمد لأفضل الجامعات التركية الحكومية والخاصة مع خصومات ومنح حصرية تصل إلى 75% واستشارات مجانية متكاملة.
            </p>

            {/* 4 Quick Action Buttons Side-by-Side (2x2 on Mobile, 4 in row on Desktop) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2 w-full max-w-2xl">
              {/* 1. الجامعات المتاحة */}
              <Link
                to="/universities"
                className="flex flex-col items-center justify-center p-3 sm:p-3.5 bg-white/10 hover:bg-brand-amber-500/20 backdrop-blur-md border border-white/15 hover:border-brand-amber-500/50 rounded-2xl text-center transition-all group hover:scale-[1.03]"
              >
                <Building2 className="w-5 h-5 text-brand-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-bold text-white font-cairo">الجامعات المتاحة</span>
                <span className="text-[10px] text-slate-300">حكومية وخاصة</span>
              </Link>

              {/* 2. التخصصات والمنح */}
              <Link
                to="/programs"
                className="flex flex-col items-center justify-center p-3 sm:p-3.5 bg-white/10 hover:bg-brand-amber-500/20 backdrop-blur-md border border-white/15 hover:border-brand-amber-500/50 rounded-2xl text-center transition-all group hover:scale-[1.03]"
              >
                <GraduationCap className="w-5 h-5 text-brand-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-bold text-white font-cairo">التخصصات والمنح</span>
                <span className="text-[10px] text-slate-300">خصومات حتى 75%</span>
              </Link>

              {/* 3. خدماتنا الطلابية */}
              <Link
                to="/services"
                className="flex flex-col items-center justify-center p-3 sm:p-3.5 bg-white/10 hover:bg-brand-amber-500/20 backdrop-blur-md border border-white/15 hover:border-brand-amber-500/50 rounded-2xl text-center transition-all group hover:scale-[1.03]"
              >
                <FileText className="w-5 h-5 text-brand-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-bold text-white font-cairo">خدماتنا الطلابية</span>
                <span className="text-[10px] text-slate-300">تعديل وإقامة وسكن</span>
              </Link>

              {/* 4. تواصل واتساب مباشر */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 sm:p-3.5 bg-emerald-500/25 hover:bg-emerald-500/40 backdrop-blur-md border border-emerald-400/50 rounded-2xl text-center transition-all group hover:scale-[1.03]"
              >
                <svg className="w-5 h-5 fill-emerald-400 mb-1 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
                </svg>
                <span className="text-xs sm:text-sm font-bold text-emerald-300 font-cairo">تواصل واتساب</span>
                <span className="text-[10px] text-emerald-200/80">استشارة مجانية</span>
              </a>
            </div>

            {/* Direct WhatsApp Call to Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-sm sm:text-base px-7 py-3 rounded-xl shadow-xl shadow-emerald-500/25 transition-all flex items-center gap-2.5 text-center"
              >
                <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
                </svg>
                <span>تواصل معنا عبر الواتساب الآن</span>
              </a>

              <Link
                to="/universities"
                className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base px-6 py-3 rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 text-center"
              >
                <BookOpen className="w-4 h-4 text-brand-amber-400" />
                <span>استكشف الجامعات</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <QuickSearch />
          </div>
        </div>
      </div>
    </section>
  );
}

// 2) SAYAÇLAR — admin kendi sayaçlarını girerse onlar, girmezse gerçek veritabanı sayıları.
const GRID_COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
};
export function HomeStats() {
  const { t } = useTranslation();
  const { json, currentLang } = useSiteText();

  const { data: statsData } = useQuery({
    queryKey: ['home-platform-stats'],
    queryFn: () => api.getPlatformStats(),
  });
  const platformStats = statsData?.data || {};

  const custom = json('home_stats', []);
  const items =
    Array.isArray(custom) && custom.length > 0
      ? custom.map((c) => ({
          value: Number(c.value) || 0,
          label: pickLang(c, currentLang) || pickLang(c.label, currentLang),
          accent: c.accent !== false,
        }))
      : [
          { value: platformStats.totalPrograms || 1450, label: STATS_LABELS.programs[currentLang], accent: true },
          { value: platformStats.totalGraduateUniversities || 85, label: STATS_LABELS.graduate[currentLang], accent: false },
          { value: platformStats.totalUniversities || 125, label: STATS_LABELS.universities[currentLang], accent: true },
          { value: 8, label: t('stats.experience'), accent: false },
        ];

  const gridCols = GRID_COLS[Math.min(items.length, 4)] || GRID_COLS[4];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-24 relative z-20">
      <ScrollReveal yOffset={40}>
        <div className="bg-gradient-to-r from-brand-navy-900 via-brand-navy-800 to-brand-navy-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-brand-amber-500/30 text-white">
          <div
            className={`grid ${gridCols} gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x ltr:sm:divide-x rtl:sm:divide-x-reverse divide-white/10`}
          >
            {items.map((item, idx) => (
              <div key={idx} className="text-center pt-4 sm:pt-0">
                <div className={`text-3xl sm:text-4xl lg:text-5xl font-black font-cairo ${item.accent ? 'text-brand-amber-400' : 'text-white'}`}>
                  <AnimatedCounter end={item.value} suffix="+" />
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

// 3) CANLI KABUL DUYURULARI ŞERİDİ
export function HomeAdmissionSlider() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6">
      <ScrollReveal>
        <UniversityAdmissionSlider />
      </ScrollReveal>
    </section>
  );
}
