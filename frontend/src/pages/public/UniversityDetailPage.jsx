import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Calendar,
  Trophy,
  Globe,
  Languages,
  Building2,
  GraduationCap,
  CheckCircle2,
  ExternalLink,
  FileText,
  DollarSign,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  AlertCircle,
  Check,
  FileCheck,
  BookOpen,
  Award,
  HelpCircle,
  Video,
  ShieldCheck,
  Layers,
  PhoneCall,
  Search,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import UniversityCard from '../../components/common/UniversityCard';
import UniversityVideoPlayer from '../../components/common/UniversityVideoPlayer';
import NotaryTranslationEquivalencySection from '../../components/common/NotaryTranslationEquivalencySection';

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { currentLang, isRtl } = useLanguage();
  const navigate = useNavigate();

  // Active sticky tab state
  const [activeTab, setActiveTab] = useState('overview');
  // Programs search & filter
  const [progSearch, setProgSearch] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  // FAQ accordion active item
  const [openFaq, setOpenFaq] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['university', slug, currentLang],
    queryFn: () => api.getUniversityBySlug(slug, currentLang),
  });

  // Fetch all universities for the card slider
  const { data: allUnisData } = useQuery({
    queryKey: ['all-unis-detail-slider', currentLang],
    queryFn: () => api.getUniversities({ limit: 12, lang: currentLang }),
  });

  // Track active section on scroll for sticky tabs
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'programs', 'undergraduate', 'graduate', 'faq'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-pulse">
          <div className="h-64 rounded-3xl bg-slate-200" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-32 bg-slate-200 rounded-3xl" />
              <div className="h-96 bg-slate-200 rounded-3xl" />
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="h-64 bg-slate-200 rounded-3xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center py-20 px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-lg space-y-5">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 font-cairo">
            {currentLang === 'ar'
              ? 'لم يتم العثور على الجامعة المطلوبة'
              : currentLang === 'tr'
              ? 'İstenen Üniversite Bulunamadı'
              : 'University Not Found'}
          </h2>
          <p className="text-slate-500 text-sm">
            {error?.message ||
              (currentLang === 'ar'
                ? 'تأكد من صحة الرابط أو تصفح قائمة الجامعات التركية المعتمدة.'
                : 'Lütfen bağlantıyı kontrol edin veya üniversiteler listesine göz atın.')}
          </p>
          <Link
            to="/universities"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0B2545] hover:bg-[#163b6a] text-white font-bold text-sm shadow-md transition-colors"
          >
            <span>{currentLang === 'ar' ? 'تصفح قائمة الجامعات' : 'Tüm Üniversiteler'}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>
      </div>
    );
  }

  const university = data.data;
  const related = data.related || [];
  const allUniversities = allUnisData?.data || related || [];

  const translation =
    university.translations?.find((tr) => tr.lang === currentLang) ||
    university.translations?.find((tr) => tr.lang === 'ar') ||
    university.translations?.[0] ||
    {};

  const name = translation.name || university.slug;
  const overview = translation.overview || '';
  const isPrivate = university.type === 'PRIVATE';

  const whatsappNumber = '905313971022';
  const waApplyUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `مرحباً شركة المجد للقبولات الجامعية، أرغب بالتقديم والحصول على قبول جامعي معتمد في (${name}) 2026.`
  )}`;

  // Default fallback programs if none populated (No price numbers displayed)
  const defaultPrograms = [
    { nameAr: 'طب بشري', nameTr: 'Tıp (İngilizce/Türkçe)', degreeLevel: 'BACHELOR', studyLanguage: 'MIXED', durationYears: 6 },
    { nameAr: 'طب الأسنان', nameTr: 'Diş Hekimliği', degreeLevel: 'BACHELOR', studyLanguage: 'TURKISH', durationYears: 5 },
    { nameAr: 'صيدلة', nameTr: 'Eczacılık Fakültesi', degreeLevel: 'BACHELOR', studyLanguage: 'ENGLISH', durationYears: 5 },
    { nameAr: 'هندسة حاسوب وذكاء اصطناعي', nameTr: 'Bilgisayar Mühendisliği (AI)', degreeLevel: 'BACHELOR', studyLanguage: 'ENGLISH', durationYears: 4 },
    { nameAr: 'هندسة مدنية', nameTr: 'İnşaat Mühendisliği', degreeLevel: 'BACHELOR', studyLanguage: 'TURKISH', durationYears: 4 },
    { nameAr: 'إدارة أعمال دولية', nameTr: 'Uluslararası İşletme', degreeLevel: 'BACHELOR', studyLanguage: 'ENGLISH', durationYears: 4 },
    { nameAr: 'العلاج الطبيعي والتأهيل', nameTr: 'Fizyoterapi ve Rehabilitasyon', degreeLevel: 'BACHELOR', studyLanguage: 'TURKISH', durationYears: 4 },
    { nameAr: 'هندسة برمجيات', nameTr: 'Yazılım Mühendisliği', degreeLevel: 'BACHELOR', studyLanguage: 'ENGLISH', durationYears: 4 },
  ];

  const rawPrograms = university.programs && university.programs.length > 0 ? university.programs : defaultPrograms;

  // Filter programs in this university
  const filteredPrograms = rawPrograms.filter((prog) => {
    const pt = prog.translations?.find((t) => t.lang === currentLang) || prog.translations?.[0] || {};
    const pName = (pt.name || prog.nameAr || prog.nameTr || prog.slug || '').toLowerCase();
    const matchesSearch = !progSearch || pName.includes(progSearch.toLowerCase());
    const matchesDegree = !selectedDegree || prog.degreeLevel === selectedDegree;
    return matchesSearch && matchesDegree;
  });

  // 10 Detailed FAQ items with thematic icons
  const faqItems = [
    {
      icon: '📍',
      qAr: `ما هو موقع وحرم ${name} في تركيا؟`,
      qTr: `${name} konumu ve kampüs özellikleri nelerdir?`,
      qEn: `Where is ${name} located and what are campus facilities like?`,
      aAr: `تقع الجامعة في مدينة ${university.city || 'تركيا'}، وتتميز بحرم جامعي متكامل يضم مكتبات بحثية ضخمة، مختبرات حديثة، ملاعب رياضية، وسكن جامعي متكامل ومحطات مواصلات عامة مباشرة.`,
      aTr: `Üniversite ${university.city || 'Türkiye'} merkezinde yer almakta olup, zengin araştırma kütüphaneleri, modern laboratuvarları, spor tesisleri ve kolay ulaşım ağıyla öğrencilere tam donanımlı bir kampüs yaşamı sunmaktadır.`,
      aEn: `Located in ${university.city || 'Turkey'}, the university features state-of-the-art research laboratories, extensive central libraries, athletics facilities, and on-campus student housing with direct transit access.`,
    },
    {
      icon: '📅',
      qAr: `ما هي سنة تأسيس ${name} ومدى عراقتها الأكاديمية؟`,
      qTr: `${name} kuruluş yılı ve tarihi nedir?`,
      qEn: `What is the foundation year and heritage of ${name}?`,
      aAr: `تأسست الجامعة عام ${university.establishedYear || '1993'} وتعتبر من أعرق الجامعات المعتمدة في تركيا، حيث تخرج منها آلاف العلماء والقادة والمهنيين على مر العقود.`,
      aTr: `Üniversite ${university.establishedYear || '1993'} yılında kurulmuş olup, Türkiye'nin en köklü ve saygın yükseköğretim kurumları arasında öncü bir konuma sahiptir.`,
      aEn: `Established in ${university.establishedYear || '1993'}, the university is among Turkey's most prestigious and established public/private higher education institutions.`,
    },
    {
      icon: '📊',
      qAr: `ما هو الترتيب المحلي والعالمي لجامعة ${name}؟`,
      qTr: `${name} yerel ve uluslararası başarı sıralaması nedir?`,
      qEn: `What is the national and global ranking of ${name}?`,
      aAr: `تحتل الجامعة المرتبة #${university.localRank || 5} محلياً على مستوى تركيا وتصنف ضمن أفضل الجامعات العالمية وفق تصنيفات QS و THE و URAP العالمية المعتمدة.`,
      aTr: `Üniversite Türkiye genelinde #${university.localRank || 5}. sırada yer almakta ve QS, THE ve URAP gibi uluslararası sıralamalarda ön sıralarda temsil edilmektedir.`,
      aEn: `The university ranks #${university.localRank || 5} nationally in Turkey and is featured among world top universities across QS, THE, and URAP global rankings.`,
    },
    {
      icon: '🗣️',
      qAr: `ما هي لغات الدراسة المعتمدة في ${name} وهل يتوفر سنة تحضيرية؟`,
      qTr: `Eğitim dili nedir ve hazırlık sınıfı imkânı var mı?`,
      qEn: `What is the instruction language and is there a prep year?`,
      aAr: `تعتمد الجامعة اللغتين التركية والإنجليزية بنسبة (100% إنجليزي أو 30% أو تركي كامل بحسب التخصص). يتوفر معهد لغات رسمي لتدريس السنة التحضيرية للطلاب الجدد.`,
      aTr: `Bölümlere göre %100 İngilizce, %30 İngilizce ve Türkçe eğitim seçenekleri bulunmaktadır. Dil yeterliliği olmayan öğrenciler için hazırlık dil okulu mevcuttur.`,
      aEn: `Programs are offered in 100% English, 30% English, and Turkish depending on the faculty. A preparatory language school is available for students without language scores.`,
    },
    {
      icon: '🧾',
      qAr: `ما هي شروط القبول للطلاب الدوليين والشهادات المقبولة؟`,
      qTr: `Uluslararası öğrenci kabul şartları ve kabul edilen sınavlar nelerdir?`,
      qEn: `What are international admission requirements and accepted exams?`,
      aAr: `تقبل الجامعة اختبار TR-YÖS المركزي، واختبارات SAT 1، والشهادات الدولية مثل IB و Abitur، بالإضافة إلى الشهادة الثانوية العامة بمعدلات متفاوتة بحسب التخصص.`,
      aTr: `Üniversite TR-YÖS, SAT 1, ABITUR, IB, GCE ve lise diploması not ortalaması ile uluslararası öğrenci kabul etmektedir.`,
      aEn: `The university accepts TR-YÖS, SAT 1, International Baccalaureate (IB), Abitur, GCE A-Levels, and national high school diplomas based on faculty cut-offs.`,
    },
    {
      icon: '💬',
      qAr: `كيف يمكن معرفة الرسوم الدراسية والخصومات المتاحة في ${name}؟`,
      qTr: `${name} öğrenim ücretleri ve indirimler hakkında nasıl bilgi alabilirim?`,
      qEn: `How can I inquire about tuition fees and discounts at ${name}?`,
      aAr: `تختلف الرسوم باختلاف الكلية والتخصص ولغة الدراسة، كما تتوفر منح جزئية وخصومات حصرية للطلاب المسجلين عن طريق شركة المجد. لمعرفة الرسوم الدقيقة وتقديم طلبك، يرجى التواصل معنا مباشرة عبر واتساب.`,
      aTr: `Öğrenim ücretleri seçilen fakülte, bölüm ve eğitim diline göre farklılık göstermektedir. Şirketimize özel indirim ve burslu kontenjanlar hakkında bilgi almak için doğrudan WhatsApp danışmanlarımıza yazabilirsiniz.`,
      aEn: `Tuition fees vary by program and instruction language. Exclusive scholarship quotas and institutional discounts are available through our agency. Please contact us via WhatsApp for precise details.`,
    },
    {
      icon: '🏛️',
      qAr: `ما هي أبرز الكليات والتخصصات المتاحة في ${name}؟`,
      qTr: `${name} bünyesinde hangi fakülteler ve bölümler öne çıkar?`,
      qEn: `What are the prominent faculties and majors available at ${name}?`,
      aAr: `تضم الجامعة كليات متميزة كالطب البشري، طب الأسنان، الصيدلة، الهندسة، الحقوق، والذكاء الاصطناعي، وتوفر أكثر من 18 كلية وعشرات برامج البكالوريوس والدبلوم.`,
      aTr: `Tıp, Diş Hekimliği, Eczacılık, Mühendislik, Hukuk ve İktisat başta olmak üzere 18'den fazla fakülte ve yüzlerce lisans programı bulunmaktadır.`,
      aEn: `Top faculties include Medicine, Dentistry, Pharmacy, Engineering, Law, and Economics, encompassing 18+ faculties and hundreds of degree programs.`,
    },
    {
      icon: '🎓',
      qAr: `هل يتوفر برامج دراسات عليا (ماجستير ودكتوراه) للطلاب الدوليين؟`,
      qTr: `Yüksek lisans ve doktora programları yabancı öğrencilere açık mı?`,
      qEn: `Are Master's and PhD programs open to international students?`,
      aAr: `نعم، تفتح الجامعة مفاضلات دورية للفصلين الخريفي والربيعي لبرامج الماجستير بأطروحة وبدون أطروحة، وبرامج الدكتوراه في مختلف المعاهد العلمية والصحية.`,
      aTr: `Evet, fen, sağlık ve sosyal bilimler enstitüleri bünyesinde tezli/tezsiz yüksek lisans ve doktora programlarına güz ve bahar dönemlerinde başvuru kabul edilir.`,
      aEn: `Yes, graduate institutes accept international candidates for thesis and non-thesis Master's and PhD programs across fall and spring application cycles.`,
    },
    {
      icon: '🔁',
      qAr: `هل تدعم الجامعة برامج التبادل الطلابي الأوروبي مثل Erasmus+؟`,
      qTr: `Erasmus+ ve uluslararası öğrenci değişim programları mevcut mu?`,
      qEn: `Does the university participate in Erasmus+ and exchange programs?`,
      aAr: `نعم، تشترك الجامعة في اتفاقيات التبادل الطلابي الأوروبي Erasmus+ مع أكثر من 100 جامعة أوروبية، مما يتيح للطلاب دراسة فصل أو فصلين في أوروبا.`,
      aTr: `Üniversite 100'den fazla Avrupa üniversitesiyle aktif Erasmus+ değişim anlaşmalarına sahiptir ve öğrencilere Avrupa'da eğitim imkânı sunar.`,
      aEn: `The university maintains active Erasmus+ partnerships with over 100 European universities, offering exchange semesters across Europe.`,
    },
    {
      icon: '🏠',
      qAr: `كيف يمكن للطالب الدولي تأمين السكن والإقامة الجامعية؟`,
      qTr: `Yabancı öğrenciler için yurt ve barınma olanakları nasıl sağlanır?`,
      qEn: `How can international students secure university dorms and housing?`,
      aAr: `توفر الجامعة مساكن طلابية داخل الحرم أو قريبة منه، كما تتوفر مساكن حكومية وخاصة. يساعد فريق شركة المجد الطلاب المقبولين في إجراءات السكن فور وصولهم.`,
      aTr: `Kampüs içi ve yakınında modern öğrenci yurtları mevcuttur. Danışmanlarımız kayıt sonrası yurt yerleşiminde rehberlik eder.`,
      aEn: `Both on-campus dormitories and private student residences are situated nearby. Our advisory team assists accepted students with accommodation upon arrival.`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-24">
      {/* =========================================================
          A. ÜST HERO & HIZLI GEZİNME ALANI (Bento EdTech Hero)
          (Kullanıcının istediği: 3 sembol kaldırıldı, foto avatarı kaldırıldı, ferah başlık)
          ========================================================= */}
      <div className="bg-[#0B2545] text-white relative overflow-hidden border-b border-blue-900/50">
        {/* Cover Background Image with Gradient Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <img
            src={university.coverImageUrl || `/uploads/universities/${university.slug}.webp`}
            alt={name}
            className="w-full h-full object-cover object-center opacity-30"
            onError={(e) => {
              e.currentTarget.src = '/uploads/universities/istanbul-universitesi.webp';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545] via-[#0B2545]/85 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-6 pb-10 sm:pt-8 sm:pb-14">
          {/* Breadcrumb & Geri Dönüş */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-5 font-cairo">
            <div className="flex items-center gap-2 text-blue-200">
              <Link to="/" className="hover:text-white transition-colors">
                {currentLang === 'ar' ? 'الرئيسية' : 'Ana Sayfa'}
              </Link>
              <span>/</span>
              <Link to="/universities" className="hover:text-white transition-colors">
                {currentLang === 'ar' ? 'الجامعات التركية' : 'Türk Üniversiteleri'}
              </Link>
              <span>/</span>
              <span className="text-[#E9B949] font-bold truncate max-w-xs">{name}</span>
            </div>

            <Link
              to="/universities"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md transition-all border border-white/15"
            >
              {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{currentLang === 'ar' ? 'العودة لكافة الجامعات' : 'Üniversitelere Dön'}</span>
            </Link>
          </div>

          {/* Hero Header Content: 3 Sembol ve Fotoğraf Kutusu Kaldırıldı, Temiz ve Güçlü Başlık */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
            <div className="space-y-2.5 max-w-3xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-cairo text-white leading-tight">
                {name} {currentLang === 'ar' ? '2026 | المفاضلات، المقاعد ورابط التقديم' : '2026 | Kontenjanlar, Belgeler ve Başvuru Linki'}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200/95 font-cairo pt-1">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                  <MapPin className="w-3.5 h-3.5 text-[#E9B949]" />
                  <span>{university.city || 'Türkiye'}</span>
                </span>
                {university.establishedYear && (
                  <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                    <Calendar className="w-3.5 h-3.5 text-[#E9B949]" />
                    <span>{currentLang === 'ar' ? `تأسست عام ${university.establishedYear}` : `Kuruluş: ${university.establishedYear}`}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full border border-white/15 backdrop-blur-md">
                  <Trophy className="w-3.5 h-3.5 text-[#E9B949]" />
                  <span>{currentLang === 'ar' ? `الترتيب المحلي: #${university.localRank || 5}` : `Sıralama: #${university.localRank || 5}`}</span>
                </span>
              </div>
            </div>

            {/* WhatsApp İle İletişim Butonu */}
            <div className="shrink-0 w-full sm:w-auto">
              <a
                href={waApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black font-cairo text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                <span>{currentLang === 'ar' ? 'تواصل معنا عبر واتساب' : 'WhatsApp ile Bizimle İletişime Geçin'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          YAPIŞKAN HIZLI GEÇİŞ SEKME BARI (Sticky Anchor Nav)
          ========================================================= */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3 py-2.5 overflow-x-auto no-scrollbar font-cairo">
            {[
              { id: 'overview', labelAr: '🏛️ معلومات عامة', labelTr: '🏛️ Genel Bilgiler', labelEn: 'Overview' },
              { id: 'programs', labelAr: '📚 كروت تخصصات الجامعة', labelTr: '📚 Üniversite Kartları & Bölümler', labelEn: 'University Cards' },
              { id: 'undergraduate', labelAr: '🎓 مفاضلات البكالوريوس', labelTr: '🎓 Lisans Başvuruları', labelEn: 'Undergraduate' },
              { id: 'graduate', labelAr: '📜 الدراسات العليا', labelTr: '📜 Lisansüstü Başvuruları', labelEn: 'Graduate' },
              { id: 'faq', labelAr: '❓ الأسئلة الشائعة', labelTr: '❓ Sıkça Sorulan Sorular', labelEn: 'FAQ' },
            ].map((tab) => {
              const label = currentLang === 'ar' ? tab.labelAr : currentLang === 'tr' ? tab.labelTr : tab.labelEn;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`min-h-[38px] px-4 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#0B2545] text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================
          ANA İÇERİK DÜZENİ (12 Sütun: %70 Ana İçerik + %30 Yapışkan Sağ Panel)
          ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* =========================================================
              SOL / ANA İÇERİK ALANI (8 Sütun - ~%70)
              ========================================================= */}
          <main className="lg:col-span-8 space-y-8">
            
            {/* =========================================================
                B. ÜNİVERSİTE KÜNYESİ (Quick Facts Bento Grid)
                ========================================================= */}
            <section className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 font-cairo">
                {currentLang === 'ar' ? '📋 بطاقة بيانات الجامعة' : '📋 Üniversite Künyesi & Temel Bilgiler'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {/* 1. Şehir */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-400 font-cairo block mb-1">
                    📍 {currentLang === 'ar' ? 'المدينة' : 'Şehir'}
                  </span>
                  <strong className="text-sm font-extrabold text-[#0B2545] font-cairo truncate">
                    {university.city || 'Türkiye'}
                  </strong>
                </div>

                {/* 2. Kuruluş Yılı */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-400 font-cairo block mb-1">
                    🏛️ {currentLang === 'ar' ? 'سنة التأسيس' : 'Kuruluş Yılı'}
                  </span>
                  <strong className="text-sm font-extrabold text-[#0B2545] font-cairo">
                    {university.establishedYear || '1993'}
                  </strong>
                </div>

                {/* 3. Yerel Sıralama */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-400 font-cairo block mb-1">
                    🏆 {currentLang === 'ar' ? 'الترتيب المحلي' : 'Yerel Sıralama'}
                  </span>
                  <strong className="text-sm font-extrabold text-[#E8930C] font-cairo">
                    #{university.localRank || 5}
                  </strong>
                </div>

                {/* 4. Resmi Web Sitesi */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex flex-col justify-between">
                  <span className="text-[11px] font-bold text-slate-400 font-cairo block mb-1">
                    🌐 {currentLang === 'ar' ? 'الموقع الرسمي' : 'Resmi Web'}
                  </span>
                  {university.websiteUrl ? (
                    <a
                      href={university.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-[#1E3A8A] hover:underline flex items-center gap-1 truncate"
                    >
                      <span className="truncate">{university.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-slate-500">YÖK Onaylı</span>
                  )}
                </div>

                {/* 5. Eğitim Dilleri */}
                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex flex-col justify-between col-span-2 sm:col-span-1">
                  <span className="text-[11px] font-bold text-slate-400 font-cairo block mb-1">
                    🗣️ {currentLang === 'ar' ? 'لغات التدريس' : 'Eğitim Dili'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-0.5 rounded-md bg-blue-100/80 text-[#0B2545] font-bold text-[10px]">Türkçe</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 font-bold text-[10px]">English</span>
                  </div>
                </div>
              </div>
            </section>

            {/* =========================================================
                KULLANICININ İSTEDİĞİ: "BÜTÜN CARDLAR GEZ VE ÜNİVERSİTENİN CARDLERİ KOY"
                (Üniversitenin Tüm Bölüm & Program Kartları ve Gezinme Alanı)
                ========================================================= */}
            <section id="programs" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#E8930C] uppercase tracking-wider block mb-1 font-cairo">
                    🎓 {currentLang === 'ar' ? 'تصفح كروت تخصصات ومقاعد الجامعة' : 'Üniversitenin Bölüm ve Program Kartları'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] font-cairo flex items-center gap-2">
                    <Layers className="w-6 h-6 text-[#1E3A8A]" />
                    <span>{currentLang === 'ar' ? `كافة كروت وتخصصات ${name}` : `${name} Bölüm Kartları`}</span>
                  </h2>
                </div>

                {/* Arama Kutusu */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={progSearch}
                    onChange={(e) => setProgSearch(e.target.value)}
                    placeholder={currentLang === 'ar' ? 'ابحث عن كرت تخصص...' : 'Bölüm kartı ara...'}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-cairo focus:outline-none focus:ring-2 focus:ring-[#0B2545] pe-8"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute end-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Üniversitenin Kartları Grid — Her Bölüm İçin Şık Kart */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredPrograms.map((prog, idx) => {
                  const pt = prog.translations?.find((t) => t.lang === currentLang) || prog.translations?.[0] || {};
                  const title = pt.name || prog.nameAr || prog.nameTr || prog.slug;
                  const lang = prog.studyLanguage === 'ENGLISH' ? 'English %100' : prog.studyLanguage === 'MIXED' ? 'Mixed (%30 İngilizce)' : 'Türkçe';

                  return (
                    <div
                      key={idx}
                      className="bg-slate-50 hover:bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-lg transition-all p-4 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-[#0B2545] text-[10px] font-black font-cairo">
                            {prog.degreeLevel === 'MASTER_WITH_THESIS' ? 'Yüksek Lisans' : 'Lisans (Bakalorya)'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 font-cairo">
                            {prog.durationYears || 4} {currentLang === 'ar' ? 'سنوات' : 'Yıl'}
                          </span>
                        </div>

                        <h4 className="text-sm font-black text-[#0B2545] font-cairo leading-snug group-hover:text-blue-700 transition-colors mb-2">
                          {title}
                        </h4>

                        <div className="text-[11px] text-slate-600 font-cairo flex items-center gap-1.5 mb-3">
                          <Languages className="w-3.5 h-3.5 text-[#E8930C] shrink-0" />
                          <span>{lang}</span>
                        </div>
                      </div>

                      {/* KULLANICININ İSTEDİĞİ: Fiyat koyma, başvurmak ve fiyat bilgisi için WhatsApp ile iletişime geçin */}
                      <div className="pt-3 border-t border-slate-200/60 flex flex-col gap-2">
                        <div className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70 flex items-center justify-between font-cairo">
                          <span>{currentLang === 'ar' ? '🏷️ استفسار عن الرسوم والمنح' : '🏷️ Fiyat & İndirim Bilgisi'}</span>
                          <span className="text-[10px] text-emerald-600 font-semibold">{currentLang === 'ar' ? 'عبر واتساب' : 'WhatsApp'}</span>
                        </div>

                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                            `مرحباً شركة المجد، أود الاستفسار عن رسوم وخصومات تخصص (${title}) والتقديم في جامعة (${name}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black font-cairo text-xs shadow-sm flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                        >
                          <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                          <span>{currentLang === 'ar' ? 'تواصل عبر واتساب للتقديم' : 'WhatsApp ile Başvur'}</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* =========================================================
                TÜM TÜRK ÜNİVERSİTELERİNİN KARTLARI (KULLANICININ İSTEDİĞİ: "BÜTÜN CARDLAR GEZ")
                ========================================================= */}
            {allUniversities.length > 0 && (
              <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-xs font-bold text-[#E8930C] uppercase tracking-wider block mb-1 font-cairo">
                      🏛️ دليل الجامعات في تركيا
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] font-cairo flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-[#1E3A8A]" />
                      <span>{currentLang === 'ar' ? 'تصفح كروت الجامعات التركية المعتمدة' : 'Bütün Üniversite Kartlarını Gezin'}</span>
                    </h2>
                  </div>
                  <Link
                    to="/universities"
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 font-cairo"
                  >
                    <span>{currentLang === 'ar' ? 'عرض كافة الجامعات (+120 جامعة)' : 'Tüm Üniversiteler (+120)'}</span>
                    <ArrowRight className="w-4 h-4 flip-in-rtl" />
                  </Link>
                </div>

                {/* Üniversite Kartları Grid — 60fps temiz akış */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {allUniversities.slice(0, 6).map((u) => (
                    <UniversityCard key={u.id || u.slug} university={u} />
                  ))}
                </div>
              </section>
            )}

            {/* =========================================================
                C. ÜNİVERSİTE HAKKINDA BİLGİ & VİDEO
                ========================================================= */}
            <section id="overview" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-[#E8930C] uppercase tracking-wider block mb-1 font-cairo">
                  {currentLang === 'ar' ? 'نظرة عامة على الجامعة' : 'Üniversite Hakkında & Akademik Güç'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] font-cairo flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-[#1E3A8A]" />
                  <span>{currentLang === 'ar' ? `عن ${name}` : `${name} Tanıtımı ve Tarihçesi`}</span>
                </h2>
              </div>

              {/* Hakkında Metni */}
              <div className="text-slate-700 text-sm leading-relaxed font-cairo space-y-3 whitespace-pre-line">
                <p>
                  {overview ||
                    (currentLang === 'ar'
                      ? `تعتبر ${name} من الصروح الأكاديمية الرائدة في الجمهورية التركية. تقدم الجامعة بيئة تعليمية وبحثية بمعايير أوروبية متقدمة (نظام بولونيا ECTS)، وتضم نخبة من الكوادر التدريسية المتميزة وتفتح أبوابها للطلاب الدوليين من شتى أنحاء العالم.`
                      : `${name}, köklü akademik birikimi, modern araştırma laboratuvarları ve uluslararası akreditasyonları ile Türkiye’nin önde gelen üniversiteleri arasındadır.`)}
                </p>
              </div>

              {/* Tanıtım Videosu Alanı */}
              {university.videoUrl ? (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-black text-[#0B2545] font-cairo mb-3 flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#E8930C]" />
                    <span>{currentLang === 'ar' ? 'جولة مصورة في الحرم الجامعي' : 'Resmi Tanıtım Videosu'}</span>
                  </h3>
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                    <UniversityVideoPlayer
                      videoUrl={university.videoUrl}
                      thumbnailUrl={university.videoThumbnailUrl || university.coverImageUrl}
                      title={university.videoTitle || name}
                      description={university.videoDescription}
                    />
                  </div>
                </div>
              ) : null}
            </section>

            {/* =========================================================
                D. LİSANS BAŞVURULARI BÖLÜMÜ (Undergraduate Admissions)
                ========================================================= */}
            <section id="undergraduate" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#E8930C] uppercase tracking-wider block mb-1 font-cairo">
                    {currentLang === 'ar' ? 'مواعيد وشروط التسجيل' : 'Lisans Kayıt ve Tercih Dönemleri'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] font-cairo flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-[#1E3A8A]" />
                    <span>{currentLang === 'ar' ? 'مفاضلات البكالوريوس 2026' : 'Lisans Başvuru Takvimi'}</span>
                  </h2>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold font-cairo w-fit">
                  🟢 {currentLang === 'ar' ? 'المفاضلات مفتوحة رسمياً' : 'Başvurular Aktif'}
                </span>
              </div>

              {/* KULLANICININ İSTEDİĞİ: "fotoğraftaki lisans başvuru zamanları nerde olduğunu ve ne zaman olduğunu söyleme, bilgi almak için whatsapp'tan gönderin bir buton yap" */}
              <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-blue-50/80 via-slate-50 to-blue-50/40 border border-blue-200/80 space-y-4 text-start font-cairo">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{currentLang === 'ar' ? 'مفاضلات 2026 مفتوحة ومتاحة حالياً' : '2026 Başvuruları Aktif'}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#0B2545]">
                      {currentLang === 'ar'
                        ? `معرفة مواعيد مفاضلات وشروط التسجيل في ${name}`
                        : `${name} Güncel Başvuru Tarihleri ve Şartları`}
                    </h3>
                  </div>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `مرحباً شركة المجد، أود الاستفسار عن مواعيد مفاضلات البكالوريوس وشروط التسجيل المتاحة حالياً في (${name}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                    <span>{currentLang === 'ar' ? 'استفسر عن مواعيد المفاضلات عبر واتساب' : 'Başvuru Tarihleri İçin WhatsApp ile İletişime Geçin'}</span>
                  </a>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentLang === 'ar'
                    ? `تُصدر رئاسة الجامعة ومجلس التعليم العالي التركي (YÖK) جداول المفاضلات وتحديثات المقاعد المتاحة للطلاب الدوليين تباعاً. لمعرفة جدول المفاضلة الحالية بدقة والتقديم الرسمي الفوري، تواصل مع فريق شركة المجد المتخصص عبر واتساب.`
                    : `${name} uluslararası öğrenci kontenjanları ve başvuru takvimi periyodik olarak güncellenmektedir. Güncel tercih tarihleri ve kabul şartları hakkında doğrudan WhatsApp üzerinden danışmanlarımızdan anlık bilgi alabilirsiniz.`}
                </p>
              </div>

              {/* Kabul Edilen Sınav ve Belgeler Listesi */}
              <div className="pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-cairo">
                  {currentLang === 'ar' ? '✓ الشهادات والاختبارات المقبولة في المفاضلة' : '✓ Kabul Edilen Sınav ve Belgeler'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {[
                    { label: 'TR-YÖS 2026', desc: 'Sınav Puanı' },
                    { label: 'SAT 1', desc: '1000+ Puan' },
                    { label: 'ABITUR', desc: 'Alman Diploması' },
                    { label: 'IB Diploma', desc: 'Uluslararası Bakalorya' },
                    { label: 'GCE A-Levels', desc: 'İngiliz Sistemi' },
                    { label: 'Lise Diploması', desc: 'Genel Not Ort.' },
                  ].map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 text-center flex flex-col justify-center items-center"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                      <span className="text-xs font-extrabold text-[#0B2545] font-cairo">{cert.label}</span>
                      <span className="text-[10px] text-emerald-800 font-medium">{cert.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Başvuru Aksiyon Butonları (WhatsApp ile İletişim) */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                {university.officialApplicationUrl ? (
                  <a
                    href={university.officialApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:flex-1 min-h-[46px] px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#163b6a] text-white font-black font-cairo text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                  >
                    <span>{currentLang === 'ar' ? 'الذهاب إلى بوابة المفاضلة الرسمية' : 'Resmi Başvuru Sayfasına Git'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : null}

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `مرحباً شركة المجد، أود التقديم والحصول على قبول بكالوريوس في (${name}) 2026.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:flex-1 min-h-[46px] px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black font-cairo text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{currentLang === 'ar' ? 'تواصل معنا عبر واتساب للتسجيل 💬' : 'WhatsApp ile Bizimle İletişime Geçin 💬'}</span>
                </a>
              </div>
            </section>

            {/* =========================================================
                E. LİSANSÜSTÜ BAŞVURULARI BÖLÜMÜ (Graduate Admissions)
                ========================================================= */}
            <section id="graduate" className="bg-white rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-50 pb-4">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1 font-cairo">
                    {currentLang === 'ar' ? 'ماجستير ودكتوراه (Yüksek Lisans & Doktora)' : 'Lisansüstü Eğitim Programları'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] font-cairo flex items-center gap-2">
                    <Award className="w-6 h-6 text-indigo-600" />
                    <span>{currentLang === 'ar' ? 'مفاضلات الدراسات العليا 2026' : 'Lisansüstü Başvuruları'}</span>
                  </h2>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold font-cairo w-fit">
                  📜 {currentLang === 'ar' ? 'متاح للطلاب الدوليين' : 'Yabancı Öğrenciye Açık'}
                </span>
              </div>

              {/* Lisansüstü Bilgilendirme ve WhatsApp Butonu */}
              <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-indigo-50/40 border border-indigo-100 space-y-4 text-start font-cairo">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{currentLang === 'ar' ? 'برامج الماجستير والدكتوراه' : 'Tezli / Tezsiz Yüksek Lisans'}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-[#0B2545]">
                      {currentLang === 'ar'
                        ? `شروط ومواعيد الدراسات العليا في ${name}`
                        : `${name} Lisansüstü Başvuru Bilgisi`}
                    </h3>
                  </div>

                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      `مرحباً شركة المجد، أود الاستفسار عن برامج الدراسات العليا (ماجستير/دكتوراه) وشروط التقديم في (${name}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                    <span>{currentLang === 'ar' ? 'استفسر عن مواعيد الماجستير والدكتوراه عبر واتساب' : 'Lisansüstü Bilgisi İçin WhatsApp ile İletişime Geçin'}</span>
                  </a>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {currentLang === 'ar'
                    ? `تفتح معاهد الدراسات العليا أبواب القبول للفصلين الخريفي والربيعي وفق معايير كل معهد. لمعرفة البرامج المتاحة باللغة الإنجليزية أو التركية وشروط المقابلة ومعادلة الشهادات، تواصل معنا مباشرة عبر واتساب.`
                    : `Sosyal, Fen ve Sağlık Bilimleri enstitüleri bünyesindeki kontenjanlar ve başvuru takvimleri hakkında detaylı bilgi ve resmî danışmanlık almak için WhatsApp hattımızdan bize ulaşabilirsiniz.`}
                </p>
              </div>

              {/* Lisansüstü CTA Bar */}
              <div className="pt-2 border-t border-indigo-50">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `مرحباً شركة المجد، أرغب بالتقديم على برامج الدراسات العليا في (${name}) 2026.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black font-cairo text-sm flex items-center justify-center gap-2.5 transition-all shadow-md shadow-emerald-500/25"
                >
                  <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                  <span>{currentLang === 'ar' ? 'تواصل معنا عبر واتساب للاستفسار والقبول' : 'WhatsApp ile Bizimle İletişime Geçin'}</span>
                </a>
              </div>
            </section>

            {/* =========================================================
                F. SIKÇA SORULAN SORULAR (Interactive FAQ Accordion - 10 Soru)
                ========================================================= */}
            <section id="faq" className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-[#E8930C] uppercase tracking-wider block mb-1 font-cairo">
                  {currentLang === 'ar' ? 'كل ما تحتاج معرفته' : 'Sorular ve Yanıtlar'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0B2545] font-cairo flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-[#1E3A8A]" />
                  <span>{currentLang === 'ar' ? `الأسئلة الشائعة حول ${name}` : `${name} Sıkça Sorulan Sorular`}</span>
                </h2>
              </div>

              <div className="space-y-3 font-cairo">
                {faqItems.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  const q = currentLang === 'ar' ? item.qAr : currentLang === 'tr' ? item.qTr : item.qEn;
                  const a = currentLang === 'ar' ? item.aAr : currentLang === 'tr' ? item.aTr : item.aEn;

                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border transition-all overflow-hidden ${
                        isOpen
                          ? 'border-blue-300 bg-blue-50/20 shadow-sm'
                          : 'border-slate-200/80 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-3 font-cairo cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg shrink-0">{item.icon}</span>
                          <span className="text-xs sm:text-sm font-extrabold text-[#0B2545]">
                            {q}
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-[#0B2545]' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-700 leading-relaxed font-cairo border-t border-blue-100/60 pt-3">
                          {a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>


            {university.showNotarySection !== false && (
              <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
                <NotaryTranslationEquivalencySection />
              </section>
            )}

            {/* EN ALT BÖLÜM: KULLANICININ İSTEDİĞİ: "en altta whatsapp ile bizimle iletişime geçin deyin" */}
            <section className="bg-gradient-to-br from-[#0B2545] to-[#0F2E59] rounded-3xl p-6 sm:p-8 text-white shadow-xl text-center space-y-4 font-cairo">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <MessageCircle className="w-8 h-8 fill-emerald-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {currentLang === 'ar' ? 'هل لديك أي استفسار حول الجامعة؟' : 'Sorularınız mı var?'}
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto">
                {currentLang === 'ar'
                  ? 'فريق شركة المجد جاهز لمساعدتك في الحصول على قبول جامعي معتمد والرد على كافة استفساراتك فوراً.'
                  : 'Uzman danışmanlarımız üniversite kabul şartları ve kayıt süreçleri hakkında sizi bilgilendirmek için hazır.'}
              </p>
              <div className="pt-2">
                <a
                  href={waApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                  <span>{currentLang === 'ar' ? 'تواصل معنا عبر واتساب الآن' : 'WhatsApp ile Bizimle İletişime Geçin'}</span>
                </a>
              </div>
            </section>
          </main>

          {/* =========================================================
              G. SAĞ YAPIŞKAN YAN PANEL (Sticky Sidebar - 4 Sütun - ~%30)
              (Telegram kaldırıldı, sadece WhatsApp ile iletişime geçin)
              ========================================================= */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-16">
            
            {/* 1. Hızlı Başvuru / Danışmanlık Kartı */}
            <div className="bg-gradient-to-br from-[#0B2545] to-[#0F2E59] text-white p-6 sm:p-7 rounded-3xl border border-blue-900/50 shadow-xl space-y-4 font-cairo relative overflow-hidden">
              <div className="absolute top-0 end-0 w-28 h-28 bg-[#E9B949]/10 rounded-full blur-2xl pointer-events-none" />

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#E9B949] text-xs font-bold border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-[#E9B949]" />
                <span>{currentLang === 'ar' ? 'شركة المجد للقبولات الجامعية' : 'Yetkili Başvuru Merkezi'}</span>
              </div>

              <h3 className="text-xl font-black text-white leading-snug">
                {currentLang === 'ar'
                  ? 'تريد ضمان قبولك الجامعي الرسمي 2026؟'
                  : 'Kabul Almak İster Misiniz?'}
              </h3>

              <p className="text-xs text-blue-100/90 leading-relaxed">
                {currentLang === 'ar'
                  ? `يقوم مستشارونا الأكاديميون بمتابعة ملفك والتقديم المباشر في ${name} حتى صدور القبول النهائي مجاناً وبأعلى دقة.`
                  : 'Uzman eğitim danışmanlarımız resmî kabul mektubunuz onaylanana kadar tüm süreci doğrudan takip eder.'}
              </p>

              <div className="pt-2">
                {/* WhatsApp ile Bizimle İletişime Geçin Butonu */}
                <a
                  href={waApplyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[48px] flex items-center justify-center gap-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-102 active:scale-98"
                >
                  <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                  <span>{currentLang === 'ar' ? 'تواصل معنا عبر واتساب' : 'WhatsApp ile Bizimle İletişime Geçin'}</span>
                </a>
              </div>

              {/* Social Proof */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-blue-200">
                <span className="flex items-center gap-1 font-bold text-blue-100">
                  <span>✓ {currentLang === 'ar' ? 'قبول جامعي رسمي معتمد' : 'Resmî Üniversite Kabulü'}</span>
                </span>
                <span className="text-emerald-400 font-bold">✓ {currentLang === 'ar' ? 'استشارة مجانية' : 'Ücretsiz Danışmanlık'}</span>
              </div>
            </div>

            {/* 2. Başvuru ve Kayıt Durumu */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-3.5 font-cairo">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {currentLang === 'ar' ? '⏳ مواعيد وشروط التسجيل' : '⏳ Başvuru ve Kayıt Bilgisi'}
              </h4>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-start space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{currentLang === 'ar' ? 'المفاضلات والمقاعد متاحة حالياً' : 'Başvurular Aktif'}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {currentLang === 'ar'
                    ? `لمعرفة آخر تحديث للمواعيد الرسمية وشروط القبول والمقاعد المتبقية في ${name}:`
                    : `${name} güncel başvuru takvimi ve kontenjan durumu için danışmanlarımızla iletişime geçin:`}
                </p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    `مرحباً شركة المجد، أود الاستفسار عن مواعيد التسجيل والمقاعد المتاحة في جامعة (${name}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>{currentLang === 'ar' ? 'استعلم عبر واتساب الآن' : 'WhatsApp ile Bilgi Alın'}</span>
                </a>
              </div>
            </div>

            {/* 3. Benzer Üniversiteler */}
            {related.length > 0 && (
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 font-cairo">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0B2545]">
                    🏛️ {currentLang === 'ar' ? 'جامعات مشابهة ومقترحة' : 'Benzer Üniversiteler'}
                  </h4>
                  <Link to="/universities" className="text-[11px] font-bold text-blue-600 hover:underline">
                    {currentLang === 'ar' ? 'عرض الكل' : 'Tümü'}
                  </Link>
                </div>

                <div className="space-y-3">
                  {related.slice(0, 4).map((relUni) => {
                    const relTrans =
                      relUni.translations?.find((t) => t.lang === currentLang) ||
                      relUni.translations?.find((t) => t.lang === 'ar') ||
                      relUni.translations?.[0] ||
                      {};
                    const relName = relTrans.name || relUni.slug;

                    return (
                      <Link
                        key={relUni.id}
                        to={`/universities/${relUni.slug}`}
                        className="p-2.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-slate-50 transition-all flex items-center gap-3 group"
                      >
                        <img
                          src={relUni.coverImageUrl || `/uploads/universities/${relUni.slug}.webp`}
                          alt={relName}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                          onError={(e) => {
                            e.currentTarget.src = '/uploads/universities/istanbul-universitesi.webp';
                          }}
                        />
                        <div className="flex-1 min-w-0 text-start">
                          <h5 className="text-xs font-black text-[#0B2545] truncate group-hover:text-blue-600 transition-colors">
                            {relName}
                          </h5>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#E8930C]" />
                            <span>{relUni.city}</span>
                            <span>•</span>
                            <span>{relUni.type === 'PRIVATE' ? (currentLang === 'ar' ? 'خاصة' : 'Vakıf') : (currentLang === 'ar' ? 'حكومية' : 'Devlet')}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
