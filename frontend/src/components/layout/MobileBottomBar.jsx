import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, MessageCircle, Sparkles, Phone, Building2 } from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';

export default function MobileBottomBar() {
  const { str, currentLang } = useSiteText();
  const location = useLocation();

  // Don't show in admin routes
  if (location.pathname.startsWith('/admin')) return null;

  const whatsapp = str('whatsapp_number', '') || str('contact_whatsapp', '905313971022');
  const phone = str('contact_phone', '+90 531 397 10 22');

  const waUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    'مرحباً، أود الاستفسار عن القبولات والجامعات المتاحة في تركيا.'
  )}`;

  return (
    <nav
      aria-label="Mobile quick actions"
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden flex items-center justify-around"
    >
      {/* 1. Universities / Search */}
      <Link
        to="/universities"
        className="flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-[#ff9015] transition-colors"
      >
        <Building2 className="w-5 h-5 text-[#0a2240]" />
        <span className="text-[10px] font-bold font-cairo">
          {currentLang === 'tr' ? 'Üniversiteler' : currentLang === 'en' ? 'Universities' : 'الجامعات'}
        </span>
      </Link>

      {/* 2. Direct WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-[#25d366] transition-colors relative"
      >
        <span className="relative">
          <MessageCircle className="w-5 h-5 text-[#25d366]" />
          <span className="absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full bg-[#25d366] animate-ping" />
        </span>
        <span className="text-[10px] font-bold font-cairo">
          واتساب
        </span>
      </a>

      {/* 3. Center Highlight: Apply Now */}
      <Link
        to="/apply"
        className="flex items-center gap-1.5 bg-[#ff9015] hover:bg-[#f36c25] text-white px-4 py-2 rounded-full font-bold text-xs shadow-md transition-all active:scale-95"
      >
        <Sparkles className="w-3.5 h-3.5 text-white" />
        <span className="font-cairo">
          {currentLang === 'tr' ? 'Kayıt Ol' : currentLang === 'en' ? 'Apply' : 'سجل الآن'}
        </span>
      </Link>

      {/* 4. Direct Call */}
      <a
        href={`tel:${phone.replace(/\s+/g, '')}`}
        className="flex flex-col items-center justify-center gap-1 text-slate-700 hover:text-[#002d74] transition-colors"
      >
        <Phone className="w-5 h-5 text-[#0a2240]" />
        <span className="text-[10px] font-bold font-cairo">
          {currentLang === 'tr' ? 'Arayın' : currentLang === 'en' ? 'Call' : 'اتصل بنا'}
        </span>
      </a>
    </nav>
  );
}
