import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import { DEFAULT_FOOTER_COLUMNS } from './footerDefaults';
import useSiteText from '../../hooks/useSiteText';

const pick = (obj, lang, keys) => obj?.[keys[lang]] || obj?.[keys.tr] || obj?.[keys.en] || '';

const LABEL_KEY = { ar: 'labelAr', tr: 'labelTr', en: 'labelEn' };
const TITLE_KEY = { ar: 'titleAr', tr: 'titleTr', en: 'titleEn' };

// Footer link kolonları (üniversiteler / hizmetler vb.) — admin panelinden yönetilir.
export default function FooterLinkColumns() {
  const { json, currentLang } = useSiteText();
  const columns = json('footer_link_columns', DEFAULT_FOOTER_COLUMNS);

  if (!Array.isArray(columns) || columns.length === 0) return null;

  return (
    <>
      {columns.map((col) => {
        const links = Array.isArray(col.links) ? col.links.filter((l) => l && l.url) : [];
        if (links.length === 0) return null;

        return (
          <div key={col.id || pick(col, currentLang, TITLE_KEY)}>
            <h4 className="text-white font-bold text-base mb-4 font-cairo flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-amber-500" />
              <span>{pick(col, currentLang, TITLE_KEY)}</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              {links.map((link, idx) => (
                <li key={`${link.url}-${idx}`}>
                  <Link
                    to={link.url}
                    className="text-slate-400 hover:text-brand-amber-400 transition-colors"
                  >
                    {pick(link, currentLang, LABEL_KEY) || link.url}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}
