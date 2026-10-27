import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Calendar,
  Building2,
  Globe,
  Languages,
  Check,
  ChevronDown,
  MessageCircle,
  AlertCircle,
  ExternalLink,
  Search,
  Trophy,
  ArrowRight,
  Award,
  Users,
  BookOpen,
  Building,
  FileText,
  Clock,
  ShieldCheck,
  Sparkles,
  Percent,
  Plane,
  HeartHandshake,
  CheckCircle2,
  Microscope,
  Home,
  GraduationCap,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import UniversityCard, {
  resolveUniversityName,
  resolveUniversityPricing,
} from '../../components/common/UniversityCard';
import SfBreadcrumb from '../../components/common/SfBreadcrumb';
import NotaryTranslationEquivalencySection from '../../components/common/NotaryTranslationEquivalencySection';
import { generateUniversityGuide } from '../../utils/universityGuideGenerator';

const WHATSAPP_NUMBER = '905313971022';
const FALLBACK_COVER = '/uploads/universities/istanbul-universitesi.webp';

const L = (ar, tr, en) => ({ ar, tr, en });

const COPY = {
  home: L('الرئيسية', 'Ana Sayfa', 'Home'),
  universities: L('الجامعات', 'Üniversiteler', 'Universities'),
  notFound: L('لم يتم العثور على الجامعة المطلوبة', 'İstenen Üniversite Bulunamadı', 'University Not Found'),
  notFoundHint: L(
    'تأكد من صحة الرابط أو تصفح قائمة الجامعات التركية المعتمدة.',
    'Lütfen bağlantıyı kontrol edin veya üniversiteler listesine göz atın.',
    'Please check the link or browse the full list of universities.'
  ),
  browseAll: L('تصفح قائمة الجامعات', 'Tüm Üniversiteler', 'Browse Universities'),
  private: L('جامعة خاصة', 'Vakıf Üniversitesi', 'Private University'),
  public: L('جامعة حكومية', 'Devlet Üniversitesi', 'State University'),
  tabAbout: L('التعريف بالجامعة', 'Üniversite Tanıtımı', 'About'),
  tabPrograms: L('البرامج الدراسية', 'Bölümler', 'Programs'),
  tabAdmission: L('القبول والتسجيل', 'Başvuru ve Kayıt', 'Admissions'),
  tabCampus: L('الحرم الجامعي', 'Kampüs', 'Campus'),
  tabAccreditation: L('الاعترافات والاعتماد', 'Akreditasyonlar', 'Accreditation'),
  tabFaqs: L('الأسئلة الشائعة', 'Sıkça Sorulan Sorular', 'FAQs'),
  city: L('المدينة', 'Şehir', 'City'),
  founded: L('سنة التأسيس', 'Kuruluş Yılı', 'Founded'),
  type: L('نوع الجامعة', 'Üniversite Türü', 'Type'),
  ranking: L('الترتيب المحلي', 'Yerel Sıralama', 'National Ranking'),
  faculties: L('عدد الكليات', 'Fakülte Sayısı', 'Faculties'),
  departments: L('عدد الأقسام', 'Bölüm Sayısı', 'Departments'),
  website: L('الموقع الرسمي', 'Resmî Web Sitesi', 'Official Website'),
  languages: L('لغات التدريس', 'Eğitim Dili', 'Instruction Languages'),
  campusType: L('نوع الحرم الجامعي', 'Kampüs Tipi', 'Campus Type'),
  address: L('العنوان', 'Adres', 'Address'),
  searchProgram: L('ابحث عن تخصص...', 'Bölüm ara...', 'Search a program...'),
  allDegrees: L('كل الدرجات العلمية', 'Tüm Dereceler', 'All Degrees'),
  noPrograms: L('لا توجد تخصصات مطابقة لبحثك.', 'Aramanızla eşleşen bölüm bulunamadı.', 'No programs match your search.'),
  years: L('سنوات', 'Yıl', 'Years'),
  admissionOpen: L('المفاضلات مفتوحة حالياً', 'Başvurular Aktif', 'Applications Open'),
  officialPortal: L('بوابة التقديم الرسمية', 'Resmî Başvuru Sayfası', 'Official Application Portal'),
  acceptedExams: L('الشهادات والاختبارات المقبولة', 'Kabul Edilen Sınav ve Belgeler', 'Accepted Exams & Documents'),
  graduate: L('الدراسات العليا (ماجستير ودكتوراه)', 'Lisansüstü (Yüksek Lisans & Doktora)', 'Graduate Studies'),
  contactWhatsapp: L('تواصل معنا عبر واتساب', 'WhatsApp ile İletişime Geçin', 'Contact Us on WhatsApp'),
  applyNow: L('سجّل الآن عبر واتساب', 'WhatsApp ile Başvur', 'Apply via WhatsApp'),
  discount: L('خصم', 'İndirim', 'Discount'),
  relatedTitle: L('جامعات مشابهة', 'Benzer Üniversiteler', 'Similar Universities'),
  otherTitle: L('جامعات أخرى قد تهمك', 'Diğer Üniversiteler', 'Other Universities'),
  seeAll: L('عرض الكل', 'Tümü', 'See all'),
  yokApproved: L('معتمدة من YÖK', 'YÖK Onaylı', 'YÖK Approved'),
};

const DEGREE_LABELS = {
  ASSOCIATE: L('دبلوم', 'Ön Lisans', 'Associate'),
  BACHELOR: L('بكالوريوس', 'Lisans', 'Bachelor'),
  MASTER_WITH_THESIS: L('ماجستير بأطروحة', 'Tezli Yüksek Lisans', "Master's (Thesis)"),
  MASTER_NON_THESIS: L('ماجستير بدون أطروحة', 'Tezsiz Yüksek Lisans', "Master's (Non-Thesis)"),
  PHD: L('دكتوراه', 'Doktora', 'PhD'),
};

const LANGUAGE_LABELS = {
  ENGLISH: L('إنجليزي 100%', '%100 İngilizce', '100% English'),
  TURKISH: L('تركي', 'Türkçe', 'Turkish'),
  MIXED: L('إنجليزي 30%', '%30 İngilizce', '30% English'),
};

const CAMPUS_TYPE_LABELS = {
  URBAN: L('حرم داخل المدينة', 'Şehir İçi Kampüs', 'Urban Campus'),
  SUBURBAN: L('حرم في ضواحي المدينة', 'Şehir Dışı Kampüs', 'Suburban Campus'),
  MULTI_CAMPUS: L('عدة حرم جامعية', 'Çok Kampüslü', 'Multi-Campus'),
};

const ACCEPTED_EXAMS = [
  { label: 'TR-YÖS 2026', note: L('اختبار اليوس', 'Sınav Puanı', 'Entrance Exam') },
  { label: 'SAT 1', note: L('1000+ نقطة', '1000+ Puan', '1000+ Score') },
  { label: 'ABITUR', note: L('الشهادة الألمانية', 'Alman Diploması', 'German Diploma') },
  { label: 'IB Diploma', note: L('البكالوريا الدولية', 'Uluslararası Bakalorya', 'Intl. Baccalaureate') },
  { label: 'GCE A-Levels', note: L('النظام البريطاني', 'İngiliz Sistemi', 'British System') },
  { label: 'High School', note: L('الشهادة الثانوية', 'Lise Diploması', 'High School Diploma') },
];

const TAB_PANEL = 'bg-white px-4 py-5 sm:px-6 sm:py-6 rounded-lg shadow-lg';
const STAT_ROW = 'flex items-center justify-between gap-3 py-3 border-b border-[#dee2e6] last:border-b-0';
const STAT_LABEL = 'text-base font-light text-[#707070]';
const STAT_VALUE = 'text-base font-bold text-main-color text-end';
const PANEL_TITLE = 'text-xl sm:text-[1.375rem] font-bold text-main-color';
const SF_BTN = 'py-3 px-5 rounded-lg bg-beer hover:bg-vivid-tangelo text-white text-base font-normal text-center transition-colors inline-flex items-center justify-center gap-2';

