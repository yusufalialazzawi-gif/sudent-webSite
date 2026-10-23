import prisma from '../src/config/db.js';

const admissionUpdates = [
  {
    slug: 'istanbul-universitesi',
    admissionStatus: 'OPEN',
    admissionStartDate: new Date('2026-06-01'),
    admissionEndDate: new Date('2026-08-30'),
    announcementText: '2026-2027 Güz Dönemi Uluslararası Öğrenci & Yüksek Lisans (Tezli/Tezsiz) Başvuruları Başladı!',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'bogazici-universitesi',
    admissionStatus: 'OPEN',
    admissionStartDate: new Date('2026-06-15'),
    admissionEndDate: new Date('2026-08-25'),
    announcementText: 'Boğaziçi Üniversitesi İngilizce Tezli Yüksek Lisans ve Doktora Başvuruları Açıldı.',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'orta-dogu-teknik-universitesi',
    admissionStatus: 'OPEN',
    admissionStartDate: new Date('2026-06-10'),
    admissionEndDate: new Date('2026-08-20'),
    announcementText: 'ODTÜ Fen Bilimleri & Sosyal Bilimler Enstitüsü Yüksek Lisans Başvuruları Aktif.',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'istanbul-teknik-universitesi',
    admissionStatus: 'OPEN',
    admissionStartDate: new Date('2026-06-05'),
    admissionEndDate: new Date('2026-08-28'),
    announcementText: 'İTÜ Mühendislik, Mimarlık ve Yapay Zeka Yüksek Lisans Kontenjanları İlan Edildi.',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'hacettepe-universitesi',
    admissionStatus: 'OPEN',
    admissionStartDate: new Date('2026-06-01'),
    admissionEndDate: new Date('2026-08-31'),
    announcementText: 'Hacettepe Üniversitesi Sağlık Bilimleri ve Sosyal Bilimler Yüksek Lisans Başvuruları Açık.',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'ankara-universitesi',
    admissionStatus: 'UPCOMING',
    admissionStartDate: new Date('2026-07-01'),
    admissionEndDate: new Date('2026-09-05'),
    announcementText: 'Ankara Üniversitesi Lisans ve Yüksek Lisans Başvuruları 1 Temmuz İtibarıyla Başlıyor!',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'marmara-universitesi',
    admissionStatus: 'OPEN',
    admissionStartDate: new Date('2026-06-10'),
    admissionEndDate: new Date('2026-08-25'),
    announcementText: 'Marmara Üniversitesi İktisat, İletişim ve Mühendislik Yüksek Lisans Başvuruları Başladı.',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'yildiz-teknik-universitesi',
    admissionStatus: 'OPEN',
    admissionStartDate: new Date('2026-06-12'),
    admissionEndDate: new Date('2026-08-22'),
    announcementText: 'YTÜ Bilgisayar ve Mimarlık Yüksek Lisans Başvuru Ekranı Açık.',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'ege-universitesi',
    admissionStatus: 'UPCOMING',
    admissionStartDate: new Date('2026-07-15'),
    admissionEndDate: new Date('2026-09-10'),
    announcementText: 'Ege Üniversitesi 2026 Yüksek Lisans ve Uluslararası Öğrenci Kabul Takvimi Yayınlandı.',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'gazi-universitesi',
    admissionStatus: 'UPCOMING',
    admissionStartDate: new Date('2026-07-10'),
    admissionEndDate: new Date('2026-09-01'),
    announcementText: 'Gazi Üniversitesi Uluslararası Öğrenci Kabul Takvimi (Açılış: 10 Temmuz).',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'dokuz-eylul-universitesi',
    admissionStatus: 'OPEN',
    admissionStartDate: new Date('2026-06-08'),
    admissionEndDate: new Date('2026-08-28'),
    announcementText: 'Dokuz Eylül Üniversitesi Denizcilik, Tıp ve Mühendislik Yüksek Lisans Başvuruları Açık.',
    graduateAdmissionOpen: true,
  },
  {
    slug: 'bursa-uludag-universitesi',
    admissionStatus: 'UPCOMING',
    admissionStartDate: new Date('2026-07-20'),
    admissionEndDate: new Date('2026-09-15'),
    announcementText: 'Bursa Uludağ Üniversitesi Lisans & Yüksek Lisans Başvuru Süreci Yakında Açılıyor.',
    graduateAdmissionOpen: true,
  },
];

async function updateAnnouncements() {
  console.log('Updating universities admission status and announcements...');
  for (const item of admissionUpdates) {
    try {
      const uni = await prisma.university.findUnique({ where: { slug: item.slug } });
      if (uni) {
        await prisma.university.update({
          where: { id: uni.id },
          data: {
            admissionStatus: item.admissionStatus,
            admissionStartDate: item.admissionStartDate,
            admissionEndDate: item.admissionEndDate,
            announcementText: item.announcementText,
            graduateAdmissionOpen: item.graduateAdmissionOpen,
          },
        });
        console.log(`Updated ${item.slug}: Status=${item.admissionStatus}`);
      }
    } catch (e) {
      console.error(`Error updating ${item.slug}:`, e.message);
    }
  }
  console.log('Done updating admission announcements.');
}

updateAnnouncements()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
