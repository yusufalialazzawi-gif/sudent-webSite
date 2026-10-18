import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Award, BookOpen, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function UniversityCard({ university }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const translation =
    university.translations?.find((tr) => tr.lang === currentLang) ||
    university.translations?.find((tr) => tr.lang === 'ar') ||
    university.translations?.[0] ||
    {};

  const name = translation.name || university.slug;
  const overview = translation.overview || '';
  const isPrivate = university.type === 'PRIVATE';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1">
      {/* Cover Image Header */}
      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
        <img
          src={
            university.coverImageUrl ||
            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80'
          }
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Type Badge */}
        <div className="absolute top-3 start-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
              isPrivate
                ? 'bg-brand-amber-500 text-white'
                : 'bg-brand-navy-900 text-white border border-white/20'
            }`}
          >
            {isPrivate ? t('universities.private') : t('universities.public')}
          </span>
        </div>

        {/* City Badge */}
        <div className="absolute bottom-3 start-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow">
          <MapPin className="w-3.5 h-3.5 text-brand-amber-400" />
          <span>{university.city}</span>
          {university.establishedYear && (
            <span className="text-slate-300 text-[11px]">({university.establishedYear})</span>
          )}
        </div>

        {/* University Logo Avatar */}
        <div className="absolute -bottom-5 end-4 w-14 h-14 rounded-2xl bg-white p-1 shadow-lg border border-slate-100 overflow-hidden">
          <img
            src={
              university.logoUrl ||
              'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80'
            }
            alt={name}
            className="w-full h-full object-contain rounded-xl"
            loading="lazy"
          />
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between pt-7">
        <div>
          <h3 className="text-lg font-bold text-brand-navy-950 font-cairo mb-2 group-hover:text-brand-amber-600 transition-colors line-clamp-1">
            {name}
          </h3>

          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
            {overview}
          </p>

          {/* Highlights / Programs Preview */}
          <div className="space-y-1.5 mb-4 border-t border-slate-100 pt-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-brand-amber-500" />
                <span>{t('universities.programsAvailable')}:</span>
              </span>
              <span className="font-bold text-brand-navy-900">
                {university._count?.programs || university.programs?.length || 0}
              </span>
            </div>

            {university.ranking && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Award className="w-3.5 h-3.5 text-brand-amber-500" />
                  <span>{t('universities.ranking')}:</span>
                </span>
                <span className="font-bold text-emerald-600">
                  #{university.ranking} في تركيا
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/universities/${university.slug}`}
            className="text-xs font-bold text-brand-navy-900 group-hover:text-brand-amber-600 flex items-center gap-1 transition-colors"
          >
            <span>{t('universities.viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5 flip-in-rtl" />
          </Link>

          <Link
            to={`/apply?university=${encodeURIComponent(name)}`}
            className="px-3.5 py-1.5 rounded-lg bg-brand-amber-50 text-brand-amber-700 hover:bg-brand-amber-500 hover:text-white text-xs font-bold transition-all"
          >
            {t('universities.applyToUni')}
          </Link>
        </div>
      </div>
    </div>
  );
}
