import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight, FileText, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import BlogCard from '../../components/common/BlogCard';
import SfBreadcrumb from '../../components/common/SfBreadcrumb';

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

  const pageTitle =
    currentLang === 'ar'
      ? 'مدونة الدراسة في تركيا'
      : currentLang === 'tr'
      ? 'Türkiye’de Eğitim Rehberi Blogu'
      : 'Study in Turkey Guide Blog';

  return (
    <main className="w-full bg-[#fafafa] text-main-color mb-16">
      <SfBreadcrumb
        items={[
          { label: currentLang === 'ar' ? 'الرئيسية' : 'Ana Sayfa', to: '/' },
          { label: currentLang === 'ar' ? 'المدونة' : 'Blog' },
        ]}
        title={pageTitle}
      />

      {/* Hero Header & Filter Bar */}
      <section className="sf-container px-4 mt-6">
        <div className="bg-white rounded-lg drop-shadow-xl p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#dee2e6] pb-6">
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-beer uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>{currentLang === 'ar' ? 'مقالات وأدلة حصرية' : 'Özel Rehber ve Yazılar'}</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-main-color">
                {pageTitle}
              </h1>
              <p className="text-sm font-light text-[#707070] max-w-2xl leading-relaxed">
                {currentLang === 'ar'
                  ? 'اكتشف كل ما يهمك حول شروط القبول، تكاليف المعيشة، التأشيرة والسكن الجامعي في تركيا.'
                  : 'Türkiye’de üniversite kabul şartları, yaşam maliyetleri ve öğrenci vizesi hakkında güncel makaleler.'}
              </p>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80 shrink-0">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={currentLang === 'ar' ? 'ابحث في المقالات...' : 'Makalelerde ara...'}
                className="w-full h-11 px-4 pe-11 rounded-lg border border-[#dee2e6] bg-white text-sm outline-none focus:border-beer transition-colors"
              />
              <button
                type="submit"
                className="absolute end-1 top-1/2 -translate-y-1/2 w-9 h-9 rounded-md bg-beer hover:bg-vivid-tangelo text-white flex items-center justify-center transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Categories Filter Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => updateFilters({ category: '' })}
              className={`py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                !category
                  ? 'bg-beer text-white shadow-xs'
                  : 'bg-[#f7f5f2] border border-[#dee2e6] text-[#707070] hover:text-main-color'
              }`}
            >
              {currentLang === 'ar' ? 'جميع المقالات' : 'Tüm Yazılar'}
            </button>
            <button
              onClick={() => updateFilters({ category: 'LIVING' })}
              className={`py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                category === 'LIVING'
                  ? 'bg-beer text-white shadow-xs'
                  : 'bg-[#f7f5f2] border border-[#dee2e6] text-[#707070] hover:text-main-color'
              }`}
            >
              {currentLang === 'ar' ? 'تكاليف المعيشة والسكن' : 'Yaşam Maliyetleri'}
            </button>
            <button
              onClick={() => updateFilters({ category: 'GUIDE' })}
              className={`py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                category === 'GUIDE'
                  ? 'bg-beer text-white shadow-xs'
                  : 'bg-[#f7f5f2] border border-[#dee2e6] text-[#707070] hover:text-main-color'
              }`}
            >
              {currentLang === 'ar' ? 'دليل الإقامة والقبول الجامعي' : 'İkamet & Başvuru Rehberi'}
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="sf-container px-4 mt-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-lg bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 bg-white rounded-lg drop-shadow-md text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-vivid-tangelo" />
            <p className="text-base font-bold text-main-color">
              {error?.message || (currentLang === 'ar' ? 'حدث خطأ في تحميل المقالات.' : 'Makaleler yüklenirken bir hata oluştu.')}
            </p>
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="p-12 bg-white rounded-lg drop-shadow-md text-center text-[#707070]">
            {currentLang === 'ar' ? 'لا توجد مقالات مطابقة لبحثك.' : 'Aramanızla eşleşen makale bulunamadı.'}
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
          <div className="flex items-center justify-center gap-2 pt-10">
            <button
              disabled={page <= 1}
              onClick={() => updateFilters({ page: page - 1 })}
              className="p-2.5 rounded-lg border border-[#dee2e6] bg-white text-main-color disabled:opacity-40 hover:border-beer transition-colors"
            >
              <ChevronLeft className="w-5 h-5 flip-in-rtl" />
            </button>
            <span className="text-sm font-bold px-4 py-2 bg-white border border-[#dee2e6] rounded-lg">
              {page} / {data.pagination.totalPages}
            </span>
            <button
              disabled={page >= data.pagination.totalPages}
              onClick={() => updateFilters({ page: page + 1 })}
              className="p-2.5 rounded-lg border border-[#dee2e6] bg-white text-main-color disabled:opacity-40 hover:border-beer transition-colors"
            >
              <ChevronRight className="w-5 h-5 flip-in-rtl" />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
