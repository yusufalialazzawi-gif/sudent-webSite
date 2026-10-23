import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { stateUniversities } from './stateUniversitiesData.js';
import { tenScholarshipsData } from './seed10Scholarships.js';

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
      coverImageUrl: '/uploads/universities/istanbul-university.webp',
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
      logoUrl: '/uploads/universities/campus-default.webp',
      coverImageUrl: '/uploads/universities/sabanci-university.webp',
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

  // 3.1. Seed 60 Turkish State Universities
  console.log(`Seeding ${stateUniversities.length} Turkish State Universities...`);
  for (const su of stateUniversities) {
    const uni = await prisma.university.upsert({
      where: { slug: su.slug },
      update: {
        type: su.type,
        city: su.city,
        establishedYear: su.establishedYear,
        campusType: su.campusType,
        ranking: su.ranking,
        websiteUrl: su.websiteUrl,
        logoUrl: su.logoUrl,
        coverImageUrl: su.coverImageUrl,
        videoUrl: su.videoUrl || null,
        galleryImages: su.galleryImages || null,
        featured: su.featured || false,
        published: true,
      },
      create: {
        slug: su.slug,
        type: su.type,
        city: su.city,
        establishedYear: su.establishedYear,
        campusType: su.campusType,
        ranking: su.ranking,
        websiteUrl: su.websiteUrl,
        logoUrl: su.logoUrl,
        coverImageUrl: su.coverImageUrl,
        videoUrl: su.videoUrl || null,
        galleryImages: su.galleryImages || null,
        featured: su.featured || false,
        published: true,
      },
    });

    const suTranslations = [
      {
        lang: 'ar',
        name: su.nameAr,
        overview: su.overviewAr,
        admissionRequirements: su.reqAr,
        accommodationInfo: su.accAr,
        accreditationInfo: su.crdAr,
        address: su.addrAr,
      },
      {
        lang: 'tr',
        name: su.nameTr,
        overview: su.overviewTr,
        admissionRequirements: su.reqTr,
        accommodationInfo: su.accTr,
        accreditationInfo: su.crdTr,
        address: su.addrTr,
      },
      {
        lang: 'en',
        name: su.nameEn,
        overview: su.overviewEn,
        admissionRequirements: su.reqEn,
        accommodationInfo: su.accEn,
        accreditationInfo: su.crdEn,
        address: su.addrEn,
      },
    ];

    for (const t of suTranslations) {
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
  console.log('Successfully seeded 60 Turkish State Universities with multimedia and translations');

  // 4. Academic Programs
  const medipol = await prisma.university.findUnique({ where: { slug: 'istanbul-medipol-university' } });
  const bau = await prisma.university.findUnique({ where: { slug: 'bahcesehir-university' } });
  const koc = await prisma.university.findUnique({ where: { slug: 'koc-university' } });
  const sabanci = await prisma.university.findUnique({ where: { slug: 'sabanci-university' } });
  const iu = (await prisma.university.findUnique({ where: { slug: 'istanbul-universitesi' } })) || (await prisma.university.findUnique({ where: { slug: 'istanbul-university' } }));
  const metu = await prisma.university.findUnique({ where: { slug: 'orta-dogu-teknik-universitesi' } });
  const boun = await prisma.university.findUnique({ where: { slug: 'bogazici-universitesi' } });
  const ituUni = await prisma.university.findUnique({ where: { slug: 'istanbul-teknik-universitesi' } });
  const hacettepe = await prisma.university.findUnique({ where: { slug: 'hacettepe-universitesi' } });
  const ankaraUni = await prisma.university.findUnique({ where: { slug: 'ankara-universitesi' } });
  const ege = await prisma.university.findUnique({ where: { slug: 'ege-universitesi' } });

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
    // Graduate Master's & PhD Programs
    {
      universityId: iu.id,
      categoryId: categories['computer-science-ai'].id,
      slug: 'iu-computer-engineering-msc',
      degreeLevel: 'MASTER_WITH_THESIS',
      studyLanguage: 'ENGLISH',
      durationYears: 2,
      annualTuition: 1600,
      discountedTuition: 1400,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'ماجستير هندسة الحاسوب والذكاء الاصطناعي (بأطروحة)',
          facultyName: 'معهد العلوم والتكنولوجيا',
          description: 'برنامج دراسات عليا متقدم باللغة الإنجليزية يركز على خوارزميات التعلم العميق، شبكات الحوسبة السحابية، ومعالجة البيانات الضخمة.',
          requirements: 'شهادة بكالوريوس في الهندسة أو علوم الحاسوب بمعدل لا يقل عن 2.5/4.0، شهادة إتقان لغة إنجليزية TOEFL أو YÖKDİL، وبيان الغرض (SOP).',
          careerOpportunities: 'كبير مهندسي برمجيات، باحث في الذكاء الاصطناعي، أستاذ جامعي أو باحث دكتوراه.',
        },
        {
          lang: 'tr',
          name: 'Bilgisayar Mühendisliği Tezli Yüksek Lisans (İngilizce)',
          facultyName: 'Fen Bilimleri Enstitüsü',
          description: 'Yapay zeka, veri bilimi ve ileri yazılım mimarilerini kapsayan tezli yüksek lisans programı.',
          requirements: 'Lisans mezuniyeti (min 2.50 GPA), yabancı dil belgesi ve niyet mektubu.',
          careerOpportunities: 'Kıdemli Ar-Ge mühendisi, yapay zeka araştırmacısı, doktora adayı.',
        },
        {
          lang: 'en',
          name: 'Computer Engineering M.Sc. with Thesis (English)',
          facultyName: 'Graduate School of Science & Engineering',
          description: 'Advanced graduate program focused on deep learning, distributed cloud systems, algorithmic theory, and big data architecture.',
          requirements: 'Bachelor in CS/Engineering (min 2.5 GPA), TOEFL/YÖKDİL language proof, and Statement of Purpose.',
          careerOpportunities: 'Senior AI Engineer, Principal Systems Architect, Ph.D. Scholar.',
        },
      ],
    },
    {
      universityId: iu.id,
      categoryId: categories['business-management'].id,
      slug: 'iu-mba-executive',
      degreeLevel: 'MASTER_NON_THESIS',
      studyLanguage: 'ENGLISH',
      durationYears: 1.5,
      annualTuition: 1800,
      discountedTuition: 1500,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'ماجستير إدارة الأعمال التنفيذي MBA (بدون أطروحة)',
          facultyName: 'معهد إدارة الأعمال',
          description: 'برنامج ماجستير مهني باللغة الإنجليزية صمم خصيصاً للقادة والمدراء لتطوير مهارات الإدارة الاستراتيجية، التحول الرقمي، والتمويل الدولي.',
          requirements: 'شهادة بكالوريوس في أي تخصص جامعي معترف به، سيرة ذاتية مهنية (CV)، ومقابلة شخصية.',
          careerOpportunities: 'المدير التنفيذي، مدير إدارة التسويق والمالية، مستشار أعمال دولي.',
        },
        {
          lang: 'tr',
          name: 'İşletme Tezsiz Yüksek Lisans MBA (İngilizce)',
          facultyName: 'İşletme Enstitüsü',
          description: 'Yöneticiler ve profesyoneller için küresel strateji ve finans odaklı tezsiz MBA programı.',
          requirements: 'Lisans diploması, özgeçmiş ve mülakat.',
          careerOpportunities: 'Üst düzey yönetici, strateji danışmanı, girişimci.',
        },
        {
          lang: 'en',
          name: 'Executive MBA (Non-Thesis Master’s)',
          facultyName: 'Institute of Business Administration',
          description: 'A career-accelerating professional master’s degree in English tailored for emerging executives, focusing on corporate strategy, finance, and digital leadership.',
          requirements: 'Bachelor degree in any field, professional CV, and admissions interview.',
          careerOpportunities: 'Executive Management, Corporate Strategy Consultant, Venture Founder.',
        },
      ],
    },
    {
      universityId: metu ? metu.id : iu.id,
      categoryId: categories['engineering-tech'].id,
      slug: 'metu-mechanical-msc',
      degreeLevel: 'MASTER_WITH_THESIS',
      studyLanguage: 'ENGLISH',
      durationYears: 2,
      annualTuition: 2400,
      discountedTuition: 2100,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'ماجستير الهندسة الميكانيكية وتكنولوجيا الروبوتات (ODTÜ)',
          facultyName: 'معهد العلوم الطبيعية والتطبيقية',
          description: 'البرنامج الرائد في تركيا في الأنظمة الديناميكية، الطاقة المتجددة، والروبوتات المتقدمة باللغة الإنجليزية 100%.',
          requirements: 'بكالوريوس هندسة ميكانيكية بمعدل لا يقل عن 3.0/4.0، رسالتا توصية، وشهادة TOEFL.',
          careerOpportunities: 'مهندس بحوث وتطوير في كبرى شركات الطيران والدفاع والسيارات العالمية.',
        },
        {
          lang: 'tr',
          name: 'Makine Mühendisliği Tezli Yüksek Lisans (İngilizce)',
          facultyName: 'Fen Bilimleri Enstitüsü',
          description: 'ODTÜ’nün dünyaca ünlü robotik, termodinamik ve tasarım odaklı yüksek lisans programı.',
          requirements: 'İlgili lisans diploması (min 3.0 GPA), 2 referans mektubu ve TOEFL skoru.',
          careerOpportunities: 'Havacılık, savunma ve otomotiv sektörlerinde kıdemli Ar-Ge mühendisi.',
        },
        {
          lang: 'en',
          name: 'Mechanical Engineering M.Sc. with Thesis',
          facultyName: 'Graduate School of Natural & Applied Sciences',
          description: 'METU’s flagship English-medium graduate engineering program specializing in autonomous robotics, fluid dynamics, and computational mechanics.',
          requirements: 'Accredited Mechanical Engineering B.Sc. (3.0+ GPA), 2 academic reference letters, and TOEFL.',
          careerOpportunities: 'Senior R&D Engineer in Aerospace, Defense, and Global Automotive corporations.',
        },
      ],
    },
    {
      universityId: metu ? metu.id : iu.id,
      categoryId: categories['engineering-tech'].id,
      slug: 'metu-electrical-phd',
      degreeLevel: 'PHD',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 2800,
      discountedTuition: 2500,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'دكتوراه في الهندسة الكهربائية والإلكترونية (Ph.D.)',
          facultyName: 'معهد العلوم التطبيقية',
          description: 'برنامج دكتوراه نخبوي يمنح باحثيه فرصة العمل في أحدث المختبرات البحثية التركية مع إشراف أساتذة عالميين.',
          requirements: 'شهادة ماجستير بأطروحة في الهندسة بمعدل متميز، مقترح أطروحة بحثية، واجتياز امتحان الكفاءة الشامل.',
          careerOpportunities: 'أستاذ جامعي وباحث أكاديمي، مدير مختبرات أبحاث، خبير أشباه الموصلات والاتصالات الفضائية.',
        },
        {
          lang: 'tr',
          name: 'Elektrik-Elektronik Mühendisliği Doktora (Ph.D.)',
          facultyName: 'Fen Bilimleri Enstitüsü',
          description: 'Yarı iletkenler, mikroelektronik ve haberleşme alanında Türkiye’nin zirve doktora programı.',
          requirements: 'Tezli yüksek lisans diploması, araştırma önerisi ve yeterlilik sınavı.',
          careerOpportunities: 'Üniversite öğretim üyesi, baş araştırmacı, uzay ve savunma teknolojileri uzmanı.',
        },
        {
          lang: 'en',
          name: 'Doctor of Philosophy (Ph.D.) in Electrical & Electronics',
          facultyName: 'Graduate School of Natural & Applied Sciences',
          description: 'Elite doctoral research pathway in microelectronics, semiconductor fabrication, photonics, and satellite telecommunications.',
          requirements: 'M.Sc. with Thesis in relevant field, formal research proposal, and department qualifying exam.',
          careerOpportunities: 'Tenure-track University Professor, Principal Research Scientist, High-Tech Sector Director.',
        },
      ],
    },
    {
      universityId: hacettepe ? hacettepe.id : medipol.id,
      categoryId: categories['medicine-health'].id,
      slug: 'hacettepe-medicine-english',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 6,
      annualTuition: 6800,
      discountedTuition: 6200,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'الطب البشري باللغة الإنجليزية (جامعة حجة تبه)',
          facultyName: 'كلية الطب الدولي',
          description: 'البرنامج الطبي رقم 1 في تركيا والمعتمد عالمياً، يدرس بالإنجليزية بالكامل مع تدريب سريري في أرقى المستشفيات الجامعية بأنقرة.',
          requirements: 'شهادة SAT I (درجة لا تقل عن 1450) أو امتحان TR-YÖS بمعدل لا يقل عن 95% وجواز سفر ساري.',
          careerOpportunities: 'طبيب بشري معتمد عالمياً، الالتحاق ببرامج الإقامة الأمريكية USMLE، الأوروبية، وامتحان التخصص التركي TUS.',
        },
        {
          lang: 'tr',
          name: 'Tıp Fakültesi (İngilizce - Devlet)',
          facultyName: 'Tıp Fakültesi',
          description: 'Türkiye’nin 1 numaralı tıp eğitimi, %100 İngilizce, dünyaca ünlü klinik ve araştırma imkanları.',
          requirements: 'Yüksek SAT (min 1450) veya TR-YÖS derecesi.',
          careerOpportunities: 'Uzman hekim, uluslararası klinik kariyer, TUS/USMLE başarısı.',
        },
        {
          lang: 'en',
          name: 'Doctor of Medicine (M.D.) - English (Public)',
          facultyName: 'Faculty of Medicine',
          description: 'The top-ranked public medical degree in Turkey, 100% English-medium with clinical rotations across Hacettepe University Hospitals.',
          requirements: 'High SAT score (1450+ with 750+ Math) or elite TR-YÖS ranking and valid passport.',
          careerOpportunities: 'Internationally licensed physician, USMLE/PLAB eligibility, prestigious residency appointments.',
        },
      ],
    },
    {
      universityId: ituUni ? ituUni.id : iu.id,
      categoryId: categories['architecture-design'].id,
      slug: 'itu-architecture-msc',
      degreeLevel: 'MASTER_WITH_THESIS',
      studyLanguage: 'ENGLISH',
      durationYears: 2,
      annualTuition: 2100,
      discountedTuition: 1800,
      currency: 'USD',
      academicYear: '2026-2027',
      applicationStatus: 'OPEN',
      published: true,
      translations: [
        {
          lang: 'ar',
          name: 'ماجستير العمارة والتصميم العمراني المتقدم (İTÜ)',
          facultyName: 'معهد العلوم - كلية العمارة طاشكيشلا',
          description: 'برنامج ماجستير معماري عريق في قصر طاشكيشلا التاريخي يدمج بين التصميم المستدام، الحفاظ التراثي، والنمذجة الرقمية BIM.',
          requirements: 'بكالوريوس في العمارة أو التخطيط العمراني، ملف أعمال معماري (Portfolio) متميز، وشهادة لغة.',
          careerOpportunities: 'كبير معماريين، مخطط عمراني للمدن الذكية، مستشار تصميم دولي.',
        },
        {
          lang: 'tr',
          name: 'Mimari Tasarım Tezli Yüksek Lisans (İngilizce)',
          facultyName: 'Taşkışla Mimarlık Fakültesi',
          description: 'Tarihi Taşkışla yerleşkesinde sürdürülebilir mimari ve kentsel tasarım odaklı prestijli yüksek lisans programı.',
          requirements: 'Mimarlık lisans derecesi, proje portfolyosu ve yabancı dil.',
          careerOpportunities: 'Baş mimar, kentsel tasarım uzmanı, proje direktörü.',
        },
        {
          lang: 'en',
          name: 'Advanced Architectural Design M.Arch with Thesis',
          facultyName: 'Taşkışla Faculty of Architecture',
          description: 'World-renowned architecture master’s located at historic Taşkışla Palace, emphasizing parametric design, BIM, and resilient urbanism.',
          requirements: 'B.Arch degree, competitive digital architectural design portfolio, and language proof.',
          careerOpportunities: 'Principal Architect, Smart City Planner, Global Design Director.',
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
      pricePolicy: 'FIXED_PACKAGE',
      estimatedDuration: '2 - 7 business days',
      featured: true,
      published: true,
      sortOrder: 1,
      translations: [
        {
          lang: 'ar',
          title: 'القبولات الجامعية والدراسات العليا المعتمدة',
          description: 'خدمات استشارية أكاديمية واحترافية متكاملة للتقديم الرسمي على الجامعات التركية الحكومية والخاصة للبكالوريوس والماجستير والدكتوراه، مع تدقيق المستندات ومتابعة مقاعد الطلاب بعقود موثقة.',
          benefits: 'استشارة أكاديمية متخصصة لكل طالب\nتقديم ملفات البكالوريوس والدراسات العليا رسمياً\nتأمين القبولات ومتابعة تثبيت المقعد\nمتابعة إجراءات الفيزا الدراسية وتجهيز الملفات',
          eligibility: 'متاح للطلاب الدوليين الراغبين بدراسة البكالوريوس أو الماجستير (بأطروحة/بدون) أو الدكتوراه في تركيا.',
          procedureSteps: JSON.stringify([
            'تدقيق الشهادات والمستندات الأكاديمية وجواز السفر',
            'تحديد التخصصات والجامعات الأنسب لمعدل الطالب ورغبته',
            'تقديم الطلب الرسمي واستخراج خطاب القبول المعتمد',
            'تثبيت المقعد الجامعي النهائي واستلام كود الطالب الرسمي',
          ]),
          requiredDocuments: JSON.stringify([
            'صورة جواز السفر ساري المفعول',
            'شهادة البكالوريوس وكشف الدرجات (للماجستير والدكتوراه) أو شهادة الثانوية (للبكالوريوس)',
            'السيرة الذاتية وخطاب النوايا وبيان الغرض لطلاب الدراسات العليا',
            'شهادات اللغة (إن وجدت: TÖMER / TOEFL)',
          ]),
        },
        {
          lang: 'tr',
          title: 'Yetkili Lisans ve Lisansüstü Üniversite Kabul Hizmeti',
          description: 'Türkiye’deki 60+ devlet ve vakıf üniversitesinde lisans, tezli/tezsiz yüksek lisans ve doktora programları için sözleşmeli ve yetkili akademik başvuru danışmanlığı.',
          benefits: 'Kişiye özel akademik danışmanlık, lisans ve lisansüstü resmi başvuru takibi, kayıt garantisi.',
          eligibility: 'Türkiye’de lisans veya lisansüstü eğitim almak isteyen tüm uluslararası öğrenciler.',
          procedureSteps: JSON.stringify(['Evrak inceleme', 'Üniversite ve program seçimi', 'Resmi başvuru', 'Kesin kayıt ve öğrenci belgesi']),
          requiredDocuments: JSON.stringify(['Pasaport', 'Lisans/Lise diploması ve transkript', 'Özgeçmiş ve niyet mektubu (lisansüstü)']),
        },
        {
          lang: 'en',
          title: 'Accredited Undergraduate & Graduate Admissions Advisory',
          description: 'Comprehensive, contract-backed admissions representation across 60+ Turkish public and private universities for Bachelor’s, Master’s (with/without thesis), and PhD programs.',
          benefits: 'Dedicated advisor\nUndergraduate and graduate dossier management\nDirect university submission\nComplete student visa and enrollment guidance',
          eligibility: 'International scholars seeking accredited higher education in Turkey.',
          procedureSteps: JSON.stringify([
            'Academic document pre-screening',
            'University & department portfolio matching',
            'Official application submission & conditional offer retrieval',
            'Final acceptance letter & student registration completion',
          ]),
          requiredDocuments: JSON.stringify([
            'Valid International Passport',
            'Bachelor Diploma & Transcripts (for Graduate) or High School Diploma (for Undergrad)',
            'Academic CV & Statement of Purpose (for Graduate)',
            'Language proficiency scores (if available)',
          ]),
        },
      ],
    },
    {
      slug: 'denklik-equivalency',
      icon: 'FileCheck',
      pricePolicy: 'VARIABLE',
      estimatedDuration: '10 - 25 days',
      featured: true,
      published: true,
      sortOrder: 2,
      translations: [
        {
          lang: 'ar',
          title: 'الترجمة المحلفة ومعادلة الشهادات والدراسات العليا (Denklik)',
          description: 'الخدمة الرسمية المعتمدة لترجمة وتصديق كافة الوثائق الأكاديمية وإجراءات معادلة شهادات البكالوريوس والماجستير من مجلس التعليم العالي التركي (YÖK) والشهادات الثانوية من وزارة التعليم (MEB) للطلاب الدوليين.',
          benefits: 'ترجمة محلفة رسمية ومعتمدة لدى كافة النوتر والجامعات في تركيا\nاستخراج وثيقة الاعتراف بالجامعة (YÖK Okul Tanıma Belgesi) للماجستير\nإجراءات معادلة البكالوريوس (Lisans Denklik) للخريجين والأطباء والمهندسين\nحجز المواعيد الرسمية ومتابعة الملفات حتى صدور وثيقة المعادلة',
          eligibility: 'الطلاب الدوليون المقبولون في الجامعات التركية وطلاب الدراسات العليا وحملة الشهادات الأجنبية.',
          procedureSteps: JSON.stringify([
            'حصر وتدقيق المستندات الأكاديمية والتحقق من الأختام والتصديقات',
            'الترجمة القانونية المحلفة للغة التركية والتصديق لدى كاتب العدل (النوتر)',
            'التقديم على بوابة مجلس التعليم العالي (YÖK) أو وزارة التربية (MEB)',
            'متابعة دراسة الملف ولجنة المعادلة حتى استلام وثيقة المعادلة الرسمية',
          ]),
          requiredDocuments: JSON.stringify([
            'شهادة البكالوريوس الأصلية مصدقة من الخارجية والسفارة التركية',
            'كشف درجات البكالوريوس التفصيلي (Transcript) لكافة الفصول والسنوات',
            'شهادة الثانوية العامة وكشف الدرجات ومعادلتها (Lise Denklik)',
            'جواز السفر ساري المفعول مترجم ومصدق لدى النوتر',
            'وثيقة الاعتراف الجامعي (YÖK Tanıma Belgesi)',
            'السيرة الذاتية وخطاب النوايا لطلاب الماجستير والدكتوراه',
            'شهادات اللغة (TÖMER C1 / TOEFL / YDS)',
          ]),
        },
        {
          lang: 'tr',
          title: 'Yeminli Tercüme, Noter ve YÖK Denklik Hizmetleri',
          description: 'Uluslararası lisans ve lisansüstü öğrencileri için MEB ve YÖK nezdinde yeminli tercüme, noter onayı, tanıma ve denklik belgesi danışmanlığı.',
          benefits: 'Noter onaylı yeminli tercüme, YÖK okul tanıma belgesi temini, lisans ve yüksek lisans denklik takibi.',
          eligibility: 'Türkiye’de eğitim alacak veya denklik arayan yabancı uyruklu mezun ve öğrenciler.',
          procedureSteps: JSON.stringify(['Belge kontrolü', 'Yeminli tercüme ve noter onayı', 'YÖK/MEB online başvuru', 'Denklik belgesi teslimi']),
          requiredDocuments: JSON.stringify([
            'Apostilli veya tasdikli orijinal lisans/lise diploması',
            'Tüm dönemlere ait detaylı transkript',
            'Pasaport noter onaylı tercümesi',
            'YÖK okul tanıma belgesi ve lise denkliği',
            'Özgeçmiş ve dil yeterlilik belgesi (lisansüstü)',
          ]),
        },
        {
          lang: 'en',
          title: 'Sworn Translation, Notary & YÖK Equivalency (Denklik)',
          description: 'Certified Turkish sworn translation, notary certification, and formal Higher Education Council (YÖK) & MEB equivalency representation for undergraduate and graduate scholars.',
          benefits: 'Court-certified sworn translations\nYÖK University Recognition Certificate retrieval\nBachelor’s and Master’s Denklik dossier handling\nExpedited notary and ministry processing',
          eligibility: 'International students and degree holders applying to Turkish graduate schools or professional registration.',
          procedureSteps: JSON.stringify([
            'Apostille and consular seal authentication check',
            'Certified sworn Turkish translation and notary legalisation',
            'Official online and in-person submission to YÖK/MEB',
            'Academic committee follow-up and certificate dispatch',
          ]),
          requiredDocuments: JSON.stringify([
            'Original Bachelor Diploma authenticated by Ministry of Foreign Affairs & Turkish Consulate',
            'Complete Academic Transcripts covering all semesters/years',
            'High School Diploma and Secondary School Equivalency (Lise Denklik)',
            'Notarized Turkish translation of valid International Passport',
            'YÖK University Recognition Document (Okul Tanıma Belgesi)',
            'Academic CV & Motivation Letter for Graduate applicants',
            'Language proficiency certificates (TÖMER C1 / TOEFL / YDS)',
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
      imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
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
      slug: 'academic-merit-scholarship-support',
      scholarshipType: 'MERIT',
      discountPercentage: null,
      universityId: bau.id,
      openingDate: new Date('2026-06-01'),
      deadline: new Date('2026-10-30'),
      status: 'ACTIVE',
      imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80',
      published: true,
      translations: [
        {
          lang: 'ar',
          title: 'برنامج منح التميز الأكاديمي ودعم القبولات',
          description: 'برنامج دعم الطلاب المتفوقين أكاديمياً للحصول على تسهيلات وتخفيضات جامعية معتمدة في كبرى الجامعات التركية الخاصة والحكومية.',
          eligibilityCriteria: 'شهادة الثانوية أو البكالوريوس بمعدل أكاديمي متميز. يتم تقييم كل ملف بصورة فردية وفق الكفاءة الأكاديمية.',
          requiredDocuments: 'جواز السفر، الشهادة الأكاديمية، كشف الدرجات، والسيرة الذاتية (للماجستير).',
          benefitsSummary: 'دعم ملف القبول الرسمي ومتابعة الحصول على أفضل الشروط والمنح المتاحة.',
        },
        {
          lang: 'tr',
          title: 'Akademik Başarı ve Kabul Destek Programı',
          description: 'Başarılı uluslararası öğrencilere üniversite kabulleri ve harç indirimlerinde rehberlik sağlayan resmi destek programı.',
          eligibilityCriteria: 'Yüksek not ortalamasına sahip lise ve lisans mezunları.',
          requiredDocuments: 'Pasaport, diploma ve transkript.',
          benefitsSummary: 'Resmi kabul süreçlerinde öncelikli başvuru ve akademik burs takibi.',
        },
        {
          lang: 'en',
          title: 'Academic Merit & Admission Support Program',
          description: 'Comprehensive admission and merit support program for outstanding international undergraduate and graduate applicants.',
          eligibilityCriteria: 'Strong academic record from recognized secondary or university institutions.',
          requiredDocuments: 'Passport, diploma/degree certificate, transcripts, and academic CV (for graduate).',
          benefitsSummary: 'Official admission facilitation and competitive scholarship optimization.',
        },
      ],
    },
    ...tenScholarshipsData,
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
      notes: 'Wants to apply for academic scholarship and admission at Bahçeşehir University.',
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
      avatarUrl: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&auto=format&fit=crop&q=80',
      verified: true,
      published: true,
    },
    {
      studentName: 'محمد التميمي (Mohammed Al-Tamimi)',
      nationality: 'الأردن (Jordan)',
      program: 'هندسة العمارة (Architecture)',
      university: 'جامعة بهتشه شهير (Bahçeşehir University)',
      rating: 5,
      quoteAr: 'الفريق محترف جداً ويشرح لك الخيارات الأكاديمية بكل مصداقية وشفافية. بفضلهم حصلت على قبول متميز في هندسة العمارة بجامعة بهتشه شهير ومستقر حالياً في سنتي الدراسية بنجاح.',
      quoteTr: 'Bahçeşehir Üniversitesi Mimarlık bölümüne resmi kabul aldım. Danışmanlıkları çok profesyonel, şeffaf ve güvenilirdi.',
      quoteEn: 'Extremely professional team that presents transparent facts without exaggerated promises. Thanks to them, I secured verified admission at Bahçeşehir University.',
      avatarUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80',
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
      avatarUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=300&auto=format&fit=crop&q=80',
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
          question: 'ما هي سياسة أتعاب الاستشارة والتقديم الجامعي لدى المجد؟',
          answer: 'نحن نقدم استشارات أكاديمية احترافية وخدمات قبول جامعي رسمي بعقود رسمية ورسوم واضحة ومدروسة تشمل تدقيق الملف، الترجمة المحلفة، وتأمين القبول والمتابعة حتى استلام بطاقة الطالب دون أي رسوم خفية.',
        },
        {
          lang: 'tr',
          question: 'Üniversite başvuru ve danışmanlık ücret politikanız nasıldır?',
          answer: 'El-Mecd Eğitim Danışmanlığı olarak akademik başvuru, yeminli tercüme ve kabul takip süreçlerini sözleşmeli, şeffaf ve sabit hizmet bedelleriyle yürütüyoruz. Hiçbir gizli ücret olmaksızın en güvenilir kabul sürecini sağlıyoruz.',
        },
        {
          lang: 'en',
          question: 'What is your university application and advisory fee policy?',
          answer: 'At Al-Majd, we provide contract-backed academic consulting, sworn translation, and official university admission placement under transparent and competitive service fees with zero hidden costs.',
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
      subtitleAr: 'نساعد الطلاب الدوليين في اختيار التخصصات الأنسب وتأمين القبولات في أفضل الجامعات الحكومية والخاصة مع خدمات الدعم الأكاديمي، الترجمة، وتصديق الأوراق.',
      subtitleTr: 'Uluslararası öğrencilere bölüm seçimi, devlet ve vakıf üniversite kabulleri, yeminli tercüme ve denklik süreçlerinde profesyonel danışmanlık.',
      subtitleEn: 'Empowering international students with academic counseling, verified state & foundation university admissions, certified translation, and legal equivalency guidance.',
      contentJson: JSON.stringify({
        badgeAr: 'وكيل رسمي معتمد للقبولات الجامعية في تركيا',
        badgeTr: 'Türkiye Üniversiteleri Resmi Kabul Danışmanlığı',
        badgeEn: 'Official University Admissions & Academic Advisory in Turkey',
        ctaPrimaryTextAr: 'ابدأ طلب التقديم الأكاديمي',
        ctaPrimaryTextTr: 'Başvuru Sürecini Başlat',
        ctaPrimaryTextEn: 'Start Your Application',
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
          { number: '+120', labelAr: 'جامعة حكومية وخاصة', labelTr: 'Devlet ve Vakıf Üniversitesi', labelEn: 'Public & Private Universities' },
          { number: '98%', labelAr: 'نسبة نجاح استخراج القبولات', labelTr: 'Kabul Başarı Oranı', labelEn: 'Admission Success Rate' },
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
    { key: 'site_name', value: 'شركة المجد للخدمات الطلابية', group: 'BRANDING' },
    { key: 'site_name_ar', value: 'شركة المجد للخدمات الطلابية', group: 'BRANDING' },
    { key: 'site_name_tr', value: 'El-Mecd Öğrenci Hizmetleri', group: 'BRANDING' },
    { key: 'site_name_en', value: 'Al-Majd Student Services', group: 'BRANDING' },
    { key: 'site_slogan_ar', value: 'سنوات من الخبرة، ومئات الطلاب، وهدف واحد: مساعدتك في تحقيق حلمك الدراسي.', group: 'BRANDING' },
    { key: 'site_slogan_tr', value: 'Yılların tecrübesi, yüzlerce öğrenci ve tek hedef: Üniversite hayalinizi gerçekleştirmek.', group: 'BRANDING' },
    { key: 'site_slogan_en', value: 'Years of experience, hundreds of students, and one goal: Helping you achieve your academic dream.', group: 'BRANDING' },
    { key: 'site_tagline', value: 'شركة المجد للخدمات الطلابية — مستقبلك الدراسي يبدأ بخطوة، ونحن هنا لمساعدتك على اتخاذها.', group: 'BRANDING' },
    { key: 'default_language', value: 'ar', group: 'GENERAL' },
    { key: 'supported_languages', value: 'ar,tr,en', group: 'GENERAL' },
    { key: 'contact_phone', value: '+90 538 096 4646', group: 'CONTACT' },
    { key: 'contact_whatsapp', value: '905380964646', group: 'WHATSAPP' },
    { key: 'contact_email', value: 'info@almajed-edu.com', group: 'CONTACT' },
    { key: 'contact_address_ar', value: 'إسطنبول، الفاتح / شيشلي، تركيا', group: 'CONTACT' },
    { key: 'contact_address_tr', value: 'Fevzipaşa Cad. No:42, Fatih, İstanbul, Türkiye', group: 'CONTACT' },
    { key: 'contact_address_en', value: 'Fevzipasa St. No:42, Fatih, Istanbul, Turkey', group: 'CONTACT' },
    { key: 'whatsapp_enabled', value: 'true', group: 'WHATSAPP' },
    { key: 'whatsapp_position', value: 'bottom-right', group: 'WHATSAPP' },
    { key: 'whatsapp_message_ar', value: 'مرحباً شركة المجد للخدمات الطلابية، أود الاستفسار عن القبولات والمنح في الجامعات التركية.', group: 'WHATSAPP' },
    { key: 'whatsapp_message_tr', value: 'Merhaba El-Mecd Öğrenci Hizmetleri, Türkiye üniversiteleri başvurusu ve burslar hakkında bilgi almak istiyorum.', group: 'WHATSAPP' },
    { key: 'whatsapp_message_en', value: 'Hello Al-Majd Student Services, I would like to inquire about university admissions and scholarships in Turkey.', group: 'WHATSAPP' },
    // About Us Settings (3 Languages)
    { key: 'about_hero_title_ar', value: 'من نحن؟ | شركة المجد للخدمات الطلابية', group: 'ABOUT' },
    { key: 'about_hero_title_tr', value: 'Biz Kimiz? | El-Mecd Öğrenci Hizmetleri', group: 'ABOUT' },
    { key: 'about_hero_title_en', value: 'About Us | Al-Majd Student Services', group: 'ABOUT' },
    { key: 'about_tagline_ar', value: 'سنوات من الخبرة، ومئات الطلاب، وهدف واحد: مساعدتك في تحقيق حلمك الدراسي.', group: 'ABOUT' },
    { key: 'about_tagline_tr', value: 'Yılların tecrübesi, yüzlerce öğrenci ve tek bir hedef: Üniversite hayalinizi gerçeğe dönüştürmek.', group: 'ABOUT' },
    { key: 'about_tagline_en', value: 'Years of experience, hundreds of students, and one shared goal: Helping you achieve your academic dreams.', group: 'ABOUT' },
    { key: 'about_p1_ar', value: 'نحن شركة المجد للخدمات الطلابية، نمتلك سنوات من الخبرة في مجال الخدمات والاستشارات التعليمية، وقد ساعدنا مئات الطلاب من العراق ومصر والجزائر والعديد من الدول الأخرى في رحلتهم نحو الدراسة في تركيا.', group: 'ABOUT' },
    { key: 'about_p1_tr', value: 'Biz El-Mecd Öğrenci Hizmetleri olarak, eğitim ve akademik danışmanlık alanında yıllara dayanan deneyimimizle; Irak, Mısır, Cezayir ve dünyanın dört bir yanından yüzlerce öğrenciye Türkiye’deki üniversite yolculuklarında rehberlik ettik.', group: 'ABOUT' },
    { key: 'about_p1_en', value: 'At Al-Majd Student Services, with years of expertise in educational consulting, we have guided hundreds of students from Iraq, Egypt, Algeria, and across the globe on their study journey in Turkey.', group: 'ABOUT' },
    { key: 'about_p2_ar', value: 'نؤمن بأن لكل طالب طموحًا يستحق الدعم، ولذلك نحرص على فهم احتياجاته ومساعدته في اختيار الجامعة والتخصص المناسبين، وتقديم الإرشادات اللازمة بشأن إجراءات التسجيل والتقديم إلى الجامعات الحكومية والخاصة، والمنح الدراسية، وبرامج تعليم اللغة التركية (TÖMER)، وغيرها من الخدمات التعليمية.', group: 'ABOUT' },
    { key: 'about_p2_tr', value: 'Her öğrencinin desteği hak eden bir ideali olduğuna inanıyoruz. Bu anlayışla, her öğrencimizin ihtiyaçlarını yakından dinleyerek doğru üniversite ve bölümü seçmesine yardımcı oluyor; devlet ve vakıf üniversitelerine kayıt, burs başvuruları, TÖMER Türkçe hazırlık programları ve tüm akademik süreçlerde profesyonel danışmanlık sağlıyoruz.', group: 'ABOUT' },
    { key: 'about_p2_en', value: 'We believe every student’s ambition deserves dedicated support. We take time to understand each student’s goals, assisting in choosing the right university and major, while providing comprehensive guidance on admissions to public and private universities, scholarship opportunities, TÖMER Turkish prep programs, and more.', group: 'ABOUT' },
    { key: 'about_p3_ar', value: 'نحن هنا من أجلك، في كل خطوة من خطوات رحلتك التعليمية. نعمل على تسهيل الإجراءات، وتوضيح الخيارات، ومساعدة الطلاب على اتخاذ قرارات مدروسة تتناسب مع أهدافهم وإمكاناتهم.', group: 'ABOUT' },
    { key: 'about_p3_tr', value: 'Eğitim yolculuğunuzun her adımında yanınızdayız. İşlemleri kolaylaştırıyor, tüm alternatifleri şeffaflıkla sunuyor ve öğrencilerin kendi hedeflerine ve imkânlarına en uygun, bilinçli kararlar almalarını sağlıyoruz.', group: 'ABOUT' },
    { key: 'about_p3_en', value: 'We are here for you at every stage of your educational path. We streamline procedures, clarify all options, and empower students to make well-informed decisions that match their aspirations and capabilities.', group: 'ABOUT' },
    { key: 'about_p4_ar', value: 'طلابنا الذين تعاملوا معنا يعرفون أسلوب عملنا، ويعرفون مدى اهتمامنا بمتابعة احتياجاتهم وتقديم المساعدة لهم. ثقتهم وتجاربهم هي الدافع الذي يشجعنا على مواصلة التطور وتقديم خدمات أفضل.', group: 'ABOUT' },
    { key: 'about_p4_tr', value: 'Bizimle çalışan öğrencilerimiz işimize duyduğumuz titizliği, ihtiyaçlarına verdiğimiz samimi önemi ve her an ulaşılabilir desteğimizi yakından bilirler. Onların güveni ve başarı hikâyeleri, sürekli gelişmemizin ve her zaman daha üstün hizmet sunmamızın en büyük motivasyonudur.', group: 'ABOUT' },
    { key: 'about_p4_en', value: 'Students who have partnered with us know our dedication, attention to detail, and genuine care for their success. Their trust and achievements inspire us to continually innovate and provide higher-standard services.', group: 'ABOUT' },
    { key: 'about_why_title_ar', value: 'لماذا تختار شركة المجد؟', group: 'ABOUT' },
    { key: 'about_why_title_tr', value: 'Neden El-Mecd Öğrenci Hizmetleri?', group: 'ABOUT' },
    { key: 'about_why_title_en', value: 'Why Choose Al-Majd Student Services?', group: 'ABOUT' },
    { key: 'about_closing_ar', value: 'شركة المجد للخدمات الطلابية — مستقبلك الدراسي يبدأ بخطوة، ونحن هنا لمساعدتك على اتخاذها.', group: 'ABOUT' },
    { key: 'about_closing_tr', value: 'El-Mecd Öğrenci Hizmetleri — Üniversite geleceğiniz bir adımla başlar, o adımı güvenle atmanız için biz buradayız.', group: 'ABOUT' },
    { key: 'about_closing_en', value: 'Al-Majd Student Services — Your academic future begins with a single step, and we are right beside you to make it happen.', group: 'ABOUT' },
    // Hero & Theme
    { key: 'hero_badge_ar', value: 'شركة المجد للخدمات الطلابية | ممثل معتمد لأكثر من 120 جامعة تركية', group: 'HERO' },
    { key: 'hero_badge_tr', value: 'El-Mecd Öğrenci Hizmetleri | +120 Türk Üniversitesinin Yetkili Temsilcisi', group: 'HERO' },
    { key: 'hero_badge_en', value: 'Al-Majd Student Services | Authorized Representative for +120 Turkish Universities', group: 'HERO' },
    { key: 'hero_title_ar', value: 'بدايتك الموثوقة نحو الدراسة في تركيا', group: 'HERO' },
    { key: 'hero_title_tr', value: 'Türkiye’de Üniversite Eğitimine Güvenli Başlangıç', group: 'HERO' },
    { key: 'hero_title_en', value: 'Your Trusted Gateway to Study in Turkey', group: 'HERO' },
    { key: 'hero_desc_ar', value: 'سنوات من الخبرة ومئات الطلاب: نرافقك خطوة بخطوة للحصول على قبولك الجامعي الرسمي والمنح الدراسية في تركيا مع استشارات مخصصة.', group: 'HERO' },
    { key: 'hero_desc_tr', value: 'Yılların tecrübesi ve yüzlerce başarılı öğrenci: Türkiye’de devlet ve vakıf üniversitesi kabulleri, burslar ve vize süreçlerinde profesyonel rehberlik.', group: 'HERO' },
    { key: 'hero_desc_en', value: 'Years of experience and hundreds of students: Guiding you step-by-step toward official university admissions and scholarships in Turkey.', group: 'HERO' },
    { key: 'theme_primary_color', value: '#1a367c', group: 'THEME' },
    { key: 'theme_accent_color', value: '#c89d3c', group: 'THEME' },
    { key: 'theme_secondary_color', value: '#112352', group: 'THEME' },
    { key: 'meta_title_default', value: 'شركة المجد للخدمات الطلابية | الدراسة في تركيا - قبولات جامعية ومنح 2026', group: 'SEO' },
    { key: 'meta_description_default', value: 'شركة المجد للخدمات الطلابية - سنوات من الخبرة ومئات الطلاب من العراق ومصر والجزائر. بوابتك الرسمية المعتمدة للقبول في الجامعات التركية الحكومية والخاصة مع استشارات أكاديمية وترجمة محلفة وتعديل الشهادات.', group: 'SEO' },
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
