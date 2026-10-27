import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, CheckCircle2, BookOpen, Building2, GraduationCap, FileText, Search, MapPin } from 'lucide-react';
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

// Şehir Arapça isim sözlüğü
const CITY_NAMES_AR = {
  Istanbul: 'إسطنبول',
  Ankara: 'أنقرة',
  Izmir: 'إزمير',
  Antalya: 'أنطاليا',
  Bursa: 'بورصة',
  Konya: 'قونية',
  Trabzon: 'طرابزون',
  Mersin: 'مرسين',
  Kayseri: 'قيصري',
  Eskisehir: 'إسكي شهير',
  Kocaeli: 'كوجالي',
  Sakarya: 'سكاريا',
  Samsun: 'سامسون',
  Gaziantep: 'غازي عنتاب',
  Denizli: 'دنيزلي',
  Adana: 'أضنة',
  Canakkale: 'تشاناق قلعة',
  Edirne: 'أدرنة',
  Malatya: 'ملاطيا',
  Ordu: 'أوردو',
  Rize: 'ريزه',
  Van: 'وان',
  Diyarbakir: 'ديار بكر',
  Mardin: 'ماردين',
  Kars: 'قارس',
  Nevsehir: 'كابادوكيا / نوشهير',
  Mugla: 'موغلا',
  Bolu: 'بولو',
  Isparta: 'إسبارطة',
  Manisa: 'مانيسا',
  Aydin: 'أيدين',
  Balikesir: 'باليكسير',
  Karabuk: 'كارابوك',
  Kastamonu: 'كاستامونو',
  Sinop: 'سينوب',
  Giresun: 'غيرسون',
  Artvin: 'آرتفين',
  Gumushane: 'غوموش هانة',
  Bayburt: 'بايبورت',
  Erzurum: 'أرضروم',
  Erzincan: 'أرزينجان',
  Elazig: 'إيلازيغ',
  Siirt: 'سيرت',
  Bingol: 'بينغول',
  Mus: 'موش',
  Bitlis: 'بتليس',
  Agri: 'أغري',
  Igdir: 'إغدير',
  Yalova: 'يالوفا',
  Duzce: 'دوزجة',
  Bartin: 'بارتين',
};

