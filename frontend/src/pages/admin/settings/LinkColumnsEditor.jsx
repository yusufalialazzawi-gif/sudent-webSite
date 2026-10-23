import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { LANGS, INPUT, LABEL, parseJson, stringifyJson } from './editorUtils';

// Footer link kolonları editörü: kolon başlıkları ve her kolondaki linkler (3 dilde).
export default function LinkColumnsEditor({ value, onChange, hint }) {
  const columns = parseJson(value, []);
  const update = (next) => onChange(stringifyJson(next));

  const patch = (index, changes) => update(columns.map((c, i) => (i === index ? { ...c, ...changes } : c)));

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= columns.length) return;
    const next = [...columns];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const patchLink = (index, linkIndex, changes) => {
    const links = (columns[index].links || []).map((l, i) => (i === linkIndex ? { ...l, ...changes } : l));
    patch(index, { links });
  };

  const addLink = (index) => patch(index, { links: [...(columns[index].links || []), { labelAr: '', labelTr: '', labelEn: '', url: '' }] });
  const removeLink = (index, linkIndex) =>
    patch(index, { links: (columns[index].links || []).filter((_, i) => i !== linkIndex) });

  return (
    <div className="space-y-3">
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}

      {columns.map((col, index) => (
        <div key={col.id || index} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-black text-slate-500">Kolon #{index + 1}</span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(index, -1)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" aria-label="Yukarı taşı">
                <ArrowUp size={13} />
              </button>
              <button type="button" onClick={() => move(index, 1)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" aria-label="Aşağı taşı">
                <ArrowDown size={13} />
              </button>
              <button type="button" onClick={() => update(columns.filter((_, i) => i !== index))} className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50" aria-label="Kolonu sil">
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LANGS.map((l) => (
              <div key={l.code}>
                <label className={LABEL}>{l.flag} Kolon Başlığı ({l.label})</label>
                <input
                  type="text"
                  value={col[`title${l.suffix}`] || ''}
                  onChange={(e) => patch(index, { [`title${l.suffix}`]: e.target.value })}
                  className={INPUT}
                />
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600">Kolon Linkleri</span>
              <button
                type="button"
                onClick={() => addLink(index)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition"
              >
                <Plus size={12} /> Link
              </button>
            </div>

            {(col.links || []).map((link, lIdx) => (
              <div key={lIdx} className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400">link #{lIdx + 1}</span>
                  <button type="button" onClick={() => removeLink(index, lIdx)} className="p-1 rounded-lg text-rose-500 hover:bg-rose-50" aria-label="Linki sil">
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {LANGS.map((l) => (
                    <input
                      key={l.code}
                      type="text"
                      placeholder={`${l.flag} ${l.label}`}
                      value={link[`label${l.suffix}`] || ''}
                      onChange={(e) => patchLink(index, lIdx, { [`label${l.suffix}`]: e.target.value })}
                      className={INPUT}
                    />
                  ))}
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="/universities/slug"
                    value={link.url || ''}
                    onChange={(e) => patchLink(index, lIdx, { url: e.target.value })}
                    className={INPUT}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => update([...columns, { id: `col-${Date.now().toString(36)}`, titleAr: '', titleTr: '', titleEn: '', links: [] }])}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white text-[11px] font-bold transition"
      >
        <Plus size={14} />
        <span>Yeni Kolon Ekle</span>
      </button>
    </div>
  );
}
