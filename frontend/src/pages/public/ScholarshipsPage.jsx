import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Award, Sparkles, Search, X, AlertTriangle, ShieldCheck, Filter, ArrowRight, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import ScholarshipCard from '../../components/common/ScholarshipCard';

export default function ScholarshipsPage() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['scholarships-page', currentLang],
    queryFn: () => api.getScholarships({ lang: currentLang }),
  });

  const scholarships = data?.data || [];

  // Filter tabs definition
  const tabs = [
    {
      id: 'all',
      label: currentLang === 'ar' ? 'جميع المنح (الكل)' : currentLang === 'tr' ? 'Tüm Burslar' : 'All Scholarships',
    },
    {
      id: 'cash',
      label: currentLang === 'ar' ? 'منح مالية ودعم شهري' : currentLang === 'tr' ? 'Nakit Burs & Aylık Destek' : 'Monthly Cash Grants',
    },
    {
      id: 't3',
      label: currentLang === 'ar' ? 'مؤسسة T3 والتكنولوجيا' : currentLang === 'tr' ? 'Teknoloji & T3 Vakfı' : 'Tech & T3 Foundation',
    },
    {
      id: 'protection',
      label: currentLang === 'ar' ? 'الحماية واللاجئون' : currentLang === 'tr' ? 'Koruma & Destek Statüsü' : 'Protection & Status',
    },
    {
      id: 'university',
      label: currentLang === 'ar' ? 'منح الجامعات' : currentLang === 'tr' ? 'Üniversite Bursları' : 'University Grants',
    },
  ];

  // Filtered scholarships
  const filteredScholarships = useMemo(() => {
    return scholarships.filter((sch) => {
      const translation =
        sch.translations?.find((tr) => tr.lang === currentLang) ||
        sch.translations?.find((tr) => tr.lang === 'tr') ||
        sch.translations?.find((tr) => tr.lang === 'ar') ||
        sch.translations?.[0] ||
        {};

      const title = (translation.title || sch.slug || '').toLowerCase();
      const description = (translation.description || '').toLowerCase();
      const benefits = (translation.benefitsSummary || '').toLowerCase();
      const eligibility = (translation.eligibilityCriteria || '').toLowerCase();
      const combined = `${title} ${description} ${benefits} ${eligibility}`;

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        if (!combined.includes(query)) return false;
      }

      // Tab category filter
      if (activeTab === 'cash') {
        const isCash =
          sch.scholarshipType === 'PARTIAL' ||
          combined.includes('tl') ||
          combined.includes('avro') ||
          combined.includes('euro') ||
          combined.includes('aylık') ||
          combined.includes('nakit') ||
          combined.includes('شهري') ||
          combined.includes('دعم مالي');
        if (!isCash) return false;
      } else if (activeTab === 't3') {
        const isT3 =
          sch.slug.includes('t3') ||
          sch.slug.includes('bayraktar') ||
          sch.slug.includes('yukselen-yildiz') ||
          combined.includes('t3') ||
          combined.includes('bayraktar') ||
          combined.includes('teknoloji');
        if (!isT3) return false;
      } else if (activeTab === 'protection') {
        const isProtection =
          sch.slug.includes('dafi') ||
          sch.slug.includes('unhcr') ||
          sch.slug.includes('ab-') ||
          sch.slug.includes('icmpd') ||
          combined.includes('koruma') ||
          combined.includes('mülteci') ||
          combined.includes('unhcr') ||
          combined.includes('dafi') ||
          combined.includes('icmpd') ||
          combined.includes('حماية') ||
          combined.includes('لاجئ');
        if (!isProtection) return false;
      } else if (activeTab === 'university') {
        const isUni =
          sch.universityId != null ||
          sch.slug.includes('universite') ||
          sch.slug.includes('sabanci') ||
          sch.slug.includes('koc') ||
          combined.includes('üniversite') ||
          combined.includes('جامع');
        if (!isUni) return false;
      }

      return true;
    });
  }, [scholarships, currentLang, searchQuery, activeTab]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-amber-500/10 border border-brand-amber-500/20 text-brand-amber-600 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {currentLang === 'ar'
              ? 'دليل 2026–2027 الرسمي للمنح'
              : currentLang === 'tr'
              ? '2026–2027 Resmî Burs ve Destek Rehberi'
              : '2026–2027 Official Scholarship Guide'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-navy-950 font-cairo leading-tight">
          {currentLang === 'ar'
            ? 'المنح والمساعدات المالية للطلاب الدوليين في تركيا'
            : currentLang === 'tr'
            ? 'Türkiye’de Yabancı Öğrenciler İçin Burs ve Maddi Destekler'
            : 'Scholarships & Financial Aid for International Students in Turkey'}
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {currentLang === 'ar'
            ? 'استكشف المنح الحكومية والخاصة المحدثة لعام 2026–2027: منحة VGM للطلاب الأجانب، منح DAFI وUNHCR، برامج وقف T3 وتكنولوجيا بايراكتار، والمنح الجامعية المستقلة.'
            : currentLang === 'tr'
            ? 'Vakıflar Genel Müdürlüğü (VGM), DAFI, UNHCR, AB Bursları, Özdemir Bayraktar ve T3 Vakfı dâhil olmak üzere yabancı öğrencilere açık 10 resmî burs ve maddi destek programı.'
            : 'Explore official government, foundation, and university scholarships for international students: VGM, DAFI, UNHCR, EU/ICMPD, T3 Foundation, and university grants.'}
        </p>
      </div>

      {/* Critical Status & Eligibility Notice Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-brand-amber-400/50 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand-amber-500/20 text-brand-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
          <h2 className="font-bold text-brand-navy-950 text-sm sm:text-base font-cairo">
            {currentLang === 'ar'
              ? 'تنبيه وأمر هام حول شروط القبول والأهلية القانونية:'
              : currentLang === 'tr'
              ? 'Önemli Ayrım: Başvuru ve Statü Şartları Uyarısı'
              : 'Important Notice: Status & Eligibility Requirements'}
          </h2>
          <p className="text-slate-700">
            {currentLang === 'ar'
              ? 'بعض المنح متاحة لكافة الطلاب الأجانب المسجلين في الجامعات التركية (مثل منحة VGM أو التخفيضات الجامعية)، بينما تقتصر منح أخرى حصراً على حاملي صفة الحماية الدولية أو المؤقتة أو لاجئي UNHCR (مثل DAFI، دعم المفوضية السامي، منح الاتحاد الأوروبي). وجود منحة معلنة لا يعني بالضرورة أهليتك التلقائية؛ يرجى فحص شروط كل جهة بعناية.'
              : currentLang === 'tr'
              ? 'Bazı burslar bütün yabancı uyruklu öğrencilere açıkken (örn. VGM Yabancı Öğrenci Bursu, Üniversite İndirimleri); bazıları yalnızca uluslararası koruma statüsündeki öğrencilere veya mültecilere yöneliktir (örn. DAFI, UNHCR Hibe Desteği, AB/ICMPD). Bir bursun mevcut olması, senin doğrudan başvuru şartlarını karşıladığın anlamına gelmez. Lütfen şartları dikkatle inceleyiniz.'
              : 'Certain scholarships are open to all international students (e.g. VGM, university discounts), while others strictly require international protection or refugee status (e.g. DAFI, UNHCR grants, EU/ICMPD). Please review each program’s specific criteria before applying.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                currentLang === 'ar'
                  ? 'ابحث باسم المنحة، المؤسسة (VGM, T3, DAFI, المفوضية...)'
                  : currentLang === 'tr'
                  ? 'Burs adı, kurum veya anahtar kelime ara (VGM, T3, DAFI, UNHCR...)'
                  : 'Search by scholarship name or organization (VGM, T3, DAFI...)'
              }
              className="w-full ps-10 pe-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-amber-500 focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Counter Badge */}
          <div className="flex items-center gap-2 self-end md:self-center text-xs font-semibold text-slate-500 whitespace-nowrap">
            <Award className="w-4 h-4 text-brand-amber-500" />
            <span>
              {currentLang === 'ar'
                ? `${filteredScholarships.length} منحة متوفرة`
                : currentLang === 'tr'
                ? `${filteredScholarships.length} Burs / Destek Listeleniyor`
                : `${filteredScholarships.length} Scholarships Available`}
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0 ps-1">
            <Filter className="w-3.5 h-3.5" />
          </span>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-brand-navy-950 text-white shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 bg-red-50 text-red-700 rounded-2xl text-center text-sm font-bold border border-red-200">
          {error?.message ||
            (currentLang === 'ar'
              ? 'حدث خطأ في تحميل المنح.'
              : currentLang === 'tr'
              ? 'Burslar yüklenirken bir hata oluştu.'
              : 'Failed to load scholarships.')}
        </div>
      ) : filteredScholarships.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
          <Award className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700 font-cairo">
            {currentLang === 'ar'
              ? 'لا توجد نتائج مطابقة لبحثك'
              : currentLang === 'tr'
              ? 'Arama kriterlerinize uygun burs bulunamadı'
              : 'No scholarships match your filters'}
          </h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            {currentLang === 'ar'
              ? 'جرب البحث بكلمات عامة أو اضغط على "جميع المنح" لإظهار القائمة الكاملة.'
              : currentLang === 'tr'
              ? 'Arama terimlerinizi kısaltmayı deneyebilir veya filtreleri sıfırlayabilirsiniz.'
              : 'Try clearing your search terms or selecting All Scholarships.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveTab('all');
            }}
            className="px-4 py-2 bg-brand-amber-500 text-white rounded-xl text-xs font-bold shadow-md hover:bg-brand-amber-600 transition-colors"
          >
            {currentLang === 'ar' ? 'إعادة ضبط الفلاتر' : currentLang === 'tr' ? 'Filtreleri Sıfırla' : 'Reset Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredScholarships.map((sch) => (
            <ScholarshipCard key={sch.id} scholarship={sch} />
          ))}
        </div>
      )}

      {/* Advisory Support Box */}
      <div className="bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-brand-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-start max-w-xl">
          <div className="inline-flex items-center gap-2 text-brand-amber-400 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>
              {currentLang === 'ar'
                ? 'استشارة وتوجيه أكاديمي مخصص'
                : currentLang === 'tr'
                ? 'Kişiye Özel Burs Danışmanlığı'
                : 'Personalized Scholarship Guidance'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-cairo text-white">
            {currentLang === 'ar'
              ? 'هل تحتاج مساعدة في إعداد ملفك للتقديم على المنح؟'
              : currentLang === 'tr'
              ? 'Hangi Bursa Uygun Olduğunuzu Birlikte Belirleyelim'
              : 'Need assistance preparing your scholarship application?'}
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {currentLang === 'ar'
              ? 'مستشارونا يفحصون وثائقك ووضعك القانوني مجاناً لتحديد المنح المتاحة لك ومساعدتك في الترجمة والتصديق والتسجيل.'
              : currentLang === 'tr'
              ? 'Uzman ekibimiz kimlik/ikamet durumunuzu ve akademik ortalamanızı değerlendirerek başvurabileceğiniz en uygun burs ve indirim programlarına yönlendirir.'
              : 'Our academic advisors evaluate your residence status and GPA to direct you toward the best scholarship opportunities.'}
          </p>
        </div>

        <Link
          to="/apply"
          className="px-6 py-3.5 bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-brand-amber-500/25 transition-all hover:scale-105 shrink-0 flex items-center gap-2"
        >
          <span>
            {currentLang === 'ar'
              ? 'احجز استشارة مجانية الآن'
              : currentLang === 'tr'
              ? 'Ücretsiz Burs Danışmanlığı Al'
              : 'Get Free Guidance'}
          </span>
          <ArrowRight className="w-4 h-4 flip-in-rtl" />
        </Link>
      </div>
    </div>
  );
}
