import React, { useState } from 'react';
import { ta, tx } from '../../i18n/adminText';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Award,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Percent,
  GraduationCap,
  Globe,
  X
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminScholarshipsPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ar');
  const [validationError, setValidationError] = useState('');

  const initialForm = {
    slug: '',
    scholarshipType: 'PARTIAL',
    discountPercentage: 50,
    universityId: '',
    openingDate: '',
    deadline: '',
    status: 'ACTIVE',
    imageUrl: '',
    published: true,
    translations: [
      { lang: 'ar', title: '', description: '', eligibilityCriteria: '', requiredDocuments: '', benefitsSummary: '' },
      { lang: 'tr', title: '', description: '', eligibilityCriteria: '', requiredDocuments: '', benefitsSummary: '' },
      { lang: 'en', title: '', description: '', eligibilityCriteria: '', requiredDocuments: '', benefitsSummary: '' },
    ]
  };

  const [form, setForm] = useState(initialForm);

  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ['adminScholarships'],
    queryFn: async () => {
      const res = await api.getAdminScholarships();
      return res.data || [];
    },
  });

  const { data: universities = [] } = useQuery({
    queryKey: ['adminUniversitiesForScholarships'],
    queryFn: async () => {
      const res = await api.getAdminUniversities();
      return res.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await api.updateScholarship(editingId, payload);
      } else {
        return await api.createScholarship(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminScholarships']);
      closeModal();
    },
    onError: (err) => {
      alert(err.message || 'Error saving scholarship');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteScholarship(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminScholarships']);
    },
    onError: (err) => {
      alert(err.message || 'Error deleting scholarship');
    }
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setActiveTab('ar');
    setValidationError('');
    setIsModalOpen(true);
  };

  const openEditModal = (sch) => {
    setEditingId(sch.id);
    setValidationError('');

    const getTranslation = (lang) => {
      const found = sch.translations?.find(t => t.lang === lang);
      return found || { lang, title: '', description: '', eligibilityCriteria: '', requiredDocuments: '', benefitsSummary: '' };
    };

    setForm({
      slug: sch.slug,
      scholarshipType: sch.scholarshipType || 'PARTIAL',
      discountPercentage: sch.discountPercentage || 50,
      universityId: sch.universityId || '',
      openingDate: sch.openingDate ? sch.openingDate.substring(0, 10) : '',
      deadline: sch.deadline ? sch.deadline.substring(0, 10) : '',
      status: sch.status || 'ACTIVE',
      imageUrl: sch.imageUrl || '',
      published: Boolean(sch.published),
      translations: [
        getTranslation('ar'),
        getTranslation('tr'),
        getTranslation('en'),
      ]
    });
    setActiveTab('ar');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setValidationError('');
  };

  const handleTransChange = (lang, field, value) => {
    setForm(prev => ({
      ...prev,
      translations: prev.translations.map(t => {
        if (t.lang === lang) {
          return { ...t, [field]: value };
        }
        return t;
      })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Strict 3-Language Validation Check
    for (const lang of ['ar', 'tr', 'en']) {
      const trans = form.translations.find(t => t.lang === lang);
      if (!trans || !trans.title?.trim()) {
        const langLabel = lang === 'ar' ? 'العربية 🇸🇦' : lang === 'tr' ? 'Türkçe 🇹🇷' : 'English 🇬🇧';
        setValidationError(
          tx(
            `يرجى إدخال عنوان المنحة باللغة (${langLabel}). إدخال البيانات بجميع اللغات الثلاث إلزامي لضمان توفير المعلومة للطلاب.`,
            `Lütfen (${langLabel}) dilinde burs başlığını giriniz. Tüm 3 dilde (Arapça, Türkçe, İngilizce) içerik girilmesi zorunludur.`,
            `Please enter the scholarship title in (${langLabel}). Entering content in all 3 languages is required.`
          )
        );
        setActiveTab(lang);
        return;
      }
    }

    saveMutation.mutate(form);
  };

  const filtered = scholarships.filter(s => {
    const arTitle = s.translations?.find(t => t.lang === 'ar')?.title || '';
    const enTitle = s.translations?.find(t => t.lang === 'en')?.title || '';
    return (
      s.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const currentTrans = form.translations.find(t => t.lang === activeTab) || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            tx('المنح الدراسية والفرص الأكاديمية', 'Burslar ve Akademik Fırsatlar', 'Scholarships & Academic Grants')
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            tx('إدارة المنح الكاملة والجزئية، ومواعيد التقديم الرسمية', 'Tam ve kısmi burs fırsatları ile resmi başvuru tarihlerini yönetin', 'Manage partial and full scholarship opportunities and official application deadlines')
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition"
        >
          <Plus size={16} />
          <span>{tx('إضافة منحة جديدة', 'Yeni Burs Ekle', 'Add Scholarship')}</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={tx('بحث بالاسم أو المعرف...', 'Burs veya kimlik ara...', 'Search scholarships...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {tx('إجمالي المنح:', 'Toplam Burs:', 'Total Scholarships:')} {scholarships.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>{ta("جاري تحميل المنح...")}</span>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">{ta("المنحة")}</th>
                  <th className="px-4 py-4 text-start">{ta("الجامعة المرتبطة")}</th>
                  <th className="px-4 py-4 text-start">{ta("نسبة الخصم")}</th>
                  <th className="px-4 py-4 text-start">{ta("الموعد النهائي")}</th>
                  <th className="px-4 py-4 text-start">{ta("الحالة")}</th>
                  <th className="px-6 py-4 text-end">{ta("إجراءات")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sch) => {
                  const arTitle = sch.translations?.find(t => t.lang === 'ar')?.title || sch.slug;
                  const uniName = sch.university?.translations?.[0]?.name || sch.university?.slug || ta('كافة الجامعات الشريكة');
                  return (
                    <tr key={sch.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{arTitle}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">/{sch.slug}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-brand-navy-900 flex items-center gap-1">
                          <GraduationCap size={13} className="text-brand-amber-500" />
                          <span>{uniName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800">
                          {sch.discountPercentage ? `خصم ${sch.discountPercentage}%` : ta('منحة كاملة 100%')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-slate-600">
                          <Calendar size={13} className="text-slate-400" />
                          <span>{sch.deadline ? new Date(sch.deadline).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US') : 'مستمر'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {sch.published ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">{ta("متاحة")}</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">{ta("مسودة")}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(sch)}
                            className="p-1.5 text-slate-600 hover:text-brand-navy-950 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(tx(`هل أنت متأكد من حذف منحة ${arTitle}؟`, `${arTitle} bursunu silmek istediğinize emin misiniz?`, `Are you sure you want to delete scholarship ${arTitle}?`))) {
                                deleteMutation.mutate(sch.id);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-sm">
            {ta("لا توجد منح مسجلة")}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? ta('تعديل بيانات المنحة') : ta('إضافة فرصة منحة جديدة')}
                </span>
                <h2 className="text-xl font-bold mt-0.5">
                  {currentTrans.title || form.slug || ta('المنحة الدراسية')}
                </h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{ta("المعرف الفريد (Slug)*")}</label>
                  <input
                    type="text"
                    required
                    placeholder="medipol-medical-scholarship-50"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{ta("الجامعة المانحة")}</label>
                  <select
                    value={form.universityId}
                    onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  >
                    <option value="">{ta("كافة الجامعات الشريكة")}</option>
                    {universities.map(u => (
                      <option key={u.id} value={u.id}>
                        {u.translations?.find(t => t.lang === 'ar')?.name || u.slug}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{ta("نسبة الخصم (%)")}</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={form.discountPercentage}
                    onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{ta("الموعد النهائي للتقديم")}</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  />
                </div>
              </div>

              {/* 3-Language Enforcement Alert & Validation */}
              {validationError && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Multilingual Tabs */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 p-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 px-2 flex items-center gap-1.5">
                      <Globe size={14} className="text-brand-amber-500" />
                      <span>{tx('اللغات الإلزامية الثلاث:', 'Zorunlu 3 Dil:', 'Mandatory 3 Languages:')}</span>
                    </span>
                    {['ar', 'tr', 'en'].map((lng) => {
                      const trObj = form.translations.find((t) => t.lang === lng);
                      const isComplete = Boolean(trObj?.title?.trim());
                      return (
                        <button
                          key={lng}
                          type="button"
                          onClick={() => {
                            setActiveTab(lng);
                            setValidationError('');
                          }}
                          className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                            activeTab === lng
                              ? 'bg-white text-brand-navy-950 shadow-sm border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <span>{lng === 'ar' ? 'العربية 🇸🇦' : lng === 'tr' ? 'Türkçe 🇹🇷' : 'English 🇬🇧'}</span>
                          {isComplete ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title={ta("مكتمل / Tamamlandı")} />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-rose-500" title={ta("مطلوب / Gerekli")} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline-block">
                    tx('يجب ملء البيانات باللغات الثلاث', '3 dilde veri girişi zorunludur', 'Data entry required in all 3 languages')
                  </span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{tx('عنوان المنحة', 'Burs Başlığı', 'Scholarship Title')} ({activeTab.toUpperCase()})*</label>
                    <input
                      type="text"
                      required={activeTab === 'ar'}
                      placeholder={activeTab === 'ar' ? 'منحة التميز الهندسي والطبي 50%' : '50% Engineering & Medical Excellence Scholarship'}
                      value={currentTrans.title || ''}
                      onChange={(e) => handleTransChange(activeTab, 'title', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{ta("وصف المنحة والتغطية المالية")}</label>
                    <textarea
                      rows={3}
                      placeholder={ta("تغطي المنحة نصف القسط السنوي طوال سنوات الدراسة الأكاديمية...")}
                      value={currentTrans.description || ''}
                      onChange={(e) => handleTransChange(activeTab, 'description', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{ta("شروط الاستحقاق والقبول")}</label>
                    <textarea
                      rows={2}
                      placeholder={ta("معدل ثانوية عامة لا يقل عن 80%، تقديم قبل تاريخ 15 أغسطس...")}
                      value={currentTrans.eligibilityCriteria || ''}
                      onChange={(e) => handleTransChange(activeTab, 'eligibilityCriteria', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  {ta("إلغاء")}
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {saveMutation.isPending ? ta('جاري الحفظ...') : ta('حفظ المنحة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
