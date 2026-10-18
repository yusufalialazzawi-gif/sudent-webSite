import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  CheckCircle2,
  UploadCloud,
  FileCheck,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

export default function ApplyPage() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const [searchParams] = useSearchParams();

  // URL query prefilled fields
  const prefilledUni = searchParams.get('university') || '';
  const prefilledProg = searchParams.get('program') || '';

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [degreeLevel, setDegreeLevel] = useState('BACHELOR');
  const [desiredProgram, setDesiredProgram] = useState(prefilledProg);
  const [preferredUniversity, setPreferredUniversity] = useState(prefilledUni);
  const [preferredCity, setPreferredCity] = useState('Istanbul');
  const [studyLanguage, setStudyLanguage] = useState('ENGLISH');
  const [currentEducation, setCurrentEducation] = useState('');
  const [notes, setNotes] = useState('');
  const [consentPrivacy, setConsentPrivacy] = useState(true);

  // File Uploads
  const [passportFile, setPassportFile] = useState(null);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [diplomaFile, setDiplomaFile] = useState(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentPrivacy) {
      setErrorMsg('يجب الموافقة على سياسة الخصوصية للمتابعة.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('nationality', nationality);
      if (passportNumber) formData.append('passportNumber', passportNumber);
      formData.append('degreeLevel', degreeLevel);
      formData.append('desiredProgram', desiredProgram);
      if (preferredUniversity) formData.append('preferredUniversity', preferredUniversity);
      if (preferredCity) formData.append('preferredCity', preferredCity);
      formData.append('studyLanguage', studyLanguage);
      if (currentEducation) formData.append('currentEducation', currentEducation);
      if (notes) formData.append('notes', notes);
      formData.append('consentPrivacy', String(consentPrivacy));

      if (passportFile) formData.append('passport', passportFile);
      if (transcriptFile) formData.append('transcript', transcriptFile);
      if (diplomaFile) formData.append('diploma', diplomaFile);

      const res = await api.submitApplication(formData);
      if (res.success) {
        setSubmittedApp({
          refNumber: res.applicationNumber,
          fullName,
          program: desiredProgram,
          university: preferredUniversity,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء إرسال الطلب. يرجى مراجعة الحقول والمحاولة مجدداً.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Success Confirmation Screen */}
      {submittedApp ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy-950 font-cairo">
              {t('apply.successTitle')}
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              شكراً لك يا <span className="font-bold text-slate-800">{submittedApp.fullName}</span>. تم استلام ملفك الجامعي بنجاح وسيتواصل معك مستشارك الأكاديمي المختص خلال 24 ساعة عبر الواتساب والبريد.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-sm mx-auto space-y-1">
            <span className="text-xs text-slate-400 font-semibold">{t('apply.successRef')}</span>
            <div className="text-2xl font-black text-brand-amber-600 font-mono tracking-widest">
              {submittedApp.refNumber}
            </div>
            <span className="text-[11px] text-slate-500 block pt-1">احتفظ بهذا الرمز لمتابعة حالة ملفك</span>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="px-6 py-3 rounded-xl bg-brand-navy-950 text-white font-bold text-xs hover:bg-brand-navy-900 transition-colors"
            >
              العودة للرئيسية
            </Link>
            <Link
              to="/universities"
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              استكشاف الجامعات
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Page Heading */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-brand-amber-50 text-brand-amber-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-brand-amber-200">
              <Sparkles className="w-4 h-4 text-brand-amber-500" />
              <span>استشارة مجانية وخصومات حصرية 100%</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-brand-navy-950 font-cairo">
              {t('apply.title')}
            </h1>
            <p className="text-slate-600 text-sm max-w-lg mx-auto">
              {t('apply.subtitle')}
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Comprehensive Application Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            {/* Step 1: Personal Data */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-brand-navy-950 text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <h2 className="font-bold text-base text-brand-navy-950 font-cairo">
                  {t('apply.step1')}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('contact.fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="الاسم كما في جواز السفر"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('apply.nationality')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="مثال: عراقي، سوري، مصري، سعودي..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('contact.phone')} (واتساب) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+964 770 123 4567"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('contact.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('apply.passportNumber')} (اختياري)
                  </label>
                  <input
                    type="text"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="A12345678"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('apply.currentEducation')}
                  </label>
                  <input
                    type="text"
                    value={currentEducation}
                    onChange={(e) => setCurrentEducation(e.target.value)}
                    placeholder="مثال: ثانوية عامة علمي بمعدل 88%"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Academic Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-brand-navy-950 text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <h2 className="font-bold text-base text-brand-navy-950 font-cairo">
                  {t('apply.step2')}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('search.degree')} *
                  </label>
                  <select
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="BACHELOR">بكالوريوس (Lisans)</option>
                    <option value="MASTER_WITH_THESIS">ماجستير بأطروحة (Tezli Yüksek Lisans)</option>
                    <option value="MASTER_NON_THESIS">ماجستير بدون أطروحة (Tezsiz)</option>
                    <option value="PHD">دكتوراه (Doktora)</option>
                    <option value="ASSOCIATE">دبلوم مهني سنتين (Ön Lisans)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('apply.desiredProgram')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={desiredProgram}
                    onChange={(e) => setDesiredProgram(e.target.value)}
                    placeholder="مثال: الطب البشري، هندسة البرمجيات، إدارة أعمال..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('apply.preferredUniversity')}
                  </label>
                  <input
                    type="text"
                    value={preferredUniversity}
                    onChange={(e) => setPreferredUniversity(e.target.value)}
                    placeholder="مثال: جامعة إسطنبول ميدي بول"
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('search.language')}
                  </label>
                  <select
                    value={studyLanguage}
                    onChange={(e) => setStudyLanguage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="ENGLISH">اللغة الإنجليزية (English)</option>
                    <option value="TURKISH">اللغة التركية (Türkçe)</option>
                    <option value="MIXED">مختلط (30% إنجليزي / 70% تركي)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Document Uploads & Consent */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="w-7 h-7 rounded-lg bg-brand-navy-950 text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <h2 className="font-bold text-base text-brand-navy-950 font-cairo">
                  {t('apply.step3')}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Passport */}
                <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    {t('apply.uploadPassport')}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setPassportFile(e.target.files[0] || null)}
                    className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-slate-100"
                  />
                  {passportFile && <span className="text-[10px] text-emerald-600 block mt-1">✓ {passportFile.name}</span>}
                </div>

                {/* Transcript */}
                <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    {t('apply.uploadTranscript')}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setTranscriptFile(e.target.files[0] || null)}
                    className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-slate-100"
                  />
                  {transcriptFile && <span className="text-[10px] text-emerald-600 block mt-1">✓ {transcriptFile.name}</span>}
                </div>

                {/* Diploma */}
                <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    {t('apply.uploadDiploma')}
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => setDiplomaFile(e.target.files[0] || null)}
                    className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-slate-100"
                  />
                  {diplomaFile && <span className="text-[10px] text-emerald-600 block mt-1">✓ {diplomaFile.name}</span>}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {t('apply.notes')}
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي معلومات إضافية ترغب بمشاركتها معنا..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Privacy Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentPrivacy}
                  onChange={(e) => setConsentPrivacy(e.target.checked)}
                  className="mt-0.5 rounded text-brand-amber-500 focus:ring-brand-amber-500"
                />
                <label htmlFor="consent" className="text-xs text-slate-600 leading-normal select-none">
                  {t('apply.privacyConsent')}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-sm shadow-xl shadow-brand-amber-500/20 btn-hover-lift transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{submitting ? t('apply.submitting') : t('apply.submitApplication')}</span>
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
