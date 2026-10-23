import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Sparkles, X } from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';
import useNavItems from './useNavItems';
import SiteBrand from './SiteBrand';
import TopBar from './TopBar';
import NavbarDesktop from './NavbarDesktop';
import NavbarMobile from './NavbarMobile';
import LanguageSwitcher from './LanguageSwitcher';

// Site header'ı: üst duyuru çubuğu + marka + menü + dil seçici + başvuru butonu.
// Menü içeriği, logo ve butonlar admin panelindeki ayarlardan gelir.
export default function Header() {
  const { t } = useTranslation();
  const { text, bool, str } = useSiteText();
  const navItems = useNavItems();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sticky = bool('nav_sticky', true);
  const showLang = bool('nav_show_lang_switcher', true);
  const showCta = bool('nav_show_cta', true);
  const ctaUrl = str('nav_cta_url', '/apply');
  const ctaLabel = text('nav_cta_label', () => t('nav.applyNow'));

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <TopBar />

      <header
        className={`${sticky ? 'sticky top-0' : 'relative'} z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3.5 border-b border-slate-200'
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <SiteBrand />

          <NavbarDesktop items={navItems} pathname={location.pathname} />

          <div className="flex items-center gap-3">
            {showLang && <LanguageSwitcher />}

            {showCta && (
              <Link
                to={ctaUrl}
                className="hidden sm:inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-brand-amber-500/20 btn-hover-lift transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>{ctaLabel}</span>
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <NavbarMobile items={navItems} pathname={location.pathname} onNavigate={() => setMobileMenuOpen(false)} />
        )}
      </header>
    </>
  );
}
