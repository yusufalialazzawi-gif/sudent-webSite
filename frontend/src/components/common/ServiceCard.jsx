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

  // High-resolution photography mapping for educational consulting services
  const serviceImages = {
    'admission-consulting': 'https://images.unsplash.com/photo-1507842229451-7f01be837a2b?w=800&auto=format&fit=crop&q=80',
    'sworn-translation-equivalency': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    'student-residence-permit': 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
    'airport-pickup-housing': 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80',
  };

  const coverImage =
    serviceImages[service.slug] ||
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative overflow-hidden">
      {/* Photo Header */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent"></div>

        {/* Icon Floating Badge */}
        <div className="absolute top-3 start-3 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center border border-white/40">
          {getIcon(service.icon)}
        </div>

        {/* Policy / Trust Badge */}
        <div className="absolute top-3 end-3">
          {service.pricePolicy === 'FREE_CONSULTATION' ? (
            <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-white text-[11px] font-bold shadow backdrop-blur-md">
              {currentLang === 'ar' ? 'استشارة أولية مجانية' : currentLang === 'tr' ? 'Ücretsiz Ön Değerlendirme' : 'Free Consultation'}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full bg-brand-navy-900/90 text-brand-amber-300 text-[11px] font-bold shadow border border-brand-amber-400/30 backdrop-blur-md">
              {currentLang === 'ar' ? 'خدمة رسمية موثقة' : currentLang === 'tr' ? 'Resmi Onaylı Hizmet' : 'Official Service'}
            </span>
          )}
        </div>

        {/* Duration Badge */}
        {service.estimatedDuration && (
          <div className="absolute bottom-3 start-3 flex items-center gap-1.5 text-white text-xs font-semibold drop-shadow">
            <Clock className="w-3.5 h-3.5 text-brand-amber-400" />
            <span>{service.estimatedDuration}</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-bold text-brand-navy-950 font-cairo mb-2 group-hover:text-brand-amber-600 transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
            {description}
          </p>
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
            className="px-3.5 py-1.5 rounded-lg bg-brand-amber-50 hover:bg-brand-amber-500 text-brand-amber-700 hover:text-white text-xs font-bold transition-all"
          >
            {t('services.requestService')}
          </Link>
        </div>
      </div>
    </div>
  );
}
