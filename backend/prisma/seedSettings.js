import prisma from '../src/config/db.js';

const defaultSettings = [
  // Brand & Company Name (3 Languages)
  { key: 'site_name', value: 'شركة المجد للخدمات الطلابية', group: 'BRANDING' },
  { key: 'site_name_ar', value: 'شركة المجد للخدمات الطلابية', group: 'BRANDING' },
  { key: 'site_name_tr', value: 'El-Mecd Öğrenci Hizmetleri', group: 'BRANDING' },
  { key: 'site_name_en', value: 'Al-Majd Student Services', group: 'BRANDING' },
  { key: 'site_slogan_ar', value: 'سنوات من الخبرة، ومئات الطلاب، وهدف واحد: مساعدتك في تحقيق حلمك الدراسي.', group: 'BRANDING' },
  { key: 'site_slogan_tr', value: 'Yılların tecrübesi, yüzlerce öğrenci ve tek hedef: Üniversite hayalinizi gerçekleştirmek.', group: 'BRANDING' },
  { key: 'site_slogan_en', value: 'Years of experience, hundreds of students, and one goal: Helping you achieve your academic dream.', group: 'BRANDING' },
  { key: 'site_tagline', value: 'شركة المجد للخدمات الطلابية — مستقبلك الدراسي يبدأ بخطوة، ونحن هنا لمساعدتك على اتخاذها.', group: 'BRANDING' },

  // About Us (3 Languages)
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

  // Hero Section (3 Languages)
  { key: 'hero_badge_ar', value: 'شركة المجد للخدمات الطلابية | ممثل معتمد لأكثر من 120 جامعة تركية', group: 'HERO' },
  { key: 'hero_badge_tr', value: 'El-Mecd Öğrenci Hizmetleri | +120 Türk Üniversitesinin Yetkili Temsilcisi', group: 'HERO' },
  { key: 'hero_badge_en', value: 'Al-Majd Student Services | Authorized Representative for +120 Turkish Universities', group: 'HERO' },

  { key: 'hero_title_ar', value: 'بدايتك الموثوقة نحو الدراسة في تركيا', group: 'HERO' },
  { key: 'hero_title_tr', value: 'Türkiye’de Üniversite Eğitimine Güvenli Başlangıç', group: 'HERO' },
  { key: 'hero_title_en', value: 'Your Trusted Gateway to Study in Turkey', group: 'HERO' },

  { key: 'hero_desc_ar', value: 'سنوات من الخبرة ومئات الطلاب: نرافقك خطوة بخطوة للحصول على قبولك الجامعي الرسمي والمنح الدراسية في تركيا مع استشارات مخصصة.', group: 'HERO' },
  { key: 'hero_desc_tr', value: 'Yılların tecrübesi ve yüzlerce başarılı öğrenci: Türkiye’de devlet ve vakıf üniversitesi kabulleri, burslar ve vize süreçlerinde profesyonel rehberlik.', group: 'HERO' },
  { key: 'hero_desc_en', value: 'Years of experience and hundreds of students: Guiding you step-by-step toward official university admissions and scholarships in Turkey.', group: 'HERO' },
];

async function seedSettings() {
  console.log('Seeding updated dynamic company and about settings...');
  for (const item of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: item.key },
      update: { value: item.value, group: item.group },
      create: { key: item.key, value: item.value, group: item.group },
    });
  }
  console.log(`Successfully upserted ${defaultSettings.length} site settings!`);
  process.exit(0);
}

seedSettings().catch((e) => {
  console.error(e);
  process.exit(1);
});
