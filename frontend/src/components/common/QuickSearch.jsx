import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, GraduationCap, Globe, Building2, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

export default function QuickSearch({ initialValues = {}, onSearch = null, isEmbedded = false }) {
  const { t } = useTranslation();
  const { currentLang, isRtl } = useLanguage();
  const navigate = useNavigate();

  const [searchOptions, setSearchOptions] = useState({
    cities: ['Istanbul', 'Ankara', 'Izmir', 'Antalya'],
    categories: [],
    degrees: [],
    studyLanguages: [],
  });

  const [keyword, setKeyword] = useState(initialValues.search || '');
  const [city, setCity] = useState(initialValues.city || '');
  const [degreeLevel, setDegreeLevel] = useState(initialValues.degreeLevel || '');
  const [studyLanguage, setStudyLanguage] = useState(initialValues.studyLanguage || '');
  const [type, setType] = useState(initialValues.type || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.getSearchOptions();
        if (res.success && res.data) {
          setSearchOptions(res.data);
        }
      } catch (err) {
        console.warn('Could not load search options:', err.message);
      }
    };
    fetchOptions();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (keyword) queryParams.set('search', keyword);
    if (city) queryParams.set('city', city);
    if (degreeLevel) queryParams.set('degreeLevel', degreeLevel);
    if (studyLanguage) queryParams.set('language', studyLanguage);
    if (type) queryParams.set('type', type);

    if (onSearch) {
      onSearch({ search: keyword, city, degreeLevel, language: studyLanguage, type });
    } else {
      navigate(`/universities?${queryParams.toString()}`);
    }
  };

  const handleReset = () => {
    setKeyword('');
    setCity('');
    setDegreeLevel('');
    setStudyLanguage('');
    setType('');
    if (onSearch) {
      onSearch({});
    } else {
      navigate('/universities');
    }
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-300 ${
        isEmbedded
          ? 'bg-white p-5 border border-slate-200 shadow-sm'
          : 'bg-brand-navy-900/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border-2 border-brand-amber-500/40 text-white'
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className={`font-bold font-cairo flex items-center gap-2 ${isEmbedded ? 'text-slate-900 text-lg' : 'text-white text-xl'}`}>
          <SlidersHorizontal className="w-5 h-5 text-brand-amber-500" />
          <span>{t('search.title')}</span>
        </h3>
        {(keyword || city || degreeLevel || studyLanguage || type) && (
          <button
            onClick={handleReset}
            className={`text-xs font-semibold hover:underline ${isEmbedded ? 'text-slate-500' : 'text-slate-400 hover:text-white'}`}
          >
            {t('search.clearBtn')}
          </button>
        )}
      </div>

      <form onSubmit={handleSearchSubmit} className="space-y-4">
        {/* Keyword Search Input */}
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder={t('search.keywordPlaceholder')}
            className={`w-full px-4 py-3.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-amber-500 pe-11 ${
              isEmbedded
                ? 'bg-slate-50 border border-slate-200 text-slate-900'
                : 'bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:bg-white/15'
            }`}
          />
          <Search className="w-5 h-5 absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        {/* 4 Multi-Select Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Degree Level */}
          <div className="space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider block ${isEmbedded ? 'text-slate-500' : 'text-slate-300'}`}>
              {t('search.degree')}
            </label>
            <div className="relative">
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-brand-amber-500 pe-8 cursor-pointer ${
                  isEmbedded
                    ? 'bg-slate-50 border border-slate-200 text-slate-800'
                    : 'bg-white/10 border border-white/20 text-white focus:bg-brand-navy-950 [&>option]:bg-brand-navy-900 [&>option]:text-white'
                }`}
              >
                <option value="">{t('search.allDegrees')}</option>
                {searchOptions.degrees?.map((d) => (
                  <option key={d.value} value={d.value}>
                    {currentLang === 'tr' ? d.labelTr : currentLang === 'en' ? d.labelEn : d.labelAr}
                  </option>
                ))}
              </select>
              <GraduationCap className="w-4 h-4 absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Study Language */}
          <div className="space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider block ${isEmbedded ? 'text-slate-500' : 'text-slate-300'}`}>
              {t('search.language')}
            </label>
            <div className="relative">
              <select
                value={studyLanguage}
                onChange={(e) => setStudyLanguage(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-brand-amber-500 pe-8 cursor-pointer ${
                  isEmbedded
                    ? 'bg-slate-50 border border-slate-200 text-slate-800'
                    : 'bg-white/10 border border-white/20 text-white focus:bg-brand-navy-950 [&>option]:bg-brand-navy-900 [&>option]:text-white'
                }`}
              >
                <option value="">{t('search.allLanguages')}</option>
                <option value="ENGLISH">{currentLang === 'ar' ? 'اللغة الإنجليزية' : currentLang === 'tr' ? 'İngilizce' : 'English'}</option>
                <option value="TURKISH">{currentLang === 'ar' ? 'اللغة التركية' : currentLang === 'tr' ? 'Türkçe' : 'Turkish'}</option>
                <option value="MIXED">{currentLang === 'ar' ? 'مختلط (30% إنجليزي)' : currentLang === 'tr' ? 'Karma (%30 İngilizce)' : 'Mixed (30% English)'}</option>
              </select>
              <Globe className="w-4 h-4 absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* City */}
          <div className="space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider block ${isEmbedded ? 'text-slate-500' : 'text-slate-300'}`}>
              {t('search.city')}
            </label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-brand-amber-500 pe-8 cursor-pointer ${
                  isEmbedded
                    ? 'bg-slate-50 border border-slate-200 text-slate-800'
                    : 'bg-white/10 border border-white/20 text-white focus:bg-brand-navy-950 [&>option]:bg-brand-navy-900 [&>option]:text-white'
                }`}
              >
                <option value="">{t('search.allCities')}</option>
                {searchOptions.cities?.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <MapPin className="w-4 h-4 absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* University Type (Public / Private) */}
          <div className="space-y-1">
            <label className={`text-[11px] font-bold uppercase tracking-wider block ${isEmbedded ? 'text-slate-500' : 'text-slate-300'}`}>
              {t('search.type')}
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-brand-amber-500 pe-8 cursor-pointer ${
                  isEmbedded
                    ? 'bg-slate-50 border border-slate-200 text-slate-800'
                    : 'bg-white/10 border border-white/20 text-white focus:bg-brand-navy-950 [&>option]:bg-brand-navy-900 [&>option]:text-white'
                }`}
              >
                <option value="">{t('search.allTypes')}</option>
                <option value="PRIVATE">{t('universities.private')}</option>
                <option value="PUBLIC">{t('universities.public')}</option>
              </select>
              <Building2 className="w-4 h-4 absolute end-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Submit Search Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-brand-amber-500/25 flex items-center justify-center gap-2 btn-hover-lift transition-all"
          >
            <Search className="w-4 h-4" />
            <span>{t('search.searchBtn')}</span>
            <ArrowRight className="w-4 h-4 flip-in-rtl" />
          </button>
        </div>
      </form>
    </div>
  );
}
