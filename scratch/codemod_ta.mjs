// Codemod: wrap Arabic-only UI literals with ta('...') (runtime dictionary lookup).
// usage: node codemod_ta.mjs <dir> <relative import path to adminText> [--write] <dumpfile>
import fs from 'fs';
import path from 'path';
const [dir, , mode, dump] = process.argv.slice(2);
const write = mode === '--write';
const AR = /[\u0600-\u06FF]/;
const files = fs.readdirSync(dir, { recursive: true }).filter((f) => /\.jsx$/.test(f));
const touched = new Set();
const skipped = [];

function importPath(file) {
  const depth = file.split(path.sep).length - 1; // pages/admin/x.jsx => 0 ; pages/admin/settings/x.jsx => 1
  return '../'.repeat(2 + depth) + 'i18n/adminText';
}

for (const f of files) {
  const full = path.join(dir, f);
  const lines = fs.readFileSync(full, 'utf8').split('\n');
  let changed = false;
  const out = lines.map((line, idx) => {
    if (!AR.test(line)) return line;
    if (/tx\(|=== ['"]ar['"]|=== ['"]tr['"]|ta\(/.test(line)) return line;
    if (/^\s*(\/\/|\{\/\*)/.test(line)) return line;
    let L = line;
    // JSX attribute double-quoted: attr="arabic"
    L = L.replace(/(\s[\w-]+)="([^"{}]*[\u0600-\u06FF][^"{}]*)"/g, (m, a, s) => {
      touched.add(s); return `${a}={ta(${JSON.stringify(s)})}`;
    });
    // single-quoted JS literal (not containing ${ or escaped quotes)
    L = L.replace(/'([^'\\\n]*[\u0600-\u06FF][^'\\\n]*)'/g, (m, s) => {
      if (s.includes('${')) return m;
      touched.add(s); return `ta('${s}')`;
    });
    // inline JSX text on same line: >text<
    L = L.replace(/>([^<>{}\n]*[\u0600-\u06FF][^<>{}\n]*)</g, (m, s) => {
      const t = s.trim();
      if (!t) return m;
      touched.add(t);
      const lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0];
      return `>${lead}{ta(${JSON.stringify(t)})}${trail}<`;
    });
    // full-line JSX text (no tags/braces)
    if (L === line && !/[<>{}=;()`'"]/.test(line.replace(/[،؟:.\-–/&!]/g, ''))) {
      const ind = line.match(/^\s*/)[0];
      const t = line.trim();
      touched.add(t);
      L = `${ind}{ta(${JSON.stringify(t)})}`;
    }
    if (L !== line) changed = true;
    else skipped.push(`${f}:${idx + 1}: ${line.trim().slice(0, 120)}`);
    return L;
  });
  if (changed && write) {
    let text = out.join('\n');
    if (!/i18n\/adminText/.test(text)) {
      text = text.replace(/(\nimport [^\n]+\n)(?!import)/, (m) => `${m}import { ta } from '${importPath(f)}';\n`);
    }
    fs.writeFileSync(full, text, 'utf8');
  }
}
fs.writeFileSync(dump, JSON.stringify([...touched], null, 1), 'utf8');
console.log('touched', touched.size, 'skippedLines', skipped.length);
fs.writeFileSync(dump + '.skipped.txt', skipped.join('\n'), 'utf8');
