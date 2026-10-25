import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { GraduationCap } from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';
import { api } from '../../services/api';
import UniversityAutoCarousel from '../common/UniversityAutoCarousel';
import PricingPolicyNotice from '../common/PricingPolicyNotice';
import ScrollReveal from '../common/ScrollReveal';
import { HomeSection, SectionHeading, CardSkeleton, pickLang } from './homeShared';
import {
  UNIVERSITIES_KICKER,
  UNIVERSITIES_TITLE,
  UNIVERSITIES_SUBTITLE,
  UNIVERSITIES_VIEW_ALL,
  UNI_FILTER_PILLS,
  GRADUATE_BADGE,
  GRADUATE_TITLE,
  GRADUATE_DESC,
  GRADUATE_CARDS,
  GRADUATE_CTA,
  GRADUATE_SECONDARY,
} from './homeDefaults';

// 4) ÖNE ÇIKAN ÜNİVERSİTELER — filtre sekmeleri + otomatik carousel + fiyat politikası notu.
// Bölüm başlıkları ve arka plan fotoğrafı admin panelinden gelir.
export function HomeUniversitiesPreview() {
  const { text, str, bool, num, currentLang } = useSiteText();
  const [filter, setFilter] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['home-universities', currentLang, filter],
    queryFn: () => {
      const params = { limit: 24, lang: currentLang };
      if (filter === 'PUBLIC') params.type = 'PUBLIC';
      if (filter === 'PRIVATE') params.type = 'PRIVATE';
      if (filter === 'GRADUATE') params.graduateAdmissionOpen = 'true';
      if (filter === 'OPEN') params.admissionStatus = 'OPEN';
      return api.getUniversities(params);
    },
  });

  return (
    <HomeSection bgKey="home_universities_bg">
      <ScrollReveal>
        <SectionHeading
          kicker={UNIVERSITIES_KICKER[currentLang]}
          title={text('home_universities_title', () => UNIVERSITIES_TITLE[currentLang])}
          subtitle={text('home_universities_subtitle', () => UNIVERSITIES_SUBTITLE[currentLang])}
          to="/universities"
          linkLabel={UNIVERSITIES_VIEW_ALL[currentLang]}
        />

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-8">
          {UNI_FILTER_PILLS.map((pill) => {
            const isActive = filter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setFilter(pill.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-navy-950 text-brand-amber-400 shadow-md shadow-brand-navy-950/20 scale-[1.02]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {pickLang({ ar: pill.labelAr, tr: pill.labelTr, en: pill.labelEn }, currentLang)}
              </button>
            );
          })}
        </div>
      </ScrollReveal>

      {isLoading ? (
        <CardSkeleton count={4} />
      ) : (
        <UniversityAutoCarousel
          universities={data?.data || []}
          autoplay={bool('carousel_autoplay', true)}
          interval={num('carousel_interval', 2500)}
        />
      )}

      <div className="mt-8">
        <PricingPolicyNotice />
      </div>
    </HomeSection>
  );
}

// 5) YÜKSEK LİSANS & DOKTORA VİTRİNİ — başlık/açıklama ve arka plan fotoğrafı admin'den.
export function HomeGraduateSpotlight() {
  const { text, str, currentLang } = useSiteText();
  const bg = str('home_graduate_bg', '');

  return (
    <HomeSection className="py-12 sm:py-16">
      <div className="relative rounded-[22px] bg-[#14171D] text-white p-6 sm:p-10 overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
        {bg && <img src={bg} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none" />}

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4 text-center lg:text-start flex flex-col items-center lg:items-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#E9B949] text-xs font-bold border border-white/10 mx-auto lg:mx-0">
              <GraduationCap className="w-4 h-4 text-[#E9B949] shrink-0" />
              <span>{GRADUATE_BADGE[currentLang]}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-cairo leading-tight text-center lg:text-start text-white">
              {text('home_graduate_title', () => GRADUATE_TITLE[currentLang])}
            </h2>

            <p className="text-[#9AA4B2] text-sm leading-relaxed max-w-2xl text-center lg:text-start">
              {text('home_graduate_desc', () => GRADUATE_DESC[currentLang])}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 w-full text-start">
              {GRADUATE_CARDS.map((card) => (
                <div key={card.title.tr} className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className={`font-bold text-sm ${card.color}`}>{card.title[currentLang]}</div>
                  <div className="text-[11px] text-slate-300 mt-1">{card.desc[currentLang]}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
            <Link
              to="/apply?degree=MASTER_WITH_THESIS"
              className="w-full min-h-[44px] py-3.5 px-6 rounded-[12px] bg-[#E8930C] hover:bg-[#d08309] text-white font-extrabold text-sm text-center transition-colors flex items-center justify-center gap-2"
            >
              <GraduationCap className="w-5 h-5" />
              <span>{GRADUATE_CTA[currentLang]}</span>
            </Link>

            <Link
              to="/services/admission-consulting"
              className="w-full min-h-[44px] py-3 px-6 rounded-[12px] bg-white/10 hover:bg-white/20 text-white font-bold text-sm text-center border border-white/15 transition-colors"
            >
              {GRADUATE_SECONDARY[currentLang]}
            </Link>
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
