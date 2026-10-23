// Tek doğruluk kaynağı: sitedeki TÜM admin ayarlanabilir alanlar.
// Hem seed (varsayılan değerler) hem de admin panel formu bu katalogdan üretilir.
// Yeni bir ayar eklemek için sadece buraya alan eklemek yeterlidir.

export const SETTINGS_GROUPS = [
  { id: 'BRANDING', icon: 'Building2', labelTr: 'Marka & Site Kimliği', labelAr: 'الهوية واسم الموقع', labelEn: 'Branding & Identity' },
  { id: 'NAVBAR', icon: 'Menu', labelTr: 'Üst Menü (Navbar)', labelAr: 'القائمة العلوية', labelEn: 'Navigation Menu' },
  { id: 'HERO', icon: 'Image', labelTr: 'Ana Sayfa Hero & Arka Plan Fotoğrafları', labelAr: 'الواجهة والصور الخلفية', labelEn: 'Hero & Background Images' },
  { id: 'HOME', icon: 'LayoutGrid', labelTr: 'Ana Sayfa Bölümleri', labelAr: 'أقسام الصفحة الرئيسية', labelEn: 'Homepage Sections' },
  { id: 'ABOUT', icon: 'FileText', labelTr: 'Hakkımızda Metinleri', labelAr: 'نصوص من نحن', labelEn: 'About Us Content' },
  { id: 'FOOTER', icon: 'PanelBottom', labelTr: 'Alt Bilgi (Footer)', labelAr: 'تذييل الموقع', labelEn: 'Footer' },
  { id: 'CONTACT', icon: 'Phone', labelTr: 'İletişim & Adres', labelAr: 'بيانات الاتصال', labelEn: 'Contact & Location' },
  { id: 'WHATSAPP', icon: 'MessageSquare', labelTr: 'WhatsApp', labelAr: 'واتساب', labelEn: 'WhatsApp' },
  { id: 'SOCIAL', icon: 'Share2', labelTr: 'Sosyal Medya', labelAr: 'وسائل التواصل', labelEn: 'Social Media' },
  { id: 'THEME', icon: 'Palette', labelTr: 'Renk & Görünüm', labelAr: 'الألوان والمظهر', labelEn: 'Theme & Colors' },
  { id: 'SEO', icon: 'Search', labelTr: 'SEO & Meta', labelAr: 'تحسين محركات البحث', labelEn: 'SEO & Metadata' },
  { id: 'GENERAL', icon: 'Settings', labelTr: 'Genel', labelAr: 'عام', labelEn: 'General' },
];

const T = (base, labelTr, labelAr, labelEn, hintTr) => ({
  key: base,
  type: 'trilingual',
  labelTr,
  labelAr,
  labelEn,
  hintTr,
  defaults: { ar: '', tr: '', en: '' },
});

