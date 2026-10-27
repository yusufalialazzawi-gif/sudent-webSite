import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

// Dil değiştirici dropdown — TopBar (StudyFans stili) veya Header için
export default function LanguageSwitcher({ variant = 'default' }) {
  const { currentLang, changeLanguage, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentObj = languages.find((l) => l.code === currentLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'topbar') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 px-2.5 py-1 text-white hover:text-[#ff7900] text-sm sm:text-[15px] font-bold font-cairo transition-colors cursor-pointer select-none"
          aria-label="Language selector"
        >
          <ChevronDown className={`w-4 h-4 opacity-85 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          <span>{currentObj?.label}</span>
          <span className="inline-flex items-center justify-center text-xs font-black tracking-wider bg-[#00a859] text-white px-1.5 py-0.5 rounded shadow-xs leading-none">
            {currentObj?.code === 'ar' ? 'SA' : currentObj?.code === 'tr' ? 'TR' : 'EN'}
          </span>
        </button>

        {open && (
          <div className="absolute top-full end-0 mt-2 w-40 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
            {languages.map((lng) => (
              <button
                key={lng.code}
                type="button"
                onClick={() => {
                  changeLanguage(lng.code);
                  setOpen(false);
                }}
                className={`w-full text-start flex items-center justify-between px-3.5 py-2.5 text-xs sm:text-sm font-bold font-cairo transition-colors ${
                  currentLang === lng.code
                    ? 'bg-orange-50 text-[#ff7900]'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base">{lng.flag}</span>
                  <span>{lng.label}</span>
                </span>
                {currentLang === lng.code && <span className="w-2 h-2 rounded-full bg-[#ff7900]"></span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
        aria-label="Language selector"
      >
        <Globe className="w-4 h-4 text-[#0a2240]" />
        <span className="uppercase">{currentLang}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute top-full end-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
          {languages.map((lng) => (
            <button
              key={lng.code}
              type="button"
              onClick={() => {
                changeLanguage(lng.code);
                setOpen(false);
              }}
              className={`w-full text-start flex items-center justify-between px-3.5 py-2 text-xs font-semibold font-cairo transition-colors ${
                currentLang === lng.code
                  ? 'bg-orange-50 text-[#ff9015] font-bold'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lng.flag}</span>
                <span>{lng.label}</span>
              </span>
              {currentLang === lng.code && <span className="w-1.5 h-1.5 rounded-full bg-[#ff9015]"></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
