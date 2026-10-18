import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppFloating from './components/common/WhatsAppFloating';

// Public Pages
import HomePage from './pages/public/HomePage';
import UniversitiesPage from './pages/public/UniversitiesPage';
import UniversityDetailPage from './pages/public/UniversityDetailPage';
import ProgramsPage from './pages/public/ProgramsPage';
import ProgramDetailPage from './pages/public/ProgramDetailPage';
import ServicesPage from './pages/public/ServicesPage';
import ServiceDetailPage from './pages/public/ServiceDetailPage';
import CoursesPage from './pages/public/CoursesPage';
import CourseDetailPage from './pages/public/CourseDetailPage';
import ScholarshipsPage from './pages/public/ScholarshipsPage';
import ScholarshipDetailPage from './pages/public/ScholarshipDetailPage';
import BlogPage from './pages/public/BlogPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import ApplyPage from './pages/public/ApplyPage';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminApplicationsPage from './pages/admin/AdminApplicationsPage';
import AdminUniversitiesPage from './pages/admin/AdminUniversitiesPage';
import AdminProgramsPage from './pages/admin/AdminProgramsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AdminScholarshipsPage from './pages/admin/AdminScholarshipsPage';
import AdminPageBuilderPage from './pages/admin/AdminPageBuilderPage';
import AdminMediaLibraryPage from './pages/admin/AdminMediaLibraryPage';
import AdminTranslationsPage from './pages/admin/AdminTranslationsPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminStaffPage from './pages/admin/AdminStaffPage';

// Protected Route Guard
function ProtectedAdminRoute() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-400">جاري التحقق من صلاحيات الدخول...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

// Public Layout Wrapper
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-amber-500 selection:text-white">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloating />
    </div>
  );
}

// 404 Not Found Page
function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <div className="text-8xl font-black text-brand-navy-950">404</div>
        <h2 className="text-2xl font-bold text-slate-800">الصفحة غير موجودة</h2>
        <p className="text-sm text-slate-500">
          الصفحة التي تبحث عنها قد تم نقلها أو لم تعد متاحة. يمكنك العودة إلى الصفحة الرئيسية لتصفح الجامعات والتخصصات.
        </p>
        <div className="pt-2">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold rounded-xl shadow-lg transition"
          >
            العودة للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/universities" element={<UniversitiesPage />} />
        <Route path="/universities/:slug" element={<UniversityDetailPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:id" element={<ProgramDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/scholarships" element={<ScholarshipsPage />} />
        <Route path="/scholarships/:slug" element={<ScholarshipDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Portal */}
      <Route element={<ProtectedAdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="applications" element={<AdminApplicationsPage />} />
          <Route path="universities" element={<AdminUniversitiesPage />} />
          <Route path="programs" element={<AdminProgramsPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="courses" element={<AdminCoursesPage />} />
          <Route path="scholarships" element={<AdminScholarshipsPage />} />
          <Route path="cms" element={<AdminPageBuilderPage />} />
          <Route path="media" element={<AdminMediaLibraryPage />} />
          <Route path="translations" element={<AdminTranslationsPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="staff" element={<AdminStaffPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
