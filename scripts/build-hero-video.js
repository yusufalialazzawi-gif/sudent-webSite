import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import https from 'https';

const localAppData = process.env.LOCALAPPDATA || '';
const ffmpegBin = path.join(
  localAppData,
  'Microsoft',
  'WinGet',
  'Packages',
  'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe',
  'ffmpeg-9.0.2-full_build',
  'bin',
  'ffmpeg.exe'
);

const mediaDir = path.resolve('frontend/public/media');
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

const tempDir = path.resolve('scratch/campus_frames');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject);
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading real university campus imagery (architecture, library, student grounds)...');
  const scenes = [
    { name: 'campus_arch.jpg', url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920&q=85' },
    { name: 'campus_hall.jpg', url: 'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=1920&q=85' },
    { name: 'campus_library.jpg', url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920&q=85' },
    { name: 'campus_students.jpg', url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920&q=85' },
  ];

  for (const s of scenes) {
    const dest = path.join(tempDir, s.name);
    await downloadImage(s.url, dest);
    console.log('Ready:', s.name, (fs.statSync(dest).size / 1024).toFixed(1), 'KB');
  }

  // Create 4 animated video segments (each 3.5 seconds = 87 frames at 25fps)
  const clips = [];
  for (let i = 0; i < scenes.length; i++) {
    const imgPath = path.join(tempDir, scenes[i].name);
    const clipPath = path.join(tempDir, `clip_${i}.mp4`);
    clips.push(clipPath);

    // Dynamic Ken Burns pan and zoom
    const zExpr = i % 2 === 0 ? "min(zoom+0.0016,1.22)" : "max(1.22-0.0016*on,1.0)";
    const xExpr = i % 2 === 0 ? "iw/2-(iw/zoom/2)+on*0.7" : "iw/2-(iw/zoom/2)-on*0.7";
    const filter = `scale=2560:1440:force_original_aspect_ratio=increase,crop=2560:1440,zoompan=z='${zExpr}':x='${xExpr}':y='ih/2-(ih/zoom/2)':d=90:s=1920x1080:fps=25`;

    console.log(`Rendering animated campus clip ${i + 1}/${scenes.length}...`);
    const args = [
      '-y',
      '-f', 'image2',
      '-loop', '1',
      '-i', imgPath,
      '-frames:v', '90', // 3.6 seconds at 25 fps
      '-vf', filter,
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-b:v', '3000k',
      '-preset', 'fast',
      '-an',
      clipPath
    ];

    const res = spawnSync(ffmpegBin, args, { stdio: 'inherit' });
    if (res.status !== 0) throw new Error(`Clip ${i} failed`);
  }

  // Concatenate all 4 clips into 1 seamless 14-second looping video
  const concatList = path.join(tempDir, 'concat_list.txt');
  fs.writeFileSync(concatList, clips.map(c => `file '${c.replace(/\\/g, '/')}'`).join('\n'));

  const finalOutput = path.resolve('frontend/public/media/hero-campus.mp4');
  console.log('Concatenating into seamless hero-campus.mp4...');
  const concatArgs = [
    '-y',
    '-f', 'concat',
    '-safe', '0',
    '-i', concatList,
    '-an',
    '-c:v', 'copy',
    '-movflags', '+faststart',
    finalOutput
  ];

  const concatRes = spawnSync(ffmpegBin, concatArgs, { stdio: 'inherit' });
  if (concatRes.status === 0 && fs.existsSync(finalOutput)) {
    const stat = fs.statSync(finalOutput);
    console.log('SUCCESS! Real cinematic campus moving video created!');
    console.log('Path:', finalOutput);
    console.log('Size:', (stat.size / 1024 / 1024).toFixed(2), 'MB');
  } else {
    throw new Error('Concatenation failed');
  }
}

run().catch(console.error);
