import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';

// Ana sayfa bölümü sarmalayıcısı.
// Admin bir arka plan fotoğrafı tanımladıysa bölüm onu gösterir, yoksa düz zemin kalır.
export function HomeSection({ bgKey, container = true, className = '', children }) {
  const { str } = useSiteText();
  const bg = str(bgKey, '');

  return (
    <section className={`${bg ? 'relative overflow-hidden' : ''} ${container ? 'max-w-7xl mx-auto px-4 sm:px-6' : ''} ${className}`}>
      {bg && (
        <>
          <img src={bg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-white/85" />
        </>
      )}
      <div className={bg ? 'relative z-10' : ''}>{children}</div>
    </section>
  );
}

// Bölüm başlığı (üst etiket + başlık + açıklama + "tümünü gör" linki).
export function SectionHeading({ kicker, title, subtitle, to, linkLabel, dark = false, center = false }) {
  return (
    <div className={`${center ? 'text-center max-w-2xl mx-auto' : 'flex flex-col sm:flex-row sm:items-end justify-between gap-4'} mb-8`}>
      <div className={center ? '' : ''}>
        {kicker && (
          <span className={`font-bold text-xs uppercase tracking-wider block mb-1 ${dark ? 'text-brand-amber-400' : 'text-brand-amber-600'}`}>
            {kicker}
          </span>
        )}
        <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black font-cairo ${dark ? 'text-white' : 'text-brand-navy-950'}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`text-sm mt-1 ${center ? 'mt-2' : 'max-w-xl'} ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
            {subtitle}
          </p>
        )}
      </div>

      {to && linkLabel && (
        <Link
          to={to}
          className={`inline-flex items-center gap-1.5 text-sm font-bold transition-colors shrink-0 ${
            dark ? 'text-brand-amber-400 hover:text-brand-amber-300' : 'text-brand-amber-600 hover:text-brand-amber-700'
          }`}
        >
          <span>{linkLabel}</span>
          <ArrowRight className="w-4 h-4 flip-in-rtl" />
        </Link>
      )}
    </div>
  );
}

// Kartlar yüklenirken gösterilen iskelet ızgara.
export function CardSkeleton({ count = 4, height = 'h-80' }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${height} bg-slate-200 animate-pulse rounded-2xl`} />
      ))}
    </div>
  );
}

export default HomeSection;

// Üç dilli nesneden aktif dilin metnini seçer (boşsa Türkçe/İngilizce/Arapça'ya düşer).
export const pickLang = (obj, lang) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.tr || obj.en || obj.ar || '';
};
