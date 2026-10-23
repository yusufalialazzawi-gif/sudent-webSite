import prisma from '../src/config/db.js';
import { additional60Universities } from './additional60UniversitiesData.js';
import { processUniversityImport } from '../src/services/universityImportService.js';

async function seed60MoreUniversities() {
  console.log('=== SEEDING 60 MORE ACCREDITED TURKISH UNIVERSITIES ===');

  const countBefore = await prisma.university.count();
  console.log(`Universities in Database BEFORE import: ${countBefore}`);
  console.log(`Total new universities in registry: ${additional60Universities.length}`);

  if (additional60Universities.length !== 60) {
    throw new Error(`Expected exactly 60 universities in registry, found ${additional60Universities.length}`);
  }

  // Use the verified import service with strict DB validation
  const result = await processUniversityImport(additional60Universities, {
    limit: 60,
    dryRun: false
  });

  console.log('\n--- Import Execution Results ---');
  console.log(`Success: ${result.success}`);
  console.log(`Processed: ${result.processed}`);
  console.log(`Created: ${result.createdCount}`);
  console.log(`Updated: ${result.updatedCount}`);
  console.log(`Failed: ${result.failedCount}`);

  if (result.errors && result.errors.length > 0) {
    console.error('Errors encountered:', result.errors);
  }

  const countAfter = await prisma.university.count();
  console.log(`\nUniversities in Database AFTER import: ${countAfter}`);
  console.log(`Net Universities Added: ${countAfter - countBefore}`);

  if (countAfter !== countBefore + 60) {
    console.warn(`Note: Some slugs may have existed and were updated. Verified DB Count: ${countAfter}`);
  } else {
    console.log('✅ Exactly 60 additional universities successfully created and verified in database!');
  }

  // Sample check 3 newly added universities
  const samples = await prisma.university.findMany({
    where: {
      slug: {
        in: ['bilkent-university', 'yeditepe-university', 'galatasaray-universitesi']
      }
    },
    include: {
      translations: true
    }
  });

  console.log('\n--- Verification of Sample Imported Universities ---');
  samples.forEach(s => {
    const trName = s.translations.find(t => t.lang === 'tr')?.name;
    const arName = s.translations.find(t => t.lang === 'ar')?.name;
    console.log(`[${s.type}] ${s.slug} - TR: "${trName}" | AR: "${arName}" | Video: ${s.videoUrl ? 'YES' : 'NO'}`);
  });

  process.exit(0);
}

seed60MoreUniversities().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
