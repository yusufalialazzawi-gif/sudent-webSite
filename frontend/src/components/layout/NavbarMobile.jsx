import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles } from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';

// Mobil menü çekmecesi: ana öğeler + alt menüler düz liste, CTA butonu dahil.
export default function NavbarMobile({ items, pathname, onNavigate }) {
  const { t } = useTranslation();
  const { text, bool, str } = useSiteText();

  const showCta = bool('nav_show_cta', true);
  const ctaUrl = str('nav_cta_url', '/apply');
  const ctaLabel = text('nav_cta_label', () => t('nav.applyNow'));

  const rows = [];
  items.forEach((item) => {
    rows.push({ key: item.id, label: item.label, url: item.url, highlight: item.highlight });
    (item.children || []).forEach((child) => {
      rows.push({ key: `${item.id}-${child.id}`, label: child.label, url: child.url, nested: true });
    });
  });

  return (
    <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
      <div className="flex flex-col space-y-1">
        {rows.map((row) => {
          const isActive = row.url && (pathname === row.url || (row.url !== '/' && pathname.startsWith(`${row.url}/`)));
          return (
            <Link
              key={row.key}
              to={row.url || '/'}
              onClick={onNavigate}
              className={`block rounded-lg text-sm font-semibold transition-colors ${row.nested ? 'ps-7 py-2 text-[13px]' : 'px-3 py-2.5'} ${
                isActive
                  ? 'bg-brand-amber-50 text-brand-amber-600 font-bold'
                  : row.highlight
                  ? 'text-brand-amber-700 bg-brand-amber-500/10'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              {row.label}
            </Link>
          );
        })}
      </div>

      {showCta && (
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
          <Link
            to={ctaUrl}
            onClick={onNavigate}
            className="w-full flex items-center justify-center gap-2 bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-sm py-3 rounded-xl shadow-md text-center"
          >
            <Sparkles className="w-4 h-4" />
            <span>{ctaLabel}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
