import React from 'react';
import { BookOpen, Info } from 'lucide-react';
import BestDepartmentsEditor from './BestDepartmentsEditor';

// Üniversite formu — "Bölümler" sekmesi: kaç bölümü var + en iyi bölümleri (güncel veri).
const BASIS_OPTIONS = [
  { value: 'LISANS', label: 'Lisans bölümleri (YÖK Atlas / resmî site)' },
  { value: 'LISANS_AND_ASSOCIATE', label: 'Lisans + ön lisans birlikte' },
  { value: 'ALL_PROGRAMS', label: 'Tüm programlar (lisans + lisansüstü)' },
  { value: 'FACULTY_PAGES_SUMMED', label: 'Fakülte sayfalarından toplanmış sayı' },
  { value: 'UNVERIFIED', label: 'Doğrulanmadı (yaklaşık)' },
];

export default function DepartmentsFormSection({ form, setForm }) {
  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-5">
      <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 flex gap-2">
        <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-amber-900 leading-relaxed">
          Bu bilgiler öğrenciye üniversite detay sayfasında "Kaç bölümü var?" ve "En iyi bölümleri" olarak gösterilir.
          Sayıları üniversitenin resmî sitesindeki güncel akademik birim listesinden girin ve kaynak linkini ekleyin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Bölüm Sayısı (lisans)</label>
          <input
            type="number"
            min="0"
            value={form.departmentCount ?? ''}
            onChange={(e) => set('departmentCount', e.target.value)}
            placeholder="örn. 64"
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Fakülte Sayısı</label>
          <input
            type="number"
            min="0"
            value={form.facultyCount ?? ''}
            onChange={(e) => set('facultyCount', e.target.value)}
            placeholder="örn. 12"
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Lisansüstü Program Sayısı</label>
          <input
            type="number"
            min="0"
            value={form.programCountGrad ?? ''}
            onChange={(e) => set('programCountGrad', e.target.value)}
            placeholder="örn. 90"
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Sayının Dayanağı</label>
          <select
            value={form.departmentCountBasis || 'LISANS'}
            onChange={(e) => set('departmentCountBasis', e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white"
          >
            {BASIS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Kaynak Linki (resmî site)</label>
          <input
            type="text"
            value={form.departmentSourceUrl || ''}
            onChange={(e) => set('departmentSourceUrl', e.target.value)}
            placeholder="https://www.ornek.edu.tr/akademik-birimler"
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Bilgi Tarihi (güncellik)</label>
          <input
            type="date"
            value={form.departmentDataAsOf || ''}
            onChange={(e) => set('departmentDataAsOf', e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
          />
        </div>
      </div>

      <div className="border-t border-slate-200 pt-5">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-3">
          <BookOpen size={15} className="text-brand-amber-500" />
          En İyi Bölümleri (3 dilde)
        </h4>
        <BestDepartmentsEditor value={form.bestDepartments} onChange={(next) => set('bestDepartments', next)} />
      </div>
    </div>
  );
}
