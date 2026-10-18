import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, FileText, Clock, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

export default function ServiceDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['service', slug, currentLang],
    queryFn: () => api.getServiceBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-48 bg-slate-200 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-cairo">لم يتم العثور على الخدمة</h2>
        <Link to="/services" className="inline-block px-5 py-2.5 bg-brand-amber-500 text-white rounded-xl text-xs font-bold">
          العودة للخدمات
        </Link>
      </div>
    );
  }

  const service = data.data;

  const translation =
    service.translations?.find((tr) => tr.lang === currentLang) ||
    service.translations?.find((tr) => tr.lang === 'ar') ||
    service.translations?.[0] ||
    {};

  const title = translation.title || service.slug;
  const description = translation.description || '';
  const benefits = translation.benefits ? translation.benefits.split('\n') : [];
  const eligibility = translation.eligibility || '';

  let steps = [];
  try {
    if (translation.procedureSteps) {
      steps = typeof translation.procedureSteps === 'string' ? JSON.parse(translation.procedureSteps) : translation.procedureSteps;
    }
  } catch (e) {
    steps = [translation.procedureSteps];
  }

  let docs = [];
  try {
    if (translation.requiredDocuments) {
      docs = typeof translation.requiredDocuments === 'string' ? JSON.parse(translation.requiredDocuments) : translation.requiredDocuments;
    }
  } catch (e) {
    docs = [translation.requiredDocuments];
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-brand-amber-500/30">
        <div className="relative z-10 space-y-3">
          <span className="text-xs font-bold text-brand-amber-400 uppercase tracking-wider block">
            {t('services.title')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black font-cairo text-white">
            {title}
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Grid of Steps, Benefits, Docs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Procedure Steps */}
          {steps.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand-amber-500" />
                <span>{t('services.procedure')}</span>
              </h2>

              <ol className="relative border-s border-slate-200 ms-3 space-y-6">
                {steps.map((step, idx) => (
                  <li key={idx} className="ms-6">
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-brand-amber-500 text-white rounded-full -start-3 ring-4 ring-white text-xs font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Required Documents */}
          {docs.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-amber-500" />
                <span>{t('services.documents')}</span>
              </h2>

              <ul className="space-y-2.5">
                {docs.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-brand-amber-500 shrink-0" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {benefits.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{t('services.benefits')}</span>
              </h2>

              <ul className="space-y-2">
                {benefits.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar Request CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-brand-navy-950 font-cairo border-b border-slate-100 pb-3">
              طلب استشارة لهذه الخدمة
            </h3>

            {service.estimatedDuration && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="text-slate-400">المدة المتوقعة:</span>
                <span className="font-bold text-slate-800">{service.estimatedDuration}</span>
              </div>
            )}

            <p className="text-xs text-slate-500 leading-relaxed">
              فريقنا الأكاديمي جاهز لمساعدتك في استكمال جميع إجراءات هذه الخدمة بنجاح وأمان.
            </p>

            <Link
              to={`/contact?service=${encodeURIComponent(title)}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-sm shadow-md transition-all"
            >
              <span>طلب الخدمة الآن</span>
              <ArrowRight className="w-4 h-4 flip-in-rtl" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
