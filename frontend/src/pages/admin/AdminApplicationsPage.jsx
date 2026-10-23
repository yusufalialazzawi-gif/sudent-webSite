import React, { useState } from 'react';
import { ta, tx } from '../../i18n/adminText';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  MessageSquare,
  Send,
  Phone,
  Mail,
  Globe,
  Calendar,
  Award,
  ChevronDown,
  X,
  ExternalLink,
  MessageCircle,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { api, getAuthToken } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminApplicationsPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  // URL Tab handling (applications | inquiries)
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'applications';
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  // Filters & State (Applications)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [newStaffNote, setNewStaffNote] = useState('');

  // Filters & State (Inquiries)
  const [inquirySearchTerm, setInquirySearchTerm] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('');

  // Fetch applications list
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['adminApplications', { status: statusFilter, search: searchTerm }],
    queryFn: async () => {
      const res = await api.getAdminApplications({
        status: statusFilter,
        search: searchTerm,
      });
      return res.data;
    },
  });

  // Fetch contact inquiries list
  const { data: inquiriesData, isLoading: isInquiriesLoading } = useQuery({
    queryKey: ['adminInquiries'],
    queryFn: async () => {
      const res = await api.getAdminInquiries();
      return res.data || [];
    },
  });

  // Fetch single application detail when selected
  const { data: appDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['adminAppDetail', selectedAppId],
    queryFn: async () => {
      if (!selectedAppId) return null;
      const res = await api.getAdminApplicationDetail(selectedAppId);
      return res.data;
    },
    enabled: Boolean(selectedAppId),
  });

  // Mutation: Update application status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, note }) => {
      return await api.updateApplicationStatus(id, { status, note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminApplications']);
      queryClient.invalidateQueries(['adminAppDetail', selectedAppId]);
      queryClient.invalidateQueries(['adminDashboardMetrics']);
      setStatusModalApp(null);
      setStatusNote('');
    },
  });

  // Mutation: Update contact inquiry status
  const updateInquiryStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await api.updateInquiryStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminInquiries']);
      queryClient.invalidateQueries(['adminDashboardMetrics']);
    },
  });

  // Mutation: Delete contact inquiry
  const deleteInquiryMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteInquiry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminInquiries']);
      queryClient.invalidateQueries(['adminDashboardMetrics']);
    },
  });

  // Mutation: Add staff note
  const addNoteMutation = useMutation({
    mutationFn: async ({ id, noteText }) => {
      return await api.addApplicationNote(id, noteText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminAppDetail', selectedAppId]);
      setNewStaffNote('');
    },
  });

  // Secure document download handler
  const handleDownloadDoc = async (docId, fileName) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`/api/applications/admin/documents/${docId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(ta('فشل تحميل الملف'));
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(err.message || 'Error downloading document');
    }
  };

  const applications = data?.applications || [];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">{ta("جديد / تم التقديم")}</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">{ta("قيد المراجعة")}</span>;
      case 'DOCUMENTS_PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800">{ta("نقص وثائق")}</span>;
      case 'SUBMITTED_TO_UNIVERSITY':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">{ta("أُرسل للجامعة")}</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">{ta("تم القبول الأكاديمي")}</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">{ta("مرفوض")}</span>;
      case 'ENROLLED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 font-extrabold">{ta("مسجل ومثبت")}</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  const getInquiryStatusBadge = (status) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-black rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>{currentLanguage === 'ar' ? 'رسالة جديدة' : currentLanguage === 'tr' ? 'Yeni Mesaj' : 'New'}</span>
          </span>
        );
      case 'READ':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            <Eye size={12} />
            <span>{currentLanguage === 'ar' ? 'تم الاطلاع' : currentLanguage === 'tr' ? 'Okundu' : 'Read'}</span>
          </span>
        );
      case 'REPLIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCheck size={13} />
            <span>{currentLanguage === 'ar' ? 'تم الرد والتواصل' : currentLanguage === 'tr' ? 'Yanıtlandı' : 'Replied'}</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const inquiries = inquiriesData || [];
  const newInquiriesCount = inquiries.filter((i) => i.status === 'NEW').length;

  const filteredInquiries = inquiries.filter((inq) => {
    if (inquiryStatusFilter && inq.status !== inquiryStatusFilter) return false;
    if (inquirySearchTerm) {
      const q = inquirySearchTerm.toLowerCase();
      const matchName = (inq.fullName || '').toLowerCase().includes(q);
      const matchEmail = (inq.email || '').toLowerCase().includes(q);
      const matchPhone = (inq.phone || '').toLowerCase().includes(q);
      const matchSub = (inq.subject || '').toLowerCase().includes(q);
      const matchMsg = (inq.message || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchSub && !matchMsg) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar'
              ? ta('إدارة طلبات الطلاب والاستشارات')
              : currentLanguage === 'tr'
              ? 'Öğrenci Başvuruları & İletişim Talepleri'
              : 'Student Applications & Leads'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar'
              ? ta('متابعة ملفات القبول الجامعي، استفسارات نموذج التواصل المباشر، ومراسلة الطلاب فوراً عبر واتساب والهاتف')
              : currentLanguage === 'tr'
              ? 'Üniversite başvuru dosyaları ve web sitesi iletişim formundan gelen öğrenci mesajlarını anında WhatsApp ve e-posta ile yanıtlayın'
              : 'Process student applications, review verification documents, and respond to incoming contact leads'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {newInquiriesCount > 0 && (
            <button
              onClick={() => setActiveTab('inquiries')}
              className="flex items-center gap-2 text-xs font-black text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3.5 py-2 rounded-xl border border-emerald-300 transition shadow-sm animate-pulse"
            >
              <MessageSquare size={15} className="text-emerald-600" />
              <span>
                {newInquiriesCount} {currentLanguage === 'ar' ? 'رسالة جديدة' : currentLanguage === 'tr' ? 'Yeni Mesaj' : 'New Messages'}
              </span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
            <Users size={16} className="text-brand-amber-500" />
            <span>{activeTab === 'applications' ? `${applications.length} ${tx('طلبات', 'başvuru', 'applications')}` : `${inquiries.length} ${tx('رسائل', 'mesaj', 'messages')}`}</span>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'applications'
              ? 'bg-brand-navy-950 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users size={16} className={activeTab === 'applications' ? 'text-brand-amber-400' : 'text-slate-400'} />
          <span>{currentLanguage === 'ar' ? 'طلبات التسجيل الجامعي' : currentLanguage === 'tr' ? 'Üniversite Başvuruları' : 'University Applications'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${activeTab === 'applications' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
            {applications.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'inquiries'
              ? 'bg-brand-navy-950 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare size={16} className={activeTab === 'inquiries' ? 'text-brand-amber-400' : 'text-slate-400'} />
          <span>{currentLanguage === 'ar' ? 'رسائل واستفسارات التواصل' : currentLanguage === 'tr' ? 'Gelen İletişim Mesajları' : 'Contact Inquiries'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold ${
            newInquiriesCount > 0 ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
          }`}>
            {inquiries.length}
          </span>
        </button>
      </div>

      {activeTab === 'applications' && (
        <>
          {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={currentLanguage === 'ar' ? 'بحث بالاسم، البريد، الجواز، أو الهاتف...' : 'Search by student name, email, passport...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === '' ? 'bg-brand-navy-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {ta("الكل")}
          </button>
          <button
            onClick={() => setStatusFilter('SUBMITTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'SUBMITTED' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            {ta("جديد")}
          </button>
          <button
            onClick={() => setStatusFilter('UNDER_REVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'UNDER_REVIEW' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {ta("قيد المراجعة")}
          </button>
          <button
            onClick={() => setStatusFilter('DOCUMENTS_PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'DOCUMENTS_PENDING' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            {ta("نقص وثائق")}
          </button>
          <button
            onClick={() => setStatusFilter('ACCEPTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'ACCEPTED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {ta("مقبول")}
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>{ta("جاري تحميل طلبات الطلاب...")}</span>
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">{ta("الطالب وبيانات الاتصال")}</th>
                  <th className="px-4 py-4 text-start">{ta("الجنسية")}</th>
                  <th className="px-4 py-4 text-start">{ta("الجامعة والبرنامج")}</th>
                  <th className="px-4 py-4 text-start">{ta("الدرجة والمعدل")}</th>
                  <th className="px-4 py-4 text-start">{ta("الحالة")}</th>
                  <th className="px-4 py-4 text-start">{ta("تاريخ التقديم")}</th>
                  <th className="px-6 py-4 text-end">{ta("إجراءات")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{app.email}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 ltr text-start">
                        <Phone size={12} className="text-slate-400" />
                        <span>{app.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-semibold text-slate-700">{app.nationality}</span>
                      {app.passportNumber && (
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">#{app.passportNumber}</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-800">{app.university?.name || ta('جامعة تركية مختارة')}</div>
                      <div className="text-[11px] text-brand-amber-600 font-medium">{app.program?.name || app.desiredMajor}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-700">{app.degreeLevel}</div>
                      <div className="text-[11px] text-slate-500">{tx('المعدل:', 'Not Ortalaması:', 'GPA:')} {app.highSchoolGpa || 'N/A'}%</div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedAppId(app.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-brand-navy-950 hover:text-white rounded-lg font-bold text-slate-700 transition flex items-center gap-1.5"
                        >
                          <Eye size={14} />
                          <span>{ta("التفاصيل")}</span>
                        </button>
                        <button
                          onClick={() => {
                            setStatusModalApp(app);
                            setNewStatus(app.status);
                          }}
                          className="px-3 py-1.5 bg-brand-amber-500/10 hover:bg-brand-amber-500 hover:text-white rounded-lg font-bold text-brand-amber-700 transition"
                        >
                          {ta("تغيير الحالة")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-sm">
            {ta("لا توجد طلبات مطابقة لمعايير البحث")}
          </div>
        )}
      </div>
        </>
      )}

      {/* TAB 2: INQUIRIES & LEADS */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          {/* Inquiry Filters and Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={currentLanguage === 'ar' ? 'بحث بالاسم، الإيميل، الهاتف، أو نص الرسالة...' : currentLanguage === 'tr' ? 'İsim, e-posta, telefon veya mesaja göre ara...' : 'Search by name, email, phone, message...'}
                value={inquirySearchTerm}
                onChange={(e) => setInquirySearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
              <button
                onClick={() => setInquiryStatusFilter('')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  inquiryStatusFilter === '' ? 'bg-brand-navy-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {currentLanguage === 'ar' ? 'الكل' : currentLanguage === 'tr' ? 'Tümü' : 'All'} ({inquiries.length})
              </button>
              <button
                onClick={() => setInquiryStatusFilter('NEW')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  inquiryStatusFilter === 'NEW' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {currentLanguage === 'ar' ? 'جديد' : currentLanguage === 'tr' ? 'Yeni' : 'New'} ({inquiries.filter((i) => i.status === 'NEW').length})
              </button>
              <button
                onClick={() => setInquiryStatusFilter('READ')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  inquiryStatusFilter === 'READ' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                }`}
              >
                {currentLanguage === 'ar' ? 'تم الاطلاع' : currentLanguage === 'tr' ? 'Okundu' : 'Read'} ({inquiries.filter((i) => i.status === 'READ').length})
              </button>
              <button
                onClick={() => setInquiryStatusFilter('REPLIED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  inquiryStatusFilter === 'REPLIED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {currentLanguage === 'ar' ? 'تم الرد' : currentLanguage === 'tr' ? 'Yanıtlandı' : 'Replied'} ({inquiries.filter((i) => i.status === 'REPLIED').length})
              </button>
            </div>
          </div>

          {/* Inquiries Cards Grid */}
          {isInquiriesLoading ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>{ta("جاري تحميل رسائل التواصل...")}</span>
            </div>
          ) : filteredInquiries.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredInquiries.map((inq) => {
                const phoneClean = (inq.phone || '').replace(/[^0-9]/g, '');
                return (
                  <div
                    key={inq.id}
                    className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-sm hover:shadow-md ${
                      inq.status === 'NEW' ? 'border-blue-400/80 bg-blue-50/20' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-navy-950 text-white flex items-center justify-center font-bold text-sm shrink-0">
                          {(inq.fullName || ta('؟')).charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-base">{inq.fullName}</h3>
                            {getInquiryStatusBadge(inq.status)}
                          </div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail size={12} className="text-slate-400" />
                              <a href={`mailto:${inq.email}`} className="hover:text-brand-amber-600 transition">
                                {inq.email}
                              </a>
                            </span>
                            {inq.phone && (
                              <span className="flex items-center gap-1 ltr">
                                <Phone size={12} className="text-slate-400" />
                                <a href={`tel:${inq.phone}`} className="hover:text-brand-amber-600 transition">
                                  {inq.phone}
                                </a>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end lg:self-center">
                        <span className="text-xs text-slate-400 font-medium">
                          {new Date(inq.createdAt).toLocaleString(currentLanguage === 'ar' ? 'ar-EG' : 'tr-TR', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Subject & Message Body */}
                    <div className="py-3">
                      {inq.subject && (
                        <div className="inline-block px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold mb-2 border border-amber-200">
                          {inq.subject}
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line font-medium">
                        "{inq.message}"
                      </p>
                    </div>

                    {/* Quick Response & Status Actions */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      {/* Direct Communication Channels */}
                      <div className="flex flex-wrap items-center gap-2">
                        {phoneClean && (
                          <a
                            href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                              currentLanguage === 'ar'
                                ? `مرحباً ${inq.fullName}، شكراً لتواصلك مع منصة المجد للقبولات الجامعية في تركيا بخصوص (${inq.subject || ta('استفسارك')}).`
                                : `Merhaba ${inq.fullName}, Al-Majd Eğitim Danışmanlığı olarak mesajınızı aldık.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition shadow-sm"
                          >
                            <MessageCircle size={14} />
                            <span>{ta("واتساب مباشر (WhatsApp)")}</span>
                          </a>
                        )}

                        {inq.phone && (
                          <a
                            href={`tel:${inq.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                          >
                            <Phone size={13} />
                            <span>{ta("اتصال هاتفي")}</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${inq.email}?subject=${encodeURIComponent(`رد على استفسارك: ${inq.subject || ta('منصة المجد')}`)}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200"
                        >
                          <Mail size={13} />
                          <span>{ta("إرسال بريد إلكتروني")}</span>
                        </a>
                      </div>

                      {/* Status Toggle & Delete */}
                      <div className="flex items-center gap-2">
                        {inq.status !== 'READ' && inq.status !== 'REPLIED' && (
                          <button
                            onClick={() => updateInquiryStatusMutation.mutate({ id: inq.id, status: 'READ' })}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200 transition"
                          >
                            {ta("تحديد كمقروء")}
                          </button>
                        )}

                        {inq.status !== 'REPLIED' && (
                          <button
                            onClick={() => updateInquiryStatusMutation.mutate({ id: inq.id, status: 'REPLIED' })}
                            className="px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition"
                          >
                            {ta("تم الرد والتواصل ✓")}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm(ta('هل أنت متأكد من حذف هذا الاستفسار نهائياً؟'))) {
                              deleteInquiryMutation.mutate(inq.id);
                            }
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title={ta("حذف الرسالة")}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-sm">
              {currentLanguage === 'ar' ? 'لا توجد رسائل تواصل مطابقة لمعايير البحث' : 'No contact inquiries matching filters'}
            </div>
          )}
        </div>
      )}

      {/* Application Detail Drawer / Modal */}
      {selectedAppId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">{ta("تفاصيل ملف الطالب")}</span>
                <h2 className="text-xl font-bold mt-1">{appDetail?.applicantName || ta('جاري التحميل...')}</h2>
              </div>
              <button
                onClick={() => setSelectedAppId(null)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isDetailLoading ? (
                <div className="p-12 text-center text-slate-400">
                  <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <span>{ta("جاري تحميل بيانات الملف والوثائق...")}</span>
                </div>
              ) : appDetail ? (
                <>
                  {/* Status & Quick Change Banner */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">{ta("حالة الطلب الحالية")}</div>
                      <div className="mt-1">{getStatusBadge(appDetail.status)}</div>
                    </div>
                    <button
                      onClick={() => {
                        setStatusModalApp(appDetail);
                        setNewStatus(appDetail.status);
                      }}
                      className="px-4 py-2 bg-brand-navy-950 text-white rounded-lg text-xs font-bold hover:bg-brand-navy-900 transition"
                    >
                      {ta("تحديث الحالة")}
                    </button>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <Users size={16} className="text-brand-amber-500" />
                      <span>{ta("المعلومات الشخصية وبيانات التواصل")}</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">{ta("الجنسية:")}</span>
                        <span className="font-semibold text-slate-800">{appDetail.nationality}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("رقم جواز السفر:")}</span>
                        <span className="font-semibold text-slate-800 font-mono">{appDetail.passportNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("تاريخ الميلاد:")}</span>
                        <span className="font-semibold text-slate-800">{appDetail.birthDate || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("الجنس:")}</span>
                        <span className="font-semibold text-slate-800">{appDetail.gender === 'MALE' ? ta('ذكر') : appDetail.gender === 'FEMALE' ? ta('أنثى') : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("البريد الإلكتروني:")}</span>
                        <a href={`mailto:${appDetail.email}`} className="font-semibold text-brand-amber-600 hover:underline">
                          {appDetail.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("رقم الهاتف / واتساب:")}</span>
                        <a
                          href={`https://wa.me/${appDetail.phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-emerald-600 hover:underline flex items-center gap-1 ltr"
                        >
                          <Phone size={12} />
                          <span>{appDetail.phone}</span>
                        </a>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-400 block">{ta("مكان الإقامة الحالي:")}</span>
                        <span className="font-semibold text-slate-800">{appDetail.currentCountry || 'N/A'} - {appDetail.address || ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Preferences */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <Award size={16} className="text-brand-amber-500" />
                      <span>{ta("الرغبات الأكاديمية والدرجة المطلوبة")}</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">{ta("الجامعة المرغوبة:")}</span>
                        <span className="font-bold text-brand-navy-950 text-sm">
                          {appDetail.university?.name || ta('جامعة غير محددة')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("التخصص المطلوب:")}</span>
                        <span className="font-bold text-brand-amber-600 text-sm">
                          {appDetail.program?.name || appDetail.desiredMajor || ta('غير محدد')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("المرحلة الدراسية:")}</span>
                        <span className="font-semibold text-slate-800">{appDetail.degreeLevel}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("لغة الدراسة المفضلة:")}</span>
                        <span className="font-semibold text-slate-800">{appDetail.preferredLanguage || ta('إنجليزي / تركي')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("معدل الثانوية العامة:")}</span>
                        <span className="font-bold text-slate-900">{appDetail.highSchoolGpa || 'N/A'}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">{ta("سنة التخرج:")}</span>
                        <span className="font-semibold text-slate-800">{appDetail.graduationYear || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <FileText size={16} className="text-brand-amber-500" />
                      <span>{tx('الوثائق والشهادات المرفوعة', 'Yüklenen Belgeler ve Sertifikalar', 'Uploaded Documents & Certificates')} ({appDetail.documents?.length || 0})</span>
                    </h3>

                    {appDetail.documents?.length > 0 ? (
                      <div className="space-y-2">
                        {appDetail.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                                <FileText size={16} />
                              </div>
                              <div>
                                <div className="font-bold text-slate-800">{doc.documentType}</div>
                                <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                                  {doc.originalName} • {(doc.fileSize / 1024).toFixed(1)} KB
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDownloadDoc(doc.id, doc.originalName)}
                              className="px-3 py-1.5 bg-brand-navy-950 text-white rounded-lg font-bold hover:bg-brand-navy-900 transition flex items-center gap-1.5 text-xs shadow-sm"
                            >
                              <Download size={14} />
                              <span>{ta("تحميل آمن")}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">{ta("لا توجد وثائق مرفوعة مع هذا الطلب حتى الآن.")}</p>
                    )}
                  </div>

                  {/* Internal Staff Notes */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <MessageSquare size={16} className="text-brand-amber-500" />
                      <span>{ta("الملاحظات الداخلية للمستشارين الأكاديميين")}</span>
                    </h3>

                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {appDetail.notes?.length > 0 ? (
                        appDetail.notes.map((note) => (
                          <div key={note.id} className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs">
                            <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                              <span>{note.user?.name || ta('مستشار القبول')}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {new Date(note.createdAt).toLocaleString(currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US')}
                              </span>
                            </div>
                            <p className="text-slate-700 whitespace-pre-wrap">{note.noteText}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">{ta("لا توجد ملاحظات داخلية مدونة بعد.")}</p>
                      )}
                    </div>

                    {/* Add note input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={ta("أضف ملاحظة للملف الداخلي (مثل: تم التواصل مع الطالب، بانتظار شهادة التوفل)...")}
                        value={newStaffNote}
                        onChange={(e) => setNewStaffNote(e.target.value)}
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
                      />
                      <button
                        onClick={() => {
                          if (!newStaffNote.trim()) return;
                          addNoteMutation.mutate({ id: appDetail.id, noteText: newStaffNote });
                        }}
                        disabled={addNoteMutation.isPending || !newStaffNote.trim()}
                        className="px-4 py-2 bg-brand-amber-500 text-white rounded-xl text-xs font-bold hover:bg-brand-amber-600 transition disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Send size={14} />
                        <span>{ta("إضافة")}</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {statusModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">{ta("تحديث حالة الطلب")}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {tx('الطالب:', 'Öğrenci:', 'Student:')} <span className="font-bold text-slate-800">{statusModalApp.applicantName}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{ta("الحالة الجديدة")}</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
                >
                  <option value="SUBMITTED">{ta("جديد / تم التقديم (SUBMITTED)")}</option>
                  <option value="UNDER_REVIEW">{ta("قيد المراجعة والتدقيق (UNDER_REVIEW)")}</option>
                  <option value="DOCUMENTS_PENDING">{ta("نقص في الوثائق (DOCUMENTS_PENDING)")}</option>
                  <option value="SUBMITTED_TO_UNIVERSITY">{ta("تم الإرسال إلى الجامعة (SUBMITTED_TO_UNIVERSITY)")}</option>
                  <option value="ACCEPTED">{ta("تم الحصول على القبول الأكاديمي (ACCEPTED)")}</option>
                  <option value="REJECTED">{ta("مرفوض (REJECTED)")}</option>
                  <option value="ENROLLED">{ta("تم التثبيت والتسجيل النهائي (ENROLLED)")}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{ta("سبب / ملاحظة التحديث (تظهر في سجل الحالات)")}</label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder={ta("مثال: تم إرسال الأوراق لجامعة ميديبول، بانتظار خطاب القبول المبدئي...")}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalApp(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  {ta("إلغاء")}
                </button>
                <button
                  type="button"
                  onClick={() => updateStatusMutation.mutate({ id: statusModalApp.id, status: newStatus, note: statusNote })}
                  disabled={updateStatusMutation.isPending}
                  className="px-5 py-2 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
                >
                  {updateStatusMutation.isPending ? ta('جاري الحفظ...') : ta('تأكيد التحديث')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
