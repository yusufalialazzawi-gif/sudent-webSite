import React, { useState, useRef } from 'react';
import { ta, tx } from '../../i18n/adminText';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  EyeOff,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  User,
  GraduationCap,
  Calendar,
  Plus,
  Edit,
  Upload,
  X,
  Sparkles,
  Quote,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminReviewsPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('testimonials'); // 'testimonials' or 'uniReviews'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Testimonial Modal State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    studentName: '',
    nationality: '',
    program: '',
    university: '',
    rating: 5,
    quoteAr: '',
    quoteTr: '',
    quoteEn: '',
    avatarUrl: '',
    verified: true,
    published: true,
  });
  const [activeQuoteTab, setActiveQuoteTab] = useState('ar');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarFileRef = useRef(null);

  // University Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    universityId: '',
    studentName: '',
    studentCountry: '',
    programStudied: '',
    rating: 5,
    comment: '',
    status: 'APPROVED',
    isVerified: true,
  });

  // Fetch Universities for dropdown selection
  const { data: universities = [] } = useQuery({
    queryKey: ['adminUniversitiesForReviews'],
    queryFn: async () => {
      const res = await api.getAdminUniversities();
      return res.data || [];
    },
  });

  // Fetch student testimonials (homepage & about page reviews with photos)
  const { data: testimonials = [], isLoading: isTestimonialsLoading } = useQuery({
    queryKey: ['adminTestimonials'],
    queryFn: async () => {
      const res = await api.getAdminTestimonials();
      return res.data || [];
    },
  });

  // Fetch university reviews
  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ['adminReviews', statusFilter],
    queryFn: async () => {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.getAdminReviews(params);
      return res.data || [];
    },
  });

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  // Testimonial Mutations
  const saveTestimonialMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingTestimonialId) {
        return await api.updateAdminTestimonial(editingTestimonialId, payload);
      } else {
        return await api.createAdminTestimonial(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTestimonials']);
      closeTestimonialModal();
      showNotification(tx('تم حفظ تقييم الطالب بنجاح!', 'Öğrenci yorumu başarıyla kaydedildi!', 'Student review saved successfully!'));
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Error saving testimonial');
    },
  });

  const deleteTestimonialMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteAdminTestimonial(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminTestimonials']);
      showNotification(tx('تم حذف التقييم بنجاح!', 'Yorum başarıyla silindi!', 'Review deleted successfully!'));
    },
    onError: (err) => {
      alert(err.message || 'Error deleting testimonial');
    },
  });

  // University Review Mutations
  const saveReviewMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingReviewId) {
        return await api.moderateReview(editingReviewId, payload);
      } else {
        return await api.createAdminReview(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReviews']);
      closeReviewModal();
      showNotification(tx('تم حفظ المراجعة بنجاح!', 'Değerlendirme başarıyla kaydedildi!', 'Review saved successfully!'));
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Error saving review');
    },
  });

  const moderateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await api.moderateReview(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReviews']);
      showNotification(tx('تم تحديث حالة المراجعة بنجاح!', 'Değerlendirme durumu güncellendi!', 'Review status updated successfully!'));
    },
    onError: (err) => {
      alert(err.message || 'Error updating review');
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (id) => {
      if (!window.confirm(tx('هل أنت متأكد من حذف هذا التعليق نهائياً؟', 'Bu değerlendirmeyi kalıcı olarak silmek istediğinize emin misiniz?', 'Are you sure you want to permanently delete this review?'))) {
        return;
      }
      return await api.deleteReview(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminReviews']);
      showNotification(tx('تم حذف المراجعة بنجاح!', 'Değerlendirme silindi!', 'Review deleted successfully!'));
    },
    onError: (err) => {
      alert(err.message || 'Error deleting review');
    },
  });

  // Upload student avatar file
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assetType', 'IMAGE');
      const res = await api.uploadMedia(formData);
      if (res?.data?.url) {
        setTestimonialForm((prev) => ({ ...prev, avatarUrl: res.data.url }));
      }
    } catch (err) {
      setErrorMsg(err.message || 'Fotoğraf yüklenemedi');
    } finally {
      setUploadingAvatar(false);
      if (avatarFileRef.current) avatarFileRef.current.value = '';
    }
  };

  // Modal Handlers
  const openCreateTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      studentName: '',
      nationality: '',
      program: '',
      university: '',
      rating: 5,
      quoteAr: '',
      quoteTr: '',
      quoteEn: '',
      avatarUrl: '',
      verified: true,
      published: true,
    });
    setErrorMsg('');
    setActiveQuoteTab(currentLanguage === 'tr' ? 'tr' : currentLanguage === 'en' ? 'en' : 'ar');
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonial = (item) => {
    setEditingTestimonialId(item.id);
    setTestimonialForm({
      studentName: item.studentName || '',
      nationality: item.nationality || '',
      program: item.program || '',
      university: item.university || '',
      rating: item.rating || 5,
      quoteAr: item.quoteAr || '',
      quoteTr: item.quoteTr || '',
      quoteEn: item.quoteEn || '',
      avatarUrl: item.avatarUrl || '',
      verified: Boolean(item.verified),
      published: Boolean(item.published),
    });
    setErrorMsg('');
    setActiveQuoteTab(currentLanguage === 'tr' ? 'tr' : currentLanguage === 'en' ? 'en' : 'ar');
    setIsTestimonialModalOpen(true);
  };

  const closeTestimonialModal = () => {
    setIsTestimonialModalOpen(false);
    setEditingTestimonialId(null);
    setErrorMsg('');
  };

  const handleTestimonialSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!testimonialForm.studentName.trim()) {
      setErrorMsg(tx('يرجى إدخال اسم الطالب (حقل إلزامي).', 'Lütfen öğrenci adını giriniz (zorunlu alan).', 'Please enter student name (required).'));
      return;
    }

    if (!testimonialForm.avatarUrl?.trim()) {
      setErrorMsg(tx('يرجى تحميل صورة شخصية للطالب أو إدخال رابطها المباشر (صورة الطالب إلزامية).', 'Lütfen öğrenci fotoğrafını yükleyiniz veya görsel bağlantısını giriniz (Fotoğraf zorunlu alandır).', 'Please upload or provide a student photo (Photo is required).'));
      return;
    }

    const hasAnyQuote =
      testimonialForm.quoteAr.trim() ||
      testimonialForm.quoteTr.trim() ||
      testimonialForm.quoteEn.trim();

    if (!hasAnyQuote) {
      setErrorMsg(tx('يرجى إدخال نص مراجعة أو رأي الطالب (حقل إلزامي).', 'Lütfen öğrencinin yorumunu / görüşünü yazınız (zorunlu alan).', 'Please enter student review/quote (required).'));
      return;
    }

    saveTestimonialMutation.mutate(testimonialForm);
  };

  const openCreateReview = () => {
    setEditingReviewId(null);
    setReviewForm({
      universityId: universities[0]?.id || '',
      studentName: '',
      studentCountry: '',
      programStudied: '',
      rating: 5,
      comment: '',
      status: 'APPROVED',
      isVerified: true,
    });
    setErrorMsg('');
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setEditingReviewId(null);
    setErrorMsg('');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!reviewForm.universityId) {
      setErrorMsg(tx('يرجى اختيار الجامعة المعنية (حقل إلزامي).', 'Lütfen üniversiteyi seçiniz (zorunlu alan).', 'Please select a university (required).'));
      return;
    }
    if (!reviewForm.studentName.trim()) {
      setErrorMsg(tx('يرجى كتابة اسم الطالب (حقل إلزامي).', 'Lütfen öğrenci adını yazınız (zorunlu alan).', 'Please enter student name (required).'));
      return;
    }
    if (!reviewForm.comment.trim()) {
      setErrorMsg(tx('يرجى كتابة نص التقييم (حقل إلزامي).', 'Lütfen değerlendirme yorumunu yazınız (zorunlu alan).', 'Please enter review comment (required).'));
      return;
    }

    saveReviewMutation.mutate(reviewForm);
  };

  // Filtered Testimonials
  const filteredTestimonials = testimonials.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      (t.studentName || '').toLowerCase().includes(q) ||
      (t.university || '').toLowerCase().includes(q) ||
      (t.program || '').toLowerCase().includes(q) ||
      (t.quoteAr || '').toLowerCase().includes(q) ||
      (t.quoteTr || '').toLowerCase().includes(q) ||
      (t.quoteEn || '').toLowerCase().includes(q)
    );
  });

  // Filtered University Reviews
  const filteredReviews = reviews.filter((r) => {
    const q = searchTerm.toLowerCase();
    const uniName =
      r.university?.translations?.find((t) => t.lang === currentLanguage)?.name ||
      r.university?.translations?.find((t) => t.lang === 'ar')?.name ||
      r.university?.translations?.find((t) => t.lang === 'tr')?.name ||
      r.university?.translations?.find((t) => t.lang === 'en')?.name ||
      r.university?.slug ||
      '';
    return (
      (r.studentName || '').toLowerCase().includes(q) ||
      (r.comment || '').toLowerCase().includes(q) ||
      uniName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-cairo">
            {tx('إدارة آراء وتقييمات الطلاب وقصص النجاح', 'Öğrenci Yorumları, Fotoğrafları ve Değerlendirmeler', 'Student Reviews, Photos & Testimonials')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {tx(
              'إضافة آراء الطلاب مع الصور والجامعات والتخصصات، وتعديل تقييمات الجامعات والموافقة عليها',
              'Öğrencilerin fotoğraflı yorumlarını (başarı hikâyeleri) ekleyin, üniversite değerlendirmelerini inceleyin ve yönetin',
              'Add and manage student reviews with photos and universities, moderate incoming ratings and testimonials'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'testimonials' ? (
            <button
              onClick={openCreateTestimonial}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <Plus size={16} />
              <span>{tx('إضافة رأي طالب (مع الصورة)', 'Yeni Öğrenci Yorumu Ekle (Fotoğraflı)', 'Add Student Review (with Photo)')}</span>
            </button>
          ) : (
            <button
              onClick={openCreateReview}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              <Plus size={16} />
              <span>{tx('إضافة تقييم جامعة جديد', 'Yeni Üniversite Değerlendirmesi Ekle', 'Add University Review')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-3 shadow-sm animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('testimonials');
            setSearchTerm('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'testimonials'
              ? 'bg-brand-navy-950 text-brand-amber-400 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Quote size={15} />
          <span>{tx('آراء الطلاب المعروضة في الموقع (مع الصور)', 'Öğrenci Yorumları & Başarı Hikâyeleri (Fotoğraflı)', 'Student Testimonials (with Photos)')}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-brand-amber-300 font-mono">
            {testimonials.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('uniReviews');
            setSearchTerm('');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'uniReviews'
              ? 'bg-brand-navy-950 text-brand-amber-400 shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare size={15} />
          <span>{tx('تقييمات صفحات الجامعات', 'Üniversite Sayfası Değerlendirmeleri', 'University Detail Reviews')}</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-brand-amber-300 font-mono">
            {reviews.length}
          </span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={tx('بحث باسم الطالب، الجامعة، أو نص التقييم...', 'Öğrenci adı, üniversite veya yorum içeriği ara...', 'Search by student, university, or quote...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full ps-9 pe-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>

        {activeTab === 'uniReviews' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={15} className="text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-brand-amber-500"
            >
              <option value="">{tx('جميع الحالات', 'Tüm Durumlar', 'All Statuses')}</option>
              <option value="APPROVED">{tx('معتمد ومنشور', 'Onaylı & Yayında', 'Approved')}</option>
              <option value="PENDING">{tx('قيد المراجعة', 'İncelemede', 'Pending')}</option>
              <option value="REJECTED">{tx('مرفوض', 'Reddedildi', 'Rejected')}</option>
              <option value="HIDDEN">{tx('مخفي', 'Gizli', 'Hidden')}</option>
            </select>
          </div>
        )}
      </div>

      {/* ================= TAB 1: TESTIMONIALS (STUDENT REVIEWS WITH PHOTOS) ================= */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          {isTestimonialsLoading ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>{tx('جاري تحميل آراء الطلاب...', 'Öğrenci yorumları yükleniyor...', 'Loading testimonials...')}</span>
            </div>
          ) : filteredTestimonials.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-3">
              <Quote className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="font-bold text-slate-700 text-sm">
                {tx('لا توجد آراء مسجلة حتى الآن', 'Kayıtlı öğrenci yorumu bulunamadı', 'No student testimonials found')}
              </h3>
              <p className="text-xs">
                {tx('اضغط على "إضافة رأي طالب" لإضافة رأي مصحوب بصورة الطالب والجامعة والتقييم ليظهر في الصفحة الرئيسية.', 'Ana sayfada ve tanıtımlarda görünecek fotoğraflı yeni bir öğrenci yorumu ekleyin.', 'Click "Add Student Review" to create a featured testimonial with photo and rating.')}
              </p>
              <button
                onClick={openCreateTestimonial}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-amber-500 text-white rounded-xl text-xs font-bold shadow"
              >
                <Plus size={14} />
                <span>{tx('إضافة أول رأي طالب', 'İlk Yorumu Ekle', 'Add First Review')}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTestimonials.map((item) => {
                const quoteText =
                  currentLanguage === 'tr'
                    ? item.quoteTr || item.quoteAr || item.quoteEn
                    : currentLanguage === 'en'
                    ? item.quoteEn || item.quoteTr || item.quoteAr
                    : item.quoteAr || item.quoteTr || item.quoteEn;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Row: Stars and Actions */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-1 text-brand-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= (item.rating || 5) ? 'fill-brand-amber-400 text-brand-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEditTestimonial(item)}
                            className="p-1.5 text-slate-500 hover:text-brand-navy-950 hover:bg-slate-100 rounded-lg transition"
                            title={tx('تعديل', 'Düzenle', 'Edit')}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(tx('هل أنت متأكد من حذف رأي هذا الطالب نهائياً؟', 'Bu öğrenci yorumunu silmek istediğinize emin misiniz?', 'Delete this testimonial permanently?'))) {
                                deleteTestimonialMutation.mutate(item.id);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                            title={tx('حذف', 'Sil', 'Delete')}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Quote Text */}
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic pt-2 line-clamp-4">
                        "{quoteText}"
                      </p>
                    </div>

                    {/* Student Info Footer with Avatar */}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <img
                        src={
                          item.avatarUrl ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                        }
                        alt={item.studentName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-brand-amber-500/30 shrink-0 bg-slate-100"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-brand-navy-950 truncate">{item.studentName}</h4>
                          {item.verified && (
                            <span title="Verified Admission">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        {item.program && <p className="text-[11px] text-brand-amber-600 font-semibold truncate">{item.program}</p>}
                        <p className="text-[10px] text-slate-400 truncate">
                          {item.university || 'Türkiye'} {item.nationality ? `(${item.nationality})` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: UNIVERSITY DETAIL REVIEWS ================= */}
      {activeTab === 'uniReviews' && (
        <div className="space-y-4">
          {isReviewsLoading ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>{tx('جاري تحميل المراجعات...', 'Değerlendirmeler yükleniyor...', 'Loading reviews...')}</span>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
              <MessageSquare className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="font-bold text-slate-700 text-base">
                {tx('لا توجد تقييمات مطابقة', 'Eşleşen değerlendirme bulunamadı', 'No matching reviews found')}
              </h3>
              <p className="text-xs">
                {tx('عندما يقدم الطلاب مراجعاتهم لصفحات الجامعات ستظهر هنا للمعاينة والاعتماد.', 'Öğrenciler üniversite değerlendirmesi gönderdiğinde burada inceleme ve onay için görünecek.', 'Student reviews submitted on university pages will appear here for moderation.')}
              </p>
            </div>
          ) : (
            filteredReviews.map((rev) => {
              const uniName =
                rev.university?.translations?.find((t) => t.lang === currentLanguage)?.name ||
                rev.university?.translations?.find((t) => t.lang === 'ar')?.name ||
                rev.university?.translations?.find((t) => t.lang === 'tr')?.name ||
                rev.university?.translations?.find((t) => t.lang === 'en')?.name ||
                rev.university?.slug ||
                '';
              const dateLocale = currentLanguage === 'tr' ? 'tr-TR' : currentLanguage === 'en' ? 'en-US' : 'ar-EG';

              return (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                        {rev.studentName?.[0]?.toUpperCase() || 'S'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{rev.studentName}</span>
                          {rev.isVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>{tx('طالب موثق', 'Onaylı Öğrenci', 'Verified Student')}</span>
                            </span>
                          )}
                          {rev.studentCountry && (
                            <span className="text-[11px] text-slate-400">({rev.studentCountry})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span className="font-semibold text-brand-navy-900">{uniName}</span>
                          {rev.programStudied && (
                            <span className="flex items-center gap-1 text-slate-400">
                              <GraduationCap className="w-3 h-3" />
                              <span>{rev.programStudied}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Rating Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Status Pill */}
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          rev.status === 'APPROVED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : rev.status === 'PENDING'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : rev.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </div>
                  </div>

                  {/* Comment Body */}
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                    "{rev.comment}"
                  </p>

                  {/* Moderation Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(rev.createdAt).toLocaleDateString(dateLocale)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle Verified */}
                      <button
                        onClick={() =>
                          moderateMutation.mutate({
                            id: rev.id,
                            data: { isVerified: !rev.isVerified },
                          })
                        }
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs border transition ${
                          rev.isVerified
                            ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {rev.isVerified ? tx('إلغاء التوثيق', 'Doğrulamayı Kaldır', 'Unverify') : tx('توثيق كطالب مسجل', 'Kayıtlı Öğrenci Olarak Doğrula', 'Mark as Verified')}
                      </button>

                      {/* Approve */}
                      {rev.status !== 'APPROVED' && (
                        <button
                          onClick={() =>
                            moderateMutation.mutate({
                              id: rev.id,
                              data: { status: 'APPROVED' },
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm transition"
                        >
                          {tx('موافقة ونشر', 'Onayla ve Yayınla', 'Approve')}
                        </button>
                      )}

                      {/* Hide */}
                      {rev.status === 'APPROVED' && (
                        <button
                          onClick={() =>
                            moderateMutation.mutate({
                              id: rev.id,
                              data: { status: 'HIDDEN' },
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                        >
                          {tx('إخفاء', 'Gizle', 'Hide')}
                        </button>
                      )}

                      {/* Reject */}
                      {rev.status !== 'REJECTED' && (
                        <button
                          onClick={() =>
                            moderateMutation.mutate({
                              id: rev.id,
                              data: { status: 'REJECTED' },
                            })
                          }
                          className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs transition"
                        >
                          {tx('رفض', 'Reddet', 'Reject')}
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => deleteReviewMutation.mutate(rev.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition"
                        title={tx('حذف نهائي', 'Kalıcı Olarak Sil', 'Delete')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT STUDENT TESTIMONIAL ================= */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {editingTestimonialId ? tx('تعديل رأي الطالب', 'Öğrenci Yorumunu Düzenle', 'Edit Testimonial') : tx('إضافة رأي طالب جديد', 'Yeni Öğrenci Yorumu Ekle', 'New Student Testimonial')}
                </span>
                <h3 className="text-lg font-bold mt-0.5">{testimonialForm.studentName || tx('معلومات الطالب والصورة', 'Öğrenci Bilgileri ve Fotoğrafı', 'Student Info & Photo')}</h3>
              </div>
              <button onClick={closeTestimonialModal} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={18} />
              </button>
            </div>

            {/* Error Banner inside Modal */}
            {errorMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleTestimonialSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Photo / Avatar Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-brand-amber-500 overflow-hidden bg-white shadow shrink-0">
                  <img
                    src={
                      testimonialForm.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
                    }
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <label className="block font-bold text-slate-700 flex items-center justify-between">
                    <span>{tx('صورة الطالب الشخصية / الأفاتار *', 'Öğrencinin Fotoğrafı / Avatarı *', 'Student Photo / Avatar *')}</span>
                    <span className="text-[10px] text-rose-500 font-bold">{tx('(إلزامي)', '(Zorunlu Alan)', '(Required)')}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="https://... veya dosya yükleyin"
                      value={testimonialForm.avatarUrl}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs text-start"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-brand-navy-950 text-white font-bold text-xs hover:bg-brand-navy-800 transition disabled:opacity-50"
                    >
                      <Upload size={14} />
                      <span>{uploadingAvatar ? '...' : tx('رفع صورة', 'Fotoğraf Yükle', 'Upload Photo')}</span>
                    </button>
                    <input ref={avatarFileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                  </div>
                </div>
              </div>

              {/* Student Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tx('اسم الطالب الكامل * (إلزامي)', 'Öğrenci Adı Soyadı * (Zorunlu)', 'Student Full Name * (Required)')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tx('سارة خليل', 'Sara Khalil', 'Sara Khalil')}
                    value={testimonialForm.studentName}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, studentName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tx('البلد / الجنسية', 'Ülke / Uyruk', 'Country / Nationality')}
                  </label>
                  <input
                    type="text"
                    placeholder={tx('العراق / مصر / المغرب', 'Irak, Mısır, Suriye vb.', 'Iraq, Egypt, Syria...')}
                    value={testimonialForm.nationality}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, nationality: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tx('الجامعة الملتحق بها', 'Kabul Aldığı Üniversite', 'Admitted University')}
                  </label>
                  <input
                    type="text"
                    placeholder={tx('جامعة إسطنبول أيدن', 'İstanbul Aydın Üniversitesi', 'Istanbul Aydin University')}
                    value={testimonialForm.university}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, university: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tx('التخصص / البرنامج', 'Bölüm / Program', 'Program / Major')}
                  </label>
                  <input
                    type="text"
                    placeholder={tx('طب بشري / هندسة حاسوب', 'Tıp Fakültesi / Bilgisayar Müh.', 'Medicine / Computer Eng.')}
                    value={testimonialForm.program}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, program: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tx('التقييم بالنجوم (1 - 5)', 'Yıldız Puanı (1 - 5)', 'Star Rating (1 - 5)')}
                  </label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs font-bold"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
                    <option value="4">⭐⭐⭐⭐ (4 / 5)</option>
                    <option value="3">⭐⭐⭐ (3 / 5)</option>
                    <option value="2">⭐⭐ (2 / 5)</option>
                    <option value="1">⭐ (1 / 5)</option>
                  </select>
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={testimonialForm.verified}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, verified: e.target.checked })}
                      className="w-4 h-4 rounded text-brand-amber-500 focus:ring-brand-amber-500"
                    />
                    <span>{tx('طالب موثق (شارة الاعتماد)', 'Onaylı Öğrenci Rozeti', 'Verified Badge')}</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={testimonialForm.published}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, published: e.target.checked })}
                      className="w-4 h-4 rounded text-brand-amber-500 focus:ring-brand-amber-500"
                    />
                    <span>{tx('نشر في الموقع', 'Sitede Yayınla', 'Published')}</span>
                  </label>
                </div>
              </div>

              {/* Multi-language Quote Box */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-100 p-2 flex items-center justify-between border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700 px-2 flex items-center gap-1.5">
                    <Quote size={14} className="text-brand-amber-500" />
                    <span>{tx('نص رأي وتجربة الطالب * (3 لغات):', 'Öğrencinin Yorumu & Deneyimi * (3 Dilde):', 'Student Review Quote * (3 Languages):')}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    {['ar', 'tr', 'en'].map((lng) => (
                      <button
                        key={lng}
                        type="button"
                        onClick={() => setActiveQuoteTab(lng)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          activeQuoteTab === lng
                            ? 'bg-white text-brand-navy-950 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {lng === 'ar' ? 'العربية 🇸🇦' : lng === 'tr' ? 'Türkçe 🇹🇷' : 'English 🇬🇧'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white">
                  {activeQuoteTab === 'ar' && (
                    <textarea
                      rows={3}
                      placeholder="اكتب هنا رأي الطالب بالعربية: ساعدني الفريق في تأمين قبولي الجامعي بسرعة وسهولة..."
                      value={testimonialForm.quoteAr}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, quoteAr: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                    />
                  )}
                  {activeQuoteTab === 'tr' && (
                    <textarea
                      rows={3}
                      placeholder="Öğrencinin Türkçe yorumu: Türkiye'de üniversite kabulümde her aşamada yanımda oldular, çok teşekkür ederim..."
                      value={testimonialForm.quoteTr}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, quoteTr: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                    />
                  )}
                  {activeQuoteTab === 'en' && (
                    <textarea
                      rows={3}
                      placeholder="Student quote in English: Exceptional guidance and smooth admission process from start to finish..."
                      value={testimonialForm.quoteEn}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, quoteEn: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                    />
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    {tx('ملاحظة: يمكنك الكتابة بلغة واحدة وسيتكفل النظام بعرضها تلقائياً إذا تركت اللغات الأخرى فارغة.', 'Not: Tek bir dilde yazsanız dahi sistem diğer dillerde otomatik gösterecektir.', 'Note: Writing in one language is sufficient; system will auto-fallback for others.')}
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={closeTestimonialModal}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  {tx('إلغاء', 'İptal', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saveTestimonialMutation.isPending}
                  className="px-6 py-2.5 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {saveTestimonialMutation.isPending
                    ? tx('جاري الحفظ...', 'Kaydediliyor...', 'Saving...')
                    : tx('حفظ رأي الطالب', 'Öğrenci Yorumunu Kaydet', 'Save Student Review')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT UNIVERSITY REVIEW ================= */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {tx('إضافة تقييم جامعة', 'Üniversite Değerlendirmesi Ekle', 'Add University Review')}
                </span>
                <h3 className="text-lg font-bold mt-0.5">{tx('تقييم جديد لصفحة الجامعة', 'Yeni Üniversite Yorumu', 'New University Page Review')}</h3>
              </div>
              <button onClick={closeReviewModal} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tx('اختر الجامعة * (إلزامي)', 'Üniversite Seçin * (Zorunlu)', 'Select University * (Required)')}
                </label>
                <select
                  required
                  value={reviewForm.universityId}
                  onChange={(e) => setReviewForm({ ...reviewForm, universityId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs font-semibold"
                >
                  <option value="">{tx('-- اختر الجامعة --', '-- Üniversite Seçiniz --', '-- Select University --')}</option>
                  {universities.map((uni) => {
                    const uName =
                      uni.translations?.find((t) => t.lang === currentLanguage)?.name ||
                      uni.translations?.find((t) => t.lang === 'ar')?.name ||
                      uni.translations?.find((t) => t.lang === 'tr')?.name ||
                      uni.slug;
                    return (
                      <option key={uni.id} value={uni.id}>
                        {uName} ({uni.city})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tx('اسم الطالب * (إلزامي)', 'Öğrenci Adı Soyadı * (Zorunlu)', 'Student Full Name * (Required)')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ali Yılmaz"
                    value={reviewForm.studentName}
                    onChange={(e) => setReviewForm({ ...reviewForm, studentName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tx('بلد الطالب / الجنسية', 'Öğrencinin Ülkesi / Uyruğu', 'Student Country')}
                  </label>
                  <input
                    type="text"
                    placeholder="Syria, Iraq..."
                    value={reviewForm.studentCountry}
                    onChange={(e) => setReviewForm({ ...reviewForm, studentCountry: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tx('التخصص الأكاديمي', 'Okuduğu Bölüm', 'Program / Department')}
                  </label>
                  <input
                    type="text"
                    placeholder="Biomedical Engineering"
                    value={reviewForm.programStudied}
                    onChange={(e) => setReviewForm({ ...reviewForm, programStudied: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {tx('التقييم بالنجوم (1 - 5)', 'Puan (1 - 5 Yıldız)', 'Star Rating')}
                  </label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs font-bold"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5 / 5)</option>
                    <option value="4">⭐⭐⭐⭐ (4 / 5)</option>
                    <option value="3">⭐⭐⭐ (3 / 5)</option>
                    <option value="2">⭐⭐ (2 / 5)</option>
                    <option value="1">⭐ (1 / 5)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tx('نص التعليق والتقييم * (إلزامي)', 'Değerlendirme Yorumu * (Zorunlu)', 'Review Comment * (Required)')}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={tx('اكتب هنا تقييم الطالب عن الجامعة وحرمها وجودة التدريس...', 'Üniversite kampüsü, eğitimi ve imkanları hakkındaki değerlendirmeyi yazın...', 'Write review text about campus, teaching, student life...')}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 text-xs"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={reviewForm.isVerified}
                    onChange={(e) => setReviewForm({ ...reviewForm, isVerified: e.target.checked })}
                    className="w-4 h-4 rounded text-brand-amber-500 focus:ring-brand-amber-500"
                  />
                  <span>{tx('طالب موثق (شارة خضراء)', 'Onaylı Öğrenci Rozeti', 'Verified Badge')}</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">{tx('الحالة:', 'Durum:', 'Status:')}</span>
                  <select
                    value={reviewForm.status}
                    onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold"
                  >
                    <option value="APPROVED">{tx('معتمد ومنشور', 'Onaylandı & Yayında', 'Approved')}</option>
                    <option value="PENDING">{tx('قيد المراجعة', 'İncelemede', 'Pending')}</option>
                    <option value="HIDDEN">{tx('مخفي', 'Gizli', 'Hidden')}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  {tx('إلغاء', 'İptal', 'Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saveReviewMutation.isPending}
                  className="px-6 py-2.5 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
                >
                  {saveReviewMutation.isPending
                    ? tx('جاري الحفظ...', 'Kaydediliyor...', 'Saving...')
                    : tx('حفظ التقييم', 'Değerlendirmeyi Kaydet', 'Save Review')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
