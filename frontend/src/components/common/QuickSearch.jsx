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
    'مرحباً شركة المجد للقبولات الجامعية، أود الاستفسار عن القبولات والجامعات المتاحة في تركيا.'
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
      const msg = `مرحباً شركة المجد للقبولات الجامعية، أود معرفة الجامعات التركية المعتمدة والمعترف بها في دولة (${country}).`;
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
      className={`transition-all duration-150 ${
        isEmbedded
          ? 'bg-white p-4 sm:p-5 border border-slate-200 rounded-[20px] shadow-sm'
          : 'bg-[#0F2E59] p-3.5 sm:p-5 rounded-[22px] border border-blue-400/25 shadow-[0_10px_30px_rgba(0,0,0,0.45)] text-white w-full'
      }`}
    >
      {/* (a) "تواصل عبر واتساب اب" — #22C55E dolgu, beyaz metin, WhatsApp ikonu */}
      <div className="mb-2.5 sm:mb-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full min-h-[48px] flex items-center justify-center gap-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white font-bold text-sm sm:text-base py-3 px-4 rounded-[12px] shadow-[0_8px_24px_rgba(34,197,94,0.35)] transition-colors active:scale-[0.99]"
        >
          {/* Authentic WhatsApp SVG Icon */}
          <svg className="w-5 h-5 fill-white shrink-0" viewBox="0 0 24 24">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
          </svg>
          <span className="font-cairo">تواصل عبر واتساب اب</span>
        </a>
      </div>

      <form onSubmit={handleDirectSearch} className="space-y-2.5 sm:space-y-3">
        {/* (b) Dropdown: "ابحث عن مدينة" — #EEF2F7 dolgu, koyu metin, konum ikonu */}
        <div className="relative">
          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="w-full min-h-[48px] px-4 py-3 bg-[#EEF2F7] hover:bg-white text-[#0B0F16] rounded-[12px] font-bold font-cairo text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#E8930C] cursor-pointer pe-10 transition-colors"
          >
            <option value="">ابحث عن مدينة</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                مدينة {c}
              </option>
            ))}
          </select>
          <MapPin className="w-5 h-5 absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        </div>

        {/* (c) Dropdown: "ابحث عن الجامعات المتاح التقديم عليها" — #EEF2F7 dolgu, koyu metin, belge ikonu */}
        <div className="relative">
          <select
            value={selectedUniSlug}
            onChange={handleUniChange}
            className="w-full min-h-[48px] px-4 py-3 bg-[#EEF2F7] hover:bg-white text-[#0B0F16] rounded-[12px] font-bold font-cairo text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#E8930C] cursor-pointer pe-10 transition-colors"
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
          <Building2 className="w-5 h-5 absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
        </div>

        {/* (d) Action Button: "بحث مباشر في الجامعات" — #E8930C dolgu, beyaz metin, arama ikonu */}
        <div className="pt-0.5">
          <button
            type="submit"
            className="w-full min-h-[48px] bg-[#E8930C] hover:bg-[#d08309] text-white font-black font-cairo py-3 px-6 rounded-[12px] flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>بحث مباشر في الجامعات</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl shrink-0" />
          </button>
        </div>
      </form>
    </div>
  );
}
