import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search, GraduationCap, Globe, BookOpen, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import ProgramCard from '../../components/common/ProgramCard';

export default function ProgramsPage() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const degreeLevel = searchParams.get('degreeLevel') || '';
  const studyLanguage = searchParams.get('language') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchTerm, setSearchTerm] = useState(search);

  // Categories
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.getCategories(),
  });

  // Programs query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['programs', { search, category, degreeLevel, studyLanguage, page, currentLang }],
    queryFn: () =>
      api.getPrograms({
        search,
        category,
        degreeLevel,
        studyLanguage,
        page,
        limit: 12,
        lang: currentLang,
      }),
  });

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) updated.set(k, v);
      else updated.delete(k);
    });
    updated.set('page', '1');
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters({ search: searchTerm });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="text-center sm:text-start">
        <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block mb-1">
          {t('programs.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy-950 font-cairo">
          {currentLang === 'ar' ? 'الدليل الشامل للتخصصات والبرامج الجامعية' : currentLang === 'tr' ? 'Kapsamlı Üniversite Bölümleri ve Programları Rehberi' : 'Comprehensive University Programs & Majors Directory'}
        </h1>
        <p className="text-slate-600 text-sm mt-1 max-w-2xl mx-auto sm:mx-0">
          {t('programs.subtitle')}
        </p>
      </div>

      {/* Category Pills */}
      {catData?.data && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => updateFilters({ category: '' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
              !category ? 'bg-brand-navy-950 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {currentLang === 'ar' ? 'جميع المجالات' : currentLang === 'tr' ? 'Tüm Alanlar' : 'All Fields'}
          </button>
          {catData.data.map((cat) => {
            const catName = currentLang === 'tr' ? cat.nameTr : currentLang === 'en' ? cat.nameEn : cat.nameAr;
            const isSelected = category === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => updateFilters({ category: cat.slug })}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                  isSelected ? 'bg-brand-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between w-full">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={currentLang === 'ar' ? 'ابحث باسم التخصص...' : currentLang === 'tr' ? 'Bölüm adına göre ara...' : 'Search by program name...'}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-none focus:ring-2 focus:ring-brand-amber-500 pe-8"
          />
          <Search className="w-4 h-4 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={degreeLevel}
            onChange={(e) => updateFilters({ degreeLevel: e.target.value })}
            className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
          >
            <option value="">{t('search.allDegrees')}</option>
            <option value="BACHELOR">{currentLang === 'ar' ? 'بكالوريوس' : currentLang === 'tr' ? 'Lisans' : 'Bachelor'}</option>
            <option value="MASTER_WITH_THESIS">{currentLang === 'ar' ? 'ماجستير بأطروحة' : currentLang === 'tr' ? 'Tezli Yüksek Lisans' : 'Master with Thesis'}</option>
            <option value="MASTER_NON_THESIS">{currentLang === 'ar' ? 'ماجستير بدون أطروحة' : currentLang === 'tr' ? 'Tezsiz Yüksek Lisans' : 'Master Non-Thesis'}</option>
            <option value="PHD">{currentLang === 'ar' ? 'دكتوراه' : currentLang === 'tr' ? 'Doktora' : 'PhD'}</option>
            <option value="ASSOCIATE">{currentLang === 'ar' ? 'دبلوم' : currentLang === 'tr' ? 'Ön Lisans' : 'Associate'}</option>
          </select>

          <select
            value={studyLanguage}
            onChange={(e) => updateFilters({ language: e.target.value })}
            className="flex-1 sm:flex-initial px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold"
          >
            <option value="">{t('search.allLanguages')}</option>
            <option value="ENGLISH">English</option>
            <option value="TURKISH">Türkçe</option>
          </select>

          {(search || category || degreeLevel || studyLanguage) && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-red-600 hover:bg-red-50 p-2 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Program Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl border border-red-200 text-center text-sm font-bold">
          {error?.message || (currentLang === 'ar' ? 'حدث خطأ في جلب التخصصات.' : currentLang === 'tr' ? 'Bölümler yüklenirken bir hata oluştu.' : 'Failed to load programs.')}
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 font-cairo">
            {currentLang === 'ar' ? 'لم يتم العثور على تخصصات مطابقة' : currentLang === 'tr' ? 'Aramanıza uygun bölüm bulunamadı' : 'No matching programs found'}
          </h3>
          <button onClick={clearAllFilters} className="mt-4 px-4 py-2 bg-brand-amber-500 text-white rounded-xl text-xs font-bold">
            {t('search.clearBtn')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data?.data?.map((prog) => (
            <ProgramCard key={prog.id} program={prog} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => updateFilters({ page: page - 1 })}
            className="p-2 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-40"
          >
            <ChevronLeft className="w-5 h-5 flip-in-rtl" />
          </button>
          <span className="text-xs font-bold px-4 py-2 bg-slate-100 rounded-xl">
            {page} / {data.pagination.totalPages}
          </span>
          <button
            disabled={page >= data.pagination.totalPages}
            onClick={() => updateFilters({ page: page + 1 })}
            className="p-2 rounded-xl border border-slate-200 text-slate-700 disabled:opacity-40"
          >
            <ChevronRight className="w-5 h-5 flip-in-rtl" />
          </button>
        </div>
      )}
    </div>
  );
}
