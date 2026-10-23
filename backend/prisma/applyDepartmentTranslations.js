// Mevcut "en iyi bölümler" kayıtlarındaki eksik Arapça/İngilizce çevirileri tamamlar.
// Kullanım: node prisma/applyDepartmentTranslations.js
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prisma from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '../../scratch/uni-departments');

function loadMap(file) {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) {
    console.log(`  · ${file} yok, atlanıyor`);
    return {};
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(full, 'utf8'));
    const map = parsed && typeof parsed === 'object' ? parsed : {};
    console.log(`  · ${file}: ${Object.keys(map).length} çeviri`);
    return map;
  } catch (err) {
    console.warn(`  ! ${file} okunamadı: ${err.message}`);
    return {};
  }
}

const AR_PROGRAMS = loadMap('arabic-programs.json');
const AR_REASONS = loadMap('arabic-reasons.json');
const EN_REASONS = loadMap('english-reasons.json');

const isArabic = (text) => /[\u0600-\u06FF]/.test(String(text || ''));

const missing = { arProgram: new Set(), arReason: new Set(), enReason: new Set() };

async function main() {
  console.log('Çeviri haritaları yükleniyor...');
  if (!Object.keys(AR_PROGRAMS).length && !Object.keys(AR_REASONS).length && !Object.keys(EN_REASONS).length) {
    console.log('Hiç çeviri dosyası bulunamadı, çıkılıyor.');
    return;
  }

  const rows = await prisma.university.findMany({
    where: { bestDepartments: { not: '[]' } },
    select: { id: true, slug: true, bestDepartments: true },
  });

  let touched = 0;
  let changedItems = 0;

  for (const row of rows) {
    let list;
    try {
      list = JSON.parse(row.bestDepartments || '[]');
    } catch {
      console.log(`  ! ${row.slug}: bestDepartments JSON değil`);
      continue;
    }
    if (!Array.isArray(list) || list.length === 0) continue;

    let dirty = false;
    const next = list.map((item) => {
      const tr = item.tr || item.en || '';
      const updated = { ...item };

      if (!isArabic(updated.ar)) {
        const mapped = AR_PROGRAMS[tr];
        if (mapped) {
          updated.ar = mapped;
          changedItems += 1;
          dirty = true;
        } else if (tr) {
          missing.arProgram.add(tr);
        }
      }

      const reason = item.reason || '';
      if (!isArabic(updated.reasonAr) && reason) {
        const mapped = AR_REASONS[reason];
        if (mapped) {
          updated.reasonAr = mapped;
          dirty = true;
        } else {
          missing.arReason.add(reason);
        }
      }

      if (!updated.reasonEn && reason) {
        const mapped = EN_REASONS[reason];
        if (mapped) {
          updated.reasonEn = mapped;
          dirty = true;
        } else {
          missing.enReason.add(reason);
        }
      }

      return updated;
    });

    if (dirty) {
      await prisma.university.update({
        where: { id: row.id },
        data: { bestDepartments: JSON.stringify(next) },
      });
      touched += 1;
    }
  }

  console.log(`\nGüncellenen üniversite: ${touched} / ${rows.length}`);
  console.log(`Çevirisi eklenen bölüm satırı: ${changedItems}`);
  console.log(`Karşılığı bulunamayan program adı: ${missing.arProgram.size}`);
  console.log(`Karşılığı bulunamayan Arapça açıklama: ${missing.arReason.size}`);
  console.log(`Karşılığı bulunamayan İngilizce açıklama: ${missing.enReason.size}`);
  if (missing.arProgram.size) console.log('  eksik programlar:', [...missing.arProgram].slice(0, 10).join(' | '));
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
