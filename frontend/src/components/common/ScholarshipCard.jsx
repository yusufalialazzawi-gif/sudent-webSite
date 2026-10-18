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
    scholarship.translations?.find((tr) => tr.lang === 'ar') ||
    scholarship.translations?.[0] ||
    {};

  const title = translation.title || scholarship.slug;
  const description = translation.description || '';
  const benefits = translation.benefitsSummary || '';

  const isFull = scholarship.scholarshipType === 'FULL';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      {/* Banner */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        <img
          src={
            scholarship.imageUrl ||
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/80 via-transparent to-transparent"></div>

        {/* Type Badge */}
        <div className="absolute top-3 start-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 ${
              isFull
                ? 'bg-emerald-500 text-white'
                : 'bg-brand-amber-500 text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isFull ? t('scholarships.fullScholarship') : `${scholarship.discountPercentage}% ${t('scholarships.discount')}`}
            </span>
          </span>
        </div>

        {/* Deadline */}
        {scholarship.deadline && (
          <div className="absolute bottom-3 start-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow">
            <Calendar className="w-3.5 h-3.5 text-brand-amber-400" />
            <span>{t('scholarships.deadline')}: {new Date(scholarship.deadline).toLocaleDateString()}</span>
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
            <div className="mb-4 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-xs text-emerald-800 font-semibold line-clamp-2">
              ✓ {benefits}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/scholarships/${scholarship.slug}`}
            className="text-xs font-bold text-brand-navy-900 group-hover:text-brand-amber-600 flex items-center gap-1 transition-colors"
          >
            <span>{t('universities.viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5 flip-in-rtl" />
          </Link>

          <Link
            to={`/apply?scholarship=${encodeURIComponent(title)}`}
            className="px-3.5 py-1.5 rounded-lg bg-brand-amber-500 text-white hover:bg-brand-amber-600 text-xs font-bold transition-all shadow-sm"
          >
            {t('scholarships.applyScholarship')}
          </Link>
        </div>
      </div>
    </div>
  );
}
