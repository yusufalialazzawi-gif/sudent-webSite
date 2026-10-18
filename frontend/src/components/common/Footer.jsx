import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  ArrowUp,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { settings } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const address =
    currentLang === 'tr'
      ? settings.contact_address_tr || 'Fevzipaşa Cad. No:42, Fatih, İstanbul, Türkiye'
      : currentLang === 'en'
      ? settings.contact_address_en || 'Fevzipasa St. No:42, Fatih, Istanbul, Turkey'
      : settings.contact_address_ar || 'إسطنبول، الفاتح، شارع فوزي باشا رقم 42، تركيا';

  return (
    <footer className="bg-brand-navy-950 text-slate-300 pt-16 pb-8 border-t border-brand-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-navy-800">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="المجد للقبولات الجامعية"
                className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-brand-amber-500/30"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white font-cairo">
                  {currentLang === 'ar' ? 'المجد' : currentLang === 'tr' ? 'El-Mecd' : 'Al-Majd'}{' '}
                  <span className="text-brand-amber-400">
                    {currentLang === 'ar' ? 'للقبولات الجامعية' : currentLang === 'tr' ? 'Kabulleri' : 'Admissions'}
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {currentLang === 'ar' ? 'بوابتك الأكاديمية للدراسة في تركيا' : currentLang === 'tr' ? 'Türkiye Üniversite Başvuru Portalı' : 'Turkey University Admissions Portal'}
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-amber-400 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{currentLang === 'ar' ? 'اعتماد وترخيص رسمي من وزارة التعليم التركية' : currentLang === 'tr' ? 'MEB ve YÖK Yetkili Danışmanlık' : 'Officially Licensed & Accredited in Turkey'}</span>
            </div>
          </div>

          {/* Col 2: Top Universities */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-cairo flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-brand-amber-500" />
              <span>{t('footer.universities')}</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/universities/istanbul-medipol-university" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'جامعة إسطنبول ميدي بول' : currentLang === 'tr' ? 'İstanbul Medipol Üniversitesi' : 'Istanbul Medipol University'}
                </Link>
              </li>
              <li>
                <Link to="/universities/bahcesehir-university" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'جامعة بهتشه شهير (BAU)' : currentLang === 'tr' ? 'Bahçeşehir Üniversitesi' : 'Bahçeşehir University'}
                </Link>
              </li>
              <li>
                <Link to="/universities/koc-university" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'جامعة كوتش' : currentLang === 'tr' ? 'Koç Üniversitesi' : 'Koç University'}
                </Link>
              </li>
              <li>
                <Link to="/universities/sabanci-university" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'جامعة سابانجي' : currentLang === 'tr' ? 'Sabancı Üniversitesi' : 'Sabancı University'}
                </Link>
              </li>
              <li>
                <Link to="/universities/istanbul-university" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'جامعة إسطنبول الحكومية' : currentLang === 'tr' ? 'İstanbul Üniversitesi' : 'Istanbul University'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Services */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-cairo flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-brand-amber-500" />
              <span>{t('footer.services')}</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services/university-admissions" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'القبول الجامعي المجاني' : currentLang === 'tr' ? 'Ücretsiz Üniversite Kabulü' : 'University Admissions'}
                </Link>
              </li>
              <li>
                <Link to="/services/denklik-equivalency" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'معادلة الشهادات (الدنكليك)' : currentLang === 'tr' ? 'Denklik Danışmanlığı' : 'Diploma Equivalency (Denklik)'}
                </Link>
              </li>
              <li>
                <Link to="/services/student-residence-permit" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'الإقامة الطلابية (الإيكامت)' : currentLang === 'tr' ? 'Öğrenci İkamet İzni' : 'Student Residence Permit'}
                </Link>
              </li>
              <li>
                <Link to="/services/airport-pickup-housing" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'الاستقبال والسكن الطلابي' : currentLang === 'tr' ? 'Havalimanı ve Konaklama' : 'Airport Pickup & Housing'}
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-slate-400 hover:text-brand-amber-400 transition-colors">
                  {currentLang === 'ar' ? 'دورات اليوس والتومر والسات' : currentLang === 'tr' ? 'YÖS, TÖMER ve SAT Kursları' : 'YÖS, TÖMER & SAT Prep'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 font-cairo flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-amber-500" />
              <span>{t('contact.title')}</span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-amber-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${settings.contact_whatsapp || '905514678371'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-emerald-400 transition-colors font-mono"
                >
                  +{settings.contact_whatsapp || '905514678371'}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-amber-500 shrink-0" />
                <a href={`mailto:${settings.contact_email || 'info@soraedu-tr.com'}`} className="text-slate-400 hover:text-white transition-colors">
                  {settings.contact_email || 'info@soraedu-tr.com'}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-xs text-slate-500 pt-1">
                <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{currentLang === 'ar' ? 'الإثنين - السبت: 09:00 - 18:00' : currentLang === 'tr' ? 'Pazartesi - Cumartesi: 09:00 - 18:00' : 'Mon - Sat: 09:00 - 18:00'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{t('footer.rights')}</div>

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
