import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole, auditLog } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/universities/:slug/reviews - Public list of approved reviews for a university
router.get('/university/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;

    const university = await prisma.university.findUnique({
      where: { slug },
      select: { id: true, slug: true },
    });

    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found.' });
    }

    const reviews = await prisma.universityReview.findMany({
      where: {
        universityId: university.id,
        status: 'APPROVED',
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1))
        : 5.0;

    res.json({
      success: true,
      data: reviews,
      metrics: {
        totalReviews,
        avgRating,
      },
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/universities/:slug/reviews - Submit a new review
router.post('/university/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { studentName, studentCountry, programStudied, rating, comment } = req.body;

    if (!studentName || !comment || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and written review are required.',
      });
    }

    const numRating = parseInt(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5 stars.',
      });
    }

    // Basic anti-spam check: comment length
    if (comment.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Review comment must be at least 10 characters long.',
      });
    }

    const university = await prisma.university.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found.' });
    }

    // Create review (status is APPROVED by default for genuine feedback or PENDING if configured)
    const review = await prisma.universityReview.create({
      data: {
        universityId: university.id,
        studentName: studentName.trim(),
        studentCountry: studentCountry ? studentCountry.trim() : null,
        programStudied: programStudied ? programStudied.trim() : null,
        rating: numRating,
        comment: comment.trim(),
        status: 'APPROVED',
        isVerified: false,
      },
    });

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review submitted successfully. Thank you for your feedback!',
    });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN REVIEW MODERATION ================= //

// GET /api/reviews/admin - Admin list of all reviews across universities
router.get('/admin/all', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { status, universityId } = req.query;

    const where = {};
    if (status) where.status = status;
    if (universityId) where.universityId = universityId;

    const reviews = await prisma.universityReview.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        university: {
          select: {
            id: true,
            slug: true,
            translations: { select: { lang: true, name: true } },
          },
        },
      },
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews/admin - Create a university review directly by admin
router.post('/admin', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { universityId, studentName, studentCountry, programStudied, rating, comment, status = 'APPROVED', isVerified = true } = req.body;

    if (!universityId || !studentName || !comment) {
      return res.status(400).json({
        success: false,
        message: 'University, student name, and comment are required.',
      });
    }

    const review = await prisma.universityReview.create({
      data: {
        universityId,
        studentName: studentName.trim(),
        studentCountry: studentCountry ? studentCountry.trim() : null,
        programStudied: programStudied ? programStudied.trim() : null,
        rating: Math.max(1, Math.min(5, parseInt(rating) || 5)),
        comment: comment.trim(),
        status: status || 'APPROVED',
        isVerified: Boolean(isVerified),
      },
    });

    await auditLog(prisma, req.user.id, 'CREATE_REVIEW', 'UniversityReview', review.id, `Created review for university ${universityId}`, req.ip);

    res.status(201).json({ success: true, data: review, message: 'Review created successfully.' });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/reviews/admin/:id - Update review status or verification
router.patch('/admin/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, isVerified, comment, studentName, studentCountry, programStudied, rating } = req.body;

    const updated = await prisma.universityReview.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(isVerified !== undefined && { isVerified: Boolean(isVerified) }),
        ...(comment && { comment: comment.trim() }),
        ...(studentName && { studentName: studentName.trim() }),
        ...(studentCountry !== undefined && { studentCountry: studentCountry ? studentCountry.trim() : null }),
        ...(programStudied !== undefined && { programStudied: programStudied ? programStudied.trim() : null }),
        ...(rating && { rating: Math.max(1, Math.min(5, parseInt(rating) || 5)) }),
      },
    });

    await auditLog(prisma, req.user.id, 'MODERATE_REVIEW', 'UniversityReview', id, `Updated review status to ${status}`, req.ip);

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reviews/admin/:id - Delete a review
router.delete('/admin/:id', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.universityReview.delete({ where: { id } });

    await auditLog(prisma, req.user.id, 'DELETE_REVIEW', 'UniversityReview', id, 'Deleted review', req.ip);

    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

// ================= ADMIN TESTIMONIALS (STUDENT REVIEWS WITH PHOTOS) ================= //

// GET /api/reviews/testimonials/admin - Fetch all student testimonials
router.get('/testimonials/admin', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
});

