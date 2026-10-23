import fs from 'fs';
import path from 'path';
import prisma from '../src/config/db.js';

function cleanTokens(str) {
  return str
    .toLowerCase()
    .replace(/^[0-9]+[\s_-]*/, '')
    .replace(/\.[a-z0-9]+$/, '')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/[ıİiî]/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(
      (t) =>
        t &&
        t !== 'universitesi' &&
        t !== 'universite' &&
        t !== 'university' &&
        t !== 'enstitusu' &&
        t !== 'institute' &&
        t !== 've' &&
        t !== 'and'
    );
}

function matchFile(fileName, unis) {
  const fileTokens = cleanTokens(fileName);
  let bestMatch = null;
  let bestScore = -1;

  for (const u of unis) {
    const trName = u.translations.find((t) => t.lang === 'tr')?.name || '';
    const enName = u.translations.find((t) => t.lang === 'en')?.name || '';
    const uniTokens = new Set([
      ...cleanTokens(u.slug),
      ...cleanTokens(trName),
      ...cleanTokens(enName),
    ]);

    let commonCount = 0;
    for (const t of fileTokens) {
      if (uniTokens.has(t)) {
        commonCount += 2;
      } else {
        for (const ut of uniTokens) {
          if (ut.includes(t) || t.includes(ut)) {
            commonCount += 1;
            break;
          }
        }
      }
    }

    const score = commonCount * 10 - Math.abs(fileTokens.length - uniTokens.size);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = u;
    }
  }

  return { match: bestMatch, score: bestScore };
}

async function applyPhotos() {
  console.log('--- Applying Real University Photos from Desktop Folder & Zip ---');

  const unis = await prisma.university.findMany({
    include: { translations: true },
  });

  const stateDir = 'C:/Users/YUSUF/Desktop/universitelerr';
  const vakifDir = path.resolve('./uploads/temp_vakif');

  const backendDestDir = path.resolve('./uploads/universities');
  const frontendDestDir = path.resolve('../frontend/public/uploads/universities');

  if (!fs.existsSync(backendDestDir)) fs.mkdirSync(backendDestDir, { recursive: true });
  if (!fs.existsSync(frontendDestDir)) fs.mkdirSync(frontendDestDir, { recursive: true });

  const stateFiles = fs.readdirSync(stateDir).filter((f) => /\.(jpg|jpeg|png|svg|webp)$/i.test(f));
  const vakifFiles = fs.existsSync(vakifDir)
    ? fs.readdirSync(vakifDir).filter((f) => /\.(jpg|jpeg|png|svg|webp)$/i.test(f))
    : [];

  const allFiles = [
    ...stateFiles.map((x) => ({ file: x, dir: stateDir, group: 'Devlet Üniversitesi' })),
    ...vakifFiles.map((x) => ({ file: x, dir: vakifDir, group: 'Vakıf Üniversitesi' })),
  ];

  console.log(`Found ${stateFiles.length} state university photos and ${vakifFiles.length} foundation university photos.`);

  let updatedCount = 0;
  const appliedList = [];

  for (const item of allFiles) {
    const srcPath = path.join(item.dir, item.file);
    const { match } = matchFile(item.file, unis);

    if (match) {
      const ext = path.extname(item.file).toLowerCase();
      const targetFileName = `${match.slug}${ext}`;
      const backendTarget = path.join(backendDestDir, targetFileName);
      const frontendTarget = path.join(frontendDestDir, targetFileName);

      // Copy file
      fs.copyFileSync(srcPath, backendTarget);
      fs.copyFileSync(srcPath, frontendTarget);

      const coverImageUrl = `/uploads/universities/${targetFileName}`;

      // Update in DB
      await prisma.university.update({
        where: { id: match.id },
        data: { coverImageUrl },
      });

      updatedCount++;
      const nameTr = match.translations.find((t) => t.lang === 'tr')?.name || match.slug;
      appliedList.push({
        group: item.group,
        file: item.file,
        slug: match.slug,
        nameTr,
        coverImageUrl,
      });

      console.log(`[${updatedCount}] Updated: ${nameTr} (${match.slug}) -> ${coverImageUrl}`);
    } else {
      console.warn(`Could not match file: ${item.file}`);
    }
  }

  // Cleanup temp folder
  if (fs.existsSync(vakifDir)) {
    fs.rmSync(vakifDir, { recursive: true, force: true });
    console.log('Cleaned up temp_vakif folder.');
  }

  console.log(`\n🎉 Successfully applied real photos to ${updatedCount} universities!`);
  process.exit(0);
}

applyPhotos().catch((e) => {
  console.error('Error applying university photos:', e);
  process.exit(1);
});
