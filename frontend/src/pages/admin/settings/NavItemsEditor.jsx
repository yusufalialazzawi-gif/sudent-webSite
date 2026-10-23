import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, CornerDownRight } from 'lucide-react';
import { LANGS, INPUT, LABEL, parseJson, stringifyJson } from './editorUtils';

const newItem = (prefix) => ({
  id: `${prefix}-${Date.now().toString(36)}`,
  labelAr: '',
  labelTr: '',
  labelEn: '',
  url: '',
  enabled: true,
});

// Üst menü (navbar) editörü: menü öğeleri, sıraları, görünürlükleri ve alt menüleri.
export default function NavItemsEditor({ value, onChange, hint }) {
  const items = parseJson(value, []);
  const update = (next) => onChange(stringifyJson(next));

  const patch = (index, changes) => update(items.map((it, i) => (i === index ? { ...it, ...changes } : it)));

  const move = (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    update(next);
  };

  const remove = (index) => update(items.filter((_, i) => i !== index));

  const patchChild = (index, childIndex, changes) => {
    const children = (items[index].children || []).map((c, i) => (i === childIndex ? { ...c, ...changes } : c));
    patch(index, { children });
  };

  const addChild = (index) => {
    const children = [...(items[index].children || []), newItem(`${items[index].id || 'sub'}`)];
    patch(index, { children });
  };

  const removeChild = (index, childIndex) => {
    patch(index, { children: (items[index].children || []).filter((_, i) => i !== childIndex) });
  };

  return (
    <div className="space-y-3">
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}

      {items.map((item, index) => (
        <div key={item.id || index} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-black text-slate-500">
              #{index + 1} · <span className="text-slate-400">{item.id}</span>
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => move(index, -1)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" aria-label="Yukarı taşı">
                <ArrowUp size={13} />
              </button>
              <button type="button" onClick={() => move(index, 1)} className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100" aria-label="Aşağı taşı">
                <ArrowDown size={13} />
              </button>
              <button type="button" onClick={() => remove(index)} className="p-1.5 rounded-lg border border-rose-200 text-rose-500 hover:bg-rose-50" aria-label="Menü öğesini sil">
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LANGS.map((l) => (
              <div key={l.code}>
                <label className={LABEL}>{l.flag} Menü Metni ({l.label})</label>
                <input
                  type="text"
                  value={item[`label${l.suffix}`] || ''}
                  onChange={(e) => patch(index, { [`label${l.suffix}`]: e.target.value })}
                  className={INPUT}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className={LABEL}>Link (URL)</label>
              <input
                type="text"
                dir="ltr"
                placeholder="/universities"
                value={item.url || ''}
                onChange={(e) => patch(index, { url: e.target.value })}
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>Görünürlük</label>
              <select
                value={item.enabled === false ? 'false' : 'true'}
                onChange={(e) => patch(index, { enabled: e.target.value === 'true' })}
                className={INPUT}
              >
                <option value="true">🟢 Menüde görünsün</option>
                <option value="false">⚪ Gizle</option>
              </select>
            </div>
            <div>
              <label className={LABEL}>Vurgulu Stil (turuncu rozet)</label>
              <select
                value={item.highlight ? 'true' : 'false'}
                onChange={(e) => patch(index, { highlight: e.target.value === 'true' })}
                className={INPUT}
              >
                <option value="false">Normal</option>
                <option value="true">Vurgulu</option>
              </select>
            </div>
          </div>

          {/* Alt menüler */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600">Alt Menü Öğeleri (açılır liste)</span>
              <button
                type="button"
                onClick={() => addChild(index)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition"
              >
                <Plus size={12} /> Alt Öğe
              </button>
            </div>

            {(item.children || []).map((child, cIdx) => (
              <div key={child.id || cIdx} className="bg-slate-50 rounded-xl border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <CornerDownRight size={12} /> alt öğe #{cIdx + 1}
                  </span>
                  <button type="button" onClick={() => removeChild(index, cIdx)} className="p-1 rounded-lg text-rose-500 hover:bg-rose-50" aria-label="Alt öğeyi sil">
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                  {LANGS.map((l) => (
                    <input
                      key={l.code}
                      type="text"
                      placeholder={`${l.flag} ${l.label}`}
                      value={child[`label${l.suffix}`] || ''}
                      onChange={(e) => patchChild(index, cIdx, { [`label${l.suffix}`]: e.target.value })}
                      className={INPUT}
                    />
                  ))}
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="/universities?type=PUBLIC"
                    value={child.url || ''}
                    onChange={(e) => patchChild(index, cIdx, { url: e.target.value })}
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
        onClick={() => update([...items, newItem('menu')])}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-amber-500 hover:bg-brand-amber-600 text-white text-[11px] font-bold transition"
      >
        <Plus size={14} />
        <span>Yeni Menü Öğesi</span>
      </button>
    </div>
  );
}
