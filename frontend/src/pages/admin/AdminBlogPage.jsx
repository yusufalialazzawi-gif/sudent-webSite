import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Eye,
  Globe,
  X,
  Share2
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminBlogPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ar');

  const initialForm = {
    slug: '',
    category: 'GUIDE',
    authorName: 'فريق استشارات سورا',
    featuredImageUrl: '',
    readTimeMinutes: 5,
    published: true,
    translations: [
      { lang: 'ar', title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
      { lang: 'tr', title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
      { lang: 'en', title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' },
    ]
  };

  const [form, setForm] = useState(initialForm);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['adminArticles'],
    queryFn: async () => {
      const res = await api.getAdminArticles();
      return res.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await api.updateArticle(editingId, payload);
      } else {
        return await api.createArticle(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminArticles']);
      closeModal();
    },
    onError: (err) => {
      alert(err.message || 'Error saving article');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteArticle(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminArticles']);
    },
    onError: (err) => {
      alert(err.message || 'Error deleting article');
    }
  });

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setActiveTab('ar');
    setIsModalOpen(true);
  };

  const openEditModal = (art) => {
    setEditingId(art.id);

    const getTranslation = (lang) => {
      const found = art.translations?.find(t => t.lang === lang);
      return found || { lang, title: '', excerpt: '', content: '', metaTitle: '', metaDescription: '' };
    };

    setForm({
      slug: art.slug,
      category: art.category || 'GUIDE',
      authorName: art.authorName || 'Sora Education Team',
      featuredImageUrl: art.featuredImageUrl || '',
      readTimeMinutes: art.readTimeMinutes || 5,
      published: Boolean(art.published),
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

  const filtered = articles.filter(a => {
    const arTitle = a.translations?.find(t => t.lang === 'ar')?.title || '';
    const enTitle = a.translations?.find(t => t.lang === 'en')?.title || '';
    return (
      a.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            {currentLanguage === 'ar' ? 'المقالات والأدلة الإرشادية' : 'Articles & Student Guides'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'إدارة مقالات المدونة، أدلة الدراسة في تركيا، ونصائح القبول والفيزا' : 'Publish educational guides, living cost comparisons, and student visa tutorials'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition"
        >
          <Plus size={16} />
          <span>{currentLanguage === 'ar' ? 'إضافة مقال جديد' : 'New Article'}</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={currentLanguage === 'ar' ? 'بحث بعنوان المقال أو الكاتب...' : 'Search articles...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          إجمالي المقالات: {articles.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>جاري تحميل المقالات...</span>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">المقال</th>
                  <th className="px-4 py-4 text-start">التصنيف</th>
                  <th className="px-4 py-4 text-start">الكاتب ووقت القراءة</th>
                  <th className="px-4 py-4 text-start">المشاهدات</th>
                  <th className="px-4 py-4 text-start">الحالة</th>
                  <th className="px-6 py-4 text-end">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((art) => {
                  const arTitle = art.translations?.find(t => t.lang === 'ar')?.title || art.slug;
                  const enTitle = art.translations?.find(t => t.lang === 'en')?.title;
                  return (
                    <tr key={art.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm max-w-xs line-clamp-1">{arTitle}</div>
                        {enTitle && <div className="text-[11px] text-slate-400 line-clamp-1">{enTitle}</div>}
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">/{art.slug}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                          {art.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-700">{art.authorName}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock size={11} />
                          <span>{art.readTimeMinutes} دقائق قراءة</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-slate-600 font-semibold">
                          <Eye size={13} className="text-slate-400" />
                          <span>{art.viewsCount || 0}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        {art.published ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">منشور</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">مسودة</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(art)}
                            className="p-1.5 text-slate-600 hover:text-brand-navy-950 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف مقال ${arTitle}؟`)) {
                                deleteMutation.mutate(art.id);
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
            لا توجد مقالات مسجلة
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
                  {editingId ? 'تعديل بيانات المقال' : 'كتابة مقال جديد'}
                </span>
                <h2 className="text-xl font-bold mt-0.5">
                  {currentTrans.title || form.slug || 'المقال الإرشادي'}
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
                    placeholder="how-to-study-medicine-in-turkey"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">التصنيف</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  >
                    <option value="GUIDE">دليل شامل (Guide)</option>
                    <option value="STUDENT_LIFE">الحياة الطلابية (Student Life)</option>
                    <option value="ADMISSION_TIPS">نصائح القبول (Admission Tips)</option>
                    <option value="ACADEMICS">أكاديمي وتخصصات (Academics)</option>
                    <option value="NEWS">أخبار وتحديثات (News)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الكاتب</label>
                  <input
                    type="text"
                    value={form.authorName}
                    onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">رابط صورة المقال المميزة (Featured Image)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={form.featuredImageUrl}
                    onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">وقت القراءة (بالدقائق)</label>
                  <input
                    type="number"
                    value={form.readTimeMinutes}
                    onChange={(e) => setForm({ ...form, readTimeMinutes: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  />
                </div>
              </div>

              {/* Multilingual Tabs */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 p-2 flex items-center gap-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-600 px-3 flex items-center gap-1.5">
                    <Globe size={14} className="text-brand-amber-500" />
                    <span>محتوى المقال:</span>
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
                    <label className="block font-bold text-slate-700 mb-1">عنوان المقال ({activeTab.toUpperCase()})*</label>
                    <input
                      type="text"
                      required={activeTab === 'ar'}
                      placeholder={activeTab === 'ar' ? 'دليلك الشامل لدراسة الطب البشري في تركيا 2026' : 'Complete Guide to Studying Medicine in Turkey 2026'}
                      value={currentTrans.title || ''}
                      onChange={(e) => handleTransChange(activeTab, 'title', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">موجز المقال (Excerpt)</label>
                    <textarea
                      rows={2}
                      placeholder="ملخص قصير يظهر في بطاقات المدونة ونتائج البحث..."
                      value={currentTrans.excerpt || ''}
                      onChange={(e) => handleTransChange(activeTab, 'excerpt', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">المحتوى الكامل (Markdown / HTML)</label>
                    <textarea
                      rows={8}
                      placeholder="اكتب المقال بالتفصيل، العناوين الفرعية، والنقاط الإرشادية..."
                      value={currentTrans.content || ''}
                      onChange={(e) => handleTransChange(activeTab, 'content', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SEO Meta Title</label>
                      <input
                        type="text"
                        value={currentTrans.metaTitle || ''}
                        onChange={(e) => handleTransChange(activeTab, 'metaTitle', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">SEO Meta Description</label>
                      <input
                        type="text"
                        value={currentTrans.metaDescription || ''}
                        onChange={(e) => handleTransChange(activeTab, 'metaDescription', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
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
                  {saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ المقال'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
