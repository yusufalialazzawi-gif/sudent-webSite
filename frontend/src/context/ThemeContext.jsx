import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ThemeContext = createContext(null);

const SETTINGS_CACHE_KEY = 'site_public_settings_v1';

const readCachedSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY)) || {};
  } catch {
    return {};
  }
};

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => ({
    site_name: 'المجد للقبولات الجامعية | الدراسة في تركيا',
    contact_phone: '+90 531 397 10 22',
    contact_whatsapp: '905313971022',
    whatsapp_number: '905313971022',
    contact_email: 'info@almajed-edu.com',
    whatsapp_enabled: 'true',
    whatsapp_position: 'bottom-right',
    theme_primary_color: '#1a367c', // Al-Majd Royal Navy Blue
    theme_accent_color: '#c89d3c',  // Al-Majd Metallic Gold
    ...readCachedSettings(),
  }));
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getPublicSettings();
        if (res.success && res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
          try {
            localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(res.data));
          } catch {
            /* storage unavailable/full: ignore */
          }
        }
      } catch (err) {
        console.warn('Could not load dynamic settings from backend, using default branding:', err.message);
      } finally {
        setSettingsLoaded(true);
      }
    };
    fetchSettings();
  }, []);

  return (
    <ThemeContext.Provider value={{ settings, settingsLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
