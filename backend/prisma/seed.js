import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Turkey Education Platform database...');

  // 1. Users & RBAC
  const passwordHash = await bcrypt.hash('Admin@2026!', 10);
  const editorHash = await bcrypt.hash('Editor@2026!', 10);
  const admissionsHash = await bcrypt.hash('Admissions@2026!', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@soraedu-tr.com' },
    update: {},
    create: {
      email: 'admin@soraedu-tr.com',
      fullName: 'Chief Administrator (Super Admin)',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@soraedu-tr.com' },
    update: {},
    create: {
      email: 'editor@soraedu-tr.com',
      fullName: 'Senior Content Editor',
      passwordHash: editorHash,
      role: 'CONTENT_EDITOR',
      isActive: true,
    },
  });

  const admissionsUser = await prisma.user.upsert({
    where: { email: 'admissions@soraedu-tr.com' },
    update: {},
    create: {
      email: 'admissions@soraedu-tr.com',
      fullName: 'Lead Admissions Advisor',
      passwordHash: admissionsHash,
      role: 'ADMISSIONS_STAFF',
      isActive: true,
    },
  });

  console.log('Created administrative accounts (Super Admin, Editor, Admissions Staff)');

  // 2. Program Categories
  const categoriesData = [
    {
      slug: 'medicine-health',
      nameAr: 'الطب والعلوم الصحية',
      nameTr: 'Tıp ve Sağlık Bilimleri',
      nameEn: 'Medicine & Health Sciences',
      icon: 'Stethoscope',
    },
    {
      slug: 'engineering-tech',
      nameAr: 'الهندسة والتكنولوجيا',
      nameTr: 'Mühendislik ve Teknoloji',
      nameEn: 'Engineering & Technology',
      icon: 'Cpu',
    },
    {
      slug: 'computer-science-ai',
      nameAr: 'علوم الحاسوب والذكاء الاصطناعي',
      nameTr: 'Bilgisayar ve Yapay Zeka',
      nameEn: 'Computer Science & AI',
      icon: 'Terminal',
    },
    {
      slug: 'business-management',
      nameAr: 'إدارة الأعمال والاقتصاد',
      nameTr: 'İşletme ve Ekonomi',
      nameEn: 'Business & Management',
      icon: 'Briefcase',
    },
    {
      slug: 'dentistry-pharmacy',
      nameAr: 'طب الأسنان والصيدلة',
      nameTr: 'Diş Hekimliği ve Eczacılık',
      nameEn: 'Dentistry & Pharmacy',
      icon: 'Smile',
    },
    {
      slug: 'architecture-design',
      nameAr: 'العمارة والتصميم',
      nameTr: 'Mimarlık ve Tasarım',
      nameEn: 'Architecture & Design',
      icon: 'Compass',
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.programCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // 3. Universities & Translations
  const universitiesData = [
    {
      slug: 'istanbul-medipol-university',
      type: 'PRIVATE',
      city: 'Istanbul',
      establishedYear: 2009,
      campusType: 'MULTI_CAMPUS',
      ranking: 18,
      websiteUrl: 'https://medipol.edu.tr',
      logoUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=200&auto=format&fit=crop&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&auto=format&fit=crop&q=80',
      featured: true,
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'جامعة إسطنبول ميدي بول',
          overview: 'تعد جامعة إسطنبول ميدي بول واحدة من أقوى الجامعات الخاصة في تركيا خاصة في المجالات الطبية والرعاية الصحية. تضم الجامعة مجمع مستشفيات ميدي بول ميغا، الأكبر في تركيا، ومختبرات تكنولوجية مجهزة بأحدث المعدات العالمية.',
          admissionRequirements: 'شهادة الثانوية العامة بمعدل لا يقل عن 75% للتخصصات الطبية، وجواز سفر ساري المفعول. لا تشترط امتحان اليوس للقبول في البرامج الخاصة عبر منصتنا.',
          accommodationInfo: 'سكن جامعي حديث مجهز بالكامل للذكور والإناث مع خدمات أمن ووجبات طعام وواي فاي على مدار الساعة.',
          accreditationInfo: 'معترف بها رسمياً من مجلس التعليم العالي التركي (YÖK)، ومعتمدة في كافة الدول العربية (العراق، مصر، الأردن، دول الخليج) والاتحاد الأوروبي.',
          address: 'Kavacık, Beykoz, İstanbul, Türkiye',
        },
        {
          lang: 'tr',
          name: 'İstanbul Medipol Üniversitesi',
          overview: 'İstanbul Medipol Üniversitesi, özellikle sağlık bilimleri, mühendislik ve sosyal bilimler alanında Türkiye’nin önde gelen vakıf üniversitelerindendir.',
          admissionRequirements: 'Lise diploması ve geçerli pasaport. Yabancı uyruklu öğrenciler için avantajlı kabul koşulları.',
          accommodationInfo: 'Kavacık kampüsünde modern ve güvenli kız/erkek öğrenci yurtları.',
          accreditationInfo: 'YÖK onaylı, uluslararası akreditasyonlara sahip (MÜDEK, TEPDAD).',
          address: 'Kavacık, Beykoz, İstanbul, Türkiye',
        },
        {
          lang: 'en',
          name: 'Istanbul Medipol University',
          overview: 'Istanbul Medipol University is a premier foundation university in Turkey renowned for medicine, health sciences, and cutting-edge biomedical research.',
          admissionRequirements: 'High School Diploma with competitive GPA (75%+ for Medicine/Dentistry) and valid passport.',
          accommodationInfo: 'Modern on-campus and near-campus dormitories for male and female students with comprehensive amenities.',
          accreditationInfo: 'Fully accredited by YÖK and recognized across Arab countries, Europe, and the US (ECFMG).',
          address: 'Kavacık, Beykoz, Istanbul, Turkey',
        },
      ],
    },
    {
      slug: 'bahcesehir-university',
      type: 'PRIVATE',
      city: 'Istanbul',
      establishedYear: 1998,
      campusType: 'URBAN',
      ranking: 12,
      websiteUrl: 'https://bau.edu.tr',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=200&auto=format&fit=crop&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&auto=format&fit=crop&q=80',
      featured: true,
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'جامعة بهتشه شهير (BAU)',
          overview: 'تقع جامعة بهتشه شهير في قلب إسطنبول على مضيق البوسفور بمنطقة بشكطاش. تشتهر بشبكتها التعليمية الدولية (BAU Global) وبرامجها الرائدة في الهندسة، الحاسوب، والذكاء الاصطناعي وإدارة الأعمال باللغة الإنجليزية.',
          admissionRequirements: 'شهادة الثانوية العامة بمعدل جيد، وجواز سفر. توفر الجامعة امتحان تحديد مستوى اللغة الإنجليزية المعفى من التوفل.',
          accommodationInfo: 'خيارات سكنية ممتازة قريبة من الحرم الجامعي مع مواصلات سريعة عبر المترو والعبارات البحرية.',
          accreditationInfo: 'حاصلة على اعتمادات دولية مرموقة مثل ABET للهندسة ومعترف بها في جميع الدول العربية وأوروبا.',
          address: 'Çırağan Caddesi, Beşiktaş, İstanbul, Türkiye',
        },
        {
          lang: 'tr',
          name: 'Bahçeşehir Üniversitesi',
          overview: 'Boğaz kıyısındaki Beşiktaş kampüsüyle ve küresel eğitim ağıyla Türkiye’nin en uluslararası üniversitelerinden biridir.',
          admissionRequirements: 'Lise diploması ve transkript. İngilizce yeterlilik belgesi veya üniversite muafiyet sınavı.',
          accommodationInfo: 'Beşiktaş ve çevresinde anlaşmalı öğrenci rezidansları.',
          accreditationInfo: 'YÖK, ABET, Pearson ve uluslararası akreditasyonlar.',
          address: 'Çırağan Caddesi, Beşiktaş, İstanbul, Türkiye',
        },
        {
          lang: 'en',
          name: 'Bahçeşehir University (BAU)',
          overview: 'Located on the scenic shores of the Bosphorus in Beşiktaş, Bahçeşehir University is a dynamic global institution known for innovative engineering, computer science, and business curricula.',
          admissionRequirements: 'High school graduation certificate, transcripts, and passport copy.',
          accommodationInfo: 'Affiliated premium student residences in Beşiktaş, Mecidiyeköy, and Göztepe.',
          accreditationInfo: 'Recognized worldwide with ABET and international accreditation bodies.',
          address: 'Çırağan Caddesi, Beşiktaş, Istanbul, Turkey',
        },
      ],
    },
    {
      slug: 'koc-university',
      type: 'PRIVATE',
      city: 'Istanbul',
      establishedYear: 1993,
      campusType: 'SUBURBAN',
      ranking: 1,
      websiteUrl: 'https://ku.edu.tr',
      logoUrl: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=200&auto=format&fit=crop&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1568792923760-d70635a89fa8?w=1200&auto=format&fit=crop&q=80',
      featured: true,
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'جامعة كوتش',
          overview: 'تعتبر جامعة كوتش الأولى في تركيا وضمن أفضل 500 جامعة على مستوى العالم في تصنيف QS وTimes Higher Education. لغة التدريس الإنجليزية بنسبة 100% مع هيئة تدريسية حاصلة على درجات الدكتوراه من جامعات هارفارد وMIT وستانفورد.',
          admissionRequirements: 'معدلات أكاديمية متميزة في الثانوية العامة، مع أفضلية لنتائج امتحانات SAT أو IB.',
          accommodationInfo: 'حرم جامعي فاخر في ساريير يوفر غرف سكنية لجميع الطلاب الدوليين الجدد مع مرافق رياضية وثقافية أولمبية.',
          accreditationInfo: 'معتمدة عالمياً وتتمتع بالاعتماد الثلاثي Triple Crown لكليات إدارة الأعمال (AACSB, EQUIS, AMBA).',
          address: 'Rumelifeneri Yolu, Sarıyer, İstanbul, Türkiye',
        },
        {
          lang: 'tr',
          name: 'Koç Üniversitesi',
          overview: 'Türkiye’nin en prestijli araştırma üniversitesi olup, Times Higher Education sıralamasında en üst sıralarda yer almaktadır.',
          admissionRequirements: 'Üstün akademik başarı, SAT/IB/Lise ortalaması.',
          accommodationInfo: 'Sarıyer ana kampüsünde tam donanımlı yurt imkanları.',
          accreditationInfo: 'EQUIS, AACSB, AMBA Triple Crown akreditasyonu ve YÖK onayı.',
          address: 'Rumelifeneri Yolu, Sarıyer, İstanbul, Türkiye',
        },
        {
          lang: 'en',
          name: 'Koç University',
          overview: 'Consistently ranked #1 in Turkey and among top world universities, Koç University offers world-class research infrastructure and 100% English medium of instruction.',
          admissionRequirements: 'High academic transcripts, SAT or recognized international diplomas.',
          accommodationInfo: 'Scenic green campus in Sarıyer with guaranteed on-campus housing for international students.',
          accreditationInfo: 'Triple Crown accredited business school and global research recognitions.',
          address: 'Rumelifeneri Yolu, Sarıyer, Istanbul, Turkey',
        },
      ],
    },
    {
      slug: 'istanbul-university',
      type: 'PUBLIC',
      city: 'Istanbul',
      establishedYear: 1453,
      campusType: 'URBAN',
      ranking: 5,
      websiteUrl: 'https://istanbul.edu.tr',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=200&auto=format&fit=crop&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?w=1200&auto=format&fit=crop&q=80',
      featured: false,
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'جامعة إسطنبول الحكومية',
          overview: 'أقدم وأعرق جامعة حكومية في تركيا بتاريخ يمتد منذ عام 1453 في قلب ميدان بيازيد التاريخي. خرجت نوبليين ورؤساء دول وتضم كليات عريقة في الطب، الحقوق، والآداب والعلوم الاقتصادية بتكاليف دراسية رمزية للغاية.',
          admissionRequirements: 'امتحان TR-YÖS الموحد أو امتحانات دولية معتمدة وفق المقاعد المخصصة للطلاب الأجانب.',
          accommodationInfo: 'إمكانية الاستفادة من سكنات الدولة الحكومية (KYK) أو السكنات الطلابية الخاصة المحيطة بميدان الفاتح وبيازيد.',
          accreditationInfo: 'معترف بها في كافة دول العالم ومدرجة في اتفاقيات بولونيا للتبادل الأوروبي إيراسموس.',
          address: 'Beyazıt Meydanı, Fatih, İstanbul, Türkiye',
        },
        {
          lang: 'tr',
          name: 'İstanbul Üniversitesi',
          overview: '1453 yılında kurulan Türkiye’nin en köklü devlet üniversitesidir. Tarihi Beyazıt kampüsü ve tıp, hukuk gibi prestijli fakülteleriyle bilinir.',
          admissionRequirements: 'TR-YÖS veya denk uluslararası sınav sonuçları.',
          accommodationInfo: 'KYK yurtları ve Fatih bölgesindeki özel öğrenci evleri.',
          accreditationInfo: 'Tüm dünyada tanınan YÖK onaylı köklü diploma.',
          address: 'Beyazıt Meydanı, Fatih, İstanbul, Türkiye',
        },
        {
          lang: 'en',
          name: 'Istanbul University',
          overview: 'Founded in 1453, Istanbul University is the oldest and most historic public university in Turkey, offering prestigious programs in medicine, law, and humanities.',
          admissionRequirements: 'TR-YÖS examination or recognized foreign qualifications with university quotas.',
          accommodationInfo: 'Access to public KYK dorms and private student residences around historic Fatih and Beyazıt.',
          accreditationInfo: 'Universally recognized degree with extensive European Bologna agreements.',
          address: 'Beyazıt Square, Fatih, Istanbul, Turkey',
        },
      ],
    },
    {
      slug: 'sabanci-university',
      type: 'PRIVATE',
      city: 'Istanbul',
      establishedYear: 1999,
      campusType: 'SUBURBAN',
      ranking: 2,
      websiteUrl: 'https://sabanciuniv.edu',
      logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
      coverImageUrl: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?w=1200&auto=format&fit=crop&q=80',
      featured: true,
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'جامعة سابانجي',
          overview: 'تتميز جامعة سابانجي بنظامها الأكاديمي الليبرالي الفريد الذي يسمح للطلاب باختيار تخصصهم بعد إتمام السنة الأولى بحرية تامة دون قيود. تصنف بين الجامعات النخبوية في الهندسة والذكاء الاصطناعي وريادة الأعمال.',
          admissionRequirements: 'شهادة ثانوية بمعدل متميز أو امتحان SAT/ACT، مع مقابلة شخصية لبعض التخصصات.',
          accommodationInfo: 'حرم جامعي مغلق حديث في منطقة توزلا يوفر سكنات جامعية فاخرة ومرافق ترفيهية متكاملة.',
          accreditationInfo: 'معتمدة دولياً ومصنفة ضمن أفضل جامعات العالم الشابة.',
          address: 'Orhanlı, Tuzla, İstanbul, Türkiye',
        },
        {
          lang: 'tr',
          name: 'Sabancı Üniversitesi',
          overview: 'Özgür program seçimi sistemiyle öne çıkan, girişimcilik ve mühendislikte Türkiye’nin en yenilikçi vakıf üniversitelerindendir.',
          admissionRequirements: 'Lise başarı puanı, SAT veya eşdeğer sınavlar.',
          accommodationInfo: 'Tuzla kampüsünde yüksek standartlı yurt odaları.',
          accreditationInfo: 'AACSB, YÖK ve uluslararası araştırma akreditasyonları.',
          address: 'Orhanlı, Tuzla, İstanbul, Türkiye',
        },
        {
          lang: 'en',
          name: 'Sabanci University',
          overview: 'Pioneering an interdisciplinary curriculum that lets students declare their major at the end of the second year, Sabancı excels in AI, nanotechnology, and management.',
          admissionRequirements: 'Competitive high school scores, SAT/ACT, and English proficiency.',
          accommodationInfo: 'Self-contained campus in Tuzla featuring modern, safe residences.',
          accreditationInfo: 'Global AACSB accreditation and international rankings.',
          address: 'Orhanlı, Tuzla, Istanbul, Turkey',
        },
      ],
    },
  ];

  for (const uData of universitiesData) {
    const { translations, ...uFields } = uData;
    const uni = await prisma.university.upsert({
      where: { slug: uFields.slug },
      update: uFields,
      create: uFields,
    });

    for (const t of translations) {
      await prisma.universityTranslation.upsert({
        where: {
          universityId_lang: {
            universityId: uni.id,
            lang: t.lang,
          },
        },
        update: t,
        create: {
          ...t,
          universityId: uni.id,
        },
      });
    }
  }

  console.log('Created universities and multilingual descriptions');

  // 4. Academic Programs
  const medipol = await prisma.university.findUnique({ where: { slug: 'istanbul-medipol-university' } });
  const bau = await prisma.university.findUnique({ where: { slug: 'bahcesehir-university' } });
  const koc = await prisma.university.findUnique({ where: { slug: 'koc-university' } });
  const sabanci = await prisma.university.findUnique({ where: { slug: 'sabanci-university' } });
  const iu = await prisma.university.findUnique({ where: { slug: 'istanbul-university' } });

  const programsData = [
    {
      universityId: medipol.id,
      categoryId: categories['medicine-health'].id,
      slug: 'medicine-english',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 6,
      annualTuition: 32000,
      discountedTuition: 28000,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'الطب البشري (عام)',
          facultyName: 'الطب البشري الدولي',
          description: 'برنامج طبي متكامل يدرس باللغة الإنجليزية في أحدث مستشفيات تركيا مع تدريب سريري سريري عالي المستوى وفرص إقامة طبية عالمية.',
          requirements: 'شهادة الثانوية العامة بمعدل 80% فما فوق، واجتياز فحص المستندات الأكاديمية.',
          careerOpportunities: 'العمل كطبيب ممارس، التحضير لشهادات المعادلة مثل USMLE وPLAB وTUS.',
        },
        {
          lang: 'tr',
          name: 'Tıp Fakültesi (İngilizce)',
          facultyName: 'Uluslararası Tıp Fakültesi',
          description: 'Medipol Mega Hastaneler Kompleksi bünyesinde 6 yıllık ileri tıp eğitimi.',
          requirements: 'Yüksek lise ortalaması veya denk sınav belgesi.',
          careerOpportunities: 'Uzmanlık eğitimi (TUS/USMLE) ve uluslararası klinik kariyer.',
        },
        {
          lang: 'en',
          name: 'Doctor of Medicine (M.D.) - English',
          facultyName: 'International Faculty of Medicine',
          description: 'A prestigious 6-year program taught entirely in English with hands-on clinical training at Medipol Mega Hospital Complex.',
          requirements: 'High School Diploma with minimum 80% GPA, passport copy.',
          careerOpportunities: 'Clinical practice worldwide, eligibility for USMLE, PLAB, and residency programs.',
        },
      ],
    },
    {
      universityId: medipol.id,
      categoryId: categories['dentistry-pharmacy'].id,
      slug: 'dentistry-english',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 5,
      annualTuition: 24000,
      discountedTuition: 21000,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'طب وجراحة الأسنان',
          facultyName: 'كلية طب الأسنان',
          description: 'تدريب متقدم على أحدث تقنيات الليزر وزراعة الأسنان في مستشفى الأسنان التخصصي التابع للجامعة.',
          requirements: 'معدل ثانوية 75% فما فوق وجواز سفر صالح.',
          careerOpportunities: 'فتح عيادة خاصة، التخصص في التقويم وجراحة الفك وزراعة الأسنان.',
        },
        {
          lang: 'tr',
          name: 'Diş Hekimliği (İngilizce)',
          facultyName: 'Diş Hekimliği Fakültesi',
          description: 'Modern klinik simülasyon laboratuvarlarında 5 yıllık kapsamlı eğitim.',
          requirements: 'Lise diploması ve transkript.',
          careerOpportunities: 'Diş hekimi, ortodonti, cerrahi uzmanlığı.',
        },
        {
          lang: 'en',
          name: 'Dentistry (D.D.S.) - English',
          facultyName: 'Faculty of Dentistry',
          description: 'Comprehensive 5-year dental curriculum featuring phantom simulation laboratories and high patient-volume clinical practice.',
          requirements: 'High school graduation with 75%+ GPA.',
          careerOpportunities: 'Private practice, orthodontics, oral surgery, and global dental careers.',
        },
      ],
    },
    {
      universityId: bau.id,
      categoryId: categories['computer-science-ai'].id,
      slug: 'software-engineering-english',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 9000,
      discountedTuition: 7500,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'هندسة البرمجيات والذكاء الاصطناعي',
          facultyName: 'كلية الهندسة والعلوم الطبيعية',
          description: 'منهج حديث يركز على هندسة البرمجيات المتقدمة، الحوسبة السحابية، والأنظمة الموزعة مع فرص تدريب وشراكات مع كبرى شركات التكنولوجيا في إسطنبول.',
          requirements: 'شهادة الثانوية العامة بمعدل 70% في الفرع العلمي أو العام.',
          careerOpportunities: 'مهندس برمجيات أول، مهندس ذكاء اصطناعي، مطور سحابي، مؤسس شركات ناشئة.',
        },
        {
          lang: 'tr',
          name: 'Yazılım Mühendisliği (İngilizce)',
          facultyName: 'Mühendislik ve Doğa Bilimleri Fakültesi',
          description: 'Yapay zeka, bulut sistemler ve yazılım mimarisi odaklı küresel standartta eğitim.',
          requirements: 'Lise diploması (sayısal veya fen alanı tercih edilir).',
          careerOpportunities: 'Yazılım mühendisi, veri bilimci, teknoloji lideri.',
        },
        {
          lang: 'en',
          name: 'Software Engineering - English',
          facultyName: 'Faculty of Engineering and Natural Sciences',
          description: 'A progressive 4-year ABET-recognized engineering curriculum covering cloud architecture, modern full-stack development, and machine learning.',
          requirements: 'High school certificate with strong mathematics background.',
          careerOpportunities: 'Senior Software Engineer, AI Systems Architect, Tech Lead.',
        },
      ],
    },
    {
      universityId: koc.id,
      categoryId: categories['engineering-tech'].id,
      slug: 'computer-engineering-koc',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 22000,
      discountedTuition: 20000,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'CLOSING_SOON',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'هندسة الكمبيوتر والأنظمة المدمجة',
          facultyName: 'كلية الهندسة',
          description: 'برنامج النخبة المصنف الأول في تركيا، يجمع بين علوم الحاسوب المتقدمة وهندسة العتاد والذكاء الاصطناعي بإشراف علماء عالميين.',
          requirements: 'شهادة ثانوية بمعدل 90% مع نتيجة امتحان SAT ممتازة.',
          careerOpportunities: 'العمل في عمالقة التكنولوجيا العالميين مثل Google وApple وMicrosoft والشركات البحثية.',
        },
        {
          lang: 'tr',
          name: 'Bilgisayar Mühendisliği (İngilizce)',
          facultyName: 'Mühendislik Fakültesi',
          description: 'Türkiye’nin zirvesindeki bilgisayar mühendisliği programı, dünya çapında araştırma imkanları.',
          requirements: 'Yüksek lise puanı ve SAT skoru.',
          careerOpportunities: 'Global teknoloji şirketlerinde araştırma ve geliştirme mühendisliği.',
        },
        {
          lang: 'en',
          name: 'Computer Engineering (B.Sc.)',
          facultyName: 'College of Engineering',
          description: 'Elite undergraduate program combining hardware design, algorithms, high-performance computing, and AI research.',
          requirements: 'Outstanding academic record (90%+ GPA) and competitive SAT scores.',
          careerOpportunities: 'Roles at top global tech firms (Google, Amazon, Meta) and top graduate research programs.',
        },
      ],
    },
    {
      universityId: sabanci.id,
      categoryId: categories['business-management'].id,
      slug: 'management-sabanci',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 19500,
      discountedTuition: 17000,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'إدارة الأعمال والتمويل الدولي',
          facultyName: 'كلية سابانجي لإدارة الأعمال',
          description: 'كلية معتمدة من AACSB تمنح تعليماً قيادياً عالمياً في التمويل والتسويق الرقمي واستراتيجيات الشركات والابتكار.',
          requirements: 'شهادة الثانوية بمعدل 75% فما فوق وإجادة اللغة الإنجليزية.',
          careerOpportunities: 'المصارف الاستثمارية، الاستشارات الاستراتيجية، إدارة الشركات متعددة الجنسيات.',
        },
        {
          lang: 'tr',
          name: 'Yönetim Bilimleri (İngilizce)',
          facultyName: 'Sabancı Yönetim Bilimleri Fakültesi',
          description: 'AACSB akrediteli, liderlik ve finans odaklı çağdaş işletme eğitimi.',
          requirements: 'Lise diploması ve İngilizce yeterliliği.',
          careerOpportunities: 'Yatırım bankacılığı, yönetim danışmanlığı, girişimcilik.',
        },
        {
          lang: 'en',
          name: 'Management & International Business',
          facultyName: 'Sabancı Business School',
          description: 'AACSB-accredited business program focusing on strategic finance, digital transformation, marketing analytics, and corporate leadership.',
          requirements: 'High school graduation with competitive scores.',
          careerOpportunities: 'Investment banking, management consulting, multinational brand leadership.',
        },
      ],
    },
    {
      universityId: iu.id,
      categoryId: categories['medicine-health'].id,
      slug: 'public-medicine-istanbul',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'TURKISH',
      durationYears: 6,
      annualTuition: 3500,
      discountedTuition: 3500,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'الطب البشري (جامعة إسطنبول الحكومية)',
          facultyName: 'كلية جراح باشا / إسطنبول الطبية',
          description: 'كلية الطب الأعرق في تاريخ تركيا برسوم حكومية رمزية وتاريخ تعليمي يمتد لمئات السنين ومستشفيات جامعية ضخمة.',
          requirements: 'امتحان TR-YÖS بنتيجة ممتازة (90% فما فوق) وجواز سفر ومفاضلة رسمية.',
          careerOpportunities: 'ممارسة مهنة الطب في تركيا والعالم، والالتحاق ببرنامج الاختصاص TUS.',
        },
        {
          lang: 'tr',
          name: 'İstanbul Tıp Fakültesi (Devlet)',
          facultyName: 'İstanbul Tıp Fakültesi',
          description: 'Türkiye’nin en köklü devlet tıp eğitimi, yüksek hasta çeşitliliği ve klinik deneyim.',
          requirements: 'TR-YÖS sınavı ve YÖK yerleştirme koşulları.',
          careerOpportunities: 'Uzman hekimlik ve akademik kariyer.',
        },
        {
          lang: 'en',
          name: 'Medicine (Public University)',
          facultyName: 'Faculty of Medicine',
          description: 'Historic medical education at Turkey’s premier public institution with high clinical caseloads at subsidized tuition rates.',
          requirements: 'TR-YÖS official exam score and competitive centralized quota selection.',
          careerOpportunities: 'Practicing physician in Turkey, EU nostrification, TUS residency.',
        },
      ],
    },
  ];

  for (const pData of programsData) {
    const { translations, ...pFields } = pData;
    const prog = await prisma.academicProgram.upsert({
      where: {
        universityId_slug: {
          universityId: pFields.universityId,
          slug: pFields.slug,
        },
      },
      update: pFields,
      create: pFields,
    });

    for (const pt of translations) {
      await prisma.programTranslation.upsert({
        where: {
          programId_lang: {
            programId: prog.id,
            lang: pt.lang,
          },
        },
        update: pt,
        create: {
          ...pt,
          programId: prog.id,
        },
      });
    }
  }

  console.log('Created academic programs and multilingual translations');

  // 5. Educational Services
  const servicesData = [
    {
      slug: 'university-admissions',
      icon: 'GraduationCap',
      pricePolicy: 'FREE_CONSULTATION',
      estimatedDuration: '2 - 5 business days',
      featured: true,
      published: true,
      sortOrder: 1,
      translations: [
        {
          lang: 'ar',
          title: 'القبول الجامعي المضمون والمجاني',
          description: 'نوفر لك القبول الرسمي في أفضل الجامعات التركية الخاصة بدون أي رسوم وساطة أو أتعاب. نساعدك في اختيار التخصص والجامعة ونضمن لك أعلى خصم متاح على الأقساط السنوية.',
          benefits: 'استشارة أكاديمية مجانية بالكامل\nخصومات حصرية تصل حتى 75% من القسط الأصلي\nاستخراج خطاب القبول المبدئي في أقل من 48 ساعة\nمتابعة تثبيت المقعد والتسجيل النهائي',
          eligibility: 'متاح لجميع الطلاب الدوليين الحاصلين على شهادة الثانوية العامة أو ما يعادلها.',
          procedureSteps: JSON.stringify([
            'إرسال صورة جواز السفر والشهادة المدرسية',
            'دراسة الملف واقتراح أفضل 3 جامعات وتخصصات',
            'تقديم الطلب الرسمي واستلام القبول المبدئي',
            'دفع الدفعة الأولى للجامعة واستلام القبول النهائي الرسمي',
          ]),
          requiredDocuments: JSON.stringify([
            'صورة جواز السفر ساري المفعول',
            'صورة كشف درجات الثانوية العامة مترجم ومصدق',
            'صورة شخصية حديثة',
          ]),
        },
        {
          lang: 'tr',
          title: 'Garantili ve Ücretsiz Üniversite Kabulü',
          description: 'Türkiye’deki anlaşmalı vakıf üniversitelerine aracılık ücreti ödemeden doğrudan resmi kabul.',
          benefits: 'Ücretsiz danışmanlık, %75’e varan burslar, 48 saatte kabul mektubu.',
          eligibility: 'Tüm yabancı uyruklu lise mezunu öğrenciler.',
          procedureSteps: JSON.stringify(['Evrak inceleme', 'Üniversite seçimi', 'Resmi kabul başvurusu', 'Kesin kayıt']),
          requiredDocuments: JSON.stringify(['Pasaport', 'Lise diploması ve transkript', 'Biyometrik fotoğraf']),
        },
        {
          lang: 'en',
          title: 'Guaranteed University Admission (Zero Agency Fees)',
          description: 'Secure official admission letters to top Turkish private universities with exclusive partner tuition waivers up to 75%.',
          benefits: '100% Free consultation\nNo agency fees\nOffer letter within 48 hours\nExclusive partner discounts',
          eligibility: 'International students with a recognized high school diploma or equivalent.',
          procedureSteps: JSON.stringify([
            'Document evaluation and program matching',
            'Official application submission to university',
            'Conditional acceptance letter issuance (48 hrs)',
            'Tuition deposit and final official acceptance letter',
          ]),
          requiredDocuments: JSON.stringify([
            'Valid International Passport',
            'High School Diploma and Academic Transcripts',
            'Recent Passport-sized Photo',
          ]),
        },
      ],
    },
    {
      slug: 'denklik-equivalency',
      icon: 'FileCheck',
      pricePolicy: 'VARIABLE',
      estimatedDuration: '10 - 20 days',
      featured: true,
      published: true,
      sortOrder: 2,
      translations: [
        {
          lang: 'ar',
          title: 'معادلة الشهادات (الدنكليك)',
          description: 'إجراءات معادلة الشهادة الثانوية والجامعية من وزارة التربية والتعليم ومجلس التعليم العالي التركي (YÖK) لضمان الاعتراف القانوني الكامل بشهادتك في تركيا.',
          benefits: 'حجز المواعيد الرسمية\nالتدقيق المسبق للأوراق لمنع الرفض\nالترجمة المحلفة والتصديق لدى كاتب العدل (النوتر)\nتسليم الشهادة المعترف بها يداً بيد',
          eligibility: 'الطلاب المسجلون بالجامعات التركية أو الراغبون بالعمل أو إكمال الدراسات العليا.',
          procedureSteps: JSON.stringify([
            'حصر وتدقيق المستندات الأصلية',
            'الترجمة القانونية المحلفة والتصديق النوتاري',
            'التقديم عبر البوابة الإلكترونية لوزارة التعليم التركية',
            'حضور الموعد واستلام وثيقة المعادلة الرسمية',
          ]),
          requiredDocuments: JSON.stringify([
            'الشهادة الأصلية وكشف الدرجات مصدقة من الخارجية والسفارة',
            'جواز السفر والإقامة التركية إن وجدت',
            'ورقة القبول الجامعي أو وثيقة الطالب',
          ]),
        },
        {
          lang: 'tr',
          title: 'Lise ve Üniversite Denklik Danışmanlığı',
          description: 'MEB ve YÖK nezdinde lise ve lisans diplomalarınızın resmi denklik belgesi (Denklik) alım süreci desteği.',
          benefits: 'Hızlı randevu, hatasız evrak hazırlığı, noter ve tercüme koordinasyonu.',
          eligibility: 'Türkiye’de eğitim alacak tüm yabancı öğrenciler.',
          procedureSteps: JSON.stringify(['Evrak kontrolü', 'Yeminli tercüme', 'MEB/YÖK başvurusu', 'Belge teslimi']),
          requiredDocuments: JSON.stringify(['Apostilli veya tasdikli orijinal diploma', 'Pasaport', 'Öğrenci belgesi']),
        },
        {
          lang: 'en',
          title: 'Diploma Equivalency (Denklik) Assistance',
          description: 'Full guidance through the Ministry of National Education (MEB) and Higher Education Council (YÖK) equivalency procedures.',
          benefits: 'Official appointment scheduling\nPre-screening to eliminate rejection risk\nSworn translations & notary certification\nEnd-to-end follow-up until certificate issuance',
          eligibility: 'All students enrolled in Turkish universities requiring graduation recognition.',
          procedureSteps: JSON.stringify([
            'Document verification & apostille check',
            'Certified sworn translation into Turkish',
            'Online portal registration with MEB/YÖK',
            'Appointment representation & certificate retrieval',
          ]),
          requiredDocuments: JSON.stringify([
            'Original High School Diploma with Foreign Ministry stamp',
            'Official transcripts for all secondary school years',
            'Valid Passport and Student Certificate (Öğrenci Belgesi)',
          ]),
        },
      ],
    },
    {
      slug: 'student-residence-permit',
      icon: 'ShieldCheck',
      pricePolicy: 'FIXED',
      estimatedDuration: '15 - 30 days',
      featured: true,
      published: true,
      sortOrder: 3,
      translations: [
        {
          lang: 'ar',
          title: 'استخراج الإقامة الطلابية (الإيكامت)',
          description: 'خدمة شاملة لاستخراج تصريح الإقامة الطلابية الرسمي في تركيا من إدارة الهجرة العامة (Göç İdaresi) دون أخطاء أو تأخير.',
          benefits: 'تجهيز ملف الإقامة القانوني كاملاً\nإصدار التأمين الصحي الطلابي الإلزامي\nحجز موعد المقابلة ومرافقة الطالب إن لزم الأمر\nمتابعة تتبع بطاقة الإقامة حتى وصولها بالبريد PTT',
          eligibility: 'أي طالب أجنبي مسجل رسمياً في جامعة تركية ويحمل تأشيرة أو دخولاً نظامياً.',
          procedureSteps: JSON.stringify([
            'الحصول على وثيقة الطالب (Öğrenci Belgesi) مع كود UETS',
            'إصدار التأمين الصحي وسداد الرسوم الضريبية',
            'تقديم الطلب في موقع الهجرة وحجز موعد البصمات',
            'تسليم الملف واستلام كود المتابعة',
          ]),
          requiredDocuments: JSON.stringify([
            'وثيقة الطالب من الجامعة برقم باركود ساري',
            'عقد إيجار مصدق من النوتر أو إثبات سكن جامعي',
            'التأمين الصحي الطلابي',
            '4 صور شخصية بيومترية وإيصال دفع الضرائب',
          ]),
        },
        {
          lang: 'tr',
          title: 'Öğrenci İkamet İzni Danışmanlığı',
          description: 'Göç İdaresi Başkanlığı nezdinde öğrenci ikamet tezkeresi başvuru ve dosya hazırlama hizmeti.',
          benefits: 'E-ikamet randevusu, zorunlu sağlık sigortası, vergi ödemeleri ve PTT kurye takibi.',
          eligibility: 'Türkiye’de kayıtlı aktif yabancı uyruklu öğrenciler.',
          procedureSteps: JSON.stringify(['Öğrenci belgesi temini', 'Sigorta ve vergi', 'Randevu alma', 'Dosya teslimi']),
          requiredDocuments: JSON.stringify(['Öğrenci belgesi', 'Kira kontratı / Yurt belgesi', 'Sigorta poliçesi', '4 biyometrik fotoğraf']),
        },
        {
          lang: 'en',
          title: 'Student Residence Permit (İkamet) Support',
          description: 'Complete legal assistance for securing your official Turkish student residence permit through the Directorate of Migration Management (Göç İdaresi).',
          benefits: 'Flawless dossier compilation\nMandatory student health insurance issuance\nTax payments and appointment coordination\nPTT postal tracking until physical card delivery',
          eligibility: 'Any international student with active university enrollment and legal entry into Turkey.',
          procedureSteps: JSON.stringify([
            'Procure active e-signed Student Certificate & UETS code',
            'Issue approved Health Insurance and pay government tax',
            'Submit online e-İkamet declaration and book biometric slot',
            'Attend appointment and monitor courier tracking',
          ]),
          requiredDocuments: JSON.stringify([
            'Official Student Certificate (Öğrenci Belgesi)',
            'Notarized Rent Agreement or Official Dormitory Letter',
            'Approved Student Health Insurance Policy',
            '4 Biometric Photos and Passport copies',
          ]),
        },
      ],
    },
    {
      slug: 'airport-pickup-housing',
      icon: 'Home',
      pricePolicy: 'VARIABLE',
      estimatedDuration: 'Same day',
      featured: false,
      published: true,
      sortOrder: 4,
      translations: [
        {
          lang: 'ar',
          title: 'الاستقبال من المطار وتأمين السكن الطلابي',
          description: 'راحة بال تامة منذ لحظة وصولك إلى مطار إسطنبول؛ سيارة خاصة لاستقبالك، ونقلك إلى سكنك الطلابي المجهز مسبقاً بعناية وأمان.',
          benefits: 'استقبال في صالة الوصول بسيارة خاصة\nمساعد يتحدث العربية والتركية والإنجليزية\nتوفير شريحة هاتف تركية وإنترنت فوري\nمرافقة لمعاينة واختيار أفضل سكن جامعي مرخص',
          eligibility: 'الطلاب الجدد وعائلاتهم القادمين إلى تركيا لأول مرة.',
          procedureSteps: JSON.stringify([
            'إرسال تفاصيل رحلة الطيران قبل 48 ساعة من الوصول',
            'تأكيد حجز السكن والسيارة وتزويد الطالب بمعلومات السائق',
            'الاستقبال في المطار والتوصيل مباشرة إلى مقر الإقامة',
            'المساعدة في تسجيل السكن وشراء الاحتياجات الأساسية',
          ]),
          requiredDocuments: JSON.stringify([
            'تذكرة الطيران وتاريخ الوصول',
            'اسم الطالب ورقم الواتساب للتواصل الحي',
          ]),
        },
        {
          lang: 'tr',
          title: 'Havalimanı Karşılama ve Yurt Yerleştirme',
          description: 'Havalimanından konforlu transfer ve onaylı öğrenci yurtlarına güvenli yerleşim desteği.',
          benefits: 'VIP transfer, çok dilli karşılama ekibi, SIM kart temini, yurt sözleşmesi rehberliği.',
          eligibility: 'Türkiye’ye ilk kez gelecek tüm öğrenciler.',
          procedureSteps: JSON.stringify(['Uçuş bilgisi iletimi', 'Karşılama koordinasyonu', 'Transfer ve yerleşim']),
          requiredDocuments: JSON.stringify(['Uçak bileti', 'İletişim numarası']),
        },
        {
          lang: 'en',
          title: 'Airport Reception & Student Housing Placement',
          description: 'Seamless arrival experience at Istanbul airports with private transfer and verified accommodation in accredited student residences.',
          benefits: 'Arrival gate pickup in private vehicle\nMultilingual arrival assistant (Arabic, English, Turkish)\nLocal SIM card & high-speed data setup\nGuided check-in to vetted, safe student dormitories',
          eligibility: 'Newly arriving students and accompanying family members.',
          procedureSteps: JSON.stringify([
            'Submit flight itinerary 48 hours prior to touchdown',
            'Driver and welcome assistant assigned with live tracking',
            'Airport meet-and-greet and direct transport to residence',
            'Check-in completion and neighborhood orientation',
          ]),
          requiredDocuments: JSON.stringify([
            'Confirmed flight ticket details',
            'Active WhatsApp contact number',
          ]),
        },
      ],
    },
  ];

  for (const sData of servicesData) {
    const { translations, ...sFields } = sData;
    const serv = await prisma.service.upsert({
      where: { slug: sFields.slug },
      update: sFields,
      create: sFields,
    });

    for (const st of translations) {
      await prisma.serviceTranslation.upsert({
        where: {
          serviceId_lang: {
            serviceId: serv.id,
            lang: st.lang,
          },
        },
        update: st,
        create: {
          ...st,
          serviceId: serv.id,
        },
      });
    }
  }

  console.log('Created educational consulting services');

  // 6. Courses & Training
  const coursesData = [
    {
      slug: 'tryos-mastery-course',
      studyMode: 'ONLINE',
      durationWeeks: 16,
      schedule: '3 days/week (Mon, Wed, Sat) - 18:00 to 21:00 TRT',
      price: 350,
      currency: 'USD',
      capacity: 30,
      registeredCount: 18,
      status: 'ACTIVE',
      registrationDeadline: new Date('2026-12-15'),
      imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80',
      published: true,
      translations: [
        {
          lang: 'ar',
          title: 'دورة التحضير لامتحان اليوس الموحد TR-YÖS',
          description: 'دورة مكثفة وشاملة لاجتياز امتحان اليوس المركزي المؤهل للجامعات الحكومية التركية بتدريب على الرياضيات المتقدمة، الهندسة، واختبارات الذكاء IQ مع نماذج امتحانات حقيقية.',
          instructor: 'نخبة من الأساتذة الأتراك والعرب ذوي الخبرة لأكثر من 10 سنوات',
          curriculum: JSON.stringify([
            'الوحدة الأولى: الرياضيات الأساسية والجبر والمعادلات',
            'الوحدة الثانية: الهندسة المستوية والفضائية والمتجهات',
            'الوحدة الثالثة: أسئلة الذكاء والمنطق والأنماط الهندسية (IQ)',
            'الوحدة الرابعة: 20 اختباراً تجريبياً يحاكي الامتحان الرسمي بدقة',
          ]),
          requirements: 'معرفة أساسية بمبادئ الرياضيات المدرسية ورغبة في دراسة التخصصات الطبية والهندسية بالجامعات الحكومية.',
        },
        {
          lang: 'tr',
          title: 'TR-YÖS Kapsamlı Hazırlık Kursu',
          description: 'Devlet üniversitelerine girişte zorunlu olan TR-YÖS sınavına yönelik matematik, geometri ve mantık (IQ) odaklı online eğitim.',
          instructor: 'Alanında uzman kıdemli YÖS eğitmenleri',
          curriculum: JSON.stringify(['Matematik 1 ve 2', 'Geometri', 'Sayısal Mantık ve IQ', 'Deneme Sınavları']),
          requirements: 'Lise matematik temeli.',
        },
        {
          lang: 'en',
          title: 'TR-YÖS Turkish Public Universities Entrance Exam Prep',
          description: 'Comprehensive 16-week online preparation course covering higher algebra, geometry, and IQ spatial reasoning for entrance into Turkish state universities.',
          instructor: 'Senior faculty with over a decade of dedicated YÖS training excellence',
          curriculum: JSON.stringify([
            'Module 1: Algebra, Functions & Polynomials',
            'Module 2: Plane & Solid Euclidean Geometry',
            'Module 3: IQ, Pattern Recognition & Abstract Logic',
            'Module 4: 20 Full-Length Timed Mock Examinations',
          ]),
          requirements: 'Basic high school mathematics proficiency.',
        },
      ],
    },
    {
      slug: 'tomer-turkish-language-b1-c1',
      studyMode: 'HYBRID',
      durationWeeks: 12,
      schedule: 'Daily (Mon to Thu) - 10:00 to 13:00 TRT',
      price: 280,
      currency: 'USD',
      capacity: 25,
      registeredCount: 14,
      status: 'ACTIVE',
      registrationDeadline: new Date('2026-11-30'),
      imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80',
      published: true,
      translations: [
        {
          lang: 'ar',
          title: 'دورة اللغة التركية التومر (TÖMER B1 - C1)',
          description: 'برنامج معتمد يركز على المحادثة الأكاديمية وقواعد اللغة التركية المتقدمة لتمكين الطالب من اجتياز امتحان الكفاءة الجامعي المعفى من السنة التحضيرية.',
          instructor: 'أساتذة أتراك لغتهم الأم معتمدون من مراكز التومر الجامعية',
          curriculum: JSON.stringify([
            'المستوى B1: المحادثة اليومية وقواعد التراكيب الزمنية المتقدمة',
            'المستوى B2: القراءة الأكاديمية والنقاشات التخصصية',
            'المستوى C1: كتابة الأبحاث والمقالات الجامعية والطلاقة الشفهية الكاملة',
          ]),
          requirements: 'إتمام المستوى التأسيسي A1/A2 أو اجتياز اختبار تحديد المستوى مجاناً.',
        },
        {
          lang: 'tr',
          title: 'TÖMER Türkçe Dil Eğitimi (B1 - C1)',
          description: 'Üniversite hazırlık muafiyeti ve akademik dil yeterliliği için yoğun Türkçe programı.',
          instructor: 'Sertifikalı anadili Türkçe olan uzman akademisyenler',
          curriculum: JSON.stringify(['B1 Orta Düzey', 'B2 İleri İletişim', 'C1 Akademik Türkçe ve Yazma']),
          requirements: 'A2 seviyesi yeterliliği.',
        },
        {
          lang: 'en',
          title: 'TÖMER Academic Turkish Language Course (B1 - C1)',
          description: 'Fast-track academic Turkish language proficiency course designed to help students bypass the mandatory one-year university preparatory cycle.',
          instructor: 'Certified native Turkish linguists and university language faculty',
          curriculum: JSON.stringify([
            'Level B1: Fluent conversation and intermediate syntax',
            'Level B2: Academic discourse and scholarly literature comprehension',
            'Level C1: Academic writing, thesis terminology, and presentation mastery',
          ]),
          requirements: 'Completion of A2 Turkish or free diagnostic placement test.',
        },
      ],
    },
  ];

  for (const cData of coursesData) {
    const { translations, ...cFields } = cData;
    const course = await prisma.course.upsert({
      where: { slug: cFields.slug },
      update: cFields,
      create: cFields,
    });

    for (const ct of translations) {
      await prisma.courseTranslation.upsert({
        where: {
          courseId_lang: {
            courseId: course.id,
            lang: ct.lang,
          },
        },
        update: ct,
        create: {
          ...ct,
          courseId: course.id,
        },
      });
    }
  }

  console.log('Created courses and training programs');

  // 7. Scholarships & Offers
  const scholarshipsData = [
    {
      slug: 'turkiye-burslari-2027',
      scholarshipType: 'FULL',
      discountPercentage: 100,
      universityId: null,
      openingDate: new Date('2027-01-10'),
      deadline: new Date('2027-02-20'),
      status: 'UPCOMING',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      published: true,
      translations: [
        {
          lang: 'ar',
          title: 'المنحة التركية الحكومية (Türkiye Bursları 2027)',
          description: 'أقوى منحة دراسية ممولة بالكامل من الحكومة التركية لجميع المراحل الدراسية (بكالوريوس، ماجستير، دكتوراه). تشمل الرسوم الدراسية بنسبة 100%، السكن الجامعي المجاني، راتباً شهرياً، تذاكر الطيران، والتأمين الصحي الشامل.',
          eligibilityCriteria: 'معدل لا يقل عن 70% للبكالوريوس، 75% للدراسات العليا، و90% للتخصصات الطبية. شرط العمر: أقل من 21 للبكالوريوس وأقل من 30 للماجستير.',
          requiredDocuments: 'الشهادة الثانوية/الجامعية، كشف الدرجات، جواز السفر، خطابات توصية، ورسالة دافع قوية.',
          benefitsSummary: 'تمويل كامل 100% + راتب شهري + سكن جامعي مجاني + تذاكر سفر + تأمين صحي',
        },
        {
          lang: 'tr',
          title: 'Türkiye Bursları 2027 Resmi Hükümet Bursu',
          description: 'Yurtdışı Türkler ve Akraba Topluluklar Başkanlığı (YTB) tarafından yürütülen tam burslu eğitim programı.',
          eligibilityCriteria: 'Lisans için %70, sağlık bilimleri için %90 başarı ortalaması.',
          requiredDocuments: 'Diploma, transkript, niyet mektubu, pasaport, referanslar.',
          benefitsSummary: '%100 harç muafiyeti, aylık cep harçlığı, ücretsiz yurt, gidiş-dönüş uçak bileti.',
        },
        {
          lang: 'en',
          title: 'Türkiye Bursları 2027 (Fully Funded Government Scholarship)',
          description: 'The official Turkish government scholarship covering 100% tuition fees, free state accommodation, monthly stipend, return flights, and health insurance.',
          eligibilityCriteria: 'Minimum 70% GPA for undergrad, 75% for masters, 90% for medicine. Under 21 for bachelor applicants.',
          requiredDocuments: 'Academic certificates, transcripts, motivational letter, two recommendation letters, and valid passport.',
          benefitsSummary: '100% Free Tuition + Monthly Stipend + University Housing + Flight Tickets + Health Insurance',
        },
      ],
    },
    {
      slug: 'private-universities-50-discount',
      scholarshipType: 'DISCOUNT',
      discountPercentage: 50,
      universityId: bau.id,
      openingDate: new Date('2026-06-01'),
      deadline: new Date('2026-10-30'),
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
      published: true,
      translations: [
        {
          lang: 'ar',
          title: 'منحة الخصم الحصري 50% للجامعات الشريكة',
          description: 'منحة جزئية حصرية لطلاب منصة Sora Education توفر خصماً مباشراً بنسبة 50% على الأقساط السنوية لكافة سنوات الدراسة في كبرى الجامعات الخاصة.',
          eligibilityCriteria: 'شهادة الثانوية العامة بمعدل 70% فما فوق. المنحة مستمرة طوال سنوات الدراسة الأكاديمية.',
          requiredDocuments: 'جواز السفر وشهادة الثانوية العامة وكشف الدرجات.',
          benefitsSummary: 'خصم ثابت 50% على القسط السنوي مضمون طوال سنوات الدراسة.',
        },
        {
          lang: 'tr',
          title: 'Anlaşmalı Üniversitelerde %50 Özel Burs Fırsatı',
          description: 'Sora Education aracılığıyla başvuran uluslararası öğrencilere özel eğitim süresince geçerli %50 harç indirimi.',
          eligibilityCriteria: 'Lise diploması ve kabul kriterlerine uygunluk.',
          requiredDocuments: 'Pasaport ve lise not dökümü.',
          benefitsSummary: 'Eğitim hayatı boyunca garantili %50 öğrenim ücreti indirimi.',
        },
        {
          lang: 'en',
          title: 'Exclusive 50% Merit Discount Scholarship',
          description: 'Guaranteed 50% annual tuition waiver applicable across all study years at premier partner private universities.',
          eligibilityCriteria: 'Secondary school completion with 70%+ academic average.',
          requiredDocuments: 'Valid passport and high school transcript.',
          benefitsSummary: 'Guaranteed 50% tuition reduction locked in for the entire degree duration.',
        },
      ],
    },
  ];

  for (const scData of scholarshipsData) {
    const { translations, ...scFields } = scData;
    const scholarship = await prisma.scholarship.upsert({
      where: { slug: scFields.slug },
      update: scFields,
      create: scFields,
    });

    for (const sct of translations) {
      await prisma.scholarshipTranslation.upsert({
        where: {
          scholarshipId_lang: {
            scholarshipId: scholarship.id,
            lang: sct.lang,
          },
        },
        update: sct,
        create: {
          ...sct,
          scholarshipId: scholarship.id,
        },
      });
    }
  }

  console.log('Created scholarships and special offers');

  // 8. Blog & Articles
  const articlesData = [
    {
      slug: 'living-costs-istanbul-international-students-2026',
      category: 'LIVING',
      authorName: 'Dr. Ahmet Yılmaz (Advising Director)',
      featuredImageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1000&auto=format&fit=crop&q=80',
      readTimeMinutes: 6,
      published: true,
      translations: [
        {
          lang: 'ar',
          title: 'دليل تكاليف المعيشة والدراسة للطلاب الدوليين في إسطنبول 2026',
          excerpt: 'تفصيل شامل عن إيجارات السكن الطلابي، فواتير الخدمات، بطاقة المواصلات المخفضة، والطعام لتقدير ميزانيتك الشهرية بدقة.',
          content: `الدراسة في تركيا، وخصوصاً في إسطنبول، توفر تجربة حياة عصرية متكاملة بتكلفة معقولة مقارنة بأوروبا وأمريكا الشمالية.

### 1. تكاليف السكن الطلابي
- **السكن الجامعي الخاص:** يتراوح بين 250 إلى 450 دولاراً شهرياً شاملاً الفواتير والوجبات والتنظيف والأمن.
- **الشقق الطلابية المشتركة:** تتراوح حصة الطالب بين 180 إلى 300 دولار شهرياً في مناطق حيوية مثل الفاتح وبشكطاش وأوسكودار.

### 2. بطاقة المواصلات الطلابية (İstanbulkart)
تعتبر إسطنبول من أرخص مدن العالم للطلاب من حيث المواصلات بفضل البطاقة الطلابية المدعومة التي تمنح ركوباً غير محدود للمترو والمتروبوس والعبارات البحرية بنحو 10 إلى 12 دولاراً شهرياً فقط!

### 3. المصاريف الغذائية والشخصية
يحتاج الطالب في المتوسط ما بين 150 إلى 250 دولاراً شهرياً لتغطية الوجبات والمستلزمات الشخصية والترفيه المعتدل.

**الخلاصة:** يمكن للطالب في إسطنبول العيش بكرامة وراحة بميزانية تتراوح بين 450 إلى 700 دولار شهرياً شاملة السكن والطعام والمواصلات.`,
          metaTitle: 'تكاليف المعيشة في إسطنبول للطلاب 2026 | Sora Education',
          metaDescription: 'دليل دقيق لتكاليف السكن الطلابي، المصاريف الشهرية، والمواصلات في إسطنبول للطلاب العرب والدوليين.',
        },
        {
          lang: 'tr',
          title: '2026 Yılında İstanbul’da Uluslararası Öğrenci Yaşam Maliyetleri',
          excerpt: 'Yurt ücretleri, indirimli öğrenci İstanbulkartı ve aylık bütçe planlama rehberi.',
          content: 'İstanbul’da üniversite okumanın maliyetlerini; konaklama, ulaşım ve beslenme kalemleriyle detaylı inceliyoruz.',
          metaTitle: 'İstanbul Öğrenci Yaşam Masrafları 2026',
          metaDescription: 'Uluslararası öğrenciler için İstanbul aylık yaşam bütçesi rehberi.',
        },
        {
          lang: 'en',
          title: 'Living Costs and Student Budget in Istanbul 2026',
          excerpt: 'Comprehensive breakdown of dormitory fees, subsidized transit pass, food, and utilities for international students.',
          content: 'Studying in Istanbul offers high European living standards at accessible costs. A detailed guide to monthly student budgets.',
          metaTitle: 'Istanbul Student Cost of Living 2026 | Sora Education',
          metaDescription: 'Complete breakdown of monthly expenses, student dorm costs, and food budgets in Istanbul.',
        },
      ],
    },
    {
      slug: 'guide-student-residence-permit-turkey',
      category: 'GUIDE',
      authorName: 'Sara Al-Hashemi (Legal Affairs Advisor)',
      featuredImageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1000&auto=format&fit=crop&q=80',
      readTimeMinutes: 5,
      published: true,
      translations: [
        {
          lang: 'ar',
          title: 'دليل شامل للحصول على الإقامة الطلابية في تركيا دون أخطاء',
          excerpt: 'شرح قانوني مبسط لكافة مراحل استخراج تصريح الإقامة الطلابية (İkamet) والوثائق الإلزامية وتجنب أسباب الرفض الشائعة.',
          content: `يعد تصريح الإقامة الطلابية الوثيقة القانونية الأهم التي تسمح للطالب بالإقامة والدخول والخروج من الأراضي التركية طيلة مدة دراسته بحرية تامة.

### الخطوات الأساسية لاستخراج الإقامة:
1. **التسجيل النهائي بالجامعة:** واستخراج وثيقة الطالب (Öğrenci Belgesi) الموقعة إلكترونياً.
2. **شراء التأمين الصحي الإلزامي:** وتأمين العنوان السكني الموثق بالنوتر.
3. **تعبئة طلب e-İkamet:** عبر البوابة الرسمية لرئاسة الهجرة واختيار أقرب موعد.
4. **تسليم الملف:** في الموعد المحدد وانتظار وصول بطاقة الإقامة بالبريد.`,
          metaTitle: 'دليل الإقامة الطلابية في تركيا خطوة بخطوة',
          metaDescription: 'كل ما تحتاج لمعرفته لاستخراج الإقامة الطلابية في تركيا مع فريق Sora Education.',
        },
        {
          lang: 'tr',
          title: 'Türkiye’de Öğrenci İkamet İzni Alma Rehberi',
          excerpt: 'Göç İdaresi başvurusu, randevu süreci ve gerekli evraklar hakkında adım adım kılavuz.',
          content: 'Yabancı öğrencilerin ikamet izni alırken dikkat etmesi gereken hukuki detaylar.',
          metaTitle: 'Öğrenci İkamet İzni Rehberi | Sora Education',
          metaDescription: 'Yabancı öğrenciler için Türkiye ikamet izni başvuru rehberi.',
        },
        {
          lang: 'en',
          title: 'Step-by-Step Guide to Turkish Student Residence Permit (İkamet)',
          excerpt: 'Detailed legal breakdown of document readiness, online filing, and biometric appointments without delays.',
          content: 'A comprehensive step-by-step walk-through of obtaining your official residence card in Turkey.',
          metaTitle: 'Turkish Student Residence Permit Guide 2026',
          metaDescription: 'How international students can successfully obtain their Turkish residence permit.',
        },
      ],
    },
  ];

  for (const aData of articlesData) {
    const { translations, ...aFields } = aData;
    const article = await prisma.article.upsert({
      where: { slug: aFields.slug },
      update: aFields,
      create: aFields,
    });

    for (const at of translations) {
      await prisma.articleTranslation.upsert({
        where: {
          articleId_lang: {
            articleId: article.id,
            lang: at.lang,
          },
        },
        update: at,
        create: {
          ...at,
          articleId: article.id,
        },
      });
    }
  }

  console.log('Created blog articles and guides');

  // 9. Sample Student Applications for Pipeline
  const applicationsData = [
    {
      applicationNumber: 'SORA-2026-8941',
      fullName: 'Mustafa Tariq Al-Obaidi',
      email: 'mustafa.obaidi@example.com',
      phone: '+964 770 123 4567',
      nationality: 'Iraq',
      passportNumber: 'A18923412',
      degreeLevel: 'BACHELOR',
      desiredProgram: 'Medicine (General)',
      preferredCity: 'Istanbul',
      preferredUniversity: 'Istanbul Medipol University',
      studyLanguage: 'ENGLISH',
      currentEducation: 'High School - Scientific Stream (92%)',
      notes: 'Interested in full English curriculum and on-campus accommodation. Sent high school diploma.',
      status: 'ADMISSION_RECEIVED',
      assignedStaffId: admissionsUser.id,
      consentPrivacy: true,
      createdAt: new Date('2026-10-10'),
    },
    {
      applicationNumber: 'SORA-2026-8942',
      fullName: 'Noor Fahad Al-Mutairi',
      email: 'noor.mutairi@example.com',
      phone: '+966 50 987 6543',
      nationality: 'Saudi Arabia',
      passportNumber: 'P9023812',
      degreeLevel: 'BACHELOR',
      desiredProgram: 'Software Engineering',
      preferredCity: 'Istanbul',
      preferredUniversity: 'Bahçeşehir University',
      studyLanguage: 'ENGLISH',
      currentEducation: 'Secondary School (88%)',
      notes: 'Wants to apply for the 50% discount scholarship at Bahçeşehir University.',
      status: 'SUBMITTED_TO_UNI',
      assignedStaffId: admissionsUser.id,
      consentPrivacy: true,
      createdAt: new Date('2026-10-12'),
    },
    {
      applicationNumber: 'SORA-2026-8943',
      fullName: 'Kareem Ahmed Mansour',
      email: 'kareem.mansour@example.com',
      phone: '+20 10 2345 6789',
      nationality: 'Egypt',
      passportNumber: 'E4561238',
      degreeLevel: 'MASTER_WITH_THESIS',
      desiredProgram: 'Artificial Intelligence & Data Science',
      preferredCity: 'Istanbul',
      preferredUniversity: 'Sabancı University',
      studyLanguage: 'ENGLISH',
      currentEducation: 'B.Sc. in Computer Science (Very Good)',
      notes: 'Awaiting translated transcript and reference letters.',
      status: 'UNDER_REVIEW',
      assignedStaffId: admissionsUser.id,
      consentPrivacy: true,
      createdAt: new Date('2026-10-15'),
    },
    {
      applicationNumber: 'SORA-2026-8944',
      fullName: 'Yara Zaid Al-Homsi',
      email: 'yara.homsi@example.com',
      phone: '+963 93 112 2334',
      nationality: 'Syria',
      passportNumber: 'N0123891',
      degreeLevel: 'BACHELOR',
      desiredProgram: 'Dentistry',
      preferredCity: 'Istanbul',
      preferredUniversity: 'Istanbul Medipol University',
      studyLanguage: 'ENGLISH',
      currentEducation: 'High School (87%)',
      notes: 'New inquiry received via website application form.',
      status: 'NEW',
      assignedStaffId: null,
      consentPrivacy: true,
      createdAt: new Date('2026-10-18'),
    },
  ];

  for (const app of applicationsData) {
    const createdApp = await prisma.studentApplication.upsert({
      where: { applicationNumber: app.applicationNumber },
      update: {},
      create: app,
    });

    // Create an initial internal note
    await prisma.applicationNote.create({
      data: {
        applicationId: createdApp.id,
        authorId: admissionsUser.id,
        noteText: `Initial application received for ${createdApp.desiredProgram} at ${createdApp.preferredUniversity}. Contact verification initiated.`,
      },
    });

    // Create status history entry
    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: createdApp.id,
        previousStatus: null,
        newStatus: createdApp.status,
        changedById: admissionsUser.id,
        notes: 'Initial workflow status assignment on intake.',
      },
    });
  }

  console.log('Created realistic student applications in pipeline');

  // 10. Testimonials
  const testimonialsData = [
    {
      studentName: 'أحمد السامرائي (Ahmed Al-Samarraie)',
      nationality: 'العراق (Iraq)',
      program: 'الطب البشري (Medicine)',
      university: 'جامعة إسطنبول ميدي بول (Istanbul Medipol University)',
      rating: 5,
      quoteAr: 'تجربتي مع فريق Sora كانت نقطة تحول حقيقية. حصلت على القبول المبدئي في كلية الطب خلال 48 ساعة فقط وبخصم استثنائي، واستقبلوني من المطار وساعدوني في السكن والإقامة خطوة بخطوة بكل مصداقية.',
      quoteTr: 'Sora Education sayesinde Medipol Tıp Fakültesi kabulümü 48 saatte aldım. Havalimanından karşılamaya ve ikamet işlemlerine kadar her aşamada yanımdaydılar.',
      quoteEn: 'My journey with Sora Education was truly transformative. I received my conditional medical acceptance within 48 hours with an unbeatable discount, and their team handled my airport transfer, dorm, and residence permit seamlessly.',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      verified: true,
      published: true,
    },
    {
      studentName: 'ليان التميمي (Layan Al-Tamimi)',
      nationality: 'الأردن (Jordan)',
      program: 'هندسة العمارة (Architecture)',
      university: 'جامعة بهتشه شهير (Bahçeşehir University)',
      rating: 5,
      quoteAr: 'الفريق محترف جداً ويشرح لك الخيارات بدون أي تهويل أو وعود وهمية. بفضلهم حصلت على منحة 50% على قسط جامعة بهتشه شهير ومستقرة حالياً في سنتي الدراسية الثانية بنجاح.',
      quoteTr: 'Bahçeşehir Üniversitesi Mimarlık bölümüne %50 bursla yerleştim. Danışmanlıkları çok profesyonel ve gerçekçiydi.',
      quoteEn: 'Extremely professional team that presents transparent facts without exaggerated promises. Thanks to them, I secured a 50% tuition scholarship at Bahçeşehir University.',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
      verified: true,
      published: true,
    },
    {
      studentName: 'عمر باوزير (Omar Bawazeer)',
      nationality: 'اليمن (Yemen)',
      program: 'علوم الحاسوب (Computer Science)',
      university: 'جامعة سابانجي (Sabancı University)',
      rating: 5,
      quoteAr: 'أفضل شركة استشارات تعليمية في إسطنبول بلا منازع. قدموا لي كل التسهيلات وتابعوا أوراق المعادلة والإقامة بدقة مذهلة دون أي تعقيد.',
      quoteTr: 'İstanbul’daki en güvenilir eğitim danışmanlığı şirketi. Denklik ve ikamet süreçlerimi eksiksiz tamamladılar.',
      quoteEn: 'Without question, the most dependable educational consulting firm in Istanbul. Flawless equivalency and residence guidance.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      verified: true,
      published: true,
    },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('Created student testimonials');

  // 11. Frequently Asked Questions (FAQs)
  const faqsData = [
    {
      category: 'ADMISSION',
      sortOrder: 1,
      published: true,
      translations: [
        {
          lang: 'ar',
          question: 'هل القبول في الجامعات التركية الخاصة يتطلب امتحان اليوس أو السات؟',
          answer: 'كلا، معظم الجامعات الخاصة في تركيا تمنح القبول المباشر بناءً على شهادة الثانوية العامة فقط دون اشتراط امتحانات اليوس أو السات. تطلب هذه الامتحانات بشكل أساسي في الجامعات الحكومية.',
        },
        {
          lang: 'tr',
          question: 'Vakıf üniversitelerine kabul için YÖS veya SAT sınavı şart mıdır?',
          answer: 'Hayır, Türkiye’deki vakıf üniversitelerinin büyük çoğunluğunda lise diploması ve not dökümü ile doğrudan kayıt imkanı bulunmaktadır.',
        },
        {
          lang: 'en',
          question: 'Is TR-YÖS or SAT mandatory for admission to Turkish private universities?',
          answer: 'No, the vast majority of private foundation universities in Turkey grant direct admission based on high school diplomas without requiring YÖS or SAT test scores.',
        },
      ],
    },
    {
      category: 'COSTS',
      sortOrder: 2,
      published: true,
      translations: [
        {
          lang: 'ar',
          question: 'هل خدماتكم في استخراج القبولات الجامعية مجانية فعلاً؟',
          answer: 'نعم، استشاراتنا واستخراج القبولات الجامعية في الجامعات الخاصة الشريكة مجانية 100% للطلاب، حيث أننا وكلاء معتمدون رسمياً لدى هذه الجامعات ولا نفرض أي أتعاب وساطة على الطالب.',
        },
        {
          lang: 'tr',
          question: 'Üniversite kabul hizmetleriniz gerçekten ücretsiz mi?',
          answer: 'Evet, anlaşmalı üniversitelerimiz için sunduğumuz danışmanlık ve kayıt hizmetleri öğrencilere tamamen ücretsizdir.',
        },
        {
          lang: 'en',
          question: 'Are your university placement services genuinely free of agency fees?',
          answer: 'Yes, our advisory and admission placement services for partner universities are 100% free of charge for students, as we are officially authorized representatives.',
        },
      ],
    },
    {
      category: 'RESIDENCE',
      sortOrder: 3,
      published: true,
      translations: [
        {
          lang: 'ar',
          question: 'كم تستغرق إجراءات استخراج الإقامة الطلابية في تركيا؟',
          answer: 'تستغرق الإجراءات عادة من أسبوعين إلى 4 أسابيع منذ تاريخ حجز الموعد وتسليم الملف، وتمنح بطاقة الإقامة عادة لمدة سنة وتجدد سنوياً طيلة فترة الدراسة.',
        },
        {
          lang: 'tr',
          question: 'Öğrenci ikamet izni ne kadar sürede sonuçlanır?',
          answer: 'Randevu tarihinden sonra dosyanın teslimini takiben ortalama 2 ila 4 hafta içerisinde onaylanarak PTT ile adrese teslim edilir.',
        },
        {
          lang: 'en',
          question: 'How long does the student residence permit (İkamet) procedure take?',
          answer: 'Typically between 2 to 4 weeks after the biometric appointment submission. The card is issued for 1 year and renewed annually throughout your degree.',
        },
      ],
    },
  ];

  for (const f of faqsData) {
    const { translations, ...fFields } = f;
    const faq = await prisma.fAQ.create({ data: fFields });
    for (const ft of translations) {
      await prisma.fAQTranslation.create({
        data: {
          ...ft,
          faqId: faq.id,
        },
      });
    }
  }

  console.log('Created categorized FAQs');

  // 12. Page Sections for Visual Page Builder
  const homeSections = [
    {
      pageName: 'home',
      sectionKey: 'hero',
      sectionType: 'HERO',
      titleAr: 'بوابتك الموثوقة للدراسة في أفضل الجامعات التركية',
      titleTr: 'Türkiye’nin En Prestijli Üniversitelerine Güvenli Geçiş Kapınız',
      titleEn: 'Your Trusted Gateway to Premier Universities in Turkey',
      subtitleAr: 'نساعد الطلاب الدوليين في اكتشاف التخصصات، الحصول على قبولات جامعية معتمدة بخصومات حصرية تصل حتى 75%، ودعم كامل في التأشيرة والسكن والإقامة.',
      subtitleTr: 'Uluslararası öğrencilere bölüm seçimi, %75’e varan burslu kabul, vize, konaklama ve ikamet süreçlerinde uçtan uca uzman danışmanlık.',
      subtitleEn: 'Empowering international students with expert academic matching, up to 75% partner scholarship discounts, visa guidance, housing, and residence support.',
      contentJson: JSON.stringify({
        badgeAr: 'وكيل رسمي معتمد لأكثر من 50 جامعة تركية',
        badgeTr: '50+ Türk Üniversitesinin Resmi Yetkili Acentesi',
        badgeEn: 'Official Authorized Representative for 50+ Universities',
        ctaPrimaryTextAr: 'قدّم طلبك الآن مجاناً',
        ctaPrimaryTextTr: 'Hemen Ücretsiz Başvur',
        ctaPrimaryTextEn: 'Apply Now (Free)',
        ctaPrimaryLink: '/apply',
        ctaSecondaryTextAr: 'استكشف الجامعات والتخصصات',
        ctaSecondaryTextTr: 'Üniversiteleri Keşfet',
        ctaSecondaryTextEn: 'Explore Universities',
        ctaSecondaryLink: '/universities',
        bgImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&auto=format&fit=crop&q=80',
      }),
      sortOrder: 1,
      isEnabled: true,
    },
    {
      pageName: 'home',
      sectionKey: 'stats',
      sectionType: 'STATS',
      titleAr: 'أرقام تتحدث عن إنجازاتنا ومصداقيتنا',
      titleTr: 'Rakamlarla Başarılarımız ve Güvenilirliğimiz',
      titleEn: 'Proven Milestones That Speak for Our Excellence',
      subtitleAr: 'ثقة مئات الطلاب وعائلاتهم كل عام لبناء مستقبل أكاديمي مزدهر في تركيا.',
      subtitleTr: 'Her yıl yüzlerce uluslararası öğrencinin geleceğine yön veren tecrübe.',
      subtitleEn: 'The trusted choice for hundreds of international scholars every academic year.',
      contentJson: JSON.stringify({
        stats: [
          { number: '1,450+', labelAr: 'طالب تم قبولهم بنجاح', labelTr: 'Kabul Alan Öğrenci', labelEn: 'Admitted Students' },
          { number: '50+', labelAr: 'جامعة تركية معتمدة', labelTr: 'Anlaşmalı Üniversite', labelEn: 'Partner Universities' },
          { number: '75%', labelAr: 'أعلى نسبة خصم ومنح حصرية', labelTr: 'Maksimum Burs Oranı', labelEn: 'Max Tuition Discount' },
          { number: '8+', labelAr: 'سنوات خبرة في الاستشارات', labelTr: 'Yıllık Sektör Deneyimi', labelEn: 'Years of Experience' },
        ],
      }),
      sortOrder: 2,
      isEnabled: true,
    },
    {
      pageName: 'home',
      sectionKey: 'universities_preview',
      sectionType: 'UNI_GRID',
      titleAr: 'دليلك لأهم الجامعات التركية',
      titleTr: 'Öne Çıkan Türk Üniversiteleri',
      titleEn: 'Featured Turkish Universities',
      subtitleAr: 'تصفح قائمة الجامعات الحكومية والخاصة المعتمدة دولياً وتعرف على التخصصات والأقساط السنوية.',
      subtitleTr: 'Uluslararası akreditasyonlara sahip devlet ve vakıf üniversitelerini inceleyin.',
      subtitleEn: 'Discover globally accredited public and private universities with transparent tuition details.',
      contentJson: JSON.stringify({ limit: 4, showFilterTabs: true }),
      sortOrder: 3,
      isEnabled: true,
    },
    {
      pageName: 'home',
      sectionKey: 'services_preview',
      sectionType: 'SERVICE_GRID',
      titleAr: 'خدمات طلابية متكاملة من الألف إلى الياء',
      titleTr: 'A’dan Z’ye Kapsamlı Öğrenci Hizmetleri',
      titleEn: 'Complete End-to-End Student Services',
      subtitleAr: 'نرافقك في كافة الخطوات القانونية والإدارية لضمان استقرار دراسي مريح في تركيا.',
      subtitleTr: 'Türkiye’de huzurlu bir eğitim hayatı için tüm yasal ve idari süreçlerde yanınızdayız.',
      subtitleEn: 'Guiding you through every legal and administrative step for a seamless study journey in Turkey.',
      contentJson: JSON.stringify({ limit: 4 }),
      sortOrder: 4,
      isEnabled: true,
    },
  ];

  for (const sec of homeSections) {
    await prisma.pageSection.upsert({
      where: {
        pageName_sectionKey: {
          pageName: sec.pageName,
          sectionKey: sec.sectionKey,
        },
      },
      update: sec,
      create: sec,
    });
  }

  console.log('Created page sections for visual CMS builder');

  // 13. Site Settings
  const settingsData = [
    { key: 'site_name', value: 'Sora Education | الدراسة في تركيا', group: 'GENERAL' },
    { key: 'site_tagline', value: 'بوابتك الموثوقة للقبول الجامعي والدراسة في تركيا', group: 'GENERAL' },
    { key: 'default_language', value: 'ar', group: 'GENERAL' },
    { key: 'supported_languages', value: 'ar,tr,en', group: 'GENERAL' },
    { key: 'contact_phone', value: '+90 551 467 8371', group: 'CONTACT' },
    { key: 'contact_whatsapp', value: '905514678371', group: 'WHATSAPP' },
    { key: 'contact_email', value: 'info@soraedu-tr.com', group: 'CONTACT' },
    { key: 'contact_address_ar', value: 'إسطنبول، الفاتح، شارع فوزي باشا رقم 42، تركيا', group: 'CONTACT' },
    { key: 'contact_address_tr', value: 'Fevzipaşa Cad. No:42, Fatih, İstanbul, Türkiye', group: 'CONTACT' },
    { key: 'contact_address_en', value: 'Fevzipasa St. No:42, Fatih, Istanbul, Turkey', group: 'CONTACT' },
    { key: 'whatsapp_enabled', value: 'true', group: 'WHATSAPP' },
    { key: 'whatsapp_position', value: 'bottom-right', group: 'WHATSAPP' },
    { key: 'whatsapp_message_ar', value: 'مرحباً Sora Education، أرغب بالاستفسار عن التسجيل في الجامعات التركية.', group: 'WHATSAPP' },
    { key: 'whatsapp_message_tr', value: 'Merhaba Sora Education, Türkiye üniversiteleri başvurusu hakkında bilgi almak istiyorum.', group: 'WHATSAPP' },
    { key: 'whatsapp_message_en', value: 'Hello Sora Education, I would like to inquire about university admissions in Turkey.', group: 'WHATSAPP' },
    { key: 'theme_primary_color', value: '#0f172a', group: 'THEME' },
    { key: 'theme_accent_color', value: '#ea580c', group: 'THEME' },
    { key: 'theme_secondary_color', value: '#1e293b', group: 'THEME' },
    { key: 'meta_title_default', value: 'Sora Education | الدراسة في تركيا - قبولات جامعية ومنح حصرية', group: 'SEO' },
    { key: 'meta_description_default', value: 'نوفر لك فرصة الدراسة في تركيا بتكاليف معقولة، جامعات معترف بها دولياً، وبرامج دراسية متنوّعة باللغتين التركية والإنجليزية.', group: 'SEO' },
  ];

  for (const s of settingsData) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }

  console.log('Created global site settings');
  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
