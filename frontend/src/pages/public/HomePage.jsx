import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Calendar,
  Building,
  PhoneCall,
  Search,
  MessageCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import QuickSearch from '../../components/common/QuickSearch';
import UniversityCard from '../../components/common/UniversityCard';
import ProgramCard from '../../components/common/ProgramCard';
import ServiceCard from '../../components/common/ServiceCard';
import ScholarshipCard from '../../components/common/ScholarshipCard';
import BlogCard from '../../components/common/BlogCard';
import TestimonialCard from '../../components/common/TestimonialCard';
import FAQAccordion from '../../components/common/FAQAccordion';

export default function HomePage() {
  const { t } = useTranslation();
  const { currentLang, isRtl } = useLanguage();
  const { settings } = useTheme();

  // Queries for dynamic content
  const { data: unisData, isLoading: loadingUnis } = useQuery({
    queryKey: ['home-universities', currentLang],
    queryFn: () => api.getUniversities({ limit: 4, lang: currentLang, featured: 'true' }),
  });

  const { data: progsData, isLoading: loadingProgs } = useQuery({
    queryKey: ['home-programs', currentLang],
    queryFn: () => api.getPrograms({ limit: 4, lang: currentLang }),
  });

  const { data: servicesData } = useQuery({
    queryKey: ['home-services', currentLang],
    queryFn: () => api.getServices(currentLang),
  });

  const { data: scholarshipsData } = useQuery({
    queryKey: ['home-scholarships', currentLang],
    queryFn: () => api.getScholarships({ limit: 2, lang: currentLang }),
  });

  const { data: articlesData } = useQuery({
    queryKey: ['home-articles', currentLang],
    queryFn: () => api.getArticles({ limit: 3, lang: currentLang }),
  });

  const { data: testimonialsData } = useQuery({
    queryKey: ['home-testimonials'],
    queryFn: () => api.getTestimonials(),
  });

  const { data: faqsData } = useQuery({
    queryKey: ['home-faqs', currentLang],
    queryFn: () => api.getFaqs(null, currentLang),
  });

  const partnerLogos = [
    { name: 'Medipol University', logo: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80' },
    { name: 'Bahçeşehir University', logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80' },
    { name: 'Koç University', logo: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=150&auto=format&fit=crop&q=80' },
    { name: 'Sabancı University', logo: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80' },
    { name: 'Istanbul University', logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80' },
    { name: 'Altınbaş University', logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-navy-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Background Gradients & Accents */}
        <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-brand-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 end-0 w-[600px] h-[600px] bg-brand-navy-700/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left/Start Column: Value Proposition & Copy */}
            <div className="lg:col-span-7 space-y-6 text-start">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-brand-amber-400 text-xs sm:text-sm font-semibold shadow-inner">
                <Sparkles className="w-4 h-4 text-brand-amber-400" />
                <span>{t('hero.badge')}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-cairo tracking-tight leading-[1.15]">
                {currentLang === 'ar' ? (
                  <>
                    بوابتك الموثوقة للدراسة في <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber-400 to-brand-amber-500">أفضل الجامعات التركية</span>
                  </>
                ) : currentLang === 'tr' ? (
                  <>
                    Türkiye’nin En Prestijli Üniversitelerine <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber-400 to-brand-amber-500">Güvenli Başlangıç</span>
                  </>
                ) : (
                  <>
                    Your Trusted Gateway to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-amber-400 to-brand-amber-500">Premier Turkish Universities</span>
                  </>
                )}
              </h1>

              {/* Supporting Description */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                {t('hero.description')}
              </p>

              {/* Trust Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentLang === 'ar' ? 'قبول رسمي مضمون' : currentLang === 'tr' ? 'Garantili Resmi Kabul' : 'Guaranteed Official Letter'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentLang === 'ar' ? 'استشارات مجانية 100%' : currentLang === 'tr' ? '%100 Ücretsiz Danışmanlık' : '100% Free Consultation'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200 col-span-2 sm:col-span-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{currentLang === 'ar' ? 'خصومات حتى 75%' : currentLang === 'tr' ? '%75’e Varan Burs' : 'Up to 75% Scholarships'}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to="/apply"
                  className="bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-brand-amber-500/25 btn-hover-lift transition-all flex items-center gap-2"
                >
                  <span>{t('hero.ctaApply')}</span>
                  <ArrowRight className="w-5 h-5 flip-in-rtl" />
                </Link>

                <Link
                  to="/universities"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold text-base px-7 py-4 rounded-xl border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
                >
                  <BookOpen className="w-5 h-5 text-brand-amber-400" />
                  <span>{t('hero.ctaExplore')}</span>
                </Link>
              </div>
            </div>

            {/* Right/End Column: Interactive Quick Search Card */}
            <div className="lg:col-span-5">
              <QuickSearch />
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-24 relative z-20">
        <div className="bg-gradient-to-r from-brand-navy-900 via-brand-navy-800 to-brand-navy-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-brand-amber-500/30 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x ltr:sm:divide-x rtl:sm:divide-x-reverse divide-white/10">
            <div className="text-center pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-amber-400 font-cairo">1,450+</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">{t('stats.consultations')}</div>
            </div>
            <div className="text-center pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-cairo">290+</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">{t('stats.graduateAdmissions')}</div>
            </div>
            <div className="text-center pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-amber-400 font-cairo">50+</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">{t('stats.partnerUnis')}</div>
            </div>
            <div className="text-center pt-4 sm:pt-0">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-cairo">8+</div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium mt-1">{t('stats.experience')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED UNIVERSITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-brand-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
              {t('universities.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy-950 font-cairo">
              {t('universities.title')}
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              {t('universities.subtitle')}
            </p>
          </div>

          <Link
            to="/universities"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-amber-600 hover:text-brand-amber-700 transition-colors shrink-0"
          >
            <span>{currentLang === 'ar' ? 'عرض جميع الجامعات' : currentLang === 'tr' ? 'Tüm Üniversiteleri Gör' : 'View All Universities'}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>

        {loadingUnis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {unisData?.data?.map((uni) => (
              <UniversityCard key={uni.id} university={uni} />
            ))}
          </div>
        )}
      </section>

      {/* 4. PARTNER UNIVERSITIES CAROUSEL / LOGOS TICKER */}
      <section className="bg-slate-100/80 py-12 border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 text-center">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            {currentLang === 'ar' ? 'شراكات أكاديمية رسمية مع كبرى الجامعات التركية' : currentLang === 'tr' ? 'Resmi Anlaşmalı Türk Üniversiteleri' : 'Official Academic Partnerships With Leading Turkish Universities'}
          </span>
        </div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2 px-4 max-w-7xl mx-auto justify-center flex-wrap">
          {partnerLogos.map((item, idx) => (
            <div
              key={idx}
              className="bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3 shrink-0 hover:border-brand-amber-500/40 hover:shadow-md transition-all duration-300"
            >
              <img src={item.logo} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-xs font-bold text-slate-800">{item.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TOP PROGRAMS SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-brand-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
              {currentLang === 'ar' ? 'التخصصات الأكثر طلباً' : currentLang === 'tr' ? 'En Çok Tercih Edilen Bölümler' : 'Top In-Demand Majors'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy-950 font-cairo">
              {t('programs.title')}
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              {t('programs.subtitle')}
            </p>
          </div>

          <Link
            to="/programs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-amber-600 hover:text-brand-amber-700 transition-colors shrink-0"
          >
            <span>{currentLang === 'ar' ? 'تصفح كافة التخصصات' : currentLang === 'tr' ? 'Tüm Programları İncele' : 'Browse All Majors'}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>

        {loadingProgs ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {progsData?.data?.map((prog) => (
              <ProgramCard key={prog.id} program={prog} />
            ))}
          </div>
        )}
      </section>

      {/* 6. EDUCATIONAL SERVICES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
            {t('services.title')}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy-950 font-cairo">
            {currentLang === 'ar' ? 'خدمات طلابية متكاملة تضمن راحة بالك' : currentLang === 'tr' ? 'A’dan Z’ye Kapsamlı Öğrenci Hizmetleri' : 'Complete End-to-End Student Services'}
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            {t('services.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData?.data?.map((serv) => (
            <ServiceCard key={serv.id} service={serv} />
          ))}
        </div>
      </section>

      {/* 7. SCHOLARSHIPS HIGHLIGHT */}
      {scholarshipsData?.data && scholarshipsData.data.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 rounded-3xl p-8 sm:p-12 border border-brand-amber-500/30 text-white">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-brand-amber-400 font-bold text-xs uppercase tracking-wider block mb-1">
                  {t('scholarships.title')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-cairo text-white">
                  {currentLang === 'ar' ? 'فرص ومنح دراسية حصرية 2026 / 2027' : currentLang === 'tr' ? '2026 / 2027 Özel Burs Fırsatları' : '2026 / 2027 Exclusive Scholarships & Waivers'}
                </h2>
                <p className="text-slate-300 text-sm mt-1 max-w-xl">
                  {t('scholarships.subtitle')}
                </p>
              </div>

              <Link
                to="/scholarships"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-amber-400 hover:text-brand-amber-300 transition-colors shrink-0"
              >
                <span>{currentLang === 'ar' ? 'دليل المنح كاملاً' : currentLang === 'tr' ? 'Tüm Bursları İncele' : 'All Scholarships'}</span>
                <ArrowRight className="w-4 h-4 flip-in-rtl" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scholarshipsData.data.map((sch) => (
                <ScholarshipCard key={sch.id} scholarship={sch} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. STUDENT TESTIMONIALS */}
      {testimonialsData?.data && testimonialsData.data.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-brand-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
              {t('testimonials.title')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy-950 font-cairo">
              {t('testimonials.subtitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.data.map((item) => (
              <TestimonialCard key={item.id} testimonial={item} />
            ))}
          </div>
        </section>
      )}

      {/* 9. BLOG AND EDUCATIONAL GUIDES */}
      {articlesData?.data && articlesData.data.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-brand-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
                {t('blog.title')}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy-950 font-cairo">
                {currentLang === 'ar' ? 'أحدث المقالات ودليل المعيشة في تركيا' : currentLang === 'tr' ? 'Güncel Makaleler ve Türkiye Rehberi' : 'Latest Articles & Study Guides'}
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                {t('blog.subtitle')}
              </p>
            </div>

            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-amber-600 hover:text-brand-amber-700 transition-colors shrink-0"
            >
              <span>{currentLang === 'ar' ? 'زيارة المدونة' : currentLang === 'tr' ? 'Blogu Ziyaret Et' : 'Visit Blog'}</span>
              <ArrowRight className="w-4 h-4 flip-in-rtl" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articlesData.data.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* 10. FAQ SECTION */}
      {faqsData?.data && faqsData.data.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-brand-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
              {t('faq.title')}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy-950 font-cairo">
              {t('faq.subtitle')}
            </h2>
          </div>

          <FAQAccordion items={faqsData.data} />
        </section>
      )}

      {/* 11. BOTTOM REGISTRATION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-brand-amber-500 via-brand-amber-600 to-brand-amber-700 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black font-cairo tracking-tight">
              {currentLang === 'ar'
                ? 'جاهز لبدء رحلتك الجامعية في تركيا؟'
                : currentLang === 'tr'
                ? 'Türkiye’de Üniversite Yolculuğunuza Başlamaya Hazır mısınız?'
                : 'Ready to Start Your University Journey in Turkey?'}
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              {currentLang === 'ar'
                ? 'قدّم طلبك الآن وسيقوم مستشارك الأكاديمي المختص بالتواصل معك وتأمين قبولك الجامعي الرسمي بأعلى خصم متاح.'
                : currentLang === 'tr'
                ? 'Hemen başvurun, uzman eğitim danışmanımız sizinle iletişime geçip resmi kabulünüzü en yüksek burs oranıyla alsın.'
                : 'Submit your application today and an expert advisor will guide you through securing your official admission with maximum tuition waiver.'}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/apply"
                className="bg-brand-navy-950 hover:bg-brand-navy-900 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl btn-hover-lift transition-all"
              >
                {t('apply.submitApplication')}
              </Link>
              <a
                href={`https://wa.me/${settings.contact_whatsapp || '905514678371'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-bold text-base px-7 py-4 rounded-xl border border-white/30 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-emerald-300" />
                <span>{currentLang === 'ar' ? 'استشارة فورية واتساب' : currentLang === 'tr' ? 'Hızlı WhatsApp Destek' : 'Instant WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
