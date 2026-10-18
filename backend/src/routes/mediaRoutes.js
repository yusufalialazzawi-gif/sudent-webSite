import express from 'express';
import fs from 'fs';
import path from 'path';
import prisma from '../config/db.js';
import { publicUpload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/media - List media library assets
router.get('/', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { assetType, search, page = 1, limit = 24 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {};
    if (assetType) {
      where.assetType = assetType.toUpperCase();
    }
    if (search) {
      where.OR = [
        { originalName: { contains: search } },
        { altTextAr: { contains: search } },
        { altTextTr: { contains: search } },
        { altTextEn: { contains: search } },
      ];
    }

    const [total, assets] = await Promise.all([
      prisma.mediaAsset.count({ where }),
      prisma.mediaAsset.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      success: true,
      data: assets,
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

// POST /api/media/upload - Upload new asset
router.post(
  '/upload',
  authenticate,
  requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']),
  publicUpload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
      }

      const { assetType = 'IMAGE', altTextAr, altTextTr, altTextEn } = req.body;
      const fileUrl = `/uploads/${req.file.filename}`;

      const asset = await prisma.mediaAsset.create({
        data: {
          fileName: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          fileSize: req.file.size,
          url: fileUrl,
          assetType: assetType.toUpperCase(),
          altTextAr: altTextAr || '',
          altTextTr: altTextTr || '',
          altTextEn: altTextEn || '',
        },
      });

      await auditLog(
        prisma,
        req.user.id,
        'UPLOAD_MEDIA',
        'MediaAsset',
        asset.id,
        `Uploaded ${asset.originalName}`,
        req.ip
      );

      res.status(201).json({ success: true, data: asset });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/media/:id - Update alt text or metadata
router.put('/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { altTextAr, altTextTr, altTextEn, assetType } = req.body;

    const updated = await prisma.mediaAsset.update({
      where: { id },
      data: {
        altTextAr,
        altTextTr,
        altTextEn,
        assetType: assetType ? assetType.toUpperCase() : undefined,
      },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/media/:id - Delete media asset
router.delete('/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const asset = await prisma.mediaAsset.findUnique({ where: { id } });
    if (!asset) {
      return res.status(404).json({ success: false, message: 'Asset not found.' });
    }

    // Try deleting physical file
    const filePath = path.resolve(process.env.UPLOAD_DIR || './uploads', asset.fileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.warn('Could not unlink media file from disk:', err.message);
      }
    }

    await prisma.mediaAsset.delete({ where: { id } });
    await auditLog(prisma, req.user.id, 'DELETE_MEDIA', 'MediaAsset', id, `Deleted ${asset.originalName}`, req.ip);

    res.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
