# 🌿 Website MTs Negeri 1 Kota Semarang

Website profil multi-halaman untuk **MTs Negeri 1 Kota Semarang** — madrasah tsanawiyah negeri di Kecamatan Tembalang, Kota Semarang, Jawa Tengah.

Dibangun dengan **HTML, CSS, dan JavaScript murni** (tanpa framework) sehingga ringan, cepat, dan mudah di-hosting di mana saja — termasuk **GitHub Pages** dan **Vercel**.

## 📄 Struktur Halaman

| File | Halaman | Isi |
|------|---------|-----|
| `index.html` | Beranda | Hero, sambutan, program unggulan, berita & prestasi |
| `profil.html` | Profil | Sejarah, visi misi, identitas, struktur organisasi |
| `program.html` | Program | Boarding School Idzatun Nasyi'in, Tahfidz, Riset, Sains |
| `prestasi.html` | Prestasi | Timeline prestasi (AISEEF 2021, KSM 2023, dll.) |
| `fasilitas.html` | Fasilitas | Gedung SBSN, kelas, lab, perpustakaan, asrama, dll. |
| `ppdb.html` | PPDB | Alur, persyaratan, dan jadwal pendaftaran |
| `kontak.html` | Kontak | Alamat, peta Google Maps, formulir pesan |

```
├── index.html
├── profil.html
├── program.html
├── prestasi.html
├── fasilitas.html
├── ppdb.html
├── kontak.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   └── logo.svg
└── README.md
```

## ✏️ Hal yang Perlu Diperbarui

Sebagian konten merupakan **draf/placeholder** karena data resmi belum ditemukan di sumber daring:

- ✅ **Tervalidasi:** alamat, program unggulan (tahfidz, riset, sains), boarding school, prestasi, gedung SBSN
- ⚠️ **Perlu verifikasi:** visi misi resmi, sejarah berdirinya, NPSN/NSM, telepon & email, nama-nama pejabat, akreditasi, sosial media, jadwal PPDB tahun berjalan

Konten yang perlu diperbarui diberi **kotak catatan kuning** di halaman website.

## 🚀 Cara Menjalankan Secara Lokal

```bash
# Opsi 1 — Python
python -m http.server 8000
# buka http://localhost:8000

# Opsi 2 — Node.js
npx serve .
```

## 📦 Deploy ke GitHub + Vercel

### 1. Buat repository di GitHub

```bash
git init
git add .
git commit -m "Website MTs Negeri 1 Kota Semarang"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

### 2a. Deploy ke Vercel (via dashboard)

1. Kunjungi [vercel.com](https://vercel.com) dan masuk dengan akun GitHub.
2. Klik **Add New → Project**, pilih repository website ini.
3. Vercel akan mendeteksi proyek **static (HTML)** secara otomatis — langsung klik **Deploy**.
4. Selesai! Website aktif di `https://nama-proyek.vercel.app`.

### 2b. Deploy ke Vercel (via CLI)

```bash
npm i -g vercel
vercel        # deploy preview
vercel --prod # deploy production
```

### 3. Deploy ke GitHub Pages (alternatif)

1. Buka repository di GitHub → **Settings → Pages**.
2. Pada **Branch**, pilih `main` dan folder `/ (root)` → **Save**.
3. Website aktif di `https://USERNAME.github.io/NAMA-REPO/`.

> Catatan: Untuk GitHub Pages, jika repo bukan `<username>.github.io`, pastikan semua tautan
> internal sudah relatif (sudah diatur demikian di website ini).

## 🎨 Kustomisasi

- **Warna:** ubah variabel di bagian `:root` pada `css/style.css` (mis. `--green-700`, `--gold`).
- **Logo:** ganti `assets/logo.svg` dengan logo resmi madrasah.
- **Foto:** tambahkan foto asli sekolah dan ganti ilustrasi pada kartu/berita.
- **Kontak:** perbarui telepon & email di semua halaman (footer) dan `kontak.html`.

## 📝 Lisensi

Dibuat untuk keperluan informasi publik. Data bersumber dari OpenStreetMap, Google Maps, dan pemberitaan Kementerian Agama RI. Mohon verifikasi data dengan pihak madrasah sebelum dipublikasikan secara luas.