export const SETTINGS_FIELDS = [
  // ===================== BRANDING =====================
  { ...T('site_name', 'Site / Şirket Adı', 'اسم الموقع', 'Site name'), defaults: { ar: 'شركة المجد للخدمات الطلابية', tr: 'El-Mecd Öğrenci Hizmetleri', en: 'Al-Majd Student Services' } },
  { key: 'site_name', type: 'text', group: 'BRANDING', labelTr: 'Site Adı (tek satır, yedek)', labelAr: 'اسم الموقع', defaults: { value: 'شركة المجد للخدمات الطلابية' } },
  { ...T('site_slogan', 'Slogan', 'الشعار', 'Slogan'), defaults: { ar: 'بوابتك الأكاديمية للدراسة في تركيا 🇹🇷', tr: 'Türkiye Üniversite Başvuru Portalı 🇹🇷', en: 'Turkey University Admissions Portal 🇹🇷' } },
  { key: 'site_logo_url', type: 'image', group: 'BRANDING', labelTr: 'Site Logosu', labelAr: 'شعار الموقع', hintTr: 'Header ve footer’da kullanılan logo. Boş bırakılırsa /logo.jpg kullanılır.', defaults: { value: '/logo.jpg' } },
  { key: 'site_favicon_url', type: 'image', group: 'BRANDING', labelTr: 'Favicon', labelAr: 'أيقونة المتصفح', defaults: { value: '' } },
  { key: 'default_language', type: 'select', group: 'GENERAL', labelTr: 'Varsayılan Dil', labelAr: 'اللغة الافتراضية', options: ['ar', 'tr', 'en'], defaults: { value: 'ar' } },
  { key: 'supported_languages', type: 'text', group: 'GENERAL', labelTr: 'Desteklenen Diller (virgülle)', labelAr: 'اللغات المدعومة', defaults: { value: 'ar,tr,en' } },

  // ===================== NAVBAR =====================
  {
    key: 'nav_items',
    type: 'json-nav',
    group: 'NAVBAR',
    labelTr: 'Menü Öğeleri',
    labelAr: 'عناصر القائمة',
    hintTr: 'Menüdeki her bağlantıyı, sırasını, görünürlüğünü ve alt menülerini buradan yönetin.',
    defaults: {
      value: JSON.stringify([
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
      ]),
    },
  },
  { key: 'nav_sticky', type: 'boolean', group: 'NAVBAR', labelTr: 'Menü kaydırınca sabitlensin (sticky)', labelAr: 'تثبيت القائمة عند التمرير', defaults: { value: 'true' } },
  { key: 'nav_show_topbar', type: 'boolean', group: 'NAVBAR', labelTr: 'Üst duyuru çubuğunu göster', labelAr: 'إظهار الشريط العلوي', defaults: { value: 'true' } },
  {
    ...T('nav_topbar_badge', 'Üst Çubuk Rozet Metni', 'نص الشريط العلوي', 'Top bar badge'),
    defaults: {
      ar: 'قبولات الجامعات التركية الحكومية والخاصة لعام 2026-2027 مفتوحة الآن',
      tr: '2026-2027 Türkiye Devlet ve Vakıf Üniversite Başvuruları Açık',
      en: '2026-2027 Turkey Public & Private University Admissions Open',
    },
  },
  {
    ...T('nav_topbar_note', 'Üst Çubuk Açıklama Metni', 'وصف الشريط العلوي', 'Top bar note'),
    defaults: {
      ar: 'استشارات أكاديمية موثقة وخدمات قبولات جامعية ودراسات عليا معتمدة',
      tr: 'Lisans ve Lisansüstü Yetkili Danışmanlık ve Başvuru Hizmeti',
      en: 'Accredited Undergraduate & Graduate Admissions Consulting',
    },
  },
  { key: 'nav_show_phone', type: 'boolean', group: 'NAVBAR', labelTr: 'Üst çubukta WhatsApp/telefon göster', labelAr: 'إظهار الهاتف في الشريط العلوي', defaults: { value: 'true' } },
  { key: 'nav_show_lang_switcher', type: 'boolean', group: 'NAVBAR', labelTr: 'Dil değiştiriciyi göster', labelAr: 'إظهار مبدل اللغة', defaults: { value: 'true' } },
  { key: 'nav_show_admin_link', type: 'boolean', group: 'NAVBAR', labelTr: 'Üst çubukta "Admin Panel" bağlantısı', labelAr: 'إظهار رابط لوحة التحكم', defaults: { value: 'true' } },
  { key: 'nav_show_cta', type: 'boolean', group: 'NAVBAR', labelTr: '"Başvuru Yap" butonunu göster', labelAr: 'إظهار زر التقديم', defaults: { value: 'true' } },
  { key: 'nav_cta_url', type: 'text', group: 'NAVBAR', labelTr: 'Buton Linki', labelAr: 'رابط الزر', defaults: { value: '/apply' } },
  {
    ...T('nav_cta_label', 'Buton Yazısı', 'نص الزر', 'CTA label'),
    defaults: { ar: 'قدّم الآن', tr: 'Başvuru Yap', en: 'Apply Now' },
  },

  // ===================== HERO (ana sayfa üst alan + arka plan fotoğrafları) =====================
  { key: 'hero_background_mode', type: 'select', group: 'HERO', labelTr: 'Arka Plan Modu', labelAr: 'وضع الخلفية', options: ['slider', 'image', 'video'], hintTr: 'slider = birden fazla fotoğraf sırayla geçer, image = tek fotoğraf, video = mp4 video.', defaults: { value: 'slider' } },
  {
    key: 'hero_background_images',
    type: 'json-images',
    group: 'HERO',
    labelTr: 'Hero Arka Plan Fotoğrafları',
    labelAr: 'صور خلفية الواجهة',
    hintTr: 'Ana sayfanın en üstündeki büyük alanın arka plan fotoğrafları. Sıralayabilir, silebilir, medya kütüphanesinden seçebilirsiniz.',
    defaults: {
      value: JSON.stringify([
        { url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1600&auto=format&fit=crop&q=70', altAr: 'حرم جامعي في تركيا', altTr: 'Türkiye’de üniversite kampüsü', altEn: 'University campus in Turkey' },
        { url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&auto=format&fit=crop&q=70', altAr: 'طلاب في جامعة تركية', altTr: 'Türk üniversitesinde öğrenciler', altEn: 'Students at a Turkish university' },
        { url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=70', altAr: 'مبنى جامعة', altTr: 'Üniversite binası', altEn: 'University building' },
      ]),
    },
  },
  { key: 'hero_slider_interval', type: 'number', group: 'HERO', labelTr: 'Fotoğraf Geçiş Süresi (saniye)', labelAr: 'مدة تبديل الصور (ثانية)', defaults: { value: '6' } },
  { key: 'hero_overlay_opacity', type: 'number', group: 'HERO', labelTr: 'Koyu Katman Opaklığı (0-95)', labelAr: 'شفافية الطبقة الداكنة', defaults: { value: '70' } },
  { key: 'hero_video_url', type: 'text', group: 'HERO', labelTr: 'Hero Video Adresi (mp4)', labelAr: 'رابط فيديو الواجهة', defaults: { value: '/media/hero-campus.mp4' } },
  { key: 'hero_poster_url', type: 'image', group: 'HERO', labelTr: 'Video/Slider Yedek Fotoğrafı', labelAr: 'صورة احتياطية', defaults: { value: '' } },
  {
    ...T('hero_badge', 'Hero Rozet Metni', 'نص الشارة', 'Hero badge'),
    defaults: {
      ar: 'شركة المجد للخدمات الطلابية | ممثل معتمد لأكثر من 120 جامعة تركية',
      tr: 'El-Mecd Öğrenci Hizmetleri | +120 Türk Üniversitesinin Yetkili Temsilcisi',
      en: 'Al-Majd Student Services | Authorized Representative for +120 Turkish Universities',
    },
  },
  {
    ...T('hero_title', 'Hero Başlık', 'العنوان الرئيسي', 'Hero title'),
    defaults: {
      ar: 'بدايتك الموثوقة نحو الدراسة في تركيا',
      tr: 'Türkiye’de Üniversite Eğitimine Güvenli Başlangıç',
      en: 'Your Trusted Gateway to Study in Turkey',
    },
  },
  {
    ...T('hero_title_highlight', 'Hero Başlık 2. Satırı (turuncu vurgulu)', 'السطر الثاني المميز', 'Hero highlight line'),
    hintTr: 'Başlığın altındaki turuncu vurgulu satır. Boş bırakılırsa sadece tek satır başlık görünür.',
    defaults: {
      ar: 'أفضل الجامعات التركية',
      tr: 'Türkiye’nin En Prestijli Üniversiteleri',
      en: 'Premier Turkish Universities',
    },
  },
  {
    ...T('hero_desc', 'Hero Açıklama', 'وصف الواجهة', 'Hero description'),
    defaults: {
      ar: 'سنوات من الخبرة ومئات الطلاب: نرافقك خطوة بخطوة للحصول على قبولك الجامعي الرسمي والمنح الدراسية في تركيا مع استشارات مخصصة.',
      tr: 'Yılların tecrübesi ve yüzlerce başarılı öğrenci: Türkiye’de devlet ve vakıf üniversitesi kabulleri, burslar ve vize süreçlerinde profesyonel rehberlik.',
      en: 'Years of experience and hundreds of students: Guiding you step-by-step toward official university admissions and scholarships in Turkey.',
    },
  },
  { key: 'hero_pillars', type: 'json-list', group: 'HERO', labelTr: 'Hero Güven Rozetleri (madde listesi)', labelAr: 'شارات الثقة', hintTr: 'Hero altındaki küçük onay rozetleri.', defaults: { value: JSON.stringify([
    { ar: 'قبول رسمي وموثق', tr: 'Resmi Onaylı Kabul', en: 'Official Verified Admission' },
    { ar: 'بكالوريوس ودراسات عليا', tr: 'Lisans & Lisansüstü', en: 'Undergraduate & Graduate' },
    { ar: '+120 جامعة حكومية وخاصة', tr: '+120 Devlet & Vakıf Üniversitesi', en: '+120 Public & Private Unis' },
  ]) } },
  { key: 'hero_cta_primary_url', type: 'text', group: 'HERO', labelTr: '1. Buton Linki', labelAr: 'رابط الزر الأول', defaults: { value: '/apply' } },
  { ...T('hero_cta_primary_label', '1. Buton Yazısı', 'نص الزر الأول', 'Primary CTA'), defaults: { ar: 'قدّم طلبك الآن', tr: 'Hemen Başvur', en: 'Apply Now' } },
  { key: 'hero_cta_secondary_url', type: 'text', group: 'HERO', labelTr: '2. Buton Linki', labelAr: 'رابط الزر الثاني', defaults: { value: '/universities' } },
  { ...T('hero_cta_secondary_label', '2. Buton Yazısı', 'نص الزر الثاني', 'Secondary CTA'), defaults: { ar: 'استكشف الجامعات', tr: 'Üniversiteleri Keşfet', en: 'Explore Universities' } },

  // ===================== HOME sections =====================
  { key: 'home_stats', type: 'json-stats', group: 'HOME', labelTr: 'Sayaçlar (Rakamlarla Biz)', labelAr: 'الإحصاءات', hintTr: 'Boş bırakılırsa sistem gerçek veritabanı sayılarını kullanır.', defaults: { value: '' } },
  { ...T('home_universities_title', 'Üniversiteler Bölümü Başlığı', 'عنوان قسم الجامعات', 'Universities title'), defaults: { ar: 'استكشف أهم الجامعات التركية الحكومية والخاصة', tr: 'Öne Çıkan Türk Devlet ve Vakıf Üniversiteleri', en: 'Discover Premier Turkish Public & Private Universities' } },
  { ...T('home_universities_subtitle', 'Üniversiteler Bölümü Alt Yazısı', 'الوصف', 'Universities subtitle'), defaults: { ar: 'تصفح الجامعات الحكومية والخاصة المعتمدة للبكالوريوس والماجستير والدكتوراه.', tr: 'Devlet ve vakıf üniversitelerinin lisans ve yüksek lisans kontenjanlarını inceleyin.', en: 'Browse accredited public and foundation universities for undergraduate and graduate admissions.' } },
  { key: 'home_universities_bg', type: 'image', group: 'HOME', labelTr: 'Üniversiteler Bölümü Arka Plan Fotoğrafı', labelAr: 'صورة خلفية قسم الجامعات', defaults: { value: '' } },
  { ...T('home_graduate_title', 'Yüksek Lisans Vitrini Başlığı', 'عنوان قسم الدراسات العليا', 'Graduate title'), defaults: { ar: 'برامج الماجستير والدكتوراه في الجامعات الحكومية والخاصة', tr: 'Devlet ve Vakıf Üniversitelerinde Tezli/Tezsiz Yüksek Lisans', en: 'Master’s & PhD Programs at Turkish Universities' } },
  { ...T('home_graduate_desc', 'Yüksek Lisans Vitrini Açıklaması', 'وصف الدراسات العليا', 'Graduate description'), defaults: { ar: 'نوفر دعماً أكاديمياً شاملاً للطلاب الدوليين الراغبين في إكمال الماجستير والدكتوراه في أفضل الجامعات التركية.', tr: 'Tezli veya tezsiz yüksek lisans ve doktora başvurularınızda dosya hazırlığı, yeminli tercüme, YÖK tanıma/denklik belgesi ve niyet mektubu hizmeti.', en: 'End-to-end admission guidance for international graduate applicants: credential evaluation, sworn translation, YÖK recognition and SOP refinement.' } },
  { key: 'home_graduate_bg', type: 'image', group: 'HOME', labelTr: 'Yüksek Lisans Bölümü Arka Plan Fotoğrafı', labelAr: 'صورة خلفية الدراسات العليا', defaults: { value: '' } },
  { ...T('home_programs_title', 'Bölümler Bölümü Başlığı', 'عنوان قسم التخصصات', 'Programs title'), defaults: { ar: 'التخصصات الأكثر طلباً', tr: 'En Çok Tercih Edilen Bölümler', en: 'Top In-Demand Majors' } },
  { ...T('home_services_title', 'Hizmetler Bölümü Başlığı', 'عنوان قسم الخدمات', 'Services title'), defaults: { ar: 'خدمات طلابية متكاملة تضمن راحة بالك', tr: 'A’dan Z’ye Kapsamlı Öğrenci Hizmetleri', en: 'Complete End-to-End Student Services' } },
  { key: 'home_services_bg', type: 'image', group: 'HOME', labelTr: 'Hizmetler Bölümü Arka Plan Fotoğrafı', labelAr: 'صورة خلفية الخدمات', defaults: { value: '' } },
  { ...T('home_scholarships_title', 'Burslar Bölümü Başlığı', 'عنوان قسم المنح', 'Scholarships title'), defaults: { ar: 'فرص ومنح دراسية حصرية 2026 / 2027', tr: '2026 / 2027 Özel Burs Fırsatları', en: '2026 / 2027 Exclusive Scholarships & Waivers' } },
  { ...T('home_testimonials_title', 'Öğrenci Yorumları Başlığı', 'عنوان آراء الطلاب', 'Testimonials title'), defaults: { ar: 'آراء طلابنا', tr: 'Öğrencilerimiz Ne Diyor?', en: 'What Our Students Say' } },
  { ...T('home_blog_title', 'Blog Bölümü Başlığı', 'عنوان المدونة', 'Blog title'), defaults: { ar: 'أحدث المقالات ودليل المعيشة في تركيا', tr: 'Güncel Makaleler ve Türkiye Rehberi', en: 'Latest Articles & Study Guides' } },
  { ...T('home_cta_title', 'Alt CTA Başlığı', 'عنوان دعوة التسجيل', 'CTA title'), defaults: { ar: 'جاهز لبدء رحلتك الجامعية في تركيا؟', tr: 'Türkiye’de Üniversite Yolculuğunuza Başlamaya Hazır mısınız?', en: 'Ready to Start Your University Journey in Turkey?' } },
  { ...T('home_cta_desc', 'Alt CTA Açıklaması', 'وصف دعوة التسجيل', 'CTA description'), defaults: { ar: 'قدّم طلبك الآن وسيقوم مستشارك الأكاديمي بالتواصل معك وتأمين قبولك الجامعي الرسمي.', tr: 'Hemen başvurun, uzman eğitim danışmanımız sizinle iletişime geçip resmi kabul ve tercüme işlemlerinizi başlatsın.', en: 'Submit your application today and an expert advisor will guide you through securing your official admission.' } },
  { key: 'home_cta_bg', type: 'image', group: 'HOME', labelTr: 'Alt CTA Arka Plan Fotoğrafı', labelAr: 'صورة خلفية دعوة التسجيل', defaults: { value: '' } },

  // ===================== ABOUT =====================
  { ...T('about_hero_title', 'Hakkımızda Sayfa Başlığı', 'عنوان صفحة من نحن', 'About hero title'), defaults: { ar: 'من نحن؟ | شركة المجد للخدمات الطلابية', tr: 'Biz Kimiz? | El-Mecd Öğrenci Hizmetleri', en: 'About Us | Al-Majd Student Services' } },
  { ...T('about_tagline', 'Kısa Tanıtım Cümlesi', 'الجملة التعريفية', 'About tagline'), defaults: { ar: 'سنوات من الخبرة، ومئات الطلاب، وهدف واحد.', tr: 'Yılların tecrübesi, yüzlerce öğrenci ve tek bir hedef.', en: 'Years of experience, hundreds of students, one goal.' } },
  { key: 'about_p1_ar', type: 'textarea', group: 'ABOUT', labelTr: '1. Paragraf (Arapça)', labelAr: 'الفقرة الأولى', defaults: { value: '' } },
  { key: 'about_p1_tr', type: 'textarea', group: 'ABOUT', labelTr: '1. Paragraf (Türkçe)', labelAr: 'الفقرة الأولى (تركي)', defaults: { value: '' } },
  { key: 'about_p1_en', type: 'textarea', group: 'ABOUT', labelTr: '1. Paragraf (İngilizce)', labelAr: 'الفقرة الأولى (إنجليزي)', defaults: { value: '' } },
  { key: 'about_p2_ar', type: 'textarea', group: 'ABOUT', labelTr: '2. Paragraf (Arapça)', labelAr: 'الفقرة الثانية', defaults: { value: '' } },
  { key: 'about_p2_tr', type: 'textarea', group: 'ABOUT', labelTr: '2. Paragraf (Türkçe)', labelAr: 'الفقرة الثانية (تركي)', defaults: { value: '' } },
  { key: 'about_p2_en', type: 'textarea', group: 'ABOUT', labelTr: '2. Paragraf (İngilizce)', labelAr: 'الفقرة الثانية (إنجليزي)', defaults: { value: '' } },
  { key: 'about_p3_ar', type: 'textarea', group: 'ABOUT', labelTr: '3. Paragraf (Arapça)', labelAr: 'الفقرة الثالثة', defaults: { value: '' } },
  { key: 'about_p3_tr', type: 'textarea', group: 'ABOUT', labelTr: '3. Paragraf (Türkçe)', labelAr: 'الفقرة الثالثة (تركي)', defaults: { value: '' } },
  { key: 'about_p3_en', type: 'textarea', group: 'ABOUT', labelTr: '3. Paragraf (İngilizce)', labelAr: 'الفقرة الثالثة (إنجليزي)', defaults: { value: '' } },
  { key: 'about_p4_ar', type: 'textarea', group: 'ABOUT', labelTr: '4. Paragraf (Arapça)', labelAr: 'الفقرة الرابعة', defaults: { value: '' } },
  { key: 'about_p4_tr', type: 'textarea', group: 'ABOUT', labelTr: '4. Paragraf (Türkçe)', labelAr: 'الفقرة الرابعة (تركي)', defaults: { value: '' } },
  { key: 'about_p4_en', type: 'textarea', group: 'ABOUT', labelTr: '4. Paragraf (İngilizce)', labelAr: 'الفقرة الرابعة (إنجليزي)', defaults: { value: '' } },
  { ...T('about_why_title', '"Neden Biz?" Başlığı', 'عنوان لماذا نحن', 'Why title'), defaults: { ar: 'لماذا تختار شركة المجد؟', tr: 'Neden El-Mecd Öğrenci Hizmetleri?', en: 'Why Choose Al-Majd Student Services?' } },
  { ...T('about_closing', 'Kapanış Cümlesi', 'الجملة الختامية', 'Closing'), defaults: { ar: 'مستقبلك الدراسي يبدأ بخطوة.', tr: 'Üniversite geleceğiniz bir adımla başlar.', en: 'Your academic future begins with a single step.' } },
  { key: 'about_bg_image', type: 'image', group: 'ABOUT', labelTr: 'Hakkımızda Arka Plan Fotoğrafı', labelAr: 'صورة خلفية من نحن', defaults: { value: '' } },

  // ===================== FOOTER =====================
  { ...T('footer_description', 'Footer Tanıtım Yazısı', 'وصف التذييل', 'Footer description'), defaults: { ar: 'بوابتك الرسمية المعتمدة للقبول في الجامعات التركية الحكومية والخاصة.', tr: 'Türkiye’deki devlet ve vakıf üniversitelerine kabul için yetkili başvuru merkeziniz.', en: 'Your accredited gateway to admissions at Turkish public and foundation universities.' } },
  {
    key: 'footer_link_columns',
    type: 'json-link-columns',
    group: 'FOOTER',
    labelTr: 'Footer Link Kolonları',
    labelAr: 'أعمدة روابط التذييل',
    hintTr: 'Footer’daki link kolonlarının başlıklarını ve linklerini buradan yönetin.',
    defaults: {
      value: JSON.stringify([
        {
          id: 'universities',
          titleAr: 'الجامعات', titleTr: 'Üniversiteler', titleEn: 'Universities',
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
          titleAr: 'الخدمات', titleTr: 'Hizmetler', titleEn: 'Services',
          links: [
            { labelAr: 'القبول الجامعي', labelTr: 'Üniversite Kabulü', labelEn: 'University Admissions', url: '/services/university-admissions' },
            { labelAr: 'معادلة الشهادات', labelTr: 'Denklik Danışmanlığı', labelEn: 'Diploma Equivalency', url: '/services/denklik-equivalency' },
            { labelAr: 'الإقامة الطلابية', labelTr: 'Öğrenci İkamet İzni', labelEn: 'Student Residence Permit', url: '/services/student-residence-permit' },
            { labelAr: 'الاستقبال والسكن', labelTr: 'Havalimanı ve Konaklama', labelEn: 'Airport Pickup & Housing', url: '/services/airport-pickup-housing' },
            { labelAr: 'دورات اليوس والتومر', labelTr: 'YÖS, TÖMER ve SAT Kursları', labelEn: 'YÖS, TÖMER & SAT Prep', url: '/courses' },
          ],
        },
      ]),
    },
  },
  { ...T('footer_hours', 'Çalışma Saatleri', 'ساعات العمل', 'Working hours'), defaults: { ar: 'الإثنين - السبت: 09:00 - 18:00', tr: 'Pazartesi - Cumartesi: 09:00 - 18:00', en: 'Mon - Sat: 09:00 - 18:00' } },
  { ...T('footer_accreditation_note', 'Yetki/Akreditasyon Notu', 'ملاحظة الاعتماد', 'Accreditation note'), defaults: { ar: 'اعتماد وترخيص رسمي من وزارة التعليم التركية', tr: 'MEB ve YÖK Yetkili Danışmanlık', en: 'Officially Licensed & Accredited in Turkey' } },
  { ...T('footer_copyright', 'Telif Satırı', 'حقوق النشر', 'Copyright'), defaults: { ar: 'جميع الحقوق محفوظة © المجد للقبولات الجامعية', tr: 'Tüm hakları saklıdır © El-Mecd Üniversite Kabulleri', en: 'All rights reserved © Al-Majd University Admissions' } },
  { key: 'footer_show_social', type: 'boolean', group: 'FOOTER', labelTr: 'Footer’da sosyal medya ikonlarını göster', labelAr: 'إظهار أيقونات التواصل', defaults: { value: 'true' } },

  // ===================== CONTACT =====================
  { key: 'contact_email', type: 'text', group: 'CONTACT', labelTr: 'E-posta', labelAr: 'البريد الإلكتروني', defaults: { value: 'info@almajed-edu.com' } },
  { key: 'contact_phone', type: 'text', group: 'CONTACT', labelTr: 'Telefon', labelAr: 'الهاتف', defaults: { value: '+90 531 397 10 22' } },
  { ...T('contact_address', 'Adres', 'العنوان', 'Address'), defaults: { ar: 'إسطنبول، الفاتح / شيشلي، تركيا', tr: 'Fevzipaşa Cad. No:42, Fatih, İstanbul, Türkiye', en: 'Fevzipasa St. No:42, Fatih, Istanbul, Turkey' } },
  { key: 'contact_map_embed_url', type: 'url', group: 'CONTACT', labelTr: 'Google Harita Embed Linki', labelAr: 'رابط خريطة جوجل', defaults: { value: '' } },

  // ===================== WHATSAPP =====================
  { key: 'whatsapp_enabled', type: 'boolean', group: 'WHATSAPP', labelTr: 'Yüzen WhatsApp butonu açık', labelAr: 'تفعيل زر واتساب العائم', defaults: { value: 'true' } },
  { key: 'whatsapp_number', type: 'text', group: 'WHATSAPP', labelTr: 'WhatsApp Numarası (ülke koduyla, + işaretsiz)', labelAr: 'رقم واتساب', defaults: { value: '905313971022' } },
  { key: 'contact_whatsapp', type: 'text', group: 'WHATSAPP', labelTr: 'WhatsApp Numarası (yedek alan)', labelAr: 'رقم واتساب (احتياطي)', defaults: { value: '905313971022' } },
  { key: 'whatsapp_position', type: 'select', group: 'WHATSAPP', labelTr: 'Buton Konumu', labelAr: 'موضع الزر', options: ['bottom-right', 'bottom-left'], defaults: { value: 'bottom-right' } },
  { ...T('whatsapp_message', 'Otomatik Mesaj Metni', 'نص الرسالة التلقائي', 'Prefilled message'), defaults: { ar: 'مرحباً، أود الاستفسار عن القبول الجامعي في تركيا.', tr: 'Merhaba, Türkiye üniversite kabulleri hakkında bilgi almak istiyorum.', en: 'Hello, I would like to inquire about university admissions in Turkey.' } },

  // ===================== SOCIAL =====================
  { key: 'social_instagram', type: 'url', group: 'SOCIAL', labelTr: 'Instagram', labelAr: 'انستغرام', defaults: { value: '' } },
  { key: 'social_facebook', type: 'url', group: 'SOCIAL', labelTr: 'Facebook', labelAr: 'فيسبوك', defaults: { value: '' } },
  { key: 'social_twitter', type: 'url', group: 'SOCIAL', labelTr: 'X / Twitter', labelAr: 'إكس / تويتر', defaults: { value: '' } },
  { key: 'social_youtube', type: 'url', group: 'SOCIAL', labelTr: 'YouTube', labelAr: 'يوتيوب', defaults: { value: '' } },
  { key: 'social_tiktok', type: 'url', group: 'SOCIAL', labelTr: 'TikTok', labelAr: 'تيك توك', defaults: { value: '' } },
  { key: 'social_telegram', type: 'url', group: 'SOCIAL', labelTr: 'Telegram', labelAr: 'تيليجرام', defaults: { value: '' } },
  { key: 'social_linkedin', type: 'url', group: 'SOCIAL', labelTr: 'LinkedIn', labelAr: 'لينكدإن', defaults: { value: '' } },

  // ===================== THEME =====================
  { key: 'theme_primary_color', type: 'color', group: 'THEME', labelTr: 'Ana Renk', labelAr: 'اللون الأساسي', defaults: { value: '#1a367c' } },
  { key: 'theme_secondary_color', type: 'color', group: 'THEME', labelTr: 'İkincil Renk', labelAr: 'اللون الثانوي', defaults: { value: '#112352' } },
  { key: 'theme_accent_color', type: 'color', group: 'THEME', labelTr: 'Vurgu Rengi (altın)', labelAr: 'لون التمييز', defaults: { value: '#c89d3c' } },
  { key: 'carousel_autoplay', type: 'boolean', group: 'THEME', labelTr: 'Kart kaydırmalarında otomatik oynatma', labelAr: 'التشغيل التلقائي', defaults: { value: 'true' } },
  { key: 'carousel_interval', type: 'number', group: 'THEME', labelTr: 'Kaydırma Hızı (ms)', labelAr: 'سرعة التبديل', defaults: { value: '2500' } },

  // ===================== SEO =====================
  { key: 'meta_title_default', type: 'text', group: 'SEO', labelTr: 'Varsayılan Meta Başlık', labelAr: 'عنوان الميتا', defaults: { value: 'المجد للقبولات الجامعية | الدراسة في تركيا' } },
  { key: 'meta_description_default', type: 'textarea', group: 'SEO', labelTr: 'Varsayılan Meta Açıklama', labelAr: 'وصف الميتا', defaults: { value: 'بوابتك الرسمية المعتمدة للقبول في الجامعات التركية الحكومية والخاصة.' } },
  { key: 'seo_social_share_image', type: 'image', group: 'SEO', labelTr: 'Sosyal Paylaşım Görseli (OG)', labelAr: 'صورة المشاركة', defaults: { value: '' } },
];

// Alan listesini düz { key: {group, value} } seed formatına çevirir
export function flattenDefaultSettings() {
  const rows = [];
  for (const field of SETTINGS_FIELDS) {
    const group = field.group || (field.type === 'trilingual' ? guessGroup(field.key) : 'GENERAL');
    if (field.type === 'trilingual') {
      for (const lang of ['ar', 'tr', 'en']) {
        rows.push({ key: `${field.key}_${lang}`, value: field.defaults?.[lang] ?? '', group });
      }
    } else {
      rows.push({ key: field.key, value: field.defaults?.value ?? '', group });
    }
  }
  return rows;
}

export function groupForKey(key) {
  const field = SETTINGS_FIELDS.find(
    (f) => f.key === key || (f.type === 'trilingual' && ['ar', 'tr', 'en'].some((l) => `${f.key}_${l}` === key))
  );
  if (field) return field.group || guessGroup(field.key);
  return guessGroup(key);
}

function guessGroup(key) {
  if (key.startsWith('nav_')) return 'NAVBAR';
  if (key.startsWith('hero_')) return 'HERO';
  if (key.startsWith('home_')) return 'HOME';
  if (key.startsWith('about_')) return 'ABOUT';
  if (key.startsWith('footer_')) return 'FOOTER';
  if (key.startsWith('whatsapp')) return 'WHATSAPP';
  if (key.startsWith('contact')) return 'CONTACT';
  if (key.startsWith('social')) return 'SOCIAL';
  if (key.startsWith('theme') || key.startsWith('carousel')) return 'THEME';
  if (key.startsWith('seo') || key.startsWith('meta')) return 'SEO';
  if (key.startsWith('site_')) return 'BRANDING';
  return 'GENERAL';
}

// Public endpoint'in dışarı vereceği gruplar (SECURITY asla verilmez)
export const PUBLIC_SETTING_GROUPS = SETTINGS_GROUPS.map((g) => g.id).filter((g) => g !== 'SECURITY');

// Ana sayfa bölüm kataloğu: Page Builder bu listeyi kullanır
export const HOME_SECTION_CATALOG = [
  { sectionKey: 'hero', sectionType: 'HERO', order: 1, titleTr: 'Hero (Üst Tanıtım Alanı)', titleAr: 'الواجهة الرئيسية', titleEn: 'Hero' },
  { sectionKey: 'stats', sectionType: 'STATS', order: 2, titleTr: 'Rakamlarla Biz', titleAr: 'الإحصاءات', titleEn: 'Stats' },
  { sectionKey: 'admission_slider', sectionType: 'ANNOUNCEMENTS', order: 3, titleTr: 'Canlı Başvuru Duyuruları', titleAr: 'إعلانات القبول', titleEn: 'Admission Announcements' },
  { sectionKey: 'universities_preview', sectionType: 'UNI_GRID', order: 4, titleTr: 'Öne Çıkan Üniversiteler', titleAr: 'الجامعات المميزة', titleEn: 'Featured Universities' },
  { sectionKey: 'graduate_spotlight', sectionType: 'CTA', order: 5, titleTr: 'Yüksek Lisans & Doktora Vitrini', titleAr: 'الدراسات العليا', titleEn: 'Graduate Spotlight' },
  { sectionKey: 'programs_preview', sectionType: 'PROGRAM_GRID', order: 6, titleTr: 'Popüler Bölümler', titleAr: 'التخصصات', titleEn: 'Top Programs' },
  { sectionKey: 'services_preview', sectionType: 'SERVICE_GRID', order: 7, titleTr: 'Öğrenci Hizmetleri', titleAr: 'خدمات الطلاب', titleEn: 'Student Services' },
  { sectionKey: 'notary_equivalency', sectionType: 'INFO', order: 8, titleTr: 'Noter Tercüme & Denklik', titleAr: 'الترجمة والمعادلة', titleEn: 'Notary & Equivalency' },
  { sectionKey: 'scholarships_preview', sectionType: 'SCHOLARSHIP_GRID', order: 9, titleTr: 'Burslar', titleAr: 'المنح', titleEn: 'Scholarships' },
  { sectionKey: 'testimonials', sectionType: 'TESTIMONIALS', order: 10, titleTr: 'Öğrenci Yorumları', titleAr: 'آراء الطلاب', titleEn: 'Testimonials' },
  { sectionKey: 'blog_preview', sectionType: 'BLOG', order: 11, titleTr: 'Blog & Rehberler', titleAr: 'المدونة', titleEn: 'Blog' },
  { sectionKey: 'faq', sectionType: 'FAQ', order: 12, titleTr: 'Sık Sorulan Sorular', titleAr: 'الأسئلة الشائعة', titleEn: 'FAQ' },
  { sectionKey: 'bottom_cta', sectionType: 'CTA', order: 13, titleTr: 'Alt Başvuru Çağrısı', titleAr: 'دعوة التقديم', titleEn: 'Bottom CTA' },
];

// Üç dilli alanlarda group yazılmadı; admin formunun sekmeleri için hepsini tamamla.
SETTINGS_FIELDS.forEach((field) => {
  if (!field.group) field.group = guessGroup(field.key);
});
