import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function BlogCard({ article }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const translation =
    article.translations?.find((tr) => tr.lang === currentLang) ||
    article.translations?.find((tr) => tr.lang === 'ar') ||
    article.translations?.[0] ||
    {};

  const title = translation.title || article.slug;
  const excerpt = translation.excerpt || '';

  return (
    <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <img
          src={
            article.featuredImageUrl ||
            'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&auto=format&fit=crop&q=80'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 start-3">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-navy-950/80 backdrop-blur-md text-white border border-white/20">
            {article.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-brand-amber-500" />
              <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.readTimeMinutes} {t('blog.minRead')}</span>
            </span>
          </div>

          <h3 className="text-base font-bold text-brand-navy-950 font-cairo mb-2 group-hover:text-brand-amber-600 transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
            {excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
            {article.authorName}
          </span>

          <Link
            to={`/blog/${article.slug}`}
            className="text-xs font-bold text-brand-amber-600 hover:text-brand-amber-700 flex items-center gap-1 transition-colors"
          >
            <span>{t('blog.readMore')}</span>
            <ArrowRight className="w-3.5 h-3.5 flip-in-rtl" />
          </Link>
        </div>
      </div>
    </article>
  );
}
