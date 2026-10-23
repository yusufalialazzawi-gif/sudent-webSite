import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';

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

const tempDir = path.resolve('scratch/campus_frames');
const clips = [
  path.join(tempDir, 'clip_0.mp4'),
  path.join(tempDir, 'clip_1.mp4'),
  path.join(tempDir, 'clip_2.mp4')
];

const concatList = path.join(tempDir, 'concat_list.txt');
const lines = clips.map(c => `file '${c.replace(/\\/g, '/')}'`).join('\n');
fs.writeFileSync(concatList, lines);

const finalOutput = path.resolve('frontend/public/media/hero-campus.mp4');
const args = [
  '-y',
  '-f', 'concat',
  '-safe', '0',
  '-i', concatList,
  '-an',
  '-c:v', 'copy',
  '-movflags', '+faststart',
  finalOutput
];

console.log('Concatenating into:', finalOutput);
const res = spawnSync(ffmpegBin, args, { stdio: 'inherit' });

if (res.status === 0 && fs.existsSync(finalOutput)) {
  const stat = fs.statSync(finalOutput);
  console.log('HERO VIDEO SUCCESS! Size:', (stat.size / 1024 / 1024).toFixed(2), 'MB');
} else {
  console.error('Concat failed');
}
