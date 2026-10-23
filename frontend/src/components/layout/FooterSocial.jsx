import React from 'react';
import { SOCIAL_CHANNELS, SOCIAL_HEADING } from './footerDefaults';
import useSiteText from '../../hooks/useSiteText';

// Footer sosyal medya ikonları. Hangi platformların görüneceği admin ayarlarından gelir.
export default function FooterSocial() {
  const { str, currentLang } = useSiteText();
  const whatsapp = str('contact_whatsapp', '905313971022');

  const channels = SOCIAL_CHANNELS.filter((c) => str(c.key, '').trim() !== '');
  if (channels.length === 0 && !whatsapp) return null;

  return (
    <div className="pt-3">
      <span className="text-[11px] font-bold text-slate-400 block mb-2 font-cairo">
        {SOCIAL_HEADING[currentLang] || SOCIAL_HEADING.tr}
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {channels.map((c) => (
          <a
            key={c.key}
            href={str(c.key)}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-8 h-8 rounded-lg bg-white/10 ${c.hover} hover:text-white text-slate-300 flex items-center justify-center transition-all text-xs`}
            title={c.title}
            aria-label={c.title}
          >
            {c.icon}
          </a>
        ))}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white flex items-center justify-center transition-all text-xs"
            title="WhatsApp"
            aria-label="WhatsApp"
          >
            💬
          </a>
        )}
      </div>
    </div>
  );
}
