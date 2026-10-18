import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Languages,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ExternalLink,
  GraduationCap,
  BookOpen,
  Briefcase,
  FileText,
  Search,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminTranslationsPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const [modelType, setModelType] = useState('universities');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: matrixItems = [], isLoading } = useQuery({
    queryKey: ['adminTranslationMatrix', modelType],
    queryFn: async () => {
      const res = await api.getTranslationMatrix(modelType);
      return res.data || [];
    },
  });

  const filteredItems = matrixItems.filter(item =>
    item.primaryTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.identifier?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Compute metrics
  const total = matrixItems.length;
  const fullyTranslated = matrixItems.filter(
    item => item.languages?.ar?.isComplete && item.languages?.tr?.isComplete && item.languages?.en?.isComplete
  ).length;
  const missingAny = total - fullyTranslated;

  const renderBadge = (langData) => {
    if (!langData || !langData.exists) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
          <XCircle size={12} />
          <span>مفقود (Missing)</span>
        </span>
      );
    }
    if (langData.isComplete) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={12} />
          <span>مكتمل (100%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
        <AlertCircle size={12} />
        <span>بحاجة لإكمال</span>
      </span>
    );
  };

  const getEditLink = (model, id) => {
    switch (model) {
      case 'universities':
        return `/admin/universities`;
      case 'programs':
        return `/admin/programs`;
      case 'services':
        return `/admin/services`;
      case 'articles':
        return `/admin/blog`;
      default:
        return '/admin';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'مصفوفة تغطية وجودة الترجمة' : 'Multilingual Coverage Matrix'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'مراقبة الجاهزية اللغوية للجامعات والبرامج والمقالات عبر اللغات الثلاث (العربية، التركية، الإنجليزية)' : 'Track translation readiness and localized gaps across catalog models'}
          </p>
        </div>
      </div>

      {/* KPI Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold">إجمالي العناصر بالقسم</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{total}</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Languages size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold">مترجمة بالكامل (3 لغات)</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{fullyTranslated}</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold">بحاجة لمراجعة أو ترجمة</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{missingAny}</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle size={22} />
          </div>
        </div>
      </div>

      {/* Model Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setModelType('universities')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              modelType === 'universities' ? 'bg-brand-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap size={15} />
            <span>الجامعات</span>
          </button>

          <button
            onClick={() => setModelType('programs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              modelType === 'programs' ? 'bg-brand-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen size={15} />
            <span>التخصصات والبرامج</span>
          </button>

          <button
            onClick={() => setModelType('services')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              modelType === 'services' ? 'bg-brand-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Briefcase size={15} />
            <span>الخدمات</span>
          </button>

          <button
            onClick={() => setModelType('articles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
              modelType === 'articles' ? 'bg-brand-navy-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText size={15} />
            <span>المقالات</span>
          </button>
        </div>

        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="بحث بالعنصر..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>جاري مسح حالة الترجمات...</span>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">العنصر والمعرف</th>
                  <th className="px-4 py-4 text-center">العربية 🇸🇦</th>
                  <th className="px-4 py-4 text-center">Türkçe 🇹🇷</th>
                  <th className="px-4 py-4 text-center">English 🇬🇧</th>
                  <th className="px-6 py-4 text-end">إجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{item.primaryTitle}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.identifier}</div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {renderBadge(item.languages?.ar)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {renderBadge(item.languages?.tr)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {renderBadge(item.languages?.en)}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <Link
                        to={getEditLink(modelType, item.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-brand-navy-950 hover:text-white rounded-lg font-bold text-slate-700 transition"
                      >
                        <span>تعديل</span>
                        <ExternalLink size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-sm">
            لا توجد عناصر مطابقة
          </div>
        )}
      </div>
    </div>
  );
}
