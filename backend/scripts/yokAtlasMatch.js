import fs from 'fs';
import path from 'path';

const STOP = new Set(['universitesi', 'university', 'universite', 'uni', 'of', 'the', 'and', 've']);

// Official YÖK spellings that differ from our slugs beyond diacritics.
const ALIASES = { 'bezmialem-vakif-universitesi': 'bezm i alem vakif' };

export function tokens(raw) {
  const flat = String(raw || '')
    .replace(/\(([^)]*)\)/g, ' ')
    .toLowerCase()
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  return new Set(flat.split(' ').filter((w) => w && !STOP.has(w)));
}

const eq = (a, b) => a.size === b.size && [...a].every((x) => b.has(x));
const subset = (a, b) => [...a].every((x) => b.has(x));

export function loadAtlas() {
  const atlas = JSON.parse(fs.readFileSync(path.resolve('prisma/yokAtlasAggregate.json'), 'utf8'));
  return {
    meta: atlas,
    entries: atlas.universities.map((u) => ({ ...u, tok: tokens(u.universiteAdi) })),
  };
}

export function matchOne(entries, { slug, trName, city }) {
  const candidates = [tokens(ALIASES[slug] || slug), tokens(trName)].filter((s) => s.size);
  for (const tok of candidates) {
    const exact = entries.filter((a) => eq(tok, a.tok));
    if (exact.length === 1) return { hit: exact[0], how: 'exact' };
    if (exact.length > 1) return { hit: null, how: 'ambiguous', candidates: exact };

    const subs = entries.filter((a) => subset(tok, a.tok));
    if (subs.length === 1) return { hit: subs[0], how: 'subset' };
    if (subs.length > 1) {
      const cityTok = tokens(city);
      const byCity = subs.filter((a) => [...tokens(a.il)].some((t) => cityTok.has(t)));
      if (byCity.length === 1) return { hit: byCity[0], how: 'subset+city' };
      return { hit: null, how: 'ambiguous', candidates: subs };
    }
  }
  return { hit: null, how: 'unmatched' };
}

export const facultiesOnly = (u) => u.facultyNames.filter((f) => /FAK[ÜU]LTE/.test(f));
export const lisansDepts = (u) => u.departments.filter((d) => d.level === 'LISANS');
