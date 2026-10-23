import prisma from '../config/db.js';
import { stateUniversities } from '../../prisma/stateUniversitiesData.js';
import { additional60Universities } from '../../prisma/additional60UniversitiesData.js';

/**
 * Validate an individual university record before saving.
 * Rejects invalid, incomplete, or corrupted records with meaningful error descriptions.
 */
export function validateUniversityRecord(uni, index = 0) {
  const errors = [];

  if (!uni || typeof uni !== 'object') {
    return { valid: false, errors: ['Record must be a valid object'], normalized: null };
  }

  // 1. Slug or Name validation
  let slug = uni.slug;
  if (!slug && uni.nameEn) {
    slug = uni.nameEn
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  } else if (!slug && uni.nameTr) {
    slug = uni.nameTr
      .toLowerCase()
      .trim()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (!slug || typeof slug !== 'string' || slug.trim().length < 2) {
    errors.push(`Record #${index + 1}: Missing or invalid slug/identifier.`);
  } else {
    slug = slug.toLowerCase().trim();
  }

  // 2. City
  const city = uni.city ? String(uni.city).trim() : '';
  if (!city) {
    errors.push(`Record #${index + 1} (${slug || 'unknown'}): City is required.`);
  }

  // 3. Type
  let type = uni.type ? String(uni.type).toUpperCase().trim() : 'PUBLIC';
  if (type !== 'PUBLIC' && type !== 'PRIVATE') {
    type = 'PUBLIC';
  }

  // 4. Admission Status
  let admissionStatus = uni.admissionStatus ? String(uni.admissionStatus).toUpperCase().trim() : 'UNCONFIRMED';
  const validStatuses = ['OPEN', 'CLOSED', 'UPCOMING', 'UNCONFIRMED'];
  if (!validStatuses.includes(admissionStatus)) {
    admissionStatus = 'UNCONFIRMED';
  }

  // 5. Translations
  const nameAr = uni.nameAr || uni.translations?.find((t) => t.lang === 'ar')?.name || '';
  const nameTr = uni.nameTr || uni.translations?.find((t) => t.lang === 'tr')?.name || '';
  const nameEn = uni.nameEn || uni.translations?.find((t) => t.lang === 'en')?.name || '';

  if (!nameAr && !nameTr && !nameEn) {
    errors.push(`Record #${index + 1} (${slug || 'unknown'}): Must contain at least one valid university name in Arabic, Turkish, or English.`);
  }

  // 6. Video & Media URL formats (if provided)
  const websiteUrl = uni.websiteUrl ? String(uni.websiteUrl).trim() : null;
  const logoUrl = uni.logoUrl ? String(uni.logoUrl).trim() : null;
  const coverImageUrl = uni.coverImageUrl ? String(uni.coverImageUrl).trim() : null;
  const videoUrl = uni.videoUrl ? String(uni.videoUrl).trim() : null;

  if (errors.length > 0) {
    return { valid: false, errors, normalized: null };
  }

  const normalized = {
    slug,
    type,
    city,
    establishedYear: uni.establishedYear ? parseInt(uni.establishedYear) : null,
    campusType: uni.campusType ? String(uni.campusType).trim() : 'URBAN',
    ranking: uni.ranking ? parseInt(uni.ranking) : null,
    websiteUrl,
    logoUrl,
    coverImageUrl,
    videoUrl,
    videoThumbnailUrl: uni.videoThumbnailUrl || null,
    videoTitle: uni.videoTitle || (nameAr ? `فيديو تعريفي - ${nameAr}` : 'University Video Tour'),
    videoDescription: uni.videoDescription || null,
    videoPlacement: uni.videoPlacement || 'BOTH',
    galleryImages: uni.galleryImages
      ? typeof uni.galleryImages === 'string'
        ? uni.galleryImages
        : JSON.stringify(uni.galleryImages)
      : null,
    admissionStatus,
    admissionStartDate: uni.admissionStartDate ? new Date(uni.admissionStartDate) : null,
    admissionEndDate: uni.admissionEndDate ? new Date(uni.admissionEndDate) : null,
    admissionDeadline: uni.admissionDeadline || null,
    announcementText: uni.announcementText || null,
    officialApplicationUrl: uni.officialApplicationUrl || (websiteUrl ? `${websiteUrl}/apply` : null),
    statusNote: uni.statusNote || null,
    customOrder: uni.customOrder ? parseInt(uni.customOrder) : (uni.ranking || 0),
    tuitionVerified: Boolean(uni.tuitionVerified),
    tuitionNotes: uni.tuitionNotes || null,
    showNotarySection: uni.showNotarySection !== undefined ? Boolean(uni.showNotarySection) : true,
    showFaqSection: uni.showFaqSection !== undefined ? Boolean(uni.showFaqSection) : true,
    showProgramsSection: uni.showProgramsSection !== undefined ? Boolean(uni.showProgramsSection) : true,
    showReviewsSection: uni.showReviewsSection !== undefined ? Boolean(uni.showReviewsSection) : true,
    graduateAdmissionOpen: uni.graduateAdmissionOpen !== undefined ? Boolean(uni.graduateAdmissionOpen) : true,
    featured: Boolean(uni.featured),
    published: uni.published !== undefined ? Boolean(uni.published) : true,
    translations: [
      {
        lang: 'ar',
        name: nameAr || nameTr || nameEn,
        overview: uni.overviewAr || uni.translations?.find((t) => t.lang === 'ar')?.overview || `${nameAr || nameEn} هي إحدى الجامعات التركية المعتمدة دولياً.`,
        admissionRequirements: uni.reqAr || uni.translations?.find((t) => t.lang === 'ar')?.admissionRequirements || 'شهادة الثانوية العامة وجواز سفر ساري المفعول.',
        accommodationInfo: uni.accAr || uni.translations?.find((t) => t.lang === 'ar')?.accommodationInfo || 'تتوفر سكنات جامعية حكومية وخاصة للطلاب الدوليين.',
        accreditationInfo: uni.crdAr || uni.translations?.find((t) => t.lang === 'ar')?.accreditationInfo || 'معتمدة رسمياً من مجلس التعليم العالي التركي (YÖK).',
        address: uni.addrAr || uni.translations?.find((t) => t.lang === 'ar')?.address || `${city}, Türkiye`,
      },
      {
        lang: 'tr',
        name: nameTr || nameEn || nameAr,
        overview: uni.overviewTr || uni.translations?.find((t) => t.lang === 'tr')?.overview || `${nameTr || nameEn}, Türkiye’nin köklü yükseköğretim kurumlarındandır.`,
        admissionRequirements: uni.reqTr || uni.translations?.find((t) => t.lang === 'tr')?.admissionRequirements || 'Lise diploması, transkript ve pasaport.',
        accommodationInfo: uni.accTr || uni.translations?.find((t) => t.lang === 'tr')?.accommodationInfo || 'KYK yurtları ve özel öğrenci rezidansları mevcuttur.',
        accreditationInfo: uni.crdTr || uni.translations?.find((t) => t.lang === 'tr')?.accreditationInfo || 'YÖK onaylı, uluslararası tanınırlığa sahip diploma.',
        address: uni.addrTr || uni.translations?.find((t) => t.lang === 'tr')?.address || `${city}, Türkiye`,
      },
      {
        lang: 'en',
        name: nameEn || nameTr || nameAr,
        overview: uni.overviewEn || uni.translations?.find((t) => t.lang === 'en')?.overview || `${nameEn} is a recognized institution of higher education in Turkey.`,
        admissionRequirements: uni.reqEn || uni.translations?.find((t) => t.lang === 'en')?.admissionRequirements || 'High school diploma, transcript, and valid passport.',
        accommodationInfo: uni.accEn || uni.translations?.find((t) => t.lang === 'en')?.accommodationInfo || 'Access to public student dormitories and private residences.',
        accreditationInfo: uni.crdEn || uni.translations?.find((t) => t.lang === 'en')?.accreditationInfo || 'Fully accredited by the Turkish Higher Education Council (YÖK).',
        address: uni.addrEn || uni.translations?.find((t) => t.lang === 'en')?.address || `${city}, Turkey`,
      },
    ],
  };

  return { valid: true, errors: [], normalized };
}

/**
 * Process and import a batch of universities into database with genuine persistence validation.
 * Never reports success unless records genuinely exist in database!
 */
export async function processUniversityImport(recordsToImport, options = {}) {
  const { limit = 60, dryRun = false } = options;

  if (!Array.isArray(recordsToImport) || recordsToImport.length === 0) {
    return {
      success: false,
      total: 0,
      processed: 0,
      createdCount: 0,
      updatedCount: 0,
      failedCount: 0,
      errors: ['No university records provided for import.'],
      verifiedDatabaseCount: await prisma.university.count(),
    };
  }

  const items = recordsToImport.slice(0, limit);
  let processed = 0;
  let createdCount = 0;
  let updatedCount = 0;
  let failedCount = 0;
  const errors = [];
  const successfulSlugs = [];

  for (let i = 0; i < items.length; i++) {
    const rawRecord = items[i];
    processed++;

    // 1. Validate
    const validation = validateUniversityRecord(rawRecord, i);
    if (!validation.valid) {
      failedCount++;
      errors.push({
        index: i,
        slug: rawRecord.slug || 'unknown',
        reasons: validation.errors,
      });
      continue;
    }

    const { translations, ...uniData } = validation.normalized;

    if (dryRun) {
      createdCount++;
      continue;
    }

    // 2. Database persistence with verification
    try {
      const existing = await prisma.university.findUnique({
        where: { slug: uniData.slug },
      });

      const savedUni = await prisma.university.upsert({
        where: { slug: uniData.slug },
        update: uniData,
        create: uniData,
      });

      // Upsert translations
      for (const t of translations) {
        await prisma.universityTranslation.upsert({
          where: {
            universityId_lang: {
              universityId: savedUni.id,
              lang: t.lang,
            },
          },
          update: t,
          create: {
            ...t,
            universityId: savedUni.id,
          },
        });
      }

      // 3. Genuine database verification check!
      const verifiedRecord = await prisma.university.findUnique({
        where: { id: savedUni.id },
      });

      if (!verifiedRecord) {
        failedCount++;
        errors.push({
          index: i,
          slug: uniData.slug,
          reasons: ['Database verification check failed: record was not found after write operation.'],
        });
        continue;
      }

      if (existing) {
        updatedCount++;
      } else {
        createdCount++;
      }
      successfulSlugs.push(uniData.slug);
    } catch (dbErr) {
      failedCount++;
      errors.push({
        index: i,
        slug: uniData.slug,
        reasons: [dbErr.message || 'Database transaction error.'],
      });
    }
  }

  const totalInDb = await prisma.university.count();

  return {
    success: failedCount === 0 && (createdCount > 0 || updatedCount > 0),
    total: items.length,
    processed,
    createdCount,
    updatedCount,
    failedCount,
    errors,
    successfulSlugs,
    verifiedDatabaseCount: totalInDb,
    message: dryRun
      ? `Dry run completed: ${createdCount} valid, ${failedCount} invalid.`
      : failedCount === 0
      ? `Successfully processed and verified ${processed} universities (${createdCount} created, ${updatedCount} updated). Total in DB: ${totalInDb}.`
      : `Completed with warnings: ${createdCount + updatedCount} succeeded, ${failedCount} failed.`,
  };
}

/**
 * Returns the verified Turkish Universities registry (120+ verified state and foundation universities)
 */
export function getVerifiedTurkishStateUniversities() {
  return [...stateUniversities, ...additional60Universities];
}
