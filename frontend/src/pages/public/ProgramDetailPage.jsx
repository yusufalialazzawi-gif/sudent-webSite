import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  Clock,
  Globe,
  Building2,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  FileCheck,
  Tag,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

export default function ProgramDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['program', id, currentLang],
    queryFn: () => api.getProgramById(id),
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
        <h2 className="text-2xl font-bold text-slate-800 font-cairo">لم يتم العثور على البرنامج</h2>
        <Link to="/programs" className="inline-block px-5 py-2.5 bg-brand-amber-500 text-white rounded-xl text-xs font-bold">
          العودة للتخصصات
        </Link>
      </div>
    );
  }

  const program = data.data;

  const translation =
    program.translations?.find((tr) => tr.lang === currentLang) ||
    program.translations?.find((tr) => tr.lang === 'ar') ||
    program.translations?.[0] ||
    {};

  const uniTrans =
    program.university?.translations?.find((tr) => tr.lang === currentLang) ||
    program.university?.translations?.find((tr) => tr.lang === 'ar') ||
    program.university?.translations?.[0] ||
    {};

  const name = translation.name || program.slug;
  const faculty = translation.facultyName || '';
  const description = translation.description || '';
  const requirements = translation.requirements || '';
  const career = translation.careerOpportunities || '';
  const uniName = uniTrans.name || program.university?.slug || 'Turkish University';

  const hasDiscount = program.discountedTuition && program.discountedTuition < program.annualTuition;
  const discountPercent = hasDiscount
    ? Math.round(((program.annualTuition - program.discountedTuition) / program.annualTuition) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-brand-amber-500/30">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-amber-500 text-white">
              {program.degreeLevel}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-slate-200 border border-white/20">
              لغة الدراسة: {program.studyLanguage}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-cairo text-white">
            {name}
          </h1>

          {faculty && <p className="text-brand-amber-400 text-sm font-semibold">{faculty}</p>}

          <div className="pt-2 flex items-center gap-2 text-sm text-slate-300">
            <Building2 className="w-4 h-4 text-brand-amber-400" />
            <Link to={`/universities/${program.university?.slug}`} className="hover:underline font-bold text-white">
              {uniName}
            </Link>
            <span>({program.university?.city})</span>
          </div>
        </div>
      </div>

      {/* Program Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {description && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-amber-500" />
                <span>عن البرنامج والمحتوى الدراسي</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{description}</p>
            </div>
          )}

          {requirements && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-brand-amber-500" />
                <span>شروط القبول والمستندات المطلوبة</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{requirements}</p>
            </div>
          )}

          {career && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-amber-500" />
                <span>الآفاق المهنية وفرص العمل بعد التخرج</span>
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{career}</p>
            </div>
          )}
        </div>

        {/* Sidebar Info & Apply CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-base text-brand-navy-950 font-cairo border-b border-slate-100 pb-3">
              تفاصيل القسط والمدة
            </h3>

            <div>
              <span className="text-xs text-slate-500 block mb-1">الرسوم الدراسية السنوية:</span>
              {hasDiscount ? (
                <div>
                  <span className="text-xs text-slate-400 line-through block">
                    ${program.annualTuition.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-emerald-600 font-cairo">
                      ${program.discountedTuition.toLocaleString()}
                    </span>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      خصم {discountPercent}%
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-2xl font-black text-brand-navy-950 font-cairo">
                  ${program.annualTuition.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-slate-400 block mt-0.5">{program.currency} / العام الدراسي {program.academicYear}</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">مدة الدراسة:</span>
                <span className="font-bold text-slate-900">{program.durationYears} سنوات</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">حالة التقديم:</span>
                <span className="font-bold text-emerald-600">مفتوح للعام الحالي</span>
              </div>
            </div>

            <Link
              to={`/apply?program=${encodeURIComponent(name)}&university=${encodeURIComponent(uniName)}`}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-sm shadow-md btn-hover-lift transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>قدّم على هذا البرنامج الآن</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
