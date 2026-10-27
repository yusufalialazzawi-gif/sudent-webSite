import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowUp,
  ShieldCheck,
} from 'lucide-react';
import useSiteText from '../../hooks/useSiteText';
import SiteBrand from './SiteBrand';
import FooterLinkColumns from './FooterLinkColumns';
import FooterSocial from './FooterSocial';

// Site footer'ı: marka, admin'in yönettiği link kolonları, iletişim ve telif satırı.
export default function Footer() {
  const { t } = useTranslation();
  const { text, str, bool, currentLang } = useSiteText();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const address = text('contact_address', () =>
    currentLang === 'tr'
      ? 'Fevzipaşa Cad. No:42, Fatih, İstanbul, Türkiye'
      : currentLang === 'en'
      ? 'Fevzipasa St. No:42, Fatih, Istanbul, Turkey'
      : 'إسطنبول، الفاتح، شارع فوزي باشا رقم 42، تركيا'
  );
  const phone = str('contact_phone', '+90 531 397 10 22');
  const whatsapp = str('contact_whatsapp', '905313971022');
  const email = str('contact_email', 'info@almajed-edu.com');
  const hours = text('footer_hours', () =>
    currentLang === 'tr' ? 'Pazartesi - Cumartesi: 09:00 - 18:00' : currentLang === 'en' ? 'Mon - Sat: 09:00 - 18:00' : 'الإثنين - السبت: 09:00 - 18:00'
  );
  const accreditation = text('footer_accreditation_note', () =>
    currentLang === 'tr' ? 'MEB ve YÖK Yetkili Danışmanlık' : currentLang === 'en' ? 'Officially Licensed & Accredited in Turkey' : 'اعتماد وترخيص رسمي من وزارة التعليم التركية'
  );
  const copyright = text('footer_copyright', () => t('footer.rights'));
  const description = text('footer_description', () => t('footer.description'));
  const showSocial = bool('footer_show_social', true);

  return (
    <footer className="bg-[#0a2240] text-white pt-12 pb-8 border-t border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Studyfans Top Brand & Dual Action Buttons */}
        <div className="pb-10 border-b border-white/10 flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-start">
          <div className="max-w-xl">
            <SiteBrand variant="on-dark" compact />
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-3 font-cairo">
              {description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              to="/apply"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-7 rounded-xl bg-[#ff9015] hover:bg-[#f36c25] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors text-center"
            >
              <span>{currentLang === 'tr' ? 'Hemen Kayıt Ol' : currentLang === 'en' ? 'Register Now' : 'سجل الآن'}</span>
            </Link>

            <Link
              to="/universities"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-slate-400 hover:border-white text-white font-medium text-xs sm:text-sm transition-colors text-center"
            >
              <span>{currentLang === 'tr' ? 'Üniversitenizi Bulun' : currentLang === 'en' ? 'Find University' : 'ابحث عن جامعتك'}</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-10 border-b border-white/10">
          {/* Accreditation & Trust */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-base font-cairo">
              {currentLang === 'tr' ? 'Hakkımızda & Akreditasyon' : currentLang === 'en' ? 'About & Accreditation' : 'عن الشركة والاعتمادات'}
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-cairo">
              {currentLang === 'tr'
                ? "120'den fazla akredite Türk üniversitesinin resmi yetkili acentesi olarak, öğrencilere baştan sona profesyonel danışmanlık sağlıyoruz."
                : currentLang === 'en'
                ? 'Authorized representative for 120+ accredited Turkish universities, providing comprehensive guidance for international students.'
                : 'وكيل رسمي معتمد لأكثر من 120 جامعة تركية حكومية وخاصة، نقدم لطلابنا إرشاداً أكاديمياً متكاملاً وقبولات مضمونة.'}
            </p>
            {accreditation && (
              <div className="flex items-center gap-2 text-xs text-[#ff9015] font-semibold pt-1">
                <ShieldCheck className="w-4 h-4 text-[#25d366] shrink-0" />
                <span>{accreditation}</span>
              </div>
            )}
          </div>

          {/* Admin'in yönettiği link kolonları */}
          <FooterLinkColumns />

          {/* İletişim */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-cairo flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-amber-500" />
              <span>{t('contact.title')}</span>
            </h4>
            <ul className="space-y-3 text-sm">
              {address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-amber-500 shrink-0 mt-0.5" />
                  <span className="text-slate-400">{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-brand-amber-500 shrink-0" />
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-slate-400 hover:text-white transition-colors font-mono">
                    {phone}
                  </a>
                </li>
              )}
              {whatsapp && (
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-emerald-400 transition-colors font-mono"
                  >
                    +{whatsapp}
                  </a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-brand-amber-500 shrink-0" />
                  <a href={`mailto:${email}`} className="text-slate-400 hover:text-white transition-colors">
                    {email}
                  </a>
                </li>
              )}
              {hours && (
                <li className="flex items-center gap-2.5 text-xs text-slate-500 pt-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>{hours}</span>
                </li>
              )}
            </ul>

            {showSocial && <FooterSocial />}
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{copyright}</div>

          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-slate-300 transition-colors">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="hover:text-slate-300 transition-colors">
              {t('nav.contact')}
            </Link>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 p-2 rounded-lg bg-brand-navy-900 hover:bg-brand-navy-800 text-brand-amber-400 border border-brand-navy-800 transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
