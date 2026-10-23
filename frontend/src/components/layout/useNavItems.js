import { useMemo } from 'react';
import useSiteText from '../../hooks/useSiteText';
import { FALLBACK_NAV_ITEMS, LANG_LABEL_KEY } from './navDefaults';

// Admin panelindeki "Üst Menü" ayarını aktif dile çevirip render'a hazır hale getirir.
export function useNavItems() {
  const { json, currentLang } = useSiteText();

  return useMemo(() => {
    const raw = json('nav_items', FALLBACK_NAV_ITEMS);
    const items = Array.isArray(raw) && raw.length > 0 ? raw : FALLBACK_NAV_ITEMS;
    const labelKey = LANG_LABEL_KEY[currentLang] || 'labelAr';

    const localize = (item) => ({
      id: item.id || item.url || item.labelTr || Math.random().toString(36).slice(2),
      label: (item[labelKey] || item.labelTr || item.labelEn || item.labelAr || '').trim(),
      url: item.url || '',
      highlight: Boolean(item.highlight),
    });

    return items
      .filter((item) => item.enabled !== false)
      .map((item) => {
        const base = localize(item);
        const children = Array.isArray(item.children)
          ? item.children.filter((child) => child.enabled !== false).map(localize)
          : [];
        return { ...base, children };
      })
      .filter((item) => item.label);
  }, [json, currentLang]);
}

export default useNavItems;
