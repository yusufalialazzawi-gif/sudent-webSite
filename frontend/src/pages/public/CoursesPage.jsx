import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Video, MapPin, Users, Sparkles, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import CourseCard from '../../components/common/CourseCard';
import SfBreadcrumb from '../../components/common/SfBreadcrumb';

export default function CoursesPage() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { settings } = useTheme();
  const [studyMode, setStudyMode] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['courses', { studyMode, currentLang }],
    queryFn: () => api.getCourses({ ...(studyMode && { studyMode }), lang: currentLang }),
  });

  const pageTitle =
    currentLang === 'ar'
      ? 'الدورات والبرامج التحضيرية في تركيا'
      : currentLang === 'tr'
      ? 'Türkiye’de Sınav Hazırlık ve Dil Kursları'
      : 'Preparation & Language Courses in Turkey';

  const breadcrumbItems = [
    { label: currentLang === 'ar' ? 'الرئيسية' : currentLang === 'tr' ? 'Ana Sayfa' : 'Home', to: '/' },
    { label: currentLang === 'ar' ? 'الدورات' : currentLang === 'tr' ? 'Kurslar' : 'Courses' },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16">
      {/* StudyFans Breadcrumb Strip */}
      <SfBreadcrumb
        items={breadcrumbItems}
        title={pageTitle}
      />

      <div className="sf-container mx-auto px-4 space-y-10">
        {/* Intro Info Banner */}
        <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 sm:p-8 drop-shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#ff9015]/10 text-beer">
              {currentLang === 'ar' ? 'برامج معتمدة من أفضل المراكز الأكاديمية' : currentLang === 'tr' ? 'Yetkili Dil ve Sınav Merkezleri' : 'Certified Exam Centers'}
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-main-color font-cairo">
              {currentLang === 'ar'
                ? 'دورات TR-YÖS، SAT، وتومر (TÖMER) بإشراف نخبة من الأساتذة'
                : currentLang === 'tr'
                ? 'TR-YÖS, SAT ve TÖMER Hazırlık Eğitimleri'
                : 'TR-YÖS, SAT, and TÖMER Preparatory Programs'}
            </h2>
            <p className="text-text-color text-xs sm:text-sm leading-relaxed">
              {t('courses.subtitle')}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setStudyMode('')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !studyMode
                  ? 'bg-beer text-white shadow-sm'
                  : 'bg-[#f7f5f2] border border-[#dee2e6] text-text-color hover:bg-white'
              }`}
            >
              {currentLang === 'ar' ? 'جميع الأنماط' : currentLang === 'tr' ? 'Tüm Eğitim Şekilleri' : 'All Modes'}
            </button>
            <button
              onClick={() => setStudyMode('ONLINE')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                studyMode === 'ONLINE'
                  ? 'bg-beer text-white shadow-sm'
                  : 'bg-[#f7f5f2] border border-[#dee2e6] text-text-color hover:bg-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{currentLang === 'ar' ? 'أونلاين (عن بعد)' : currentLang === 'tr' ? 'Online / Uzaktan' : 'Online'}</span>
            </button>
            <button
              onClick={() => setStudyMode('HYBRID')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                studyMode === 'HYBRID'
                  ? 'bg-beer text-white shadow-sm'
                  : 'bg-[#f7f5f2] border border-[#dee2e6] text-text-color hover:bg-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{currentLang === 'ar' ? 'حضوري ومدمج' : currentLang === 'tr' ? 'Yüz Yüze & Hibrit' : 'In-Person & Hybrid'}</span>
            </button>
          </div>
        </div>

        {/* Grid of Courses */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-[#f7f5f2] border border-[#dee2e6] animate-pulse"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center text-sm font-bold">
            {error?.message || (currentLang === 'ar' ? 'حدث خطأ في جلب الدورات.' : currentLang === 'tr' ? 'Kurs verileri yüklenirken hata oluştu.' : 'Failed to load courses.')}
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#dee2e6] p-12 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-[#dee2e6] mx-auto" />
            <h3 className="text-base font-bold text-main-color">
              {currentLang === 'ar' ? 'لا توجد دورات متاحة بهذا التصنيف حالياً' : currentLang === 'tr' ? 'Bu kategoride aktif kurs bulunamadı' : 'No courses found in this category'}
            </h3>
            <button
              onClick={() => setStudyMode('')}
              className="px-5 py-2 rounded-xl bg-beer text-white text-xs font-bold"
            >
              {currentLang === 'ar' ? 'عرض جميع الدورات' : currentLang === 'tr' ? 'Tüm Kursları Göster' : 'Show All Courses'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {/* StudyFans Callout Banner */}
        <div className="bg-[#f7f5f2] rounded-2xl border border-[#dee2e6] p-8 sm:p-12 drop-shadow-sm text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#ff9015]/10 text-beer flex items-center justify-center mx-auto border border-[#ff9015]/20">
            <Sparkles className="w-7 h-7" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black font-cairo text-main-color max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'ar'
              ? 'هل تحتاج استشارة لاختيار الدورة والبرنامج الأنسب لمستواك الأكاديمي؟'
              : currentLang === 'tr'
              ? 'Hangi kursun ve programın sizin için en uygun olduğunu belirlemek için ücretsiz danışmanlık alın'
              : 'Need guidance on choosing the right preparatory course for your level?'}
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${settings.whatsapp_number || settings.contact_whatsapp || '905313971022'}?text=${encodeURIComponent(
                currentLang === 'ar'
                  ? 'مرحباً، أود استشارة حول دورات التحضير للامتحانات واللغة'
                  : 'Merhaba, sınav ve dil kursları hakkında bilgi almak istiyorum'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{currentLang === 'ar' ? 'استشر المنسق الأكاديمي عبر واتساب' : currentLang === 'tr' ? 'WhatsApp ile Danışmanla Görüş' : 'Chat on WhatsApp'}</span>
            </a>

            <Link
              to="/apply"
              className="w-full sm:w-auto px-8 py-3.5 bg-beer hover:bg-[#e07b09] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{currentLang === 'ar' ? 'سجل اهتمامك الآن' : currentLang === 'tr' ? 'Kayıt Talebi Gönder' : 'Register Interest'}</span>
              <ArrowRight className="w-4 h-4 flip-in-rtl" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
