import express from 'express';
import fs from 'fs';
import path from 'path';
import prisma from '../config/db.js';
import { privateDocumentUpload, getPrivateDocPath } from '../middleware/upload.js';
import { applicationSubmissionLimiter } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';
import { generateApplicationNumber } from '../utils/security.js';

const router = express.Router();

// POST /api/applications/public-submit - Public student application submission
router.post(
  '/public-submit',
  applicationSubmissionLimiter,
  privateDocumentUpload.fields([
    { name: 'passport', maxCount: 1 },
    { name: 'transcript', maxCount: 1 },
    { name: 'diploma', maxCount: 1 },
    { name: 'cv', maxCount: 1 },
    { name: 'sop', maxCount: 1 },
    { name: 'recommendation', maxCount: 1 },
    { name: 'equivalence', maxCount: 1 },
    { name: 'languageCert', maxCount: 1 },
    { name: 'researchProposal', maxCount: 1 },
    { name: 'otherDoc', maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      const {
        fullName,
        email,
        phone,
        nationality,
        passportNumber,
        degreeLevel,
        desiredProgram,
        preferredCity,
        preferredUniversity,
        studyLanguage,
        currentEducation,
        notes,
        consentPrivacy,
      } = req.body;

      if (!fullName || !email || !phone || !nationality || !degreeLevel || !desiredProgram) {
        return res.status(400).json({
          success: false,
          message: 'Please fill in all required fields (Full name, Email, WhatsApp Phone, Nationality, Degree Level, and Desired Program).',
        });
      }

      if (consentPrivacy !== 'true' && consentPrivacy !== true) {
        return res.status(400).json({
          success: false,
          message: 'Consent to privacy notice and data processing is required.',
        });
      }

      const applicationNumber = generateApplicationNumber();

      // Create student application record
      const application = await prisma.studentApplication.create({
        data: {
          applicationNumber,
          fullName: fullName.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          nationality: nationality.trim(),
          passportNumber: passportNumber ? passportNumber.trim() : null,
          degreeLevel,
          desiredProgram: desiredProgram.trim(),
          preferredCity: preferredCity ? preferredCity.trim() : null,
          preferredUniversity: preferredUniversity ? preferredUniversity.trim() : null,
          studyLanguage: studyLanguage || 'ENGLISH',
          currentEducation: currentEducation ? currentEducation.trim() : null,
          notes: notes ? notes.trim() : null,
          status: 'NEW',
          consentPrivacy: true,
        },
      });

      // Handle private document uploads
      const uploadedFiles = req.files || {};
      const documentRecords = [];

      for (const [fieldName, files] of Object.entries(uploadedFiles)) {
        if (files && files.length > 0) {
          const file = files[0];
          let docType = 'OTHER';
          if (fieldName === 'passport') docType = 'PASSPORT';
          else if (fieldName === 'transcript') docType = 'TRANSCRIPT';
          else if (fieldName === 'diploma') docType = 'DIPLOMA';
          else if (fieldName === 'cv') docType = 'CV';
          else if (fieldName === 'sop') docType = 'STATEMENT_OF_PURPOSE';
          else if (fieldName === 'recommendation') docType = 'RECOMMENDATION_LETTER';
          else if (fieldName === 'equivalence') docType = 'EQUIVALENCE_CERTIFICATE';
          else if (fieldName === 'languageCert') docType = 'LANGUAGE_CERTIFICATE';
          else if (fieldName === 'researchProposal') docType = 'RESEARCH_PROPOSAL';

          documentRecords.push({
            applicationId: application.id,
            documentType: docType,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            filePath: file.path,
          });
        }
      }

      if (documentRecords.length > 0) {
        for (const doc of documentRecords) {
          await prisma.applicationDocument.create({ data: doc });
        }
      }

      // Record initial status in history
      await prisma.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          previousStatus: null,
          newStatus: 'NEW',
          notes: 'Application registered through public portal.',
        },
      });

      res.status(201).json({
        success: true,
        message: 'Your application has been received successfully! Our academic team will contact you within 24 hours.',
        applicationNumber: application.applicationNumber,
      });
    } catch (error) {
      next(error);
    }
  }
);

// ================= ADMIN APPLICATION MANAGEMENT ================= //

