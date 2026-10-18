import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';
import { hashPassword } from '../utils/security.js';

const router = express.Router();

// GET /api/staff - List staff accounts
router.get('/', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const staff = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { assignedApplications: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ success: true, data: staff });
  } catch (error) {
    next(error);
  }
});

// POST /api/staff - Create staff account
router.post('/', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { email, password, fullName, role } = req.body;
    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ success: false, message: 'Email, password, full name, and role are required.' });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'A user with this email already exists.' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        fullName: fullName.trim(),
        role,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    await auditLog(prisma, req.user.id, 'CREATE_STAFF', 'User', user.id, `Created staff account ${user.email} (${user.role})`, req.ip);

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// PUT /api/staff/:id - Update staff account or toggle active status
router.put('/:id', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, role, isActive, password } = req.body;

    const updateData = {};
    if (fullName) updateData.fullName = fullName.trim();
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (password) updateData.passwordHash = await hashPassword(password);

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    await auditLog(prisma, req.user.id, 'UPDATE_STAFF', 'User', id, `Updated staff account ${updated.email}`, req.ip);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// GET /api/staff/audit-logs - View system audit logs
router.get('/audit-logs', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const [total, logs] = await Promise.all([
      prisma.auditLog.count(),
      prisma.auditLog.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, fullName: true, email: true, role: true } },
        },
      }),
    ]);

    res.json({
      success: true,
      data: logs,
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

export default router;
