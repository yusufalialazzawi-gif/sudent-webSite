import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  FileText,
  Home,
  Plane,
  Sparkles,
  PhoneCall,
  MessageCircle,
  Clock,
  Award,
  Users,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import ServiceCard from '../../components/common/ServiceCard';
import ScrollReveal, { StaggerContainer, StaggerItem } from '../../components/common/ScrollReveal';

export default function ServicesPage() {
  const { t } = useTranslation();
  const { currentLang, isRtl } = useLanguage();
  const { settings } = useTheme();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['services', currentLang],
    queryFn: () => api.getServices(currentLang),
  });

  const journeySteps = [
    {
      step: '01',
      titleAr: 'التقييم الأكاديمي واختيار التخصص',
      titleTr: 'Akademik Değerlendirme & Bölüm Seçimi',
      titleEn: 'Academic Profiling & Major Selection',
      descAr: 'دراسة معدلك وشهادتك ومطابقتها مع أكثر من 120 جامعة حكومية وخاصة للحصول على أفضل فرصة قبول.',
      descTr: 'Not ortalamanıza ve hedeflerinize en uygun +120 devlet veya vakıf üniversite programlarının belirlenmesi.',
      descEn: 'Evaluating your credentials against +120 universities to secure optimal admission eligibility.',
      image: 'https://images.unsplash.com/photo-1507842229451-7f01be837a2b?w=600&auto=format&fit=crop&q=80',
    },
    {
      step: '02',
      titleAr: 'الترجمة المحلفة وتصديق الملفات',
      titleTr: 'Yeminli Tercüme & Dosya Hazırlığı',
      titleEn: 'Certified Translation & Dossier Verification',
      descAr: 'ترجمة الشهادات وكشوف الدرجات إلى التركية، تصديق النوتر، وتجهيز أوراق الدراسات العليا والاعتراف.',
      descTr: 'Diplomaların yeminli Türkçe çevirisi, noter onayı ve eksiksiz başvuru dosyasının hazırlanması.',
      descEn: 'Sworn Turkish translations, notary apostille validations, and comprehensive application dossier compilation.',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    },
    {
      step: '03',
      titleAr: 'تأمين القبول الجامعي الرسمي',
      titleTr: 'Resmi Üniversite Kabulünün Alınması',
      titleEn: 'Official University Admission Issuance',
      descAr: 'متابعة مباشرة مع عمادات القبول والتسجيل حتى استلام وثيقة القبول الرسمي المشروط والنهائي.',
      descTr: 'Üniversite senatoları ve uluslararası öğrenci ofisleriyle resmi kabul mektubunun temini.',
      descEn: 'Direct liaison with university admissions boards to deliver official conditional and unconditional offers.',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80',
    },
    {
      step: '04',
      titleAr: 'الاستقبال، السكن والإقامة الطلابية',
      titleTr: 'Karşılama, Yurt ve İkamet İzni',
      titleEn: 'Airport Welcome, Dorm & Residence Card',
      descAr: 'استقبال من المطار بسيارة خاصة، تأمين سكن جامعي مرخص، واستخراج تصريح الإقامة الطلابية (الإيكامت).',
      descTr: 'VIP transfer, güvenli yurt yerleşimi ve Göç İdaresi nezdinde öğrenci ikamet tezkeresi işlemleri.',
      descEn: 'Airport meet & greet, vetted dormitory placement, and seamless Göç İdaresi residence card support.',
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* 1. VISUAL HERO BANNER WITH PHOTOGRAPHY */}
      <section className="relative overflow-hidden bg-brand-navy-950 text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80"
            alt="University Campus Life"
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-950 via-brand-navy-950/80 to-brand-navy-950/90"></div>
        </div>

        <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-brand-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Copy Column */}
            <div className="lg:col-span-7 space-y-5 text-start">
              <div className="inline-flex items-center gap-2 bg-brand-amber-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-brand-amber-400/30 text-brand-amber-400 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-brand-amber-400" />
                <span>
                  {currentLang === 'ar'
                    ? 'خدمات تعليمية وقانونية متكاملة للطلاب الدوليين'
                    : currentLang === 'tr'
                    ? 'Uluslararası Öğrenciler İçin Uçtan Uca Danışmanlık'
                    : 'Comprehensive Educational & Legal Consulting for Scholars'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-cairo tracking-tight leading-tight">
                {currentLang === 'ar' ? (
                  <>
                    خدمات طلابية متكاملة لضمان <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber-400 to-brand-amber-500">استقرارك ونجاحك الأكاديمي</span>
                  </>
                ) : currentLang === 'tr' ? (
                  <>
                    Türkiye’de Başarılı Bir Gelecek İçin <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber-400 to-brand-amber-500">A’dan Z’ye Öğrenci Hizmetleri</span>
                  </>
                ) : (
                  <>
                    End-to-End Educational Services for <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber-400 to-brand-amber-500">Your Academic Excellence</span>
                  </>
                )}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                {currentLang === 'ar'
                  ? 'نرافقك خطوة بخطوة من أول استشارة أكاديمية وترجمة الشهادات، مروراً باستخراج القبول الرسمي في كبرى الجامعات التركية، وحتى الاستقبال في المطار واستخراج الإقامة والسكن المريح.'
                  : currentLang === 'tr'
                  ? 'Üniversite kabulünden yeminli tercümeye, denklik işlemlerinden havalimanı karşılama, yurt ve ikamet tezkeresine kadar her aşamada yanınızdayız.'
                  : 'Guiding you through credential translation, official university admissions, sworn notary certifications, airport VIP transfer, student housing, and residence permits.'}
              </p>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentLang === 'ar' ? 'قبول جامعي رسمي موثق' : currentLang === 'tr' ? 'Resmi Onaylı Üniversite Kabulü' : 'Verified University Acceptance'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentLang === 'ar' ? 'ترجمة وتعديل شهادات معتمد' : currentLang === 'tr' ? 'YÖK Denklik & Yeminli Tercüme' : 'YÖK Equivalence & Translation'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentLang === 'ar' ? 'متابعة الإقامة والسكن' : currentLang === 'tr' ? 'İkamet & Yurt Takibi' : 'Housing & Residence Support'}</span>
                </div>
              </div>
            </div>

            {/* Photo Mosaic Column */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              <div className="space-y-3.5">
                <div className="relative rounded-2xl overflow-hidden shadow-xl h-36 sm:h-44 group border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1507842229451-7f01be837a2b?w=500&auto=format&fit=crop&q=80"
                    alt="University Students Consulting"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2.5 start-2.5 text-[11px] font-bold text-white drop-shadow">
                    {currentLang === 'ar' ? 'استشارات أكاديمية متخصصة' : currentLang === 'tr' ? 'Birebir Akademik Danışmanlık' : 'Academic Consulting'}
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-xl h-32 sm:h-36 group border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1450133064473-71024230f91b?w=500&auto=format&fit=crop&q=80"
                    alt="Official Translation Documents"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2.5 start-2.5 text-[11px] font-bold text-white drop-shadow">
                    {currentLang === 'ar' ? 'ترجمة وتصديق نوتر معتمد' : currentLang === 'tr' ? 'Yeminli Tercüme & Noter' : 'Certified Translation'}
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 pt-6">
                <div className="relative rounded-2xl overflow-hidden shadow-xl h-32 sm:h-36 group border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=80"
                    alt="Student Residence & Housing"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2.5 start-2.5 text-[11px] font-bold text-white drop-shadow">
                    {currentLang === 'ar' ? 'سكن طلابي مجهز وآمن' : currentLang === 'tr' ? 'Güvenli Öğrenci Yurtları' : 'Student Housing'}
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-xl h-36 sm:h-44 group border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&auto=format&fit=crop&q=80"
                    alt="Graduation and Success in Turkey"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2.5 start-2.5 text-[11px] font-bold text-white drop-shadow">
                    {currentLang === 'ar' ? 'تخرج ونجاح أكاديمي موثوق' : currentLang === 'tr' ? 'Mezuniyet ve Başarı' : 'Graduation Success'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES LIST WITH PHOTO CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block">
              {currentLang === 'ar' ? 'باقات وحلول متكاملة' : currentLang === 'tr' ? 'Hizmet Paketlerimiz' : 'Comprehensive Packages'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy-950 font-cairo">
              {currentLang === 'ar' ? 'اختر الخدمة المناسبة لمرحلتك الدراسية' : currentLang === 'tr' ? 'Eğitim Yolculuğunuz İçin Profesyonel Çözümler' : 'Choose the Right Service for Your Academic Stage'}
            </h2>
            <p className="text-slate-600 text-sm">
              {currentLang === 'ar'
                ? 'خدمات مصممة خصيصاً للطلاب العرب والدوليين لضمان التسجيل السلس وتفادي الأخطاء الإدارية والقانونية.'
                : currentLang === 'tr'
                ? 'Uluslararası öğrencilerin Türkiye’deki üniversite ve yaşam süreçlerini kolaylaştıran kurumsal danışmanlık hizmetleri.'
                : 'Dedicated consulting services designed to ensure smooth university admissions and legal residency in Turkey.'}
            </p>
          </div>
        </ScrollReveal>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-2xl bg-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-6 bg-red-50 text-red-700 rounded-2xl text-center text-sm font-bold">
            {error?.message || 'حدث خطأ في تحميل الخدمات.'}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.data?.map((service) => (
              <StaggerItem key={service.id}>
                <ServiceCard service={service} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* 3. STEP-BY-STEP VISUAL EDUCATIONAL JOURNEY (PHOTO-BACKED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="bg-slate-100/90 rounded-3xl p-8 sm:p-12 border border-slate-200/80">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block">
                {currentLang === 'ar' ? 'خارطة طريق واضحة وموثوقة' : currentLang === 'tr' ? 'Adım Adım Yol Haritanız' : 'Your Clear Roadmap'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-navy-950 font-cairo">
                {currentLang === 'ar' ? 'كيف تبدأ دراستك في تركيا معنا؟' : currentLang === 'tr' ? 'Türkiye’de Eğitime Nasıl Başlarsınız?' : 'How to Begin Your Studies in Turkey with Us'}
              </h2>
              <p className="text-slate-600 text-sm">
                {currentLang === 'ar'
                  ? 'خطوات مدروسة تضمن لك الحصول على القبول الجامعي والانتقال بثقة وأمان تام.'
                  : currentLang === 'tr'
                  ? 'Başvurudan yerleşime kadar her adımı profesyonel danışmanlarımızla güvenle yönetin.'
                  : 'Structured milestones ensuring guaranteed admission and confident relocation.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {journeySteps.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={item.image}
                      alt={currentLang === 'ar' ? item.titleAr : currentLang === 'tr' ? item.titleTr : item.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute top-3 start-3 w-8 h-8 rounded-lg bg-brand-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shadow">
                      {item.step}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-brand-navy-950 font-cairo mb-2 group-hover:text-brand-amber-600 transition-colors">
                        {currentLang === 'ar' ? item.titleAr : currentLang === 'tr' ? item.titleTr : item.titleEn}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {currentLang === 'ar' ? item.descAr : currentLang === 'tr' ? item.descTr : item.descEn}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4. DIRECT ADVISORY CONTACT BANNER WITH HUMAN TOUCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="relative rounded-3xl bg-gradient-to-r from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 text-white p-8 sm:p-12 overflow-hidden border border-brand-amber-500/30 shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl overflow-hidden border-2 border-brand-amber-400 shrink-0 shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&auto=format&fit=crop&q=80"
                    alt="Educational Counselor"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-bold text-brand-amber-400 uppercase tracking-wider block">
                    {currentLang === 'ar' ? 'فريق مستشاري القبول بانتظارك' : currentLang === 'tr' ? 'Uzman Danışmanlarımız Hazır' : 'Admissions Counselors Ready'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-cairo">
                    {currentLang === 'ar'
                      ? 'هل تحتاج مساعدة في اختيار التخصص أو معادلة أوراقك؟'
                      : currentLang === 'tr'
                      ? 'Bölüm Seçimi veya Denklik Konusunda Desteğe mi İhtiyacınız Var?'
                      : 'Need Assistance with Program Matching or Degree Equivalence?'}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                    {currentLang === 'ar'
                      ? 'تواصل مباشرة مع فريق الخبراء عبر الواتساب للحصول على استشارة سريعة وشرح تفصيلي للشروط والرسوم.'
                      : currentLang === 'tr'
                      ? 'Doğrudan WhatsApp hattımızdan bize ulaşarak üniversite kabul koşulları ve kayıt süreci hakkında bilgi alabilirsiniz.'
                      : 'Connect directly with our admissions advisors for rapid assistance on requirements and registration.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
                <a
                  href={`https://wa.me/${settings.contact_whatsapp || settings.whatsapp_number || '905313971022'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? 'محادثة عبر واتساب' : currentLang === 'tr' ? 'WhatsApp ile Danış' : 'Chat on WhatsApp'}</span>
                </a>

                <Link
                  to="/apply"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-amber-500 hover:bg-brand-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-amber-500/25 transition-all"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? 'قدّم طلبك الآن' : currentLang === 'tr' ? 'Hemen Başvur' : 'Apply Now'}</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
