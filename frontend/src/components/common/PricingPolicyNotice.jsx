import React from 'react';
import { ShieldCheck, Info, Check, X, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';

export default function PricingPolicyNotice({ officialUrl = null, className = '' }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  return (
    <div className={`rounded-2xl bg-amber-500/10 border border-brand-amber-500/30 p-5 text-slate-800 ${className}`}>
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h4 className="font-bold text-sm text-brand-navy-950 font-cairo">
              {t('pricingNotice.title')}
            </h4>
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-amber-700 hover:underline"
              >
                <span>{t('pricingNotice.officialPortalLink')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {t('pricingNotice.desc')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
            <div className="flex items-center gap-1.5 text-emerald-800">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{t('pricingNotice.freeGuidance')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Info className="w-3.5 h-3.5 text-brand-amber-600 shrink-0" />
              <span>{t('pricingNotice.paidServices')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
