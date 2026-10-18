import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'Sora Education | الدراسة في تركيا',
    contact_phone: '+90 551 467 8371',
    contact_whatsapp: '905514678371',
    contact_email: 'info@soraedu-tr.com',
    whatsapp_enabled: 'true',
    whatsapp_position: 'bottom-right',
    theme_primary_color: '#0f172a',
    theme_accent_color: '#f37721',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getPublicSettings();
        if (res.success && res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.warn('Could not load dynamic settings from backend, using default branding:', err.message);
      }
    };
    fetchSettings();
  }, []);

  return (
    <ThemeContext.Provider value={{ settings }}>
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
