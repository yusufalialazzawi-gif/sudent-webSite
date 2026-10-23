import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Award, Calendar, ArrowRight, Sparkles, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ScholarshipCard({ scholarship }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const translation =
    scholarship.translations?.find((tr) => tr.lang === currentLang) ||
    scholarship.translations?.find((tr) => tr.lang === 'tr') ||
    scholarship.translations?.find((tr) => tr.lang === 'ar') ||
    scholarship.translations?.[0] ||
    {};

  const title = translation.title || scholarship.slug;
  const description = translation.description || '';
  const benefits = translation.benefitsSummary || '';

  const isFull = scholarship.scholarshipType === 'FULL';
  const isPartial = scholarship.scholarshipType === 'PARTIAL';

  const badgeText = isFull
    ? (currentLang === 'ar' ? 'منحة كاملة 100%' : currentLang === 'tr' ? 'Tam Burslu Program' : '100% Full Scholarship')
    : isPartial
    ? (currentLang === 'ar' ? 'منحة ودعم مالي شهري' : currentLang === 'tr' ? 'Nakit Burs & Maddi Destek' : 'Monthly Cash Grant')
    : (scholarship.discountPercentage
        ? `%${scholarship.discountPercentage} ${currentLang === 'ar' ? 'منحة جزئية' : currentLang === 'tr' ? 'Kısmi Burs' : 'Partial Scholarship'}`
        : (currentLang === 'ar' ? 'منحة دراسية' : currentLang === 'tr' ? 'Eğitim Bursu' : 'Academic Scholarship'));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1.5">
      {/* Banner */}
      <div className="relative h-48 bg-slate-900 overflow-hidden">
        <img
          src={
            scholarship.imageUrl ||
            '/uploads/universities/koc-university.webp'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/uploads/universities/koc-university.webp';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/90 via-slate-950/40 to-transparent"></div>

        {/* Type Badge */}
        <div className="absolute top-3 start-3">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5 ${
              isFull
                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                : 'bg-brand-amber-500 text-slate-950 shadow-brand-amber-500/30'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badgeText}</span>
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 end-3">
          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold backdrop-blur-md ${
            scholarship.status === 'ACTIVE'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/30'
              : scholarship.status === 'UPCOMING'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-400/30'
              : 'bg-slate-900/80 text-slate-400 border border-slate-600/30'
          }`}>
            {scholarship.status === 'ACTIVE'
              ? (currentLang === 'ar' ? '🟢 متاح للتقديم' : currentLang === 'tr' ? '🟢 Başvuru Açık' : '🟢 Open')
              : scholarship.status === 'UPCOMING'
              ? (currentLang === 'ar' ? '🟡 يفتح قريباً' : currentLang === 'tr' ? '🟡 Yakında' : '🟡 Upcoming')
              : (currentLang === 'ar' ? '⚪ منتهي' : currentLang === 'tr' ? '⚪ Tamamlandı' : '⚪ Closed')}
          </span>
        </div>

        {/* Deadline */}
        {scholarship.deadline && (
          <div className="absolute bottom-3 start-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow z-10">
            <Calendar className="w-3.5 h-3.5 text-brand-amber-400" />
            <span>
              {currentLang === 'ar' ? 'آخر موعد:' : currentLang === 'tr' ? 'Son Başvuru:' : 'Deadline:'}{' '}
              {new Date(scholarship.deadline).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : currentLang === 'tr' ? 'tr-TR' : 'en-US')}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-brand-navy-950 font-cairo mb-2 group-hover:text-brand-amber-600 transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-3">
            {description}
          </p>

          {benefits && (
            <div className="mb-4 bg-emerald-50/90 border border-emerald-200/80 p-2.5 rounded-xl text-xs text-emerald-800 font-bold line-clamp-2">
              ✓ {benefits}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/scholarships/${scholarship.slug}`}
            className="text-xs font-bold text-slate-700 group-hover:text-brand-amber-600 flex items-center gap-1.5 transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-50"
          >
            <span>{currentLang === 'ar' ? 'الشروط والتفاصيل' : currentLang === 'tr' ? 'Şartlar ve Detaylar' : 'Requirements & Details'}</span>
            <ArrowRight className="w-3.5 h-3.5 flip-in-rtl" />
          </Link>

          <a
            href={`https://wa.me/905313971022?text=${encodeURIComponent(
              `مرحباً شركة المجد للقبولات الجامعية، أرغب بالتقديم على المنحة الدراسية (${title}).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-500/25 flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
            </svg>
            <span>{t('scholarships.applyScholarship')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
