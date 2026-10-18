import express from 'express';
import prisma from '../config/db.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';

const router = express.Router();

// GET /api/public/search-options - Distinct cities, degrees, study languages for hero quick search
router.get('/search-options', async (req, res, next) => {
  try {
    const citiesRaw = await prisma.university.findMany({
      where: { published: true },
      distinct: ['city'],
      select: { city: true },
      orderBy: { city: 'asc' },
    });
    const cities = citiesRaw.map((c) => c.city);

    const categories = await prisma.programCategory.findMany({
      select: { id: true, slug: true, nameAr: true, nameTr: true, nameEn: true },
    });

    const degrees = [
      { value: 'BACHELOR', labelAr: 'بكالوريوس', labelTr: 'Lisans', labelEn: "Bachelor's" },
      { value: 'MASTER_WITH_THESIS', labelAr: 'ماجستير بأطروحة', labelTr: 'Tezli Yüksek Lisans', labelEn: "Master's (Thesis)" },
      { value: 'MASTER_NON_THESIS', labelAr: 'ماجستير بدون أطروحة', labelTr: 'Tezsiz Yüksek Lisans', labelEn: "Master's (Non-Thesis)" },
      { value: 'PHD', labelAr: 'دكتوراه', labelTr: 'Doktora', labelEn: 'Doctorate (Ph.D.)' },
      { value: 'ASSOCIATE', labelAr: 'دبلوم متوسط', labelTr: 'Ön Lisans', labelEn: 'Associate Degree' },
    ];

    const studyLanguages = [
      { value: 'ENGLISH', labelAr: 'اللغة الإنجليزية', labelTr: 'İngilizce', labelEn: 'English' },
      { value: 'TURKISH', labelAr: 'اللغة التركية', labelTr: 'Türkçe', labelEn: 'Turkish' },
      { value: 'MIXED', labelAr: 'مختلط (30% إنجليزي)', labelTr: 'Karma (%30 İngilizce)', labelEn: 'Mixed (30% English)' },
    ];

    res.json({
      success: true,
      data: {
        cities,
        categories,
        degrees,
        studyLanguages,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/testimonials
router.get('/testimonials', async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/faqs
router.get('/faqs', async (req, res, next) => {
  try {
    const { category, lang = 'ar' } = req.query;
    const where = { published: true };
    if (category) {
      where.category = category.toUpperCase();
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: {
          where: { lang: { in: [lang, 'ar', 'en'] } },
        },
      },
    });

    res.json({ success: true, data: faqs });
  } catch (error) {
    next(error);
  }
});

// POST /api/public/contact - Submit general inquiry
router.post('/contact', apiLimiter, async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        subject: subject ? subject.trim() : null,
        message: message.trim(),
        status: 'NEW',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
      data: { id: inquiry.id },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/public/inquiries/admin - Admin view contact inquiries
router.get('/inquiries/admin', authenticate, requireRole(['SUPER_ADMIN', 'ADMISSIONS_STAFF']), async (req, res, next) => {
  try {
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: inquiries });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/public/inquiries/admin/:id/status - Update inquiry status
router.patch('/inquiries/admin/:id/status', authenticate, requireRole(['SUPER_ADMIN', 'ADMISSIONS_STAFF']), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await prisma.contactInquiry.update({
      where: { id },
      data: { status },
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
});

export default router;
