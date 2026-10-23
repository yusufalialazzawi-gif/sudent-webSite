import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import ImageInput from './ImageInput';
import { LANGS, INPUT, LABEL, parseJson, stringifyJson } from './editorUtils';

// json-list / json-images / json-stats alanları için satır bazlı editör.
const ROW_SCHEMAS = {
  'json-list': LANGS.map((l) => ({ key: l.code, label: `${l.flag} ${l.label}`, placeholder: 'Madde metni' })),
  'json-images': [
    { key: 'url', label: 'Fotoğraf', type: 'image' },
    ...LANGS.map((l) => ({ key: `alt${l.suffix}`, label: `${l.flag} Alternatif metin` })),
  ],
  'json-stats': [
    { key: 'value', label: 'Rakam', type: 'number', placeholder: '125' },
    ...LANGS.map((l) => ({ key: l.code, label: `${l.flag} Etiket` })),
  ],
};

export default function JsonRowsEditor({ type, value, onChange, hint }) {
  const rows = parseJson(value, []);
  const schema = ROW_SCHEMAS[type] || ROW_SCHEMAS['json-list'];

  const update = (next) => onChange(stringifyJson(next));

  const setCell = (index, key, cellValue) => {
    const next = rows.map((row, i) => (i === index ? { ...row, [key]: cellValue } : row));
    update(next);
  };

  const addRow = () => {
    const blank = {};
    schema.forEach((f) => {
      blank[f.key] = f.type === 'number' ? 0 : '';
    });
    update([...rows, blank]);
  };

  const removeRow = (index) => update(rows.filter((_, i) => i !== index));

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  return (
    <div className="space-y-3">
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}

      {rows.length === 0 && (
        <div className="text-[11px] text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center">
          Henüz satır yok. Aşağıdaki butondan ekleyin.
        </div>
      )}

      {rows.map((row, index) => (
        <div key={index} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400">#{index + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(index, -1)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" aria-label="Yukarı taşı">
                <ArrowUp size={13} />
              </button>
              <button type="button" onClick={() => move(index, 1)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" aria-label="Aşağı taşı">
                <ArrowDown size={13} />
              </button>
              <button type="button" onClick={() => removeRow(index)} className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50" aria-label="Sil">
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {schema.map((f) =>
              f.type === 'image' ? (
                <div key={f.key} className="md:col-span-3">
                  <ImageInput label={f.label} value={row[f.key] || ''} onChange={(v) => setCell(index, f.key, v)} />
                </div>
              ) : (
                <div key={f.key}>
                  <label className={LABEL}>{f.label}</label>
                  <input
                    type={f.type === 'number' ? 'number' : 'text'}
                    placeholder={f.placeholder || ''}
                    value={row[f.key] ?? ''}
                    onChange={(e) => setCell(index, f.key, f.type === 'number' ? Number(e.target.value) : e.target.value)}
                    className={INPUT}
                  />
                </div>
              )
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white text-[11px] font-bold transition"
      >
        <Plus size={14} />
        <span>Yeni Satır Ekle</span>
      </button>
    </div>
  );
}
