import fs from 'fs';
import path from 'path';

const API = 'https://yokatlas.yok.gov.tr/api';
const PAGE_SIZE = 2000;
const OUT = path.resolve('prisma/yokAtlasAggregate.json');

async function post(endpoint, body) {
  const res = await fetch(API + endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${endpoint} -> ${res.status}`);
  return res.json();
}

const year = await fetch(`${API}/parameters/yil`).then((r) => r.text());

const universities = new Map();

function bucket(row) {
  let u = universities.get(row.universiteId);
  if (!u) {
    u = {
      universiteId: row.universiteId,
      universiteAdi: row.universiteAdi,
      universiteTuru: row.universiteTuru,
      il: row.uniIlAdi,
      ilce: row.uniIlceAdi,
      akreditasyon: row.uniAkreditasyon || null,
      faculties: new Map(),
      departments: new Map(),
    };
    universities.set(row.universiteId, u);
  }
  if (row.fymkId && !u.faculties.has(row.fymkId)) u.faculties.set(row.fymkId, row.fymkAdi);

  // A "department" is the program group (Tıp), not each scholarship variant
  // (Tıp (İngilizce) (Burslu) / (Ücretli) / (%50 İndirimli)).
  const key = `${row.birimGrupId}|${row.birimTuruAdi}|${row.ogrenimDiliAdi}`;
  const existing = u.departments.get(key);
  if (!existing) {
    u.departments.set(key, {
      birimGrupId: row.birimGrupId,
      name: row.birimGrupAdi,
      facultyName: row.fymkAdi || null,
      level: row.birimTuruAdi,
      language: row.ogrenimDiliAdi || null,
      durationYears: row.ogrenimSuresi || null,
      scoreType: row.puanTuru || null,
      quota: row.kontenjan || 0,
      minScore: typeof row.minPuan === 'number' && row.minPuan > 0 ? row.minPuan : null,
      accreditation: row.akreditasyon || null,
    });
  } else {
    existing.quota += row.kontenjan || 0;
    if (typeof row.minPuan === 'number' && row.minPuan > 0) {
      existing.minScore = existing.minScore === null ? row.minPuan : Math.min(existing.minScore, row.minPuan);
    }
    if (!existing.accreditation && row.akreditasyon) existing.accreditation = row.akreditasyon;
  }
}

let page = 0;
let totalPages = 1;
let rows = 0;

while (page < totalPages) {
  const data = await post('/tercih-kilavuz/search', { page, size: PAGE_SIZE });
  totalPages = data.totalPages;
  for (const row of data.content) {
    bucket(row);
    rows++;
  }
  page++;
  process.stdout.write(`\rpage ${page}/${totalPages}  rows ${rows}  universities ${universities.size}   `);
}
process.stdout.write('\n');

const out = {
  source: 'YÖK Atlas (yokatlas.yok.gov.tr) — Tercih Kılavuzu',
  sourceUrl: 'https://yokatlas.yok.gov.tr/',
  guideYear: Number(year) || null,
  fetchedAt: new Date().toISOString(),
  totalRows: rows,
  note:
    'Fakülte ve bölüm sayıları YKS tercih kılavuzunda o yıl kontenjan açan birimleri kapsar; ' +
    'üniversitenin kayıtlı tüm fakülte sayısı bundan yüksek olabilir.',
  universities: [...universities.values()]
    .map((u) => ({
      universiteId: u.universiteId,
      universiteAdi: u.universiteAdi,
      universiteTuru: u.universiteTuru,
      il: u.il,
      ilce: u.ilce,
      akreditasyon: u.akreditasyon,
      facultyCount: u.faculties.size,
      facultyNames: [...u.faculties.values()].sort(),
      departmentCount: new Set([...u.departments.values()].map((d) => d.birimGrupId)).size,
      departments: [...u.departments.values()].sort((a, b) => a.name.localeCompare(b.name, 'tr')),
    }))
    .sort((a, b) => a.universiteAdi.localeCompare(b.universiteAdi, 'tr')),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 1));

const levels = {};
for (const u of out.universities) for (const d of u.departments) levels[d.level] = (levels[d.level] || 0) + 1;

console.log(`\nwrote ${OUT}`);
console.log(`guide year      ${out.guideYear}`);
console.log(`universities    ${out.universities.length}`);
console.log(`program rows    ${rows}`);
console.log(`levels          ${JSON.stringify(levels)}`);
console.log(`size            ${(fs.statSync(OUT).size / 1024 / 1024).toFixed(1)} MB`);
