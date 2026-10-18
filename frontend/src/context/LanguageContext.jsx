import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'ar');
  const isRtl = currentLang === 'ar';

  useEffect(() => {
    const handleLangChange = (lng) => {
      setCurrentLang(lng);
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    };

    handleLangChange(i18n.language || 'ar');
    i18n.on('languageChanged', handleLangChange);

    return () => {
      i18n.off('languageChanged', handleLangChange);
    };
  }, [i18n]);

  const changeLanguage = (lang) => {
    if (['ar', 'tr', 'en'].includes(lang)) {
      i18n.changeLanguage(lang);
      localStorage.setItem('sora_preferred_lang', lang);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        currentLanguage: currentLang,
        isRtl,
        changeLanguage,
        languages: [
          { code: 'ar', label: 'العربية', dir: 'rtl', flag: '🇸🇦' },
          { code: 'tr', label: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
          { code: 'en', label: 'English', dir: 'ltr', flag: '🇬🇧' },
        ],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
