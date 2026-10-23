import prisma from '../src/config/db.js';

export const tenScholarshipsData = [
  {
    slug: 'vgm-yabanci-ogrenci-bursu-2026-2027',
    scholarshipType: 'PARTIAL',
    discountPercentage: 100,
    openingDate: new Date('2026-10-22'),
    deadline: new Date('2026-10-31'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'Vakıflar Genel Müdürlüğü (VGM) – Yabancı Öğrenci Yükseköğrenim Bursu',
        description: 'T.C. Kültür ve Turizm Bakanlığı Vakıflar Genel Müdürlüğü tarafından Türkiye’de yükseköğrenim gören yabancı uyruklu lisans ve önlisans öğrencilerine 8 ay boyunca aylık 4.000 TL (toplam 32.000 TL) tutarında karşılıksız resmi burs verilmektedir.',
        benefitsSummary: '4.000 TL / ay · 8 Ay Boyunca Toplam 32.000 TL Karşılıksız Destek',
        eligibilityCriteria: 'Türkiye’ye öğrenim görmek amacıyla gelmiş yabancı uyruklu yükseköğrenim öğrencileri. Türkiye’de yasal kalış izni (99 ile başlayan YKN) bulunması zorunludur. Üniversitedeki kaydın bu kimlik numarasıyla aktif olması gerekir.\n\nBaşlıca Engeller: Başka bir resmi/özel kurumdan eğitim yardımı veya burs almak, öğrenimde ek süreye kalmak, yüksek lisans veya doktora öğrencisi olmak.',
        requiredDocuments: 'Aktif öğrenci belgesi (e-Devlet veya üniversite onaylı), geçerli yabancı kimlik kartı / ikamet belgesi, adli sicil kaydı, öğrenci adına açılmış banka IBAN bilgisi.\n\nBaşvuru Takvimi: 22–31 Ekim 2026.\nResmî Başvuru Ekranı: https://www.vgm.gov.tr/sayfalar/burs-basvurulari',
      },
      {
        lang: 'ar',
        title: 'منحة المديرية العامة للأوقاف التركية (VGM) للطلاب الأجانب 2026-2027',
        description: 'منحة مالية رسمية غير مستردة تقدمها المديرية العامة للأوقاف التركية (VGM) لطلاب المعاهد والبكالوريوس الأجانب في تركيا بقيمة 4,000 ليرة تركية شهرياً لمدة 8 أشهر (بإجمالي 32,000 ليرة).',
        benefitsSummary: '4,000 ليرة تركية شهرياً · لمدة 8 أشهر بإجمالي 32,000 ليرة دعماً نقدياً',
        eligibilityCriteria: 'الطلاب الأجانب المقيمون في تركيا للدراسة والمسجلون رسمياً في مرحلتي البكالوريوس أو الدبلوم (المعاهد). يشترط وجود تصريح إقامة قانوني ساري المفعول يبدأ بالرقم 99 ومطابق لبيانات القيد الجامعي.\n\nموانع القبول: الحصول على منحة من جهة أخرى، الرسوب أو تمديد سنوات الدراسة، أو التسجيل في مرحلتي الماجستير والدكتوراه.',
        requiredDocuments: 'وثيقة طالب حديثة مصدقة (Öğrenci Belgesi)، بطاقة الإقامة التركية، لا حكم عليه (Adli Sicil)، وحساب بنكي تركي باسم الطالب.\n\nمواعيد التقديم: 22 - 31 أكتوبر 2026.\nالرابط الرسمي للتقديم: https://www.vgm.gov.tr/sayfalar/burs-basvurulari',
      },
      {
        lang: 'en',
        title: 'General Directorate of Foundations (VGM) – International Student Scholarship',
        description: 'Official monthly educational grant provided by the Turkish Directorate General of Foundations (VGM) offering 4,000 TL per month for 8 months (32,000 TL total) to international undergraduate students in Turkey.',
        benefitsSummary: '4,000 TL / month · 8 Months Total 32,000 TL Non-Refundable Grant',
        eligibilityCriteria: 'Foreign undergraduate and associate degree students residing in Turkey for study purposes with a valid 99-series foreigner identity card (YKN) actively linked to university registration.\n\nIneligibility: Receiving other institutional aid, extended study duration, or graduate (Master/PhD) enrollment.',
        requiredDocuments: 'Active student certificate, foreign national ID / residence permit, clean criminal record, Turkish bank account IBAN.\n\nCalendar: Oct 22–31, 2026.\nOfficial Portal: https://www.vgm.gov.tr/sayfalar/burs-basvurulari',
      },
    ],
  },
  {
    slug: 'unhcr-dafi-bursu-2026-2027',
    scholarshipType: 'FULL',
    discountPercentage: 100,
    openingDate: new Date('2026-09-01'),
    deadline: new Date('2026-11-15'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1507842229451-7f01be837a2b?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'DAFI Bursu – UNHCR Mülteci ve Uluslararası Koruma Yükseköğrenim Bursu',
        description: 'DAFI (Albert Einstein Alman Akademik Mülteci Girişimi), Birleşmiş Milletler Mülteciler Yüksek Komiserliği (UNHCR) ortaklığında mülteci öğrencilerin üniversite eğitimlerini tamamlamaları için öğrenim harçları, barınma, yemek ve ulaşım masraflarını karşılayan prestijli uluslararası burs programıdır.',
        benefitsSummary: 'Tam Kapsamlı Destek: Harç Ücretleri, Barınma, Yemek, Ulaşım ve Ders Materyalleri',
        eligibilityCriteria: 'İlgili çağrının kabul ettiği mülteci veya uluslararası koruma statüsüne sahip olmak. Türkiye’de bir yükseköğretim kurumunda kayıtlı olmak ve akademik başarı kriterlerini sağlamak.\n\nÖnemli Uyarı: Yalnızca öğrenci ikamet iznine veya standart pasaporta sahip olmak DAFI için yeterli değildir. İlgili çağrıda belirtilen koruma statülerinin belgelenmesi zorunludur.',
        requiredDocuments: 'Uluslararası koruma / mülteci statü belgesi, onaylı transkript, öğrenci belgesi, lise diploması ve denklik belgesi, niyet mektubu.\n\nResmî Bilgi ve Duyurular: https://help.unhcr.org/turkiye/tr/faqs/education-faqs/',
      },
      {
        lang: 'ar',
        title: 'منحة DAFI الجامعية – مفوضية شؤون اللاجئين (UNHCR)',
        description: 'برنامج منحة ألبرت آينشتاين الألمانية للطلاب اللاجئين (DAFI) بالتعاون مع مفوضية اللاجئين (UNHCR)، ويوفر تغطية شاملة لتكاليف الدراسة الجامعية وبدل المعيشة والسكن والكتب للطلاب المؤهلين.',
        benefitsSummary: 'تغطية شاملة: الأقساط الجامعية، وبدل المعيشة، والسكن، والمواصلات، والمستلزمات الدراسية',
        eligibilityCriteria: 'أن يكون الطالب حاملاً لصفة لاجئ أو حماية دولية معترف بها في تركيا. القيد المنتظم في جامعة تركية مع تحقيق معدل أكاديمي متميز.\n\nتنبيه هام: امتلاك إقامة طالب عادية أو جواز سفر أجنبي بمفرده لا يؤهل لمنحة DAFI؛ بل يجب توفر صفة الحماية الدولية المعتمدة.',
        requiredDocuments: 'بطاقة الحماية الدولية / اللجوء، كشف علامات جامعي مصدق، وثيقة الطالب، معادلة الشهادة الثانوية، وخطاب الدافع.\n\nالرابط الرسمي: https://help.unhcr.org/turkiye/tr/faqs/education-faqs/',
      },
      {
        lang: 'en',
        title: 'DAFI Scholarship Programme – UNHCR for Refugee Students',
        description: 'The DAFI (Albert Einstein German Academic Refugee Initiative) scholarship programme, implemented with UNHCR, assists eligible refugee and international protection students in financing their higher education degrees in Turkey.',
        benefitsSummary: 'Full Higher Education Grant: Tuition Fees, Housing, Monthly Living Allowance, Books',
        eligibilityCriteria: 'Holding recognized refugee or international protection status in Turkey, enrolled in an undergraduate degree program with strong academic credentials.\n\nNotice: Holding a standard student residence permit alone is not sufficient; documented protection status is strictly mandatory.',
        requiredDocuments: 'Official international protection document, authenticated transcript, student certificate, high school equivalency, motivation letter.\n\nOfficial Info: https://help.unhcr.org/turkiye/tr/faqs/education-faqs/',
      },
    ],
  },
  {
    slug: 'unhcr-yuksekogrenim-donemlik-hibe-destegi',
    scholarshipType: 'PARTIAL',
    discountPercentage: 100,
    openingDate: new Date('2026-08-15'),
    deadline: new Date('2026-10-15'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'UNHCR – Yükseköğrenime Yönelik Dönemlik Nakit Hibe Desteği',
        description: 'UNHCR Türkiye tarafından devlet üniversitelerinde okuyan uluslararası koruma sahibi yabancı öğrencilere her akademik dönem nakit hibe yardımı sağlanmaktadır. 2026–2027 güz dönemi tutarları: Önlisans 8.000 TL, 4 yıllık lisans 14.500 TL, 5-6 yıllık lisans (Tıp/Diş) 18.000 TL.',
        benefitsSummary: 'Dönemlik 8.000 – 18.000 TL Nakit Eğitim Yardımı',
        eligibilityCriteria: 'Uluslararası koruma başvurusu sahibi veya statüsü sahibi olmak. 99 ile başlayan geçerli Yabancı Kimlik Numarası bulunması. Türkiye’deki bir devlet üniversitesinde örgün önlisans veya lisans öğrencisi olmak. Devam eden öğrenciler için en az 1.50 GNO şartı aranır.\n\nKabul Edilmeyenler: Geçici koruma altındaki Suriyeliler, yüksek lisans/doktora öğrencileri, ikinci öğretim öğrencileri ve DAFI bursiyerleri.',
        requiredDocuments: 'Uluslararası koruma kimlik belgesi, e-Devlet barkodlu öğrenci belgesi ve transkript, öğrencinin kendi adına açılmış banka IBAN bilgisi.\n\nSon başvuru 15 Ekim 2026 olarak duyurulmuştur; sonraki bahar dönemi çağrılarını takip ediniz.\nResmî Bilgi: https://help.unhcr.org/turkiye/tr/information-for-non-syrians/education/',
      },
      {
        lang: 'ar',
        title: 'منحة الدعم المالي الفصلي للتعليم العالي – مفوضية اللاجئين (UNHCR)',
        description: 'مساعدة مالية فصلية مباشرة تقدمها مفوضية UNHCR لطلاب الجامعات الحكومية التركية من أصحاب الحماية الدولية. المبالغ المعتمدة: المعاهد 8,000 ليرة/فصل، البكالوريوس (4 سنوات) 14,500 ليرة/فصل، والتخصصات الطبية (5-6 سنوات) 18,000 ليرة/فصل.',
        benefitsSummary: 'من 8,000 إلى 18,000 ليرة تركية فصلياً بحسب التخصص والمرحلة الجامعية',
        eligibilityCriteria: 'أن يكون الطالب حاملاً لصفة الحماية الدولية ببطاقة هوية (99) سارية، ومقيداً في جامعة حكومية تركية بدوام نظامي بمعدل تراكمي لا يقل عن 1.50.\n\nالمستثنون من التقديم: السوريون تحت الحماية المؤقتة، طلاب الدراسات العليا، طلاب التعليم المسائي، والحاصلون على منحة DAFI.',
        requiredDocuments: 'بطاقة الحماية الدولية، وثيقة طالب وكشف علامات إلكتروني معتمد، ورقم حساب بنكي (IBAN) باسم الطالب.\n\nالرابط الرسمي: https://help.unhcr.org/turkiye/tr/information-for-non-syrians/education/',
      },
      {
        lang: 'en',
        title: 'UNHCR Higher Education Semester Cash Grant in Turkey',
        description: 'Semester-based financial cash assistance scheme provided by UNHCR Turkey for international protection university students. Amounts: Associate degree 8,000 TL/term, 4-year Bachelor 14,500 TL/term, 5-6 year Medicine/Dentistry 18,000 TL/term.',
        benefitsSummary: '8,000 – 18,000 TL per semester direct financial aid',
        eligibilityCriteria: 'International protection applicants or status holders with a valid 99-series ID enrolled in regular daytime programs at Turkish state universities with minimum 1.50 GPA.\n\nExclusions: Temporary protection Syrian citizens, graduate/postgraduate students, evening classes, and DAFI recipients.',
        requiredDocuments: 'International protection ID card, official transcript & student certificate, verified bank account IBAN.\n\nOfficial Details: https://help.unhcr.org/turkiye/tr/information-for-non-syrians/education/',
      },
    ],
  },
  {
    slug: 'ab-burslari-icmpd-turkiye-2026-2027',
    scholarshipType: 'PARTIAL',
    discountPercentage: 100,
    openingDate: new Date('2026-09-22'),
    deadline: new Date('2026-11-01'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'AB Bursları – ICMPD Türkiye Yükseköğrenim Destek Programı 2026–2027',
        description: 'Avrupa Birliği tarafından finanse edilen ve ICMPD Türkiye tarafından yürütülen programda; Türkiye Cumhuriyeti vatandaşları, geçici koruma altındaki Suriyeliler ve uluslararası koruma statüsündeki öğrencilere yıllık harçlık ve harç katkısı sağlanmaktadır.',
        benefitsSummary: 'Lisans: Yıllık 360 € Harçlık + 500 € Harç Desteği · Lisansüstü: Yıllık 540 € Harçlık + 500 € Harç',
        eligibilityCriteria: 'Genellikle 18–35 yaş aralığında olmak. Türkiye’de anlaşmalı illerdeki devlet veya vakıf üniversitelerinde önlisans, lisans, yüksek lisans veya doktora öğrencisi olmak. İlgili programın kabul ettiği bölümlerde okumak, not ortalaması ve kimlik koşullarını karşılamak.\n\nBaşvuru Tarihleri: 22 Eylül – 1 Kasım 2026.',
        requiredDocuments: 'Geçerli kimlik belgesi (Geçici Koruma / Uluslararası Koruma / TC Kimlik), onaylı transkript, öğrenci belgesi, gelir durum beyanı.\n\nResmî Başvuru Portalı: https://euburs.org/',
      },
      {
        lang: 'ar',
        title: 'منح الاتحاد الأوروبي (EU Bursları) – مشروع ICMPD تركيا 2026-2027',
        description: 'برنامج المنح الأوروبية الممول من الاتحاد الأوروبي بإشراف المركز الدولي لتطوير سياسات الهجرة (ICMPD)، ويوفر دعماً مالياً سنوياً ومساهمة في الأقساط الجامعية لطلاب البكالوريوس والدراسات العليا.',
        benefitsSummary: 'البكالوريوس: 360 يورو سنوياً + حتى 500 يورو للأقساط · الماجستير والدكتوراه: 540 يورو + حتى 500 يورو',
        eligibilityCriteria: 'الفئة العمرية بين 18 و35 عاماً. الطلاب المقيدون في الجامعات التركية المستهدفة بمراحل الدبلوم، البكالوريوس، الماجستير، والدكتوراه. يشمل الطلاب السوريين تحت الحماية المؤقتة، أصحاب الحماية الدولية، والطلاب الأتراك المستحقين.\n\nفترة التقديم: 22 سبتمبر - 1 نوفمبر 2026.',
        requiredDocuments: 'بطاقة الحماية المؤقتة (كملك) أو وثيقة الحماية الدولية أو الهوية، كشف درجات تراكمي، وثيقة قيد جامعي، وإثبات الدخل.\n\nبوابة التقديم الرسمية: https://euburs.org/',
      },
      {
        lang: 'en',
        title: 'EU Scholarships – ICMPD Higher Education Project in Turkey',
        description: 'Funded by the European Union and coordinated by ICMPD Turkey, offering monthly subsistence allowances and tuition fee support for university students under temporary/international protection and host community members.',
        benefitsSummary: 'Undergraduate: 360 €/yr Pocket Money + up to 500 € Tuition · Graduate: 540 €/yr + 500 € Tuition',
        eligibilityCriteria: 'Aged 18–35 enrolled in associate, bachelor, master, or PhD degrees in target provinces. Covers temporary protection Syrians, international protection holders, and host community students fulfilling GPA and discipline criteria.\n\nApplication Window: Sept 22 – Nov 1, 2026.',
        requiredDocuments: 'Valid identity document, academic transcript, official enrollment verification, household income proof.\n\nOfficial Portal: https://euburs.org/',
      },
    ],
  },
  {
    slug: 'ozdemir-bayraktar-milli-teknoloji-burs-programi',
    scholarshipType: 'PARTIAL',
    discountPercentage: 100,
    openingDate: new Date('2026-09-15'),
    deadline: new Date('2026-10-20'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'Özdemir Bayraktar Millî Teknoloji Burs Programı – T3 Vakfı',
        description: 'Türkiye Teknoloji Takımı Vakfı (T3 Vakfı) tarafından yürütülen, öğrencileri akademik ve mesleki gelişim, teknoloji üretimi ve sosyal sorumluluk alanlarında destekleyen kapsamlı ulusal burs programıdır.',
        benefitsSummary: 'Aylık Nakit Burs Desteği + TEKNOFEST ve T3 Vakfı Teknoloji Mentörlüğü',
        eligibilityCriteria: 'Seçilen burs kategorisinin eğitim düzeyi (önlisans, lisans, lisansüstü) şartlarını karşılamak. Başvuru aşamalarını (video mülakat, kişilik envanteri ve mülakat değerlendirmesi) başarıyla tamamlamak.\n\nYabancı Öğrenciler İçin Önemli: Yabancı uyruklu veya uluslararası koruma statüsündeki adaylar güncel çağrı kılavuzundan vatandaşlık ve başvuru uygunluğunu doğrulamalıdır.',
        requiredDocuments: 'Öğrenci belgesi, transkript, özgeçmiş, video mülakat kaydı ve teknoloji projeleri portfolyosu.\n\nResmî Bilgi ve Başvuru: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'ar',
        title: 'برنامج أوزدمير بيرقدار للمنح التكنولوجية الوطنية – وقف T3',
        description: 'برنامج المنح الرائد المقدم من وقف فريق التكنولوجيا التركي (T3 Vakfı) لتأهيل ورعاية الطلاب الموهوبين في مجالات التكنولوجيا والابتكار والذكاء الاصطناعي مع تقديم دعم مالي ومعرفي.',
        benefitsSummary: 'منحة نقدية شهرية منتظمة + إرشاد وتوجيه تكنولوجي وفرص مشاركة في تكنوفيست',
        eligibilityCriteria: 'الطلاب المسجلون في الجامعات بمراحل الدبلوم، البكالوريوس، والدراسات العليا في التخصصات العلمية والهندسية. اجتياز مراحل التقييم الشاملة بما فيها مقابلة الفيديو واختبار الميول.\n\nتنبيه للطلاب الأجانب: يرجى التحقق من شروط الجنسية والإقامة الخاصة بكل مسار من خلال المنصة الرسمية.',
        requiredDocuments: 'وثيقة طالب حديثة، كشف الدرجات، سيرة ذاتية، تسجيل مقابلة الفيديو، وملف المشاريع المنجزة.\n\nالرابط الرسمي: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'en',
        title: 'Özdemir Bayraktar National Technology Scholarship Programme – T3 Foundation',
        description: 'Empowering young minds in technology, engineering, and social impact across Turkey. Spearheaded by the Turkish Technology Team Foundation (T3), providing financial grants, innovation bootcamps, and project incubation.',
        benefitsSummary: 'Monthly Cash Stipend + Technology Mentorship & TEKNOFEST Research Access',
        eligibilityCriteria: 'Undergraduate and graduate students meeting academic criteria. Applicants must complete multi-stage assessments including video interview, skills inventory, and panel review.\n\nInternational students must verify eligibility guidelines per annual call.',
        requiredDocuments: 'Student certificate, transcript, resume, video interview submission, and engineering portfolio.\n\nOfficial Portal: https://bursiyer.t3vakfi.org/programlar',
      },
    ],
  },
  {
    slug: 't3-vakfi-yukselen-yildiz-burs-programi',
    scholarshipType: 'PARTIAL',
    discountPercentage: 100,
    openingDate: new Date('2026-09-15'),
    deadline: new Date('2026-10-20'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'Yükselen Yıldız Burs Programı – T3 Vakfı',
        description: 'Özdemir Bayraktar Millî Teknoloji Burs Programı’nın en prestijli kategorilerinden biridir. Akademik ve kişisel gelişimine önem veren, yüksek sorumluluk bilincine ve takım çalışması yetkinliğine sahip üstün başarılı öğrencilere tahsis edilir.',
        benefitsSummary: 'Yüksek Tutarlı Aylık Burs + Liderlik ve Özel İhtisas Eğitim Kampları',
        eligibilityCriteria: 'Üniversitelerin lisans ve lisansüstü programlarında yüksek akademik başarı ortalamasına (GNO) sahip olmak. Sosyal sorumluluk ve teknoloji projelerinde aktif rol üstlenmek. Değerlendirme komisyonunun mülakat ve proje sunum aşamalarından geçmek.',
        requiredDocuments: 'Transkript, akademik başarı belgeleri, proje referansları, özgeçmiş ve video sunum.\n\nResmî Başvuru: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'ar',
        title: 'برنامج منحة النجوم الصاعدة (Yükselen Yıldız) – وقف T3',
        description: 'أحد أرقى مسارات برنامج أوزدمير بيرقدار للتميز الأكاديمي، مخصص للطلاب الذين يظهرون كفاءة استثنائية وشغفاً بالبحث العلمي والقيادة والعمل الجماعي في مجالات التقنية الحديثة.',
        benefitsSummary: 'منحة شهرية مميزة + مخيمات تدريبية وتطوير قيادي بإشراف نخبة الخبراء',
        eligibilityCriteria: 'الحصول على معدل تراكمي متميز في مرحلة البكالوريوس أو الدراسات العليا، وسجل حافل بالمبادرات والمشاريع العلمية، واجتياز مقابلات لجنة الاختيار.',
        requiredDocuments: 'كشف درجات تراكمي معتمد، شهادات إنجاز، خطابات توصية، وسيرة ذاتية مفصلة.\n\nالموقع الرسمي: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'en',
        title: 'Rising Star (Yükselen Yıldız) Scholarship Programme – T3 Foundation',
        description: 'Elite category of the Özdemir Bayraktar Technology Scholarship for outstanding students demonstrating academic excellence, leadership capacity, and active participation in engineering initiatives.',
        benefitsSummary: 'High-Value Monthly Stipend + Exclusive Leadership & Tech Bootcamps',
        eligibilityCriteria: 'High CGPA undergraduate and graduate students with documented participation in national/international scientific competitions and social impact projects.',
        requiredDocuments: 'Authenticated transcript, project achievement awards, reference letters, and comprehensive portfolio.\n\nOfficial Link: https://bursiyer.t3vakfi.org/programlar',
      },
    ],
  },
  {
    slug: 't3-vakfi-egitim-destegi-burs-programi',
    scholarshipType: 'PARTIAL',
    discountPercentage: 100,
    openingDate: new Date('2026-09-15'),
    deadline: new Date('2026-11-20'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'T3 Vakfı – Eğitim Desteği Burs Programı',
        description: 'Akademik hayatında başarı gösteren ancak üniversite eğitimini sürdürmek için maddi desteğe ihtiyaç duyan öğrencileri desteklemeyi amaçlayan doğrudan ihtiyaç ve başarı bursudur.',
        benefitsSummary: '10 Ay Boyunca Düzenli Aylık Nakit Eğitim Yardımı',
        eligibilityCriteria: 'Maddi ihtiyaç durumu belgelenebilir olmak, Türkiye’deki üniversitelerde örgün öğrenci olmak, akademik derslerinde başarı kriterlerini karşılamak. Aile gelir durumu ve başarı belgesi üzerinden değerlendirme yapılır.',
        requiredDocuments: 'Öğrenci belgesi, transkript, gelir durumu beyan formu, kira kontratı (varsa) ve kimlik fotokopisi.\n\nResmî Başvuru: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'ar',
        title: 'برنامج منحة الدعم التعليمي – وقف T3',
        description: 'منحة دراسية مخصصة للطلاب الجامعيين المتفوقين في دراستهم ولكنهم بحاجة إلى دعم مالي لتغطية نفقات المعيشة والدراسة الجامعية في تركيا.',
        benefitsSummary: 'مساعدة مالية نقدية شهرية لمدة 10 أشهر طوال العام الدراسي',
        eligibilityCriteria: 'إثبات الحاجة المادية للدعم، القيد الجامعي المنتظم، وتحقيق معدل أكاديمي ناجح يلبي شروط الدليل الإرشادي السنوي.',
        requiredDocuments: 'وثيقة إثبات الدخل العائلي، وثيقة القيد، كشف الدرجات، وعقد السكن أو الإيجار.\n\nرابط التقديم الرسمي: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'en',
        title: 'T3 Foundation Educational Support Scholarship Programme',
        description: 'Financial aid programme prioritizing university students who demonstrate strong academic dedication but require economic assistance to pursue their higher education.',
        benefitsSummary: 'Regular Monthly Financial Support across 10 Academic Months',
        eligibilityCriteria: 'Documented financial need, regular university student enrollment in Turkey, and adherence to minimum academic GPA thresholds.',
        requiredDocuments: 'Student certificate, transcript, family income verification, housing contract.\n\nOfficial Link: https://bursiyer.t3vakfi.org/programlar',
      },
    ],
  },
  {
    slug: 't3-vakfi-sen-geleceksin-burs-programi',
    scholarshipType: 'PARTIAL',
    discountPercentage: 100,
    openingDate: new Date('2026-09-15'),
    deadline: new Date('2026-11-30'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'T3 Vakfı – Sen Geleceksin Burs Programı',
        description: 'Yalnızca maddi destek sunmakla kalmayıp bursiyerlerin vakfın projelerinde ve teknoloji atölyelerinde aktif görev almasını, mentörlük yapmasını ve sosyal sorumluluk deneyimi kazanmasını sağlayan uygulamalı burs programıdır.',
        benefitsSummary: 'Aylık Nakit Burs + Deneyap Atölyelerinde Eğitmenlik ve Staj İmkanı',
        eligibilityCriteria: 'Programın eğitim düzeyi ve diğer başvuru kriterlerini karşılamak. Ekip çalışmasına ve Deneyap teknoloji atölyelerinde ortaokul ve lise öğrencilerine mentörlük yapmaya istekli olmak. Görev ve sorumlulukları düzenli tamamlamak.',
        requiredDocuments: 'Transkript, özgeçmiş, niyet mektubu, atölye görev tercihi ve mülakat değerlendirmesi.\n\nResmî Portal: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'ar',
        title: 'برنامج منحة "أنت المستقبل" (Sen Geleceksin) – وقف T3',
        description: 'برنامج فريد يجمع بين الدعم المالي واكتساب الخبرة الميدانية؛ حيث يشارك الطلاب في إدارة ورشات التكنولوجيا وإرشاد الفئات الناشئة والمساهمة في الفعاليات الوطنية.',
        benefitsSummary: 'منحة نقدية شهرية + خبرة تدريب وتدريس عملي في ورشات دني-ياب التكنولوجية',
        eligibilityCriteria: 'الرغبة في العمل التطوعي وتدريب الطلاب الناشئين، والالتزام بالساعات المحددة للورشات، والقدرة على العمل بروح الفريق.',
        requiredDocuments: 'سيرة ذاتية محدثة، كشف درجات، خطاب دافع، ومقابلة تقييم شخصية.\n\nالرابط الرسمي: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'en',
        title: 'T3 Foundation "You Are The Future" (Sen Geleceksin) Scholarship',
        description: 'Bridging financial assistance with community leadership. Scholars receive monthly grants while actively mentoring middle/high school students at Deneyap Technology Workshops.',
        benefitsSummary: 'Monthly Cash Grant + Hands-on Mentoring & Practical Teaching Experience',
        eligibilityCriteria: 'Passion for educational outreach, commitment to mentor younger generations in STEM workshops, and proven teamwork reliability.',
        requiredDocuments: 'Transcript, curriculum vitae, statement of purpose, and panel interview.\n\nOfficial Link: https://bursiyer.t3vakfi.org/programlar',
      },
    ],
  },
  {
    slug: 't3-ai-lisans-arastirmaci-burs-programi',
    scholarshipType: 'PARTIAL',
    discountPercentage: 100,
    openingDate: new Date('2026-09-15'),
    deadline: new Date('2026-12-15'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'T3 AI Lisans Araştırmacı Burs Programı (Yapay Zekâ & LLM Tezi)',
        description: 'Yapay zekâ, büyük dil modelleri (LLM) ve doğal dil işleme alanlarında bitirme projesi / tezi geliştiren mühendislik lisans son sınıf öğrencilerine özel araştırma fonu, GPU altyapısı ve mentörlük desteği sunan burs programıdır.',
        benefitsSummary: 'Aylık Özel Araştırma Bursu + Bulut GPU Altyapı Desteği + Yapay Zekâ Uzman Mentörlüğü',
        eligibilityCriteria: 'Bilgisayar Mühendisliği, Yazılım Mühendisliği, Yapay Zekâ Mühendisliği veya ilgili mühendislik bölümlerinde lisans son sınıf öğrencisi olmak. Yapay zekâ veya LLM alanında danışman hoca onaylı bitirme projesi hazırlıyor olmak. Proje şartları ve vatandaşlık koşulları kılavuzdan doğrulanmalıdır.',
        requiredDocuments: 'Bitirme projesi öneri formu, GitHub repo bağlantısı, akademik transkript, danışman öğretim üyesi onay yazısı.\n\nResmî Bilgi: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'ar',
        title: 'برنامج منحة T3 للذكاء الاصطناعي وبحوث التخرج (T3 AI)',
        description: 'منحة بحثية وتكنولوجية متقدمة موجهة لطلاب السنة الأخيرة في كليات الهندسة وعلوم الحاسوب الذين يجرون مشاريع تخرج وأبحاثاً في الذكاء الاصطناعي والنماذج اللغوية الضخمة (LLMs).',
        benefitsSummary: 'منحة بحثية شهرية خاصة + إتاحة خوادم ومعالجات حوسبة GPU متقدمة + إشراف متخصص',
        eligibilityCriteria: 'طلاب السنة الأخيرة في هندسة الكمبيوتر أو البرمجيات أو الذكاء الاصطناعي، ولديهم مقترح مشروع تخرج معتمد في الذكاء الاصطناعي أو معالجة اللغات الطبيعية.',
        requiredDocuments: 'مقترح مشروع التخرج، رابط مستودع الأكواد (GitHub)، كشف الدرجات، وموافقة الأستاذ المشرف.\n\nالرابط الرسمي: https://bursiyer.t3vakfi.org/programlar',
      },
      {
        lang: 'en',
        title: 'T3 AI Undergraduate Researcher Fellowship (AI & LLMs)',
        description: 'Specialized research fellowship aimed at senior undergraduate engineering students developing graduation projects or theses in Artificial Intelligence and Large Language Models (LLMs).',
        benefitsSummary: 'Dedicated Monthly Research Grant + High-Performance GPU Access + AI Mentorship',
        eligibilityCriteria: 'Senior undergraduate students in Computer, Software, or AI Engineering developing an approved AI/LLM graduation thesis under academic faculty supervision.',
        requiredDocuments: 'Thesis project proposal, GitHub repository link, official transcript, advisor confirmation letter.\n\nOfficial Link: https://bursiyer.t3vakfi.org/programlar',
      },
    ],
  },
  {
    slug: 'turk-universiteleri-uluslararasi-ogrenci-burs-ve-destekleri',
    scholarshipType: 'DISCOUNT',
    discountPercentage: 50,
    openingDate: new Date('2026-06-01'),
    deadline: new Date('2026-12-31'),
    status: 'ACTIVE',
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1000&auto=format&fit=crop&q=80',
    published: true,
    translations: [
      {
        lang: 'tr',
        title: 'Üniversitelerin Kendi Uluslararası Öğrenci Bursları ve İhtiyaç Destekleri',
        description: 'Türkiye’deki devlet ve vakıf üniversiteleri (Sabancı, Koç, Bilkent, Fırat, İstanbul vb.) yabancı öğrencilere öğrenim ücreti indirimi (%25 - %100), başarı bursu, ücretsiz yemek desteği, yurt ve acil maddi yardım fonları sunmaktadır.',
        benefitsSummary: '%25 - %100 Öğrenim Ücreti İndirimi, Yemek Bursu, Yurt ve Acil İhtiyaç Yardımları',
        eligibilityCriteria: 'İlgili üniversitede aktif kaydı bulunmak. Üniversiteye ilk kez kabul sırasında verilen burslarla (örn. Sabancı Üniversitesi uluslararası aday bursları) halihazırda okuyan öğrencilere verilen desteklerin koşulları farklıdır. Fırat Üniversitesi ve diğer üniversiteler için Uluslararası Öğrenci Ofisi ve Öğrenci İşlerine başvurulmalıdır.',
        requiredDocuments: 'Öğrenci belgesi, güncel transkript, gelir durumu beyan formu, üniversitenin Uluslararası Öğrenci Koordinatörlüğü başvuru formu.\n\nÖrnek Şartlar ve Koşullar: https://www.sabanciuniv.edu/tr/lisans-programlari-burs-ve-ucretleri',
      },
      {
        lang: 'ar',
        title: 'منح ودعم الجامعات التركية الخاص للطلاب الدوليين (خصومات، سكن، ووجبات)',
        description: 'تقدم الجامعات التركية الحكومية والخاصة (مثل صبنجي، كوتش، بيلكنت، فرات، وإسطنبول) باقة من المنح الداخلية والتسهيلات تشمل خصومات الأقساط من 25% حتى 100%، وبطاقات وجبات طعام مجانية، ودعم السكن الجامعي والمساعدات الطارئة.',
        benefitsSummary: 'خصم أقساط 25% - 100% + وجبات مجانية + دعم السكن الجامعي والمساعدات العاجلة',
        eligibilityCriteria: 'القيد النشط في الجامعة المعنية. تجدر الإشارة إلى أن منح القبول المباشر للطلاب الجدد تختلف عن منح الدعم المالي للطلاب المسجلين بالفعل. يرجى مراجعة مكتب شؤون الطلاب والطلاب الدوليين في جامعتك.',
        requiredDocuments: 'وثيقة طالب حديثة، كشف الدرجات، استمارة مكتب الطلاب الدوليين بالجامعة، وإثبات الوضع المالي.\n\nرابط استرشادي: https://www.sabanciuniv.edu/tr/lisans-programlari-burs-ve-ucretleri',
      },
      {
        lang: 'en',
        title: 'Institutional University Scholarships & Welfare Aids for International Students',
        description: 'Many Turkish universities (e.g. Sabancı, Koç, Bilkent, Fırat, Istanbul) provide institutional merit discounts (25%-100%), free campus meal vouchers, subsidized dormitories, and hardship emergency funds.',
        benefitsSummary: '25% to 100% Tuition Waivers, Campus Meal Grants, Subsidized Dorms & Emergency Aid',
        eligibilityCriteria: 'Enrolled international students at the respective university. Admission merit scholarships differ from continuing student welfare support. Inquire directly with your university’s International Students Office.',
        requiredDocuments: 'Student certificate, authenticated transcript, income statement, International Office petition form.\n\nReference Info: https://www.sabanciuniv.edu/tr/lisans-programlari-burs-ve-ucretleri',
      },
    ],
  },
];

