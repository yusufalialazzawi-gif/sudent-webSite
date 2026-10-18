import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  FileCheck,
  ShieldCheck,
  Home,
  CheckCircle,
  ArrowRight,
  Clock,
  Briefcase,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ServiceCard({ service }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const translation =
    service.translations?.find((tr) => tr.lang === currentLang) ||
    service.translations?.find((tr) => tr.lang === 'ar') ||
    service.translations?.[0] ||
    {};

  const title = translation.title || service.slug;
  const description = translation.description || '';

  // Icon mapping
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-6 h-6 text-brand-amber-500" />;
      case 'FileCheck':
        return <FileCheck className="w-6 h-6 text-brand-amber-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-brand-amber-500" />;
      case 'Home':
        return <Home className="w-6 h-6 text-brand-amber-500" />;
      default:
        return <CheckCircle className="w-6 h-6 text-brand-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden">
      <div className="absolute top-0 start-0 w-full h-1 bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div>
        {/* Icon & Policy Badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="w-14 h-14 rounded-2xl bg-brand-amber-50 border border-brand-amber-100 flex items-center justify-center group-hover:bg-brand-amber-500 group-hover:text-white transition-colors duration-300">
            {getIcon(service.icon)}
          </div>

          {service.pricePolicy === 'FREE_CONSULTATION' && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
              {currentLang === 'ar' ? 'مجاني 100%' : currentLang === 'tr' ? 'Tamamen Ücretsiz' : '100% Free'}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-brand-navy-950 font-cairo mb-2 group-hover:text-brand-amber-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
          {description}
        </p>

        {service.estimatedDuration && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{t('services.duration')}:</span>
            <span className="font-semibold text-slate-700">{service.estimatedDuration}</span>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/services/${service.slug}`}
          className="text-xs font-bold text-brand-navy-900 group-hover:text-brand-amber-600 flex items-center gap-1 transition-colors"
        >
          <span>{t('universities.viewDetails')}</span>
          <ArrowRight className="w-3.5 h-3.5 flip-in-rtl" />
        </Link>

        <Link
          to={`/contact?service=${encodeURIComponent(title)}`}
          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-amber-500 hover:text-white text-slate-800 text-xs font-bold transition-all"
        >
          {t('services.requestService')}
        </Link>
      </div>
    </div>
  );
}
