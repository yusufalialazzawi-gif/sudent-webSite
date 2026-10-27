// Footer varsayılanları: admin ayarı boşsa site yine dolu görünür.
export const DEFAULT_FOOTER_COLUMNS = [
  {
    id: 'quick_links',
    titleAr: 'روابط سريعة',
    titleTr: 'Hızlı Bağlantılar',
    titleEn: 'Quick Links',
    links: [
      { labelAr: 'الجامعات الخاصة والمعتمدة', labelTr: 'Akredite Üniversiteler', labelEn: 'Accredited Universities', url: '/universities' },
      { labelAr: 'البرامج والتخصصات الدراسية', labelTr: 'Bölümler ve Programlar', labelEn: 'Academic Programs', url: '/programs' },
      { labelAr: 'خدماتنا للطلاب', labelTr: 'Öğrenci Hizmetlerimiz', labelEn: 'Student Services', url: '/services' },
      { labelAr: 'المدونة ومقالات الدراسة', labelTr: 'Eğitim Blogu', labelEn: 'Education Blog', url: '/blog' },
      { labelAr: 'كن وكيلنا التعليمي', labelTr: 'Acente Başvurusu', labelEn: 'Be Our Agent', url: '/contact' },
      { labelAr: 'الأسئلة الشائعة', labelTr: 'Sıkça Sorulan Sorular', labelEn: 'FAQs', url: '/contact#faqs' },
    ],
  },
  {
    id: 'policies_info',
    titleAr: 'السياسات والمعلومات',
    titleTr: 'Kurumsal & Bilgi',
    titleEn: 'Policies & Info',
    links: [
      { labelAr: 'من نحن', labelTr: 'Hakkımızda', labelEn: 'About Us', url: '/about' },
      { labelAr: 'الفعاليات والمعارض الدولية', labelTr: 'Eğitim Fuarları ve Etkinlikler', labelEn: 'Events & Fairs', url: '/about' },
      { labelAr: 'سياسة الخصوصية', labelTr: 'Gizlilik Politikası', labelEn: 'Privacy Policy', url: '/privacy' },
      { labelAr: 'سياسة ملفات الارتباط (Cookies)', labelTr: 'Çerez Politikası', labelEn: 'Cookie Policy', url: '/privacy' },
      { labelAr: 'حقوق حماية البيانات (GDPR & KVKK)', labelTr: 'KVKK & GDPR Uyumu', labelEn: 'GDPR Rights', url: '/privacy' },
    ],
  },
];

export const SOCIAL_CHANNELS = [
  { key: 'social_instagram', title: 'Instagram', icon: '📸', hover: 'hover:bg-brand-amber-500' },
  { key: 'social_telegram', title: 'Telegram', icon: '✈️', hover: 'hover:bg-sky-500' },
  { key: 'social_facebook', title: 'Facebook', icon: '📘', hover: 'hover:bg-blue-600' },
  { key: 'social_youtube', title: 'YouTube', icon: '▶️', hover: 'hover:bg-red-600' },
  { key: 'social_tiktok', title: 'TikTok', icon: '🎵', hover: 'hover:bg-black' },
  { key: 'social_twitter', title: 'X / Twitter', icon: '𝕏', hover: 'hover:bg-slate-700' },
  { key: 'social_linkedin', title: 'LinkedIn', icon: '💼', hover: 'hover:bg-sky-700' },
];

export const SOCIAL_HEADING = {
  ar: 'تابعنا على منصات التواصل',
  tr: 'Sosyal Medyada Biz',
  en: 'Follow Our Channels',
};
