import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/translations/matrix - Summary matrix of all translatable models
router.get('/matrix', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { modelType = 'universities' } = req.query;

    let items = [];

    if (modelType === 'universities') {
      const records = await prisma.university.findMany({
        include: { translations: true },
        orderBy: { updatedAt: 'desc' },
      });

      items = records.map((u) => {
        const ar = u.translations.find((t) => t.lang === 'ar');
        const tr = u.translations.find((t) => t.lang === 'tr');
        const en = u.translations.find((t) => t.lang === 'en');
        return {
          id: u.id,
          modelType: 'university',
          identifier: u.slug,
          primaryTitle: ar?.name || tr?.name || en?.name || u.slug,
          published: u.published,
          updatedAt: u.updatedAt,
          languages: {
            ar: { exists: Boolean(ar), title: ar?.name || '', isComplete: Boolean(ar?.name && ar?.overview) },
            tr: { exists: Boolean(tr), title: tr?.name || '', isComplete: Boolean(tr?.name && tr?.overview) },
            en: { exists: Boolean(en), title: en?.name || '', isComplete: Boolean(en?.name && en?.overview) },
          },
        };
      });
    } else if (modelType === 'programs') {
      const records = await prisma.academicProgram.findMany({
        include: {
          translations: true,
          university: { select: { slug: true } },
        },
        orderBy: { updatedAt: 'desc' },
      });

      items = records.map((p) => {
        const ar = p.translations.find((t) => t.lang === 'ar');
        const tr = p.translations.find((t) => t.lang === 'tr');
        const en = p.translations.find((t) => t.lang === 'en');
        return {
          id: p.id,
          modelType: 'program',
          identifier: `${p.university?.slug} / ${p.slug}`,
          primaryTitle: ar?.name || tr?.name || en?.name || p.slug,
          published: p.published,
          updatedAt: p.updatedAt,
          languages: {
            ar: { exists: Boolean(ar), title: ar?.name || '', isComplete: Boolean(ar?.name) },
            tr: { exists: Boolean(tr), title: tr?.name || '', isComplete: Boolean(tr?.name) },
            en: { exists: Boolean(en), title: en?.name || '', isComplete: Boolean(en?.name) },
          },
        };
      });
    } else if (modelType === 'services') {
      const records = await prisma.service.findMany({
        include: { translations: true },
        orderBy: { sortOrder: 'asc' },
      });

      items = records.map((s) => {
        const ar = s.translations.find((t) => t.lang === 'ar');
        const tr = s.translations.find((t) => t.lang === 'tr');
        const en = s.translations.find((t) => t.lang === 'en');
        return {
          id: s.id,
          modelType: 'service',
          identifier: s.slug,
          primaryTitle: ar?.title || tr?.title || en?.title || s.slug,
          published: s.published,
          updatedAt: s.updatedAt,
          languages: {
            ar: { exists: Boolean(ar), title: ar?.title || '', isComplete: Boolean(ar?.title && ar?.description) },
            tr: { exists: Boolean(tr), title: tr?.title || '', isComplete: Boolean(tr?.title && tr?.description) },
            en: { exists: Boolean(en), title: en?.title || '', isComplete: Boolean(en?.title && en?.description) },
          },
        };
      });
    } else if (modelType === 'articles') {
      const records = await prisma.article.findMany({
        include: { translations: true },
        orderBy: { updatedAt: 'desc' },
      });

      items = records.map((a) => {
        const ar = a.translations.find((t) => t.lang === 'ar');
        const tr = a.translations.find((t) => t.lang === 'tr');
        const en = a.translations.find((t) => t.lang === 'en');
        return {
          id: a.id,
          modelType: 'article',
          identifier: a.slug,
          primaryTitle: ar?.title || tr?.title || en?.title || a.slug,
          published: a.published,
          updatedAt: a.updatedAt,
          languages: {
            ar: { exists: Boolean(ar), title: ar?.title || '', isComplete: Boolean(ar?.title && ar?.content) },
            tr: { exists: Boolean(tr), title: tr?.title || '', isComplete: Boolean(tr?.title && tr?.content) },
            en: { exists: Boolean(en), title: en?.title || '', isComplete: Boolean(en?.title && en?.content) },
          },
        };
      });
    }

    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
});

export default router;
