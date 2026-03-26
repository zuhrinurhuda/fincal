import type { CalculatorConfig } from '@/types/calculator';
import { formatIDR } from '@/utils/formatCurrency';
import { extraPaymentSimulation } from '@/utils/financialFormulas';

export const pelunasanKpr: CalculatorConfig = {
  slug: 'pelunasan-kpr',
  title: 'Kalkulator Pelunasan KPR Dipercepat',
  description:
    'Simulasi pelunasan KPR lebih cepat dengan extra payment — lihat berapa bulan lebih cepat lunas dan berapa bunga yang dihemat.',
  metaDescription:
    'Kalkulator pelunasan KPR dipercepat — hitung penghematan bunga dan percepatan tenor dengan extra payment bulanan. Gratis & akurat.',
  keywords: [
    'pelunasan kpr dipercepat',
    'kalkulator pelunasan kpr',
    'extra payment kpr',
    'simulasi pelunasan',
    'hemat bunga kpr',
    'prepayment kpr',
  ],
  category: 'Kredit',
  icon: 'rocket',
  order: 10,

  inputs: [
    {
      name: 'sisaPokok',
      label: 'Sisa Pokok Pinjaman',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 300_000_000,
      min: 1_000_000,
      max: 50_000_000_000,
      helpText: 'Sisa pokok KPR yang belum dilunasi',
    },
    {
      name: 'sukuBunga',
      label: 'Suku Bunga Saat Ini',
      type: 'percentage',
      suffix: '% / tahun',
      inputMode: 'decimal',
      defaultValue: 10,
      min: 0,
      max: 30,
      helpText: 'Suku bunga efektif tahunan KPR saat ini',
    },
    {
      name: 'sisaTenor',
      label: 'Sisa Tenor',
      type: 'select',
      suffix: 'tahun',
      defaultValue: 15,
      options: [
        { label: '5 tahun', value: 5 },
        { label: '8 tahun', value: 8 },
        { label: '10 tahun', value: 10 },
        { label: '12 tahun', value: 12 },
        { label: '15 tahun', value: 15 },
        { label: '18 tahun', value: 18 },
        { label: '20 tahun', value: 20 },
        { label: '25 tahun', value: 25 },
      ],
    },
    {
      name: 'extraPayment',
      label: 'Extra Payment per Bulan',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 1_000_000,
      min: 0,
      max: 10_000_000_000,
      helpText: 'Tambahan pembayaran di luar cicilan pokok per bulan',
    },
  ],

  calculate: (values) => {
    const sisaPokok = Number(values.sisaPokok) || 0;
    const sukuBunga = Number(values.sukuBunga) || 0;
    const sisaTenorTahun = Number(values.sisaTenor) || 15;
    const extraPerBulan = Number(values.extraPayment) || 0;

    const sisaTenorBulan = sisaTenorTahun * 12;

    const sim = extraPaymentSimulation(sisaPokok, sukuBunga, sisaTenorBulan, extraPerBulan);

    const cicilanNormal = sim.normalSchedule.length > 0 ? sim.normalSchedule[0].payment : 0;
    const cicilanDenganExtra = cicilanNormal + extraPerBulan;

    return {
      sisaPokok,
      cicilanNormal: Math.round(cicilanNormal),
      cicilanDenganExtra: Math.round(cicilanDenganExtra),
      tenorNormal: sim.normalTenorMonths,
      tenorDipercepat: sim.acceleratedTenorMonths,
      bulanLebihCepat: sim.monthsSaved,
      bungaNormal: Math.round(sim.normalTotalInterest),
      bungaDipercepat: Math.round(sim.acceleratedTotalInterest),
      penghematanBunga: Math.round(sim.interestSaved),
      extraPerBulan,
    };
  },

  formatResult: (r) => ({
    primary: {
      label: 'Penghematan Bunga',
      value: formatIDR(Number(r.penghematanBunga)),
    },
    breakdown: [
      { label: 'Sisa Pokok', value: formatIDR(Number(r.sisaPokok)) },
      { label: 'Cicilan Normal', value: `${formatIDR(Number(r.cicilanNormal))}/bulan` },
      { label: 'Cicilan + Extra', value: `${formatIDR(Number(r.cicilanDenganExtra))}/bulan` },
      { label: 'Tenor Normal', value: `${r.tenorNormal} bulan` },
      { label: 'Tenor Dipercepat', value: `${r.tenorDipercepat} bulan` },
      { label: 'Lebih Cepat Lunas', value: `${r.bulanLebihCepat} bulan` },
      { label: 'Total Bunga (normal)', value: formatIDR(Number(r.bungaNormal)) },
      { label: 'Total Bunga (dipercepat)', value: formatIDR(Number(r.bungaDipercepat)) },
      { label: 'Penghematan Bunga', value: formatIDR(Number(r.penghematanBunga)) },
    ],
  }),

  faqs: [
    {
      question: 'Apakah pelunasan KPR dipercepat itu menguntungkan?',
      answer:
        'Ya, sangat menguntungkan. Dengan melakukan extra payment setiap bulan, Anda mengurangi sisa pokok lebih cepat, sehingga total bunga yang harus dibayar berkurang signifikan. Semakin awal Anda melakukan extra payment, semakin besar penghematannya karena di awal masa kredit, porsi bunga dalam cicilan sangat besar.',
    },
    {
      question: 'Apakah ada penalti pelunasan KPR dipercepat?',
      answer:
        'Sebagian bank mengenakan penalti prepayment sebesar 1–3% dari sisa pokok atau dari jumlah yang dilunasi lebih awal. Biasanya penalti ini berlaku jika pelunasan dilakukan dalam 3–5 tahun pertama masa kredit. Cek perjanjian kredit Anda untuk detailnya.',
    },
    {
      question: 'Lebih baik menambah cicilan bulanan atau melunasi sekaligus?',
      answer:
        'Keduanya menguntungkan, tergantung kondisi keuangan. Menambah cicilan bulanan (extra payment rutin) cocok jika Anda punya penghasilan stabil lebih. Pelunasan sekaligus (lump sum) cocok jika mendapat dana besar seperti bonus tahunan atau warisan. Kalkulator ini mensimulasikan skenario extra payment rutin.',
    },
    {
      question: 'Berapa extra payment yang ideal?',
      answer:
        'Tidak ada angka pasti — tergantung kemampuan finansial Anda. Bahkan tambahan Rp 500.000–1.000.000 per bulan bisa memberikan penghematan puluhan hingga ratusan juta rupiah dalam jangka panjang. Pastikan extra payment tidak mengganggu dana darurat dan kebutuhan lainnya.',
    },
    {
      question: 'Kapan waktu terbaik untuk memulai extra payment?',
      answer:
        'Semakin awal semakin baik. Di tahun-tahun awal KPR, sebagian besar cicilan Anda masuk ke bunga (bukan pokok). Dengan extra payment di awal, Anda mengurangi pokok lebih cepat sehingga bunga di bulan-bulan berikutnya menjadi lebih kecil. Efek penghematannya sangat signifikan jika dimulai sejak dini.',
    },
  ],

  seoContent: `
<h2>Mengapa Pelunasan KPR Dipercepat Penting?</h2>
<p>
  Ketika Anda mengambil KPR dengan tenor panjang (15–30 tahun), total bunga yang dibayar bisa
  melebihi pokok pinjaman itu sendiri. Misalnya, KPR Rp 300 juta dengan bunga 10% selama 20 tahun
  menghasilkan total bunga sekitar Rp 393 juta — lebih besar dari pinjaman awalnya! Pelunasan
  dipercepat adalah strategi untuk mengurangi beban bunga ini secara signifikan.
</p>

<h2>Cara Kerja Extra Payment</h2>
<p>
  Dalam metode anuitas yang digunakan sebagian besar bank di Indonesia, cicilan bulanan Anda
  tetap, tetapi komposisinya berubah seiring waktu. Di awal masa kredit, sebagian besar cicilan
  masuk ke bunga. Seiring waktu, porsi pokok meningkat.
</p>
<p>
  Ketika Anda melakukan extra payment, seluruh tambahan tersebut langsung memotong sisa pokok.
  Ini mempercepat penurunan saldo dan mengurangi bunga di bulan-bulan berikutnya. Efek
  compounding-nya sangat powerful — tambahan Rp 1 juta per bulan bisa menghemat ratusan juta
  dalam jangka panjang.
</p>

<h2>Contoh Penghematan yang Bisa Dicapai</h2>
<p>
  Bayangkan skenario ini: sisa KPR Rp 300 juta, bunga 10%/tahun, sisa tenor 15 tahun.
  Tanpa extra payment, Anda membayar total bunga sekitar Rp 279 juta. Dengan extra payment
  Rp 1 juta/bulan, tenor bisa turun menjadi sekitar 11 tahun dan total bunga menjadi sekitar
  Rp 189 juta — penghematan Rp 90 juta! Gunakan kalkulator di atas untuk menghitung skenario Anda.
</p>

<h2>Hal yang Perlu Diperhatikan</h2>
<ul>
  <li><strong>Penalti prepayment:</strong> Beberapa bank mengenakan denda pelunasan dini 1–3%. Hitung apakah penghematan bunga masih lebih besar dari penalti.</li>
  <li><strong>Dana darurat:</strong> Pastikan Anda tetap memiliki dana darurat minimal 6 bulan pengeluaran sebelum mengalokasikan dana untuk extra payment.</li>
  <li><strong>Alternatif investasi:</strong> Jika return investasi Anda lebih tinggi dari bunga KPR, mungkin lebih baik menginvestasikan dana ekstra daripada melunasi KPR. Namun, ini tergantung toleransi risiko.</li>
  <li><strong>Komunikasi dengan bank:</strong> Informasikan ke bank bahwa extra payment Anda harus mengurangi pokok (bukan mempercepat jadwal pembayaran berikutnya). Pastikan ini tercatat secara tertulis.</li>
</ul>

<h2>Strategi Pelunasan Cerdas</h2>
<p>
  Ada beberapa strategi yang bisa Anda terapkan. Pertama, alokasikan sebagian bonus tahunan
  atau THR sebagai lump sum payment ke pokok KPR. Kedua, sisihkan kenaikan gaji untuk extra
  payment rutin. Ketiga, jika suku bunga turun, jangan kurangi cicilan — tetap bayar jumlah
  yang sama sehingga porsi ke pokok meningkat.
</p>
<p>
  Pelunasan KPR dipercepat bukan hanya soal menghemat uang — ini soal kebebasan finansial.
  Semakin cepat KPR lunas, semakin cepat Anda bebas dari beban cicilan dan bisa mengalokasikan
  dana untuk tujuan keuangan lainnya.
</p>
`,

  methodSection: [
    {
      label: 'Regulasi Kredit Perbankan',
      source:
        'POJK No. 42/POJK.03/2017 tentang Kewajiban Penyusunan dan Pelaksanaan Kebijakan Perkreditan Bank',
      url: 'https://www.ojk.go.id/id/regulasi/otoritas-jasa-keuangan/peraturan-ojk/Pages/POJK-Nomor-42-POJK.03-2017.aspx',
    },
  ],

  relatedCalculators: ['kpr', 'investasi'],
};
