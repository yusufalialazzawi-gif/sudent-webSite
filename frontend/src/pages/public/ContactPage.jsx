import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';

export default function ContactPage() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();
  const { settings } = useTheme();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const address =
    currentLang === 'tr'
      ? settings.contact_address_tr || 'Fevzipaşa Cad. No:42, Fatih, İstanbul, Türkiye'
      : currentLang === 'en'
      ? settings.contact_address_en || 'Fevzipasa St. No:42, Fatih, Istanbul, Turkey'
      : settings.contact_address_ar || 'إسطنبول، الفاتح، شارع فوزي باشا رقم 42، تركيا';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      const res = await api.submitContactInquiry({ fullName, email, phone, subject, message });
      if (res.success) {
        setSuccess(true);
        setFullName('');
        setEmail('');
        setPhone('');
        setSubject('');
        setMessage('');
      }
    } catch (err) {
      setErrorMsg(err.message || 'حدث خطأ أثناء إرسال الرسالة.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block">
          {t('contact.title')}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-brand-navy-950 font-cairo">
          فريقنا دائماً في خدمتك
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-brand-navy-950 font-cairo border-b border-slate-100 pb-4">
              معلومات الاتصال المباشر
            </h2>

            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-amber-50 flex items-center justify-center text-brand-amber-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">{t('contact.address')}</span>
                  <span className="font-bold text-slate-800">{address}</span>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">واتساب رسمي</span>
                  <a
                    href={`https://wa.me/${settings.contact_whatsapp || '905514678371'}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-600 hover:underline font-mono"
                  >
                    +{settings.contact_whatsapp || '905514678371'}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">{t('contact.email')}</span>
                  <a href={`mailto:${settings.contact_email || 'info@soraedu-tr.com'}`} className="font-bold text-slate-800 hover:underline">
                    {settings.contact_email || 'info@soraedu-tr.com'}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">{t('contact.workingHours')}</span>
                  <span className="font-bold text-slate-800">الإثنين - السبت: 09:00 صباحاً - 06:00 مساءً</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* General Inquiry Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-brand-navy-950 font-cairo">
              أرسل استفسارك وسنجيبك فوراً
            </h2>

            {success && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-bold flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>تم إرسال رسالتك بنجاح! سيتواصل معك أحد مستشارينا في أقرب وقت.</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-bold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('contact.fullName')} *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                    placeholder="محمد علي"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('contact.email')} *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('contact.phone')}</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none font-mono"
                    placeholder="+964 770 123 4567"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">{t('contact.subject')}</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                    placeholder="استفسار عن القبول الجامعي"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t('contact.message')} *</label>
                <textarea
                  rows="4"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-amber-500 focus:outline-none"
                  placeholder="اكتب استفسارك بالتفصيل..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-amber-500 to-brand-amber-600 hover:from-brand-amber-600 hover:to-brand-amber-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'جاري الإرسال...' : t('contact.sendBtn')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
