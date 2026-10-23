import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Award, Calendar, CheckCircle2, FileText, ArrowRight, Sparkles, ExternalLink, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

export default function ScholarshipDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['scholarship', slug, currentLang],
    queryFn: () => api.getScholarshipBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-cairo">
          {currentLang === 'ar' ? 'لم يتم العثور على المنحة' : currentLang === 'tr' ? 'Burs Bulunamadı' : 'Scholarship Not Found'}
        </h2>
        <Link to="/scholarships" className="inline-block px-5 py-2.5 bg-brand-amber-500 text-white rounded-xl text-xs font-bold">
          {currentLang === 'ar' ? 'العودة للمنح' : currentLang === 'tr' ? 'Tüm Burslara Dön' : 'Back to Scholarships'}
        </Link>
      </div>
    );
  }

  const scholarship = data.data;

  const translation =
    scholarship.translations?.find((tr) => tr.lang === currentLang) ||
    scholarship.translations?.find((tr) => tr.lang === 'tr') ||
    scholarship.translations?.find((tr) => tr.lang === 'ar') ||
    scholarship.translations?.[0] ||
    {};

  const title = translation.title || scholarship.slug;
  const description = translation.description || '';
  const eligibility = translation.eligibilityCriteria || '';
  const requiredDocs = translation.requiredDocuments || '';
  const benefits = translation.benefitsSummary || '';

  // Extract official link if available
  const allText = `${requiredDocs} ${description}`;
  const urlMatch = allText.match(/https?:\/\/[^\s\)\<\"]+/i);
  const officialUrl = urlMatch ? urlMatch[0].replace(/[.,;]$/, '') : null;

  const isFull = scholarship.scholarshipType === 'FULL';
  const isPartial = scholarship.scholarshipType === 'PARTIAL';

  const badgeText = isFull
    ? (currentLang === 'ar' ? 'منحة كاملة 100%' : currentLang === 'tr' ? 'Tam Burslu Program' : '100% Full Scholarship')
    : isPartial
    ? (currentLang === 'ar' ? 'منحة ودعم مالي شهري' : currentLang === 'tr' ? 'Nakit Burs & Maddi Destek' : 'Monthly Cash Grant')
    : (scholarship.discountPercentage
        ? `%${scholarship.discountPercentage} ${currentLang === 'ar' ? 'منحة جزئية' : currentLang === 'tr' ? 'Kısmi Burs' : 'Partial Scholarship'}`
        : (currentLang === 'ar' ? 'منحة دراسية' : currentLang === 'tr' ? 'Eğitim Bursu' : 'Academic Scholarship'));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden min-h-[18rem] bg-brand-navy-950 text-white shadow-2xl flex items-end p-6 sm:p-10 border border-brand-amber-500/30">
        <img
          src={scholarship.imageUrl || 'https://images.unsplash.com/photo-1507842229451-7f01be837a2b?w=1200&auto=format&fit=crop&q=80'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/80 to-transparent"></div>

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-lg text-xs font-bold bg-brand-amber-500 text-slate-950 shadow-md">
              {badgeText}
            </span>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md ${
              scholarship.status === 'ACTIVE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
            }`}>
              {scholarship.status === 'ACTIVE'
                ? (currentLang === 'ar' ? '🟢 متاح للتسجيل' : currentLang === 'tr' ? '🟢 Başvuru Açık' : '🟢 Open')
                : (currentLang === 'ar' ? '🟡 يفتح قريباً' : currentLang === 'tr' ? '🟡 Yakında' : '🟡 Upcoming')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-cairo text-white leading-tight">
            {title}
          </h1>

          {scholarship.deadline && (
            <p className="text-brand-amber-400 text-xs sm:text-sm font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>
                {currentLang === 'ar' ? 'الموعد النهائي للتقديم:' : currentLang === 'tr' ? 'Son Başvuru Tarihi:' : 'Application Deadline:'}{' '}
                {new Date(scholarship.deadline).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : currentLang === 'tr' ? 'tr-TR' : 'en-US')}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Critical Status & Eligibility Notice Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-brand-amber-500/40 text-brand-navy-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-brand-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed space-y-1">
          <strong className="block font-bold">
            {currentLang === 'ar'
              ? 'تنبيه وأمر هام حول شروط القبول:'
              : currentLang === 'tr'
              ? 'Önemli Ayrım ve Başvuru Şartları Uyarısı:'
              : 'Important Notice on Eligibility & Status:'}
          </strong>
          <p className="text-slate-700 text-xs">
            {currentLang === 'ar'
              ? 'بعض المنح الدراسية متاحة لجميع الطلاب الدوليين، بينما يقتصر بعضها على حاملي صفة الحماية الدولية أو المؤقتة أو تخصصات معينة. وجود المنحة لا يعني بالضرورة مطابقة شروطك؛ يرجى مراجعة معايير كل برنامج بعناية.'
              : currentLang === 'tr'
              ? 'Bazı burslar bütün yabancı öğrencilere açıkken bazıları yalnızca uluslararası koruma statüsündeki öğrencilere veya belirli şartları sağlayan adaylara yöneliktir. Bir bursun mevcut olması, senin başvuru şartlarını karşıladığın anlamına gelmez.'
              : 'Certain scholarships are open to all international students, while others target specific protection statuses or academic fields. Please verify detailed criteria before applying.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Details Column */}
        <div className="lg:col-span-8 space-y-8">
          {/* Overview & Benefits */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-amber-500" />
              <span>
                {currentLang === 'ar' ? 'تفاصيل ومميزات المنحة' : currentLang === 'tr' ? 'Burs Detayları ve Destek Kapsamı' : 'Scholarship Overview & Coverage'}
              </span>
            </h2>

            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">{description}</p>

            {benefits && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{benefits}</span>
              </div>
            )}
          </div>

          {/* Eligibility Criteria */}
          {eligibility && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-amber-500" />
                <span>
                  {currentLang === 'ar' ? 'شروط الأهلية ومن يحق له التقديم' : currentLang === 'tr' ? 'Kimler Başvurabilir ve Uygunluk Şartları' : 'Eligibility & Requirements'}
                </span>
              </h2>
              <div className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                {eligibility}
              </div>
            </div>
          )}

          {/* Required Documents & Calendar */}
          {requiredDocs && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-amber-500" />
                <span>
                  {currentLang === 'ar' ? 'الوثائق المطلوبة والتقويم الرسمي' : currentLang === 'tr' ? 'Gereken Belgeler ve Başvuru Takvimi' : 'Required Documents & Timeline'}
                </span>
              </h2>
              <div className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                {requiredDocs}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Actions Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-24">
            <h3 className="font-bold text-base text-brand-navy-950 font-cairo border-b border-slate-100 pb-3">
              {currentLang === 'ar' ? 'خيارات التقديم والمساعدة' : currentLang === 'tr' ? 'Başvuru ve Danışmanlık' : 'Application Options'}
            </h3>

            {/* Official Portal Button if available */}
            {officialUrl && (
              <a
                href={officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-brand-navy-950 hover:bg-brand-navy-900 text-white font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
              >
                <ExternalLink className="w-4 h-4 text-brand-amber-400" />
                <span>
                  {currentLang === 'ar' ? 'بوابة التقديم الرسمية المباشرة' : currentLang === 'tr' ? 'Resmî Başvuru Ekranına Git' : 'Official Application Portal'}
                </span>
              </a>
            )}

            <p className="text-slate-600 text-xs leading-relaxed">
              {currentLang === 'ar'
                ? 'فريق الاستشارات الأكاديمية يساعدك في تجهيز أوراقك والتأكد من مطابقة شروط القبول للحصول على أعلى فرصة قبول.'
                : currentLang === 'tr'
                ? 'Uzman eğitim danışmanlarımız başvuru evraklarınızı inceleyerek uygunluk durumunuzu değerlendirir ve resmi kabul sürecinizi destekler.'
                : 'Our academic guidance advisors assist you in organizing documents and maximizing scholarship acceptance.'}
            </p>

            <Link
              to={`/apply?scholarship=${encodeURIComponent(title)}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-black text-xs shadow-lg shadow-brand-amber-500/25 transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {currentLang === 'ar' ? 'طلب مساعدة وتجهيز الملف' : currentLang === 'tr' ? 'Danışmanlıkla Başvuru Yap' : 'Apply with Sora Education'}
              </span>
            </Link>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 text-center">
              {currentLang === 'ar' ? 'استشارة مبدئية مجانية 100%' : currentLang === 'tr' ? '%100 Ücretsiz Ön Bilgilendirme' : 'Free Initial Guidance'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