async function seed10Scholarships() {
  console.log('Inserting/Updating 10 detailed scholarships in database...');
  for (const s of scholarshipsData) {
    const existing = await prisma.scholarship.findUnique({
      where: { slug: s.slug },
    });

    let scholarshipId;
    if (existing) {
      await prisma.scholarship.update({
        where: { id: existing.id },
        data: {
          scholarshipType: s.scholarshipType,
          discountPercentage: s.discountPercentage,
          openingDate: s.openingDate,
          deadline: s.deadline,
          status: s.status,
          imageUrl: s.imageUrl,
          published: s.published,
        },
      });
      scholarshipId = existing.id;
      console.log(`Updated scholarship: ${s.slug}`);
    } else {
      const created = await prisma.scholarship.create({
        data: {
          slug: s.slug,
          scholarshipType: s.scholarshipType,
          discountPercentage: s.discountPercentage,
          openingDate: s.openingDate,
          deadline: s.deadline,
          status: s.status,
          imageUrl: s.imageUrl,
          published: s.published,
        },
      });
      scholarshipId = created.id;
      console.log(`Created scholarship: ${s.slug}`);
    }

    for (const tr of s.translations) {
      await prisma.scholarshipTranslation.upsert({
        where: {
          scholarshipId_lang: {
            scholarshipId,
            lang: tr.lang,
          },
        },
        update: {
          title: tr.title,
          description: tr.description,
          benefitsSummary: tr.benefitsSummary,
          eligibilityCriteria: tr.eligibilityCriteria,
          requiredDocuments: tr.requiredDocuments,
        },
        create: {
          scholarshipId,
          lang: tr.lang,
          title: tr.title,
          description: tr.description,
          benefitsSummary: tr.benefitsSummary,
          eligibilityCriteria: tr.eligibilityCriteria,
          requiredDocuments: tr.requiredDocuments,
        },
      });
    }
  }

  const count = await prisma.scholarship.count();
  console.log(`Total scholarships now in DB: ${count}`);
  await prisma.$disconnect();
}

seed10Scholarships().catch((e) => {
  console.error('Error seeding scholarships:', e);
  process.exit(1);
});
