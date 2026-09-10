// tools/site-check.js — regenerasi sitemap.xml + cek link lokal & gambar
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const BASE = 'https://mtsn1semarang.sch.id';
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== '404.html');

const prio = { 'index.html': ['1.0', 'weekly'], 'ppdb.html': ['0.9', 'weekly'], 'program.html': ['0.9', 'monthly'], 'berita.html': ['0.8', 'weekly'], 'prestasi.html': ['0.8', 'monthly'], 'profil.html': ['0.8', 'monthly'] };
const urls = pages.map(f => {
  const [pr, ch] = prio[f] || ['0.7', 'monthly'];
  const loc = f === 'index.html' ? BASE + '/' : BASE + '/' + f;
  return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${ch}</changefreq>\n    <priority>${pr}</priority>\n  </url>`;
}).join('\n');
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml: ${pages.length} URL`);

// ---- cek link lokal ----
let broken = 0;
const files = new Set(fs.readdirSync(ROOT));
fs.readdirSync(path.join(ROOT, 'assets', 'photos')).forEach(f => files.add('assets/photos/' + f));
fs.readdirSync(path.join(ROOT, 'assets', 'videos')).forEach(f => files.add('assets/videos/' + f));
['assets/dokumen/prospektus-2027.pdf', 'css/style.css', 'js/main.js', 'manifest.webmanifest', 'sw.js',
 'assets/logo.svg', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/apple-touch-icon.png',
 'assets/data/agenda.json', 'assets/data/ppdb.json', 'assets/data/prestasi.json', 'assets/data/guru.json', 'assets/data/alumni.json'
].forEach(f => files.add(f));
for (const pg of pages.concat(['404.html', 'kebijakan.html'])) {
  const html = fs.readFileSync(path.join(ROOT, pg), 'utf8');
  const refs = [
    ...html.matchAll(/(?:src|href)="(?!https?:|mailto:|tel:|wa\.|#|data:)([^"]+)"/g),
    ...html.matchAll(/data-full="(?!https?:)([^"]+)"/g),
  ].map(m => m[1].split('#')[0]).filter(Boolean);
  for (const r of new Set(refs)) {
    if (!files.has(r)) { console.error(`RUSAK [${pg}]: ${r}`); broken++; }
  }
}
// JSON valid?
for (const j of ['agenda', 'ppdb', 'prestasi', 'guru', 'alumni']) {
  try { JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/data', j + '.json'), 'utf8')); }
  catch (e) { console.error(`JSON RUSAK: ${j}.json`); broken++; }
}
// JS syntax
try { new (require('vm').Script)(fs.readFileSync(path.join(ROOT, 'js/main.js'), 'utf8')); }
catch (e) { console.error('JS RUSAK:', e.message); broken++; }
if (broken) { console.error(`${broken} masalah ditemukan`); process.exit(1); }
console.log('Link check: semua OK');
