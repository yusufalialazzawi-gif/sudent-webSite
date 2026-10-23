import fs from 'fs';
import path from 'path';

const files = [
  {
    path: 'frontend/src/pages/admin/AdminUniversitiesPage.jsx',
    find: `        setValidationError(
          currentLanguage === 'ar'
            ? \`يرجى إدخال اسم الجامعة باللغة (\${langLabel}). إدخال بيانات الجامعات بجميع اللغات الثلاث إلزامي لضمان تصفح الطلاب.\`
            : \`Lütfen (\${langLabel}) dilinde üniversite adını giriniz. Tüm 3 dilde (Arapça, Türkçe, İngilizce) içerik girilmesi zorunludur.\`
        );`,
    replace: `        setValidationError(
          tx(
            \`يرجى إدخال اسم الجامعة باللغة (\${langLabel}). إدخال بيانات الجامعات بجميع اللغات الثلاث إلزامي لضمان تصفح الطلاب.\`,
            \`Lütfen (\${langLabel}) dilinde üniversite adını giriniz. Tüm 3 dilde (Arapça, Türkçe, İngilizce) içerik girilmesi zorunludur.\`,
            \`Please enter the university name in (\${langLabel}). Entering content in all 3 languages is required.\`
          )
        );`
  },
  {
    path: 'frontend/src/pages/admin/AdminProgramsPage.jsx',
    find: `        setValidationError(
          currentLanguage === 'ar'
            ? \`يرجى إدخال اسم التخصص باللغة (\${langLabel}). إدخال التخصصات بجميع اللغات الثلاث إلزامي.\`
            : \`Lütfen (\${langLabel}) dilinde bölüm adını giriniz. Tüm 3 dilde bölüm adı zorunludur.\`
        );`,
    replace: `        setValidationError(
          tx(
            \`يرجى إدخال اسم التخصص باللغة (\${langLabel}). إدخال التخصصات بجميع اللغات الثلاث إلزامي.\`,
            \`Lütfen (\${langLabel}) dilinde bölüm adını giriniz. Tüm 3 dilde bölüm adı zorunludur.\`,
            \`Please enter the program name in (\${langLabel}). Entering content in all 3 languages is required.\`
          )
        );`
  },
  {
    path: 'frontend/src/pages/admin/AdminServicesPage.jsx',
    find: `        setValidationError(
          currentLanguage === 'ar'
            ? \`يرجى إدخال عنوان الخدمة باللغة (\${langLabel}). إدخال الخدمات بجميع اللغات الثلاث إلزامي.\`
            : \`Lütfen (\${langLabel}) dilinde hizmet başlığını giriniz. Tüm 3 dilde hizmet adı zorunludur.\`
        );`,
    replace: `        setValidationError(
          tx(
            \`يرجى إدخال عنوان الخدمة باللغة (\${langLabel}). إدخال الخدمات بجميع اللغات الثلاث إلزامي.\`,
            \`Lütfen (\${langLabel}) dilinde hizmet başlığını giriniz. Tüm 3 dilde hizmet adı zorunludur.\`,
            \`Please enter the service title in (\${langLabel}). Entering content in all 3 languages is required.\`
          )
        );`
  },
  {
    path: 'frontend/src/pages/admin/AdminCoursesPage.jsx',
    find: `        setValidationError(
          currentLanguage === 'ar'
            ? \`يرجى إدخال عنوان الدورة باللغة (\${langLabel}). إدخال الدورات بجميع اللغات الثلاث إلزامي.\`
            : \`Lütfen (\${langLabel}) dilinde kurs başlığını giriniz. Tüm 3 dilde kurs adı zorunludur.\`
        );`,
    replace: `        setValidationError(
          tx(
            \`يرجى إدخال عنوان الدورة باللغة (\${langLabel}). إدخال الدورات بجميع اللغات الثلاث إلزامي.\`,
            \`Lütfen (\${langLabel}) dilinde kurs başlığını giriniz. Tüm 3 dilde kurs adı zorunludur.\`,
            \`Please enter the course title in (\${langLabel}). Entering content in all 3 languages is required.\`
          )
        );`
  },
  {
    path: 'frontend/src/pages/admin/AdminScholarshipsPage.jsx',
    find: `        setValidationError(
          currentLanguage === 'ar'
            ? \`يرجى إدخال عنوان المنحة باللغة (\${langLabel}). إدخال البيانات بجميع اللغات الثلاث إلزامي لضمان توفير المعلومة للطلاب.\`
            : \`Lütfen (\${langLabel}) dilinde burs başlığını giriniz. Tüm 3 dilde (Arapça, Türkçe, İngilizce) içerik girilmesi zorunludur.\`
        );`,
    replace: `        setValidationError(
          tx(
            \`يرجى إدخال عنوان المنحة باللغة (\${langLabel}). إدخال البيانات بجميع اللغات الثلاث إلزامي لضمان توفير المعلومة للطلاب.\`,
            \`Lütfen (\${langLabel}) dilinde burs başlığını giriniz. Tüm 3 dilde (Arapça, Türkçe, İngilizce) içerik girilmesi zorunludur.\`,
            \`Please enter the scholarship title in (\${langLabel}). Entering content in all 3 languages is required.\`
          )
        );`
  },
  {
    path: 'frontend/src/pages/admin/AdminBlogPage.jsx',
    find: `        setValidationError(
          currentLanguage === 'ar'
            ? \`يرجى إدخال عنوان المقال باللغة (\${langLabel}). إدخال المقالات بجميع اللغات الثلاث إلزامي.\`
            : \`Lütfen (\${langLabel}) dilinde makale başlığını giriniz. Tüm 3 dilde içerik girilmesi zorunludur.\`
        );`,
    replace: `        setValidationError(
          tx(
            \`يرجى إدخال عنوان المقال باللغة (\${langLabel}). إدخال المقالات بجميع اللغات الثلاث إلزامي.\`,
            \`Lütfen (\${langLabel}) dilinde makale başlığını giriniz. Tüm 3 dilde içerik girilmesi zorunludur.\`,
            \`Please enter the article title in (\${langLabel}). Entering content in all 3 languages is required.\`
          )
        );`
  }
];

for (const f of files) {
  const fullPath = path.resolve(f.path);
  let src = fs.readFileSync(fullPath, 'utf8');
  if (src.includes(f.find)) {
    src = src.replace(f.find, f.replace);
    fs.writeFileSync(fullPath, src, 'utf8');
    console.log(`Updated validation in: ${path.basename(f.path)}`);
  } else {
    console.warn(`[WARN] Not found in: ${path.basename(f.path)}`);
  }
}
