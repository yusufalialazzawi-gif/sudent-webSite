import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Sparkles,
  BookOpen,
  FileText,
  Users,
  Phone,
  Building2,
  GraduationCap,
  Award,
  HeartHandshake,
  Home,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';

const ITEM_ICONS = {
  home: Home,
  universities: Building2,
  'uni-private': Building2,
  'uni-public': Building2,
  programs: GraduationCap,
  scholarships: Award,
  services: HeartHandshake,
  courses: BookOpen,
  blog: FileText,
  about: Users,
  contact: Phone,
};

function getItemIcon(id, url) {
  if (id && ITEM_ICONS[id]) return ITEM_ICONS[id];
  if (url?.includes('courses')) return BookOpen;
  if (url?.includes('blog')) return FileText;
  if (url?.includes('about')) return Users;
  if (url?.includes('contact')) return Phone;
  if (url?.includes('universities')) return Building2;
  if (url?.includes('programs')) return GraduationCap;
  if (url?.includes('scholarships')) return Award;
  if (url?.includes('services')) return HeartHandshake;
  return Sparkles;
}

// Mobil menü çekmecesi: StudyFans 1:1 standartlarında modern ikonlu ve kart görünümlü menü
export default function NavbarMobile({ items, pathname, onNavigate }) {
  const { t } = useTranslation();
  const { text, bool, str, currentLang } = useSiteText();

  const isRtl = currentLang === 'ar';
  const ChevronIcon = isRtl ? ChevronLeft : ChevronRight;

  const rows = [];
  items.forEach((item) => {
    // If item has no url and only children (like "المزيد"), don't render empty header, render children directly or with separator
    if (item.url) {
      rows.push({
        key: item.id,
        id: item.id,
        label: item.label,
        url: item.url,
        highlight: item.highlight,
      });
    }
    (item.children || []).forEach((child) => {
      rows.push({
        key: `${item.id}-${child.id}`,
        id: child.id,
        label: child.label,
        url: child.url,
        nested: !!item.url, // only indent if parent had an actual link
        parentLabel: item.url ? null : item.label,
      });
    });
  });

  const whatsappNumber = str('whatsapp_number', '') || str('contact_whatsapp', '905313971022');
  const waApplyUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    currentLang === 'ar'
      ? 'مرحباً، أود التقديم للحصول على قبول جامعي في تركيا عبر شركة المجد للقبولات الجامعية.'
      : 'Merhaba, üniversite kayıt ve kabul işlemleri hakkında bilgi almak istiyorum.'
  )}`;

  return (
    <div className="lg:hidden border-t border-[#dee2e6] bg-white px-4 pt-3 pb-8 space-y-4 shadow-2xl animate-in slide-in-from-top-3 duration-200">
      <nav className="flex flex-col gap-1.5 pt-1">
        {rows.map((row) => {
          const isActive =
            row.url &&
            (pathname === row.url || (row.url !== '/' && pathname.startsWith(`${row.url}/`)));
          const IconComponent = getItemIcon(row.id, row.url);

          return (
            <Link
              key={row.key}
              to={row.url || '/'}
              onClick={onNavigate}
              className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition-all ${
                row.nested ? 'ms-3 bg-[#f8f9fa] border border-[#dee2e6]/50' : ''
              } ${
                isActive
                  ? 'bg-beer/10 text-beer font-bold shadow-xs border border-beer/30'
                  : row.highlight
                  ? 'text-beer bg-beer/5 font-bold border border-beer/20'
                  : 'text-main-color hover:bg-[#f7f5f2] font-semibold'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? 'bg-beer text-white'
                      : row.highlight
                      ? 'bg-beer/15 text-beer'
                      : 'bg-[#f7f5f2] text-metallic-blue'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </span>
                <span className="text-sm truncate">{row.label}</span>
              </div>

              <ChevronIcon className="w-4 h-4 text-[#707070] shrink-0 opacity-70" />
            </Link>
          );
        })}
      </nav>

      {/* Aksiyon Butonları (StudyFans 1:1) */}
      <div className="pt-3 border-t border-[#dee2e6] flex flex-col gap-2.5">
        <Link
          to="/apply"
          onClick={onNavigate}
          className="w-full flex items-center justify-center gap-2 bg-beer hover:bg-vivid-tangelo text-white font-bold text-sm py-3.5 rounded-xl shadow-sm text-center transition-colors active:scale-98"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>{currentLang === 'tr' ? 'Hemen Başvur' : currentLang === 'en' ? 'Register Now' : 'سجل الآن'}</span>
        </Link>

        <a
          href={waApplyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm py-3 rounded-xl text-center transition-colors shadow-xs"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>{currentLang === 'tr' ? 'WhatsApp Danışmanı' : currentLang === 'en' ? 'WhatsApp Advisor' : 'تواصل عبر واتساب'}</span>
        </a>

        <Link
          to="/universities"
          onClick={onNavigate}
          className="w-full flex items-center justify-center gap-2 border border-[#dee2e6] hover:border-beer text-main-color hover:text-beer font-bold text-sm py-2.5 rounded-xl text-center transition-colors bg-[#f8f9fa]"
        >
          <span>{currentLang === 'tr' ? 'Üniversitenizi Bulun' : currentLang === 'en' ? 'Find University' : 'ابحث عن جامعتك'}</span>
        </Link>
      </div>
    </div>
  );
}
