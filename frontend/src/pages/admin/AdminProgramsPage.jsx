import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  GraduationCap,
  DollarSign,
  Globe,
  Clock,
  CheckCircle2,
  X,
  Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminProgramsPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ar');

  // Form State
  const initialForm = {
    universityId: '',
    categoryId: '',
    slug: '',
    degreeLevel: 'BACHELOR',
    studyLanguage: 'ENGLISH',
    durationYears: 4,
    annualTuition: 5000,
    discountedTuition: 3500,
    currency: 'USD',
    academicYear: '2026-2027',
    applicationStatus: 'OPEN',
    published: true,
    translations: [
      { lang: 'ar', name: '', facultyName: '', description: '', requirements: '', careerOpportunities: '' },
      { lang: 'tr', name: '', facultyName: '', description: '', requirements: '', careerOpportunities: '' },
      { lang: 'en', name: '', facultyName: '', description: '', requirements: '', careerOpportunities: '' },
    ]
  };

  const [form, setForm] = useState(initialForm);

  // Fetch programs
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['adminPrograms'],
    queryFn: async () => {
      const res = await api.getAdminPrograms();
      return res.data || [];
    },
  });

  // Fetch universities for dropdown
  const { data: universities = [] } = useQuery({
    queryKey: ['adminUniversitiesForPrograms'],
    queryFn: async () => {
      const res = await api.getAdminUniversities();
      return res.data || [];
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['programCategories'],
    queryFn: async () => {
      const res = await api.getCategories();
      return res.data || [];
    },
  });

  // Mutation: Save
  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await api.updateProgram(editingId, payload);
      } else {
        return await api.createProgram(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPrograms']);
      queryClient.invalidateQueries(['adminDashboardMetrics']);
      closeModal();
    },
    onError: (err) => {
      alert(err.message || 'Error saving program');
    }
  });

  // Mutation: Delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteProgram(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPrograms']);
      queryClient.invalidateQueries(['adminDashboardMetrics']);
    },
    onError: (err) => {
      alert(err.message || 'Error deleting program');
    }
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      universityId: universities[0]?.id || '',
    });
    setActiveTab('ar');
    setIsModalOpen(true);
  };

  const openEditModal = (prog) => {
    setEditingId(prog.id);

    const getTranslation = (lang) => {
      const found = prog.translations?.find(t => t.lang === lang);
      return found || { lang, name: '', facultyName: '', description: '', requirements: '', careerOpportunities: '' };
    };

    setForm({
      universityId: prog.universityId,
      categoryId: prog.categoryId || '',
      slug: prog.slug,
      degreeLevel: prog.degreeLevel || 'BACHELOR',
      studyLanguage: prog.studyLanguage || 'ENGLISH',
      durationYears: prog.durationYears || 4,
      annualTuition: prog.annualTuition || 0,
      discountedTuition: prog.discountedTuition || '',
      currency: prog.currency || 'USD',
      academicYear: prog.academicYear || '2026-2027',
      applicationStatus: prog.applicationStatus || 'OPEN',
      published: Boolean(prog.published),
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

  const filteredPrograms = programs.filter(p => {
    const arName = p.translations?.find(t => t.lang === 'ar')?.name || '';
    const enName = p.translations?.find(t => t.lang === 'en')?.name || '';
    const uniName = p.university?.translations?.[0]?.name || '';

    const matchesSearch =
      p.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uniName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLevel = !levelFilter || p.degreeLevel === levelFilter;
    const matchesLang = !langFilter || p.studyLanguage === langFilter;

    return matchesSearch && matchesLevel && matchesLang;
  });

  const currentTrans = form.translations.find(t => t.lang === activeTab) || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'البرامج والتخصصات الأكاديمية' : 'Academic Programs & Degrees'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'إدارة التخصصات والرسوم الدراسية السنوية والخصومات ولغات التدريس' : 'Manage academic offerings, tuition fees, scholarship discounts, and curricula'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition"
        >
          <Plus size={16} />
          <span>{currentLanguage === 'ar' ? 'إضافة تخصص جديد' : 'Add Program'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={currentLanguage === 'ar' ? 'بحث بالتخصص، الجامعة، أو الكود...' : 'Search programs...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          >
            <option value="">جميع المراحل</option>
            <option value="BACHELOR">بكالوريوس (Bachelor)</option>
            <option value="MASTER_WITH_THESIS">ماجستير بأطروحة</option>
            <option value="MASTER_NON_THESIS">ماجستير بدون أطروحة</option>
            <option value="PHD">دكتوراه (PhD)</option>
            <option value="ASSOCIATE">دبلوم (Associate)</option>
          </select>

          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          >
            <option value="">جميع اللغات</option>
            <option value="ENGLISH">الإنجليزية</option>
            <option value="TURKISH">التركية</option>
            <option value="MIXED">مختلط</option>
          </select>

          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
            {filteredPrograms.length} برنامج
          </span>
        </div>
      </div>

      {/* Programs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>جاري تحميل التخصصات والبرامج...</span>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">التخصص والجامعة</th>
                  <th className="px-4 py-4 text-start">الدرجة والمدة</th>
                  <th className="px-4 py-4 text-start">لغة التدريس</th>
                  <th className="px-4 py-4 text-start">الرسوم السنوية</th>
                  <th className="px-4 py-4 text-start">الحالة</th>
                  <th className="px-6 py-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrograms.map((prog) => {
                  const arName = prog.translations?.find(t => t.lang === 'ar')?.name || prog.slug;
                  const uniName = prog.university?.translations?.[0]?.name || prog.university?.slug;
                  return (
                    <tr key={prog.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{arName}</div>
                        <div className="text-[11px] text-brand-navy-900 font-semibold mt-0.5 flex items-center gap-1">
                          <GraduationCap size={13} className="text-brand-amber-500" />
                          <span>{uniName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">/{prog.slug}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800">{prog.degreeLevel}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Clock size={12} className="text-slate-400" />
                          <span>{prog.durationYears} سنوات</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          prog.studyLanguage === 'ENGLISH' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {prog.studyLanguage === 'ENGLISH' ? 'الإنجليزية' : 'التركية'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {prog.discountedTuition ? (
                          <div>
                            <div className="font-bold text-emerald-600 text-sm">
                              ${prog.discountedTuition.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400 line-through">
                              ${prog.annualTuition.toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <div className="font-bold text-slate-900 text-sm">
                            ${prog.annualTuition.toLocaleString()}
                          </div>
                        )}
                        <span className="text-[10px] text-slate-400">{prog.currency} / سنوياً</span>
                      </td>
                      <td className="px-4 py-4">
                        {prog.published ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">متاح</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">غير نشط</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(prog)}
                            className="p-1.5 text-slate-600 hover:text-brand-navy-950 hover:bg-slate-100 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف ${arName}؟`)) {
                                deleteMutation.mutate(prog.id);
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
            لا توجد برامج مسجلة مطابقة لمعايير البحث
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? 'تعديل بيانات التخصص' : 'إضافة تخصص جديد'}
                </span>
                <h2 className="text-xl font-bold mt-0.5">
                  {currentTrans.name || form.slug || 'التخصص الأكاديمي'}
                </h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Core Details */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">البيانات الإدارية والجامعة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">الجامعة التابع لها*</label>
                    <select
                      required
                      value={form.universityId}
                      onChange={(e) => setForm({ ...form, universityId: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    >
                      <option value="">اختر الجامعة</option>
                      {universities.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.translations?.find(t => t.lang === 'ar')?.name || u.slug}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المعرف الفريد (Slug)*</label>
                    <input
                      type="text"
                      required
                      placeholder="computer-engineering-en"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">تصنيف البرنامج</label>
                    <select
                      value={form.categoryId}
                      onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    >
                      <option value="">بدون تصنيف</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المرحلة الأكاديمية</label>
                    <select
                      value={form.degreeLevel}
                      onChange={(e) => setForm({ ...form, degreeLevel: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    >
                      <option value="BACHELOR">بكالوريوس (Bachelor)</option>
                      <option value="MASTER_WITH_THESIS">ماجستير بأطروحة</option>
                      <option value="MASTER_NON_THESIS">ماجستير بدون أطروحة</option>
                      <option value="PHD">دكتوراه (PhD)</option>
                      <option value="ASSOCIATE">دبلوم (Associate)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">لغة التدريس</label>
                    <select
                      value={form.studyLanguage}
                      onChange={(e) => setForm({ ...form, studyLanguage: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    >
                      <option value="ENGLISH">الإنجليزية (English)</option>
                      <option value="TURKISH">التركية (Türkçe)</option>
                      <option value="MIXED">مختلط (Mixed %30 / %70)</option>
                      <option value="ARABIC">العربية (Arabic)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">مدة الدراسة (بالسنوات)</label>
                    <input
                      type="number"
                      value={form.durationYears}
                      onChange={(e) => setForm({ ...form, durationYears: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Tuitions and Status */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">الرسوم والخصومات المالية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">القسط السنوي الأصلي*</label>
                    <input
                      type="number"
                      required
                      value={form.annualTuition}
                      onChange={(e) => setForm({ ...form, annualTuition: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">القسط بعد المنحة / الخصم</label>
                    <input
                      type="number"
                      value={form.discountedTuition}
                      onChange={(e) => setForm({ ...form, discountedTuition: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">العملة</label>
                    <select
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="TRY">TRY (₺)</option>
                    </select>
                  </div>
                </div>
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
                    <label className="block font-bold text-slate-700 mb-1">اسم التخصص ({activeTab.toUpperCase()})*</label>
                    <input
                      type="text"
                      required={activeTab === 'ar'}
                      placeholder={activeTab === 'ar' ? 'هندسة الذكاء الاصطناعي' : 'Artificial Intelligence Engineering'}
                      value={currentTrans.name || ''}
                      onChange={(e) => handleTransChange(activeTab, 'name', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">اسم الكلية ({activeTab.toUpperCase()})</label>
                    <input
                      type="text"
                      placeholder={activeTab === 'ar' ? 'كلية الهندسة والعلوم الطبيعية' : 'Faculty of Engineering'}
                      value={currentTrans.facultyName || ''}
                      onChange={(e) => handleTransChange(activeTab, 'facultyName', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">وصف تفصيلي للبرنامج والمقررات ({activeTab.toUpperCase()})</label>
                    <textarea
                      rows={3}
                      placeholder="خطة البرنامج والمختبرات والمشاريع العملية..."
                      value={currentTrans.description || ''}
                      onChange={(e) => handleTransChange(activeTab, 'description', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">فرص العمل ومجالات التخرج ({activeTab.toUpperCase()})</label>
                    <textarea
                      rows={2}
                      placeholder="مهندس برمجيات، باحث ذكاء اصطناعي، مطور أنظمة مدمجة..."
                      value={currentTrans.careerOpportunities || ''}
                      onChange={(e) => handleTransChange(activeTab, 'careerOpportunities', e.target.value)}
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
                  {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ التخصص'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
