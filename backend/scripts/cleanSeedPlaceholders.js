import fs from 'fs';

const files = ['prisma/stateUniversitiesData.js', 'prisma/seed.js'];

for (const f of files) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/https:\/\/images\.unsplash\.com\/photo-1544717305-2782549b5136\?[^'"`]+/g, '/uploads/universities/campus-default.webp');
    fs.writeFileSync(f, content);
    console.log('Cleaned file:', f);
  }
}
