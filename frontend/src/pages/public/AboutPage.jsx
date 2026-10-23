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
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
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
      ? settings.about_hero_title_ar || 'من نحن؟ | شركة المجد للخدمات الطلابية'
      : currentLang === 'tr'
      ? settings.about_hero_title_tr || 'Biz Kimiz? | El-Mecd Öğrenci Hizmetleri'
      : settings.about_hero_title_en || 'About Us | Al-Majd Student Services';

  const tagline =
    currentLang === 'ar'
      ? settings.about_tagline_ar || 'سنوات من الخبرة، ومئات الطلاب، وهدف واحد: مساعدتك في تحقيق حلمك الدراسي.'
      : currentLang === 'tr'
      ? settings.about_tagline_tr || 'Yılların tecrübesi, yüzlerce öğrenci ve tek bir hedef: Üniversite hayalinizi gerçeğe dönüştürmek.'
      : settings.about_tagline_en || 'Years of experience, hundreds of students, and one shared goal: Helping you achieve your academic dreams.';

  const p1 =
    currentLang === 'ar'
      ? settings.about_p1_ar ||
        'نحن شركة المجد للخدمات الطلابية، نمتلك سنوات من الخبرة في مجال الخدمات والاستشارات التعليمية، وقد ساعدنا مئات الطلاب من العراق ومصر والجزائر والعديد من الدول الأخرى في رحلتهم نحو الدراسة في تركيا.'
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
      ? settings.about_why_title_ar || 'لماذا تختار شركة المجد؟'
      : currentLang === 'tr'
      ? settings.about_why_title_tr || 'Neden El-Mecd Öğrenci Hizmetleri?'
      : settings.about_why_title_en || 'Why Choose Al-Majd Student Services?';

  const closingText =
    currentLang === 'ar'
      ? settings.about_closing_ar || 'شركة المجد للخدمات الطلابية — مستقبلك الدراسي يبدأ بخطوة، ونحن هنا لمساعدتك على اتخاذها.'
      : currentLang === 'tr'
      ? settings.about_closing_tr || 'El-Mecd Öğrenci Hizmetleri — Üniversite geleceğiniz bir adımla başlar, o adımı güvenle atmanız için biz buradayız.'
      : settings.about_closing_en || 'Al-Majd Student Services — Your academic future begins with a single step, and we are right beside you to make it happen.';

  const features = [
    {
      icon: Award,
      color: 'text-brand-amber-500 bg-brand-amber-500/10 border-brand-amber-500/20',
      title:
        currentLang === 'ar'
          ? 'خبرة تمتد لسنوات'
          : currentLang === 'tr'
          ? 'Yıllara Dayanan Tecrübe'
          : 'Years of Proven Expertise',
      desc:
        currentLang === 'ar'
          ? 'معرفة عميقة وخبرة متراكمة في مجال الخدمات الطلابية والتعليم في الجامعات التركية.'
          : currentLang === 'tr'
          ? 'Türkiye’de yükseköğretim ve uluslararası öğrenci danışmanlığında köklü uzmanlık.'
          : 'Deep-rooted knowledge and extensive background in Turkish university admissions.',
    },
    {
      icon: Globe2,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      title:
        currentLang === 'ar'
          ? 'خدمة طلاب من دول متعددة'
          : currentLang === 'tr'
          ? 'Çok Uluslu Öğrenci Portföyü'
          : 'Students Across Nations',
      desc:
        currentLang === 'ar'
          ? 'ساعدنا بنجاح مئات الطلاب من العراق ومصر والجزائر والعديد من الدول الأخرى.'
          : currentLang === 'tr'
          ? 'Irak, Mısır, Cezayir ve onlarca ülkeden yüzlerce yabancı öğrenciye başarıyla kabul aldık.'
          : 'Proudly guided hundreds of students from Iraq, Egypt, Algeria, and worldwide.',
    },
    {
      icon: GraduationCap,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      title:
        currentLang === 'ar'
          ? 'خدمات طلابية متكاملة'
          : currentLang === 'tr'
          ? 'Uçtan Uca Entegre Hizmetler'
          : 'Comprehensive Student Services',
      desc:
        currentLang === 'ar'
          ? 'من اختيار الجامعة والتخصص المناسبين إلى متابعة إجراءات التقديم، القبول، والتسجيل.'
          : currentLang === 'tr'
          ? 'Doğru bölüm seçiminden resmî kabul, kayıt ve denklik işlemlerine kadar tam refakat.'
          : 'From selecting the right university and major to tracking application, acceptance, and enrollment.',
    },
    {
      icon: HeartHandshake,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      title:
        currentLang === 'ar'
          ? 'اهتمام باحتياجاتك الفردية'
          : currentLang === 'tr'
          ? 'Öğrenci Odaklı Yaklaşım'
          : 'Personalized Student Care',
      desc:
        currentLang === 'ar'
          ? 'نحرص على فهم ظروف كل طالب وتقديم المعلومات الدقيقة التي تساعده في بناء مستقبله.'
          : currentLang === 'tr'
          ? 'Her öğrencinin bütçesini, hedeflerini ve akademik durumunu dinleyerek en doğru planı sunuyoruz.'
          : 'Dedicated to understanding each student’s circumstances and providing tailored insights.',
    },
    {
      icon: Compass,
      color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
      title:
        currentLang === 'ar'
          ? 'متابعة وإرشاد مستمر'
          : currentLang === 'tr'
          ? 'Kesintisiz Rehberlik ve Takip'
          : 'Continuous Mentorship & Tracking',
      desc:
        currentLang === 'ar'
          ? 'نرافقك بالإرشادات اللازمة والاستشارات الصادقة خلال كافة خطوات رحلتك التعليمية.'
          : currentLang === 'tr'
          ? 'İlk başvurudan mezuniyete kadar tüm adımlarda şeffaf ve güvenilir rehberlik.'
          : 'Accompanying you with trusted advice and transparent guidance across every milestone.',
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* Hero Header */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-amber-500/10 border border-brand-amber-500/20 text-brand-amber-600 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {currentLang === 'ar'
              ? 'التعريف المؤسسي والهوية الرسمية'
              : currentLang === 'tr'
              ? 'Kurumsal Tanıtım ve Vizyon'
              : 'Institutional Identity & Vision'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-brand-navy-950 font-cairo leading-tight">
          {title}
        </h1>

        <p className="text-slate-700 text-base sm:text-xl font-bold font-cairo max-w-3xl mx-auto text-brand-amber-600 leading-relaxed">
          {tagline}
        </p>

        {/* Stats Strip */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl sm:text-3xl font-black text-brand-navy-950 block">10+</span>
            <span className="text-xs text-slate-500 font-semibold">
              {currentLang === 'ar' ? 'سنوات من الخبرة' : currentLang === 'tr' ? 'Yıllık Deneyim' : 'Years Experience'}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl sm:text-3xl font-black text-brand-amber-500 block">800+</span>
            <span className="text-xs text-slate-500 font-semibold">
              {currentLang === 'ar' ? 'طالب تمت خدمتهم' : currentLang === 'tr' ? 'Öğrenci Kabulü' : 'Students Enrolled'}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">+120</span>
            <span className="text-xs text-slate-500 font-semibold">
              {currentLang === 'ar' ? 'جامعة تركية معتمدة' : currentLang === 'tr' ? 'Anlaşmalı Üniversite' : 'Partner Universities'}
            </span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">%100</span>
            <span className="text-xs text-slate-500 font-semibold">
              {currentLang === 'ar' ? 'استشارات مجانية' : currentLang === 'tr' ? 'Ücretsiz Danışmanlık' : 'Free Guidance'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Narrative Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Paragraph 1 Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 start-0 w-2 h-full bg-brand-amber-500"></div>
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
            {p1}
          </p>
        </div>

        {/* Paragraph 2 Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 start-0 w-2 h-full bg-brand-navy-900"></div>
          <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
            {p2}
          </p>
        </div>

        {/* Paragraph 3 & 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-brand-navy-950 to-brand-navy-900 text-white rounded-3xl p-6 sm:p-8 shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-brand-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-amber-400 font-cairo">
              {currentLang === 'ar' ? 'معك في كل خطوة' : currentLang === 'tr' ? 'Her Adımda Yanınızda' : 'With You Every Step'}
            </h3>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              {p3}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 text-brand-navy-950 rounded-3xl p-6 sm:p-8 shadow-sm border border-brand-amber-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-amber-500 text-slate-950 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-brand-navy-950 font-cairo">
              {currentLang === 'ar' ? 'ثقة طلابنا هي دافعنا' : currentLang === 'tr' ? 'Öğrencilerimizin Güveni' : 'Our Students’ Trust'}
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
              {p4}
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block">
              {currentLang === 'ar' ? 'المزايا والقيم' : currentLang === 'tr' ? 'Avantajlarımız' : 'Our Strengths'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-brand-navy-950 font-cairo">
              {whyTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-brand-navy-950 font-cairo">
                      {feat.title}
                    </h3>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-brand-amber-600">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{currentLang === 'ar' ? 'ضمان رسمي موثق' : currentLang === 'tr' ? 'Resmî Yetki ve Destek' : 'Official Representation'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Closing Callout Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-brand-amber-500/30 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-brand-amber-500/20 text-brand-amber-400 flex items-center justify-center mx-auto border border-brand-amber-500/30">
            <Sparkles className="w-7 h-7" />
          </div>

          <h3 className="text-xl sm:text-3xl font-black font-cairo text-white max-w-3xl mx-auto leading-relaxed">
            {closingText}
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/apply"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-brand-amber-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <span>
                {currentLang === 'ar' ? 'ابدأ خطوتك الأولى مجاناً' : currentLang === 'tr' ? 'İlk Adımı Ücretsiz Atın' : 'Start Your First Step'}
              </span>
              <ArrowRight className="w-4 h-4 flip-in-rtl" />
            </Link>

            <a
              href={`https://wa.me/${settings.whatsapp_number || settings.contact_whatsapp || '905313971022'}?text=${encodeURIComponent(
                currentLang === 'ar'
                  ? settings.whatsapp_message_ar || 'مرحباً شركة المجد للخدمات الطلابية، أود استشارة حول الدراسة في تركيا'
                  : currentLang === 'tr'
                  ? settings.whatsapp_message_tr || 'Merhaba El-Mecd Öğrenci Hizmetleri, Türkiye’de eğitim için danışmanlık almak istiyorum'
                  : settings.whatsapp_message_en || 'Hello Al-Majd Student Services, I would like guidance on studying in Turkey'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{currentLang === 'ar' ? 'تحدث مع مستشارنا عبر واتساب' : currentLang === 'tr' ? 'WhatsApp ile Danışmanla Görüş' : 'Chat on WhatsApp'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonialsData?.data && testimonialsData.data.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block">
              {currentLang === 'ar' ? 'تجارب طلابنا' : currentLang === 'tr' ? 'Öğrenci Deneyimleri' : 'Student Stories'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy-950 font-cairo">
              {t('testimonials.title')}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">{t('testimonials.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.data.map((item) => (
              <TestimonialCard key={item.id} testimonial={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
