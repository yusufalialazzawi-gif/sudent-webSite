import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';

// Üst duyuru çubuğu: rozet metni, açıklama, WhatsApp ve admin bağlantısı — hepsi admin ayarından.
export default function TopBar() {
  const { t } = useTranslation();
  const { text, bool, str } = useSiteText();

  if (!bool('nav_show_topbar', true)) return null;

  const whatsapp = str('whatsapp_number', '') || str('contact_whatsapp', '905313971022');
  const showPhone = bool('nav_show_phone', true);
  const showAdmin = bool('nav_show_admin_link', true);
  const note = text('nav_topbar_note', '');

  return (
    <div className="bg-brand-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-brand-navy-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* En üstteki duyuru yazısı kaldırıldı */}
        </div>

        <div className="flex items-center gap-4 text-slate-400 shrink-0">
          {showPhone && (
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px]">+{whatsapp}</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
