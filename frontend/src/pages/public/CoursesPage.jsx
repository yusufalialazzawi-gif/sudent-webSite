import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Video, MapPin, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import CourseCard from '../../components/common/CourseCard';

export default function CoursesPage() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const [studyMode, setStudyMode] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['courses', { studyMode, currentLang }],
    queryFn: () => api.getCourses({ ...(studyMode && { studyMode }), lang: currentLang }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block">
          {t('courses.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy-950 font-cairo">
          دورات التحضير للامتحانات واللغة في تركيا
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          {t('courses.subtitle')}
        </p>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setStudyMode('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              !studyMode ? 'bg-brand-navy-950 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            جميع الأنماط
          </button>
          <button
            onClick={() => setStudyMode('ONLINE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              studyMode === 'ONLINE' ? 'bg-brand-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            عن بُعد (أونلاين)
          </button>
          <button
            onClick={() => setStudyMode('HYBRID')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              studyMode === 'HYBRID' ? 'bg-brand-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            مدمج وحضوري
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl text-center text-sm font-bold">
          {error?.message || 'حدث خطأ في جلب الدورات.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
