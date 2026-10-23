import React from 'react';
import { Link } from 'react-router-dom';
import useSiteText from '../../hooks/useSiteText';

const FALLBACK_NAME = {
  ar: 'شركة المجد للقبولات الجامعية',
  tr: 'El-Mecd Üniversite Kabulleri',
  en: 'Al-Majd University Admissions',
};
const FALLBACK_SLOGAN = {
  ar: 'بوابتك الأكاديمية للدراسة في تركيا 🇹🇷',
  tr: 'Türkiye Üniversite Başvuru Portalı 🇹🇷',
  en: 'Turkey University Admissions Portal 🇹🇷',
};

// Logo + site adı + slogan. Header ve Footer ortak kullanır; hepsi admin ayarından gelir.
export default function SiteBrand({ variant = 'on-white', compact = false }) {
  const { text, str, currentLang } = useSiteText();
  const logoUrl = str('site_logo_url', '') || '/logo.jpg';
  const dark = variant === 'on-dark';

  return (
    <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 max-w-[240px] sm:max-w-none">
      <img
        src={logoUrl}
        alt={text('site_name', () => FALLBACK_NAME[currentLang])}
        className={`${compact ? 'w-8 h-8 sm:w-9 sm:h-9' : 'h-8 sm:h-10 w-auto'} object-contain rounded-lg sm:rounded-xl bg-white p-0.5 sm:p-1 border ${
          dark ? 'border-brand-amber-500/30' : 'border-slate-100 shadow-sm'
        } group-hover:scale-105 transition-transform shrink-0`}
      />
      <div className="flex flex-col min-w-0">
        <span
          className={`text-sm sm:text-base lg:text-lg font-bold tracking-tight font-cairo leading-tight truncate sm:whitespace-normal ${
            dark ? 'text-white' : 'text-brand-navy-900'
          }`}
        >
          {text('site_name', () => FALLBACK_NAME[currentLang])}
        </span>
        <span className={`hidden sm:block text-[10px] font-medium truncate ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {text('site_slogan', () => FALLBACK_SLOGAN[currentLang])}
        </span>
      </div>
    </Link>
  );
}
