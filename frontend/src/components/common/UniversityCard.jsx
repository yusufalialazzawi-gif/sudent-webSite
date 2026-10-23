import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  GraduationCap,
  Globe,
  ExternalLink,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import ApplicationStatusBadge from './ApplicationStatusBadge';

export default function UniversityCard({ university }) {
  const { t } = useTranslation();
  const { currentLang, isRtl } = useLanguage();
  const navigate = useNavigate();

  const translation =
    university.translations?.find((tr) => tr.lang === currentLang) ||
    university.translations?.find((tr) => tr.lang === 'ar') ||
    university.translations?.[0] ||
    {};

  const name = translation.name || university.slug;
  const overview = translation.overview || '';
  const isPrivate = university.type === 'PRIVATE';

  const whatsappNumber = '905313971022';
  const waApplyUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `مرحباً شركة المجد للخدمات الطلابية، أرغب بالتقديم والحصول على قبول جامعي رسمي في (${name}).`
  )}`;

  const handleCardClick = () => {
    navigate(`/universities/${university.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-brand-amber-400 transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1.5 cursor-pointer relative"
    >
      {/* Cover Image Header */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={
            university.coverImageUrl ||
            'https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop&q=80'
          }
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 start-3 end-3 flex items-center justify-between gap-2 z-10">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
              isPrivate
                ? 'bg-brand-amber-500 text-white'
                : 'bg-brand-navy-900 text-brand-amber-300 border border-brand-amber-400/30'
            }`}
          >
            {isPrivate
              ? t('universities.private')
              : currentLang === 'ar'
              ? '🏛️ حكومية معتمدة'
              : currentLang === 'tr'
              ? '🏛️ Devlet'
              : '🏛️ Public'}
          </span>

          <ApplicationStatusBadge
            status={university.admissionStatus || 'UNCONFIRMED'}
            deadline={university.admissionDeadline}
            statusNote={university.statusNote}
            size="sm"
          />
        </div>

        {/* University Logo Floating Avatar */}
        {university.logoUrl && (
          <div className="absolute -bottom-5 end-4 w-14 h-14 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 overflow-hidden z-10 flex items-center justify-center">
            <img
              src={university.logoUrl}
              alt=""
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* City / Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-brand-amber-500 shrink-0" />
            <span className="font-medium">{university.city || 'تركيا'}</span>
            {university.establishedYear && (
              <>
                <span className="text-slate-300">•</span>
                <span>تأسست {university.establishedYear}</span>
              </>
            )}
          </div>

          {/* University Name */}
          <h3 className="font-bold text-lg text-brand-navy-950 group-hover:text-brand-amber-600 transition-colors font-cairo line-clamp-1">
            {name}
          </h3>

          {/* Short Overview Description */}
          {overview && (
            <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
              {overview}
            </p>
          )}

          {/* Specs / Meta Badges */}
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
            {/* Ranking */}
            {university.ranking && (
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Award className="w-3.5 h-3.5 text-brand-amber-500" />
                  <span>{t('universities.ranking')}:</span>
                </span>
                <span className="font-bold text-brand-navy-900 bg-brand-amber-50 text-brand-amber-700 px-2 py-0.5 rounded-full text-[11px]">
                  #{university.ranking} في تركيا
                </span>
              </div>
            )}

            {/* Programs Count */}
            <div className="flex items-center justify-between text-slate-600">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <BookOpen className="w-3.5 h-3.5 text-brand-amber-500" />
                <span>{t('universities.programsAvailable')}:</span>
              </span>
              <span className="font-bold text-brand-navy-900">
                {university._count?.programs || university.programs?.length || 24}
              </span>
            </div>

            {/* Official Website Link */}
            {university.websiteUrl && (
              <div className="flex items-center justify-between text-slate-600 pt-0.5">
                <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentLang === 'ar' ? 'الموقع الرسمي:' : currentLang === 'tr' ? 'Resmi Web:' : 'Official Web:'}</span>
                </span>
                <a
                  href={university.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-amber-600 hover:underline flex items-center gap-1 text-[11px] font-semibold"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span>{university.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: Full Page Detail Link + Direct WhatsApp Apply CTA */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* Full Page Navigation Link (No modal!) */}
          <Link
            to={`/universities/${university.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-bold text-slate-700 hover:text-brand-amber-600 flex items-center gap-1.5 transition-colors py-2 px-3 rounded-xl hover:bg-brand-amber-50 border border-slate-200"
          >
            <Eye className="w-3.5 h-3.5 text-brand-amber-500" />
            <span>{currentLang === 'ar' ? 'عرض تفاصيل الجامعة' : currentLang === 'tr' ? 'Detayları Görüntüle' : 'View Details'}</span>
          </Link>

          {/* WhatsApp Direct Apply Button with Authentic WhatsApp Logo */}
          <a
            href={waApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-1.5 shrink-0"
          >
            <svg className="w-3.5 h-3.5 fill-white shrink-0" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
            </svg>
            <span>{currentLang === 'ar' ? 'قدّم طلبك الآن' : currentLang === 'tr' ? 'Başvuru Yap' : 'Apply Now'}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
