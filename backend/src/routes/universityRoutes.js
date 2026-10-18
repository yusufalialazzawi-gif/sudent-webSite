import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

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

    const orderBy = {};
    if (sortBy === 'ranking') {
      orderBy.ranking = order.toLowerCase() === 'desc' ? 'desc' : 'asc';
    } else if (sortBy === 'establishedYear') {
      orderBy.establishedYear = order.toLowerCase() === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.createdAt = 'desc';
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
            where: { lang: { in: [lang, 'ar', 'en'] } },
          },
          _count: {
            select: { programs: { where: { published: true } } },
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
                where: { lang: { in: [lang, 'ar', 'en'] } },
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

// GET /api/universities/:slug - Public detail page
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
      },
    });

    if (!university || !university.published) {
      return res.status(404).json({ success: false, message: 'University not found.' });
    }

    // Fetch related universities in the same city or type
    const related = await prisma.university.findMany({
      where: {
        id: { not: university.id },
        published: true,
        OR: [{ city: university.city }, { type: university.type }],
      },
      take: 3,
      include: {
        translations: { where: { lang: { in: [lang, 'ar'] } } },
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

// GET /api/universities/admin/all - Admin list
router.get('/admin/all', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const universities = await prisma.university.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        translations: true,
        _count: {
          select: { programs: true },
        },
      },
    });

    res.json({ success: true, data: universities });
  } catch (error) {
    next(error);
  }
});

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
        campusType,
        ranking: ranking ? parseInt(ranking) : null,
        websiteUrl,
        logoUrl,
        coverImageUrl,
        featured: Boolean(featured),
        published: published !== undefined ? Boolean(published) : true,
        translations: {
          create: translations.map((t) => ({
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

// PUT /api/universities/admin/:id - Update university
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
