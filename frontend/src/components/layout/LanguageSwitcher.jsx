import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Dil değiştirici dropdown (header'da kullanılır).
export default function LanguageSwitcher() {
  const { currentLang, changeLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
        aria-label="Language selector"
      >
        <Globe className="w-4 h-4 text-brand-navy-800" />
        <span className="uppercase">{currentLang}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute top-full end-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
          {languages.map((lng) => (
            <button
              key={lng.code}
              onClick={() => {
                changeLanguage(lng.code);
                setOpen(false);
              }}
              className={`w-full text-start flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors ${
                currentLang === lng.code
                  ? 'bg-brand-amber-50 text-brand-amber-600 font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lng.flag}</span>
                <span>{lng.label}</span>
              </span>
              {currentLang === lng.code && <span className="w-1.5 h-1.5 rounded-full bg-brand-amber-500"></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
