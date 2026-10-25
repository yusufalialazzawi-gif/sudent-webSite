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
  const { currentLang } = useSiteText();

  const whatsappNumber = '905313971022';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحباً شركة المجد للقبولات الجامعية، أود الاستفسار عن القبولات والجامعات المتاحة في تركيا.'
  )}`;

  return (
    <section className="relative overflow-hidden bg-[#0B2545] text-white min-h-[75vh] sm:min-h-[82vh] lg:min-h-[88vh] py-14 sm:py-24 lg:py-28 flex flex-col justify-center items-center">
      {/* Hero arka planı — Her 1.5 saniyede yumuşak cross-dissolve, geniş ve ferah */}
      <HeroBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full">
        {/* Üst Alan: Başlık, Marka Bilgisi ve 4 Hızlı Erişim Karosu (Arka planı kapatmaz) */}
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          {/* Accessible SEO H1 */}
          <h1 className="sr-only">شركة المجد للقبولات الجامعية - قبولك الجامعي في تركيا بأسهل وأسرع الطرق</h1>

          {/* Rozet */}
          <div className="inline-flex items-center gap-1.5 bg-[#0F2E59]/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-blue-400/30 text-[#E9B949] text-xs font-bold mb-3 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#E9B949] shrink-0" />
            <span>شركة المجد للقبولات الجامعية 🇹🇷</span>
          </div>

          {/* Hero Ana Başlığı */}
          <h2
            className="font-black font-cairo text-white leading-tight mb-3 drop-shadow-md"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.2rem)' }}
          >
            بوابتك المعتمدة للقبول في{' '}
            <span className="text-[#E9B949]">
              أفضل الجامعات التركية
            </span>
          </h2>

          <p className="text-blue-100/95 text-xs sm:text-sm lg:text-base max-w-2xl mb-5 sm:mb-6 font-cairo drop-shadow">
            نضمن لك قبولاً رسمياً وموثقاً في أكثر من 120 جامعة حكومية وخاصة في تركيا، مع إرشاد أكاديمي متكامل واستشارة مجانية.
          </p>

        </div>
      </div>
    </section>
  );
}

// 2) SAYAÇLAR — Dinamik ve YALNIZCA Türk Üniversiteleri Odaklı (Mavi ve Beyaz Logo Teması)
export function HomeStats() {
  const { currentLang } = useSiteText();

  // Dinamik veritabanı istatistikleri
  const { data: statsData } = useQuery({
    queryKey: ['home-platform-stats'],
    queryFn: () => api.getPlatformStats(),
  });
  const platformStats = statsData?.data || {};

  // Kıbrıs ve Malezya kaldırıldı; 100% Türk üniversiteleri ve kabul istatistikleri
  const stats = [
    {
      value: platformStats.totalUniversities || 125,
      suffix: '+',
      labelAr: 'جامعة تركية معتمدة (حكومية وخاصة)',
      labelTr: 'Akredite Türk Üniversitesi',
      labelEn: 'Accredited Turkish Universities',
    },
    {
      value: platformStats.totalPrograms || 1450,
      suffix: '+',
      labelAr: 'برنامج وتخصص أكاديمي متاح',
      labelTr: 'Akademik Program & Bölüm',
      labelEn: 'Available Academic Majors',
    },
    {
      value: platformStats.totalGraduateUniversities || 85,
      suffix: '+',
      labelAr: 'جامعة لدراسات الماجستير والدكتوراه',
      labelTr: 'Lisansüstü Açık Üniversite',
      labelEn: 'Graduate & PhD Universities',
    },
    {
      value: 100000,
      suffix: '+',
      labelAr: 'استشارة وقبول جامعي موثق في تركيا',
      labelTr: 'Öğrenci Danışmanlığı & Kabul',
      labelEn: 'Student Placements & Consultations',
    },
  ];

  return (
    <section className="bg-[#0B2545] text-white py-10 sm:py-14 border-y border-blue-900/40 relative overflow-hidden">
      {/* İnce nokta desenli zemin */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-x divide-white/10 rtl:divide-x-reverse">
          {stats.map((item, idx) => (
            <div key={idx} className="space-y-1.5 sm:space-y-2">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-cairo text-[#E9B949] tracking-tight">
                <AnimatedCounter end={item.value} suffix={item.suffix} />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white/90 font-cairo">
                {currentLang === 'tr' ? item.labelTr : currentLang === 'en' ? item.labelEn : item.labelAr}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 2.5) HIZLI ARAMA KUTUSU — Kullanıcının istediği: "bunu aşağıya istatistiklerin altına koy"
export function HomeQuickSearchSection() {
  return (
    <section className="bg-slate-50 py-10 sm:py-14 border-b border-slate-200/80">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-3.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2545] font-cairo bg-blue-100/70 px-4 py-1.5 rounded-full border border-blue-200 shadow-sm">
            <span>🔍 البحث السريع والمباشر عن الجامعات والمدن</span>
          </span>
        </div>
        <QuickSearch />
      </div>
    </section>
  );
}

