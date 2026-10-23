// Araştırılan bölüm/fakülte verilerini veritabanına aktarır.
// Kullanım: node prisma/importDepartments.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prisma from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../scratch/uni-departments');

const BASIS = ['LISANS', 'LISANS_AND_ASSOCIATE', 'ALL_PROGRAMS', 'FACULTY_PAGES_SUMMED', 'UNVERIFIED'];

function loadRecords() {
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => /^part\d*\.json$/.test(f))
    .sort();

  const bySlug = new Map();
  for (const file of files) {
    let parsed;
    try {
      parsed = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
    } catch (err) {
      console.warn(`  ! ${file} okunamadı: ${err.message}`);
      continue;
    }
    const list = Array.isArray(parsed) ? parsed : parsed.records || [];
    console.log(`  · ${file}: ${list.length} kayıt`);
    for (const rec of list) {
      if (!rec?.slug) continue;
      const prev = bySlug.get(rec.slug);
      // Sayısı doğrulanmış kaydı her zaman tercih et.
      if (!prev || (!prev.departmentCount && rec.departmentCount)) bySlug.set(rec.slug, rec);
    }
  }
  return bySlug;
}

function loadTranslationMap(file) {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) return {};
  try {
    const parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (err) {
    console.warn(`  ! ${file} okunamadı: ${err.message}`);
    return {};
  }
}

const AR_PROGRAMS = loadTranslationMap('arabic-programs.json');
const AR_REASONS = loadTranslationMap('arabic-reasons.json');
const EN_REASONS = loadTranslationMap('english-reasons.json');

const isArabic = (text) => /[\u0600-\u06FF]/.test(String(text || ''));

function normalizeBest(list) {
  if (!Array.isArray(list)) return null;
  const cleaned = list
    .filter((item) => item && (item.tr || item.en || item.ar))
    .map((item) => {
      const tr = item.tr || item.en || item.ar || '';
      const reason = item.reason || '';
      return {
        tr,
        en: item.en || tr,
        ar: isArabic(item.ar) ? item.ar : AR_PROGRAMS[tr] || item.ar || tr,
        reason,
        reasonAr: isArabic(item.reasonAr) ? item.reasonAr : AR_REASONS[reason] || '',
        reasonEn: item.reasonEn || EN_REASONS[reason] || '',
      };
    });
  return cleaned.length > 0 ? JSON.stringify(cleaned) : null;
}

const toInt = (value) => {
  if (value === null || value === undefined || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? Math.round(n) : undefined;
};

async function main() {
  console.log('Bölüm verileri içe aktarılıyor...');
  const records = loadRecords();
  console.log(`Toplam benzersiz üniversite kaydı: ${records.size}\n`);

  let updated = 0;
  let notFound = 0;
  let withCount = 0;

  for (const [slug, rec] of records) {
    const university = await prisma.university.findUnique({ where: { slug }, select: { id: true, slug: true } });
    if (!university) {
      notFound += 1;
      console.log(`  ? Veritabanında yok: ${slug}`);
      continue;
    }

    const data = {};
    const departmentCount = toInt(rec.departmentCount);
    const facultyCount = toInt(rec.facultyCount);
    const programCountGrad = toInt(rec.programCountGrad);
    if (facultyCount !== undefined) data.facultyCount = facultyCount;
    if (programCountGrad !== undefined) data.programCountGrad = programCountGrad;
    if (departmentCount !== undefined) {
      data.departmentCount = departmentCount;
      data.departmentCountBasis = BASIS.includes(rec.departmentCountBasis) ? rec.departmentCountBasis : 'UNVERIFIED';
      withCount += 1;
    } else if (rec.departmentCountBasis && BASIS.includes(rec.departmentCountBasis)) {
      data.departmentCountBasis = rec.departmentCountBasis;
    }

    const best = normalizeBest(rec.bestDepartments);
    if (best) data.bestDepartments = best;

    if (rec.departmentSourceUrl || rec.sourceUrl) data.departmentSourceUrl = rec.departmentSourceUrl || rec.sourceUrl;
    if (rec.departmentDataAsOf || rec.asOf) data.departmentDataAsOf = new Date(rec.departmentDataAsOf || rec.asOf);

    await prisma.university.update({ where: { id: university.id }, data });
    updated += 1;
  }

  console.log(`\nGüncellenen üniversite: ${updated}`);
  console.log(`Doğrulanmış bölüm sayısıyla: ${withCount}`);
  console.log(`Veritabanında bulunamayan slug: ${notFound}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
