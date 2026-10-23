// Ana sayfa bölümlerinin yedek (fallback) metinleri.
// Admin panelinde ilgili ayar boşsa bu değerler kullanılır; site asla boş kalmaz.

export const SITE_NAME_FALLBACK = {
  ar: 'أفضل الجامعات التركية',
  tr: 'Türkiye’nin En Prestijli Üniversiteleri',
  en: 'Premier Turkish Universities',
};

export const DEFAULT_HERO_PILLARS = [
  { ar: 'قبول رسمي وموثق', tr: 'Resmi Onaylı Kabul', en: 'Official Verified Admission' },
  { ar: 'بكالوريوس ودراسات عليا', tr: 'Lisans & Lisansüstü', en: 'Undergraduate & Graduate' },
  { ar: '+120 جامعة حكومية وخاصة', tr: '+120 Devlet & Vakıf Üniversitesi', en: '+120 Public & Private Unis' },
];

export const UNIVERSITIES_KICKER = {
  ar: '🏛️ دليل الجامعات التركية المعتمدة (حكومية وخاصة)',
  tr: '🏛️ Akredite Türk Devlet ve Vakıf Üniversiteleri Rehberi',
  en: '🏛️ Accredited Turkish Public & Private Universities Guide',
};

export const UNIVERSITIES_TITLE = {
  ar: 'استكشف أهم الجامعات التركية الحكومية والخاصة',
  tr: 'Öne Çıkan Türk Devlet ve Vakıf Üniversiteleri',
  en: 'Discover Premier Turkish Public & Private Universities',
};

export const UNIVERSITIES_SUBTITLE = {
  ar: 'تصفح قائمة الجامعات الحكومية والجامعات الخاصة المعتمدة للبكالوريوس والماجستير والدكتوراه.',
  tr: 'Devlet üniversiteleri ve önde gelen vakıf üniversitelerinin lisans ve yüksek lisans kontenjanlarını inceleyin.',
  en: 'Explore Turkish state universities and top foundation universities offering undergraduate and graduate admissions.',
};

export const GRADUATE_TITLE = {
  ar: 'برامج الماجستير والدكتوراه في الجامعات الحكومية والخاصة',
  tr: 'Devlet ve Vakıf Üniversitelerinde Tezli/Tezsiz Yüksek Lisans',
  en: 'Master’s & PhD Programs at Turkish Universities',
};

export const GRADUATE_DESC = {
  ar: 'نوفر دعماً أكاديمياً شاملاً للطلاب الدوليين الراغبين في إكمال الماجستير والدكتوراه في أفضل الجامعات التركية: تدقيق الأوراق، ترجمة وتصديق الشهادة، كتابة رسالة الدافع، ومتابعة الاعتراف ومعادلة YÖK.',
  tr: 'Tezli veya tezsiz yüksek lisans ve doktora başvurularınızda dosya hazırlığı, yeminli tercüme, YÖK tanıma/denklik belgesi, niyet mektubu ve akademik kabul takip hizmeti.',
  en: 'End-to-end admission guidance for international graduate applicants: credential evaluation, sworn translation, YÖK recognition, Statement of Purpose refinement, and direct faculty placement.',
};

export const UNIVERSITIES_VIEW_ALL = {
  ar: 'تصفح جميع الـ +120 جامعة',
  tr: '+120 Üniversitenin Tamamını Gör',
  en: 'View All +120 Universities',
};

export const UNI_FILTER_PILLS = [
  { id: 'ALL', labelAr: 'جميع الجامعات', labelTr: 'Tümü', labelEn: 'All Universities' },
  { id: 'PUBLIC', labelAr: '🏛️ الجامعات الحكومية (Devlet)', labelTr: '🏛️ Devlet Üniversiteleri', labelEn: '🏛️ State Universities' },
  { id: 'GRADUATE', labelAr: '🎓 ماجستير ودكتوراه متاح', labelTr: '🎓 Yüksek Lisans & Doktora', labelEn: '🎓 Graduate Admissions' },
  { id: 'OPEN', labelAr: '🟢 مفتوحة للتسجيل الآن', labelTr: '🟢 Başvurusu Açık Olanlar', labelEn: '🟢 Open Applications' },
  { id: 'PRIVATE', labelAr: '🏢 الجامعات الخاصة (Vakıf)', labelTr: '🏢 Vakıf Üniversiteleri', labelEn: '🏢 Foundation Universities' },
];

