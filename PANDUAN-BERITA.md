# Panduan posting berita mingguan — MTsN 1 Kota Semarang

Target: 1 berita/minggu di `berita.html` (+ sorotan di `index.html` bila penting).
Waktu: ±15 menit per berita.

## 1. Siapkan bahan (5 menit)
- 1 foto landscape asli kegiatan (HP cukup, tanpa teks overlay).
- Catat: judul, tanggal, tempat, 5W+1H singkat, nama pembina/narasumber.
- Simpan foto ke `assets/photos/` dengan nama kecil-tanpa-spasi, mis. `upacara-17-agustus-2027.jpg`.
- Optimalkan: simpan varian `-800` (lebar 800px) + WebP bila memungkinkan.

## 2. Tambah kartu di berita.html (7 menit)
Salin blok `<a class="news-card ...">` teratas, tempel tepat di bawah
`<div class="news-grid">`, lalu isi:

```html
<a href="URL-SUMBER-RESMI" target="_blank" rel="noopener" class="news-card reveal">
  <div class="news-card-img"><img src="assets/photos/foto-800.jpg" srcset="assets/photos/foto-800.jpg 800w" alt="Judul berita yang deskriptif" loading="lazy" decoding="async" width="800" height="450"></div>
  <div class="news-card-body">
    <span class="tag-kategori">Kegiatan</span> <!-- Prestasi / Kegiatan / Akademik / Fasilitas / Kesiswaan -->
    <h3>Judul Berita</h3>
    <p>1–2 kalimat ringkasan 5W+1H.</p>
    <span class="news-date">6 September 2027</span>
  </div>
</a>
```

Aturan: `alt` = judul berita. Kategori harus salah satu dari 5 di atas.
Berita internal (tanpa URL luar): ganti `<a href...>` menjadi `<article class="news-card reveal">` (tanpa target/rel).

## 3. Sorotan beranda bila penting (2 menit)
Hanya untuk prestasi besar / pengumuman PPDB. Duplikat kartu ke grid
`index.html` (bagian `Cerita, Berita & Prestasi`), maksimal 6 kartu.

## 4. Arsip prestasi bila relevan (1 menit)
Tambah 1 baris ke `assets/data/prestasi.json`:
`{"tahun": 2027, "bidang": "...", "tingkat": "Kota/Provinsi/Nasional/Internasional", "judul": "...", "sumber": "..."}`
Bidang valid: Akademik, Riset, Olahraga, Pramuka, Seni, Keagamaan, Media, Kelembagaan.

## 5. Cek sebelum push (1 menit)
- `node -e "new (require('vm').Script)(require('fs').readFileSync('js/main.js','utf8'))"` (bila menyentuh JS)
- Buka `berita.html` di browser, pastikan foto tampil & tanggal benar.
- Commit: `git add -A && git commit -m "..." && git push origin main`
