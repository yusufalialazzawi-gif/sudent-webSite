import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Users, Calendar, ArrowRight, Video, MapPin, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function CourseCard({ course }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const translation =
    course.translations?.find((tr) => tr.lang === currentLang) ||
    course.translations?.find((tr) => tr.lang === 'ar') ||
    course.translations?.[0] ||
    {};

  const title = translation.title || course.slug;
  const description = translation.description || '';
  const instructor = translation.instructor || '';

  // Mode badge
  const modeLabel =
    course.studyMode === 'ONLINE'
      ? t('courses.online')
      : course.studyMode === 'IN_PERSON'
      ? t('courses.inPerson')
      : t('courses.hybrid');

  return (
    <div className="bg-white rounded-2xl border border-[#dee2e6] overflow-hidden drop-shadow-sm hover:drop-shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      {/* Course Banner */}
      <div className="relative h-44 bg-[#f7f5f2] overflow-hidden">
        <img
          src={
            course.imageUrl ||
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Study Mode Badge */}
        <div className="absolute top-3 start-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#0a2240]/85 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5 shadow-sm">
            {course.studyMode === 'ONLINE' ? (
              <Video className="w-3.5 h-3.5 text-beer" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-beer" />
            )}
            <span>{modeLabel}</span>
          </span>
        </div>

        {/* Certified Badge */}
        <div className="absolute bottom-3 end-3 bg-beer text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md flex items-center gap-1">
          <Award className="w-3 h-3" />
          <span>{currentLang === 'ar' ? 'شهادة معتمدة' : currentLang === 'tr' ? 'Onaylı Sertifika' : 'Certified'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-main-color font-cairo mb-2 group-hover:text-beer transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="text-text-color text-xs leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>

          <div className="space-y-1.5 mb-2 text-xs text-text-color bg-[#f7f5f2] p-3 rounded-xl border border-[#dee2e6]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-beer" />
                <span>{currentLang === 'ar' ? 'المدة:' : currentLang === 'tr' ? 'Süre:' : 'Duration:'}</span>
              </span>
              <span className="font-bold text-main-color">
                {course.durationWeeks} {currentLang === 'ar' ? 'أسابيع' : currentLang === 'tr' ? 'Hafta' : 'Weeks'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-beer" />
                <span>{currentLang === 'ar' ? 'المقاعد المتاحة:' : currentLang === 'tr' ? 'Kayıt Durumu:' : 'Seats:'}</span>
              </span>
              <span className="font-bold text-main-color">
                {course.registeredCount || 0} / {course.capacity || 25}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#dee2e6] flex items-center justify-between">
          <Link
            to={`/courses/${course.slug}`}
            className="text-xs font-bold text-main-color hover:text-beer flex items-center gap-1 transition-colors"
          >
            <span>{t('universities.viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5 flip-in-rtl" />
          </Link>

          <Link
            to={`/courses/${course.slug}#register`}
            className="px-3.5 py-1.5 rounded-xl bg-beer hover:bg-[#e07b09] text-white text-xs font-bold transition-all shadow-sm"
          >
            {t('courses.registerCourse')}
          </Link>
        </div>
      </div>
    </div>
  );
}
