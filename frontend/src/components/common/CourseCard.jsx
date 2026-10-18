import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Clock, Users, Calendar, ArrowRight, Video, MapPin } from 'lucide-react';
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
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      {/* Course Banner */}
      <div className="relative h-40 bg-slate-100 overflow-hidden">
        <img
          src={
            course.imageUrl ||
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Study Mode Badge */}
        <div className="absolute top-3 start-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-navy-950/80 backdrop-blur-md text-white border border-white/20 flex items-center gap-1.5">
            {course.studyMode === 'ONLINE' ? <Video className="w-3 h-3 text-brand-amber-400" /> : <MapPin className="w-3 h-3 text-brand-amber-400" />}
            <span>{modeLabel}</span>
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 end-3 bg-brand-amber-500 text-white px-3 py-1 rounded-lg text-xs font-black shadow-md">
          {course.price === 0 ? (currentLang === 'ar' ? 'مجاني' : 'Free') : `$${course.price} ${course.currency}`}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-brand-navy-950 font-cairo mb-2 group-hover:text-brand-amber-600 transition-colors line-clamp-1">
            {title}
          </h3>

          <p className="text-slate-600 text-xs leading-relaxed line-clamp-2 mb-4">
            {description}
          </p>

          <div className="space-y-1.5 mb-4 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-amber-500" />
                <span>المدة:</span>
              </span>
              <span className="font-semibold text-slate-800">{course.durationWeeks} أسابيع</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-amber-500" />
                <span>المقاعد المسجلة:</span>
              </span>
              <span className="font-semibold text-slate-800">{course.registeredCount} / {course.capacity}</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <Link
            to={`/courses/${course.slug}`}
            className="text-xs font-bold text-brand-navy-900 group-hover:text-brand-amber-600 flex items-center gap-1 transition-colors"
          >
            <span>{t('universities.viewDetails')}</span>
            <ArrowRight className="w-3.5 h-3.5 flip-in-rtl" />
          </Link>

          <Link
            to={`/courses/${course.slug}#register`}
            className="px-3.5 py-1.5 rounded-lg bg-brand-amber-50 text-brand-amber-700 hover:bg-brand-amber-500 hover:text-white text-xs font-bold transition-all"
          >
            {t('courses.registerCourse')}
          </Link>
        </div>
      </div>
    </div>
  );
}
