// One-off: add performance indexes to both Prisma schemas (idempotent).
import fs from 'fs';

const indexes = {
  University: ['@@index([published, ranking])', '@@index([published, featured, customOrder])', '@@index([city])', '@@index([type])'],
  UniversityReview: ['@@index([universityId, status])'],
  AcademicProgram: ['@@index([universityId, published])', '@@index([published, studyLanguage, degreeLevel])', '@@index([categoryId])'],
  StudentApplication: ['@@index([status, createdAt])'],
  Article: ['@@index([published])'],
  Scholarship: ['@@index([published])'],
};

for (const file of ['prisma/schema.prisma', 'prisma/schema.postgresql.prisma']) {
  let src = fs.readFileSync(file, 'utf8');
  for (const [model, lines] of Object.entries(indexes)) {
    const re = new RegExp(`(model ${model} \\{[\\s\\S]*?)\\n\\}`);
    const m = src.match(re);
    if (!m) { console.log(`[${file}] model ${model} not found`); continue; }
    const body = m[1];
    const hasField = (f) => lines.every((l) => true) && true;
    const toAdd = lines.filter((l) => !body.includes(l));
    // skip if a referenced field is missing in the model
    const valid = toAdd.filter((l) => l.match(/\[(.*)\]/)[1].split(',').every((f) => new RegExp(`^\\s+${f.trim()}\\s`, 'm').test(body)));
    if (valid.length < toAdd.length) console.log(`[${file}] ${model}: skipped ${toAdd.filter((l) => !valid.includes(l)).join(' ')} (missing field)`);
    if (!valid.length) continue;
    src = src.replace(re, `${body}\n\n  ${valid.join('\n  ')}\n}`);
    console.log(`[${file}] ${model}: +${valid.length}`);
  }
  fs.writeFileSync(file, src);
}
