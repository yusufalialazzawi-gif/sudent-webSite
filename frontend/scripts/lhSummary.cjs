// Usage: node scripts/lhSummary.cjs <lighthouse.json>
const r = require(require('path').resolve(process.argv[2]));
const a = r.audits;
const v = (k) => (a[k] ? a[k].displayValue || a[k].numericValue : 'n/a');
console.log('score', Math.round(r.categories.performance.score * 100));
for (const k of ['first-contentful-paint', 'largest-contentful-paint', 'cumulative-layout-shift', 'total-blocking-time', 'speed-index', 'total-byte-weight', 'unused-javascript', 'unused-css-rules', 'uses-optimized-images', 'modern-image-formats', 'uses-responsive-images', 'offscreen-images'])
  console.log(k.padEnd(28), v(k));
const lcp = a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet;
console.log('LCP element:', lcp);
const items = a['network-requests'].details.items;
console.log('requests:', items.length, ' transfer KB:', Math.round(items.reduce((s, i) => s + i.transferSize, 0) / 1024));
items.sort((x, y) => y.transferSize - x.transferSize).slice(0, 6).forEach((i) => console.log('  ', Math.round(i.transferSize / 1024) + 'KB', i.url.slice(0, 100)));
const shifts = a['layout-shifts']?.details?.items || [];
shifts.slice(0, 3).forEach((s) => console.log('  shift', s.score?.toFixed(3), s.node?.snippet?.slice(0, 80)));
