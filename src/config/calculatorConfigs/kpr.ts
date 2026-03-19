import type { CalculatorConfig } from '@/types/calculator';
import { formatIDR } from '@/utils/formatCurrency';
import { loanAmortization } from '@/utils/financialFormulas';

export const kpr: CalculatorConfig = {
  slug: 'kpr',
  title: 'Kalkulator KPR',
  description:
    'Hitung simulasi cicilan KPR dengan suku bunga fixed dan floating, biaya provisi, dan estimasi biaya akad.',
  metaDescription:
    'Kalkulator KPR online — simulasi cicilan rumah dengan bunga fixed & floating, biaya provisi, estimasi biaya akad. Gratis & akurat.',
  keywords: [
    'kalkulator kpr',
    'simulasi kpr',
    'cicilan rumah',
    'kredit rumah',
    'kpr bank',
    'simulasi kredit rumah',
  ],

  inputs: [
    {
      name: 'hargaProperti',
      label: 'Harga Properti',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 500_000_000,
      min: 50_000_000,
      max: 50_000_000_000,
      helpText: 'Harga jual properti yang ingin dibeli',
    },
    {
      name: 'dpPersen',
      label: 'Uang Muka (DP)',
      type: 'percentage',
      suffix: '%',
      inputMode: 'decimal',
      defaultValue: 20,
      min: 0,
      max: 100,
      helpText: 'Minimal 10–20% dari harga properti',
    },
    {
      name: 'tenor',
      label: 'Tenor',
      type: 'select',
      suffix: 'tahun',
      defaultValue: 20,
      options: [
        { label: '5 tahun', value: 5 },
        { label: '10 tahun', value: 10 },
        { label: '15 tahun', value: 15 },
        { label: '20 tahun', value: 20 },
        { label: '25 tahun', value: 25 },
        { label: '30 tahun', value: 30 },
      ],
    },
    {
      name: 'bungaFixed',
      label: 'Suku Bunga Fixed',
      type: 'percentage',
      suffix: '%',
      inputMode: 'decimal',
      defaultValue: 7,
      min: 0,
      max: 30,
    },
    {
      name: 'masaBungaFixed',
      label: 'Masa Bunga Fixed',
      type: 'select',
      suffix: 'tahun',
      defaultValue: 3,
      options: [
        { label: '1 tahun', value: 1 },
        { label: '2 tahun', value: 2 },
        { label: '3 tahun', value: 3 },
        { label: '5 tahun', value: 5 },
      ],
    },
    {
      name: 'bungaFloating',
      label: 'Suku Bunga Floating',
      type: 'percentage',
      suffix: '%',
      inputMode: 'decimal',
      defaultValue: 10,
      min: 0,
      max: 30,
      helpText: 'Bunga setelah masa fixed berakhir',
    },
    {
      name: 'biayaProvisi',
      label: 'Biaya Provisi',
      type: 'percentage',
      suffix: '%',
      inputMode: 'decimal',
      defaultValue: 1,
      min: 0,
      max: 5,
    },
    {
      name: 'biayaAdmin',
      label: 'Biaya Admin',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 0,
      min: 0,
      helpText: 'Biaya administrasi bank (opsional)',
    },
    {
      name: 'asuransi',
      label: 'Termasuk Asuransi?',
      type: 'select',
      defaultValue: 1,
      options: [
        { label: 'Ya', value: 1 },
        { label: 'Tidak', value: 0 },
      ],
    },
  ],

  calculate: (values) => {
    const harga = Number(values.hargaProperti) || 0;
    const dpPersen = Number(values.dpPersen) || 0;
    const tenor = Number(values.tenor) || 20;
    const bungaFixed = Number(values.bungaFixed) || 0;
    const masaFixed = Number(values.masaBungaFixed) || 3;
    const bungaFloating = Number(values.bungaFloating) || 0;
    const provisiPersen = Number(values.biayaProvisi) || 0;
    const adminFee = Number(values.biayaAdmin) || 0;
    const withInsurance = Number(values.asuransi) === 1;

    const dp = Math.round((harga * dpPersen) / 100);
    const pokokKredit = harga - dp;
    const tenorBulan = tenor * 12;
    const masaFixedBulan = Math.min(masaFixed * 12, tenorBulan);
    const masaFloatingBulan = tenorBulan - masaFixedBulan;

    const fullFixedSchedule = loanAmortization(pokokKredit, bungaFixed, tenorBulan);
    const cicilanFixed = fullFixedSchedule.length > 0 ? fullFixedSchedule[0].payment : 0;

    const sisaPokokAfterFixed =
      masaFixedBulan > 0 && masaFixedBulan <= fullFixedSchedule.length
        ? fullFixedSchedule[masaFixedBulan - 1].remainingBalance
        : 0;

    const floatingSchedule =
      masaFloatingBulan > 0
        ? loanAmortization(sisaPokokAfterFixed, bungaFloating, masaFloatingBulan)
        : [];
    const cicilanFloating = floatingSchedule.length > 0 ? floatingSchedule[0].payment : 0;

    const totalBungaFixed = fullFixedSchedule
      .slice(0, masaFixedBulan)
      .reduce((s, r) => s + r.interest, 0);
    const totalBungaFloating = floatingSchedule.reduce((s, r) => s + r.interest, 0);
    const totalBunga = totalBungaFixed + totalBungaFloating;

    const biayaProvisi = Math.round((pokokKredit * provisiPersen) / 100);
    const biayaAsuransi = withInsurance ? Math.round(pokokKredit * 0.005 * tenor) : 0;
    const biayaAkad = Math.round(pokokKredit * 0.05);
    const totalBiaya = Math.round(totalBunga + biayaProvisi + adminFee + biayaAsuransi);

    return {
      pokokKredit,
      dp,
      cicilanFixed,
      cicilanFloating,
      totalBunga,
      totalBiaya,
      biayaProvisi,
      biayaAsuransi,
      biayaAkad,
      biayaAdmin: adminFee,
      tenorBulan,
      masaFixedBulan,
      masaFloatingBulan,
    };
  },

  formatResult: (r) => ({
    primary: {
      label: 'Cicilan Masa Fixed',
      value: `${formatIDR(Number(r.cicilanFixed))}/bulan`,
    },
    breakdown: [
      { label: 'Pokok Kredit', value: formatIDR(Number(r.pokokKredit)) },
      { label: 'Uang Muka (DP)', value: formatIDR(Number(r.dp)) },
      { label: 'Cicilan Masa Fixed', value: `${formatIDR(Number(r.cicilanFixed))}/bulan` },
      { label: 'Cicilan Masa Floating', value: `${formatIDR(Number(r.cicilanFloating))}/bulan` },
      { label: 'Total Bunga', value: formatIDR(Number(r.totalBunga)) },
      { label: 'Biaya Provisi', value: formatIDR(Number(r.biayaProvisi)) },
      { label: 'Biaya Asuransi', value: formatIDR(Number(r.biayaAsuransi)) },
      { label: 'Estimasi Biaya Akad', value: formatIDR(Number(r.biayaAkad)) },
      { label: 'Total Biaya Kredit', value: formatIDR(Number(r.totalBiaya)) },
    ],
  }),

  faqs: [
    {
      question: 'Berapa minimal DP untuk KPR?',
      answer:
        'Berdasarkan aturan Bank Indonesia, minimal DP untuk KPR rumah pertama berkisar 0–10% tergantung tipe properti dan program bank. Untuk rumah tapak di atas Rp 500 juta, DP minimal biasanya 10–20%. Beberapa program subsidi pemerintah seperti FLPP memungkinkan DP mulai 1%.',
    },
    {
      question: 'Apa bedanya bunga fixed dan floating pada KPR?',
      answer:
        'Bunga fixed adalah suku bunga tetap selama periode tertentu (biasanya 1–5 tahun pertama). Setelah masa fixed berakhir, bunga berubah menjadi floating (mengambang) yang mengikuti suku bunga pasar. Bunga floating umumnya lebih tinggi daripada fixed.',
    },
    {
      question: 'Apa saja biaya yang harus disiapkan saat mengambil KPR?',
      answer:
        'Selain DP, Anda perlu menyiapkan: biaya provisi (0,5–1% dari plafon), biaya administrasi, biaya appraisal, biaya notaris/PPAT, asuransi jiwa dan kebakaran, serta pajak (BPHTB). Total biaya akad bisa mencapai 5–10% dari nilai pinjaman.',
    },
    {
      question: 'Bagaimana cara menghitung cicilan KPR per bulan?',
      answer:
        'Cicilan KPR dihitung dengan metode anuitas, di mana cicilan per bulan tetap selama masa bunga fixed. Rumusnya: Cicilan = P × r × (1+r)^n / ((1+r)^n − 1), di mana P = pokok pinjaman, r = suku bunga per bulan, n = jumlah bulan tenor.',
    },
    {
      question: 'Apakah saya bisa melunasi KPR lebih awal?',
      answer:
        'Ya, Anda bisa melunasi KPR lebih awal (prepayment). Sebagian bank mengenakan penalti pelunasan dini 1–3% dari sisa pokok. Pelunasan dini bisa menghemat biaya bunga secara signifikan, terutama jika dilakukan di tahun-tahun awal masa kredit.',
    },
  ],

  seoContent: `
<h2>Panduan Lengkap Menghitung KPR di Indonesia</h2>
<p>
  Membeli rumah adalah salah satu keputusan finansial terbesar dalam hidup. Kredit Pemilikan Rumah
  (KPR) memungkinkan Anda memiliki hunian impian tanpa harus menyiapkan dana penuh di awal. Namun,
  sebelum mengajukan KPR, penting untuk memahami berapa besar cicilan yang harus dibayar setiap bulan
  dan total biaya yang akan dikeluarkan selama masa kredit.
</p>

<h2>Cara Kerja KPR di Indonesia</h2>
<p>
  Di Indonesia, sebagian besar bank menawarkan skema bunga bertingkat: bunga <strong>fixed</strong>
  untuk periode awal (1–5 tahun), lalu beralih ke bunga <strong>floating</strong> yang mengikuti
  suku bunga pasar. Skema ini membuat cicilan Anda berubah setelah masa fixed berakhir — dan
  biasanya cicilan akan naik.
</p>
<p>
  Kalkulator KPR ini dirancang khusus untuk simulasi dua periode tersebut. Anda bisa melihat
  berapa cicilan di masa fixed, berapa estimasi cicilan di masa floating, dan total biaya kredit
  secara keseluruhan termasuk provisi, asuransi, dan biaya akad.
</p>

<h2>Komponen Biaya KPR yang Perlu Dipahami</h2>
<ul>
  <li><strong>Uang Muka (DP):</strong> Porsi pembayaran di awal, minimal 10–20% dari harga properti.</li>
  <li><strong>Biaya Provisi:</strong> Biaya yang dikenakan bank atas persetujuan kredit, biasanya 0,5–1% dari plafon.</li>
  <li><strong>Biaya Administrasi:</strong> Biaya tetap yang dibebankan bank untuk proses pengajuan.</li>
  <li><strong>Asuransi:</strong> Asuransi jiwa dan kebakaran yang melindungi debitur dan properti selama masa kredit.</li>
  <li><strong>Biaya Akad:</strong> Meliputi biaya notaris, PPAT, cek sertifikat, dan balik nama. Estimasi sekitar 5% dari nilai pinjaman.</li>
</ul>

<h2>Tips Memilih KPR yang Tepat</h2>
<p>
  Pertama, bandingkan penawaran dari beberapa bank. Jangan hanya melihat bunga fixed yang rendah —
  perhatikan juga bunga floating setelah masa fixed habis. Kedua, perhitungkan seluruh biaya, bukan
  hanya cicilan bulanan. Biaya provisi, administrasi, dan asuransi bisa menambah beban secara
  signifikan.
</p>
<p>
  Ketiga, sesuaikan cicilan dengan kemampuan finansial. Idealnya, total cicilan (termasuk utang lain)
  tidak melebihi 30–40% dari penghasilan bersih bulanan. Gunakan kalkulator di atas untuk menguji
  berbagai skenario sebelum memutuskan.
</p>

<h2>Metode Perhitungan Anuitas</h2>
<p>
  Kalkulator ini menggunakan metode anuitas (annuity), yaitu metode perhitungan cicilan yang paling
  umum digunakan bank di Indonesia. Dengan metode ini, cicilan per bulan tetap sama selama periode
  bunga tertentu. Di awal masa kredit, porsi bunga lebih besar dari pokok, lalu secara bertahap
  porsi pokok meningkat seiring waktu.
</p>
<p>
  Rumus anuitas: <strong>M = P × r × (1+r)^n / ((1+r)^n − 1)</strong>, di mana M adalah cicilan bulanan,
  P adalah pokok pinjaman, r adalah suku bunga per bulan, dan n adalah total bulan tenor.
</p>

<h2>Kapan Waktu yang Tepat Mengambil KPR?</h2>
<p>
  Waktu terbaik untuk mengambil KPR adalah saat suku bunga acuan Bank Indonesia (BI Rate) sedang
  rendah, karena bank cenderung menawarkan bunga KPR yang lebih kompetitif. Selain itu, pastikan
  kondisi keuangan Anda stabil — sudah memiliki dana darurat, penghasilan tetap, dan rasio utang
  yang sehat.
</p>
<p>
  Dengan perencanaan yang matang dan simulasi yang akurat, memiliki rumah lewat KPR bisa menjadi
  investasi jangka panjang yang menguntungkan, bukan beban finansial.
</p>
`,

  methodSection: [
    {
      label: 'Dasar Regulasi KPR',
      source:
        'POJK No. 42/POJK.03/2017 tentang Kewajiban Penyusunan dan Pelaksanaan Kebijakan Perkreditan Bank',
      url: 'https://www.ojk.go.id/id/regulasi/otoritas-jasa-keuangan/peraturan-ojk/Pages/POJK-Nomor-42-POJK.03-2017.aspx',
    },
    {
      label: 'Ketentuan LTV KPR',
      source: 'PBI No. 21/13/PBI/2019 tentang Rasio Loan to Value untuk Kredit Properti',
      url: 'https://www.bi.go.id/id/publikasi/peraturan/Pages/PBI-211319.aspx',
    },
  ],

  relatedCalculators: ['pelunasan-kpr', 'kredit-mobil'],

  partnerLink: '#',
  ctaLabel: 'Ajukan KPR Sekarang',
  ctaDisclaimer: '* Produk dari mitra terpilih',
};