// GET /api/applications/admin - List & filter applications
router.get(
  '/admin',
  authenticate,
  requireRole(['SUPER_ADMIN', 'ADMISSIONS_STAFF']),
  async (req, res, next) => {
    try {
      const {
        search,
        status,
        nationality,
        degreeLevel,
        assignedStaffId,
        page = 1,
        limit = 15,
        sortBy = 'createdAt',
        order = 'desc',
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const take = parseInt(limit);

      const where = {};

      if (status) {
        where.status = { equals: status };
      }
      if (nationality) {
        where.nationality = { contains: nationality };
      }
      if (degreeLevel) {
        where.degreeLevel = { equals: degreeLevel };
      }
      if (assignedStaffId) {
        where.assignedStaffId = { equals: assignedStaffId };
      }

      if (search) {
        where.OR = [
          { applicationNumber: { contains: search } },
          { fullName: { contains: search } },
          { email: { contains: search } },
          { phone: { contains: search } },
          { desiredProgram: { contains: search } },
          { preferredUniversity: { contains: search } },
        ];
      }

      const orderBy = {};
      orderBy[sortBy] = order.toLowerCase() === 'asc' ? 'asc' : 'desc';

      const [total, applications] = await Promise.all([
        prisma.studentApplication.count({ where }),
        prisma.studentApplication.findMany({
          where,
          skip,
          take,
          orderBy,
          include: {
            assignedStaff: { select: { id: true, fullName: true, email: true } },
            _count: { select: { documents: true, internalNotes: true } },
          },
        }),
      ]);

      res.json({
        success: true,
        data: applications,
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
  }
);

// GET /api/applications/admin/:id - Application detail with documents and notes
router.get(
  '/admin/:id',
  authenticate,
  requireRole(['SUPER_ADMIN', 'ADMISSIONS_STAFF']),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const application = await prisma.studentApplication.findUnique({
        where: { id },
        include: {
          assignedStaff: { select: { id: true, fullName: true, email: true } },
          documents: {
            select: {
              id: true,
              documentType: true,
              originalName: true,
              mimeType: true,
              fileSize: true,
              createdAt: true,
            },
          },
          statusHistory: {
            orderBy: { createdAt: 'desc' },
            include: {
              changedBy: { select: { id: true, fullName: true } },
            },
          },
          internalNotes: {
            orderBy: { createdAt: 'desc' },
            include: {
              author: { select: { id: true, fullName: true } },
            },
          },
        },
      });

      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }

      res.json({ success: true, data: application });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/applications/admin/:id/status - Update application status
router.patch(
  '/admin/:id/status',
  authenticate,
  requireRole(['SUPER_ADMIN', 'ADMISSIONS_STAFF']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { newStatus, notes } = req.body;

      const validStatuses = [
        'NEW',
        'CONTACTED',
        'AWAITING_DOCS',
        'UNDER_REVIEW',
        'SUBMITTED_TO_UNI',
        'ADMISSION_RECEIVED',
        'REJECTED',
        'CLOSED',
      ];

      if (!newStatus || !validStatuses.includes(newStatus)) {
        return res.status(400).json({ success: false, message: 'Valid newStatus is required.' });
      }

      const current = await prisma.studentApplication.findUnique({ where: { id } });
      if (!current) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }

      const previousStatus = current.status;

      const updated = await prisma.studentApplication.update({
        where: { id },
        data: { status: newStatus },
      });

      // Record in history
      await prisma.applicationStatusHistory.create({
        data: {
          applicationId: id,
          previousStatus,
          newStatus,
          changedById: req.user.id,
          notes: notes || `Status changed from ${previousStatus} to ${newStatus}`,
        },
      });

      await auditLog(
        prisma,
        req.user.id,
        'UPDATE_APPLICATION_STATUS',
        'StudentApplication',
        id,
        `Status changed to ${newStatus}`,
        req.ip
      );

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /api/applications/admin/:id/assign - Assign to staff
router.patch(
  '/admin/:id/assign',
  authenticate,
  requireRole(['SUPER_ADMIN', 'ADMISSIONS_STAFF']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { staffId } = req.body;

      const updated = await prisma.studentApplication.update({
        where: { id },
        data: { assignedStaffId: staffId || null },
        include: { assignedStaff: { select: { id: true, fullName: true, email: true } } },
      });

      await auditLog(
        prisma,
        req.user.id,
        'ASSIGN_APPLICATION',
        'StudentApplication',
        id,
        `Assigned to staff ${staffId}`,
        req.ip
      );

      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/applications/admin/:id/notes - Add staff internal note
router.post(
  '/admin/:id/notes',
  authenticate,
  requireRole(['SUPER_ADMIN', 'ADMISSIONS_STAFF']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { noteText } = req.body;

      if (!noteText || !noteText.trim()) {
        return res.status(400).json({ success: false, message: 'Note text cannot be empty.' });
      }

      const note = await prisma.applicationNote.create({
        data: {
          applicationId: id,
          authorId: req.user.id,
          noteText: noteText.trim(),
        },
        include: {
          author: { select: { id: true, fullName: true } },
        },
      });

      res.status(201).json({ success: true, data: note });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/applications/admin/documents/:docId/download - Secure authorized document streaming
router.get(
  '/admin/documents/:docId/download',
  authenticate,
  requireRole(['SUPER_ADMIN', 'ADMISSIONS_STAFF']),
  async (req, res, next) => {
    try {
      const { docId } = req.params;

      const doc = await prisma.applicationDocument.findUnique({
        where: { id: docId },
        include: { application: true },
      });

      if (!doc) {
        return res.status(404).json({ success: false, message: 'Document not found.' });
      }

      const filePath = getPrivateDocPath(doc.fileName);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found on secure storage.' });
      }

      await auditLog(
        prisma,
        req.user.id,
        'DOWNLOAD_STUDENT_DOCUMENT',
        'ApplicationDocument',
        docId,
        `Downloaded ${doc.documentType} for ${doc.application.applicationNumber}`,
        req.ip
      );

      res.setHeader('Content-Type', doc.mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.originalName)}"`);

      const readStream = fs.createReadStream(filePath);
      readStream.pipe(res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
