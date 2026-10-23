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
            'https://images.unsplash.com/photo-1507842229451-7f01be837a2b?w=800&auto=format&fit=crop&q=80'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90"
          loading="lazy"
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

          <Link
            to={`/apply?scholarship=${encodeURIComponent(title)}`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white text-xs font-bold transition-all shadow-md shadow-brand-amber-500/20"
          >
            {t('scholarships.applyScholarship')}
          </Link>
        </div>
      </div>
    </div>
  );
}
