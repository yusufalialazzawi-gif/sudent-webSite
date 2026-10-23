import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import WhatsAppFloating from './components/common/WhatsAppFloating';

// Public Pages
import HomePage from './pages/public/HomePage';
const UniversitiesPage = lazy(() => import('./pages/public/UniversitiesPage'));
const UniversityDetailPage = lazy(() => import('./pages/public/UniversityDetailPage'));
const ProgramsPage = lazy(() => import('./pages/public/ProgramsPage'));
const ProgramDetailPage = lazy(() => import('./pages/public/ProgramDetailPage'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/public/ServiceDetailPage'));
const CoursesPage = lazy(() => import('./pages/public/CoursesPage'));
const CourseDetailPage = lazy(() => import('./pages/public/CourseDetailPage'));
const ScholarshipsPage = lazy(() => import('./pages/public/ScholarshipsPage'));
const ScholarshipDetailPage = lazy(() => import('./pages/public/ScholarshipDetailPage'));
const BlogPage = lazy(() => import('./pages/public/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/public/BlogDetailPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const ApplyPage = lazy(() => import('./pages/public/ApplyPage'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminApplicationsPage = lazy(() => import('./pages/admin/AdminApplicationsPage'));
const AdminUniversitiesPage = lazy(() => import('./pages/admin/AdminUniversitiesPage'));
const AdminReviewsPage = lazy(() => import('./pages/admin/AdminReviewsPage'));
const AdminProgramsPage = lazy(() => import('./pages/admin/AdminProgramsPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminCoursesPage = lazy(() => import('./pages/admin/AdminCoursesPage'));
const AdminScholarshipsPage = lazy(() => import('./pages/admin/AdminScholarshipsPage'));
const AdminPageBuilderPage = lazy(() => import('./pages/admin/AdminPageBuilderPage'));
const AdminMediaLibraryPage = lazy(() => import('./pages/admin/AdminMediaLibraryPage'));
const AdminTranslationsPage = lazy(() => import('./pages/admin/AdminTranslationsPage'));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));
const AdminStaffPage = lazy(() => import('./pages/admin/AdminStaffPage'));

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

function RouteFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading">
      <div className="w-10 h-10 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
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
          <Route path="reviews" element={<AdminReviewsPage />} />
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
    </Suspense>
  );
}