function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function UniversityDetailPage() {
  const { slug } = useParams();
  const { currentLang } = useLanguage();

  const [activeTab, setActiveTab] = useState('about');
  const [progSearch, setProgSearch] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const loc = (entry) => (entry ? entry[currentLang] || entry.ar : '');
  const t = (key) => loc(COPY[key]);
  const label = (map, value) => loc(map[value]) || value;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['university', slug, currentLang],
    queryFn: () => api.getUniversityBySlug(slug, currentLang),
  });

  const { data: allUnisData } = useQuery({
    queryKey: ['all-unis-detail', currentLang],
    queryFn: () => api.getUniversities({ limit: 6, lang: currentLang }),
  });

  if (isLoading) {
    return (
      <main className="w-full bg-[#fafafa] mb-16">
        <div className="bg-[#f7f5f2] py-4 sm:py-6 mb-8 drop-shadow-sm">
          <div className="sf-container px-4 flex flex-col gap-3 animate-pulse">
            <div className="h-5 w-56 rounded bg-gray-200" />
            <div className="h-7 w-80 rounded bg-gray-200" />
          </div>
        </div>
        <div className="sf-container px-4 flex flex-col md:flex-row md:gap-4 lg:gap-10 gap-4 animate-pulse">
          <div className="w-full md:basis-[65.4%] flex flex-col gap-4">
            <div className="hidden md:block h-[343px] rounded-lg bg-gray-200" />
            <div className="h-14 rounded-lg bg-gray-200" />
            <div className="h-[480px] rounded-lg bg-gray-200" />
          </div>
          <div className="w-full md:basis-[34.6%] flex flex-col gap-4">
            <div className="h-[430px] rounded-lg bg-gray-200" />
            <div className="h-[260px] rounded-lg bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !data?.data) {
    return (
      <main className="w-full bg-[#fafafa] min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full bg-white rounded-lg drop-shadow-xl p-8 text-center flex flex-col items-center gap-4">
          <span className="w-16 h-16 rounded-full bg-[#f7f5f2] text-vivid-tangelo flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </span>
          <h1 className="text-xl sm:text-[1.625rem] font-bold text-main-color">{t('notFound')}</h1>
          <p className="text-base font-light text-[#707070]">{error?.message || t('notFoundHint')}</p>
          <Link to="/universities" className={SF_BTN}>
            <span>{t('browseAll')}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>
      </main>
    );
  }

  const university = data.data;
  const related = data.related || [];
  const otherUniversities = (allUnisData?.data || []).filter((u) => u.slug !== university.slug);

  const translation =
    university.translations?.find((tr) => tr.lang === currentLang) ||
    university.translations?.find((tr) => tr.lang === 'ar') ||
    university.translations?.[0] ||
    {};

  const name = translation.name || university.slug;
  const overview = translation.overview || '';
  const typeLabel = university.type === 'PRIVATE' ? t('private') : t('public');
  const cityName = university.city || (currentLang === 'ar' ? 'تركيا' : 'Türkiye');
  const guide = generateUniversityGuide(university, currentLang);

  const { annual, discounted, currency } = resolveUniversityPricing(university);
  const hasDiscount = annual !== null && discounted < annual;
  const discountPercent = hasDiscount ? Math.round(((annual - discounted) / annual) * 100) : 0;

  const waApplyUrl = waLink(
    currentLang === 'ar'
      ? `مرحباً شركة المجد للقبولات الجامعية، أرغب بالتقديم والحصول على قبول جامعي معتمد في (${name}) 2026.`
      : `Merhaba, ${name} 2026 kabul başvurusu hakkında bilgi almak istiyorum.`
  );

  const rawPrograms = university.programs || [];
  const degreeOptions = [...new Set(rawPrograms.map((p) => p.degreeLevel).filter(Boolean))];

  const filteredPrograms = rawPrograms.filter((prog) => {
    const pt = prog.translations?.find((tr) => tr.lang === currentLang) || prog.translations?.[0] || {};
    const pName = (pt.name || prog.slug || '').toLowerCase();
    const matchesSearch = !progSearch || pName.includes(progSearch.toLowerCase());
    const matchesDegree = !selectedDegree || prog.degreeLevel === selectedDegree;
    return matchesSearch && matchesDegree;
  });

  const rankingText = university.ranking ? `#${university.ranking}` : null;

  const faqItems = [
    {
      q: L(
        `ما هو موقع وحرم ${name} في تركيا؟`,
        `${name} konumu ve kampüs özellikleri nelerdir?`,
        `Where is ${name} located and what are its campus facilities?`
      ),
      a: L(
        `تقع الجامعة في مدينة ${cityName}، وتتميز بحرم جامعي متكامل يضم مكتبات بحثية، مختبرات حديثة، ملاعب رياضية، وسكن جامعي ومحطات مواصلات عامة مباشرة.`,
        `Üniversite ${cityName} içinde yer alır; araştırma kütüphaneleri, modern laboratuvarlar, spor tesisleri, öğrenci yurtları ve kolay ulaşım ağıyla donatılmıştır.`,
        `Located in ${cityName}, the campus offers research libraries, modern laboratories, athletics facilities, student housing and direct public transit access.`
      ),
    },
    {
      q: L(`ما هي سنة تأسيس ${name}؟`, `${name} hangi yıl kurulmuştur?`, `When was ${name} founded?`),
      a: L(
        `تأسست الجامعة عام ${university.establishedYear || '—'} وتعد من المؤسسات التعليمية المعتمدة من مجلس التعليم العالي التركي (YÖK).`,
        `Üniversite ${university.establishedYear || '—'} yılında kurulmuş olup YÖK tarafından tanınan bir yükseköğretim kurumudur.`,
        `The university was established in ${university.establishedYear || '—'} and is recognised by the Turkish Council of Higher Education (YÖK).`
      ),
    },
    {
      q: L(
        `ما هو الترتيب المحلي لجامعة ${name}؟`,
        `${name} yerel sıralamada kaçıncı sırada?`,
        `What is the national ranking of ${name}?`
      ),
      a: rankingText
        ? L(
            `تحتل الجامعة المرتبة ${rankingText} محلياً على مستوى تركيا، وتُصنف ضمن تصنيفات QS و THE و URAP العالمية.`,
            `Üniversite Türkiye genelinde ${rankingText}. sırada yer almakta ve QS, THE ile URAP sıralamalarında temsil edilmektedir.`,
            `The university ranks ${rankingText} nationally in Turkey and features in the QS, THE and URAP global rankings.`
          )
        : L(
            'لمعرفة الترتيب المحلي والعالمي المحدّث للجامعة يرجى التواصل معنا عبر واتساب.',
            'Güncel yerel ve uluslararası sıralama bilgisi için WhatsApp üzerinden bize ulaşabilirsiniz.',
            'Please contact us on WhatsApp for the latest national and global ranking data.'
          ),
    },
    {
      q: L(
        'ما هي لغات الدراسة وهل تتوفر سنة تحضيرية؟',
        'Eğitim dili nedir ve hazırlık sınıfı var mı?',
        'What are the instruction languages and is there a prep year?'
      ),
      a: L(
        'تعتمد الجامعة اللغتين التركية والإنجليزية (100% إنجليزي أو 30% أو تركي كامل بحسب التخصص)، ويتوفر معهد لغات رسمي لتدريس السنة التحضيرية للطلاب الجدد.',
        'Bölümlere göre %100 İngilizce, %30 İngilizce ve Türkçe eğitim seçenekleri bulunur. Dil yeterliliği olmayan öğrenciler için hazırlık okulu mevcuttur.',
        'Programs are taught in 100% English, 30% English or Turkish depending on the faculty, and a preparatory language school is available.'
      ),
    },
    {
      q: L(
        'ما هي شروط القبول للطلاب الدوليين والشهادات المقبولة؟',
        'Uluslararası öğrenci kabul şartları ve kabul edilen sınavlar nelerdir?',
        'What are the admission requirements and accepted exams?'
      ),
      a: translation.admissionRequirements
        ? L(translation.admissionRequirements, translation.admissionRequirements, translation.admissionRequirements)
        : L(
            'تقبل الجامعة اختبار TR-YÖS، واختبار SAT 1، والشهادات الدولية مثل IB و Abitur و GCE A-Levels، بالإضافة إلى الشهادة الثانوية بمعدلات متفاوتة بحسب التخصص.',
            'Üniversite TR-YÖS, SAT 1, ABITUR, IB, GCE A-Levels ve lise diploması not ortalaması ile uluslararası öğrenci kabul etmektedir.',
            'The university accepts TR-YÖS, SAT 1, IB, Abitur, GCE A-Levels and national high school diplomas, with cut-offs varying by faculty.'
          ),
    },
    {
      q: L(
        `كيف أعرف الرسوم الدراسية والخصومات المتاحة في ${name}؟`,
        `${name} öğrenim ücretleri ve indirimleri nasıl öğrenebilirim?`,
        `How can I find out tuition fees and available discounts at ${name}?`
      ),
      a: L(
        'تختلف الرسوم باختلاف الكلية والتخصص ولغة الدراسة، وتتوفر منح جزئية وخصومات حصرية للطلاب المسجلين عن طريقنا. لمعرفة الرسوم الدقيقة تواصل معنا عبر واتساب.',
        'Ücretler fakülte, bölüm ve eğitim diline göre değişir. Acentemize özel indirim ve burslu kontenjanlar için WhatsApp danışmanlarımıza yazabilirsiniz.',
        'Fees vary by program and instruction language, and exclusive scholarship quotas are available through our agency. Contact us on WhatsApp for exact figures.'
      ),
    },
    {
      q: L(
        'هل تتوفر برامج ماجستير ودكتوراه للطلاب الدوليين؟',
        'Yüksek lisans ve doktora programları yabancı öğrencilere açık mı?',
        "Are Master's and PhD programs open to international students?"
      ),
      a: L(
        'نعم، تفتح معاهد الدراسات العليا مفاضلات دورية للفصلين الخريفي والربيعي لبرامج الماجستير بأطروحة وبدون أطروحة وبرامج الدكتوراه.',
        'Evet, fen, sağlık ve sosyal bilimler enstitüleri güz ve bahar dönemlerinde tezli/tezsiz yüksek lisans ve doktora başvurusu kabul eder.',
        'Yes, the graduate institutes accept international candidates for thesis and non-thesis master programs and PhDs each fall and spring.'
      ),
    },
    {
      q: L(
        'هل تدعم الجامعة برامج التبادل الطلابي مثل Erasmus+؟',
        'Erasmus+ değişim programları mevcut mu?',
        'Does the university take part in Erasmus+ exchange programs?'
      ),
      a: L(
        'نعم، تشترك الجامعة في اتفاقيات التبادل الطلابي الأوروبي Erasmus+، مما يتيح للطلاب دراسة فصل أو فصلين في جامعات أوروبية شريكة.',
        'Üniversite Avrupa’daki partner kurumlarla aktif Erasmus+ anlaşmalarına sahiptir ve öğrencilere değişim dönemi imkânı sunar.',
        'Yes, the university maintains active Erasmus+ partnerships, offering exchange semesters at partner institutions across Europe.'
      ),
    },
    {
      q: L(
        'كيف يمكن للطالب الدولي تأمين السكن الجامعي؟',
        'Yabancı öğrenciler için yurt imkânları nasıl sağlanır?',
        'How can international students secure accommodation?'
      ),
      a: translation.accommodationInfo
        ? L(translation.accommodationInfo, translation.accommodationInfo, translation.accommodationInfo)
        : L(
            'توفر الجامعة مساكن طلابية داخل الحرم أو قريبة منه، كما تتوفر مساكن حكومية وخاصة. يساعد فريقنا الطلاب المقبولين في إجراءات السكن فور وصولهم.',
            'Kampüs içi ve çevresinde öğrenci yurtları ile devlet ve özel yurt seçenekleri mevcuttur. Danışmanlarımız kayıt sonrası yerleşimde rehberlik eder.',
            'On-campus dormitories as well as state and private residences are available nearby, and our team assists accepted students on arrival.'
          ),
    },
    {
      q: L(
        `هل شهادة ${name} معترف بها دولياً؟`,
        `${name} diploması uluslararası geçerli mi?`,
        `Is the ${name} diploma internationally recognised?`
      ),
      a: translation.accreditationInfo
        ? L(translation.accreditationInfo, translation.accreditationInfo, translation.accreditationInfo)
        : L(
            'الجامعة معتمدة من مجلس التعليم العالي التركي (YÖK) وشهاداتها معترف بها في تركيا ومعظم الدول العربية والأوروبية بعد إجراءات المعادلة المعتادة.',
            'Üniversite YÖK tarafından tanınmakta olup diplomaları Türkiye’de ve denklik işlemleri sonrası birçok ülkede geçerlidir.',
            'The university is recognised by YÖK and its diplomas are valid in Turkey and, following standard equivalency procedures, in many other countries.'
          ),
    },
  ];

  const tabs = [
    { id: 'about', label: t('tabAbout') },
    ...(university.showProgramsSection !== false ? [{ id: 'programs', label: t('tabPrograms') }] : []),
    { id: 'admission', label: t('tabAdmission') },
    { id: 'campus', label: t('tabCampus') },
    { id: 'accreditation', label: t('tabAccreditation') },
    ...(university.showFaqSection !== false ? [{ id: 'faqs', label: t('tabFaqs') }] : []),
  ];

  const facts = [
    { label: t('city'), value: university.city },
    { label: t('founded'), value: university.establishedYear },
    { label: t('type'), value: typeLabel },
    { label: t('ranking'), value: rankingText },
    { label: t('faculties'), value: university.facultyCount },
    { label: t('departments'), value: university.departmentCount },
    { label: t('campusType'), value: university.campusType ? label(CAMPUS_TYPE_LABELS, university.campusType) : null },
    { label: t('languages'), value: 'Türkçe / English' },
  ].filter((row) => row.value !== null && row.value !== undefined && row.value !== '');

  const sidebarStats = [
    { label: t('ranking'), value: rankingText || t('yokApproved') },
    { label: t('faculties'), value: university.facultyCount || '—' },
    { label: t('departments'), value: university.departmentCount || '—' },
    { label: t('founded'), value: university.establishedYear || '—' },
  ];

  return (
    <main className="w-full bg-[#fafafa] text-main-color mb-16">
      <SfBreadcrumb
        items={[
          { label: t('home'), to: '/' },
          { label: t('universities'), to: '/universities' },
          { label: name },
        ]}
        title={name}
      />

      <section className="sf-container px-4 flex flex-col md:flex-row md:items-start md:gap-4 lg:gap-10 gap-4">
        {/* ANA İÇERİK — StudyFans: md:basis-[65.4%] */}
        <div className="w-full md:basis-[65.4%] flex flex-col gap-4">
          {/* Üniversite Künye Başlığı — StudyFans 1:1 Büyük ve Görkemli Kapak Bannerı */}
          <header className="relative min-h-[260px] sm:min-h-[300px] md:min-h-[343px] rounded-xl overflow-hidden bg-[#1e293b] drop-shadow-md">
            <img
              src={university.coverImageUrl || FALLBACK_COVER}
              alt={name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover brightness-[0.9]"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_COVER;
              }}
            />
            {/* Lüks degrade katmanı: mobilde alttan üste, masaüstünde sağdan sola */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-[#0f172a]/95 via-[#0f172a]/75 md:from-[#f7f5f2] md:via-[#f7f5f2]/90 md:to-transparent" />

            <div className="relative z-10 w-full h-full flex flex-col justify-end md:justify-center gap-4 sm:gap-5 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <span className="w-[75px] h-[75px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px] shrink-0 rounded-xl bg-white drop-shadow-xl p-2 flex items-center justify-center overflow-hidden border-2 border-white/80">
                  <img
                    src={university.logoUrl || university.coverImageUrl || FALLBACK_COVER}
                    alt={name}
                    loading="lazy"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_COVER;
                    }}
                  />
                </span>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <h1 className="text-xl sm:text-2xl lg:text-[1.625rem] font-black text-white md:text-main-color leading-tight">
                    {name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white bg-beer px-2.5 py-0.5 rounded-md shadow-sm">
                      {typeLabel}
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-white md:text-[#707070] inline-flex items-center gap-1 bg-black/25 md:bg-transparent px-2 md:px-0 py-0.5 rounded-md">
                      <MapPin className="w-3.5 h-3.5 text-beer shrink-0" />
                      {cityName}
                    </span>
                    {rankingText && (
                      <span className="text-xs sm:text-sm font-bold text-white md:text-metallic-blue bg-black/30 md:bg-white border border-white/20 md:border-[#dee2e6] px-2 py-0.5 rounded-md">
                        {rankingText}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ul className="flex flex-wrap gap-x-8 gap-y-3 border-t border-white/20 md:border-[#dee2e6] pt-4">
                <li className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-light text-gray-200 md:text-[#707070]">
                    <MapPin className="w-3.5 h-3.5 text-beer" />
                    {t('city')}
                  </span>
                  <strong className="text-sm sm:text-base font-bold text-white md:text-main-color">{cityName}</strong>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-light text-gray-200 md:text-[#707070]">
                    <Building2 className="w-3.5 h-3.5 text-beer" />
                    {t('type')}
                  </span>
                  <strong className="text-sm sm:text-base font-bold text-white md:text-main-color">{typeLabel}</strong>
                </li>
                {university.establishedYear && (
                  <li className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-light text-gray-200 md:text-[#707070]">
                      <Calendar className="w-3.5 h-3.5 text-beer" />
                      {t('founded')}
                    </span>
                    <strong className="text-sm sm:text-base font-bold text-white md:text-main-color">{university.establishedYear}</strong>
                  </li>
                )}
                {university.websiteUrl && (
                  <li className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm font-light text-gray-200 md:text-[#707070]">
                      <Globe className="w-3.5 h-3.5 text-beer" />
                      {t('website')}
                    </span>
                    <a
                      href={university.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm sm:text-base font-bold text-beer md:text-azure hover:underline transition-colors inline-flex items-center gap-1"
                    >
                      <span>{university.websiteUrl.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </header>

          {/* StudyFans yapışkan sekme şeridi */}
          <nav className="sticky top-[var(--sf-header-h)] z-20 bg-[#f8f9fa] rounded-lg flex overflow-x-auto no-scrollbar drop-shadow-sm">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-4 px-5 text-base whitespace-nowrap transition-colors before:content-[''] before:absolute before:bottom-0 before:start-0 before:w-full before:h-[3px] before:bg-beer before:transition-transform before:duration-300 ltr:before:origin-left rtl:before:origin-right hover:before:scale-x-100 ${
                    isActive
                      ? 'font-bold text-main-color before:scale-x-100'
                      : 'font-light text-[#707070] hover:text-main-color before:scale-x-0'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {activeTab === 'about' && (
            <div className="flex flex-col gap-4">
              {/* 1. نبذة عامة وجدول البيانات الأساسية */}
              <article className={TAB_PANEL}>
                <h2 className={`${PANEL_TITLE} mb-4 flex items-center gap-2`}>
                  <BookOpen className="w-6 h-6 text-beer shrink-0" />
                  <span>{loc(L(`عن ${name}`, `${name} Hakkında`, `About ${name}`))}</span>
                </h2>

                <div className="sf-prose whitespace-pre-line text-base font-light leading-[1.9] text-[#2b2b2b]">
                  {overview || guide.history?.content}
                </div>

                <ul className="mt-6 pt-2 border-t border-[#dee2e6] grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {facts.map((row) => (
                    <li key={row.label} className={STAT_ROW}>
                      <span className={STAT_LABEL}>{row.label}</span>
                      <strong className={STAT_VALUE}>{row.value}</strong>
                    </li>
                  ))}
                </ul>
              </article>

              {/* 2. نشأة الجامعة وتاريخها */}
              {guide.history && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-4 flex items-center gap-2`}>
                    <Building2 className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.history.title}</span>
                  </h3>
                  <p className="sf-prose text-base font-light leading-[1.9] text-[#4a4a4a]">
                    {guide.history.content}
                  </p>
                </article>
              )}

              {/* 3. تواريخ ومحطات هامة في مسيرة الجامعة */}
              {guide.milestones?.items?.length > 0 && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-5 flex items-center gap-2`}>
                    <Clock className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.milestones.title}</span>
                  </h3>
                  <div className="relative border-s-2 border-beer/30 ms-3 ps-5 flex flex-col gap-6">
                    {guide.milestones.items.map((item, idx) => (
                      <div key={idx} className="relative group">
                        <span className="absolute -start-[29px] top-1 w-4 h-4 rounded-full bg-beer border-4 border-white shadow-sm" />
                        <span className="inline-block py-0.5 px-2.5 rounded-full bg-[#f7f5f2] text-sm font-bold text-main-color border border-[#dee2e6] mb-1">
                          {item.year}
                        </span>
                        <p className="text-base font-light text-[#4a4a4a] leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {/* 4. الجامعة في أرقام (إحصائيات دقيقة) */}
              {guide.stats && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-5 flex items-center gap-2`}>
                    <Trophy className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.stats.title}</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#f7f5f2] rounded-lg p-4 text-center flex flex-col items-center justify-center gap-1 border border-[#dee2e6]/50">
                      <GraduationCap className="w-5 h-5 text-beer mb-1" />
                      <strong className="text-2xl font-bold text-main-color">{guide.stats.facultiesCount}</strong>
                      <span className="text-xs font-light text-[#707070]">{t('faculties')}</span>
                    </div>
                    <div className="bg-[#f7f5f2] rounded-lg p-4 text-center flex flex-col items-center justify-center gap-1 border border-[#dee2e6]/50">
                      <BookOpen className="w-5 h-5 text-beer mb-1" />
                      <strong className="text-2xl font-bold text-main-color">{guide.stats.departmentsCount}</strong>
                      <span className="text-xs font-light text-[#707070]">{t('departments')}</span>
                    </div>
                    <div className="bg-[#f7f5f2] rounded-lg p-4 text-center flex flex-col items-center justify-center gap-1 border border-[#dee2e6]/50">
                      <Users className="w-5 h-5 text-beer mb-1" />
                      <strong className="text-2xl font-bold text-main-color">{guide.stats.totalStudents}</strong>
                      <span className="text-xs font-light text-[#707070]">{loc(L('إجمالي الطلاب', 'Toplam Öğrenci', 'Total Students'))}</span>
                    </div>
                    <div className="bg-[#f7f5f2] rounded-lg p-4 text-center flex flex-col items-center justify-center gap-1 border border-[#dee2e6]/50">
                      <Award className="w-5 h-5 text-beer mb-1" />
                      <strong className="text-2xl font-bold text-main-color">{guide.stats.academicStaff}</strong>
                      <span className="text-xs font-light text-[#707070]">{loc(L('الكادر الأكاديمي', 'Akademik Kadro', 'Academic Staff'))}</span>
                    </div>
                    <div className="bg-[#f7f5f2] rounded-lg p-4 text-center flex flex-col items-center justify-center gap-1 border border-[#dee2e6]/50">
                      <Microscope className="w-5 h-5 text-beer mb-1" />
                      <strong className="text-2xl font-bold text-main-color">+{guide.stats.labsCount}</strong>
                      <span className="text-xs font-light text-[#707070]">{loc(L('مختبر ومعمل', 'Uygulama Lab.', 'Laboratories'))}</span>
                    </div>
                    <div className="bg-[#f7f5f2] rounded-lg p-4 text-center flex flex-col items-center justify-center gap-1 border border-[#dee2e6]/50">
                      <Globe className="w-5 h-5 text-beer mb-1" />
                      <strong className="text-xl font-bold text-main-color">{guide.stats.nationalitiesCount}</strong>
                      <span className="text-xs font-light text-[#707070]">{loc(L('تنوع دولي', 'Uluslararası Çeşitlilik', 'Intl. Diversity'))}</span>
                    </div>
                    <div className="bg-[#f7f5f2] rounded-lg p-4 text-center flex flex-col items-center justify-center gap-1 border border-[#dee2e6]/50">
                      <ShieldCheck className="w-5 h-5 text-[#67b98a] mb-1" />
                      <strong className="text-xl font-bold text-[#67b98a]">YÖK</strong>
                      <span className="text-xs font-light text-[#707070]">{t('yokApproved')}</span>
                    </div>
                    <div className="bg-[#f7f5f2] rounded-lg p-4 text-center flex flex-col items-center justify-center gap-1 border border-[#dee2e6]/50">
                      <Sparkles className="w-5 h-5 text-beer mb-1" />
                      <strong className="text-xl font-bold text-main-color">ECTS</strong>
                      <span className="text-xs font-light text-[#707070]">{loc(L('الساعات الأوروبية', 'Avrupa Kredi Sistemi', 'European Credits'))}</span>
                    </div>
                  </div>
                </article>
              )}

              {/* 5. ترتيب الجامعة عالمياً ومحلياً */}
              {guide.rankings && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-4 flex items-center gap-2`}>
                    <Award className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.rankings.title}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-[#f7f5f2] rounded-lg p-4 flex items-center gap-4 border border-[#dee2e6]/50">
                      <span className="w-12 h-12 rounded-full bg-beer/10 text-beer flex items-center justify-center shrink-0">
                        <Trophy className="w-6 h-6" />
                      </span>
                      <div>
                        <span className="text-xs font-light text-[#707070] block">{t('ranking')}</span>
                        <strong className="text-2xl font-black text-main-color">#{guide.rankings.local}</strong>
                        <span className="text-xs text-[#707070] block">{loc(L('على مستوى الجامعات التركية', 'Türkiye genelinde', 'Nationally in Turkey'))}</span>
                      </div>
                    </div>
                    {guide.rankings.global && guide.rankings.global !== '-' && (
                      <div className="bg-[#f7f5f2] rounded-lg p-4 flex items-center gap-4 border border-[#dee2e6]/50">
                        <span className="w-12 h-12 rounded-full bg-azure/10 text-azure flex items-center justify-center shrink-0">
                          <Globe className="w-6 h-6" />
                        </span>
                        <div>
                          <span className="text-xs font-light text-[#707070] block">{loc(L('الترتيب العالمي', 'Dünya Sıralaması', 'Global Ranking'))}</span>
                          <strong className="text-2xl font-black text-main-color">
                            {String(guide.rankings.global).startsWith('#') ? guide.rankings.global : `#${guide.rankings.global}`}
                          </strong>
                          <span className="text-xs text-[#707070] block">{loc(L('تصنيف THE / QS و Webometrics', 'THE / QS ve Webometrics', 'THE / QS & Webometrics'))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-base font-light text-[#4a4a4a] leading-relaxed">
                    {guide.rankings.desc}
                  </p>
                </article>
              )}

              {/* 6. رؤية وقيم الجامعة */}
              {guide.visionValues && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-4 flex items-center gap-2`}>
                    <Sparkles className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.visionValues.title}</span>
                  </h3>
                  <p className="text-base font-light text-[#4a4a4a] leading-relaxed mb-4">
                    {guide.visionValues.vision}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {guide.visionValues.values?.map((val, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#f7f5f2] border border-[#dee2e6]/60 text-sm font-medium text-main-color flex items-center gap-2">
                        <Check className="w-4 h-4 text-beer shrink-0" />
                        <span>{val}</span>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {/* 7. هل الجامعة معترف بها دولياً؟ */}
              {guide.recognitions && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-3 flex items-center gap-2`}>
                    <ShieldCheck className="w-6 h-6 text-[#67b98a] shrink-0" />
                    <span>{guide.recognitions.title}</span>
                  </h3>
                  <p className="text-base font-light text-[#4a4a4a] leading-relaxed mb-4">
                    {guide.recognitions.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guide.recognitions.countries?.map((c, i) => (
                      <span
                        key={i}
                        className="py-1.5 px-3 rounded-lg bg-[#f7f5f2] text-sm font-medium text-main-color border border-[#dee2e6] inline-flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-[#67b98a]" />
                        <span>{c}</span>
                      </span>
                    ))}
                  </div>
                </article>
              )}

              {/* 8. مميزات الدراسة في الجامعة */}
              {guide.advantages?.items?.length > 0 && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-4 flex items-center gap-2`}>
                    <CheckCircle2 className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.advantages.title}</span>
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {guide.advantages.items.map((adv, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#f7f5f2] border border-[#dee2e6]/40">
                        <CheckCircle2 className="w-5 h-5 text-beer shrink-0 mt-0.5" />
                        <span className="text-base font-light text-[#2b2b2b] leading-relaxed">{adv}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {/* 9. أهم التخصصات والبرامج */}
              {guide.keyMajors?.list?.length > 0 && (
                <article className={TAB_PANEL}>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <h3 className={`${PANEL_TITLE} flex items-center gap-2`}>
                      <GraduationCap className="w-6 h-6 text-beer shrink-0" />
                      <span>{guide.keyMajors.title}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('programs')}
                      className="text-sm font-medium text-azure hover:text-beer transition-colors"
                    >
                      {loc(L('عرض جميع التخصصات والرسوم ▾', 'Tüm Bölümleri ve Ücretleri Gör ▾', 'View All Programs & Fees ▾'))}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {guide.keyMajors.list.map((m, i) => (
                      <div key={i} className="p-3.5 rounded-lg bg-[#f7f5f2] border border-[#dee2e6] flex flex-col gap-1.5">
                        <strong className="text-base font-bold text-metallic-blue">{m.name}</strong>
                        <div className="flex items-center justify-between text-xs text-[#707070]">
                          <span>{m.lang}</span>
                          <span className="bg-white px-2 py-0.5 rounded border border-[#dee2e6]">{m.years}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {/* 10. المستشفيات والمراكز التطبيقية أو المعامل */}
              {guide.facilities?.items?.length > 0 && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-4 flex items-center gap-2`}>
                    <Building className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.facilities.title}</span>
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {guide.facilities.items.map((fac, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-base font-light text-[#4a4a4a] leading-relaxed">
                        <span className="w-2 h-2 rounded-full bg-beer shrink-0 mt-2" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {/* 11. مراكز الأبحاث والتطوير */}
              {guide.researchCenters?.list?.length > 0 && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-4 flex items-center gap-2`}>
                    <Microscope className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.researchCenters.title}</span>
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {guide.researchCenters.list.map((center, i) => (
                      <li key={i} className="p-3 rounded-lg bg-[#f7f5f2] border border-[#dee2e6]/50 text-sm font-light text-[#2b2b2b] flex items-center gap-2">
                        <Check className="w-4 h-4 text-beer shrink-0" />
                        <span>{center}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {/* 12. السكن الجامعي والخدمات */}
              {guide.housing && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-3 flex items-center gap-2`}>
                    <Home className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.housing.title}</span>
                  </h3>
                  <p className="text-base font-light text-[#4a4a4a] leading-relaxed">
                    {guide.housing.content}
                  </p>
                </article>
              )}

              {/* 13. الأوراق المطلوبة للتسجيل والقبول */}
              {guide.requirements?.documents?.length > 0 && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-4 flex items-center gap-2`}>
                    <FileText className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.requirements.title}</span>
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {guide.requirements.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#f7f5f2] border border-[#dee2e6]/50">
                        <Check className="w-5 h-5 text-[#67b98a] shrink-0 mt-0.5" />
                        <span className="text-base font-light text-[#2b2b2b] leading-relaxed">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              )}

              {/* 14. المنح والخصومات الحصرية */}
              {guide.discounts?.points?.length > 0 && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-4 flex items-center gap-2`}>
                    <Percent className="w-6 h-6 text-[#67b98a] shrink-0" />
                    <span>{guide.discounts.title}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {guide.discounts.points.map((disc, i) => (
                      <div key={i} className="p-3.5 rounded-lg bg-[#67b98a]/10 border border-[#67b98a]/30 flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#67b98a] shrink-0 mt-2" />
                        <span className="text-sm font-medium text-[#1e293b] leading-relaxed">{disc}</span>
                      </div>
                    ))}
                  </div>
                </article>
              )}

              {/* 15. برنامج التبادل الطلابي الدولي (Erasmus+) */}
              {guide.erasmus && (
                <article className={TAB_PANEL}>
                  <h3 className={`${PANEL_TITLE} mb-3 flex items-center gap-2`}>
                    <Plane className="w-6 h-6 text-beer shrink-0" />
                    <span>{guide.erasmus.title}</span>
                  </h3>
                  <p className="text-base font-light text-[#4a4a4a] leading-relaxed">
                    {guide.erasmus.content}
                  </p>
                </article>
              )}

              {/* 16. ضمان خدمات شركة المجد مجاناً */}
              {guide.companySupport?.items?.length > 0 && (
                <article className="rounded-lg bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white p-6 shadow-xl flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-full bg-beer text-white flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-6 h-6" />
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{guide.companySupport.title}</h3>
                      <p className="text-sm font-light text-gray-300">
                        {loc(L('وكيلك المعتمد والرسمي للتقديم والقبول الفوري بدون أي أتعاب', 'Resmi yetkili acente olarak tüm danışmanlık hizmetlerimiz ücretsizdir', 'Official authorized agency with 100% free guidance and admission'))}
                      </p>
                    </div>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                    {guide.companySupport.items.map((serv, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm font-light text-gray-200">
                        <Check className="w-4 h-4 text-beer shrink-0 mt-0.5" />
                        <span>{serv}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={waApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 py-3 px-6 rounded-lg bg-beer hover:bg-vivid-tangelo text-white text-base font-bold text-center transition-colors inline-flex items-center justify-center gap-2 self-start"
                  >
                    <MessageCircle className="w-5 h-5 fill-white" />
                    <span>{loc(L('احصل على قبولك الجامعي مجاناً الآن', 'Ücretsiz Kabul Belgenizi Alın', 'Get Your Free Admission Now'))}</span>
                  </a>
                </article>
              )}
            </div>
          )}

          {activeTab === 'programs' && (
            <article className={TAB_PANEL}>
              <div className="flex flex-col gap-4 pb-4 border-b border-[#dee2e6]">
                <h2 className={PANEL_TITLE}>
                  {loc(L(`البرامج والتخصصات في ${name}`, `${name} Bölümleri`, `Programs at ${name}`))}
                </h2>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={progSearch}
                      onChange={(e) => setProgSearch(e.target.value)}
                      placeholder={t('searchProgram')}
                      className="w-full h-10 px-4 pe-10 rounded-lg border border-[#dee2e6] bg-white text-base font-light outline-none focus:border-beer transition-colors"
                    />
                    <Search className="w-4 h-4 text-[#707070] absolute end-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {degreeOptions.length > 1 && (
                    <select
                      value={selectedDegree}
                      onChange={(e) => setSelectedDegree(e.target.value)}
                      className="h-10 px-4 rounded-lg border border-[#dee2e6] bg-white text-base font-light outline-none focus:border-beer transition-colors"
                    >
                      <option value="">{t('allDegrees')}</option>
                      {degreeOptions.map((degree) => (
                        <option key={degree} value={degree}>
                          {label(DEGREE_LABELS, degree)}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {filteredPrograms.length === 0 ? (
                <p className="py-10 text-center text-base font-light text-[#707070]">{t('noPrograms')}</p>
              ) : (
                <ul className="pt-4 flex flex-col gap-4">
                  {filteredPrograms.map((prog) => {
                    const pt =
                      prog.translations?.find((tr) => tr.lang === currentLang) || prog.translations?.[0] || {};
                    const title = pt.name || prog.slug;
                    const sign =
                      prog.currency === 'USD'
                        ? '$'
                        : prog.currency === 'EUR'
                        ? '€'
                        : prog.currency === 'TRY'
                        ? '₺'
                        : prog.currency;
                    const progPrice = prog.discountedTuition ?? prog.annualTuition;
                    const progDiscount = prog.discountedTuition && prog.discountedTuition < prog.annualTuition;

                    return (
                      <li key={prog.id || prog.slug} className="bg-white rounded-lg drop-shadow-xl p-4 flex flex-col gap-4">
                        <div className="flex flex-wrap gap-2">
                          <span className="py-1 px-2 rounded-lg bg-[#f7f5f2] text-sm font-normal text-metallic-blue">
                            {label(DEGREE_LABELS, prog.degreeLevel)}
                          </span>
                          <span className="py-1 px-2 rounded-lg bg-[#f7f5f2] text-sm font-normal text-metallic-blue inline-flex items-center gap-1.5">
                            <Languages className="w-3.5 h-3.5 text-beer" />
                            {label(LANGUAGE_LABELS, prog.studyLanguage)}
                          </span>
                          <span className="py-1 px-2 rounded-lg bg-[#f7f5f2] text-sm font-normal text-metallic-blue">
                            {prog.durationYears} {t('years')}
                          </span>
                        </div>

                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                          <h3 className="text-xl font-bold text-metallic-blue capitalize">{title}</h3>

                          <div className="flex items-center justify-between xl:justify-start gap-4 shrink-0">
                            {prog.annualTuition ? (
                              <div className="flex items-baseline gap-2">
                                {progDiscount && (
                                  <span className="line-through text-gray-500 text-lg font-bold">
                                    {prog.annualTuition.toLocaleString('en-US')}
                                    {sign}
                                  </span>
                                )}
                                <span className="text-lg font-bold text-main-color">
                                  {progPrice.toLocaleString('en-US')}
                                  {sign}
                                </span>
                              </div>
                            ) : null}

                            <a
                              href={waLink(
                                currentLang === 'ar'
                                  ? `مرحباً شركة المجد، أود الاستفسار عن رسوم وخصومات تخصص (${title}) والتقديم في جامعة (${name}).`
                                  : `Merhaba, ${name} - ${title} bölümü ücret ve indirim bilgisi almak istiyorum.`
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="py-[6px] px-4 rounded-lg bg-beer hover:bg-vivid-tangelo text-white text-base font-normal transition-colors inline-flex items-center gap-2 shrink-0"
                            >
                              <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                              <span>{t('applyNow')}</span>
                            </a>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </article>
          )}

          {activeTab === 'admission' && (
            <article className={TAB_PANEL}>
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#dee2e6]">
                <h2 className={PANEL_TITLE}>
                  {loc(L('مفاضلات البكالوريوس 2026', '2026 Lisans Başvuruları', '2026 Undergraduate Admissions'))}
                </h2>
                <span className="py-1 px-3 rounded-lg bg-[#67b98a] text-white text-sm font-bold inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  {t('admissionOpen')}
                </span>
              </div>

              <div className="pt-4 sf-prose whitespace-pre-line">
                {translation.admissionRequirements ||
                  loc(
                    L(
                      'تُصدر رئاسة الجامعة ومجلس التعليم العالي التركي (YÖK) جداول المفاضلات وتحديثات المقاعد المتاحة للطلاب الدوليين تباعاً. لمعرفة جدول المفاضلة الحالية بدقة والتقديم الرسمي الفوري تواصل مع فريقنا عبر واتساب.',
                      `${name} uluslararası öğrenci kontenjanları ve başvuru takvimi periyodik olarak güncellenir. Güncel tercih tarihleri ve kabul şartları için WhatsApp üzerinden danışmanlarımıza ulaşabilirsiniz.`,
                      'International quotas and application calendars are updated periodically. Contact our advisors on WhatsApp for the current application window and admission requirements.'
                    )
                  )}
              </div>

              <h3 className="mt-6 mb-3 text-lg font-bold text-metallic-blue">{t('acceptedExams')}</h3>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ACCEPTED_EXAMS.map((exam) => (
                  <li key={exam.label} className="bg-[#f7f5f2] rounded-lg p-3 flex flex-col items-center text-center gap-1">
                    <Check className="w-4 h-4 text-[#67b98a]" />
                    <strong className="text-base font-bold text-main-color">{exam.label}</strong>
                    <span className="text-sm font-light text-[#707070]">{loc(exam.note)}</span>
                  </li>
                ))}
              </ul>

              {guide.requirements?.documents?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#dee2e6]">
                  <h3 className="mb-3 text-lg font-bold text-metallic-blue flex items-center gap-2">
                    <FileText className="w-5 h-5 text-beer" />
                    <span>{guide.requirements.title}</span>
                  </h3>
                  <ul className="flex flex-col gap-2.5">
                    {guide.requirements.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[#f7f5f2] border border-[#dee2e6]/50">
                        <Check className="w-5 h-5 text-[#67b98a] shrink-0 mt-0.5" />
                        <span className="text-base font-light text-[#2b2b2b] leading-relaxed">{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                {university.officialApplicationUrl && (
                  <a
                    href={university.officialApplicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-5 rounded-lg bg-catalina-blue hover:bg-metallic-blue text-white text-base font-normal text-center transition-colors inline-flex items-center justify-center gap-2"
                  >
                    <span>{t('officialPortal')}</span>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                )}
                <a href={waApplyUrl} target="_blank" rel="noopener noreferrer" className={`flex-1 ${SF_BTN}`}>
                  <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                  <span>{t('contactWhatsapp')}</span>
                </a>
              </div>

              {university.graduateAdmissionOpen !== false && (
                <div className="mt-8 pt-6 border-t border-[#dee2e6]">
                  <h3 className="text-lg font-bold text-metallic-blue mb-3">{t('graduate')}</h3>
                  <div className="sf-prose">
                    {loc(
                      L(
                        'تفتح معاهد الدراسات العليا أبواب القبول للفصلين الخريفي والربيعي وفق معايير كل معهد. لمعرفة البرامج المتاحة باللغة الإنجليزية أو التركية وشروط المقابلة ومعادلة الشهادات تواصل معنا عبر واتساب.',
                        'Sosyal, Fen ve Sağlık Bilimleri enstitüleri güz ve bahar dönemlerinde başvuru kabul eder. Kontenjanlar, mülakat şartları ve denklik süreci için WhatsApp hattımızdan bilgi alabilirsiniz.',
                        'Graduate institutes open applications for fall and spring intakes. Contact us on WhatsApp for available English or Turkish programs, interview requirements and diploma equivalency.'
                      )
                    )}
                  </div>
                  <a
                    href={waLink(
                      currentLang === 'ar'
                        ? `مرحباً شركة المجد، أود الاستفسار عن برامج الدراسات العليا (ماجستير/دكتوراه) وشروط التقديم في (${name}).`
                        : `Merhaba, ${name} lisansüstü programları ve başvuru şartları hakkında bilgi almak istiyorum.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 w-full ${SF_BTN}`}
                  >
                    <MessageCircle className="w-4 h-4 fill-white shrink-0" />
                    <span>{t('contactWhatsapp')}</span>
                  </a>
                </div>
              )}
            </article>
          )}

          {activeTab === 'campus' && (
            <article className={TAB_PANEL}>
              <h2 className={`${PANEL_TITLE} mb-4`}>
                {loc(
                  L(
                    `الحرم الجامعي والسكن في ${name}`,
                    `${name} Kampüsü ve Barınma`,
                    `Campus & Accommodation at ${name}`
                  )
                )}
              </h2>

              <div className="relative h-[220px] sm:h-[280px] rounded-lg overflow-hidden mb-5">
                <img
                  src={university.coverImageUrl || FALLBACK_COVER}
                  alt={name}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_COVER;
                  }}
                />
              </div>

              <div className="sf-prose whitespace-pre-line">
                {translation.accommodationInfo ||
                  loc(
                    L(
                      `يقع الحرم الجامعي في مدينة ${cityName}، ويضم مكتبات بحثية، مختبرات حديثة، مرافق رياضية ومساحات دراسية مشتركة. تتوفر مساكن طلابية داخل الحرم أو قريبة منه، إضافة إلى مساكن حكومية وخاصة، ويقوم فريقنا بمساعدة الطلاب المقبولين في إجراءات السكن فور وصولهم.`,
                      `Kampüs ${cityName} içinde yer alır; araştırma kütüphaneleri, modern laboratuvarlar, spor tesisleri ve ortak çalışma alanları bulunur. Kampüs içi ve çevresinde öğrenci yurtları ile devlet ve özel yurt seçenekleri mevcuttur.`,
                      `The campus is located in ${cityName} and includes research libraries, modern laboratories, athletics facilities and shared study spaces. On-campus dormitories as well as state and private residences are available nearby.`
                    )
                  )}
              </div>

              {guide.housing && (
                <div className="mt-6 pt-4 border-t border-[#dee2e6]">
                  <h3 className="text-lg font-bold text-metallic-blue mb-2 flex items-center gap-2">
                    <Home className="w-5 h-5 text-beer" />
                    <span>{guide.housing.title}</span>
                  </h3>
                  <p className="text-base font-light text-[#4a4a4a] leading-relaxed">
                    {guide.housing.content}
                  </p>
                </div>
              )}

              {guide.facilities?.items?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-[#dee2e6]">
                  <h3 className="text-lg font-bold text-metallic-blue mb-2 flex items-center gap-2">
                    <Building className="w-5 h-5 text-beer" />
                    <span>{guide.facilities.title}</span>
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {guide.facilities.items.map((fac, i) => (
                      <li key={i} className="text-sm font-light text-[#4a4a4a] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-beer" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <ul className="mt-6 pt-2 border-t border-[#dee2e6] flex flex-col">
                <li className={STAT_ROW}>
                  <span className={STAT_LABEL}>{t('city')}</span>
                  <strong className={STAT_VALUE}>{cityName}</strong>
                </li>
                {university.campusType && (
                  <li className={STAT_ROW}>
                    <span className={STAT_LABEL}>{t('campusType')}</span>
                    <strong className={STAT_VALUE}>{label(CAMPUS_TYPE_LABELS, university.campusType)}</strong>
                  </li>
                )}
                {translation.address && (
                  <li className={STAT_ROW}>
                    <span className={STAT_LABEL}>{t('address')}</span>
                    <strong className={STAT_VALUE}>{translation.address}</strong>
                  </li>
                )}
              </ul>
            </article>
          )}

          {activeTab === 'accreditation' && (
            <article className={TAB_PANEL}>
              <h2 className={`${PANEL_TITLE} mb-4`}>
                {loc(L(`اعترافات واعتمادات ${name}`, `${name} Akreditasyonları`, `Accreditations of ${name}`))}
              </h2>

              <div className="sf-prose whitespace-pre-line">
                {translation.accreditationInfo ||
                  loc(
                    L(
                      'الجامعة معتمدة من مجلس التعليم العالي التركي (YÖK)، وشهاداتها معترف بها في تركيا ومعظم الدول العربية والأوروبية بعد إجراءات المعادلة المعتادة. كما تشترك الجامعة في اتفاقيات التبادل الطلابي الأوروبي Erasmus+ وتعتمد نظام النقاط الأوروبي ECTS.',
                      'Üniversite YÖK tarafından tanınmaktadır; diplomaları Türkiye’de ve denklik işlemleri sonrası birçok ülkede geçerlidir. Avrupa Kredi Transfer Sistemi (ECTS) uygulanır ve Erasmus+ değişim anlaşmaları mevcuttur.',
                      'The university is recognised by the Turkish Council of Higher Education (YÖK); its diplomas are valid in Turkey and, after standard equivalency procedures, in many other countries. It applies the ECTS credit system and holds Erasmus+ exchange agreements.'
                    )
                  )}
              </div>

              {guide.recognitions && (
                <div className="mt-6 pt-4 border-t border-[#dee2e6]">
                  <h3 className="text-lg font-bold text-metallic-blue mb-3 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#67b98a]" />
                    <span>{guide.recognitions.title}</span>
                  </h3>
                  <p className="text-base font-light text-[#4a4a4a] leading-relaxed mb-4">
                    {guide.recognitions.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {guide.recognitions.countries?.map((c, i) => (
                      <span
                        key={i}
                        className="py-1.5 px-3 rounded-lg bg-[#f7f5f2] text-sm font-medium text-main-color border border-[#dee2e6] inline-flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4 text-[#67b98a]" />
                        <span>{c}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {guide.erasmus && (
                <div className="mt-6 pt-4 border-t border-[#dee2e6]">
                  <h3 className="text-lg font-bold text-metallic-blue mb-2 flex items-center gap-2">
                    <Plane className="w-5 h-5 text-beer" />
                    <span>{guide.erasmus.title}</span>
                  </h3>
                  <p className="text-base font-light text-[#4a4a4a] leading-relaxed">
                    {guide.erasmus.content}
                  </p>
                </div>
              )}

              {university.showNotarySection !== false && (
                <div className="mt-6 pt-6 border-t border-[#dee2e6]">
                  <NotaryTranslationEquivalencySection />
                </div>
              )}
            </article>
          )}

          {activeTab === 'faqs' && (
            <article className={TAB_PANEL}>
              <h2 className={`${PANEL_TITLE} mb-4`}>
                {loc(
                  L(
                    `الأسئلة الشائعة حول ${name}`,
                    `${name} Sıkça Sorulan Sorular`,
                    `Frequently Asked Questions about ${name}`
                  )
                )}
              </h2>

              <ul className="flex flex-col gap-3">
                {faqItems.map((item, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <li key={idx} className="bg-[#f7f5f2] rounded-lg overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full py-4 px-4 flex items-center justify-between gap-3 text-start"
                      >
                        <span className={`text-base ${isOpen ? 'font-bold text-main-color' : 'font-normal text-metallic-blue'}`}>
                          {loc(item.q)}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 text-[#707070] transition-transform duration-300 ${
                            isOpen ? 'rotate-180 text-beer' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-3 text-base font-light leading-[1.9] text-main-color border-t border-[#dee2e6] whitespace-pre-line">
                          {loc(item.a)}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </article>
          )}
        </div>

        {/* YAPIŞKAN YAN PANEL — StudyFans: md:basis-[34.6%] */}
        <aside className="w-full md:basis-[34.6%] flex flex-col gap-4 md:sticky md:top-[var(--sf-header-h)]">
          {/* Üniversite fotoğrafı + logosu (video yerine) */}
          <div className="bg-white rounded-lg drop-shadow-xl overflow-hidden">
            <div className="relative h-[200px] overflow-hidden group">
              <img
                src={university.coverImageUrl || FALLBACK_COVER}
                alt={name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.8] transition-transform duration-300 group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_COVER;
                }}
              />
              <span className="absolute w-[60%] h-[200%] -top-[50px] -left-[33px] rotate-[-30deg] bg-[#005b94a6] z-0 pointer-events-none" />

              <h2 className="absolute top-4 end-4 z-10 max-w-[65%] text-white font-bold text-xl text-end capitalize">
                {name}
              </h2>

              <span className="absolute bottom-4 start-4 z-10 w-[70px] h-[70px] rounded-full bg-white p-1.5 drop-shadow-lg flex items-center justify-center overflow-hidden">
                <img
                  src={university.logoUrl || university.coverImageUrl || FALLBACK_COVER}
                  alt={name}
                  loading="lazy"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_COVER;
                  }}
                />
              </span>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {annual !== null && (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    {hasDiscount && (
                      <span className="line-through text-gray-500 text-lg font-bold">
                        {annual.toLocaleString('en-US')}
                        {currency}
                      </span>
                    )}
                    <span className="text-lg font-bold text-main-color">
                      {discounted.toLocaleString('en-US')}
                      {currency}
                    </span>
                  </div>
                  {hasDiscount && (
                    <span className="py-1 px-2 rounded bg-[#67b98a] text-white text-sm font-bold">
                      {t('discount')} %{discountPercent}
                    </span>
                  )}
                </div>
              )}

              <ul className="flex flex-col">
                {sidebarStats.map((row) => (
                  <li key={row.label} className={STAT_ROW}>
                    <span className={STAT_LABEL}>{row.label}</span>
                    <strong className={STAT_VALUE}>{row.value}</strong>
                  </li>
                ))}
              </ul>

              <a href={waApplyUrl} target="_blank" rel="noopener noreferrer" className={`w-full ${SF_BTN}`}>
                <MessageCircle className="w-5 h-5 fill-white shrink-0" />
                <span>{t('contactWhatsapp')}</span>
              </a>
            </div>
          </div>

          {/* StudyFans Style Free Consultation Card */}
          <div className="bg-white rounded-lg drop-shadow-xl p-5 flex flex-col gap-3 border border-[#dee2e6]/60">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-beer/10 text-beer flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-main-color">
                  {loc(L('استشارة وقبول مجاني 100%', 'Ücretsiz Danışmanlık ve Kabul', '100% Free Advice & Admission'))}
                </h3>
                <span className="text-xs text-[#707070]">
                  {loc(L('وكيل رسمي معتمد في تركيا', 'Türkiye Resmi Yetkili Acentesi', 'Official Authorized Agency'))}
                </span>
              </div>
            </div>
            <p className="text-sm font-light text-[#4a4a4a] leading-relaxed">
              {loc(
                L(
                  'نقدم لك استشارة تعليمية كاملة، ونضمن لك الحصول على قبولك الجامعي وخصم خاص على الأقساط مجاناً وبدون أي أتعاب.',
                  'Uzman kadromuzla ücretsiz üniversite tercih danışmanlığı, garantili kabul ve harç indirimi sağlıyoruz.',
                  'We provide complete guidance, guaranteed official admission and exclusive tuition discounts free of charge.'
                )
              )}
            </p>
            <a
              href={waApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold text-center transition-colors inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{loc(L('تواصل مع المستشار التعليمي', 'Danışmanla Görüş', 'Chat with an Advisor'))}</span>
            </a>
          </div>
        </aside>
      </section>

      {/* جامعات مشابهة — En Altta */}
      {related.length > 0 && (
        <section className="sf-container px-4 mt-12">
          <div className="bg-white rounded-lg drop-shadow-xl p-5 sm:p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#dee2e6]">
              <h2 className="text-xl sm:text-[1.375rem] font-bold text-main-color">{t('relatedTitle')}</h2>
              <Link to="/universities" className="text-base font-light text-azure hover:text-beer transition-colors">
                {t('seeAll')}
              </Link>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.slice(0, 6).map((relUni) => {
                const relName = resolveUniversityName(relUni, currentLang);
                return (
                  <li key={relUni.id || relUni.slug} className="p-2.5 rounded-lg bg-[#f7f5f2] hover:bg-[#eae6e1] transition-colors border border-[#dee2e6]/60">
                    <Link to={`/universities/${relUni.slug}`} className="flex items-center gap-3 group">
                      <span className="w-[75px] h-[75px] shrink-0 rounded-lg bg-white p-1.5 flex items-center justify-center overflow-hidden border border-[#dee2e6]/50">
                        <img
                          src={relUni.logoUrl || relUni.coverImageUrl || FALLBACK_COVER}
                          alt={relName}
                          loading="lazy"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_COVER;
                          }}
                        />
                      </span>
                      <div className="min-w-0 flex flex-col gap-1">
                        <h3 className="text-base sm:text-lg font-bold text-metallic-blue capitalize truncate group-hover:text-beer transition-colors">
                          {relName}
                        </h3>
                        <span className="inline-flex items-center gap-1.5 text-sm font-light text-[#707070]">
                          <MapPin className="w-3.5 h-3.5 text-beer shrink-0" />
                          {relUni.city}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {otherUniversities.length > 0 && (
        <section className="sf-container px-4 mt-12 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl sm:text-[1.625rem] font-bold text-main-color">{t('otherTitle')}</h2>
            <Link
              to="/universities"
              className="inline-flex items-center gap-1.5 text-base font-light text-azure hover:text-beer transition-colors"
            >
              <span>{t('seeAll')}</span>
              <ArrowRight className="w-4 h-4 flip-in-rtl" />
            </Link>
          </div>

          <div className="grid gap-8 px-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto w-full">
            {otherUniversities.slice(0, 3).map((u) => (
              <UniversityCard key={u.id || u.slug} university={u} />
            ))}
          </div>
        </section>
      )}

      <section className="sf-container px-4 mt-12">
        <div className="bg-white rounded-lg drop-shadow-xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-[1.625rem] font-bold text-main-color">
              {loc(
                L(
                  'هل لديك أي استفسار حول الجامعة؟',
                  'Üniversite hakkında sorularınız mı var?',
                  'Any questions about this university?'
                )
              )}
            </h2>
            <p className="text-base font-light text-[#707070] max-w-2xl leading-[1.9]">
              {loc(
                L(
                  'فريقنا جاهز لمساعدتك في الحصول على قبول جامعي معتمد والرد على كافة استفساراتك فوراً ومجاناً.',
                  'Uzman danışmanlarımız kabul şartları ve kayıt süreçleri hakkında ücretsiz olarak sizi bilgilendirir.',
                  'Our advisors are ready to help you secure an official acceptance letter and answer every question, free of charge.'
                )
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 shrink-0">
            <a href={waApplyUrl} target="_blank" rel="noopener noreferrer" className={SF_BTN}>
              <MessageCircle className="w-5 h-5 fill-white shrink-0" />
              <span>{t('contactWhatsapp')}</span>
            </a>
            <Link
              to="/universities"
              className="py-3 px-7 rounded-lg border border-[#dee2e6] hover:border-beer text-main-color text-base font-normal text-center transition-colors inline-flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-beer shrink-0" />
              <span>{t('browseAll')}</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
