// Footer varsayılanları: admin ayarı boşsa site yine dolu görünür.
export const DEFAULT_FOOTER_COLUMNS = [
  {
    id: 'universities',
    titleAr: 'الجامعات',
    titleTr: 'Üniversiteler',
    titleEn: 'Universities',
    links: [
      { labelAr: 'جامعة إسطنبول ميدي بول', labelTr: 'İstanbul Medipol Üniversitesi', labelEn: 'Istanbul Medipol University', url: '/universities/istanbul-medipol-university' },
      { labelAr: 'جامعة بهتشه شهير', labelTr: 'Bahçeşehir Üniversitesi', labelEn: 'Bahçeşehir University', url: '/universities/bahcesehir-university' },
      { labelAr: 'جامعة كوتش', labelTr: 'Koç Üniversitesi', labelEn: 'Koç University', url: '/universities/koc-university' },
      { labelAr: 'جامعة سابانجي', labelTr: 'Sabancı Üniversitesi', labelEn: 'Sabancı University', url: '/universities/sabanci-university' },
      { labelAr: 'جامعة إسطنبول', labelTr: 'İstanbul Üniversitesi', labelEn: 'Istanbul University', url: '/universities/istanbul-universitesi' },
    ],
  },
  {
    id: 'services',
    titleAr: 'الخدمات',
    titleTr: 'Hizmetler',
    titleEn: 'Services',
    links: [
      { labelAr: 'القبول الجامعي', labelTr: 'Üniversite Kabulü', labelEn: 'University Admissions', url: '/services/university-admissions' },
      { labelAr: 'معادلة الشهادات', labelTr: 'Denklik Danışmanlığı', labelEn: 'Diploma Equivalency', url: '/services/denklik-equivalency' },
      { labelAr: 'الإقامة الطلابية', labelTr: 'Öğrenci İkamet İzni', labelEn: 'Student Residence Permit', url: '/services/student-residence-permit' },
      { labelAr: 'الاستقبال والسكن', labelTr: 'Havalimanı ve Konaklama', labelEn: 'Airport Pickup & Housing', url: '/services/airport-pickup-housing' },
      { labelAr: 'دورات اليوس والتومر', labelTr: 'YÖS, TÖMER ve SAT Kursları', labelEn: 'YÖS, TÖMER & SAT Prep', url: '/courses' },
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
