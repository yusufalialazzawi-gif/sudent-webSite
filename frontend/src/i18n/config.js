import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ar from './locales/ar.json';
import tr from './locales/tr.json';
import en from './locales/en.json';

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('sora_preferred_lang') : null;
const initialLang = savedLang && ['ar', 'tr', 'en'].includes(savedLang) ? savedLang : 'ar';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      tr: { translation: tr },
      en: { translation: en },
    },
    lng: initialLang,
    fallbackLng: 'ar',
    supportedLngs: ['ar', 'tr', 'en'],
    interpolation: {
      escapeValue: false,
    },
  });

// Synchronize document direction and lang on language change
const updateDocumentAttributes = (lang) => {
  const isRtl = lang === 'ar';
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
};

updateDocumentAttributes(i18n.language || 'ar');

i18n.on('languageChanged', (lng) => {
  updateDocumentAttributes(lng);
});

export default i18n;
