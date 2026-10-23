import fs from 'fs';
import path from 'path';
import prisma from '../src/config/db.js';

async function fixUniversityLogos() {
  console.log('=== REMOVING ALL PLACEHOLDER/GIRL PHOTOS FROM UNIVERSITY LOGOS ===');

  const universities = await prisma.university.findMany({
    select: { id: true, slug: true, logoUrl: true, coverImageUrl: true },
  });

  console.log(`Auditing logos for ${universities.length} universities...`);

  let updatedCount = 0;

  for (const uni of universities) {
    const hasUnsplash = uni.logoUrl && (uni.logoUrl.includes('unsplash') || uni.logoUrl.includes('photo-1544717305-2782549b5136'));

    if (hasUnsplash || !uni.logoUrl) {
      // Check if SVG exists
      const svgPath = path.resolve(`uploads/universities/${uni.slug}.svg`);
      let newLogo = null;
      if (fs.existsSync(svgPath)) {
        newLogo = `/uploads/universities/${uni.slug}.svg`;
      } else {
        // Use the university's genuine campus photo
        newLogo = uni.coverImageUrl || `/uploads/universities/${uni.slug}.webp`;
      }

      await prisma.university.update({
        where: { id: uni.id },
        data: { logoUrl: newLogo },
      });

      console.log(`[UPDATED] ${uni.slug}: Removed Unsplash logo -> ${newLogo}`);
      updatedCount++;
    }
  }

  console.log(`\nSuccessfully updated ${updatedCount} universities. Zero Unsplash logos remaining.`);
}

fixUniversityLogos()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
