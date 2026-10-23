import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search, Calendar, Clock, BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import BlogCard from '../../components/common/BlogCard';

export default function BlogPage() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [searchTerm, setSearchTerm] = useState(search);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['articles', { search, category, page, currentLang }],
    queryFn: () =>
      api.getArticles({
        search,
        category,
        page,
        limit: 9,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block">
          {t('blog.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy-950 font-cairo">
          {currentLang === 'ar'
            ? 'مدونة الدراسة والحياة الطلابية في تركيا'
            : currentLang === 'tr'
            ? 'Türkiye’de Eğitim ve Öğrenci Yaşamı Blogu'
            : 'Study & Student Life in Turkey Blog'}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          {t('blog.subtitle')}
        </p>

        {/* Categories Pills */}
        <div className="flex items-center justify-center gap-2 pt-4 flex-wrap">
          <button
            onClick={() => updateFilters({ category: '' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              !category ? 'bg-brand-navy-950 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {currentLang === 'ar' ? 'جميع المقالات' : currentLang === 'tr' ? 'Tüm Yazılar' : 'All Articles'}
          </button>
          <button
            onClick={() => updateFilters({ category: 'LIVING' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              category === 'LIVING' ? 'bg-brand-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {currentLang === 'ar' ? 'تكاليف المعيشة' : currentLang === 'tr' ? 'Yaşam Maliyetleri' : 'Cost of Living'}
          </button>
          <button
            onClick={() => updateFilters({ category: 'GUIDE' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              category === 'GUIDE' ? 'bg-brand-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {currentLang === 'ar' ? 'دليل الإقامة والقبول' : currentLang === 'tr' ? 'İkamet & Başvuru Rehberi' : 'Residence & Admissions Guide'}
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
          {error?.message || (currentLang === 'ar' ? 'حدث خطأ في تحميل المقالات.' : currentLang === 'tr' ? 'Makaleler yüklenirken bir hata oluştu.' : 'Failed to load blog articles.')}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((article) => (
            <BlogCard key={article.id} article={article} />
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
