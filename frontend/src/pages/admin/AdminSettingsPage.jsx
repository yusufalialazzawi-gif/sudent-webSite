import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Settings,
  Save,
  MessageSquare,
  Globe,
  Share2,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminSettingsPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [settingsState, setSettingsState] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const { data: rawSettings = [], isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const res = await api.getAdminSettings();
      return res.data || [];
    },
  });

  useEffect(() => {
    if (rawSettings.length > 0) {
      const mapped = {};
      rawSettings.forEach(item => {
        mapped[item.key] = item.value;
      });
      setSettingsState(mapped);
    }
  }, [rawSettings]);

  const saveMutation = useMutation({
    mutationFn: async (payload) => {
      const settingsArray = Object.entries(payload).map(([key, value]) => ({
        key,
        value: String(value),
        group: key.startsWith('whatsapp') ? 'WHATSAPP' : key.startsWith('contact') ? 'CONTACT' : key.startsWith('social') ? 'SOCIAL' : key.startsWith('seo') ? 'SEO' : 'GENERAL'
      }));
      return await api.updateAdminSettings(settingsArray);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminSettings']);
      queryClient.invalidateQueries(['publicSettings']);
      setSuccessMessage('تم حفظ كافة إعدادات المنصة بنجاح!');
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err) => {
      alert(err.message || 'Error saving settings');
    }
  });

  const handleChange = (key, value) => {
    setSettingsState(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveMutation.mutate(settingsState);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'إعدادات المنصة والهوية البصرية' : 'Platform & Global Settings'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'إدارة أرقام واتساب التفاعلية، بيانات التواصل في اسطنبول، شبكات التواصل ومحركات البحث' : 'Configure official contact channels, interactive WhatsApp templates, social media links, and SEO'}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
        >
          <Save size={16} />
          <span>{saveMutation.isPending ? 'جاري الحفظ...' : 'حفظ الإعدادات'}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>جاري تحميل الإعدادات...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Branding */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Settings size={16} className="text-brand-amber-500" />
              <span>هوية الموقع والاسم العام</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المؤسسة (Brand Name)</label>
                <input
                  type="text"
                  value={settingsState.site_name || 'Sora Education'}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">اللغة الافتراضية للزوار</label>
                <select
                  value={settingsState.default_language || 'ar'}
                  onChange={(e) => handleChange('default_language', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                >
                  <option value="ar">العربية (Arabic - RTL)</option>
                  <option value="tr">Türkçe (Turkish - LTR)</option>
                  <option value="en">English (English - LTR)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Interactive WhatsApp Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-500" />
              <span>إعدادات واتساب التفاعلي (WhatsApp Direct Bridge)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم واتساب الرسمي (مع الرمز الدولي بدون +)</label>
                <input
                  type="text"
                  placeholder="905300000000"
                  value={settingsState.whatsapp_number || '905380964646'}
                  onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 font-mono ltr text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رسالة الترحيب التلقائية بالعربية 🇸🇦</label>
                <input
                  type="text"
                  value={settingsState.whatsapp_message_ar || 'مرحباً سورا للخدمات التعليمية، أود الاستفسار عن القبول الجامعي والمنح'}
                  onChange={(e) => handleChange('whatsapp_message_ar', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Türkçe Karşılama Mesajı 🇹🇷</label>
                <input
                  type="text"
                  value={settingsState.whatsapp_message_tr || 'Merhaba Sora Education, üniversite kabul süreçleri hakkında bilgi almak istiyorum.'}
                  onChange={(e) => handleChange('whatsapp_message_tr', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">English Welcome Message 🇬🇧</label>
                <input
                  type="text"
                  value={settingsState.whatsapp_message_en || 'Hello Sora Education, I would like to inquire about university admissions and scholarships in Turkey.'}
                  onChange={(e) => handleChange('whatsapp_message_en', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Phone size={16} className="text-brand-amber-500" />
              <span>بيانات الاتصال ومقر الشركة في اسطنبول</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني الرسمي</label>
                <input
                  type="email"
                  value={settingsState.contact_email || 'info@soraedu-tr.com'}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">رقم الهاتف الأرضي / المباشر</label>
                <input
                  type="text"
                  value={settingsState.contact_phone || '+90 538 096 4646'}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">عنوان المقر في اسطنبول</label>
                <input
                  type="text"
                  value={settingsState.contact_address || 'Şişli / Istanbul, Turkey'}
                  onChange={(e) => handleChange('contact_address', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Social Channels */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <Share2 size={16} className="text-brand-amber-500" />
              <span>حسابات التواصل الاجتماعي (Social Media)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/soraedu"
                  value={settingsState.social_instagram || ''}
                  onChange={(e) => handleChange('social_instagram', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Facebook URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/soraedu"
                  value={settingsState.social_facebook || ''}
                  onChange={(e) => handleChange('social_facebook', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/company/soraedu"
                  value={settingsState.social_linkedin || ''}
                  onChange={(e) => handleChange('social_linkedin', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">YouTube URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/@soraedu"
                  value={settingsState.social_youtube || ''}
                  onChange={(e) => handleChange('social_youtube', e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50 ltr text-start"
                />
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
