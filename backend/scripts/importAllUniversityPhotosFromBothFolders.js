import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import prisma from '../src/config/db.js';

const sourceDirs = [
  'C:\\Users\\YUSUF\\Desktop\\universiteler iki dosya\\29 Vakıf Üniversitesi',
  'C:\\Users\\YUSUF\\Desktop\\universiteler iki dosya\\32 Vakıf Üniversitesi',
  'C:\\Users\\YUSUF\\Desktop\\universitelerr',
];

const destBackend = path.resolve('uploads/universities');
const destFrontend = path.resolve('../frontend/public/uploads/universities');

fs.mkdirSync(destBackend, { recursive: true });
fs.mkdirSync(destFrontend, { recursive: true });

function normalizeName(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç]/gi, '')
    .trim();
}

function extractUniNameFromFilename(filename) {
  // Strip extension
  const ext = path.extname(filename);
  let base = path.basename(filename, ext);

  // Strip prefixes like "V04 - ", "01_ ", "01 - "
  base = base.replace(/^[Vv]?\d+[\s_-]+/, '').trim();
  return base;
}

async function run() {
  console.log('=== Processing University Photos From Desktop Folders ===');

  const universities = await prisma.university.findMany({
    include: {
      translations: {
        where: { lang: 'tr' },
      },
    },
  });

  console.log(`Loaded ${universities.length} universities from DB.`);

  // Collect all files from source dirs
  const allFiles = [];
  for (const dir of sourceDirs) {
    if (!fs.existsSync(dir)) {
      console.warn(`Dir not found: ${dir}`);
      continue;
    }
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const fullPath = path.join(dir, f);
      const stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        const ext = path.extname(f).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.webp', '.svg'].includes(ext)) {
          allFiles.push({
            filename: f,
            fullPath,
            ext,
            cleanName: extractUniNameFromFilename(f),
            sourceDir: path.basename(dir),
          });
        }
      }
    }
  }

  console.log(`Found ${allFiles.length} photo/graphic files across folders.`);

  let matchCount = 0;

  for (const uni of universities) {
    const trName = uni.translations[0]?.name || uni.slug;
    const normUniName = normalizeName(trName);
    const normSlug = normalizeName(uni.slug);

    // Find best matching file
    let bestFile = null;

    for (const file of allFiles) {
      const normFileName = normalizeName(file.cleanName);
      if (normFileName === normUniName || normUniName.includes(normFileName) || normFileName.includes(normUniName)) {
        bestFile = file;
        break;
      }
      // Try slug comparison
      if (normFileName.includes(normSlug) || normSlug.includes(normFileName)) {
        bestFile = file;
        break;
      }
    }

    if (!bestFile) {
      // Fuzzy matching for specific abbreviations like ITU, ODTU, etc.
      for (const file of allFiles) {
        const fn = file.cleanName.toLowerCase();
        const un = trName.toLowerCase();
        if (
          (fn.includes('boğaziçi') && un.includes('boğaziçi')) ||
          (fn.includes('sabancı') && un.includes('sabancı')) ||
          (fn.includes('koç') && un.includes('koç')) ||
          (fn.includes('bilkent') && un.includes('bilkent')) ||
          (fn.includes('tobb') && un.includes('tobb')) ||
          (fn.includes('medipol') && un.includes('medipol')) ||
          (fn.includes('bahçeşehir') && un.includes('bahçeşehir')) ||
          (fn.includes('bezmialem') && un.includes('bezmialem')) ||
          (fn.includes('üsküdar') && un.includes('üsküdar')) ||
          (fn.includes('yeditepe') && un.includes('yeditepe')) ||
          (fn.includes('çankaya') && un.includes('çankaya')) ||
          (fn.includes('atılım') && un.includes('atılım')) ||
          (fn.includes('başkent') && un.includes('başkent')) ||
          (fn.includes('fenerbahçe') && un.includes('fenerbahçe')) ||
          (fn.includes('özyeğin') && un.includes('özyeğin')) ||
          (fn.includes('kadir has') && un.includes('kadir has')) ||
          (fn.includes('yaşar') && un.includes('yaşar')) ||
          (fn.includes('lokman hekim') && un.includes('lokman hekim')) ||
          (fn.includes('ted') && un.includes('ted')) ||
          (fn.includes('biruni') && un.includes('biruni')) ||
          (fn.includes('doğuş') && un.includes('doğuş')) ||
          (fn.includes('haliç') && un.includes('haliç')) ||
          (fn.includes('ışık') && un.includes('ışık')) ||
          (fn.includes('altınbaş') && un.includes('altınbaş')) ||
          (fn.includes('mef') && un.includes('mef')) ||
          (fn.includes('pîrî reis') && un.includes('piri')) ||
          (fn.includes('karatay') && un.includes('karatay')) ||
          (fn.includes('konya gıda') && un.includes('konya'))
        ) {
          bestFile = file;
          break;
        }
      }
    }

    if (bestFile) {
      matchCount++;
      const targetFileName = `${uni.slug}.webp`;
      const targetBackendPath = path.join(destBackend, targetFileName);
      const targetFrontendPath = path.join(destFrontend, targetFileName);

      try {
        if (bestFile.ext === '.svg') {
          // Render SVG to high-res WebP (1200x800 with background)
          await sharp(bestFile.fullPath, { density: 300 })
            .resize(1200, 800, {
              fit: 'contain',
              background: { r: 248, g: 250, b: 252, alpha: 1 },
            })
            .webp({ quality: 90 })
            .toFile(targetBackendPath);

          // Copy SVG directly for logo or crisp usage
          fs.copyFileSync(bestFile.fullPath, path.join(destBackend, `${uni.slug}.svg`));
          fs.copyFileSync(bestFile.fullPath, path.join(destFrontend, `${uni.slug}.svg`));
        } else {
          // Resize and convert JPG/PNG to modern WebP
          await sharp(bestFile.fullPath)
            .resize(1200, 750, {
              fit: 'cover',
              position: 'center',
            })
            .webp({ quality: 85 })
            .toFile(targetBackendPath);
        }

        // Mirror to frontend public
        fs.copyFileSync(targetBackendPath, targetFrontendPath);

        const newCoverUrl = `/uploads/universities/${targetFileName}`;
        await prisma.university.update({
          where: { id: uni.id },
          data: { coverImageUrl: newCoverUrl },
        });

        console.log(`[OK] Matched "${trName}" -> ${bestFile.filename} (${bestFile.sourceDir})`);
      } catch (err) {
        console.error(`Error processing ${bestFile.filename}:`, err.message);
      }
    } else {
      console.warn(`[NO MATCH] No desktop photo found for "${trName}" (${uni.slug})`);
    }
  }

  console.log(`\nDone. Matched ${matchCount} of ${universities.length} universities.`);
}

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
