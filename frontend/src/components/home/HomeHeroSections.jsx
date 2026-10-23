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
    <>
      <section className="relative overflow-hidden bg-brand-navy-950 text-white pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-24 lg:pb-32 min-h-[460px] sm:min-h-[520px] lg:min-h-[720px] flex flex-col justify-center">
        <HeroBackground videoReady={videoReady} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-start flex flex-col items-center lg:items-start my-auto">
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

              {/* 4 Quick Action Buttons - تصميم شبه شفاف وأنيق وبدون أي أيقونات */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4 w-full max-w-3xl pt-2 sm:pt-4">
                {/* 1. جامعات حكومية */}
                <Link
                  to="/universities?type=PUBLIC"
                  className="flex flex-col items-center justify-center py-3.5 sm:py-4 lg:py-5 px-1.5 sm:px-3 lg:px-4 bg-slate-950/45 hover:bg-slate-900/75 backdrop-blur-md border border-white/25 hover:border-brand-amber-400 rounded-2xl text-center transition-all group hover:scale-[1.04] shadow-xl shadow-black/40 hover:shadow-brand-amber-500/25"
                >
                  <span className="text-xs sm:text-sm lg:text-base font-black text-white font-cairo leading-tight">
                    جامعات حكومية
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs text-brand-amber-300 font-bold mt-1.5 opacity-90 group-hover:opacity-100">
                    <span>اضغط هنا</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">👈</span>
                  </span>
                </Link>

                {/* 2. جامعات خاصة */}
                <Link
                  to="/universities?type=PRIVATE"
                  className="flex flex-col items-center justify-center py-3.5 sm:py-4 lg:py-5 px-1.5 sm:px-3 lg:px-4 bg-slate-950/45 hover:bg-slate-900/75 backdrop-blur-md border border-white/25 hover:border-brand-amber-400 rounded-2xl text-center transition-all group hover:scale-[1.04] shadow-xl shadow-black/40 hover:shadow-brand-amber-500/25"
                >
                  <span className="text-xs sm:text-sm lg:text-base font-black text-white font-cairo leading-tight">
                    جامعات خاصة
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs text-brand-amber-300 font-bold mt-1.5 opacity-90 group-hover:opacity-100">
                    <span>اضغط هنا</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">👈</span>
                  </span>
                </Link>

                {/* 3. التخصصات والمنح */}
                <Link
                  to="/programs"
                  className="flex flex-col items-center justify-center py-3.5 sm:py-4 lg:py-5 px-1.5 sm:px-3 lg:px-4 bg-slate-950/45 hover:bg-slate-900/75 backdrop-blur-md border border-white/25 hover:border-brand-amber-400 rounded-2xl text-center transition-all group hover:scale-[1.04] shadow-xl shadow-black/40 hover:shadow-brand-amber-500/25"
                >
                  <span className="text-xs sm:text-sm lg:text-base font-black text-white font-cairo leading-tight">
                    التخصصات والمنح
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs text-brand-amber-300 font-bold mt-1.5 opacity-90 group-hover:opacity-100">
                    <span>اضغط هنا</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">👈</span>
                  </span>
                </Link>

                {/* 4. تواصل واتساب */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-3.5 sm:py-4 lg:py-5 px-1.5 sm:px-3 lg:px-4 bg-emerald-950/45 hover:bg-emerald-900/70 backdrop-blur-md border border-emerald-400/40 hover:border-emerald-300 rounded-2xl text-center transition-all group hover:scale-[1.04] shadow-xl shadow-emerald-950/50 hover:shadow-emerald-500/25"
                >
                  <span className="text-xs sm:text-sm lg:text-base font-black text-emerald-300 font-cairo leading-tight">
                    تواصل واتساب
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] sm:text-xs text-emerald-200 font-bold mt-1.5 opacity-90 group-hover:opacity-100">
                    <span>اضغط هنا</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">👈</span>
                  </span>
                </a>
              </div>

              {/* إرشاد أسفل الأزرار */}
              <div className="w-full max-w-2xl text-center pt-2 sm:pt-4">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-950/45 backdrop-blur-md px-4 py-1.5 sm:px-5 sm:py-2 rounded-full border border-white/20 text-xs sm:text-sm text-brand-amber-300 font-bold shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>👇 اضغط على أي قسم للبدء أو ابحث بالأسفل</span>
                </span>
              </div>
            </div>

            {/* Desktop-only QuickSearch inside Hero grid */}
            <div className="hidden lg:block lg:col-span-5">
              <QuickSearch />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-only Search Section with Clean White Background (خلفية بيضاء نظيفة لمحرك البحث بالجوال) */}
      <section className="block lg:hidden bg-white py-8 px-4 border-b border-slate-200 relative z-20">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-3">
            <span className="inline-block text-xs font-bold text-brand-amber-700 bg-brand-amber-50 px-3.5 py-1.5 rounded-full border border-brand-amber-200 font-cairo">
              🔍 ابحث عن جامعتك المناسبة
            </span>
          </div>
          <QuickSearch isEmbedded={true} />
        </div>
      </section>
    </>
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
