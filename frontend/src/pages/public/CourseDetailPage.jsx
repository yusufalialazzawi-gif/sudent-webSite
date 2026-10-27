import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  Users,
  Calendar,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Video,
  MapPin,
  MessageCircle,
  Award,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import SfBreadcrumb from '../../components/common/SfBreadcrumb';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { settings } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['course', slug, currentLang],
    queryFn: () => api.getCourseBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="sf-container mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-44 bg-[#f7f5f2] rounded-2xl border border-[#dee2e6]"></div>
        <div className="h-96 bg-[#f7f5f2] rounded-2xl border border-[#dee2e6]"></div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-main-color font-cairo">
          {currentLang === 'ar' ? 'لم يتم العثور على الدورة' : currentLang === 'tr' ? 'Kurs bulunamadı' : 'Course not found'}
        </h2>
        <Link to="/courses" className="inline-block px-5 py-2.5 bg-beer text-white rounded-xl text-xs font-bold">
          {currentLang === 'ar' ? 'العودة للدورات' : currentLang === 'tr' ? 'Tüm Kurslara Dön' : 'Back to Courses'}
        </Link>
      </div>
    );
  }

  const course = data.data;

  const translation =
    course.translations?.find((tr) => tr.lang === currentLang) ||
    course.translations?.find((tr) => tr.lang === 'ar') ||
    course.translations?.[0] ||
    {};

  const title = translation.title || course.slug;
  const description = translation.description || '';
  const instructor = translation.instructor || '';

  let curriculum = [];
  try {
    if (translation.curriculum) {
      curriculum = typeof translation.curriculum === 'string' ? JSON.parse(translation.curriculum) : translation.curriculum;
    }
  } catch (e) {
    curriculum = [translation.curriculum];
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.registerCourse(course.id, { fullName, email, phone, notes });
      if (res.success) {
        setSuccessMsg(res.message || (currentLang === 'ar' ? 'تم تسجيل طلبك بنجاح! سيتواصل معك فريقنا قريباً.' : 'Kayıt talebiniz alındı!'));
        setFullName('');
        setEmail('');
        setPhone('');
        setNotes('');
      }
    } catch (err) {
      setErrorMsg(err.message || (currentLang === 'ar' ? 'فشل التسجيل. يرجى المحاولة مرة أخرى.' : 'Kayıt başarısız oldu.'));
    } finally {
      setSubmitting(false);
    }
  };

  const breadcrumbItems = [
    { label: currentLang === 'ar' ? 'الرئيسية' : currentLang === 'tr' ? 'Ana Sayfa' : 'Home', to: '/' },
    { label: currentLang === 'ar' ? 'الدورات' : currentLang === 'tr' ? 'Kurslar' : 'Courses', to: '/courses' },
    { label: title },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16">
      {/* StudyFans Breadcrumb Strip */}
      <SfBreadcrumb items={breadcrumbItems} title={title} />

      <div className="sf-container mx-auto px-4 space-y-10">
        {/* Course Hero Banner */}
        <div className="bg-white rounded-2xl border border-[#dee2e6] overflow-hidden drop-shadow-sm">
          <div className="relative h-64 sm:h-80 bg-slate-900 flex items-end p-6 sm:p-10">
            <img
              src={course.imageUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80'}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

            <div className="relative z-10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-beer text-white shadow-sm flex items-center gap-1.5">
                  {course.studyMode === 'ONLINE' ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  <span>{course.studyMode}</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {course.durationWeeks} {currentLang === 'ar' ? 'أسابيع' : currentLang === 'tr' ? 'Hafta' : 'Weeks'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-beer" />
                  <span>{currentLang === 'ar' ? 'شهادة معتمدة' : currentLang === 'tr' ? 'Onaylı Sertifika' : 'Certified'}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black font-cairo text-white">
                {title}
              </h1>

              {instructor && (
                <p className="text-[#ff9015] text-xs sm:text-sm font-bold">
                  {currentLang === 'ar' ? 'المحاضر:' : currentLang === 'tr' ? 'Eğitmen:' : 'Instructor:'} {instructor}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Grid: Course Info & Registration Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 sm:p-8 drop-shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-main-color font-cairo">
                {currentLang === 'ar' ? 'عن الدورة والأهداف التدريبية' : currentLang === 'tr' ? 'Kurs Hakkında ve Hedefler' : 'About the Course'}
              </h2>
              <p className="text-text-color text-sm leading-relaxed whitespace-pre-line">{description}</p>
            </div>

            {curriculum.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 sm:p-8 drop-shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-main-color font-cairo flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-beer" />
                  <span>{currentLang === 'ar' ? 'الخطة الدراسية والمحاور' : currentLang === 'tr' ? 'Müfredat ve Ders Konuları' : 'Syllabus & Modules'}</span>
                </h2>
                <ul className="space-y-3">
                  {curriculum.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-text-color bg-[#f7f5f2] p-3.5 rounded-xl border border-[#dee2e6]">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Form: Course Registration */}
          <div className="lg:col-span-5" id="register">
            <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 sm:p-7 drop-shadow-sm space-y-5 sticky top-24">
              <div>
                <h3 className="font-bold text-lg text-main-color font-cairo">
                  {currentLang === 'ar' ? 'التسجيل المباشر في الدورة' : currentLang === 'tr' ? 'Kursa Hızlı Kayıt' : 'Direct Course Enrollment'}
                </h3>
                <p className="text-text-color text-xs mt-1">
                  {currentLang === 'ar'
                    ? 'سجل مقعدك الآن وسيتواصل معك منسق الدورة لتأكيد المواعيد والجدول.'
                    : currentLang === 'tr'
                    ? 'Hemen kaydolun, eğitim koordinatörümüz takvimi onaylamak için size ulaşsın.'
                    : 'Register your seat now and our coordinator will confirm your schedule.'}
                </p>
              </div>

              {successMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                  ✓ {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-main-color block mb-1">
                    {currentLang === 'ar' ? 'الاسم الكامل *' : currentLang === 'tr' ? 'Ad Soyad *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={currentLang === 'ar' ? 'اسم الطالب ثلاثي' : 'Adınız ve soyadınız'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dee2e6] text-xs focus:ring-2 focus:ring-beer focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-main-color block mb-1">
                    {currentLang === 'ar' ? 'البريد الإلكتروني *' : currentLang === 'tr' ? 'E-posta *' : 'Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dee2e6] text-xs focus:ring-2 focus:ring-beer focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-main-color block mb-1">
                    {currentLang === 'ar' ? 'رقم الواتساب مع الرمز الدولي *' : currentLang === 'tr' ? 'WhatsApp Numarası (Ülke kodu ile) *' : 'WhatsApp Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+90 531 397 10 22"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dee2e6] text-xs focus:ring-2 focus:ring-beer focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-main-color block mb-1">
                    {currentLang === 'ar' ? 'ملاحظات أو استفسارات' : currentLang === 'tr' ? 'Notlar veya Sorular' : 'Notes / Questions'}
                  </label>
                  <textarea
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={currentLang === 'ar' ? 'أي تفاصيل ترغب بإخبارنا بها...' : 'Sorularınız veya hedefleriniz...'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dee2e6] text-xs focus:ring-2 focus:ring-beer focus:outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-beer hover:bg-[#e07b09] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? '...' : (currentLang === 'ar' ? 'تأكيد التسجيل في الدورة' : currentLang === 'tr' ? 'Kursa Kaydı Tamamla' : 'Confirm Registration')}
                </button>
              </form>

              <div className="pt-2 border-t border-[#dee2e6] text-center">
                <a
                  href={`https://wa.me/${settings.whatsapp_number || settings.contact_whatsapp || '905313971022'}?text=${encodeURIComponent(
                    `مرحباً، أود استفسار حول دورة: ${title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? 'استفسر مباشرة عبر واتساب' : currentLang === 'tr' ? 'WhatsApp ile Danış' : 'Inquire on WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
