import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/page-builder/sections/:pageName - Publicly get active sections for a page
router.get('/sections/:pageName', async (req, res, next) => {
  try {
    const { pageName } = req.params;
    const sections = await prisma.pageSection.findMany({
      where: {
        pageName,
        isEnabled: true,
      },
      orderBy: { sortOrder: 'asc' },
    });

    res.json({ success: true, data: sections });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN CMS ROUTES ================= //

// GET /api/page-builder/admin/sections/:pageName - Get all sections including disabled
router.get(
  '/admin/sections/:pageName',
  authenticate,
  requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']),
  async (req, res, next) => {
    try {
      const { pageName } = req.params;
      const sections = await prisma.pageSection.findMany({
        where: { pageName },
        orderBy: { sortOrder: 'asc' },
      });
      res.json({ success: true, data: sections });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/page-builder/admin/sections - Add new section
router.post(
  '/admin/sections',
  authenticate,
  requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']),
  async (req, res, next) => {
    try {
      const {
        pageName,
        sectionKey,
        sectionType,
        titleAr,
        titleTr,
        titleEn,
        subtitleAr,
        subtitleTr,
        subtitleEn,
        contentJson,
        sortOrder,
        isEnabled,
      } = req.body;

      if (!pageName || !sectionKey || !sectionType) {
        return res.status(400).json({ success: false, message: 'Page name, section key, and section type are required.' });
      }

      const created = await prisma.pageSection.create({
        data: {
          pageName,
          sectionKey,
          sectionType,
          titleAr,
          titleTr,
          titleEn,
          subtitleAr,
          subtitleTr,
          subtitleEn,
          contentJson: typeof contentJson === 'object' ? JSON.stringify(contentJson) : contentJson || '{}',
          sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : 0,
          isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
        },
      });

      await auditLog(
        prisma,
        req.user.id,
        'CREATE_PAGE_SECTION',
        'PageSection',
        created.id,
        `Created section ${sectionKey} on ${pageName}`,
        req.ip
      );

      res.status(201).json({ success: true, data: created });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/page-builder/admin/sections/reorder - Reorder sections
router.put(
  '/admin/sections/reorder',
  authenticate,
  requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']),
  async (req, res, next) => {
    try {
      const { orderedSectionIds } = req.body; // array of IDs in new order
      if (!Array.isArray(orderedSectionIds)) {
        return res.status(400).json({ success: false, message: 'orderedSectionIds array is required.' });
      }

      await prisma.$transaction(
        orderedSectionIds.map((id, index) =>
          prisma.pageSection.update({
            where: { id },
            data: { sortOrder: index + 1 },
          })
        )
      );

      res.json({ success: true, message: 'Sections reordered successfully.' });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/page-builder/admin/sections/:id - Update section
router.put(
  '/admin/sections/:id',
  authenticate,
  requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        titleAr,
        titleTr,
        titleEn,
        subtitleAr,
        subtitleTr,
        subtitleEn,
        contentJson,
        sortOrder,
        isEnabled,
      } = req.body;

      const updated = await prisma.pageSection.update({
        where: { id },
        data: {
          titleAr,
          titleTr,
          titleEn,
          subtitleAr,
          subtitleTr,
          subtitleEn,
          contentJson: typeof contentJson === 'object' ? JSON.stringify(contentJson) : contentJson,
          sortOrder: sortOrder !== undefined ? parseInt(sortOrder) : undefined,
          isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : undefined,
        },
      });

      await auditLog(
        prisma,
        req.user.id,
        'UPDATE_PAGE_SECTION',
        'PageSection',
        id,
        `Updated section ${updated.sectionKey}`,
        req.ip
      );

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/page-builder/admin/sections/:id - Delete section
router.delete(
  '/admin/sections/:id',
  authenticate,
  requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await prisma.pageSection.delete({ where: { id } });
      await auditLog(prisma, req.user.id, 'DELETE_PAGE_SECTION', 'PageSection', id, 'Deleted section', req.ip);
      res.json({ success: true, message: 'Section deleted successfully.' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
