import React from 'react';
import { Link } from 'react-router-dom';
import useSiteText from '../../hooks/useSiteText';

const FALLBACK_NAME = {
  ar: 'شركة المجد للخدمات الطلابية',
  tr: 'El-Mecd Öğrenci Hizmetleri',
  en: 'Al-Majd Student Services',
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
    <Link to="/" className="flex items-center gap-3 group">
      <img
        src={logoUrl}
        alt={text('site_name', () => FALLBACK_NAME[currentLang])}
        className={`${compact ? 'w-10 h-10' : 'h-10 sm:h-11 max-h-11 w-auto max-w-[160px]'} object-contain rounded-xl bg-white p-1 border ${
          dark ? 'border-brand-amber-500/30' : 'border-slate-100 shadow-sm'
        } group-hover:scale-105 transition-transform shrink-0`}
      />
      <div className="flex flex-col">
        <span
          className={`text-xl font-black tracking-tight flex items-center gap-1.5 font-cairo leading-tight ${
            dark ? 'text-white' : 'text-brand-navy-800'
          }`}
        >
          {text('site_name', () => FALLBACK_NAME[currentLang])}
        </span>
        <span className={`text-[10px] font-medium tracking-wider uppercase ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {text('site_slogan', () => FALLBACK_SLOGAN[currentLang])}
        </span>
      </div>
    </Link>
  );
}
