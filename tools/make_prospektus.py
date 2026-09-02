# -*- coding: utf-8 -*-
"""Generate official prospectus PDF for MTs Negeri 1 Kota Semarang."""
import os
from fpdf import FPDF

OUT = r'D:/web_MtsN 1 Kota Semarang/assets/dokumen/prospektus-2026.pdf'
FONT_DIR = 'C:/Windows/Fonts/'

GREEN = (6, 78, 46)
GREEN_D = (2, 44, 34)
GOLD = (245, 179, 1)
CREAM = (248, 246, 236)


class Prospectus(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font('Calibri', '', 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 6, 'MTs Negeri 1 Kota Semarang  |  Prospektus TP 2026/2027', ln=1, align='R')
        self.set_draw_color(*GOLD)
        self.set_line_width(0.4)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(4)

    def footer(self):
        self.set_y(-14)
        self.set_font('Calibri', '', 8)
        self.set_text_color(130, 130, 130)
        self.cell(0, 6, f'Halaman {self.page_no()}  |  Jl. Ketileng Raya, Sendangmulyo, Tembalang, Kota Semarang 50272', align='C')

    def section(self, title_en, title_id, body):
        self.set_font('Calibri', '', 10)
        self.set_fill_color(*GREEN)
        self.set_text_color(255, 255, 255)
        self.cell(0, 9, f'  {title_id.upper()}', fill=True, ln=1)
        self.set_text_color(*GREEN_D)
        self.set_font('Calibri', 'I', 9)
        self.cell(0, 6, title_en, ln=1)
        self.ln(1.5)
        self.set_font('Calibri', '', 10)
        self.set_text_color(40, 40, 40)
        self.multi_cell(0, 5.2, body)
        self.ln(4)


pdf = Prospectus(orientation='P', unit='mm', format='A4')
pdf.set_auto_page_break(True, margin=18)
pdf.set_margins(16, 14, 16)

# Register fonts (regular, bold, italic, bold-italic)
pdf.add_font('Calibri', '', FONT_DIR + 'calibri.ttf')
pdf.add_font('Calibri', 'B', FONT_DIR + 'calibrib.ttf')
pdf.add_font('Calibri', 'I', FONT_DIR + 'calibrii.ttf')

# ---------- Cover ----------
pdf.add_page()
pdf.set_fill_color(*GREEN_D)
pdf.rect(0, 0, pdf.w, 70, 'F')
pdf.set_fill_color(*GOLD)
pdf.rect(0, 70, pdf.w, 3, 'F')
pdf.set_xy(16, 20)
pdf.set_font('Calibri', 'B', 30)
pdf.set_text_color(255, 255, 255)
pdf.multi_cell(0, 13, 'Prospektus\nTahun Pelajaran 2026/2027', align='L')
pdf.set_xy(16, 58)
pdf.set_font('Calibri', '', 13)
pdf.set_text_color(248, 246, 213)
pdf.cell(0, 7, 'MTs Negeri 1 Kota Semarang', ln=1)
pdf.set_xy(16, 65)
pdf.set_font('Calibri', 'I', 11)
pdf.set_text_color(GOLD)
pdf.cell(0, 6, 'Madrasah Hebat, Bermartabat', ln=1)

pdf.set_xy(16, 95)
pdf.set_font('Calibri', '', 11)
pdf.set_text_color(*GREEN_D)
pdf.multi_cell(0, 6.2, (
    'Madrasah Tsanawiyah Negeri di bawah Kementerian Agama RI yang mencetak generasi '
    "Qur'ani, cerdas, dan berprestasi melalui program unggulan Tahfidz, Riset, dan Sains, "
    "serta Boarding School \"Idzatun Nasyi'in\" (pendidikan ala pesantren)."
))
pdf.ln(3)
# Quick facts box
pdf.set_fill_color(*CREAM)
pdf.set_draw_color(*GOLD)
pdf.set_line_width(0.5)
x0, y0 = 16, pdf.get_y()
pdf.rect(x0, y0, pdf.w - 32, 34, style='DF')
pdf.set_xy(x0 + 6, y0 + 4)
pdf.set_font('Calibri', 'B', 11)
pdf.set_text_color(*GREEN)
pdf.cell(0, 6, 'SEKILAS ANGKA (data resmi madrasah & Kemenag)')
pdf.set_xy(x0 + 6, y0 + 12)
pdf.set_font('Calibri', '', 10)
pdf.set_text_color(40, 40, 40)
pdf.multi_cell(pdf.w - 44, 5.4, (
    '$\u2022 Kuota 352 siswa  |  11 rombongan belajar\n'
    '$\u2022 Akreditasi A  |  Piloting Implementasi Kurikulum Merdeka sejak 2022/2023\n'
    '$\u2022 132+ medali pada 10 ajang kompetisi (2022)  |  Medali perak riset internasional RARE ICON (IFPRI) 2022\n'
    '$\u2022 Boarding School kapasitas 100 santri putra & 100 santriwati (beroperasi sejak 1 Februari 2022)'
).replace('$', '\u2022'))
pdf.set_y(y0 + 40)

# ---------- Page 2: tentang, program ----------
pdf.add_page()
pdf.section('About the Madrasah', 'Sekilas Madrasah', (
    'MTs Negeri 1 Kota Semarang berlokasi di Jl. Ketileng Raya (Jl. Fatmawati), Sendangmulyo, '
    'Kecamatan Tembalang, Kota Semarang, Jawa Tengah. Sebagai madrasah negeri, seluruh '
    'pembelajaran dikelola di bawah Kementerian Agama RI dengan lingkungan yang Islami, '
    'ramah anak, dan berorientasi prestasi.'
))
pdf.section('Flagship Programs', 'Program Unggulan', (
    '1) TAHFIDZUL QUR\u2019AN \u2014 pembinaan hafalan Al-Qur\u2019an terstruktur, kajian kitab kuning '
    '(Mabadiul Fiqhiyah, Hidatul Mustafid, Alala), dan pendampingan pengasuh.\n'
    '2) RISET \u2014 pelatihan penelitian ilmiah dan pendalaman materi sains untuk kompetisi tingkat '
    'kota, nasional, hingga internasional; dibuktikan medali perak internasional RARE ICON/IFPRI 2022.\n'
    '3) SAINS \u2014 penguatan kompetensi sains lewat pembelajaran aktif, praktikum, dan olimpiade.'
))
pdf.section('Boarding School', 'Boarding School \u201CIdzatun Nasyi\u2019in\u201D', (
    'Pendidikan ala pesantren yang dikelola mandiri oleh madrasah: hafalan Al-Qur\u2019an, kajian kitab, '
    'dan pembinaan karakter setiap hari. Kapasitas 100 santri putra dan 100 santriwati. '
    'Fasilitas kelas digital untuk kelas boarding dan kelas unggulan riset/sains/tahfidz.'
))

# ---------- Page 3: prestasi, fasilitas, ppdb, kontak ----------
pdf.add_page()
pdf.section('Achievements (official)', 'Prestasi Terverifikasi', (
    '\u2022 Medali perak tingkat internasional \u2014 RARE ICON 2022 (IFPRI), riset pasta gigi kulit jeruk keprok (4 Juni 2022).\n'
    '\u2022 132 medali dari 10 ajang olimpiade/sains (Maret 2022).\n'
    '\u2022 Juara 1 Lomba Cepat Tepat Pramuka (LCTP) tingkat Kwartir (Juni 2022).\n'
    '\u2022 Unggul di PORSENI tingkat KKM (Maret 2023).\n'
    '\u2022 Peserta didik lolos seleksi U-15 Timnas Indonesia \u2014 menuju Portugal (September 2023).\n'
    '\u2022 Alumni diterima di MAN Insan Cendekia & MAN Program Keagamaan (2022).\n'
    '\u2022 131 peserta CPNS Kemenag RI mengikuti seleksi SKBT di madrasah ini (Desember 2024).\n'
    'Sumber: Kanwil Kementerian Agama Provinsi Jawa Tengah (jateng.kemenag.go.id) dan kanal YouTube resmi madrasah.'
))
pdf.section('Facilities', 'Fasilitas', (
    'Gedung SBSN yang diresmikan Menteri Agama RI (8 Februari 2022), ruang kelas digital, '
    'laboratorium, perpustakaan, masjid Al-Karim sebagai pusat ibadah dan tahfidz, serta '
    'asrama Boarding School yang nyaman dan aman.'
))
pdf.section('Admission & Contact', 'PPDB & Kontak', (
    'PPDB TP 2026/2027 dibuka melalui jalur resmi madrasah. Kuota 352 siswa (11 rombongan belajar), '
    'termasuk pendaftaran santri baru Boarding School. Informasi resmi menunggu pengumuman panitia PPDB.\n\n'
    'Alamat  : Jl. Ketileng Raya (Jl. Fatmawati), Sendangmulyo, Kec. Tembalang, Kota Semarang 50272\n'
    'Telepon : (024) 6716521\n'
    'Email   : humas@mtsn1semarang.sch.id\n'
    'YouTube : @mtsnegeri1kotasemarang356'
))

os.makedirs(os.path.dirname(OUT), exist_ok=True)
pdf.output(OUT)
print('PDF tersimpan:', OUT, '|', os.path.getsize(OUT), 'bytes')