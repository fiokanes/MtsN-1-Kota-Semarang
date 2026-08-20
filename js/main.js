/* ============================================================
   MTs Negeri 1 Kota Semarang — Script bersama
   (navigasi, slider, pencarian, bahasa, tema gelap, kalender,
    countdown, testimoni, newsletter, reveal, dll.)
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ================= NAVIGASI MOBILE =================
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  // Dropdown submenu di layar kecil (ketuk sekali = buka, dua kali = lanjut)
  document.querySelectorAll('.has-dropdown > a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (window.innerWidth <= 960) {
        const li = this.parentElement;
        if (!li.classList.contains('open')) {
          e.preventDefault();
          li.classList.add('open');
        }
      }
    });
  });

  // ================= HERO SLIDER =================
  const heroEl = document.getElementById('heroSlider');
  if (heroEl) {
    const slides = heroEl.querySelectorAll('.slide');
    const panels = heroEl.querySelectorAll('.slide-panel');
    const dotsWrap = heroEl.querySelector('.slider-dots');
    const progress = heroEl.querySelector('.slider-progress i');
    let current = 0;
    let timer = null;
    const DURATION = 6500;

    slides.forEach(function (_, i) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Slide ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () { go(i, true); });
      dotsWrap.appendChild(b);
    });
    const dots = dotsWrap.querySelectorAll('button');

    function go(index, user) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === current); });
      panels.forEach(function (p, i) { p.classList.toggle('active', i === current); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
      restart(user);
    }
    function startAuto() {
      timer = setInterval(function () { go(current + 1, false); }, DURATION);
    }
    function restart(user) {
      clearInterval(timer);
      if (!user && heroEl.matches(':hover')) { startAuto(); return; }
      startAuto();
    }

    const prevBtn = heroEl.querySelector('.slider-arrow.prev');
    const nextBtn = heroEl.querySelector('.slider-arrow.next');
    if (prevBtn) prevBtn.addEventListener('click', function () { go(current - 1, true); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(current + 1, true); });

    heroEl.addEventListener('mouseenter', function () {
      if (progress) progress.classList.add('paused');
      clearInterval(timer);
    });
    heroEl.addEventListener('mouseleave', function () {
      if (progress) progress.classList.remove('paused');
      startAuto();
    });

    // Geser (swipe) untuk layar sentuh
    let x0 = null;
    heroEl.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    heroEl.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1), true);
      x0 = null;
    }, { passive: true });

    // Bilah kemajuan — ulangi tiap siklus
    progress.addEventListener('animationend', function () {
      progress.style.animation = 'none';
      void progress.offsetWidth;
      progress.style.animation = '';
    });

    startAuto();
  }

  // ================= SCROLL REVEAL =================
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  // ================= ANIMASI ANGKA STATISTIK =================
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  if (statNums.length) {
    const animateCount = function (el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const start = performance.now();
      const step = function (now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('id-ID') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    statNums.forEach(function (el) { obs.observe(el); });
  }

  // ================= PENCARIAN =================
  const searchBtn = document.getElementById('searchBtn');
  const overlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchClose = document.getElementById('searchClose');

  const SEARCH_INDEX = [
    { t: 'Beranda', d: 'Halaman utama madrasah', u: 'index.html', k: 'home beranda utama madrasah hebat' },
    { t: 'Profil Madrasah', d: 'Sejarah, visi misi, identitas, struktur organisasi', u: 'profil.html', k: 'profil sejarah visi misi identitas organisasi kepala madrasah akreditasi' },
    { t: 'Program Unggulan', d: 'Tahfidz, riset, dan sains', u: 'program.html', k: 'program tahfidz riset sains kurikulum' },
    { t: 'Boarding School Idzatun Nasyi\u2019in', d: 'Asrama santri putra & putri, kajian kitab', u: 'program.html#boarding', k: 'boarding asrama santri pesantren kitab idzatun' },
    { t: 'Ekstrakurikuler', d: 'Pramuka, hadroh, futsal, PMR, jurnalistik', u: 'program.html#ekskul', k: 'ekstrakurikuler pramuka hadroh futsal pmr paskibra' },
    { t: 'Prestasi', d: 'AISEEF, KSM, dan penghargaan siswa', u: 'prestasi.html', k: 'prestasi aiseef ksm lomba juara internasional' },
    { t: 'Fasilitas', d: 'Gedung SBSN, lab, perpustakaan, asrama, masjid', u: 'fasilitas.html', k: 'fasilitas gedung sbsn lab laboratorium perpustakaan asrama masjid uks' },
    { t: 'PPDB', d: 'Pendaftaran peserta didik baru', u: 'ppdb.html', k: 'ppdb pendaftaran daftar siswa baru jalur' },
    { t: 'Kontak & Lokasi', d: 'Alamat, telepon, email, peta', u: 'kontak.html', k: 'kontak alamat telepon email peta lokasi maps' },
    { t: 'Penerimaan Santri Boarding', d: 'Pendaftaran santri baru Idzatun Nasyi\u2019in', u: 'ppdb.html', k: 'boarding santri asrama daftar pesantren' }
  ];

  function runSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = '<p class="hint">Ketik kata kunci, misalnya <b>PPDB</b>, <b>tahfidz</b>, <b>boarding</b>, atau <b>prestasi</b>.</p>';
      return;
    }
    const found = SEARCH_INDEX.filter(function (item) {
      return (item.t + ' ' + item.d + ' ' + item.k).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 6);
    if (!found.length) {
      searchResults.innerHTML = '<p class="hint">Tidak ditemukan hasil untuk \u201c' + q + '\u201d. Coba kata kunci lain.</p>';
      return;
    }
    searchResults.innerHTML = found.map(function (item) {
      return '<a href="' + item.u + '"><b>' + item.t + '</b><br>' + item.d + '</a>';
    }).join('');
  }

  if (searchBtn && overlay) {
    const openSearch = function () {
      overlay.classList.add('open');
      document.body.classList.add('overlay-open');
      setTimeout(function () { searchInput.focus(); }, 150);
      runSearch('');
    };
    const closeSearch = function () {
      overlay.classList.remove('open');
      document.body.classList.remove('overlay-open');
    };
    searchBtn.addEventListener('click', openSearch);
    if (searchClose) searchClose.addEventListener('click', closeSearch);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSearch();
      if ((e.key === '/' || e.key === 'k') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
    });
    searchInput.addEventListener('input', function () { runSearch(searchInput.value); });
    const form = overlay.querySelector('form');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const first = searchResults.querySelector('a');
      if (first) window.location.href = first.getAttribute('href');
    });
  }

  // ================= BAHASA ID/EN =================
  const I18N = {
    id: {
      'nav.home': 'Beranda', 'nav.profil': 'Profil', 'nav.sejarah': 'Sejarah', 'nav.visi': 'Visi & Misi',
      'nav.identitas': 'Identitas', 'nav.struktur': 'Struktur', 'nav.program': 'Program', 'nav.board': 'Boarding School',
      'nav.unggulan': 'Tahfidz, Riset & Sains', 'nav.ekskul': 'Ekstrakurikuler', 'nav.prestasi': 'Prestasi',
      'nav.fasilitas': 'Fasilitas', 'nav.ppdb': 'PPDB', 'nav.kontak': 'Kontak', 'nav.daftar': 'Daftar PPDB',
      'hero.t1': 'Madrasah Hebat,<br>Bermartabat 🕌',
      'hero.s1': 'MTs Negeri 1 Kota Semarang — madrasah tsanawiyah negeri di bawah Kementerian Agama RI yang berkomitmen mencetak generasi Qur\'ani, cerdas, dan berprestasi melalui program unggulan Tahfidz, Riset, dan Sains serta Boarding School Idzatun Nasyi\'in.',
      'hero.a1': 'Profil Madrasah', 'hero.a2': 'Info PPDB →',
      'hero.t2': 'Tahfidz, Riset & Sains',
      'hero.s2': 'Tiga program unggulan yang membina hafalan Al-Qur\'an, kemampuan riset ilmiah, dan penguasaan sains — dengan pembinaan intensif untuk kompetisi mulai tingkat kota hingga internasional.',
      'hero.a3': 'Program Unggulan',
      'hero.t3': 'Boarding School<br>Idzatun Nasyi\'in',
      'hero.s3': 'Pendidikan ala pesantren: hafalan Al-Qur\'an, kajian kitab kuning, dan pembinaan karakter setiap hari — kapasitas 100 santri putra dan 100 santriwati.',
      'hero.a4': 'Tentang Boarding',
      'samb.h': 'Sambutan Kepala Madrasah', 'samb.j': 'Assalamu\'alaikum Warahmatullahi Wabarakatuh',
      'stat.1': 'Kuota Siswa / Angkatan', 'stat.2': 'Rombongan Belajar', 'stat.3': 'Program Unggulan',
      'stat.4': 'Kapasitas Boarding', 'stat.5': 'Negara (AISEEF)', 'stat.6': 'Akreditasi',
      'prg.h': 'Tiga Pilar Keunggulan Madrasah', 'prg.btn': 'Selengkapnya tentang Program →',
      'png.h': 'Pengumuman Madrasah', 'eks.h': 'Ekstrakurikuler & Kegiatan Siswa',
      'brd.h': '🏫 Boarding School "Idzatun Nasyi\'in"', 'brd.btn': 'Selengkapnya →',
      'news.h': 'Video & Dokumentasi Madrasah', 'news.btn': 'Lihat Semua Prestasi →',
      'gal.h': 'Galeri Kegiatan', 'age.h': 'Agenda Kegiatan',
      'fas.h': 'Fasilitas Madrasah', 'tes.h': 'Apa Kata Mereka',
      'tea.h': 'Guru & Tenaga Kependidikan',
      'ppdb.h': 'Pendaftaran Peserta Didik Baru (PPDB)', 'ppdb.a': 'Info PPDB →', 'ppdb.b': 'Hubungi Panitia',
      'newsletter.h': 'Ikuti Kabar Madrasah', 'newsletter.p': 'Berlangganan info kegiatan, jadwal, dan pengumuman terbaru langsung ke email Anda.',
      'sticky.a': '📝 Daftar PPDB 2025/2026', 'footer.tag': 'Website resmi madrasah. Dibuat dengan ❤️ untuk pendidikan.'
    },
    en: {
      'nav.home': 'Home', 'nav.profil': 'About', 'nav.sejarah': 'History', 'nav.visi': 'Vision & Mission',
      'nav.identitas': 'Identity', 'nav.struktur': 'Organization', 'nav.program': 'Programs', 'nav.board': 'Boarding School',
      'nav.unggulan': 'Tahfidz, Research & Science', 'nav.ekskul': 'Extracurriculars', 'nav.prestasi': 'Achievements',
      'nav.fasilitas': 'Facilities', 'nav.ppdb': 'Admissions', 'nav.kontak': 'Contact', 'nav.daftar': 'Apply Now',
      'hero.t1': 'A Great Madrasah,<br>With Dignity 🕌',
      'hero.s1': 'MTs Negeri 1 Kota Semarang — a public Islamic junior high school under Indonesia\'s Ministry of Religious Affairs, committed to raising a Quranic, intelligent, and accomplished generation through its flagship programs in Tahfidz, Research, and Science, plus Idzatun Nasyi\'in Boarding School.',
      'hero.a1': 'School Profile', 'hero.a2': 'Admissions →',
      'hero.t2': 'Tahfidz, Research & Science',
      'hero.s2': 'Three flagship programs that develop Quran memorization, scientific research skills, and science mastery — with intensive coaching for competitions from city to international level.',
      'hero.a3': 'Our Programs',
      'hero.t3': 'Idzatun Nasyi\'in<br>Boarding School',
      'hero.s3': 'A pesantren-style education: Quran memorization, classical book studies, and daily character building — capacity for 100 male and 100 female students.',
      'hero.a4': 'About Boarding',
      'samb.h': 'Principal\'s Welcome', 'samb.j': 'Assalamu\'alaikum Warahmatullahi Wabarakatuh',
      'stat.1': 'Student Quota / Year', 'stat.2': 'Study Groups', 'stat.3': 'Flagship Programs',
      'stat.4': 'Boarding Capacity', 'stat.5': 'Countries (AISEEF)', 'stat.6': 'Accreditation',
      'prg.h': 'Three Pillars of Excellence', 'prg.btn': 'Learn More About Programs →',
      'png.h': 'School Announcements', 'eks.h': 'Extracurriculars & Student Life',
      'brd.h': '🏫 "Idzatun Nasyi\'in" Boarding School', 'brd.btn': 'Learn More →',
      'news.h': 'Videos & Documentation', 'news.btn': 'View All Achievements →',
      'gal.h': 'Photo Gallery', 'age.h': 'School Calendar',
      'fas.h': 'School Facilities', 'tes.h': 'What They Say',
      'tea.h': 'Teachers & Staff',
      'ppdb.h': 'New Student Admissions (PPDB)', 'ppdb.a': 'Admissions →', 'ppdb.b': 'Contact Committee',
      'newsletter.h': 'Stay Updated', 'newsletter.p': 'Subscribe for the latest activities, schedules, and announcements straight to your inbox.',
      'sticky.a': '📝 Apply for PPDB 2025/2026', 'footer.tag': 'Official school website. Made with ❤️ for education.'
    }
  };

  const langBtn = document.getElementById('langBtn');
  let lang = localStorage.getItem('mtsn1-lang') || 'id';

  function applyLang(l) {
    lang = l;
    localStorage.setItem('mtsn1-lang', l);
    document.documentElement.lang = l === 'en' ? 'en' : 'id';
    if (langBtn) langBtn.textContent = l === 'en' ? 'ID' : 'EN';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      const map = I18N[l] || I18N.id;
      if (map[key] !== undefined) el.innerHTML = map[key];
    });
  }
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      applyLang(lang === 'en' ? 'id' : 'en');
    });
  }
  applyLang(lang);

  // ================= TEMA GELAP =================
  const themeBtn = document.getElementById('themeBtn');
  const themeIco = themeBtn ? themeBtn.querySelector('.theme-ico') : null;
  let theme = localStorage.getItem('mtsn1-theme') ||
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  function applyTheme(t) {
    theme = t;
    localStorage.setItem('mtsn1-theme', t);
    document.documentElement.setAttribute('data-theme', t);
    if (themeIco) themeIco.textContent = t === 'dark' ? '☀️' : '🌙';
  }
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
    });
  }
  applyTheme(theme);

  // ================= TESTIMONI =================
  const testiEl = document.getElementById('testiSlider');
  if (testiEl) {
    const tPanels = testiEl.querySelectorAll('.testi-panel');
    const tDotsWrap = testiEl.querySelector('.testi-dots');
    let tIdx = 0;

    tPanels.forEach(function (_, i) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', 'Testimoni ' + (i + 1));
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', function () { tGo(i); });
      tDotsWrap.appendChild(b);
    });
    const tDots = tDotsWrap.querySelectorAll('button');

    function tGo(i) {
      tIdx = (i + tPanels.length) % tPanels.length;
      tPanels.forEach(function (p, j) { p.classList.toggle('active', j === tIdx); });
      tDots.forEach(function (d, j) { d.classList.toggle('active', j === tIdx); });
    }
    setInterval(function () { tGo(tIdx + 1); }, 6000);
  }

  // ================= KALENDER AGENDA =================
  const calEl = document.getElementById('cal');
  if (calEl) {
    const EVENTS = [
      { d: '2025-02-10', t: 'Penilaian Tengah Semester Genap TP 2024/2025', c: 'Akademik', p: 'Penilaian untuk seluruh jenjang kelas VII–IX.' },
      { d: '2025-03-27', t: 'Peringatan Isra Mikraj Nabi Muhammad SAW 1446 H', c: 'Keagamaan', p: 'Kegiatan keagamaan bersama seluruh warga madrasah.' },
      { d: '2025-04-21', t: 'Peringatan Hari Kartini & Classmeeting', c: 'Kesiswaan', p: 'Lomba antar kelas dan apresiasi prestasi peserta didik.' },
      { d: '2025-05-19', t: 'Ujian Madrasah & Asesmen Sumatif Akhir', c: 'Akademik', p: 'Ujian akhir jenjang bagi kelas IX dan asesmen kelas VII–VIII.' },
      { d: '2025-10-22', t: 'Peringatan Hari Santri Nasional', c: 'Keagamaan', p: 'Apel Hari Santri dan rangkaian kegiatan keagamaan.' }
    ];
    const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    let viewYear = 2025, viewMonth = 1; // Februari sebagai awal
    const grid = calEl.querySelector('.cal-grid');
    const titleEl = calEl.querySelector('.cal-head h4');
    const prevBtn = calEl.querySelector('.cal-prev');
    const nextBtn = calEl.querySelector('.cal-next');
    const panelTitle = document.getElementById('calPanelTitle');
    const panelSub = document.getElementById('calPanelSub');
    const panelList = document.getElementById('calEvents');

    function fmtId(dStr) {
      const [y, m, d] = dStr.split('-').map(Number);
      return d + ' ' + MONTHS[m - 1].slice(0, 3) + ' ' + y;
    }
    function eventsInMonth(ym) {
      return EVENTS.filter(function (e) { return e.d.slice(0, 7) === ym; });
    }
    function renderCal() {
      const first = new Date(viewYear, viewMonth, 1);
      const offset = (first.getDay() + 6) % 7; // Senin = 0
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const ym = viewYear + '-' + String(viewMonth + 1).padStart(2, '0');
      titleEl.textContent = MONTHS[viewMonth] + ' ' + viewYear;
      prevBtn.disabled = viewYear === 2025 && viewMonth === 1;
      nextBtn.disabled = viewYear === 2025 && viewMonth === 9;

      let html = '';
      for (let i = 0; i < offset; i++) html += '<div class="cal-cell empty"></div>';
      for (let day = 1; day <= daysInMonth; day++) {
        const ds = ym + '-' + String(day).padStart(2, '0');
        const has = EVENTS.some(function (e) { return e.d === ds; });
        html += '<div class="cal-cell' + (has ? ' has-event' : '') + '" data-date="' + ds + '">' + day + '</div>';
      }
      grid.innerHTML = html;
      renderPanel(eventsInMonth(ym), ym);

      grid.querySelectorAll('.cal-cell.has-event').forEach(function (cell) {
        cell.addEventListener('click', function () {
          grid.querySelectorAll('.cal-cell').forEach(function (c) { c.classList.remove('selected'); });
          cell.classList.add('selected');
          const ds = cell.getAttribute('data-date');
          const ev = EVENTS.filter(function (e) { return e.d === ds; });
          renderPanel(ev, ym, fmtId(ds));
        });
      });
    }
    function renderPanel(list, ym, prefix) {
      panelTitle.textContent = prefix || 'Agenda ' + MONTHS[viewMonth] + ' ' + viewYear;
      panelSub.textContent = prefix ? ('Kegiatan pada tanggal ' + prefix) : 'Pilih tanggal atau lihat semua agenda bulan ini';
      if (!list.length) {
        panelList.innerHTML = '<p style="color:var(--ink-soft);font-size:.9rem;">Tidak ada agenda di bulan ini.</p>';
        return;
      }
      panelList.innerHTML = list.map(function (e) {
        return '<div class="cal-event">' +
          '<span class="ed">' + fmtId(e.d) + '</span>' +
          '<div class="eb"><h5>' + e.t + '</h5><p>' + e.p + '</p>' +
          '<span class="agenda-tag" style="margin-top:6px;display:inline-block;">' + e.c + '</span></div>' +
          '</div>';
      }).join('');
    }
    prevBtn.addEventListener('click', function () {
      const m = viewMonth - 1, y = viewYear;
      if (y === 2025 && m < 1) return;
      if (m < 0) { viewYear--; viewMonth = 11; } else viewMonth = m;
      renderCal();
    });
    nextBtn.addEventListener('click', function () {
      const m = viewMonth + 1, y = viewYear;
      if (y === 2025 && m > 9) return;
      if (m > 11) { viewYear++; viewMonth = 0; } else viewMonth = m;
      renderCal();
    });
    renderCal();
  }

  // ================= NEWSLETTER =================
  const nlForm = document.getElementById('nlForm');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = nlForm.querySelector('input[type="email"]');
      const msg = nlForm.parentElement.querySelector('.nl-msg');
      if (input && input.value) {
        msg.textContent = '✉️ Terima kasih! Email Anda telah kami catat. (Draf — hubungkan ke layanan email marketing sesungguhnya.)';
        input.value = '';
      }
    });
  }

  // ================= COUNTDOWN PPDB =================
  const cdWrap = document.getElementById('ppdbCountdown');
  if (cdWrap) {
    const target = new Date(cdWrap.getAttribute('data-target')).getTime();
    const units = [['Hari', 86400000], ['Jam', 3600000], ['Menit', 60000], ['Detik', 1000]];
    function tick() {
      const diff = target - Date.now();
      if (diff <= 0) {
        cdWrap.innerHTML = '<p class="cd-done">📢 Pendaftaran telah dibuka / segera diumumkan oleh panitia PPDB.</p>';
        return;
      }
      let out = '';
      units.forEach(function (u, i) {
        let val = Math.floor(diff / u[1]);
        if (i === 0) {
          out += '<div class="cd-item"><div class="cd-num">' + val + '</div><div class="cd-label">' + u[0] + '</div></div>';
        } else {
          out += '<div class="cd-item"><div class="cd-num">' + String(val % (i === 1 ? 24 : i === 2 ? 60 : 60)) + '</div><div class="cd-label">' + u[0] + '</div></div>';
        }
      });
      cdWrap.innerHTML = out;
    }
    tick();
    setInterval(tick, 1000);
  }

  // ================= STICKY CTA & TOMBOL ATAS =================
  const stickyCta = document.getElementById('stickyCta');
  const toTop = document.querySelector('.to-top');

  window.addEventListener('scroll', function () {
    if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
    if (stickyCta) {
      const show = window.scrollY > 600;
      stickyCta.classList.toggle('show', show);
      document.body.classList.toggle('sticky-active', show);
    }
  }, { passive: true });

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ================= TAHUN DI FOOTER =================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ================= SCROLL HALUS TAUTAN DALAM HALAMAN =================
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});