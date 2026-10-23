import React from 'react';
import ImageInput from './ImageInput';
import JsonRowsEditor from './JsonRowsEditor';
import NavItemsEditor from './NavItemsEditor';
import LinkColumnsEditor from './LinkColumnsEditor';
import { LANGS, INPUT, LABEL, fieldLabel } from './editorUtils';

const isMultiline = (field) => {
  const d = field.defaults || {};
  const longest = Math.max(String(d.ar || '').length, String(d.tr || '').length, String(d.en || '').length, String(d.value || '').length);
  return field.type === 'textarea' || longest > 70;
};

// Katalogdaki tek bir ayar alanını tipine göre çizer.
export default function SettingField({ field, values, onChange, currentLanguage }) {
  const label = fieldLabel(field, currentLanguage);
  const hint = currentLanguage === 'ar' ? field.hintAr || field.hintTr : field.hintTr;
  const defaults = field.defaults || {};

  const renderInput = () => {
    switch (field.type) {
      case 'trilingual':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {LANGS.map((l) => {
              const key = `${field.key}_${l.code}`;
              const common = {
                value: values[key] ?? defaults[l.code] ?? '',
                placeholder: defaults[l.code] || '',
                onChange: (e) => onChange(key, e.target.value),
                className: INPUT,
              };
              return (
                <div key={l.code}>
                  <label className={LABEL}>{l.flag} {l.label}</label>
                  {isMultiline(field) ? <textarea rows={3} {...common} /> : <input type="text" {...common} />}
                </div>
              );
            })}
          </div>
        );

      case 'boolean':
        return (
          <select
            value={String(values[field.key] ?? defaults.value ?? 'true')}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={INPUT}
          >
            <option value="true">🟢 Açık</option>
            <option value="false">⚪ Kapalı</option>
          </select>
        );

      case 'select':
        return (
          <select
            value={String(values[field.key] ?? defaults.value ?? '')}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={INPUT}
          >
            {(field.options || []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={values[field.key] ?? defaults.value ?? ''}
            placeholder={defaults.value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={INPUT}
          />
        );

      case 'image':
        return (
          <ImageInput
            value={values[field.key] ?? defaults.value ?? ''}
            onChange={(v) => onChange(field.key, v)}
          />
        );

      case 'json-nav':
        return (
          <NavItemsEditor
            value={values[field.key] ?? defaults.value ?? '[]'}
            onChange={(v) => onChange(field.key, v)}
            hint={hint}
          />
        );

      case 'json-link-columns':
        return (
          <LinkColumnsEditor
            value={values[field.key] ?? defaults.value ?? '[]'}
            onChange={(v) => onChange(field.key, v)}
            hint={hint}
          />
        );

      case 'json-list':
      case 'json-images':
      case 'json-stats':
        return (
          <JsonRowsEditor
            type={field.type}
            value={values[field.key] ?? defaults.value ?? '[]'}
            onChange={(v) => onChange(field.key, v)}
            hint={hint}
          />
        );

      case 'color': {
        const colorKey = field.key;
        const colorValue = String(values[colorKey] ?? defaults.value ?? '#000000');
        return (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(colorValue) ? colorValue : '#000000'}
              onChange={(e) => onChange(colorKey, e.target.value)}
              className="h-9 w-12 rounded-lg border border-slate-200 bg-white cursor-pointer p-1"
            />
            <input
              type="text"
              dir="ltr"
              value={colorValue}
              onChange={(e) => onChange(colorKey, e.target.value)}
              className={`${INPUT} text-start`}
            />
          </div>
        );
      }

      case 'url':
        return (
          <input
            type="text"
            dir="ltr"
            value={values[field.key] ?? defaults.value ?? ''}
            placeholder={defaults.value || 'https://'}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={`${INPUT} text-start`}
          />
        );

      default:
        return isMultiline(field) ? (
          <textarea
            rows={3}
            value={values[field.key] ?? defaults.value ?? ''}
            placeholder={defaults.value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={INPUT}
          />
        ) : (
          <input
            type="text"
            value={values[field.key] ?? defaults.value ?? ''}
            placeholder={defaults.value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            className={INPUT}
          />
        );
    }
  };

  const isComplex = field.type?.startsWith('json');

  return (
    <div className={isComplex ? 'pt-4 border-t border-slate-100 space-y-2' : 'space-y-1'}>
      {!isComplex && <label className={LABEL}>{label}</label>}
      {isComplex && (
        <div>
          <h4 className="text-xs font-black text-slate-800 font-cairo">{label}</h4>
          {hint && <p className="text-[11px] text-slate-500 mb-2">{hint}</p>}
        </div>
      )}
      {renderInput()}
      {!isComplex && hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}
