import React, { useState } from 'react';
import { ta, tx } from '../../i18n/adminText';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Layers,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Calendar,
  Clock,
  DollarSign,
  Globe,
  X,
  CheckCircle,
  Eye
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminCoursesPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ar');
  const [selectedCourseForRegs, setSelectedCourseForRegs] = useState(null);

  const initialForm = {
    slug: '',
    studyMode: 'ONLINE',
    durationWeeks: 12,
    schedule: ta('سبت - اثنين - أربعاء (مسائي)'),
    price: 350,
    currency: 'USD',
    capacity: 25,
    status: 'ACTIVE',
    registrationDeadline: '',
    imageUrl: '',
    published: true,
    translations: [
      { lang: 'ar', title: '', description: '', instructor: '', curriculum: '', requirements: '' },
      { lang: 'tr', title: '', description: '', instructor: '', curriculum: '', requirements: '' },
      { lang: 'en', title: '', description: '', instructor: '', curriculum: '', requirements: '' },
    ]
  };

  const [form, setForm] = useState(initialForm);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: async () => {
      const res = await api.getAdminCourses();
      return res.data || [];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingId) {
        return await api.updateCourse(editingId, payload);
      } else {
        return await api.createCourse(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCourses']);
      closeModal();
    },
    onError: (err) => {
      alert(err.message || 'Error saving course');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteCourse(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminCourses']);
    },
    onError: (err) => {
      alert(err.message || 'Error deleting course');
    }
  });

  const [validationError, setValidationError] = useState('');

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setActiveTab('ar');
    setValidationError('');
    setIsModalOpen(true);
  };

  const openEditModal = (crs) => {
    setEditingId(crs.id);
    setValidationError('');

    const getTranslation = (lang) => {
      const found = crs.translations?.find(t => t.lang === lang);
      return found || { lang, title: '', description: '', instructor: '', curriculum: '', requirements: '' };
    };

    setForm({
      slug: crs.slug,
      studyMode: crs.studyMode || 'ONLINE',
      durationWeeks: crs.durationWeeks || 12,
      schedule: crs.schedule || '',
      price: crs.price || 0,
      currency: crs.currency || 'USD',
      capacity: crs.capacity || 25,
      status: crs.status || 'ACTIVE',
      registrationDeadline: crs.registrationDeadline ? crs.registrationDeadline.substring(0, 10) : '',
      imageUrl: crs.imageUrl || '',
      published: Boolean(crs.published),
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
      const trans = form.translations?.find(t => t.lang === lang);
      if (!trans || !trans.title?.trim()) {
        const langLabel = lang === 'ar' ? 'العربية 🇸🇦' : lang === 'tr' ? 'Türkçe 🇹🇷' : 'English 🇬🇧';
        setValidationError(
          tx(
            `يرجى إدخال عنوان الدورة باللغة (${langLabel}). إدخال الدورات بجميع اللغات الثلاث إلزامي.`,
            `Lütfen (${langLabel}) dilinde kurs başlığını giriniz. Tüm 3 dilde kurs adı zorunludur.`,
            `Please enter the course title in (${langLabel}). Entering content in all 3 languages is required.`
          )
        );
        setActiveTab(lang);
        return;
      }
    }

    saveMutation.mutate(form);
  };

  const filteredCourses = courses.filter(c => {
    const arTitle = c.translations?.find(t => t.lang === 'ar')?.title || '';
    const enTitle = c.translations?.find(t => t.lang === 'en')?.title || '';
    return (
      c.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            {currentLanguage === 'ar' ? 'الدورات التدريبية واختبارات القبول' : 'Preparation Courses & Exams'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'إدارة دورات اليوس (YÖS)، التومر (TÖMER)، السات واللغات ومتابعة المسجلين' : 'Manage exam preparation courses, schedules, pricing and student registrations'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition"
        >
          <Plus size={16} />
          <span>{tx('إضافة دورة جديدة', 'Yeni Kurs Ekle', 'Add Course')}</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={tx('بحث بالاسم أو المعرف...', 'Kurs veya kimlik ara...', 'Search courses...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {tx('إجمالي الدورات:', 'Toplam Kurs:', 'Total Courses:')} {courses.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>{ta("جاري تحميل الدورات...")}</span>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">{ta("الدورة")}</th>
                  <th className="px-4 py-4 text-start">{ta("نمط الدراسة والمدة")}</th>
                  <th className="px-4 py-4 text-start">{ta("السعة والتسجيلات")}</th>
                  <th className="px-4 py-4 text-start">{ta("الحالة")}</th>
                  <th className="px-6 py-4 text-end">{ta("إجراءات")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((crs) => {
                  const arTitle = crs.translations?.find(t => t.lang === 'ar')?.title || crs.slug;
                  const enTitle = crs.translations?.find(t => t.lang === 'en')?.title;
                  const regCount = crs.registrations?.length || crs.registeredCount || 0;
                  return (
                    <tr key={crs.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{arTitle}</div>
                        {enTitle && <div className="text-[11px] text-slate-400">{enTitle}</div>}
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">/{crs.slug}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-700">
                          {crs.studyMode === 'ONLINE' ? ta('أونلاين (Online)') : crs.studyMode === 'IN_PERSON' ? ta('حضوري') : ta('هجين (Hybrid)')}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-1">{crs.durationWeeks} {tx('أسابيع مكثفة', 'hafta yoğun', 'weeks intensive')}</div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setSelectedCourseForRegs(crs)}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-brand-amber-700 rounded-lg font-bold text-xs transition"
                        >
                          <Users size={13} />
                          <span>{regCount} / {crs.capacity || '∞'} {tx('طالب', 'öğrenci', 'students')}</span>
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        {crs.published ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">{ta("متاحة")}</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">{ta("مسودة")}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(crs)}
                            className="p-1.5 text-slate-600 hover:text-brand-navy-950 hover:bg-slate-100 rounded-lg transition"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(tx(`هل أنت متأكد من حذف دورة ${arTitle}؟`, `${arTitle} kursunu silmek istediğinize emin misiniz?`, `Are you sure you want to delete course ${arTitle}?`))) {
                                deleteMutation.mutate(crs.id);
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
            {ta("لا توجد دورات مسجلة")}
          </div>
        )}
      </div>

      {/* Registrations Drawer */}
      {selectedCourseForRegs && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">{ta("سجل المسجلين بالدورة")}</span>
                <h2 className="text-lg font-bold mt-1">
                  {selectedCourseForRegs.translations?.find(t => t.lang === 'ar')?.title || selectedCourseForRegs.slug}
                </h2>
              </div>
              <button
                onClick={() => setSelectedCourseForRegs(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {selectedCourseForRegs.registrations?.length > 0 ? (
                selectedCourseForRegs.registrations.map((reg) => (
                  <div key={reg.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                      <span>{reg.fullName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(reg.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US')}
                      </span>
                    </div>
                    <div className="text-slate-600">{reg.email}</div>
                    <div className="text-emerald-700 font-semibold ltr text-start">{reg.phone}</div>
                    {reg.notes && (
                      <div className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100 mt-2">
                        {tx('ملاحظة الطالب:', 'Öğrenci Notu:', 'Student Note:')} {reg.notes}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 text-sm">
                  {ta("لا توجد طلبات تسجيل مسجلة لهذه الدورة حتى الآن.")}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? ta('تعديل بيانات الدورة') : ta('إضافة دورة تدريبية جديدة')}
                </span>
                <h2 className="text-xl font-bold mt-0.5">
                  {currentTrans.title || form.slug || ta('الدورة التحضيرية')}
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
                    placeholder="yos-prep-course-2026"
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{ta("نمط الحضور")}</label>
                  <select
                    value={form.studyMode}
                    onChange={(e) => setForm({ ...form, studyMode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  >
                    <option value="ONLINE">{ta("أونلاين (Online)")}</option>
                    <option value="IN_PERSON">{ta("حضوري (In Person)")}</option>
                    <option value="HYBRID">{ta("هجين (Hybrid)")}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{ta("المدة (بالأسابيع)")}</label>
                  <input
                    type="number"
                    value={form.durationWeeks}
                    onChange={(e) => setForm({ ...form, durationWeeks: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{ta("السعة القصوى (طالب)")}</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{ta("المواعيد")}</label>
                  <input
                    type="text"
                    placeholder={ta("سبت - اثنين - أربعاء")}
                    value={form.schedule}
                    onChange={(e) => setForm({ ...form, schedule: e.target.value })}
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
                      const trObj = form.translations?.find((t) => t.lang === lng);
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
                    tx('يجب ملء اسم الدورة باللغات الثلاث', '3 dilde kurs adı girişi zorunludur', 'Course title required in all 3 languages')
                  </span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{tx('عنوان الدورة', 'Kurs Başlığı', 'Course Title')} ({activeTab.toUpperCase()})*</label>
                    <input
                      type="text"
                      required={activeTab === 'ar'}
                      placeholder={activeTab === 'ar' ? 'دورة التحضير لاختبار اليوس الموحد TR-YÖS' : 'TR-YÖS Exam Preparation Course'}
                      value={currentTrans.title || ''}
                      onChange={(e) => handleTransChange(activeTab, 'title', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{ta("اسم المحاضر / المدرب")}</label>
                    <input
                      type="text"
                      placeholder={ta("د. أحمد الأحمد - خبير الرياضيات والذكاء IQ")}
                      value={currentTrans.instructor || ''}
                      onChange={(e) => handleTransChange(activeTab, 'instructor', e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">{ta("وصف الدورة والمخرجات")}</label>
                    <textarea
                      rows={3}
                      placeholder={ta("شرح متكامل لأسئلة الذكاء والهندسة والجبر وحل نماذج السنوات السابقة...")}
                      value={currentTrans.description || ''}
                      onChange={(e) => handleTransChange(activeTab, 'description', e.target.value)}
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
                  {saveMutation.isPending ? ta('جاري الحفظ...') : ta('حفظ الدورة')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
