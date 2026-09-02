# 🌿 Website MTs Negeri 1 Kota Semarang

Website profil multi-halaman untuk **MTs Negeri 1 Kota Semarang** — madrasah tsanawiyah negeri di Kecamatan Tembalang, Kota Semarang, Jawa Tengah.

> ## 🌐 Situs Live
>
> **https://mts-n-1-kota-semarang.vercel.app/**
>
> Deployed via Vercel (terhubung otomatis dengan repository GitHub).

Dibangun dengan **HTML, CSS, dan JavaScript murni** (tanpa framework) sehingga ringan, cepat, dan mudah di-hosting di mana saja — termasuk **GitHub Pages** dan **Vercel**.

## 📄 Struktur Halaman

| File | Halaman | Isi |
|------|---------|-----|
| `index.html` | Beranda | Hero, sambutan, program unggulan, berita & prestasi |
| `berita.html` | Berita | Berita resmi madrasah (sumber: Kanwil Kemenag Jateng) |
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

- ✅ **Tervalidasi (sumber: Kanwil Kemenag Jateng & kanal YouTube resmi):** alamat, program unggulan, kuota 352 siswa/11 rombel, kepala madrasah (H. Kasturi), kepala boarding (M. Fajar Anshari), guru (Saptono, Agus Prapto Sukoco, Agus Trisnoto), gedung SBSN (8 Feb 2022), 132 medali (2022), medali perak RARE ICON/IFPRI 2022, LCTP Pramuka Juara 1, U-15 Timnas, penerimaan MAN IC/PK, 8 kelas digital, 131 CPNS SKBT
- ⚠️ **Perlu verifikasi:** visi misi resmi, sejarah berdirinya, NPSN/NSM (portal Kemenag tidak dapat diakses dari jaringan publik saat riset), akreditasi resmi saat ini, foto asli guru/staf, jadwal PPDB tahun berjalan, akun media sosial resmi selain YouTube

> Klaim "AISEEF 2021 — 19 negara" sebelumnya **tidak didukung** rilis resmi Kemenag dan telah **dikoreksi** menjadi fakta terverifikasi (RARE ICON/IFPRI 2022).

Konten yang perlu diperbarui diberi **kotak catatan kuning** di halaman website.

## 🛠️ Teknis

- **Form kontak & newsletter:** dikirim ke `humas@mtsn1semarang.sch.id` via **FormSubmit.co** (berfungsi di hosting statis). Pemilik email perlu **mengaktifkan** endpoint pada email pertama yang diterima. Ganti endpoint di `js/main.js` (cari `formsubmit.co`) bila ingin menggunakan Formspree/Netlify Forms.
- **Prospektus:** `assets/dokumen/prospektus-2026.pdf` (dihasilkan via fpdf2; regenerasi: `python tools/make_prospektus.py` bila ada).
- **Analytics:** belum terpasang. Tambahkan snippet GA4/Plausible di `<head>` index.html lalu ganti ID properti sesuai milik madrasah.
- Video lokal `ppdb-2026.mp4` (192×144) telah dihapus karena resolusi rendah & tidak terpakai; tombol video PPDB kini membuka video resmi YouTube. `mars-mtsn-1.mp4` (256×144) masih dipakai untuk kartu Mars — idealnya diganti dengan sumber resolusi lebih tinggi.

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
