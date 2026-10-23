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
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

export default function CourseDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

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
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-cairo">لم يتم العثور على الدورة</h2>
        <Link to="/courses" className="inline-block px-5 py-2.5 bg-brand-amber-500 text-white rounded-xl text-xs font-bold">
          العودة للدورات
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
        setSuccessMsg(res.message);
        setFullName('');
        setEmail('');
        setPhone('');
        setNotes('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'فشل التسجيل. يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden h-72 bg-brand-navy-950 text-white shadow-xl flex items-end p-8 sm:p-10 border border-brand-amber-500/30">
        <img
          src={course.imageUrl || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80'}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/70 to-transparent"></div>

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-amber-500 text-white">
              {course.studyMode}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
              {course.durationWeeks} أسابيع
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-cairo text-white">
            {title}
          </h1>
          {instructor && <p className="text-brand-amber-400 text-xs sm:text-sm font-semibold">المحاضر: {instructor}</p>}
        </div>
      </div>

      {/* Grid: Course Info & Registration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-brand-navy-950 font-cairo">
              عن الدورة والأهداف التدريبية
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
          </div>

          {curriculum.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-brand-navy-950 font-cairo flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-amber-500" />
                <span>الخطة الدراسية والمحاور</span>
              </h2>
              <ul className="space-y-3">
                {curriculum.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Form: Course Registration */}
        <div className="lg:col-span-5" id="register">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-lg space-y-5 sticky top-24">
            <div>
              <h3 className="font-bold text-lg text-brand-navy-950 font-cairo">
                التسجيل المباشر في الدورة
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                سجل مقعدك الآن وسيتواصل معك منسق الدورة لتأكيد الجدول.
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
                <label className="text-xs font-bold text-slate-700 block mb-1">الاسم الكامل *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="اسم الطالب ثلاثي"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">رقم الواتساب مع الرمز الدولي *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+964 770 123 4567"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ملاحظات أو استفسارات</label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تفاصيل ترغب بإخبارنا بها..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submitting ? 'جاري التسجيل...' : 'تأكيد التسجيل في الدورة'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
