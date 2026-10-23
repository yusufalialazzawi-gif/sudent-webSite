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
  BookOpen,
  FileText,
  Award,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function ApplyPage() {
  const { t } = useTranslation();
  const { currentLang, isRtl } = useLanguage();
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

  // Graduate-specific fields
  const [bachelorMajor, setBachelorMajor] = useState('');
  const [bachelorUniversity, setBachelorUniversity] = useState('');
  const [bachelorGpa, setBachelorGpa] = useState('');
  const [languageExam, setLanguageExam] = useState('');
  const [thesisTopic, setThesisTopic] = useState('');

  // File Uploads (General & Graduate)
  const [passportFile, setPassportFile] = useState(null);
  const [transcriptFile, setTranscriptFile] = useState(null);
  const [diplomaFile, setDiplomaFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [sopFile, setSopFile] = useState(null);
  const [recommendationFile, setRecommendationFile] = useState(null);
  const [equivalenceFile, setEquivalenceFile] = useState(null);
  const [languageCertFile, setLanguageCertFile] = useState(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const isGraduate =
    degreeLevel === 'MASTER_WITH_THESIS' ||
    degreeLevel === 'MASTER_NON_THESIS' ||
    degreeLevel === 'PHD';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consentPrivacy) {
      setErrorMsg(
        currentLang === 'ar'
          ? 'يجب الموافقة على سياسة الخصوصية للمتابعة.'
          : currentLang === 'tr'
          ? 'Devam etmek için gizlilik politikasını onaylamalısınız.'
          : 'You must agree to the privacy policy to continue.'
      );
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

      // Compose rich educational background details
      let educationSummary = currentEducation;
      if (isGraduate) {
        educationSummary = `[الدراسات العليا]: تخصص البكالوريوس: ${bachelorMajor || 'N/A'} | الجامعة: ${bachelorUniversity || 'N/A'} | المعدل: ${bachelorGpa || 'N/A'} | امتحان اللغة: ${languageExam || 'لا يوجد'}`;
      }
      formData.append('currentEducation', educationSummary);

      let finalNotes = notes;
      if (isGraduate && thesisTopic) {
        finalNotes = `[مجال البحث / الأطروحة]: ${thesisTopic}\n${notes || ''}`;
      }
      if (finalNotes) formData.append('notes', finalNotes);
      formData.append('consentPrivacy', String(consentPrivacy));

      // Append documents
      if (passportFile) formData.append('passport', passportFile);
      if (transcriptFile) formData.append('transcript', transcriptFile);
      if (diplomaFile) formData.append('diploma', diplomaFile);
      if (cvFile) formData.append('cv', cvFile);
      if (sopFile) formData.append('sop', sopFile);
      if (recommendationFile) formData.append('recommendation', recommendationFile);
      if (equivalenceFile) formData.append('equivalence', equivalenceFile);
      if (languageCertFile) formData.append('languageCert', languageCertFile);

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
        <ScrollReveal yOffset={30}>
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy-950 font-cairo">
                {t('apply.successTitle')}
              </h1>
              <p className="text-slate-600 text-sm max-w-md mx-auto">
                {currentLang === 'ar' ? (
                  <>
                    شكراً لك يا <span className="font-bold text-slate-800">{submittedApp.fullName}</span>. تم استلام ملفك بنجاح وسيتواصل معك مستشارك الأكاديمي المختص خلال 24 ساعة عبر الواتساب والبريد لبدء إجراءات التقديم والترجمة الرسمية.
                  </>
                ) : currentLang === 'tr' ? (
                  <>
                    Teşekkürler <span className="font-bold text-slate-800">{submittedApp.fullName}</span>. Başvuru dosyanız başarıyla alındı. Uzman danışmanımız 24 saat içinde sizinle iletişime geçecektir.
                  </>
                ) : (
                  <>
                    Thank you, <span className="font-bold text-slate-800">{submittedApp.fullName}</span>. Your application file has been registered. Our dedicated academic advisor will reach out within 24 hours via WhatsApp and Email.
                  </>
                )}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-sm mx-auto space-y-1">
              <span className="text-xs text-slate-400 font-semibold">{t('apply.successRef')}</span>
              <div className="text-2xl font-black text-brand-amber-600 font-mono tracking-widest">
                {submittedApp.refNumber}
              </div>
              <span className="text-[11px] text-slate-500 block pt-1">
                {currentLang === 'ar' ? 'احتفظ بهذا الرمز لمتابعة حالة ملفك لدى مستشارك' : 'Keep this reference code to track your dossier'}
              </span>
            </div>

            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                to="/"
                className="px-6 py-3 rounded-xl bg-brand-navy-950 text-white font-bold text-xs hover:bg-brand-navy-900 transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/universities"
                className="px-6 py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                {t('nav.universities')}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      ) : (
        <>
          {/* Page Heading */}
          <ScrollReveal yOffset={30}>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 bg-brand-navy-900 text-brand-amber-400 px-4 py-1.5 rounded-full text-xs font-bold border border-brand-amber-500/30">
                <Sparkles className="w-4 h-4 text-brand-amber-400" />
                <span>
                  {currentLang === 'ar'
                    ? 'بوابة التقديم الرسمية للجامعات التركية والدراسات العليا'
                    : currentLang === 'tr'
                    ? 'Türkiye Lisans ve Lisansüstü Resmi Başvuru Portalı'
                    : 'Official Turkey Undergraduate & Graduate Admissions Portal'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-brand-navy-950 font-cairo">
                {t('apply.title')}
              </h1>
              <p className="text-slate-600 text-sm max-w-xl mx-auto">
                {currentLang === 'ar'
                  ? 'خدمات قبولات واستشارات أكاديمية احترافية معتمدة للبكالوريوس والماجستير والدكتوراه في أفضل +120 جامعة حكومية وخاصة في تركيا.'
                  : currentLang === 'tr'
                  ? 'Türkiye’nin +120 devlet ve vakıf üniversitesinde lisans, yüksek lisans ve doktora programları için yetkili akademik başvuru danışmanlığı.'
                  : 'Certified admissions advisory for Bachelor’s, Master’s with/without Thesis, and PhD programs across +120 top Turkish public & private universities.'}
              </p>
            </div>
          </ScrollReveal>

          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Comprehensive Application Form */}
          <ScrollReveal yOffset={40}>
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
                      placeholder={currentLang === 'ar' ? 'الاسم كما في جواز السفر تماماً' : 'Full name as written in passport'}
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
                      placeholder={currentLang === 'ar' ? 'مثال: عراقي، سوري، مصري، يمني، أردني...' : 'e.g. Iraqi, Syrian, Egyptian, Jordanian...'}
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {t('contact.phone')} (واتساب نشط) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+90 551 234 5678"
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none font-mono ltr text-start"
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
                      placeholder="student@example.com"
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none ltr text-start"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {t('apply.passportNumber')} (رقم الجواز)
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
                      {currentLang === 'ar' ? 'المدينة المفضلة في تركيا' : 'Preferred City in Turkey'}
                    </label>
                    <input
                      type="text"
                      value={preferredCity}
                      onChange={(e) => setPreferredCity(e.target.value)}
                      placeholder="İstanbul, Ankara, İzmir, Bursa..."
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Academic Program & Degree Level */}
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
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none cursor-pointer bg-slate-50 font-semibold"
                    >
                      <option value="BACHELOR">{t('degrees.bachelor')}</option>
                      <option value="MASTER_WITH_THESIS">{t('degrees.masterWithThesis')}</option>
                      <option value="MASTER_NON_THESIS">{t('degrees.masterNonThesis')}</option>
                      <option value="PHD">{t('degrees.phd')}</option>
                      <option value="ASSOCIATE">{t('degrees.associate')}</option>
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
                      placeholder={
                        isGraduate
                          ? currentLang === 'ar'
                            ? 'مثال: ماجستير هندسة البرمجيات، إدارة أعمال MBA...'
                            : currentLang === 'tr'
                            ? 'Örnek: Yazılım Mühendisliği Yüksek Lisans, MBA...'
                            : 'e.g. Master in Software Engineering, MBA...'
                          : currentLang === 'ar'
                          ? 'مثال: الطب البشري، طب الأسنان، هندسة البرمجيات...'
                          : currentLang === 'tr'
                          ? 'Örnek: Tıp, Diş Hekimliği, Yazılım Mühendisliği...'
                          : 'e.g. Medicine, Dentistry, Software Engineering...'
                      }
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
                      placeholder={
                        currentLang === 'ar'
                          ? 'مثال: جامعة إسطنبول، جامعة بهتشه شهير...'
                          : currentLang === 'tr'
                          ? 'Örnek: İstanbul Üniversitesi, Bahçeşehir...'
                          : 'e.g. Istanbul University, Bahcesehir...'
                      }
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
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none cursor-pointer bg-slate-50"
                    >
                      <option value="ENGLISH">{t('studyLangs.english')}</option>
                      <option value="TURKISH">{t('studyLangs.turkish')}</option>
                      <option value="MIXED">{t('studyLangs.mixed')}</option>
                    </select>
                  </div>
                </div>

                {/* Graduate-specific Details Accordion / Form Card */}
                {isGraduate && (
                  <div className="bg-brand-navy-950 text-white p-5 rounded-2xl space-y-4 border border-brand-amber-500/30">
                    <div className="flex items-center gap-2 text-brand-amber-400 font-bold text-xs">
                      <GraduationCap className="w-4 h-4" />
                      <span>
                        {currentLang === 'ar'
                          ? 'بيانات وتفاصيل مرحلة الدراسات العليا (Graduate Program Specifics)'
                          : currentLang === 'tr'
                          ? 'Lisansüstü (Yüksek Lisans / Doktora) Başvuru Detayları'
                          : 'Graduate (Master’s / PhD) Application Details'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-900">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">
                          {currentLang === 'ar' ? 'تخصص البكالوريوس السابق *' : currentLang === 'tr' ? 'Önceki Lisans Bölümünüz *' : 'Previous Bachelor’s Major *'}
                        </label>
                        <input
                          type="text"
                          required={isGraduate}
                          value={bachelorMajor}
                          onChange={(e) => setBachelorMajor(e.target.value)}
                          placeholder={currentLang === 'ar' ? 'مثال: بكالوريوس هندسة حاسوب' : currentLang === 'tr' ? 'Örnek: Bilgisayar Mühendisliği' : 'e.g. Computer Engineering'}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">
                          {currentLang === 'ar' ? 'جامعة التخرج *' : currentLang === 'tr' ? 'Mezun Olduğunuz Üniversite *' : 'Graduating University *'}
                        </label>
                        <input
                          type="text"
                          required={isGraduate}
                          value={bachelorUniversity}
                          onChange={(e) => setBachelorUniversity(e.target.value)}
                          placeholder={currentLang === 'ar' ? 'مثال: جامعة بغداد / جامعة القاهرة' : currentLang === 'tr' ? 'Örnek: Bağdat Üniversitesi / Kahire Üniv.' : 'e.g. University of Baghdad'}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">
                          {currentLang === 'ar' ? 'معدل التخرج (GPA) *' : currentLang === 'tr' ? 'Mezuniyet Not Ortalaması (GPA) *' : 'Graduation GPA *'}
                        </label>
                        <input
                          type="text"
                          required={isGraduate}
                          value={bachelorGpa}
                          onChange={(e) => setBachelorGpa(e.target.value)}
                          placeholder={currentLang === 'ar' ? 'مثال: 3.45 / 4.0 أو 82%' : currentLang === 'tr' ? 'Örnek: 3.45 / 4.0 veya %82' : 'e.g. 3.45 / 4.0 or 82%'}
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-900">
                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">
                          {currentLang === 'ar'
                            ? 'شهادات اللغة المعتمدة المتوفرة لديك'
                            : currentLang === 'tr'
                            ? 'Mevcut Yabancı Dil Sınav Belgeniz'
                            : 'Available Language Proficiency Certs'}
                        </label>
                        <input
                          type="text"
                          value={languageExam}
                          onChange={(e) => setLanguageExam(e.target.value)}
                          placeholder={
                            currentLang === 'ar'
                              ? 'مثال: TOEFL IBT (85) / TÖMER C1 / لا يوجد حالياً'
                              : currentLang === 'tr'
                              ? 'Örnek: TOEFL IBT (85) / TÖMER C1 / Yok'
                              : 'e.g. TOEFL IBT (85) / TÖMER C1 / None'
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-bold block mb-1">
                          {currentLang === 'ar'
                            ? 'مجال الأطروحة أو البحث المقترح (للدكتوراه والماجستير بأطروحة)'
                            : currentLang === 'tr'
                            ? 'Önerilen Tez / Araştırma Konusu (Doktora ve Tezli Y.L.)'
                            : 'Proposed Thesis / Research Topic (PhD & Thesis Master’s)'}
                        </label>
                        <input
                          type="text"
                          value={thesisTopic}
                          onChange={(e) => setThesisTopic(e.target.value)}
                          placeholder={
                            currentLang === 'ar'
                              ? 'موضوع أو عنوان البحث الأكاديمي المقترح...'
                              : currentLang === 'tr'
                              ? 'Önerilen tez veya akademik araştırma başlığı...'
                              : 'Proposed research topic or thesis focus...'
                          }
                          className="w-full p-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Document Uploads & Translation Requirements */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="w-7 h-7 rounded-lg bg-brand-navy-950 text-white flex items-center justify-center font-bold text-xs">
                    3
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
                    <h2 className="font-bold text-base text-brand-navy-950 font-cairo">
                      {isGraduate
                        ? currentLang === 'ar'
                          ? 'المستندات ووثائق الدراسات العليا والترجمة'
                          : currentLang === 'tr'
                          ? 'Lisansüstü Evrakları ve Yeminli Tercüme'
                          : 'Graduate Documents & Translation'
                        : t('apply.step3')}
                    </h2>
                    <span className="text-[11px] text-brand-amber-600 font-bold">
                      {isGraduate
                        ? currentLang === 'ar'
                          ? 'نوفر خدمة الترجمة المحلفة وتصديق النوتر ومعادلة YÖK'
                          : currentLang === 'tr'
                          ? 'Yeminli tercüme, noter tasdiki ve YÖK denklik desteği sunuyoruz'
                          : 'Certified translation, notary legalization & YÖK support included'
                        : currentLang === 'ar'
                        ? 'نوفر ترجمة محلفة وتصديق رسمي'
                        : currentLang === 'tr'
                        ? 'Yeminli tercüme ve resmi onay sağlanır'
                        : 'Certified translation & official verification available'}
                    </span>
                  </div>
                </div>

                {/* Document Uploads Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Passport */}
                  <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors bg-slate-50/50">
                    <UploadCloud className="w-6 h-6 text-brand-amber-500 mx-auto mb-1.5" />
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      {t('apply.uploadPassport')} *
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setPassportFile(e.target.files[0] || null)}
                      className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-slate-200"
                    />
                    {passportFile && <span className="text-[10px] text-emerald-600 block mt-1 font-bold">✓ {passportFile.name}</span>}
                  </div>

                  {/* Transcript */}
                  <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors bg-slate-50/50">
                    <UploadCloud className="w-6 h-6 text-brand-amber-500 mx-auto mb-1.5" />
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      {isGraduate
                        ? currentLang === 'ar'
                          ? 'كشف درجات البكالوريوس المفصل *'
                          : currentLang === 'tr'
                          ? 'Resmi Lisans Not Dökümü (Transkript) *'
                          : 'Official Bachelor’s Transcript *'
                        : t('apply.uploadTranscript')}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setTranscriptFile(e.target.files[0] || null)}
                      className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-slate-200"
                    />
                    {transcriptFile && <span className="text-[10px] text-emerald-600 block mt-1 font-bold">✓ {transcriptFile.name}</span>}
                  </div>

                  {/* Diploma */}
                  <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors bg-slate-50/50">
                    <UploadCloud className="w-6 h-6 text-brand-amber-500 mx-auto mb-1.5" />
                    <span className="text-[11px] font-bold text-slate-700 block mb-1">
                      {isGraduate
                        ? currentLang === 'ar'
                          ? 'شهادة البكالوريوس أو التخرج *'
                          : currentLang === 'tr'
                          ? 'Lisans Diploması / Mezuniyet Belgesi *'
                          : 'Bachelor’s Degree Diploma *'
                        : t('apply.uploadDiploma')}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setDiplomaFile(e.target.files[0] || null)}
                      className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-slate-200"
                    />
                    {diplomaFile && <span className="text-[10px] text-emerald-600 block mt-1 font-bold">✓ {diplomaFile.name}</span>}
                  </div>

                  {/* Graduate Document: CV */}
                  {isGraduate && (
                    <div className="border border-dashed border-brand-amber-300 bg-brand-amber-50/30 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors">
                      <FileText className="w-6 h-6 text-brand-amber-600 mx-auto mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-800 block mb-1">
                        {currentLang === 'ar' ? 'السيرة الذاتية الأكاديمية (CV)' : currentLang === 'tr' ? 'Akademik Özgeçmiş (CV)' : 'Academic Curriculum Vitae (CV)'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setCvFile(e.target.files[0] || null)}
                        className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-brand-amber-100"
                      />
                      {cvFile && <span className="text-[10px] text-emerald-600 block mt-1 font-bold">✓ {cvFile.name}</span>}
                    </div>
                  )}

                  {/* Graduate Document: Statement of Purpose (SOP) */}
                  {isGraduate && (
                    <div className="border border-dashed border-brand-amber-300 bg-brand-amber-50/30 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors">
                      <BookOpen className="w-6 h-6 text-brand-amber-600 mx-auto mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-800 block mb-1">
                        {currentLang === 'ar' ? 'خطاب الدافع والنوايا (SOP / Niyet)' : currentLang === 'tr' ? 'Niyet Mektubu (SOP / Motivasyon)' : 'Statement of Purpose (SOP)'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setSopFile(e.target.files[0] || null)}
                        className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-brand-amber-100"
                      />
                      {sopFile && <span className="text-[10px] text-emerald-600 block mt-1 font-bold">✓ {sopFile.name}</span>}
                    </div>
                  )}

                  {/* Graduate Document: Recommendation Letters */}
                  {isGraduate && (
                    <div className="border border-dashed border-brand-amber-300 bg-brand-amber-50/30 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors">
                      <Award className="w-6 h-6 text-brand-amber-600 mx-auto mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-800 block mb-1">
                        {currentLang === 'ar' ? 'رسائل التوصية الأكاديمية (References)' : currentLang === 'tr' ? 'Akademik Referans Mektupları' : 'Academic Letters of Reference'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setRecommendationFile(e.target.files[0] || null)}
                        className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-brand-amber-100"
                      />
                      {recommendationFile && <span className="text-[10px] text-emerald-600 block mt-1 font-bold">✓ {recommendationFile.name}</span>}
                    </div>
                  )}

                  {/* Graduate Document: YÖK Equivalence / Recognition */}
                  {isGraduate && (
                    <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors bg-slate-50/50">
                      <ShieldCheck className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        {currentLang === 'ar' ? 'معادلة / اعتراف البكالوريوس (YÖK Tanıma)' : currentLang === 'tr' ? 'YÖK Okul Tanıma / Denklik Belgesi' : 'YÖK Recognition / Equivalency'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setEquivalenceFile(e.target.files[0] || null)}
                        className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-slate-200"
                      />
                      {equivalenceFile && <span className="text-[10px] text-emerald-600 block mt-1 font-bold">✓ {equivalenceFile.name}</span>}
                    </div>
                  )}

                  {/* Language Certificate */}
                  {isGraduate && (
                    <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center hover:border-brand-amber-500 transition-colors bg-slate-50/50">
                      <FileCheck className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        {currentLang === 'ar' ? 'شهادة اللغة (TÖMER / TOEFL إن وجدت)' : currentLang === 'tr' ? 'Yabancı Dil Belgesi (Varsa TÖMER / TOEFL)' : 'Language Certificate (TOEFL / TÖMER if any)'}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setLanguageCertFile(e.target.files[0] || null)}
                        className="text-[10px] text-slate-500 file:me-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:bg-slate-200"
                      />
                      {languageCertFile && <span className="text-[10px] text-emerald-600 block mt-1 font-bold">✓ {languageCertFile.name}</span>}
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
                    <ShieldCheck className="w-4 h-4 text-brand-amber-500" />
                    <span>
                      {currentLang === 'ar'
                        ? 'ملاحظة حول أمان المستندات والترجمة المحلفة:'
                        : currentLang === 'tr'
                        ? 'Belge Güvenliği ve Yeminli Tercüme Hakkında:'
                        : 'Document Security & Certified Translation Notice:'}
                    </span>
                  </div>
                  <p>
                    {currentLang === 'ar'
                      ? 'تُحفظ جميع الوثائق الشخصية في خوادم مشفرة وآمنة تماماً ومحمية بموجب قانون حماية البيانات الشخصية التركي (KVKK). يقوم فريقنا بفحص ملفك وإعلامك بالترجمات والتصديقات المطلوبة من النوتر والجهات الحكومية وفق أرقى المعايير المهنية.'
                      : currentLang === 'tr'
                      ? 'Tüm kişisel evraklarınız KVKK mevzuatına uygun, şifreli ve güvenli sunucularda saklanır. Uzman ekibimiz belgelerinizi titizlikle inceleyerek noter tasdiki ve yeminli tercüme gereksinimleri konusunda size eksiksiz rehberlik sağlar.'
                      : 'All personal documents are encrypted and protected under Turkish Personal Data Protection Law (KVKK). Our expert team reviews your credentials and guides you through necessary certified translations and notary authentications.'}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {t('apply.notes')}
                  </label>
                  <textarea
                    rows="2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      currentLang === 'ar'
                        ? 'أي استفسار أو ملاحظات إضافية ترغب بإطلاع مستشارك عليها...'
                        : currentLang === 'tr'
                        ? 'Danışmanınıza iletmek istediğiniz özel notlar veya sorularınız...'
                        : 'Any additional notes or questions for your academic advisor...'
                    }
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
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-sm shadow-xl shadow-brand-amber-500/20 btn-hover-lift transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{submitting ? t('apply.submitting') : t('apply.submitApplication')}</span>
                </button>
              </div>
            </form>
          </ScrollReveal>
        </>
      )}
    </div>
  );
}
