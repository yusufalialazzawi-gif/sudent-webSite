import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronLeft, ChevronRight, Building2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import UniversityCard from '../../components/common/UniversityCard';
import SfBreadcrumb from '../../components/common/SfBreadcrumb';

const COPY = {
  home: { ar: 'الرئيسية', tr: 'Ana Sayfa', en: 'Home' },
  privateCrumb: { ar: 'الجامعات الخاصة', tr: 'Vakıf Üniversiteleri', en: 'Private Universities' },
  publicCrumb: { ar: 'الجامعات الحكومية', tr: 'Devlet Üniversiteleri', en: 'State Universities' },
  privateTitle: {
    ar: 'الجامعات الخاصة في تركيا',
    tr: "Türkiye'deki Vakıf Üniversiteleri",
    en: 'Private Universities in Turkey',
  },
  publicTitle: {
    ar: 'الجامعات الحكومية في تركيا',
    tr: "Türkiye'deki Devlet Üniversiteleri",
    en: 'State Universities in Turkey',
  },
  typeLabel: { ar: 'نوع الجامعة', tr: 'Üniversite türü', en: 'University type' },
  searchLabel: { ar: 'ابحث باسم الجامعة', tr: 'Üniversite adıyla ara', en: 'Search by university name' },
  searchPlaceholder: { ar: 'اسم الجامعة...', tr: 'Üniversite adı...', en: 'University name...' },
  privateOption: { ar: 'خاصة', tr: 'Vakıf (Özel)', en: 'Private' },
  publicOption: { ar: 'حكومية', tr: 'Devlet', en: 'Public' },
  loadError: {
    ar: 'حدث خطأ أثناء تحميل بيانات الجامعات.',
    tr: 'Üniversite verileri yüklenirken bir hata oluştu.',
    en: 'Error loading universities.',
  },
  emptyTitle: {
    ar: 'لم يتم العثور على نتائج مطابقة',
    tr: 'Eşleşen Üniversite Bulunamadı',
    en: 'No Universities Found',
  },
  emptyBody: {
    ar: 'جرّب تعديل معايير البحث أو مسح كلمة البحث للوصول لكافة الجامعات.',
    tr: 'Farklı bir arama terimi deneyebilir veya aramayı temizleyebilirsiniz.',
    en: 'Try adjusting your search keywords.',
  },
  ctaTitle: {
    ar: 'تعلم كل شيء عن الدراسة في الجامعات الخاصة والمعتمدة',
    tr: 'Üniversite Başvurunuzu Uzmanlarımızla Güvenle Başlatın',
    en: 'Start Your University Journey Confidently With Our Experts',
  },
  ctaBody: {
    ar: 'نقدم لك الدعم الأكاديمي الشامل مجاناً؛ من اختيار التخصص الأنسب ومقارنة الرسوم إلى حجز مقعدك الجامعي المعتمد والحصول على خصم المنحة.',
    tr: '10 yılı aşkın tecrübemiz ve akredite acenteliklerimizle, en uygun bölümü seçmenizden burslu kabul belgenize kadar her adımda ücretsiz yanınızdayız.',
    en: 'With over 10 years of experience and certified partnerships, we guide you from program selection to official visa acceptance.',
  },
  ctaApply: { ar: 'سجل الآن مجاناً', tr: 'Hemen Başvur', en: 'Apply Now' },
  ctaWhatsapp: { ar: 'استشارة عبر واتساب', tr: 'WhatsApp Danışma', en: 'WhatsApp Advisor' },
};

const WHATSAPP_NUMBER = '905313971022';

const PAGE_CELL =
  'flex justify-center items-center transition-colors border border-[#dee2e6] py-[6px] px-[13px] rounded-lg min-w-[38px] min-h-[38.5px]';
const ARROW_CELL =
  'flex items-center justify-center py-[6px] px-[13px] rounded-lg min-w-[38px] min-h-[38.5px] border';

