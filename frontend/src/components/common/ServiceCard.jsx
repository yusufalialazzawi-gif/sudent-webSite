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

          <a
            href={`https://wa.me/905313971022?text=${encodeURIComponent(
              `مرحباً شركة المجد للقبولات الجامعية، أود الاستفسار وطلب خدمة (${title}).`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
            </svg>
            <span>{t('services.requestService')}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
