import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function FAQAccordion({ items = [] }) {
  const { currentLang } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0); // first open by default

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="space-y-3.5">
      {items.map((item, idx) => {
        const trans =
          item.translations?.find((t) => t.lang === currentLang) ||
          item.translations?.find((t) => t.lang === 'ar') ||
          item.translations?.[0] ||
          {};

        const question = trans.question || item.question || '';
        const answer = trans.answer || item.answer || '';
        const isOpen = openIndex === idx;

        return (
          <div
            key={item.id || idx}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'bg-white border-brand-amber-500/40 shadow-md ring-1 ring-brand-amber-500/10'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full text-start p-5 sm:p-6 flex items-center justify-between gap-4 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isOpen ? 'bg-brand-amber-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  <HelpCircle className="w-4 h-4" />
                </span>
                <span className="font-bold text-base text-brand-navy-950 font-cairo">
                  {question}
                </span>
              </span>

              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-brand-amber-500' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                <div className="ps-11 whitespace-pre-line">{answer}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
