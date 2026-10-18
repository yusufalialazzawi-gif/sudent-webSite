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

  const phone = settings.contact_whatsapp || '905514678371';

  let defaultMsg =
    settings.whatsapp_message_ar ||
    'مرحباً Sora Education، أرغب بالاستفسار عن التسجيل في الجامعات التركية.';
  if (currentLang === 'tr') {
    defaultMsg =
      settings.whatsapp_message_tr ||
      'Merhaba Sora Education, Türkiye üniversiteleri başvurusu hakkında bilgi almak istiyorum.';
  } else if (currentLang === 'en') {
    defaultMsg =
      settings.whatsapp_message_en ||
      'Hello Sora Education, I would like to inquire about university admissions in Turkey.';
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
        className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-2xl animate-pulse-glow group border-2 border-white/80"
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white stroke-emerald-500 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold font-cairo hidden sm:inline-block">
          {currentLang === 'ar' ? 'تحدث معنا واتساب' : currentLang === 'tr' ? 'WhatsApp Destek' : 'WhatsApp Chat'}
        </span>
      </a>
    </div>
  );
}
