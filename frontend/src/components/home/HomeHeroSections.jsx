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

// 1) HERO — شركة المجد للقبولات الجامعية
export function HomeHero() {
  const { t } = useTranslation();
  const { text, str, currentLang } = useSiteText();
  const mode = str('hero_background_mode', 'slider');
  const videoReady = useDeferredVideo(mode);

  const whatsappNumber = '905313971022';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحباً شركة المجد للقبولات الجامعية، أود الاستفسار عن القبولات والجامعات المتاحة في تركيا.'
  )}`;

  return (
    <section className="relative overflow-hidden bg-brand-navy-950 text-white pt-10 pb-16 lg:pt-24 lg:pb-32 lg:min-h-[720px] flex flex-col justify-center">
      <HeroBackground videoReady={videoReady} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-start flex flex-col items-center lg:items-start">
            {/* Accessible SEO H1 */}
            <h1 className="sr-only">شركة المجد للقبولات الجامعية - قبولك الجامعي في تركيا بأسهل وأسرع الطرق</h1>

            {/* Desktop-only balanced brand header */}
            <div className="hidden lg:block space-y-3 mb-2 text-start w-full max-w-2xl lg:max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-brand-amber-500/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-brand-amber-400/40 text-brand-amber-300 text-xs sm:text-sm font-bold shadow-inner">
                <Sparkles className="w-4 h-4 text-brand-amber-400" />
                <span>شركة المجد للقبولات الجامعية 🇹🇷</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-black font-cairo text-white leading-snug">
                بوابتك المعتمدة للقبول في{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber-400 via-amber-300 to-brand-amber-500">
                  أفضل الجامعات التركية
                </span>
              </h2>
            </div>

            {/* 4 Quick Action Buttons - 4 أزرار متجاورة وشفافة مع إزالة الأيقونات في الجوال لتظهر الخلفية بوضوح */}
            <div className="grid grid-cols-4 gap-1.5 sm:gap-3 lg:gap-4 pt-2 sm:pt-3 w-full max-w-3xl">
              {/* 1. جامعات حكومية */}
              <Link
                to="/universities?type=PUBLIC"
                className="flex flex-col items-center justify-center py-2.5 px-1 sm:py-4 sm:px-3 lg:py-5 lg:px-4 bg-slate-950/40 hover:bg-slate-900/70 backdrop-blur-md border border-white/20 hover:border-brand-amber-400 rounded-xl sm:rounded-2xl text-center transition-all group hover:scale-[1.04] shadow-lg shadow-black/40 hover:shadow-brand-amber-500/25"
              >
                <div className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/10 group-hover:bg-brand-amber-500 items-center justify-center mb-2.5 transition-colors">
                  <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-brand-amber-400 group-hover:text-slate-950 transition-colors" />
                </div>
                <span className="text-[11px] sm:text-sm lg:text-base font-black text-white font-cairo leading-tight">جامعات حكومية</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] lg:text-xs text-brand-amber-300 font-extrabold bg-brand-amber-500/20 px-2.5 py-0.5 rounded-full border border-brand-amber-500/30 mt-2 group-hover:bg-brand-amber-500 group-hover:text-slate-950 transition-all">
                  <span>اضغط هنا</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">👈</span>
                </span>
              </Link>

              {/* 2. جامعات خاصة */}
              <Link
                to="/universities?type=PRIVATE"
                className="flex flex-col items-center justify-center py-2.5 px-1 sm:py-4 sm:px-3 lg:py-5 lg:px-4 bg-slate-950/40 hover:bg-slate-900/70 backdrop-blur-md border border-white/20 hover:border-brand-amber-400 rounded-xl sm:rounded-2xl text-center transition-all group hover:scale-[1.04] shadow-lg shadow-black/40 hover:shadow-brand-amber-500/25"
              >
                <div className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/10 group-hover:bg-brand-amber-500 items-center justify-center mb-2.5 transition-colors">
                  <Building2 className="w-5 h-5 lg:w-6 lg:h-6 text-brand-amber-400 group-hover:text-slate-950 transition-colors" />
                </div>
                <span className="text-[11px] sm:text-sm lg:text-base font-black text-white font-cairo leading-tight">جامعات خاصة</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] lg:text-xs text-brand-amber-300 font-extrabold bg-brand-amber-500/20 px-2.5 py-0.5 rounded-full border border-brand-amber-500/30 mt-2 group-hover:bg-brand-amber-500 group-hover:text-slate-950 transition-all">
                  <span>اضغط هنا</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">👈</span>
                </span>
              </Link>

              {/* 3. التخصصات والمنح */}
              <Link
                to="/programs"
                className="flex flex-col items-center justify-center py-2.5 px-1 sm:py-4 sm:px-3 lg:py-5 lg:px-4 bg-slate-950/40 hover:bg-slate-900/70 backdrop-blur-md border border-white/20 hover:border-brand-amber-400 rounded-xl sm:rounded-2xl text-center transition-all group hover:scale-[1.04] shadow-lg shadow-black/40 hover:shadow-brand-amber-500/25"
              >
                <div className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/10 group-hover:bg-brand-amber-500 items-center justify-center mb-2.5 transition-colors">
                  <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-brand-amber-400 group-hover:text-slate-950 transition-colors" />
                </div>
                <span className="text-[11px] sm:text-sm lg:text-base font-black text-white font-cairo leading-tight">التخصصات والمنح</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] lg:text-xs text-brand-amber-300 font-extrabold bg-brand-amber-500/20 px-2.5 py-0.5 rounded-full border border-brand-amber-500/30 mt-2 group-hover:bg-brand-amber-500 group-hover:text-slate-950 transition-all">
                  <span>اضغط هنا</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">👈</span>
                </span>
              </Link>

              {/* 4. تواصل واتساب */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center py-2.5 px-1 sm:py-4 sm:px-3 lg:py-5 lg:px-4 bg-emerald-950/40 hover:bg-emerald-900/60 backdrop-blur-md border border-emerald-400/40 hover:border-emerald-300 rounded-xl sm:rounded-2xl text-center transition-all group hover:scale-[1.04] shadow-lg shadow-emerald-950/50 hover:shadow-emerald-500/25"
              >
                <div className="hidden sm:flex w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500 items-center justify-center mb-2.5 transition-colors">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 fill-emerald-400 group-hover:fill-white transition-colors" viewBox="0 0 24 24">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
                  </svg>
                </div>
                <span className="text-[11px] sm:text-sm lg:text-base font-black text-emerald-300 font-cairo leading-tight">تواصل واتساب</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] lg:text-xs text-emerald-200 font-extrabold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30 mt-2 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <span>اضغط هنا</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">👈</span>
                </span>
              </a>
            </div>

            {/* إرشاد أسفل الأزرار */}
            <div className="w-full max-w-2xl text-center pt-2 sm:pt-3">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-950/40 backdrop-blur-md px-3.5 py-1 sm:px-5 sm:py-2 rounded-full border border-white/15 text-[10px] sm:text-sm text-brand-amber-300 font-bold shadow-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>👇 اضغط هنا على أي قسم أو ابحث بالأسفل</span>
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 mt-6 sm:mt-10 lg:mt-0">
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