// 1) HERO — STUDYFANS EXACT 1:1 CLONE (MOBILE-FIRST)
export function HomeHero() {
  const { currentLang } = useSiteText();
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');

  const { data: searchOptionsData } = useQuery({
    queryKey: ['public-search-options'],
    queryFn: () => api.getSearchOptions(),
  });

  const { data: universitiesData } = useQuery({
    queryKey: ['public-universities-list', currentLang],
    queryFn: () => api.getUniversities({ limit: 150, lang: currentLang }),
  });

  const universities = universitiesData?.data || [];
  const cities = searchOptionsData?.data?.cities || [
    'Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa', 'Konya', 'Trabzon', 'Mersin', 'Kayseri', 'Eskisehir', 'Kocaeli', 'Sakarya', 'Gaziantep', 'Samsun'
  ];

  const filteredUniversities = selectedCity
    ? universities.filter((u) => u.city?.toLowerCase() === selectedCity.toLowerCase())
    : universities;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (selectedUniversity) {
      navigate(`/universities/${selectedUniversity}`);
      return;
    }
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    navigate(`/universities${params.toString() ? `?${params.toString()}` : ''}`);
  };

  return (
    <section className="relative w-full bg-[#fafafa] text-[#0a2240] py-8 sm:py-12 lg:py-16 overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Sol/Sağ Metin Alanı (RTL'de sağ) */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between py-2 text-start">
            {/* Küçük Üst Rozet */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/60 text-[#ff9015] text-xs font-bold w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#ff9015]" />
              <span>
                {currentLang === 'tr'
                  ? "Türkiye'de Üniversite Eğitimi Rehberi 🇹🇷"
                  : currentLang === 'en'
                  ? 'Your Official Guide to Study in Turkey 🇹🇷'
                  : 'دليل الدراسة والقبول في الجامعات التركية 🇹🇷'}
              </span>
            </div>

            {/* Ana Başlık — Studyfans Exact Layout */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-cairo leading-tight sm:leading-[1.25] text-[#0a2240]">
              {currentLang === 'tr' ? (
                <>
                  Yurtdışında Eğitime Giden <br className="hidden sm:inline" />
                  <span className="text-[#ff6b00]">Tüm Adımları</span> Kolaylaştırıyoruz
                </>
              ) : currentLang === 'en' ? (
                <>
                  We Simplify <span className="text-[#ff6b00]">Every Step</span> <br className="hidden sm:inline" />
                  to Study Abroad
                </>
              ) : (
                <>
                  نسهل لكم <span className="text-[#ff6b00]">كافة خطوات</span> <br className="hidden sm:inline" />
                  الدراسة في الخارج
                </>
              )}
            </h1>

            {/* ŞEHİR VE ÜNİVERSİTE HIZLI SEÇİM & ARAMA KUTUSU */}
            <div className="mt-5 sm:mt-6 w-full">
              <form
                onSubmit={handleSearchSubmit}
                className="h-14 sm:h-16 px-3 sm:px-4 py-2 rounded-[14px] sm:rounded-2xl border border-[#d7dae0] bg-white flex items-center justify-between gap-2 sm:gap-3 shadow-sm hover:border-[#ff9015]/70 transition-colors"
              >
                {/* 1. Şehir Seçimi */}
                <div className="w-1/2 flex items-center gap-1.5 min-w-0">
                  <MapPin className="w-4 h-4 text-[#ff9015] shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setSelectedUniversity('');
                    }}
                    className="w-full text-xs sm:text-sm font-bold text-[#0a2240] bg-transparent outline-none truncate cursor-pointer font-cairo"
                  >
                    <option value="">
                      {currentLang === 'ar' ? 'اختر المدينة' : currentLang === 'tr' ? 'Şehir Seçin' : 'Select City'}
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {currentLang === 'ar' ? (CITY_NAMES_AR[city] || city) : city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dikey Ayırıcı Çizgi */}
                <div className="h-7 w-[1px] bg-[#d7dae0] shrink-0" />

                {/* 2. Üniversite Seçimi */}
                <div className="w-1/2 flex items-center gap-1.5 min-w-0">
                  <Building2 className="w-4 h-4 text-[#0071CE] shrink-0" />
                  <select
                    value={selectedUniversity}
                    onChange={(e) => setSelectedUniversity(e.target.value)}
                    className="w-full text-xs sm:text-sm font-bold text-[#0a2240] bg-transparent outline-none truncate cursor-pointer font-cairo"
                  >
                    <option value="">
                      {currentLang === 'ar' ? 'اختر الجامعة' : currentLang === 'tr' ? 'Üniversite Seçin' : 'Select University'}
                    </option>
                    {filteredUniversities.map((u) => {
                      const tr = u.translations?.find((t) => t.lang === currentLang) ||
                                 u.translations?.find((t) => t.lang === 'ar') ||
                                 u.translations?.[0] || {};
                      const name = tr.name || u.slug;
                      return (
                        <option key={u.id} value={u.slug}>
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* Arama Butonu */}
                <button
                  type="submit"
                  aria-label="Arama"
                  className="w-10 h-10 sm:w-11 sm:h-11 bg-[#ff9015] hover:bg-[#f36c25] rounded-xl flex items-center justify-center shrink-0 transition-all shadow-md hover:scale-105 active:scale-95 text-white"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              </form>
            </div>

            {/* MASAÜSTÜ AÇIKLAMA VE BUTONLAR */}
            <div className="hidden md:flex flex-col mt-4">
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-cairo max-w-xl">
                {currentLang === 'tr'
                  ? "Türkiye'deki eğitim yolculuğunuz burada başlıyor! Yalnızca danışmanlık sunmuyor; en uygun üniversite seçiminden başvuruya, vizeden varış sonrası konaklamaya kadar her adımda yanınızda oluyoruz."
                  : currentLang === 'en'
                  ? 'Your journey to study in Turkey begins here! We guide you at every step: choosing the best university, official applications, documentation, and student accommodation upon arrival.'
                  : 'رحلتك نحو الدراسة في الجامعات التركية تبدأ من هنا! لا نقدم لك استشارات تعليمية فقط، بل نرافقك في كل خطوة. بداية من اختيار الجامعة الأنسب، ثم إجراءات التقديم، تجهيز المستندات، وضمان استقرارك عند الوصول.'}
              </p>

              <div className="flex items-center gap-4">
                <Link
                  to="/universities"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#ff9015] hover:bg-[#f36c25] text-white font-bold font-cairo text-sm sm:text-base rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95"
                >
                  <span>
                    {currentLang === 'tr'
                      ? 'Üniversiteleri ve Bölümleri İnceleyin'
                      : currentLang === 'en'
                      ? 'Explore Universities & Majors'
                      : 'تصفح الجامعات والتخصصات المعتمدة'}
                  </span>
                  <ArrowRight className="w-4 h-4 flip-in-rtl" />
                </Link>
                <Link
                  to="/apply"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#0a2240] border border-[#d7dae0] font-bold font-cairo text-sm sm:text-base rounded-xl shadow-sm transition-all"
                >
                  <span>{currentLang === 'tr' ? 'Hemen Başvur' : 'سجل الآن مجاناً'}</span>
                </Link>
              </div>

              {/* 2500+ Öğrenci Şeridi */}
              <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-200/80">
                <div className="flex -space-x-2 rtl:space-x-reverse">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Student"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Student"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                    alt="Student"
                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                  />
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-[#0a2240] text-[#ff9015] text-[11px] font-bold flex items-center justify-center shadow-sm">
                    +2.5k
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-700 font-cairo">
                  <span>
                    {currentLang === 'tr'
                      ? 'Her yıl 2500+ öğrenciye Türkiye üniversitelerinde kabul sağlıyoruz'
                      : currentLang === 'en'
                      ? '2500+ students assisted annually in Turkey'
                      : '2500+ طالب نساعده سنويًا في القبول بالجامعات التركية'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Sağ Görsel Alanı — StudyFans 1:1 Erkek Öğrenci ve Turuncu Zemin (Sayfa Rengiyle Bütünleşik) */}
          <div className="w-full lg:w-1/2 flex justify-center items-center relative">
            <div className="relative w-full max-w-lg flex justify-center items-center">
              {/* Arkada yumuşak ışıma efekti */}
              <div className="absolute w-80 h-80 rounded-full bg-orange-200/40 blur-3xl pointer-events-none -z-10" />

              {/* Ana Hero Kesit Görseli: Dikdörtgen çerçevesiz, doğrudan sayfa zemininde */}
              <img
                src="/images/studyfans_hero_student.png"
                alt="Student studying in Turkey - StudyFans"
                className="w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px] h-auto object-contain select-none drop-shadow-2xl transition-transform duration-500 hover:scale-[1.01]"
                loading="eager"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 2) SAYAÇLAR — STUDYFANS EXACT 1:1 CLONE ("لقد ساعدنا أكثر من +0 طالب...")
export function HomeStats() {
  const { currentLang } = useSiteText();

  const { data: statsData } = useQuery({
    queryKey: ['home-platform-stats'],
    queryFn: () => api.getPlatformStats(),
  });
  const platformStats = statsData?.data || {};

  const totalUnis = platformStats.totalUniversities || 125;
  const totalProgs = platformStats.totalPrograms || 1450;
  const totalConsultations = 10000;

  return (
    <section className="bg-[#0a2240] text-white py-12 sm:py-16 border-y border-blue-900/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Metin Alanı */}
          <div className="w-full lg:w-1/2 text-start">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-cairo leading-snug sm:leading-[1.3] mb-3 text-white">
              {currentLang === 'tr' ? (
                <>
                  <span className="text-[#ff9015]">+2.500'den Fazla</span> Öğrencinin Yurtdışında Üniversiteye Başlamasını Sağladık
                </>
              ) : currentLang === 'en' ? (
                <>
                  We Have Helped Over <span className="text-[#ff9015]">+2,500</span> Students Start University Abroad
                </>
              ) : (
                <>
                  لقد ساعدنا أكثر من <span className="text-[#ff9015]">+2500</span> طالب ليبدأ دراسته في الخارج
                </>
              )}
            </h2>

            <p className="text-blue-100/85 text-xs sm:text-sm leading-relaxed max-w-xl font-cairo">
              {currentLang === 'tr'
                ? "Şirketimiz Türkiye merkezli olup, uluslararası öğrencilerin prestijli üniversitelerde eğitim almaları konusunda uzmanlaşmıştır. 80'den fazla akredite üniversitenin resmi yetkili acentesiyiz."
                : currentLang === 'en'
                ? 'Headquartered in Turkey, we specialize in educational consultancy for international students wishing to study abroad as an authorized representative of 80+ universities.'
                : 'شركتنا متخصصة في تقديم الاستشارات التعليمية للدراسة في الخارج. نساعد الطلاب من مختلف دول العالم للدراسة في الخارج كوننا وكيلاً معتمداً لأكثر من 80 جامعة مرموقة.'}
            </p>
          </div>

          {/* Sayaçlar Alanı — Studyfans Exact 3 Kolon Yapısı */}
          <div className="w-full lg:w-1/2 grid grid-cols-3 gap-3 sm:gap-6 text-center">
            {/* 1. القبولات الجامعية: +2500 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-cairo text-[#ff9015] mb-1">
                <AnimatedCounter end={2500} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white/90 font-cairo">
                {currentLang === 'tr' ? 'Öğrenci Kabulü' : currentLang === 'en' ? 'Admissions' : 'قبول جامعي'}
              </div>
            </div>

            {/* 2. استشارات مجانية: +10000 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-cairo text-[#ff9015] mb-1">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white/90 font-cairo">
                {currentLang === 'tr' ? 'Ücretsiz Danışmanlık' : currentLang === 'en' ? 'Free Consultations' : 'استشارات مجانية'}
              </div>
            </div>

            {/* 3. الجامعات: +80 */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black font-cairo text-[#ff9015] mb-1">
                <AnimatedCounter end={totalUnis > 80 ? totalUnis : 80} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-white/90 font-cairo">
                {currentLang === 'tr' ? 'Akredite Üniversite' : currentLang === 'en' ? 'Universities' : 'الجامعات'}
              </div>
            </div>
          </div>

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