export const GRADUATE_BADGE = {
  ar: 'المركز المعتمد للقبول في الدراسات العليا في تركيا',
  tr: 'Türkiye Lisansüstü (Yüksek Lisans & Doktora) Kabul Merkezi',
  en: 'Accredited Graduate & Master’s Admissions Center in Turkey',
};

export const GRADUATE_CARDS = [
  {
    color: 'text-brand-amber-300',
    title: { ar: 'ماجستير بأطروحة', tr: 'Tezli Yüksek Lisans', en: 'Master with Thesis' },
    desc: {
      ar: 'سنتان أكاديميتان - مسار بحثي وتدريس جامعي',
      tr: '2 yıl - Akademik kariyer ve araştırma',
      en: '2 years - Academic & PhD track',
    },
  },
  {
    color: 'text-emerald-400',
    title: { ar: 'ماجستير بدون أطروحة', tr: 'Tezsiz Yüksek Lisans', en: 'Master Non-Thesis' },
    desc: {
      ar: 'سنة ونصف - تطوير مهني وساعات مسائية مرنة',
      tr: '1-1.5 yıl - Profesyonel kariyer odaklı',
      en: '1-1.5 yrs - Career acceleration',
    },
  },
  {
    color: 'text-sky-400',
    title: { ar: 'الدكتوراه (PhD)', tr: 'Doktora (PhD)', en: 'Doctorate (PhD)' },
    desc: {
      ar: '4 سنوات - نشر علمي وأبحاث متقدمة',
      tr: '4 yıl - İleri düzey bilimsel araştırma',
      en: '4 years - Advanced scholarly research',
    },
  },
];

export const GRADUATE_CTA = {
  ar: 'قدّم على الماجستير الآن',
  tr: 'Yüksek Lisans Başvurusu Yap',
  en: 'Apply for Master’s Degree',
};

export const GRADUATE_SECONDARY = {
  ar: 'دليل معادلة الشهادات وترجمتها',
  tr: 'Denklik ve Tercüme Rehberi',
  en: 'Equivalency & Translation Guide',
};

export const PROGRAMS_VIEW_ALL = {
  ar: 'تصفح كافة التخصصات',
  tr: 'Tüm Programları İncele',
  en: 'Browse All Majors',
};

export const SCHOLARSHIPS_VIEW_ALL = {
  ar: 'دليل المنح كاملاً',
  tr: 'Tüm Bursları İncele',
  en: 'All Scholarships',
};

export const BLOG_VIEW_ALL = {
  ar: 'زيارة المدونة',
  tr: 'Blogu Ziyaret Et',
  en: 'Visit Blog',
};

export const CTA_WHATSAPP = {
  ar: 'استشارة فورية واتساب',
  tr: 'Hızlı WhatsApp Destek',
  en: 'Instant WhatsApp',
};

export const CTA_TITLE = {
  ar: 'جاهز لبدء رحلتك الجامعية في تركيا؟',
  tr: 'Türkiye’de Üniversite Yolculuğunuza Başlamaya Hazır mısınız?',
  en: 'Ready to Start Your University Journey in Turkey?',
};

export const CTA_DESC = {
  ar: 'قدّم طلبك الآن وسيقوم مستشارك الأكاديمي المختص بالتواصل معك وتأمين قبولك الجامعي الرسمي والبدء بتجهيز ملفك وترجمته.',
  tr: 'Hemen başvurun, uzman eğitim danışmanımız sizinle iletişime geçip resmi kabul ve tercüme işlemlerinizi başlatsın.',
  en: 'Submit your application today and an expert advisor will guide you through securing your official admission and processing your documents.',
};

export const STATS_LABELS = {
  programs: { ar: 'برنامج وتخصص أكاديمي', tr: 'Akademik Program', en: 'Academic Programs' },
  graduate: { ar: 'جامعة توفر دراسات عليا', tr: 'Lisansüstü Açık Üniversite', en: 'Graduate Universities' },
  universities: { ar: 'جامعة معتمدة (حكومية وخاصة)', tr: 'Devlet & Vakıf Üniversitesi', en: 'Accredited Universities' },
};
