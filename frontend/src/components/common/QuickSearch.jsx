import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Building2, Globe, Search, ArrowRight, MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

const ARAB_COUNTRIES = [
  'العراق',
  'مصر',
  'الأردن',
  'سوريا',
  'اليمن',
  'السعودية',
  'فلسطين',
  'الكويت',
  'قطر',
  'الإمارات',
  'ليبيا',
  'السودان',
  'الجزائر',
  'المغرب',
  'تونس',
  'لبنان',
  'سلطنة عمان',
  'البحرين',
];

export default function QuickSearch({ initialValues = {}, onSearch = null, isEmbedded = false }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const navigate = useNavigate();

  const [cities, setCities] = useState([
    'Istanbul',
    'Ankara',
    'Izmir',
    'Antalya',
    'Bursa',
    'Sakarya',
    'Trabzon',
    'Konya',
    'Eskişehir',
    'Gaziantep',
  ]);
  const [universities, setUniversities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(initialValues.city || '');
  const [selectedUniSlug, setSelectedUniSlug] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  const whatsappNumber = '905313971022';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    'مرحباً شركة المجد للخدمات الطلابية، أود الاستفسار عن القبولات والجامعات المتاحة في تركيا.'
  )}`;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [optRes, uniRes] = await Promise.all([
          api.getSearchOptions(),
          api.getUniversities({ limit: 80, lang: currentLang }),
        ]);

        if (optRes?.success && optRes?.data?.cities?.length) {
          setCities(optRes.data.cities);
        }
        if (uniRes?.success && uniRes?.data) {
          setUniversities(uniRes.data);
        }
      } catch (err) {
        console.warn('Could not load search options:', err.message);
      }
    };
    loadData();
  }, [currentLang]);

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    if (city) {
      if (onSearch) {
        onSearch({ city });
      } else {
        navigate(`/universities?city=${encodeURIComponent(city)}`);
      }
    }
  };

  const handleUniChange = (e) => {
    const slug = e.target.value;
    setSelectedUniSlug(slug);
    if (slug) {
      navigate(`/universities/${slug}`);
    }
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    if (country) {
      const msg = `مرحباً شركة المجد للخدمات الطلابية، أود معرفة الجامعات التركية المعتمدة والمعترف بها في دولة (${country}).`;
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  };

  const handleDirectSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (selectedCity) query.set('city', selectedCity);
    navigate(`/universities?${query.toString()}`);
  };

  return (
    <div
      className={`rounded-3xl transition-all duration-300 ${
        isEmbedded
          ? 'bg-white p-5 border border-slate-200 shadow-sm'
          : 'bg-[#182a4d]/95 backdrop-blur-xl p-5 sm:p-7 rounded-3xl shadow-2xl border-2 border-brand-amber-500/40 text-white'
      }`}
    >
      {/* Top Green WhatsApp Direct Button */}
      <div className="mb-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
        >
          {/* Authentic WhatsApp SVG Icon */}
          <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
          </svg>
          <span className="font-cairo">تواصل عبر الواتس اب</span>
        </a>
      </div>

      <form onSubmit={handleDirectSearch} className="space-y-3.5">
        {/* 1. Dropdown: ابحث عن مدينة */}
        <div className="relative">
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="w-full px-4 py-3.5 bg-slate-100 hover:bg-white text-slate-900 rounded-xl font-bold font-cairo text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-amber-500 shadow-sm cursor-pointer pe-10 transition-colors"
          >
            <option value="">ابحث عن مدينة</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                مدينة {c}
              </option>
            ))}
          </select>
          <MapPin className="w-5 h-5 absolute end-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        </div>

        {/* 2. Dropdown: ابحث عن الجامعات المتاح التقديم عليها */}
        <div className="relative">
          <select
            value={selectedUniSlug}
            onChange={handleUniChange}
            className="w-full px-4 py-3.5 bg-slate-100 hover:bg-white text-slate-900 rounded-xl font-bold font-cairo text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-amber-500 shadow-sm cursor-pointer pe-10 transition-colors"
          >
            <option value="">ابحث عن الجامعات المتاح التقديم عليها</option>
            {universities.map((u) => {
              const uName =
                u.translations?.find((tr) => tr.lang === currentLang)?.name ||
                u.translations?.find((tr) => tr.lang === 'ar')?.name ||
                u.name ||
                u.slug;
              return (
                <option key={u.id || u.slug} value={u.slug}>
                  {uName} {u.type === 'PUBLIC' ? '(حكومية)' : '(خاصة)'}
                </option>
              );
            })}
          </select>
          <Building2 className="w-5 h-5 absolute end-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        </div>

        {/* 3. Dropdown: اختار دولة الاعتراف */}
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="w-full px-4 py-3.5 bg-slate-100 hover:bg-white text-slate-900 rounded-xl font-bold font-cairo text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-brand-amber-500 shadow-sm cursor-pointer pe-10 transition-colors"
          >
            <option value="">اختار دولة الاعتراف</option>
            {ARAB_COUNTRIES.map((country) => (
              <option key={country} value={country}>
                الاعتراف في: {country} 🇹🇷 🏛️
              </option>
            ))}
          </select>
          <Globe className="w-5 h-5 absolute end-3 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        </div>

        {/* Action Button: بحث مباشر */}
        <div className="pt-1">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white font-black font-cairo py-3.5 px-6 rounded-xl shadow-lg shadow-brand-amber-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <Search className="w-4 h-4" />
            <span>بحث مباشر في الجامعات</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </button>
        </div>
      </form>
    </div>
  );
}
