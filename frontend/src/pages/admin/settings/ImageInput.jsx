import React, { useRef, useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { api } from '../../../services/api';

// Görsel ayar alanı: URL yazılabilir veya medya kütüphanesine dosya yüklenebilir.
export default function ImageInput({ value, onChange, label, className = '' }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assetType', 'IMAGE');
      const res = await api.uploadMedia(formData);
      if (res?.data?.url) onChange(res.data.url);
    } catch (err) {
      setError(err.message || 'Yükleme başarısız');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      {label && <label className="block font-bold text-slate-700 mb-1 text-xs">{label}</label>}
      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-1">
          <input
            type="text"
            dir="ltr"
            placeholder="https://... veya /uploads/..."
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-amber-500 text-xs text-start"
          />
          {error && <span className="text-[11px] text-rose-600 font-bold">{error}</span>}
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-brand-navy-950 text-white text-[11px] font-bold hover:bg-brand-navy-800 transition disabled:opacity-50"
        >
          <Upload size={14} />
          <span>{uploading ? '...' : 'Yükle'}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="shrink-0 p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition"
            aria-label="Görseli kaldır"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="mt-2 h-20 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
        {value ? (
          <img src={value} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImageIcon size={20} className="text-slate-300" />
        )}
      </div>
    </div>
  );
}
