import React from 'react';
import { Award, BookOpen, Building2, ExternalLink, GraduationCap, Info } from 'lucide-react';

// Üniversite detay sayfası: "Kaç bölümü var?" + "En iyi bölümleri" paneli.
// Veriler admin panelinden girilir (güncel kaynak linki ve tarihi ile birlikte).
function parseBest(value) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const BASIS_LABEL = {
  LISANS: { tr: 'lisans bölümü', ar: 'قسم بكالوريوس', en: 'undergraduate departments' },
  LISANS_AND_ASSOCIATE: { tr: 'lisans + ön lisans programı', ar: 'برنامج بكالوريوس ودبلوم', en: 'undergraduate & associate programs' },
  ALL_PROGRAMS: { tr: 'program (lisans + lisansüstü)', ar: 'برنامج (بكالوريوس ودراسات عليا)', en: 'programs (UG + graduate)' },
  FACULTY_PAGES_SUMMED: { tr: 'bölüm (fakültelere göre)', ar: 'قسم (حسب الكليات)', en: 'departments (by faculty)' },
  UNVERIFIED: { tr: 'bölüm (yaklaşık)', ar: 'قسم (تقريبي)', en: 'departments (approx.)' },
};

export default function UniversityDepartmentsPanel({ university, currentLang, universityName }) {
  const best = parseBest(university.bestDepartments);
  const hasCounts = university.departmentCount || university.facultyCount || university.programCountGrad;

  if (!hasCounts && best.length === 0) return null;

  const label = (obj, fallback) => {
    const value = currentLang === 'tr' ? obj?.tr : currentLang === 'en' ? obj?.en : obj?.ar;
    return value || fallback;
  };

  const deptName = (row) =>
    (currentLang === 'tr' ? row.tr : currentLang === 'en' ? row.en : row.ar) || row.tr || row.en || row.ar;

  const deptReason = (row) =>
    (currentLang === 'ar' ? row.reasonAr || row.reason : currentLang === 'en' ? row.reasonEn || row.reason : row.reason) ||
    row.reason ||
    row.reasonAr ||
    row.reasonEn ||
    '';

  const titles = {
    heading: { tr: 'Bölüm Sayısı ve En İyi Bölümler', ar: 'عدد الأقسام وأفضل التخصصات', en: 'Departments & Top Programs' },
    bestTitle: { tr: 'En İyi Bölümleri', ar: 'أفضل التخصصات', en: 'Best Departments' },
    faculty: { tr: 'Fakülte', ar: 'الكليات', en: 'Faculties' },
    departments: { tr: 'Bölüm', ar: 'الأقسام', en: 'Departments' },
    graduate: { tr: 'Lisansüstü Program', ar: 'برامج الدراسات العليا', en: 'Graduate Programs' },
    updated: { tr: 'Bilgiler güncellendi:', ar: 'آخر تحديث للمعلومات:', en: 'Information updated:' },
    source: { tr: 'Resmî kaynak', ar: 'المصدر الرسمي', en: 'Official source' },
  };

  const asOf = university.departmentDataAsOf ? new Date(university.departmentDataAsOf) : null;
  const basis = BASIS_LABEL[university.departmentCountBasis] || BASIS_LABEL.LISANS;

  const stats = [
    { key: 'departments', value: university.departmentCount, icon: BookOpen, note: label(basis, '') },
    { key: 'faculty', value: university.facultyCount, icon: Building2, note: '' },
    { key: 'graduate', value: university.programCountGrad, icon: GraduationCap, note: '' },
  ].filter((s) => s.value);

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div>
        <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block mb-1">
          {label({ tr: 'Akademik Birimler', ar: 'الوحدات الأكاديمية', en: 'Academic Units' }, '')}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-brand-amber-500" />
          <span>{label(titles.heading, '')}</span>
        </h2>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 text-center">
                <Icon className="w-5 h-5 text-brand-amber-500 mx-auto mb-2" />
                <div className="text-3xl font-black text-brand-navy-950 font-cairo">{stat.value}</div>
                <div className="text-[11px] font-bold text-slate-600 mt-1">{label(titles[stat.key], '')}</div>
                {stat.note && <div className="text-[10px] text-slate-400 mt-0.5">{stat.note}</div>}
              </div>
            );
          })}
        </div>
      )}

      {best.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
            <Award className="w-4 h-4 text-brand-amber-500" />
            {label(titles.bestTitle, '')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {best.map((row, index) => {
              const reason = deptReason(row);
              return (
                <div key={index} className="flex items-start gap-3 bg-amber-50/50 border border-amber-200/60 rounded-2xl p-3.5">
                  <span className="w-6 h-6 shrink-0 rounded-lg bg-brand-amber-500 text-white text-[11px] font-black flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-brand-navy-950 font-cairo">{deptName(row)}</div>
                    {reason && <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">{reason}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(asOf || university.departmentSourceUrl) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
          {asOf && (
            <span className="inline-flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-emerald-500" />
              {label(titles.updated, '')} {asOf.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : currentLang === 'tr' ? 'tr-TR' : 'en-GB')}
            </span>
          )}
          {university.departmentSourceUrl && (
            <a
              href={university.departmentSourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-brand-amber-600 hover:underline font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {label(titles.source, '')} — {universityName}
            </a>
          )}
        </div>
      )}
    </section>
  );
}
