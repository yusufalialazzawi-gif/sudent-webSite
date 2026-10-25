import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Building2,
  GraduationCap,
  MessageCircle,
  FileCheck,
  Percent,
  Home as HomeIcon,
  Sparkles,
  ArrowRight,
  BookOpen,
  MapPin,
  Star,
  Quote,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';
import { api } from '../../services/api';
import UniversityCard from '../common/UniversityCard';
import BlogCard from '../common/BlogCard';

// 3) ARAMA FORMU (#homepage-form) — 100% TÜRK ÜNİVERSİTELERİ (Kıbrıs / Malezya KALDIRILDI)
export function HomeSearchFormSection() {
  const { currentLang } = useSiteText();
  const navigate = useNavigate();

  const [city, setCity] = useState('');
  const [degree, setDegree] = useState('');
  const [major, setMajor] = useState('');

  const whatsappNumber = '905313971022';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحباً شركة المجد للقبولات الجامعية، أود الاستفسار عن القبول في الجامعات التركية والتخصصات المتاحة.'
  )}`;

  const turkishCities = [
    'İstanbul',
    'Ankara',
    'İzmir',
    'Antalya',
    'Bursa',
    'Sakarya',
    'Trabzon',
    'Konya',
    'Eskişehir',
    'Gaziantep',
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (degree) params.set('degree', degree);
    if (major) params.set('search', major);
    navigate(`/universities?${params.toString()}`);
  };

  return (
    <section id="homepage-form" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Başlık — Mavi ve Beyaz Logo Teması */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-[#0B2545] text-xs font-bold mb-3 border border-blue-100">
            <span>🇹🇷 بوابة القبول المعتمدة في تركيا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0B2545] leading-snug">
            نسهل لكم <span className="text-[#E8930C]">كافة خطوات</span> الدراسة في الجامعات التركية
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 font-cairo">
            ابحث عن جامعتك وتخصصك الأكاديمي في أفضل الجامعات الحكومية والخاصة المعتمدة
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Arama Seçicileri: Şehir, Derece, Bölüm (Ülke seçimi yok, yalnızca Türkiye) */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSearch}
              className="bg-white p-3.5 sm:p-5 rounded-[22px] border border-blue-100 shadow-[0_8px_30px_rgba(11,37,69,0.08)] flex flex-col gap-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. اختر المدينة التركية */}
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-[12px] text-sm font-bold font-cairo text-[#0B2545] focus:outline-none focus:ring-2 focus:ring-[#0B2545] border border-slate-200/80 cursor-pointer pe-10 transition-colors"
                  >
                    <option value="">🏙️ اختر المدينة التركية</option>
                    {turkishCities.map((c) => (
                      <option key={c} value={c}>
                        مدينة {c}
                      </option>
                    ))}
                  </select>
                  <MapPin className="w-4 h-4 text-slate-500 absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* 2. المرحلة الدراسية */}
                <div className="relative">
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-[12px] text-sm font-bold font-cairo text-[#0B2545] focus:outline-none focus:ring-2 focus:ring-[#0B2545] border border-slate-200/80 cursor-pointer pe-10 transition-colors"
                  >
                    <option value="">🎓 المرحلة الدراسية</option>
                    <option value="BACHELOR">بكالوريوس (Lisans)</option>
                    <option value="MASTER_WITH_THESIS">ماجستير بأطروحة</option>
                    <option value="MASTER_NON_THESIS">ماجستير بدون أطروحة</option>
                    <option value="PHD">دكتوراه (Doktora)</option>
                    <option value="ASSOCIATE">دبلوم متوسط (Ön Lisans)</option>
                  </select>
                  <GraduationCap className="w-4 h-4 text-slate-500 absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 3. اختر التخصص والبحث */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="flex-1 min-w-0">
                  <select
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full min-h-[48px] px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-[12px] text-sm font-bold font-cairo text-[#0B2545] focus:outline-none focus:ring-2 focus:ring-[#0B2545] border border-slate-200/80 cursor-pointer transition-colors"
                  >
                    <option value="">📚 اختر التخصص الأكاديمي</option>
                    <option value="هندسة">هندسة (Engineering)</option>
                    <option value="طب بشري">طب بشري (Medicine)</option>
                    <option value="طب أسنان">طب أسنان (Dentistry)</option>
                    <option value="صيدلة">صيدلة (Pharmacy)</option>
                    <option value="إدارة أعمال">إدارة أعمال (Business)</option>
                    <option value="ذكاء اصطناعي">ذكاء اصطناعي وبرمجة</option>
                    <option value="علاج طبيعي">علاج طبيعي وتمريض</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="min-h-[48px] px-6 bg-[#E8930C] hover:bg-[#d08309] text-white font-bold font-cairo rounded-[12px] flex items-center justify-center gap-2 transition-colors shrink-0 shadow-md"
                >
                  <Search className="w-5 h-5" />
                  <span>بحث في الجامعات التركية</span>
                </button>
              </div>
            </form>

            <div className="mt-4 flex flex-wrap items-center gap-2 justify-center lg:justify-start text-xs text-slate-500 font-cairo">
              <span className="font-bold text-slate-700">الأكثر طلباً:</span>
              <button
                type="button"
                onClick={() => navigate('/universities?type=PUBLIC')}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#0B2545] font-bold rounded-full transition-colors border border-blue-200/60"
              >
                جامعات حكومية
              </button>
              <button
                type="button"
                onClick={() => navigate('/universities?type=PRIVATE')}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#0B2545] font-bold rounded-full transition-colors border border-blue-200/60"
              >
                جامعات خاصة
              </button>
              <button
                type="button"
                onClick={() => navigate('/programs?search=طب')}
                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-[#E8930C] font-bold rounded-full transition-colors border border-amber-200/60"
              >
                الطب البشري
              </button>
            </div>
          </div>

          {/* Öğrenci Rozeti & Görseli (Türk Bayrağı ile) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-72 sm:w-80 h-72 sm:h-80 flex items-center justify-center">
              {/* Mavi/Turuncu Dairesel Zemin */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#0B2545] to-[#1E3A8A] opacity-95 shadow-xl" />

              {/* Türk Bayrağı Rozetleri */}
              <div className="absolute top-6 end-4 bg-white p-1.5 rounded-full shadow-lg z-20 flex items-center justify-center border-2 border-red-500">
                <span className="text-2xl" role="img" aria-label="Turkey">🇹🇷</span>
              </div>
              <div className="absolute top-10 start-4 bg-white p-2 rounded-full shadow-md z-20 text-[#0B2545]">
                <GraduationCap className="w-5 h-5" />
              </div>

              {/* Konuşma Baloncuğu */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-10 inset-x-2 z-30 bg-white/95 backdrop-blur-md py-2.5 px-4 rounded-2xl shadow-xl border border-slate-100 text-xs font-bold text-slate-800 text-center font-cairo hover:bg-white transition-all flex items-center justify-center gap-2 group"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span>تواصل معنا لنجيب على جميع استفساراتك</span>
              </a>

              {/* İllüstratif Öğrenci Simgesi */}
              <div className="relative z-10 flex flex-col items-center justify-center text-white text-center pb-8">
                <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner mb-2">
                  <Building2 className="w-10 h-10 text-[#E9B949]" />
                </div>
                <span className="font-extrabold text-base font-cairo drop-shadow-sm text-white">
                  +120 جامعة تركية معتمدة
                </span>
                <span className="text-xs text-blue-200 font-cairo mt-0.5">
                  استشارة أكاديمية وقبول رسمي مجاناً
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 4) HİZMETLER — Mavi & Beyaz Logo Teması
export function HomeServicesSection() {
  const services = [
    {
      title: 'استشارة مجانية',
      desc: 'نساعدك في تحديد تخصصك الدراسي واختيار الجامعة التركية الأنسب لطموحك وميزانيتك.',
      icon: MessageCircle,
      iconColor: 'text-[#0B2545]',
      iconBg: 'bg-blue-50',
    },
    {
      title: 'التقديم على الجامعات',
      desc: 'نضمن قبولك الدراسي كوكيل رسمي ومعتمد في الجامعات الحكومية والخاصة في تركيا.',
      icon: FileCheck,
      iconColor: 'text-[#22C55E]',
      iconBg: 'bg-emerald-50',
    },
    {
      title: 'خصومات حصرية',
      desc: 'نوفر لك منحاً جزئية وخصومات حصرية على الأقساط الدراسية السنوية تصل حتى 70%.',
      icon: Percent,
      iconColor: 'text-[#E8930C]',
      iconBg: 'bg-amber-50',
    },
    {
      title: 'الإقامة في تركيا',
      desc: 'نساعدك في تجهيز ملف الإقامة الطلابية والتأمين الصحي وتأمين السكن الطلابي المناسب.',
      icon: HomeIcon,
      iconColor: 'text-[#3B82F6]',
      iconBg: 'bg-sky-50',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-block w-14 h-1.5 bg-[#0B2545] rounded-full mb-3" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0B2545] leading-tight">
            ما الذي نقدمه لك لتسهيل رحلتك الجامعية
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 font-cairo">
            خدمات متكاملة ترافقك من أول استشارة وحتى استلام مقعدك الجامعي
          </p>
        </div>

        {/* 4 Hizmet Kartı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-7 rounded-[22px] border border-blue-100 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center group"
              >
                <div
                  className={`w-16 h-16 rounded-full ${s.iconBg} ${s.iconColor} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-extrabold font-cairo text-[#0B2545] mb-2.5">
                  {s.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-cairo">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Noter & Denklik Şeridi */}
        <div className="mt-10 max-w-4xl mx-auto p-4 sm:p-5 bg-white rounded-[18px] border border-blue-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-start">
            <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-[#E9B949] flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-[#0B2545] font-cairo">
                خدمات معادلة الشهادات وترجمتها المعتمدة (YÖK)
              </div>
              <div className="text-xs text-slate-500 font-cairo">
                ترجمة محلفة وتصديق نوتر ومتابعة ملف المعادلة خطوة بخطوة
              </div>
            </div>
          </div>
          <Link
            to="/services"
            className="min-h-[44px] px-5 py-2.5 bg-[#0B2545] hover:bg-[#163b6a] text-white font-bold font-cairo text-xs sm:text-sm rounded-[12px] whitespace-nowrap transition-colors flex items-center gap-1.5"
          >
            <span>تفاصيل الخدمات</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// 5) ÜNİVERSİTELER — Mavi & Beyaz Tema + Türk Bayraklı Buton + Aşağıda Temiz Filtre
export function HomeUniversitiesSection() {
  const { currentLang } = useSiteText();
  const [filter, setFilter] = useState('ALL');
  const [showAll, setShowAll] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['studyfans-home-unis', filter, currentLang],
    queryFn: () => {
      const params = { limit: 8, lang: currentLang };
      if (filter === 'PUBLIC') params.type = 'PUBLIC';
      if (filter === 'PRIVATE') params.type = 'PRIVATE';
      return api.getUniversities(params);
    },
  });

  const universities = data?.data || [];

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setMobileIndex(0);
    setShowAll(false);
  };

  const handleNextMobile = () => {
    if (universities.length === 0) return;
    setMobileIndex((prev) => (prev + 1) % universities.length);
  };

  const handlePrevMobile = () => {
    if (universities.length === 0) return;
    setMobileIndex((prev) => (prev - 1 + universities.length) % universities.length);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#0B2545] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Bölüm Başlığı */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-[#E9B949] text-xs font-bold uppercase tracking-wider block mb-1">
            🏛️ دليل الجامعات في تركيا
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-white">
            أهم الجامعات التركية المعتمدة
          </h2>
          <p className="text-blue-200/90 text-sm mt-2 font-cairo">
            تصفح قائمة الجامعات الحكومية والخاصة المعتمدة في تركيا للبكالوريوس والماجستير والدكتوراه
          </p>

          {/* Filtre Butonları — Başlığın altında, temiz ve düzenli */}
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              type="button"
              onClick={() => handleFilterChange('ALL')}
              className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-bold font-cairo transition-colors ${
                filter === 'ALL'
                  ? 'bg-white text-[#0B2545] shadow-md'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              جميع الجامعات
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('PUBLIC')}
              className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-bold font-cairo transition-colors ${
                filter === 'PUBLIC'
                  ? 'bg-white text-[#0B2545] shadow-md'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              جامعات حكومية (Devlet)
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange('PRIVATE')}
              className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-bold font-cairo transition-colors ${
                filter === 'PRIVATE'
                  ? 'bg-white text-[#0B2545] shadow-md'
                  : 'bg-white/10 hover:bg-white/15 text-white'
              }`}
            >
              جامعات خاصة (Vakıf)
            </button>
          </div>
        </div>

        {/* Üniversite Kartları Alanı */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 bg-white/10 animate-pulse rounded-[20px]" />
            ))}
          </div>
        ) : universities.length === 0 ? (
          <div className="text-center py-12 text-blue-200 font-cairo text-sm">
            لا توجد جامعات متاحة في هذا التصنيف حالياً
          </div>
        ) : (
          <div>
            {/* MOBİL GÖRÜNÜM: "alt alta olmasın, bir tane olsun, sonra aşağıda diğerleri gözüksün butonu" */}
            <div className="block sm:hidden">
              {!showAll ? (
                <div>
                  {/* Tek Üniversite Kartı */}
                  <div className="max-w-md mx-auto">
                    {universities[mobileIndex] && (
                      <UniversityCard university={universities[mobileIndex]} />
                    )}
                  </div>

                  {/* 1'den diğerlerine geçiş adımları / Stepper & Oklar */}
                  {universities.length > 1 && (
                    <div className="flex items-center justify-between mt-3 px-2 text-xs font-bold font-cairo text-blue-100">
                      <button
                        type="button"
                        onClick={handlePrevMobile}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all flex items-center gap-1.5"
                        aria-label="السابق"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>السابق</span>
                      </button>

                      <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[#E9B949] font-bold">
                        {mobileIndex + 1} / {universities.length}
                      </span>

                      <button
                        type="button"
                        onClick={handleNextMobile}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all flex items-center gap-1.5"
                        aria-label="التالي"
                      >
                        <span>التالي</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Diğerleri Gösterildiğinde: Tüm Üniversiteler Listelenir */
                <div className="grid grid-cols-1 gap-5">
                  {universities.map((uni) => (
                    <UniversityCard key={uni.id || uni.slug} university={uni} />
                  ))}
                </div>
              )}
            </div>

            {/* MASAÜSTÜ GÖRÜNÜM: 4 veya 8 Kart */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(showAll ? universities : universities.slice(0, 4)).map((uni) => (
                <UniversityCard key={uni.id || uni.slug} university={uni} />
              ))}
            </div>

            {/* Kullanıcının istediği: "sonra aşağıda diğerleri gözüksün butonu" */}
            {universities.length > 1 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="min-h-[46px] px-7 py-2.5 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white font-extrabold font-cairo text-xs sm:text-sm border border-white/25 shadow-lg flex items-center gap-2 transition-all"
                >
                  {showAll ? (
                    <>
                      <span>إظهار جامعة واحدة فقط (عرض أقل)</span>
                      <ChevronUp className="w-4 h-4 text-[#E9B949]" />
                    </>
                  ) : (
                    <>
                      <span>عرض باقي الجامعات ({universities.length - 1}+)</span>
                      <ChevronDown className="w-4 h-4 text-[#E9B949]" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Kullanıcının istediği: Türk Bayrağı Fotoğraflı Belirgin Buton */}
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          {/* Butonun Üstünde Türk Bayrağı Fotoğrafı / Rozeti */}
          <div className="mb-4 inline-flex items-center gap-3 bg-white/15 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/25 shadow-lg">
            <img
              src="https://flagcdn.com/w80/tr.png"
              srcSet="https://flagcdn.com/w160/tr.png 2x"
              alt="علم تركيا"
              className="w-9 h-6 object-cover rounded shadow border border-white/40"
              loading="lazy"
            />
            <span className="text-xs sm:text-sm font-black text-white font-cairo">
              دليل الجامعات التركية المعتمدة والمعترف بها دولياً 🇹🇷
            </span>
          </div>

          {/* Büyük ve Belirgin Buton */}
          <Link
            to="/universities"
            className="min-h-[54px] px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-[#E8930C] to-[#f59e0b] hover:from-[#d08309] hover:to-[#e8930c] text-white font-black font-cairo text-sm sm:text-base shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
          >
            <span>عرض كافة الجامعات التركية (+120 جامعة)</span>
            <ArrowRight className="w-5 h-5 flip-in-rtl" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// 6) BÖLÜMLER — Mavi & Beyaz Tema
export function HomeMajorsSection() {
  const navigate = useNavigate();

  const majors = [
    {
      title: 'هندسة',
      img: '/uploads/universities/istanbul-teknik-universitesi.webp',
      search: 'هندسة',
    },
    {
      title: 'طب الأسنان',
      img: '/uploads/universities/istanbul-medipol-university.webp',
      search: 'طب أسنان',
    },
    {
      title: 'طب بشري',
      img: '/uploads/universities/hacettepe-universitesi.webp',
      search: 'طب بشري',
    },
    {
      title: 'صيدلة',
      img: '/uploads/universities/biruni-university.webp',
      search: 'صيدلة',
    },
    {
      title: 'إدارة أعمال',
      img: '/uploads/universities/bilkent-university.webp',
      search: 'إدارة أعمال',
    },
    {
      title: 'الذكاء الاصطناعي',
      img: '/uploads/universities/sabanci-university.webp',
      search: 'ذكاء اصطناعي',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-block w-14 h-1.5 bg-[#0B2545] rounded-full mb-3" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0B2545] leading-tight">
            اعرف المزيد عن أهم التخصصات
          </h2>
          <p className="text-slate-600 text-sm mt-2 font-cairo">
            اختر تخصصك المستقبلي من بين أكثر البرامج الأكاديمية تميزاً وطلباً في الجامعات التركية
          </p>
        </div>

        {/* Bölüm Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {majors.map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigate(`/programs?search=${encodeURIComponent(m.search)}`)}
              className="group relative h-48 sm:h-56 rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow text-start cursor-pointer border border-slate-100 block w-full"
            >
              <img
                src={m.img}
                alt={m.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 end-3 sm:bottom-4 sm:end-4 z-10">
                <span className="text-base sm:text-lg font-black font-cairo text-white drop-shadow-md">
                  {m.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-sm font-bold font-cairo text-[#0B2545] hover:text-[#16437d] transition-colors"
          >
            <span>استكشف كافة البرامج والتخصصات المتاحة</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// 7) MAKALELER — 4 Temiz Blog Kartı
export function HomeArticlesSection() {
  const { currentLang } = useSiteText();

  const { data, isLoading } = useQuery({
    queryKey: ['studyfans-home-articles', currentLang],
    queryFn: () => api.getArticles({ limit: 4, lang: currentLang }),
  });

  const articles = data?.data || [];

  return (
    <section className="py-14 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-[#0B2545] text-xs font-bold uppercase tracking-wider block mb-1">
              📚 الدليل الأكاديمي
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0B2545]">
              أحدث المقالات والدلائل الأكاديمية
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl font-cairo">
              كل ما تحتاج لمعرفته عن شروط القبول الجامعي، وتكاليف المعيشة، والمنح في تركيا.
            </p>
          </div>

          <Link
            to="/blog"
            className="min-h-[44px] inline-flex items-center gap-2 px-6 py-2.5 rounded-[12px] bg-white border border-slate-200 text-[#0B2545] hover:bg-blue-50 font-bold font-cairo text-sm transition-colors shrink-0 shadow-sm"
          >
            <span>زيارة المدونة</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-[20px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article) => (
              <BlogCard key={article.id || article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// 8) ÖĞRENCİ YORUMLARI (Kullanıcının istediği: "en alta ogrencilerin yorumlari yap zaten projede var")
export function HomeTestimonialsSection() {
  const { currentLang } = useSiteText();

  const { data, isLoading } = useQuery({
    queryKey: ['home-testimonials-section'],
    queryFn: () => api.getTestimonials(),
  });

  const testimonials = data?.data || [];

  const defaultTestimonials = [
    {
      studentName: 'محمد أحمد',
      university: 'جامعة إسطنبول أيدن',
      program: 'هندسة برمجيات',
      rating: 5,
      quote: 'تجربتي مع شركة المجد كانت ممتازة وسريعة جداً. حصلت على قبولي في أسبوع واحد وساعدوني في السكن والإقامة.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    },
    {
      studentName: 'سارة خالد',
      university: 'جامعة بهتشه شهير',
      program: 'طب الأسنان',
      rating: 5,
      quote: 'وفروا لي خصماً ممتازاً على الرسوم الدراسية ورافقوني خطوة بخطوة حتى وصولي لإسطنبول. شكراً لفريق العمل!',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    },
    {
      studentName: 'عبدالرحمن العتيبي',
      university: 'جامعة كوتش',
      program: 'إدارة أعمال',
      rating: 5,
      quote: 'فريق محترف وموثوق، كل الشكر لمستشاري الأكاديمي على النصائح القيمة والمتابعة المستمرة حتى بعد التسجيل.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    },
  ];

  const items = testimonials.length > 0 ? testimonials.slice(0, 3) : defaultTestimonials;

  return (
    <section className="py-14 sm:py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-block w-14 h-1.5 bg-[#0B2545] rounded-full mb-3" />
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0B2545] leading-tight">
            آراء وتجارب طلابنا في الجامعات التركية
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 font-cairo">
            قصص نجاح حقيقية لطلاب التحقوا بأفضل الجامعات التركية عبر شركة المجد للقبولات الجامعية
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-[22px] border border-blue-100/80 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-3 text-[#E8930C]">
                  {[...Array(item.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#E8930C]" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic font-cairo font-medium">
                  "{item.quoteAr || item.quote || item.quoteTr}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 pt-4 border-t border-slate-200/70">
                <img
                  src={item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={item.studentName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                  loading="lazy"
                />
                <div className="flex-1 min-w-0 text-start">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-extrabold text-[#0B2545] font-cairo truncate">
                      {item.studentName}
                    </h4>
                    <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <p className="text-xs text-[#E8930C] font-bold font-cairo truncate">
                    {item.program}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {item.university}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 9) FINAL CTA — "احصل على قبولك الجامعي مجانا" (Mavi & Beyaz Tema)
export function HomeFinalCtaSection() {
  const whatsappNumber = '905313971022';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحباً شركة المجد، أود الحصول على قبولي الجامعي في تركيا مجاناً.'
  )}`;

  return (
    <section className="bg-[#0B2545] text-white py-14 sm:py-20 relative overflow-hidden border-t border-blue-900/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-[#0F2E59] px-4 py-1.5 rounded-full border border-blue-400/30 text-[#E9B949] text-xs font-bold mb-4">
          <Sparkles className="w-4 h-4 text-[#E9B949]" />
          <span>خطوتك الأولى نحو مستقبلك الجامعي في تركيا 🇹🇷</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-cairo text-white leading-tight mb-4">
          احصل على قبولك الجامعي في تركيا مجاناً
        </h2>

        <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-8 font-cairo">
          فريق شركة المجد يرافقك خطوة بخطوة من اختيار التخصص والجامعة التركية المناسبة وحتى استلام مقعدك الجامعي.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] px-7 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold font-cairo rounded-[12px] shadow-[0_8px_24px_rgba(34,197,94,0.35)] flex items-center gap-2 transition-colors active:scale-[0.99]"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
            </svg>
            <span>تواصل عبر واتساب اب</span>
          </a>

          <Link
            to="/apply"
            className="min-h-[48px] px-7 py-3 bg-[#E8930C] hover:bg-[#d08309] text-white font-bold font-cairo rounded-[12px] flex items-center gap-2 transition-colors active:scale-[0.99]"
          >
            <span>قدم طلبك الآن</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>
      </div>
    </section>
  );
}
