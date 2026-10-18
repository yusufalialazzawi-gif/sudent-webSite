import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Award, Calendar, CheckCircle2, FileText, ArrowRight, Sparkles } from 'lucide-react';
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
        <h2 className="text-2xl font-bold text-slate-800 font-cairo">لم يتم العثور على المنحة</h2>
        <Link to="/scholarships" className="inline-block px-5 py-2.5 bg-brand-amber-500 text-white rounded-xl text-xs font-bold">
          العودة للمنح
        </Link>
      </div>
    );
  }

  const scholarship = data.data;

  const translation =
    scholarship.translations?.find((tr) => tr.lang === currentLang) ||
    scholarship.translations?.find((tr) => tr.lang === 'ar') ||
    scholarship.translations?.[0] ||
    {};

  const title = translation.title || scholarship.slug;
  const description = translation.description || '';
  const eligibility = translation.eligibilityCriteria || '';
  const requiredDocs = translation.requiredDocuments || '';
  const benefits = translation.benefitsSummary || '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden h-72 bg-brand-navy-950 text-white shadow-xl flex items-end p-8 sm:p-10 border border-brand-amber-500/30">
        <img
          src={scholarship.imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/70 to-transparent"></div>

        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-amber-500 text-white inline-block">
            {scholarship.scholarshipType === 'FULL' ? 'منحة كاملة 100%' : `خصم حصري ${scholarship.discountPercentage}%`}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-cairo text-white">
            {title}
          </h1>
          {scholarship.deadline && (
            <p className="text-brand-amber-400 text-xs sm:text-sm font-semibold">
              الموعد النهائي للتقديم: {new Date(scholarship.deadline).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-brand-navy-950 font-cairo">
              تفاصيل ومميزات المنحة
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
            {benefits && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold">
                ✓ {benefits}
              </div>
            )}
          </div>

          {eligibility && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-brand-amber-500" />
                <span>{t('scholarships.eligibility')}</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">{eligibility}</p>
            </div>
          )}

          {requiredDocs && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-amber-500" />
                <span>الوثائق المطلوبة للتقديم</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">{requiredDocs}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-brand-navy-950 font-cairo border-b border-slate-100 pb-3">
              التقديم على المنحة
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              تضمن لك مؤسسة المجد للقبولات الجامعية التقديم الرسمي الصحيح ومراجعة ملفك لزيادة فرص القبول.
            </p>
            <Link
              to={`/apply?scholarship=${encodeURIComponent(title)}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-sm shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('scholarships.applyScholarship')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
