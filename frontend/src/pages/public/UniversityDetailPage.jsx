import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Award,
  Globe,
  Building,
  Calendar,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Home,
  FileCheck,
  Search,
  Sparkles,
  Video,
  Play,
  Clock,
  DollarSign,
  FileText,
  HelpCircle,
  MessageSquare,
  BadgeCheck,
  VideoOff,
  GraduationCap,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import UniversityCard from '../../components/common/UniversityCard';
import ApplicationStatusBadge from '../../components/common/ApplicationStatusBadge';
import UniversityVideoPlayer from '../../components/common/UniversityVideoPlayer';
import UniversityReviewsSection from '../../components/common/UniversityReviewsSection';
import NotaryTranslationEquivalencySection from '../../components/common/NotaryTranslationEquivalencySection';
import UniversityDepartmentsPanel from '../../components/common/UniversityDepartmentsPanel';
import PricingPolicyNotice from '../../components/common/PricingPolicyNotice';
import FAQAccordion from '../../components/common/FAQAccordion';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const [progSearch, setProgSearch] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['university', slug, currentLang],
    queryFn: () => api.getUniversityBySlug(slug, currentLang),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-96 rounded-3xl bg-slate-200"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-3xl"></div>
          <div className="h-96 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-cairo">
          {currentLang === 'ar'
            ? 'لم يتم العثور على الجامعة المطلوبة'
            : currentLang === 'tr'
            ? 'İstenen Üniversite Bulunamadı'
            : 'University Not Found'}
        </h2>
        <p className="text-slate-500 text-sm">
          {error?.message ||
            (currentLang === 'ar'
              ? 'تأكد من صحة الرابط أو تصفح قائمة الجامعات المعتمدة.'
              : 'Lütfen bağlantıyı kontrol edin veya üniversiteler listesine göz atın.')}
        </p>
        <Link
          to="/universities"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-amber-500 text-white font-bold text-sm shadow-md"
        >
          <span>{currentLang === 'ar' ? 'تصفح قائمة الجامعات' : 'Tüm Üniversiteler'}</span>
          <ArrowRight className="w-4 h-4 flip-in-rtl" />
        </Link>
      </div>
    );
  }

  const university = data.data;
  const related = data.related || [];

  const translation =
    university.translations?.find((tr) => tr.lang === currentLang) ||
    university.translations?.find((tr) => tr.lang === 'ar') ||
    university.translations?.[0] ||
    {};

  const name = translation.name || university.slug;
  const overview = translation.overview || '';
  const admissionReqs = translation.admissionRequirements || '';
  const accommodation = translation.accommodationInfo || '';
  const accreditation = translation.accreditationInfo || '';
  const address = translation.address || `${university.city}, Turkey`;
  const isPrivate = university.type === 'PRIVATE';

  // Section visibility controls from admin
  const showPrograms = university.showProgramsSection !== false;
  const showNotary = university.showNotarySection !== false;
  const showFaq = university.showFaqSection !== false;
  const showReviews = university.showReviewsSection !== false;

  // Filter programs in this university
  const filteredPrograms = (university.programs || []).filter((prog) => {
    const pTrans =
      prog.translations?.find((t) => t.lang === currentLang) ||
      prog.translations?.find((t) => t.lang === 'ar') ||
      prog.translations?.[0] ||
      {};
    const pName = (pTrans.name || prog.slug).toLowerCase();
    const matchesSearch = !progSearch || pName.includes(progSearch.toLowerCase());
    const matchesDegree = !selectedDegree || prog.degreeLevel === selectedDegree;
    return matchesSearch && matchesDegree;
  });

  const formatDegreeLevel = (level) => {
    if (!level) return '';
    const keyMap = {
      BACHELOR: 'degrees.bachelor',
      MASTER_WITH_THESIS: 'degrees.masterWithThesis',
      MASTER_WITHOUT_THESIS: 'degrees.masterNonThesis',
      PHD: 'degrees.phd',
      ASSOCIATE: 'degrees.associate',
    };
    const key = keyMap[level];
    if (key) {
      const val = t(key);
      if (val && val !== key) return val;
    }
    if (level === 'BACHELOR') return currentLang === 'ar' ? 'بكالوريوس' : currentLang === 'tr' ? 'Lisans' : 'Bachelor';
    if (level === 'MASTER_WITH_THESIS') return currentLang === 'ar' ? 'ماجستير بأطروحة' : currentLang === 'tr' ? 'Tezli Yüksek Lisans' : 'Master with Thesis';
    if (level === 'MASTER_WITHOUT_THESIS') return currentLang === 'ar' ? 'ماجستير بدون أطروحة' : currentLang === 'tr' ? 'Tezsiz Yüksek Lisans' : 'Non-Thesis Master';
    if (level === 'PHD') return currentLang === 'ar' ? 'دكتوراه' : currentLang === 'tr' ? 'Doktora' : 'PhD';
    if (level === 'ASSOCIATE') return currentLang === 'ar' ? 'دبلوم عامين' : currentLang === 'tr' ? 'Ön Lisans' : 'Associate Degree';
    return level;
  };

  const formatStudyLanguage = (lang) => {
    if (!lang) return '';
    const keyMap = {
      ENGLISH: 'studyLangs.english',
      TURKISH: 'studyLangs.turkish',
      MIXED: 'studyLangs.mixed',
    };
    const key = keyMap[lang];
    if (key) {
      const val = t(key);
      if (val && val !== key) return val;
    }
    if (lang === 'ENGLISH') return currentLang === 'ar' ? 'الإنجليزية' : currentLang === 'tr' ? 'İngilizce' : 'English';
    if (lang === 'TURKISH') return currentLang === 'ar' ? 'التركية' : currentLang === 'tr' ? 'Türkçe' : 'Turkish';
    if (lang === 'MIXED') return currentLang === 'ar' ? 'مختلط (تركي/إنجليزي)' : currentLang === 'tr' ? 'Karma (%30 İngilizce)' : 'Mixed';
    return lang;
  };

  // Default university FAQs if none custom
  const defaultFaqs = [
    {
      question:
        currentLang === 'ar'
          ? `ما هي لغة الدراسة المعتمدة في ${name}؟`
          : currentLang === 'tr'
          ? `${name} bünyesinde eğitim dili nedir?`
          : `What is the medium of instruction at ${name}?`,
      answer:
        currentLang === 'ar'
          ? `تتوفر البرامج في ${name} باللغتين التركية والإنجليزية بحسب التخصص المختار. كما تقدم الجامعة سنة تحضيرية لتعلم اللغة قبل بدء التخصص الأكاديمي.`
          : currentLang === 'tr'
          ? `Bölüme bağlı olarak Türkçe ve İngilizce eğitim seçenekleri sunulmaktadır. Ayrıca yabancı öğrenciler için hazırlık dil okulu mevcuttur.`
          : `Programs are offered in Turkish and English depending on the department, with an intensive preparatory language year available.`,
    },
    {
      question:
        currentLang === 'ar'
          ? `هل شهادة ${name} معترف بها دولياً وفي الدول العربية؟`
          : currentLang === 'tr'
          ? `${name} diploması uluslararası alanda ve YÖK nezdinde tanınıyor mu?`
          : `Is the diploma from ${name} internationally recognized?`,
      answer:
        currentLang === 'ar'
          ? `نعم، الجامعة معتمدة رسمياً من مجلس التعليم العالي التركي (YÖK) وتخضع لنظام بولونيا الأوروبي (ECTS)، مما يتيح معادلتها في مختلف الدول العربية والأوروبية.`
          : currentLang === 'tr'
          ? `Evet, üniversite YÖK onaylıdır ve Bologna Süreci (AKTS) çerçevesinde uluslararası denkliğe sahiptir.`
          : `Yes, the university is fully accredited by YÖK and participates in the European Bologna Process (ECTS).`,
    },
    {
      question:
        currentLang === 'ar'
          ? 'كيف تتم إجراءات التقديم والقبول الجامعي؟'
          : currentLang === 'tr'
          ? 'Başvuru ve resmî kabul süreci nasıl işler?'
          : 'How does the university application and admission process work?',
      answer:
        currentLang === 'ar'
          ? 'يقوم مستشارونا بمراجعة أوراقك والتأكد من استيفاء الشروط الأكاديمية وتقديم ملفك بشكل رسمي ومباشر للجامعة ومتابعة صدور خطاب القبول النهائي خطوة بخطوة.'
          : currentLang === 'tr'
          ? 'Uzman eğitim danışmanlarımız evraklarınızı titizlikle inceler, akademik şartları kontrol eder ve resmî kabul mektubunuz onaylanana kadar tüm süreci doğrudan takip eder.'
          : 'Our academic advisors review your documents, verify requirements, and directly track your official university application until your final acceptance is issued.',
    },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* =========================================================
          SECTION 1: UNIVERSITY INTRODUCTION AND IDENTITY
          ========================================================= */}
      <section className="relative bg-brand-navy-950 text-white pt-12 pb-16">
        <div className="absolute inset-0 opacity-25">
          <img
            src={
              university.coverImageUrl ||
              `/uploads/universities/${university.slug}.webp`
            }
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/uploads/universities/istanbul-universitesi.webp';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/85 to-transparent"></div>
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-brand-navy-950/80 to-transparent pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold">
            <Link to="/" className="hover:text-white transition-colors">
              {t('nav.home')}
            </Link>
            <span>/</span>
            <Link to="/universities" className="hover:text-white transition-colors">
              {t('nav.universities')}
            </Link>
            <span>/</span>
            <span className="text-brand-amber-400 truncate max-w-xs">{name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 shadow-2xl border-2 border-white/80 shrink-0 overflow-hidden">
                <img
                  src={
                    university.logoUrl && !university.logoUrl.includes('unsplash')
                      ? university.logoUrl
                      : (university.coverImageUrl || `/uploads/universities/${university.slug}.webp`)
                  }
                  alt={name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.src = '/uploads/universities/istanbul-universitesi.webp';
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      isPrivate
                        ? 'bg-brand-amber-500 text-white'
                        : 'bg-brand-navy-800 text-brand-amber-300 border border-brand-amber-400/30'
                    }`}
                  >
                    {isPrivate
                      ? t('universities.private')
                      : currentLang === 'ar'
                      ? '🏛️ جامعة حكومية تركية'
                      : currentLang === 'tr'
                      ? '🏛️ Türk Devlet Üniversitesi'
                      : '🏛️ Turkish State University'}
                  </span>

                  <ApplicationStatusBadge
                    status={university.admissionStatus || 'UNCONFIRMED'}
                    deadline={university.admissionDeadline}
                    statusNote={university.statusNote}
                    size="md"
                  />

                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-cairo text-white leading-tight">
                  {name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-amber-400" />
                    <span>{university.city}</span>
                  </span>
                  {university.establishedYear && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-amber-400" />
                      <span>
                        {currentLang === 'ar'
                          ? `تأسست عام ${university.establishedYear}`
                          : `Kuruluş: ${university.establishedYear}`}
                      </span>
                    </span>
                  )}
                  {university.websiteUrl && (
                    <a
                      href={university.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-brand-amber-400 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>
                        {currentLang === 'ar'
                          ? 'الموقع الرسمي للجامعة'
                          : currentLang === 'tr'
                          ? 'Resmi Üniversite Portalı'
                          : 'Official Website'}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Apply Header CTA */}
            <div className="shrink-0 pt-2 md:pt-0">
              <a
                href={`https://wa.me/905313971022?text=${encodeURIComponent(
                  `مرحباً شركة المجد للقبولات الجامعية، أرغب بالتقديم والحصول على قبول جامعي في (${name}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 btn-hover-lift transition-all w-full sm:w-auto"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
                </svg>
                <span>{t('universities.applyToUni')} عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* =========================================================
            SECTION 1.5: QUICK IDENTITY & SPECIFICATIONS BAR
            ========================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                {currentLang === 'ar' ? 'المدينة والولاية' : currentLang === 'tr' ? 'Bulunduğu Şehir' : 'City & Location'}
              </span>
              <strong className="text-xs sm:text-sm font-bold text-brand-navy-950 font-cairo flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-brand-amber-500 shrink-0" />
                <span>{university.city || 'Türkiye'}</span>
              </strong>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                {currentLang === 'ar' ? 'سنة التأسيس' : currentLang === 'tr' ? 'Kuruluş Yılı' : 'Established Year'}
              </span>
              <strong className="text-xs sm:text-sm font-bold text-brand-navy-950 font-cairo flex items-center gap-1.5 mt-1">
                <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{university.establishedYear ? `${university.establishedYear}` : (currentLang === 'ar' ? 'تاريخي معتمد' : currentLang === 'tr' ? 'Köklü Üniversite' : 'Established')}</span>
              </strong>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                {currentLang === 'ar' ? 'نوع الجامعة' : currentLang === 'tr' ? 'Üniversite Türü' : 'University Type'}
              </span>
              <strong className="text-xs sm:text-sm font-bold text-brand-navy-950 font-cairo flex items-center gap-1.5 mt-1">
                <Building className="w-4 h-4 text-purple-500 shrink-0" />
                <span>{isPrivate ? (currentLang === 'ar' ? 'جامعة خاصة' : currentLang === 'tr' ? 'Vakıf Üniversitesi' : 'Private') : (currentLang === 'ar' ? 'جامعة حكومية' : currentLang === 'tr' ? 'Devlet Üniversitesi' : 'Public')}</span>
              </strong>
            </div>


            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                {currentLang === 'ar' ? 'الدراسات العليا' : currentLang === 'tr' ? 'Lisansüstü Kabul' : 'Graduate Degrees'}
              </span>
              <strong className="text-xs sm:text-sm font-bold text-brand-navy-950 font-cairo flex items-center gap-1.5 mt-1">
                <GraduationCap className="w-4 h-4 text-brand-amber-500 shrink-0" />
                <span>{university.graduateAdmissionOpen ? (currentLang === 'ar' ? 'متاح ومفتوح' : currentLang === 'tr' ? 'Kayıtlar Açık' : 'Active') : (currentLang === 'ar' ? 'قريباً' : currentLang === 'tr' ? 'Dönemsel' : 'Seasonal')}</span>
              </strong>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                {currentLang === 'ar' ? 'الموقع الرسمي' : currentLang === 'tr' ? 'Resmi Web Portalı' : 'Official Portal'}
              </span>
              {university.websiteUrl ? (
                <a
                  href={university.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-bold text-brand-amber-600 hover:underline flex items-center gap-1.5 mt-1 truncate"
                >
                  <Globe className="w-4 h-4 shrink-0" />
                  <span className="truncate">{university.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
                </a>
              ) : (
                <span className="text-xs text-slate-500 mt-1 block">YÖK Onaylı</span>
              )}
            </div>
          </div>
        </section>
        {/* =========================================================
            SECTION 2: UNIVERSITY INTRODUCTION VIDEO (Only shown when admin has added a video)
            ========================================================= */}
        {university.videoUrl && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="mb-4">
              <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block mb-1">
                {currentLang === 'ar' ? 'فيديو تعريفي رسمي' : currentLang === 'tr' ? 'Resmi Tanıtım Videosu' : 'Official Introduction Video'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <Video className="w-6 h-6 text-brand-amber-500" />
                <span>
                  {university.videoTitle ||
                    (currentLang === 'ar'
                      ? `جولة مصورة في مرافق وحرم ${name}`
                      : `${name} Kampüs ve Tesisler Tanıtımı`)}
                </span>
              </h2>
            </div>

            <UniversityVideoPlayer
              videoUrl={university.videoUrl}
              thumbnailUrl={university.videoThumbnailUrl || university.coverImageUrl}
              title={university.videoTitle || name}
              description={university.videoDescription}
              autoPlay={false}
            />
          </section>
        )}

        {/* =========================================================
            SECTION 3: OVERVIEW AND GENERAL INFORMATION
            ========================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
            <Building className="w-6 h-6 text-brand-amber-500" />
            <span>{t('uniDetailPage.overviewTitle')}</span>
          </h2>

          <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {overview || (
              <p className="text-slate-400 italic">
                {t('uniDetailPage.overviewUpdating')}
              </p>
            )}
          </div>

          {/* Accreditation Box */}
          {accreditation && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 space-y-2">
              <h3 className="text-base font-bold text-emerald-950 font-cairo flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{t('universities.accreditation')}</span>
              </h3>
              <p className="text-emerald-900 text-sm leading-relaxed">{accreditation}</p>
            </div>
          )}

          {/* Accommodation Box */}
          {accommodation && (
            <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-5 space-y-2">
              <h3 className="text-base font-bold text-blue-950 font-cairo flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                <span>{t('universities.accommodation')}</span>
              </h3>
              <p className="text-blue-900 text-sm leading-relaxed">{accommodation}</p>
            </div>
          )}

          {/* Gallery Images (If verified) */}
          {university.galleryImages && (
            <div className="pt-4 border-t border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-3">
                {t('uniDetailPage.galleryTitle')}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(typeof university.galleryImages === 'string'
                  ? university.galleryImages.split(',').map((s) => s.trim()).filter(Boolean)
                  : Array.isArray(university.galleryImages)
                  ? university.galleryImages
                  : []
                ).map((imgUrl, i) => (
                  <a
                    key={i}
                    href={imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-video rounded-xl overflow-hidden border border-slate-200 block bg-slate-100 group"
                  >
                    <img
                      src={imgUrl}
                      alt={`${name} ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* =========================================================
            SECTION 3.5: DEPARTMENT COUNT & BEST DEPARTMENTS (admin verisi)
            ========================================================= */}
        <UniversityDepartmentsPanel university={university} currentLang={currentLang} universityName={name} />

        {/* =========================================================
            SECTION 4: FACULTIES, DEPARTMENTS, AND AVAILABLE PROGRAMS
            ========================================================= */}
        {showPrograms && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-brand-amber-500" />
                  <span>
                    {t('universities.faculties')} ({university.departmentCount || filteredPrograms.length})
                  </span>
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  {t('uniDetailPage.programsTableTitle')}
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500"
                >
                  <option value="">{t('search.allDegrees')}</option>
                  <option value="BACHELOR">{currentLang === 'ar' ? 'بكالوريوس' : currentLang === 'tr' ? 'Lisans' : 'Bachelor'}</option>
                  <option value="MASTER_WITH_THESIS">{currentLang === 'ar' ? 'ماجستير بأطروحة' : currentLang === 'tr' ? 'Tezli Yüksek Lisans' : 'Master with Thesis'}</option>
                  <option value="MASTER_WITHOUT_THESIS">{currentLang === 'ar' ? 'ماجستير بدون أطروحة' : currentLang === 'tr' ? 'Tezsiz Yüksek Lisans' : 'Non-Thesis Master'}</option>
                  <option value="PHD">{currentLang === 'ar' ? 'دكتوراه' : currentLang === 'tr' ? 'Doktora' : 'PhD'}</option>
                  <option value="ASSOCIATE">{currentLang === 'ar' ? 'دبلوم عامين' : currentLang === 'tr' ? 'Ön Lisans' : 'Associate Degree'}</option>
                </select>

                <div className="relative w-44">
                  <input
                    type="text"
                    value={progSearch}
                    onChange={(e) => setProgSearch(e.target.value)}
                    placeholder={t('uniDetailPage.searchMajorPlaceholder')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-amber-500 pe-7"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Programs Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-start text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-start">
                    <th className="p-4 text-start">{t('uniDetailPage.thMajor')}</th>
                    <th className="p-4 text-start">{t('uniDetailPage.thDegreeLang')}</th>
                    <th className="p-4 text-start">{t('uniDetailPage.thDuration')}</th>
                    <th className="p-4 text-center">{t('uniDetailPage.thApply')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPrograms.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-400 space-y-2">
                        <div>{t('uniDetailPage.noProgramsMatch')}</div>
                        {university.departmentCount ? (
                          <div className="text-xs text-slate-500">
                            {currentLang === 'ar'
                              ? `تضم الجامعة ${university.departmentCount} قسماً للبكالوريوس. للاطلاع على القائمة المحدثة يرجى زيارة الموقع الرسمي.`
                              : currentLang === 'tr'
                              ? `Üniversitede ${university.departmentCount} lisans bölümü bulunuyor. Güncel liste için resmî siteyi ziyaret edin.`
                              : `The university offers ${university.departmentCount} undergraduate departments. Visit the official site for the current list.`}
                            {university.departmentSourceUrl && (
                              <>
                                {' '}
                                <a
                                  href={university.departmentSourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-brand-amber-600 hover:underline font-bold inline-flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {currentLang === 'ar' ? 'الموقع الرسمي' : currentLang === 'tr' ? 'Resmî site' : 'Official site'}
                                </a>
                              </>
                            )}
                          </div>
                        ) : null}
                      </td>
                    </tr>
                  ) : (
                    filteredPrograms.map((prog) => {
                      const pt =
                        prog.translations?.find((t) => t.lang === currentLang) ||
                        prog.translations?.find((t) => t.lang === 'ar') ||
                        prog.translations?.[0] ||
                        {};
                      const pName = pt.name || prog.slug;
                      const faculty = pt.facultyName || '';

                      return (
                        <tr key={prog.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 font-semibold text-slate-900">
                            <div className="font-bold text-brand-navy-950 font-cairo text-sm">
                              {pName}
                            </div>
                            {faculty && (
                              <div className="text-[11px] text-slate-500">{faculty}</div>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">
                              {formatDegreeLevel(prog.degreeLevel)}
                            </div>
                            <div className="text-[11px] text-brand-amber-600 font-bold">
                              {formatStudyLanguage(prog.studyLanguage)}
                            </div>
                          </td>
                          <td className="p-4 text-slate-600 font-medium">
                            {prog.durationYears} {currentLang === 'ar' ? 'سنوات' : currentLang === 'tr' ? 'Yıl' : 'Years'}
                          </td>
                          <td className="p-4 text-center">
                            <a
                              href={`https://wa.me/905313971022?text=${encodeURIComponent(
                                `مرحباً شركة المجد للقبولات الجامعية، أرغب بالتقديم على تخصص (${pName}) في جامعة (${name}).`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition-colors shadow-sm"
                            >
                              <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
                                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
                              </svg>
                              <span>{t('nav.applyNow')}</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* =========================================================
            SECTION 5: ADMISSION REQUIREMENTS AND APPLICATION DEADLINES
            ========================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-brand-amber-500" />
                <span>{t('uniDetailPage.admissionReqsTitle')}</span>
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                {t('uniDetailPage.admissionReqsSubtitle')}
              </p>
            </div>

            {university.admissionDeadline && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                <Calendar className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {t('uniDetailPage.deadlineLabel')}{' '}
                  <strong>{university.admissionDeadline}</strong>
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-sm text-brand-navy-950 font-cairo flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-brand-amber-500" />
                <span>{t('universities.admissionReqs')}</span>
              </h3>
              <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                {admissionReqs || t('uniDetailPage.bachelorGeneralReqs')}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="font-bold text-sm text-brand-navy-950 font-cairo flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-amber-500" />
                <span>{t('uniDetailPage.intakeDatesTitle')}</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-2">
                <li className="flex items-center justify-between">
                  <span>{t('uniDetailPage.fallTerm')}</span>
                  <span className="font-bold text-slate-900">
                    {university.admissionStartDate
                      ? new Date(university.admissionStartDate).toLocaleDateString()
                      : t('uniDetailPage.fallDates')}
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span>{t('uniDetailPage.springTerm')}</span>
                  <span className="font-bold text-slate-900">
                    {t('uniDetailPage.springDates')}
                  </span>
                </li>
                {university.announcementText && (
                  <li className="text-[11px] text-brand-amber-800 bg-amber-100/70 p-2 rounded-lg font-medium mt-2">
                    📢 {university.announcementText}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 6: APPLICATION STATUS AND OFFICIAL APPLICATION LINK
            ========================================================= */}
        <section className="bg-gradient-to-br from-brand-navy-950 to-brand-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-brand-amber-500/30 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-brand-amber-400 uppercase tracking-wider">
                  {t('uniDetailPage.officialStatusTitle')}
                </span>
                <ApplicationStatusBadge
                  status={university.admissionStatus || 'UNCONFIRMED'}
                  deadline={university.admissionDeadline}
                  size="md"
                />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-cairo text-white">
                {t('uniDetailPage.applyForUniTitle', { name })}
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t('uniDetailPage.advisoryText')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              {university.officialApplicationUrl && (
                <a
                  href={university.officialApplicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all text-center"
                >
                  <Globe className="w-4 h-4 text-brand-amber-400" />
                  <span>{t('uniDetailPage.officialPortalBtn')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <a
                href={`https://wa.me/905313971022?text=${encodeURIComponent(
                  `مرحباً شركة المجد للقبولات الجامعية، أرغب بالتقديم والحصول على قبول رسمي في جامعة (${name}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 btn-hover-lift transition-all text-center"
              >
                <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
                </svg>
                <span>{t('universities.applyToUni')} عبر واتساب</span>
              </a>
            </div>
          </div>

        </section>

        {/* =========================================================
            SECTION 7: REQUIRED DOCUMENTS AND APPLICATION GUIDANCE
            ========================================================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-amber-500" />
            <span>{t('uniDetailPage.docsGuidanceTitle')}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-brand-navy-950 font-cairo">
                {t('uniDetailPage.docsBachelorTitle')}
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('uniDetailPage.docHighSchoolCert')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('uniDetailPage.docTranscript')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('uniDetailPage.docPassport')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('uniDetailPage.docPhotos')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{t('uniDetailPage.docLanguageProficiency')}</span>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-sm text-brand-navy-950 font-cairo">
                {t('uniDetailPage.docsGraduateTitle')}
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber-500 shrink-0 mt-0.5" />
                  <span>{t('uniDetailPage.docBachelorDegree')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber-500 shrink-0 mt-0.5" />
                  <span>{t('uniDetailPage.docRecommendation')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber-500 shrink-0 mt-0.5" />
                  <span>{t('uniDetailPage.docMotivation')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-amber-500 shrink-0 mt-0.5" />
                  <span>{t('uniDetailPage.docCv')}</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 9: FREQUENTLY ASKED QUESTIONS
            ========================================================= */}
        {showFaq && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-brand-amber-500" />
              <span>{t('uniDetailPage.faqUniTitle', { name })}</span>
            </h2>

            <FAQAccordion items={defaultFaqs} />
          </section>
        )}

        {/* =========================================================
            SECTION 10: STUDENT REVIEWS AND COMMENTS
            ========================================================= */}
        {showReviews && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <UniversityReviewsSection
              universitySlug={university.slug}
              universityName={name}
            />
          </section>
        )}

        {/* =========================================================
            SECTION 11: NOTARY, TRANSLATION, AND DIPLOMA EQUIVALENCY
            ========================================================= */}
        {showNotary && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <NotaryTranslationEquivalencySection />
          </section>
        )}

        {/* RELATED UNIVERSITIES */}
        {related.length > 0 && (
          <section className="pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-brand-navy-950 font-cairo mb-6">
              {t('uniDetailPage.otherUnisInCity', { city: university.city })}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((u) => (
                <UniversityCard key={u.id} university={u} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
