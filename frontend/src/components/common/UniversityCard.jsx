import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const FALLBACK_COVER = '/uploads/universities/istanbul-universitesi.webp';

const READ_MORE = {
  ar: 'اقرأ المزيد',
  tr: 'Daha Fazla',
  en: 'Read More',
};

const CURRENCY_SIGN = { USD: '$', EUR: '€', TRY: '₺' };

export function resolveUniversityPricing(university) {
  let annual = null;
  let discounted = null;
  let currency = '$';

  (university.programs || []).forEach((program) => {
    if (program.annualTuition && (annual === null || program.annualTuition < annual)) {
      annual = program.annualTuition;
    }
    if (program.discountedTuition && (discounted === null || program.discountedTuition < discounted)) {
      discounted = program.discountedTuition;
    }
    if (program.currency) {
      currency = CURRENCY_SIGN[program.currency] || program.currency;
    }
  });

  if (annual === null) return { annual: null, discounted: null, currency };
  return { annual, discounted: discounted ?? annual, currency };
}

export function resolveUniversityName(university, currentLang) {
  const translation =
    university.translations?.find((tr) => tr.lang === currentLang) ||
    university.translations?.find((tr) => tr.lang === 'ar') ||
    university.translations?.[0] ||
    {};
  return translation.name || university.slug;
}

export default function UniversityCard({ university }) {
  const { currentLang } = useLanguage();

  const name = resolveUniversityName(university, currentLang);
  const { annual, discounted, currency } = resolveUniversityPricing(university);
  const hasDiscount = annual !== null && discounted < annual;

  return (
    <Link
      to={`/universities/${university.slug}`}
      className="bg-white rounded-lg flex flex-col transition-transform duration-300 hover:-translate-y-[10px] drop-shadow-xl"
    >
      <figure className="flex flex-col border-b border-[#dee2e6]">
        <div className="flex relative w-full h-[240px] sm:h-[190px] md:h-[210px] xl:h-[250px] rounded-t-lg">
          <img
            src={university.coverImageUrl || FALLBACK_COVER}
            alt={name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover rounded-t-lg brightness-95"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_COVER;
            }}
          />
        </div>
        <figcaption>
          <h2 className="text-metallic-blue font-bold text-xl p-4 capitalize">{name}</h2>
        </figcaption>
      </figure>

      <div className="flex justify-between items-center p-4">
        <div className="flex gap-2">
          {hasDiscount && (
            <span className="line-through text-gray-500 text-lg font-bold">
              {annual.toLocaleString('en-US')}
              {currency}
            </span>
          )}
          {annual !== null && (
            <span className="text-lg font-bold">
              {discounted.toLocaleString('en-US')}
              {currency}
            </span>
          )}
        </div>

        <span className="py-[6px] px-4 text-base font-normal bg-beer hover:bg-vivid-tangelo rounded-lg text-white transition-colors">
          {READ_MORE[currentLang] || READ_MORE.ar}
        </span>
      </div>
    </Link>
  );
}
