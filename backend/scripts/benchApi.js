// Usage: node scripts/benchApi.js [baseUrl]
// Measures median latency (ms) and ON-THE-WIRE bytes (raw chunks, before decompression).
import http from 'http';

const base = new URL(process.argv[2] || 'http://localhost:5000');
const targets = [
  '/api/health',
  '/api/universities?lang=tr&limit=12',
  '/api/universities?lang=tr&limit=100',
  '/api/universities?lang=tr&search=istanbul',
  '/api/programs?lang=tr',
  '/api/scholarships?lang=tr',
  '/api/articles?lang=tr',
  '/uploads/universities/bolu-abant-izzet-baysal-universitesi.png',
  '/uploads/universities/bolu-abant-izzet-baysal-universitesi.webp',
];
const N = 15;

const get = (path) =>
  new Promise((resolve, reject) => {
    const s = performance.now();
    http
      .get({ host: base.hostname, port: base.port, path, headers: { 'Accept-Encoding': 'gzip' } }, (res) => {
        let bytes = 0;
        res.on('data', (c) => (bytes += c.length));
        res.on('end', () =>
          resolve({
            ms: performance.now() - s,
            bytes,
            status: res.statusCode,
            enc: res.headers['content-encoding'] || 'none',
            cache: res.headers['cache-control'] || 'none',
          })
        );
      })
      .on('error', reject);
  });

for (const t of targets) {
  const runs = [];
  for (let i = 0; i < N; i++) {
    const r = await get(t);
    runs.push(r);
    if (r.status === 429) break;
  }
  const last = runs[runs.length - 1];
  const ms = runs.map((r) => r.ms).sort((a, b) => a - b);
  console.log(
    `${last.status} med=${ms[Math.floor(ms.length / 2)].toFixed(1)}ms wire=${last.bytes}B enc=${last.enc} cache=${last.cache} ${t}`
  );
}
