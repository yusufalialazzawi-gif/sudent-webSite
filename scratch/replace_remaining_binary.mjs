import fs from 'fs';
import path from 'path';

const termMap = [
  // Universities
  [
    "{currentLanguage === 'ar' ? 'إدارة الجامعات التركية وحالات التقديم' : 'Turkish Universities & Admissions'}",
    "tx('إدارة الجامعات التركية وحالات التقديم', 'Türk Üniversiteleri ve Kabul Durumları Yönetimi', 'Turkish Universities & Admissions')"
  ],
  [
    "{currentLanguage === 'ar' ? 'استيراد وفحص 60 جامعة تركية' : 'Import & Verify 60 Universities'}",
    "tx('استيراد وفحص 60 جامعة تركية', '60 Türk Üniversitesini İçe Aktar ve Doğrula', 'Import & Verify 60 Universities')"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'إضافة جامعة يدوياً' : 'Add University'}</span>",
    "<span>{tx('إضافة جامعة يدوياً', 'Manuel Üniversite Ekle', 'Add University')}</span>"
  ],
  [
    '<option value="ALL">{currentLanguage === \'ar\' ? \'جميع التصنيفات\' : \'All Types\'}</option>',
    '<option value="ALL">{tx(\'جميع التصنيفات\', \'Tüm Türler\', \'All Types\')}</option>'
  ],
  [
    '<option value="PUBLIC">{currentLanguage === \'ar\' ? \'🏛️ حكومية (Public)\' : \'🏛️ Public\'}</option>',
    '<option value="PUBLIC">{tx(\'🏛️ حكومية (Public)\', \'🏛️ Devlet\', \'🏛️ Public\')}</option>'
  ],
  [
    '<option value="PRIVATE">{currentLanguage === \'ar\' ? \'🏢 خاصة (Private)\' : \'🏢 Foundation\'}</option>',
    '<option value="PRIVATE">{tx(\'🏢 خاصة (Private)\', \'🏢 Vakıf\', \'🏢 Foundation\')}</option>'
  ],
  [
    '<option value="ALL">{currentLanguage === \'ar\' ? \'جميع حالات التقديم\' : \'All Statuses\'}</option>',
    '<option value="ALL">{tx(\'جميع حالات التقديم\', \'Tüm Başvuru Durumları\', \'All Statuses\')}</option>'
  ],
  [
    '<option value="OPEN">{currentLanguage === \'ar\' ? \'🟢 مفتوح (Open)\' : \'🟢 Open\'}</option>',
    '<option value="OPEN">{tx(\'🟢 مفتوح (Open)\', \'🟢 Açık\', \'🟢 Open\')}</option>'
  ],
  [
    '<option value="UPCOMING">{currentLanguage === \'ar\' ? \'🟡 يفتح قريباً (Upcoming)\' : \'🟡 Upcoming\'}</option>',
    '<option value="UPCOMING">{tx(\'🟡 يفتح قريباً (Upcoming)\', \'🟡 Yakında\', \'🟡 Upcoming\')}</option>'
  ],
  [
    '<option value="CLOSED">{currentLanguage === \'ar\' ? \'🔴 مغلق (Closed)\' : \'🔴 Closed\'}</option>',
    '<option value="CLOSED">{tx(\'🔴 مغلق (Closed)\', \'🔴 Kapalı\', \'🔴 Closed\')}</option>'
  ],
  [
    '<option value="UNCONFIRMED">{currentLanguage === \'ar\' ? \'⚪ غير مؤكد (Unconfirmed)\' : \'⚪ Unconfirmed\'}</option>',
    '<option value="UNCONFIRMED">{tx(\'⚪ غير مؤكد (Unconfirmed)\', \'⚪ Onaysız\', \'⚪ Unconfirmed\')}</option>'
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'بطاقات' : 'Kartlar'}</span>",
    "<span>{tx('بطاقات', 'Kartlar', 'Cards')}</span>"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'جدول' : 'Tablo'}</span>",
    "<span>{tx('جدول', 'Tablo', 'Table')}</span>"
  ],
  [
    "{currentLanguage === 'ar' ? `العدد: ${filteredUnis.length}` : `Count: ${filteredUnis.length}`}",
    "`${tx('العدد:', 'Adet:', 'Count:')} ${filteredUnis.length}`"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'جاري تحميل قائمة الجامعات...' : 'Loading universities...'}</span>",
    "<span>{tx('جاري تحميل قائمة الجامعات...', 'Üniversiteler yükleniyor...', 'Loading universities...')}</span>"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'اللغات الإلزامية الثلاث:' : 'Zorunlu 3 Dil:'}</span>",
    "<span>{tx('اللغات الإلزامية الثلاث:', 'Zorunlu 3 Dil:', 'Mandatory 3 Languages:')}</span>"
  ],
  [
    "{currentLanguage === 'ar' ? 'إدخال اسم الجامعة باللغات الثلاث إلزامي' : '3 dilde üniversite adı zorunludur'}",
    "tx('إدخال اسم الجامعة باللغات الثلاث إلزامي', '3 dilde üniversite adı zorunludur', 'University name required in all 3 languages')"
  ],

  // Staff
  [
    "{currentLanguage === 'ar' ? 'فريق العمل وسجلات الأمان' : 'Staff Accounts & Security Logs'}",
    "tx('فريق العمل وسجلات الأمان', 'Ekip Hesapları ve Güvenlik Kayıtları', 'Staff Accounts & Security Logs')"
  ],
  [
    "{currentLanguage === 'ar' ? 'إدارة صلاحيات مستشاري القبول ومحرري المحتوى، ومراقبة تدقيق العمليات' : 'Role-based access control (RBAC), team accounts, and immutable system audit logs'}",
    "tx('إدارة صلاحيات مستشاري القبول ومحرري المحتوى، ومراقبة تدقيق العمليات', 'Kabul danışmanı ve içerik editörü yetkilerini yönetin, sistem denetim kayıtlarını izleyin', 'Role-based access control (RBAC), team accounts, and immutable system audit logs')"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'إضافة موظف جديد' : 'New Staff Account'}</span>",
    "<span>{tx('إضافة موظف جديد', 'Yeni Personel Ekle', 'New Staff Account')}</span>"
  ],
  [
    "currentLanguage === 'ar' ? 'ar-EG' : 'en-US'",
    "currentLanguage === 'ar' ? 'ar-EG' : currentLanguage === 'tr' ? 'tr-TR' : 'en-US'"
  ],

  // Services
  [
    "{currentLanguage === 'ar' ? 'الخدمات والاستشارات الطلابية' : 'Student Consulting Services'}",
    "tx('الخدمات والاستشارات الطلابية', 'Öğrenci Hizmetleri ve Danışmanlık', 'Student Consulting Services')"
  ],
  [
    "{currentLanguage === 'ar' ? 'إدارة باقات القبول الجامعي، معادلة الشهادات، الإقامة الطلابية، والسكن' : 'Manage educational consulting services, equivalency, visa and housing support'}",
    "tx('إدارة باقات القبول الجامعي، معادلة الشهادات، الإقامة الطلابية، والسكن', 'Üniversite kabul paketleri, denklik, ikamet ve konaklama hizmetlerini yönetin', 'Manage educational consulting services, equivalency, visa and housing support')"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'إضافة خدمة جديدة' : 'Add Service'}</span>",
    "<span>{tx('إضافة خدمة جديدة', 'Yeni Hizmet Ekle', 'Add Service')}</span>"
  ],
  [
    "placeholder={currentLanguage === 'ar' ? 'بحث بالاسم أو المعرف...' : 'Search services...'}",
    "placeholder={tx('بحث بالاسم أو المعرف...', 'Hizmet veya kimlik ara...', 'Search services...')}"
  ],
  [
    "{currentLanguage === 'ar' ? 'يجب ملء اسم الخدمة باللغات الثلاث' : '3 dilde hizmet adı girişi zorunludur'}",
    "tx('يجب ملء اسم الخدمة باللغات الثلاث', '3 dilde hizmet adı girişi zorunludur', 'Service title is required in all 3 languages')"
  ],

  // Scholarships
  [
    "{currentLanguage === 'ar' ? 'المنح الدراسية والفرص الأكاديمية' : 'Scholarships & Academic Grants'}",
    "tx('المنح الدراسية والفرص الأكاديمية', 'Burslar ve Akademik Fırsatlar', 'Scholarships & Academic Grants')"
  ],
  [
    "{currentLanguage === 'ar' ? 'إدارة المنح الكاملة والجزئية، ومواعيد التقديم الرسمية' : 'Manage partial and full scholarship opportunities and official application deadlines'}",
    "tx('إدارة المنح الكاملة والجزئية، ومواعيد التقديم الرسمية', 'Tam ve kısmi burs fırsatları ile resmi başvuru tarihlerini yönetin', 'Manage partial and full scholarship opportunities and official application deadlines')"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'إضافة منحة جديدة' : 'Add Scholarship'}</span>",
    "<span>{tx('إضافة منحة جديدة', 'Yeni Burs Ekle', 'Add Scholarship')}</span>"
  ],
  [
    "placeholder={currentLanguage === 'ar' ? 'بحث بالاسم أو المعرف...' : 'Search scholarships...'}",
    "placeholder={tx('بحث بالاسم أو المعرف...', 'Burs veya kimlik ara...', 'Search scholarships...')}"
  ],
  [
    "{currentLanguage === 'ar' ? 'يجب ملء البيانات باللغات الثلاث' : '3 dilde veri girişi zorunludur'}",
    "tx('يجب ملء البيانات باللغات الثلاث', '3 dilde veri girişi zorunludur', 'Data entry required in all 3 languages')"
  ],

  // Programs
  [
    "{currentLanguage === 'ar' ? 'البرامج والتخصصات الأكاديمية' : 'Academic Programs & Degrees'}",
    "tx('البرامج والتخصصات الأكاديمية', 'Akademik Programlar ve Bölümler', 'Academic Programs & Degrees')"
  ],
  [
    "{currentLanguage === 'ar' ? 'إدارة التخصصات والبرامج الدراسية ومراحل البكالوريوس والدراسات العليا ولغات التدريس' : 'Manage academic offerings, curricula, and degree levels'}",
    "tx('إدارة التخصصات والبرامج الدراسية ومراحل البكالوريوس والدراسات العليا ولغات التدريس', 'Bölümleri, lisans ve lisansüstü programları ile eğitim dillerini yönetin', 'Manage academic offerings, curricula, and degree levels')"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'إضافة تخصص جديد' : 'Add Program'}</span>",
    "<span>{tx('إضافة تخصص جديد', 'Yeni Bölüm Ekle', 'Add Program')}</span>"
  ],
  [
    "placeholder={currentLanguage === 'ar' ? 'بحث بالتخصص، الجامعة، أو الكود...' : 'Search programs...'}",
    "placeholder={tx('بحث بالتخصص، الجامعة، أو الكود...', 'Bölüm, üniversite veya kod ara...', 'Search programs...')}"
  ],
  [
    "{currentLanguage === 'ar' ? 'يجب ملء اسم التخصص باللغات الثلاث' : '3 dilde bölüm adı girişi zorunludur'}",
    "tx('يجب ملء اسم التخصص باللغات الثلاث', '3 dilde bölüm adı girişi zorunludur', 'Program name required in all 3 languages')"
  ],

  // Courses
  [
    "{currentLanguage === 'ar' ? 'الدورات التدريبية واختبارات القبول' : 'Courses & Prep Exams'}",
    "tx('الدورات التدريبية واختبارات القبول', 'Eğitim Kursları ve Sınav Hazırlığı', 'Courses & Prep Exams')"
  ],
  [
    "{currentLanguage === 'ar' ? 'إدارة دورات اليوس (YÖS)، التومر (TÖMER)، السات واللغات ومتابعة المسجلين' : 'Manage YÖS, TÖMER, SAT prep batches and track student enrollments'}",
    "tx('إدارة دورات اليوس (YÖS)، التومر (TÖMER)، السات واللغات ومتابعة المسجلين', 'YÖS, TÖMER, SAT kurslarını ve kayıtlı öğrencileri yönetin', 'Manage YÖS, TÖMER, SAT prep batches and track student enrollments')"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'إضافة دورة جديدة' : 'Add Course'}</span>",
    "<span>{tx('إضافة دورة جديدة', 'Yeni Kurs Ekle', 'Add Course')}</span>"
  ],
  [
    "placeholder={currentLanguage === 'ar' ? 'بحث بالاسم أو المعرف...' : 'Search courses...'}",
    "placeholder={tx('بحث بالاسم أو المعرف...', 'Kurs veya kimlik ara...', 'Search courses...')}"
  ],
  [
    "{currentLanguage === 'ar' ? 'يجب ملء اسم الدورة باللغات الثلاث' : '3 dilde kurs adı girişi zorunludur'}",
    "tx('يجب ملء اسم الدورة باللغات الثلاث', '3 dilde kurs adı girişi zorunludur', 'Course title required in all 3 languages')"
  ],

  // Blog
  [
    "{currentLanguage === 'ar' ? 'المقالات والأدلة الطلابية' : 'Articles & Guides'}",
    "tx('المقالات والأدلة الطلابية', 'Makaleler ve Öğrenci Rehberleri', 'Articles & Guides')"
  ],
  [
    "{currentLanguage === 'ar' ? 'نشر الأدلة الإرشادية للحياة الجامعية في تركيا، شروط الفيزا، ونصائح القبول' : 'Publish comprehensive university life guides, visa guidelines, and scholarship news'}",
    "tx('نشر الأدلة الإرشادية للحياة الجامعية في تركيا، شروط الفيزا، ونصائح القبول', 'Türkiye üniversite yaşamı, vize koşulları ve kabul tavsiyeleri rehberleri yayınlayın', 'Publish comprehensive university life guides, visa guidelines, and scholarship news')"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'كتابة مقال جديد' : 'New Article'}</span>",
    "<span>{tx('كتابة مقال جديد', 'Yeni Makale Yaz', 'New Article')}</span>"
  ],
  [
    "placeholder={currentLanguage === 'ar' ? 'بحث بالعنوان، الكاتب، أو التصنيف...' : 'Search articles...'}",
    "placeholder={tx('بحث بالعنوان، الكاتب، أو التصنيف...', 'Başlık, yazar veya kategori ara...', 'Search articles...')}"
  ],
  [
    "{currentLanguage === 'ar' ? 'يجب ملء عنوان المقال باللغات الثلاث' : '3 dilde makale başlığı zorunludur'}",
    "tx('يجب ملء عنوان المقال باللغات الثلاث', '3 dilde makale başlığı zorunludur', 'Article title required in all 3 languages')"
  ],

  // Page Builder
  [
    "{currentLanguage === 'ar' ? 'منشئ ومحرر الصفحات البصري (Visual CMS)' : 'Visual CMS Page Builder'}",
    "tx('منشئ ومحرر الصفحات البصري (Visual CMS)', 'Görsel Sayfa Düzenleyici (Visual CMS)', 'Visual CMS Page Builder')"
  ],
  [
    "{currentLanguage === 'ar' ? 'التحكم في ترتيب أقسام الصفحة الرئيسية، النصوص الإعلانية، والإحصائيات الحية' : 'Manage section order, marketing copy, tickers, and stats on the home page'}",
    "tx('التحكم في ترتيب أقسام الصفحة الرئيسية، النصوص الإعلانية، والإحصائيات الحية', 'Ana sayfa bölümlerinin sırasını, tanıtım metinlerini ve canlı istatistikleri yönetin', 'Manage section order, marketing copy, tickers, and stats on the home page')"
  ],
  [
    "<span>{currentLanguage === 'ar' ? 'إضافة قسم جديد' : 'Add Section'}</span>",
    "<span>{tx('إضافة قسم جديد', 'Yeni Bölüm Ekle', 'Add Section')}</span>"
  ]
];

const adminDir = path.resolve('frontend/src/pages/admin');
const files = fs.readdirSync(adminDir, { recursive: true }).filter(f => /\.jsx$/.test(f));

let totalChanges = 0;
for (const relFile of files) {
  const fullPath = path.join(adminDir, relFile);
  let content = fs.readFileSync(fullPath, 'utf8');
  let fileChanges = 0;

  for (const [find, replace] of termMap) {
    if (content.includes(find)) {
      content = content.replaceAll(find, replace);
      fileChanges++;
      totalChanges++;
    }
  }

  if (fileChanges > 0) {
    if (!content.includes('tx')) {
      content = content.replace(/(import \{[^}]*ta[^}]*\} from '[^']+';)/, (m) => m.replace('{ ta }', '{ ta, tx }'));
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${relFile}: ${fileChanges} replacements`);
  }
}

console.log(`Finished: ${totalChanges} replacements total.`);
