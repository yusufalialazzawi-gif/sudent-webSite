import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { completeTranslations } from '../utils/translations.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/scholarships - Public list
router.get('/', async (req, res, next) => {
  try {
    const { lang = 'ar', type, limit } = req.query;
    const where = { published: true };
    if (type) {
      where.scholarshipType = type.toUpperCase();
    }
    const take = Number.isFinite(parseInt(limit)) && parseInt(limit) > 0 ? Math.min(parseInt(limit), 100) : undefined;

    const scholarships = await prisma.scholarship.findMany({
      where,
      ...(take && { take }),
      orderBy: { createdAt: 'desc' },
      include: {
        university: {
          include: {
            translations: { where: { lang: { in: [lang, 'ar', 'tr', 'en'] } } },
          },
        },
        translations: {
          where: { lang: { in: [lang, 'ar', 'tr', 'en'] } },
        },
      },
    });

    res.json({ success: true, data: scholarships });
  } catch (error) {
    next(error);
  }
});

// GET /api/scholarships/:slug - Public detail
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const scholarship = await prisma.scholarship.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        published: true,
      },
      include: {
        university: {
          include: { translations: true },
        },
        translations: true,
      },
    });

    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found.' });
    }

    res.json({ success: true, data: scholarship });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN ROUTES ================= //

// GET /api/scholarships/admin/all
router.get('/admin/all', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const scholarships = await prisma.scholarship.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        translations: true,
        university: { select: { id: true, slug: true, translations: { where: { lang: 'ar' } } } },
      },
    });
    res.json({ success: true, data: scholarships });
  } catch (error) {
    next(error);
  }
});

// POST /api/scholarships/admin
router.post('/admin', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const {
      slug,
      scholarshipType,
      discountPercentage,
      universityId,
      openingDate,
      deadline,
      status,
      imageUrl,
      published,
      translations = [],
    } = req.body;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug is required.' });
    }

    const created = await prisma.scholarship.create({
      data: {
        slug: slug.toLowerCase().trim(),
        scholarshipType: scholarshipType || 'PARTIAL',
        discountPercentage: discountPercentage ? parseInt(discountPercentage) : null,
        universityId: universityId || null,
        openingDate: openingDate ? new Date(openingDate) : null,
        deadline: deadline ? new Date(deadline) : null,
        status: status || 'ACTIVE',
        imageUrl,
        published: published !== undefined ? Boolean(published) : true,
        translations: {
          create: completeTranslations(translations, 'title').map((t) => ({
            lang: t.lang,
            title: t.title,
            description: t.description,
            eligibilityCriteria: t.eligibilityCriteria || '',
            requiredDocuments: t.requiredDocuments || '',
            benefitsSummary: t.benefitsSummary || '',
          })),
        },
      },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'CREATE_SCHOLARSHIP', 'Scholarship', created.id, `Created scholarship ${created.slug}`, req.ip);

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

// PUT /api/scholarships/admin/:id
router.put('/admin/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      slug,
      scholarshipType,
      discountPercentage,
      universityId,
      openingDate,
      deadline,
      status,
      imageUrl,
      published,
      translations = [],
    } = req.body;

    await prisma.scholarship.update({
      where: { id },
      data: {
        slug: slug ? slug.toLowerCase().trim() : undefined,
        scholarshipType,
        discountPercentage: discountPercentage !== undefined ? (discountPercentage ? parseInt(discountPercentage) : null) : undefined,
        universityId: universityId !== undefined ? (universityId || null) : undefined,
        openingDate: openingDate ? new Date(openingDate) : undefined,
        deadline: deadline ? new Date(deadline) : undefined,
        status,
        imageUrl,
        published: published !== undefined ? Boolean(published) : undefined,
      },
    });

    for (const t of translations) {
      if (t.lang && t.title) {
        await prisma.scholarshipTranslation.upsert({
          where: { scholarshipId_lang: { scholarshipId: id, lang: t.lang } },
          update: {
            title: t.title,
            description: t.description,
            eligibilityCriteria: t.eligibilityCriteria || '',
            requiredDocuments: t.requiredDocuments || '',
            benefitsSummary: t.benefitsSummary || '',
          },
          create: {
            scholarshipId: id,
            lang: t.lang,
            title: t.title,
            description: t.description,
            eligibilityCriteria: t.eligibilityCriteria || '',
            requiredDocuments: t.requiredDocuments || '',
            benefitsSummary: t.benefitsSummary || '',
          },
        });
      }
    }

    const updated = await prisma.scholarship.findUnique({
      where: { id },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'UPDATE_SCHOLARSHIP', 'Scholarship', id, `Updated scholarship ${updated.slug}`, req.ip);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/scholarships/admin/:id
router.delete('/admin/:id', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.scholarship.delete({ where: { id } });
    await auditLog(prisma, req.user.id, 'DELETE_SCHOLARSHIP', 'Scholarship', id, 'Deleted scholarship', req.ip);
    res.json({ success: true, message: 'Scholarship deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
