import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Briefcase,
  Layers,
  Award,
  FileText,
  Image as ImageIcon,
  Languages,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Globe,
  Bell,
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminLayout() {
  const { user, logout, isSuperAdmin, isAdmissionsStaff, isContentEditor } = useAuth();
  const { currentLanguage, changeLanguage, isRtl } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navSections = [
    {
      title: currentLanguage === 'ar' ? 'نظرة عامة' : currentLanguage === 'tr' ? 'Genel Bakış' : 'Overview',
      items: [
        { path: '/admin', label: currentLanguage === 'ar' ? 'لوحة التحكم' : currentLanguage === 'tr' ? 'Kontrol Paneli' : 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/applications', label: currentLanguage === 'ar' ? 'الطلبات والاستفسارات' : currentLanguage === 'tr' ? 'Başvurular & Talepler' : 'Applications & Leads', icon: Users, badgeKey: 'apps' },
      ]
    },
    {
      title: currentLanguage === 'ar' ? 'الجامعات والبرامج' : currentLanguage === 'tr' ? 'Üniversiteler & Programlar' : 'Academics',
      items: [
        { path: '/admin/universities', label: currentLanguage === 'ar' ? 'الجامعات التركية' : currentLanguage === 'tr' ? 'Türk Üniversiteleri' : 'Universities', icon: GraduationCap },
        { path: '/admin/programs', label: currentLanguage === 'ar' ? 'البرامج والتخصصات' : currentLanguage === 'tr' ? 'Programlar & Bölümler' : 'Programs & Majors', icon: BookOpen },
        { path: '/admin/courses', label: currentLanguage === 'ar' ? 'الدورات والاختبارات' : currentLanguage === 'tr' ? 'Kurslar & Sınavlar' : 'Courses & Exams', icon: Layers },
        { path: '/admin/scholarships', label: currentLanguage === 'ar' ? 'المنح والخصومات' : currentLanguage === 'tr' ? 'Burslar & İndirimler' : 'Scholarships', icon: Award },
      ]
    },
    {
      title: currentLanguage === 'ar' ? 'المحتوى والتسويق' : currentLanguage === 'tr' ? 'İçerik & Pazarlama' : 'Content & CMS',
      items: [
        { path: '/admin/services', label: currentLanguage === 'ar' ? 'الخدمات الطلابية' : currentLanguage === 'tr' ? 'Öğrenci Hizmetleri' : 'Student Services', icon: Briefcase },
        { path: '/admin/blog', label: currentLanguage === 'ar' ? 'المقالات والأدلة' : currentLanguage === 'tr' ? 'Makaleler & Rehberler' : 'Articles & Guides', icon: FileText },
        { path: '/admin/cms', label: currentLanguage === 'ar' ? 'منشئ الصفحات (CMS)' : currentLanguage === 'tr' ? 'Sayfa Düzenleyici (CMS)' : 'Page Builder (CMS)', icon: Layers },
        { path: '/admin/media', label: currentLanguage === 'ar' ? 'مكتبة الوسائط' : currentLanguage === 'tr' ? 'Medya Kitaplığı' : 'Media Assets', icon: ImageIcon },
        { path: '/admin/translations', label: currentLanguage === 'ar' ? 'مصفوفة الترجمة' : currentLanguage === 'tr' ? 'Çeviri Matrisi' : 'Translations Matrix', icon: Languages },
      ]
    },
    {
      title: currentLanguage === 'ar' ? 'النظام والأمان' : currentLanguage === 'tr' ? 'Sistem & Güvenlik' : 'System & Security',
      items: [
        { path: '/admin/settings', label: currentLanguage === 'ar' ? 'إعدادات المنصة' : currentLanguage === 'tr' ? 'Platform Ayarları' : 'Site Settings', icon: Settings },
        { path: '/admin/staff', label: currentLanguage === 'ar' ? 'فريق العمل وسجلات الأمان' : currentLanguage === 'tr' ? 'Personel & Güvenlik Günlüğü' : 'Staff & Audit Logs', icon: Shield },
      ]
    }
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">Super Admin</span>;
      case 'ADMIN':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">Admin</span>;
      case 'ADMISSIONS_OFFICER':
      case 'ADMISSIONS_STAFF':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">Admissions</span>;
      case 'CONTENT_EDITOR':
        return <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">Editor</span>;
      default:
        return <span className="text-xs px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-300">{role}</span>;
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans ${isRtl ? 'rtl' : 'ltr'}`}>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-brand-navy-950 text-white p-4 flex items-center justify-between shadow-md z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div className="flex items-center gap-2">
            <img
              src="/logo.jpg"
              alt="المجد للقبولات الجامعية"
              className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 shadow border border-brand-amber-500/40"
            />
            <span className="font-bold text-sm text-white tracking-wide font-cairo">
              {currentLanguage === 'ar' ? 'المجد للقبولات' : 'Al-Majd Admin'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
            title="View Public Site"
          >
            <ExternalLink size={18} />
          </Link>
          <button
            onClick={logout}
            className="p-1.5 text-red-300 hover:text-red-200 rounded-lg hover:bg-red-500/20"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-brand-navy-950 text-slate-200 z-40 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:translate-x-0 ${
          mobileMenuOpen
            ? 'translate-x-0'
            : isRtl
            ? 'translate-x-full md:translate-x-0'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-brand-navy-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="المجد للقبولات الجامعية"
              className="w-10 h-10 rounded-xl object-contain bg-white p-0.5 shadow-md border border-brand-amber-500/40"
            />
            <div>
              <div className="font-extrabold text-base text-white leading-tight tracking-wide font-cairo">
                {currentLanguage === 'ar' ? 'المجد للقبولات' : 'Al-Majd Portal'}
              </div>
              <div className="text-[11px] text-amber-400 font-medium">Control Portal 2026</div>
            </div>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-brand-navy-800/60 bg-brand-navy-900/40">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-white text-sm truncate max-w-[150px]">{user?.name || 'Administrator'}</div>
            {getRoleBadge(user?.role)}
          </div>
          <div className="text-xs text-slate-400 truncate">{user?.email}</div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scrollbar-thin">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                {section.title}
              </div>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-amber-500 to-amber-600 text-white shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-brand-navy-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <ChevronRight size={14} className={isRtl ? 'rotate-180' : ''} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-navy-800/80 bg-brand-navy-900/70 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 hover:text-white transition"
          >
            <ExternalLink size={14} />
            <span>{currentLanguage === 'ar' ? 'عرض الموقع العام' : currentLanguage === 'tr' ? 'Siteyi Görüntüle' : 'View Public Site'}</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold text-red-300 bg-red-500/10 hover:bg-red-500/20 hover:text-red-200 transition"
          >
            <LogOut size={14} />
            <span>{currentLanguage === 'ar' ? 'تسجيل الخروج' : currentLanguage === 'tr' ? 'Çıkış Yap' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <div className="text-slate-400 text-xs">
              <span className="font-semibold text-slate-700 font-cairo">المجد للقبولات الجامعية</span> / {location.pathname.replace('/admin', '') || 'Dashboard'}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => changeLanguage('ar')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                  currentLanguage === 'ar' ? 'bg-white text-brand-navy-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                عربي
              </button>
              <button
                onClick={() => changeLanguage('tr')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                  currentLanguage === 'tr' ? 'bg-white text-brand-navy-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Türkçe
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition ${
                  currentLanguage === 'en' ? 'bg-white text-brand-navy-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
            </div>

            {/* Quick public link */}
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-brand-navy-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition"
            >
              <ExternalLink size={14} />
              <span>{currentLanguage === 'ar' ? 'الموقع' : 'Site'}</span>
            </Link>

            {/* Profile snippet */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-brand-navy-900 text-white font-bold flex items-center justify-center text-xs">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden lg:block text-start">
                <div className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</div>
                <div className="text-[10px] text-slate-500">{user?.role}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </div>
  );
}
