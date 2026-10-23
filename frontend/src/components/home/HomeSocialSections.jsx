import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';
import { api } from '../../services/api';
import BlogCard from '../common/BlogCard';
import TestimonialsAutoCarousel from '../common/TestimonialsAutoCarousel';
import FAQAccordion from '../common/FAQAccordion';
import SectionCardCarousel from '../common/SectionCardCarousel';
import ScrollReveal from '../common/ScrollReveal';
import { HomeSection, SectionHeading } from './homeShared';
import { BLOG_VIEW_ALL, CTA_WHATSAPP, CTA_TITLE, CTA_DESC } from './homeDefaults';

// 10) ÖĞRENCİ YORUMLARI
export function HomeTestimonials() {
  const { t } = useTranslation();
  const { text, bool, num } = useSiteText();

  const { data } = useQuery({
    queryKey: ['home-testimonials'],
    queryFn: () => api.getTestimonials(),
  });

  if (!data?.data || data.data.length === 0) return null;

  return (
    <HomeSection>
      <ScrollReveal>
        <TestimonialsAutoCarousel
          testimonials={data.data}
          autoplay={bool('carousel_autoplay', true)}
          interval={num('carousel_interval', 2500)}
          subtitle={text('home_testimonials_title', () => t('testimonials.title'))}
          title={t('testimonials.subtitle')}
        />
      </ScrollReveal>
    </HomeSection>
  );
}

// 11) BLOG / REHBER MAKALELER
export function HomeBlogPreview() {
  const { t } = useTranslation();
  const { text, currentLang } = useSiteText();

  const { data } = useQuery({
    queryKey: ['home-articles', currentLang],
    queryFn: () => api.getArticles({ limit: 6, lang: currentLang }),
  });

  if (!data?.data || data.data.length === 0) return null;

  return (
    <HomeSection>
      <ScrollReveal>
        <SectionHeading
          kicker={t('blog.title')}
          title={text('home_blog_title', () => t('blog.title'))}
          subtitle={t('blog.subtitle')}
          to="/blog"
          linkLabel={BLOG_VIEW_ALL[currentLang]}
        />
      </ScrollReveal>

      <SectionCardCarousel
        items={data.data}
        renderItem={(article) => <BlogCard article={article} />}
        desktopItems={3}
        tabletItems={2}
        mobileItems={1}
        interval={3200}
      />
    </HomeSection>
  );
}

// 12) SIK SORULAN SORULAR
export function HomeFaqSection() {
  const { t } = useTranslation();
  const { currentLang } = useSiteText();

  const { data } = useQuery({
    queryKey: ['home-faqs', currentLang],
    queryFn: () => api.getFaqs(null, currentLang),
  });

  if (!data?.data || data.data.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <ScrollReveal>
        <SectionHeading center kicker={t('faq.title')} title={t('faq.subtitle')} />
        <FAQAccordion items={data.data} />
      </ScrollReveal>
    </section>
  );
}

// 13) ALT BAŞVURU ÇAĞRISI — başlık, açıklama ve arka plan fotoğrafı admin panelinden.
export function HomeBottomCta() {
  const { t } = useTranslation();
  const { text, str, currentLang } = useSiteText();
  const bg = str('home_cta_bg', '');
  const whatsapp = str('contact_whatsapp', '') || str('whatsapp_number', '') || '905313971022';

  return (
    <HomeSection>
      <ScrollReveal yOffset={40}>
        <div className="bg-gradient-to-r from-brand-amber-500 via-brand-amber-600 to-brand-amber-700 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          {bg && <img src={bg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-20" />}

          <div className="max-w-2xl mx-auto space-y-5 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black font-cairo tracking-tight">
              {text('home_cta_title', () => CTA_TITLE[currentLang])}
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              {text('home_cta_desc', () => CTA_DESC[currentLang])}
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/apply"
                className="bg-brand-navy-950 hover:bg-brand-navy-900 text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl btn-hover-lift transition-all"
              >
                {t('apply.submitApplication')}
              </Link>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/20 hover:bg-white/30 text-white font-bold text-base px-7 py-4 rounded-xl border border-white/30 backdrop-blur-md transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-5 h-5 text-emerald-300" />
                <span>{CTA_WHATSAPP[currentLang]}</span>
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </HomeSection>
  );
}
