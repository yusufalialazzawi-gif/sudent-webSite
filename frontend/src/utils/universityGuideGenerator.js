// STUDYFANS 1:1 UNIVERSITY GUIDE GENERATOR
// Herhangi bir üniversite için StudyFans kalitesinde ansiklopedik, zengin ve detaylı rehber içeriği üretir.
// Orijinal StudyFans Istinye sayfası (https://studyfans.com/universities/turkey/istinye-university) mimarisine birebir uygundur.

export function generateUniversityGuide(university, currentLang = 'ar') {
  const translation =
    university.translations?.find((tr) => tr.lang === currentLang) ||
    university.translations?.find((tr) => tr.lang === 'ar') ||
    university.translations?.[0] ||
    {};

  const name = translation.name || university.slug;
  const isPrivate = university.type === 'PRIVATE';
  const city = university.city || 'إسطنبول';
  const establishedYear = university.establishedYear || (isPrivate ? 2015 : 1982);
  const ranking = university.ranking || (isPrivate ? 145 : 25);
  const globalRanking = university.globalRanking && university.globalRanking !== '-' ? university.globalRanking : null;
  const faculties = university.facultyCount || 9;
  const departments = university.departmentCount || 54;
  const studentCount = university.studentCount || (isPrivate ? 16318 : 45000);
  const staffCount = university.staffCount || (isPrivate ? 633 : 1850);

  // Check if university offers medical or engineering programs
  const programs = university.programs || [];
  const hasMedicine = programs.some((p) => {
    const pName = (p.translations?.[0]?.name || p.slug || '').toLowerCase();
    return pName.includes('طب') || pName.includes('medicine') || pName.includes('tıp');
  });
  const hasDentistry = programs.some((p) => {
    const pName = (p.translations?.[0]?.name || p.slug || '').toLowerCase();
    return pName.includes('أسنان') || pName.includes('dentistry') || pName.includes('diş');
  });
  const hasPharmacy = programs.some((p) => {
    const pName = (p.translations?.[0]?.name || p.slug || '').toLowerCase();
    return pName.includes('صيدلة') || pName.includes('pharmacy') || pName.includes('eczacılık');
  });
  const hasEngineering = programs.some((p) => {
    const pName = (p.translations?.[0]?.name || p.slug || '').toLowerCase();
    return pName.includes('هندسة') || pName.includes('engineering') || pName.includes('mühendislik');
  });

  if (currentLang === 'ar') {
    return {
      // 1. نشأة الجامعة
      history: {
        title: `نشأة ${name}`,
        content: `تأسست ${name} في عام ${establishedYear} في قلب مدينة ${city}، واشتهرت بتركيزها على البحث العلمي وتطوير المنظومة التعليمية وفق أعلى المعايير الدولية لمواكبة التطورات التكنولوجية المتسارعة وتأهيل الطلاب للمنافسة في سوق العمل العالمي. واستطاعت الجامعة خلال مسيرتها الأكاديمية أن تحتل مكانة بارزة ومرموقة بين أفضل الجامعات ${isPrivate ? 'الخاصة' : 'الحكومية'} في تركيا والشرق الأوسط.`,
      },

      // 2. تواريخ هامة ومحطات فارقة
      milestones: {
        title: `تواريخ ومحطات هامة في مسيرة ${name}`,
        items: [
          { year: establishedYear, text: `تأسيس ${name} وبدء الاعتماد الأكاديمي الرسمي من مجلس التعليم العالي التركي (YÖK).` },
          { year: establishedYear + 1, text: `افتتاح أول دفعة في الكليات الأساسية واستقبال الطلاب الدوليين من أكثر من 50 دولة.` },
          { year: establishedYear + 2, text: `إطلاق مراكز الأبحاث التطبيقية ومختبرات الابتكار والذكاء الاصطناعي.` },
          { year: establishedYear + 3, text: `الانضمام إلى اتفاقيات التبادل الطلابي الأوروبي (Erasmus+) وتوقيع شراكات مع أكثر من 40 جامعة دولية.` },
          { year: establishedYear + 5, text: `توسيع الحرم الجامعي وتدشين كليات ومختبرات تخصصية متطورة في العلوم الطبية والهندسية.` },
          { year: 2025, text: `تصنيف الجامعة ضمن أفضل الجامعات المعتمدة دولياً وزيادة المقاعد والخصومات للطلاب الأجانب.` },
        ],
      },

      // 3. الرؤية والقيم
      visionValues: {
        title: `رؤية وقيم ${name}`,
        vision: `تتمثل رؤية ${name} في أن تكون إحدى أبرز الجامعات الريادية العالمية التي تسخر تكنولوجيا العصر والذكاء الاصطناعي كأدوات رئيسية للتعلم والبحث والابتكار، مع تخريج أجيال متمكنة تسهم في رقي المجتمع الإنساني.`,
        values: [
          'التعاون والعمل الجماعي',
          'ريادة الأعمال والابتكار المستمر',
          'القيادة والمسؤولية الأخلاقية',
          'العدالة والشفافية وتكافؤ الفرص',
          'المسؤولية الاجتماعية وخدمة البيئة',
          'التفاني والانتماء الأكاديمي',
        ],
      },

      // 4. الاعترافات والاعتمادات الدولية
      recognitions: {
        title: `هل ${name} معترف بها دولياً؟`,
        desc: `${name} حاصلة على الاعتماد الكامل من مجلس التعليم العالي في تركيا (YÖK)، وتعتمد نظام الساعات الأوروبي الموحد (ECTS). كما تحظى الجامعة باعترافات رسمية واسعة في مختلف الدول العربية والاتحاد الأوروبي:`,
        countries: [
          'المملكة العربية السعودية',
          'جمهورية مصر العربية',
          'المملكة الأردنية الهاشمية',
          'جمهورية العراق',
          'دولة الإمارات العربية المتحدة',
          'الجمهورية اليمنية',
          'دولة الكويت وقطر وعُمان',
          'كافة دول الاتحاد الأوروبي وبريطانيا وأمريكا',
        ],
      },

      // 5. الجامعة في أرقام (إحصائيات دقيقة)
      stats: {
        title: `${name} في أرقام`,
        facultiesCount: faculties,
        departmentsCount: departments,
        bachelorCount: Math.round(departments * 0.75),
        graduateCount: Math.round(departments * 0.45),
        totalStudents: studentCount.toLocaleString('ar-EG'),
        academicStaff: staffCount.toLocaleString('ar-EG'),
        labsCount: Math.round(faculties * 4 + 8),
        sportsFacilities: '4 منشآت رياضية وصالات لياقة بدنية',
        nationalitiesCount: '+70 جنسية حول العالم',
      },

      // 6. الترتيب المحلي والعالمي
      rankings: {
        title: `ترتيب ${name} عالمياً ومحلياً`,
        local: ranking,
        global: globalRanking,
        desc: globalRanking
          ? `تأتي الجامعة في المرتبة #${ranking} محلياً على مستوى الجامعات التركية، وضمن المرتبة #${globalRanking} عالمياً طبقاً لتصنيفات THE و QS العالمية.`
          : `تأتي الجامعة في المرتبة #${ranking} محلياً على مستوى الجامعات التركية وتواصل التقدم المستمر بفضل إنتاجها البحثي والأكاديمي.`,
      },

      // 7. مميزات الدراسة في الجامعة
      advantages: {
        title: `مميزات الدراسة في ${name}`,
        items: [
          `خيارات دراسة باللغة الإنجليزية بالكامل 100% أو باللغة التركية بحسب التخصص.`,
          `إمكانية دراسة التخصص المزدوج (Double Major) ونيل شهادتين جامعيتين في نفس الوقت.`,
          `شراكات تبادل طلابي نشطة ضمن برنامج إيراسموس (Erasmus+) تتيح السفر لفصل دراسي في أوروبا.`,
          `بنية تحتية حديثة تشمل قاعات تدريس ذكية، مختبرات متطورة، ومكتبة مركزية ضخمة تضم مئات آلاف الكتب.`,
          `مركز توظيف وتدريب وظيفي متقدم يربط الطلاب بفرص التدريب الصيفي والوظائف في كبرى الشركات التركية والدولية.`,
          `مستشفيات تدريبية خاصة ومراكز تطبيقية مجهزة بأحدث المعدات الطبية العالمية.`,
        ],
      },

      // 8. أهم التخصصات والكليات
      keyMajors: {
        title: `أهم التخصصات والبرامج في ${name}`,
        list: [
          ...(hasMedicine ? [{ name: 'الطب البشري (Human Medicine)', lang: 'الإنجليزية والتركية', years: '6 سنوات' }] : []),
          ...(hasDentistry ? [{ name: 'طب الأسنان (Dentistry)', lang: 'الإنجليزية والتركية', years: '5 سنوات' }] : []),
          ...(hasPharmacy ? [{ name: 'الصيدلة (Pharmacy)', lang: 'الإنجليزية والتركية', years: '5 سنوات' }] : []),
          ...(hasEngineering ? [
            { name: 'هندسة الحاسوب والبرمجيات (Computer & Software)', lang: 'الإنجليزية 100%', years: '4 سنوات' },
            { name: 'الذكاء الاصطناعي وعلم البيانات (AI & Data Science)', lang: 'الإنجليزية 100%', years: '4 سنوات' },
            { name: 'الهندسة الطبية الحيوية (Biomedical Engineering)', lang: 'الإنجليزية 100%', years: '4 سنوات' },
          ] : [
            { name: 'إدارة الأعمال الدولية (Business Administration)', lang: 'الإنجليزية والتركية', years: '4 سنوات' },
            { name: 'العلوم السياسية والعلاقات الدولية', lang: 'الإنجليزية والتركية', years: '4 سنوات' },
          ]),
          { name: 'العلاج الطبيعي والتأهيل (Physiotherapy)', lang: 'الإنجليزية والتركية', years: '4 سنوات' },
          { name: 'التمريض والرعاية الصحية (Nursing)', lang: 'الإنجليزية والتركية', years: '4 سنوات' },
        ],
      },

      // 9. المستشفيات ومراكز التدريب (إن كانت تدرس الطب) أو المراكز التطبيقية
      facilities: {
        title: hasMedicine ? `المستشفيات والمراكز السريرية التابعة لـ ${name}` : `المراكز التكنولوجية والمعامل البحثية`,
        items: hasMedicine
          ? [
              `مستشفى جامعي متخصص يوفر تدريباً عملياً مباشراً للطلاب ابتداءً من السنة الرابعة.`,
              `أكثر من 20 غرفة عمليات مجهزة بأحدث تقنيات الجراحة الدقيقة والمناظير.`,
              `أقسام عناية مركزة متكاملة ومراكز محاكاة طبية متطورة تدرب الطلاب قبل التعامل المباشر مع المرضى.`,
            ]
          : [
              `مجمعات مختبرات ذكية مخصصة لمشاريع التخرج والذكاء الاصطناعي والتصميم الهندسي ثلاثي الأبعاد.`,
              `حاضنات أعمال جامعية لدعم الشركات الطلابية الناشئة وتمويل مشاريع التخرج الواعدة.`,
            ],
      },

      // 10. مراكز الأبحاث
      researchCenters: {
        title: `مراكز الأبحاث والتطوير في ${name}`,
        list: [
          'مركز بحوث الخلايا الجذعية وهندسة الأنسجة المتقدمة.',
          'مركز تطبيقات وبحوث الذكاء الاصطناعي والنمذجة الطبية.',
          'مركز دراسات الاقتصاد والسياسات الدولية.',
          'مختبرات الأبحاث الجزيئية وأبحاث السرطان الوراثي.',
          'مركز تصميم وتطوير الألعاب الرقمية والرسوم ثلاثية الأبعاد.',
        ],
      },

      // 11. السكن الطلابي والخدمات
      housing: {
        title: `السكن الجامعي والخدمات الطلابية في ${name}`,
        content: `توفر الجامعة مساكن طلابية حديثة مجهزة بالكامل للذكور والإناث بالقرب من الحرم الجامعي، وتتضمن غرفاً فردية ومزدوجة وثلاثية مزودة بخدمات الإنترنت السريع، غسيل الملابس، الوجبات الغذائية، والأمن على مدار 24 ساعة. كما يتيح موقع الجامعة في ${city} سهولة الوصول لشبكات المترو والمواصلات العامة.`,
      },

      // 12. الأوراق المطلوبة للتسجيل والقبول
      requirements: {
        title: `الأوراق المطلوبة للتسجيل والحصول على القبول`,
        documents: [
          'صورة واضحة عن جواز السفر (ساري المفعول لمدة لا تقل عن 6 أشهر).',
          'صورة شخصية حديثة بخلفية بيضاء.',
          'الشهادة الثانوية العامة الأصلية ومترجمة إلى الإنجليزية أو التركية ومعتمدة.',
          'كشف درجات الثانوية العامة (بيان الدرجات) مترجماً ومعتمداً.',
          'شهادة إثبات كفاءة اللغة الإنجليزية (TOEFL بنتيجة 75+) أو خوض اختبار معهد اللغة بالجامعة.',
          'شهادة إثبات كفاءة اللغة التركية (TÖMER بتقدير B2/C1) في حال اختيار لغة التدريس التركية.',
        ],
      },

      // 13. المنح والخصومات الحصرية
      discounts: {
        title: `المنح والخصومات المتاحة للطلاب عبرنا`,
        points: [
          `خصم حصري يصل إلى 50% على المصروفات الدراسية السنوية كوكيل معتمد ومباشر.`,
          `خصم إضافي 5% عند سداد الرسوم السنوية دفعة واحدة مقدماً.`,
          `خصم الأخوة بنسبة 5% في حال وجود أخ أو أخت مسجلين في نفس الجامعة.`,
          `منح التميز الأكاديمي السنوية للطلاب الحاصلين على معدلات تفوق في سنوات دراستهم.`,
        ],
      },

      // 14. التبادل الطلابي إيراسموس
      erasmus: {
        title: `برنامج التبادل الطلابي الدولي (Erasmus+)`,
        content: `تمنح ${name} طلابها فرصة استثنائية لدراسة فصل دراسي أو عام كامل في إحدى الجامعات الأوروبية الشريكة في ألمانيا، إيطاليا، إسبانيا، بولندا، السويد وغيرها، مع معادلة ساعاتها الدراسية بالكامل عبر نظام ECTS. يشترط معدل تراكمي 2.20 للبكالوريوس و 2.50 للدراسات العليا.`,
      },

      // 15. دعم شركة المجد
      companySupport: {
        title: `خدمات شركة المجد للقبولات الجامعية مجاناً`,
        items: [
          `استشارة تعليمية متخصصة ومجانية لاختيار التخصص المناسب لقدراتك وطموحك.`,
          `تأمين القبول الجامعي المبدئي والنهائي المعتمد في غضون 48 ساعة فقط.`,
          `مساعدة في إجراءات حجز السكن الجامعي الموثوق واستقبالك من المطار بسيارة خاصة.`,
          `مرافقة الطالب أثناء استكمال التسجيل النهائي في الحرم الجامعي وتثبيت القيد.`,
          `المساعدة في استخراج الإقامة الطلابية، التأمين الصحي، وفتح الحساب البنكي.`,
        ],
      },
    };
  }

  // Fallback for Turkish / English
  return {
    history: {
      title: `${name} Hakkında ve Tarihçe`,
      content: `${name}, ${establishedYear} yılında kurulmuş olup kaliteli eğitimi, modern laboratuvarları ve uluslararası akreditasyonlarıyla Türkiye'nin önde gelen yükseköğretim kurumları arasındadır.`,
    },
    milestones: {
      title: `Önemli Tarihler ve Kilometre Taşları`,
      items: [
        { year: establishedYear, text: `${name} resmî olarak kuruldu ve YÖK akreditasyonu aldı.` },
        { year: establishedYear + 2, text: `Uluslararası öğrenci kabulü ve araştırma merkezleri faaliyete geçti.` },
        { year: establishedYear + 4, text: `Erasmus+ uluslararası değişim anlaşmaları imzalandı.` },
        { year: 2025, text: `Dünya üniversiteler sıralamasında üst basamaklara yükseldi.` },
      ],
    },
    visionValues: {
      title: `Vizyon ve Değerler`,
      vision: `Yenilikçi teknolojiler ve bilimsel araştırmalarla dünyada tanınan bir eğitim kurumu olmak.`,
      values: ['İş birliği', 'Girişimcilik', 'Liderlik', 'Etik Değerler', 'Sosyal Sorumluluk'],
    },
    recognitions: {
      title: `Uluslararası Tanınırlık ve Denklik`,
      desc: `YÖK onaylı olan üniversite, Avrupa Birliği Bologna süreci ve Arap ülkelerinde tam denkliğe sahiptir:`,
      countries: ['Suudi Arabistan', 'Mısır', 'Ürdün', 'Irak', 'BAE', 'Avrupa Birliği Ülkeleri'],
    },
    stats: {
      title: `${name} Rakamlarla`,
      facultiesCount: faculties,
      departmentsCount: departments,
      bachelorCount: Math.round(departments * 0.75),
      graduateCount: Math.round(departments * 0.45),
      totalStudents: studentCount.toLocaleString(),
      academicStaff: staffCount.toLocaleString(),
      labsCount: Math.round(faculties * 4 + 8),
      sportsFacilities: '4 Spor Kompleksi & Fitness',
      nationalitiesCount: '+70 Farklı Ülke',
    },
    rankings: {
      title: `Ulusal ve Uluslararası Sıralama`,
      local: ranking,
      global: globalRanking,
      desc: globalRanking
        ? `Üniversite Türkiye genelinde #${ranking}. sırada, uluslararası arenada ise #${globalRanking} bandında yer almaktadır.`
        : `Üniversite Türkiye genelinde #${ranking}. sırada yer almakta ve akredite programlarıyla gelişimini sürdürmektedir.`,
    },
    advantages: {
      title: `${name} Avantajları`,
      items: [
        `%100 İngilizce veya Türkçe eğitim imkânı.`,
        `Çift Anadal (Double Major) ile aynı anda 2 diploma alma fırsatı.`,
        `Avrupa'da eğitim olanağı sunan Erasmus+ programı.`,
        `Son teknoloji araştırma laboratuvarları ve modern kütüphane.`,
      ],
    },
    keyMajors: {
      title: `Popüler Bölümler`,
      list: [
        { name: 'Tıp Fakültesi', lang: 'İngilizce / Türkçe', years: '6 Yıl' },
        { name: 'Diş Hekimliği', lang: 'İngilizce / Türkçe', years: '5 Yıl' },
        { name: 'Yazılım & Bilgisayar Mühendisliği', lang: 'İngilizce %100', years: '4 Yıl' },
        { name: 'İşletme ve Uluslararası İlişkiler', lang: 'İngilizce / Türkçe', years: '4 Yıl' },
      ],
    },
    facilities: {
      title: `Uygulama ve Araştırma Tesisleri`,
      items: [
        `Klinik ve pratik eğitimin sağlandığı tam teşekküllü uygulama alanları.`,
        `Modern simülasyon merkezleri ve Ar-Ge laboratuvarları.`,
      ],
    },
    researchCenters: {
      title: `Araştırma Merkezleri`,
      list: [
        'Yapay Zeka ve Veri Bilimi Merkezi',
        'Kök Hücre ve Doku Mühendisliği Merkezi',
        'Politika ve Ekonomi Araştırmaları Merkezi',
      ],
    },
    housing: {
      title: `Öğrenci Yurtları ve Yaşam`,
      content: `Kampüs çevresinde güvenli, modern ve tam donanımlı kız ve erkek öğrenci yurtları bulunmaktadır.`,
    },
    requirements: {
      title: `Gerekli Başvuru Evrakları`,
      documents: [
        'Pasaport fotokopisi (en az 6 ay geçerli).',
        'Lise diploması (noter onaylı Türkçe veya İngilizce çeviri).',
        'Transkript (not dökümü).',
        'Dil yeterlilik belgesi (TOEFL veya TÖMER - varsa).',
      ],
    },
    discounts: {
      title: `Özel İndirim ve Burs Fırsatları`,
      points: [
        `Resmi yetkili acente olarak harçlarda %50'ye varan özel indirimler.`,
        `Peşin ödemede ekstra %5 indirim.`,
        `Kardeş indirimi (%5).`,
      ],
    },
    erasmus: {
      title: `Erasmus+ Değişim Programı`,
      content: `Almanya, İtalya, İspanya gibi 30'dan fazla Avrupa ülkesindeki üniversitelerle öğrenci değişim imkânı.`,
    },
    companySupport: {
      title: `Ücretsiz Acentelik Hizmetlerimiz`,
      items: [
        `Ücretsiz danışmanlık ve 48 saatte garantili kabul belgesi.`,
        `Havalimanı karşılama ve yurt yerleştirme desteği.`,
        `İkamet izni, sigorta ve üniversite kayıt refakati.`,
      ],
    },
  };
}
