import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
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
    <article className="bg-white rounded-lg border border-[#dee2e6] overflow-hidden drop-shadow-md hover:drop-shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative h-48 bg-[#f7f5f2] overflow-hidden">
        <img
          src={
            article.featuredImageUrl ||
            '/uploads/universities/bilkent-university.webp'
          }
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/uploads/universities/bilkent-university.webp';
          }}
        />
        {article.category && (
          <div className="absolute top-3 start-3">
            <span className="px-3 py-1 rounded-md text-xs font-bold bg-beer text-white shadow-sm">
              {article.category}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-[#707070] mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-beer" />
              <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#707070]" />
              <span>{article.readTimeMinutes || 4} {t('blog.minRead')}</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-main-color font-cairo mb-2 group-hover:text-beer transition-colors line-clamp-2">
            {title}
          </h3>

          <p className="text-[#4a4a4a] text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </div>

        <div className="pt-3 border-t border-[#dee2e6] flex items-center justify-between">
          <span className="text-xs text-[#707070] font-medium truncate max-w-[150px]">
            {article.authorName || (currentLang === 'ar' ? 'فريق التحرير' : 'Editör')}
          </span>

          <Link
            to={`/blog/${article.slug}`}
            className="text-xs sm:text-sm font-bold text-beer hover:text-vivid-tangelo flex items-center gap-1.5 transition-colors"
          >
            <span>{t('blog.readMore')}</span>
            <ArrowRight className="w-3.5 h-3.5 flip-in-rtl" />
          </Link>
        </div>
      </div>
    </article>
  );
}
