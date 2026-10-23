import React, { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

export default function UniversityReviewsSection({
  universitySlug,
  universityName,
  initialReviews = [],
}) {
  const { currentLang } = useLanguage();
  const [reviews, setReviews] = useState(initialReviews);
  const [formData, setFormData] = useState({
    studentName: '',
    studentCountry: '',
    programStudied: '',
    rating: 5,
    comment: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
      : 5.0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.studentName.trim() || !formData.comment.trim()) {
      setErrorMessage(
        currentLang === 'ar'
          ? 'يرجى كتابة اسمك والتعليق كاملاً.'
          : currentLang === 'tr'
          ? 'Lütfen adınızı ve yorumunuzu eksiksiz doldurun.'
          : 'Please provide both your name and review comment.'
      );
      return;
    }

    if (formData.comment.trim().length < 15) {
      setErrorMessage(
        currentLang === 'ar'
          ? 'يرجى كتابة تقييم تفصيلي لا يقل عن 15 حرفاً.'
          : currentLang === 'tr'
          ? 'Lütfen en az 15 karakterden oluşan detaylı bir değerlendirme yazın.'
          : 'Please provide a detailed review of at least 15 characters.'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitUniversityReview(universitySlug, formData);
      if (res.success && res.data) {
        setReviews([res.data, ...reviews]);
        setSubmitSuccess(true);
        setFormData({
          studentName: '',
          studentCountry: '',
          programStudied: '',
          rating: 5,
          comment: '',
        });
      } else {
        setErrorMessage(res.message || 'Submission failed');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-brand-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
            {currentLang === 'ar' ? 'تجارب الطلاب والخريجين' : currentLang === 'tr' ? 'Öğrenci Yorumları ve Deneyimleri' : 'Student Reviews & Testimonials'}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-brand-navy-950 font-cairo flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-brand-amber-500" />
            <span>
              {currentLang === 'ar'
                ? `آراء وتقييمات طلاب ${universityName}`
                : currentLang === 'tr'
                ? `${universityName} Öğrenci Yorumları`
                : `${universityName} Student Reviews`}
            </span>
          </h2>
        </div>

        {/* Rating Score Summary */}
        <div className="flex items-center gap-3 bg-amber-50/80 border border-amber-200/80 px-4 py-2.5 rounded-2xl shrink-0">
          <div className="text-2xl font-black text-amber-700 font-cairo">{avgRating}</div>
          <div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(avgRating)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">
              {totalReviews}{' '}
              {currentLang === 'ar' ? 'تقييم موثق' : currentLang === 'tr' ? 'değerlendirme' : 'verified reviews'}
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-700 text-sm font-cairo">
              {currentLang === 'ar' ? 'لا توجد تقييمات منشورة حتى الآن' : currentLang === 'tr' ? 'Henüz öğrenci yorumu bulunmuyor' : 'No student reviews published yet'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              {currentLang === 'ar'
                ? 'كن أول من يشارك تجربته الدراسية أو استفساراته حول هذه الجامعة لمساعدة زملائك الطلاب الدوليين.'
                : currentLang === 'tr'
                ? 'Uluslararası öğrencilere yol göstermek için bu üniversitedeki deneyiminizi ilk paylaşan siz olun.'
                : 'Be the first to share your academic experience at this university to guide future students.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:bg-slate-50 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-sm text-brand-navy-950 font-cairo flex items-center gap-1.5">
                      <span>{rev.studentName}</span>
                      {rev.isVerified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>
                            {currentLang === 'ar' ? 'طالب موثق' : currentLang === 'tr' ? 'Doğrulanmış Öğrenci' : 'Verified Student'}
                          </span>
                        </span>
                      )}
                    </div>
                    {(rev.programStudied || rev.studentCountry) && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {rev.programStudied} {rev.studentCountry ? `• ${rev.studentCountry}` : ''}
                      </div>
                    )}
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5 shrink-0 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-xs">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  "{rev.comment}"
                </p>

                <div className="text-[10px] text-slate-400 font-mono">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Submission Form */}
      <div className="pt-6 border-t border-slate-100">
        <h3 className="text-base font-bold text-brand-navy-950 font-cairo mb-3 flex items-center gap-2">
          <Send className="w-4 h-4 text-brand-amber-500" />
          <span>{currentLang === 'ar' ? 'أضف تجربتك أو تقييمك' : currentLang === 'tr' ? 'Deneyiminizi veya Yorumunuzu Ekleyin' : 'Write a Student Review'}</span>
        </h3>

        {submitSuccess ? (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {currentLang === 'ar'
                ? 'شكراً لك! تم استلام تقييمك بنجاح ونشره لدعم زملائك الطلاب.'
                : currentLang === 'tr'
                ? 'Teşekkürler! Değerlendirmeniz başarıyla kaydedildi ve yayınlandı.'
                : 'Thank you! Your review has been submitted and published successfully.'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'الاسم الكامل *' : currentLang === 'tr' ? 'Adınız Soyadınız *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={currentLang === 'ar' ? 'مثال: أحمد مصطفى' : currentLang === 'tr' ? 'Örnek: Ahmet Yılmaz' : 'e.g. John Doe'}
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'الجنسية / البلد' : currentLang === 'tr' ? 'Uyruk / Ülke' : 'Country'}
                </label>
                <input
                  type="text"
                  placeholder={currentLang === 'ar' ? 'مثال: العراق / مصر / الأردن' : currentLang === 'tr' ? 'Örnek: Suriye / Irak' : 'e.g. Egypt / Jordan'}
                  value={formData.studentCountry}
                  onChange={(e) => setFormData({ ...formData, studentCountry: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {currentLang === 'ar' ? 'التخصص أو الكلية' : currentLang === 'tr' ? 'Bölümünüz' : 'Program Studied'}
                </label>
                <input
                  type="text"
                  placeholder={currentLang === 'ar' ? 'مثال: هندسة البرمجيات' : currentLang === 'tr' ? 'Örnek: Yazılım Mühendisliği' : 'e.g. Software Engineering'}
                  value={formData.programStudied}
                  onChange={(e) => setFormData({ ...formData, programStudied: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-amber-500"
                />
              </div>
            </div>

            {/* Rating Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {currentLang === 'ar' ? 'التقييم العام *' : currentLang === 'tr' ? 'Genel Değerlendirmeniz *' : 'Overall Rating *'}
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= formData.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-700 ms-2">
                  {formData.rating} / 5 {currentLang === 'ar' ? 'نجوم' : currentLang === 'tr' ? 'Yıldız' : 'Stars'}
                </span>
              </div>
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {currentLang === 'ar' ? 'نص التقييم والتجربة الدراسية *' : currentLang === 'tr' ? 'Yorumunuz ve Tecrübeniz *' : 'Review & Study Experience *'}
              </label>
              <textarea
                required
                rows={3}
                placeholder={
                  currentLang === 'ar'
                    ? 'اكتب رأيك الصادق حول جودة التعليم، الحرم الجامعي، المرافق، وتجربتك الأكاديمية...'
                    : currentLang === 'tr'
                    ? 'Eğitim kalitesi, kampüs olanakları ve akademik tecrübeniz hakkındaki görüşlerinizi yazın...'
                    : 'Write your honest review on academic quality, campus facilities, and student life...'
                }
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {submitting
                  ? currentLang === 'ar' ? 'جاري الإرسال...' : currentLang === 'tr' ? 'Gönderiliyor...' : 'Submitting...'
                  : currentLang === 'ar' ? 'إرسال التقييم' : currentLang === 'tr' ? 'Yorumu Gönder' : 'Submit Review'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
