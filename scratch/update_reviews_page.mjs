import fs from 'fs';
import path from 'path';

const filePath = path.resolve('frontend/src/pages/admin/AdminReviewsPage.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Ensure tx is imported
content = content.replace("import { ta } from '../../i18n/adminText';", "import { ta, tx } from '../../i18n/adminText';");

const replacements = [
  {
    find: `            {currentLanguage === 'ar'
              ? ta('مراجعة واعتماد أو حجب تقييمات الطلاب للجامعات، وتوثيق مراجعات الطلاب المسجلين فعلياً')
              : 'Review, approve, reject, hide student feedback and grant verified enrollment badges'}`,
    replace: `            {tx('مراجعة واعتماد أو حجب تقييمات الطلاب للجامعات، وتوثيق مراجعات الطلاب المسجلين فعلياً', 'Öğrencilerin üniversite değerlendirmelerini inceleyin, onaylayın veya gizleyin; kayıtlı öğrenci rozeti verin', 'Review, approve, reject, hide student feedback and grant verified enrollment badges')}`
  },
  {
    find: `{currentLanguage === 'ar' ? \`إجمالي المراجعات: \${reviews.length}\` : \`Total Reviews: \${reviews.length}\`}`,
    replace: `{tx('إجمالي المراجعات:', 'Toplam Değerlendirme:', 'Total Reviews:')} {reviews.length}`
  },
  {
    find: `placeholder={
              currentLanguage === 'ar'
                ? ta('بحث باسم الطالب، نص المراجعة، أو الجامعة...')
                : 'Search student name, comment, university...'
            }`,
    replace: `placeholder={tx('بحث باسم الطالب، نص المراجعة، أو الجامعة...', 'Öğrenci adı, yorum veya üniversite ara...', 'Search student name, comment, university...')}`
  },
  {
    find: `<option value="">{currentLanguage === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>`,
    replace: `<option value="">{tx('جميع الحالات', 'Tüm Durumlar', 'All Statuses')}</option>`
  },
  {
    find: `<option value="APPROVED">{currentLanguage === 'ar' ? 'معتمد ومنشور' : 'Approved'}</option>`,
    replace: `<option value="APPROVED">{tx('معتمد ومنشور', 'Onaylandı ve Yayında', 'Approved')}</option>`
  },
  {
    find: `<option value="PENDING">{currentLanguage === 'ar' ? 'قيد المراجعة' : 'Pending'}</option>`,
    replace: `<option value="PENDING">{tx('قيد المراجعة', 'İncelemede', 'Pending')}</option>`
  },
  {
    find: `<option value="REJECTED">{currentLanguage === 'ar' ? 'مرفوض' : 'Rejected'}</option>`,
    replace: `<option value="REJECTED">{tx('مرفوض', 'Reddedildi', 'Rejected')}</option>`
  },
  {
    find: `<option value="HIDDEN">{currentLanguage === 'ar' ? 'مخفي' : 'Hidden'}</option>`,
    replace: `<option value="HIDDEN">{tx('مخفي', 'Gizli', 'Hidden')}</option>`
  },
  {
    find: `<span>{currentLanguage === 'ar' ? 'جاري تحميل المراجعات...' : 'Loading reviews...'}</span>`,
    replace: `<span>{tx('جاري تحميل المراجعات...', 'Değerlendirmeler yükleniyor...', 'Loading reviews...')}</span>`
  },
  {
    find: `{currentLanguage === 'ar' ? 'لا توجد تقييمات مطابقة' : 'No matching reviews found'}`,
    replace: `{tx('لا توجد تقييمات مطابقة', 'Eşleşen değerlendirme bulunamadı', 'No matching reviews found')}`
  },
  {
    find: `{currentLanguage === 'ar'
                ? ta('عندما يقدم الطلاب مراجعاتهم للجامعات ستظهر هنا للمعاينة والاعتماد.')
                : 'Student reviews submitted on university pages will appear here for moderation.'}`,
    replace: `{tx('عندما يقدم الطلاب مراجعاتهم للجامعات ستظهر هنا للمعاينة والاعتماد.', 'Öğrenciler üniversite değerlendirmesi gönderdiğinde burada inceleme ve onay için görünecek.', 'Student reviews submitted on university pages will appear here for moderation.')}`
  },
  {
    find: `<span>{currentLanguage === 'ar' ? 'طالب موثق' : 'Verified Student'}</span>`,
    replace: `<span>{tx('طالب موثق', 'Onaylı Öğrenci', 'Verified Student')}</span>`
  },
  {
    find: `{rev.isVerified
                        ? currentLanguage === 'ar'
                          ? ta('إلغاء التوثيق')
                          : 'Unverify'
                        : currentLanguage === 'ar'
                        ? ta('توثيق كطالب مسجل')
                        : 'Mark as Verified'}`,
    replace: `{rev.isVerified ? tx('إلغاء التوثيق', 'Doğrulamayı Kaldır', 'Unverify') : tx('توثيق كطالب مسجل', 'Kayıtlı Öğrenci Olarak Doğrula', 'Mark as Verified')}`
  },
  {
    find: `{currentLanguage === 'ar' ? 'موافقة ونشر' : 'Approve'}`,
    replace: `{tx('موافقة ونشر', 'Onayla ve Yayınla', 'Approve')}`
  },
  {
    find: `{currentLanguage === 'ar' ? 'إخفاء' : 'Hide'}`,
    replace: `{tx('إخفاء', 'Gizle', 'Hide')}`
  },
  {
    find: `{currentLanguage === 'ar' ? 'رفض' : 'Reject'}`,
    replace: `{tx('رفض', 'Reddet', 'Reject')}`
  },
  {
    find: `title={currentLanguage === 'ar' ? 'حذف نهائي' : 'Delete'}`,
    replace: `title={tx('حذف نهائي', 'Kalıcı Olarak Sil', 'Delete')}`
  }
];

let applied = 0;
for (const r of replacements) {
  if (content.includes(r.find)) {
    content = content.replace(r.find, r.replace);
    applied++;
  } else {
    console.warn(`[WARN] not found: ${r.find.slice(0, 30)}...`);
  }
}
fs.writeFileSync(filePath, content, 'utf8');
console.log(`AdminReviewsPage: applied ${applied}/${replacements.length}`);
