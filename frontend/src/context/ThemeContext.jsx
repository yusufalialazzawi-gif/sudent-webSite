import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'المجد للقبولات الجامعية | الدراسة في تركيا',
    contact_phone: '+90 538 096 4646',
    contact_whatsapp: '905380964646',
    contact_email: 'info@almajed-edu.com',
    whatsapp_enabled: 'true',
    whatsapp_position: 'bottom-right',
    theme_primary_color: '#1a367c', // Al-Majd Royal Navy Blue
    theme_accent_color: '#c89d3c',  // Al-Majd Metallic Gold
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
