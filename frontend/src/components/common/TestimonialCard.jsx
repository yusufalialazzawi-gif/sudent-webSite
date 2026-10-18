import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function TestimonialCard({ testimonial }) {
  const { currentLang } = useLanguage();

  const quote =
    currentLang === 'tr'
      ? testimonial.quoteTr
      : currentLang === 'en'
      ? testimonial.quoteEn
      : testimonial.quoteAr;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group hover:-translate-y-1">
      <Quote className="w-10 h-10 text-brand-amber-500/15 absolute top-5 end-5 group-hover:scale-110 transition-transform" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4 text-brand-amber-500">
          {[...Array(testimonial.rating || 5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-brand-amber-500" />
          ))}
        </div>

        {/* Written Review */}
        <p className="text-slate-700 text-sm leading-relaxed mb-6 italic relative z-10 font-medium">
          "{quote}"
        </p>
      </div>

      {/* Student Profile Info */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100">
        <img
          src={
            testimonial.avatarUrl ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          }
          alt={testimonial.studentName}
          className="w-12 h-12 rounded-full object-cover border-2 border-brand-amber-500/30"
          loading="lazy"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-brand-navy-950 font-cairo truncate">
              {testimonial.studentName}
            </h4>
            {testimonial.verified && (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Verified Admission" />
            )}
          </div>

          <p className="text-xs text-brand-amber-600 font-semibold truncate">
            {testimonial.program}
          </p>

          <p className="text-[11px] text-slate-400 truncate">
            {testimonial.university} ({testimonial.nationality})
          </p>
        </div>
      </div>
    </div>
  );
}
