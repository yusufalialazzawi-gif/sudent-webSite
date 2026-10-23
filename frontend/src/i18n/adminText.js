import i18n from './config';
import dict1 from './adminDict1';
import dict2 from './adminDict2';

// Arabic source string -> { tr, en }
const DICT = new Map();
[...dict1, ...dict2].forEach(([ar, tr, en]) => DICT.set(ar, { tr, en }));

/**
 * Admin UI text helper. Source strings are written in Arabic in the JSX;
 * at runtime they are replaced by the Turkish / English equivalent.
 * Unknown strings fall back to the original text (never breaks the UI).
 * Components re-render on language change (via useLanguage), so this stays in sync.
 */
export function ta(ar) {
  const lang = i18n.language;
  if (lang === 'ar') return ar;
  const hit = DICT.get(ar);
  if (!hit) return ar;
  return lang === 'tr' ? hit.tr : hit.en;
}

export function tx(ar, tr, en) {
  const lang = i18n.language;
  if (lang === 'ar') return ar;
  if (lang === 'tr') return tr;
  return en;
}

export const adminDictionarySize = DICT.size;
