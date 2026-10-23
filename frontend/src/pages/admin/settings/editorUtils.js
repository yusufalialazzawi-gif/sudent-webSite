// Admin ayar editörlerinin ortak yardımcıları.

export const LANGS = [
  { code: 'ar', suffix: 'Ar', flag: '🇸🇦', label: 'Arapça' },
  { code: 'tr', suffix: 'Tr', flag: '🇹🇷', label: 'Türkçe' },
  { code: 'en', suffix: 'En', flag: '🇬🇧', label: 'İngilizce' },
];

export const INPUT = 'w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500 text-xs';
export const LABEL = 'block font-bold text-slate-700 mb-1 text-xs';
export const ROW_BOX = 'bg-white rounded-2xl border border-slate-200 p-4 space-y-3';

export function parseJson(raw, fallback = []) {
  if (Array.isArray(raw) || (raw && typeof raw === 'object')) return raw;
  if (!raw || String(raw).trim() === '') return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export const stringifyJson = (value) => JSON.stringify(value ?? []);

// Admin ayarları TR/AR/EN etiketli; aktif panele göre uygun etiketi göster.
export const fieldLabel = (field, currentLanguage) => {
  if (currentLanguage === 'ar') return field.labelAr || field.labelTr || field.labelEn || field.key;
  if (currentLanguage === 'en') return field.labelEn || field.labelTr || field.labelAr || field.key;
  return field.labelTr || field.labelEn || field.labelAr || field.key;
};
