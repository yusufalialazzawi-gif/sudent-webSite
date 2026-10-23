import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { completeTranslations } from '../utils/translations.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/programs/categories - List all program categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.programCategory.findMany({
      include: {
        _count: { select: { programs: { where: { published: true } } } },
      },
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
});

// GET /api/programs - Public listing with filters & pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      search,
      category,
      degreeLevel,
      studyLanguage,
      maxTuition,
      universityId,
      city,
      page = 1,
      limit = 12,
      sortBy = 'tuition',
      order = 'asc',
      lang = 'ar',
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      published: true,
      university: { published: true },
    };

    if (category) {
      where.category = { slug: category };
    }
    if (degreeLevel) {
      where.degreeLevel = { equals: degreeLevel.toUpperCase() };
    }
    if (studyLanguage) {
      where.studyLanguage = { equals: studyLanguage.toUpperCase() };
    }
    if (maxTuition) {
      where.annualTuition = { lte: parseFloat(maxTuition) };
    }
    if (universityId) {
      where.universityId = { equals: universityId };
    }
    if (city) {
      where.university = { ...where.university, city: { equals: city } };
    }

    if (search) {
      where.OR = [
        { slug: { contains: search } },
        {
          translations: {
            some: {
              name: { contains: search },
            },
          },
        },
        {
          university: {
            translations: {
              some: {
                name: { contains: search },
              },
            },
          },
        },
      ];
    }

    const orderBy = {};
    if (sortBy === 'tuition') {
      orderBy.annualTuition = order.toLowerCase() === 'desc' ? 'desc' : 'asc';
    } else if (sortBy === 'duration') {
      orderBy.durationYears = order.toLowerCase() === 'desc' ? 'desc' : 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [total, programs] = await Promise.all([
      prisma.academicProgram.count({ where }),
      prisma.academicProgram.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: true,
          translations: {
            where: { lang: { in: [lang, 'ar', 'en'] } },
          },
          university: {
            include: {
              translations: {
                where: { lang: { in: [lang, 'ar', 'en'] } },
              },
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: programs,
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

// GET /api/programs/:id - Program detail
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const program = await prisma.academicProgram.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        translations: true,
        university: {
          include: {
            translations: true,
          },
        },
      },
    });

    if (!program || !program.published) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    res.json({ success: true, data: program });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN ROUTES ================= //

// GET /api/programs/admin/all - Admin list
router.get('/admin/all', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const programs = await prisma.academicProgram.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        translations: true,
        university: {
          include: {
            translations: { where: { lang: 'ar' } },
          },
        },
      },
    });

    res.json({ success: true, data: programs });
  } catch (error) {
    next(error);
  }
});

// POST /api/programs/admin - Create program
router.post('/admin', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const {
      universityId,
      categoryId,
      slug,
      degreeLevel,
      studyLanguage,
      durationYears,
      annualTuition,
      discountedTuition,
      currency,
      academicYear,
      applicationStatus,
      published,
      translations = [],
    } = req.body;

    if (!universityId || !slug || annualTuition === undefined) {
      return res.status(400).json({ success: false, message: 'University, slug, and annual tuition are required.' });
    }

    const created = await prisma.academicProgram.create({
      data: {
        universityId,
        categoryId: categoryId || null,
        slug: slug.toLowerCase().trim(),
        degreeLevel: degreeLevel || 'BACHELOR',
        studyLanguage: studyLanguage || 'ENGLISH',
        durationYears: durationYears ? parseInt(durationYears) : 4,
        annualTuition: parseFloat(annualTuition),
        discountedTuition: discountedTuition ? parseFloat(discountedTuition) : null,
        currency: currency || 'USD',
        academicYear: academicYear || '2026-2027',
        applicationStatus: applicationStatus || 'OPEN',
        published: published !== undefined ? Boolean(published) : true,
        translations: {
          create: completeTranslations(translations, 'name').map((t) => ({
            lang: t.lang,
            name: t.name,
            facultyName: t.facultyName || '',
            description: t.description || '',
            requirements: t.requirements || '',
            careerOpportunities: t.careerOpportunities || '',
          })),
        },
      },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'CREATE_PROGRAM', 'AcademicProgram', created.id, `Created program ${created.slug}`, req.ip);

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

// PUT /api/programs/admin/:id - Update program
router.put('/admin/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      universityId,
      categoryId,
      slug,
      degreeLevel,
      studyLanguage,
      durationYears,
      annualTuition,
      discountedTuition,
      currency,
      academicYear,
      applicationStatus,
      published,
      translations = [],
    } = req.body;

    const existing = await prisma.academicProgram.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    await prisma.academicProgram.update({
      where: { id },
      data: {
        universityId: universityId || existing.universityId,
        categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
        slug: slug ? slug.toLowerCase().trim() : existing.slug,
        degreeLevel: degreeLevel || existing.degreeLevel,
        studyLanguage: studyLanguage || existing.studyLanguage,
        durationYears: durationYears !== undefined ? parseInt(durationYears) : existing.durationYears,
        annualTuition: annualTuition !== undefined ? parseFloat(annualTuition) : existing.annualTuition,
        discountedTuition: discountedTuition !== undefined ? (discountedTuition ? parseFloat(discountedTuition) : null) : existing.discountedTuition,
        currency: currency || existing.currency,
        academicYear: academicYear || existing.academicYear,
        applicationStatus: applicationStatus || existing.applicationStatus,
        published: published !== undefined ? Boolean(published) : existing.published,
      },
    });

    for (const t of translations) {
      if (t.lang && t.name) {
        await prisma.programTranslation.upsert({
          where: {
            programId_lang: {
              programId: id,
              lang: t.lang,
            },
          },
          update: {
            name: t.name,
            facultyName: t.facultyName || '',
            description: t.description || '',
            requirements: t.requirements || '',
            careerOpportunities: t.careerOpportunities || '',
          },
          create: {
            programId: id,
            lang: t.lang,
            name: t.name,
            facultyName: t.facultyName || '',
            description: t.description || '',
            requirements: t.requirements || '',
            careerOpportunities: t.careerOpportunities || '',
          },
        });
      }
    }

    const updated = await prisma.academicProgram.findUnique({
      where: { id },
      include: { translations: true, category: true },
    });

    await auditLog(prisma, req.user.id, 'UPDATE_PROGRAM', 'AcademicProgram', id, `Updated program ${updated.slug}`, req.ip);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/programs/admin/:id - Delete program
router.delete('/admin/:id', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.academicProgram.delete({ where: { id } });
    await auditLog(prisma, req.user.id, 'DELETE_PROGRAM', 'AcademicProgram', id, 'Deleted academic program', req.ip);
    res.json({ success: true, message: 'Program deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
