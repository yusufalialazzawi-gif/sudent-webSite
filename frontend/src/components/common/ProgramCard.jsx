import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Clock, Globe, ArrowRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
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
  const facultyName = progTrans.facultyName || '';
  const rawUniName = uniTrans.name || program.university?.slug || 'Turkish University';
  // Clean up university name if it has long parentheses
  const uniName = rawUniName.replace(/\s*\([^)]*\)\s*$/, '').trim() || rawUniName;
  const uniLogo = program.university?.logoUrl;

  // Degree badge configuration
  const degreeMap = {
    BACHELOR: {
      label: { ar: 'بكالوريوس', tr: 'Lisans (B.Sc.)', en: "Bachelor's" },
      badgeClass: 'bg-brand-navy-900 text-brand-amber-300 border-brand-amber-400/30',
    },
    MASTER_WITH_THESIS: {
      label: { ar: 'ماجستير بأطروحة', tr: 'Tezli Yüksek Lisans', en: "Master's (Thesis)" },
      badgeClass: 'bg-emerald-900 text-emerald-300 border-emerald-400/30',
    },
    MASTER_NON_THESIS: {
      label: { ar: 'ماجستير بدون أطروحة', tr: 'Tezsiz Yüksek Lisans', en: "Master's (Non-Thesis)" },
      badgeClass: 'bg-teal-900 text-teal-300 border-teal-400/30',
    },
    PHD: {
      label: { ar: 'دكتوراه (PhD)', tr: 'Doktora (PhD)', en: 'Ph.D.' },
      badgeClass: 'bg-purple-900 text-purple-300 border-purple-400/30',
    },
    ASSOCIATE: {
      label: { ar: 'دبلوم مهني', tr: 'Ön Lisans', en: 'Associate' },
      badgeClass: 'bg-slate-900 text-slate-300 border-slate-400/30',
    },
  };

  const degreeInfo = degreeMap[program.degreeLevel] || {
    label: { ar: program.degreeLevel, tr: program.degreeLevel, en: program.degreeLevel },
    badgeClass: 'bg-brand-navy-900 text-brand-amber-300 border-white/20',
  };
  const degreeLabel = degreeInfo.label[currentLang] || degreeInfo.label.ar;

  // Study Language Label
  const langLabel =
    program.studyLanguage === 'ENGLISH'
      ? currentLang === 'ar' ? 'الإنجليزية 100%' : currentLang === 'tr' ? '%100 İngilizce' : '100% English'
      : program.studyLanguage === 'TURKISH'
      ? currentLang === 'ar' ? 'التركية' : currentLang === 'tr' ? 'Türkçe' : 'Turkish'
      : currentLang === 'ar' ? 'مختلط (إنجليزي/تركي)' : currentLang === 'tr' ? 'Karma Dil' : 'Dual Language';

  // Duration label formatter
  const getDurationLabel = (years, lang) => {
    const y = Number(years) || 4;
    if (lang === 'ar') {
      if (y === 1) return 'سنة واحدة';
      if (y === 2) return 'سنتان (2 سنوات)';
      return `${y} سنوات`;
    }
    if (lang === 'tr') {
      return `${y} Yıl`;
    }
    return `${y} ${y === 1 ? 'Year' : 'Years'}`;
  };

  return (
    <div className="h-full bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-amber-400/70 transition-all duration-300 flex flex-col justify-between group overflow-hidden hover:-translate-y-1 p-5 sm:p-6 relative">
      <div>
        {/* Top Badges Row: Degree, Language, Status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className={`px-2.5 py-1 rounded-xl text-xs font-black shadow-sm border ${degreeInfo.badgeClass}`}>
            {degreeLabel}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              <Globe className="w-3 h-3 text-brand-amber-500 shrink-0" />
              <span>{langLabel}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{currentLang === 'ar' ? 'متاح' : currentLang === 'tr' ? 'Açık' : 'Open'}</span>
            </span>
          </div>
        </div>

        {/* University & Faculty */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-amber-600 font-cairo">
            {uniLogo ? (
              <img src={uniLogo} alt={uniName} className="w-4 h-4 rounded object-contain shrink-0" />
            ) : (
              <Building2 className="w-4 h-4 shrink-0 text-brand-amber-500" />
            )}
            <span className="truncate">{uniName}</span>
          </div>

          <span className="text-[11px] font-medium text-slate-500 block truncate h-4">
            {facultyName || (currentLang === 'ar' ? 'كلية معتمدة رسمياً' : 'Yetkili Fakülte')}
          </span>

          {/* Program Name with fixed height for exact card alignment */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-cairo group-hover:text-brand-amber-600 transition-colors leading-snug line-clamp-2 h-14">
            {name}
          </h3>
        </div>

        {/* Duration & Academic Intake Row */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100 mb-4">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-brand-amber-500 shrink-0" />
            <span>{currentLang === 'ar' ? 'مدة الدراسة:' : currentLang === 'tr' ? 'Eğitim Süresi:' : 'Duration:'}</span>
            <strong className="text-slate-900 font-bold">
              {getDurationLabel(program.durationYears || 4, currentLang)}
            </strong>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>{program.academicYear || '2026 - 2027'}</span>
          </div>
        </div>
      </div>

      <div>
        {/* Accreditation & Direct Admission Note */}
        <div className="pt-3 border-t border-slate-100 mb-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{currentLang === 'ar' ? 'قبول مضمون معتمد' : currentLang === 'tr' ? 'Doğrudan Kabul' : 'Guaranteed Admission'}</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {currentLang === 'ar' ? 'استشارة مجانية' : currentLang === 'tr' ? 'Ücretsiz Danışmanlık' : 'Free Advisory'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to={`/programs/${program.id || program.slug}`}
            className="text-center py-2.5 px-3 rounded-xl border border-slate-200 hover:border-brand-navy-900 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm flex items-center justify-center"
          >
            <span>{t('universities.viewDetails')}</span>
          </Link>
          <a
            href={`https://wa.me/905313971022?text=${encodeURIComponent(
              `مرحباً شركة المجد للخدمات الطلابية، أرغب بالتقديم على تخصص (${name}) في جامعة (${uniName}).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-black transition shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
            </svg>
            <span>{t('nav.applyNow')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
