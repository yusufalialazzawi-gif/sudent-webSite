import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { completeTranslations } from '../utils/translations.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/services - Public list
router.get('/', async (req, res, next) => {
  try {
    const { lang = 'ar' } = req.query;
    const services = await prisma.service.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: {
          where: { lang: { in: [lang, 'ar', 'en'] } },
        },
      },
    });

    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
});

// GET /api/services/:slug - Public detail
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        published: true,
      },
      include: {
        translations: true,
      },
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN ROUTES ================= //

// GET /api/services/admin/all
router.get('/admin/all', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { translations: true },
    });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
});

// POST /api/services/admin
router.post('/admin', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { slug, icon, pricePolicy, estimatedDuration, featured, published, sortOrder, translations = [] } = req.body;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug is required.' });
    }

    const created = await prisma.service.create({
      data: {
        slug: slug.toLowerCase().trim(),
        icon,
        pricePolicy,
        estimatedDuration,
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
        translations: {
          create: completeTranslations(translations, 'title').map((t) => ({
            lang: t.lang,
            title: t.title,
            description: t.description,
            benefits: t.benefits || '',
            eligibility: t.eligibility || '',
            procedureSteps: typeof t.procedureSteps === 'object' ? JSON.stringify(t.procedureSteps) : t.procedureSteps || '',
            requiredDocuments: typeof t.requiredDocuments === 'object' ? JSON.stringify(t.requiredDocuments) : t.requiredDocuments || '',
          })),
        },
      },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'CREATE_SERVICE', 'Service', created.id, `Created service ${created.slug}`, req.ip);

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

// PUT /api/services/admin/:id
router.put('/admin/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { slug, icon, pricePolicy, estimatedDuration, featured, published, sortOrder, translations = [] } = req.body;

    await prisma.service.update({
      where: { id },
      data: {
        slug: slug ? slug.toLowerCase().trim() : undefined,
        icon,
        pricePolicy,
        estimatedDuration,
        featured: featured !== undefined ? Boolean(featured) : undefined,
        published: published !== undefined ? Boolean(published) : undefined,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
      },
    });

    for (const t of translations) {
      if (t.lang && t.title) {
        await prisma.serviceTranslation.upsert({
          where: { serviceId_lang: { serviceId: id, lang: t.lang } },
          update: {
            title: t.title,
            description: t.description,
            benefits: t.benefits || '',
            eligibility: t.eligibility || '',
            procedureSteps: typeof t.procedureSteps === 'object' ? JSON.stringify(t.procedureSteps) : t.procedureSteps || '',
            requiredDocuments: typeof t.requiredDocuments === 'object' ? JSON.stringify(t.requiredDocuments) : t.requiredDocuments || '',
          },
          create: {
            serviceId: id,
            lang: t.lang,
            title: t.title,
            description: t.description,
            benefits: t.benefits || '',
            eligibility: t.eligibility || '',
            procedureSteps: typeof t.procedureSteps === 'object' ? JSON.stringify(t.procedureSteps) : t.procedureSteps || '',
            requiredDocuments: typeof t.requiredDocuments === 'object' ? JSON.stringify(t.requiredDocuments) : t.requiredDocuments || '',
          },
        });
      }
    }

    const updated = await prisma.service.findUnique({
      where: { id },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'UPDATE_SERVICE', 'Service', id, `Updated service ${updated.slug}`, req.ip);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/services/admin/:id
router.delete('/admin/:id', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.service.delete({ where: { id } });
    await auditLog(prisma, req.user.id, 'DELETE_SERVICE', 'Service', id, 'Deleted service', req.ip);
    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
