import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';
import { SETTINGS_GROUPS, SETTINGS_FIELDS, PUBLIC_SETTING_GROUPS, groupForKey } from '../config/settingsSchema.js';

const router = express.Router();

// GET /api/settings/public - Sitenin herkese açık ayarları (marka, menü, hero, footer, iletişim, tema...)
router.get('/public', async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { group: { in: PUBLIC_SETTING_GROUPS } },
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

// GET /api/settings/schema - Admin formunun otomatik üretilmesi için alan kataloğu
router.get('/schema', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    res.json({ success: true, data: { groups: SETTINGS_GROUPS, fields: SETTINGS_FIELDS } });
  } catch (error) {
    next(error);
  }
});

// GET /api/settings/admin - Admin: tüm ayarlar
router.get('/admin', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const settings = await prisma.siteSetting.findMany({
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
});

// PUT /api/settings/admin - Birden çok ayarı kaydet
router.put('/admin', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { settings = [] } = req.body; // [{ key, value, group? }]

    for (const item of settings) {
      if (!item.key) continue;
      const group = item.group || groupForKey(item.key);
      const value = typeof item.value === 'string' ? item.value : JSON.stringify(item.value ?? '');
      await prisma.siteSetting.upsert({
        where: { key: item.key },
        update: { value, group },
        create: { key: item.key, value, group },
      });
    }

    await auditLog(prisma, req.user.id, 'UPDATE_SETTINGS', 'SiteSetting', null, `Updated ${settings.length} global website settings`, req.ip);

    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;
