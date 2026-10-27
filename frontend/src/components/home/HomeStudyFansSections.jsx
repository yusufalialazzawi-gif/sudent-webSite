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
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Award,
  Globe,
  Clock,
  ExternalLink,
  Quote,
  CheckCircle2,
  ThumbsUp,
  MessageSquarePlus,
  X,
  Send,
} from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';
import { api } from '../../services/api';
import UniversityCard from '../common/UniversityCard';

// 2) ARAMA FORMU (#homepage-form) — STUDYFANS 1:1 EXACT
// "ابحث عن التخصص الذي تريده"
export function HomeSearchFormSection() {
  const { currentLang } = useSiteText();
  const navigate = useNavigate();

  const [country, setCountry] = useState('turkey');
  const [degree, setDegree] = useState('');
  const [major, setMajor] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (country) params.set('country', country);
    if (degree) params.set('degree', degree);
    if (major) params.set('search', major);
    navigate(`/universities?${params.toString()}`);
  };

  return (
    <section id="homepage-form" className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 text-[#ff9015] text-xs font-bold mb-3 border border-orange-200/60">
            <span>🔍 {currentLang === 'tr' ? 'Hızlı Bölüm ve Üniversite Arama' : currentLang === 'en' ? 'Quick Major & University Search' : 'ابحث عن التخصص والجامعة الأنسب لك'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0a2240] leading-snug">
            {currentLang === 'tr' ? 'İstediğiniz Bölümü ve Üniversiteyi Arayın' : currentLang === 'en' ? 'Search for the Major You Want' : 'ابحث عن التخصص الذي تريده'}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 font-cairo">
            {currentLang === 'tr'
              ? 'Akredite üniversitelerde eğitim almak için ülke, derece ve bölümünüzü seçin'
              : currentLang === 'en'
              ? 'Select your country, degree level, and major to find the best accredited university'
              : 'حدد الدولة والمرحلة الدراسية والتخصص للوصول إلى أفضل الجامعات المعتمدة'}
          </p>
        </div>

        {/* StudyFans Main Search Bar */}
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSearch}
            className="bg-white p-3 sm:p-4 rounded-2xl border border-[#d7dae0] shadow-[0_8px_30px_rgba(10,34,64,0.06)] flex flex-col md:flex-row items-stretch md:items-center gap-3"
          >
            {/* 1. اختر الدولة */}
            <div className="w-full md:w-1/4 relative">
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full min-h-[46px] px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold font-cairo text-[#0a2240] focus:outline-none focus:ring-2 focus:ring-[#ff9015] border border-slate-200 cursor-pointer pe-8 transition-colors"
              >
                <option value="turkey">🇹🇷 تركيا (Turkey)</option>
                <option value="malaysia">🇲🇾 ماليزيا (Malaysia)</option>
                <option value="northern-cyprus">🇨🇾 قبرص الشمالية (Cyprus)</option>
              </select>
              <Globe className="w-4 h-4 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 2. اختر المرحلة الدراسية */}
            <div className="w-full md:w-1/4 relative">
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full min-h-[46px] px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold font-cairo text-[#0a2240] focus:outline-none focus:ring-2 focus:ring-[#ff9015] border border-slate-200 cursor-pointer pe-8 transition-colors"
              >
                <option value="">🎓 {currentLang === 'tr' ? 'Tüm Aşamalar' : currentLang === 'en' ? 'All Degrees' : 'المرحلة الدراسية'}</option>
                <option value="BACHELOR">بكالوريوس (Lisans)</option>
                <option value="MASTER_WITH_THESIS">ماجستير بأطروحة</option>
                <option value="MASTER_NON_THESIS">ماجستير بدون أطروحة</option>
                <option value="PHD">دكتوراه (Doktora)</option>
                <option value="ASSOCIATE">دبلوم متوسط</option>
              </select>
              <GraduationCap className="w-4 h-4 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* 3. اختر التخصص */}
            <div className="w-full md:w-2/4 relative">
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full min-h-[46px] px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs sm:text-sm font-bold font-cairo text-[#0a2240] focus:outline-none focus:ring-2 focus:ring-[#ff9015] border border-slate-200 cursor-pointer pe-8 transition-colors"
              >
                <option value="">📚 {currentLang === 'tr' ? 'Bölüm Seçin veya Arayın' : currentLang === 'en' ? 'Select Major' : 'اختر التخصص أو ابحث عنه'}</option>
                <option value="هندسة">هندسة (Engineering)</option>
                <option value="طب بشري">طب بشري (Medicine)</option>
                <option value="طب أسنان">طب أسنان (Dentistry)</option>
                <option value="صيدلة">صيدلة (Pharmacy)</option>
                <option value="إدارة أعمال">إدارة أعمال (Business)</option>
                <option value="ذكاء اصطناعي">ذكاء اصطناعي وبرمجة</option>
                <option value="علاج طبيعي">علاج طبيعي وتمريض</option>
              </select>
              <BookOpen className="w-4 h-4 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="min-h-[46px] px-7 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold font-cairo text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm"
            >
              <Search className="w-4 h-4" />
              <span>{currentLang === 'tr' ? 'Ara' : currentLang === 'en' ? 'Search' : 'ابحث الآن'}</span>
            </button>
          </form>

          {/* Quick Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2 justify-center text-xs text-slate-500 font-cairo">
            <span className="font-bold text-slate-700">{currentLang === 'tr' ? 'Popüler:' : currentLang === 'en' ? 'Popular:' : 'الأكثر طلباً:'}</span>
            <button
              type="button"
              onClick={() => navigate('/universities?type=PUBLIC')}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#0a2240] font-bold rounded-full transition-colors border border-slate-200"
            >
              جامعات حكومية
            </button>
            <button
              type="button"
              onClick={() => navigate('/universities?type=PRIVATE')}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-[#0a2240] font-bold rounded-full transition-colors border border-slate-200"
            >
              جامعات خاصة
            </button>
            <button
              type="button"
              onClick={() => navigate('/programs?search=طب')}
              className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-[#ff9015] font-bold rounded-full transition-colors border border-orange-200/60"
            >
              الطب البشري
            </button>
            <button
              type="button"
              onClick={() => navigate('/programs?search=هندسة')}
              className="px-3 py-1 bg-orange-50 hover:bg-orange-100 text-[#ff9015] font-bold rounded-full transition-colors border border-orange-200/60"
            >
              الهندسة
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// 3) PARTNER ÜLKELER — STUDYFANS 1:1 EXACT ("لدينا شراكات مع جامعات مختلفة حول العالم")
export function HomePartnerCountriesSection() {
  const { currentLang } = useSiteText();
  const navigate = useNavigate();

  const countries = [
    {
      id: 'turkey',
      nameAr: 'تركيا',
      nameTr: 'Türkiye',
      nameEn: 'Turkey',
      flag: 'https://flagcdn.com/w80/tr.png',
      bgImg: '/uploads/universities/istanbul-universitesi.webp',
      unis: '58',
      majors: '613',
      avgPrice: '3500$',
      url: '/universities?country=turkey',
    },
    {
      id: 'malaysia',
      nameAr: 'ماليزيا',
      nameTr: 'Malezya',
      nameEn: 'Malaysia',
      flag: 'https://flagcdn.com/w80/my.png',
      bgImg: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&auto=format&fit=crop&q=80',
      unis: '36',
      majors: '374',
      avgPrice: '4000$',
      url: '/universities?country=malaysia',
    },
    {
      id: 'northern-cyprus',
      nameAr: 'قبرص الشمالية',
      nameTr: 'Kuzey Kıbrıs',
      nameEn: 'Northern Cyprus',
      flag: 'https://flagcdn.com/w80/cy.png',
      bgImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
      unis: '12',
      majors: '231',
      avgPrice: '8000$',
      url: '/universities?country=cyprus',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="flex flex-col gap-3 text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a2240] font-cairo">
            {currentLang === 'tr'
              ? 'Farklı Ülkelerdeki Saygın Üniversitelerle Ortaklıklarımız Var'
              : currentLang === 'en'
              ? 'We Have Partnerships with Universities Worldwide'
              : 'لدينا شراكات مع جامعات مختلفة حول العالم'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-2xl mx-auto font-cairo">
            {currentLang === 'tr'
              ? 'En iyi dünya üniversitelerinde uygun maliyetlerle ayrıcalıklı eğitim fırsatları sunuyoruz.'
              : currentLang === 'en'
              ? 'We offer you distinguished study opportunities at the best global universities at an affordable cost.'
              : 'نقدم لك فرصًا دراسية مميزة في أفضل الجامعات العالمية بتكلفة معقولة.'}
          </p>
        </div>

        {/* 3 Country Cards — StudyFans exact styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {countries.map((c) => {
            const name = currentLang === 'tr' ? c.nameTr : currentLang === 'en' ? c.nameEn : c.nameAr;
            return (
              <div
                key={c.id}
                onClick={() => navigate(c.url)}
                className="border border-slate-200/90 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 p-3 sm:p-4 bg-white flex flex-col justify-between cursor-pointer group"
              >
                {/* Photo & Flag */}
                <div className="relative w-full h-48 md:h-56 overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={c.bgImg}
                    alt={name}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute -bottom-2 -end-1 bg-white p-1 rounded-lg shadow-md border border-slate-100">
                    <img
                      src={c.flag}
                      alt={name}
                      className="w-12 h-8 object-cover rounded-md"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Info & Price */}
                <div className="flex flex-col gap-4 pt-5">
                  <h3 className="text-xl font-bold text-[#0a2240] font-cairo group-hover:text-[#ff9015] transition-colors">
                    {name}
                  </h3>

                  <div className="flex justify-between text-slate-600 text-xs sm:text-sm font-cairo">
                    <p className="flex gap-1.5 items-center w-1/2">
                      <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>{currentLang === 'tr' ? 'Üniversiteler' : currentLang === 'en' ? 'Universities' : 'الجامعات'}: <span className="font-bold text-[#0a2240]">{c.unis}</span></span>
                    </p>
                    <p className="flex gap-1.5 items-center w-1/2">
                      <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>{currentLang === 'tr' ? 'Bölümler' : currentLang === 'en' ? 'Majors' : 'التخصصات'}: <span className="font-bold text-[#0a2240]">{c.majors}</span></span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <p className="text-base sm:text-lg font-bold text-[#0a2240]">
                      {c.avgPrice} <span className="text-[11px] font-normal text-slate-500 font-cairo">/ {currentLang === 'tr' ? 'Yıllık Ortalama' : currentLang === 'en' ? 'Annual Avg' : 'المتوسط السنوي'}</span>
                    </p>
                    <span className="py-2 px-4 bg-orange-500 hover:bg-[#e05e00] text-xs sm:text-sm text-white font-bold rounded-lg transition-colors">
                      {currentLang === 'tr' ? 'Daha Fazla' : currentLang === 'en' ? 'Learn More' : 'اعرف المزيد'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 5) HİZMETLER — STUDYFANS 1:1 EXACT ("ما الذي نقدمه لك لتسهيل رحلتك الجامعية")
export function HomeServicesSection() {
  const { currentLang } = useSiteText();

  const services = [
    {
      title: currentLang === 'tr' ? 'Ücretsiz Danışmanlık' : currentLang === 'en' ? 'Free Consultation' : 'استشارة مجانية',
      desc: currentLang === 'tr' ? 'Bölümünüzü ve en uygun üniversiteyi belirlemenize yardımcı oluyoruz.' : currentLang === 'en' ? 'We help you choose your study major and the right university.' : 'نساعدك في تحديد تخصصك الدراسي واختيار الجامعة المناسبة',
      icon: MessageCircle,
    },
    {
      title: currentLang === 'tr' ? 'Üniversite Başvurusu' : currentLang === 'en' ? 'University Admission' : 'التقديم على الجامعات',
      desc: currentLang === 'tr' ? 'Size en uygun üniversitede yetkili acente olarak kabulünüzü garantiliyoruz.' : currentLang === 'en' ? 'We guarantee your university acceptance as an accredited agent.' : 'نضمن قبولك الدراسي كوكيل معتمد في الجامعة الأنسب لك',
      icon: FileCheck,
    },
    {
      title: currentLang === 'tr' ? 'Özel İndirimler' : currentLang === 'en' ? 'Exclusive Discounts' : 'خصومات حصرية',
      desc: currentLang === 'tr' ? 'Anlaşmalı vakıf üniversitelerinde özel harç indirimleri sunuyoruz.' : currentLang === 'en' ? 'We provide you with exclusive discounts in top Turkish universities.' : 'نقدم لكم خصومات حصرية في معظم الجامعات التركية',
      icon: Percent,
    },
    {
      title: currentLang === 'tr' ? 'Türkiye\'de Konaklama' : currentLang === 'en' ? 'Living in Turkey' : 'الإقامة في تركيا',
      desc: currentLang === 'tr' ? 'Yurt bulma, havalimanı karşılama ve resmi evrak işlemlerinizde yanınızdayız.' : currentLang === 'en' ? 'We assist with student dorms, airport reception, and official paperwork.' : 'نساعدك في إيجاد سكن مناسب، ثم نستقبلك من المطار، وإكمال أوراقك الرسمية',
      icon: HomeIcon,
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center mb-10 sm:mb-14">
          <h3 className="text-[#0051FF] font-bold text-xs sm:text-sm tracking-wider uppercase font-cairo">
            {currentLang === 'tr' ? 'Hizmetlerimiz' : currentLang === 'en' ? 'Our Services' : 'خدماتنا'}
          </h3>
          <div className="w-16 h-1 bg-[#ff9015] rounded-full mb-1" />
          <h2 className="text-xl md:text-2xl xl:text-3xl font-extrabold text-[#0a2240] font-cairo">
            {currentLang === 'tr' ? 'Üniversite Yolculuğunuzu Kolaylaştırmak İçin Neler Sunuyoruz?' : currentLang === 'en' ? 'What We Offer to Facilitate Your University Journey' : 'ما الذي نقدمه لك لتسهيل رحلتك الجامعية'}
          </h2>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <li
                key={idx}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 p-6 sm:p-7 flex flex-col items-center text-center space-y-4 group transition-shadow"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center border-8 border-orange-50 p-3 text-[#ff9015] group-hover:scale-105 transition-transform">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[#0a2240] font-cairo">
                  {s.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-cairo">
                  {s.desc}
                </p>
              </li>
            );
          })}
        </ul>

        {/* Notary / YÖK Denklik Strip */}
        <div className="mt-10 max-w-4xl mx-auto p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-start">
            <div className="w-10 h-10 rounded-xl bg-[#002d74] text-[#ff9015] flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-sm text-[#0a2240] font-cairo">
                {currentLang === 'tr' ? 'YÖK Denklik ve Yeminli Tercüme Desteği' : currentLang === 'en' ? 'YÖK Equivalency & Certified Translation' : 'خدمات معادلة الشهادات وترجمتها المعتمدة (YÖK)'}
              </div>
              <div className="text-xs text-slate-500 font-cairo">
                {currentLang === 'tr' ? 'Noter tasdiki, yeminli tercüme ve denklik dosyanızın adım adım takibi' : currentLang === 'en' ? 'Certified translation, notary attestation, and official equivalency follow-up' : 'ترجمة محلفة وتصديق نوتر ومتابعة ملف المعادلة خطوة بخطوة'}
              </div>
            </div>
          </div>
          <Link
            to="/services"
            className="min-h-[42px] px-5 py-2.5 bg-[#002d74] hover:bg-[#0a2240] text-white font-bold font-cairo text-xs sm:text-sm rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>{currentLang === 'tr' ? 'Hizmet Detayları' : currentLang === 'en' ? 'View Services' : 'تفاصيل الخدمات'}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// 6) ÜNİVERSİTELER — STUDYFANS 1:1 EXACT ("اكتشف أفضل الجامعات حول العالم")
export function HomeUniversitiesSection() {
  const { currentLang } = useSiteText();
  const [activeTab, setActiveTab] = useState('PRIVATE');
  const [showAll, setShowAll] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['studyfans-home-unis', activeTab, currentLang],
    queryFn: () => {
      return api.getUniversities({
        type: activeTab,
        limit: 8,
        lang: currentLang,
        sortBy: 'ranking',
      });
    },
  });

  const universities = data?.data || [];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMobileIndex(0);
    setShowAll(false);
  };

  return (
    <section className="py-14 sm:py-20 bg-[#fafafa] text-[#0a2240] border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-[#0051FF] text-xs font-bold uppercase tracking-wider block mb-1 font-cairo">
            {currentLang === 'tr' ? 'Üniversiteler' : currentLang === 'en' ? 'Universities' : 'الجامعات'}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0a2240]">
            {activeTab === 'PRIVATE'
              ? currentLang === 'tr' ? "Türkiye'deki Vakıf (Özel) Üniversiteler" : currentLang === 'en' ? 'Private Universities in Turkey' : 'الجامعات الخاصة في تركيا'
              : currentLang === 'tr' ? "Türkiye'deki Devlet Üniversiteleri" : currentLang === 'en' ? 'State Universities in Turkey' : 'الجامعات الحكومية في تركيا'}
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-2 font-cairo">
            {currentLang === 'tr'
              ? 'Akredite devlet ve vakıf üniversitelerini inceleyin'
              : currentLang === 'en'
              ? 'Explore top accredited public and private universities'
              : 'تصفح قائمة الجامعات المعتمدة دولياً للبكالوريوس والماجستير والدكتوراه'}
          </p>

          {/* Sadece Özel veya Devlet Seçimi — StudyFans 1:1 */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              type="button"
              onClick={() => handleTabChange('PRIVATE')}
              className={`min-h-[42px] px-6 py-2 rounded-full text-xs sm:text-sm font-bold font-cairo transition-all flex items-center gap-2 ${
                activeTab === 'PRIVATE'
                  ? 'bg-[#ff9015] text-white shadow-md shadow-orange-500/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>🏢</span>
              <span>{currentLang === 'tr' ? 'Vakıf (Özel) Üniversiteler' : currentLang === 'en' ? 'Private Universities' : 'الجامعات الخاصة'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('PUBLIC')}
              className={`min-h-[42px] px-6 py-2 rounded-full text-xs sm:text-sm font-bold font-cairo transition-all flex items-center gap-2 ${
                activeTab === 'PUBLIC'
                  ? 'bg-[#002d74] text-white shadow-md shadow-[#002d74]/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <span>🏛️</span>
              <span>{currentLang === 'tr' ? 'Devlet Üniversiteleri' : currentLang === 'en' ? 'Public Universities' : 'الجامعات الحكومية'}</span>
            </button>
          </div>
        </div>

        {/* University Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : universities.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-cairo text-sm">
            {currentLang === 'tr' ? 'Bu kategoride üniversite bulunamadı.' : currentLang === 'en' ? 'No universities found in this category.' : 'لا توجد جامعات متاحة في هذا التصنيف حالياً'}
          </div>
        ) : (
          <div>
            {/* Mobile View: Stepper with Previous / Next */}
            <div className="block sm:hidden">
              {!showAll ? (
                <div>
                  <div className="max-w-md mx-auto">
                    {universities[mobileIndex] && (
                      <UniversityCard university={universities[mobileIndex]} />
                    )}
                  </div>

                  {universities.length > 1 && (
                    <div className="flex items-center justify-between mt-3 px-2 text-xs font-bold font-cairo text-slate-700">
                      <button
                        type="button"
                        onClick={() => setMobileIndex((prev) => (prev - 1 + universities.length) % universities.length)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <ChevronRight className="w-4 h-4" />
                        <span>السابق</span>
                      </button>

                      <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-[#ff9015] font-bold">
                        {mobileIndex + 1} / {universities.length}
                      </span>

                      <button
                        type="button"
                        onClick={() => setMobileIndex((prev) => (prev + 1) % universities.length)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <span>التالي</span>
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5">
                  {universities.map((uni) => (
                    <UniversityCard key={uni.id || uni.slug} university={uni} />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop View: Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(showAll ? universities : universities.slice(0, 4)).map((uni) => (
                <UniversityCard key={uni.id || uni.slug} university={uni} />
              ))}
            </div>

            {/* Show More / Less */}
            {universities.length > 1 && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="min-h-[46px] px-7 py-2.5 rounded-full bg-white hover:bg-slate-50 active:scale-95 text-[#0a2240] font-extrabold font-cairo text-xs sm:text-sm border border-slate-200 shadow-sm flex items-center gap-2 transition-all"
                >
                  {showAll ? (
                    <>
                      <span>{currentLang === 'tr' ? 'Daha Az Göster' : currentLang === 'en' ? 'Show Less' : 'إظهار أقل'}</span>
                      <ChevronUp className="w-4 h-4 text-[#ff9015]" />
                    </>
                  ) : (
                    <>
                      <span>{currentLang === 'tr' ? `Tüm Üniversiteleri Göster (${universities.length - 1}+)` : currentLang === 'en' ? `Show Remaining (${universities.length - 1}+)` : `عرض باقي الجامعات (${universities.length - 1}+)`}</span>
                      <ChevronDown className="w-4 h-4 text-[#ff9015]" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* View All Universities Button — StudyFans */}
        <div className="mt-10 flex justify-center">
          <Link
            to={activeTab === 'PUBLIC' ? '/universities?type=PUBLIC' : '/universities?type=PRIVATE'}
            className="min-h-[48px] px-8 py-3 rounded-xl bg-blue-100 hover:bg-[#0051FF] text-[#0051FF] hover:text-white font-bold font-cairo text-sm transition-colors flex items-center gap-2 shadow-xs"
          >
            <span>{currentLang === 'tr' ? 'Tüm Üniversiteleri Görüntüle' : currentLang === 'en' ? 'View All Universities' : 'عرض كل الجامعات'}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// 7) BÖLÜMLER — STUDYFANS 1:1 EXACT ("اعرف المزيد عن أهم التخصصات")
export function HomeMajorsSection() {
  const { currentLang } = useSiteText();
  const navigate = useNavigate();

  const majors = [
    {
      title: currentLang === 'tr' ? 'Mühendislik' : currentLang === 'en' ? 'Engineering' : 'هندسة',
      img: '/uploads/universities/istanbul-teknik-universitesi.webp',
      search: 'هندسة',
    },
    {
      title: currentLang === 'tr' ? 'Diş Hekimliği' : currentLang === 'en' ? 'Dentistry' : 'طب الأسنان',
      img: '/uploads/universities/istanbul-medipol-university.webp',
      search: 'طب أسنان',
    },
    {
      title: currentLang === 'tr' ? 'Tıp' : currentLang === 'en' ? 'Medicine' : 'طب بشري',
      img: '/uploads/universities/hacettepe-universitesi.webp',
      search: 'طب بشري',
    },
    {
      title: currentLang === 'tr' ? 'Eczacılık' : currentLang === 'en' ? 'Pharmacy' : 'صيدلة',
      img: '/uploads/universities/biruni-university.webp',
      search: 'صيدلة',
    },
    {
      title: currentLang === 'tr' ? 'İşletme' : currentLang === 'en' ? 'Business' : 'إدارة أعمال',
      img: '/uploads/universities/bilkent-university.webp',
      search: 'إدارة أعمال',
    },
    {
      title: currentLang === 'tr' ? 'Yapay Zeka' : currentLang === 'en' ? 'AI' : 'الذكاء الاصطناعي',
      img: '/uploads/universities/sabanci-university.webp',
      search: 'ذكاء اصطناعي',
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
          <div>
            <span className="text-[#0051FF] text-xs font-bold uppercase tracking-wider block mb-1 font-cairo">
              {currentLang === 'tr' ? 'Bölümler' : currentLang === 'en' ? 'Majors' : 'التخصصات'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0a2240]">
              {currentLang === 'tr' ? 'En Popüler Bölümler Hakkında Bilgi Alın' : currentLang === 'en' ? 'Learn More About Top Majors' : 'اعرف المزيد عن أهم التخصصات'}
            </h2>
          </div>

          <Link
            to="/programs"
            className="min-h-[42px] inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-100 hover:bg-[#0051FF] text-[#0051FF] hover:text-white font-bold font-cairo text-xs sm:text-sm transition-colors shrink-0"
          >
            <span>{currentLang === 'tr' ? 'Tümünü Gör' : currentLang === 'en' ? 'View All' : 'عرض الكل'}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {majors.map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => navigate(`/programs?search=${encodeURIComponent(m.search)}`)}
              className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all text-start cursor-pointer border border-slate-100 block w-full"
            >
              <img
                src={m.img}
                alt={m.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 end-3 sm:bottom-4 sm:end-4 z-10">
                <span className="text-base sm:text-lg font-black font-cairo text-white drop-shadow-md">
                  {m.title}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// 8) MAKALELER & BLOG — STUDYFANS 1:1 EXACT (1 BÜYÜK + 3 YATAY KART DÜZENİ)
// "أحدث المقالات عن الدراسة حول العالم"
export function HomeArticlesSection() {
  const { currentLang } = useSiteText();

  const { data, isLoading } = useQuery({
    queryKey: ['studyfans-home-articles', currentLang],
    queryFn: () => api.getArticles({ limit: 4, lang: currentLang }),
  });

  const articles = data?.data || [];

  const defaultArticles = [
    {
      id: '1',
      slug: 'tus-exam-turkey',
      title: 'ماهو اختبار TUS في الطب البشري في تركيا؟',
      excerpt: 'تفاصيل اختبار ال TUS الذي يقوم به طالب الطب البشري ليتخصص في دراسته العليا ويصبح ممارسًا داخل تركيا.',
      author: 'أماني نبيل',
      date: '2026-10-27',
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      slug: 'complete-medicine-study',
      title: 'كيف يمكن استكمال دراسة الطب في تركيا؟',
      excerpt: 'تعرف على كيفية استكمال دراسة الطب في تركيا بالتفصيل، بما في ذلك أفضل الجامعات الحكومية والخاصة وشروط القبول.',
      author: 'آية عنبر',
      date: '2026-10-26',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      slug: 'get-admission-turkey',
      title: 'كيف تحصل على قبول جامعي في تركيا؟',
      excerpt: 'دليل شامل لمتطلبات التسجيل والالتزام بالإجراءات الخاصة بالجامعات التركية.',
      author: 'مازن صافي',
      date: '2026-10-26',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=80',
    },
    {
      id: '4',
      slug: 'cheap-engineering-universities',
      title: 'أرخص الجامعات لدراسة الهندسة بتركيا 2026',
      excerpt: 'الدليل الشامل لأرخص التخصصات الهندسية المعتمدة في الجامعات التركية للطلاب الدوليين.',
      author: 'د. أحمد نسيم',
      date: '2026-10-26',
      imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
    },
  ];

  const items = articles.length >= 4 ? articles : defaultArticles;
  const mainArticle = items[0];
  const sideArticles = items.slice(1, 4);

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#0051FF] font-bold text-xs uppercase tracking-wider block mb-1 font-cairo">
              {currentLang === 'tr' ? 'Makalelerimiz' : currentLang === 'en' ? 'Our Blog' : 'مقالاتنا'}
            </span>
            <h2 className="text-xl md:text-2xl xl:text-3xl font-extrabold text-[#0a2240] font-cairo">
              {currentLang === 'tr' ? 'Yurtdışı Eğitim Hakkında En Son Makaleler' : currentLang === 'en' ? 'Latest Articles on Studying Abroad' : 'أحدث المقالات عن الدراسة حول العالم'}
            </h2>
          </div>

          <Link
            to="/blog"
            className="min-h-[42px] inline-flex items-center gap-2 px-6 py-2.5 bg-blue-100 hover:bg-[#0051FF] text-[#0051FF] hover:text-white rounded-lg font-medium transition-colors shrink-0"
          >
            <span>{currentLang === 'tr' ? 'Tüm Makaleler' : currentLang === 'en' ? 'All Articles' : 'جميع المقالات'}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>

        {/* StudyFans 1 Featured Left + 3 Right Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Featured Article (Left) */}
          <Link
            to={`/blog/${mainArticle.slug || mainArticle.id}`}
            className="w-full lg:w-1/2 flex flex-col gap-3 rounded-2xl bg-white border border-slate-200/90 p-4 sm:p-5 hover:shadow-lg transition-shadow group"
          >
            <div className="w-full h-56 sm:h-72 overflow-hidden rounded-xl bg-slate-100">
              <img
                src={mainArticle.coverImageUrl || mainArticle.imageUrl}
                alt={mainArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                loading="lazy"
              />
            </div>
            <div className="flex flex-col gap-3 mt-2">
              <h3 className="text-lg sm:text-2xl font-bold text-[#0a2240] font-cairo group-hover:text-[#ff9015] transition-colors line-clamp-2">
                {mainArticle.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed font-cairo">
                {mainArticle.excerpt || mainArticle.description}
              </p>
              <div className="flex gap-2 text-xs items-center text-slate-500 pt-2 border-t border-slate-100">
                <span className="font-bold text-[#0a2240]">{mainArticle.author || 'Study Advisor'}</span>
                <span>•</span>
                <span>{mainArticle.date || '2026-10-27'}</span>
              </div>
            </div>
          </Link>

          {/* 3 Smaller Horizontal Articles (Right) */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 justify-between">
            {sideArticles.map((art, idx) => (
              <Link
                key={idx}
                to={`/blog/${art.slug || art.id}`}
                className="flex flex-col sm:flex-row gap-4 items-center rounded-2xl bg-white border border-slate-200/90 p-3 sm:p-4 hover:shadow-md transition-shadow group h-full"
              >
                <div className="w-full sm:w-40 h-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                  <img
                    src={art.coverImageUrl || art.imageUrl}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-xl"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-bold text-[#0a2240] font-cairo group-hover:text-[#ff9015] transition-colors line-clamp-2 mb-1.5">
                    {art.title}
                  </h4>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed font-cairo mb-2">
                    {art.excerpt || art.description}
                  </p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">{art.author || 'Advisor'}</span>
                    <span>•</span>
                    <span>{art.date || '2026-10-26'}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// 9) FINAL CTA — STUDYFANS 1:1 EXACT ("احصل على قبولك الجامعي مجانا")
export function HomeFinalCtaSection() {
  const { currentLang } = useSiteText();

  return (
    <section className="bg-[#002d74] text-white py-14 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Metin & Buton Alanı */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 text-start">
            <h2 className="text-2xl md:text-4xl font-extrabold font-cairo leading-snug sm:leading-[1.3] text-white">
              {currentLang === 'tr' ? 'Üniversite Kabulünüzü Ücretsiz Alın' : currentLang === 'en' ? 'Get Your University Admission for Free' : 'احصل على قبولك الجامعي مجانا'}
            </h2>

            <p className="text-blue-100 text-xs sm:text-base leading-relaxed font-cairo max-w-lg">
              {currentLang === 'tr'
                ? 'Zengin kültürel geleneklerin üstün eğitim ve geniş kariyer fırsatlarıyla buluştuğu yurtdışı eğitim dünyasını keşfetmeye hazır olun.'
                : currentLang === 'en'
                ? 'Get ready to discover a new world of higher education abroad where rich culture meets world-class academics.'
                : 'استعد لاكتشاف عالم جديد من التعليم في الخارج حيث تجتمع التقاليد الثقافية الغنية بالتعليم المتميز والفرص الواسعة'}
            </p>

            <div className="pt-2">
              <Link
                to="/apply"
                className="inline-block bg-white hover:bg-slate-100 text-[#0a2240] font-bold font-cairo py-3.5 px-8 rounded-xl transition duration-300 shadow-md text-sm sm:text-base"
              >
                {currentLang === 'tr' ? 'Kabulünüzü Şimdi Alın' : currentLang === 'en' ? 'Get Your Admission Now' : 'احصل على قبولك الآن'}
              </Link>
            </div>
          </div>

          {/* Sağ Görsel & Rozetler — StudyFans Exact */}
          <div className="w-full md:w-1/2 flex justify-center items-center relative">
            <div className="relative w-72 sm:w-80 h-72 sm:h-80 flex items-center justify-center">
              {/* Arka plan daire */}
              <div className="absolute inset-4 rounded-full bg-blue-300/20 blur-xl pointer-events-none" />

              {/* Öğrenci görseli */}
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80"
                alt="Student"
                className="w-56 h-56 sm:w-64 sm:h-64 object-cover rounded-2xl shadow-2xl border-4 border-white z-10"
                loading="lazy"
              />

              {/* Rozet 1: 500+ */}
              <div className="absolute -top-2 start-2 bg-white text-[#0a2240] px-3.5 py-1.5 rounded-xl shadow-lg z-20 text-xs font-bold font-cairo border border-slate-100">
                <span className="text-[#ff9015] font-black">500+</span> طالب مسجل
              </div>

              {/* Rozet 2: 10000+ */}
              <div className="absolute -bottom-2 end-2 bg-orange-500 text-white px-3.5 py-1.5 rounded-xl shadow-lg z-20 text-xs font-bold font-cairo">
                <span className="font-black">10000+</span> استشارة مجانية
              </div>

              {/* Rozet 3: تواصل معنا */}
              <div className="absolute bottom-6 start-0 bg-white/95 backdrop-blur-md text-[#0a2240] px-3 py-1 rounded-xl shadow-md z-20 text-[11px] font-bold font-cairo flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>تواصل معنا لنجيب على جميع استفساراتك</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// 10) SİTEMİZE ÖZEL ALAN 1: KISMİ BURSLAR (%70'E VARAN İNDİRİMLER)
export function HomeScholarshipsSection() {
  const { currentLang } = useSiteText();

  const { data } = useQuery({
    queryKey: ['home-scholarships-section', currentLang],
    queryFn: () => api.getScholarships({ limit: 3, lang: currentLang }),
  });

  const scholarships = data?.data || [];
  if (scholarships.length === 0) return null;

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-[#ff9015] text-xs font-bold uppercase tracking-wider block mb-1 font-cairo">
              🏷️ {currentLang === 'tr' ? 'Burslar ve İndirimler' : currentLang === 'en' ? 'Scholarships & Discounts' : 'المنح الجزئية والخصومات'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0a2240]">
              {currentLang === 'tr' ? '%70\'e Varan Kısmi Burslar ve Özel Kontenjanlar' : currentLang === 'en' ? 'Partial Scholarships Up to 70%' : 'المنح الجزئية وخصومات تصل حتى 70%'}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl font-cairo">
              {currentLang === 'tr' ? 'Anlaşmalı vakıf üniversitelerinde özel indirimli eğitim fırsatları' : currentLang === 'en' ? 'Exclusive tuition fee discounts in partner universities' : 'خصومات حصرية على الأقساط الدراسية السنوية في أفضل الجامعات الخاصة'}
            </p>
          </div>

          <Link
            to="/scholarships"
            className="min-h-[42px] inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-50 border border-orange-200/60 text-[#ff9015] hover:bg-orange-100 font-bold font-cairo text-xs sm:text-sm transition-colors shrink-0"
          >
            <span>{currentLang === 'tr' ? 'Tüm Bursları İncele' : currentLang === 'en' ? 'View Scholarships' : 'عرض كافة المنح'}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scholarships.map((sch) => {
            const tr = sch.translations?.find((t) => t.lang === currentLang) || sch.translations?.[0] || {};
            const title = tr.title || sch.slug;
            const desc = tr.description || '';
            const discount = sch.discountPercentage || 50;

            return (
              <div
                key={sch.id || sch.slug}
                className="bg-[#fafafa] rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:shadow-lg transition-shadow group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-[#ff9015] font-black text-xs">
                      خصم {discount}%
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {sch.scholarshipType === 'FULL' ? 'منحة كاملة' : 'منحة جزئية'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-[#0a2240] group-hover:text-[#ff9015] transition-colors mb-2 font-cairo">
                    {title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm line-clamp-3 leading-relaxed font-cairo">
                    {desc}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-200/80 flex items-center justify-between">
                  <div className="text-xs text-slate-500 font-cairo">
                    <span>متاح للتقديم الآن</span>
                  </div>
                  <Link
                    to="/apply"
                    className="px-4 py-2 bg-[#ff9015] hover:bg-[#f36c25] text-white text-xs font-bold rounded-lg transition-colors font-cairo"
                  >
                    قدّم على المنحة
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// 11) SİTEMİZE ÖZEL ALAN 2: ÖĞRENCİ YORUMLARI & BAŞARI HİKAYELERİ (ULTRA-PREMIUM)
export function HomeTestimonialsSection() {
  const { currentLang } = useSiteText();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Modal Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewCountry, setReviewCountry] = useState('');
  const [reviewUni, setReviewUni] = useState('');
  const [reviewProgram, setReviewProgram] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const { data } = useQuery({
    queryKey: ['home-testimonials-section'],
    queryFn: () => api.getTestimonials(),
  });

  const dbTestimonials = data?.data || [];

  const defaultTestimonials = [
    {
      id: '1',
      studentName: 'أحمد السامرائي',
      nationality: 'العراق 🇮🇶',
      program: 'الطب البشري',
      category: 'MEDICINE',
      university: 'جامعة إسطنبول ميدي بول',
      rating: 5,
      year: 'دفعة 2024 / 2025',
      verified: true,
      quoteAr: 'تجربتي مع الفريق كانت نقطة تحول حقيقية. حصلت على القبول المبدئي في كلية الطب خلال 48 ساعة فقط وبخصم استثنائي 50%، واستقبلوني من المطار وساعدوني في حجز السكن الجامعي والإقامة خطوة بخطوة بكل مصداقية.',
      quoteTr: 'Sora Education sayesinde Medipol Üniversitesi Tıp Fakültesi kabulümü 48 saatte aldım. Havalimanından karşılamaya, yurda yerleştirmeden ikamet işlemlerine kadar her aşamada yanımdaydılar.',
      quoteEn: 'My journey was transformative. I received my conditional medical acceptance at Medipol within 48 hours with an exclusive 50% scholarship discount, and their team handled my airport transfer, dorm, and residence permit seamlessly.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      studentName: 'سارة خالد الشمري',
      nationality: 'السعودية 🇸🇦',
      program: 'طب الأسنان',
      category: 'MEDICINE',
      university: 'جامعة بهتشه شهير',
      rating: 5,
      year: 'دفعة 2024 / 2025',
      verified: true,
      quoteAr: 'وفروا لي خصماً ممتازاً على الرسوم الدراسية ورافقوني خطوة بخطوة حتى وصولي لإسطنبol. فريق عمل محترف، لم أشعر بالغربة أبداً وكانت نصائحهم الأكاديمية دقيقة ومخلصة.',
      quoteTr: 'Bahçeşehir Üniversitesi Diş Hekimliği için bana çok avantajlı bir harç indirimi sağladılar ve İstanbul’a varışımıza kadar her adımda rehberlik ettiler. Destekleri için minnettarım!',
      quoteEn: 'They secured an outstanding tuition fee discount for Dentistry at Bahçeşehir University and guided me step by step until my arrival in Istanbul. Extremely professional and dependable.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      studentName: 'محمد التميمي',
      nationality: 'الأردن 🇯🇴',
      program: 'هندسة البرمجيات والذكاء الاصطناعي',
      category: 'ENGINEERING',
      university: 'جامعة إسطنبول أيدن',
      rating: 5,
      year: 'دفعة 2025 / 2026',
      verified: true,
      quoteAr: 'الفريق محترف جداً ويشرح لك الخيارات الأكاديمية بكل مصداقية وشفافية بدون أي وعود وهمية. بفضلهم حصلت على قبول متميز في هندسة البرمجيات ومنحة دراسية جزئية معتمدة دولياً.',
      quoteTr: 'Yazılım ve Yapay Zeka Mühendisliği bölümüne şeffaf ve güvenilir bir danışmanlıkla kabul edildim. Süreç boyunca gösterdikleri ilgi gerçekten olağanüstüydü.',
      quoteEn: 'Extremely professional team that presents transparent facts without exaggerated promises. Thanks to them, I secured verified admission in Software Engineering with an accredited scholarship.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: '4',
      studentName: 'ليلى بن علي',
      nationality: 'المغرب 🇲🇦',
      program: 'إدارة الأعمال الدولية',
      category: 'BUSINESS',
      university: 'جامعة كوتش',
      rating: 5,
      year: 'دفعة 2024 / 2025',
      verified: true,
      quoteAr: 'متابعة ممتازة من المستشار التعليمي حتى بعد التسجيل في الجامعة. ساعدوني في فتح الحساب البنكي، بطاقة المواصلات، ومعادلة الشهادة الثانوية بسلاسة تامة وبدون أي عناء.',
      quoteTr: 'Koç Üniversitesi Uluslararası İşletme bölümüne kabulümden sonra bile banka hesabı, ulaşım kartı ve lise denklik işlemlerimde kesintisiz destek sağladılar.',
      quoteEn: 'Outstanding follow-up from the academic advisor even after university registration. They helped me with bank accounts, transit cards, and high school equivalency effortlessly.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: '5',
      studentName: 'عمر باوزير',
      nationality: 'اليمن 🇾🇪',
      program: 'هندسة العمارة والتصميم',
      category: 'ENGINEERING',
      university: 'جامعة سابانجي',
      rating: 5,
      year: 'دفعة 2025 / 2026',
      verified: true,
      quoteAr: 'أفضل شركة استشارات تعليمية في إسطنبول بلا منازع. قدموا لي كل التسهيلات وتابعوا أوراق الفيزا الدراسية ومعادلة الشهادة بدقة مذهلة دون أي تعقيد أو تكاليف إضافية.',
      quoteTr: 'İstanbul’daki en güvenilir eğitim danışmanlığı şirketi. Vize ve denklik süreçlerimi sıfır karmaşayla ve ek ücret olmadan eksiksiz tamamladılar.',
      quoteEn: 'Without question, the most dependable educational consulting firm in Istanbul. Flawless student visa processing and equivalency guidance with zero hassle.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: '6',
      studentName: 'يوسف الدوسري',
      nationality: 'الكويت 🇰🇼',
      program: 'ماجستير إدارة المستشفيات',
      category: 'GRADUATE',
      university: 'جامعة بيلكنت',
      rating: 5,
      year: 'دفعة 2024 / 2025',
      verified: true,
      quoteAr: 'كنت أبحث عن برنامج ماجستير معتمد دولياً باللغة الإنجليزية، وخلال أيام رتبوا لي المقابلة الأكاديمية والقبول الرسمي مع تخفيض خاص للرسوم الدراسية. خدمة راقية بكل المعايير.',
      quoteTr: 'İngilizce eğitim veren prestijli bir yüksek lisans programı arıyordum. Birkaç gün içinde akademik mülakatımı ve harç indirimli kabulümü organize ettiler.',
      quoteEn: 'I was looking for an internationally accredited master’s degree in English. Within days they arranged my academic interview and official acceptance with a special tuition discount.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    },
  ];

  const allItems = dbTestimonials.length > 0 ? dbTestimonials : defaultTestimonials;

  // Filter based on selected category
  const filteredItems = allItems.filter((item) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'MEDICINE') {
      return (
        item.category === 'MEDICINE' ||
        (item.program && (item.program.includes('طب') || item.program.includes('صيدلة') || item.program.includes('أسنان') || item.program.includes('Tıp') || item.program.includes('Medicine')))
      );
    }
    if (activeCategory === 'ENGINEERING') {
      return (
        item.category === 'ENGINEERING' ||
        (item.program && (item.program.includes('هندسة') || item.program.includes('ذكاء') || item.program.includes('حاسوب') || item.program.includes('Mühendislik') || item.program.includes('Engineering')))
      );
    }
    if (activeCategory === 'BUSINESS') {
      return (
        item.category === 'BUSINESS' ||
        (item.program && (item.program.includes('إدارة') || item.program.includes('أعمال') || item.program.includes('İşletme') || item.program.includes('Business')))
      );
    }
    if (activeCategory === 'GRADUATE') {
      return (
        item.category === 'GRADUATE' ||
        (item.program && (item.program.includes('ماجستير') || item.program.includes('دكتوراه') || item.program.includes('Yüksek') || item.program.includes('Master')))
      );
    }
    return true;
  });

  const items = filteredItems.length > 0 ? filteredItems : allItems;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setCurrentIndex(0);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsModalOpen(false);
      setReviewName('');
      setReviewCountry('');
      setReviewUni('');
      setReviewProgram('');
      setReviewComment('');
    }, 2000);
  };

  // Get 3 visible items on desktop based on currentIndex
  const visibleDesktopItems = [
    items[currentIndex % items.length],
    items[(currentIndex + 1) % items.length],
    items[(currentIndex + 2) % items.length],
  ].filter(Boolean);

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white via-slate-50/70 to-white border-b border-slate-100 relative overflow-hidden">
      {/* Background soft glowing blur accents */}
      <div className="absolute top-1/4 start-0 -ms-24 w-80 h-80 rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 end-0 -me-24 w-80 h-80 rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="text-start max-w-2xl">
            {/* Top Badge with Star & Rating */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 shadow-xs mb-3.5">
              <div className="flex items-center text-[#ff9015]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#ff9015]" />
                ))}
              </div>
              <span className="text-xs font-black font-cairo text-[#0a2240]">
                4.9 / 5.0
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs font-bold font-cairo text-[#ff6b00]">
                {currentLang === 'tr' ? '1.200+ Doğrulanmış Öğrenci Yorumu' : currentLang === 'en' ? '1,200+ Verified Student Reviews' : 'أكثر من 1,200+ تقييم موثق'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo text-[#0a2240] leading-tight sm:leading-[1.25]">
              {currentLang === 'tr' ? (
                <>
                  Öğrencilerimizin <span className="text-[#ff9015]">Başarı Hikayeleri</span> ve Deneyimleri
                </>
              ) : currentLang === 'en' ? (
                <>
                  Student <span className="text-[#ff9015]">Success Stories</span> & Verified Reviews
                </>
              ) : (
                <>
                  قصص نجاح وتجارب <span className="text-[#ff9015]">طلابنا في الجامعات</span>
                </>
              )}
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm mt-2.5 font-cairo leading-relaxed">
              {currentLang === 'tr'
                ? "Binlerce uluslararası öğrenci Türkiye'deki üniversite hayalini bizimle gerçeğe dönüştürdü. İşte onların ilk elden gerçek deneyimleri."
                : currentLang === 'en'
                ? 'Thousands of international students turned their study abroad dream into reality with us. Read their genuine first-hand experiences.'
                : 'آلاف الطلاب من مختلف الدول العربية وثقوا بخبرتنا لبدء دراستهم الجامعية في تركيا. إليك تجاربهم الحقيقية بكل شفافية.'}
            </p>
          </div>

          {/* Action Buttons: Add Review + Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100/80 text-[#ff6b00] border border-orange-200 font-bold font-cairo text-xs sm:text-sm transition-all shadow-xs active:scale-95"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{currentLang === 'tr' ? 'Deneyimini Paylaş' : currentLang === 'en' ? 'Share Your Experience' : 'شاركنا تجربتك'}</span>
            </button>

            {/* Slider Navigation Arrows (Desktop) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous Review"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#0a2240] hover:bg-[#ff9015] hover:text-white hover:border-[#ff9015] flex items-center justify-center transition-all shadow-xs active:scale-90"
              >
                <ChevronRight className="w-5 h-5 rtl:rotate-0 rotate-180" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next Review"
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#0a2240] hover:bg-[#ff9015] hover:text-white hover:border-[#ff9015] flex items-center justify-center transition-all shadow-xs active:scale-90"
              >
                <ChevronLeft className="w-5 h-5 rtl:rotate-0 rotate-180" />
              </button>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategorySelect('ALL')}
            className={`min-h-[38px] px-4 py-2 rounded-full text-xs font-bold font-cairo whitespace-nowrap transition-all ${
              activeCategory === 'ALL'
                ? 'bg-[#0a2240] text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            🌟 {currentLang === 'tr' ? 'Tüm Yorumlar' : currentLang === 'en' ? 'All Reviews' : 'جميع الآراء'}
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('MEDICINE')}
            className={`min-h-[38px] px-4 py-2 rounded-full text-xs font-bold font-cairo whitespace-nowrap transition-all ${
              activeCategory === 'MEDICINE'
                ? 'bg-[#0a2240] text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            🩺 {currentLang === 'tr' ? 'Tıp ve Diş Hekimliği' : currentLang === 'en' ? 'Medicine & Dentistry' : 'الطب البشري وطب الأسنان'}
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('ENGINEERING')}
            className={`min-h-[38px] px-4 py-2 rounded-full text-xs font-bold font-cairo whitespace-nowrap transition-all ${
              activeCategory === 'ENGINEERING'
                ? 'bg-[#0a2240] text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            💻 {currentLang === 'tr' ? 'Mühendislik ve Teknoloji' : currentLang === 'en' ? 'Engineering & IT' : 'الهندسة والتكنولوجيا'}
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('BUSINESS')}
            className={`min-h-[38px] px-4 py-2 rounded-full text-xs font-bold font-cairo whitespace-nowrap transition-all ${
              activeCategory === 'BUSINESS'
                ? 'bg-[#0a2240] text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            💼 {currentLang === 'tr' ? 'İşletme ve İktisat' : currentLang === 'en' ? 'Business & Management' : 'إدارة الأعمال'}
          </button>
          <button
            type="button"
            onClick={() => handleCategorySelect('GRADUATE')}
            className={`min-h-[38px] px-4 py-2 rounded-full text-xs font-bold font-cairo whitespace-nowrap transition-all ${
              activeCategory === 'GRADUATE'
                ? 'bg-[#0a2240] text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            🎓 {currentLang === 'tr' ? 'Yüksek Lisans & Doktora' : currentLang === 'en' ? 'Master & PhD' : 'الدراسات العليا'}
          </button>
        </div>

        {/* REVIEWS DISPLAY */}
        <div>
          {/* MOBILE VIEW: Single Interactive Stepper Card */}
          <div className="block sm:hidden">
            {items[currentIndex % items.length] && (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-lg relative flex flex-col justify-between overflow-hidden">
                {/* Background Watermark Quote */}
                <Quote className="w-16 h-16 text-orange-500/10 absolute top-4 end-4 pointer-events-none" />

                <div>
                  {/* Top Row: Stars + Verified Badge */}
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-1 text-[#ff9015]">
                      {[...Array(items[currentIndex % items.length].rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#ff9015]" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold font-cairo">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>قبول موثق</span>
                    </span>
                  </div>

                  {/* University & Major Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3.5 relative z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#002d74] text-xs font-bold font-cairo">
                      <Building2 className="w-3 h-3 text-[#ff9015]" />
                      <span>{items[currentIndex % items.length].university}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[#ff6b00] text-xs font-bold font-cairo">
                      <GraduationCap className="w-3 h-3 text-[#ff6b00]" />
                      <span>{items[currentIndex % items.length].program}</span>
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-slate-700 text-sm leading-relaxed mb-6 font-cairo font-medium relative z-10">
                    "{currentLang === 'tr'
                      ? items[currentIndex % items.length].quoteTr || items[currentIndex % items.length].quote
                      : currentLang === 'en'
                      ? items[currentIndex % items.length].quoteEn || items[currentIndex % items.length].quote
                      : items[currentIndex % items.length].quoteAr || items[currentIndex % items.length].quote || items[currentIndex % items.length].quoteTr}"
                  </p>
                </div>

                {/* Student Info Footer */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 relative z-10">
                  <div className="relative">
                    <img
                      src={items[currentIndex % items.length].avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={items[currentIndex % items.length].studentName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-orange-400/40 shadow-xs"
                      loading="lazy"
                    />
                    <div className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 text-start">
                    <h4 className="text-sm font-extrabold text-[#0a2240] font-cairo truncate">
                      {items[currentIndex % items.length].studentName}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold font-cairo truncate">
                      {items[currentIndex % items.length].nationality || 'طالب دولي'}
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-400 font-cairo">
                    {items[currentIndex % items.length].year || '2025/2026'}
                  </span>
                </div>
              </div>
            )}

            {/* Mobile Controls Stepper */}
            <div className="flex items-center justify-between mt-4 px-2">
              <button
                type="button"
                onClick={handlePrev}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold font-cairo text-[#0a2240] flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <ChevronRight className="w-4 h-4 rtl:rotate-0 rotate-180" />
                <span>السابق</span>
              </button>

              <div className="flex items-center gap-1">
                {items.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      i === currentIndex % items.length ? 'w-6 bg-[#ff9015]' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold font-cairo text-[#0a2240] flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4 rtl:rotate-0 rotate-180" />
              </button>
            </div>
          </div>

          {/* DESKTOP VIEW: 3 Slick Cards Grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleDesktopItems.map((item, idx) => {
              const quote =
                currentLang === 'tr'
                  ? item.quoteTr || item.quote
                  : currentLang === 'en'
                  ? item.quoteEn || item.quote
                  : item.quoteAr || item.quote || item.quoteTr;

              return (
                <div
                  key={`${item.id || idx}-${currentIndex}`}
                  className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
                >
                  {/* Decorative Background Quote */}
                  <Quote className="w-20 h-20 text-orange-500/10 absolute top-4 end-4 group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

                  <div>
                    {/* Top Row: Stars + Verified Badge */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="flex items-center gap-1 text-[#ff9015]">
                        {[...Array(item.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#ff9015]" />
                        ))}
                      </div>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-cairo">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>قبول موثق 100%</span>
                      </span>
                    </div>

                    {/* University & Program Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3.5 relative z-10">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#002d74] text-xs font-bold font-cairo">
                        <Building2 className="w-3 h-3 text-[#ff9015]" />
                        <span>{item.university}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[#ff6b00] text-xs font-bold font-cairo">
                        <GraduationCap className="w-3 h-3 text-[#ff6b00]" />
                        <span>{item.program}</span>
                      </span>
                    </div>

                    {/* Review Quote */}
                    <p className="text-slate-700 text-sm leading-relaxed mb-6 font-cairo font-medium relative z-10 min-h-[90px]">
                      "{quote}"
                    </p>
                  </div>

                  {/* Student Profile Info */}
                  <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 relative z-10">
                    <div className="relative">
                      <img
                        src={item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                        alt={item.studentName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-[#ff9015]/40 shadow-xs group-hover:border-[#ff9015] transition-colors"
                        loading="lazy"
                      />
                      <div className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 text-start">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-extrabold text-[#0a2240] font-cairo truncate">
                          {item.studentName}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-500 font-bold font-cairo truncate">
                        {item.nationality || 'طالب جامعي'}
                      </p>
                    </div>

                    <div className="text-end">
                      <span className="text-[11px] text-slate-400 font-cairo block">
                        {item.year || '2025/2026'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM TRUST STATS STRIP */}
        <div className="mt-12 sm:mt-16 bg-[#0a2240] rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full md:w-3/4 text-center sm:text-start">
            {/* Stat 1 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#ff9015] shrink-0 border border-white/10">
                <Star className="w-6 h-6 fill-[#ff9015]" />
              </div>
              <div>
                <div className="text-lg font-black font-cairo text-white">4.9 / 5.0 ⭐</div>
                <div className="text-xs text-blue-200/80 font-cairo">
                  {currentLang === 'tr' ? 'Google & Trustpilot Puanı' : currentLang === 'en' ? 'Google & Trustpilot Rating' : 'تقييم رضا الطلاب والخدمة'}
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#ff9015] shrink-0 border border-white/10">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-lg font-black font-cairo text-white">100% موثق</div>
                <div className="text-xs text-blue-200/80 font-cairo">
                  {currentLang === 'tr' ? 'Resmi Üniversite Kabulü' : currentLang === 'en' ? 'Verified University Admissions' : 'قبولات نظامية رسمية معتمدة'}
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#ff9015] shrink-0 border border-white/10">
                <Globe className="w-6 h-6 text-[#ff9015]" />
              </div>
              <div>
                <div className="text-lg font-black font-cairo text-white">+25 دولة</div>
                <div className="text-xs text-blue-200/80 font-cairo">
                  {currentLang === 'tr' ? 'Farklı Ülkelerden Öğrenciler' : currentLang === 'en' ? 'Diverse International Students' : 'طلابنا من مختلف أنحاء العالم'}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto shrink-0 flex justify-center">
            <Link
              to="/apply"
              className="w-full sm:w-auto min-h-[46px] px-7 py-3 rounded-xl bg-[#ff9015] hover:bg-[#f36c25] text-white font-bold font-cairo text-sm text-center transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{currentLang === 'tr' ? 'Ücretsiz Danışmanlık Al' : currentLang === 'en' ? 'Get Free Consultation' : 'ابدأ رحلتك الجامعية الآن'}</span>
              <ArrowRight className="w-4 h-4 flip-in-rtl" />
            </Link>
          </div>
        </div>

      </div>

      {/* INTERACTIVE REVIEW SUBMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 end-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#0a2240] font-cairo mb-2">
                  {currentLang === 'tr' ? 'Teşekkür Ederiz!' : currentLang === 'en' ? 'Thank You!' : 'شكراً جزيلاً لك!'}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm font-cairo">
                  {currentLang === 'tr'
                    ? 'Değerli yorumunuz başarıyla alındı ve onaylandıktan sonra yayınlanacaktır.'
                    : currentLang === 'en'
                    ? 'Your valuable review was received and will be published upon review.'
                    : 'تم استلام تقييمك ورأيك القيّم بنجاح، وسيظهر بعد المراجعة المباشرة.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-5 text-start">
                  <span className="text-xs font-bold text-[#ff9015] uppercase tracking-wider block font-cairo mb-1">
                    ✍️ {currentLang === 'tr' ? 'Öğrenci Yorumu' : currentLang === 'en' ? 'Student Review' : 'شارك تجربتك معنا'}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#0a2240] font-cairo">
                    {currentLang === 'tr' ? 'Deneyiminizi ve Tavsiyelerinizi Paylaşın' : currentLang === 'en' ? 'Share Your Experience & Advice' : 'أخبرنا عن تجربتك في الدراسة والتقديم'}
                  </h3>
                </div>

                {/* Rating Stars Selector */}
                <div className="mb-4 text-start">
                  <label className="block text-xs font-bold text-slate-700 font-cairo mb-1.5">
                    {currentLang === 'tr' ? 'Puanınız:' : currentLang === 'en' ? 'Your Rating:' : 'تقييمك العام للخدمة:'}
                  </label>
                  <div className="flex items-center gap-1.5 text-[#ff9015]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewRating ? 'fill-[#ff9015]' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-black text-slate-700 ms-2 font-cairo">
                      {reviewRating} / 5
                    </span>
                  </div>
                </div>

                {/* Name & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-cairo mb-1">
                      {currentLang === 'tr' ? 'Adınız Soyadınız' : currentLang === 'en' ? 'Full Name' : 'الاسم الكامل'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="مثال: أحمد السعيد"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-[#ff9015]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-cairo mb-1">
                      {currentLang === 'tr' ? 'Ülkeniz' : currentLang === 'en' ? 'Country' : 'بلدك / جنسيتك'}
                    </label>
                    <input
                      type="text"
                      value={reviewCountry}
                      onChange={(e) => setReviewCountry(e.target.value)}
                      placeholder="مثال: السعودية 🇸🇦"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-[#ff9015]"
                    />
                  </div>
                </div>

                {/* University & Program */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-cairo mb-1">
                      {currentLang === 'tr' ? 'Üniversiteniz' : currentLang === 'en' ? 'University' : 'الجامعة'}
                    </label>
                    <input
                      type="text"
                      value={reviewUni}
                      onChange={(e) => setReviewUni(e.target.value)}
                      placeholder="مثال: جامعة إسطنبول أيدن"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-[#ff9015]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 font-cairo mb-1">
                      {currentLang === 'tr' ? 'Bölümünüz' : currentLang === 'en' ? 'Program' : 'التخصص'}
                    </label>
                    <input
                      type="text"
                      value={reviewProgram}
                      onChange={(e) => setReviewProgram(e.target.value)}
                      placeholder="مثال: هندسة البرمجيات"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-[#ff9015]"
                    />
                  </div>
                </div>

                {/* Written Review */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-slate-700 font-cairo mb-1">
                    {currentLang === 'tr' ? 'Yorumunuz & Tavsiyeleriniz' : currentLang === 'en' ? 'Your Review & Advice' : 'رأيك وتجربتك بالتفصيل'} *
                  </label>
                  <textarea
                    required
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="اكتب عن سرعة القبول، الاستقبال، السكن، أو تعاملك مع المستشار..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-[#ff9015] resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#ff9015] hover:bg-[#f36c25] text-white font-bold font-cairo text-sm transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{currentLang === 'tr' ? 'Yorumu Gönder' : currentLang === 'en' ? 'Submit Review' : 'إرسال التقييم'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}


// 12) SİTEMİZE ÖZEL ALAN 3: LİSANSÜSTÜ (YÜKSEK LİSANS VE DOKTORA) EĞİTİMİ
export function HomeGraduateSection() {
  const { currentLang } = useSiteText();
  const navigate = useNavigate();

  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#0a2240] to-[#002d74] rounded-3xl p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="absolute top-0 end-0 -mt-8 -me-8 w-64 h-64 rounded-full bg-[#ff9015]/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="w-full lg:w-2/3 text-start">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#ff9015] font-bold text-xs mb-3 font-cairo">
                🎓 {currentLang === 'tr' ? 'Lisansüstü Eğitim' : currentLang === 'en' ? 'Graduate Studies' : 'الدراسات العليا في تركيا'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo leading-snug mb-3">
                {currentLang === 'tr'
                  ? 'Tezli / Tezsiz Yüksek Lisans ve Doktora Kabulü'
                  : currentLang === 'en'
                  ? 'Master & PhD Admissions with Scholarship Opportunities'
                  : 'برامج الماجستير والدكتوراه بفرص قبول استثنائية'}
              </h2>
              <p className="text-blue-100/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-cairo mb-6">
                {currentLang === 'tr'
                  ? 'İngilizce veya Türkçe eğitim seçenekleri, tezli ve tezsiz programlar, sınav şartsız doğrudan kabul fırsatları ile kariyerinizi bir üst seviyeye taşıyın.'
                  : currentLang === 'en'
                  ? 'Advance your career with English and Turkish taught programs, thesis and non-thesis tracks, and direct admissions without complex testing.'
                  : 'برامج باللغة الإنجليزية أو التركية، ماجستير بأطروحة وبدون أطروحة، ودكتوراه في كبرى الجامعات التركية المعتمدة عالمياً.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl">
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="text-base sm:text-lg font-bold text-[#ff9015] font-cairo">100+</div>
                  <div className="text-xs text-white/80 font-cairo">برنامج ماجستير</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="text-base sm:text-lg font-bold text-[#ff9015] font-cairo">50+</div>
                  <div className="text-xs text-white/80 font-cairo">تخصص دكتوراه</div>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-white/10 rounded-xl p-3 border border-white/10">
                  <div className="text-base sm:text-lg font-bold text-[#ff9015] font-cairo">100%</div>
                  <div className="text-xs text-white/80 font-cairo">دعم القبول والفيزا</div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/3 flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <Link
                to="/programs?degree=MASTER_WITH_THESIS"
                className="w-full py-3.5 px-6 rounded-xl bg-[#ff9015] hover:bg-[#f36c25] text-white font-bold font-cairo text-sm text-center shadow-md transition-colors"
              >
                {currentLang === 'tr' ? 'Yüksek Lisans Programları' : currentLang === 'en' ? 'Master Programs' : 'برامج الماجستير'}
              </Link>
              <Link
                to="/programs?degree=PHD"
                className="w-full py-3.5 px-6 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 font-bold font-cairo text-sm text-center transition-colors"
              >
                {currentLang === 'tr' ? 'Doktora Programları' : currentLang === 'en' ? 'PhD Programs' : 'برامج الدكتوراه'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
