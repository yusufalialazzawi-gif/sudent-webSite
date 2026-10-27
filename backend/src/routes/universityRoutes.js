import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { completeTranslations } from '../utils/translations.js';
import { requireRole, auditLog } from '../middleware/rbac.js';
import {
  processUniversityImport,
  getVerifiedTurkishStateUniversities,
} from '../services/universityImportService.js';
import { videoUpload } from '../middleware/upload.js';

const router = express.Router();

// GET /api/universities - Public listing with filtering, sorting & pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      city,
      type,
      language,
      degreeLevel,
      featured,
      admissionStatus,
      graduateAdmissionOpen,
      page = 1,
      limit = 12,
      sortBy = 'ranking',
      order = 'asc',
      lang = 'ar',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      published: true,
    };

    if (city) {
      where.city = { equals: city };
    }
    if (type) {
      where.type = { equals: type.toUpperCase() };
    }
    if (featured === 'true') {
      where.featured = true;
    }
    if (admissionStatus) {
      where.admissionStatus = { equals: admissionStatus.toUpperCase() };
    }
    if (graduateAdmissionOpen === 'true') {
      where.graduateAdmissionOpen = true;
    }

    if (search) {
      where.OR = [
        { slug: { contains: search } },
        { city: { contains: search } },
        {
          translations: {
            some: {
              name: { contains: search },
            },
          },
        },
      ];
    }

    // Filter by program criteria if provided
    if (language || degreeLevel) {
      where.programs = {
        some: {
          published: true,
          ...(language && { studyLanguage: { equals: language.toUpperCase() } }),
          ...(degreeLevel && { degreeLevel: { equals: degreeLevel.toUpperCase() } }),
        },
      };
    }

    const orderBy = [];
    if (featured === 'true') {
      orderBy.push({ customOrder: 'asc' });
    }

    if (sortBy === 'ranking') {
      orderBy.push({ ranking: order.toLowerCase() === 'desc' ? 'desc' : 'asc' });
    } else if (sortBy === 'establishedYear') {
      orderBy.push({ establishedYear: order.toLowerCase() === 'asc' ? 'asc' : 'desc' });
    } else {
      orderBy.push({ createdAt: 'desc' });
    }

    const [total, universities] = await Promise.all([
      prisma.university.count({ where }),
      prisma.university.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          translations: {
            where: { lang: { in: [lang, 'ar', 'en', 'tr'] } },
          },
          _count: {
            select: {
              programs: { where: { published: true } },
              reviews: { where: { status: 'APPROVED' } },
            },
          },
          programs: {
            where: { published: true },
            take: 3,
            select: {
              id: true,
              slug: true,
              degreeLevel: true,
              studyLanguage: true,
              annualTuition: true,
              discountedTuition: true,
              currency: true,
              translations: {
                where: { lang: { in: [lang, 'ar', 'en', 'tr'] } },
                select: { name: true, lang: true },
              },
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: universities,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/universities/announcements - Universities with active announcements or open admission status
router.get('/announcements', async (req, res, next) => {
  try {
    const { lang = 'ar', limit = 20 } = req.query;

    const announcements = await prisma.university.findMany({
      where: {
        published: true,
        OR: [
          { announcementText: { not: null } },
          { admissionStatus: { in: ['OPEN', 'UPCOMING'] } },
        ],
      },
      take: parseInt(limit),
      orderBy: [
        { featured: 'desc' },
        { ranking: 'asc' },
      ],
      include: {
        translations: {
          where: { lang: { in: [lang, 'ar', 'tr', 'en'] } },
        },
        _count: {
          select: {
            programs: {
              where: {
                published: true,
                degreeLevel: { in: ['MASTER_WITH_THESIS', 'MASTER_NON_THESIS', 'PHD'] },
              },
            },
            reviews: { where: { status: 'APPROVED' } },
          },
        },
      },
    });

    res.json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/universities/:slug - Public detail page with complete 11-section architecture
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { lang = 'ar' } = req.query;

    const university = await prisma.university.findUnique({
      where: { slug },
      include: {
        translations: true,
        programs: {
          where: { published: true },
          include: {
            category: true,
            translations: true,
          },
          orderBy: { annualTuition: 'asc' },
        },
        scholarships: {
          where: { published: true },
          include: {
            translations: true,
          },
        },
        reviews: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!university || !university.published) {
      return res.status(404).json({ success: false, message: 'University not found.' });
    }

    // Related universities in the same city or classification
    const related = await prisma.university.findMany({
      where: {
        id: { not: university.id },
        published: true,
        OR: [{ city: university.city }, { type: university.type }],
      },
      take: 5,
      include: {
        translations: { where: { lang: { in: [lang, 'ar', 'tr', 'en'] } } },
      },
    });

    res.json({
      success: true,
      data: university,
      related,
    });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN ROUTES ================= //

// GET /api/universities/admin/all - Admin university listing with full details
router.get('/admin/all', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const universities = await prisma.university.findMany({
      orderBy: [{ customOrder: 'asc' }, { ranking: 'asc' }, { createdAt: 'desc' }],
      include: {
        translations: true,
        _count: {
          select: { programs: true, reviews: true },
        },
      },
    });

    res.json({ success: true, data: universities });
  } catch (error) {
    next(error);
  }
});

// GET /api/universities/admin/import-registry - Registry preview and database status
router.get('/admin/import-registry', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const registry = getVerifiedTurkishStateUniversities();
    const currentCount = await prisma.university.count();

    res.json({
      success: true,
      data: registry,
      totalRegistryRecords: registry.length,
      currentDatabaseCount: currentCount,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/universities/admin/import-batch - Import 60 universities with server-side validation and genuine persistence check
router.post('/admin/import-batch', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { mode = 'REGISTRY_60', universities = [], limit = 60, dryRun = false } = req.body;

    let itemsToProcess = [];
    if (mode === 'REGISTRY_60') {
      itemsToProcess = getVerifiedTurkishStateUniversities();
    } else {
      itemsToProcess = universities;
    }

    if (!itemsToProcess || itemsToProcess.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No university data provided for import.',
        total: 0,
        processed: 0,
        createdCount: 0,
        updatedCount: 0,
        failedCount: 0,
        errors: ['Import dataset was empty.'],
      });
    }

    const result = await processUniversityImport(itemsToProcess, { limit, dryRun });

    await auditLog(
      prisma,
      req.user.id,
      'IMPORT_UNIVERSITIES_BATCH',
      'University',
      null,
      `Import batch: ${result.createdCount} created, ${result.updatedCount} updated, ${result.failedCount} failed`,
      req.ip
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
});

// POST /api/universities/admin/upload-video - Admin video upload for university
router.post(
  '/admin/upload-video',
  authenticate,
  requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']),
  videoUpload.single('video'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'Lütfen bir video dosyası seçin (MP4, WebM, MOV).' });
      }

      const fileUrl = `/uploads/${req.file.filename}`;

      // Register asset in MediaAsset table
      try {
        await prisma.mediaAsset.create({
          data: {
            fileName: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            url: fileUrl,
            assetType: 'VIDEO',
            altTextTr: `Üniversite Tanıtım Videosu: ${req.file.originalname}`,
            altTextAr: `فيديو تعريفي للجامعة: ${req.file.originalname}`,
            altTextEn: `University Video: ${req.file.originalname}`,
          },
        });
      } catch (assetErr) {
        console.warn('Could not register in mediaAsset table:', assetErr.message);
      }

      await auditLog(
        prisma,
        req.user.id,
        'UPLOAD_UNIVERSITY_VIDEO',
        'University',
        null,
        `Uploaded video: ${req.file.originalname} (${(req.file.size / (1024 * 1024)).toFixed(2)} MB)`,
        req.ip
      );

      res.status(201).json({
        success: true,
        data: {
          videoUrl: fileUrl,
          fileName: req.file.filename,
          originalName: req.file.originalname,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/universities/admin - Create university
router.post('/admin', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const {
      slug,
      type,
      city,
      establishedYear,
      campusType,
      ranking,
      websiteUrl,
      logoUrl,
      coverImageUrl,
      videoUrl,
      videoThumbnailUrl,
      videoTitle,
      videoDescription,
      videoPlacement,
      galleryImages,
      admissionStatus,
      admissionStartDate,
      admissionEndDate,
      admissionDeadline,
      announcementText,
      officialApplicationUrl,
      statusNote,
      customOrder,
      tuitionVerified,
      tuitionNotes,
      departmentCount,
      facultyCount,
      programCountGrad,
      departmentCountBasis,
      bestDepartments,
      departmentSourceUrl,
      departmentDataAsOf,
      showNotarySection,
      showFaqSection,
      showProgramsSection,
      showReviewsSection,
      graduateAdmissionOpen,
      featured,
      published,
      translations = [],
    } = req.body;

    if (!slug || !city) {
      return res.status(400).json({ success: false, message: 'Slug and city are required.' });
    }

    const created = await prisma.university.create({
      data: {
        slug: slug.toLowerCase().trim(),
        type: type || 'PRIVATE',
        city,
        establishedYear: establishedYear ? parseInt(establishedYear) : null,
        campusType: campusType || 'URBAN',
        ranking: ranking ? parseInt(ranking) : null,
        websiteUrl,
        logoUrl,
        coverImageUrl,
        videoUrl: videoUrl || null,
        videoThumbnailUrl: videoThumbnailUrl || null,
        videoTitle: videoTitle || null,
        videoDescription: videoDescription || null,
        videoPlacement: videoPlacement || 'BOTH',
        galleryImages: galleryImages ? (typeof galleryImages === 'string' ? galleryImages : JSON.stringify(galleryImages)) : null,
        admissionStatus: admissionStatus || 'UNCONFIRMED',
        admissionStartDate: admissionStartDate ? new Date(admissionStartDate) : null,
        admissionEndDate: admissionEndDate ? new Date(admissionEndDate) : null,
        admissionDeadline: admissionDeadline || null,
        announcementText: announcementText || null,
        officialApplicationUrl: officialApplicationUrl || null,
        statusNote: statusNote || null,
        customOrder: customOrder !== undefined ? parseInt(customOrder) : 0,
        tuitionVerified: Boolean(tuitionVerified),
        tuitionNotes: tuitionNotes || null,
        departmentCount: departmentCount !== undefined && departmentCount !== null && departmentCount !== '' ? parseInt(departmentCount) : null,
        facultyCount: facultyCount !== undefined && facultyCount !== null && facultyCount !== '' ? parseInt(facultyCount) : null,
        programCountGrad: programCountGrad !== undefined && programCountGrad !== null && programCountGrad !== '' ? parseInt(programCountGrad) : null,
        departmentCountBasis: departmentCountBasis || null,
        bestDepartments: bestDepartments ? (typeof bestDepartments === 'string' ? bestDepartments : JSON.stringify(bestDepartments)) : null,
        departmentSourceUrl: departmentSourceUrl || null,
        departmentDataAsOf: departmentDataAsOf ? new Date(departmentDataAsOf) : null,
        showNotarySection: showNotarySection !== undefined ? Boolean(showNotarySection) : true,
        showFaqSection: showFaqSection !== undefined ? Boolean(showFaqSection) : true,
        showProgramsSection: showProgramsSection !== undefined ? Boolean(showProgramsSection) : true,
        showReviewsSection: showReviewsSection !== undefined ? Boolean(showReviewsSection) : true,
        graduateAdmissionOpen: graduateAdmissionOpen !== undefined ? Boolean(graduateAdmissionOpen) : true,
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        translations: {
          create: completeTranslations(translations, 'name').map((t) => ({
            lang: t.lang,
            name: t.name,
            overview: t.overview || '',
            admissionRequirements: t.admissionRequirements || '',
            accommodationInfo: t.accommodationInfo || '',
            accreditationInfo: t.accreditationInfo || '',
            address: t.address || '',
          })),
        },
      },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'CREATE_UNIVERSITY', 'University', created.id, `Created ${created.slug}`, req.ip);

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

// PUT /api/universities/admin/:id - Update university with all media, video, and application status metadata
router.put('/admin/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      slug,
      type,
      city,
      establishedYear,
      campusType,
      ranking,
      websiteUrl,
      logoUrl,
      coverImageUrl,
      videoUrl,
      videoThumbnailUrl,
      videoTitle,
      videoDescription,
      videoPlacement,
      galleryImages,
      admissionStatus,
      admissionStartDate,
      admissionEndDate,
      admissionDeadline,
      announcementText,
      officialApplicationUrl,
      statusNote,
      customOrder,
      tuitionVerified,
      tuitionNotes,
      departmentCount,
      facultyCount,
      programCountGrad,
      departmentCountBasis,
      bestDepartments,
      departmentSourceUrl,
      departmentDataAsOf,
      showNotarySection,
      showFaqSection,
      showProgramsSection,
      showReviewsSection,
      graduateAdmissionOpen,
      featured,
      published,
      translations = [],
    } = req.body;

    const existing = await prisma.university.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'University not found.' });
    }

    // Update main university fields
    await prisma.university.update({
      where: { id },
      data: {
        slug: slug ? slug.toLowerCase().trim() : existing.slug,
        type: type || existing.type,
        city: city || existing.city,
        establishedYear: establishedYear !== undefined ? parseInt(establishedYear) : existing.establishedYear,
        campusType: campusType !== undefined ? campusType : existing.campusType,
        ranking: ranking !== undefined ? parseInt(ranking) : existing.ranking,
        websiteUrl: websiteUrl !== undefined ? websiteUrl : existing.websiteUrl,
        logoUrl: logoUrl !== undefined ? logoUrl : existing.logoUrl,
        coverImageUrl: coverImageUrl !== undefined ? coverImageUrl : existing.coverImageUrl,
        videoUrl: videoUrl !== undefined ? videoUrl : existing.videoUrl,
        videoThumbnailUrl: videoThumbnailUrl !== undefined ? videoThumbnailUrl : existing.videoThumbnailUrl,
        videoTitle: videoTitle !== undefined ? videoTitle : existing.videoTitle,
        videoDescription: videoDescription !== undefined ? videoDescription : existing.videoDescription,
        videoPlacement: videoPlacement !== undefined ? videoPlacement : existing.videoPlacement,
        galleryImages: galleryImages !== undefined ? (typeof galleryImages === 'string' ? galleryImages : JSON.stringify(galleryImages)) : existing.galleryImages,
        admissionStatus: admissionStatus !== undefined ? admissionStatus : existing.admissionStatus,
        admissionStartDate: admissionStartDate !== undefined ? (admissionStartDate ? new Date(admissionStartDate) : null) : existing.admissionStartDate,
        admissionEndDate: admissionEndDate !== undefined ? (admissionEndDate ? new Date(admissionEndDate) : null) : existing.admissionEndDate,
        admissionDeadline: admissionDeadline !== undefined ? admissionDeadline : existing.admissionDeadline,
        announcementText: announcementText !== undefined ? announcementText : existing.announcementText,
        officialApplicationUrl: officialApplicationUrl !== undefined ? officialApplicationUrl : existing.officialApplicationUrl,
        statusNote: statusNote !== undefined ? statusNote : existing.statusNote,
        customOrder: customOrder !== undefined ? parseInt(customOrder) : existing.customOrder,
        tuitionVerified: tuitionVerified !== undefined ? Boolean(tuitionVerified) : existing.tuitionVerified,
        tuitionNotes: tuitionNotes !== undefined ? tuitionNotes : existing.tuitionNotes,
        departmentCount: departmentCount !== undefined ? (departmentCount === null || departmentCount === '' ? null : parseInt(departmentCount)) : existing.departmentCount,
        facultyCount: facultyCount !== undefined ? (facultyCount === null || facultyCount === '' ? null : parseInt(facultyCount)) : existing.facultyCount,
        programCountGrad: programCountGrad !== undefined ? (programCountGrad === null || programCountGrad === '' ? null : parseInt(programCountGrad)) : existing.programCountGrad,
        departmentCountBasis: departmentCountBasis !== undefined ? departmentCountBasis : existing.departmentCountBasis,
        bestDepartments: bestDepartments !== undefined ? (bestDepartments ? (typeof bestDepartments === 'string' ? bestDepartments : JSON.stringify(bestDepartments)) : null) : existing.bestDepartments,
        departmentSourceUrl: departmentSourceUrl !== undefined ? departmentSourceUrl : existing.departmentSourceUrl,
        departmentDataAsOf: departmentDataAsOf !== undefined ? (departmentDataAsOf ? new Date(departmentDataAsOf) : null) : existing.departmentDataAsOf,
        showNotarySection: showNotarySection !== undefined ? Boolean(showNotarySection) : existing.showNotarySection,
        showFaqSection: showFaqSection !== undefined ? Boolean(showFaqSection) : existing.showFaqSection,
        showProgramsSection: showProgramsSection !== undefined ? Boolean(showProgramsSection) : existing.showProgramsSection,
        showReviewsSection: showReviewsSection !== undefined ? Boolean(showReviewsSection) : existing.showReviewsSection,
        graduateAdmissionOpen: graduateAdmissionOpen !== undefined ? Boolean(graduateAdmissionOpen) : existing.graduateAdmissionOpen,
        featured: featured !== undefined ? Boolean(featured) : existing.featured,
        published: published !== undefined ? Boolean(published) : existing.published,
      },
    });

    // Upsert translations
    for (const t of translations) {
      if (t.lang && t.name) {
        await prisma.universityTranslation.upsert({
          where: {
            universityId_lang: {
              universityId: id,
              lang: t.lang,
            },
          },
          update: {
            name: t.name,
            overview: t.overview || '',
            admissionRequirements: t.admissionRequirements || '',
            accommodationInfo: t.accommodationInfo || '',
            accreditationInfo: t.accreditationInfo || '',
            address: t.address || '',
          },
          create: {
            universityId: id,
            lang: t.lang,
            name: t.name,
            overview: t.overview || '',
            admissionRequirements: t.admissionRequirements || '',
            accommodationInfo: t.accommodationInfo || '',
            accreditationInfo: t.accreditationInfo || '',
            address: t.address || '',
          },
        });
      }
    }

    const updated = await prisma.university.findUnique({
      where: { id },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'UPDATE_UNIVERSITY', 'University', id, `Updated ${updated.slug}`, req.ip);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/universities/admin/:id/admission-status - Instant status and deadline toggle
router.patch('/admin/:id/admission-status', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      admissionStatus,
      graduateAdmissionOpen,
      announcementText,
      admissionStartDate,
      admissionEndDate,
      admissionDeadline,
      officialApplicationUrl,
      statusNote,
      featured,
      customOrder,
    } = req.body;

    const data = {};
    if (admissionStatus !== undefined) data.admissionStatus = admissionStatus;
    if (graduateAdmissionOpen !== undefined) data.graduateAdmissionOpen = Boolean(graduateAdmissionOpen);
    if (announcementText !== undefined) data.announcementText = announcementText;
    if (admissionStartDate !== undefined) data.admissionStartDate = admissionStartDate ? new Date(admissionStartDate) : null;
    if (admissionEndDate !== undefined) data.admissionEndDate = admissionEndDate ? new Date(admissionEndDate) : null;
    if (admissionDeadline !== undefined) data.admissionDeadline = admissionDeadline;
    if (officialApplicationUrl !== undefined) data.officialApplicationUrl = officialApplicationUrl;
    if (statusNote !== undefined) data.statusNote = statusNote;
    if (featured !== undefined) data.featured = Boolean(featured);
    if (customOrder !== undefined) data.customOrder = parseInt(customOrder);

    const updated = await prisma.university.update({
      where: { id },
      data,
      include: { translations: true },
    });

    await auditLog(
      prisma,
      req.user.id,
      'UPDATE_UNIVERSITY_ADMISSION',
      'University',
      id,
      `Updated admission status to ${admissionStatus || 'modified'}`,
      req.ip
    );

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/universities/admin/:id - Delete university with safeguards
router.delete('/admin/:id', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;

    const uni = await prisma.university.findUnique({
      where: { id },
      include: { _count: { select: { programs: true } } },
    });

    if (!uni) {
      return res.status(404).json({ success: false, message: 'University not found.' });
    }

    await prisma.university.delete({ where: { id } });
    await auditLog(prisma, req.user.id, 'DELETE_UNIVERSITY', 'University', id, `Deleted university ${uni.slug}`, req.ip);

    res.json({ success: true, message: 'University deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
