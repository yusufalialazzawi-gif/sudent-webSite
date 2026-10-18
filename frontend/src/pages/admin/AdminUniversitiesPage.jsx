import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Globe,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  X,
  Upload,
  BookOpen
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminUniversitiesPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ar');

  // Form State
  const initialForm = {
    slug: '',
    type: 'PRIVATE',
    city: 'Istanbul',
    establishedYear: 2000,
    campusType: 'Urban Campus',
    ranking: 10,
    websiteUrl: '',
    logoUrl: '',
    coverImageUrl: '',
    featured: false,
    published: true,
    translations: [
      { lang: 'ar', name: '', overview: '', admissionRequirements: '', accommodationInfo: '', accreditationInfo: '', address: '' },
      { lang: 'tr', name: '', overview: '', admissionRequirements: '', accommodationInfo: '', accreditationInfo: '', address: '' },
      { lang: 'en', name: '', overview: '', admissionRequirements: '', accommodationInfo: '', accreditationInfo: '', address: '' },
    ]
  };

  const [form, setForm] = useState(initialForm);

  // Fetch all universities for admin
  const { data: universities = [], isLoading } = useQuery({
    queryKey: ['adminUniversities'],
    queryFn: async () => {
      const res = await api.getAdminUniversities();
      return res.data || [];
    },
  });

  // Mutation: Create or Update
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await api.updateUniversity(editingId, payload);
      } else {
        return await api.createUniversity(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUniversities']);
      queryClient.invalidateQueries(['adminDashboardMetrics']);
      closeModal();
    },
    onError: (err) => {
      alert(err.message || 'Error saving university');
    }
  });

  // Mutation: Delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteUniversity(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUniversities']);
      queryClient.invalidateQueries(['adminDashboardMetrics']);
    },
    onError: (err) => {
      alert(err.message || 'Error deleting university');
    }
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setActiveTab('ar');
    setIsModalOpen(true);
  };

  const openEditModal = (uni) => {
    setEditingId(uni.id);

    const getTranslation = (lang) => {
      const found = uni.translations?.find(t => t.lang === lang);
      return found || { lang, name: '', overview: '', admissionRequirements: '', accommodationInfo: '', accreditationInfo: '', address: '' };
    };

    setForm({
      slug: uni.slug,
      type: uni.type || 'PRIVATE',
      city: uni.city || 'Istanbul',
      establishedYear: uni.establishedYear || 2000,
      campusType: uni.campusType || '',
      ranking: uni.ranking || 1,
      websiteUrl: uni.websiteUrl || '',
      logoUrl: uni.logoUrl || '',
      coverImageUrl: uni.coverImageUrl || '',
      featured: Boolean(uni.featured),
      published: Boolean(uni.published),
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

  const filteredUnis = universities.filter(u => {
    const arName = u.translations?.find(t => t.lang === 'ar')?.name || '';
    const enName = u.translations?.find(t => t.lang === 'en')?.name || '';
    return (
      u.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const currentTrans = form.translations.find(t => t.lang === activeTab) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'إدارة الجامعات التركية' : 'Turkish Universities Catalog'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'إضافة وتعديل بيانات الجامعات، الشعار، الصور، والمعلومات بثلاث لغات' : 'Manage university profiles, media assets, rankings and multilingual content'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition"
        >
          <Plus size={16} />
          <span>{currentLanguage === 'ar' ? 'إضافة جامعة جديدة' : 'Add University'}</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={currentLanguage === 'ar' ? 'بحث باسم الجامعة، المدينة، أو المعرف...' : 'Search universities...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          إجمالي الجامعات: {universities.length}
        </div>
      </div>

      {/* Universities Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>جاري تحميل قائمة الجامعات...</span>
          </div>
        ) : filteredUnis.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">الجامعة والشعار</th>
                  <th className="px-4 py-4 text-start">المدينة والنوع</th>
                  <th className="px-4 py-4 text-start">الترتيب والسنة</th>
                  <th className="px-4 py-4 text-start">البرامج المتاحة</th>
                  <th className="px-4 py-4 text-start">الحالة والمميزة</th>
                  <th className="px-6 py-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUnis.map((uni) => {
                  const arName = uni.translations?.find(t => t.lang === 'ar')?.name || uni.slug;
                  const enName = uni.translations?.find(t => t.lang === 'en')?.name;
                  return (
                    <tr key={uni.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {uni.logoUrl ? (
                            <img src={uni.logoUrl} alt={arName} className="w-10 h-10 object-contain rounded-lg p-1 bg-slate-50 border border-slate-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-brand-navy-900 text-white flex items-center justify-center font-bold text-sm">
                              {uni.slug[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{arName}</div>
                            {enName && <div className="text-[11px] text-slate-400">{enName}</div>}
                            <div className="text-[10px] text-brand-amber-600 font-mono mt-0.5">/{uni.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" />
                          <span>{uni.city}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 mt-1 inline-block">
                          {uni.type === 'PRIVATE' ? 'جامعة خاصة' : 'جامعة حكومية'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-700">تأسست: {uni.establishedYear || 'N/A'}</div>
                        <div className="text-[11px] text-slate-400">ترتيب: #{uni.ranking || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <BookOpen size={14} className="text-brand-amber-500" />
                          <span>{uni._count?.programs || 0} تخصص</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 space-y-1">
                        <div>
                          {uni.published ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">منشورة</span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">مسودة</span>
                          )}
                        </div>
                        {uni.featured && (
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 flex items-center gap-1 w-fit">
                              <Star size={10} className="fill-amber-500" />
                              <span>مميزة</span>
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(uni)}
                            className="p-1.5 text-slate-600 hover:text-brand-navy-950 hover:bg-slate-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف ${arName}؟`)) {
                                deleteMutation.mutate(uni.id);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
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
            لا توجد جامعات مسجلة مطابقة لبحثك
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? 'تعديل بيانات الجامعة' : 'إضافة جامعة تركية جديدة'}
                </span>
                <h2 className="text-xl font-bold mt-0.5">
                  {currentTrans.name || form.slug || 'ملف الجامعة'}
                </h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Core Attributes */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">البيانات الأساسية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المعرف الفريد (Slug)*</label>
                    <input
                      type="text"
                      required
                      placeholder="medipol-university"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المدينة*</label>
                    <input
                      type="text"
                      required
                      placeholder="Istanbul"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">نوع الجامعة</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    >
                      <option value="PRIVATE">خاصة (Private)</option>
                      <option value="PUBLIC">حكومية (Public)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">سنة التأسيس</label>
                    <input
                      type="number"
                      placeholder="2009"
                      value={form.establishedYear}
                      onChange={(e) => setForm({ ...form, establishedYear: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الترتيب المحلي/العام</label>
                    <input
                      type="number"
                      placeholder="5"
                      value={form.ranking}
                      onChange={(e) => setForm({ ...form, ranking: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رابط الموقع الرسمي</label>
                    <input
                      type="url"
                      placeholder="https://medipol.edu.tr"
                      value={form.websiteUrl}
                      onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                    />
                  </div>
                </div>
              </div>

              {/* Media URLs */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">الوسائط والشعارات</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رابط الشعار (Logo URL)</label>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={form.logoUrl}
                      onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">رابط صورة الغلاف (Cover Image URL)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={form.coverImageUrl}
                      onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                    />
                  </div>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 text-brand-amber-500 rounded focus:ring-brand-amber-500"
                  />
                  <span>تمييز الجامعة في الصفحة الرئيسية (Featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="w-4 h-4 text-brand-amber-500 rounded focus:ring-brand-amber-500"
                  />
                  <span>نشر الجامعة للعامة (Published)</span>
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
                    <label className="block font-bold text-slate-700 mb-1">اسم الجامعة ({activeTab.toUpperCase()})*</label>
                    <input
                      type="text"
                      required={activeTab === 'ar'}
                      placeholder={activeTab === 'ar' ? 'جامعة اسطنبول ميديبول' : 'Istanbul Medipol University'}
                      value={currentTrans.name || ''}
                      onChange={(e) => handleTransChange(activeTab, 'name', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">نبذة عن الجامعة ({activeTab.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      placeholder="نبذة تفصيلية تشمل المميزات الأكاديمية والمرافق..."
                      value={currentTrans.overview || ''}
                      onChange={(e) => handleTransChange(activeTab, 'overview', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">شروط القبول ({activeTab.toUpperCase()})</label>
                      <textarea
                        rows={2}
                        placeholder="شهادة الثانوية العامة، كشف الدرجات، جواز السفر..."
                        value={currentTrans.admissionRequirements || ''}
                        onChange={(e) => handleTransChange(activeTab, 'admissionRequirements', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">السكن الطلابي ({activeTab.toUpperCase()})</label>
                      <textarea
                        rows={2}
                        placeholder="سكن جامعي حديث مجهز بالكامل للطلاب والطالبات..."
                        value={currentTrans.accommodationInfo || ''}
                        onChange={(e) => handleTransChange(activeTab, 'accommodationInfo', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">الاعتمادات الدولية ({activeTab.toUpperCase()})</label>
                      <input
                        type="text"
                        placeholder="YÖK, Pearson, FIBAA, MÜDEK"
                        value={currentTrans.accreditationInfo || ''}
                        onChange={(e) => handleTransChange(activeTab, 'accreditationInfo', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">العنوان والموقع ({activeTab.toUpperCase()})</label>
                      <input
                        type="text"
                        placeholder="Kavacık, Beykoz / Istanbul"
                        value={currentTrans.address || ''}
                        onChange={(e) => handleTransChange(activeTab, 'address', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
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
                  {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ الجامعة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
