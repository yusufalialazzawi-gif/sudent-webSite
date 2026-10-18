import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Award,
  Globe,
  Building,
  Calendar,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Home,
  FileCheck,
  Search,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import UniversityCard from '../../components/common/UniversityCard';

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const [progSearch, setProgSearch] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['university', slug, currentLang],
    queryFn: () => api.getUniversityBySlug(slug, currentLang),
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-8 animate-pulse">
        <div className="h-96 rounded-3xl bg-slate-200"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-3xl"></div>
          <div className="h-96 bg-slate-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-cairo">لم يتم العثور على الجامعة المطلوبة</h2>
        <p className="text-slate-500 text-sm">{error?.message || 'تأكد من صحة الرابط أو تصفح قائمة الجامعات.'}</p>
        <Link
          to="/universities"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-amber-500 text-white font-bold text-sm shadow-md"
        >
          <span>تصفح قائمة الجامعات</span>
          <ArrowRight className="w-4 h-4 flip-in-rtl" />
        </Link>
      </div>
    );
  }

  const university = data.data;
  const related = data.related || [];

  const translation =
    university.translations?.find((tr) => tr.lang === currentLang) ||
    university.translations?.find((tr) => tr.lang === 'ar') ||
    university.translations?.[0] ||
    {};

  const name = translation.name || university.slug;
  const overview = translation.overview || '';
  const admissionReqs = translation.admissionRequirements || '';
  const accommodation = translation.accommodationInfo || '';
  const accreditation = translation.accreditationInfo || '';
  const address = translation.address || `${university.city}, Turkey`;
  const isPrivate = university.type === 'PRIVATE';

  // Filter programs in this university
  const filteredPrograms = (university.programs || []).filter((prog) => {
    const pTrans =
      prog.translations?.find((t) => t.lang === currentLang) ||
      prog.translations?.find((t) => t.lang === 'ar') ||
      prog.translations?.[0] ||
      {};
    const pName = (pTrans.name || prog.slug).toLowerCase();
    const matchesSearch = !progSearch || pName.includes(progSearch.toLowerCase());
    const matchesDegree = !selectedDegree || prog.degreeLevel === selectedDegree;
    return matchesSearch && matchesDegree;
  });

  return (
    <div className="space-y-12 pb-20">
      {/* 1. HERO COVER HEADER */}
      <section className="relative bg-brand-navy-950 text-white pt-10 pb-16">
        <div className="absolute inset-0 opacity-25">
          <img
            src={university.coverImageUrl || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80'}
            alt={name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/80 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold">
            <Link to="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
            <span>/</span>
            <Link to="/universities" className="hover:text-white transition-colors">{t('nav.universities')}</Link>
            <span>/</span>
            <span className="text-brand-amber-400 truncate max-w-xs">{name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 shadow-2xl border-2 border-white/80 shrink-0 overflow-hidden">
                <img
                  src={university.logoUrl || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80'}
                  alt={name}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                    isPrivate ? 'bg-brand-amber-500 text-white' : 'bg-brand-navy-800 text-white border border-white/20'
                  }`}>
                    {isPrivate ? t('universities.private') : t('universities.public')}
                  </span>
                  {university.ranking && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>المرتبة #{university.ranking} في تركيا</span>
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-cairo text-white leading-tight">
                  {name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-brand-amber-400" />
                    <span>{university.city}</span>
                  </span>
                  {university.establishedYear && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brand-amber-400" />
                      <span>تأسست عام {university.establishedYear}</span>
                    </span>
                  )}
                  {university.websiteUrl && (
                    <a
                      href={university.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-brand-amber-400 hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>الموقع الرسمي</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Apply Header CTA */}
            <div className="shrink-0 pt-2 md:pt-0">
              <Link
                to={`/apply?university=${encodeURIComponent(name)}`}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-sm shadow-xl shadow-brand-amber-500/20 btn-hover-lift transition-all w-full sm:w-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('universities.applyToUni')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN DETAILS & PROGRAMS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main 8-Cols: Overview, Program Table, Requirements */}
          <div className="lg:col-span-8 space-y-10">
            {/* Overview Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <Building className="w-5 h-5 text-brand-amber-500" />
                <span>نبذة عن الجامعة ومكانتها الأكاديمية</span>
              </h2>
              <div className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                {overview}
              </div>
            </div>

            {/* Accreditation & Global Recognition */}
            {accreditation && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 space-y-3">
                <h3 className="text-lg font-bold text-emerald-950 font-cairo flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>{t('universities.accreditation')}</span>
                </h3>
                <p className="text-emerald-900 text-sm leading-relaxed">
                  {accreditation}
                </p>
              </div>
            )}

            {/* PROGRAMS SEARCHABLE & SORTABLE TABLE */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-brand-amber-500" />
                    <span>{t('universities.faculties')} ({filteredPrograms.length})</span>
                  </h2>
                  <p className="text-slate-500 text-xs mt-1">
                    قائمة معتمدة ومحدثة للعام الدراسي 2026-2027 بالأقساط الأصلية والمخفضة
                  </p>
                </div>

                {/* Filter selects for programs */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedDegree}
                    onChange={(e) => setSelectedDegree(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500"
                  >
                    <option value="">{t('search.allDegrees')}</option>
                    <option value="BACHELOR">بكالوريوس</option>
                    <option value="MASTER_WITH_THESIS">ماجستير</option>
                    <option value="PHD">دكتوراه</option>
                    <option value="ASSOCIATE">دبلوم</option>
                  </select>

                  <div className="relative w-44">
                    <input
                      type="text"
                      value={progSearch}
                      onChange={(e) => setProgSearch(e.target.value)}
                      placeholder="ابحث بالتخصص..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-amber-500 pe-7"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Programs Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 text-start">
                      <th className="p-4 text-start">التخصص والكلية</th>
                      <th className="p-4 text-start">الدرجة واللغة</th>
                      <th className="p-4 text-start">المدة</th>
                      <th className="p-4 text-start">القسط السنوي</th>
                      <th className="p-4 text-center">التقديم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPrograms.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-slate-400">
                          لم يتم العثور على تخصصات مطابقة لبحثك.
                        </td>
                      </tr>
                    ) : (
                      filteredPrograms.map((prog) => {
                        const pt =
                          prog.translations?.find((t) => t.lang === currentLang) ||
                          prog.translations?.find((t) => t.lang === 'ar') ||
                          prog.translations?.[0] ||
                          {};
                        const pName = pt.name || prog.slug;
                        const faculty = pt.facultyName || '';
                        const hasDiscount = prog.discountedTuition && prog.discountedTuition < prog.annualTuition;
                        const discount = hasDiscount
                          ? Math.round(((prog.annualTuition - prog.discountedTuition) / prog.annualTuition) * 100)
                          : 0;

                        return (
                          <tr key={prog.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-4 font-semibold text-slate-900">
                              <div className="font-bold text-brand-navy-950 font-cairo text-sm">
                                {pName}
                              </div>
                              {faculty && <div className="text-[11px] text-slate-500">{faculty}</div>}
                            </td>
                            <td className="p-4">
                              <div className="font-semibold text-slate-800">{prog.degreeLevel}</div>
                              <div className="text-[11px] text-brand-amber-600 font-bold">{prog.studyLanguage}</div>
                            </td>
                            <td className="p-4 text-slate-600 font-medium">
                              {prog.durationYears} سنوات
                            </td>
                            <td className="p-4">
                              {hasDiscount ? (
                                <div>
                                  <span className="text-slate-400 line-through text-[11px] block">
                                    ${prog.annualTuition.toLocaleString()}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-emerald-600 font-black text-sm font-cairo">
                                      ${prog.discountedTuition.toLocaleString()}
                                    </span>
                                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded">
                                      -{discount}%
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="font-black text-slate-900 text-sm font-cairo">
                                  ${prog.annualTuition.toLocaleString()}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 block">{prog.currency} / سنوي</span>
                            </td>
                            <td className="p-4 text-center">
                              <Link
                                to={`/apply?university=${encodeURIComponent(name)}&program=${encodeURIComponent(pName)}`}
                                className="inline-block px-3.5 py-1.5 rounded-lg bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-xs transition-colors shadow-sm"
                              >
                                {t('nav.applyNow')}
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Admission Requirements & Accommodation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {admissionReqs && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-brand-amber-500" />
                    <span>{t('universities.admissionReqs')}</span>
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {admissionReqs}
                  </p>
                </div>
              )}

              {accommodation && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
                  <h3 className="text-base font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                    <Home className="w-5 h-5 text-brand-amber-500" />
                    <span>{t('universities.accommodation')}</span>
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {accommodation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right 4-Cols: Quick Facts, Application CTA, Direct Contact */}
          <div className="lg:col-span-4 space-y-6">
            {/* Direct University Application Box */}
            <div className="bg-gradient-to-br from-brand-navy-950 to-brand-navy-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-brand-amber-500/30 space-y-5">
              <span className="text-[11px] font-bold text-brand-amber-400 uppercase tracking-wider block">
                تسجيل فوري ومضمون
              </span>
              <h3 className="text-xl font-bold font-cairo text-white">
                احصل على قبولك في {name}
              </h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                املأ نموذج التقديم وسيقوم فريقنا الأكاديمي باستخراج قبولك المبدئي خلال 48 ساعة دون أي رسوم وساطة مع خصم حصري على الأقساط.
              </p>

              <Link
                to={`/apply?university=${encodeURIComponent(name)}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-sm shadow-lg shadow-brand-amber-500/25 btn-hover-lift transition-all"
              >
                <span>قدّم طلبك لهذه الجامعة الآن</span>
                <ArrowRight className="w-4 h-4 flip-in-rtl" />
              </Link>
            </div>

            {/* Quick Facts Summary */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-sm text-brand-navy-950 font-cairo border-b border-slate-100 pb-3">
                معلومات سريعة
              </h4>
              <ul className="space-y-3 text-xs text-slate-600">
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">النوع:</span>
                  <span className="font-bold text-slate-800">{isPrivate ? 'جامعة خاصة' : 'جامعة حكومية'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">المدينة:</span>
                  <span className="font-bold text-slate-800">{university.city}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">سنة التأسيس:</span>
                  <span className="font-bold text-slate-800">{university.establishedYear || '—'}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-400">العنوان:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[180px]">{address}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RELATED UNIVERSITIES */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-brand-navy-950 font-cairo mb-6">
            جامعات أخرى في {university.city}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((u) => (
              <UniversityCard key={u.id} university={u} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
