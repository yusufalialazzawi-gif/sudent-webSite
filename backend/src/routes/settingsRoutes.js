import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/settings/public - Public site settings (Branding, WhatsApp, Theme, Contact)
router.get('/public', async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        group: { in: ['GENERAL', 'THEME', 'CONTACT', 'WHATSAPP', 'SEO'] },
      },
    });

    const settingsMap = {};
    for (const s of settings) {
      settingsMap[s.key] = s.value;
    }

    res.json({ success: true, data: settingsMap });
  } catch (error) {
    next(error);
  }
});

// GET /api/settings/admin - Admin view all settings
router.get('/admin', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: { group: 'asc' },
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings/admin - Update multiple settings
router.put('/admin', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { settings = [] } = req.body; // array of { key, value, group }

    for (const item of settings) {
      if (item.key) {
        await prisma.siteSetting.upsert({
          where: { key: item.key },
          update: { value: String(item.value), group: item.group || 'GENERAL' },
          create: { key: item.key, value: String(item.value), group: item.group || 'GENERAL' },
        });
      }
    }

    await auditLog(prisma, req.user.id, 'UPDATE_SETTINGS', 'SiteSetting', null, 'Updated global website settings', req.ip);

    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
