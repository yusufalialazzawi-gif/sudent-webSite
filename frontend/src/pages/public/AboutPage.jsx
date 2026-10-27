import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  ShieldCheck,
  Target,
  Award,
  Users,
  CheckCircle2,
  HeartHandshake,
  Compass,
  Globe2,
  Sparkles,
  ArrowRight,
  BookOpen,
  MessageCircle,
  Building2,
  PhoneCall,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import SfBreadcrumb from '../../components/common/SfBreadcrumb';
import TestimonialCard from '../../components/common/TestimonialCard';

export default function AboutPage() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { settings } = useTheme();

  const { data: testimonialsData } = useQuery({
    queryKey: ['about-testimonials'],
    queryFn: () => api.getTestimonials(),
  });

  // Dynamic texts from backend settings with fallbacks
  const title =
    currentLang === 'ar'
      ? settings.about_hero_title_ar || 'من نحن | شركة المجد للخدمات والاستشارات الجامعية'
      : currentLang === 'tr'
      ? settings.about_hero_title_tr || 'Biz Kimiz | El-Mecd Öğrenci Hizmetleri'
      : settings.about_hero_title_en || 'About Us | Al-Majd Student Services';

  const tagline =
    currentLang === 'ar'
      ? settings.about_tagline_ar || 'سنوات من الخبرة ومئات الطلاب وهدف واحد: مساعدتك في تحقيق حلمك الدراسي في تركيا.'
      : currentLang === 'tr'
      ? settings.about_tagline_tr || 'Yılların tecrübesi, yüzlerce öğrenci ve tek bir hedef: Üniversite hayalinizi gerçeğe dönüştürmek.'
      : settings.about_tagline_en || 'Years of experience, hundreds of students, and one shared goal: Helping you achieve your academic dreams.';

  const p1 =
    currentLang === 'ar'
      ? settings.about_p1_ar ||
        'نحن شركة المجد للقبولات الجامعية، نمتلك سنوات من الخبرة في مجال الخدمات والاستشارات التعليمية، وقد ساعدنا مئات الطلاب من العراق ومصر والجزائر والعديد من الدول الأخرى في رحلتهم نحو الدراسة في تركيا.'
      : currentLang === 'tr'
      ? settings.about_p1_tr ||
        'Biz El-Mecd Öğrenci Hizmetleri olarak, eğitim ve akademik danışmanlık alanında yıllara dayanan deneyimimizle; Irak, Mısır, Cezayir ve dünyanın dört bir yanından yüzlerce öğrenciye Türkiye’deki üniversite yolculuklarında rehberlik ettik.'
      : settings.about_p1_en ||
        'At Al-Majd Student Services, with years of expertise in educational consulting, we have guided hundreds of students from Iraq, Egypt, Algeria, and across the globe on their study journey in Turkey.';

  const p2 =
    currentLang === 'ar'
      ? settings.about_p2_ar ||
        'نؤمن بأن لكل طالب طموحًا يستحق الدعم، ولذلك نحرص على فهم احتياجاته ومساعدته في اختيار الجامعة والتخصص المناسبين، وتقديم الإرشادات اللازمة بشأن إجراءات التسجيل والتقديم إلى الجامعات الحكومية والخاصة، والمنح الدراسية، وبرامج تعليم اللغة التركية (TÖMER)، وغيرها من الخدمات التعليمية.'
      : currentLang === 'tr'
      ? settings.about_p2_tr ||
        'Her öğrencinin desteği hak eden bir ideali olduğuna inanıyoruz. Bu anlayışla, her öğrencimizin ihtiyaçlarını yakından dinleyerek doğru üniversite ve bölümü seçmesine yardımcı oluyor; devlet ve vakıf üniversitelerine kayıt, burs başvuruları, TÖMER Türkçe hazırlık programları ve tüm akademik süreçlerde profesyonel danışmanlık sağlıyoruz.'
      : settings.about_p2_en ||
        'We believe every student’s ambition deserves dedicated support. We take time to understand each student’s goals, assisting in choosing the right university and major, while providing comprehensive guidance on admissions to public and private universities, scholarship opportunities, TÖMER Turkish prep programs, and more.';

  const p3 =
    currentLang === 'ar'
      ? settings.about_p3_ar ||
        'نحن هنا من أجلك، في كل خطوة من خطوات رحلتك التعليمية. نعمل على تسهيل الإجراءات، وتوضيح الخيارات، ومساعدة الطلاب على اتخاذ قرارات مدروسة تتناسب مع أهدافهم وإمكاناتهم.'
      : currentLang === 'tr'
      ? settings.about_p3_tr ||
        'Eğitim yolculuğunuzun her adımında yanınızdayız. İşlemleri kolaylaştırıyor, tüm alternatifleri şeffaflıkla sunuyor ve öğrencilerin kendi hedeflerine ve imkânlarına en uygun, bilinçli kararlar almalarını sağlıyoruz.'
      : settings.about_p3_en ||
        'We are here for you at every stage of your educational path. We streamline procedures, clarify all options, and empower students to make well-informed decisions that match their aspirations and capabilities.';

  const p4 =
    currentLang === 'ar'
      ? settings.about_p4_ar ||
        'طلابنا الذين تعاملوا معنا يعرفون أسلوب عملنا، ويعرفون مدى اهتمامنا بمتابعة احتياجاتهم وتقديم المساعدة لهم. ثقتهم وتجاربهم هي الدافع الذي يشجعنا على مواصلة التطور وتقديم خدمات أفضل.'
      : currentLang === 'tr'
      ? settings.about_p4_tr ||
        'Bizimle çalışan öğrencilerimiz işimize duyduğumuz titizliği, ihtiyaçlarına verdiğimiz samimi önemi ve her an ulaşılabilir desteğimizi yakından bilirler. Onların güveni ve başarı hikâyeleri, sürekli gelişmemizin ve her zaman daha üstün hizmet sunmamızın en büyük motivasyonudur.'
      : settings.about_p4_en ||
        'Students who have partnered with us know our dedication, attention to detail, and genuine care for their success. Their trust and achievements inspire us to continually innovate and provide higher-standard services.';

  const whyTitle =
    currentLang === 'ar'
      ? settings.about_why_title_ar || 'لماذا يختار الطلاب شركة المجد؟'
      : currentLang === 'tr'
      ? settings.about_why_title_tr || 'Neden El-Mecd Öğrenci Hizmetleri?'
      : settings.about_why_title_en || 'Why Choose Al-Majd Student Services?';

  const closingText =
    currentLang === 'ar'
      ? settings.about_closing_ar || 'شركة المجد للقبولات الجامعية — مستقبلك الدراسي يبدأ بخطوة، ونحن هنا لمساعدتك على اتخاذها بكل ثقة.'
      : currentLang === 'tr'
      ? settings.about_closing_tr || 'El-Mecd Öğrenci Hizmetleri — Üniversite geleceğiniz bir adımla başlar, o adımı güvenle atmanız için biz buradayız.'
      : settings.about_closing_en || 'Al-Majd Student Services — Your academic future begins with a single step, and we are right beside you to make it happen.';

  const features = [
    {
      icon: Award,
      title:
        currentLang === 'ar'
          ? 'خبرة واعتمادات رسمية'
          : currentLang === 'tr'
          ? 'Yıllara Dayanan Resmî Yetki'
          : 'Certified Official Expertise',
      desc:
        currentLang === 'ar'
          ? 'وكيل رسمي ومسجل لأفضل الجامعات التركية الخاصة والحكومية، مع فهم كامل لشروط القبول والمعادلات.'
          : currentLang === 'tr'
          ? 'Türkiye’nin önde gelen üniversitelerinin yetkili temsilcisi, tam denklik ve kayıt rehberliği.'
          : 'Official authorized agent for premier Turkish universities with comprehensive equivalency guidance.',
    },
    {
      icon: Globe2,
      title:
        currentLang === 'ar'
          ? 'خدمة طلاب دوليون متعددو الجنسيات'
          : currentLang === 'tr'
          ? 'Çok Uluslu Öğrenci Portföyü'
          : 'International Student Network',
      desc:
        currentLang === 'ar'
          ? 'ساعدنا بنجاح آلاف الطلاب من العراق ومصر وسوريا والجزائر ودول الخليج في تحقيق القبول الجامعي.'
          : currentLang === 'tr'
          ? 'Irak, Mısır, Suriye, Cezayir ve Körfez ülkelerinden binlerce öğrenciye başarıyla rehberlik ettik.'
          : 'Successfully guided thousands of students from the MENA region and worldwide to their dream universities.',
    },
    {
      icon: GraduationCap,
      title:
        currentLang === 'ar'
          ? 'خدمات متكاملة من الألف إلى الياء'
          : currentLang === 'tr'
          ? 'Uçtan Uca Entegre Hizmetler'
          : 'End-to-End Comprehensive Support',
      desc:
        currentLang === 'ar'
          ? 'من اختيار الجامعة والتخصص والمنحة إلى القبول المبدئي والنهائي، ترجمة الأوراق، وتثبيت القيد.'
          : currentLang === 'tr'
          ? 'Doğru bölüm seçiminden resmî kabul mektubuna, yeminli tercümeden kesin kayıt ve ikamete kadar.'
          : 'From university and major selection to acceptance letters, certified translations, and campus registration.',
    },
    {
      icon: HeartHandshake,
      title:
        currentLang === 'ar'
          ? 'استشارات مجانية 100%'
          : currentLang === 'tr'
          ? '%100 Ücretsiz Danışmanlık'
          : '100% Free Consultation',
      desc:
        currentLang === 'ar'
          ? 'لا نتقاضى أي أتعاب من الطالب مقابل التقديم للجامعات الخاصة الشريكة والحصول على الخصومات الحصرية.'
          : currentLang === 'tr'
          ? 'Anlaşmalı vakıf üniversitelerine başvurularda ve özel burs indirimlerinde öğrenciden hiçbir ücret alınmaz.'
          : 'No service fees charged to students for admissions to our partner private universities with exclusive discounts.',
    },
    {
      icon: Compass,
      title:
        currentLang === 'ar'
          ? 'مرافقة مستمرة طوال سنوات الدراسة'
          : currentLang === 'tr'
          ? 'Eğitim Hayatı Boyunca Yanınızda'
          : 'Continuous Mentorship',
      desc:
        currentLang === 'ar'
          ? 'لا تنتهي علاقتنا بالطالب بعد التسجيل، بل نبقى على تواصل للإجابة على استفساراته وتسهيل مسيرته الأكاديمية.'
          : currentLang === 'tr'
          ? 'İlişkimiz kayıtla bitmez; konaklama, vize, denklik ve üniversite hayatında kesintisiz iletişim.'
          : 'Our relationship extends beyond admission; providing continuous guidance on housing, visas, and academic life.',
    },
    {
      icon: ShieldCheck,
      title:
        currentLang === 'ar'
          ? 'شفافية ومصداقية كاملة'
          : currentLang === 'tr'
          ? 'Şeffaflık ve Güvenilirlik'
          : 'Absolute Transparency & Trust',
      desc:
        currentLang === 'ar'
          ? 'معلومات واضحة ومحدثة عن الرسوم الدراسية، شروط الاعتراف، والمنح بدون وعود غير واقعية أو رسوم مخفية.'
          : currentLang === 'tr'
          ? 'Net ve güncel harç bilgileri, akreditasyon koşulları ve gizli maliyetsiz resmî kabul garantisi.'
          : 'Clear and updated tuition fees, accreditation status, and official acceptance letters without hidden fees.',
    },
  ];

  const breadcrumbItems = [
    { label: currentLang === 'ar' ? 'الرئيسية' : currentLang === 'tr' ? 'Ana Sayfa' : 'Home', to: '/' },
    { label: currentLang === 'ar' ? 'من نحن' : currentLang === 'tr' ? 'Biz Kimiz' : 'About Us' },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16">
      {/* StudyFans Breadcrumb Strip */}
      <SfBreadcrumb
        items={breadcrumbItems}
        title={title}
      />

      <div className="sf-container mx-auto px-4 space-y-12">
        {/* Intro Highlight Banner */}
        <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 sm:p-10 drop-shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#dee2e6] pb-6">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#ff9015]/10 text-beer">
                {currentLang === 'ar' ? 'منظومة القبول الجامعي المعتمدة' : currentLang === 'tr' ? 'Onaylı Üniversite Kabul Merkezi' : 'Certified University Admissions'}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-main-color font-cairo leading-tight">
                {tagline}
              </h2>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href={`https://wa.me/${settings.whatsapp_number || settings.contact_whatsapp || '905313971022'}?text=${encodeURIComponent(
                  currentLang === 'ar'
                    ? 'مرحباً، أود استشارة مجانية حول الدراسة في تركيا'
                    : 'Merhaba, Türkiye’de üniversite eğitimi hakkında ücretsiz danışmanlık almak istiyorum'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{currentLang === 'ar' ? 'استشارة واتساب فورية' : currentLang === 'tr' ? 'Hemen WhatsApp’tan Yazın' : 'Chat on WhatsApp'}</span>
              </a>
              <Link
                to="/apply"
                className="px-5 py-3 rounded-xl bg-beer hover:bg-[#e07b09] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
              >
                <span>{currentLang === 'ar' ? 'سجل الآن مجاناً' : currentLang === 'tr' ? 'Hemen Başvur' : 'Apply Now'}</span>
                <ArrowRight className="w-4 h-4 flip-in-rtl" />
              </Link>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#f7f5f2] p-4 rounded-xl border border-[#dee2e6] text-center">
              <span className="text-2xl sm:text-3xl font-black text-main-color block">10+</span>
              <span className="text-xs text-text-color font-semibold">
                {currentLang === 'ar' ? 'سنوات من الخبرة' : currentLang === 'tr' ? 'Yıllık Deneyim' : 'Years Experience'}
              </span>
            </div>
            <div className="bg-[#f7f5f2] p-4 rounded-xl border border-[#dee2e6] text-center">
              <span className="text-2xl sm:text-3xl font-black text-beer block">+1,500</span>
              <span className="text-xs text-text-color font-semibold">
                {currentLang === 'ar' ? 'طالب تمت خدمتهم' : currentLang === 'tr' ? 'Kayıtlı Öğrenci' : 'Students Enrolled'}
              </span>
            </div>
            <div className="bg-[#f7f5f2] p-4 rounded-xl border border-[#dee2e6] text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#0071CE] block">+120</span>
              <span className="text-xs text-text-color font-semibold">
                {currentLang === 'ar' ? 'جامعة تركية معتمدة' : currentLang === 'tr' ? 'Anlaşmalı Üniversite' : 'Partner Universities'}
              </span>
            </div>
            <div className="bg-[#f7f5f2] p-4 rounded-xl border border-[#dee2e6] text-center">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">%100</span>
              <span className="text-xs text-text-color font-semibold">
                {currentLang === 'ar' ? 'استشارات مجانية' : currentLang === 'tr' ? 'Ücretsiz Danışmanlık' : 'Free Guidance'}
              </span>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 sm:p-8 drop-shadow-sm space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-main-color font-cairo flex items-center gap-2">
                <Building2 className="w-5 h-5 text-beer" />
                <span>{currentLang === 'ar' ? 'قصتنا ورؤيتنا' : currentLang === 'tr' ? 'Hikayemiz ve Vizyonumuz' : 'Our Story & Vision'}</span>
              </h3>
              <p className="text-text-color text-sm sm:text-base leading-relaxed font-normal">
                {p1}
              </p>
              <p className="text-text-color text-sm sm:text-base leading-relaxed font-normal">
                {p2}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 drop-shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#ff9015]/10 text-beer flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-main-color font-cairo">
                  {currentLang === 'ar' ? 'معك في كل خطوة' : currentLang === 'tr' ? 'Her Adımda Yanınızda' : 'With You Every Step'}
                </h4>
                <p className="text-text-color text-xs sm:text-sm leading-relaxed">
                  {p3}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 drop-shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0071CE]/10 text-[#0071CE] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-main-color font-cairo">
                  {currentLang === 'ar' ? 'ثقة طلابنا هي دافعنا' : currentLang === 'tr' ? 'Öğrencilerimizin Güveni' : 'Our Students’ Trust'}
                </h4>
                <p className="text-text-color text-xs sm:text-sm leading-relaxed">
                  {p4}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Contact & Action Box */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#f7f5f2] rounded-2xl border border-[#dee2e6] p-6 drop-shadow-sm space-y-5">
              <h4 className="font-bold text-base text-main-color font-cairo border-b border-[#dee2e6] pb-3">
                {currentLang === 'ar' ? 'تواصل مباشر مع مستشارينا' : currentLang === 'tr' ? 'Danışmanlarımızla İletişim' : 'Contact Our Advisors'}
              </h4>
              <p className="text-xs text-text-color leading-relaxed">
                {currentLang === 'ar'
                  ? 'فريقنا المتخصص متواجد طوال أيام الأسبوع لتقديم الإرشاد الأكاديمي المجاني ومساعدتك في اختيار تخصصك وجامعتك.'
                  : currentLang === 'tr'
                  ? 'Uzman eğitim danışmanlarımız haftanın her günü size en uygun üniversiteyi seçmeniz için hazır.'
                  : 'Our advisors are available all week to assist you in choosing the right university and major.'}
              </p>

              <div className="space-y-3 pt-1">
                <a
                  href={`https://wa.me/${settings.whatsapp_number || settings.contact_whatsapp || '905313971022'}?text=${encodeURIComponent(
                    currentLang === 'ar'
                      ? 'مرحباً، أود استشارة حول الدراسة في تركيا'
                      : 'Merhaba, Türkiye’de eğitim için bilgi almak istiyorum'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{currentLang === 'ar' ? 'محادثة واتساب سريعة' : currentLang === 'tr' ? 'WhatsApp Hızlı İletişim' : 'Quick WhatsApp Chat'}</span>
                </a>

                <a
                  href={`tel:${settings.phone_number || '+905313971022'}`}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-main-color border border-[#dee2e6] font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-beer" />
                  <span>{settings.phone_number || '+90 531 397 10 22'}</span>
                </a>
              </div>

              <div className="pt-2 border-t border-[#dee2e6] space-y-2 text-xs text-text-color">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{currentLang === 'ar' ? 'استشارات مجانية 100%' : currentLang === 'tr' ? '%100 Ücretsiz Danışmanlık' : '100% Free Guidance'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{currentLang === 'ar' ? 'خصومات ومنح جامعية حصرية' : currentLang === 'tr' ? 'Özel Burs ve İndirimler' : 'Exclusive Scholarships'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{currentLang === 'ar' ? 'متابعة شاملة حتى التثبيت' : currentLang === 'tr' ? 'Kesin Kayda Kadar Tam Takip' : 'Complete Admission Support'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Grid */}
        <div className="space-y-6 pt-6">
          <div className="text-start space-y-1">
            <span className="text-xs font-bold text-beer uppercase tracking-wider block">
              {currentLang === 'ar' ? 'قيمنا وخدماتنا' : currentLang === 'tr' ? 'Değerlerimiz ve Avantajlarımız' : 'Our Core Strengths'}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-main-color font-cairo">
              {whyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-[#dee2e6] drop-shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#ff9015]/10 text-beer border border-[#ff9015]/20">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-main-color font-cairo">
                      {feat.title}
                    </h3>
                    <p className="text-text-color text-xs sm:text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#dee2e6] flex items-center gap-1.5 text-xs font-bold text-beer">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{currentLang === 'ar' ? 'ضمان رسمي موثق' : currentLang === 'tr' ? 'Resmî Temsilcilik' : 'Official Representation'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials */}
        {testimonialsData?.data && testimonialsData.data.length > 0 && (
          <div className="space-y-6 pt-6">
            <div className="text-start space-y-1">
              <span className="text-xs font-bold text-beer uppercase tracking-wider block">
                {currentLang === 'ar' ? 'تجارب طلابنا' : currentLang === 'tr' ? 'Öğrenci Deneyimleri' : 'Student Stories'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-main-color font-cairo">
                {t('testimonials.title')}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonialsData.data.map((item) => (
                <TestimonialCard key={item.id} testimonial={item} />
              ))}
            </div>
          </div>
        )}

        {/* Callout Banner StudyFans 1:1 */}
        <div className="bg-[#f7f5f2] rounded-2xl border border-[#dee2e6] p-8 sm:p-12 drop-shadow-sm text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#ff9015]/10 text-beer flex items-center justify-center mx-auto border border-[#ff9015]/20">
            <Sparkles className="w-7 h-7" />
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-cairo text-main-color max-w-3xl mx-auto leading-relaxed">
            {closingText}
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/apply"
              className="w-full sm:w-auto px-8 py-3.5 bg-beer hover:bg-[#e07b09] text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>
                {currentLang === 'ar' ? 'ابدأ خطوتك الأولى مجاناً' : currentLang === 'tr' ? 'İlk Adımı Ücretsiz Atın' : 'Start Your First Step'}
              </span>
              <ArrowRight className="w-4 h-4 flip-in-rtl" />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsapp_number || settings.contact_whatsapp || '905313971022'}?text=${encodeURIComponent(
                currentLang === 'ar'
                  ? settings.whatsapp_message_ar || 'مرحباً شركة المجد، أود استشارة حول الدراسة في تركيا'
                  : settings.whatsapp_message_tr || 'Merhaba El-Mecd, Türkiye’de eğitim için danışmanlık almak istiyorum'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-main-color font-bold text-sm rounded-xl border border-[#dee2e6] shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              <span>{currentLang === 'ar' ? 'تحدث مع مستشارنا عبر واتساب' : currentLang === 'tr' ? 'WhatsApp ile Danışmanla Görüş' : 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
