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
  Plus,
  Phone,
  Mail,
  MessageCircle,
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminDashboardPage() {
  const { currentLanguage, isRtl, tx } = useLanguage();
  const dateLocale = currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US';

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
          <span className="text-sm font-semibold text-slate-500">{tx('جاري تحميل مؤشرات المنصة...', 'Platform göstergeleri yükleniyor...', 'Loading platform metrics...')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700">
        <p className="font-bold">{tx('فشل تحميل بيانات لوحة التحكم', 'Kontrol paneli verileri yüklenemedi', 'Failed to load dashboard data')}</p>
        <p className="text-sm mt-1">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
        >
          {tx('إعادة المحاولة', 'Tekrar Dene', 'Retry')}
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: tx('إجمالي الطلبات', 'Toplam Başvuru', 'Total Applications'),
      value: metrics?.totalApplications || 0,
      subValue: `${metrics?.submittedApplications || 0} ${tx('طلب جديد', 'yeni', 'new')}`,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/admin/applications'
    },
    {
      title: tx('قيد المراجعة', 'İncelemede', 'Under Review'),
      value: metrics?.underReviewApplications || 0,
      subValue: tx('مع المستشارين الأكاديميين', 'Danışmanlarda', 'with counselors'),
      icon: Clock,
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      link: '/admin/applications?status=UNDER_REVIEW'
    },
    {
      title: tx('القبولات والمسجلين', 'Kabul & Kayıt', 'Admitted & Enrolled'),
      value: (metrics?.acceptedApplications || 0) + (metrics?.enrolledApplications || 0),
      subValue: `${metrics?.acceptedApplications || 0} ${tx('مقبول', 'kabul edildi', 'accepted')}`,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/admin/applications?status=ACCEPTED'
    },
    {
      title: tx('الجامعات المعتمدة', 'Üniversiteler', 'Universities'),
      value: metrics?.totalUniversities || 0,
      subValue: `${metrics?.totalPrograms || 0} ${tx('برنامج دراسي', 'program', 'programs')}`,
      icon: GraduationCap,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/admin/universities'
    },
    {
      title: tx('استفسارات التواصل', 'Talepler & Sorular', 'Leads & Inquiries'),
      value: metrics?.totalInquiries || 0,
      subValue: tx('عبر نموذج الموقع', 'web sitesi formlarından', 'from website forms'),
      icon: MessageSquare,
      color: 'bg-teal-500',
      textColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      link: '/admin/applications?tab=inquiries'
    },
    {
      title: tx('تنبيهات الترجمة', 'Çeviri Uyarıları', 'Translation Alerts'),
      value: metrics?.missingTranslations || 0,
      subValue: tx('حقول بحاجة لترجمة', 'eksik dil alanları', 'missing locale fields'),
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
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">{tx('جديد / تم التقديم', 'Yeni / Gönderildi', 'New / Submitted')}</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">{tx('قيد المراجعة', 'İncelemede', 'Under Review')}</span>;
      case 'DOCUMENTS_PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-100 text-orange-800">{tx('نقص وثائق', 'Belge Eksik', 'Documents Pending')}</span>;
      case 'SUBMITTED_TO_UNIVERSITY':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-purple-100 text-purple-800">{tx('أُرسل للجامعة', 'Üniversiteye Gönderildi', 'Sent to University')}</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">{tx('تم القبول', 'Kabul Edildi', 'Accepted')}</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">{tx('مرفوض', 'Reddedildi', 'Rejected')}</span>;
      case 'ENROLLED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 font-extrabold">{tx('تم التثبيت والتسجيل', 'Kayıt Yapıldı', 'Enrolled')}</span>;
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
            {tx('لوحة تحكم القبولات والجامعات', 'Kabul ve Üniversite Kontrol Paneli', 'Control Center Overview')}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {tx('متابعة حية للطلبات الواردة، خطوط الإرشاد الطلابي، وجاهزية المحتوى الأكاديمي', 'Başvuru süreci, öğrenci talepleri ve üniversite kataloğunun canlı takibi', 'Live monitoring of admissions pipeline, student leads, and university catalog')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/universities"
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-navy-950 text-white rounded-xl text-xs font-bold shadow hover:bg-brand-navy-900 transition"
          >
            <Plus size={16} />
            <span>{tx('إضافة جامعة', 'Üniversite Ekle', 'Add University')}</span>
          </Link>
          <Link
            to="/admin/applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow hover:from-brand-amber-600 hover:to-amber-700 transition"
          >
            <Users size={16} />
            <span>{tx('إدارة الطلبات', 'Başvurular', 'Applications')}</span>
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
            {tx('مراحل مسار القبول الطلابي (Admissions Pipeline)', 'Başvuru Süreci Dağılımı', 'Admissions Pipeline Distribution')}
          </h2>
          <span className="text-xs font-bold text-brand-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
            {metrics?.totalApplications || 0} {tx('طالب مسجل', 'toplam öğrenci', 'Total Students')}
          </span>
        </div>

        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${Math.max(5, ((metrics?.submittedApplications || 0) / (metrics?.totalApplications || 1)) * 100)}%` }}
            className="bg-blue-500 h-full title-tip"
            title={tx('جديد / تم التقديم', 'Yeni / Gönderildi', 'New / Submitted')}
          />
          <div
            style={{ width: `${Math.max(5, ((metrics?.underReviewApplications || 0) / (metrics?.totalApplications || 1)) * 100)}%` }}
            className="bg-amber-500 h-full"
            title={tx('قيد المراجعة', 'İncelemede', 'Under Review')}
          />
          <div
            style={{ width: `${Math.max(5, ((metrics?.acceptedApplications || 0) / (metrics?.totalApplications || 1)) * 100)}%` }}
            className="bg-emerald-500 h-full"
            title={tx('مقبول', 'Kabul', 'Accepted')}
          />
          <div
            style={{ width: `${Math.max(5, ((metrics?.enrolledApplications || 0) / (metrics?.totalApplications || 1)) * 100)}%` }}
            className="bg-purple-600 h-full"
            title={tx('مسجل ومثبت', 'Kayıtlı', 'Enrolled')}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600">{tx('جديد', 'Yeni', 'New')}: {metrics?.submittedApplications || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600">{tx('قيد المراجعة', 'İncelemede', 'Under Review')}: {metrics?.underReviewApplications || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">{tx('مقبول', 'Kabul', 'Accepted')}: {metrics?.acceptedApplications || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-600" />
            <span className="text-slate-600">{tx('مسجل نهائي', 'Kayıtlı', 'Enrolled')}: {metrics?.enrolledApplications || 0}</span>
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
                  {tx('أحدث طلبات القبول الواردة', 'Son Gelen Başvurular', 'Recent Admissions Applications')}
                </h3>
                <span className="text-xs text-slate-400">{tx('آخر التقديمات المسجلة من الطلاب', 'Öğrencilerden gelen son kayıtlar', 'Latest submissions from students')}</span>
              </div>
            </div>
            <Link
              to="/admin/applications"
              className="text-xs font-bold text-brand-amber-600 hover:text-brand-amber-700 flex items-center gap-1"
            >
              <span>{tx('عرض الكل', 'Tümünü Gör', 'View All')}</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="flex-1 overflow-x-auto">
            {metrics?.recentApplications?.length > 0 ? (
              <table className="w-full text-start text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3.5 text-start">{tx('الطالب', 'Öğrenci', 'Student')}</th>
                    <th className="px-4 py-3.5 text-start">{tx('الجامعة والبرنامج', 'Üniversite ve Program', 'University & Program')}</th>
                    <th className="px-4 py-3.5 text-start">{tx('الحالة', 'Durum', 'Status')}</th>
                    <th className="px-4 py-3.5 text-start">{tx('التاريخ', 'Tarih', 'Date')}</th>
                    <th className="px-6 py-3.5 text-end">{tx('إجراء', 'İşlem', 'Action')}</th>
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
                        <div className="font-semibold text-slate-800">{app.universityName || tx('جامعة مختارة', 'Seçilen Üniversite', 'Selected University')}</div>
                        <div className="text-[11px] text-slate-500">{app.programName || app.degreeLevel}</div>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-4 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString(dateLocale)}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <Link
                          to={`/admin/applications?id=${app.id}`}
                          className="px-3 py-1 bg-slate-100 hover:bg-brand-navy-950 hover:text-white rounded-lg font-semibold text-slate-700 transition"
                        >
                          {tx('معاينة', 'Önizle', 'Preview')}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                {tx('لا توجد طلبات تقديم مسجلة حالياً', 'Şu anda kayıtlı başvuru yok', 'No applications yet')}
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
                  {tx('استفسارات الطلاب', 'Web Talepleri', 'Website Leads')}
                </h3>
                <span className="text-xs text-slate-400">
                  {tx('رسائل نموذج التواصل المباشر', 'Doğrudan iletişim formu mesajları', 'Direct contact form messages')}
                </span>
              </div>
            </div>

            <Link
              to="/admin/applications?tab=inquiries"
              className="text-xs font-bold text-brand-amber-600 hover:text-brand-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
            >
              <span>{tx('عرض الكل', 'Tümünü Gör', 'View All')}</span>
              <ArrowUpRight size={14} className="flip-in-rtl" />
            </Link>
          </div>

          <div className="flex-1 p-4 divide-y divide-slate-100 overflow-y-auto max-h-[380px]">
            {metrics?.recentInquiries?.length > 0 ? (
              metrics.recentInquiries.map((inq) => {
                const phoneClean = (inq.phone || '').replace(/[^0-9]/g, '');
                return (
                  <div key={inq.id} className="py-3.5 first:pt-1 last:pb-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{inq.fullName || inq.name}</span>
                        {inq.status === 'NEW' && (
                          <span className="w-2 h-2 rounded-full bg-blue-500" title={tx('جديد', 'Yeni', 'New')} />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(inq.createdAt).toLocaleDateString(dateLocale)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] text-brand-navy-900 font-semibold truncate">
                        {inq.subject || inq.email}
                      </span>

                      {/* Quick Contact Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {phoneClean && (
                          <a
                            href={`https://wa.me/${phoneClean}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition text-[10px]"
                            title="WhatsApp"
                          >
                            <MessageCircle size={13} />
                          </a>
                        )}
                        {inq.phone && (
                          <a
                            href={`tel:${inq.phone}`}
                            className="p-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-[10px]"
                            title="Call"
                          >
                            <Phone size={13} />
                          </a>
                        )}
                        {inq.email && (
                          <a
                            href={`mailto:${inq.email}?subject=${encodeURIComponent(inq.subject || 'Al-Majd Education Inquiry')}`}
                            className="p-1 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition text-[10px]"
                            title="Email"
                          >
                            <Mail size={13} />
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{inq.message}"
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">
                {tx('لا توجد رسائل تواصل جديدة', 'Henüz yeni iletişim mesajı yok', 'No contact inquiries yet')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