// POST /api/reviews/testimonials/admin - Create a student testimonial
router.post('/testimonials/admin', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const {
      studentName,
      nationality = '',
      program = '',
      university = '',
      rating = 5,
      quoteAr = '',
      quoteTr = '',
      quoteEn = '',
      avatarUrl = '',
      verified = true,
      published = true,
    } = req.body;

    if (!studentName || (!quoteAr && !quoteTr && !quoteEn)) {
      return res.status(400).json({
        success: false,
        message: 'Student name and at least one quote/comment are required.',
      });
    }

    // Auto-fill missing quotes so nothing is empty in any language
    const fallbackQuote = quoteAr || quoteTr || quoteEn;
    const finalQuoteAr = quoteAr || fallbackQuote;
    const finalQuoteTr = quoteTr || fallbackQuote;
    const finalQuoteEn = quoteEn || fallbackQuote;

    const testimonial = await prisma.testimonial.create({
      data: {
        studentName: studentName.trim(),
        nationality: (nationality || '').trim(),
        program: (program || '').trim(),
        university: (university || '').trim(),
        rating: Math.max(1, Math.min(5, parseInt(rating) || 5)),
        quoteAr: finalQuoteAr.trim(),
        quoteTr: finalQuoteTr.trim(),
        quoteEn: finalQuoteEn.trim(),
        avatarUrl: avatarUrl ? avatarUrl.trim() : null,
        verified: Boolean(verified),
        published: Boolean(published),
      },
    });

    await auditLog(prisma, req.user.id, 'CREATE_TESTIMONIAL', 'Testimonial', testimonial.id, `Created student testimonial for ${studentName}`, req.ip);

    res.status(201).json({ success: true, data: testimonial, message: 'Testimonial created successfully.' });
  } catch (error) {
    next(error);
  }
});

// PUT /api/reviews/testimonials/admin/:id - Update student testimonial
router.put('/testimonials/admin/:id', authenticate, requireRole(['SUPER_ADMIN', 'CONTENT_EDITOR']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      studentName,
      nationality,
      program,
      university,
      rating,
      quoteAr,
      quoteTr,
      quoteEn,
      avatarUrl,
      verified,
      published,
    } = req.body;

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(studentName && { studentName: studentName.trim() }),
        ...(nationality !== undefined && { nationality: nationality.trim() }),
        ...(program !== undefined && { program: program.trim() }),
        ...(university !== undefined && { university: university.trim() }),
        ...(rating !== undefined && { rating: Math.max(1, Math.min(5, parseInt(rating) || 5)) }),
        ...(quoteAr !== undefined && { quoteAr: quoteAr.trim() }),
        ...(quoteTr !== undefined && { quoteTr: quoteTr.trim() }),
        ...(quoteEn !== undefined && { quoteEn: quoteEn.trim() }),
        ...(avatarUrl !== undefined && { avatarUrl: avatarUrl ? avatarUrl.trim() : null }),
        ...(verified !== undefined && { verified: Boolean(verified) }),
        ...(published !== undefined && { published: Boolean(published) }),
      },
    });

    await auditLog(prisma, req.user.id, 'UPDATE_TESTIMONIAL', 'Testimonial', id, `Updated student testimonial for ${updated.studentName}`, req.ip);

    res.json({ success: true, data: updated, message: 'Testimonial updated successfully.' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/reviews/testimonials/admin/:id - Delete student testimonial
router.delete('/testimonials/admin/:id', authenticate, requireRole(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.testimonial.delete({ where: { id } });

    await auditLog(prisma, req.user.id, 'DELETE_TESTIMONIAL', 'Testimonial', id, 'Deleted testimonial', req.ip);

    res.json({ success: true, message: 'Testimonial deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export default router;

