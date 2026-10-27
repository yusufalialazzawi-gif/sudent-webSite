import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { loadAtlas, matchOne, facultiesOnly, lisansDepts, tokens } from './yokAtlasMatch.js';

const prisma = new PrismaClient();
const { entries } = loadAtlas();

const dbUnis = await prisma.university.findMany({
  include: { translations: { where: { lang: 'tr' } }, programs: { select: { id: true } } },
});

const matched = [];
const ambiguous = [];
const unmatched = [];

for (const db of dbUnis) {
  const trName = db.translations[0]?.name || '';
  const { hit, how, candidates } = matchOne(entries, { slug: db.slug, trName, city: db.city });

  if (!hit) {
    const row = { slug: db.slug, trName, city: db.city, how };
    if (how === 'ambiguous') {
      row.candidates = candidates.map((c) => `${c.universiteAdi} [${c.il}]`);
      ambiguous.push(row);
    } else {
      unmatched.push(row);
    }
    continue;
  }

  matched.push({
    slug: db.slug,
    how,
    universiteId: hit.universiteId,
    universiteAdi: hit.universiteAdi,
    dbCity: db.city,
    atlasCity: hit.il,
    dbType: db.type,
    atlasType: hit.universiteTuru === 'DEVLET' ? 'PUBLIC' : 'PRIVATE',
    existingPrograms: db.programs.length,
    existingFacultyCount: db.facultyCount,
    existingDepartmentCount: db.departmentCount,
    facultyCount: facultiesOnly(hit).length,
    departmentCount: new Set(lisansDepts(hit).map((d) => d.birimGrupId)).size,
    lisansRows: lisansDepts(hit).length,
  });
}

fs.writeFileSync(
  path.resolve('prisma/yokAtlasMatchReport.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), matched, ambiguous, unmatched }, null, 1)
);

const by = (h) => matched.filter((m) => m.how === h).length;
console.log(`db=${dbUnis.length}  matched=${matched.length} (exact ${by('exact')}, subset ${by('subset')}, subset+city ${by('subset+city')})  ambiguous=${ambiguous.length}  unmatched=${unmatched.length}`);

const typeBad = matched.filter((m) => m.dbType !== m.atlasType);
const cityBad = matched.filter((m) => ![...tokens(m.atlasCity)].some((t) => tokens(m.dbCity).has(t)));
console.log(`\ntype mismatch ${typeBad.length}:`);
for (const m of typeBad) console.log(`  ${m.slug}  db=${m.dbType} atlas=${m.atlasType}  (${m.universiteAdi})`);
console.log(`city mismatch ${cityBad.length}:`);
for (const m of cityBad) console.log(`  ${m.slug}  db=${m.dbCity} atlas=${m.atlasCity}`);

console.log('\nambiguous:');
for (const a of ambiguous) console.log(`  ${a.slug} (${a.trName}) -> ${a.candidates.slice(0, 4).join(' | ')}`);
console.log('\nunmatched:');
for (const u of unmatched) console.log(`  ${u.slug} (${u.trName}) [${u.city}]`);

await prisma.$disconnect();
