import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/articles - Public blog listing
router.get('/', async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 9, lang = 'ar' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = { published: true };
    if (category) {
      where.category = category.toUpperCase();
    }
    if (search) {
      where.OR = [
        { slug: { contains: search } },
        {
          translations: {
            some: {
              OR: [{ title: { contains: search } }, { content: { contains: search } }],
            },
          },
        },
      ];
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: 'desc' },
        include: {
          translations: {
            where: { lang: { in: [lang, 'ar', 'en'] } },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: articles,
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

// GET /api/articles/:slug - Public article detail
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { lang = 'ar' } = req.query;

    const article = await prisma.article.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
        published: true,
      },
      include: { translations: true },
    });

    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // Related articles
    const related = await prisma.article.findMany({
      where: {
        id: { not: article.id },
        category: article.category,
        published: true,
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      include: {
        translations: { where: { lang: { in: [lang, 'ar'] } } },
      },
    });

    res.json({ success: true, data: article, related });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN ROUTES ================= //

// GET /api/articles/admin/all
router.get('/admin/all', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const articles = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
      include: { translations: true },
    });
    res.json({ success: true, data: articles });
  } catch (error) {
    next(error);
  }
});

// POST /api/articles/admin
router.post('/admin', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const {
      slug,
      category,
      authorName,
      featuredImageUrl,
      readTimeMinutes,
      published,
      publishedAt,
      translations = [],
    } = req.body;

    if (!slug) {
      return res.status(400).json({ success: false, message: 'Slug is required.' });
    }

    const created = await prisma.article.create({
      data: {
        slug: slug.toLowerCase().trim(),
        category: category || 'GUIDE',
        authorName: authorName || 'Sora Education Expert',
        featuredImageUrl,
        readTimeMinutes: readTimeMinutes ? parseInt(readTimeMinutes) : 5,
        published: published !== undefined ? Boolean(published) : true,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        translations: {
          create: translations.map((t) => ({
            lang: t.lang,
            title: t.title,
            excerpt: t.excerpt || '',
            content: t.content || '',
            metaTitle: t.metaTitle || '',
            metaDescription: t.metaDescription || '',
          })),
        },
      },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'CREATE_ARTICLE', 'Article', created.id, `Created article ${created.slug}`, req.ip);

    res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
});

// PUT /api/articles/admin/:id
router.put('/admin/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      slug,
      category,
      authorName,
      featuredImageUrl,
      readTimeMinutes,
      published,
      publishedAt,
      translations = [],
    } = req.body;

    await prisma.article.update({
      where: { id },
      data: {
        slug: slug ? slug.toLowerCase().trim() : undefined,
        category,
        authorName,
        featuredImageUrl,
        readTimeMinutes: readTimeMinutes !== undefined ? parseInt(readTimeMinutes) : undefined,
        published: published !== undefined ? Boolean(published) : undefined,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
      },
    });

    for (const t of translations) {
      if (t.lang && t.title) {
        await prisma.articleTranslation.upsert({
          where: { articleId_lang: { articleId: id, lang: t.lang } },
          update: {
            title: t.title,
            excerpt: t.excerpt || '',
            content: t.content || '',
            metaTitle: t.metaTitle || '',
            metaDescription: t.metaDescription || '',
          },
          create: {
            articleId: id,
            lang: t.lang,
            title: t.title,
            excerpt: t.excerpt || '',
            content: t.content || '',
            metaTitle: t.metaTitle || '',
            metaDescription: t.metaDescription || '',
          },
        });
      }
    }

    const updated = await prisma.article.findUnique({
      where: { id },
      include: { translations: true },
    });

    await auditLog(prisma, req.user.id, 'UPDATE_ARTICLE', 'Article', id, `Updated article ${updated.slug}`, req.ip);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/articles/admin/:id
router.delete('/admin/:id', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.article.delete({ where: { id } });
    await auditLog(prisma, req.user.id, 'DELETE_ARTICLE', 'Article', id, 'Deleted article', req.ip);
    res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
