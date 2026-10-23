const LANGS = ['ar', 'tr', 'en'];
const FALLBACK_ORDER = ['ar', 'en', 'tr'];

/**
 * Makes sure a newly created record always has ar/tr/en translation rows.
 * - Requires at least one language with a non-empty `requiredField`.
 * - Missing languages are copied from the best available one, so the public
 *   site never shows an empty page / raw slug in any language.
 *   (The admin can later replace the copied text with a real translation.)
 */
export function completeTranslations(translations, requiredField) {
  const list = Array.isArray(translations) ? translations : [];
  const byLang = {};
  for (const t of list) {
    if (t && LANGS.includes(t.lang) && String(t[requiredField] || '').trim()) {
      byLang[t.lang] = t;
    }
  }
  const source = FALLBACK_ORDER.map((l) => byLang[l]).find(Boolean);
  if (!source) {
    const err = new Error(`At least one translation with "${requiredField}" is required.`);
    err.statusCode = 400;
    throw err;
  }
  return LANGS.map((lang) => byLang[lang] || { ...source, lang });
}
