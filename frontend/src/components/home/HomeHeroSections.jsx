import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, CheckCircle2, BookOpen } from 'lucide-react';
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

// 1) HERO — arka plan fotoğrafları, rozet, başlık, açıklama, güven rozetleri ve butonlar.
export function HomeHero() {
  const { t } = useTranslation();
  const { text, str, json, currentLang, settings } = useSiteText();
  const mode = str('hero_background_mode', 'slider');
  const videoReady = useDeferredVideo(mode);

  const pillars = json('hero_pillars', DEFAULT_HERO_PILLARS);
  const pillarList = (Array.isArray(pillars) ? pillars : [])
    .map((p) => (typeof p === 'string' ? { ar: p, tr: p, en: p } : p))
    .map((p) => pickLang(p, currentLang))
    .filter(Boolean);

  const ctaPrimaryUrl = str('hero_cta_primary_url', '/apply');
  const ctaSecondaryUrl = str('hero_cta_secondary_url', '/universities');

  // Admin bu alanı boşaltırsa başlık tek satır kalır.
  const rawHighlight = settings?.[`hero_title_highlight_${currentLang}`];
  const heroHighlight = rawHighlight === undefined || rawHighlight === null ? SITE_NAME_FALLBACK[currentLang] : rawHighlight;

  return (
    <section className="relative overflow-hidden bg-brand-navy-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-32">
      <HeroBackground videoReady={videoReady} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-start flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-brand-amber-400 text-xs sm:text-sm font-semibold shadow-inner mx-auto lg:mx-0">
              <Sparkles className="w-4 h-4 text-brand-amber-400 shrink-0" />
              <span>{text('hero_badge', () => t('hero.badge'))}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black font-cairo leading-[1.4] sm:leading-[1.45] text-center lg:text-start">
              <span className="flex flex-col gap-2">
                <span className="text-white drop-shadow">
                  {text('hero_title', () => t('hero.title'))}
                </span>
                {heroHighlight && (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber-400 via-brand-amber-300 to-brand-amber-500 py-1 drop-shadow">
                    {heroHighlight}
                  </span>
                )}
              </span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base lg:text-lg leading-[1.75] max-w-2xl font-normal text-center lg:text-start drop-shadow-sm">
              {text('hero_desc', () => t('hero.description'))}
            </p>

            {pillarList.length > 0 && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2 w-full">
                {pillarList.map((label, idx) => (
                  <div
                    key={`${label}-${idx}`}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-200 bg-white/5 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/10"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3 w-full sm:w-auto">
              <Link
                to={ctaPrimaryUrl}
                className="w-full sm:w-auto justify-center bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-base px-8 py-3.5 rounded-xl shadow-xl shadow-brand-amber-500/25 btn-hover-lift transition-all flex items-center gap-2 text-center"
              >
                <span>{text('hero_cta_primary_label', () => t('hero.ctaApply'))}</span>
                <ArrowRight className="w-5 h-5 flip-in-rtl" />
              </Link>

              <Link
                to={ctaSecondaryUrl}
                className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-7 py-3.5 rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2 text-center"
              >
                <BookOpen className="w-5 h-5 text-brand-amber-400" />
                <span>{text('hero_cta_secondary_label', () => t('hero.ctaExplore'))}</span>
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
