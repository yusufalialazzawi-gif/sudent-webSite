import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const flowerAndCarAvatars = [
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&auto=format&fit=crop&q=80', // Colorful blooming flowers
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&auto=format&fit=crop&q=80', // Modern Porsche sports car
  'https://images.unsplash.com/photo-1508615039623-a25605d2b022?w=300&auto=format&fit=crop&q=80', // Elegant white flowers
  'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=300&auto=format&fit=crop&q=80', // Modern luxury sports car
  'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&auto=format&fit=crop&q=80', // Red roses
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=300&auto=format&fit=crop&q=80', // Sleek car
];

async function updateAvatarsAndSettings() {
  console.log('--- Updating Testimonials with Flower & Car Photos ---');
  
  const testimonials = await prisma.testimonial.findMany();
  console.log(`Found ${testimonials.length} testimonials in database`);

  for (let i = 0; i < testimonials.length; i++) {
    const item = testimonials[i];
    const newAvatar = flowerAndCarAvatars[i % flowerAndCarAvatars.length];
    await prisma.testimonial.update({
      where: { id: item.id },
      data: { avatarUrl: newAvatar },
    });
    console.log(`Updated testimonial ${item.id} (${item.studentName}) -> ${newAvatar.substring(0, 50)}...`);
  }

  console.log('--- Updating Settings from 60+ to +120 ---');
  const settings = await prisma.siteSetting.findMany();
  for (const s of settings) {
    if (typeof s.value === 'string' && (s.value.includes('60+') || s.value.includes('60'))) {
      const updatedVal = s.value
        .replace(/60\+/g, '+120')
        .replace(/أكثر من 60 جامعة/g, 'أكثر من 120 جامعة')
        .replace(/60 Türk Üniversitesinin/g, '+120 Türk Üniversitesinin')
        .replace(/60\+ Turkish Universities/g, '+120 Turkish Universities');
      
      if (updatedVal !== s.value) {
        await prisma.siteSetting.update({
          where: { key: s.key },
          data: { value: updatedVal },
        });
        console.log(`Updated setting ${s.key}: ${s.value} -> ${updatedVal}`);
      }
    }
  }

  console.log('--- Successfully Completed ---');
}

updateAvatarsAndSettings()
  .catch((err) => {
    console.error('Error updating avatars:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
