import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  GraduationCap,
  Globe,
  Play,
  ExternalLink,
  Calendar,
  Sparkles,
  Info,
  X,
  Eye,
  Send,
  Building,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ApplicationStatusBadge from './ApplicationStatusBadge';
import UniversityVideoPlayer from './UniversityVideoPlayer';

export default function UniversityCard({ university }) {
  const { t } = useTranslation();
  const { currentLang, isRtl } = useLanguage();
  const [showInfoModal, setShowInfoModal] = useState(false);

  const translation =
    university.translations?.find((tr) => tr.lang === currentLang) ||
    university.translations?.find((tr) => tr.lang === 'ar') ||
    university.translations?.[0] ||
    {};

  const name = translation.name || university.slug;
  const overview = translation.overview || '';
  const isPrivate = university.type === 'PRIVATE';

  return (
    <>
      {/* =========================================================
          MAIN UNIVERSITY CARD (INTERACTIVE & CLICKABLE)
          ========================================================= */}
      <div
        onClick={() => setShowInfoModal(true)}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-brand-amber-400 transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1.5 cursor-pointer relative"
      >
        {/* Cover Image Header */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
          <img
            src={
              university.coverImageUrl ||
              'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80'
            }
            alt={name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent"></div>

          {/* Top Badges Row */}
          <div className="absolute top-3 start-3 end-3 flex items-center justify-between gap-2 pointer-events-none z-10">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-md ${
                  isPrivate
                    ? 'bg-brand-amber-500 text-white'
                    : 'bg-brand-navy-900 text-brand-amber-300 border border-brand-amber-400/30'
                }`}
              >
                {isPrivate
                  ? t('universities.private')
                  : currentLang === 'ar'
                  ? '🏛️ جامعة حكومية'
                  : currentLang === 'tr'
                  ? '🏛️ Devlet Üniversitesi'
                  : '🏛️ State Uni'}
              </span>
            </div>

            <div className="pointer-events-auto" onClick={(e) => e.stopPropagation()}>
              <ApplicationStatusBadge
                status={university.admissionStatus || 'UNCONFIRMED'}
                deadline={university.admissionDeadline}
                statusNote={university.statusNote}
                size="sm"
              />
            </div>
          </div>

          {/* City & Established Year Badge */}
          <div className="absolute bottom-3 start-3 flex items-center gap-2 text-white text-xs font-semibold drop-shadow z-10 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-amber-400 shrink-0" />
              <span>{university.city}</span>
            </span>
            {university.establishedYear && (
              <span className="text-brand-amber-300 text-[11px] font-bold">
                • {currentLang === 'ar' ? 'تأسست' : currentLang === 'tr' ? 'Kuruluş' : 'Est.'} {university.establishedYear}
              </span>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between pt-4">
          <div>
            <h3 className="text-base font-bold text-brand-navy-950 font-cairo mb-2 group-hover:text-brand-amber-600 transition-colors line-clamp-1 leading-snug">
              {name}
            </h3>

            {/* Graduate Program Availability Tag */}
            {university.graduateAdmissionOpen && (
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg mb-2">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'ar'
                    ? 'ماجستير ودكتوراه متاح'
                    : currentLang === 'tr'
                    ? 'Yüksek Lisans Açık'
                    : 'Graduate Admissions Active'}
                </span>
              </div>
            )}

            {/* Announcement / Status Note */}
            {(university.announcementText || university.statusNote) && (
              <div className="text-[11px] text-brand-navy-900 bg-brand-amber-500/10 border border-brand-amber-500/20 px-2.5 py-1 rounded-lg line-clamp-1 mb-2 font-medium">
                📢 {university.announcementText || university.statusNote}
              </div>
            )}

            <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
              {overview || (
                currentLang === 'ar'
                  ? 'انقر على الكرت لعرض تفاصيل وشروط القبول الكاملة في الجامعة.'
                  : currentLang === 'tr'
                  ? 'Üniversite detayları ve kabul şartlarını görmek için tıklayın.'
                  : 'Click to view full admission criteria and university details.'
              )}
            </p>

            {/* Highlights / Programs Preview */}
            <div className="space-y-1.5 mb-4 border-t border-slate-100 pt-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-brand-amber-500" />
                  <span>{t('universities.programsAvailable')}:</span>
                </span>
                <span className="font-bold text-brand-navy-900">
                  {university._count?.programs || university.programs?.length || 24}
                </span>
              </div>


              {/* Official Website Link */}
              {university.websiteUrl && (
                <div className="flex items-center justify-between text-slate-600 pt-0.5">
                  <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>{currentLang === 'ar' ? 'الموقع الرسمي:' : currentLang === 'tr' ? 'Resmi Web:' : 'Official Web:'}</span>
                  </span>
                  <a
                    href={university.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-amber-600 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{university.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Details + Direct Apply CTA with Symbol */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowInfoModal(true);
              }}
              className="text-xs font-bold text-slate-700 hover:text-brand-amber-600 flex items-center gap-1.5 transition-colors py-1.5 px-3 rounded-xl hover:bg-brand-amber-50/50 border border-slate-200"
            >
              <Eye className="w-3.5 h-3.5 text-brand-amber-500" />
              <span>{currentLang === 'ar' ? 'عرض تفاصيل الجامعة' : currentLang === 'tr' ? 'Detayları Görüntüle' : 'View Details'}</span>
            </button>

            <Link
              to={`/apply?university=${encodeURIComponent(name)}`}
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white text-xs font-black shadow-md shadow-brand-amber-500/30 hover:scale-105 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>{currentLang === 'ar' ? 'قدّم طلبك الآن' : currentLang === 'tr' ? 'Başvuru Yap' : 'Apply Now'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          QUICK UNIVERSITY INFORMATION MODAL (WITH COMPLETE DETAILS)
          ========================================================= */}
      {showInfoModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 flex flex-col relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Banner */}
            <div className="relative h-48 w-full bg-slate-900 overflow-hidden shrink-0">
              <img
                src={university.coverImageUrl || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&auto=format&fit=crop&q=80'}
                alt={name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

              {/* Close Button */}
              <button
                onClick={() => setShowInfoModal(false)}
                className="absolute top-4 end-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition shadow-lg z-20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* University Badges */}
              <div className="absolute top-4 start-4 flex items-center gap-2 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                    isPrivate
                      ? 'bg-brand-amber-500 text-white'
                      : 'bg-brand-navy-900 text-brand-amber-300 border border-brand-amber-400/30'
                  }`}
                >
                  {isPrivate
                    ? t('universities.private')
                    : currentLang === 'ar'
                    ? '🏛️ جامعة حكومية معتمدة'
                    : currentLang === 'tr'
                    ? '🏛️ Akredite Devlet Üniversitesi'
                    : '🏛️ Accredited State University'}
                </span>

                <ApplicationStatusBadge
                  status={university.admissionStatus || 'UNCONFIRMED'}
                  deadline={university.admissionDeadline}
                  statusNote={university.statusNote}
                  size="sm"
                />
              </div>

              {/* University Name & Location Header */}
              <div className="absolute bottom-4 inset-x-5 flex items-center gap-3.5 text-white z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 text-brand-amber-400 shadow-xl">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black font-cairo drop-shadow-md">
                    {name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                    <span className="flex items-center gap-1 font-semibold text-brand-amber-300">
                      <MapPin className="w-3.5 h-3.5 text-brand-amber-400" />
                      <span>{university.city}, {currentLang === 'ar' ? 'تركيا' : currentLang === 'tr' ? 'Türkiye' : 'Turkey'}</span>
                    </span>
                    {university.establishedYear && (
                      <span className="font-semibold text-slate-200">
                        • {currentLang === 'ar' ? 'سنة التأسيس:' : currentLang === 'tr' ? 'Kuruluş:' : 'Est:'} {university.establishedYear}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 sm:p-8 space-y-6 flex-1 text-slate-700">
              {/* Detailed Key Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-start text-xs">
                {/* 1. Bulunduğu Şehir */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-amber-500/10 text-brand-amber-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block font-medium">
                      {currentLang === 'ar' ? 'المدينة والولاية' : currentLang === 'tr' ? 'Bulunduğu Şehir' : 'City & Location'}
                    </span>
                    <strong className="text-brand-navy-950 text-xs sm:text-sm font-bold font-cairo block mt-0.5">
                      {university.city || 'Türkiye'}
                    </strong>
                  </div>
                </div>

                {/* 2. Kuruluş Yılı */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block font-medium">
                      {currentLang === 'ar' ? 'سنة التأسيس' : currentLang === 'tr' ? 'Kuruluş Yılı' : 'Established Year'}
                    </span>
                    <strong className="text-brand-navy-950 text-xs sm:text-sm font-bold font-cairo block mt-0.5">
                      {university.establishedYear ? `${university.establishedYear}` : (currentLang === 'ar' ? 'تاريخي معتمد' : currentLang === 'tr' ? 'Köklü Üniversite' : 'Established')}
                    </strong>
                  </div>
                </div>

                {/* 3. Üniversite Türü */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block font-medium">
                      {currentLang === 'ar' ? 'نوع الجامعة' : currentLang === 'tr' ? 'Üniversite Statüsü' : 'University Type'}
                    </span>
                    <strong className="text-brand-navy-950 text-xs sm:text-sm font-bold font-cairo block mt-0.5">
                      {isPrivate
                        ? (currentLang === 'ar' ? 'جامعة خاصة (Vakıf)' : currentLang === 'tr' ? 'Vakıf Üniversitesi' : 'Foundation University')
                        : (currentLang === 'ar' ? 'جامعة حكومية (Devlet)' : currentLang === 'tr' ? 'Devlet Üniversitesi' : 'State University')}
                    </strong>
                  </div>
                </div>


                {/* 5. Lisansüstü Program Durumu */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block font-medium">
                      {currentLang === 'ar' ? 'الدراسات العليا' : currentLang === 'tr' ? 'Lisansüstü Kabulü' : 'Graduate Programs'}
                    </span>
                    <strong className="text-emerald-700 text-xs sm:text-sm font-bold font-cairo block mt-0.5">
                      {university.graduateAdmissionOpen
                        ? (currentLang === 'ar' ? 'ماجستير ودكتوراه متاح' : currentLang === 'tr' ? 'Yüksek Lisans Açık' : 'Admissions Open')
                        : (currentLang === 'ar' ? 'قريباً' : currentLang === 'tr' ? 'Dönemsel' : 'Seasonal')}
                    </strong>
                  </div>
                </div>

                {/* 6. Resmi Web Portalı */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-slate-400 text-[11px] block font-medium">
                      {currentLang === 'ar' ? 'الموقع الرسمي' : currentLang === 'tr' ? 'Resmi İnternet Sitesi' : 'Official Portal'}
                    </span>
                    {university.websiteUrl ? (
                      <a
                        href={university.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-amber-600 hover:underline font-bold text-xs truncate block mt-0.5"
                      >
                        {university.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      </a>
                    ) : (
                      <span className="text-slate-500 text-xs">YÖK Onaylı</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Announcement / Status Notice */}
              {(university.announcementText || university.statusNote) && (
                <div className="p-4 rounded-2xl bg-brand-amber-50 border border-brand-amber-500/30 text-brand-navy-950 flex items-start gap-2.5 text-xs">
                  <Sparkles className="w-4 h-4 text-brand-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold mb-0.5">
                      {currentLang === 'ar' ? 'إعلان قبول جامعي رسمي:' : currentLang === 'tr' ? 'Resmi Kabul & Duyuru Notu:' : 'Official Admission Notice:'}
                    </strong>
                    <span>{university.announcementText || university.statusNote}</span>
                  </div>
                </div>
              )}

              {/* Verified Video Player if available */}
              {university.videoUrl && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Play className="w-4 h-4 text-brand-amber-500" />
                    <span>
                      {currentLang === 'ar' ? 'فيديو تعريفي رسمي للحرم والمرافق:' : currentLang === 'tr' ? 'Resmi Kampüs Tanıtım Videosu:' : 'Official Campus Tour Video:'}
                    </span>
                  </span>
                  <UniversityVideoPlayer
                    videoUrl={university.videoUrl}
                    thumbnailUrl={university.videoThumbnailUrl || university.coverImageUrl}
                    title={university.videoTitle || name}
                    description={university.videoDescription}
                    autoPlay={false}
                  />
                </div>
              )}

              {/* Overview Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-brand-navy-950 font-cairo flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-brand-amber-500" />
                  <span>
                    {currentLang === 'ar' ? 'نبذة تعريفية شاملة عن الجامعة:' : currentLang === 'tr' ? 'Üniversite Hakkında Genel Bilgiler:' : 'Comprehensive University Profile:'}
                  </span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {overview || (
                    currentLang === 'ar'
                      ? 'تعد هذه الجامعة من المؤسسات التعليمية الرائدة والمعتمدة في تركيا، وتوفر باقة متنوعة من التخصصات الهندسية والطبية والإدارية.'
                      : currentLang === 'tr'
                      ? 'Bu üniversite Türkiye genelinde akredite edilmiş seçkin akademik kurumlardandır.'
                      : 'This university is an accredited premier academic institution in Turkey offering versatile undergraduate and graduate degree options.'
                  )}
                </p>
              </div>

              {/* =========================================================
                  DIRECT APPLY CTA BUTTON WITH SYMBOL (PROMINENT)
                  ========================================================= */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                <Link
                  to={`/apply?university=${encodeURIComponent(name)}`}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-amber-500 via-brand-amber-600 to-brand-amber-700 hover:from-brand-amber-600 hover:to-brand-amber-800 text-white font-black text-sm shadow-xl shadow-brand-amber-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '4s' }} />
                  <span>{currentLang === 'ar' ? 'تقديم طلب قبول جامعي رسمي الآن' : currentLang === 'tr' ? 'Hemen Resmi Başvuru Yap' : 'Apply for Admission Now'}</span>
                  <ArrowRight className="w-4 h-4 flip-in-rtl" />
                </Link>

                <Link
                  to={`/universities/${university.slug}`}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-2xl border border-slate-200 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Eye className="w-4 h-4 text-slate-500" />
                  <span>{currentLang === 'ar' ? 'عرض التخصصات والتفاصيل' : currentLang === 'tr' ? 'Bölümleri & Detayları İncele' : 'View Programs & Details'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
