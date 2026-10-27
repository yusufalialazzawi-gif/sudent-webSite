import React from 'react';
import { Link } from 'react-router-dom';
import useSiteText from '../../hooks/useSiteText';

const FALLBACK_NAME = {
  ar: 'شركة المجد للقبولات الجامعية',
  tr: 'El-Mecd Üniversite Kabulleri',
  en: 'Al-Majd University Admissions',
};

// Logo + site adı. Header ve Footer ortak kullanır; StudyFans gibi temiz, sade ve tek satır.
export default function SiteBrand({ variant = 'on-white', compact = false, showSlogan = false }) {
  const { text, str, currentLang } = useSiteText();
  const logoUrl = str('site_logo_url', '') || '/logo.jpg';
  const dark = variant === 'on-dark';

  return (
    <Link to="/" className="flex items-center gap-2.5 group shrink-0">
      <img
        src={logoUrl}
        alt="Al-Majd"
        className={`${compact ? 'h-8 sm:h-9' : 'h-9 sm:h-11'} w-auto object-contain rounded-xl shrink-0 group-hover:scale-105 transition-transform shadow-xs`}
      />
      <div className="flex flex-col">
        <span
          className={`text-sm sm:text-base lg:text-lg font-black font-cairo leading-none tracking-tight whitespace-nowrap ${
            dark ? 'text-white' : 'text-[#0a2240]'
          }`}
        >
          {text('site_name', () => FALLBACK_NAME[currentLang])}
        </span>
        {showSlogan && (
          <span className={`text-[10px] font-medium mt-1 truncate ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
            بوابتك الأكاديمية للدراسة في تركيا 🇹🇷
          </span>
        )}
      </div>
    </Link>
  );
}
