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

// Site header'ı: StudyFans 1:1 yapısı
// Mobilde: Sadece Turuncu Hamburger Menü Butonu [ ≡ ] + Temiz Marka Logosu
// Masaüstünde: Marka + Masaüstü Menü + [ابحث عن جامعتك] + [سجل الآن]
export default function Header() {
  const { t } = useTranslation();
  const { text, bool, str, currentLang } = useSiteText();
  const navItems = useNavItems();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sticky = bool('nav_sticky', true);

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
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 sm:py-3 border-b border-slate-200'
            : 'bg-white py-3 sm:py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4" dir="ltr">
          
          {/* Mobil Görünüm: Sol tarafta StudyFans Stili Büyük Turuncu Hamburger Butonu [ ≡ ] */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-12 h-12 rounded-xl bg-[#ff7900] hover:bg-[#e66c00] active:scale-95 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-7 h-7 text-white stroke-[2.5]" />
              ) : (
                <Menu className="w-7 h-7 text-white stroke-[2.5]" />
              )}
            </button>
          </div>

          {/* Marka Logosu (Masaüstü ve Mobil) */}
          <div className="flex items-center" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            <SiteBrand />
          </div>

          {/* Masaüstü Navigasyon Menüsü */}
          <div className="hidden lg:flex items-center flex-1 justify-center px-4" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
            <NavbarDesktop items={navItems} pathname={location.pathname} />
          </div>

          {/* Masaüstü Aksiyon Butonları (StudyFans 1:1) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/universities"
              className="hidden xl:inline-flex items-center justify-center border border-slate-300 hover:border-[#ff7900] text-[#0a2240] hover:text-[#ff7900] font-bold font-cairo text-sm px-4 py-2.5 rounded-xl transition-colors min-h-[42px]"
            >
              <span>{currentLang === 'tr' ? 'Üniversitenizi Bulun' : currentLang === 'en' ? 'Find University' : 'ابحث عن جامعتك'}</span>
            </Link>

            <Link
              to="/apply"
              className="inline-flex items-center justify-center gap-2 bg-[#ff7900] hover:bg-[#e66c00] text-white font-bold font-cairo text-sm px-6 py-2.5 rounded-xl shadow-md min-h-[42px] transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{currentLang === 'tr' ? 'Hemen Başvur' : currentLang === 'en' ? 'Register Now' : 'سجل الآن'}</span>
            </Link>
          </div>

        </div>

        {/* Mobil Menü Çekmecesi */}
        {mobileMenuOpen && (
          <NavbarMobile items={navItems} pathname={location.pathname} onNavigate={() => setMobileMenuOpen(false)} />
        )}
      </header>
    </>
  );
}
