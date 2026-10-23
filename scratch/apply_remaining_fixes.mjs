import fs from 'fs';
import path from 'path';

// Fix remaining lines across admin pages
const fileUpdates = [
  {
    file: 'frontend/src/pages/admin/AdminApplicationsPage.jsx',
    fixes: [
      {
        find: `{activeTab === 'applications' ? \`\${applications.length} طلبات\` : \`\${inquiries.length} رسائل\`}`,
        replace: `{activeTab === 'applications' ? \`\${applications.length} \${tx('طلبات', 'başvuru', 'applications')}\` : \`\${inquiries.length} \${tx('رسائل', 'mesaj', 'messages')}\`}`
      },
      {
        find: `المعدل: {app.highSchoolGpa || 'N/A'}%`,
        replace: `{tx('المعدل:', 'Not Ortalaması:', 'GPA:')} {app.highSchoolGpa || 'N/A'}%`
      },
      {
        find: `الوثائق والشهادات المرفوعة ({appDetail.documents?.length || 0})`,
        replace: `{tx('الوثائق والشهادات المرفوعة', 'Yüklenen Belgeler ve Sertifikalar', 'Uploaded Documents & Certificates')} ({appDetail.documents?.length || 0})`
      },
      {
        find: `الطالب: <span className="font-bold text-slate-800">{statusModalApp.applicantName}</span>`,
        replace: `{tx('الطالب:', 'Öğrenci:', 'Student:')} <span className="font-bold text-slate-800">{statusModalApp.applicantName}</span>`
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminBlogPage.jsx',
    fixes: [
      {
        find: `إجمالي المقالات: {articles.length}`,
        replace: `{tx('إجمالي المقالات:', 'Toplam Makale:', 'Total Articles:')} {articles.length}`
      },
      {
        find: `<span>{art.readTimeMinutes} دقائق قراءة</span>`,
        replace: `<span>{art.readTimeMinutes} {tx('دقائق قراءة', 'dk okuma', 'min read')}</span>`
      },
      {
        find: 'if (confirm(`هل أنت متأكد من حذف مقال ${arTitle}؟`))',
        replace: "if (confirm(tx(`هل أنت متأكد من حذف مقال ${arTitle}؟`, `${arTitle} başlıklı makaleyi silmek istediğinize emin misiniz?`, `Are you sure you want to delete article ${arTitle}?`)))"
      },
      {
        find: `عنوان المقال ({activeTab.toUpperCase()})*`,
        replace: `{tx('عنوان المقال', 'Makale Başlığı', 'Article Title')} ({activeTab.toUpperCase()})*`
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminCoursesPage.jsx',
    fixes: [
      {
        find: `إجمالي الدورات: {courses.length}`,
        replace: `{tx('إجمالي الدورات:', 'Toplam Kurs:', 'Total Courses:')} {courses.length}`
      },
      {
        find: `{crs.durationWeeks} أسابيع مكثفة`,
        replace: `{crs.durationWeeks} {tx('أسابيع مكثفة', 'hafta yoğun', 'weeks intensive')}`
      },
      {
        find: `<span>{regCount} / {crs.capacity || '∞'} طالب</span>`,
        replace: `<span>{regCount} / {crs.capacity || '∞'} {tx('طالب', 'öğrenci', 'students')}</span>`
      },
      {
        find: 'if (confirm(`هل أنت متأكد من حذف دورة ${arTitle}؟`))',
        replace: "if (confirm(tx(`هل أنت متأكد من حذف دورة ${arTitle}؟`, `${arTitle} kursunu silmek istediğinize emin misiniz?`, `Are you sure you want to delete course ${arTitle}?`)))"
      },
      {
        find: `ملاحظة الطالب: {reg.notes}`,
        replace: `{tx('ملاحظة الطالب:', 'Öğrenci Notu:', 'Student Note:')} {reg.notes}`
      },
      {
        find: `عنوان الدورة ({activeTab.toUpperCase()})*`,
        replace: `{tx('عنوان الدورة', 'Kurs Başlığı', 'Course Title')} ({activeTab.toUpperCase()})*`
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminMediaLibraryPage.jsx',
    fixes: [
      {
        find: 'if (confirm(`حذف الملف ${asset.originalName}؟`))',
        replace: "if (confirm(tx(`حذف الملف ${asset.originalName}؟`, `${asset.originalName} dosyasını silmek istiyor musunuz?`, `Delete file ${asset.originalName}?`)))"
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminPageBuilderPage.jsx',
    fixes: [
      {
        find: 'الصفحة الرئيسية (Home Page)',
        replace: "{tx('الصفحة الرئيسية (Home Page)', 'Ana Sayfa (Home Page)', 'Home Page')}"
      },
      {
        find: 'صفحة من نحن (About)',
        replace: "{tx('صفحة من نحن (About)', 'Hakkımızda Sayfası (About)', 'About Page')}"
      },
      {
        find: 'if (confirm(`هل أنت متأكد من حذف قسم ${sec.sectionKey}؟`))',
        replace: "if (confirm(tx(`هل أنت متأكد من حذف قسم ${sec.sectionKey}؟`, `${sec.sectionKey} bölümünü silmek istediğinize emin misiniz?`, `Are you sure you want to delete section ${sec.sectionKey}?`)))"
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminProgramsPage.jsx',
    fixes: [
      {
        find: `{filteredPrograms.length} برنامج`,
        replace: `{filteredPrograms.length} {tx('برنامج', 'program', 'programs')}`
      },
      {
        find: `<span>{prog.durationYears} سنوات</span>`,
        replace: `<span>{prog.durationYears} {tx('سنوات', 'yıl', 'years')}</span>`
      },
      {
        find: 'if (confirm(`هل أنت متأكد من حذف ${arName}؟`))',
        replace: "if (confirm(tx(`هل أنت متأكد من حذف ${arName}؟`, `${arName} programını silmek istediğinize emin misiniz?`, `Are you sure you want to delete ${arName}?`)))"
      },
      {
        find: `اسم التخصص ({activeTab.toUpperCase()})*`,
        replace: `{tx('اسم التخصص', 'Bölüm Adı', 'Program Name')} ({activeTab.toUpperCase()})*`
      },
      {
        find: `اسم الكلية ({activeTab.toUpperCase()})`,
        replace: `{tx('اسم الكلية', 'Fakülte Adı', 'Faculty Name')} ({activeTab.toUpperCase()})`
      },
      {
        find: `وصف تفصيلي للبرنامج والمقررات ({activeTab.toUpperCase()})`,
        replace: `{tx('وصف تفصيلي للبرنامج والمقررات', 'Program ve Derslerin Detaylı Açıklaması', 'Detailed Program & Courses Description')} ({activeTab.toUpperCase()})`
      },
      {
        find: `فرص العمل ومجالات التخرج ({activeTab.toUpperCase()})`,
        replace: `{tx('فرص العمل ومجالات التخرج', 'Kariyer Fırsatları ve Mezuniyet Alanları', 'Career Opportunities & Graduation Fields')} ({activeTab.toUpperCase()})`
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminScholarshipsPage.jsx',
    fixes: [
      {
        find: `إجمالي المنح: {scholarships.length}`,
        replace: `{tx('إجمالي المنح:', 'Toplam Burs:', 'Total Scholarships:')} {scholarships.length}`
      },
      {
        find: 'if (confirm(`هل أنت متأكد من حذف منحة ${arTitle}؟`))',
        replace: "if (confirm(tx(`هل أنت متأكد من حذف منحة ${arTitle}؟`, `${arTitle} bursunu silmek istediğinize emin misiniz?`, `Are you sure you want to delete scholarship ${arTitle}?`)))"
      },
      {
        find: `عنوان المنحة ({activeTab.toUpperCase()})*`,
        replace: `{tx('عنوان المنحة', 'Burs Başlığı', 'Scholarship Title')} ({activeTab.toUpperCase()})*`
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminServicesPage.jsx',
    fixes: [
      {
        find: `إجمالي الخدمات: {services.length}`,
        replace: `{tx('إجمالي الخدمات:', 'Toplam Hizmet:', 'Total Services:')} {services.length}`
      },
      {
        find: 'if (confirm(`هل أنت متأكد من حذف ${arTitle}؟`))',
        replace: "if (confirm(tx(`هل أنت متأكد من حذف ${arTitle}؟`, `${arTitle} hizmetini silmek istediğinize emin misiniz?`, `Are you sure you want to delete service ${arTitle}?`)))"
      },
      {
        find: `عنوان الخدمة ({activeTab.toUpperCase()})*`,
        replace: `{tx('عنوان الخدمة', 'Hizmet Başlığı', 'Service Title')} ({activeTab.toUpperCase()})*`
      },
      {
        find: `وصف الخدمة ({activeTab.toUpperCase()})`,
        replace: `{tx('وصف الخدمة', 'Hizmet Açıklaması', 'Service Description')} ({activeTab.toUpperCase()})`
      },
      {
        find: `المميزات والفوائد للطلاب ({activeTab.toUpperCase()})`,
        replace: `{tx('المميزات والفوائد للطلاب', 'Öğrenciler İçin Avantajlar', 'Benefits for Students')} ({activeTab.toUpperCase()})`
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminSettingsPage.jsx',
    fixes: [
      {
        find: '? `تم حفظ ${payload.length} إعداد بنجاح — الموقع يتحدث فوراً.`',
        replace: '? tx(`تم حفظ ${payload.length} إعداد بنجاح — الموقع يتحدث فوراً.`, `${payload.length} ayar başarıyla kaydedildi — Site anında güncelleniyor.`, `${payload.length} settings saved successfully — Site updates immediately.`)'
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminStaffPage.jsx',
    fixes: [
      {
        find: `{m._count?.assignedApplications || 0} طلب`,
        replace: `{m._count?.assignedApplications || 0} {tx('طلب', 'başvuru', 'applications')}`
      }
    ]
  },
  {
    file: 'frontend/src/pages/admin/AdminUniversitiesPage.jsx',
    fixes: [
      {
        find: 'if (confirm(`هل أنت متأكد من حذف ${arName} نهائياً؟`))',
        replace: "if (confirm(tx(`هل أنت متأكد من حذف ${arName} نهائياً؟`, `${arName} üniversitesini kalıcı olarak silmek istediğinize emin misiniz?`, `Are you sure you want to permanently delete ${arName}?`)))"
      },
      {
        find: 'يقوم النظام بالتحقق من كل سجل وإدخاله مع ترجماته (عربي، تركي، إنجليزي)، روابط المواقع الرسمية، الشعارات،',
        replace: "{tx('يقوم النظام بالتحقق من كل سجل وإدخاله مع ترجماته (عربي، تركي، إنجليزي)، روابط المواقع الرسمية، الشعارات،', 'Sistem her kaydı doğrular ve çevirileriyle (Arapça, Türkçe, İngilizce), resmi web siteleri ve logolarıyla kaydeder,', 'The system verifies each record and registers it with translations (Arabic, Turkish, English), official URLs and logos,')}"
      },
      {
        find: 'ولا يتم إظهار رسالة "تم الإنشاء بنجاح" إلا بعد التأكد الفعلي من وجود السجلات في قاعدة البيانات (Direct DB Verification).',
        replace: "{tx('ولا يتم إظهار رسالة \"تم الإنشاء بنجاح\" إلا بعد التأكد الفعلي من وجود السجلات في قاعدة البيانات (Direct DB Verification).', 've doğrudan veritabanında doğrulandıktan sonra başarı mesajı verilir.', 'and confirmation is only displayed after direct DB verification.')}"
      },
      {
        find: `{importRegistry.total} جامعة`,
        replace: `{importRegistry.total} {tx('جامعة', 'üniversite', 'universities')}`
      },
      {
        find: `{importRegistry.currentInDb} جامعة`,
        replace: `{importRegistry.currentInDb} {tx('جامعة', 'üniversite', 'universities')}`
      },
      {
        find: `<strong className="text-brand-navy-950">{importResults.verifiedDatabaseCount} جامعة</strong>`,
        replace: `<strong className="text-brand-navy-950">{importResults.verifiedDatabaseCount} {tx('جامعة', 'üniversite', 'universities')}</strong>`
      },
      {
        find: 'فحص تجريبي (Dry Run)',
        replace: "{tx('فحص تجريبي (Dry Run)', 'Deneme Çalıştırması (Dry Run)', 'Dry Run')}"
      },
      {
        find: 'حالة التقديم (Application Status)*',
        replace: "{tx('حالة التقديم (Application Status)*', 'Başvuru Durumu (Application Status)*', 'Application Status*')}"
      },
      {
        find: 'آخر موعد للتقديم (Deadline Text)',
        replace: "{tx('آخر موعد للتقديم (Deadline Text)', 'Son Başvuru Tarihi (Deadline Text)', 'Application Deadline Text')}"
      },
      {
        find: 'ملاحظة مخصصة لحالة التقديم (Status Note)',
        replace: "{tx('ملاحظة مخصصة لحالة التقديم (Status Note)', 'Durum İçin Özel Not (Status Note)', 'Status Note')}"
      },
      {
        find: 'نص إعلان القبول (يظهر في الشريط الترويجي المتحرك)',
        replace: "{tx('نص إعلان القبول (يظهر في الشريط الترويجي المتحرك)', 'Kabul Duyurusu Metni (Kayan tanıtım çubuğunda görünür)', 'Admission Announcement Text (shown in ticker banner)')}"
      },
      {
        find: `اسم الجامعة ({activeTab.toUpperCase()})*`,
        replace: `{tx('اسم الجامعة', 'Üniversite Adı', 'University Name')} ({activeTab.toUpperCase()})*`
      },
      {
        find: `نبذة شاملة عن الجامعة ({activeTab.toUpperCase()})`,
        replace: `{tx('نبذة شاملة عن الجامعة', 'Üniversite Hakkında Kapsamlı Bilgi', 'Comprehensive University Overview')} ({activeTab.toUpperCase()})`
      },
      {
        find: `شروط القبول والتسجيل ({activeTab.toUpperCase()})`,
        replace: `{tx('شروط القبول والتسجيل', 'Kabul ve Kayıt Şartları', 'Admission & Registration Requirements')} ({activeTab.toUpperCase()})`
      },
      {
        find: `السكن الطلابي والإقامة ({activeTab.toUpperCase()})`,
        replace: `{tx('السكن الطلابي والإقامة', 'Öğrenci Yurdu ve Konaklama', 'Student Dormitory & Accommodation')} ({activeTab.toUpperCase()})`
      },
      {
        find: `الاعتراف الدولي والاعتمادات ({activeTab.toUpperCase()})`,
        replace: `{tx('الاعتراف الدولي والاعتمادات', 'Uluslararası Tanınırlık ve Akreditasyonlar', 'International Recognition & Accreditations')} ({activeTab.toUpperCase()})`
      }
    ]
  }
];

let totalApplied = 0;
for (const item of fileUpdates) {
  const filePath = path.resolve(item.file);
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Make sure { tx } is imported from adminText
  if (!content.includes('tx')) {
    content = content.replace(/(import \{[^}]*ta[^}]*\} from '[^']+';)/, (match) => {
      return match.replace('{ ta }', '{ ta, tx }').replace('{ta}', '{ ta, tx }');
    });
  } else if (!content.includes('{ ta, tx }') && !content.includes('{ tx, ta }') && content.includes('{ ta }')) {
    content = content.replace('{ ta }', '{ ta, tx }');
  }

  let fileApplied = 0;
  for (const fix of item.fixes) {
    if (content.includes(fix.find)) {
      content = content.replace(fix.find, fix.replace);
      fileApplied++;
      totalApplied++;
    } else {
      console.warn(`[SKIP] Pattern not found in ${path.basename(item.file)}: ${fix.find.slice(0, 40)}...`);
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${path.basename(item.file)}: applied ${fileApplied}/${item.fixes.length}`);
}

console.log(`TOTAL APPLIED: ${totalApplied}`);
