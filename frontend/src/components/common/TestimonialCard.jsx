import React from 'react';
import { Star, Quote, CheckCircle2, Building2, GraduationCap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function TestimonialCard({ testimonial }) {
  const { currentLang } = useLanguage();

  const quote =
    currentLang === 'tr'
      ? testimonial.quoteTr || testimonial.quote
      : currentLang === 'en'
      ? testimonial.quoteEn || testimonial.quote
      : testimonial.quoteAr || testimonial.quote || testimonial.quoteTr;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative group overflow-hidden">
      {/* Decorative Background Quote Watermark */}
      <Quote className="w-16 h-16 text-[#ff9015]/10 absolute top-4 end-4 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />

      <div>
        {/* Top Row: Stars + Verified Badge */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-1 text-[#ff9015]">
            {[...Array(testimonial.rating || 5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#ff9015]" />
            ))}
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-cairo">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>قبول موثق 100%</span>
          </span>
        </div>

        {/* University & Program Tags if available */}
        {(testimonial.university || testimonial.program) && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3.5 relative z-10">
            {testimonial.university && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-[#002d74] text-xs font-bold font-cairo">
                <Building2 className="w-3 h-3 text-[#ff9015]" />
                <span>{testimonial.university}</span>
              </span>
            )}
            {testimonial.program && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 text-[#ff6b00] text-xs font-bold font-cairo">
                <GraduationCap className="w-3 h-3 text-[#ff6b00]" />
                <span>{testimonial.program}</span>
              </span>
            )}
          </div>
        )}

        {/* Written Review */}
        <p className="text-slate-700 text-sm leading-relaxed mb-6 font-cairo font-medium relative z-10">
          "{quote}"
        </p>
      </div>

      {/* Student Profile Info */}
      <div className="flex items-center gap-3.5 pt-4 border-t border-slate-100 relative z-10">
        <div className="relative">
          <img
            src={
              testimonial.avatarUrl ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            }
            alt={testimonial.studentName}
            className="w-12 h-12 rounded-full object-cover border-2 border-[#ff9015]/40 shadow-xs group-hover:border-[#ff9015] transition-colors"
            loading="lazy"
          />
          <div className="absolute -bottom-1 -end-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0 text-start">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-extrabold text-[#0a2240] font-cairo truncate">
              {testimonial.studentName}
            </h4>
          </div>

          <p className="text-xs text-slate-500 font-bold font-cairo truncate">
            {testimonial.nationality || 'طالب دولي'}
          </p>
        </div>

        {testimonial.year && (
          <div className="text-end">
            <span className="text-[11px] text-slate-400 font-cairo block">
              {testimonial.year}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

