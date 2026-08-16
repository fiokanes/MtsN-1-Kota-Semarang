# 📝 Ringkasan Percakapan — Website MTs Negeri 1 Kota Semarang

> Ringkasan proses pembuatan website MTs Negeri 1 Kota Semarang dari awal hingga deploy.
> Dibuat: Agustus 2025

---

## 1️⃣ Kebutuhan Awal

Pengguna meminta pembuatan website untuk **MTs Negeri 1 Kota Semarang** dengan ketentuan:

| Aspek | Keputusan |
|-------|-----------|
| **Hosting** | Upload ke GitHub → deploy ke **Vercel** |
| **Tema warna** | **Hijau** (khas madrasah/Islami) |
| **Konten** | Dicari dari internet (riset daring) |
| **Referensi desain** | Dicari dari internet |
| **Struktur** | **Multi-halaman** (7 halaman) |

---

## 2️⃣ Proses Riset Data (Internet)

### Kendala yang Dihadapi
- Website resmi `mtsn1semarang.sch.id` **tidak aktif** (DNS non-existent)
- Google Search & Bing **memblokir scraping** (halaman JS/captcha)
- Instagram/Facebook hanya menampilkan halaman login

### Sumber yang Berhasil Digunakan
1. **OpenStreetMap (Nominatim)** → alamat & koordinat madrasah
2. **Google Maps (embed)** → alamat lengkap + plus code + place ID
3. **Google News RSS** → menemukan 14+ artikel berita tentang madrasah
4. **Situs Kemenag Jateng** (`jateng.kemenag.go.id`) → artikel berita resmi

### Hasil Riset (Data Tervalidasi)

**Identitas:**
- Nama: MTs Negeri 1 Kota Semarang
- Alamat: Jl. Ketileng Raya (Jl. Fatmawati), Sendangmulyo, Kec. Tembalang, Kota Semarang, Jawa Tengah 50272
- Koordinat: -7.0334, 110.4677 (Plus code: XF89+J3H)
- Status: Negeri (Kementerian Agama RI)

**Program Unggulan:**
- Boarding School **"Idzatun Nasyi'in"** (beroperasi 1 Feb 2022, kapasitas 100 santri putra + 100 santriwati)
- 3 pilar: **Tahfidz, Riset, Sains**
- Madrasah *piloting* Implementasi Kurikulum Merdeka (2022/2023)

**Prestasi:**
- 🥈 Silver Medal **AISEEF 2021** (internasional, 19 negara)
- 🏆 3 siswa maju **KSM 2023** tingkat provinsi
- 🏆 Juara 1 **LCTP Pramuka** tingkat kwartir (2022)
- 🏆 Juara bulutangkis PBSI Jakarta Selatan (2022)
- 🏆 Lulusan diterima di MAN IC, MAN PK, MAKN
- 🤝 Komitmen Madrasah Ramah Anak (2023)

**Fasilitas:**
- Gedung **SBSN** diresmikan Menteri Agama (7 Feb 2022)
- Pavingisasi 3.500 m² bantuan Pemkot Semarang

**Data yang belum ditemukan** (diisi placeholder + catatan): visi misi resmi, sejarah berdirinya, NPSN/NSM, telepon/email, sosial media, jadwal PPDB tahun berjalan.

---

## 3️⃣ Keputusan Desain

- **Tema**: Hijau madrasah (`#047857`, `#065f34`) + aksen emas (`#f5b301`)
- **Font**: Poppins (judul), Inter (isi), Amiri (Bismillah Arab)
- **Pola**: Geometri Islami (bintang 8) pada hero
- **Responsif**: Menu hamburger di mobile, grid adaptif
- **Logo**: SVG kustom (kubah masjid + kitab) di `assets/logo.svg`

---

## 4️⃣ Struktur Website yang Dibuat

```
D:/web_MtsN 1 Kota Semarang/
├── index.html       → Beranda (hero, sambutan, program, berita)
├── profil.html      → Profil (sejarah, visi misi, identitas, struktur)
├── program.html     → Program (boarding school, tahfidz, riset, sains, ekskul)
├── prestasi.html    → Prestasi (timeline 2021–2024)
├── fasilitas.html   → Fasilitas (gedung SBSN, kelas, lab, asrama, dll.)
├── ppdb.html        → PPDB (alur, persyaratan, jadwal)
├── kontak.html      → Kontak (alamat, Google Maps, formulir)
├── css/style.css    → Stylesheet bersama (±18 KB)
├── js/main.js       → Script (navigasi mobile, animasi statistik, tahun)
├── assets/logo.svg  → Logo madrasah
└── README.md        → Dokumentasi & panduan deploy
```

**Fitur website:**
- ✅ 7 halaman terhubung dengan navigasi aktif
- ✅ Responsif (mobile & desktop)
- ✅ Animasi angka statistik
- ✅ Google Maps embed (tanpa API key)
- ✅ Formulir pesan (mailto)
- ✅ Kotak catatan kuning untuk konten yang perlu verifikasi
- ✅ Teruji: semua halaman & aset mengembalikan status HTTP 200

---

## 5️⃣ Proses Push ke GitHub

```bash
git config --global user.name "fiokanes"
git config --global user.email "fiokanes@users.noreply.github.com"
git init
git add .
git commit -m "Website MTs Negeri 1 Kota Semarang - static site (HTML/CSS/JS)"
git branch -M main
git remote add origin https://github.com/fiokanes/MtsN-1-Kota-Semarang.git
git push -u origin main
```

**Hasil:** Push berhasil ke `main` → [github.com/fiokanes/MtsN-1-Kota-Semarang](https://github.com/fiokanes/MtsN-1-Kota-Semarang) (11 file terverifikasi).

---

## 6️⃣ Langkah Selanjutnya (Belum Dilakukan)

1. **Deploy ke Vercel** — via dashboard (Add New → Project → pilih repo) atau CLI (`vercel --prod`)
2. **Perbarui konten placeholder** — visi misi resmi, sejarah, NPSN, telepon/email, sosmed
3. **Ganti logo & foto** — dengan logo resmi madrasah dan foto asli
4. **Integrasi formulir** — ke layanan pihak ketiga (Formspree/FormSubmit) jika butuh penyimpanan

---

## 7️⃣ Status Akhir

| Item | Status |
|------|--------|
| Website dibangun | ✅ Selesai (7 halaman) |
| Data riset | ✅ Tervalidasi sebagian |
| Pengujian lokal | ✅ HTTP 200 semua halaman |
| Push ke GitHub | ✅ `main` branch |
| Deploy ke Vercel | ⏳ Menunggu tindakan pengguna |
