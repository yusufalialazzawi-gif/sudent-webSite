import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ta, tx } from '../../i18n/adminText';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, CheckCircle2, Search, Settings2 } from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import SettingField from './settings/SettingField';

const GROUP_ICONS = {
  BRANDING: '🏢',
  NAVBAR: '🧭',
  HERO: '🖼️',
  HOME: '🏠',
  ABOUT: '📖',
  FOOTER: '🔻',
  CONTACT: '📍',
  WHATSAPP: '💬',
  SOCIAL: '🔗',
  THEME: '🎨',
  SEO: '🔎',
  GENERAL: '⚙️',
};

// Site ayarları: tüm alanlar backend'deki ayar kataloğundan (settingsSchema) otomatik üretilir.
// Yeni bir ayar eklemek için kataloğa alan eklemek yeterlidir; bu sayfa onu kendisi çizer.
export default function AdminSettingsPage() {
  const { currentLanguage } = useLanguage();
  const queryClient = useQueryClient();
  const isArabic = currentLanguage === 'ar';

  const [activeGroup, setActiveGroup] = useState('');
  const [values, setValues] = useState({});
  const [search, setSearch] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const initialRef = useRef({});

  const { data: schema } = useQuery({
    queryKey: ['settingsSchema'],
    queryFn: async () => {
      const res = await api.getSettingsSchema();
      return res.data || { groups: [], fields: [] };
    },
  });

  const { data: rawSettings = [], isLoading } = useQuery({
    queryKey: ['adminSettings'],
    queryFn: async () => {
      const res = await api.getAdminSettings();
      return res.data || [];
    },
  });

  const groups = schema?.groups || [];
  const fields = schema?.fields || [];

  useEffect(() => {
    if (groups.length > 0) setActiveGroup((prev) => prev || groups[0].id);
  }, [groups]);

  useEffect(() => {
    if (rawSettings.length > 0) {
      const mapped = {};
      rawSettings.forEach((item) => {
        mapped[item.key] = item.value;
      });
      initialRef.current = mapped;
      setValues(mapped);
    }
  }, [rawSettings]);

  const saveMutation = useMutation({
    mutationFn: (payload) => api.updateAdminSettings(payload),
    onSuccess: (_res, payload) => {
      initialRef.current = { ...initialRef.current, ...Object.fromEntries(payload.map((p) => [p.key, p.value])) };
      queryClient.invalidateQueries(['adminSettings']);
      queryClient.invalidateQueries(['publicSettings']);
      setSuccessMessage(
        tx(
          `تم حفظ ${payload.length} إعداد بنجاح — الموقع يتحدث فوراً.`,
          `${payload.length} ayar başarıyla kaydedildi — Site anında güncelleniyor.`,
          `${payload.length} settings saved successfully — Site updates immediately.`
        )
      );
      setTimeout(() => setSuccessMessage(''), 5000);
    },
    onError: (err) => alert(err.message || 'Error saving settings'),
  });

  const handleChange = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));

  const handleSave = (e) => {
    e?.preventDefault();
    const changed = Object.entries(values)
      .filter(([key, value]) => String(value ?? '') !== String(initialRef.current[key] ?? ''))
      .map(([key, value]) => ({ key, value: String(value ?? '') }));

    if (changed.length === 0) {
      setSuccessMessage(tx('لا توجد تغييرات للحفظ.', 'Kaydedilecek değişiklik yok.', 'No changes to save.'));
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }
    saveMutation.mutate(changed);
  };

  const visibleGroups = useMemo(() => groups.filter((g) => g.id !== 'SECURITY'), [groups]);

  const groupFields = useMemo(() => {
    const query = search.trim().toLowerCase();
    return fields.filter((f) => {
      if (f.group !== activeGroup) return false;
      if (!query) return true;
      return (
        f.key.toLowerCase().includes(query) ||
        String(f.labelTr || '').toLowerCase().includes(query) ||
        String(f.labelAr || '').toLowerCase().includes(query) ||
        String(f.labelEn || '').toLowerCase().includes(query)
      );
    });
  }, [fields, activeGroup, search]);

  // Arama aktifken tüm gruplarda ara
  const searchResults = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return null;
    return fields.filter(
      (f) =>
        f.key.toLowerCase().includes(query) ||
        String(f.labelTr || '').toLowerCase().includes(query) ||
        String(f.labelAr || '').toLowerCase().includes(query) ||
        String(f.labelEn || '').toLowerCase().includes(query)
    );
  }, [fields, search]);

  const rendering = searchResults || groupFields;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-cairo">
            {tx('إعدادات الموقع الكاملة — تحكم بكل شيء', 'Tüm Site Ayarları — Her Şeyi Buradan Yönetin', 'Website Settings — Control Everything')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {tx(
              'القائمة العلوية، صور الواجهة، أقسام الصفحة الرئيسية، التذييل، التواصل، السوشيال ميديا، الألوان وSEO — كلها بـ 3 لغات.',
              'Üst menü, hero arka plan fotoğrafları, ana sayfa bölümleri, footer, iletişim, sosyal medya, renkler ve SEO — hepsi 3 dilde.',
              'Top menu, hero photos, homepage sections, footer, contacts, social media, colors and SEO — all in 3 languages.'
            )}
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
        >
          <Save size={16} />
          <span>
            {saveMutation.isPending
              ? tx('جاري الحفظ...', 'Kaydediliyor...', 'Saving...')
              : tx('حفظ كافة التعديلات', 'Değişiklikleri Kaydet', 'Save Changes')}
          </span>
        </button>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Grup sekmeleri + arama */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 flex-1 no-scrollbar">
          {visibleGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => {
                setActiveGroup(group.id);
                setSearch('');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeGroup === group.id && !search
                  ? 'bg-brand-navy-950 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{GROUP_ICONS[group.id] || '⚙️'}</span>
              <span>{currentLanguage === 'ar' ? group.labelAr : (currentLanguage === 'en' ? (group.labelEn || group.labelTr) : group.labelTr)}</span>
            </button>
          ))}
        </div>

        <div className="relative lg:w-72 shrink-0">
          <Search size={14} className="absolute top-1/2 -translate-y-1/2 start-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tx('ابحث عن إعداد...', 'Ayar ara...', 'Search settings...')}
            className="w-full ps-9 pe-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-amber-500"
          />
        </div>
      </div>

      {isLoading || !schema ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>{tx('جاري تحميل إعدادات المنصة...', 'Ayarlar yükleniyor...', 'Loading settings...')}</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {search && (
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <Settings2 size={13} className="text-brand-amber-500" />
              <span>
                {tx(`نتائج البحث: ${rendering.length}`, `Arama sonucu: ${rendering.length} ayar`, `Search results: ${rendering.length} settings`)}
              </span>
            </div>
          )}

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {rendering.map((field) => {
                const isComplex = String(field.type || '').startsWith('json');
                return (
                  <div key={field.key} className={isComplex ? 'md:col-span-2 xl:col-span-3' : ''}>
                    <SettingField field={field} values={values} onChange={handleChange} currentLanguage={currentLanguage} />
                  </div>
                );
              })}
            </div>

            {rendering.length === 0 && (
              <div className="py-10 text-center text-xs text-slate-400">
                {tx('لا توجد إعدادات في هذا القسم.', 'Bu bölümde ayar bulunamadı.', 'No settings found in this section.')}
              </div>
            )}
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="px-8 py-3 bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              <span>
                {saveMutation.isPending
                  ? tx('جاري الحفظ...', 'Kaydediliyor...', 'Saving...')
                  : tx('حفظ كافة التعديلات الآن', 'Tüm Değişiklikleri Şimdi Kaydet', 'Save All Changes Now')}
              </span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
