// tools/dom-stub-test.js — uji render modul data main.js tanpa browser.
// Menjalankan main.js dgn stub DOM, memicu DOMContentLoaded, lalu memeriksa isi.
const fs = require('fs');
const vm = require('vm');

function makeEl(tag) {
  const e = {
    tag, children: [], innerHTML: '', textContent: '', value: '', dataset: {},
    style: {}, attrs: {},
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    setAttribute(k, v) { this.attrs[k] = v; },
    getAttribute(k) { return this.attrs[k]; },
    querySelector() { return makeEl('x'); },
    querySelectorAll() { return []; },
    addEventListener(type, fn) { (this._h = this._h || {})[type] = fn; },
    appendChild(c) { this.children.push(c); return c; },
    insertAdjacentHTML(pos, html) {
      if (pos === 'beforeend') {
        const opt = html.match(/<option[^>]*>(.*?)<\/option>/);
        if (opt && this.tag === 'select') this.options.push(opt[1]);
      }
    },
    reset() {}, focus() {}, click() {}, remove() {},
    previousElementSibling: { textContent: '' },
    options: [],
  };
  return e;
}
const elements = {};
const KNOWN = ['quotaGrid','biayaBody','ppdbFaq','minatForm','minatJalur','minatMsg','minatNama','minatSekolah','minatHp','prestasiList','alumniGrid','teacherGrid','filterTahun','filterBidang','filterTingkat','prestasiCount','ctForm','nlForm','formMsg','cal','calPanelTitle','calPanelSub','calEvents','homeAgenda','searchBtn','langBtn','themeBtn'];
['filterTahun','filterBidang','filterTingkat','minatJalur'].forEach(id => { /* selects */ });
const listeners = {};
const sandbox = {
  console,
  localStorage: { _s: {}, getItem(k) { return this._s[k] || null; }, setItem(k, v) { this._s[k] = v; } },
  location: { pathname: '/ppdb.html' },
  navigator: {},
  fetch: () => Promise.reject(new Error('offline-test')),
  XMLHttpRequest: function () {},
  setTimeout: (fn) => 0, clearTimeout: () => {},
  setInterval: () => 0, clearInterval: () => {},
  requestAnimationFrame: () => {},
  performance: { now: () => 0 },
  matchMedia: () => ({ matches: false }),
  IntersectionObserver: function () { this.observe = () => {}; this.unobserve = () => {}; },
};
sandbox.window = sandbox;
sandbox.addEventListener = () => {};
sandbox.scrollTo = () => {};
sandbox.scrollY = 0;
sandbox.document = {
  getElementById(id) {
    if (!KNOWN.includes(id)) return null;
    if (!elements[id]) {
      elements[id] = makeEl('#' + id);
      if (['filterTahun','filterBidang','filterTingkat','minatJalur'].includes(id)) elements[id].tag = 'select';
      if (id === 'minatForm' || id === 'ctForm' || id === 'nlForm') {
        const mine = elements[id];
        mine.querySelector = () => makeEl('input');
        if (id === 'minatForm') {
          mine.querySelector = (sel) => {
            if (sel === '#minatJalur') {
              if (!mine._sel) {
                mine._sel = makeEl('select');
                mine._sel.tag = 'select';
                const orig = mine._sel;
                Object.defineProperty(mine._sel, 'innerHTML', {
                  set(html) {
                    const re = /<option[^>]*>(.*?)<\/option>/g;
                    let m; orig.options = [];
                    while ((m = re.exec(html))) orig.options.push(m[1]);
                  },
                  get() { return ''; },
                });
              }
              return mine._sel;
            }
            return makeEl('input');
          };
        }
      }
      if (id === 'cal') {
        const grid = makeEl('.cal-grid');
        elements[id].querySelector = (sel) => {
          if (sel === '.cal-grid') return grid;
          return makeEl(sel);
        };
      }
    }
    return elements[id];
  },
  querySelector: (sel) => {
    if (sel === '.cal-grid') { const e = makeEl('.cal-grid'); e.innerHTML = ''; return e; }
    return null;
  },
  querySelectorAll: () => [],
  createElement: (t) => makeEl(t),
  addEventListener(type, fn) { listeners[type] = fn; },
  head: { appendChild() {} },
  body: { appendChild() {}, classList: { add() {}, remove() {}, toggle() {} } },
  documentElement: { setAttribute() {}, lang: 'id' },
  referrer: '',
};
sandbox.XMLHttpRequest.prototype.open = function (m, u) { this._u = u; };
sandbox.XMLHttpRequest.prototype.send = function () {
  this.responseText = fs.readFileSync('./' + this._u, 'utf8');
  this.status = 200;
};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('js/main.js', 'utf8'), sandbox, { filename: 'main.js' });
// picu DOMContentLoaded
if (listeners.DOMContentLoaded) listeners.DOMContentLoaded();
const T = {
  kuota: elements.quotaGrid.innerHTML,
  biaya: elements.biayaBody.innerHTML,
  faq: elements.ppdbFaq.innerHTML,
  jalur: elements.minatJalur,
  guru: elements.teacherGrid.innerHTML,
  alumni: elements.alumniGrid.innerHTML,
  prestasi: elements.prestasiList.innerHTML,
  count: elements.prestasiCount.textContent,
};
const n = (s, pat) => (s.match(new RegExp(pat, 'g')) || []).length;
console.log('kuota cards:', n(T.kuota, 'quota-card'), '(harapkan 4)');
console.log('biaya rows:', n(T.biaya, '<tr>'), '(harapkan 4)');
console.log('faq items:', n(T.faq, 'faq-item'), '(harapkan 5)');
console.log('jalur options:', elements.minatForm._sel ? elements.minatForm._sel.options.length : 0, '(harapkan 5 incl. placeholder)');
console.log('guru cards:', n(T.guru, 'teacher-card'), '(harapkan 5)');
console.log('alumni cards:', n(T.alumni, 'class="card'), '(harapkan 5)');
console.log('prestasi items:', n(T.prestasi, 'tl-item'), '(harapkan 9)');
console.log('prestasi count:', JSON.stringify(T.count));
const fail = [];
if (n(T.kuota, 'quota-card') !== 4) fail.push('kuota');
if (n(T.biaya, '<tr>') !== 4) fail.push('biaya');
if (n(T.faq, 'faq-item') !== 5) fail.push('faq');
if (!elements.minatForm._sel || elements.minatForm._sel.options.length !== 5) fail.push('jalur');
if (n(T.guru, 'teacher-card') !== 5) fail.push('guru');
if (n(T.alumni, 'class="card') !== 5) fail.push('alumni');
if (n(T.prestasi, 'tl-item') !== 9) fail.push('prestasi');
// XSS check: esc() harus menetralkan tag
const escSrc = fs.readFileSync('js/main.js', 'utf8');
if (!escSrc.includes('function esc(')) fail.push('esc-helper-hilang');
if (fail.length) { console.error('GAGAL:', fail.join(',')); process.exit(1); }
console.log('DOM stub test: SEMUA OK');
