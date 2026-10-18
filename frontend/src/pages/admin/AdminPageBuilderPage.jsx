import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Layers,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Globe,
  CheckCircle2,
  X,
  Code
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminPageBuilderPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [selectedPage, setSelectedPage] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ar');

  const initialForm = {
    pageName: 'home',
    sectionKey: '',
    sectionType: 'HERO',
    titleAr: '',
    titleTr: '',
    titleEn: '',
    subtitleAr: '',
    subtitleTr: '',
    subtitleEn: '',
    contentJson: '{}',
    sortOrder: 0,
    isEnabled: true,
  };

  const [form, setForm] = useState(initialForm);

  const { data: sections = [], isLoading } = useQuery({
    queryKey: ['adminPageSections', selectedPage],
    queryFn: async () => {
      const res = await api.getAdminPageSections(selectedPage);
      return res.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await api.updatePageSection(editingId, payload);
      } else {
        return await api.createPageSection(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPageSections', selectedPage]);
      closeModal();
    },
    onError: (err) => {
      alert(err.message || 'Error saving page section');
    }
  });

  const reorderMutation = useMutation({
    mutationFn: async (orderedIds) => {
      return await api.reorderPageSections(orderedIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPageSections', selectedPage]);
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, isEnabled }) => {
      return await api.updatePageSection(id, { isEnabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPageSections', selectedPage]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deletePageSection(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminPageSections', selectedPage]);
    }
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      pageName: selectedPage,
      sortOrder: sections.length + 1,
    });
    setActiveTab('ar');
    setIsModalOpen(true);
  };

  const openEditModal = (sec) => {
    setEditingId(sec.id);
    setForm({
      pageName: sec.pageName,
      sectionKey: sec.sectionKey,
      sectionType: sec.sectionType,
      titleAr: sec.titleAr || '',
      titleTr: sec.titleTr || '',
      titleEn: sec.titleEn || '',
      subtitleAr: sec.subtitleAr || '',
      subtitleTr: sec.subtitleTr || '',
      subtitleEn: sec.subtitleEn || '',
      contentJson: sec.contentJson || '{}',
      sortOrder: sec.sortOrder || 0,
      isEnabled: Boolean(sec.isEnabled),
    });
    setActiveTab('ar');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const moveSection = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    const orderedIds = reordered.map(s => s.id);
    reorderMutation.mutate(orderedIds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'منشئ ومحرر الصفحات البصري (Visual CMS)' : 'Visual Page Builder (CMS)'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'التحكم في ترتيب أقسام الصفحة الرئيسية، النصوص الإعلانية، والإحصائيات الحية' : 'Manage layout hierarchy, landing sections, banners, and multilingual copy'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition"
        >
          <Plus size={16} />
          <span>{currentLanguage === 'ar' ? 'إضافة قسم جديد' : 'Add Section'}</span>
        </button>
      </div>

      {/* Page Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
        <button
          onClick={() => setSelectedPage('home')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedPage === 'home' ? 'bg-brand-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          الصفحة الرئيسية (Home Page)
        </button>
        <button
          onClick={() => setSelectedPage('about')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            selectedPage === 'about' ? 'bg-brand-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          صفحة من نحن (About)
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>جاري تحميل هيكل الصفحة...</span>
          </div>
        ) : sections.length > 0 ? (
          sections.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-4 rounded-2xl border transition bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm ${
                !sec.isEnabled ? 'opacity-60 bg-slate-50' : 'hover:border-brand-amber-500/40'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, 'up')}
                    className="p-1 text-slate-400 hover:text-brand-navy-900 disabled:opacity-20 rounded hover:bg-slate-100"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={idx === sections.length - 1}
                    onClick={() => moveSection(idx, 'down')}
                    className="p-1 text-slate-400 hover:text-brand-navy-900 disabled:opacity-20 rounded hover:bg-slate-100"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div className="w-8 h-8 rounded-xl bg-brand-navy-950 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {sec.sortOrder || idx + 1}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{sec.titleAr || sec.sectionKey}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                      {sec.sectionKey}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {sec.sectionType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{sec.subtitleAr || 'لا يوجد عنوان فرعي'}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => toggleStatusMutation.mutate({ id: sec.id, isEnabled: !sec.isEnabled })}
                  className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    sec.isEnabled
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                  title={sec.isEnabled ? 'Disable Section' : 'Enable Section'}
                >
                  {sec.isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  <span>{sec.isEnabled ? 'مفعل' : 'معطل'}</span>
                </button>

                <button
                  onClick={() => openEditModal(sec)}
                  className="p-2 text-slate-600 hover:text-brand-navy-950 hover:bg-slate-100 rounded-xl transition"
                  title="Edit Section"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={() => {
                    if (confirm(`هل أنت متأكد من حذف قسم ${sec.sectionKey}؟`)) {
                      deleteMutation.mutate(sec.id);
                    }
                  }}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition"
                  title="Delete Section"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-sm">
            لا توجد أقسام مسجلة لهذه الصفحة
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
                  {editingId ? 'تعديل قسم الصفحة' : 'إضافة قسم جديد'}
                </span>
                <h2 className="text-xl font-bold mt-0.5">{form.sectionKey || 'قسم الصفحة'}</h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المعرف الفريد (Section Key)*</label>
                  <input
                    type="text"
                    required
                    placeholder="hero_banner"
                    value={form.sectionKey}
                    onChange={(e) => setForm({ ...form, sectionKey: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع القسم (Section Type)*</label>
                  <select
                    value={form.sectionType}
                    onChange={(e) => setForm({ ...form, sectionType: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  >
                    <option value="HERO">Hero Banner</option>
                    <option value="STATS">Live Statistics Bar</option>
                    <option value="SERVICES">Services Grid</option>
                    <option value="UNIVERSITIES">Universities Carousel</option>
                    <option value="STEPS">Application Steps</option>
                    <option value="TESTIMONIALS">Student Reviews</option>
                    <option value="FAQ">FAQ Accordion</option>
                    <option value="CTA">Call To Action Banner</option>
                  </select>
                </div>
              </div>

              {/* Multilingual Tabs */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 p-2 flex items-center gap-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-600 px-3 flex items-center gap-1.5">
                    <Globe size={14} className="text-brand-amber-500" />
                    <span>محتوى النصوص:</span>
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
                  {activeTab === 'ar' && (
                    <>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">عنوان القسم بالعربية</label>
                        <input
                          type="text"
                          value={form.titleAr}
                          onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">العنوان الفرعي بالعربية</label>
                        <textarea
                          rows={2}
                          value={form.subtitleAr}
                          onChange={(e) => setForm({ ...form, subtitleAr: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'tr' && (
                    <>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Türkçe Başlık</label>
                        <input
                          type="text"
                          value={form.titleTr}
                          onChange={(e) => setForm({ ...form, titleTr: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Türkçe Alt Başlık</label>
                        <textarea
                          rows={2}
                          value={form.subtitleTr}
                          onChange={(e) => setForm({ ...form, subtitleTr: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'en' && (
                    <>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">English Title</label>
                        <input
                          type="text"
                          value={form.titleEn}
                          onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">English Subtitle</label>
                        <textarea
                          rows={2}
                          value={form.subtitleEn}
                          onChange={(e) => setForm({ ...form, subtitleEn: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* JSON Content */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs flex items-center gap-1.5">
                  <Code size={14} className="text-brand-amber-500" />
                  <span>تخصيص البيانات الإضافية (JSON Configuration)</span>
                </label>
                <textarea
                  rows={4}
                  value={form.contentJson}
                  onChange={(e) => setForm({ ...form, contentJson: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 text-amber-300 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-amber-500 ltr"
                />
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
                  {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ القسم'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
