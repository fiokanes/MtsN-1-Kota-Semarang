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

  const SEARCH_INDEX = {
    id: [
      { t: 'Beranda', d: 'Halaman utama madrasah', u: 'index.html', k: 'home beranda utama madrasah hebat' },
      { t: 'Profil Madrasah', d: 'Sejarah, visi misi, identitas, struktur organisasi', u: 'profil.html', k: 'profil sejarah visi misi identitas organisasi kepala madrasah akreditasi' },
      { t: 'Program Unggulan', d: 'Tahfidz, riset, dan sains', u: 'program.html', k: 'program tahfidz riset sains kurikulum' },
      { t: 'Boarding School Idzatun Nasyi\u2019in', d: 'Asrama santri putra & putri, kajian kitab', u: 'program.html#boarding', k: 'boarding asrama santri pesantren kitab idzatun' },
      { t: 'Ekstrakurikuler', d: 'Pramuka, hadroh, futsal, PMR, jurnalistik', u: 'program.html#ekskul', k: 'ekstrakurikuler pramuka hadroh futsal pmr paskibra' },
      { t: 'Prestasi', d: 'RARE ICON, KSM, dan penghargaan siswa', u: 'prestasi.html', k: 'prestasi rare icon riset ksm lomba juara internasional' },
      { t: 'Berita', d: 'Berita & kabar resmi madrasah', u: 'berita.html', k: 'berita news kabar kegiatan pengumuman prestasi u15 timnas sbsn porseni pramuka' },
      { t: 'Fasilitas', d: 'Gedung SBSN, lab, perpustakaan, asrama, masjid', u: 'fasilitas.html', k: 'fasilitas gedung sbsn lab laboratorium perpustakaan asrama masjid uks' },
      { t: 'PPDB', d: 'Pendaftaran peserta didik baru', u: 'ppdb.html', k: 'ppdb pendaftaran daftar siswa baru jalur' },
      { t: 'Kontak & Lokasi', d: 'Alamat, telepon, email, peta', u: 'kontak.html', k: 'kontak alamat telepon email peta lokasi maps' },
      { t: 'Penerimaan Santri Boarding', d: 'Pendaftaran santri baru Idzatun Nasyi\u2019in', u: 'ppdb.html', k: 'boarding santri asrama daftar pesantren' }
    ],
    en: [
      { t: 'Home', d: 'Main school page', u: 'index.html', k: 'home main page school' },
      { t: 'School Profile', d: 'History, vision & mission, identity, organization', u: 'profil.html', k: 'profile about history vision mission identity organization head madrasah accreditation' },
      { t: 'Flagship Programs', d: 'Tahfidz, research, and science', u: 'program.html', k: 'program tahfidz research science curriculum' },
      { t: 'Idzatun Nasyi\u2019in Boarding School', d: 'Boys\u2019 & girls\u2019 dormitory, classical book studies', u: 'program.html#boarding', k: 'boarding dormitory santri pesantren kitab idzatun' },
      { t: 'Extracurriculars', d: 'Scouting, hadroh, futsal, PMR, journalism', u: 'program.html#ekskul', k: 'extracurricular scout hadroh futsal pmr paskibra' },
      { t: 'Achievements', d: 'RARE ICON, KSM, and student awards', u: 'prestasi.html', k: 'achievement rare icon research ksm medal international award' },
      { t: 'News', d: 'Official madrasah news & announcements', u: 'berita.html', k: 'news berita activities announcement u15 timnas sbsn porseni scout achievement' },
      { t: 'Facilities', d: 'SBSN building, labs, library, dormitory, mosque', u: 'fasilitas.html', k: 'facilities sbsn building lab laboratory library dormitory mosque uks' },
      { t: 'Admissions (PPDB)', d: 'New student registration', u: 'ppdb.html', k: 'ppdb admission registration new student track' },
      { t: 'Contact & Location', d: 'Address, phone, email, map', u: 'kontak.html', k: 'contact address phone email map location' },
      { t: 'Boarding Student Admission', d: 'New student registration for Idzatun Nasyi\u2019in', u: 'ppdb.html', k: 'boarding dormitory register pesantren' }
    ]
  };

  function runSearch(q) {
    q = q.trim().toLowerCase();
    const cur = I18N[lang] || I18N.id;
    if (!q) {
      searchResults.innerHTML = '<p class="hint">' + cur['search.hint'] + '</p>';
      return;
    }
    const found = (SEARCH_INDEX[lang] || SEARCH_INDEX.id).filter(function (item) {
      return (item.t + ' ' + item.d + ' ' + item.k).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 6);
    if (!found.length) {
      searchResults.innerHTML = '<p class="hint">' + cur['search.empty'].replace('{q}', q) + '</p>';
      return;
    }
    searchResults.innerHTML = found.map(function (item) {
      return '<a href="' + item.u + '"><b>' + item.t + '</b><br>' + item.d + '</a>';
    }).join('');
  }
  window.__forceSearch = function () { if (searchInput) runSearch(searchInput.value); };

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
      'hero.t1': 'Madrasah Hebat,<br>Bermartabat',
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
      'stat.4': 'Kapasitas Boarding', 'stat.5': 'Medali (2022)', 'stat.6': 'Akreditasi',
      'stat.src': 'Sumber: Kanwil Kemenag Jawa Tengah & kanal YouTube resmi madrasah.',
      'hero.prospekt': 'Prospektus (PDF)',
      'nws.src': 'Sumber berita: Kanwil Kementerian Agama Provinsi Jawa Tengah (jateng.kemenag.go.id).',
      'tea.2s': 'Pembina Asrama',
      'tea.3s': 'Ka. Gudep Putra',
      'tea.4s': 'Pelatih Seni',
      'tea.5s': 'Pelatih Seni',
      'nav.berita': 'Berita',
      'prg.h': 'Tiga Pilar Keunggulan Madrasah', 'prg.btn': 'Selengkapnya tentang Program →',
      'png.h': 'Pengumuman Madrasah', 'eks.h': 'Ekstrakurikuler & Kegiatan Siswa',
      'brd.h': 'Boarding School "Idzatun Nasyi\'in"', 'brd.btn': 'Selengkapnya →',
      'news.h': 'Video & Dokumentasi Madrasah', 'news.btn': 'Lihat Semua Prestasi →',
      'gal.h': 'Galeri Kegiatan', 'age.h': 'Agenda Kegiatan',
      'fas.h': 'Fasilitas Madrasah', 'tes.h': 'Apa Kata Mereka',
      'tea.h': 'Guru & Tenaga Kependidikan',
      'ppdb.h': 'Pendaftaran Peserta Didik Baru (PPDB)', 'ppdb.a': 'Info PPDB →', 'ppdb.b': 'Hubungi Panitia',
      'newsletter.h': 'Ikuti Kabar Madrasah', 'newsletter.p': 'Berlangganan info kegiatan, jadwal, dan pengumuman terbaru langsung ke email Anda.',
      'sticky.a': 'Daftar PPDB 2025/2026', 'footer.tag': 'Website resmi madrasah, dibuat untuk pendidikan.',
      'topbar.siswa': 'Siswa', 'topbar.ortu': 'Orang Tua', 'topbar.alumni': 'Alumni', 'topbar.hours': 'Senin–Jumat, 07.00–16.00 WIB',
      'hero.c1': 'Akreditasi A', 'hero.c2': 'Madrasah Negeri (Kemenag RI)', 'hero.c3': 'Piloting Kurikulum Merdeka', 'hero.c4': 'Boarding School',
      'hero.c5': "Tahfidzul Qur'an", 'hero.c6': 'Riset & Penelitian', 'hero.c7': 'Olimpiade Sains', 'hero.c8': 'Riset Internasional & KSM',
      'hero.c9': 'Pendidikan Pesantren', 'hero.c10': 'Kajian Kitab Kuning', 'hero.c11': '100 Putra + 100 Putri',
      'trust.label': 'Terakreditasi & Diakui', 'trust.1': 'Akreditasi A', 'trust.2': 'Madrasah Negeri', 'trust.3': 'Kurikulum Merdeka', 'trust.5': 'Boarding School',
      'why.ey': 'Keunggulan', 'why.h': 'Mengapa Memilih MTs Negeri 1', 'why.p': 'Alasan keluarga mempercayakan pendidikan putra-putrinya kepada kami.',
      'why.1h': 'Pengakuan Nasional', 'why.1p': 'Akreditasi A dan madrasah negeri yang menjamin mutu pendidikan secara resmi.',
      'why.2h': 'Pendidik Berdedikasi', 'why.2p': 'Guru profesional dan berkomitmen mendampingi setiap peserta didik secara personal.',
      'why.3h': "Pondasi Qur'ani", 'why.3p': "Karakter Islami dan hafalan Al-Qur'an yang dikembangkan setiap hari dalam keseharian.",
      'why.4h': 'Keterampilan Abad 21', 'why.4p': 'Riset, sains, dan literasi digital yang membekali siswa untuk masa depan.',
      'why.5h': 'Fasilitas Modern', 'why.5p': 'Sarana belajar, laboratorium, masjid, dan asrama yang nyaman serta aman.',
      'why.6h': 'Islami & Inklusif', 'why.6p': 'Lingkungan aman dan penuh kasih yang menghargai keunikan setiap anak.',
      'samb.ey': 'Sambutan',
      'samb.p1': 'Selamat datang di website resmi MTs Negeri 1 Kota Semarang. Kami bersyukur ke hadirat Allah SWT atas segala nikmat dan karunia-Nya, sehingga website ini dapat hadir sebagai media informasi, publikasi, dan layanan bagi seluruh warga madrasah, orang tua, serta masyarakat luas.',
      'samb.p2': 'MTs Negeri 1 Kota Semarang terus berbenah dan berkomitmen menjadi madrasah yang hebat dan bermartabat. Melalui program unggulan tahfidz, riset, dan sains, kami mendidik peserta didik dengan pendidikan ala pesantren, menanamkan nilai-nilai keislaman, serta membekali keterampilan abad 21 agar siap menghadapi tantangan zaman.',
      'samb.p3': 'Kami mengucapkan terima kasih atas dukungan dan kepercayaan masyarakat. Mari bersama wujudkan generasi Qur\'ani yang cerdas, berakhlak mulia, dan berprestasi.',
      'samb.kepala': 'Kepala Madrasah', 'samb.quote': 'Bersama, kita wujudkan generasi Qur\'ani yang cerdas, berakhlak mulia, dan berprestasi.', 'samb.alamat': 'Alamat', 'samb.alamatv': 'Jl. Ketileng Raya (Jl. Fatmawati), Sendangmulyo, Kec. Tembalang, Kota Semarang 50272',
      'samb.jam': 'Jam Layanan', 'samb.jamv': 'Senin–Jumat, 07.00–16.00 WIB (kantor & pelayanan administrasi)',
      'samb.telp': 'Telepon', 'samb.telpv': '(024) 6716521 — <a href="kontak.html">lihat kontak</a>', 'samb.email': 'Email',
      'png.ey': 'Informasi Resmi', 'png.p': 'Informasi dan pemberitahuan terbaru untuk warga madrasah, orang tua, dan masyarakat.',
      'tag.ppdb': 'PPDB', 'tag.boarding': 'Boarding School', 'tag.akademik': 'Akademik', 'tag.kegiatan': 'Kegiatan',
      'png.1t': 'PPDB Tahun Pelajaran 2025/2026 Segera Dibuka', 'png.1d': 'Informasi jadwal, kuota, dan jalur pendaftaran akan diumumkan panitia PPDB madrasah. Mohon pantau terus laman ini.',
      'png.2t': "Penerimaan Santri Baru \"Idzatun Nasyi'in\"", 'png.2d': 'Pendaftaran santri baru boarding school dibuka dengan kapasitas 100 santri putra dan 100 santriwati.',
      'png.3t': 'Pembagian Rapor & Libur Semester Ganjil TP 2024/2025', 'png.3d': 'Pembagian rapor dilaksanakan oleh wali kelas masing-masing; jadwal rinci diumumkan melalui wali kelas.',
      'png.4t': 'Kunjungan Belajar Teknik Audio & Video ke TVRI Jateng', 'png.4d': 'Peserta didik mengikuti kunjungan belajar teknik audio dan video ke TVRI Stasiun Jawa Tengah.',
      'prg.ey': 'Program Unggulan', 'prg.p': 'Program unggulan yang menjadi daya tarik dan ciri khas MTs Negeri 1 Kota Semarang.',
      'prg.tag1': 'Program 01', 'prg.tag2': 'Program 02', 'prg.tag3': 'Program 03',
      'prg.1t': "Tahfidzul Qur'an", 'prg.1d': "Pembinaan hafalan Al-Qur'an dengan metode terstruktur, didampingi pengasuh, serta kajian kitab kuning (Mabadiul Fiqhiyah, Hidatul Mustafid, Alala, dan lainnya).",
      'prg.2t': 'Riset', 'prg.2d': 'Pelatihan penelitian ilmiah dan pendalaman materi sains, dengan bimbingan khusus untuk persiapan mengikuti kompetisi tingkat kota, nasional, hingga internasional.',
      'prg.3t': 'Sains', 'prg.3d': 'Penguatan kompetensi sains melalui pembelajaran aktif, praktikum, dan olimpiade — terbukti melalui prestasi di Kompetisi Sains Madrasah (KSM) hingga tingkat provinsi.',
      'prg.m1b': 'Pendidikan ala Pesantren', 'prg.m1s': 'Pembinaan karakter dan nilai keislaman dalam keseharian.',
      'prg.m2b': 'Kurikulum Merdeka', 'prg.m2s': 'Madrasah piloting Implementasi Kurikulum Merdeka sejak 2022/2023.',
      'prg.m3b': 'Berprestasi di Banyak Ajang', 'prg.m3s': 'Dari tingkat kota, provinsi, nasional, hingga internasional.',
      'eks.ey': 'Pengembangan Bakat', 'eks.p': 'Wadah pengembangan minat, bakat, dan karakter peserta didik di luar jam pembelajaran.',
      'eks.1t': 'Pramuka', 'eks.1d': 'Gerakan Pramuka Gugus Depan — kepemimpinan, kedisiplinan, dan kecakapan hidup.',
      'eks.2t': 'Paskibra', 'eks.2d': 'Pasukan pengibar bendera — pelatihan baris-berbaris dan kedisiplinan.',
      'eks.3t': 'Tahfidz & Tilawah', 'eks.3d': "Pembinaan hafalan Al-Qur'an, tilawah, dan tahsin untuk santri.",
      'eks.4t': 'Hadroh & Rebana', 'eks.4d': 'Seni musik Islami sebagai media dakwah dan syiar madrasah.',
      'eks.5t': 'Futsal', 'eks.5d': 'Pembinaan olahraga futsal putra-putri untuk kompetisi antar madrasah.',
      'eks.6t': 'PMR', 'eks.6d': 'Palang Merah Remaja — pertolongan pertama, kesehatan, dan aksi sosial.',
      'eks.7t': 'KIR / Sains Club', 'eks.7d': 'Karya Ilmiah Remaja dan klub sains untuk riset serta olimpiade.',
      'eks.8t': 'Jurnalistik & English', 'eks.8d': 'Madrasah journaling, mading digital, dan English club.',
      'news.ey': 'Media & Video', 'news.p': 'Video resmi dari kanal YouTube MTs Negeri 1 Kota Semarang — klik untuk menonton.',
      'news.v1t': 'MTsN 1 Kota Semarang di YouTube', 'news.v1p': 'Ikuti video, dokumentasi, dan informasi resmi madrasah melalui kanal YouTube resmi kami.',
      'news.w1': '▶ Kunjungi Kanal YouTube', 'news.w2': '▶ Tonton di YouTube',
      'hero.film': 'Film Profil Madrasah', 'hero.filmAria': 'Putar film profil madrasah',
      'hero.scroll': 'Jelajahi', 'hero.scrollAria': 'Gulir untuk menjelajahi halaman',
      'media.ey': 'Media & Film', 'media.h': 'Media Center Madrasah',
      'media.p': 'Video resmi dari kanal YouTube MTs Negeri 1 Kota Semarang — pilih untuk memutar langsung di sini.',
      'media.channel': '▶ Kunjungi Kanal YouTube Resmi',
      'media.watch': '▶ Jika video tidak muncul, buka langsung di YouTube',
      'media.modalAria': 'Pemutar video', 'media.closeAria': 'Tutup pemutar video',
      'media.tagProfile': 'Profil', 'media.tagPPDB': 'PPDB', 'media.tagGlobal': 'Global', 'media.tagFaith': 'Keislaman', 'media.tagArts': 'Seni', 'media.tagMars': 'Mars',
      'media.m1t': 'Kurikulum Berbasis Cinta — Profil Madrasah', 'media.m1d': 'Film profil resmi madrasah: kurikulum berbasis cinta, pembelajaran, dan kehidupan kampus.',
      'media.m2t': 'Menyambut PPDB 2025/2026', 'media.m2d': 'Video promosi PPDB: "Madrasah Paling Tepat Untuk Generasi Emas" oleh Emtessa.',
      'media.m3t': 'MTsN 1 di Ajang Riset Internasional', 'media.m3d': 'Dokumentasi kiprah peserta didik di kompetisi dan pameran riset internasional.',
      'media.m4t': '13C Challenge — MIICA Malaysia 2025', 'media.m4d': 'Video challenge kreatif siswa dalam ajang internasional MIICA Malaysia.',
      'media.m5t': 'Peresmian Masjid Al-Karim', 'media.m5d': 'Dokumentasi peresmian masjid madrasah sebagai pusat ibadah dan tahfidz.',
      'media.m6t': 'Emtessa Music — Spesial Kemerdekaan', 'media.m6d': 'Penampilan seni Emtessa Music dalam memperingati kemerdekaan RI.',
      'media.m7t': 'Mars MTsN 1 Kota Semarang', 'media.m7d': 'Mars madrasah, ciptaan Bapak H. Kasturi, S.Ag., M.Pd.',
      'ppdb.video': '▶ Tonton Video PPDB', 'vtr.playAria': 'Putar film profil madrasah',
      'hero.note1': 'Pendaftaran Dibuka', 'hero.note2': 'TP 2025/2026',
      'hero.qt1': 'Akreditasi', 'hero.qt2': 'Kuota Siswa', 'hero.qt3': 'Medali (2022)',
      'hero.apply': 'Daftar Sekarang →', 'hero.visit': 'Kunjungi Kampus',
      'path.ey': 'Global Engagement', 'path.h': 'Dari Semarang, Berkarya di Panggung Dunia',
      'path.p': 'Jejaring prestasi dan kesempatan global untuk peserta didik — dari kompetisi internasional hingga melanjutkan studi di sekolah unggulan.',
      'path.1t': 'Riset Internasional', 'path.1d': 'Medali perak RARE ICON (IFPRI) 2022 — bersaing di kancah riset internasional.',
      'path.2t': 'Kolaborasi ASEAN', 'path.2d': '13C Challenge — MIICA Malaysia 2025: kolaborasi kreatif lintas negara.',
      'path.3t': 'Kompetisi Nasional', 'path.3d': 'Kompetisi Sains Madrasah (KSM) hingga tingkat provinsi dan nasional.',
      'path.4t': 'Lanjutan Studi Gemilang', 'path.4d': 'Alumni berhasil melaju ke MAN Insan Cendekia, MA/SMA unggulan, dan pesantren ternama.',
      'path.more': 'Lihat Selengkapnya →',
      'keb.title': 'Kebijakan Privasi — MTs Negeri 1 Kota Semarang', 'keb.desc': 'Kebijakan privasi dan ketentuan penggunaan website resmi MTs Negeri 1 Kota Semarang.',
      'keb.bc': '/ Kebijakan Privasi', 'keb.h1': 'Kebijakan Privasi & Ketentuan',
      'keb.note': 'Catatan:', 'keb.notep': 'Dokumen ini disusun untuk menjelaskan pengelolaan data dan ketentuan penggunaan website resmi MTs Negeri 1 Kota Semarang. Perubahan kebijakan akan diumumkan pada laman ini.',
      'keb.1h': '1. Privasi & Data Pribadi', 'keb.1p': 'Website ini menggunakan data pribadi yang Anda berikan secara sukarela (nama, email, telepon) melalui formulir kontak, pendaftaran, atau newsletter. Data hanya digunakan untuk keperluan komunikasi, informasi PPDB, dan layanan madrasah — tidak pernah dijual atau dibagikan kepada pihak ketiga tanpa persetujuan.',
      'keb.2h': '2. Cookie & Penyimpanan Lokal', 'keb.2p': 'Situs ini menggunakan penyimpanan lokal pada perangkat Anda untuk preferensi pengguna (tema terang/gelap, bahasa, dan kalender akademik). Kami tidak menggunakan cookie pelacakan pihak ketiga.',
      'keb.3h': '3. Hak Cipta & Konten', 'keb.3p': 'Seluruh konten — teks, foto, logo, video, dan mars madrasah — adalah milik MTs Negeri 1 Kota Semarang dan Kementerian Agama RI. Penggunaan ulang untuk publikasi wajib mencantumkan sumber.',
      'keb.4h': '4. Penafian (Disclaimer)', 'keb.4p': 'Informasi di situs ini disusun sebaik mungkin dan diperbarui berkala. Jadwal, kuota, dan kebijakan PPDB mengikuti pengumuman resmi panitia madrasah serta ketetapan Kementerian Agama RI.',
      'keb.5h': '5. Kontak', 'keb.5p': 'Pertanyaan seputar kebijakan ini dapat disampaikan melalui email humas@mtsn1semarang.sch.id atau halaman kontak resmi madrasah.',
      'ft.l5': 'Kebijakan Privasi',
      'cookie.txt': 'Kami menggunakan penyimpanan lokal agar situs berfungsi optimal (preferensi tema, bahasa, kalender).', 'cookie.btn': 'Baik, Saya Mengerti',
      'news.v2t': 'Peresmian Masjid Al-Karim MTsN 1 Kota Semarang', 'news.v2p': 'Dokumentasi peresmian masjid madrasah sebagai pusat ibadah dan pembinaan tahfidz.',
      'news.v3t': 'MTsN 1 Kota Semarang di Ajang Riset Internasional', 'news.v3p': 'Kiprah peserta didik madrasah pada kompetisi dan pameran riset tingkat internasional.',
      'nws.h': 'Cerita, Berita & Prestasi', 'nws.p': 'Kabar dan capaian MTs Negeri 1 Kota Semarang dari berbagai kegiatan.',
      'nws.1t': 'Peserta Didik Lolos Seleksi U-15 Timnas Indonesia', 'nws.1p': 'Salah satu peserta didik kelas IX lolos seleksi U-15 Timnas Indonesia dan bersiap menuju Portugal.', 'nws.1d': '6 Sep 2023 · Nasional',
      'trust.4': 'Riset Internasional',
      'trust.4s': 'Medali perak RARE ICON (IFPRI) 2022',
      'nws.2d': '29 Mar 2022 · Nasional',
      'nws.3d': '8 Feb 2022 · Fasilitas',
      'nws.4d': '4 Jun 2022 · Internasional',
      'nws.5d': '11 Jun 2022 · Kwartir',
      'nws.6d': '25 Mar 2022 · Alumni',
      'nws.2t': '132 Medali dari 10 Ajang Kompetisi', 'nws.2p': 'Putra-putri terbaik madrasah menyumbangkan 132 medali dalam 10 macam perlombaan olimpiade dan sains.',
      'nws.3t': 'Gedung SBSN Diresmikan Menteri Agama', 'nws.3p': 'Gedung baru madrasah yang dibangun lewat skema SBSN diresmikan untuk menunjang kegiatan belajar.',
      'nws.4t': 'Medali Perak Riset Internasional (RARE ICON)', 'nws.4p': 'Riset pasta gigi dari kulit jeruk keprok meraih medali perak tingkat internasional pada RARE ICON 2022.',
      'nws.5t': 'Juara 1 LCTP Pramuka Tingkat Kwartir', 'nws.5p': 'Tim pramuka madrasah meraih juara pertama Lomba Cepat Tepat Pramuka tingkat kwartir.',
      'nws.6t': 'Alumni Diterima di MAN Insan Cendekia & MAN PK', 'nws.6p': 'Peserta didik diterima di MAN Insan Cendekia (Pekalongan, Pasuruan) dan MAN Program Keagamaan Surakarta.',
      'nws.btn': 'Lihat Semua Berita →',
      'brt.title': 'Berita — MTs Negeri 1 Kota Semarang',
      'brt.bc': '/ Berita',
      'brt.h1': 'Berita Madrasah',
      'brt.ey': 'Newsroom',
      'brt.h2': 'Kabar, Kegiatan & Prestasi Terbaru',
      'brt.p': 'Berita yang ditampilkan bersumber dari rilis resmi Kanwil Kementerian Agama Provinsi Jawa Tengah dan kanal YouTube resmi madrasah.',
      'brt.src': 'Sumber: Kanwil Kementerian Agama Provinsi Jawa Tengah (jateng.kemenag.go.id) — klik judul untuk membaca rilis lengkapnya.',
      'brt.prestasi': 'Lihat Semua Prestasi →',
      'brt.cta.h': 'Ikuti Kabar Madrasah',
      'brt.cta.p': 'Dapatkan info terbaru seputar kegiatan, prestasi, dan pendaftaran langsung dari sumber resmi madrasah.',
      'brt.cta.btn': 'Info PPDB →',
      'vtr.tag': 'Campus Experience', 'vtr.h': 'Jelajahi Lingkungan Madrasah Kami', 'vtr.p': "Tonton tur virtual kampus, fasilitas, dan kehidupan Boarding School Idzatun Nasyi'in — dari mana saja.",
      'vtr.b1': 'Tonton Video →', 'vtr.b2': 'Kunjungi Kami',
      'gal.ey': 'Dokumentasi', 'gal.p': 'Potret suasana dan aktivitas di lingkungan MTs Negeri 1 Kota Semarang.',
      'gal.1': 'Dokumentasi Resmi Madrasah', 'gal.2': 'Peresmian Masjid Al-Karim', 'gal.3': 'Kegiatan & Karya Siswa', 'gal.4': 'Kurikulum Berbasis Cinta',
      'gal.5': 'LKBB & Paskibra', 'gal.6': 'Boarding School', 'gal.7': 'Mars MTsN 1 Kota Semarang', 'gal.8': 'Ajang Riset Internasional',
      'age.ey': 'Kalender Madrasah', 'age.p': 'Kalender akademik TP 2026/2027 — jadwal kegiatan, ujian, dan libur madrasah. Klik tanggal untuk detail.',
      'cal.note': '*) Sesuai Kalender Pendidikan Madrasah (KMA) & kebijakan resmi madrasah — tanggal keagamaan merupakan perkiraan hisab menunggu ketetapan resmi Kemenag RI.',
      'tes.ey': 'Testimoni', 'tes.p': 'Pengalaman wali murid, alumni, dan santri bersama MTs Negeri 1 Kota Semarang.',
      'tes.1q': "Anak saya betah dan tumbuh menjadi anak yang lebih disiplin serta gemar membaca Al-Qur'an. Program boarding school-nya benar-benar membantu pembentukan karakter.",
      'tes.1b': 'Wali Murid Santri Boarding', 'tes.1s': 'Orang tua santri boarding',
      'tes.2q': 'Pembinaan riset dan sains di madrasah ini sangat membekali saya. Saya bisa lolos seleksi MAN Insan Cendekia berkat pengalaman olimpiade dan KIR yang saya dapatkan di sini.',
      'tes.2b': 'Alumni MTsN 1 Kota Semarang', 'tes.2s': 'Diterima di MAN Insan Cendekia',
      'tes.3q': 'Bangga rasanya menjadi bagian dari kemenangan tim riset di ajang internasional. Guru-guru di sini sangat suportif dalam mendampingi kami mengembangkan ide penelitian.',
      'tes.3b': 'Siswa Kelas IX', 'tes.3s': 'Medali Perak RARE ICON 2022',
      'tea.ey': 'Pendidik & Tenaga Kependidikan', 'tea.p': 'Tenaga pendidik profesional dan berdedikasi dalam mendampingi peserta didik.',
      'tea.1p': 'Kepala Madrasah', 'tea.1s': 'Fikih & Keagamaan',
      'tea.2h': 'M. Fajar Anshari', 'tea.2p': 'Kepala Boarding School',
      'tea.3h': 'Saptono', 'tea.3p': 'Pembina Pramuka',
      'tea.4h': 'Agus Prapto Sukoco', 'tea.4p': 'Guru Seni & Paduan Suara',
      'tea.5h': 'Agus Trisnoto', 'tea.5p': 'Guru Seni & Paduan Suara',
      'tea.6h': 'Tenaga Pendidik Lainnya', 'tea.6p': 'Guru & Karyawan',
      'tea.badge': 'Informasi resmi menyusul', 'tea.note': 'Foto dan nama tenaga pendidik lainnya sedang dalam proses validasi data resmi madrasah.',
      'fas.ey': 'Sarana & Prasarana', 'fas.p': 'Fasilitas pendukung pembelajaran dan kenyamanan peserta didik.',
      'fas.1t': 'Gedung & Kampus', 'fas.1p': 'Gedung dan kampus madrasah — termasuk gedung SBSN yang diresmikan Menteri Agama.',
      'fas.2t': 'Ruang Belajar & Kegiatan', 'fas.2p': 'Ruang kelas, aula, dan area kegiatan untuk pembelajaran aktif.',
      'fas.3t': 'Kurikulum Merdeka', 'fas.3p': 'Madrasah piloting Implementasi Kurikulum Merdeka sejak 2022/2023.',
      'fas.4t': 'Masjid & Ibadah', 'fas.4p': 'Masjid Al-Karim dan sarana ibadah untuk pembinaan tahfidz & kajian kitab.',
      'fas.more': 'Selengkapnya →', 'fas.btn': 'Lihat Semua Fasilitas →',
      'faq.ey': 'Pusat Bantuan', 'faq.h': 'Pertanyaan yang Sering Diajukan', 'faq.p': 'Jawaban ringkas untuk pertanyaan umum seputar pendaftaran dan kehidupan madrasah.',
      'faq.1q': 'Bagaimana cara mendaftar PPDB?', 'faq.1a': 'Pendaftaran melalui jalur resmi yang diumumkan panitia PPDB pada laman ini. Detail jadwal, kuota, dan berkas menyusul dari pihak madrasah.',
      'faq.2q': 'Apakah tersedia program tahfidz untuk semua siswa?', 'faq.2a': "Ya. Tahfidzul Qur'an merupakan salah satu program unggulan yang dibina terstruktur, dilengkapi kajian kitab kuning dan pendampingan pengasuh.",
      'faq.3q': "Bagaimana sistem Boarding School Idzatun Nasyi'in?", 'faq.3a': "Asrama dikelola mandiri oleh madrasah dengan pendidikan ala pesantren — hafalan Al-Qur'an, kajian kitab, dan pembinaan karakter setiap hari. Kapasitas 100 santri putra dan 100 santriwati.",
      'faq.4q': 'Apa saja program unggulan selain tahfidz?', 'faq.4a': 'Riset dan Sains. Peserta didik dibina untuk kompetisi mulai tingkat kota hingga internasional, termasuk KSM dan riset internasional.',
      'faq.5q': 'Apakah saya bisa mengunjungi madrasah?', 'faq.5a': 'Tentu. Lihat halaman Kontak & Lokasi untuk alamat, peta, dan jam layanan kantor (Senin–Jumat, 07.00–16.00 WIB).',
      'lb.h': 'Link Terkait', 'lb.p': 'Portal resmi pemerintah & Kementerian Agama.',
      'ppdb.p': 'Bergabunglah bersama kami! Jadilah bagian dari keluarga besar MTs Negeri 1 Kota Semarang dengan program unggulan tahfidz, riset, dan sains.',
      'nl.btn': 'Langganan', 'nl.placeholder': 'Alamat email Anda…',
      'ft.about': 'MTs Negeri 1 Kota Semarang',
      'ft.aboutp': "Madrasah Tsanawiyah Negeri di bawah Kementerian Agama RI yang berkomitmen mencetak generasi Qur'ani, cerdas, dan berprestasi melalui program unggulan tahfidz, riset, dan sains.",
      'ft.q': 'Tautan Cepat', 'ft.q1': 'Profil Madrasah', 'ft.q2': 'Program Unggulan', 'ft.q3': 'Prestasi', 'ft.q4': 'Fasilitas', 'ft.q5': 'Info PPDB',
      'ft.l': 'Layanan', 'ft.l1': 'Hubungi Kami', 'ft.l2': 'Pendaftaran Siswa', 'ft.l3': 'Struktur Organisasi', 'ft.l4': 'Lokasi Madrasah',
      'ft.k': 'Kontak', 'ft.k1': 'Jl. Ketileng Raya (Jl. Fatmawati), Sendangmulyo, Kec. Tembalang, Kota Semarang, Jawa Tengah 50272', 'ft.k2': '(024) 6716521',
      'ft.cred': '<b>Akreditasi A</b>&nbsp;·&nbsp;Madrasah Negeri (Kemenag RI)&nbsp;·&nbsp;Piloting Kurikulum Merdeka&nbsp;·&nbsp;Riset Internasional',
      // ===== Pencarian & aksesibilitas =====
      'search.ph': 'Cari: PPDB, tahfidz, boarding, prestasi…',
      'search.btn': 'Cari',
      'search.overlayAria': 'Pencarian situs',
      'search.closeAria': 'Tutup pencarian',
      'search.inputAria': 'Kata kunci pencarian',
      'search.hint': 'Ketik kata kunci, misalnya <b>PPDB</b>, <b>tahfidz</b>, <b>boarding</b>, atau <b>prestasi</b>.',
      'search.empty': 'Tidak ditemukan hasil untuk \u201c{q}\u201d. Coba kata kunci lain.',
      'searchBtn.aria': 'Cari di situs',
      'searchBtn.title': 'Cari (Ctrl+K)',
      'themeBtn.aria': 'Ganti tema terang/gelap',
      'themeBtn.title': 'Tema',
      'navToggle.aria': 'Buka menu',
      'toTop.aria': 'Kembali ke atas',
      'wa.aria': 'Hubungi kami',
      'lb.dialog': 'Tampilan galeri',
      'lb.close': 'Tutup',
      'lb.prev': 'Sebelumnya',
      'lb.next': 'Berikutnya',
      'nl.thanks': 'Terima kasih! Email Anda telah kami catat.',
      'cal.agenda': 'Agenda',
      'cal.onDate': 'Kegiatan pada tanggal {d}',
      'cal.pickDate': 'Pilih tanggal atau lihat semua agenda bulan ini',
      'cal.none': 'Tidak ada agenda di bulan ini.',
      // ===== Halaman Prestasi =====
      'pst.title': 'Prestasi — MTs Negeri 1 Kota Semarang',
      'pst.desc': 'Prestasi MTs Negeri 1 Kota Semarang: Medali Perak Riset Internasional (RARE ICON), 132 medali, KSM, LCTP Pramuka, dan lainnya.',
      'pst.bc': '/ Prestasi',
      'pst.h1': 'Prestasi Madrasah',
      'pst.ey': 'Kebanggaan Kami',
      'pst.h2': 'Prestasi dari Kota hingga Internasional',
      'pst.p': 'MTs Negeri 1 Kota Semarang konsisten menorehkan prestasi — baik akademik maupun non-akademik — yang mengharumkan nama Kota Semarang di tingkat nasional dan internasional.',
      'pst.t1': 'Kunjungan Belajar Teknik Audio & Video',
      'pst.d1': 'Peserta didik belajar langsung teknik audio dan video di TVRI Stasiun Jawa Tengah (Desember 2024).',
      'pst.s1': 'Sumber: tvri.go.id',
      'pst.t2': 'Komitmen Madrasah Ramah Anak',
      'pst.d2': 'MTsN 1 Kota Semarang berkomitmen mewujudkan madrasah ramah anak yang aman dan nyaman bagi seluruh peserta didik.',
      'pst.s2': 'Sumber: Suara Merdeka, Maret 2023',
      'pst.t3': 'Tiga Siswa Maju KSM Tingkat Provinsi',
      'pst.d3': 'Tiga peserta didik mewakili Kota Semarang pada Kompetisi Sains Madrasah (KSM) tingkat provinsi tahun 2023.',
      'pst.s3': 'Sumber: Kemenag Jateng, Juli 2023',
      'pst.t4': 'Juara 1 LCTP Pramuka Tingkat Kwartir',
      'pst.d4': 'Tim pramuka meraih juara 1 Lomba Cepat Tepat Pramuka (LCTP) tingkat kwartir dan siap maju ke tingkat kwarcab.',
      'pst.s4': 'Sumber: Kemenag Jateng, Juni 2022',
      'pst.t5': 'Juara Bulutangkis PBSI Jakarta Selatan',
      'pst.d5': 'Siswa MTs Negeri 1 Kota Semarang menjadi juara bulutangkis pada kejuaraan PBSI Jakarta Selatan.',
      'pst.s5': 'Sumber: Kemenag Jateng, Juli 2022',
      'pst.t6': 'Lulusan Diterima di MAN Bergengsi',
      'pst.d6': 'Peserta didik diterima di madrasah unggulan nasional berbasis asrama: MAN Insan Cendekia (IC), MAN Program Keagamaan (PK), dan MAKN melalui SNPDB.',
      'pst.s6': 'Sumber: Kemenag Jateng, 2022',
      'pst.t7': 'Medali Perak Riset Internasional (RARE ICON)',
      'pst.d7': 'Tim riset madrasah meraih medali perak tingkat internasional pada RARE ICON 2022 (IFPRI) lewat riset pasta gigi kulit jeruk keprok.',
      'pst.s7': 'Sumber: Kemenag Jateng, Februari 2021',
      'pst.cta.h': 'Ingin Anak Anda Berprestasi?',
      'pst.cta.p': 'Bergabunglah dengan madrasah yang telah terbukti mencetak juara di tingkat nasional dan internasional.',
      'pst.cta.btn': 'Info PPDB →',
      // ===== Halaman Profil =====
      'prf.title': 'Profil — MTs Negeri 1 Kota Semarang',
      'prf.desc': 'Profil MTs Negeri 1 Kota Semarang: sejarah, visi misi, identitas madrasah, dan struktur organisasi.',
      'prf.bc': '/ Profil',
      'prf.h1': 'Profil Madrasah',
      'prf.sej.ey': 'Tentang Kami',
      'prf.sej.h': 'Sejarah Singkat',
      'prf.sej.p1': '<strong style="color:var(--green-800);">MTs Negeri 1 Kota Semarang</strong> merupakan madrasah tsanawiyah negeri yang berlokasi di Jalan Ketileng Raya (Jalan Fatmawati), Kelurahan Sendangmulyo, Kecamatan Tembalang, Kota Semarang. Sebagai madrasah negeri, seluruh penyelenggaraan pendidikannya berada di bawah naungan Kementerian Agama Republik Indonesia.',
      'prf.sej.p2': 'Madrasah ini dikenal sebagai salah satu madrasah favorit di Kota Semarang dengan animo pendaftar yang tinggi setiap tahunnya. Pada PPDB tahun 2022, kuota 352 siswa untuk 11 rombongan belajar terpenuhi dalam waktu singkat — bahkan jumlah pendaftar melebihi kuota yang tersedia. Hal ini tidak lepas dari berbagai prestasi yang diraih, baik di tingkat kota, provinsi, nasional, maupun internasional, serta hadirnya program unggulan boarding school.',
      'prf.sej.p3': 'Pada 7 Februari 2022, gedung SBSN (Surat Berharga Syariah Negara) MTs Negeri 1 Kota Semarang diresmikan langsung oleh Menteri Agama — sebuah kebanggaan bagi seluruh warga madrasah dan masyarakat Kota Semarang. Sejak tahun pelajaran 2022/2023, madrasah juga ditetapkan sebagai madrasah <em>piloting</em> Implementasi Kurikulum Merdeka (IKM).',
      'prf.vm.ey': 'Arah & Tujuan',
      'prf.vm.h': 'Visi & Misi',
      'prf.visi.tag': 'Visi',
      'prf.visi.h': 'Terwujudnya Madrasah Hebat dan Bermartabat',
      'prf.visi.p': 'Mencetak generasi Qur\'ani yang beriman, bertakwa, berakhlak mulia, cerdas, terampil, serta mampu bersaing di era global tanpa meninggalkan nilai-nilai keislaman dan keindonesiaan.',
      'prf.misi.tag': 'Misi',
      'prf.misi.h': 'Langkah Menuju Visi',
      'prf.misi.1': 'Menyelenggarakan pendidikan yang memadukan ilmu agama dan ilmu umum.',
      'prf.misi.2': 'Mengembangkan program unggulan tahfidz, riset, dan sains.',
      'prf.misi.3': 'Membina peserta didik dengan pendidikan ala pesantren melalui boarding school.',
      'prf.misi.4': 'Menumbuhkan budaya literasi, riset, dan cinta ilmu pengetahuan.',
      'prf.misi.5': 'Mengembangkan potensi dan bakat peserta didik melalui kegiatan ekstrakurikuler.',
      'prf.misi.6': 'Mewujudkan madrasah ramah anak yang aman dan nyaman.',
      'prf.misi.7': 'Membangun kemitraan dengan orang tua dan masyarakat.',
      'prf.id.ey': 'Data Pokok',
      'prf.id.h': 'Identitas Madrasah',
      'prf.id.nama': 'Nama Madrasah',
      'prf.id.namav': 'MTs Negeri 1 Kota Semarang',
      'prf.id.status': 'Status',
      'prf.id.statusv': 'Negeri (Kementerian Agama RI)',
      'prf.id.jenjang': 'Jenjang',
      'prf.id.jenjangv': 'Madrasah Tsanawiyah (setara SMP)',
      'prf.id.alamat': 'Alamat',
      'prf.id.alamatv': 'Jl. Ketileng Raya (Jl. Fatmawati), Sendangmulyo, Kec. Tembalang, Kota Semarang, Jawa Tengah 50272',
      'prf.id.kec': 'Kecamatan',
      'prf.id.kecv': 'Tembalang',
      'prf.id.kota': 'Kota',
      'prf.id.kotav': 'Kota Semarang, Jawa Tengah',
      'prf.id.koordinat': 'Koordinat',
      'prf.id.koordinatv': '-7.0334, 110.4677',
      'prf.id.akreditasi': 'Akreditasi',
      'prf.id.akrednote': '(perlu diverifikasi)',
      'prf.id.npsn': 'NPSN / NSM',
      'prf.id.npsnnote': '(belum tersedia — mohon diisi)',
      'prf.id.kepala': 'Kepala Madrasah',
      'prf.id.kepalav': 'H. Kasturi, S.Ag., M.Pd.',
      'prf.id.kepalanote': '(per 2022–2023, mohon diperbarui)',
      'prf.id.kurikulum': 'Kurikulum',
      'prf.id.kurikulumv': 'Implementasi Kurikulum Merdeka (madrasah piloting)',
      'prf.str.ey': 'Organisasi',
      'prf.str.h': 'Struktur Organisasi',
      'prf.str.p': 'Kerangka pengelolaan madrasah (draf — mohon disesuaikan dengan kondisi aktual).',
      'prf.str.kepala': 'Kepala Madrasah',
      'prf.str.kur': 'Waka Kurikulum',
      'prf.str.kurp': 'Perencanaan & implementasi pembelajaran',
      'prf.str.kes': 'Waka Kesiswaan',
      'prf.str.kesp': 'Pembinaan peserta didik & tata tertib',
      'prf.str.sar': 'Waka Sarpras',
      'prf.str.sarp': 'Sarana & prasarana madrasah',
      'prf.str.hum': 'Waka Humas',
      'prf.str.hump': 'Hubungan masyarakat & publikasi',
      'prf.str.tu': 'Kepala Tata Usaha',
      'prf.str.tup': 'Administrasi & layanan persuratan',
      'prf.str.bs': 'Kepala Boarding School',
      'prf.str.bsp': 'Pengelolaan asrama Idzatun Nasyi\'in',
      'prf.vid.ey': 'Multimedia',
      'prf.vid.h': 'Video Profil Madrasah',
      'prf.vid.p': 'Lihat suasana MTs Negeri 1 Kota Semarang melalui video promosi dan virtual tour.',
      'prf.vid.cap': 'Video Informasi MTs Negeri 1 Kota Semarang (kanal resmi madrasah).',
      'prf.vid.iframeTitle': 'Video Profil MTs Negeri 1 Kota Semarang',
      // ===== Halaman Program =====
      'pro.title': 'Program — MTs Negeri 1 Kota Semarang',
      'pro.desc': 'Program unggulan MTs Negeri 1 Kota Semarang: Boarding School Idzatun Nasyi\'in, Tahfidzul Qur\'an, Riset, dan Sains.',
      'pro.bc': '/ Program',
      'pro.h1': 'Program Madrasah',
      'pro.bs.ey': 'Keunggulan Utama',
      'pro.bs.h': 'Boarding School "Idzatun Nasyi\'in"',
      'pro.bs.p': 'Pendidikan ala pesantren yang dikelola secara mandiri oleh madrasah — memadukan kurikulum madrasah dengan pembinaan hafalan Al-Qur\'an dan kajian kitab.',
      'pro.fak.tag': 'Fakta',
      'pro.fak.h': 'Profil Boarding School',
      'pro.fak.1': 'Nama: <strong>Idzatun Nasyi\'in</strong> — diresmikan oleh KH. Haris Shadaqah, pengasuh Ponpes Al-Itqan Bugen Bangetayu Kota Semarang.',
      'pro.fak.2': 'Mulai beroperasi: <strong>1 Februari 2022</strong>.',
      'pro.fak.3': 'Kapasitas: <strong>100 santri putra</strong> dan <strong>100 santriwati</strong>.',
      'pro.fak.4': 'Dikelola secara mandiri oleh madrasah (bukan kerja sama dengan pihak luar).',
      'pro.fak.5': 'Pembelajaran rutin: hafalan Al-Qur\'an dan kajian kitab kuning.',
      'pro.kit.tag': 'Kajian Kitab',
      'pro.kit.h': 'Kitab yang Dikaji',
      'pro.kit.1': 'Kitab <strong>Mabadiul Fiqhiyah</strong> (dasar-dasar fikih)',
      'pro.kit.2': 'Kitab <strong>Hidatul Mustafid</strong> (ilmu tajwid)',
      'pro.kit.3': 'Kitab <strong>Alala</strong> (adab menuntut ilmu)',
      'pro.kit.4': 'Kitab <strong>Safinatun Naja</strong> (fikih ibadah)',
      'pro.kit.5': 'Kitab <strong>Akhlakul Lil Banin</strong> (akhlak)',
      'pro.ug.ey': 'Program Unggulan',
      'pro.ug.h': 'Tahfidz, Riset & Sains',
      'pro.ug.p': 'Tiga pilar keunggulan yang menjadi daya tarik MTs Negeri 1 Kota Semarang.',
      'pro.tag1': 'Program 1', 'pro.tag2': 'Program 2', 'pro.tag3': 'Program 3',
      'pro.t1': 'Tahfidzul Qur\'an',
      'pro.l1a': 'Pembinaan hafalan Al-Qur\'an berjenjang dan terukur.',
      'pro.l1b': 'Setoran hafalan rutin kepada pengasuh/guru tahfidz.',
      'pro.l1c': 'Muraja\'ah (pengulangan hafalan) terjadwal.',
      'pro.l1d': 'Bagi santri boarding: didampingi 24 jam di asrama.',
      'pro.t2': 'Riset',
      'pro.l2a': 'Pelatihan metode penelitian ilmiah sejak dini.',
      'pro.l2b': 'Bimbingan khusus persiapan kompetisi riset.',
      'pro.l2c': 'Pembelajaran presentasi ilmiah berbahasa asing.',
      'pro.l2d': 'Terbukti meraih medali perak riset internasional (RARE ICON 2022).',
      'pro.t3': 'Sains',
      'pro.l3a': 'Pembelajaran sains aktif berbasis praktikum.',
      'pro.l3b': 'Pembinaan olimpiade sains (KSM, KSN, dan lainnya).',
      'pro.l3c': 'Pendalaman materi bagi siswa non-boarding juga difasilitasi.',
      'pro.l3d': 'Lulusan diterima di MAN unggulan (MAN IC, MAN PK, MAKN).',
      'pro.eks.ey': 'Pengembangan Diri',
      'pro.eks.h': 'Ekstrakurikuler',
      'pro.eks.p': 'Wadah pengembangan bakat, minat, dan karakter peserta didik.',
      'pro.e1t': 'Keagamaan', 'pro.e1s': 'Tilawah, tahfidz, hadroh, kaligrafi',
      'pro.e2t': 'Olahraga', 'pro.e2s': 'Futsal, bulutangkis, voli, atletik',
      'pro.e3t': 'Sains', 'pro.e3s': 'KIR, olimpiade sains, robotik',
      'pro.e4t': 'Seni', 'pro.e4s': 'Seni musik, teater, seni rupa',
      'pro.e5t': 'Pramuka', 'pro.e5s': 'Pramuka & LCTP',
      'pro.e6t': 'Jurnalistik', 'pro.e6s': 'Jurnalistik, multimedia, videografi',
      'pro.e7t': 'Bahasa', 'pro.e7s': 'English club, Arabic club',
      'pro.e8t': 'PMR', 'pro.e8s': 'Palang Merah Remaja & UKS',
      'pro.cta.h': 'Tertarik Bergabung?',
      'pro.cta.p': 'Daftarkan putra-putri Anda menjadi bagian dari keluarga besar MTs Negeri 1 Kota Semarang.',
      'pro.cta.btn': 'Info PPDB →',
      // ===== Halaman Fasilitas =====
      'fsl.title': 'Fasilitas — MTs Negeri 1 Kota Semarang',
      'fsl.desc': 'Fasilitas MTs Negeri 1 Kota Semarang: gedung SBSN, ruang kelas, laboratorium, perpustakaan, masjid, dan asrama boarding.',
      'fsl.bc': '/ Fasilitas',
      'fsl.h1': 'Fasilitas Madrasah',
      'fsl.ey': 'Sarana & Prasarana',
      'fsl.h': 'Lingkungan Belajar yang Nyaman',
      'fsl.p': 'MTs Negeri 1 Kota Semarang terus berbenah — termasuk peresmian gedung SBSN oleh Menteri Agama pada 2022 serta penataan ruang dan halaman madrasah.',
      'fsl.tag1': 'Gedung', 'fsl.t1': 'Gedung SBSN', 'fsl.p1': 'Gedung kelas baru yang dibangun melalui dana Surat Berharga Syariah Negara (SBSN), diresmikan langsung oleh Menteri Agama RI pada 7 Februari 2022.',
      'fsl.tag2': 'Belajar', 'fsl.t2': 'Ruang Kelas', 'fsl.p2': 'Ruang kelas yang memadai dengan kapasitas 11 rombongan belajar, didukung penataan ruang baru untuk kenyamanan pembelajaran.',
      'fsl.tag3': 'Sains', 'fsl.t3': 'Laboratorium', 'fsl.p3': 'Laboratorium IPA untuk mendukung program unggulan sains dan riset, praktikum, serta pembinaan olimpiade.',
      'fsl.tag4': 'Literasi', 'fsl.t4': 'Perpustakaan', 'fsl.p4': 'Pusat literasi dengan koleksi buku pelajaran, buku keislaman, dan bacaan pengayaan untuk menumbuhkan budaya membaca.',
      'fsl.tag5': 'Ibadah', 'fsl.t5': 'Masjid / Mushala', 'fsl.p5': 'Sarana ibadah untuk pembiasaan salat berjamaah, kegiatan keagamaan, serta pembinaan tahfidz dan kajian kitab.',
      'fsl.tag6': 'Asrama', 'fsl.t6': 'Asrama Boarding School', 'fsl.p6': 'Asrama putra dan putri "Idzatun Nasyi\'in" dengan kapasitas masing-masing 100 santri untuk pendidikan ala pesantren.',
      'fsl.tag7': 'Kesehatan', 'fsl.t7': 'UKS & Kesehatan', 'fsl.p7': 'Unit Kesehatan Sekolah dengan tenaga pembina dan perlengkapan P3K untuk melayani kesehatan peserta didik.',
      'fsl.tag8': 'Olahraga', 'fsl.t8': 'Lapangan Olahraga', 'fsl.p8': 'Halaman dan lapangan untuk kegiatan olahraga, upacara, serta senam bersama — mendukung prestasi bulutangkis dan olahraga lainnya.',
      'fsl.tag9': 'Teknologi', 'fsl.t9': 'Lab Komputer & Multimedia', 'fsl.p9': 'Sarana pembelajaran teknologi informasi dan multimedia — peserta didik bahkan belajar teknik audio-video di TVRI Jateng.',
      'fsl.cta.h': 'Lihat Langsung Madrasah Kami',
      'fsl.cta.p': 'Kunjungi MTs Negeri 1 Kota Semarang dan rasakan lingkungan belajarnya. Lihat peta lokasi di halaman kontak.',
      'fsl.cta.btn': 'Lihat Lokasi →',
      // ===== Halaman PPDB =====
      'ppd.title': 'PPDB — MTs Negeri 1 Kota Semarang',
      'ppd.desc': 'Informasi Penerimaan Peserta Didik Baru (PPDB) MTs Negeri 1 Kota Semarang: alur pendaftaran, jadwal, dan persyaratan.',
      'ppd.bc': '/ PPDB',
      'ppd.h1': 'Penerimaan Peserta Didik Baru',
      'ppd.ey': 'Selamat Datang Calon Siswa',
      'ppd.h': 'Bergabunglah Bersama Kami',
      'ppd.p': 'MTs Negeri 1 Kota Semarang membuka pendaftaran peserta didik baru setiap tahun ajaran. Animo pendaftar selalu tinggi — pada PPDB 2022, pendaftar melebihi kuota dalam waktu satu minggu. Segera daftarkan putra-putri Anda!',
      'ppd.c1tag': 'Jalur Reguler', 'ppd.c1t': 'Rombongan Belajar', 'ppd.c1p': 'Kuota ±352 siswa yang dibagi dalam 11 rombongan belajar (berdasarkan PPDB 2022).',
      'ppd.c2tag': 'Program', 'ppd.c2t': 'Boarding School', 'ppd.c2p': 'Tersedia jalur asrama "Idzatun Nasyi\'in" dengan kapasitas 100 santri putra & 100 santriwati.',
      'ppd.c3tag': 'Sasaran', 'ppd.c3t': 'Lulusan SD/MI', 'ppd.c3p': 'Terbuka bagi lulusan SD/MI sederajat yang memenuhi persyaratan usia dan administrasi.',
      'ppd.alur.ey': 'Langkah Pendaftaran',
      'ppd.alur.h': 'Alur Pendaftaran',
      'ppd.s1t': 'Pendaftaran & Pengisian Formulir', 'ppd.s1p': 'Mengisi formulir pendaftaran secara online atau datang langsung ke madrasah.',
      'ppd.s2t': 'Verifikasi Berkas', 'ppd.s2p': 'Melengkapi dan memverifikasi berkas persyaratan di loket pendaftaran.',
      'ppd.s3t': 'Seleksi', 'ppd.s3p': 'Mengikuti seleksi sesuai ketentuan (tes akademik/non-akademik atau seleksi berkas).',
      'ppd.s4t': 'Pengumuman & Daftar Ulang', 'ppd.s4p': 'Melihat pengumuman kelulusan dan melakukan daftar ulang sesuai jadwal.',
      'ppd.syr.tag': 'Berkas', 'ppd.syr.h': 'Persyaratan Umum',
      'ppd.syr.1': 'Fotokopi akta kelahiran / surat keterangan lahir.',
      'ppd.syr.2': 'Fotokopi Kartu Keluarga (KK).',
      'ppd.syr.3': 'Fotokopi ijazah / SKL SD/MI sederajat.',
      'ppd.syr.4': 'Pas foto terbaru (ukuran sesuai ketentuan panitia).',
      'ppd.syr.5': 'Rapor semester 1–5 (untuk jalur prestasi/rapor).',
      'ppd.syr.6': 'Sertifikat prestasi (jika ada — untuk jalur prestasi).',
      'ppd.jdw.tag': 'Jadwal', 'ppd.jdw.h': 'Jadwal Pendaftaran',
      'ppd.jdw.h1': 'Kegiatan', 'ppd.jdw.h2': 'Waktu',
      'ppd.jdw.r1': 'Pembukaan pendaftaran', 'ppd.jdw.r2': 'Verifikasi berkas', 'ppd.jdw.r3': 'Seleksi', 'ppd.jdw.r4': 'Pengumuman', 'ppd.jdw.r5': 'Daftar ulang',
      'ppd.jdw.cur': 'Tahun berjalan*',
      'ppd.jdw.note': '* Pada PPDB 2022, pendaftaran dibuka 15 Maret – 14 April. Jadwal tahun berjalan menunggu pengumuman resmi.',
      'ppd.cta.h': 'Butuh Informasi Lebih Lanjut?',
      'ppd.cta.p': 'Hubungi panitia PPDB MTs Negeri 1 Kota Semarang melalui halaman kontak atau kunjungi langsung madrasah kami.',
      'ppd.cta.btn': 'Hubungi Kami →',
      // ===== Halaman Kontak =====
      'ktk.title': 'Kontak — MTs Negeri 1 Kota Semarang',
      'ktk.desc': 'Kontak MTs Negeri 1 Kota Semarang: alamat, peta lokasi, telepon, dan email.',
      'ktk.bc': '/ Kontak',
      'ktk.h1': 'Hubungi Kami',
      'ktk.ey': 'Lokasi & Layanan',
      'ktk.h': 'Informasi Kontak',
      'ktk.addr.h': 'Alamat', 'ktk.addr.p': 'Jl. Ketileng Raya (Jl. Fatmawati),<br>Sendangmulyo, Kec. Tembalang,<br>Kota Semarang, Jawa Tengah 50272',
      'ktk.telp.h': 'Telepon', 'ktk.telp.p': '(024) 6716521',
      'ktk.mail.h': 'Email', 'ktk.mail.p': 'humas@mtsn1semarang.sch.id',
      'ktk.map.ey': 'Peta Lokasi',
      'ktk.map.h': 'Temukan Kami di Peta',
      'ktk.map.t': 'Peta lokasi MTs Negeri 1 Kota Semarang',
      'ktk.map.coord': 'Koordinat: -7.0334, 110.4677 — Plus code: XF89+J3H',
      'ktk.fm.ey': 'Pesan',
      'ktk.fm.h': 'Kirim Pesan / Pertanyaan',
      'ktk.fm.p': 'Isi formulir di bawah ini — pesan akan diteruskan melalui aplikasi email Anda (<em>mailto</em>). Anda juga dapat menghubungi kami melalui WhatsApp/telepon madrasah.',
      'ktk.fm.nama': 'Nama Lengkap', 'ktk.fm.namaph': 'Nama Anda',
      'ktk.fm.email': 'Email', 'ktk.fm.emailph': 'email@contoh.com',
      'ktk.fm.subjek': 'Subjek', 'ktk.fm.subjekph': 'Subjek pesan',
      'ktk.fm.pesan': 'Pesan', 'ktk.fm.pesanph': 'Tulis pesan Anda di sini...',
      'ktk.fm.btn': 'Kirim Pesan'
    },
    en: {
      'nav.home': 'Home', 'nav.profil': 'About', 'nav.sejarah': 'History', 'nav.visi': 'Vision & Mission',
      'nav.identitas': 'Identity', 'nav.struktur': 'Organization', 'nav.program': 'Programs', 'nav.board': 'Boarding School',
      'nav.unggulan': 'Tahfidz, Research & Science', 'nav.ekskul': 'Extracurriculars', 'nav.prestasi': 'Achievements',
      'nav.fasilitas': 'Facilities', 'nav.ppdb': 'Admissions', 'nav.kontak': 'Contact', 'nav.daftar': 'Apply Now',
      'hero.t1': 'A Great Madrasah,<br>With Dignity',
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
      'stat.4': 'Boarding Capacity', 'stat.5': 'Medals (2022)', 'stat.6': 'Accreditation',
      'stat.src': 'Source: Kanwil Kemenag Jawa Tengah & official madrasah YouTube channel.',
      'hero.prospekt': 'Prospectus (PDF)',
      'nws.src': 'News source: Kanwil Kementerian Agama Provinsi Jawa Tengah (jateng.kemenag.go.id).',
      'tea.2s': 'Dormitory Mentor',
      'tea.3s': 'Boys Scout Leader',
      'tea.4s': 'Arts Coach',
      'tea.5s': 'Arts Coach',
      'nav.berita': 'News',
      'prg.h': 'Three Pillars of Excellence', 'prg.btn': 'Learn More About Programs →',
      'png.h': 'School Announcements', 'eks.h': 'Extracurriculars & Student Life',
      'brd.h': '"Idzatun Nasyi\'in" Boarding School', 'brd.btn': 'Learn More →',
      'news.h': 'Videos & Documentation', 'news.btn': 'View All Achievements →',
      'gal.h': 'Photo Gallery', 'age.h': 'School Calendar',
      'fas.h': 'School Facilities', 'tes.h': 'What They Say',
      'tea.h': 'Teachers & Staff',
      'ppdb.h': 'New Student Admissions (PPDB)', 'ppdb.a': 'Admissions →', 'ppdb.b': 'Contact Committee',
      'newsletter.h': 'Stay Updated', 'newsletter.p': 'Subscribe for the latest activities, schedules, and announcements straight to your inbox.',
      'sticky.a': 'Apply for PPDB 2025/2026', 'footer.tag': 'Official school website, made for education.',
      'topbar.siswa': 'Students', 'topbar.ortu': 'Parents', 'topbar.alumni': 'Alumni', 'topbar.hours': 'Mon–Fri, 07.00–16.00 WIB',
      'hero.c1': 'Accreditation A', 'hero.c2': 'Public Madrasah (MoRA)', 'hero.c3': 'Kurikulum Merdeka Pilot', 'hero.c4': 'Boarding School',
      'hero.c5': 'Quran Memorization', 'hero.c6': 'Research & Inquiry', 'hero.c7': 'Science Olympiad', 'hero.c8': 'International Research & KSM',
      'hero.c9': 'Pesantren Education', 'hero.c10': 'Classical Books Study', 'hero.c11': '100 Boys + 100 Girls',
      'trust.label': 'Accredited & Recognized', 'trust.1': 'Accreditation A', 'trust.2': 'Public Madrasah', 'trust.3': 'Kurikulum Merdeka', 'trust.5': 'Boarding School',
      'why.ey': 'Excellence', 'why.h': 'Why Choose MTs Negeri 1', 'why.p': 'Reasons families entrust their children\'s education to us.',
      'why.1h': 'National Recognition', 'why.1p': 'Accreditation A and official public madrasah status that guarantee quality.',
      'why.2h': 'Dedicated Educators', 'why.2p': 'Professional teachers committed to personally guiding every student.',
      'why.3h': 'Quranic Foundation', 'why.3p': 'Islamic character and Quran memorization developed throughout daily life.',
      'why.4h': '21st-Century Skills', 'why.4p': 'Research, science, and digital literacy that prepare students for the future.',
      'why.5h': 'Modern Facilities', 'why.5p': 'Learning spaces, laboratories, mosque, and comfortable, safe dormitories.',
      'why.6h': 'Islamic & Inclusive', 'why.6p': 'A safe, caring environment that values every child\'s uniqueness.',
      'samb.ey': 'Welcome',
      'samb.p1': 'Welcome to the official website of MTs Negeri 1 Kota Semarang. We thank Allah SWT for His blessings, which allow this website to serve as a medium of information, publication, and services for the school community, parents, and the wider public.',
      'samb.p2': 'MTs Negeri 1 Kota Semarang continues to improve and is committed to becoming a great and dignified madrasah. Through our flagship tahfidz, research, and science programs, we educate students with a pesantren-style approach, instil Islamic values, and equip them with 21st-century skills ready for the challenges of our time.',
      'samb.p3': 'We thank you for your support and trust. Let us work together to raise a Quranic generation that is intelligent, noble, and accomplished.',
      'samb.kepala': 'Head of Madrasah', 'samb.quote': 'Together, let\'s raise a Quranic generation that is intelligent, noble, and accomplished.', 'samb.alamat': 'Address', 'samb.alamatv': 'Jl. Ketileng Raya (Jl. Fatmawati), Sendangmulyo, Tembalang District, Semarang 50272',
      'samb.jam': 'Office Hours', 'samb.jamv': 'Mon–Fri, 07.00–16.00 WIB (office & administration services)',
      'samb.telp': 'Phone', 'samb.telpv': '(024) 6716521 — <a href="kontak.html">see contacts</a>', 'samb.email': 'Email',
      'png.ey': 'Official Information', 'png.p': 'Latest news and announcements for the school community, parents, and the public.',
      'tag.ppdb': 'Admissions', 'tag.boarding': 'Boarding School', 'tag.akademik': 'Academics', 'tag.kegiatan': 'Activities',
      'png.1t': 'PPDB for Academic Year 2025/2026 Opens Soon', 'png.1d': 'Schedule, quota, and admission channels will be announced by the PPDB committee. Please keep following this page.',
      'png.2t': 'New Intake for "Idzatun Nasyi\'in" Boarding School', 'png.2d': 'Boarding school enrollment is open with capacity for 100 male and 100 female students.',
      'png.3t': 'Report Cards & First-Semester Holidays TP 2024/2025', 'png.3d': 'Report cards are distributed by homeroom teachers; detailed schedules are announced through each homeroom.',
      'png.4t': 'Field Trip: Audio & Video Engineering at TVRI Central Java', 'png.4d': 'Students joined a field trip on audio and video engineering at TVRI Central Java Station.',
      'prg.ey': 'Flagship Programs', 'prg.p': 'The flagship programs that make MTs Negeri 1 Kota Semarang stand out.',
      'prg.tag1': 'Program 01', 'prg.tag2': 'Program 02', 'prg.tag3': 'Program 03',
      'prg.1t': 'Quran Memorization (Tahfidzul Qur\'an)', 'prg.1d': 'Structured Quran memorization with caregiver guidance, plus classical book studies (Mabadiul Fiqhiyah, Hidatul Mustafid, Alala, and more).',
      'prg.2t': 'Research', 'prg.2d': 'Scientific research training and science enrichment, with dedicated coaching for competitions from city to international level.',
      'prg.3t': 'Science', 'prg.3d': 'Science mastery through active learning, lab practice, and olympiad training — proven by achievements in the Madrasah Science Competition (KSM) up to provincial level.',
      'prg.m1b': 'Pesantren-Style Education', 'prg.m1s': 'Character and Islamic values built into everyday life.',
      'prg.m2b': 'Kurikulum Merdeka', 'prg.m2s': 'Pilot school for the Merdeka Curriculum since 2022/2023.',
      'prg.m3b': 'Awards Across Many Arenas', 'prg.m3s': 'From city and provincial to national and international level.',
      'eks.ey': 'Talent Development', 'eks.p': 'A place to develop students\' interests, talents, and character beyond class hours.',
      'eks.1t': 'Scouting', 'eks.1d': 'Scout troop — leadership, discipline, and life skills.',
      'eks.2t': 'Paskibra', 'eks.2d': 'Flag-raising squad — marching training and discipline.',
      'eks.3t': 'Tahfidz & Recitation', 'eks.3d': 'Quran memorization, recitation, and tahsin coaching for students.',
      'eks.4t': 'Hadroh & Rebana', 'eks.4d': 'Islamic music arts as a medium of da\'wah and school pride.',
      'eks.5t': 'Futsal', 'eks.5d': 'Boys\' and girls\' futsal training for inter-school competitions.',
      'eks.6t': 'PMR (Youth Red Cross)', 'eks.6d': 'First aid, health awareness, and social action.',
      'eks.7t': 'KIR / Science Club', 'eks.7d': 'Young Researchers club and a science club for research and olympiads.',
      'eks.8t': 'Journalism & English', 'eks.8d': 'School journalism, digital wall magazine, and English club.',
      'news.ey': 'Media & Videos', 'news.p': 'Official videos from the MTs Negeri 1 Kota Semarang YouTube channel — click to watch.',
      'news.v1t': 'MTsN 1 Kota Semarang on YouTube', 'news.v1p': 'Follow our official videos, documentation, and news on our YouTube channel.',
      'news.w1': '▶ Visit Our YouTube Channel', 'news.w2': '▶ Watch on YouTube',
      'hero.film': 'Watch School Film', 'hero.filmAria': 'Play the school profile film',
      'hero.scroll': 'Explore', 'hero.scrollAria': 'Scroll down to explore',
      'media.ey': 'Media & Film', 'media.h': 'School Media Center',
      'media.p': 'Official videos from the MTs Negeri 1 Kota Semarang YouTube channel — select one to play right here.',
      'media.channel': '▶ Visit Our Official YouTube Channel',
      'media.watch': '▶ If the video does not load, open it on YouTube',
      'media.modalAria': 'Video player', 'media.closeAria': 'Close video player',
      'media.tagProfile': 'Profile', 'media.tagPPDB': 'Admissions', 'media.tagGlobal': 'Global', 'media.tagFaith': 'Faith', 'media.tagArts': 'Arts', 'media.tagMars': 'Anthem',
      'media.m1t': 'Curriculum of Love — School Profile', 'media.m1d': 'The official school profile film: the love-based curriculum, learning, and campus life.',
      'media.m2t': 'Welcome to PPDB 2025/2026', 'media.m2d': 'Our admissions promo: "The Most Suitable Madrasah for the Golden Generation" by Emtessa.',
      'media.m3t': 'MTsN 1 at an International Research Arena', 'media.m3d': 'Documentation of our students at international research competitions and exhibitions.',
      'media.m4t': '13C Challenge — MIICA Malaysia 2025', 'media.m4d': 'A creative student challenge video for the international MIICA Malaysia arena.',
      'media.m5t': 'Inauguration of Al-Karim Mosque', 'media.m5d': 'Documentation of the mosque inauguration as a center for worship and tahfidz coaching.',
      'media.m6t': 'Emtessa Music — Independence Special', 'media.m6d': 'Emtessa Music performing for Indonesia\'s Independence Day.',
      'media.m7t': 'Anthem of MTsN 1 Kota Semarang', 'media.m7d': 'The school anthem, composed by H. Kasturi, S.Ag., M.Pd.',
      'ppdb.video': '▶ Watch Admissions Video', 'vtr.playAria': 'Play the school profile film',
      'hero.note1': 'Admissions Open', 'hero.note2': 'AY 2025/2026',
      'hero.qt1': 'Accreditation', 'hero.qt2': 'Student Seats', 'hero.qt3': 'Medals (2022)',
      'hero.apply': 'Apply Now →', 'hero.visit': 'Book a Campus Tour',
      'path.ey': 'Global Engagement', 'path.h': 'From Semarang, Shining on the World Stage',
      'path.p': 'A network of achievement and global opportunity for our students — from international competitions to continuing studies at top schools.',
      'path.1t': 'International Research', 'path.1d': 'Silver medal at RARE ICON (IFPRI) 2022 — competing on the international research stage.',
      'path.2t': 'ASEAN Collaboration', 'path.2d': '13C Challenge — MIICA Malaysia 2025: creative collaboration across borders.',
      'path.3t': 'National Competitions', 'path.3d': 'Madrasah Science Competition (KSM) up to provincial and national levels.',
      'path.4t': 'Bright Academic Futures', 'path.4d': 'Alumni go on to MAN Insan Cendekia, top madrasah aliyah/senior high schools, and renowned boarding schools.',
      'path.more': 'See More →',
      'keb.title': 'Privacy Policy — MTs Negeri 1 Kota Semarang', 'keb.desc': 'Privacy policy and terms of use of the official website of MTs Negeri 1 Kota Semarang.',
      'keb.bc': '/ Privacy Policy', 'keb.h1': 'Privacy Policy & Terms',
      'keb.note': 'Note:', 'keb.notep': 'This document explains how we manage data and the terms of use of the official website of MTs Negeri 1 Kota Semarang. Policy changes will be announced on this page.',
      'keb.1h': '1. Privacy & Personal Data', 'keb.1p': 'This website uses personal data you voluntarily provide (name, email, phone) through contact forms, registration, or newsletter. Data is used only for communication, admissions information, and school services — never sold or shared with third parties without consent.',
      'keb.2h': '2. Cookies & Local Storage', 'keb.2p': 'This site uses local storage on your device for user preferences (light/dark theme, language, and academic calendar). We do not use third-party tracking cookies.',
      'keb.3h': '3. Copyright & Content', 'keb.3p': 'All content — text, photos, logos, videos, and the school anthem — belongs to MTs Negeri 1 Kota Semarang and the Ministry of Religious Affairs of the Republic of Indonesia. Reuse for publication must credit the source.',
      'keb.4h': '4. Disclaimer', 'keb.4p': 'Information on this site is prepared with care and updated regularly. Admissions schedules, quotas, and policies follow the official announcements of the school committee and the Ministry of Religious Affairs.',
      'keb.5h': '5. Contact', 'keb.5p': 'Questions about this policy can be sent to humas@mtsn1semarang.sch.id or through the official contact page.',
      'ft.l5': 'Privacy Policy',
      'cookie.txt': 'We use local storage to make this site work optimally (theme, language, calendar preferences).', 'cookie.btn': 'Got It',
      'news.v2t': 'Al-Karim Mosque Inauguration at MTsN 1 Kota Semarang', 'news.v2p': 'Documentation of the mosque inauguration as a center for worship and tahfidz coaching.',
      'news.v3t': 'MTsN 1 Kota Semarang at an International Research Competition', 'news.v3p': 'Our students\' participation in research competitions and exhibitions at international level.',
      'nws.h': 'Stories, News & Achievements', 'nws.p': 'Latest news and accomplishments of MTs Negeri 1 Kota Semarang.',
      'nws.1t': 'Student Selected for Indonesia U-15 National Team', 'nws.1p': 'A ninth-grade student passed the Indonesia U-15 national team selection and is heading to Portugal.', 'nws.1d': '6 Sep 2023 · National',
      'trust.4': 'International Research',
      'trust.4s': 'Silver medal at RARE ICON (IFPRI) 2022',
      'nws.2d': '29 Mar 2022 · National',
      'nws.3d': '8 Feb 2022 · Facilities',
      'nws.4d': '4 Jun 2022 · International',
      'nws.5d': '11 Jun 2022 · District',
      'nws.6d': '25 Mar 2022 · Alumni',
      'nws.2t': '132 Medals from 10 Competitions', 'nws.2p': 'Our best students contributed 132 medals across 10 science and olympiad competitions.',
      'nws.3t': 'SBSN Building Inaugurated by the Minister of Religious Affairs', 'nws.3p': 'A new school building built under the SBSN scheme was inaugurated to support learning.',
      'nws.4t': 'Medali Perak Riset Internasional (RARE ICON)', 'nws.4p': 'Research on toothpaste from tangerine peel won an international silver medal at RARE ICON 2022.',
      'nws.5t': '1st Place in Scout Quiz Competition (Kwartir Level)', 'nws.5p': 'Our scout team won first place in the fast-and-accurate scout quiz at the district level.',
      'nws.6t': 'Alumni Admitted to MAN Insan Cendekia & MAN PK', 'nws.6p': 'Students were admitted to MAN Insan Cendekia (Pekalongan, Pasuruan) and MAN Program Keagamaan Surakarta.',
      'nws.btn': 'View All News →',
      'brt.title': 'News — MTs Negeri 1 Kota Semarang',
      'brt.bc': '/ News',
      'brt.h1': 'School News',
      'brt.ey': 'Newsroom',
      'brt.h2': 'Latest News, Activities & Achievements',
      'brt.p': 'News shown here is sourced from official releases by the Regional Office of the Ministry of Religious Affairs, Central Java, and the official madrasah YouTube channel.',
      'brt.src': 'Source: Regional Office of the Ministry of Religious Affairs, Central Java (jateng.kemenag.go.id) — click a title to read the full release.',
      'brt.prestasi': 'View All Achievements →',
      'brt.cta.h': 'Follow School News',
      'brt.cta.p': 'Get the latest updates on activities, achievements, and admissions straight from official school sources.',
      'brt.cta.btn': 'PPDB Info →',
      'vtr.tag': 'Campus Experience', 'vtr.h': 'Explore Our Campus', 'vtr.p': 'Watch a virtual tour of our campus, facilities, and daily life at Idzatun Nasyi\'in Boarding School — from anywhere.',
      'vtr.b1': 'Watch Video →', 'vtr.b2': 'Visit Us',
      'gal.ey': 'Documentation', 'gal.p': 'Snapshots of life and activities at MTs Negeri 1 Kota Semarang.',
      'gal.1': 'Official School Documentation', 'gal.2': 'Al-Karim Mosque Inauguration', 'gal.3': 'Student Activities & Works', 'gal.4': 'Love-Based Curriculum',
      'gal.5': 'LKBB & Paskibra', 'gal.6': 'Boarding School', 'gal.7': 'School Anthem (Mars)', 'gal.8': 'International Research Competition',
      'age.ey': 'School Calendar', 'age.p': 'Academic calendar 2026/2027 — schedules for activities, exams, and school holidays. Click a date for details.',
      'cal.note': '*) Based on the Madrasah Education Calendar (KMA) & official school policy — religious dates are approximate (hisab) pending the official MoRA decree.',
      'tes.ey': 'Testimonials', 'tes.p': 'Experiences of parents, alumni, and students with MTs Negeri 1 Kota Semarang.',
      'tes.1q': 'My child is happy here and has become more disciplined, and loves reading the Qur\'an. The boarding school program really supports character building.',
      'tes.1b': 'Parent of a Boarding Student', 'tes.1s': 'Parent of a boarding student',
      'tes.2q': 'The research and science coaching here equipped me well. I was accepted into MAN Insan Cendekia thanks to the olympiad and KIR experience I gained here.',
      'tes.2b': 'Alumnus of MTsN 1 Kota Semarang', 'tes.2s': 'Accepted at MAN Insan Cendekia',
      'tes.3q': 'I\'m proud to be part of the research team\'s win at an international event. The teachers here are very supportive in guiding our research ideas.',
      'tes.3b': 'Grade IX Student', 'tes.3s': 'RARE ICON 2022 Silver Medal',
      'tea.ey': 'Educators & Staff', 'tea.p': 'Professional and dedicated educators supporting every student.',
      'tea.1p': 'Head of Madrasah', 'tea.1s': 'Fiqh & Islamic Studies',
      'tea.2h': 'M. Fajar Anshari', 'tea.2p': 'Head of Boarding School',
      'tea.3h': 'Saptono', 'tea.3p': 'Scout Mentor',
      'tea.4h': 'Agus Prapto Sukoco', 'tea.4p': 'Arts & Choir Teacher',
      'tea.5h': 'Agus Trisnoto', 'tea.5p': 'Arts & Choir Teacher',
      'tea.6h': 'Other Educators', 'tea.6p': 'Teachers & Staff',
      'tea.badge': 'Official info coming soon', 'tea.note': 'Photos and names of other educators are being validated against official school records.',
      'fas.ey': 'Facilities', 'fas.p': 'Facilities that support learning and student comfort.',
      'fas.1t': 'Buildings & Campus', 'fas.1p': 'The school buildings and campus — including the SBSN building inaugurated by the Minister of Religious Affairs.',
      'fas.2t': 'Classrooms & Activity Spaces', 'fas.2p': 'Classrooms, halls, and activity areas for active learning.',
      'fas.3t': 'Kurikulum Merdeka', 'fas.3p': 'Pilot school for the Merdeka Curriculum since 2022/2023.',
      'fas.4t': 'Mosque & Worship', 'fas.4p': 'Al-Karim Mosque and worship facilities for tahfidz and classical book studies.',
      'fas.more': 'Learn More →', 'fas.btn': 'View All Facilities →',
      'faq.ey': 'Help Center', 'faq.h': 'Frequently Asked Questions', 'faq.p': 'Quick answers to common questions about admissions and school life.',
      'faq.1q': 'How do I apply for admission (PPDB)?', 'faq.1a': 'Apply through the official channels announced by the PPDB committee on this page. Detailed schedule, quota, and documents will follow from the school.',
      'faq.2q': 'Is the tahfidz program available to all students?', 'faq.2a': 'Yes. Quran memorization is one of our flagship programs, structured with classical book studies and caregiver support.',
      'faq.3q': 'How does the Idzatun Nasyi\'in Boarding School work?', 'faq.3a': 'The dormitory is managed independently by the school with a pesantren-style education — Quran memorization, classical book studies, and daily character building. Capacity: 100 boys and 100 girls.',
      'faq.4q': 'What flagship programs are available besides tahfidz?', 'faq.4a': 'Research and Science. Students are coached for competitions from city to international level, including KSM and international research.',
      'faq.5q': 'Can I visit the school?', 'faq.5a': 'Of course. See the Contact & Location page for the address, map, and office hours (Monday–Friday, 07.00–16.00 WIB).',
      'lb.h': 'Related Links', 'lb.p': 'Official government & Ministry of Religious Affairs portals.',
      'ppdb.p': 'Join us! Become part of the MTs Negeri 1 Kota Semarang family with our flagship tahfidz, research, and science programs.',
      'nl.btn': 'Subscribe', 'nl.placeholder': 'Your email address…',
      'ft.about': 'MTs Negeri 1 Kota Semarang',
      'ft.aboutp': 'A public Islamic junior high school under Indonesia\'s Ministry of Religious Affairs, committed to raising a Quranic, intelligent, and accomplished generation through its flagship tahfidz, research, and science programs.',
      'ft.q': 'Quick Links', 'ft.q1': 'School Profile', 'ft.q2': 'Flagship Programs', 'ft.q3': 'Achievements', 'ft.q4': 'Facilities', 'ft.q5': 'Admissions (PPDB)',
      'ft.l': 'Services', 'ft.l1': 'Contact Us', 'ft.l2': 'Student Admission', 'ft.l3': 'Organization Structure', 'ft.l4': 'School Location',
      'ft.k': 'Contact', 'ft.k1': 'Jl. Ketileng Raya (Jl. Fatmawati), Sendangmulyo, Tembalang District, Semarang, Central Java 50272', 'ft.k2': '(024) 6716521',
      'ft.cred': '<b>Accreditation A</b>&nbsp;·&nbsp;Public Madrasah (MoRA)&nbsp;·&nbsp;Kurikulum Merdeka Pilot&nbsp;·&nbsp;International Research',
      // ===== Search & accessibility =====
      'search.ph': 'Search: PPDB, tahfidz, boarding, achievements…',
      'search.btn': 'Search',
      'search.overlayAria': 'Site search',
      'search.closeAria': 'Close search',
      'search.inputAria': 'Search keywords',
      'search.hint': 'Type a keyword, e.g. <b>PPDB</b>, <b>tahfidz</b>, <b>boarding</b>, or <b>achievements</b>.',
      'search.empty': 'No results found for \u201c{q}\u201d. Try a different keyword.',
      'searchBtn.aria': 'Search site',
      'searchBtn.title': 'Search (Ctrl+K)',
      'themeBtn.aria': 'Toggle light/dark theme',
      'themeBtn.title': 'Theme',
      'navToggle.aria': 'Open menu',
      'toTop.aria': 'Back to top',
      'wa.aria': 'Contact us',
      'lb.dialog': 'Gallery view',
      'lb.close': 'Close',
      'lb.prev': 'Previous',
      'lb.next': 'Next',
      'nl.thanks': 'Thank you! Your email has been recorded.',
      'cal.agenda': 'Agenda',
      'cal.onDate': 'Activity on {d}',
      'cal.pickDate': 'Select a date or view all events this month',
      'cal.none': 'No events this month.',
      // ===== Achievements page =====
      'pst.title': 'Achievements — MTs Negeri 1 Kota Semarang',
      'pst.desc': 'Achievements of MTs Negeri 1 Kota Semarang: International Research Silver Medal (RARE ICON), 132 medals, KSM, Scout LCTP, and more.',
      'pst.bc': '/ Achievements',
      'pst.h1': 'School Achievements',
      'pst.ey': 'Our Pride',
      'pst.h2': 'Achievements from City to International Level',
      'pst.p': 'MTs Negeri 1 Kota Semarang consistently earns achievements — academic and non-academic — that bring honor to the city of Semarang at national and international levels.',
      'pst.t1': 'Field Trip: Audio & Video Engineering',
      'pst.d1': 'Students learned audio and video engineering directly at TVRI Central Java Station (December 2024).',
      'pst.s1': 'Source: tvri.go.id',
      'pst.t2': 'A Child-Friendly Madrasah Commitment',
      'pst.d2': 'MTsN 1 Kota Semarang is committed to creating a child-friendly madrasah that is safe and comfortable for all students.',
      'pst.s2': 'Source: Suara Merdeka, March 2023',
      'pst.t3': 'Three Students Advance in the Provincial KSM',
      'pst.d3': 'Three students represented Semarang City in the 2023 Madrasah Science Competition (KSM) at the provincial level.',
      'pst.s3': 'Source: Kemenag Central Java, July 2023',
      'pst.t4': '1st Place in Scout LCTP at Kwartir Level',
      'pst.d4': 'The scout team won 1st place in the fast-and-accurate scout quiz (LCTP) at the district (kwartir) level and is ready to advance to the city level.',
      'pst.s4': 'Source: Kemenag Central Java, June 2022',
      'pst.t5': 'Badminton Champion at South Jakarta PBSI',
      'pst.d5': 'A student of MTs Negeri 1 Kota Semarang won the badminton championship at the South Jakarta PBSI tournament.',
      'pst.s5': 'Source: Kemenag Central Java, July 2022',
      'pst.t6': 'Graduates Accepted at Prestigious MAN Schools',
      'pst.d6': 'Students were accepted into elite national boarding-based madrasahs: MAN Insan Cendekia (IC), MAN Religious Program (PK), and MAKN via SNPDB.',
      'pst.s6': 'Source: Kemenag Central Java, 2022',
      'pst.t7': 'International Research Silver Medal (RARE ICON)',
      'pst.d7': 'The research team won an international silver medal at RARE ICON 2022 (IFPRI) through research on toothpaste from tangerine peel.',
      'pst.s7': 'Source: Kemenag Central Java, February 2021',
      'pst.cta.h': 'Want Your Child to Achieve?',
      'pst.cta.p': 'Join a madrasah proven to produce champions at the national and international level.',
      'pst.cta.btn': 'Admissions Info →',
      // ===== Profile page =====
      'prf.title': 'Profile — MTs Negeri 1 Kota Semarang',
      'prf.desc': 'Profile of MTs Negeri 1 Kota Semarang: history, vision and mission, school identity, and organization structure.',
      'prf.bc': '/ About',
      'prf.h1': 'School Profile',
      'prf.sej.ey': 'About Us',
      'prf.sej.h': 'Brief History',
      'prf.sej.p1': '<strong style="color:var(--green-800);">MTs Negeri 1 Kota Semarang</strong> is a public Islamic junior high school (madrasah tsanawiyah) located on Jalan Ketileng Raya (Jalan Fatmawati), Sendangmulyo Village, Tembalang District, Semarang City. As a public madrasah, all aspects of its education are under the auspices of the Ministry of Religious Affairs of the Republic of Indonesia.',
      'prf.sej.p2': 'The madrasah is known as one of the most sought-after schools in Semarang, with high demand every year. In the 2022 admission (PPDB), the quota of 352 students for 11 study groups was filled within a short time — in fact, applicants exceeded the available quota. This is thanks to its many achievements at the city, provincial, national, and international levels, as well as its flagship boarding school program.',
      'prf.sej.p3': 'On 7 February 2022, the SBSN (State Sharia Securities) building of MTs Negeri 1 Kota Semarang was officially inaugurated by the Minister of Religious Affairs — a source of pride for the entire school community and the people of Semarang. Since the 2022/2023 academic year, the madrasah has also been designated as a <em>pilot</em> school for the Implementation of the Merdeka Curriculum (IKM).',
      'prf.vm.ey': 'Direction & Goals',
      'prf.vm.h': 'Vision & Mission',
      'prf.visi.tag': 'Vision',
      'prf.visi.h': 'The Realization of a Great and Dignified Madrasah',
      'prf.visi.p': 'Raising a Quranic generation that is faithful, devout, noble in character, intelligent, skilled, and able to compete in the global era without abandoning Islamic and Indonesian values.',
      'prf.misi.tag': 'Mission',
      'prf.misi.h': 'Steps Toward the Vision',
      'prf.misi.1': 'Organize education that integrates religious and general knowledge.',
      'prf.misi.2': 'Develop flagship programs in tahfidz, research, and science.',
      'prf.misi.3': 'Nurture students with pesantren-style education through the boarding school.',
      'prf.misi.4': 'Foster a culture of literacy, research, and love of knowledge.',
      'prf.misi.5': 'Develop students\' potential and talents through extracurricular activities.',
      'prf.misi.6': 'Create a safe and comfortable child-friendly madrasah.',
      'prf.misi.7': 'Build partnerships with parents and the community.',
      'prf.id.ey': 'Key Data',
      'prf.id.h': 'School Identity',
      'prf.id.nama': 'School Name',
      'prf.id.namav': 'MTs Negeri 1 Kota Semarang',
      'prf.id.status': 'Status',
      'prf.id.statusv': 'Public (Ministry of Religious Affairs)',
      'prf.id.jenjang': 'Level',
      'prf.id.jenjangv': 'Islamic Junior High School (equivalent to junior high school)',
      'prf.id.alamat': 'Address',
      'prf.id.alamatv': 'Jl. Ketileng Raya (Jl. Fatmawati), Sendangmulyo, Tembalang District, Semarang, Central Java 50272',
      'prf.id.kec': 'District',
      'prf.id.kecv': 'Tembalang',
      'prf.id.kota': 'City',
      'prf.id.kotav': 'Semarang City, Central Java',
      'prf.id.koordinat': 'Coordinates',
      'prf.id.koordinatv': '-7.0334, 110.4677',
      'prf.id.akreditasi': 'Accreditation',
      'prf.id.akrednote': '(to be verified)',
      'prf.id.npsn': 'NPSN / NSM',
      'prf.id.npsnnote': '(not yet available — please fill in)',
      'prf.id.kepala': 'Head of Madrasah',
      'prf.id.kepalav': 'H. Kasturi, S.Ag., M.Pd.',
      'prf.id.kepalanote': '(as of 2022–2023, please update)',
      'prf.id.kurikulum': 'Curriculum',
      'prf.id.kurikulumv': 'Implementation of the Merdeka Curriculum (pilot madrasah)',
      'prf.str.ey': 'Organization',
      'prf.str.h': 'Organization Structure',
      'prf.str.p': 'School management framework (draft — please adjust to actual conditions).',
      'prf.str.kepala': 'Head of Madrasah',
      'prf.str.kur': 'Vice Principal for Curriculum',
      'prf.str.kurp': 'Learning planning & implementation',
      'prf.str.kes': 'Vice Principal for Student Affairs',
      'prf.str.kesp': 'Student guidance & discipline',
      'prf.str.sar': 'Vice Principal for Facilities',
      'prf.str.sarp': 'School facilities & infrastructure',
      'prf.str.hum': 'Vice Principal for Public Relations',
      'prf.str.hump': 'Public relations & publications',
      'prf.str.tu': 'Head of Administration',
      'prf.str.tup': 'Administration & correspondence services',
      'prf.str.bs': 'Head of Boarding School',
      'prf.str.bsp': 'Management of the Idzatun Nasyi\'in dormitory',
      'prf.vid.ey': 'Multimedia',
      'prf.vid.h': 'School Profile Video',
      'prf.vid.p': 'Explore MTs Negeri 1 Kota Semarang through our promotional video and virtual tour.',
      'prf.vid.cap': 'Informational video of MTs Negeri 1 Kota Semarang (official school channel).',
      'prf.vid.iframeTitle': 'Profile Video of MTs Negeri 1 Kota Semarang',
      // ===== Programs page =====
      'pro.title': 'Programs — MTs Negeri 1 Kota Semarang',
      'pro.desc': 'Flagship programs of MTs Negeri 1 Kota Semarang: Idzatun Nasyi\'in Boarding School, Quran Memorization (Tahfidzul Qur\'an), Research, and Science.',
      'pro.bc': '/ Programs',
      'pro.h1': 'School Programs',
      'pro.bs.ey': 'Main Excellence',
      'pro.bs.h': 'Idzatun Nasyi\'in Boarding School',
      'pro.bs.p': 'A pesantren-style education run independently by the madrasah — combining the madrasah curriculum with Quran memorization and classical book studies.',
      'pro.fak.tag': 'Facts',
      'pro.fak.h': 'Boarding School Profile',
      'pro.fak.1': 'Name: <strong>Idzatun Nasyi\'in</strong> — inaugurated by KH. Haris Shadaqah, caretaker of Al-Itqan Islamic boarding school, Bugen Bangetayu, Semarang.',
      'pro.fak.2': 'Operational start: <strong>1 February 2022</strong>.',
      'pro.fak.3': 'Capacity: <strong>100 male students</strong> and <strong>100 female students</strong>.',
      'pro.fak.4': 'Managed independently by the madrasah (no partnership with external parties).',
      'pro.fak.5': 'Regular learning: Quran memorization and classical book studies.',
      'pro.kit.tag': 'Classical Books',
      'pro.kit.h': 'Books Studied',
      'pro.kit.1': 'Kitab <strong>Mabadiul Fiqhiyah</strong> (basics of fiqh)',
      'pro.kit.2': 'Kitab <strong>Hidatul Mustafid</strong> (tajwid science)',
      'pro.kit.3': 'Kitab <strong>Alala</strong> (etiquette of seeking knowledge)',
      'pro.kit.4': 'Kitab <strong>Safinatun Naja</strong> (fiqh of worship)',
      'pro.kit.5': 'Kitab <strong>Akhlakul Lil Banin</strong> (character)',
      'pro.ug.ey': 'Flagship Programs',
      'pro.ug.h': 'Tahfidz, Research & Science',
      'pro.ug.p': 'The three pillars of excellence that make MTs Negeri 1 Kota Semarang stand out.',
      'pro.tag1': 'Program 1', 'pro.tag2': 'Program 2', 'pro.tag3': 'Program 3',
      'pro.t1': 'Quran Memorization (Tahfidzul Qur\'an)',
      'pro.l1a': 'Leveled, measurable Quran memorization coaching.',
      'pro.l1b': 'Regular memorization submissions to tahfidz caregivers/teachers.',
      'pro.l1c': 'Scheduled muraja\'ah (memorization review).',
      'pro.l1d': 'For boarding students: 24-hour supervision at the dormitory.',
      'pro.t2': 'Research',
      'pro.l2a': 'Scientific research method training from an early age.',
      'pro.l2b': 'Dedicated coaching to prepare for research competitions.',
      'pro.l2c': 'Scientific presentation practice in foreign languages.',
      'pro.l2d': 'Proven by an international research silver medal (RARE ICON 2022).',
      'pro.t3': 'Science',
      'pro.l3a': 'Active, practice-based science learning.',
      'pro.l3b': 'Science olympiad coaching (KSM, KSN, and others).',
      'pro.l3c': 'Enrichment for non-boarding students is also provided.',
      'pro.l3d': 'Graduates accepted at elite MAN schools (MAN IC, MAN PK, MAKN).',
      'pro.eks.ey': 'Self-Development',
      'pro.eks.h': 'Extracurriculars',
      'pro.eks.p': 'A place to develop students\' talents, interests, and character.',
      'pro.e1t': 'Religious', 'pro.e1s': 'Recitation, tahfidz, hadroh, calligraphy',
      'pro.e2t': 'Sports', 'pro.e2s': 'Futsal, badminton, volleyball, athletics',
      'pro.e3t': 'Science', 'pro.e3s': 'KIR, science olympiads, robotics',
      'pro.e4t': 'Arts', 'pro.e4s': 'Music, theater, fine arts',
      'pro.e5t': 'Scouting', 'pro.e5s': 'Scouting & LCTP',
      'pro.e6t': 'Journalism', 'pro.e6s': 'Journalism, multimedia, videography',
      'pro.e7t': 'Languages', 'pro.e7s': 'English club, Arabic club',
      'pro.e8t': 'PMR', 'pro.e8s': 'Youth Red Cross & UKS',
      'pro.cta.h': 'Interested in Joining?',
      'pro.cta.p': 'Register your children to be part of the MTs Negeri 1 Kota Semarang family.',
      'pro.cta.btn': 'Admissions Info →',
      // ===== Facilities page =====
      'fsl.title': 'Facilities — MTs Negeri 1 Kota Semarang',
      'fsl.desc': 'Facilities of MTs Negeri 1 Kota Semarang: SBSN building, classrooms, laboratories, library, mosque, and boarding dormitories.',
      'fsl.bc': '/ Facilities',
      'fsl.h1': 'School Facilities',
      'fsl.ey': 'Facilities & Infrastructure',
      'fsl.h': 'A Comfortable Learning Environment',
      'fsl.p': 'MTs Negeri 1 Kota Semarang keeps improving — including the SBSN building inaugurated by the Minister of Religious Affairs in 2022, plus new arrangements of school rooms and grounds.',
      'fsl.tag1': 'Building', 'fsl.t1': 'SBSN Building', 'fsl.p1': 'A new classroom building funded by State Sharia Securities (SBSN), officially inaugurated by the Minister of Religious Affairs on 7 February 2022.',
      'fsl.tag2': 'Learning', 'fsl.t2': 'Classrooms', 'fsl.p2': 'Adequate classrooms for 11 study groups, supported by new room arrangements for comfortable learning.',
      'fsl.tag3': 'Science', 'fsl.t3': 'Laboratories', 'fsl.p3': 'Science laboratories supporting the flagship science and research programs, lab practice, and olympiad coaching.',
      'fsl.tag4': 'Literacy', 'fsl.t4': 'Library', 'fsl.p4': 'A literacy center with textbooks, Islamic books, and enrichment reading to foster a reading culture.',
      'fsl.tag5': 'Worship', 'fsl.t5': 'Mosque / Prayer Room', 'fsl.p5': 'Worship facilities for congregational prayer habits, religious activities, and tahfidz & classical book coaching.',
      'fsl.tag6': 'Boarding', 'fsl.t6': 'Boarding School Dormitories', 'fsl.p6': 'Boys\' and girls\' dormitories of "Idzatun Nasyi\'in", each with capacity for 100 students, for a pesantren-style education.',
      'fsl.tag7': 'Health', 'fsl.t7': 'UKS & Health', 'fsl.p7': 'A School Health Unit with supervising staff and first-aid supplies to serve student health.',
      'fsl.tag8': 'Sports', 'fsl.t8': 'Sports Field', 'fsl.p8': 'Grounds and fields for sports, ceremonies, and group exercise — supporting badminton and other sporting achievements.',
      'fsl.tag9': 'Technology', 'fsl.t9': 'Computer & Multimedia Lab', 'fsl.p9': 'Information technology and multimedia learning facilities — students even learn audio-video engineering at TVRI Central Java.',
      'fsl.cta.h': 'See Our School in Person',
      'fsl.cta.p': 'Visit MTs Negeri 1 Kota Semarang and experience its learning environment. See the location map on the contact page.',
      'fsl.cta.btn': 'View Location →',
      // ===== PPDB page =====
      'ppd.title': 'Admissions (PPDB) — MTs Negeri 1 Kota Semarang',
      'ppd.desc': 'New Student Admission (PPDB) information for MTs Negeri 1 Kota Semarang: registration process, schedule, and requirements.',
      'ppd.bc': '/ Admissions',
      'ppd.h1': 'New Student Admissions',
      'ppd.ey': 'Welcome, Prospective Students',
      'ppd.h': 'Join Us',
      'ppd.p': 'MTs Negeri 1 Kota Semarang opens new student admissions every academic year. Demand is always high — in PPDB 2022, applicants exceeded the quota within one week. Register your children now!',
      'ppd.c1tag': 'Regular Track', 'ppd.c1t': 'Study Groups', 'ppd.c1p': 'A quota of ±352 students divided across 11 study groups (based on PPDB 2022).',
      'ppd.c2tag': 'Program', 'ppd.c2t': 'Boarding School', 'ppd.c2p': 'A boarding track "Idzatun Nasyi\'in" is available with capacity for 100 male and 100 female students.',
      'ppd.c3tag': 'Target', 'ppd.c3t': 'SD/MI Graduates', 'ppd.c3p': 'Open to SD/MI graduates (or equivalent) who meet the age and administrative requirements.',
      'ppd.alur.ey': 'Registration Steps',
      'ppd.alur.h': 'Registration Process',
      'ppd.s1t': 'Registration & Form Filling', 'ppd.s1p': 'Fill in the registration form online or come directly to the school.',
      'ppd.s2t': 'Document Verification', 'ppd.s2p': 'Complete and verify the required documents at the registration counter.',
      'ppd.s3t': 'Selection', 'ppd.s3p': 'Take part in selection per the rules (academic/non-academic tests or document-based selection).',
      'ppd.s4t': 'Announcement & Re-registration', 'ppd.s4p': 'Check the results and complete re-registration according to schedule.',
      'ppd.syr.tag': 'Documents', 'ppd.syr.h': 'General Requirements',
      'ppd.syr.1': 'Photocopy of birth certificate / birth statement letter.',
      'ppd.syr.2': 'Photocopy of Family Card (KK).',
      'ppd.syr.3': 'Photocopy of SD/MI diploma / SKL (or equivalent).',
      'ppd.syr.4': 'Recent photo (size per committee rules).',
      'ppd.syr.5': 'Report cards semester 1–5 (for the achievement/report-card track).',
      'ppd.syr.6': 'Achievement certificates (if any — for the achievement track).',
      'ppd.jdw.tag': 'Schedule', 'ppd.jdw.h': 'Registration Schedule',
      'ppd.jdw.h1': 'Activity', 'ppd.jdw.h2': 'Time',
      'ppd.jdw.r1': 'Registration opens', 'ppd.jdw.r2': 'Document verification', 'ppd.jdw.r3': 'Selection', 'ppd.jdw.r4': 'Announcement', 'ppd.jdw.r5': 'Re-registration',
      'ppd.jdw.cur': 'Current year*',
      'ppd.jdw.note': '* In PPDB 2022, registration was open from 15 March to 14 April. The current year\'s schedule awaits the official announcement.',
      'ppd.cta.h': 'Need More Information?',
      'ppd.cta.p': 'Contact the PPDB committee of MTs Negeri 1 Kota Semarang via the contact page or visit our school directly.',
      'ppd.cta.btn': 'Contact Us →',
      // ===== Contact page =====
      'ktk.title': 'Contact — MTs Negeri 1 Kota Semarang',
      'ktk.desc': 'Contact MTs Negeri 1 Kota Semarang: address, location map, phone, and email.',
      'ktk.bc': '/ Contact',
      'ktk.h1': 'Contact Us',
      'ktk.ey': 'Location & Services',
      'ktk.h': 'Contact Information',
      'ktk.addr.h': 'Address', 'ktk.addr.p': 'Jl. Ketileng Raya (Jl. Fatmawati),<br>Sendangmulyo, Tembalang District,<br>Semarang, Central Java 50272',
      'ktk.telp.h': 'Phone', 'ktk.telp.p': '(024) 6716521',
      'ktk.mail.h': 'Email', 'ktk.mail.p': 'humas@mtsn1semarang.sch.id',
      'ktk.map.ey': 'Location Map',
      'ktk.map.h': 'Find Us on the Map',
      'ktk.map.t': 'Map of MTs Negeri 1 Kota Semarang',
      'ktk.map.coord': 'Coordinates: -7.0334, 110.4677 — Plus code: XF89+J3H',
      'ktk.fm.ey': 'Message',
      'ktk.fm.h': 'Send a Message / Question',
      'ktk.fm.p': 'Fill in the form below — your message will be forwarded through your email application (<em>mailto</em>). You can also reach us via WhatsApp/school phone.',
      'ktk.fm.nama': 'Full Name', 'ktk.fm.namaph': 'Your name',
      'ktk.fm.email': 'Email', 'ktk.fm.emailph': 'email@example.com',
      'ktk.fm.subjek': 'Subject', 'ktk.fm.subjekph': 'Message subject',
      'ktk.fm.pesan': 'Message', 'ktk.fm.pesanph': 'Write your message here...',
      'ktk.fm.btn': 'Send Message'
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
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-ph');
      const map = I18N[l] || I18N.id;
      if (map[key] !== undefined) el.setAttribute('placeholder', map[key]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-aria');
      const map = I18N[l] || I18N.id;
      if (map[key] !== undefined) el.setAttribute('aria-label', map[key]);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-title');
      const map = I18N[l] || I18N.id;
      if (map[key] !== undefined) el.setAttribute('title', map[key]);
    });
    document.querySelectorAll('[data-i18n-meta]').forEach(function (el) {
      const key = el.getAttribute('data-i18n-meta');
      const map = I18N[l] || I18N.id;
      if (map[key] !== undefined) el.setAttribute('content', map[key]);
    });
    if (window.__forceSearch) window.__forceSearch();
    if (window.__calRender) window.__calRender();
    if (window.__cdTick) window.__cdTick();
    if (window.__mediaSync) window.__mediaSync();
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
    const EVENTS = {
      id: [
        { d: '2026-07-13', t: 'Awal Tahun Pelajaran 2026/2027 & MPLS', c: 'Akademik', p: 'Hari pertama masuk dan Masa Pengenalan Lingkungan Sekolah bagi kelas VII.' },
        { d: '2026-07-20', t: 'Pembinaan Tahfidz & Ekstrakurikuler Dimulai', c: 'Kesiswaan', p: 'Pembinaan tahfidz, riset, sains, dan ekstrakurikuler berjalan penuh.' },
        { d: '2026-08-17', t: 'Upacara HUT ke-81 Kemerdekaan RI', c: 'Kesiswaan', p: 'Upacara bendera memperingati hari kemerdekaan Republik Indonesia.' },
        { d: '2026-08-26', t: 'Peringatan Maulid Nabi Muhammad SAW 1448 H', c: 'Keagamaan', p: 'Kegiatan keagamaan bersama seluruh warga madrasah (perkiraan hisab).' },
        { d: '2026-09-28', t: 'Penilaian Sumatif Tengah Semester Ganjil', c: 'Akademik', p: 'Penilaian sumatif tengah semester ganjil untuk kelas VII–IX.' },
        { d: '2026-10-22', t: 'Peringatan Hari Santri Nasional', c: 'Keagamaan', p: 'Apel Hari Santri dan rangkaian kegiatan keagamaan.' },
        { d: '2026-12-01', t: 'Penilaian Akhir Semester (PAS) Ganjil', c: 'Akademik', p: 'Ujian akhir semester ganjil untuk seluruh jenjang kelas VII–IX.' },
        { d: '2026-12-18', t: 'Pembagian Rapor Semester Ganjil', c: 'Akademik', p: 'Rapor semester ganjil TP 2026/2027 dibagikan oleh wali kelas.' },
        { d: '2026-12-21', t: 'Libur Semester Ganjil TP 2026/2027', c: 'Akademik', p: 'Libur akhir semester ganjil menuju semester genap.' },
        { d: '2027-01-04', t: 'Awal Semester Genap TP 2026/2027', c: 'Akademik', p: 'Hari pertama masuk semester genap 2026/2027.' },
        { d: '2027-01-08', t: 'Peringatan Isra Mikraj 1448 H', c: 'Keagamaan', p: 'Peringatan Isra Mikraj Nabi Muhammad SAW (perkiraan hisab).' },
        { d: '2027-02-01', t: 'Penerimaan Santri Baru Boarding "Idzatun Nasyi\'in"', c: 'Kesiswaan', p: 'Pendaftaran santri baru asrama putra dan putri dibuka.' },
        { d: '2027-03-09', t: 'Awal Ramadhan 1448 H (prakiraan)', c: 'Keagamaan', p: 'Awal bulan suci Ramadhan — jadwal mengikuti ketetapan Kemenag RI.' },
        { d: '2027-03-15', t: 'Pesantren Ramadhan & Tadarus', c: 'Keagamaan', p: 'Kegiatan pesantren kilat, tadarus, dan pembinaan tahfidz selama Ramadhan.' },
        { d: '2027-03-25', t: 'Nuzulul Qur\'an 17 Ramadhan 1448 H', c: 'Keagamaan', p: 'Peringatan Nuzulul Qur\'an bersama warga madrasah.' },
        { d: '2027-04-08', t: 'Libur Idul Fitri 1448 H (prakiraan)', c: 'Keagamaan', p: 'Libur Idul Fitri — jadwal resmi menunggu ketetapan pemerintah.' },
        { d: '2027-04-19', t: 'Masuk Kembali Setelah Libur Idul Fitri', c: 'Akademik', p: 'Kegiatan pembelajaran berjalan normal kembali.' },
        { d: '2027-04-21', t: 'Ujian Madrasah (UM) Kelas IX', c: 'Akademik', p: 'Ujian madrasah untuk peserta didik kelas IX.' },
        { d: '2027-05-19', t: 'Ujian Praktik & Asesmen Sumatif Akhir', c: 'Akademik', p: 'Ujian praktik keagamaan, tahfidz, dan asesmen akhir jenjang.' },
        { d: '2027-06-10', t: 'Wisuda Tahfidz & Apresiasi Prestasi', c: 'Kesiswaan', p: 'Wisuda hafalan Al-Qur\'an dan penghargaan prestasi peserta didik.' },
        { d: '2027-06-18', t: 'Pembagian Rapor & Kenaikan Kelas', c: 'Akademik', p: 'Rapor semester genap dan pengumuman kenaikan kelas.' },
        { d: '2027-06-21', t: 'Libur Akhir Tahun Pelajaran 2026/2027', c: 'Akademik', p: 'Libur akhir tahun pelajaran menuju TP 2027/2028.' }
      ],
      en: [
        { d: '2026-07-13', t: 'Start of Academic Year 2026/2027 & MPLS', c: 'Academics', p: 'First day of school and the environment introduction program (MPLS) for Grade VII.' },
        { d: '2026-07-20', t: 'Tahfidz & Extracurricular Coaching Begins', c: 'Student Affairs', p: 'Tahfidz, research, science, and extracurricular coaching runs in full.' },
        { d: '2026-08-17', t: '81st Indonesian Independence Day Ceremony', c: 'Student Affairs', p: 'Flag ceremony commemorating the independence of the Republic of Indonesia.' },
        { d: '2026-08-26', t: 'Maulid of Prophet Muhammad SAW 1448 H', c: 'Religious', p: 'Religious event with the whole school community (hisab estimate).' },
        { d: '2026-09-28', t: 'Mid-Semester Summative Assessment (Odd)', c: 'Academics', p: 'Mid-term summative assessment for Grades VII–IX.' },
        { d: '2026-10-22', t: 'National Santri Day Commemoration', c: 'Religious', p: 'Santri Day ceremony and a series of religious activities.' },
        { d: '2026-12-01', t: 'Final Semester Assessment (PAS) — Odd', c: 'Academics', p: 'Final odd-semester exams for all Grades VII–IX.' },
        { d: '2026-12-18', t: 'Odd-Semester Report Cards', c: 'Academics', p: 'Odd-semester report cards for 2026/2027 are distributed by homeroom teachers.' },
        { d: '2026-12-21', t: 'Odd-Semester Holidays 2026/2027', c: 'Academics', p: 'End of the odd semester ahead of the even semester.' },
        { d: '2027-01-04', t: 'Start of Even Semester 2026/2027', c: 'Academics', p: 'First day of the even semester 2026/2027.' },
        { d: '2027-01-08', t: 'Isra Mikraj Commemoration 1448 H', c: 'Religious', p: 'Commemoration of the Isra Mikraj of Prophet Muhammad SAW (hisab estimate).' },
        { d: '2027-02-01', t: 'New Boarding Intake "Idzatun Nasyi\'in"', c: 'Student Affairs', p: 'Registration opens for new male and female boarding students.' },
        { d: '2027-03-09', t: 'Start of Ramadan 1448 H (estimate)', c: 'Religious', p: 'Beginning of the holy month of Ramadan — schedule follows the official MoRA decree.' },
        { d: '2027-03-15', t: 'Ramadan Camp & Tadarus', c: 'Religious', p: 'Ramadan camping, tadarus, and tahfidz coaching during Ramadan.' },
        { d: '2027-03-25', t: 'Nuzulul Qur\'an, 17 Ramadan 1448 H', c: 'Religious', p: 'Commemoration of Nuzulul Qur\'an with the school community.' },
        { d: '2027-04-08', t: 'Eid al-Fitr Holiday 1448 H (estimate)', c: 'Religious', p: 'Eid al-Fitr holiday — official schedule awaits government decree.' },
        { d: '2027-04-19', t: 'Return After Eid al-Fitr Holiday', c: 'Academics', p: 'Learning activities resume as normal.' },
        { d: '2027-04-21', t: 'Madrasah Exam (UM) for Grade IX', c: 'Academics', p: 'Madrasah exams for Grade IX students.' },
        { d: '2027-05-19', t: 'Practical Exams & Final Summative Assessment', c: 'Academics', p: 'Religious practice, tahfidz, and end-of-level assessments.' },
        { d: '2027-06-10', t: 'Tahfidz Graduation & Achievement Awards', c: 'Student Affairs', p: 'Quran memorization graduation and student achievement awards.' },
        { d: '2027-06-18', t: 'Report Cards & Grade Promotion', c: 'Academics', p: 'Even-semester report cards and grade promotion announcements.' },
        { d: '2027-06-21', t: 'End-of-Year Holidays 2026/2027', c: 'Academics', p: 'End-of-year holidays ahead of the 2027/2028 academic year.' }
      ]
    };
    const LANG_MONTHS = {
      id: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
      en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };
    const monthName = function (m) { return (LANG_MONTHS[lang] || LANG_MONTHS.id)[m]; };
    // Buka otomatis di bulan berjalan dalam rentang TP 2026/2027 (Juli–Juni)
    const nowCal = new Date();
    const startYear = nowCal.getMonth() < 6 ? nowCal.getFullYear() - 1 : nowCal.getFullYear();
    const START_KEY = startYear * 12 + 6;    // Juli (awal TP)
    const END_KEY = (startYear + 1) * 12 + 5; // Juni (akhir TP)
    let viewYear = nowCal.getFullYear(), viewMonth = nowCal.getMonth();
    const grid = calEl.querySelector('.cal-grid');
    const titleEl = calEl.querySelector('.cal-head h4');
    const prevBtn = calEl.querySelector('.cal-prev');
    const nextBtn = calEl.querySelector('.cal-next');
    const panelTitle = document.getElementById('calPanelTitle');
    const panelSub = document.getElementById('calPanelSub');
    const panelList = document.getElementById('calEvents');

    function fmtId(dStr) {
      const [y, m, d] = dStr.split('-').map(Number);
      return d + ' ' + monthName(m - 1).slice(0, 3) + ' ' + y;
    }
    function eventsInMonth(ym) {
      return (EVENTS[lang] || EVENTS.id).filter(function (e) { return e.d.slice(0, 7) === ym; });
    }
    function renderCal() {
      const first = new Date(viewYear, viewMonth, 1);
      const offset = (first.getDay() + 6) % 7; // Senin = 0
      const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      const ym = viewYear + '-' + String(viewMonth + 1).padStart(2, '0');
      titleEl.textContent = monthName(viewMonth) + ' ' + viewYear;
      prevBtn.disabled = viewYear * 12 + viewMonth <= START_KEY;
      nextBtn.disabled = viewYear * 12 + viewMonth >= END_KEY;

      let html = '';
      for (let i = 0; i < offset; i++) html += '<div class="cal-cell empty"></div>';
      for (let day = 1; day <= daysInMonth; day++) {
        const ds = ym + '-' + String(day).padStart(2, '0');
        const has = (EVENTS[lang] || EVENTS.id).some(function (e) { return e.d === ds; });
        html += '<div class="cal-cell' + (has ? ' has-event' : '') + '" data-date="' + ds + '">' + day + '</div>';
      }
      grid.innerHTML = html;
      renderPanel(eventsInMonth(ym), ym);

      grid.querySelectorAll('.cal-cell.has-event').forEach(function (cell) {
        cell.addEventListener('click', function () {
          grid.querySelectorAll('.cal-cell').forEach(function (c) { c.classList.remove('selected'); });
          cell.classList.add('selected');
          const ds = cell.getAttribute('data-date');
          const ev = (EVENTS[lang] || EVENTS.id).filter(function (e) { return e.d === ds; });
          renderPanel(ev, ym, fmtId(ds));
        });
      });
    }
    function renderPanel(list, ym, prefix) {
      const curCal = I18N[lang] || I18N.id;
      panelTitle.textContent = prefix || (curCal['cal.agenda'] + ' ' + monthName(viewMonth) + ' ' + viewYear);
      panelSub.textContent = prefix ? curCal['cal.onDate'].replace('{d}', prefix) : curCal['cal.pickDate'];
      if (!list.length) {
        panelList.innerHTML = '<p style="color:var(--ink-soft);font-size:.9rem;">' + curCal['cal.none'] + '</p>';
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
      if (viewYear * 12 + viewMonth <= START_KEY) return;
      if (viewMonth > 0) viewMonth--; else { viewYear--; viewMonth = 11; }
      renderCal();
    });
    nextBtn.addEventListener('click', function () {
      if (viewYear * 12 + viewMonth >= END_KEY) return;
      if (viewMonth < 11) viewMonth++; else { viewYear++; viewMonth = 0; }
      renderCal();
    });
    renderCal();
    window.__calRender = renderCal;
  }

  // ================= NEWSLETTER =================
  const nlForm = document.getElementById('nlForm');
  if (nlForm) {
    nlForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = nlForm.querySelector('input[type="email"]');
      const msg = nlForm.parentElement.querySelector('.nl-msg');
      if (!input || !input.value) return;
      const cur = I18N[lang] || I18N.id;
      msg.textContent = cur['nl.sending'] || 'Mengirim…';
      msg.style.color = '';
      fetch('https://formsubmit.co/ajax/humas@mtsn1semarang.sch.id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: input.value, _subject: 'Newsletter MTsN 1 Kota Semarang' })
      }).then(function (r) { return r.json(); }).then(function () {
        msg.textContent = cur['nl.thanks'];
        input.value = '';
      }).catch(function () {
        msg.textContent = cur['nl.fail'] || 'Gagal mengirim. Silakan coba lagi.';
      });
    });
  }

  // ================= COUNTDOWN PPDB =================
  const cdWrap = document.getElementById('ppdbCountdown');
  if (cdWrap) {
    const target = new Date(cdWrap.getAttribute('data-target')).getTime();
    function tick() {
      const CD = {
        id: { d: 'Hari', h: 'Jam', m: 'Menit', s: 'Detik', done: 'Pendaftaran telah dibuka / segera diumumkan oleh panitia PPDB.' },
        en: { d: 'Days', h: 'Hours', m: 'Minutes', s: 'Seconds', done: 'Registration is open / will be announced soon by the PPDB committee.' }
      };
      const u = CD[lang] || CD.id;
      const diff = target - Date.now();
      if (diff <= 0) {
        cdWrap.innerHTML = '<p class="cd-done">' + u.done + '</p>';
        return;
      }
      const units = [86400000, 3600000, 60000, 1000];
      const labels = [u.d, u.h, u.m, u.s];
      let out = '';
      units.forEach(function (ms, i) {
        let val = Math.floor(diff / ms);
        if (i === 0) {
          out += '<div class="cd-item"><div class="cd-num">' + val + '</div><div class="cd-label">' + labels[0] + '</div></div>';
        } else {
          out += '<div class="cd-item"><div class="cd-num">' + String(val % (i === 1 ? 24 : 60)) + '</div><div class="cd-label">' + labels[i] + '</div></div>';
        }
      });
      cdWrap.innerHTML = out;
    }
    tick();
    setInterval(tick, 1000);
    window.__cdTick = tick;
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

  // ================= POLISH: SCROLL PROGRESS, HEADER, HERO =================
  const sp = document.getElementById('scrollProgress');
  const siteHeader = document.querySelector('.site-header');
  const heroEl2 = document.getElementById('heroSlider');
  window.addEventListener('scroll', function () {
    const h = document.documentElement;
    const sc = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    if (sp) sp.style.width = (sc * 100) + '%';
    if (siteHeader) siteHeader.classList.toggle('scrolled', h.scrollTop > 12);
    if (heroEl2) heroEl2.classList.toggle('hero-faded', h.scrollTop > 120);
    const top = document.querySelector('.to-top');
    if (top) top.style.setProperty('--p', (sc * 360) + 'deg');
  }, { passive: true });

  // ================= PRELOADER =================
  const preloader = document.getElementById('preloader');
  function hidePreloader() {
    if (!preloader || preloader.classList.contains('done')) return;
    preloader.classList.add('done');
    setTimeout(function () { if (preloader.parentNode) preloader.parentNode.removeChild(preloader); }, 600);
  }
  if (preloader) {
    window.addEventListener('load', function () { setTimeout(hidePreloader, 400); });
    setTimeout(hidePreloader, 2200); // pengaman
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) hidePreloader();
  }

  // ================= LAZY LOAD GAMBAR =================
  document.querySelectorAll('img').forEach(function (img) {
    if (!img.closest('.hero') && !img.closest('.brand') && !img.closest('.preloader')) {
      img.setAttribute('loading', 'lazy');
      img.setAttribute('decoding', 'async');
    }
  });

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

  // ================= FAQ AKORDEON =================
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ================= LIGHTBOX GALERI =================
  const galItems = document.querySelectorAll('.galeri-item[data-full]');
  if (galItems.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-label', 'Tampilan galeri');
    lb.innerHTML =
      '<button class="lb-close" data-i18n-aria="lb.close" aria-label="Tutup">✕</button>' +
      '<img src="" alt="">' +
      '<div class="lb-cap"></div>' +
      '<div class="lb-counter"></div>' +
      '<button class="lb-nav lb-prev" data-i18n-aria="lb.prev" aria-label="Sebelumnya">‹</button>' +
      '<button class="lb-nav lb-next" data-i18n-aria="lb.next" aria-label="Berikutnya">›</button>';
    document.body.appendChild(lb);
    const img = lb.querySelector('img');
    const cap = lb.querySelector('.lb-cap');
    const counter = lb.querySelector('.lb-counter');
    const close = lb.querySelector('.lb-close');
    const prev = lb.querySelector('.lb-prev');
    const next = lb.querySelector('.lb-next');
    let idx = 0;
    const list = Array.prototype.slice.call(galItems);

    function show(i) {
      idx = (i + list.length) % list.length;
      const el = list[idx];
      img.src = el.getAttribute('data-full');
      img.alt = el.getAttribute('data-caption') || '';
      const capKey = el.querySelector('[data-i18n]');
      const curCap = I18N[lang] || I18N.id;
      cap.textContent = (capKey && curCap[capKey.getAttribute('data-i18n')]) || el.getAttribute('data-caption') || '';
      counter.textContent = (idx + 1) + ' / ' + list.length;
    }
    function open(i) {
      show(i);
      lb.classList.add('open');
      document.body.classList.add('lightbox-open');
    }
    function closeLb() {
      lb.classList.remove('open');
      document.body.classList.remove('lightbox-open');
    }
    galItems.forEach(function (el, i) {
      el.addEventListener('click', function () { open(i); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });
    close.addEventListener('click', closeLb);
    prev.addEventListener('click', function () { show(idx - 1); });
    next.addEventListener('click', function () { show(idx + 1); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
    lb.addEventListener('click', function (e) {
      if (e.target === lb) closeLb();
    });
  }

  // ================= MEDIA CENTER (video YouTube & lokal) =================
  const mediaListEl = document.getElementById('mediaList');
  const mediaPlayerEl = document.getElementById('mediaPlayer');
  const mediaTag = document.getElementById('mediaTag');
  const mediaTitle = document.getElementById('mediaTitle');
  const mediaDesc = document.getElementById('mediaDesc');
  const filmModal = document.getElementById('filmModal');
  const filmFrame = document.getElementById('filmFrame');
  const filmClose = document.getElementById('filmClose');

  function ytEmbed(id, autoplay) {
    return '<iframe src="https://www.youtube.com/embed/' + id +
      '?rel=0&modestbranding=1&playsinline=1&hl=' + (lang === 'en' ? 'en' : 'id') + (autoplay ? '&autoplay=1' : '') +
      '" title="YouTube video player" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>';
  }
  function localEmbed(src, poster, ttl) {
    return '<video src="' + src + '" poster="' + poster + '" controls autoplay playsinline preload="metadata" aria-label="' + (ttl || '') + '"></video>';
  }
  function resolveKey(k) {
    const m = I18N[lang] || I18N.id;
    if (m[k] !== undefined) return m[k];
    if (I18N.id[k] !== undefined) return I18N.id[k];
    return k;
  }

  const mediaCards = mediaListEl ? Array.prototype.slice.call(mediaListEl.querySelectorAll('.media-card')) : [];
  let mediaActive = null;

  function loadMedia(card) {
    if (card.getAttribute('data-kind') === 'local') {
      mediaPlayerEl.innerHTML = localEmbed(card.getAttribute('data-src'), card.getAttribute('data-thumb'), resolveKey(card.getAttribute('data-title')));
    } else {
      mediaPlayerEl.innerHTML = ytEmbed(card.getAttribute('data-id'), true);
    }
  }
  function mediaCover(card) {
    var ttl = resolveKey(card.getAttribute('data-title'));
    return '<div class="media-cover" role="button" tabindex="0" aria-label="' + ttl + '" style="background-image:url(\'' + card.getAttribute('data-thumb') + '\');">' +
      '<span class="media-play-big">▶</span></div>';
  }
  function showMedia(card) {
    mediaCards.forEach(function (c) { c.classList.remove('active'); });
    card.classList.add('active');
    mediaActive = card;
    mediaPlayerEl.innerHTML = mediaCover(card);
    const cover = mediaPlayerEl.querySelector('.media-cover');
    if (cover) {
      cover.addEventListener('click', function () { loadMedia(card); });
      cover.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadMedia(card); }
      });
    }
    mediaTag.textContent = resolveKey(card.getAttribute('data-tag'));
    mediaTitle.textContent = resolveKey(card.getAttribute('data-title'));
    mediaDesc.textContent = resolveKey(card.getAttribute('data-desc'));
    const mediaWatch = document.getElementById('mediaWatch');
    if (mediaWatch) {
      if (card.getAttribute('data-kind') === 'yt') {
        mediaWatch.href = 'https://www.youtube.com/watch?v=' + card.getAttribute('data-id');
        mediaWatch.style.display = '';
      } else {
        mediaWatch.style.display = 'none';
      }
    }
  }
  mediaCards.forEach(function (card) {
    card.addEventListener('click', function () { showMedia(card); });
  });
  if (mediaCards.length) showMedia(mediaCards[0]);
  window.__mediaSync = function () {
    if (!mediaActive) return;
    mediaTag.textContent = resolveKey(mediaActive.getAttribute('data-tag'));
    mediaTitle.textContent = resolveKey(mediaActive.getAttribute('data-title'));
    mediaDesc.textContent = resolveKey(mediaActive.getAttribute('data-desc'));
  };

  // ================= MODAL FILM =================
  if (filmModal) {
    window.__openFilm = function (kind, payload) {
      filmFrame.innerHTML = kind === 'local'
        ? localEmbed(payload.src, payload.poster, payload.title || '')
        : ytEmbed(payload, true);
      filmModal.classList.add('open');
      filmModal.removeAttribute('hidden');
      document.body.classList.add('film-open');
    };
    window.__closeFilm = function () {
      filmModal.classList.remove('open');
      filmFrame.innerHTML = '';
      document.body.classList.remove('film-open');
    };
    if (filmClose) filmClose.addEventListener('click', function () { window.__closeFilm(); });
    filmModal.addEventListener('click', function (e) { if (e.target === filmModal) window.__closeFilm(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && filmModal.classList.contains('open')) window.__closeFilm();
    });
  }

  const heroFilmBtn = document.getElementById('heroFilm');
  if (heroFilmBtn && window.__openFilm) {
    heroFilmBtn.addEventListener('click', function () { window.__openFilm('yt', 'D0foM9tPhiw'); });
  }
  const vtourPlayBtn = document.getElementById('vtourPlay');
  if (vtourPlayBtn && window.__openFilm) {
    vtourPlayBtn.addEventListener('click', function () { window.__openFilm('yt', 'D0foM9tPhiw'); });
  }
  const ppdbVideoBtn = document.getElementById('ppdbVideoBtn');
  if (ppdbVideoBtn && window.__openFilm) {
    ppdbVideoBtn.addEventListener('click', function () {
      window.__openFilm('yt', 'ZmfHvMNzVWw');
    });
  }

  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', function () {
      const next = document.querySelector('.stats-bar') || document.querySelector('main section');
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ================= FORMULIR KONTAK (FormSubmit + fallback mailto) =================
  const ctForm = document.getElementById('ctForm');
  if (ctForm) {
    ctForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const nama = (ctForm.querySelector('#nama') || {}).value || '';
      const email = (ctForm.querySelector('#email') || {}).value || '';
      const subjek = (ctForm.querySelector('#subjek') || {}).value || '';
      const pesan = (ctForm.querySelector('#pesan') || {}).value || '';
      const m = document.getElementById('formMsg');
      if (!m) return;
      m.textContent = 'Mengirim…';
      fetch('https://formsubmit.co/ajax/humas@mtsn1semarang.sch.id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ _subject: subjek, Nama: nama, Email: email, Pesan: pesan })
      }).then(function (r) { return r.json(); }).then(function () {
        m.textContent = 'Terima kasih! Pesan Anda telah terkirim. Tim kami akan segera menghubungi Anda.';
        ctForm.reset();
      }).catch(function () {
        // fallback: buka aplikasi email
        const line = encodeURIComponent('Nama: ' + nama + '\nEmail: ' + email + '\n\n' + pesan);
        window.location.href = 'mailto:humas@mtsn1semarang.sch.id?subject=' + encodeURIComponent(subjek) + '&body=' + line;
        m.textContent = 'Terima kasih — aplikasi email Anda akan terbuka untuk mengirim pesan.';
        ctForm.reset();
      });
    });
  }

  // ================= BANNER COOKIE / PREFERENSI =================
  (function () {
    let ok = false;
    try { ok = !!localStorage.getItem('mtsn1-cookie-ok'); } catch (e) { return; }
    if (ok) return;
    const wrap = document.createElement('div');
    wrap.className = 'cookie-bar';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Cookie notice');
    const m = I18N[lang] || I18N.id;
    wrap.innerHTML = '<p>' + (m['cookie.txt'] || '') + '</p>' +
      '<button type="button" class="btn btn-gold">' + (m['cookie.btn'] || 'OK') + '</button>';
    document.body.appendChild(wrap);
    wrap.querySelector('button').addEventListener('click', function () {
      try { localStorage.setItem('mtsn1-cookie-ok', '1'); } catch (e) {}
      wrap.classList.add('hide');
      setTimeout(function () { wrap.remove(); }, 400);
    });
    setTimeout(function () { wrap.classList.add('show'); }, 1200);
  })();
});