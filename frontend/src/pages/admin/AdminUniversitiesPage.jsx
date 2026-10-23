import React, { useState, useRef } from 'react';
import { ta, tx } from '../../i18n/adminText';
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
  BookOpen,
  Video,
  Play,
  Calendar,
  Clock,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Eye,
  Layers,
  FileCheck,
  DollarSign,
  Check,
  UploadCloud,
  Link as LinkIcon,
  Image as ImageIcon,
  LayoutGrid,
  List,
  FileText,
  FolderPlus,
  Camera,
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import ApplicationStatusBadge from '../../components/common/ApplicationStatusBadge';
import UniversityVideoPlayer from '../../components/common/UniversityVideoPlayer';
import DepartmentsFormSection from './universities/DepartmentsFormSection';

export default function AdminUniversitiesPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activeTab, setActiveTab] = useState('ar');
  const [activeFormSection, setActiveFormSection] = useState('BASIC'); // 'BASIC', 'VIDEO', 'ADMISSION', 'SECTIONS', 'LANG'
  const [validationError, setValidationError] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // View Mode: 'cards' (Kart Görünümü) or 'table' (Tablo Görünümü)
  const [viewMode, setViewMode] = useState('cards');

  // Media & Files Modal State (Özel Dosya & Görsel Yönetimi)
  const [activeMediaUni, setActiveMediaUni] = useState(null);
  const [mediaModalData, setMediaModalData] = useState({
    coverImageUrl: '',
    logoUrl: '',
    galleryFiles: [],
  });
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaUploadError, setMediaUploadError] = useState('');
  const [mediaUploadSuccess, setMediaUploadSuccess] = useState('');
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');

  // Video Management State
  const [videoSourceMode, setVideoSourceMode] = useState('UPLOAD'); // 'UPLOAD' or 'LINK'
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadMsg, setVideoUploadMsg] = useState(null);
  const videoFileInputRef = useRef(null);

  // Import 60 Universities State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);
  const [importRegistry, setImportRegistry] = useState(null);
  const [importError, setImportError] = useState(null);

  // Form State
  const initialForm = {
    slug: '',
    type: 'PUBLIC',
    city: 'Istanbul',
    establishedYear: 2000,
    campusType: 'Urban Campus',
    ranking: 10,
    customOrder: 0,
    websiteUrl: '',
    logoUrl: '',
    coverImageUrl: '',
    // Video Attributes
    videoUrl: '',
    videoThumbnailUrl: '',
    videoTitle: '',
    videoDescription: '',
    videoPlacement: 'BOTH', // 'BOTH', 'DETAIL', 'CARD', 'NONE'
    galleryImages: '',
    // Application & Admission Status
    admissionStatus: 'UNCONFIRMED', // 'OPEN', 'CLOSED', 'UPCOMING', 'UNCONFIRMED'
    admissionStartDate: '',
    admissionEndDate: '',
    admissionDeadline: '',
    officialApplicationUrl: '',
    statusNote: '',
    announcementText: '',
    graduateAdmissionOpen: true,
    // Tuition & Visibility
    tuitionVerified: false,
    tuitionNotes: '',
    // Departments (bölüm sayısı & en iyi bölümler)
    departmentCount: '',
    facultyCount: '',
    programCountGrad: '',
    departmentCountBasis: 'LISANS',
    bestDepartments: '[]',
    departmentSourceUrl: '',
    departmentDataAsOf: '',
    showProgramsSection: true,
    showNotarySection: true,
    showFaqSection: true,
    showReviewsSection: true,
    featured: false,
    published: true,
    translations: [
      { lang: 'ar', name: '', overview: '', admissionRequirements: '', accommodationInfo: '', accreditationInfo: '', address: '' },
      { lang: 'tr', name: '', overview: '', admissionRequirements: '', accommodationInfo: '', accreditationInfo: '', address: '' },
      { lang: 'en', name: '', overview: '', admissionRequirements: '', accommodationInfo: '', accreditationInfo: '', address: '' },
    ],
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
      setActionSuccessMessage(
        tx(
          'تم حفظ وتسجيل بيانات الجامعة بنجاح! ✅',
          'Üniversite bilgileri başarıyla kaydedildi! ✅',
          'University data saved successfully! ✅'
        )
      );
      setTimeout(() => setActionSuccessMessage(''), 6000);
    },
    onError: (err) => {
      alert(err.message || 'Error saving university');
    },
  });

  // Mutation: Quick Instant Status Update
  const statusMutation = useMutation({
    mutationFn: async ({ id, status, deadline, statusNote }) => {
      return await api.updateAdmissionStatus(id, {
        admissionStatus: status,
        admissionDeadline: deadline,
        statusNote,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUniversities']);
      setActionSuccessMessage(
        tx(
          'تم تحديث حالة القبول بنجاح! ✅',
          'Kabul durumu başarıyla güncellendi! ✅',
          'Admission status updated successfully! ✅'
        )
      );
      setTimeout(() => setActionSuccessMessage(''), 5000);
    },
    onError: (err) => {
      alert(err.message || 'Error updating admission status');
    },
  });

  // Mutation: Delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteUniversity(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUniversities']);
      queryClient.invalidateQueries(['adminDashboardMetrics']);
      setActionSuccessMessage(
        tx('تم حذف الجامعة بنجاح! ✅', 'Üniversite başarıyla silindi! ✅', 'University deleted successfully! ✅')
      );
      setTimeout(() => setActionSuccessMessage(''), 5000);
    },
    onError: (err) => {
      alert(err.message || 'Error deleting university');
    },
  });

  const handleVideoFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 150 * 1024 * 1024) {
      alert('Video boyutu 150MB sınırını aşıyor. Lütfen daha küçük bir video seçin.');
      return;
    }

    setIsUploadingVideo(true);
    setVideoUploadMsg({
      type: 'info',
      text: ta('Video sunucuya yükleniyor, lütfen bekleyin... / جاري رفع الفيديو...'),
    });

    try {
      const formData = new FormData();
      formData.append('video', file);

      const res = await api.uploadUniversityVideo(formData);
      if (res?.data?.videoUrl) {
        setForm((prev) => ({
          ...prev,
          videoUrl: res.data.videoUrl,
          videoTitle: prev.videoTitle || file.name.replace(/\.[^/.]+$/, ''),
        }));
        setVideoUploadMsg({
          type: 'success',
          text: `Video başarıyla yüklendi! (${(file.size / (1024 * 1024)).toFixed(1)} MB)`,
        });
      }
    } catch (err) {
      setVideoUploadMsg({
        type: 'error',
        text: err.message || 'Video yüklenirken bir hata oluştu.',
      });
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const handleClearVideo = () => {
    setForm((prev) => ({
      ...prev,
      videoUrl: '',
      videoThumbnailUrl: '',
      videoTitle: '',
      videoDescription: '',
    }));
    setVideoUploadMsg(null);
    if (videoFileInputRef.current) {
      videoFileInputRef.current.value = '';
    }
  };

  // Media & Gallery Helpers for Cards and Forms
  const parseGalleryImages = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
      return val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const formatGalleryImages = (arr) => {
    return (arr || []).filter(Boolean).join(', ');
  };

  const openMediaModal = (uni) => {
    setActiveMediaUni(uni);
    setMediaModalData({
      coverImageUrl: uni.coverImageUrl || '',
      logoUrl: uni.logoUrl || '',
      galleryFiles: parseGalleryImages(uni.galleryImages),
    });
    setMediaUploadError('');
    setMediaUploadSuccess('');
    setNewGalleryUrlInput('');
  };

  const closeMediaModal = () => {
    setActiveMediaUni(null);
    setMediaUploadError('');
    setMediaUploadSuccess('');
    setNewGalleryUrlInput('');
  };

  const handleUploadMediaFile = async (e, targetField) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMedia(true);
    setMediaUploadError('');
    setMediaUploadSuccess('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'assetType',
        file.type.startsWith('image/')
          ? 'IMAGE'
          : file.type.startsWith('video/')
          ? 'VIDEO'
          : 'DOCUMENT'
      );

      const res = await api.uploadMedia(formData);
      const fileUrl = res.data?.url;

      if (fileUrl) {
        if (targetField === 'cover') {
          setMediaModalData((prev) => ({ ...prev, coverImageUrl: fileUrl }));
        } else if (targetField === 'logo') {
          setMediaModalData((prev) => ({ ...prev, logoUrl: fileUrl }));
        } else if (targetField === 'gallery') {
          setMediaModalData((prev) => ({
            ...prev,
            galleryFiles: [...prev.galleryFiles, fileUrl],
          }));
        }
      }
    } catch (err) {
      setMediaUploadError(err.message || 'Dosya yükleme başarısız oldu.');
    } finally {
      setIsUploadingMedia(false);
      e.target.value = '';
    }
  };

  const handleSaveMedia = async () => {
    if (!activeMediaUni) return;
    setIsUploadingMedia(true);
    setMediaUploadError('');
    try {
      await api.updateUniversity(activeMediaUni.id, {
        coverImageUrl: mediaModalData.coverImageUrl,
        logoUrl: mediaModalData.logoUrl,
        galleryImages: formatGalleryImages(mediaModalData.galleryFiles),
        translations: activeMediaUni.translations || [],
      });
      queryClient.invalidateQueries(['adminUniversities']);
      setMediaUploadSuccess(
        currentLanguage === 'ar'
          ? ta('تم حفظ وتحديث ملفات وصور الجامعة بنجاح!')
          : 'Üniversite dosyaları ve görselleri başarıyla güncellendi!'
      );
      setTimeout(() => {
        closeMediaModal();
      }, 1000);
    } catch (err) {
      setMediaUploadError(err.message || 'Güncelleme sırasında hata oluştu.');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleFormFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.uploadMedia(formData);
      const fileUrl = res.data?.url;
      if (fileUrl) {
        if (field === 'cover') {
          setForm((prev) => ({ ...prev, coverImageUrl: fileUrl }));
        } else if (field === 'logo') {
          setForm((prev) => ({ ...prev, logoUrl: fileUrl }));
        } else if (field === 'gallery') {
          setForm((prev) => {
            const current = parseGalleryImages(prev.galleryImages);
            return {
              ...prev,
              galleryImages: [...current, fileUrl].join(', '),
            };
          });
        }
      }
    } catch (err) {
      alert(err.message || 'Dosya yüklenemedi');
    } finally {
      e.target.value = '';
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setActiveTab('ar');
    setActiveFormSection('BASIC');
    setVideoUploadMsg(null);
    setVideoSourceMode('UPLOAD');
    setValidationError('');
    setIsModalOpen(true);
  };

  const openEditModal = (uni) => {
    setEditingId(uni.id);
    setVideoUploadMsg(null);
    setValidationError('');
    setVideoSourceMode(
      uni.videoUrl && (uni.videoUrl.startsWith('http://') || uni.videoUrl.startsWith('https://'))
        ? 'LINK'
        : 'UPLOAD'
    );

    const getTranslation = (lang) => {
      const found = uni.translations?.find((t) => t.lang === lang);
      return (
        found || {
          lang,
          name: '',
          overview: '',
          admissionRequirements: '',
          accommodationInfo: '',
          accreditationInfo: '',
          address: '',
        }
      );
    };

    setForm({
      slug: uni.slug,
      type: uni.type || 'PUBLIC',
      city: uni.city || 'Istanbul',
      establishedYear: uni.establishedYear || 2000,
      campusType: uni.campusType || '',
      ranking: uni.ranking || 1,
      customOrder: uni.customOrder || 0,
      websiteUrl: uni.websiteUrl || '',
      logoUrl: uni.logoUrl || '',
      coverImageUrl: uni.coverImageUrl || '',
      videoUrl: uni.videoUrl || '',
      videoThumbnailUrl: uni.videoThumbnailUrl || '',
      videoTitle: uni.videoTitle || '',
      videoDescription: uni.videoDescription || '',
      videoPlacement: uni.videoPlacement || 'BOTH',
      galleryImages: uni.galleryImages || '',
      admissionStatus: uni.admissionStatus || 'UNCONFIRMED',
      admissionStartDate: uni.admissionStartDate ? uni.admissionStartDate.slice(0, 10) : '',
      admissionEndDate: uni.admissionEndDate ? uni.admissionEndDate.slice(0, 10) : '',
      admissionDeadline: uni.admissionDeadline || '',
      officialApplicationUrl: uni.officialApplicationUrl || '',
      statusNote: uni.statusNote || '',
      announcementText: uni.announcementText || '',
      graduateAdmissionOpen: uni.graduateAdmissionOpen !== undefined ? Boolean(uni.graduateAdmissionOpen) : true,
      tuitionVerified: Boolean(uni.tuitionVerified),
      tuitionNotes: uni.tuitionNotes || '',
      departmentCount: uni.departmentCount ?? '',
      facultyCount: uni.facultyCount ?? '',
      programCountGrad: uni.programCountGrad ?? '',
      departmentCountBasis: uni.departmentCountBasis || 'LISANS',
      bestDepartments: uni.bestDepartments || '[]',
      departmentSourceUrl: uni.departmentSourceUrl || '',
      departmentDataAsOf: uni.departmentDataAsOf ? String(uni.departmentDataAsOf).slice(0, 10) : '',
      showProgramsSection: uni.showProgramsSection !== false,
      showNotarySection: uni.showNotarySection !== false,
      showFaqSection: uni.showFaqSection !== false,
      showReviewsSection: uni.showReviewsSection !== false,
      featured: Boolean(uni.featured),
      published: Boolean(uni.published),
      translations: [getTranslation('ar'), getTranslation('tr'), getTranslation('en')],
    });
    setActiveTab('ar');
    setActiveFormSection('BASIC');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setValidationError('');
  };

  const handleTransChange = (lang, field, value) => {
    setForm((prev) => ({
      ...prev,
      translations: prev.translations.map((t) => {
        if (t.lang === lang) {
          return { ...t, [field]: value };
        }
        return t;
      }),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // 1. Slug Validation - Zorunlu
    if (!form.slug?.trim()) {
      setActiveFormSection('BASIC');
      setValidationError(
        tx(
          'يرجى إدخال المعرف الفريد (Slug) للجامعة (حقل إلزامي)',
          'Lütfen üniversite için benzersiz Slug giriniz (Zorunlu alan).',
          'Please enter a unique university slug (Required).'
        )
      );
      return;
    }

    // 2. City (Şehir) Validation - ZORUNLU
    if (!form.city?.trim()) {
      setActiveFormSection('BASIC');
      setValidationError(
        tx(
          'يرجى إدخال / تحديد المدينة التي تقع فيها الجامعة (المدينة حقل إلزامي لبطاقة الطالب)',
          'Lütfen üniversitenin bulunduğu şehri giriniz (Şehir bilgisi zorunlu alandır).',
          'Please enter the city where the university is located (City is a required field).'
        )
      );
      return;
    }

    // 3. Established Year (Kuruluş / Tesis Tarihi) Validation - ZORUNLU
    const estYear = parseInt(form.establishedYear, 10);
    if (!estYear || isNaN(estYear) || estYear < 1000 || estYear > 2100) {
      setActiveFormSection('BASIC');
      setValidationError(
        tx(
          'يرجى إدخال سنة التأسيس / تاريخ التأسيس بشكل صحيح (سنة التأسيس حقل إلزامي لبطاقة الطالب)',
          'Lütfen üniversitenin kuruluş / tesis yılını giriniz (Tesis tarihi zorunlu alandır).',
          'Please enter the established / foundation year (Established year is a required field).'
        )
      );
      return;
    }

    // 4. Photo (Kapak Görseli / Cover Image) Validation - ZORUNLU
    if (!form.coverImageUrl?.trim()) {
      setActiveFormSection('BASIC');
      setValidationError(
        tx(
          'يرجى تحميل صورة غلاف للجامعة أو إدخال رابطها المباشر (صورة الحرم الجامعي إلزامية لبطاقة الطالب)',
          'Lütfen üniversite için kapak fotoğrafı yükleyiniz veya görsel bağlantısını giriniz (Fotoğraf zorunlu alandır).',
          'Please upload or provide a cover photo for the university (Photo is a required field).'
        )
      );
      return;
    }

    // 5. Strict 3-Language Names Validation - ZORUNLU
    for (const lang of ['ar', 'tr', 'en']) {
      const trans = form.translations?.find((t) => t.lang === lang);
      if (!trans || !trans.name?.trim()) {
        const langLabel = lang === 'ar' ? 'العربية 🇸🇦' : lang === 'tr' ? 'Türkçe 🇹🇷' : 'English 🇬🇧';
        setValidationError(
          tx(
            `يرجى إدخال اسم الجامعة باللغة (${langLabel}). إدخال الاسم بجميع اللغات الثلاث إلزامي.`,
            `Lütfen (${langLabel}) dilinde üniversite adını giriniz. Tüm 3 dilde üniversite adı zorunludur.`,
            `Please enter the university name in (${langLabel}). University name is required in all 3 languages.`
          )
        );
        setActiveFormSection('LANG');
        setActiveTab(lang);
        return;
      }
    }

    // 6. Overview / Description (Tanımı) Validation - ZORUNLU
    const existingOverview = form.translations?.find((t) => t.overview?.trim())?.overview?.trim();
    if (!existingOverview) {
      setValidationError(
        tx(
          'يرجى إدخال نبذة أو تعريف عن الجامعة في قسم اللغات (التعريف والوصف حقل إلزامي لبطاقة الطالب)',
          'Lütfen üniversite hakkında tanıtım / genel bakış açıklamasını yazınız (Tanımı zorunlu alandır).',
          'Please enter the university overview / description (Overview is a required field).'
        )
      );
      setActiveFormSection('LANG');
      return;
    }

    // Ensure all 3 languages have an overview (if empty in one, reuse the existing one so it is never missing)
    const normalizedTranslations = form.translations.map((t) => ({
      ...t,
      overview: t.overview?.trim() || existingOverview,
    }));

    const finalForm = {
      ...form,
      establishedYear: estYear,
      translations: normalizedTranslations,
    };

    saveMutation.mutate(finalForm);
  };

  // Open Batch Import Modal & Load Registry
  const openImportModal = async () => {
    setIsImportModalOpen(true);
    setImportResults(null);
    setImportError(null);
    setImportProgress(0);
    try {
      const res = await api.getImportRegistry();
      setImportRegistry(res);
    } catch (err) {
      setImportError(err.message || 'Failed to fetch verified registry');
    }
  };

  // Run Batch Import with genuine verification
  const handleExecuteImport = async (dryRun = false) => {
    setIsImporting(true);
    setImportProgress(20);
    setImportError(null);

    try {
      setImportProgress(50);
      const res = await api.importUniversitiesBatch({
        limit: 60,
        dryRun,
      });

      setImportProgress(100);
      setImportResults(res.data);
      queryClient.invalidateQueries(['adminUniversities']);
      queryClient.invalidateQueries(['adminDashboardMetrics']);
    } catch (err) {
      setImportError(err.message || 'Import process encountered an error');
    } finally {
      setIsImporting(false);
    }
  };

  const filteredUnis = universities.filter((u) => {
    const arName = u.translations?.find((t) => t.lang === 'ar')?.name || '';
    const enName = u.translations?.find((t) => t.lang === 'en')?.name || '';
    const trName = u.translations?.find((t) => t.lang === 'tr')?.name || '';

    const matchesSearch =
      u.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      arName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'ALL' || u.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || (u.admissionStatus || 'UNCONFIRMED') === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const currentTrans = form.translations.find((t) => t.lang === activeTab) || {};

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-cairo">
            tx('إدارة الجامعات التركية وحالات التقديم', 'Türk Üniversiteleri ve Kabul Durumları Yönetimi', 'Turkish Universities & Admissions')
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar'
              ? ta('إدارة متكاملة لـ 60 جامعة حكومية وخاصة، الفيديوهات التعريفية، حالات القبول، والتوثيق')
              : 'Complete management of 60 public and foundation universities, videos, application statuses, and verification'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Import 60 Universities Button */}
          <button
            onClick={openImportModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-navy-950 text-brand-amber-400 hover:bg-brand-navy-900 rounded-xl text-xs font-bold shadow-md border border-brand-amber-500/30 transition hover:scale-[1.02]"
          >
            <Upload size={16} />
            <span>
              tx('استيراد وفحص 60 جامعة تركية', '60 Türk Üniversitesini İçe Aktar ve Doğrula', 'Import & Verify 60 Universities')
            </span>
          </button>

          {/* Add University Button */}
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition"
          >
            <Plus size={16} />
            <span>{tx('إضافة جامعة يدوياً', 'Manuel Üniversite Ekle', 'Add University')}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMessage && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-between shadow-lg shadow-emerald-600/20 animate-in fade-in slide-in-from-top-3 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-cairo">{actionSuccessMessage}</p>
              <p className="text-[11px] text-emerald-100 font-normal">
                {currentLanguage === 'ar' ? 'تم تحديث قاعدة البيانات بنجاح' : 'Veritabanı başarıyla güncellendi'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActionSuccessMessage('')}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Kapat"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              currentLanguage === 'ar'
                ? ta('بحث باسم الجامعة، المدينة، أو المعرف...')
                : 'Search universities, city, slug...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Classification Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500"
          >
            <option value="ALL">{tx('جميع التصنيفات', 'Tüm Türler', 'All Types')}</option>
            <option value="PUBLIC">{tx('🏛️ حكومية (Public)', '🏛️ Devlet', '🏛️ Public')}</option>
            <option value="PRIVATE">{tx('🏢 خاصة (Private)', '🏢 Vakıf', '🏢 Foundation')}</option>
          </select>

          {/* Admission Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-amber-500"
          >
            <option value="ALL">{tx('جميع حالات التقديم', 'Tüm Başvuru Durumları', 'All Statuses')}</option>
            <option value="OPEN">{tx('🟢 مفتوح (Open)', '🟢 Açık', '🟢 Open')}</option>
            <option value="UPCOMING">{tx('🟡 يفتح قريباً (Upcoming)', '🟡 Yakında', '🟡 Upcoming')}</option>
            <option value="CLOSED">{tx('🔴 مغلق (Closed)', '🔴 Kapalı', '🔴 Closed')}</option>
            <option value="UNCONFIRMED">{tx('⚪ غير مؤكد (Unconfirmed)', '⚪ Onaysız', '⚪ Unconfirmed')}</option>
          </select>

          {/* View Mode Toggle: Cards vs Table */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'cards'
                  ? 'bg-white text-brand-navy-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Kart Görünümü"
            >
              <LayoutGrid size={14} />
              <span>{tx('بطاقات', 'Kartlar', 'Cards')}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'table'
                  ? 'bg-white text-brand-navy-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Tablo Görünümü"
            >
              <List size={14} />
              <span>{tx('جدول', 'Tablo', 'Table')}</span>
            </button>
          </div>

          <div className="text-xs font-bold text-slate-500 ms-auto">
            `${tx('العدد:', 'Adet:', 'Count:')} ${filteredUnis.length}`
          </div>
        </div>
      </div>

      {/* =========================================================
          UNIVERSITIES DISPLAY (CARDS GRID OR TABLE VIEW)
          ========================================================= */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
          <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>{tx('جاري تحميل قائمة الجامعات...', 'Üniversiteler yükleniyor...', 'Loading universities...')}</span>
        </div>
      ) : filteredUnis.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm shadow-sm">
          {currentLanguage === 'ar'
            ? ta('لا توجد جامعات مطابقة للبحث أو الفلتر المختار')
            : 'Arama kriterlerine uygun üniversite bulunamadı.'}
        </div>
      ) : viewMode === 'cards' ? (
        /* CARD GRID VIEW (Özel Üniversite Kartları ile Dosya Yönetimi) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredUnis.map((uni) => {
            const arName = uni.translations?.find((t) => t.lang === 'ar')?.name || uni.slug;
            const enName = uni.translations?.find((t) => t.lang === 'en')?.name;
            const trName = uni.translations?.find((t) => t.lang === 'tr')?.name;
            const currentStatus = uni.admissionStatus || 'UNCONFIRMED';
            const galleryCount = parseGalleryImages(uni.galleryImages).length;
            const totalFilesCount = (uni.coverImageUrl ? 1 : 0) + (uni.logoUrl ? 1 : 0) + galleryCount;

            return (
              <div
                key={uni.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1"
              >
                {/* Card Cover Header with Hover & Direct Upload */}
                <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                  {uni.coverImageUrl ? (
                    <img
                      src={uni.coverImageUrl}
                      alt={arName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-navy-950 via-slate-900 to-amber-950 flex flex-col items-center justify-center p-4 text-center">
                      <ImageIcon size={30} className="text-white/30 mb-1" />
                      <span className="text-[11px] font-semibold text-white/70">Kapak Fotoğrafı Yok</span>
                      <button
                        onClick={() => openMediaModal(uni)}
                        className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-lg text-[10px] font-bold backdrop-blur-sm transition"
                      >
                        + Fotoğraf Ekle
                      </button>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/30 pointer-events-none" />

                  {/* Top Badges: Type & Admission Status */}
                  <div className="absolute top-2.5 start-2.5 end-2.5 flex items-center justify-between gap-1.5 z-10">
                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-md ${
                        uni.type === 'PRIVATE'
                          ? 'bg-brand-amber-500 text-white'
                          : 'bg-brand-navy-900 text-brand-amber-300 border border-brand-amber-400/30'
                      }`}
                    >
                      {uni.type === 'PRIVATE' ? ta('🏢 خاصة') : ta('🏛️ حكومية')}
                    </span>

                    <ApplicationStatusBadge
                      status={currentStatus}
                      deadline={uni.admissionDeadline}
                      statusNote={uni.statusNote}
                      size="sm"
                    />
                  </div>

                  {/* University Logo Floating on bottom start */}
                  <div className="absolute -bottom-3.5 start-3 z-20">
                    {uni.logoUrl ? (
                      <img
                        src={uni.logoUrl}
                        alt={arName}
                        className="w-13 h-13 object-contain rounded-2xl bg-white p-1 border-2 border-white shadow-lg shrink-0"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-2xl bg-brand-navy-900 text-white flex items-center justify-center font-bold text-base border-2 border-white shadow-lg shrink-0">
                        {uni.slug[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* City Badge on bottom end */}
                  <div className="absolute bottom-2 end-2 z-10 flex items-center gap-1 text-white text-[11px] font-semibold bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10">
                    <MapPin size={11} className="text-brand-amber-400" />
                    <span>{uni.city}</span>
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="pt-6 px-4 pb-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-cairo leading-snug line-clamp-1" title={arName}>
                      {arName}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5" title={enName || trName}>
                      {enName || trName || uni.slug}
                    </p>
                    <div className="text-[10px] text-brand-amber-600 font-mono mt-1 flex items-center justify-between">
                      <span className="truncate">/{uni.slug}</span>
                      {uni.ranking && (
                        <span className="shrink-0 bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.2 rounded font-bold">
                          #{uni.ranking}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Attached Files & Media Stats */}
                  <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <FolderPlus size={14} className="text-brand-amber-600 shrink-0" />
                      <span>Dosyalar:</span>
                      <strong className="text-brand-navy-950 font-bold">{totalFilesCount} adet</strong>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {uni.coverImageUrl && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Kapak Fotoğrafı Mevcut" />
                      )}
                      {uni.logoUrl && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" title="Logo Mevcut" />
                      )}
                      {galleryCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" title={`${galleryCount} Galeri/Belge`} />
                      )}
                    </div>
                  </div>

                  {/* Card Actions: Primary Dosya Yönetimi + Quick Actions */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    {/* Primary Button: Dosya & Görselleri Yönet (Ekle/Sil/Update) */}
                    <button
                      type="button"
                      onClick={() => openMediaModal(uni)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
                    >
                      <UploadCloud size={14} />
                      <span>Dosya & Görseller (Ekle / Sil)</span>
                    </button>

                    {/* Secondary Row: Düzenle, İncele, Sil */}
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => openEditModal(uni)}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                        title="Tüm Bilgileri Düzenle"
                      >
                        <Edit size={12} />
                        <span>Düzenle</span>
                      </button>

                      <a
                        href={`/universities/${uni.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                        title="Sitede Görüntüle"
                      >
                        <ExternalLink size={12} />
                        <span>İncele</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(tx(`هل أنت متأكد من حذف ${arName} نهائياً؟`, `${arName} üniversitesini kalıcı olarak silmek istediğinize emin misiniz?`, `Are you sure you want to permanently delete ${arName}?`))) {
                            deleteMutation.mutate(uni.id);
                          }
                        }}
                        className="flex items-center justify-center gap-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg font-semibold transition"
                        title="Üniversiteyi Sil"
                      >
                        <Trash2 size={12} />
                        <span>Sil</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4 text-start">{ta("الجامعة والشعار")}</th>
                  <th className="px-4 py-4 text-start">{ta("المدينة والنوع")}</th>
                  <th className="px-4 py-4 text-start">{ta("حالة التقديم والموعد")}</th>
                  <th className="px-4 py-4 text-start">{ta("الملفات والصور")}</th>
                  <th className="px-4 py-4 text-start">{ta("الحالة والمميزة")}</th>
                  <th className="px-5 py-4 text-end">{ta("إجراءات")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUnis.map((uni) => {
                  const arName = uni.translations?.find((t) => t.lang === 'ar')?.name || uni.slug;
                  const enName = uni.translations?.find((t) => t.lang === 'en')?.name;
                  const currentStatus = uni.admissionStatus || 'UNCONFIRMED';
                  const galleryCount = parseGalleryImages(uni.galleryImages).length;
                  const totalFilesCount = (uni.coverImageUrl ? 1 : 0) + (uni.logoUrl ? 1 : 0) + galleryCount;

                  return (
                    <tr key={uni.id} className="hover:bg-slate-50/80 transition">
                      {/* Name & Logo */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {uni.logoUrl ? (
                            <img
                              src={uni.logoUrl}
                              alt={arName}
                              className="w-11 h-11 object-contain rounded-xl p-1 bg-white border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-brand-navy-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                              {uni.slug[0].toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-900 text-sm font-cairo">{arName}</div>
                            {enName && <div className="text-[11px] text-slate-400">{enName}</div>}
                            <div className="text-[10px] text-brand-amber-600 font-mono mt-0.5">/{uni.slug}</div>
                          </div>
                        </div>
                      </td>

                      {/* City & Type */}
                      <td className="px-4 py-4 space-y-1">
                        <div className="flex items-center gap-1 font-semibold text-slate-800">
                          <MapPin size={13} className="text-brand-amber-500" />
                          <span>{uni.city}</span>
                        </div>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            uni.type === 'PRIVATE'
                              ? 'bg-brand-amber-100 text-brand-amber-800'
                              : 'bg-brand-navy-100 text-brand-navy-900'
                          }`}
                        >
                          {uni.type === 'PRIVATE' ? ta('جامعة خاصة') : ta('جامعة حكومية')}
                        </span>
                      </td>

                      {/* Instant Admission Status Management */}
                      <td className="px-4 py-4 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <select
                            value={currentStatus}
                            onChange={(e) =>
                              statusMutation.mutate({
                                id: uni.id,
                                status: e.target.value,
                                deadline: uni.admissionDeadline,
                                statusNote: uni.statusNote,
                              })
                            }
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                              currentStatus === 'OPEN'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : currentStatus === 'CLOSED'
                                ? 'bg-rose-50 text-rose-800 border-rose-300'
                                : currentStatus === 'UPCOMING'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="OPEN">{ta("🟢 مفتوح (Open)")}</option>
                            <option value="CLOSED">{ta("🔴 مغلق (Closed)")}</option>
                            <option value="UPCOMING">{ta("🟡 يفتح قريباً (Upcoming)")}</option>
                            <option value="UNCONFIRMED">{ta("⚪ غير مؤكد (Unconfirmed)")}</option>
                          </select>
                        </div>

                        {uni.admissionDeadline && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock size={11} className="text-slate-400" />
                            <span>{ta("الموعد:")} <strong>{uni.admissionDeadline}</strong></span>
                          </div>
                        )}
                      </td>

                      {/* Files & Media Status */}
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => openMediaModal(uni)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-brand-amber-800 font-bold border border-amber-200 transition"
                          title="Dosya ve Görselleri Yönet"
                        >
                          <FolderPlus size={13} className="text-brand-amber-600" />
                          <span>{totalFilesCount} Dosya</span>
                        </button>
                      </td>

                      {/* Featured & Published */}
                      <td className="px-4 py-4 space-y-1">
                        <div>
                          {uni.published ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              {ta("منشورة")}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                              {ta("مسودة")}
                            </span>
                          )}
                        </div>
                        {uni.featured && (
                          <div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 flex items-center gap-1 w-fit">
                              <Star size={10} className="fill-amber-500" />
                              <span>{ta("مميزة")}</span>
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openMediaModal(uni)}
                            className="p-1.5 text-brand-amber-600 hover:text-brand-amber-700 hover:bg-amber-50 rounded-lg transition"
                            title="Dosya & Görselleri Yönet (Ekle/Sil/Güncelle)"
                          >
                            <UploadCloud size={16} />
                          </button>
                          <a
                            href={`/universities/${uni.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                            title="Sitede Görüntüle"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <button
                            type="button"
                            onClick={() => openEditModal(uni)}
                            className="p-1.5 text-brand-navy-900 hover:text-brand-amber-600 hover:bg-amber-50 rounded-lg transition"
                            title="Tüm Bilgileri Düzenle"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`هل أنت متأكد من حذف ${arName} نهائياً؟`)) {
                                deleteMutation.mutate(uni.id);
                              }
                            }}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Üniversiteyi Sil"
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
        </div>
      )}

      {/* =========================================================
          QUICK UNIVERSITY MEDIA & FILES MANAGER MODAL
          (Dosya Ekleme, Silme, Güncelleme)
          ========================================================= */}
      {activeMediaUni && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <FolderPlus size={14} />
                  <span>Üniversite Dosya & Görsel Yönetimi</span>
                </span>
                <h2 className="text-xl font-bold font-cairo mt-1">
                  {activeMediaUni.translations?.find((t) => t.lang === 'ar')?.name || activeMediaUni.slug}{' '}
                  <span className="text-xs text-slate-400 font-mono font-normal">
                    ({activeMediaUni.city} - /{activeMediaUni.slug})
                  </span>
                </h2>
              </div>
              <button
                type="button"
                onClick={closeMediaModal}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Feedback Alerts */}
              {mediaUploadSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{mediaUploadSuccess}</span>
                </div>
              )}
              {mediaUploadError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 font-bold flex items-center gap-2">
                  <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                  <span>{mediaUploadError}</span>
                </div>
              )}
              {isUploadingMedia && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 font-bold flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Dosya yükleniyor veya kaydediliyor, lütfen bekleyin...</span>
                </div>
              )}

              {/* 1. Kapak Görseli (Cover Photo) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <ImageIcon size={16} className="text-brand-amber-600" />
                      <span>1. Kapak Fotoğrafı (Cover Image)</span>
                    </h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Üniversite kartlarında ve detay sayfasında en üstte sergilenecek ana kampüs fotoğrafı.
                    </p>
                  </div>
                  {mediaModalData.coverImageUrl && (
                    <button
                      type="button"
                      onClick={() => setMediaModalData((prev) => ({ ...prev, coverImageUrl: '' }))}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition"
                      title="Kapak fotoğrafını sil"
                    >
                      <Trash2 size={13} />
                      <span>Fotoğrafı Sil</span>
                    </button>
                  )}
                </div>

                {/* Preview or Dropzone */}
                {mediaModalData.coverImageUrl ? (
                  <div className="relative h-44 rounded-xl overflow-hidden border border-slate-300 shadow-sm group">
                    <img
                      src={mediaModalData.coverImageUrl}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <label className="cursor-pointer px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-md hover:bg-slate-100 transition flex items-center gap-1.5">
                        <Upload size={14} />
                        <span>Farklı Fotoğraf Seç</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadMediaFile(e, 'cover')}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setMediaModalData((prev) => ({ ...prev, coverImageUrl: '' }))}
                        className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-md hover:bg-rose-700 transition flex items-center gap-1.5"
                      >
                        <Trash2 size={14} />
                        <span>Sil</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-300 hover:border-brand-amber-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white transition hover:bg-amber-50/30">
                    <UploadCloud size={32} className="text-slate-400" />
                    <span className="font-bold text-slate-700">Bilgisayardan Kapak Fotoğrafı Seç / Yükle</span>
                    <span className="text-[11px] text-slate-400">PNG, JPG, WebP (Maks. 50MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUploadMediaFile(e, 'cover')}
                    />
                  </label>
                )}

                {/* URL Input */}
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    veya Doğrudan Görsel URL'si Girin / Düzenleyin:
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={mediaModalData.coverImageUrl}
                    onChange={(e) =>
                      setMediaModalData((prev) => ({ ...prev, coverImageUrl: e.target.value }))
                    }
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 ltr text-start focus:ring-2 focus:ring-brand-amber-500/40"
                  />
                </div>
              </div>

              {/* 2. Üniversite Logosu (Logo) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <GraduationCap size={16} className="text-brand-amber-600" />
                      <span>2. Üniversite Logosu (Logo)</span>
                    </h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Kartlarda ve başlıklarda sergilenecek şeffaf veya beyaz zeminli kurumsal logo.
                    </p>
                  </div>
                  {mediaModalData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setMediaModalData((prev) => ({ ...prev, logoUrl: '' }))}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition"
                      title="Logoyu sil"
                    >
                      <Trash2 size={13} />
                      <span>Logoyu Sil</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Logo Preview */}
                  <div className="w-24 h-24 rounded-2xl bg-white border-2 border-slate-200 shadow-sm flex items-center justify-center p-2 shrink-0 overflow-hidden">
                    {mediaModalData.logoUrl ? (
                      <img
                        src={mediaModalData.logoUrl}
                        alt="Logo Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-slate-400 font-bold text-xs text-center">Logo Yok</span>
                    )}
                  </div>

                  {/* Upload Controls & URL */}
                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer px-4 py-2 bg-brand-navy-950 hover:bg-brand-navy-900 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5">
                        <Upload size={14} />
                        <span>Bilgisayardan Logo Yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleUploadMediaFile(e, 'logo')}
                        />
                      </label>
                      {mediaModalData.logoUrl && (
                        <button
                          type="button"
                          onClick={() => setMediaModalData((prev) => ({ ...prev, logoUrl: '' }))}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition flex items-center gap-1"
                        >
                          <Trash2 size={13} />
                          <span>Kaldır</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      value={mediaModalData.logoUrl}
                      onChange={(e) =>
                        setMediaModalData((prev) => ({ ...prev, logoUrl: e.target.value }))
                      }
                      className="w-full p-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 ltr text-start focus:ring-2 focus:ring-brand-amber-500/40"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Galeri Fotoğrafları ve Ek Dosyalar / Belgeler */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                      <Layers size={16} className="text-brand-amber-600" />
                      <span>3. Galeri Fotoğrafları, Tanıtım Belgeleri ve Dosyalar</span>
                    </h3>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      Üniversiteye ait ek fotoğraflar, fakülte resimleri, PDF broşürleri veya belgeler ({mediaModalData.galleryFiles.length} dosya mevcut).
                    </p>
                  </div>

                  <label className="cursor-pointer px-4 py-2 bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow transition flex items-center gap-1.5 w-fit">
                    <Plus size={15} />
                    <span>Bilgisayardan Dosya / Fotoğraf Ekle</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => handleUploadMediaFile(e, 'gallery')}
                    />
                  </label>
                </div>

                {/* Manual URL Add */}
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    placeholder="veya URL ile dosya/görsel ekle (https://...)"
                    value={newGalleryUrlInput}
                    onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                    className="flex-1 p-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800 ltr text-start focus:ring-2 focus:ring-brand-amber-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newGalleryUrlInput.trim()) {
                        setMediaModalData((prev) => ({
                          ...prev,
                          galleryFiles: [...prev.galleryFiles, newGalleryUrlInput.trim()],
                        }));
                        setNewGalleryUrlInput('');
                      }
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm transition"
                  >
                    Ekle
                  </button>
                </div>

                {/* Gallery Items Grid */}
                {mediaModalData.galleryFiles.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {mediaModalData.galleryFiles.map((fileUrl, index) => {
                      const isImage =
                        fileUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) ||
                        fileUrl.includes('images.unsplash.com') ||
                        fileUrl.includes('/uploads/media-');

                      return (
                        <div
                          key={index}
                          className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group flex flex-col"
                        >
                          {/* Thumbnail */}
                          <div className="h-28 bg-slate-100 overflow-hidden flex items-center justify-center relative">
                            {isImage ? (
                              <img
                                src={fileUrl}
                                alt={`Gallery item ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                                <FileText size={28} className="text-brand-amber-600 mb-1" />
                                <span className="text-[10px] font-bold line-clamp-1">Belge / PDF</span>
                              </div>
                            )}

                            {/* Delete Overlay Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setMediaModalData((prev) => ({
                                  ...prev,
                                  galleryFiles: prev.galleryFiles.filter((_, i) => i !== index),
                                }));
                              }}
                              className="absolute top-1.5 end-1.5 p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg shadow transition"
                              title="Dosyayı sil"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* File URL preview and view link */}
                          <div className="p-2 flex items-center justify-between gap-1 text-[10px] bg-slate-50 border-t border-slate-100">
                            <span className="font-mono text-slate-500 truncate flex-1 ltr" title={fileUrl}>
                              {fileUrl.split('/').pop()}
                            </span>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-brand-amber-600 hover:text-brand-amber-700 p-1"
                              title="Görüntüle"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-xl bg-white border border-dashed border-slate-200 text-slate-400">
                    Henüz ek galeri görseli veya dosya yüklenmedi. Yukarıdaki butona tıklayarak bilgisayarınızdan dosya ekleyebilirsiniz.
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={closeMediaModal}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
              >
                İptal / Vazgeç
              </button>

              <button
                type="button"
                disabled={isUploadingMedia}
                onClick={handleSaveMedia}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-2 active:scale-95"
              >
                {isUploadingMedia ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Değişiklikleri Kaydet (Update)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          BATCH IMPORT 60 UNIVERSITIES MODAL WITH REAL VERIFICATION
          ========================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {ta("سجل الاستيراد والتحقق الرسمي")}
                </span>
                <h2 className="text-xl font-bold font-cairo mt-0.5">
                  {ta("استيراد وتحديث 60 جامعة تركية حكومية وخاصة")}
                </h2>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-amber-600" />
                  <span>{ta("معايير الأمان والتحقق الحقيقي من قاعدة البيانات:")}</span>
                </div>
                <p className="leading-relaxed">
                  {tx('يقوم النظام بالتحقق من كل سجل وإدخاله مع ترجماته (عربي، تركي، إنجليزي)، روابط المواقع الرسمية، الشعارات،', 'Sistem her kaydı doğrular ve çevirileriyle (Arapça, Türkçe, İngilizce), resmi web siteleri ve logolarıyla kaydeder,', 'The system verifies each record and registers it with translations (Arabic, Turkish, English), official URLs and logos,')}
                  {tx('ولا يتم إظهار رسالة "تم الإنشاء بنجاح" إلا بعد التأكد الفعلي من وجود السجلات في قاعدة البيانات (Direct DB Verification).', 've doğrudan veritabanında doğrulandıktan sonra başarı mesajı verilir.', 'and confirmation is only displayed after direct DB verification.')}
                </p>
              </div>

              {/* Registry Overview */}
              {importRegistry && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[11px] block">{ta("السجلات في السجل")}</span>
                    <strong className="text-lg font-bold text-slate-800 font-cairo">
                      {importRegistry.total} {tx('جامعة', 'üniversite', 'universities')}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[11px] block">{ta("الجامعات الحالية في DB")}</span>
                    <strong className="text-lg font-bold text-brand-amber-600 font-cairo">
                      {importRegistry.currentInDb} {tx('جامعة', 'üniversite', 'universities')}
                    </strong>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl col-span-2 sm:col-span-1">
                    <span className="text-slate-400 text-[11px] block">{ta("مصدر السجلات")}</span>
                    <strong className="text-xs font-bold text-emerald-700 block mt-1">
                      {importRegistry.source}
                    </strong>
                  </div>
                </div>
              )}

              {/* Progress Bar during execution */}
              {isImporting && (
                <div className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex justify-between font-bold text-slate-700">
                    <span>{ta("جاري معالجة وحفظ والتحقق من السجلات في قاعدة البيانات...")}</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-brand-amber-500 h-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Import Results Box */}
              {importResults && (
                <div
                  className={`p-5 rounded-2xl border space-y-3 ${
                    importResults.success
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {importResults.success ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                    <span>{importResults.message}</span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-bold pt-2">
                    <div className="p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-400 block">{ta("تمت المعالجة")}</span>
                      <span>{importResults.processed}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-emerald-200 text-emerald-700">
                      <span className="text-slate-400 block">{ta("جديد")}</span>
                      <span>{importResults.createdCount}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-blue-200 text-blue-700">
                      <span className="text-slate-400 block">{ta("محدّث")}</span>
                      <span>{importResults.updatedCount}</span>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-rose-200 text-rose-700">
                      <span className="text-slate-400 block">{ta("فشل")}</span>
                      <span>{importResults.failedCount}</span>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between border-t border-slate-200/60 pt-2">
                    <span>{ta("العدد الإجمالي المؤكد في قاعدة البيانات الآن:")}</span>
                    <strong className="text-brand-navy-950">{importResults.verifiedDatabaseCount} {tx('جامعة', 'üniversite', 'universities')}</strong>
                  </div>

                  {/* Errors listing if any failed */}
                  {importResults.errors?.length > 0 && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-rose-200 space-y-1">
                      <span className="font-bold text-rose-700 block">{ta("الأخطاء المسجلة أثناء الاستيراد:")}</span>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-600">
                        {importResults.errors.map((err, idx) => (
                          <li key={idx}>
                            {err.slug}: {err.reasons?.join(', ')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {importError && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-start gap-2">
                  <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">{ta("فشل أثناء الاتصال:")}</strong>
                    <span>{importError}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
              >
                {ta("إغلاق")}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={() => handleExecuteImport(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition disabled:opacity-50"
                >
                  {tx('فحص تجريبي (Dry Run)', 'Deneme Çalıştırması (Dry Run)', 'Dry Run')}
                </button>

                <button
                  type="button"
                  disabled={isImporting}
                  onClick={() => handleExecuteImport(false)}
                  className="px-5 py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isImporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{ta("جاري الحفظ والتحقق...")}</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>{ta("بدء الاستيراد والحفظ الفعلي")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          CREATE / EDIT FULL UNIVERSITY MODAL
          ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  {editingId ? ta('تعديل بيانات الجامعة') : ta('إضافة جامعة تركية جديدة')}
                </span>
                <h2 className="text-xl font-bold font-cairo mt-0.5">
                  {currentTrans.name || form.slug || ta('ملف الجامعة')}
                </h2>
              </div>
              <button onClick={closeModal} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
                <X size={20} />
              </button>
            </div>

            {/* Navigation Form Sections */}
            <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-bold">
              {[
                { id: 'BASIC', label: tx('1. البيانات الأساسية والمدينة والصورة * (إلزامي)', '1. Temel Bilgiler, Şehir & Fotoğraf * (Zorunlu)', '1. Basic Info, City & Photo *') },
                { id: 'VIDEO', label: tx('2. فيديو تعريفي (اختياري)', '2. Tanıtım Videosu (İsteğe Bağlı)', '2. Video (Optional)') },
                { id: 'ADMISSION', label: tx('3. حالة ومواعيد التقديم', '3. Başvuru Durumu ve Tarihler', '3. Admission Status') },
                { id: 'SECTIONS', label: tx('4. أقسام الصفحة والرسوم (الرسوم اختيارية)', '4. Sayfa Bölümleri & Ücretler (Ücret İsteğe Bağlı)', '4. Page Sections & Fees (Optional)') },
                { id: 'DEPARTMENTS', label: tx('5. عدد الأقسام وأفضل التخصصات', '5. Bölüm Sayıları ve En İyiler', '5. Departments & Rankings') },
                { id: 'LANG', label: tx('6. محتوى اللغات والنبذة * (إلزامي)', '6. Dil İçerikleri ve Tanım * (Zorunlu)', '6. Multilingual Content & Overview *') },
              ].map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setActiveFormSection(sec.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                    activeFormSection === sec.id
                      ? 'bg-brand-navy-950 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Universal Validation Error Banner inside Modal */}
              {validationError && (
                <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 font-bold flex items-start gap-3 shadow-sm animate-in fade-in duration-200">
                  <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={15} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs leading-relaxed">{validationError}</p>
                    <p className="text-[10px] text-rose-600 font-normal mt-0.5">
                      {currentLanguage === 'ar'
                        ? 'يرجى استكمال الحقول الإلزامية المطلوبة (المدينة، تاريخ التأسيس، صورة الغلاف، النبذة التعريفية، واسم الجامعة) لتتمكن من الحفظ بنجاح.'
                        : 'Lütfen kaydı tamamlamak için zorunlu alanları (Şehir, Kuruluş Tarihi, Kapak Fotoğrafı, Tanıtım Açıklaması ve Üniversite Adı) eksiksiz doldurunuz.'}
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION: BASIC */}
              {activeFormSection === 'BASIC' && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {ta("البيانات التعريفية والموقع الجغرافي")}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{ta("المعرف الفريد (Slug)*")}</span>
                        <span className="text-[10px] text-rose-500 font-bold">{tx('(إلزامي)', '(Zorunlu)', '(Required)')}</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="istanbul-university"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{tx('المدينة', 'Şehir', 'City')} *</span>
                        <span className="text-[10px] text-rose-500 font-bold">{tx('(إلزامي لبطاقة الطالب)', '(Zorunlu Alan)', '(Required)')}</span>
                      </label>
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
                      <label className="block font-bold text-slate-700 mb-1">{ta("نوع الجامعة")}</label>
                      <select
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-brand-amber-500/50"
                      >
                        <option value="PUBLIC">{ta("🏛️ جامعة حكومية (Public)")}</option>
                        <option value="PRIVATE">{ta("🏢 جامعة خاصة (Private)")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{tx('سنة التأسيس / تاريخ التأسيس', 'Kuruluş / Tesis Tarihi', 'Established Year')} *</span>
                        <span className="text-[10px] text-rose-500 font-bold">{tx('(إلزامي لبطاقة الطالب)', '(Zorunlu Alan)', '(Required)')}</span>
                      </label>
                      <input
                        type="number"
                        placeholder="1453"
                        value={form.establishedYear}
                        onChange={(e) => setForm({ ...form, establishedYear: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{ta("الترتيب المحلي/العام")}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{tx('(اختياري)', '(İsteğe Bağlı)', '(Optional)')}</span>
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        value={form.ranking}
                        onChange={(e) => setForm({ ...form, ranking: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{ta("ترتيب العرض المخصص (Order)")}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{tx('(اختياري)', '(İsteğe Bağlı)', '(Optional)')}</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={form.customOrder}
                        onChange={(e) => setForm({ ...form, customOrder: parseInt(e.target.value) || 0 })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Official Logo */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-1.5">
                          <GraduationCap size={15} className="text-brand-amber-600" />
                          <span>{ta("الشعار الرسمي (Logo)")}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{tx('(اختياري)', '(İsteğe Bağlı)', '(Optional)')}</span>
                        </label>
                        {form.logoUrl && (
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, logoUrl: '' }))}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-0.5"
                          >
                            <Trash2 size={11} />
                            <span>{ta("حذف الشعار")}</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          {form.logoUrl ? (
                            <img src={form.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">{ta("بدون")}</span>
                          )}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-navy-950 hover:bg-brand-navy-900 text-white rounded-lg text-xs font-bold transition">
                            <Upload size={12} />
                            <span>{ta("رفع شعار من الجهاز")}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFormFileUpload(e, 'logo')}
                            />
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/logo.png"
                            value={form.logoUrl}
                            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[11px] ltr text-start"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Cover Image */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-1.5">
                          <ImageIcon size={15} className="text-brand-amber-600" />
                          <span>{tx('صورة الغلاف / كرت الطالب', 'Kapak Fotoğrafı / Öğrenci Kartı Görseli', 'Cover Photo')} *</span>
                          <span className="text-[10px] text-rose-500 font-bold ms-auto">{tx('(إلزامي)', '(Zorunlu Alan)', '(Required)')}</span>
                        </label>
                        {form.coverImageUrl && (
                          <button
                            type="button"
                            onClick={() => setForm((prev) => ({ ...prev, coverImageUrl: '' }))}
                            className="text-[10px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-0.5"
                          >
                            <Trash2 size={11} />
                            <span>{ta("حذف الصورة")}</span>
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-20 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                          {form.coverImageUrl ? (
                            <img src={form.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">{ta("بدون غلاف")}</span>
                          )}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-lg text-xs font-bold shadow-sm transition">
                            <Upload size={12} />
                            <span>{ta("رفع صورة من الجهاز")}</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFormFileUpload(e, 'cover')}
                            />
                          </label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={form.coverImageUrl}
                            onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                            className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[11px] ltr text-start"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Official Website */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">{ta("رابط الموقع الرسمي للجامعة")}</label>
                      <input
                        type="url"
                        placeholder="https://istanbul.edu.tr"
                        value={form.websiteUrl}
                        onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                      />
                    </div>

                    {/* Gallery Images & Documents */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700">
                          {ta("معرض الصور والملفات الإضافية")}
                        </label>
                        <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[11px] font-bold transition">
                          <Plus size={12} />
                          <span>{ta("رفع ملف / صورة")}</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => handleFormFileUpload(e, 'gallery')}
                          />
                        </label>
                      </div>

                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/1, https://images.unsplash.com/2"
                        value={form.galleryImages}
                        onChange={(e) => setForm({ ...form, galleryImages: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                      />

                      {/* Small gallery preview thumbnails */}
                      {parseGalleryImages(form.galleryImages).length > 0 && (
                        <div className="flex items-center gap-2 overflow-x-auto py-1">
                          {parseGalleryImages(form.galleryImages).map((imgUrl, idx) => (
                            <div key={idx} className="relative w-12 h-12 rounded-lg border border-slate-200 overflow-hidden shrink-0 group">
                              <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = parseGalleryImages(form.galleryImages).filter((_, i) => i !== idx);
                                  setForm((prev) => ({ ...prev, galleryImages: updated.join(', ') }));
                                }}
                                className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                title={ta("حذف")}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: VIDEO */}
              {activeFormSection === 'VIDEO' && (
                <div className="space-y-6">
                  {/* Informative Header Banner */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-brand-amber-500/30 text-slate-800 space-y-1">
                    <h4 className="font-bold text-sm flex items-center gap-2 text-brand-navy-950">
                      <Video size={18} className="text-brand-amber-600" />
                      <span>{ta("Üniversite Tanıtım Videosu Yönetimi / إدارة الفيديو التعريفي")}</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Her üniversiteye özel video ekleyebilirsiniz. Videoyu ister <strong>bilgisayarınızdan doğrudan yükleyebilir</strong> (MP4, WebM, MOV), isterseniz <strong>YouTube / Vimeo bağlantısı</strong> olarak girebilirsiniz. Eklenen video sadece ziyaretçiler üniversite kartındaki 'Detayları İncele'ye tıkladığında veya detay sayfasına gittiğinde gösterilir.
                    </p>
                  </div>

                  {/* Mode Selection Tabs (Upload vs Link) */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setVideoSourceMode('UPLOAD')}
                      className={`p-3.5 rounded-2xl border text-start transition-all flex items-center gap-3 ${
                        videoSourceMode === 'UPLOAD'
                          ? 'border-brand-amber-500 bg-brand-amber-500/10 text-brand-navy-950 font-bold shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        videoSourceMode === 'UPLOAD' ? 'bg-brand-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        <UploadCloud size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs">💻 Bilgisayarımdan Video Yükle</div>
                        <div className="text-[11px] text-slate-500 font-normal">MP4, WebM, MOV dosyası yükle</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVideoSourceMode('LINK')}
                      className={`p-3.5 rounded-2xl border text-start transition-all flex items-center gap-3 ${
                        videoSourceMode === 'LINK'
                          ? 'border-brand-amber-500 bg-brand-amber-500/10 text-brand-navy-950 font-bold shadow-sm'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        videoSourceMode === 'LINK' ? 'bg-brand-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        <LinkIcon size={18} />
                      </div>
                      <div>
                        <div className="font-bold text-xs">🔗 Video Bağlantısı Gir</div>
                        <div className="text-[11px] text-slate-500 font-normal">YouTube, Vimeo veya MP4 Linki</div>
                      </div>
                    </button>
                  </div>

                  {/* Mode 1: Upload from Computer */}
                  {videoSourceMode === 'UPLOAD' && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div>
                        <label className="block font-bold text-slate-800 text-xs mb-2">
                          Bilgisayarınızdan Video Dosyası Seçin (Maks. 150 MB)
                        </label>
                        <div
                          onClick={() => videoFileInputRef.current?.click()}
                          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                            isUploadingVideo
                              ? 'border-brand-amber-400 bg-brand-amber-50/50'
                              : 'border-slate-300 hover:border-brand-amber-500 bg-white hover:bg-slate-50/70'
                          }`}
                        >
                          <input
                            ref={videoFileInputRef}
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.mov"
                            onChange={handleVideoFileUpload}
                            disabled={isUploadingVideo}
                            className="hidden"
                          />
                          <div className="w-12 h-12 rounded-full bg-brand-amber-50 text-brand-amber-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
                            {isUploadingVideo ? (
                              <RotateCcw className="w-6 h-6 animate-spin text-brand-amber-600" />
                            ) : (
                              <UploadCloud className="w-6 h-6" />
                            )}
                          </div>
                          <p className="font-bold text-slate-800 text-xs mb-1">
                            {isUploadingVideo
                              ? 'Video dosyası sunucuya yükleniyor, lütfen bekleyin...'
                              : 'Video dosyası seçmek için tıklayın veya buraya sürükleyin'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Desteklenen formatlar: MP4, WebM, MOV, OGG (Maksimum 150 MB)
                          </p>
                        </div>
                      </div>

                      {/* Upload Message Alert */}
                      {videoUploadMsg && (
                        <div
                          className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                            videoUploadMsg.type === 'success'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : videoUploadMsg.type === 'error'
                              ? 'bg-red-50 text-red-800 border border-red-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {videoUploadMsg.type === 'success' && <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />}
                          {videoUploadMsg.type === 'error' && <AlertTriangle size={16} className="text-red-600 shrink-0" />}
                          {videoUploadMsg.type === 'info' && <RotateCcw size={16} className="animate-spin text-blue-600 shrink-0" />}
                          <span>{videoUploadMsg.text}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mode 2: Link Input */}
                  {videoSourceMode === 'LINK' && (
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div>
                        <label className="block font-bold text-slate-800 text-xs mb-1.5">
                          Video Bağlantısı (YouTube / Vimeo / Doğrudan Video URL'si)
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=... veya https://youtu.be/..."
                            value={form.videoUrl}
                            onChange={(e) => {
                              setForm({ ...form, videoUrl: e.target.value });
                              setVideoUploadMsg(null);
                            }}
                            className="w-full p-3 ps-9 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start text-xs font-mono"
                          />
                          <LinkIcon size={16} className="absolute start-3 top-3.5 text-slate-400" />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Örnekler: <code className="bg-slate-200 px-1 rounded">https://youtube.com/watch?v=xyz</code> veya <code className="bg-slate-200 px-1 rounded">https://youtu.be/xyz</code> veya doğrudan <code className="bg-slate-200 px-1 rounded">.mp4</code> bağlantısı.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Active Video Status & Live Preview */}
                  {form.videoUrl ? (
                    <div className="p-5 rounded-2xl bg-white border border-emerald-500/40 shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="font-bold text-xs text-emerald-800">
                            {ta("Aktif Video Tanımlandı / فيديو فعال")}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleClearVideo}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors self-start sm:self-auto border border-red-200"
                        >
                          <Trash2 size={14} />
                          <span>Videoyu Kaldır (Sil)</span>
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 truncate font-mono ltr">
                        <span className="font-bold text-slate-400 me-2">URL:</span>
                        <span>{form.videoUrl}</span>
                      </div>

                      {/* Live Preview Component */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          Canlı Önizleme (Detay Sayfası & Modal Görünümü):
                        </span>
                        <div className="max-w-xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                          <UniversityVideoPlayer
                            videoUrl={form.videoUrl}
                            thumbnailUrl={form.videoThumbnailUrl || form.coverImageUrl}
                            title={form.videoTitle || form.slug}
                            description={form.videoDescription}
                            autoPlay={false}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-500 text-center text-xs">
                      ℹ️ Henüz bu üniversite için bir video atanmadı. Yukarıdaki seçeneklerden bilgisayarınızdan yükleyebilir veya bir link yapıştırabilirsiniz. Video eklenmezse detay sayfasında video alanı boş bırakılır.
                    </div>
                  )}

                  {/* Video Metadata (Title, Description, Custom Thumbnail) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Video Başlığı (Title)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Kampüs ve Tesisler Tanıtım Turu"
                        value={form.videoTitle}
                        onChange={(e) => setForm({ ...form, videoTitle: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Özel Küçük Resim (Thumbnail URL - İsteğe Bağlı)
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={form.videoThumbnailUrl}
                        onChange={(e) => setForm({ ...form, videoThumbnailUrl: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        Video Açıklaması (Description - İsteğe Bağlı)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: Üniversitenin fakülteleri, laboratuvarları ve sosyal imkanları hakkında tanıtım"
                        value={form.videoDescription}
                        onChange={(e) => setForm({ ...form, videoDescription: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: ADMISSION */}
              {activeFormSection === 'ADMISSION' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <h4 className="font-bold text-sm text-brand-navy-950 flex items-center gap-1.5">
                      <Clock size={16} className="text-brand-amber-500" />
                      <span>{ta("إدارة حالة التقديم ومواعيد المفاضلات الرسمية")}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {ta("يتم تحديث هذه الحالة فوراً في جميع البطاقات، القوائم، وصفحات التفاصيل في الموقع العام.")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {tx('حالة التقديم (Application Status)*', 'Başvuru Durumu (Application Status)*', 'Application Status*')}
                      </label>
                      <select
                        value={form.admissionStatus}
                        onChange={(e) => setForm({ ...form, admissionStatus: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-brand-amber-500/50"
                      >
                        <option value="OPEN">{ta("🟢 مفتوح للتسجيل الآن (Application Open)")}</option>
                        <option value="UPCOMING">{ta("🟡 يفتح قريباً (Coming Soon)")}</option>
                        <option value="CLOSED">{ta("🔴 التقديم مغلق حالياً (Application Closed)")}</option>
                        <option value="UNCONFIRMED">{ta("⚪ الحالة غير مؤكدة رسمياً (Status Not Confirmed)")}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {tx('آخر موعد للتقديم (Deadline Text)', 'Son Başvuru Tarihi (Deadline Text)', 'Application Deadline Text')}
                      </label>
                      <input
                        type="text"
                        placeholder={ta("31 أغسطس 2026 / 31.08.2026")}
                        value={form.admissionDeadline}
                        onChange={(e) => setForm({ ...form, admissionDeadline: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {ta("رابط بوابة التقديم الرسمية للجامعة")}
                      </label>
                      <input
                        type="url"
                        placeholder="https://apply.istanbul.edu.tr"
                        value={form.officialApplicationUrl}
                        onChange={(e) => setForm({ ...form, officialApplicationUrl: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        {tx('ملاحظة مخصصة لحالة التقديم (Status Note)', 'Durum İçin Özel Not (Status Note)', 'Status Note')}
                      </label>
                      <input
                        type="text"
                        placeholder={ta("مثال: متاح للطلبة الدوليين دون شرط اختبار TR-YÖS")}
                        value={form.statusNote}
                        onChange={(e) => setForm({ ...form, statusNote: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">
                        {tx('نص إعلان القبول (يظهر في الشريط الترويجي المتحرك)', 'Kabul Duyurusu Metni (Kayan tanıtım çubuğunda görünür)', 'Admission Announcement Text (shown in ticker banner)')}
                      </label>
                      <input
                        type="text"
                        placeholder={ta("مثال: بدأ التقديم لمفاضلة البكالوريوس والدراسات العليا للفصل الخريفي")}
                        value={form.announcementText}
                        onChange={(e) => setForm({ ...form, announcementText: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                        <input
                          type="checkbox"
                          checked={form.graduateAdmissionOpen}
                          onChange={(e) => setForm({ ...form, graduateAdmissionOpen: e.target.checked })}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                        />
                        <span className="flex items-center gap-1.5">
                          <GraduationCap size={16} className="text-emerald-600" />
                          <span>{ta("برامج الماجستير والدكتوراه متاحة للتسجيل في هذه الجامعة")}</span>
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: SECTIONS & VISIBILITY */}
              {activeFormSection === 'SECTIONS' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-sm text-brand-navy-950 mb-1 flex items-center gap-1.5">
                      <Layers size={16} className="text-brand-amber-500" />
                      <span>{ta("إدارة ظهور الأقسام في صفحة تفاصيل الجامعة")}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {ta("يمكن إخفاء الأقسام غير المطبقة على هذه الجامعة بدلاً من عرض أقسام فارغة.")}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={form.showProgramsSection}
                        onChange={(e) => setForm({ ...form, showProgramsSection: e.target.checked })}
                        className="w-4 h-4 text-brand-amber-500 rounded"
                      />
                      <span>{ta("إظهار جدول البرامج والتخصصات المتاحة")}</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={form.showReviewsSection}
                        onChange={(e) => setForm({ ...form, showReviewsSection: e.target.checked })}
                        className="w-4 h-4 text-brand-amber-500 rounded"
                      />
                      <span>{ta("إظهار قسم تقييمات وآراء الطلاب")}</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={form.showFaqSection}
                        onChange={(e) => setForm({ ...form, showFaqSection: e.target.checked })}
                        className="w-4 h-4 text-brand-amber-500 rounded"
                      />
                      <span>{ta("إظهار قسم الأسئلة الشائعة (FAQ)")}</span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-white cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={form.showNotarySection}
                        onChange={(e) => setForm({ ...form, showNotarySection: e.target.checked })}
                        className="w-4 h-4 text-brand-amber-500 rounded"
                      />
                      <span>{ta("إظهار قسم النوتر والترجمة المحلفة والمعادلة")}</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 font-bold">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        className="w-4 h-4 text-brand-amber-500 rounded"
                      />
                      <span>{ta("تمييز في الصفحة الرئيسية (Featured)")}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.published}
                        onChange={(e) => setForm({ ...form, published: e.target.checked })}
                        className="w-4 h-4 text-brand-amber-500 rounded"
                      />
                      <span>{ta("نشر للعامة (Published)")}</span>
                    </label>
                  </div>
                </div>
              )}

              {/* SECTION: DEPARTMENTS (kaç bölümü var + en iyi bölümleri) */}
              {activeFormSection === 'DEPARTMENTS' && <DepartmentsFormSection form={form} setForm={setForm} />}

              {/* SECTION: MULTILINGUAL CONTENT */}
              {activeFormSection === 'LANG' && (
                <div className="space-y-4">
                  <div className="bg-slate-100 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700 px-2 flex items-center gap-1.5">
                        <Globe size={14} className="text-brand-amber-500" />
                        <span>{tx('اللغات الإلزامية الثلاث:', 'Zorunlu 3 Dil:', 'Mandatory 3 Languages:')}</span>
                      </span>
                      {['ar', 'tr', 'en'].map((lng) => {
                        const trObj = form.translations?.find((t) => t.lang === lng);
                        const isComplete = Boolean(trObj?.name?.trim());
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
                      {tx('إدخال اسم ونبذة الجامعة باللغات الثلاث إلزامي', '3 dilde üniversite adı ve tanımı zorunludur', 'University name & overview required')}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{tx('اسم الجامعة', 'Üniversite Adı', 'University Name')} ({activeTab.toUpperCase()}) *</span>
                        <span className="text-[10px] text-rose-500 font-bold">{tx('(إلزامي لجميع اللغات)', '(3 Dilde Zorunlu)', '(Required)')}</span>
                      </label>
                      <input
                        type="text"
                        required={activeTab === 'ar'}
                        placeholder={
                          activeTab === 'ar'
                            ? ta('جامعة اسطنبول')
                            : activeTab === 'tr'
                            ? 'İstanbul Üniversitesi'
                            : 'Istanbul University'
                        }
                        value={currentTrans.name || ''}
                        onChange={(e) => handleTransChange(activeTab, 'name', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>{tx('نبذة شاملة عن الجامعة (التعريف)', 'Üniversite Tanımı / Kapsamlı Bilgi', 'University Overview / Description')} ({activeTab.toUpperCase()}) *</span>
                        <span className="text-[10px] text-rose-500 font-bold">{tx('(إلزامي لبطاقة الطالب)', '(Zorunlu Alan)', '(Required)')}</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder={ta("نبذة تاريخية وأكاديمية ومكانة الجامعة وموقعها الجغرافي...")}
                        value={currentTrans.overview || ''}
                        onChange={(e) => handleTransChange(activeTab, 'overview', e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {tx('شروط القبول والتسجيل', 'Kabul ve Kayıt Şartları', 'Admission & Registration Requirements')} ({activeTab.toUpperCase()})
                        </label>
                        <textarea
                          rows={3}
                          placeholder={ta("الشهادات المقبولة والمعدلات المطلوبة...")}
                          value={currentTrans.admissionRequirements || ''}
                          onChange={(e) => handleTransChange(activeTab, 'admissionRequirements', e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          {tx('السكن الطلابي والإقامة', 'Öğrenci Yurdu ve Konaklama', 'Student Dormitory & Accommodation')} ({activeTab.toUpperCase()})
                        </label>
                        <textarea
                          rows={3}
                          placeholder={ta("السكن الجامعي الحكومي والخاص وخيارات المعيشة...")}
                          value={currentTrans.accommodationInfo || ''}
                          onChange={(e) => handleTransChange(activeTab, 'accommodationInfo', e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block font-bold text-slate-700 mb-1">
                          {tx('الاعتراف الدولي والاعتمادات', 'Uluslararası Tanınırlık ve Akreditasyonlar', 'International Recognition & Accreditations')} ({activeTab.toUpperCase()})
                        </label>
                        <textarea
                          rows={2}
                          placeholder={ta("معتمدة رسمياً من مجلس التعليم العالي التركي YÖK ونظام بولونيا ECTS...")}
                          value={currentTrans.accreditationInfo || ''}
                          onChange={(e) => handleTransChange(activeTab, 'accreditationInfo', e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                >
                  {ta("إلغاء")}
                </button>

                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white font-bold text-xs shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saveMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{ta("جاري الحفظ...")}</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>{editingId ? ta('حفظ التعديلات') : ta('إنشاء الجامعة')}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