function pageWindow(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const visible = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const withGaps = [];
  visible.forEach((p, i) => {
    if (i > 0 && p - visible[i - 1] > 1) withGaps.push('gap');
    withGaps.push(p);
  });
  return withGaps;
}

export default function UniversitiesPage() {
  const { currentLang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const t = (key) => COPY[key][currentLang] || COPY[key].ar;

  const activeType = searchParams.get('type') === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE';
  const search = searchParams.get('search') || '';
  const page = Number.parseInt(searchParams.get('page') || '1', 10) || 1;
  const city = searchParams.get('city') || '';
  const isPrivate = activeType === 'PRIVATE';

  const [searchTerm, setSearchTerm] = useState(search);

  useEffect(() => {
    setSearchTerm(search);
  }, [search]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['universities', { search, type: activeType, page, city, currentLang }],
    queryFn: () =>
      api.getUniversities({
        search,
        type: activeType,
        page,
        limit: 12,
        city,
        sortBy: 'ranking',
        lang: currentLang,
      }),
  });

  const updateFilters = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) updated.set(key, value);
      else updated.delete(key);
    });
    updated.set('page', '1');
    setSearchParams(updated);
  };

  const changePage = (newPage) => {
    const updated = new URLSearchParams(searchParams);
    updated.set('page', String(newPage));
    setSearchParams(updated);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = data?.pagination?.totalPages || 1;
  const universities = data?.data || [];

  const title = isPrivate ? t('privateTitle') : t('publicTitle');
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'مرحباً، أرغب بالحصول على استشارة مجانية وقبول جامعي في تركيا.'
  )}`;

  return (
    <main className="w-full bg-[#fafafa] text-main-color mb-16">
      <SfBreadcrumb
        items={[
          { label: t('home'), to: '/' },
          { label: isPrivate ? t('privateCrumb') : t('publicCrumb') },
        ]}
        title={title}
      />

      <section className="sf-container px-4 flex flex-col gap-4">
        <div className="bg-white rounded-lg drop-shadow-sm p-4 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex flex-col gap-2 md:basis-1/2">
            <span className="text-base font-light text-[#707070]">{t('typeLabel')}</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => updateFilters({ type: 'PRIVATE' })}
                className={`h-10 px-4 rounded-lg text-base transition-colors border ${
                  isPrivate
                    ? 'bg-beer border-beer text-white font-bold'
                    : 'bg-white border-[#dee2e6] text-main-color font-light hover:bg-[#e9ecef]'
                }`}
              >
                {t('privateOption')}
              </button>
              <button
                type="button"
                onClick={() => updateFilters({ type: 'PUBLIC' })}
                className={`h-10 px-4 rounded-lg text-base transition-colors border ${
                  !isPrivate
                    ? 'bg-beer border-beer text-white font-bold'
                    : 'bg-white border-[#dee2e6] text-main-color font-light hover:bg-[#e9ecef]'
                }`}
              >
                {t('publicOption')}
              </button>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateFilters({ search: searchTerm });
            }}
            className="flex flex-col gap-2 md:basis-1/2"
          >
            <label htmlFor="university-search" className="text-base font-light text-[#707070]">
              {t('searchLabel')}
            </label>
            <div className="relative">
              <input
                id="university-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full h-10 px-3 pe-16 rounded-lg border border-[#dee2e6] bg-white text-base font-light text-main-color focus:outline-none focus:border-beer"
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="clear"
                  onClick={() => {
                    setSearchTerm('');
                    updateFilters({ search: '' });
                  }}
                  className="absolute end-9 top-1/2 -translate-y-1/2 text-[#707070] hover:text-main-color"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                aria-label="search"
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[#707070] hover:text-beer transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {isLoading ? (
          <article className="grid gap-8 px-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg drop-shadow-xl animate-pulse">
                <div className="w-full h-[240px] sm:h-[190px] md:h-[210px] xl:h-[250px] rounded-t-lg bg-gray-200" />
                <div className="p-4 border-b border-[#dee2e6]">
                  <div className="h-6 w-2/3 rounded bg-gray-200" />
                </div>
                <div className="flex justify-between p-4">
                  <div className="h-6 w-24 rounded bg-gray-200" />
                  <div className="h-8 w-28 rounded-lg bg-gray-200" />
                </div>
              </div>
            ))}
          </article>
        ) : isError ? (
          <div className="bg-white rounded-lg drop-shadow-xl p-6 text-center">
            <p className="text-xl font-bold text-main-color">{t('loadError')}</p>
            <p className="text-base font-light text-[#707070] mt-2">{error?.message}</p>
          </div>
        ) : universities.length === 0 ? (
          <div className="bg-white rounded-lg drop-shadow-xl p-8 text-center flex flex-col items-center gap-3">
            <Building2 className="w-16 h-16 text-[#dee2e6]" />
            <h2 className="text-xl font-bold text-metallic-blue">{t('emptyTitle')}</h2>
            <p className="text-base font-light text-[#707070] max-w-md">{t('emptyBody')}</p>
          </div>
        ) : (
          <article className="grid gap-8 px-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto w-full">
            {universities.map((university) => (
              <UniversityCard key={university.id || university.slug} university={university} />
            ))}
          </article>
        )}

        {totalPages > 1 && (
          <nav className="mt-8" aria-label="Pagination">
            <ul className="flex flex-wrap justify-center items-center max-w-full gap-2 sm:gap-4">
              <li>
                {page <= 1 ? (
                  <div
                    className={`${ARROW_CELL} cursor-not-allowed text-gray-300`}
                    aria-label="disabled"
                  >
                    <ChevronRight className="w-4 h-4 ltr:rotate-180" />
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label="previous"
                    onClick={() => changePage(page - 1)}
                    className={`${ARROW_CELL} hover:bg-[#e9ecef] text-main-color`}
                  >
                    <ChevronRight className="w-4 h-4 ltr:rotate-180" />
                  </button>
                )}
              </li>

              {pageWindow(page, totalPages).map((entry, index) =>
                entry === 'gap' ? (
                  <li key={`gap-${index}`} className="font-light text-base">
                    <div className={`${PAGE_CELL} bg-white`}>...</div>
                  </li>
                ) : (
                  <li key={entry} className="font-light text-base">
                    <button
                      type="button"
                      aria-current={entry === page ? 'page' : undefined}
                      onClick={() => changePage(entry)}
                      className={`${PAGE_CELL} hover:bg-[#e9ecef] ${
                        entry === page ? 'bg-[#e9ecef]' : 'bg-white'
                      }`}
                    >
                      {entry}
                    </button>
                  </li>
                )
              )}

              <li>
                {page >= totalPages ? (
                  <div
                    className={`${ARROW_CELL} cursor-not-allowed text-gray-300`}
                    aria-label="disabled"
                  >
                    <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
                  </div>
                ) : (
                  <button
                    type="button"
                    aria-label="next"
                    onClick={() => changePage(page + 1)}
                    className={`${ARROW_CELL} hover:bg-[#e9ecef] text-main-color`}
                  >
                    <ChevronLeft className="w-4 h-4 ltr:rotate-180" />
                  </button>
                )}
              </li>
            </ul>
          </nav>
        )}

        <div className="mt-8 bg-white rounded-lg drop-shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <h2 className="text-xl sm:text-[1.375rem] font-bold text-main-color">{t('ctaTitle')}</h2>
            <p className="text-base font-light text-[#707070] leading-[1.9]">{t('ctaBody')}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/apply"
              className="inline-flex justify-center items-center bg-beer hover:bg-vivid-tangelo text-white rounded-lg py-2 px-4 text-base transition-colors"
            >
              {t('ctaApply')}
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center bg-white hover:bg-[#e9ecef] text-main-color border border-[#dee2e6] rounded-lg py-2 px-4 text-base transition-colors"
            >
              {t('ctaWhatsapp')}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
