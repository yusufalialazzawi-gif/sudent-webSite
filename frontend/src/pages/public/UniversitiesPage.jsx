import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, SlidersHorizontal, MapPin, Building2, Globe, GraduationCap, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import UniversityCard from '../../components/common/UniversityCard';
import PricingPolicyNotice from '../../components/common/PricingPolicyNotice';

export default function UniversitiesPage() {
  const { t } = useTranslation();
  const { currentLang, isRtl } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract query params
  const search = searchParams.get('search') || '';
  const city = searchParams.get('city') || '';
  const type = searchParams.get('type') || '';
  const language = searchParams.get('language') || '';
  const degreeLevel = searchParams.get('degreeLevel') || '';
  const admissionStatus = searchParams.get('admissionStatus') || '';
  const graduateAdmissionOpen = searchParams.get('graduateAdmissionOpen') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sortBy') || 'ranking';

  // Search input state (debounced / on submit)
  const [searchTerm, setSearchTerm] = useState(search);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch search options (cities, degrees)
  const { data: optionsData } = useQuery({
    queryKey: ['search-options'],
    queryFn: () => api.getSearchOptions(),
  });

  // Query universities
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['universities', { search, city, type, language, degreeLevel, admissionStatus, graduateAdmissionOpen, page, sortBy, currentLang }],
    queryFn: () =>
      api.getUniversities({
        search,
        city,
        type,
        language,
        degreeLevel,
        admissionStatus,
        graduateAdmissionOpen,
        page,
        limit: 12,
        sortBy,
        lang: currentLang,
      }),
  });

  const updateFilters = (newParams, resetPage = true) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        updated.set(k, v);
      } else {
        updated.delete(k);
      }
    });
    if (resetPage) {
      updated.set('page', '1'); // reset page only on filter changes
    }
    setSearchParams(updated);
  };

  const changePage = (newPage) => {
    const totalPages = data?.pagination?.totalPages || 1;
    if (newPage < 1 || newPage > totalPages) return;
    const updated = new URLSearchParams(searchParams);
    updated.set('page', String(newPage));
    setSearchParams(updated);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(search || city || type || language || degreeLevel || admissionStatus || graduateAdmissionOpen);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Title & Breadcrumb */}
      <div>
        <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block mb-1">
          {currentLang === 'ar' ? '🏛️ دليل +120 جامعة تركية معتمدة' : currentLang === 'tr' ? '🏛️ +120 Türk Üniversitesi Rehberi' : '🏛️ +120 Turkish Universities Guide'}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy-950 font-cairo">
          {t('universities.title')}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl">
          {currentLang === 'ar'
            ? 'تصفح قائمة الجامعات التركية الحكومية والخاصة مع تفاصيل القبول المباشر، برامج الماجستير والدكتوراه، ومواعيد التسجيل المحدثة.'
            : currentLang === 'tr'
            ? 'Devlet ve vakıf üniversitelerini inceleyin; lisans, yüksek lisans ve doktora kontenjanlarına resmi danışmanlıkla başvurun.'
            : 'Browse accredited public and private universities with direct admission pathways and graduate intake calendars.'}
        </p>
      </div>

      {/* Quick Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {[
          { labelAr: 'الكل', labelTr: 'Tümü', labelEn: 'All', query: { type: '', degreeLevel: '', admissionStatus: '', graduateAdmissionOpen: '' } },
          { labelAr: '🏛️ جامعات حكومية (Devlet)', labelTr: '🏛️ Devlet Üniversiteleri', labelEn: '🏛️ State Universities', query: { type: 'PUBLIC', degreeLevel: '', admissionStatus: '', graduateAdmissionOpen: '' } },
          { labelAr: '🎓 ماجستير ودكتوراه (Graduate)', labelTr: '🎓 Yüksek Lisans & Doktora', labelEn: '🎓 Graduate Studies', query: { graduateAdmissionOpen: 'true', type: '', degreeLevel: '', admissionStatus: '' } },
          { labelAr: '🟢 التقديم مفتوح الآن', labelTr: '🟢 Başvurusu Açık Olanlar', labelEn: '🟢 Open Admissions', query: { admissionStatus: 'OPEN', type: '', degreeLevel: '', graduateAdmissionOpen: '' } },
          { labelAr: '🏢 جامعات خاصة (Vakıf)', labelTr: '🏢 Vakıf Üniversiteleri', labelEn: '🏢 Foundation Unis', query: { type: 'PRIVATE', degreeLevel: '', admissionStatus: '', graduateAdmissionOpen: '' } },
        ].map((pill, idx) => {
          const isActive =
            (pill.query.type && type === pill.query.type) ||
            (pill.query.graduateAdmissionOpen && graduateAdmissionOpen === pill.query.graduateAdmissionOpen) ||
            (pill.query.admissionStatus && admissionStatus === pill.query.admissionStatus) ||
            (!pill.query.type && !pill.query.graduateAdmissionOpen && !pill.query.admissionStatus && !type && !graduateAdmissionOpen && !admissionStatus);
          const label = currentLang === 'ar' ? pill.labelAr : currentLang === 'tr' ? pill.labelTr : pill.labelEn;
          return (
            <button
              key={idx}
              onClick={() => updateFilters(pill.query)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-navy-950 text-brand-amber-400 shadow-md shadow-brand-navy-950/20 scale-[1.02]'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        {/* Search input + Sort row */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search.keywordPlaceholder')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500 pe-10"
            />
            <button type="submit" className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-brand-amber-600">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Filter Selects */}
          <div className="hidden lg:flex items-center gap-2.5 w-full md:w-auto">
            {/* City */}
            <select
              value={city}
              onChange={(e) => updateFilters({ city: e.target.value })}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500 cursor-pointer"
            >
              <option value="">{t('search.allCities')}</option>
              {optionsData?.data?.cities?.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Type */}
            <select
              value={type}
              onChange={(e) => updateFilters({ type: e.target.value })}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500 cursor-pointer"
            >
              <option value="">{t('search.allTypes')}</option>
              <option value="PRIVATE">{t('universities.private')}</option>
              <option value="PUBLIC">{t('universities.public')}</option>
            </select>

            {/* Language */}
            <select
              value={language}
              onChange={(e) => updateFilters({ language: e.target.value })}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500 cursor-pointer"
            >
              <option value="">{t('search.allLanguages')}</option>
              <option value="ENGLISH">English</option>
              <option value="TURKISH">Türkçe</option>
            </select>

            {/* Admission Status */}
            <select
              value={admissionStatus}
              onChange={(e) => updateFilters({ admissionStatus: e.target.value })}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500 cursor-pointer"
            >
              <option value="">
                {currentLang === 'ar' ? 'جميع حالات التقديم' : currentLang === 'tr' ? 'Tüm Başvuru Durumları' : 'All Admission Statuses'}
              </option>
              <option value="OPEN">
                {currentLang === 'ar' ? '🟢 مفتوح للتسجيل' : currentLang === 'tr' ? '🟢 Başvuru Açık' : '🟢 Open for Admission'}
              </option>
              <option value="UPCOMING">
                {currentLang === 'ar' ? '🟡 يفتح قريباً' : currentLang === 'tr' ? '🟡 Yakında Açılacak' : '🟡 Opening Soon'}
              </option>
              <option value="CLOSED">
                {currentLang === 'ar' ? '🔴 التقديم مغلق' : currentLang === 'tr' ? '🔴 Başvuru Kapalı' : '🔴 Closed'}
              </option>
              <option value="UNCONFIRMED">
                {currentLang === 'ar' ? '⚪ غير مؤكد' : currentLang === 'tr' ? '⚪ Doğrulanmadı' : '⚪ Unconfirmed'}
              </option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value })}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500 cursor-pointer text-slate-700"
            >
              <option value="ranking">
                {currentLang === 'ar' ? 'حسب الترتيب (الأعلى تصنيفاً)' : currentLang === 'tr' ? 'Sıralamaya Göre (En Yüksek)' : 'By National Rank'}
              </option>
              <option value="establishedYear">
                {currentLang === 'ar' ? 'حسب سنة التأسيس' : currentLang === 'tr' ? 'Kuruluş Yılına Göre' : 'By Established Year'}
              </option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>{t('search.clearBtn')}</span>
              </button>
            )}
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-slate-50"
          >
            <Filter className="w-4 h-4 text-brand-amber-600" />
            <span>
              {currentLang === 'ar' ? 'تصفية النتائج' : currentLang === 'tr' ? 'Sonuçları Filtrele' : 'Filter Results'}
            </span>
          </button>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-150">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">{t('search.city')}</label>
              <select
                value={city}
                onChange={(e) => updateFilters({ city: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              >
                <option value="">{t('search.allCities')}</option>
                {optionsData?.data?.cities?.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">{t('search.type')}</label>
              <select
                value={type}
                onChange={(e) => updateFilters({ type: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
              >
                <option value="">{t('search.allTypes')}</option>
                <option value="PRIVATE">{t('universities.private')}</option>
                <option value="PUBLIC">{t('universities.public')}</option>
              </select>
            </div>

            <div className="sm:col-span-2 pt-2 flex items-center justify-between">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-red-600 hover:underline"
                >
                  {t('search.clearBtn')}
                </button>
              )}
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="px-4 py-2 bg-brand-amber-500 text-white rounded-lg text-xs font-bold"
              >
                {currentLang === 'ar' ? 'تطبيق الفلاتر' : currentLang === 'tr' ? 'Filtreleri Uygula' : 'Apply Filters'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
        <span>{t('search.resultsFound', { count: data?.pagination?.total || 0 })}</span>
      </div>

      {/* Grid of University Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200 text-red-700 p-6">
          <p className="font-bold">
            {currentLang === 'ar' ? 'حدث خطأ أثناء تحميل بيانات الجامعات.' : currentLang === 'tr' ? 'Üniversite verileri yüklenirken bir hata oluştu.' : 'An error occurred while loading universities.'}
          </p>
          <p className="text-xs mt-1">{error?.message}</p>
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-brand-navy-950 font-cairo">
            {t('universities.noResults')}
          </h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            {currentLang === 'ar'
              ? 'جرّب تغيير معايير البحث أو تصفية المدن للحصول على نتائج مطابقة.'
              : currentLang === 'tr'
              ? 'Farklı arama kriterleri deneyerek veya filtreleri temizleyerek sonuç bulabilirsiniz.'
              : 'Try adjusting search terms or resetting filters to find matching institutions.'}
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2.5 rounded-xl bg-brand-amber-500 text-white text-xs font-bold shadow-md hover:bg-brand-amber-600 transition-colors"
          >
            {t('search.clearBtn')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.data?.map((uni) => (
            <UniversityCard key={uni.id} university={uni} />
          ))}
        </div>
      )}

      {/* Transparent Pricing Policy */}
      <PricingPolicyNotice className="mt-8" />

      {/* Pagination Controls */}
      {data?.pagination?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-8 pb-4">
          <button
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-brand-amber-500 hover:text-white hover:border-brand-amber-500 font-bold text-xs transition-all shadow-sm"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4 flip-in-rtl" />
            <span>{currentLang === 'ar' ? 'السابق' : currentLang === 'tr' ? 'Önceki' : 'Previous'}</span>
          </button>

          <span className="text-xs font-bold text-slate-800 px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 shadow-inner">
            {currentLang === 'ar'
              ? `الصفحة ${page} من ${data.pagination.totalPages}`
              : currentLang === 'tr'
              ? `Sayfa ${page} / ${data.pagination.totalPages}`
              : `Page ${page} of ${data.pagination.totalPages}`}
          </span>

          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => changePage(page + 1)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-brand-amber-500 hover:text-white hover:border-brand-amber-500 font-bold text-xs transition-all shadow-sm"
            aria-label="Next page"
          >
            <span>{currentLang === 'ar' ? 'التالي' : currentLang === 'tr' ? 'Sonraki' : 'Next'}</span>
            <ChevronRight className="w-4 h-4 flip-in-rtl" />
          </button>
        </div>
      )}
    </div>
  );
}
