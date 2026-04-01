import type { FAQItem } from '@/types/calculator';

export const kalkulatorIndexConfig = {
  title: 'Daftar Kalkulator Keuangan Online Gratis Indonesia | FinCal',
  metaDescription:
    'Daftar lengkap kalkulator keuangan online gratis — simulasi KPR, kredit motor & mobil, PPh 21, zakat, investasi, reksa dana, dan lainnya. Pilih kalkulator sesuai kebutuhan Anda.',
  h1: 'Semua Kalkulator Keuangan',
  subtitle:
    'Pilih kalkulator yang sesuai kebutuhan Anda. Semua gratis, akurat, dan tanpa registrasi.',

  seoContent: `
    <h2>Kalkulator Apa Saja yang Tersedia?</h2>
    <ul>
      <li><strong>Kredit &amp; Pinjaman</strong> — KPR, kredit motor, kredit mobil, pinjaman online (pinjol), KUR, dan pelunasan KPR dipercepat.</li>
      <li><strong>Investasi</strong> — Simulasi compound interest dan kalkulator reksa dana berdasarkan NAB.</li>
      <li><strong>Pajak &amp; Zakat</strong> — PPh 21 karyawan dan zakat maal sesuai fatwa MUI.</li>
    </ul>
    <p>
      Setiap kalkulator menggunakan rumus finansial standar dan regulasi Indonesia yang berlaku.
      Cukup masukkan data Anda, dan hasil simulasi langsung muncul — tanpa perlu spreadsheet atau rumus manual.
    </p>

    <h2>Cara Menggunakan</h2>
    <ol>
      <li>Pilih kalkulator sesuai kebutuhan dari daftar di atas.</li>
      <li>Isi kolom input dengan data Anda (nilai pinjaman, tenor, suku bunga, dll).</li>
      <li>Klik tombol <strong>Hitung</strong> untuk melihat hasil simulasi secara instan.</li>
    </ol>
    <p>
      Semua kalkulasi dilakukan di browser Anda (client-side) sehingga data tidak dikirim ke server manapun.
      Hasil bersifat estimasi — konsultasikan dengan perencana keuangan profesional untuk keputusan finansial penting.
    </p>
  `,

  faqs: [
    {
      question: 'Kalkulator apa saja yang tersedia di FinCal?',
      answer:
        'Saat ini tersedia kalkulator KPR, kredit motor, kredit mobil, pinjaman online (pinjol), KUR, pelunasan KPR dipercepat, investasi compound interest, reksa dana, PPh 21, dan zakat maal.',
    },
    {
      question: 'Bagaimana cara memilih kalkulator yang tepat?',
      answer:
        'Pilih berdasarkan kebutuhan Anda. Gunakan filter kategori (Kredit, Investasi, Pajak & Zakat) atau fitur pencarian di atas untuk menemukan kalkulator yang relevan.',
    },
    {
      question: 'Apakah kalkulator di FinCal gratis?',
      answer:
        'Ya, semua kalkulator di FinCal 100% gratis tanpa perlu registrasi atau membuat akun.',
    },
    {
      question: 'Apakah data saya aman?',
      answer:
        'Semua kalkulasi dilakukan di browser Anda (client-side). Data tidak dikirim ke server manapun dan tidak disimpan.',
    },
  ] satisfies FAQItem[],
};
