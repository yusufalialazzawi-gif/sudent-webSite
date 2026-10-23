import fs from 'fs';
import path from 'path';
import prisma from '../src/config/db.js';

async function updateSeedFiles() {
  // Ensure istanbul-universitesi also has local photo
  const backendSrc = path.resolve('uploads/universities/istanbul-university.jpg');
  const backendDest = path.resolve('uploads/universities/istanbul-universitesi.jpg');
  const frontendDest = path.resolve('../frontend/public/uploads/universities/istanbul-universitesi.jpg');

  if (fs.existsSync(backendSrc)) {
    fs.copyFileSync(backendSrc, backendDest);
    fs.copyFileSync(backendSrc, frontendDest);
    console.log('Copied istanbul-universitesi.jpg');
  }

  const existingUni = await prisma.university.findUnique({
    where: { slug: 'istanbul-universitesi' },
  });
  if (existingUni) {
    await prisma.university.update({
      where: { slug: 'istanbul-universitesi' },
      data: { coverImageUrl: '/uploads/universities/istanbul-universitesi.jpg' },
    });
    console.log('Updated DB for istanbul-universitesi');
  }

  console.log('Fetching universities with local coverImageUrl from database...');
  const unis = await prisma.university.findMany({
    where: { coverImageUrl: { startsWith: '/uploads/universities/' } },
    select: { slug: true, coverImageUrl: true },
  });

  console.log(`Found ${unis.length} universities with local coverImageUrl.`);

  // 1. Update stateUniversitiesData.js
  const statePath = path.resolve('prisma/stateUniversitiesData.js');
  if (fs.existsSync(statePath)) {
    let stateContent = fs.readFileSync(statePath, 'utf8');
    let stateMatches = 0;

    for (const u of unis) {
      const pattern = new RegExp(
        `(slug:\\s*['"]${u.slug}['"][\\s\\S]*?coverImageUrl:\\s*['"])([^'"]+)(['"])`,
        'g'
      );
      if (pattern.test(stateContent)) {
        stateContent = stateContent.replace(pattern, `$1${u.coverImageUrl}$3`);
        stateMatches++;
      }
    }
    fs.writeFileSync(statePath, stateContent, 'utf8');
    console.log(`Updated ${stateMatches} coverImageUrl entries in stateUniversitiesData.js`);
  }

  // 2. Update seed.js
  const seedPath = path.resolve('prisma/seed.js');
  if (fs.existsSync(seedPath)) {
    let seedContent = fs.readFileSync(seedPath, 'utf8');
    let seedMatches = 0;

    for (const u of unis) {
      const pattern = new RegExp(
        `(slug:\\s*['"]${u.slug}['"][\\s\\S]*?coverImageUrl:\\s*['"])([^'"]+)(['"])`,
        'g'
      );
      if (pattern.test(seedContent)) {
        seedContent = seedContent.replace(pattern, `$1${u.coverImageUrl}$3`);
        seedMatches++;
      }
    }
    fs.writeFileSync(seedPath, seedContent, 'utf8');
    console.log(`Updated ${seedMatches} coverImageUrl entries in seed.js`);
  }

  console.log('Done updating seed files!');
  process.exit(0);
}

updateSeedFiles().catch((err) => {
  console.error(err);
  process.exit(1);
});
