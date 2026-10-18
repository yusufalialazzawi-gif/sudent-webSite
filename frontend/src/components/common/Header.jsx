import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  Menu,
  X,
  Globe,
  ChevronDown,
  Phone,
  MessageCircle,
  Sparkles,
  BookOpen,
  Award,
  Layers,
  FileCheck,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function Header() {
  const { t } = useTranslation();
  const { currentLang, isRtl, changeLanguage, languages } = useLanguage();
  const { settings } = useTheme();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [uniDropdownOpen, setUniDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUniDropdownOpen(false);
    setLangDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: t('nav.home') },
    {
      label: t('nav.universities'),
      isDropdown: true,
      items: [
        { to: '/universities', label: t('nav.universities') },
        { to: '/universities?type=PUBLIC', label: t('nav.publicUniversities') },
        { to: '/universities?type=PRIVATE', label: t('nav.privateUniversities') },
      ],
    },
    { to: '/programs', label: t('nav.programs') },
    { to: '/services', label: t('nav.services') },
    { to: '/courses', label: t('nav.courses') },
    { to: '/scholarships', label: t('nav.scholarships') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-brand-navy-950 text-slate-300 text-xs py-2 px-4 border-b border-brand-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-brand-amber-500/20 text-brand-amber-400 px-2.5 py-0.5 rounded-full font-semibold text-[11px] border border-brand-amber-500/30">
              <Sparkles className="w-3 h-3 text-brand-amber-400 animate-pulse" />
              {currentLang === 'ar' ? 'قبولات 2026-2027 مفتوحة الآن بخصم 50%' : currentLang === 'tr' ? '2026-2027 Başvuruları %50 İndirimle Açık' : '2026-2027 Admissions Open with 50% Partner Waiver'}
            </span>
            <span className="hidden md:inline text-slate-400">
              {currentLang === 'ar' ? 'استشارة مجانية متكاملة لجميع الطلاب الدوليين' : currentLang === 'tr' ? 'Uluslararası öğrencilere ücretsiz danışmanlık' : 'Free end-to-end guidance for international scholars'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a
              href={`https://wa.me/${settings.contact_whatsapp || '905514678371'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono text-[11px]">+{settings.contact_whatsapp || '905514678371'}</span>
            </a>
            <span className="hidden sm:inline text-slate-600">|</span>
            <Link to="/admin/login" className="hover:text-white transition-colors text-[11px]">
              {t('nav.adminPortal')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3.5 border-b border-slate-200'
            : 'bg-white py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-navy-900 to-brand-navy-800 flex items-center justify-center text-white shadow-md border border-brand-amber-500/30 group-hover:shadow-glow transition-all">
              <GraduationCap className="w-6 h-6 text-brand-amber-500 group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-brand-navy-950 flex items-center gap-1 font-cairo">
                SORA <span className="text-brand-amber-500">EDUCATION</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium -mt-1 tracking-wider uppercase">
                {currentLang === 'ar' ? 'الدراسة في تركيا' : currentLang === 'tr' ? 'Türkiye’de Eğitim' : 'Study in Turkey'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link, idx) => {
              if (link.isDropdown) {
                return (
                  <div
                    key={idx}
                    className="relative"
                    onMouseEnter={() => setUniDropdownOpen(true)}
                    onMouseLeave={() => setUniDropdownOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        location.pathname.startsWith('/universities')
                          ? 'text-brand-amber-600 bg-brand-amber-50'
                          : 'text-slate-700 hover:text-brand-navy-900 hover:bg-slate-100'
                      }`}
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                    </button>

                    {uniDropdownOpen && (
                      <div className="absolute top-full start-0 w-56 pt-2 z-50">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-200 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                          {link.items.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.to}
                              className="block px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-brand-amber-600 hover:bg-brand-amber-50/50 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={idx}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-brand-amber-600 bg-brand-amber-50'
                      : 'text-slate-700 hover:text-brand-navy-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header CTAs & Language Switcher */}
          <div className="flex items-center gap-3">
            {/* Language Dropdown Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                aria-label="Language selector"
              >
                <Globe className="w-4 h-4 text-brand-navy-800" />
                <span className="uppercase">{currentLang}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute top-full end-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  {languages.map((lng) => (
                    <button
                      key={lng.code}
                      onClick={() => {
                        changeLanguage(lng.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-start flex items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors ${
                        currentLang === lng.code
                          ? 'bg-brand-amber-50 text-brand-amber-600 font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lng.flag}</span>
                        <span>{lng.label}</span>
                      </span>
                      {currentLang === lng.code && <span className="w-1.5 h-1.5 rounded-full bg-brand-amber-500"></span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Apply Now Primary CTA */}
            <Link
              to="/apply"
              className="hidden sm:inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-brand-amber-500/20 btn-hover-lift transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('nav.applyNow')}</span>
            </Link>

            {/* Mobile Menu Burger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-4 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, idx) => {
                if (link.isDropdown) {
                  return (
                    <div key={idx} className="py-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3">
                        {link.label}
                      </span>
                      <div className="mt-1 space-y-1 ps-2">
                        {link.items.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            to={sub.to}
                            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-brand-amber-50 hover:text-brand-amber-600"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={idx}
                    to={link.to}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-brand-amber-50 text-brand-amber-600 font-bold'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              <Link
                to="/apply"
                className="w-full flex items-center justify-center gap-2 bg-brand-amber-500 hover:bg-brand-amber-600 text-white font-bold text-sm py-3 rounded-xl shadow-md text-center"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('nav.applyNow')}</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
