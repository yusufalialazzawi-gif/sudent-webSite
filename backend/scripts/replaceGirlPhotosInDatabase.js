import prisma from '../src/config/db.js';

async function replaceGirlPhotos() {
  console.log('=== REMOVING ALL PHOTOS/REFERENCES WITH GIRLS/FEMALES FROM DATABASE ===');

  // 1. Update Testimonials: Rename female student to male student
  const updatedTestimonials = await prisma.testimonial.updateMany({
    where: {
      studentName: {
        contains: 'ليان',
      },
    },
    data: {
      studentName: 'محمد التميمي (Mohammed Al-Tamimi)',
      quoteAr: 'الفريق محترف جداً ويشرح لك الخيارات الأكاديمية بكل مصداقية وشفافية. بفضلهم حصلت على قبول متميز في هندسة العمارة بجامعة بهتشه شهير ومستقر حالياً في سنتي الدراسية بنجاح.',
      quoteTr: 'Bahçeşehir Üniversitesi Mimarlık bölümüne resmi kabul aldım. Danışmanlıkları çok profesyonel, şeffaf ve güvenilirdi.',
      quoteEn: 'Extremely professional team that presents transparent facts without exaggerated promises. Thanks to them, I secured verified admission at Bahçeşehir University.',
      avatarUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80', // Sports car
    },
  });
  console.log(`Updated female student testimonial to male student: ${updatedTestimonials.count}`);

  // 2. Clean Scholarships
  // Replace photo-1523240795612-9a054b0db644, photo-1434030216411-0b793f4b4173, photo-1522202176988-66273c2fd55f, photo-1531482615713-2afd69097998
  const scholarships = await prisma.scholarship.findMany();
  for (const s of scholarships) {
    let newImg = s.imageUrl;
    if (s.imageUrl.includes('photo-1523240795612-9a054b0db644')) {
      newImg = 'https://images.unsplash.com/photo-1507842229451-7f01be837a2b?w=1000&auto=format&fit=crop&q=80'; // Grand Library
    } else if (s.imageUrl.includes('photo-1434030216411-0b793f4b4173')) {
      newImg = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1000&auto=format&fit=crop&q=80'; // Books on desk
    } else if (s.imageUrl.includes('photo-1522202176988-66273c2fd55f')) {
      newImg = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1000&auto=format&fit=crop&q=80'; // Diploma
    } else if (s.imageUrl.includes('photo-1531482615713-2afd69097998')) {
      newImg = 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1000&auto=format&fit=crop&q=80'; // Tech & Engineering
    }

    if (newImg !== s.imageUrl) {
      await prisma.scholarship.update({
        where: { id: s.id },
        data: { imageUrl: newImg },
      });
      console.log(`Updated scholarship ${s.slug} -> clean architectural/book image`);
    }
  }

  // 3. Clean Courses
  const courses = await prisma.course.findMany();
  for (const c of courses) {
    if (c.imageUrl && c.imageUrl.includes('photo-1434030216411-0b793f4b4173')) {
      const cleanImg = 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80';
      await prisma.course.update({
        where: { id: c.id },
        data: { imageUrl: cleanImg },
      });
      console.log(`Updated course ${c.slug} -> clean books/study desk image`);
    }
  }

  // 4. Clean Page Sections
  const pageSections = await prisma.pageSection.findMany();
  for (const ps of pageSections) {
    if (ps.contentJson) {
      let contentStr = ps.contentJson;
      let modified = false;
      if (contentStr.includes('photo-1523240795612-9a054b0db644')) {
        contentStr = contentStr.replace(/https:\/\/images\.unsplash\.com\/photo-1523240795612-9a054b0db644[^"']*/g, 'https://images.unsplash.com/photo-1507842229451-7f01be837a2b?w=1000&auto=format&fit=crop&q=80');
        modified = true;
      }
      if (contentStr.includes('photo-1434030216411-0b793f4b4173')) {
        contentStr = contentStr.replace(/https:\/\/images\.unsplash\.com\/photo-1434030216411-0b793f4b4173[^"']*/g, 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1000&auto=format&fit=crop&q=80');
        modified = true;
      }
      if (contentStr.includes('photo-1534528741775-53994a69daeb')) {
        contentStr = contentStr.replace(/https:\/\/images\.unsplash\.com\/photo-1534528741775-53994a69daeb[^"']*/g, 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&auto=format&fit=crop&q=80');
        modified = true;
      }
      if (modified) {
        await prisma.pageSection.update({
          where: { id: ps.id },
          data: { contentJson: contentStr },
        });
        console.log(`Updated PageSection ${ps.sectionType}`);
      }
    }
  }

  console.log('=== Database girl photo cleanup completed successfully ===');
}

replaceGirlPhotos()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
