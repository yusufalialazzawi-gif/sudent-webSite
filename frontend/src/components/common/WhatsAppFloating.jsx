import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function WhatsAppFloating() {
  const { currentLang, isRtl } = useLanguage();
  const { settings } = useTheme();

  if (settings.whatsapp_enabled === 'false') {
    return null;
  }

  const phone = settings.contact_whatsapp || settings.whatsapp_number || '905313971022';

  let defaultMsg =
    settings.whatsapp_message_ar ||
    'مرحباً مؤسسة المجد للقبولات الجامعية، أود الاستفسار عن القبولات والمنح في الجامعات التركية.';
  if (currentLang === 'tr') {
    defaultMsg =
      settings.whatsapp_message_tr ||
      'Merhaba El-Mecd Üniversite Kabulleri, Türkiye üniversiteleri başvurusu ve burslar hakkında bilgi almak istiyorum.';
  } else if (currentLang === 'en') {
    defaultMsg =
      settings.whatsapp_message_en ||
      'Hello Al-Majd University Admissions, I would like to inquire about university placements and scholarships in Turkey.';
  }

  const encodedMsg = encodeURIComponent(defaultMsg);
  const waUrl = `https://wa.me/${phone}?text=${encodedMsg}`;

  // In RTL, place floating icon comfortably at inline-end
  return (
    <div className="fixed bottom-6 z-40 transition-transform duration-300 hover:scale-105 ltr:right-6 rtl:left-6">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white px-4 py-3 rounded-full shadow-[0_8px_24px_rgba(34,197,94,0.35)] min-h-[44px] transition-colors group border-2 border-white/90"
        aria-label="Contact us on WhatsApp"
      >
        <svg className="w-6 h-6 fill-white group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.78 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.12.11-1.8-.11-.42-.14-.96-.32-1.66-.62-2.93-1.27-4.85-4.25-5-4.45-.14-.2-1.2-1.6-1.2-3.05 0-1.45.76-2.16 1.03-2.46.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.69.52.25.6.86 2.11.94 2.26.08.15.13.33.03.53-.1.2-.15.33-.3.51-.15.18-.32.4-.46.54-.15.15-.31.31-.13.62.18.31.79 1.3 1.7 2.11 1.17 1.04 2.15 1.36 2.46 1.51.31.15.49.13.67-.08.18-.21.78-.91.99-1.22.21-.31.42-.26.7-.15.28.11 1.79.84 2.1 1 .31.15.51.23.59.36.08.13.08.75-.16 1.43z" />
        </svg>
        <span className="text-xs font-black font-cairo hidden sm:inline-block">
          {currentLang === 'ar' ? 'تحدث معنا واتساب' : currentLang === 'tr' ? 'WhatsApp Destek' : 'WhatsApp Chat'}
        </span>
      </a>
    </div>
  );
}
