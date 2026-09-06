const fs = require('fs');
const src = fs.readFileSync('js/main.js', 'utf8');
const startMarker = 'const EVENTS = window.MTSN_EVENTS.id.length';
const start = src.indexOf(startMarker);
if (start < 0) { console.error('MARKER NOT FOUND'); process.exit(1); }
const braceOpen = src.indexOf('{', src.indexOf(':', start));
let depth = 0, end = -1;
for (let i = braceOpen; i < src.length; i++) {
  const ch = src[i];
  if (ch === '{' || ch === '[') depth++;
  else if (ch === '}' || ch === ']') {
    depth--;
    if (depth === 0 && ch === '}') { end = i; break; }
  }
}
if (end < 0) { console.error('NO END'); process.exit(1); }
const objLit = src.slice(braceOpen, end + 1);
const EVENTS = eval('(' + objLit + ')');
fs.mkdirSync('assets/data', { recursive: true });
fs.writeFileSync('assets/data/agenda.json', JSON.stringify(EVENTS, null, 2));
console.log('events id:', EVENTS.id.length, 'en:', EVENTS.en.length, '| first:', EVENTS.id[0].d, '| last:', EVENTS.id[EVENTS.id.length - 1].d);
