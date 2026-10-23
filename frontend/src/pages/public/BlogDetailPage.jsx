import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Clock, User, ArrowRight, Share2, Tag } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import BlogCard from '../../components/common/BlogCard';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['article', slug, currentLang],
    queryFn: () => api.getArticleBySlug(slug, currentLang),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-64 bg-slate-200 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 font-cairo">
          {currentLang === 'ar' ? 'لم يتم العثور على المقال' : currentLang === 'tr' ? 'Makale bulunamadı' : 'Article not found'}
        </h2>
        <Link to="/blog" className="inline-block px-5 py-2.5 bg-brand-amber-500 text-white rounded-xl text-xs font-bold">
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

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-10">
      {/* Article Header */}
      <div className="space-y-4 text-start">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-amber-100 text-brand-amber-800">
            {article.category}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTimeMinutes} {t('blog.minRead')}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-cairo text-brand-navy-950 leading-tight">
          {title}
        </h1>

        <div className="flex items-center justify-between border-y border-slate-200 py-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-brand-navy-900 text-white flex items-center justify-center font-bold">
              {article.authorName?.[0] || 'S'}
            </div>
            <div>
              <span className="font-bold text-slate-900 block">{article.authorName}</span>
              <span className="text-[11px] text-slate-400">{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
        <img
          src={article.featuredImageUrl || 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200&auto=format&fit=crop&q=80'}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-slate-700 leading-relaxed text-base sm:text-lg whitespace-pre-line font-normal">
        {content}
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="pt-10 border-t border-slate-200 space-y-6">
          <h3 className="text-xl font-bold text-brand-navy-950 font-cairo">
            {t('blog.relatedArticles')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((a) => (
              <BlogCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
