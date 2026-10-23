// Admin menü ayarı (nav_items) boş veya bozuksa kullanılacak yedek menü.
export const FALLBACK_NAV_ITEMS = [
  { id: 'home', labelAr: 'الرئيسية', labelTr: 'Ana Sayfa', labelEn: 'Home', url: '/', enabled: true },
  {
    id: 'universities',
    labelAr: 'الجامعات',
    labelTr: 'Üniversiteler',
    labelEn: 'Universities',
    url: '/universities',
    enabled: true,
    children: [
      { id: 'uni-all', labelAr: 'جميع الجامعات (+120)', labelTr: 'Tüm Üniversiteler (+120)', labelEn: 'All Universities (+120)', url: '/universities', enabled: true },
      { id: 'uni-public', labelAr: '🏛️ الجامعات الحكومية', labelTr: '🏛️ Devlet Üniversiteleri', labelEn: '🏛️ Public Universities', url: '/universities?type=PUBLIC', enabled: true },
      { id: 'uni-private', labelAr: '🏢 الجامعات الخاصة', labelTr: '🏢 Vakıf Üniversiteleri', labelEn: '🏢 Private Universities', url: '/universities?type=PRIVATE', enabled: true },
      { id: 'uni-grad', labelAr: '🎓 برامج الماجستير والدكتوراه', labelTr: '🎓 Yüksek Lisans & Doktora', labelEn: '🎓 Graduate Programs', url: '/universities?graduateAdmissionOpen=true', enabled: true },
    ],
  },
  { id: 'programs', labelAr: 'التخصصات', labelTr: 'Bölümler', labelEn: 'Programs', url: '/programs', enabled: true },
  { id: 'scholarships', labelAr: 'المنح الدراسية', labelTr: 'Burslar', labelEn: 'Scholarships', url: '/scholarships', enabled: true, highlight: true },
  { id: 'services', labelAr: 'الخدمات', labelTr: 'Hizmetler', labelEn: 'Services', url: '/services', enabled: true },
  {
    id: 'more',
    labelAr: 'المزيد',
    labelTr: 'Daha Fazla',
    labelEn: 'More',
    url: '',
    enabled: true,
    children: [
      { id: 'courses', labelAr: 'الدورات', labelTr: 'Kurslar', labelEn: 'Courses', url: '/courses', enabled: true },
      { id: 'blog', labelAr: 'المدونة', labelTr: 'Blog', labelEn: 'Blog', url: '/blog', enabled: true },
      { id: 'about', labelAr: 'من نحن', labelTr: 'Hakkımızda', labelEn: 'About', url: '/about', enabled: true },
      { id: 'contact', labelAr: 'اتصل بنا', labelTr: 'İletişim', labelEn: 'Contact', url: '/contact', enabled: true },
    ],
  },
];

export const LANG_LABEL_KEY = { ar: 'labelAr', tr: 'labelTr', en: 'labelEn' };
