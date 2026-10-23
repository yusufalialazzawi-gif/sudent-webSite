import prisma from '../src/config/db.js';
import { flattenDefaultSettings, HOME_SECTION_CATALOG } from '../src/config/settingsSchema.js';

// Sadece EKSİK ayarları ekler; admin'in kaydettiği değerlerin üzerine yazmaz.
async function seedSettings() {
  const rows = flattenDefaultSettings();
  const existing = await prisma.siteSetting.findMany({ select: { key: true, group: true } });
  const existingByKey = new Map(existing.map((e) => [e.key, e.group]));

  let created = 0;
  for (const row of rows) {
    if (existingByKey.has(row.key)) continue;
    await prisma.siteSetting.create({ data: row });
    created += 1;
  }

  // Grubu eski kalan kayıtları kataloğa göre düzelt (değere dokunmadan)
  let regrouped = 0;
  for (const row of rows) {
    if (existingByKey.get(row.key) === undefined || existingByKey.get(row.key) === row.group) continue;
    await prisma.siteSetting.update({ where: { key: row.key }, data: { group: row.group } });
    regrouped += 1;
  }

  console.log(`SiteSetting: ${created} yeni ayar eklendi, ${regrouped} kayıt yeniden gruplandı (toplam katalog: ${rows.length}).`);
}

async function seedHomeSections() {
  let created = 0;
  for (const section of HOME_SECTION_CATALOG) {
    const exists = await prisma.pageSection.findUnique({
      where: { pageName_sectionKey: { pageName: 'home', sectionKey: section.sectionKey } },
    });
    if (exists) continue;
    await prisma.pageSection.create({
      data: {
        pageName: 'home',
        sectionKey: section.sectionKey,
        sectionType: section.sectionType,
        titleTr: section.titleTr,
        titleAr: section.titleAr,
        titleEn: section.titleEn,
        sortOrder: section.order,
        isEnabled: true,
      },
    });
    created += 1;
  }
  console.log(`PageSection(home): ${created} yeni bölüm eklendi (katalog: ${HOME_SECTION_CATALOG.length}).`);
}

async function main() {
  await seedSettings();
  await seedHomeSections();
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
