import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking & Populating Comprehensive Academic Programs ---');

  const count = await prisma.academicProgram.count();
  console.log(`Current academic programs count: ${count}`);

  // Fetch universities to attach programs to
  const unis = await prisma.university.findMany({
    include: { translations: true },
  });
  console.log(`Loaded ${unis.length} universities.`);

  const uniMap = {};
  for (const u of unis) {
    uniMap[u.slug] = u;
  }

  // Get or create categories
  const categories = await prisma.programCategory.findMany();
  const catMap = {};
  for (const c of categories) {
    catMap[c.slug] = c;
  }

  // Additional rich, in-demand programs across Bachelor, Master with Thesis, Master non-thesis, and PhD
  const additionalPrograms = [
    // 1. Medicine & Surgery - Istanbul Medipol
    {
      uniSlug: 'istanbul-medipol-university',
      catSlug: 'medicine-health',
      slug: 'medipol-human-medicine-en',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 6,
      annualTuition: 32000,
      discountedTuition: 28000,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'الطب البشري (عام بالإنجليزية)',
          facultyName: 'كلية الطب البشري الدولي',
          description: 'برنامج طبي متكامل مع تدريب سريري متقدم في مجمع مستشفيات ميدي بول ميغا الأكبر في تركيا.',
          requirements: 'شهادة الثانوية العامة بمعدل لا يقل عن 80% وجواز سفر ساري المفعول.',
          careerOpportunities: 'طبيب ممارس، التحضير لاختصاص USMLE وPLAB وTUS.',
        },
        {
          lang: 'tr',
          name: 'Tıp Fakültesi (İngilizce)',
          facultyName: 'Uluslararası Tıp Fakültesi',
          description: 'Medipol Mega Hastaneler Kompleksi bünyesinde 6 yıllık ileri klinik eğitim.',
          requirements: 'Yüksek lise mezuniyet ortalaması.',
          careerOpportunities: 'Uzman hekimlik, klinik araştırmacı.',
        },
        {
          lang: 'en',
          name: 'Doctor of Medicine (M.D.) - English',
          facultyName: 'International Faculty of Medicine',
          description: 'World-class 6-year MD curriculum with clinical rotations at Turkey’s largest hospital complex.',
          requirements: 'High School Diploma (80%+ GPA) and valid passport.',
          careerOpportunities: 'Global clinical practice, residency eligibility in US/UK/EU.',
        },
      ],
    },
    // 2. Dentistry - Istanbul Medipol
    {
      uniSlug: 'istanbul-medipol-university',
      catSlug: 'dentistry-pharmacy',
      slug: 'medipol-dentistry-en',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 5,
      annualTuition: 24000,
      discountedTuition: 21000,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'طب وجراحة الفم والأسنان',
          facultyName: 'كلية طب الأسنان',
          description: 'تدريب عملي متكامل على نماذج الفانتوم والعيادات السريرية لزراعة وتجميل وتقويم الأسنان.',
          requirements: 'شهادة الثانوية العامة بمعدل 75% فما فوق.',
          careerOpportunities: 'طبيب أسنان، جراحة الفك، أخصائي تقويم وزراعة الأسنان.',
        },
        {
          lang: 'tr',
          name: 'Diş Hekimliği (İngilizce)',
          facultyName: 'Diş Hekimliği Fakültesi',
          description: 'Fantom simülasyon laboratuvarları ve modern diş hastanesinde 5 yıllık eğitim.',
          requirements: 'Lise diploması ve transkript.',
          careerOpportunities: 'Diş hekimi, ortodonti, cerrahi uzmanı.',
        },
        {
          lang: 'en',
          name: 'Dentistry (D.D.S.) - English',
          facultyName: 'Faculty of Dentistry',
          description: 'Top-tier 5-year dental education with high-fidelity phantom simulation and clinic patient practice.',
          requirements: 'High school graduation with 75%+ GPA.',
          careerOpportunities: 'Dental practitioner, orthodontist, oral surgeon.',
        },
      ],
    },
    // 3. AI & Data Science - Bahcesehir University
    {
      uniSlug: 'bahcesehir-university',
      catSlug: 'computer-science-ai',
      slug: 'bau-artificial-intelligence-en',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 9000,
      discountedTuition: 7500,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'هندسة الذكاء الاصطناعي وعلم البيانات',
          facultyName: 'كلية الهندسة والعلوم الطبيعية',
          description: 'برنامج رائد يركز على نماذج الذكاء الاصطناعي التوليدي، معالجة اللغات الطبيعية، ورؤية الحاسوب والتعلم العميق.',
          requirements: 'شهادة الثانوية الفرع العلمي بمعدل 70% فما فوق.',
          careerOpportunities: 'مهندس ذكاء اصطناعي، عالم بيانات، باحث تعلم الآلة، مطور خوارزميات.',
        },
        {
          lang: 'tr',
          name: 'Yapay Zeka ve Veri Mühendisliği (İngilizce)',
          facultyName: 'Mühendislik Fakültesi',
          description: 'Derin öğrenme, üretken yapay zeka ve büyük veri analitiği odaklı ileri mühendislik programı.',
          requirements: 'Sayısal lise diploması ve transkript.',
          careerOpportunities: 'Yapay zeka mühendisi, veri bilimci, teknoloji uzmanı.',
        },
        {
          lang: 'en',
          name: 'Artificial Intelligence & Data Engineering (B.Sc.)',
          facultyName: 'Faculty of Engineering & Natural Sciences',
          description: 'Leading-edge 4-year curriculum covering generative AI, deep learning, neural networks, and big data architecture.',
          requirements: 'High school graduation with solid math and science foundation.',
          careerOpportunities: 'AI Research Engineer, Data Scientist, Machine Learning Architect.',
        },
      ],
    },
    // 4. Software Engineering - Bahcesehir University
    {
      uniSlug: 'bahcesehir-university',
      catSlug: 'computer-science-ai',
      slug: 'bau-software-engineering-en',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 8500,
      discountedTuition: 7200,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'هندسة البرمجيات والنظم السحابية',
          facultyName: 'كلية الهندسة والعلوم الطبيعية',
          description: 'دراسة هندسة وتطوير البرمجيات واسعة النطاق والحوسبة السحابية وأمن التطبيقات مع شهادات مهنية دولية.',
          requirements: 'شهادة ثانوية بمعدل 70% فما فوق.',
          careerOpportunities: 'مهندس برمجيات رئيسي، مهندس DevOps، مهندس حلول سحابية.',
        },
        {
          lang: 'tr',
          name: 'Yazılım ve Bulut Sistemleri Mühendisliği (İngilizce)',
          facultyName: 'Mühendislik Fakültesi',
          description: 'Bulut bilişim, dağıtık mimariler ve mikroservisler odaklı yazılım mühendisliği.',
          requirements: 'Lise diploması.',
          careerOpportunities: 'Kıdemli yazılım geliştirici, DevOps mühendisi, bulut mimarı.',
        },
        {
          lang: 'en',
          name: 'Software & Cloud Engineering (B.Sc.)',
          facultyName: 'Faculty of Engineering & Natural Sciences',
          description: 'Comprehensive software engineering program focused on distributed architectures, cloud-native apps, and system security.',
          requirements: 'High school graduation with good math standing.',
          careerOpportunities: 'Full-Stack Software Engineer, Cloud Solutions Architect, DevOps Lead.',
        },
      ],
    },
    // 5. Architecture & Interior Design - Istanbul Technical University (İTÜ)
    {
      uniSlug: 'istanbul-teknik-universitesi',
      catSlug: 'architecture-design',
      slug: 'itu-architecture-en',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 2200,
      discountedTuition: 2200,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'الهندسة المعمارية والتصميم الحضري (İTÜ)',
          facultyName: 'كلية العمارة العريقة - تاشكشلا',
          description: 'من أعرق كليات العمارة في الشرق الأوسط وأوروبا بتصنيف عالمي في قلب إسطنبول مع استوديوهات تصميم متطورة.',
          requirements: 'مفاضلة امتحان TR-YÖS أو امتحانات دولية معتمدة مثل SAT.',
          careerOpportunities: 'مهندس معماري مصمم، مخطط حضري، استشاري تطوير عقاري وبناء مستدام.',
        },
        {
          lang: 'tr',
          name: 'Mimarlık Fakültesi (İngilizce - Taşkışla)',
          facultyName: 'Mimarlık Fakültesi',
          description: 'Tarihi Taşkışla binasında dünya çapında akreditasyona sahip mimarlık eğitimi.',
          requirements: 'TR-YÖS veya uluslararası sınavlar (SAT vb.).',
          careerOpportunities: 'Mimar, kentsel tasarımcı, restorasyon uzmanı.',
        },
        {
          lang: 'en',
          name: 'Architecture (B.Arch.) - 100% English',
          facultyName: 'Faculty of Architecture (Taşkışla)',
          description: 'World-renowned architectural education at the historic Taşkışla campus with NAAB substantial equivalency.',
          requirements: 'TR-YÖS exam or recognized qualifications (SAT).',
          careerOpportunities: 'Licensed Architect, Urban Planner, Sustainable Design Consultant.',
        },
      ],
    },
    // 6. Civil Engineering - Istanbul Technical University (İTÜ)
    {
      uniSlug: 'istanbul-teknik-universitesi',
      catSlug: 'engineering-tech',
      slug: 'itu-civil-engineering-en',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 2100,
      discountedTuition: 2100,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'الهندسة المدنية والإنشائية',
          facultyName: 'كلية الهندسة المدنية',
          description: 'تصميم المنشآت ومقاومة الزلازل وهندسة البنية التحتية والسدود والجسور بأنظمة كودات عالمية معتمدة من ABET.',
          requirements: 'امتحان TR-YÖS أو SAT.',
          careerOpportunities: 'مهندس موقع رئيسي، مهندس إنشائي، استشاري مشاريع البنية التحتية العملاقة.',
        },
        {
          lang: 'tr',
          name: 'İnşaat Mühendisliği (İngilizce)',
          facultyName: 'İnşaat Fakültesi',
          description: 'Depreme dayanıklı yapı tasarımı, köprü ve altyapı mühendisliği (ABET akrediteli).',
          requirements: 'TR-YÖS veya denk sınav puanı.',
          careerOpportunities: 'Statik ve yapı mühendisi, şantiye şefi, proje yöneticisi.',
        },
        {
          lang: 'en',
          name: 'Civil & Structural Engineering (B.Sc.)',
          facultyName: 'Faculty of Civil Engineering',
          description: 'ABET-accredited program emphasizing seismic resilience, advanced structural analysis, and smart infrastructure.',
          requirements: 'TR-YÖS score or international equivalent (SAT).',
          careerOpportunities: 'Structural Engineer, Mega Project Construction Director, Infrastructure Consultant.',
        },
      ],
    },
    // 7. Master of Science in Computer Engineering (Thesis) - Istanbul University
    {
      uniSlug: 'istanbul-universitesi',
      catSlug: 'computer-science-ai',
      slug: 'iu-msc-computer-engineering-thesis',
      degreeLevel: 'MASTER_WITH_THESIS',
      studyLanguage: 'ENGLISH',
      durationYears: 2,
      annualTuition: 1600,
      discountedTuition: 1400,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'ماجستير هندسة الحاسوب والذكاء الاصطناعي (بأطروحة)',
          facultyName: 'معهد الدراسات العليا للعلوم والتكنولوجيا',
          description: 'برنامج أكاديمي مخصص للبحث العلمي في التعلم العميق، أمن الشبكات، الحوسبة الموزعة ومعالجة الإشارات.',
          requirements: 'شهادة بكالوريوس في الهندسة بمعدل 2.5/4، وإثبات لغة إنجليزية TOEFL أو امتحان الجامعة.',
          careerOpportunities: 'باحث أكاديمي، استكمال الدكتوراه، كبير مهندسي البحث والتطوير R&D.',
        },
        {
          lang: 'tr',
          name: 'Bilgisayar Mühendisliği Tezli Yüksek Lisans',
          facultyName: 'Lisansüstü Eğitim Enstitüsü',
          description: 'Derin öğrenme, siber güvenlik ve dağıtık hesaplama alanında tezli yüksek lisans.',
          requirements: 'Lisans diploması (2.50+ GANO) ve yabancı dil belgesi.',
          careerOpportunities: 'Ar-Ge mühendisi, akademisyen, doktora adayı.',
        },
        {
          lang: 'en',
          name: 'M.Sc. in Computer Engineering & AI (With Thesis)',
          facultyName: 'Graduate School of Science & Engineering',
          description: 'Thesis-based research Master’s focusing on deep neural networks, distributed systems, and cyber intelligence.',
          requirements: 'Bachelor in CS/EE (min 2.5/4.0 GPA) and English proficiency proof.',
          careerOpportunities: 'Senior R&D Scientist, Ph.D. Researcher, University Lecturer.',
        },
      ],
    },
    // 8. MBA Executive Master of Business Administration - Istanbul University
    {
      uniSlug: 'istanbul-universitesi',
      catSlug: 'business-management',
      slug: 'iu-mba-business-administration',
      degreeLevel: 'MASTER_NON_THESIS',
      studyLanguage: 'ENGLISH',
      durationYears: 1.5,
      annualTuition: 1900,
      discountedTuition: 1650,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'ماجستير إدارة الأعمال التنفيذي MBA (بدون أطروحة)',
          facultyName: 'معهد إدارة الأعمال المعتمد',
          description: 'دراسة مرنة تركز على الإدارة الاستراتيجية، التحول الرقمي، التسويق الدولي وإدارة المخاطر والتمويل.',
          requirements: 'شهادة بكالوريوس في أي مجال معترف به وسيرة ذاتية مهنية.',
          careerOpportunities: 'مدير تنفيذي، مستشار تطوير أعمال، مدير تسويق ومالية دولي.',
        },
        {
          lang: 'tr',
          name: 'Tezsiz İşletme Yüksek Lisans (Executive MBA)',
          facultyName: 'İşletme Enstitüsü',
          description: 'Yöneticilere ve profesyonellere yönelik stratejik yönetim ve finans programı.',
          requirements: 'Lisans diploması ve profesyonel CV.',
          careerOpportunities: 'Üst düzey yönetici, kurumsal finans danışmanı, iş geliştirme direktörü.',
        },
        {
          lang: 'en',
          name: 'Executive MBA (Non-Thesis Master)',
          facultyName: 'School of Business Administration',
          description: 'Accelerated executive graduate degree geared towards strategic leadership, global finance, and digital innovation.',
          requirements: 'Accredited Bachelor’s degree in any field and professional CV.',
          careerOpportunities: 'Chief Executive, Management Consultant, International Business Director.',
        },
      ],
    },
    // 9. Pharmacy (Pharm.D.) - Ankara University
    {
      uniSlug: 'ankara-universitesi',
      catSlug: 'dentistry-pharmacy',
      slug: 'ankara-pharmacy-en',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 5,
      annualTuition: 2800,
      discountedTuition: 2800,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'دكتور صيدلة (Pharm.D.) بالإنجليزية',
          facultyName: 'كلية الصيدلة الأولى في تركيا',
          description: 'تعليم صيدلي سريري وتصنيع دوائي متقدم في كبرى كليات الصيدلة الحكومية بأنقرة مع تدريب في مصانع الأدوية والمشافي.',
          requirements: 'امتحان TR-YÖS أو الشهادة الثانوية بمعدل متميز.',
          careerOpportunities: 'صيدلي سريري، مدير إنتاج دوائي، باحث في التكنولوجيا الحيوية الصيدلانية.',
        },
        {
          lang: 'tr',
          name: 'Eczacılık Fakültesi (İngilizce)',
          facultyName: 'Eczacılık Fakültesi',
          description: 'Türkiye’nin en köklü eczacılık fakültesinde 5 yıllık klinik ve endüstriyel eczacılık eğitimi.',
          requirements: 'TR-YÖS ve lise transkripti.',
          careerOpportunities: 'Eczacı, ilaç sanayii yöneticisi, farmakolog.',
        },
        {
          lang: 'en',
          name: 'Doctor of Pharmacy (Pharm.D.) - English',
          facultyName: 'Faculty of Pharmacy',
          description: 'Comprehensive 5-year pharmaceutical curriculum covering clinical pharmacology, drug synthesis, and clinical trials.',
          requirements: 'TR-YÖS examination or recognized foreign qualification.',
          careerOpportunities: 'Licensed Pharmacist, Clinical Research Associate, Pharma Executive.',
        },
      ],
    },
    // 10. Ph.D. in Mechanical Engineering & Robotics - Middle East Technical University (METU / ODTÜ)
    {
      uniSlug: 'orta-dogu-teknik-universitesi',
      catSlug: 'engineering-tech',
      slug: 'metu-phd-mechanical-robotics',
      degreeLevel: 'PHD',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 2400,
      discountedTuition: 2400,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'دكتوراه في الهندسة الميكانيكية والروبوتات (PhD)',
          facultyName: 'كلية الهندسة ومعهد العلوم التطبيقية',
          description: 'برنامج دكتوراه نخبوي للبحث في الروبوتات المتقدمة، الديناميكا الحرارية، الميكاترونيكس والأنظمة الفضائية.',
          requirements: 'شهادة ماجستير بأطروحة بمعدل ممتاز (3.0+ GPA)، امتحان GRE أو ALES، ومقترح بحثي متكامل.',
          careerOpportunities: 'أستاذ دكتور في كبرى الجامعات، قائد أبحاث في وكالات الفضاء والسيارات والصناعات الدفاعية.',
        },
        {
          lang: 'tr',
          name: 'Makine Mühendisliği ve Robotik Doktora (PhD)',
          facultyName: 'Fen Bilimleri Enstitüsü',
          description: 'ODTÜ kalitesiyle ileri robotik, mekatronik ve termodinamik alanında 4 yıllık araştırma doktorası.',
          requirements: 'Tezli yüksek lisans diploması (3.00+ GPA), yabancı dil ve ALES/GRE puanı.',
          careerOpportunities: 'Üniversite öğretim üyesi, savunma ve uzay sanayii baş araştırmacısı.',
        },
        {
          lang: 'en',
          name: 'Ph.D. in Mechanical Engineering & Advanced Robotics',
          facultyName: 'Graduate School of Natural & Applied Sciences',
          description: 'Elite doctoral research program in mechatronic systems, aerospace dynamics, and autonomous robotics.',
          requirements: 'M.Sc. with thesis (3.0+ GPA), GRE/ALES test score, English proficiency, and research statement.',
          careerOpportunities: 'Tenure-track University Professor, Lead Aerospace & Defense Research Scientist.',
        },
      ],
    },
    // 11. International Relations & Diplomacy - Bogazici University
    {
      uniSlug: 'bogazici-universitesi',
      catSlug: 'business-management',
      slug: 'boun-political-science-ir',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 2000,
      discountedTuition: 2000,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'العلوم السياسية والعلاقات الدولية (جامعة بوغازيتشي)',
          facultyName: 'كلية الاقتصاد والعلوم الإدارية',
          description: 'دراسة السياسة الدولية، القانون الدولي والدبلوماسية في أرقى جامعة تركية مطلة على البوسفور بنظام أمريكي 100%.',
          requirements: 'مفاضلة استثنائية عبر TR-YÖS أو امتحان SAT بمعدل عالي جداً.',
          careerOpportunities: 'دبلوماسي في المنظمات الدولية (الأمم المتحدة)، مستشار سياسي واقتصادي، مراسل دولي.',
        },
        {
          lang: 'tr',
          name: 'Siyaset Bilimi ve Uluslararası İlişkiler (İngilizce)',
          facultyName: 'İktisadi ve İdari Bilimler Fakültesi',
          description: 'Boğaziçi Üniversitesi’nin dünyaca ünlü diplomasi ve küresel ilişkiler lisans programı.',
          requirements: 'Yüksek SAT/TR-YÖS puanı ve İngilizce mülakat.',
          careerOpportunities: 'Diplomat, uluslararası kuruluşlar uzmanı, stratejik analizci.',
        },
        {
          lang: 'en',
          name: 'Political Science & International Relations (B.A.)',
          facultyName: 'Faculty of Economics & Administrative Sciences',
          description: 'Premier American-style liberal arts degree in global diplomacy, statecraft, and comparative politics overlooking the Bosphorus.',
          requirements: 'Top-percentile SAT or TR-YÖS scores and strong English command.',
          careerOpportunities: 'Career Diplomat, UN & NGO Policy Officer, Geopolitical Risk Analyst.',
        },
      ],
    },
    // 12. Nursing & Healthcare - Istanbul Medipol
    {
      uniSlug: 'istanbul-medipol-university',
      catSlug: 'medicine-health',
      slug: 'medipol-nursing-en',
      degreeLevel: 'BACHELOR',
      studyLanguage: 'ENGLISH',
      durationYears: 4,
      annualTuition: 5500,
      discountedTuition: 4500,
      currency: 'USD',
      applicationStatus: 'OPEN',
      translations: [
        {
          lang: 'ar',
          name: 'التمريض والرعاية السريرية المتقدمة',
          facultyName: 'كلية العلوم الصحية',
          description: 'تدريب عملي سريري مكثف في أقسام العناية المركزة وغرف العمليات في مجمع مستشفيات ميدي بول العالمية.',
          requirements: 'شهادة الثانوية العامة بمعدل لا يقل عن 65%.',
          careerOpportunities: 'ممرض قانوني معتمد، العمل في المستشفيات الدولية وكبرى المراكز الجراحية.',
        },
        {
          lang: 'tr',
          name: 'Hemşirelik (İngilizce)',
          facultyName: 'Sağlık Bilimleri Fakültesi',
          description: 'Mega hastanede yoğun klinik staj imkanı sunan modern hemşirelik eğitimi.',
          requirements: 'Lise diploması.',
          careerOpportunities: 'Klinik hemşire, ameliyathane uzmanı, sağlık yöneticisi.',
        },
        {
          lang: 'en',
          name: 'Nursing & Advanced Clinical Care (B.Sc.)',
          facultyName: 'School of Health Sciences',
          description: 'Intensive clinical nursing degree with rotations in critical care, pediatrics, and surgical suites at Medipol Hospital Complex.',
          requirements: 'High school graduation with 65%+ GPA.',
          careerOpportunities: 'Licensed Registered Nurse (RN), Critical Care Specialist, Hospital Healthcare Administrator.',
        },
      ],
    },
  ];

  let addedCount = 0;
  for (const prog of additionalPrograms) {
    const uni = uniMap[prog.uniSlug];
    if (!uni) {
      console.log(`Skipping program ${prog.slug}: University ${prog.uniSlug} not found.`);
      continue;
    }

    const cat = catMap[prog.catSlug];
    const categoryId = cat ? cat.id : null;

    const academicProgram = await prisma.academicProgram.upsert({
      where: {
        universityId_slug: {
          universityId: uni.id,
          slug: prog.slug,
        },
      },
      update: {
        categoryId,
        degreeLevel: prog.degreeLevel,
        studyLanguage: prog.studyLanguage,
        durationYears: prog.durationYears,
        annualTuition: prog.annualTuition,
        discountedTuition: prog.discountedTuition,
        currency: prog.currency,
        applicationStatus: prog.applicationStatus,
        published: true,
      },
      create: {
        universityId: uni.id,
        categoryId,
        slug: prog.slug,
        degreeLevel: prog.degreeLevel,
        studyLanguage: prog.studyLanguage,
        durationYears: prog.durationYears,
        annualTuition: prog.annualTuition,
        discountedTuition: prog.discountedTuition,
        currency: prog.currency,
        applicationStatus: prog.applicationStatus,
        published: true,
      },
    });

    for (const t of prog.translations) {
      await prisma.programTranslation.upsert({
        where: {
          programId_lang: {
            programId: academicProgram.id,
            lang: t.lang,
          },
        },
        update: t,
        create: {
          ...t,
          programId: academicProgram.id,
        },
      });
    }

    addedCount++;
    console.log(`Upserted program: ${prog.slug} (${prog.degreeLevel}) at ${uni.slug}`);
  }

  const finalCount = await prisma.academicProgram.count();
  console.log(`--- Finished! Total programs now: ${finalCount} (Added/Updated: ${addedCount}) ---`);
}

main()
  .catch((e) => {
    console.error('Error in seeding programs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
