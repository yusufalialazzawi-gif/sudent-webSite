// Extract Arabic UI string literals / JSX text from admin pages (not already in tx()/ternaries).
import fs from 'fs';
import path from 'path';
const dir = process.argv[2];
const files = fs.readdirSync(dir, { recursive: true }).filter((f) => /\.jsx?$/.test(f));
const AR = /[\u0600-\u06FF]/;
const out = new Map();
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  // quoted strings
  for (const m of src.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*?)\1/g)) {
    if (AR.test(m[2]) && !m[2].includes('${')) add(m[2], f);
  }
  // jsx text
  for (const m of src.matchAll(/>([^<>{}\n]*[\u0600-\u06FF][^<>{}\n]*)</g)) add(m[1].trim(), f);
  // multi-line jsx text lines
  for (const line of src.split('\n')) {
    const t = line.trim();
    if (AR.test(t) && !/[<>{}='"`;()]/.test(t.replace(/[،؟:.\-–/&!]/g, ''))) add(t, f);
  }
}
function add(s, f) {
  s = s.trim();
  if (!s) return;
  if (!out.has(s)) out.set(s, new Set());
  out.get(s).add(path.basename(f));
}
const arr = [...out.keys()];
fs.writeFileSync(process.argv[3], JSON.stringify(arr, null, 1), 'utf8');
console.log('unique', arr.length);
