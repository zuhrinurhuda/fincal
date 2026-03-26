import type { CalculatorConfig } from '@/types/calculator';
import { formatIDR } from '@/utils/formatCurrency';
import { loanAmortization } from '@/utils/financialFormulas';

const KUR_RATE = 6; // subsidized annual effective rate

const KUR_TYPES: Record<number, { label: string; maxAmount: number }> = {
  1: { label: 'KUR Mikro', maxAmount: 50_000_000 },
  2: { label: 'KUR Kecil', maxAmount: 500_000_000 },
  3: { label: 'KUR TKI', maxAmount: 25_000_000 },
};

export const kur: CalculatorConfig = {
  slug: 'kur',
  title: 'Kalkulator KUR (Kredit Usaha Rakyat)',
  description:
    'Simulasi cicilan KUR Mikro, Kecil, dan TKI dengan suku bunga subsidi pemerintah 6% per tahun.',
  metaDescription:
    'Kalkulator KUR online — simulasi cicilan Kredit Usaha Rakyat dengan bunga subsidi 6%. Hitung cicilan KUR Mikro, Kecil & TKI. Gratis.',
  keywords: [
    'kalkulator kur',
    'kredit usaha rakyat',
    'simulasi kur',
    'kur mikro',
    'kur kecil',
    'bunga kur',
    'pinjaman kur',
  ],
  category: 'Kredit',
  icon: 'store',
  order: 6,

  inputs: [
    {
      name: 'jenisKur',
      label: 'Jenis KUR',
      type: 'select',
      defaultValue: 1,
      options: [
        { label: 'KUR Mikro (maks Rp 50 juta)', value: 1 },
        { label: 'KUR Kecil (maks Rp 500 juta)', value: 2 },
        { label: 'KUR TKI (maks Rp 25 juta)', value: 3 },
      ],
      helpText: 'Pilih jenis KUR sesuai kebutuhan usaha',
    },
    {
      name: 'jumlahPinjaman',
      label: 'Jumlah Pinjaman',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 25_000_000,
      min: 1_000_000,
      max: 500_000_000,
      helpText: 'Jumlah pokok pinjaman yang diajukan',
    },
    {
      name: 'tenor',
      label: 'Tenor',
      type: 'select',
      suffix: 'bulan',
      defaultValue: 36,
      options: [
        { label: '12 bulan (1 tahun)', value: 12 },
        { label: '24 bulan (2 tahun)', value: 24 },
        { label: '36 bulan (3 tahun)', value: 36 },
        { label: '48 bulan (4 tahun)', value: 48 },
        { label: '60 bulan (5 tahun)', value: 60 },
      ],
    },
  ],

  calculate: (values) => {
    const jenisKur = Number(values.jenisKur) || 1;
    const jumlahPinjaman = Number(values.jumlahPinjaman) || 0;
    const tenor = Number(values.tenor) || 36;

    const kurType = KUR_TYPES[jenisKur] ?? KUR_TYPES[1];
    const melebihiBatas = jumlahPinjaman > kurType.maxAmount;

    const schedule = loanAmortization(jumlahPinjaman, KUR_RATE, tenor);
    const cicilanPerBulan = schedule.length > 0 ? schedule[0].payment : 0;
    const totalBunga = schedule.reduce((s, r) => s + r.interest, 0);
    const totalBayar = jumlahPinjaman + totalBunga;

    return {
      jumlahPinjaman,
      cicilanPerBulan: Math.round(cicilanPerBulan),
      totalBunga: Math.round(totalBunga),
      totalBayar: Math.round(totalBayar),
      bungaTahunan: KUR_RATE,
      tenor,
      jenisKur: kurType.label,
      maxAmount: kurType.maxAmount,
      melebihiBatas: melebihiBatas ? 'Ya' : 'Tidak',
    };
  },

  formatResult: (r) => ({
    primary: {
      label: 'Cicilan per Bulan',
      value: `${formatIDR(Number(r.cicilanPerBulan))}/bulan`,
    },
    breakdown: [
      { label: 'Jenis KUR', value: String(r.jenisKur) },
      { label: 'Jumlah Pinjaman', value: formatIDR(Number(r.jumlahPinjaman)) },
      { label: 'Plafon Maksimum', value: formatIDR(Number(r.maxAmount)) },
      { label: 'Suku Bunga', value: `${r.bungaTahunan}% / tahun (subsidi)` },
      { label: 'Tenor', value: `${r.tenor} bulan` },
      { label: 'Cicilan per Bulan', value: formatIDR(Number(r.cicilanPerBulan)) },
      { label: 'Total Bunga', value: formatIDR(Number(r.totalBunga)) },
      { label: 'Total Pembayaran', value: formatIDR(Number(r.totalBayar)) },
      ...(r.melebihiBatas === 'Ya'
        ? [{ label: '⚠️ Peringatan', value: 'Jumlah pinjaman melebihi plafon maksimum' }]
        : []),
    ],
  }),

  faqs: [
    {
      question: 'Apa itu KUR dan siapa yang bisa mengajukan?',
      answer:
        'KUR (Kredit Usaha Rakyat) adalah program pinjaman bersubsidi dari pemerintah untuk UMKM. Syarat utama: usaha sudah berjalan minimal 6 bulan, belum pernah dapat kredit perbankan (kecuali KUR), dan memiliki usaha produktif. KUR bisa diajukan oleh individu atau kelompok usaha.',
    },
    {
      question: 'Berapa bunga KUR saat ini?',
      answer:
        'Bunga KUR tahun 2024 adalah 6% per tahun efektif, disubsidi oleh pemerintah. Ini jauh lebih rendah dibanding pinjaman komersial yang bisa mencapai 12–24% per tahun. Subsidi bunga ditanggung oleh anggaran pemerintah.',
    },
    {
      question: 'Apa bedanya KUR Mikro, KUR Kecil, dan KUR TKI?',
      answer:
        'KUR Mikro untuk pinjaman hingga Rp 50 juta tanpa agunan tambahan, cocok untuk UMKM kecil. KUR Kecil untuk pinjaman Rp 50–500 juta, biasanya memerlukan agunan. KUR TKI untuk pembiayaan penempatan Tenaga Kerja Indonesia, maksimal Rp 25 juta.',
    },
    {
      question: 'Bank apa saja yang menyalurkan KUR?',
      answer:
        'KUR disalurkan oleh bank BUMN (BRI, BNI, Mandiri, BTN), bank swasta nasional, bank daerah (BPD), dan beberapa lembaga keuangan non-bank. BRI merupakan penyalur KUR terbesar di Indonesia.',
    },
  ],

  seoContent: `
<h2>Panduan Lengkap Kredit Usaha Rakyat (KUR)</h2>
<p>
  Kredit Usaha Rakyat (KUR) adalah program pembiayaan dari pemerintah Indonesia yang ditujukan
  untuk Usaha Mikro, Kecil, dan Menengah (UMKM). Program ini memberikan akses kredit dengan
  suku bunga rendah — hanya 6% per tahun — yang sebagian bunganya disubsidi pemerintah.
</p>

<h2>Jenis-Jenis KUR</h2>
<p>
  Pemerintah menyediakan tiga jenis KUR yang disesuaikan dengan skala dan kebutuhan usaha:
</p>
<ul>
  <li><strong>KUR Mikro:</strong> Plafon hingga Rp 50 juta, tanpa agunan tambahan. Cocok untuk pedagang kecil, warung, dan UMKM tahap awal.</li>
  <li><strong>KUR Kecil:</strong> Plafon Rp 50–500 juta, memerlukan agunan tambahan. Ditujukan untuk UMKM yang sudah berkembang dan butuh modal lebih besar.</li>
  <li><strong>KUR TKI:</strong> Plafon hingga Rp 25 juta untuk membiayai penempatan Tenaga Kerja Indonesia di luar negeri.</li>
</ul>

<h2>Syarat Pengajuan KUR</h2>
<p>
  Secara umum, syarat mengajukan KUR adalah: usaha sudah berjalan minimal 6 bulan, memiliki
  KTP dan KK, memiliki surat izin usaha (bisa surat keterangan dari kelurahan), dan belum
  pernah menerima kredit perbankan (kecuali KUR sebelumnya, tabungan, atau kredit konsumtif
  seperti KPR dan kendaraan bermotor).
</p>

<h2>Keunggulan KUR Dibanding Pinjaman Komersial</h2>
<p>
  Keunggulan utama KUR adalah suku bunga yang sangat rendah — hanya 6% efektif per tahun,
  jauh di bawah bunga kredit komersial (12–24%) atau pinjaman online (bisa ratusan persen per tahun).
  Selain itu, KUR Mikro tidak memerlukan agunan tambahan sehingga lebih mudah diakses.
</p>
<p>
  Dengan bunga yang rendah, cicilan KUR jauh lebih terjangkau. Misalnya, pinjaman Rp 25 juta
  dengan tenor 3 tahun hanya membutuhkan cicilan sekitar Rp 760 ribu per bulan. Bandingkan
  dengan pinjol yang bisa memakan cicilan berkali-kali lipat untuk jumlah yang sama.
</p>

<h2>Cara Mengajukan KUR</h2>
<p>
  Langkah-langkah pengajuan KUR: (1) Siapkan dokumen — KTP, KK, surat izin usaha atau keterangan
  usaha dari kelurahan. (2) Datangi bank penyalur KUR terdekat. (3) Isi formulir pengajuan dan
  lampirkan dokumen. (4) Bank akan melakukan survei usaha. (5) Jika disetujui, pencairan
  dilakukan ke rekening Anda.
</p>
<p>
  Gunakan kalkulator KUR di atas untuk simulasi cicilan sebelum mengajukan. Pilih jenis KUR,
  masukkan jumlah pinjaman dan tenor yang diinginkan, lalu lihat estimasi cicilan bulanannya.
</p>
`,

  methodSection: [
    {
      label: 'Dasar Kebijakan KUR',
      source: 'Permenko No. 1 Tahun 2023 tentang Kebijakan Pembiayaan Kredit Usaha Rakyat',
    },
    {
      label: 'Pedoman Pelaksanaan KUR',
      source: 'Kepmenko No. 12 Tahun 2023 tentang Pedoman Pelaksanaan KUR',
    },
  ],

  relatedCalculators: ['pinjol', 'investasi'],
};
