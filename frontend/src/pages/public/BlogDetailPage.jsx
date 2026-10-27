import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, User, ArrowRight, Share2, Tag, BookOpen, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import BlogCard from '../../components/common/BlogCard';
import SfBreadcrumb from '../../components/common/SfBreadcrumb';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { settings } = useTheme();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['article', slug, currentLang],
    queryFn: () => api.getArticleBySlug(slug, currentLang),
  });

  if (isLoading) {
    return (
      <div className="sf-container mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-44 bg-[#f7f5f2] rounded-2xl border border-[#dee2e6]"></div>
        <div className="h-96 bg-[#f7f5f2] rounded-2xl border border-[#dee2e6]"></div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-main-color font-cairo">
          {currentLang === 'ar' ? 'لم يتم العثور على المقال' : currentLang === 'tr' ? 'Makale bulunamadı' : 'Article not found'}
        </h2>
        <Link to="/blog" className="inline-block px-5 py-2.5 bg-beer text-white rounded-xl text-xs font-bold">
          {currentLang === 'ar' ? 'العودة للمدونة' : currentLang === 'tr' ? 'Bloga Geri Dön' : 'Back to Blog'}
        </Link>
      </div>
    );
  }

  const article = data.data;
  const related = data.related || [];

  const translation =
    article.translations?.find((tr) => tr.lang === currentLang) ||
    article.translations?.find((tr) => tr.lang === 'ar') ||
    article.translations?.[0] ||
    {};

  const title = translation.title || article.slug;
  const content = translation.content || '';

  const breadcrumbItems = [
    { label: currentLang === 'ar' ? 'الرئيسية' : currentLang === 'tr' ? 'Ana Sayfa' : 'Home', to: '/' },
    { label: currentLang === 'ar' ? 'المدونة' : currentLang === 'tr' ? 'Blog' : 'Blog', to: '/blog' },
    { label: title },
  ];

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16">
      {/* StudyFans Breadcrumb Strip */}
      <SfBreadcrumb items={breadcrumbItems} title={title} />

      <article className="sf-container mx-auto px-4 max-w-4xl space-y-8">
        {/* Article Header Card */}
        <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 sm:p-8 drop-shadow-sm space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ff9015]/10 text-beer border border-[#ff9015]/20">
              {article.category || (currentLang === 'ar' ? 'دليل دراسي' : 'Eğitim Rehberi')}
            </span>
            <span className="text-xs text-text-color flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-beer" />
              <span>{article.readTimeMinutes || 4} {t('blog.minRead')}</span>
            </span>
            <span className="text-xs text-text-color flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-beer" />
              <span>{new Date(article.publishedAt || Date.now()).toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'tr-TR')}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-cairo text-main-color leading-tight">
            {title}
          </h1>

          <div className="flex items-center justify-between border-t border-[#dee2e6] pt-4 text-xs text-text-color">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#0a2240] text-white flex items-center justify-center font-bold text-sm">
                {article.authorName?.[0] || 'M'}
              </div>
              <div>
                <span className="font-bold text-main-color block">{article.authorName || (currentLang === 'ar' ? 'فريق تحرير المجد' : 'El-Mecd Editör Ekibi')}</span>
                <span className="text-[11px] text-text-color">{currentLang === 'ar' ? 'مستشار تعليمي وباحث أكاديمي' : 'Eğitim ve Üniversite Danışmanı'}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${settings.whatsapp_number || settings.contact_whatsapp || '905313971022'}?text=${encodeURIComponent(
                `مرحباً، أود استشارة بخصوص مقال: ${title}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{currentLang === 'ar' ? 'استفسار عبر واتساب' : 'WhatsApp ile Sor'}</span>
            </a>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden drop-shadow-sm border border-[#dee2e6] bg-[#f7f5f2]">
          <img
            src={article.featuredImageUrl || 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&auto=format&fit=crop&q=80'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-2xl border border-[#dee2e6] p-6 sm:p-10 drop-shadow-sm text-text-color leading-relaxed text-sm sm:text-base whitespace-pre-line font-normal space-y-4">
          {content}
        </div>

        {/* Advisor CTA in Article */}
        <div className="bg-[#f7f5f2] rounded-2xl border border-[#dee2e6] p-6 sm:p-8 drop-shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-start">
            <h4 className="font-bold text-base text-main-color font-cairo">
              {currentLang === 'ar' ? 'هل لديك أسئلة حول شروط القبول والتسجيل؟' : currentLang === 'tr' ? 'Kabul ve kayıt şartları hakkında sorunuz mu var?' : 'Questions about admission?'}
            </h4>
            <p className="text-xs text-text-color">
              {currentLang === 'ar' ? 'مستشارونا جاهزون لتقديم المشورة الأكاديمية المجانية فوراً.' : 'Danışmanlarımız ücretsiz rehberlik için hazır.'}
            </p>
          </div>
          <Link
            to="/apply"
            className="px-6 py-3 rounded-xl bg-beer hover:bg-[#e07b09] text-white font-bold text-xs shrink-0 shadow-sm transition-all flex items-center gap-2"
          >
            <span>{currentLang === 'ar' ? 'قدم طلبك مجاناً' : currentLang === 'tr' ? 'Ücretsiz Başvur' : 'Apply Free'}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </Link>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="pt-6 space-y-6">
            <div className="text-start space-y-1">
              <span className="text-xs font-bold text-beer uppercase tracking-wider block">
                {currentLang === 'ar' ? 'مقالات ذات صلة' : currentLang === 'tr' ? 'İlgili Makaleler' : 'Related Articles'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-main-color font-cairo">
                {t('blog.relatedArticles')}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((a) => (
                <BlogCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
