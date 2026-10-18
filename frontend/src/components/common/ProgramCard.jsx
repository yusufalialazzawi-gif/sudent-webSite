import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Clock, Globe, ArrowRight, Tag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ProgramCard({ program }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const progTrans =
    program.translations?.find((tr) => tr.lang === currentLang) ||
    program.translations?.find((tr) => tr.lang === 'ar') ||
    program.translations?.[0] ||
    {};

  const uniTrans =
    program.university?.translations?.find((tr) => tr.lang === currentLang) ||
    program.university?.translations?.find((tr) => tr.lang === 'ar') ||
    program.university?.translations?.[0] ||
    {};

  const name = progTrans.name || program.slug;
  const uniName = uniTrans.name || program.university?.slug || 'Turkish University';

  // Degree badge label
  const degreeMap = {
    BACHELOR: { ar: 'بكالوريوس', tr: 'Lisans', en: "Bachelor's" },
    MASTER_WITH_THESIS: { ar: 'ماجستير بأطروحة', tr: 'Tezli Yüksek Lisans', en: "Master's (Thesis)" },
    MASTER_NON_THESIS: { ar: 'ماجستير بدون أطروحة', tr: 'Tezsiz Yüksek Lisans', en: "Master's (Non-Thesis)" },
    PHD: { ar: 'دكتوراه', tr: 'Doktora', en: 'Ph.D.' },
    ASSOCIATE: { ar: 'دبلوم', tr: 'Ön Lisans', en: 'Associate' },
  };

  const degreeLabel = degreeMap[program.degreeLevel]?.[currentLang] || program.degreeLevel;

  // Study Language Label
  const langLabel =
    program.studyLanguage === 'ENGLISH'
      ? currentLang === 'ar' ? 'إنجليزية' : currentLang === 'tr' ? 'İngilizce' : 'English'
      : program.studyLanguage === 'TURKISH'
      ? currentLang === 'ar' ? 'تركية' : currentLang === 'tr' ? 'Türkçe' : 'Turkish'
      : currentLang === 'ar' ? 'مختلط' : currentLang === 'tr' ? 'Karma' : 'Mixed';

  const hasDiscount = program.discountedTuition && program.discountedTuition < program.annualTuition;
  const discountPercent = hasDiscount
    ? Math.round(((program.annualTuition - program.discountedTuition) / program.annualTuition) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-md bg-brand-navy-50 text-brand-navy-800 text-[11px] font-bold">
            {degreeLabel}
          </span>

          <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            <Globe className="w-3 h-3 text-slate-400" />
            <span>{langLabel}</span>
          </span>
        </div>

        {/* Program Name */}
        <h3 className="text-base font-bold text-brand-navy-950 font-cairo group-hover:text-brand-amber-600 transition-colors mb-1.5 line-clamp-2">
          {name}
        </h3>

        {/* University Name */}
        <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-4">
          {uniName}
        </p>

        {/* Duration */}
        <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-4 bg-slate-50 p-2 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-brand-amber-500" />
          <span>{t('programs.duration')}:</span>
          <span className="font-bold text-brand-navy-900">
            {program.durationYears} {t('programs.years')}
          </span>
        </div>
      </div>

      {/* Tuition & Action */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[11px] text-slate-500">{t('universities.tuition')}:</span>
          <div className="text-end">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 line-through">
                  ${program.annualTuition.toLocaleString()}
                </span>
                <span className="text-base font-black text-emerald-600 font-cairo">
                  ${program.discountedTuition.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                  -{discountPercent}%
                </span>
              </div>
            ) : (
              <span className="text-base font-black text-brand-navy-950 font-cairo">
                ${program.annualTuition.toLocaleString()}
              </span>
            )}
            <span className="text-[10px] text-slate-400 block">{program.currency} / سنوي</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/programs/${program.id || program.slug}`}
            className="w-full text-center py-2 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            {t('universities.viewDetails')}
          </Link>
          <Link
            to={`/apply?program=${encodeURIComponent(name)}&university=${encodeURIComponent(uniName)}`}
            className="w-full text-center py-2 px-3 rounded-lg bg-brand-amber-500 hover:bg-brand-amber-600 text-white text-xs font-bold transition-colors shadow-sm"
          >
            {t('nav.applyNow')}
          </Link>
        </div>
      </div>
    </div>
  );
}
