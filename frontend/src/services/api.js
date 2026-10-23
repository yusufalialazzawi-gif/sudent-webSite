const API_BASE = '/api';

export const getAuthToken = () => {
  return localStorage.getItem('sora_admin_token') || '';
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('sora_admin_token', token);
  } else {
    localStorage.removeItem('sora_admin_token');
  }
};

export async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    ...(!options.isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = {
    method: options.method || 'GET',
    headers,
    ...options,
  };

  if (options.body && !options.isFormData && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  if (response.status === 401 && !endpoint.includes('/auth/login')) {
    setAuthToken(null);
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
  }

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data?.message || response.statusText || 'Network request failed';
    throw new Error(errorMsg);
  }

  return data;
}

// API methods
export const api = {
  // Public
  getPublicSettings: () => request('/settings/public'),
  getPlatformStats: () => request('/public/platform-stats'),
  getSearchOptions: () => request('/public/search-options'),
  getTestimonials: () => request('/public/testimonials'),
  getFaqs: (category, lang) => request(`/public/faqs?${new URLSearchParams({ ...(category && { category }), lang }).toString()}`),
  submitContactInquiry: (data) => request('/public/contact', { method: 'POST', body: data }),
  submitApplication: (formData) => request('/applications/public-submit', { method: 'POST', body: formData, isFormData: true }),
  
  // Universities
  getUniversities: (params = {}) => request(`/universities?${new URLSearchParams(params).toString()}`),
  getUniversityBySlug: (slug, lang) => request(`/universities/${slug}?lang=${lang || 'ar'}`),
  getAdmissionAnnouncements: (params = {}) => request(`/universities/announcements?${new URLSearchParams(params).toString()}`),
  updateAdmissionStatus: (id, data) => request(`/universities/admin/${id}/admission-status`, { method: 'PATCH', body: data }),
  
  // Programs
  getCategories: () => request('/programs/categories'),
  getPrograms: (params = {}) => request(`/programs?${new URLSearchParams(params).toString()}`),
  getProgramById: (id) => request(`/programs/${id}`),

  // Services
  getServices: (lang = 'ar') => request(`/services?lang=${lang}`),
  getServiceBySlug: (slug) => request(`/services/${slug}`),

  // Courses
  getCourses: (params = {}) => request(`/courses?${new URLSearchParams(params).toString()}`),
  getCourseBySlug: (slug) => request(`/courses/${slug}`),
  registerCourse: (courseId, data) => request(`/courses/${courseId}/register`, { method: 'POST', body: data }),

  // Scholarships
  getScholarships: (params = {}) => request(`/scholarships?${new URLSearchParams(params).toString()}`),
  getScholarshipBySlug: (slug) => request(`/scholarships/${slug}`),

  // Blog / Articles
  getArticles: (params = {}) => request(`/articles?${new URLSearchParams(params).toString()}`),
  getArticleBySlug: (slug, lang = 'ar') => request(`/articles/${slug}?lang=${lang}`),

  // Page Builder
  getPageSections: (pageName) => request(`/page-builder/sections/${pageName}`),

  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  getMe: () => request('/auth/me'),
  changePassword: (data) => request('/auth/change-password', { method: 'POST', body: data }),

  // Admin Dashboard
  getDashboardMetrics: () => request('/admin/dashboard/metrics'),

  // Admin Universities
  getAdminUniversities: () => request('/universities/admin/all'),
  getImportRegistry: () => request('/universities/admin/import-registry'),
  importUniversitiesBatch: (data) => request('/universities/admin/import-batch', { method: 'POST', body: data }),
  uploadUniversityVideo: (formData) => request('/universities/admin/upload-video', { method: 'POST', body: formData, isFormData: true }),
  createUniversity: (data) => request('/universities/admin', { method: 'POST', body: data }),
  updateUniversity: (id, data) => request(`/universities/admin/${id}`, { method: 'PUT', body: data }),
  deleteUniversity: (id) => request(`/universities/admin/${id}`, { method: 'DELETE' }),

  // Student Reviews & Testimonials
  getUniversityReviews: (slug) => request(`/reviews/university/${slug}`),
  submitUniversityReview: (slug, data) => request(`/reviews/university/${slug}`, { method: 'POST', body: data }),
  getAdminReviews: (params = {}) => request(`/reviews/admin/all?${new URLSearchParams(params).toString()}`),
  createAdminReview: (data) => request('/reviews/admin', { method: 'POST', body: data }),
  moderateReview: (id, data) => request(`/reviews/admin/${id}`, { method: 'PATCH', body: data }),
  deleteReview: (id) => request(`/reviews/admin/${id}`, { method: 'DELETE' }),

  // Admin Student Testimonials (with Photos & Multi-language Quotes)
  getAdminTestimonials: () => request('/reviews/testimonials/admin'),
  createAdminTestimonial: (data) => request('/reviews/testimonials/admin', { method: 'POST', body: data }),
  updateAdminTestimonial: (id, data) => request(`/reviews/testimonials/admin/${id}`, { method: 'PUT', body: data }),
  deleteAdminTestimonial: (id) => request(`/reviews/testimonials/admin/${id}`, { method: 'DELETE' }),

  // Admin Programs
  getAdminPrograms: () => request('/programs/admin/all'),
  createProgram: (data) => request('/programs/admin', { method: 'POST', body: data }),
  updateProgram: (id, data) => request(`/programs/admin/${id}`, { method: 'PUT', body: data }),
  deleteProgram: (id) => request(`/programs/admin/${id}`, { method: 'DELETE' }),

  // Admin Applications
  getAdminApplications: (params = {}) => request(`/applications/admin?${new URLSearchParams(params).toString()}`),
  getAdminApplicationDetail: (id) => request(`/applications/admin/${id}`),
  updateApplicationStatus: (id, data) => request(`/applications/admin/${id}/status`, { method: 'PATCH', body: data }),
  assignApplication: (id, staffId) => request(`/applications/admin/${id}/assign`, { method: 'PATCH', body: { staffId } }),
  addApplicationNote: (id, noteText) => request(`/applications/admin/${id}/notes`, { method: 'POST', body: { noteText } }),
  downloadDocumentUrl: (docId) => `/api/applications/admin/documents/${docId}/download`,

  // Contact Inquiries (Website Leads)
  getAdminInquiries: () => request('/public/inquiries/admin'),
  updateInquiryStatus: (id, status) => request(`/public/inquiries/admin/${id}/status`, { method: 'PATCH', body: { status } }),
  deleteInquiry: (id) => request(`/public/inquiries/admin/${id}`, { method: 'DELETE' }),

  // Admin Services
  getAdminServices: () => request('/services/admin/all'),
  createService: (data) => request('/services/admin', { method: 'POST', body: data }),
  updateService: (id, data) => request(`/services/admin/${id}`, { method: 'PUT', body: data }),
  deleteService: (id) => request(`/services/admin/${id}`, { method: 'DELETE' }),

  // Admin Courses
  getAdminCourses: () => request('/courses/admin/all'),
  createCourse: (data) => request('/courses/admin', { method: 'POST', body: data }),
  updateCourse: (id, data) => request(`/courses/admin/${id}`, { method: 'PUT', body: data }),
  deleteCourse: (id) => request(`/courses/admin/${id}`, { method: 'DELETE' }),

  // Admin Scholarships
  getAdminScholarships: () => request('/scholarships/admin/all'),
  createScholarship: (data) => request('/scholarships/admin', { method: 'POST', body: data }),
  updateScholarship: (id, data) => request(`/scholarships/admin/${id}`, { method: 'PUT', body: data }),
  deleteScholarship: (id) => request(`/scholarships/admin/${id}`, { method: 'DELETE' }),

  // Admin Blog
  getAdminArticles: () => request('/articles/admin/all'),
  createArticle: (data) => request('/articles/admin', { method: 'POST', body: data }),
  updateArticle: (id, data) => request(`/articles/admin/${id}`, { method: 'PUT', body: data }),
  deleteArticle: (id) => request(`/articles/admin/${id}`, { method: 'DELETE' }),

  // Admin Media
  getMediaAssets: (params = {}) => request(`/media?${new URLSearchParams(params).toString()}`),
  uploadMedia: (formData) => request('/media/upload', { method: 'POST', body: formData, isFormData: true }),
  updateMedia: (id, data) => request(`/media/${id}`, { method: 'PUT', body: data }),
  deleteMedia: (id) => request(`/media/${id}`, { method: 'DELETE' }),

  // Admin Page Builder
  getAdminPageSections: (pageName) => request(`/page-builder/admin/sections/${pageName}`),
  createPageSection: (data) => request('/page-builder/admin/sections', { method: 'POST', body: data }),
  reorderPageSections: (orderedSectionIds) => request('/page-builder/admin/sections/reorder', { method: 'PUT', body: { orderedSectionIds } }),
  updatePageSection: (id, data) => request(`/page-builder/admin/sections/${id}`, { method: 'PUT', body: data }),
  deletePageSection: (id) => request(`/page-builder/admin/sections/${id}`, { method: 'DELETE' }),

  // Admin Translations
  getTranslationMatrix: (modelType) => request(`/translations/matrix?modelType=${modelType || 'universities'}`),

  // Admin Settings
  getAdminSettings: () => request('/settings/admin'),
  getSettingsSchema: () => request('/settings/schema'),
  updateAdminSettings: (settings) => request('/settings/admin', { method: 'PUT', body: { settings } }),

  // Admin Staff & Audit
  getStaff: () => request('/staff'),
  createStaff: (data) => request('/staff', { method: 'POST', body: data }),
  updateStaff: (id, data) => request(`/staff/${id}`, { method: 'PUT', body: data }),
  getAuditLogs: (page = 1) => request(`/staff/audit-logs?page=${page}`),
};
