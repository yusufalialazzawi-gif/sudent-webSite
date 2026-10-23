import express from 'express';
import prisma from '../config/db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/dashboard/metrics
router.get('/metrics', authenticate, async (req, res, next) => {
  try {
    // 1. Applications counts by status
    const [
      totalApplications,
      newApplications,
      contactedApplications,
      awaitingDocsApplications,
      underReviewApplications,
      submittedToUniApplications,
      admissionsReceived,
      rejectedApplications,
      closedApplications,
      newInquiries,
    ] = await Promise.all([
      prisma.studentApplication.count(),
      prisma.studentApplication.count({ where: { status: 'NEW' } }),
      prisma.studentApplication.count({ where: { status: 'CONTACTED' } }),
      prisma.studentApplication.count({ where: { status: 'AWAITING_DOCS' } }),
      prisma.studentApplication.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.studentApplication.count({ where: { status: 'SUBMITTED_TO_UNI' } }),
      prisma.studentApplication.count({ where: { status: 'ADMISSION_RECEIVED' } }),
      prisma.studentApplication.count({ where: { status: 'REJECTED' } }),
      prisma.studentApplication.count({ where: { status: 'CLOSED' } }),
      prisma.contactInquiry.count({ where: { status: 'NEW' } }),
    ]);

    // In-progress applications sum
    const inProgressApplications = contactedApplications + awaitingDocsApplications + underReviewApplications + submittedToUniApplications;

    // 2. Content metrics
    const [
      totalUniversities,
      totalPrograms,
      publishedServices,
      activeCourses,
      activeScholarships,
      publishedArticles,
    ] = await Promise.all([
      prisma.university.count({ where: { published: true } }),
      prisma.academicProgram.count({ where: { published: true } }),
      prisma.service.count({ where: { published: true } }),
      prisma.course.count({ where: { status: 'ACTIVE', published: true } }),
      prisma.scholarship.count({ where: { status: 'ACTIVE', published: true } }),
      prisma.article.count({ where: { published: true } }),
    ]);

    // 3. Compute Missing Translations count
    // A university needs 3 translations (ar, tr, en). If translations.length < 3, it's missing some!
    const [allUnis, allProgs, allServs, allCourses, allScholarships, allArticles] = await Promise.all([
      prisma.university.findMany({ select: { id: true, translations: { select: { lang: true } } } }),
      prisma.academicProgram.findMany({ select: { id: true, translations: { select: { lang: true } } } }),
      prisma.service.findMany({ select: { id: true, translations: { select: { lang: true } } } }),
      prisma.course.findMany({ select: { id: true, translations: { select: { lang: true } } } }),
      prisma.scholarship.findMany({ select: { id: true, translations: { select: { lang: true } } } }),
      prisma.article.findMany({ select: { id: true, translations: { select: { lang: true } } } }),
    ]);

    let missingTranslationsCount = 0;
    const checkMissing = (items) => {
      for (const item of items) {
        const langs = item.translations.map((t) => t.lang);
        if (!langs.includes('ar')) missingTranslationsCount++;
        if (!langs.includes('tr')) missingTranslationsCount++;
        if (!langs.includes('en')) missingTranslationsCount++;
      }
    };

    checkMissing(allUnis);
    checkMissing(allProgs);
    checkMissing(allServs);
    checkMissing(allCourses);
    checkMissing(allScholarships);
    checkMissing(allArticles);

    // 4. Recent Applications (Latest 5)
    const recentApplications = await prisma.studentApplication.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        applicationNumber: true,
        fullName: true,
        nationality: true,
        desiredProgram: true,
        preferredUniversity: true,
        degreeLevel: true,
        status: true,
        createdAt: true,
      },
    });

    // 5. Recent Contact Inquiries (Latest 6)
    const [totalInquiries, recentInquiriesList] = await Promise.all([
      prisma.contactInquiry.count(),
      prisma.contactInquiry.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const formattedRecentInquiries = recentInquiriesList.map((inq) => ({
      id: inq.id,
      name: inq.fullName,
      fullName: inq.fullName,
      email: inq.email,
      phone: inq.phone,
      subject: inq.subject,
      message: inq.message,
      status: inq.status,
      createdAt: inq.createdAt,
    }));

    res.json({
      success: true,
      data: {
        // Flattened metrics for dashboard summary cards
        totalApplications,
        submittedApplications: newApplications,
        underReviewApplications,
        acceptedApplications: admissionsReceived,
        enrolledApplications: closedApplications,
        totalUniversities,
        totalPrograms,
        totalInquiries,
        recentApplications,
        recentInquiries: formattedRecentInquiries,

        // Grouped metrics
        applications: {
          total: totalApplications,
          new: newApplications,
          awaitingFollowUp: contactedApplications + awaitingDocsApplications,
          inProgress: inProgressApplications,
          successfulAdmissions: admissionsReceived,
          rejected: rejectedApplications,
          closed: closedApplications,
          statusBreakdown: [
            { status: 'NEW', count: newApplications, labelAr: 'طلب جديد', labelTr: 'Yeni Başvuru', labelEn: 'New' },
            { status: 'CONTACTED', count: contactedApplications, labelAr: 'تم التواصل', labelTr: 'İletişim Kuruldu', labelEn: 'Contacted' },
            { status: 'AWAITING_DOCS', count: awaitingDocsApplications, labelAr: 'بانتظار الوثائق', labelTr: 'Evrak Bekleniyor', labelEn: 'Awaiting Docs' },
            { status: 'UNDER_REVIEW', count: underReviewApplications, labelAr: 'قيد التدقيق', labelTr: 'İncelemede', labelEn: 'Under Review' },
            { status: 'SUBMITTED_TO_UNI', count: submittedToUniApplications, labelAr: 'رُفِع للجامعة', labelTr: 'Üniversiteye Gönderildi', labelEn: 'Submitted to Uni' },
            { status: 'ADMISSION_RECEIVED', count: admissionsReceived, labelAr: 'صدر القبول بنجاح', labelTr: 'Kabul Alındı', labelEn: 'Admission Received' },
            { status: 'REJECTED', count: rejectedApplications, labelAr: 'مرفوض', labelTr: 'Reddedildi', labelEn: 'Rejected' },
          ],
        },
        inquiries: {
          total: totalInquiries,
          new: newInquiries,
          recent: formattedRecentInquiries,
        },
        content: {
          totalUniversities,
          totalPrograms,
          publishedServices,
          activeCourses,
          activeScholarships,
          publishedArticles,
        },
        translations: {
          missingCount: missingTranslationsCount,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
