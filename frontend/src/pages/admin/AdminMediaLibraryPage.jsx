import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  FileText,
  Video,
  X,
  Edit,
  Globe
} from 'lucide-react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminMediaLibraryPage() {
  const { currentLanguage, isRtl } = useLanguage();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [editingAsset, setEditingAsset] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [altTexts, setAltTexts] = useState({ ar: '', tr: '', en: '' });

  const { data, isLoading } = useQuery({
    queryKey: ['adminMedia', { search: searchTerm, assetType: typeFilter }],
    queryFn: async () => {
      const res = await api.getMediaAssets({
        search: searchTerm,
        assetType: typeFilter,
      });
      return res;
    },
  });

  const assets = data?.data || [];

  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      return await api.uploadMedia(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMedia']);
      setUploadFile(null);
      setUploading(false);
    },
    onError: (err) => {
      alert(err.message || 'Error uploading file');
      setUploading(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await api.updateMedia(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMedia']);
      setEditingAsset(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.deleteMedia(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminMedia']);
    }
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('assetType', file.type.startsWith('image/') ? 'IMAGE' : file.type.startsWith('video/') ? 'VIDEO' : 'DOCUMENT');
    formData.append('altTextAr', file.name);

    uploadMutation.mutate(formData);
  };

  const copyUrl = (url, id) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openEditModal = (asset) => {
    setEditingAsset(asset);
    setAltTexts({
      ar: asset.altTextAr || '',
      tr: asset.altTextTr || '',
      en: asset.altTextEn || '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {currentLanguage === 'ar' ? 'مكتبة الوسائط والصور الرقمية' : 'Media Assets Library'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {currentLanguage === 'ar' ? 'رفع صور الجامعات، الشعارات، وتعيين نصوص الـ Alt البديلة لتعزيز SEO' : 'Upload university logos, campus banners, and manage SEO alt tags in 3 languages'}
          </p>
        </div>

        <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-amber-500 to-amber-600 hover:from-brand-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition">
          <Upload size={16} />
          <span>{uploading ? 'جاري الرفع...' : 'رفع ملف جديد'}</span>
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            accept="image/*,application/pdf,video/*"
          />
        </label>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={currentLanguage === 'ar' ? 'بحث باسم الملف أو النص البديل...' : 'Search media...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setTypeFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              typeFilter === '' ? 'bg-brand-navy-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => setTypeFilter('IMAGE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              typeFilter === 'IMAGE' ? 'bg-brand-navy-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            الصور
          </button>
          <button
            onClick={() => setTypeFilter('DOCUMENT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              typeFilter === 'DOCUMENT' ? 'bg-brand-navy-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            المستندات
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="w-8 h-8 border-4 border-brand-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <span>جاري تحميل مكتبة الوسائط...</span>
        </div>
      ) : assets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md hover:border-brand-amber-500/30 transition"
            >
              {/* Thumbnail Container */}
              <div className="h-32 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {asset.assetType === 'IMAGE' ? (
                  <img
                    src={asset.url}
                    alt={asset.altTextAr || asset.originalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : asset.assetType === 'VIDEO' ? (
                  <Video size={32} className="text-slate-400" />
                ) : (
                  <FileText size={32} className="text-slate-400" />
                )}

                {/* Overlay Action Buttons */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => copyUrl(asset.url, asset.id)}
                    className="p-1.5 bg-white text-slate-800 rounded-lg hover:bg-brand-amber-500 hover:text-white transition shadow"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  </button>
                  <button
                    onClick={() => openEditModal(asset)}
                    className="p-1.5 bg-white text-slate-800 rounded-lg hover:bg-brand-navy-950 hover:text-white transition shadow"
                    title="Edit Alt Texts"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`حذف الملف ${asset.originalName}؟`)) {
                        deleteMutation.mutate(asset.id);
                      }
                    }}
                    className="p-1.5 bg-white text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Info Snippet */}
              <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                <div className="font-bold text-slate-900 truncate" title={asset.originalName}>
                  {asset.originalName}
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                  <span>{(asset.fileSize / 1024).toFixed(0)} KB</span>
                  <span className="uppercase font-mono">{asset.mimeType?.split('/')[1] || 'FILE'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 text-sm">
          لا توجد وسائط مرفوعة مطابقة للبحث
        </div>
      )}

      {/* Edit Alt Texts Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">تعديل نصوص الـ SEO البديلة (Alt Tags)</h3>
              <button onClick={() => setEditingAsset(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">النص البديل بالعربية (Alt Text AR)</label>
                <input
                  type="text"
                  value={altTexts.ar}
                  onChange={(e) => setAltTexts({ ...altTexts, ar: e.target.value })}
                  placeholder="مبنى الحرم الجامعي لجامعة اسطنبول ميديبول"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Türkçe Alt Metin (Alt Text TR)</label>
                <input
                  type="text"
                  value={altTexts.tr}
                  onChange={(e) => setAltTexts({ ...altTexts, tr: e.target.value })}
                  placeholder="İstanbul Medipol Üniversitesi Kampüsü"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">English Alt Text (Alt Text EN)</label>
                <input
                  type="text"
                  value={altTexts.en}
                  onChange={(e) => setAltTexts({ ...altTexts, en: e.target.value })}
                  placeholder="Istanbul Medipol University Main Campus Building"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t">
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => {
                  updateMutation.mutate({
                    id: editingAsset.id,
                    data: {
                      altTextAr: altTexts.ar,
                      altTextTr: altTexts.tr,
                      altTextEn: altTexts.en,
                    }
                  });
                }}
                disabled={updateMutation.isPending}
                className="px-5 py-2 bg-brand-amber-500 hover:bg-brand-amber-600 text-white rounded-xl text-xs font-bold shadow transition disabled:opacity-50"
              >
                {updateMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
