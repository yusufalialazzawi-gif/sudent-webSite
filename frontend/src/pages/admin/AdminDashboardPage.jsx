import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  ArrowUpRight,
  Clock,
  CheckCircle,
  FileText,
  Calendar,
  ExternalLink,
  Plus
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDashboardPage() {
  const { currentLanguage, isRtl } = useLanguage();

  const { data: metrics, isLoading, error, refetch } = useQuery({
    queryKey: ['adminDashboardMetrics'],
    queryFn: async () => {
      const res = await api.getDashboardMetrics();
      return res.data;
    },
    refetchInterval: 30000, // refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-500">جاري تحميل مؤشرات المنصة...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700">
        <p className="font-bold">فشل تحميل بيانات لوحة التحكم</p>
        <p className="text-sm mt-1">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: currentLanguage === 'ar' ? 'إجمالي الطلبات' : 'Total Applications',
      value: metrics?.totalApplications || 0,
      subValue: `${metrics?.submittedApplications || 0} ${currentLanguage === 'ar' ? 'طلب جديد' : 'new'}`,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/applications'
    },
    {
      title: currentLanguage === 'ar' ? 'قيد المراجعة' : 'Under Review',
      value: metrics?.underReviewApplications || 0,
      subValue: currentLanguage === 'ar' ? 'مع المستشارين الأكاديميين' : 'with counselors',
      icon: Clock,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      link: '/admin/applications?status=UNDER_REVIEW'
    },
    {
      title: currentLanguage === 'ar' ? 'القبولات والمسجلين' : 'Admitted & Enrolled',
      value: (metrics?.acceptedApplications || 0) + (metrics?.enrolledApplications || 0),
      subValue: `${metrics?.acceptedApplications || 0} ${currentLanguage === 'ar' ? 'مقبول' : 'accepted'}`,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/admin/applications?status=ACCEPTED'
    },
    {
      title: currentLanguage === 'ar' ? 'الجامعات المعتمدة' : 'Universities',
      value: metrics?.totalUniversities || 0,
      subValue: `${metrics?.totalPrograms || 0} ${currentLanguage === 'ar' ? 'برنامج دراسي' : 'programs'}`,
      icon: GraduationCap,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/universities'
    },
    {
      title: currentLanguage === 'ar' ? 'استفسارات التواصل' : 'Leads & Inquiries',
      value: metrics?.totalInquiries || 0,
      subValue: currentLanguage === 'ar' ? 'عبر نموذج الموقع' : 'from website forms',
      icon: MessageSquare,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      link: '/admin/applications'
    },
    {
      title: currentLanguage === 'ar' ? 'تنبيهات الترجمة' : 'Translation Alerts',
      value: metrics?.missingTranslations || 0,
      subValue: currentLanguage === 'ar' ? 'حقول بحاجة لترجمة' : 'missing locale fields',
      icon: AlertTriangle,
      color: 'bg-rose-500',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      link: '/admin/translations'
    }
  ];

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
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">تم القبول</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">مرفوض</span>;
      case 'ENROLLED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 font-extrabold">تم التثبيت والتسجيل</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'لوحة تحكم القبولات والجامعات' : 'Control Center Overview'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'متابعة حية للطلبات الواردة، خطوط الإرشاد الطلابي، وجاهزية المحتوى الأكاديمي' : 'Live monitoring of admissions pipeline, student leads, and university catalog'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/universities"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy-950 text-white rounded-xl text-xs font-bold shadow hover:bg-brand-navy-900 transition"
          >
            <Plus size={16} />
            <span>{currentLanguage === 'ar' ? 'إضافة جامعة' : 'Add University'}</span>
          </Link>
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow hover:from-brand-amber-600 hover:to-amber-700 transition"
          >
            <Users size={16} />
            <span>{currentLanguage === 'ar' ? 'إدارة الطلبات' : 'Applications'}</span>
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              to={card.link}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-brand-amber-500/30 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-xl ${card.bgColor} ${card.textColor}`}>
                  <Icon size={20} />
                </div>
                <ArrowUpRight size={16} className="text-slate-400 group-hover:text-brand-amber-500 transition" />
              </div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">{card.value}</div>
              <div className="text-xs font-bold text-slate-700 mt-1">{card.title}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 truncate">{card.subValue}</div>
            </Link>
          );
        })}
      </div>

      {/* Applications Pipeline Breakdown Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">
            {currentLanguage === 'ar' ? 'مراحل مسار القبول الطلابي (Admissions Pipeline)' : 'Admissions Pipeline Distribution'}
          </h2>
          <span className="text-xs font-bold text-brand-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            {metrics?.totalApplications || 0} {currentLanguage === 'ar' ? 'طالب مسجل' : 'Total Students'}
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${Math.max(5, ((metrics?.submittedApplications || 0) / (metrics?.totalApplications || 1)) * 100)}%` }}
            className="bg-blue-500 h-full title-tip"
            title="جديد / تم التقديم"
          />
          <div
            style={{ width: `${Math.max(5, ((metrics?.underReviewApplications || 0) / (metrics?.totalApplications || 1)) * 100)}%` }}
            className="bg-amber-500 h-full"
            title="قيد المراجعة"
          />
          <div
            style={{ width: `${Math.max(5, ((metrics?.acceptedApplications || 0) / (metrics?.totalApplications || 1)) * 100)}%` }}
            className="bg-emerald-500 h-full"
            title="مقبول"
          />
          <div
            style={{ width: `${Math.max(5, ((metrics?.enrolledApplications || 0) / (metrics?.totalApplications || 1)) * 100)}%` }}
            className="bg-purple-600 h-full"
            title="مسجل ومثبت"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600">جديد: {metrics?.submittedApplications || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600">قيد المراجعة: {metrics?.underReviewApplications || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">مقبول: {metrics?.acceptedApplications || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-600" />
            <span className="text-slate-600">مسجل نهائي: {metrics?.enrolledApplications || 0}</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Applications & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Applications (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-brand-navy-950 text-white rounded-lg">
                <FileText size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {currentLanguage === 'ar' ? 'أحدث طلبات القبول الواردة' : 'Recent Admissions Applications'}
                </h3>
                <span className="text-xs text-slate-400">آخر التقديمات المسجلة من الطلاب</span>
              </div>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-brand-amber-600 hover:text-brand-amber-700 flex items-center gap-1"
            >
              <span>{currentLanguage === 'ar' ? 'عرض الكل' : 'View All'}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {metrics?.recentApplications?.length > 0 ? (
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 text-start">الطالب</th>
                    <th className="px-4 py-3.5 text-start">الجامعة والبرنامج</th>
                    <th className="px-4 py-3.5 text-start">الحالة</th>
                    <th className="px-4 py-3.5 text-start">التاريخ</th>
                    <th className="px-6 py-3.5 text-end">إجراء</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {metrics.recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-400">{app.nationality} • {app.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-slate-800">{app.universityName || 'جامعة مختارة'}</div>
                        <div className="text-[11px] text-slate-500">{app.programName || app.degreeLevel}</div>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <Link
                          to={`/admin/applications?id=${app.id}`}
                          className="px-3 py-1 bg-slate-100 hover:bg-brand-navy-950 hover:text-white rounded-lg font-semibold text-slate-700 transition"
                        >
                          معاينة
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                لا توجد طلبات تقديم مسجلة حالياً
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries (1 col) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500 text-white rounded-lg">
                <MessageSquare size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {currentLanguage === 'ar' ? 'استفسارات الطلاب' : 'Website Leads'}
                </h3>
                <span className="text-xs text-slate-400">رسائل نموذج التواصل المباشر</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 divide-y divide-slate-100 overflow-y-auto max-h-[380px]">
            {metrics?.recentInquiries?.length > 0 ? (
              metrics.recentInquiries.map((inq) => (
                <div key={inq.id} className="py-3.5 first:pt-1 last:pb-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">{inq.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(inq.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
                    </span>
                  </div>
                  <div className="text-[11px] text-brand-navy-900 font-semibold mb-1">
                    {inq.subject || inq.phone || inq.email}
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    "{inq.message}"
                  </p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                لا توجد رسائل تواصل جديدة
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
