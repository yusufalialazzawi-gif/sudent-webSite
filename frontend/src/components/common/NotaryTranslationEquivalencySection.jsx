import React from 'react';
import { FileCheck2, Languages, GraduationCap, ShieldAlert, ArrowRight, MessageCircle, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotaryTranslationEquivalencySection({ className = '' }) {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { settings } = useTheme();

  const services = [
    {
      icon: Languages,
      iconColor: 'text-brand-amber-500',
      bgColor: 'bg-brand-amber-500/10',
      title: t('notarySection.swornTranslationTitle'),
      desc: t('notarySection.swornTranslationDesc'),
      badges: currentLang === 'ar'
        ? ['شهادات الثانوية والبكالوريوس', 'كشوف الدرجات', 'جوازات السفر']
        : currentLang === 'tr'
        ? ['Lise ve Lisans Diplomaları', 'Dönem Transkriptleri', 'Pasaport Tercümesi']
        : ['High School & Bachelor Diplomas', 'Academic Transcripts', 'Passport Translations'],
    },
    {
      icon: FileCheck2,
      iconColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      title: t('notarySection.notaryTitle'),
      desc: t('notarySection.notaryDesc'),
      badges: currentLang === 'ar'
        ? ['ختم كاتب العدل التركي', 'تصديق الأبوستيل (Apostille)', 'مطابقة الأصل']
        : currentLang === 'tr'
        ? ['Türk Noter Onayı', 'Apostil Tasdiki', 'Aslı Gibidir Onayı']
        : ['Turkish Notary Legalization', 'Apostille Certification', 'Certified True Copy'],
    },
    {
      icon: GraduationCap,
      iconColor: 'text-sky-500',
      bgColor: 'bg-sky-500/10',
      title: t('notarySection.denklikTitle'),
      desc: t('notarySection.denklikDesc'),
      badges: currentLang === 'ar'
        ? ['معادلة الثانوية (MEB)', 'اعتراف الجامعات (YÖK Tanıma)', 'معادلة التخصصات الطبية والهندسية']
        : currentLang === 'tr'
        ? ['MEB Lise Denkliği', 'YÖK Okul Tanıma Belgesi', 'Tıp ve Mühendislik Denkliği']
        : ['MEB High School Equivalency', 'YÖK University Recognition', 'Medical & Engineering Denklik'],
    },
  ];

  const whatsappMessage =
    currentLang === 'ar'
      ? 'مرحباً، أود الاستفسار عن خدمات الترجمة المحلفة وتعديل الشهادات (Denklik)'
      : currentLang === 'tr'
      ? 'Merhaba, yeminli tercüme ve denklik işlemleri hakkında bilgi almak istiyorum.'
      : 'Hello, I would like to inquire about certified translation and equivalency (Denklik) services.';

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 ${className}`}>
      {/* Header */}
      <div>
        <span className="text-brand-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
          {t('notarySection.badge')}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-brand-navy-950 font-cairo">
          {t('notarySection.title')}
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          {t('notarySection.subtitle')}
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {services.map((svc, idx) => (
          <div
            key={idx}
            className="rounded-2xl p-6 bg-slate-50/80 border border-slate-200/80 hover:border-brand-amber-400/50 hover:bg-slate-50 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className={`w-12 h-12 rounded-2xl ${svc.bgColor} flex items-center justify-center shrink-0`}>
                <svc.icon className={`w-6 h-6 ${svc.iconColor}`} />
              </div>

              <h3 className="font-bold text-base text-brand-navy-950 font-cairo leading-snug">
                {svc.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {svc.desc}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200/60 space-y-2">
              {svc.badges.map((b, bIdx) => (
                <div key={bIdx} className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Official Transparency Disclosure Banner */}
      <div className="rounded-2xl bg-brand-navy-950 text-slate-200 p-5 sm:p-6 border border-brand-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-2xl">
          <ShieldAlert className="w-5 h-5 text-brand-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white font-cairo">
              {t('notarySection.disclaimerTitle')}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t('notarySection.disclaimerText')}
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${settings.contact_whatsapp || settings.whatsapp_number || '905313971022'}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t('notarySection.consultBtn')}</span>
        </a>
      </div>
    </div>
  );
}
