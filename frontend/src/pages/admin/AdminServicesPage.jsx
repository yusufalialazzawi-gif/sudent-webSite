import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Plus,
  Search,
  Edit,
  Trash2,
  Globe,
  Clock,
  Star,
  CheckCircle2,
  X,
  Layers
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminServicesPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ar');

  const initialForm = {
    slug: '',
    icon: 'GraduationCap',
    pricePolicy: 'FREE',
    estimatedDuration: '2-5 Days',
    featured: false,
    published: true,
    sortOrder: 0,
    translations: [
      { lang: 'ar', title: '', description: '', benefits: '', eligibility: '', procedureSteps: '', requiredDocuments: '' },
      { lang: 'tr', title: '', description: '', benefits: '', eligibility: '', procedureSteps: '', requiredDocuments: '' },
      { lang: 'en', title: '', description: '', benefits: '', eligibility: '', procedureSteps: '', requiredDocuments: '' },
    ]
  };

  const [form, setForm] = useState(initialForm);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['adminServices'],
    queryFn: async () => {
      const res = await api.getAdminServices();
      return res.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await api.updateService(editingId, payload);
      } else {
        return await api.createService(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminServices']);
      closeModal();
    },
    onError: (err) => {
      alert(err.message || 'Error saving service');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminServices']);
    },
    onError: (err) => {
      alert(err.message || 'Error deleting service');
    }
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setActiveTab('ar');
    setIsModalOpen(true);
  };

  const openEditModal = (srv) => {
    setEditingId(srv.id);

    const getTranslation = (lang) => {
      const found = srv.translations?.find(t => t.lang === lang);
      return found || { lang, title: '', description: '', benefits: '', eligibility: '', procedureSteps: '', requiredDocuments: '' };
    };

    setForm({
      slug: srv.slug,
      icon: srv.icon || 'GraduationCap',
      pricePolicy: srv.pricePolicy || 'FREE',
      estimatedDuration: srv.estimatedDuration || '',
      featured: Boolean(srv.featured),
      published: Boolean(srv.published),
      sortOrder: srv.sortOrder || 0,
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
    saveMutation.mutate(form);
  };

  const filteredServices = services.filter(s => {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'الخدمات والاستشارات الطلابية' : 'Student Consulting Services'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'إدارة باقات القبول الجامعي، معادلة الشهادات، الإقامة الطلابية، والسكن' : 'Manage educational consulting services, equivalency, visa and housing support'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition"
        >
          <Plus size={16} />
          <span>{currentLanguage === 'ar' ? 'إضافة خدمة جديدة' : 'Add Service'}</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={currentLanguage === 'ar' ? 'بحث بالاسم أو المعرف...' : 'Search services...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          إجمالي الخدمات: {services.length}
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>جاري تحميل الخدمات...</span>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">الخدمة</th>
                  <th className="px-4 py-4 text-start">سياسة التسعير</th>
                  <th className="px-4 py-4 text-start">المدة المقدرة</th>
                  <th className="px-4 py-4 text-start">الترتيب والحالة</th>
                  <th className="px-6 py-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredServices.map((srv) => {
                  const arTitle = srv.translations?.find(t => t.lang === 'ar')?.title || srv.slug;
                  const enTitle = srv.translations?.find(t => t.lang === 'en')?.title;
                  return (
                    <tr key={srv.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-amber-500/10 text-brand-amber-600 flex items-center justify-center font-bold">
                            <Briefcase size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{arTitle}</div>
                            {enTitle && <div className="text-[11px] text-slate-400">{enTitle}</div>}
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">/{srv.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                          {srv.pricePolicy || 'مجانية بالكامل'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Clock size={14} className="text-slate-400" />
                          <span>{srv.estimatedDuration || 'فوري'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 space-y-1">
                        <div>
                          {srv.published ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">نشط</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">مسودة</span>
                          )}
                        </div>
                        {srv.featured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 flex items-center gap-1 w-fit">
                            <Star size={10} className="fill-amber-500" />
                            <span>مميزة</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(srv)}
                            className="p-1.5 text-slate-600 hover:text-brand-navy-950 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف ${arTitle}؟`)) {
                                deleteMutation.mutate(srv.id);
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
            لا توجد خدمات مسجلة
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
                  {editingId ? 'تعديل بيانات الخدمة' : 'إضافة خدمة طلابية جديدة'}
                </span>
                <h2 className="text-xl font-bold mt-0.5">
                  {currentTrans.title || form.slug || 'الخدمة الطلابية'}
                </h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المعرف الفريد (Slug)*</label>
                  <input
                    type="text"
                    required
                    placeholder="university-admission"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">سياسة الرسوم (Price Policy)</label>
                  <input
                    type="text"
                    placeholder="مجانية للطلاب"
                    value={form.pricePolicy}
                    onChange={(e) => setForm({ ...form, pricePolicy: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المدة المقدرة للإنجاز</label>
                  <input
                    type="text"
                    placeholder="2-5 أيام عمل"
                    value={form.estimatedDuration}
                    onChange={(e) => setForm({ ...form, estimatedDuration: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 text-brand-amber-500 rounded focus:ring-brand-amber-500"
                  />
                  <span>تمييز الخدمة (Featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="w-4 h-4 text-brand-amber-500 rounded focus:ring-brand-amber-500"
                  />
                  <span>نشر الخدمة (Published)</span>
                </label>
              </div>

              {/* Multilingual Tabs */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 p-2 flex items-center gap-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-600 px-3 flex items-center gap-1.5">
                    <Globe size={14} className="text-brand-amber-500" />
                    <span>محتوى اللغات:</span>
                  </span>
                  {['ar', 'tr', 'en'].map((lng) => (
                    <button
                      key={lng}
                      type="button"
                      onClick={() => setActiveTab(lng)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${
                        activeTab === lng ? 'bg-white text-brand-navy-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lng === 'ar' ? 'العربية 🇸🇦' : lng === 'tr' ? 'Türkçe 🇹🇷' : 'English 🇬🇧'}
                    </button>
                  ))}
                </div>

                <div className="p-4 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">عنوان الخدمة ({activeTab.toUpperCase()})*</label>
                    <input
                      type="text"
                      required={activeTab === 'ar'}
                      placeholder={activeTab === 'ar' ? 'القبول الجامعي المجاني' : 'Free University Admission'}
                      value={currentTrans.title || ''}
                      onChange={(e) => handleTransChange(activeTab, 'title', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">وصف الخدمة ({activeTab.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      placeholder="نقدم لك استشارة أكاديمية متكاملة لضمان مقعدك الجامعي بأفضل منحة ممكنة..."
                      value={currentTrans.description || ''}
                      onChange={(e) => handleTransChange(activeTab, 'description', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المميزات والفوائد للطلاب ({activeTab.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      placeholder="خصومات تصل إلى 75%، متابعة مستمرة حتى استلام بطاقة الطالب..."
                      value={currentTrans.benefits || ''}
                      onChange={(e) => handleTransChange(activeTab, 'benefits', e.target.value)}
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
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ الخدمة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
