import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  BellRing,
  ChevronLeft,
  ChevronRight,
  Calendar,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  Pause,
  Play,
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function UniversityAdmissionSlider() {
  const { t } = useTranslation();
  const { currentLang, isRtl } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'OPEN', 'UPCOMING', 'PUBLIC', 'GRADUATE'
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(3);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['university-announcements', currentLang],
    queryFn: () => api.getAdmissionAnnouncements({ lang: currentLang, limit: 20 }),
  });

  const universities = response?.data || [];

  // Filter universities based on active filter
  const filteredUniversities = universities.filter((uni) => {
    if (activeFilter === 'OPEN') return uni.admissionStatus === 'OPEN';
    if (activeFilter === 'UPCOMING') return uni.admissionStatus === 'UPCOMING';
    if (activeFilter === 'PUBLIC') return uni.type === 'PUBLIC';
    if (activeFilter === 'GRADUATE') return uni.graduateAdmissionOpen === true;
    return true;
  });

  // Responsive visible items
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(1);
      } else if (width < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = filteredUniversities.length;
  const maxIndex = Math.max(0, total - visibleItems);

  // Viewport detection: Activates smoothly 0.5s after entering viewport, with fallback
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    let viewTimer = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (viewTimer) clearTimeout(viewTimer);
          viewTimer = setTimeout(() => {
            setIsInView(true);
          }, 500);
        }
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    observer.observe(el);

    // Guaranteed fallback after 1.2s so slider never stays frozen
    const fallbackTimer = setTimeout(() => {
      setIsInView(true);
    }, 1200);

    return () => {
      observer.disconnect();
      if (viewTimer) clearTimeout(viewTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const nextSlide = useCallback(() => {
    if (total <= visibleItems) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex, total, visibleItems]);

  const prevSlide = useCallback(() => {
    if (total <= visibleItems) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex, total, visibleItems]);

  // "Video gibi olmasın, kullanıcı yanından geçtiğinde hareket etsin"
  const hasInitialMoved = useRef(false);
  const lastHoverTime = useRef(0);

  useEffect(() => {
    if (!isInView || hasInitialMoved.current || total <= visibleItems) return;
    const initialTimer = setTimeout(() => {
      hasInitialMoved.current = true;
      nextSlide();
    }, 800);
    return () => clearTimeout(initialTimer);
  }, [isInView, total, visibleItems, nextSlide]);

  const handleUserPassBy = () => {
    const now = Date.now();
    if (now - lastHoverTime.current > 1800) {
      lastHoverTime.current = now;
      nextSlide();
    }
  };

  // Touch swipe support
  const minSwipeDistance = 45;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isRtl) {
      if (isLeftSwipe) prevSlide();
      if (isRightSwipe) nextSlide();
    } else {
      if (isLeftSwipe) nextSlide();
      if (isRightSwipe) prevSlide();
    }
  };

  const filterTabs = [
    {
      id: 'ALL',
      labelAr: 'جميع الإعلانات',
      labelTr: 'Tüm İlanlar',
      labelEn: 'All Announcements',
      count: universities.length,
    },
    {
      id: 'OPEN',
      labelAr: '🟢 مفتوح للتسجيل الآن',
      labelTr: '🟢 Başvurusu Açık',
      labelEn: '🟢 Open for Admission',
      count: universities.filter((u) => u.admissionStatus === 'OPEN').length,
    },
    {
      id: 'UPCOMING',
      labelAr: '🟡 يفتح قريباً',
      labelTr: '🟡 Yakında Açılacak',
      labelEn: '🟡 Opening Soon',
      count: universities.filter((u) => u.admissionStatus === 'UPCOMING').length,
    },
    {
      id: 'PUBLIC',
      labelAr: '🏛️ جامعات حكومية',
      labelTr: '🏛️ Devlet Üniversiteleri',
      labelEn: '🏛️ State Universities',
      count: universities.filter((u) => u.type === 'PUBLIC').length,
    },
    {
      id: 'GRADUATE',
      labelAr: '🎓 ماجستير ودكتوراه',
      labelTr: '🎓 Yüksek Lisans & Doktora',
      labelEn: '🎓 Graduate / Master’s',
      count: universities.filter((u) => u.graduateAdmissionOpen).length,
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-slate-900 rounded-3xl p-8 text-white animate-pulse">
        <div className="h-8 w-64 bg-slate-700 rounded-lg mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (universities.length === 0) return null;

  const stepPercentage = 100 / visibleItems;
  const transformStyle = {
    transform: isRtl
      ? `translateX(${currentIndex * stepPercentage}%)`
      : `translateX(-${currentIndex * stepPercentage}%)`,
    transition: 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)',
  };

  return (
    <div
      ref={containerRef}
      className="relative rounded-3xl bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-slate-950 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-brand-amber-500/25 overflow-hidden select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Decorative background glow elements */}
      <div className="absolute top-0 end-0 w-96 h-96 bg-brand-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 start-0 w-80 h-80 bg-brand-navy-700/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header and Controls */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
        <div>
          {/* Live Bulletin Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-amber-500/15 border border-brand-amber-400/30 text-brand-amber-400 text-xs font-bold mb-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <BellRing className="w-3.5 h-3.5" />
            <span>
              {currentLang === 'ar'
                ? 'إعلانات وتقويم القبول الجامعي المباشر 2026-2027'
                : currentLang === 'tr'
                ? 'Canlı Üniversite Başvuru & Kayıt Takvimi 2026-2027'
                : 'Live University Admissions & Deadlines Calendar 2026-2027'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-cairo text-white tracking-tight">
            {currentLang === 'ar' ? (
              <>
                الجامعات <span className="text-emerald-400">المفتوحة للتسجيل</span> ومواعيد التقديم القادمة
              </>
            ) : currentLang === 'tr' ? (
              <>
                Başvurusu <span className="text-emerald-400">Açık Üniversiteler</span> ve Yaklaşan Kayıtlar
              </>
            ) : (
              <>
                Universities with <span className="text-emerald-400">Open Admissions</span> & Upcoming Deadlines
              </>
            )}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed">
            {currentLang === 'ar'
              ? 'متابعة حية ومحدثة يومياً لمواعيد فتح وإغلاق التسجيل في كبرى الجامعات الحكومية والخاصة وبرامج الدراسات العليا (الماجستير والدكتوراه) في تركيا.'
              : currentLang === 'tr'
              ? 'Türkiye genelinde devlet ve vakıf üniversiteleri ile yüksek lisans / doktora programlarının başvuru takvimi ve resmi ilanları.'
              : 'Real-time updated admission schedules, open registration windows, and graduate program intake deadlines across Turkey.'}
          </p>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1.5"
            title={isPaused ? 'Devam Ettir / تشغيل' : 'Duraklat / إيقاف مؤقت'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-brand-amber-400" />}
            <span className="hidden sm:inline text-[11px] font-semibold">
              {isPaused
                ? currentLang === 'ar' ? 'تشغيل' : 'Oynat'
                : currentLang === 'ar' ? 'إيقاف' : 'Durdur'}
            </span>
          </button>

          <button
            onClick={prevSlide}
            disabled={total <= visibleItems}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-brand-amber-500 hover:text-white border border-white/10 text-white transition-all disabled:opacity-40"
            aria-label="Previous"
          >
            <ChevronLeft className="w-5 h-5 flip-in-rtl" />
          </button>

          <button
            onClick={nextSlide}
            disabled={total <= visibleItems}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-brand-amber-500 hover:text-white border border-white/10 text-white transition-all disabled:opacity-40"
            aria-label="Next"
          >
            <ChevronRight className="w-5 h-5 flip-in-rtl" />
          </button>
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 relative z-10">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          const label = currentLang === 'ar' ? tab.labelAr : currentLang === 'tr' ? tab.labelTr : tab.labelEn;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFilter(tab.id);
                setCurrentIndex(0);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                isActive
                  ? 'bg-brand-amber-500 text-white shadow-lg shadow-brand-amber-500/25 scale-[1.02]'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              <span>{label}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${isActive ? 'bg-black/20 text-white' : 'bg-white/10 text-slate-300'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sliding Cards Track Viewport */}
      <div
        className="overflow-hidden rounded-2xl py-2 relative z-10"
        onMouseEnter={handleUserPassBy}
        onMouseMove={handleUserPassBy}
      >
        <div
          className="flex will-change-transform"
          style={transformStyle}
        >
          {filteredUniversities.map((uni, idx) => {
            const translation =
              uni.translations?.find((tr) => tr.lang === currentLang) ||
              uni.translations?.find((tr) => tr.lang === 'ar') ||
              uni.translations?.[0] ||
              {};
            const uniName = translation.name || uni.slug;
            const isState = uni.type === 'PUBLIC';
            const isOpen = uni.admissionStatus === 'OPEN';
            const isUpcoming = uni.admissionStatus === 'UPCOMING';

            return (
              <div
                key={uni.id || idx}
                className="shrink-0 px-2.5 transition-opacity duration-300"
                style={{ width: `${stepPercentage}%` }}
              >
                <div className="h-full bg-slate-900/95 backdrop-blur-md rounded-2xl border border-white/15 overflow-hidden flex flex-col justify-between shadow-xl hover:border-brand-amber-400/50 hover:shadow-2xl hover:shadow-brand-amber-500/10 transition-all duration-300 group">
                  {/* Card Image Header */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-800">
                    <img
                      src={
                        uni.coverImageUrl ||
                        '/uploads/universities/bogazici-universitesi.webp'
                      }
                      alt={uniName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/uploads/universities/bogazici-universitesi.webp';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-3 start-3">
                      {isOpen ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                          <span>
                            {currentLang === 'ar' ? 'التقديم مفتوح الآن' : currentLang === 'tr' ? 'Başvuru Açık' : 'Admission Open'}
                          </span>
                        </span>
                      ) : isUpcoming ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow-lg">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {currentLang === 'ar' ? 'يفتح قريباً' : currentLang === 'tr' ? 'Yakında Açılacak' : 'Opening Soon'}
                          </span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                          {currentLang === 'ar' ? 'مغلق' : currentLang === 'tr' ? 'Kapandı' : 'Closed'}
                        </span>
                      )}
                    </div>

                    {/* State / Foundation Badge */}
                    <div className="absolute top-3 end-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          isState
                            ? 'bg-brand-navy-800/90 text-brand-amber-300 border border-brand-amber-400/30'
                            : 'bg-white/20 text-white backdrop-blur-md'
                        }`}
                      >
                        {isState
                          ? currentLang === 'ar' ? '🏛️ جامعة حكومية' : currentLang === 'tr' ? '🏛️ Devlet Üniversitesi' : '🏛️ State University'
                          : currentLang === 'ar' ? '🏢 جامعة خاصة' : currentLang === 'tr' ? '🏢 Vakıf Üniversitesi' : '🏢 Foundation Uni'}
                      </span>
                    </div>

                    {/* University Title & City Header (Clean, no broken logo photo) */}
                    <div className="absolute bottom-3 start-3 end-3 flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-brand-amber-400 shrink-0 shadow-lg">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-white font-black text-base sm:text-lg font-cairo truncate drop-shadow-md">
                          {uniName}
                        </h3>
                        <div className="text-xs text-brand-amber-300 font-semibold flex items-center gap-1.5 drop-shadow mt-0.5">
                          <span>{uni.city}</span>
                          {uni.establishedYear && <span>• {uni.establishedYear}</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body & Announcement Text */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    {/* Announcement Notice Box */}
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 group-hover:border-brand-amber-400/30 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <BellRing className="w-4 h-4 text-brand-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-200 leading-relaxed font-medium line-clamp-2">
                          {currentLang === 'ar'
                            ? (isOpen
                              ? 'بدء استقبال ملفات الطلاب للعام الأكاديمي 2026-2027 للدراسات العليا والبكالوريوس مع منح دراسية.'
                              : 'إعلان موعد فتح باب التقديم والتقويم الأكاديمي للعام الجديد 2026-2027 قريباً.')
                            : currentLang === 'tr'
                            ? (isOpen
                              ? '2026-2027 Akademik yılı lisans ve yüksek lisans uluslararası öğrenci kabulleri başlamıştır.'
                              : 'Yeni dönem başvuru tarihleri ve kontenjan takvimi çok yakında ilan edilecektir.')
                            : (isOpen
                              ? 'Fall 2026-2027 undergraduate and graduate international applications are now officially open.'
                              : 'Official intake calendar and quota announcement scheduled soon.')}
                        </p>
                      </div>
                    </div>

                    {/* Key Badges (Graduate support & dates) */}
                    <div className="space-y-2 text-xs">
                      {uni.graduateAdmissionOpen && (
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                          <GraduationCap className="w-4 h-4 shrink-0" />
                          <span>
                            {currentLang === 'ar'
                              ? 'برامج الماجستير والدكتوراه متاحة للتسجيل'
                              : currentLang === 'tr'
                              ? 'Yüksek Lisans & Doktora Başvurusu Aktif'
                              : 'Graduate & Master’s Admissions Open'}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-slate-300 px-1 pt-1">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-brand-amber-400" />
                          <span>
                            {currentLang === 'ar' ? 'الفترة:' : currentLang === 'tr' ? 'Dönem:' : 'Intake:'}
                          </span>
                        </span>
                        <span className="font-bold text-white text-[11px]">
                          {currentLang === 'ar'
                            ? 'العام الأكاديمي 2026 - 2027'
                            : currentLang === 'tr'
                            ? '2026 - 2027 Akademik Yılı'
                            : 'Academic Year 2026 - 2027'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/10">
                      <Link
                        to={`/universities/${uni.slug}`}
                        className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-center text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center justify-center"
                      >
                        {currentLang === 'ar' ? 'التفاصيل' : currentLang === 'tr' ? 'İncele' : 'Details'}
                      </Link>

                      <a
                        href={`https://wa.me/905313971022?text=${encodeURIComponent(
                          `مرحباً شركة المجد للخدمات الطلابية، أود التقديم والتسجيل في ${uniName} (${isState ? 'حكومية' : 'خاصة'}).`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-400 hover:to-brand-amber-500 text-center text-xs font-black text-slate-950 transition-all shadow-md shadow-brand-amber-500/20 flex items-center justify-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5 fill-slate-950 shrink-0" viewBox="0 0 24 24">
                          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
                        </svg>
                        <span>{currentLang === 'ar' ? 'قدّم طلبك' : currentLang === 'tr' ? 'Hemen Başvur' : 'Apply Now'}</span>
                        <ArrowRight className="w-3.5 h-3.5 flip-in-rtl" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dots Indicator */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 mt-6 relative z-10">
          {Array.from({ length: Math.min(10, maxIndex + 1) }).map((_, dotIdx) => (
            <button
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === dotIdx
                  ? 'w-6 bg-brand-amber-400'
                  : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Slide ${dotIdx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
