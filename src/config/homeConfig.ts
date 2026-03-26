import type { FAQItem } from '@/types/calculator';

export const homeConfig = {
  title: 'Kalkulator Keuangan Indonesia Gratis - Simulasi KPR, Pajak & Investasi | FinCal',
  metaDescription:
    'Kumpulan kalkulator keuangan online gratis — simulasi KPR, kredit motor & mobil, PPh 21, zakat, investasi, dan lainnya. Akurat, cepat, tanpa registrasi.',
  h1: 'Kalkulator Keuangan Indonesia Gratis',
  subtitle:
    'Simulasi KPR, kredit kendaraan, pajak penghasilan, zakat, dan investasi — akurat, gratis, tanpa registrasi.',

  seoContent: `
    <h2>Tentang FinCal</h2>
    <p>
      FinCal adalah kumpulan kalkulator keuangan online yang dirancang khusus untuk masyarakat Indonesia.
      Semua kalkulator kami menggunakan rumus dan regulasi yang berlaku di Indonesia, termasuk suku bunga
      efektif vs flat, tarif PPh 21 sesuai PMK 168/2023, dan nisab zakat berdasarkan pedoman BAZNAS.
    </p>

    <h2>Mengapa Menggunakan Kalkulator Keuangan?</h2>
    <p>
      Perencanaan keuangan yang baik dimulai dari memahami angka. Dengan kalkulator keuangan online,
      Anda bisa mensimulasikan cicilan kredit, menghitung pajak penghasilan, merencanakan investasi,
      dan menunaikan kewajiban zakat — semuanya dalam hitungan detik. Tidak perlu rumus manual atau
      spreadsheet rumit.
    </p>

    <h2>Kalkulator Apa Saja yang Tersedia?</h2>
    <ul>
      <li><strong>Kredit & Pinjaman</strong> — KPR, kredit motor, kredit mobil, pinjaman online (pinjol), KUR, dan pelunasan KPR dipercepat.</li>
      <li><strong>Investasi</strong> — Simulasi compound interest dan kalkulator reksa dana berdasarkan NAB.</li>
      <li><strong>Pajak & Zakat</strong> — PPh 21 karyawan dan zakat maal sesuai fatwa MUI.</li>
    </ul>
    <p>
      Semua kalkulator gratis digunakan tanpa perlu membuat akun. Hasil kalkulasi bersifat estimasi —
      konsultasikan dengan perencana keuangan profesional untuk keputusan finansial penting.
    </p>
  `,

  faqs: [
    {
      question: 'Apa itu FinCal?',
      answer:
        'FinCal adalah kumpulan kalkulator keuangan online gratis yang dirancang khusus untuk masyarakat Indonesia. Kami menyediakan simulasi KPR, kredit kendaraan, pajak, zakat, dan investasi.',
    },
    {
      question: 'Apakah kalkulator di FinCal gratis?',
      answer:
        'Ya, semua kalkulator di FinCal 100% gratis tanpa perlu registrasi atau membuat akun.',
    },
    {
      question: 'Apakah hasil kalkulasi FinCal akurat?',
      answer:
        'Kalkulator kami menggunakan rumus finansial standar dan regulasi yang berlaku di Indonesia. Namun hasil bersifat estimasi — untuk keputusan finansial penting, konsultasikan dengan bank atau perencana keuangan profesional.',
    },
    {
      question: 'Kalkulator apa saja yang tersedia di FinCal?',
      answer:
        'Saat ini tersedia kalkulator KPR, kredit motor, kredit mobil, pinjaman online (pinjol), KUR, pelunasan KPR dipercepat, investasi compound interest, reksa dana, PPh 21, dan zakat maal.',
    },
    {
      question: 'Apakah data saya aman?',
      answer:
        'Semua kalkulasi dilakukan di browser Anda (client-side). Data tidak dikirim ke server manapun dan tidak disimpan.',
    },
  ] satisfies FAQItem[],
};
