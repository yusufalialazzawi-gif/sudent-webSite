import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Shield,
  UserPlus,
  Lock,
  Mail,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  X,
  Search
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminStaffPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState('staff'); // 'staff' or 'logs'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);

  const initialForm = {
    email: '',
    fullName: '',
    role: 'ADMISSIONS_OFFICER',
    password: '',
    isActive: true,
  };

  const [form, setForm] = useState(initialForm);

  const { data: staffList = [], isLoading: isStaffLoading } = useQuery({
    queryKey: ['adminStaff'],
    queryFn: async () => {
      const res = await api.getStaff();
      return res.data || [];
    },
  });

  const { data: auditData, isLoading: isLogsLoading } = useQuery({
    queryKey: ['adminAuditLogs'],
    queryFn: async () => {
      const res = await api.getAuditLogs(1);
      return res.data || [];
    },
    enabled: activeTab === 'logs',
  });

  const auditLogs = auditData || [];

  const createMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingStaffId) {
        return await api.updateStaff(editingStaffId, payload);
      } else {
        return await api.createStaff(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminStaff']);
      closeModal();
    },
    onError: (err) => {
      alert(err.message || 'Error saving staff member');
    }
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }) => {
      return await api.updateStaff(id, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminStaff']);
    }
  });

  const openCreateModal = () => {
    setEditingStaffId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingStaffId(member.id);
    setForm({
      email: member.email,
      fullName: member.fullName,
      role: member.role,
      password: '',
      isActive: member.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaffId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(form);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Super Admin</span>;
      case 'ADMIN':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Admin</span>;
      case 'ADMISSIONS_OFFICER':
      case 'ADMISSIONS_STAFF':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Admissions Officer</span>;
      case 'CONTENT_EDITOR':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Content Editor</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">{role}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'فريق العمل وسجلات الأمان' : 'Staff Accounts & Security Logs'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'إدارة صلاحيات مستشاري القبول ومحرري المحتوى، ومراقبة تدقيق العمليات' : 'Role-based access control (RBAC), team accounts, and immutable system audit logs'}
          </p>
        </div>

        {activeTab === 'staff' && (
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-brand-amber-600 hover:to-amber-700 transition"
          >
            <UserPlus size={16} />
            <span>{currentLanguage === 'ar' ? 'إضافة موظف جديد' : 'New Staff Account'}</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-fit">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'staff' ? 'bg-brand-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield size={15} />
          <span>حسابات الفريق والصلاحيات</span>
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeTab === 'logs' ? 'bg-brand-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity size={15} />
          <span>سجل تدقيق الأمان (Audit Trail)</span>
        </button>
      </div>

      {/* Staff Tab Content */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isStaffLoading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>جاري تحميل بيانات الفريق...</span>
            </div>
          ) : staffList.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-start">الموظف</th>
                    <th className="px-4 py-4 text-start">الدور الوظيفي</th>
                    <th className="px-4 py-4 text-start">الطلبات المسندة</th>
                    <th className="px-4 py-4 text-start">الحالة</th>
                    <th className="px-4 py-4 text-start">تاريخ الانضمام</th>
                    <th className="px-6 py-4 text-end">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {staffList.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 text-sm">{m.fullName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{m.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        {getRoleBadge(m.role)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-slate-700">
                          {m._count?.assignedApplications || 0} طلب
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleActiveMutation.mutate({ id: m.id, isActive: !m.isActive })}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition flex items-center gap-1 w-fit ${
                            m.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {m.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                          <span>{m.isActive ? 'نشط' : 'معطل'}</span>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-slate-400">
                        {new Date(m.createdAt).toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
                      </td>
                      <td className="px-6 py-4 text-end">
                        <button
                          onClick={() => openEditModal(m)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-brand-navy-950 hover:text-white rounded-lg font-bold text-slate-700 transition"
                        >
                          تعديل الصلاحيات
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              لا توجد حسابات مسجلة
            </div>
          )}
        </div>
      )}

      {/* Logs Tab Content */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {isLogsLoading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <span>جاري تحميل سجل التدقيق الأمني...</span>
            </div>
          ) : auditLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 text-start">العملية والكيان</th>
                    <th className="px-4 py-4 text-start">المستخدم المنفذ</th>
                    <th className="px-4 py-4 text-start">تفاصيل الإجراء</th>
                    <th className="px-4 py-4 text-start">عنوان IP</th>
                    <th className="px-6 py-4 text-end">التوقيت</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition font-mono">
                      <td className="px-6 py-3.5">
                        <span className="font-bold text-brand-navy-950 bg-slate-100 px-2 py-0.5 rounded">
                          {log.action}
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">{log.entity}</div>
                      </td>
                      <td className="px-4 py-3.5 font-sans">
                        <div className="font-bold text-slate-800">{log.user?.fullName || 'System'}</div>
                        <div className="text-[10px] text-slate-400">{log.user?.email}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-sans max-w-xs truncate">
                        {log.details || '—'}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="px-6 py-3.5 text-end text-slate-400 text-[11px] whitespace-nowrap font-sans">
                        {new Date(log.createdAt).toLocaleString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-sm">
              لا توجد سجلات أمان مسجلة بعد
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingStaffId ? 'تعديل بيانات الحساب' : 'إنشاء حساب موظف جديد'}
              </h3>
              <button onClick={closeModal} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">الاسم الكامل*</label>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني*</label>
                <input
                  type="email"
                  required
                  disabled={Boolean(editingStaffId)}
                  placeholder="advisor@soraedu-tr.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الصلاحية والدور (RBAC Role)*</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                >
                  <option value="ADMISSIONS_OFFICER">مستشار قبولات (Admissions Officer)</option>
                  <option value="CONTENT_EDITOR">محرر محتوى ومدونة (Content Editor)</option>
                  <option value="ADMIN">مدير نظام (Admin)</option>
                  <option value="SUPER_ADMIN">مدير عام بكامل الصلاحيات (Super Admin)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {editingStaffId ? 'تغيير كلمة المرور (اتركه فارغاً للإبقاء على الحالية)' : 'كلمة المرور الأولية*'}
                </label>
                <input
                  type="password"
                  required={!editingStaffId}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
                >
                  {createMutation.isPending ? 'جاري الحفظ...' : 'حفظ الحساب'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
