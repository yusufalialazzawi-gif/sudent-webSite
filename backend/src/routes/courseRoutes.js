import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { completeTranslations } from '../utils/translations.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/courses - Public list
router.get('/', async (req, res, next) => {
  try {
    const { lang = 'ar', studyMode } = req.query;
    const where = { published: true };
    if (studyMode) {
      where.studyMode = studyMode.toUpperCase();
    }

    const courses = await prisma.course.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        translations: {
          where: { lang: { in: [lang, 'ar', 'en'] } },
        },
      },
    });

    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
});

// GET /api/courses/:slug - Public detail
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const course = await prisma.course.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        published: true,
      },
      include: { translations: true },
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
});

// POST /api/courses/:id/register - Public registration
router.post('/:id/register', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, notes } = req.body;

    if (!fullName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Full name, email, and phone are required.' });
    }

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course || !course.published) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    const reg = await prisma.courseRegistration.create({
      data: {
        courseId: id,
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        notes: notes ? notes.trim() : null,
      },
    });

    await prisma.course.update({
      where: { id },
      data: { registeredCount: { increment: 1 } },
    });

    res.status(201).json({
      success: true,
      message: 'Course registration submitted successfully! We will contact you with schedule details.',
      data: reg,
    });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN ROUTES ================= //

// GET /api/courses/admin/all
router.get('/admin/all', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        translations: true,
        registrations: { orderBy: { createdAt: 'desc' } },
      },
    });
    res.json({ success: true, data: courses });
  } catch (error) {
    next(error);
  }
});

// POST /api/courses/admin
router.post('/admin', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const {
      slug,
      studyMode,
      durationWeeks,
      schedule,
      price,
      currency,
      capacity,
      status,
      registrationDeadline,
      imageUrl,
      published,
      translations = [],
    } = req.body;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug is required.' });
    }

    const created = await prisma.course.create({
      data: {
        slug: slug.toLowerCase().trim(),
        studyMode: studyMode || 'ONLINE',
        durationWeeks: durationWeeks ? parseInt(durationWeeks) : 8,
        schedule,
        price: price !== undefined ? parseFloat(price) : 0,
        currency: currency || 'USD',
        capacity: capacity ? parseInt(capacity) : 25,
        status: status || 'ACTIVE',
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : null,
        imageUrl,
        published: published !== undefined ? Boolean(published) : true,
        translations: {
          create: completeTranslations(translations, 'title').map((t) => ({
            lang: t.lang,
            title: t.title,
            description: t.description,
            instructor: t.instructor || '',
            curriculum: typeof t.curriculum === 'object' ? JSON.stringify(t.curriculum) : t.curriculum || '',
            requirements: t.requirements || '',
          })),
        },
      },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'CREATE_COURSE', 'Course', created.id, `Created course ${created.slug}`, req.ip);

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

// PUT /api/courses/admin/:id
router.put('/admin/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      slug,
      studyMode,
      durationWeeks,
      schedule,
      price,
      currency,
      capacity,
      status,
      registrationDeadline,
      imageUrl,
      published,
      translations = [],
    } = req.body;

    await prisma.course.update({
      where: { id },
      data: {
        slug: slug ? slug.toLowerCase().trim() : undefined,
        studyMode,
        durationWeeks: durationWeeks !== undefined ? parseInt(durationWeeks) : undefined,
        schedule,
        price: price !== undefined ? parseFloat(price) : undefined,
        currency,
        capacity: capacity !== undefined ? parseInt(capacity) : undefined,
        status,
        registrationDeadline: registrationDeadline ? new Date(registrationDeadline) : undefined,
        imageUrl,
        published: published !== undefined ? Boolean(published) : undefined,
      },
    });

    for (const t of translations) {
      if (t.lang && t.title) {
        await prisma.courseTranslation.upsert({
          where: { courseId_lang: { courseId: id, lang: t.lang } },
          update: {
            title: t.title,
            description: t.description,
            instructor: t.instructor || '',
            curriculum: typeof t.curriculum === 'object' ? JSON.stringify(t.curriculum) : t.curriculum || '',
            requirements: t.requirements || '',
          },
          create: {
            courseId: id,
            lang: t.lang,
            title: t.title,
            description: t.description,
            instructor: t.instructor || '',
            curriculum: typeof t.curriculum === 'object' ? JSON.stringify(t.curriculum) : t.curriculum || '',
            requirements: t.requirements || '',
          },
        });
      }
    }

    const updated = await prisma.course.findUnique({
      where: { id },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'UPDATE_COURSE', 'Course', id, `Updated course ${updated.slug}`, req.ip);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/courses/admin/:id
router.delete('/admin/:id', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    await auditLog(prisma, req.user.id, 'DELETE_COURSE', 'Course', id, 'Deleted course', req.ip);
    res.json({ success: true, message: 'Course deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
