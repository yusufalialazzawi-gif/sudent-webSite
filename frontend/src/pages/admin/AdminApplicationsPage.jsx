import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';
import { api, getAuthToken } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminApplicationsPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [statusModalApp, setStatusModalApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [newStaffNote, setNewStaffNote] = useState('');

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
        throw new Error('فشل تحميل الملف');
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
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">جديد / تم التقديم</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">قيد المراجعة</span>;
      case 'DOCUMENTS_PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800">نقص وثائق</span>;
      case 'SUBMITTED_TO_UNIVERSITY':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">أُرسل للجامعة</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">تم القبول الأكاديمي</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">مرفوض</span>;
      case 'ENROLLED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 font-extrabold">مسجل ومثبت</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'إدارة طلبات الطلاب والاستشارات' : 'Student Applications & Leads'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'متابعة ملفات القبول، مراجعة الوثائق المرفوعة، وتحديث الحالات والتواصل' : 'Process student applications, review verification documents, and log internal notes'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200">
          <Users size={16} className="text-brand-amber-500" />
          <span>{applications.length} طلبات معروضة</span>
        </div>
      </div>

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
            الكل
          </button>
          <button
            onClick={() => setStatusFilter('SUBMITTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'SUBMITTED' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            جديد
          </button>
          <button
            onClick={() => setStatusFilter('UNDER_REVIEW')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'UNDER_REVIEW' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            قيد المراجعة
          </button>
          <button
            onClick={() => setStatusFilter('DOCUMENTS_PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'DOCUMENTS_PENDING' ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100'
            }`}
          >
            نقص وثائق
          </button>
          <button
            onClick={() => setStatusFilter('ACCEPTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
              statusFilter === 'ACCEPTED' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            مقبول
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span>جاري تحميل طلبات الطلاب...</span>
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-start">الطالب وبيانات الاتصال</th>
                  <th className="px-4 py-4 text-start">الجنسية</th>
                  <th className="px-4 py-4 text-start">الجامعة والبرنامج</th>
                  <th className="px-4 py-4 text-start">الدرجة والمعدل</th>
                  <th className="px-4 py-4 text-start">الحالة</th>
                  <th className="px-4 py-4 text-start">تاريخ التقديم</th>
                  <th className="px-6 py-4 text-end">إجراءات</th>
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
                      <div className="font-bold text-slate-800">{app.university?.name || 'جامعة تركية مختارة'}</div>
                      <div className="text-[11px] text-brand-amber-600 font-medium">{app.program?.name || app.desiredMajor}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-700">{app.degreeLevel}</div>
                      <div className="text-[11px] text-slate-500">المعدل: {app.highSchoolGpa || 'N/A'}%</div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                      {new Date(app.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedAppId(app.id)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-brand-navy-950 hover:text-white rounded-lg font-bold text-slate-700 transition flex items-center gap-1.5"
                        >
                          <Eye size={14} />
                          <span>التفاصيل</span>
                        </button>
                        <button
                          onClick={() => {
                            setStatusModalApp(app);
                            setNewStatus(app.status);
                          }}
                          className="px-3 py-1.5 bg-brand-amber-500/10 hover:bg-brand-amber-500 hover:text-white rounded-lg font-bold text-brand-amber-700 transition"
                        >
                          تغيير الحالة
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
            لا توجد طلبات مطابقة لمعايير البحث
          </div>
        )}
      </div>

      {/* Application Detail Drawer / Modal */}
      {selectedAppId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 bg-brand-navy-950 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">تفاصيل ملف الطالب</span>
                <h2 className="text-xl font-bold mt-1">{appDetail?.applicantName || 'جاري التحميل...'}</h2>
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
                  <span>جاري تحميل بيانات الملف والوثائق...</span>
                </div>
              ) : appDetail ? (
                <>
                  {/* Status & Quick Change Banner */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-500">حالة الطلب الحالية</div>
                      <div className="mt-1">{getStatusBadge(appDetail.status)}</div>
                    </div>
                    <button
                      onClick={() => {
                        setStatusModalApp(appDetail);
                        setNewStatus(appDetail.status);
                      }}
                      className="px-4 py-2 bg-brand-navy-950 text-white rounded-lg text-xs font-bold hover:bg-brand-navy-900 transition"
                    >
                      تحديث الحالة
                    </button>
                  </div>

                  {/* Personal Information */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <Users size={16} className="text-brand-amber-500" />
                      <span>المعلومات الشخصية وبيانات التواصل</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">الجنسية:</span>
                        <span className="font-semibold text-slate-800">{appDetail.nationality}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">رقم جواز السفر:</span>
                        <span className="font-semibold text-slate-800 font-mono">{appDetail.passportNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">تاريخ الميلاد:</span>
                        <span className="font-semibold text-slate-800">{appDetail.birthDate || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">الجنس:</span>
                        <span className="font-semibold text-slate-800">{appDetail.gender === 'MALE' ? 'ذكر' : appDetail.gender === 'FEMALE' ? 'أنثى' : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">البريد الإلكتروني:</span>
                        <a href={`mailto:${appDetail.email}`} className="font-semibold text-brand-amber-600 hover:underline">
                          {appDetail.email}
                        </a>
                      </div>
                      <div>
                        <span className="text-slate-400 block">رقم الهاتف / واتساب:</span>
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
                        <span className="text-slate-400 block">مكان الإقامة الحالي:</span>
                        <span className="font-semibold text-slate-800">{appDetail.currentCountry || 'N/A'} - {appDetail.address || ''}</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Preferences */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <Award size={16} className="text-brand-amber-500" />
                      <span>الرغبات الأكاديمية والدرجة المطلوبة</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-slate-400 block">الجامعة المرغوبة:</span>
                        <span className="font-bold text-brand-navy-950 text-sm">
                          {appDetail.university?.name || 'جامعة غير محددة'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">التخصص المطلوب:</span>
                        <span className="font-bold text-brand-amber-600 text-sm">
                          {appDetail.program?.name || appDetail.desiredMajor || 'غير محدد'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">المرحلة الدراسية:</span>
                        <span className="font-semibold text-slate-800">{appDetail.degreeLevel}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">لغة الدراسة المفضلة:</span>
                        <span className="font-semibold text-slate-800">{appDetail.preferredLanguage || 'إنجليزي / تركي'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">معدل الثانوية العامة:</span>
                        <span className="font-bold text-slate-900">{appDetail.highSchoolGpa || 'N/A'}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">سنة التخرج:</span>
                        <span className="font-semibold text-slate-800">{appDetail.graduationYear || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Documents List */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <FileText size={16} className="text-brand-amber-500" />
                      <span>الوثائق والشهادات المرفوعة ({appDetail.documents?.length || 0})</span>
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
                              <span>تحميل آمن</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">لا توجد وثائق مرفوعة مع هذا الطلب حتى الآن.</p>
                    )}
                  </div>

                  {/* Internal Staff Notes */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <MessageSquare size={16} className="text-brand-amber-500" />
                      <span>الملاحظات الداخلية للمستشارين الأكاديميين</span>
                    </h3>

                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                      {appDetail.notes?.length > 0 ? (
                        appDetail.notes.map((note) => (
                          <div key={note.id} className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs">
                            <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                              <span>{note.user?.name || 'مستشار القبول'}</span>
                              <span className="text-[10px] text-slate-400 font-normal">
                                {new Date(note.createdAt).toLocaleString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
                              </span>
                            </div>
                            <p className="text-slate-700 whitespace-pre-wrap">{note.noteText}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">لا توجد ملاحظات داخلية مدونة بعد.</p>
                      )}
                    </div>

                    {/* Add note input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="أضف ملاحظة للملف الداخلي (مثل: تم التواصل مع الطالب، بانتظار شهادة التوفل)..."
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
                        <span>إضافة</span>
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
            <h3 className="text-lg font-bold text-slate-900 mb-2">تحديث حالة الطلب</h3>
            <p className="text-xs text-slate-500 mb-4">
              الطالب: <span className="font-bold text-slate-800">{statusModalApp.applicantName}</span>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الحالة الجديدة</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
                >
                  <option value="SUBMITTED">جديد / تم التقديم (SUBMITTED)</option>
                  <option value="UNDER_REVIEW">قيد المراجعة والتدقيق (UNDER_REVIEW)</option>
                  <option value="DOCUMENTS_PENDING">نقص في الوثائق (DOCUMENTS_PENDING)</option>
                  <option value="SUBMITTED_TO_UNIVERSITY">تم الإرسال إلى الجامعة (SUBMITTED_TO_UNIVERSITY)</option>
                  <option value="ACCEPTED">تم الحصول على القبول الأكاديمي (ACCEPTED)</option>
                  <option value="REJECTED">مرفوض (REJECTED)</option>
                  <option value="ENROLLED">تم التثبيت والتسجيل النهائي (ENROLLED)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">سبب / ملاحظة التحديث (تظهر في سجل الحالات)</label>
                <textarea
                  rows={3}
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="مثال: تم إرسال الأوراق لجامعة ميديبول، بانتظار خطاب القبول المبدئي..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatusModalApp(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={() => updateStatusMutation.mutate({ id: statusModalApp.id, status: newStatus, note: statusNote })}
                  disabled={updateStatusMutation.isPending}
                  className="px-5 py-2 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
                >
                  {updateStatusMutation.isPending ? 'جاري الحفظ...' : 'تأكيد التحديث'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
