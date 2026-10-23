// Converts university cover photos to resized WebP, updates DB paths + seed files,
// and removes the heavy originals (originals still exist in the user's source folder).
// Usage (from backend/): node scripts/optimizeUniversityImages.js
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import prisma from '../src/config/db.js';

const dirs = [path.resolve('uploads/universities'), path.resolve('../frontend/public/uploads/universities')];
const MAX_W = 1000;
let before = 0, after = 0;

const files = fs.readdirSync(dirs[0]).filter((f) => /\.(jpe?g|png)$/i.test(f));
for (const f of files) {
  const src = path.join(dirs[0], f);
  const base = f.replace(/\.[^.]+$/, '');
  const out = `${base}.webp`;
  const buf = await sharp(src).rotate().resize({ width: MAX_W, withoutEnlargement: true }).webp({ quality: 76 }).toBuffer();
  before += fs.statSync(src).size;
  after += buf.length;
  for (const d of dirs) {
    fs.writeFileSync(path.join(d, out), buf);
    const old = path.join(d, f);
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }
  await prisma.university.updateMany({
    where: { coverImageUrl: `/uploads/universities/${f}` },
    data: { coverImageUrl: `/uploads/universities/${out}` },
  });
}

// keep seed sources in sync so re-seeding does not restore heavy files
for (const file of ['prisma/stateUniversitiesData.js', 'prisma/seed.js']) {
  const p = path.resolve(file);
  const s = fs.readFileSync(p, 'utf8').replace(/(\/uploads\/universities\/[^'"]+)\.(jpe?g|png)/gi, '$1.webp');
  fs.writeFileSync(p, s);
}

console.log(`Converted ${files.length} files: ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB`);
await prisma.$disconnect();
