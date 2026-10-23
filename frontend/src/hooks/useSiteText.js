import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

// Admin panelinden gelen site ayarlarını okumak için ortak yardımcı.
// Her fonksiyon: ayar boşsa verilen yedek değere döner (site hiçbir zaman boş kalmaz).
export function useSiteText() {
  const { currentLang } = useLanguage();
  const { settings, settingsLoaded } = useTheme();

  const text = (key, fallback) => {
    const value = settings?.[`${key}_${currentLang}`];
    if (value && String(value).trim() !== '') return value;
    return typeof fallback === 'function' ? fallback(currentLang) : fallback;
  };

  const bool = (key, fallback = true) => {
    const raw = settings?.[key];
    if (raw === undefined || raw === null || raw === '') return fallback;
    return raw === true || raw === 'true' || raw === '1';
  };

  const num = (key, fallback) => {
    const value = Number(settings?.[key]);
    return Number.isFinite(value) && String(settings?.[key] ?? '').trim() !== '' ? value : fallback;
  };

  const json = (key, fallback) => {
    const raw = settings?.[key];
    if (!raw) return fallback;
    if (Array.isArray(raw) || typeof raw === 'object') return raw;
    try {
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  };

  const str = (key, fallback = '') => {
    const value = settings?.[key];
    return value === undefined || value === null || value === '' ? fallback : value;
  };

  return { text, bool, num, json, str, settings, settingsLoaded, currentLang };
}

export default useSiteText;
