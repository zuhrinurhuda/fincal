import type { FAQItem } from '@/types/calculator';

export const homeConfig = {
  title: 'Kalkulator Keuangan Indonesia Gratis - Simulasi KPR, Pajak & Investasi | FinCal',
  metaDescription:
    'Kumpulan kalkulator keuangan online gratis — simulasi KPR, kredit motor & mobil, PPh 21, zakat, investasi, dan lainnya. Akurat, cepat, tanpa registrasi.',
  h1: 'Kalkulator Keuangan Indonesia Gratis',
  subtitle:
    'Simulasi KPR, kredit kendaraan, pajak penghasilan, zakat, dan investasi — akurat, gratis, tanpa registrasi.',

  valuePropositions: [
    {
      icon: 'shield',
      title: 'Akurat & Terpercaya',
      description:
        'Menggunakan rumus finansial standar dan regulasi Indonesia: suku bunga efektif, tarif PPh 21 sesuai PMK 168/2023, nisab zakat BAZNAS.',
    },
    {
      icon: 'zap',
      title: 'Cepat & Tanpa Registrasi',
      description:
        'Langsung hitung tanpa buat akun. Hasil simulasi muncul instan — tidak perlu menunggu.',
    },
    {
      icon: 'lock',
      title: 'Privasi Terjaga',
      description:
        'Semua kalkulasi dilakukan di browser Anda. Data tidak dikirim ke server manapun dan tidak disimpan.',
    },
    {
      icon: 'device',
      title: 'Akses di Semua Perangkat',
      description: 'Responsif di desktop, tablet, dan handphone. Hitung kapan saja, di mana saja.',
    },
  ],

  categories: [
    {
      name: 'Kredit & Pinjaman',
      description:
        'Simulasi cicilan KPR, kredit motor, kredit mobil, pinjol, KUR, dan pelunasan dipercepat.',
      color: 'blue',
      filter: 'Kredit' as const,
    },
    {
      name: 'Investasi',
      description: 'Hitung pertumbuhan investasi compound interest dan simulasi reksa dana.',
      color: 'emerald',
      filter: 'Investasi' as const,
    },
    {
      name: 'Pajak & Zakat',
      description: 'Kalkulasi PPh 21 karyawan dan zakat maal sesuai regulasi Indonesia.',
      color: 'amber',
      filter: 'Pajak & Zakat' as const,
    },
  ],

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
      question: 'Apakah data saya aman?',
      answer:
        'Semua kalkulasi dilakukan di browser Anda (client-side). Data tidak dikirim ke server manapun dan tidak disimpan.',
    },
  ] satisfies FAQItem[],
};
