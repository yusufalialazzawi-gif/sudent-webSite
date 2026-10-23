import React from 'react';
import { ta } from '../../../i18n/adminText';
import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react';

// "En iyi bölümler" listesi editörü (3 dilde). Değeri JSON string olarak tutar.
const emptyRow = { tr: '', en: '', ar: '', reason: '', reasonAr: '', reasonEn: '' };

function parseRows(value) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function BestDepartmentsEditor({ value, onChange }) {
  const rows = parseRows(value);

  const emit = (next) => onChange(JSON.stringify(next));

  const update = (index, field, val) => {
    const next = rows.map((row, i) => (i === index ? { ...emptyRow, ...row, [field]: val } : row));
    emit(next);
  };

  const add = () => emit([...rows, { ...emptyRow }]);
  const remove = (index) => emit(rows.filter((_, i) => i !== index));
  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    emit(next);
  };

  return (
    <div className="space-y-3">
      {rows.length === 0 && (
        <p className="text-[11px] text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3">
          Henüz bölüm eklenmedi. Aşağıdaki butonla üniversitenin en güçlü bölümlerini ekleyin (en güçlü olan en üstte).
        </p>
      )}

      {rows.map((row, index) => (
        <div key={index} className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-brand-navy-900">#{index + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(index, -1)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="Yukarı taşı">
                <ArrowUp size={14} />
              </button>
              <button type="button" onClick={() => move(index, 1)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500" title="Aşağı taşı">
                <ArrowDown size={14} />
              </button>
              <button type="button" onClick={() => remove(index)} className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500" title="Sil">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={row.tr || ''}
              onChange={(e) => update(index, 'tr', e.target.value)}
              placeholder="Bölüm adı (Türkçe) — örn. Bilgisayar Mühendisliği"
              className="p-2 border border-slate-200 rounded-lg text-[11px]"
            />
            <input
              type="text"
              value={row.ar || ''}
              onChange={(e) => update(index, 'ar', e.target.value)}
              placeholder={ta("اسم القسم (عربي)")}
              dir="rtl"
              className="p-2 border border-slate-200 rounded-lg text-[11px]"
            />
            <input
              type="text"
              value={row.en || ''}
              onChange={(e) => update(index, 'en', e.target.value)}
              placeholder="Department name (English)"
              className="p-2 border border-slate-200 rounded-lg text-[11px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              value={row.reason || ''}
              onChange={(e) => update(index, 'reason', e.target.value)}
              placeholder="Neden en iyilerden? (Türkçe) — örn. MÜDEK akreditasyonlu"
              className="p-2 border border-slate-200 rounded-lg text-[11px]"
            />
            <input
              type="text"
              value={row.reasonAr || ''}
              onChange={(e) => update(index, 'reasonAr', e.target.value)}
              placeholder={ta("لماذا هو الأفضل؟ (عربي)")}
              dir="rtl"
              className="p-2 border border-slate-200 rounded-lg text-[11px]"
            />
            <input
              type="text"
              value={row.reasonEn || ''}
              onChange={(e) => update(index, 'reasonEn', e.target.value)}
              placeholder="Why is it a top program? (English)"
              className="p-2 border border-slate-200 rounded-lg text-[11px]"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-navy-950 text-white text-[11px] font-bold hover:bg-brand-navy-900 transition"
      >
        <Plus size={14} />
        <span>En İyi Bölüm Ekle</span>
      </button>
    </div>
  );
}
