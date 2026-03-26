import type { CalculatorConfig } from '@/types/calculator';
import { formatIDR } from '@/utils/formatCurrency';
import { compoundInterest } from '@/utils/financialFormulas';

export const investasi: CalculatorConfig = {
  slug: 'investasi',
  title: 'Kalkulator Investasi',
  description:
    'Simulasi pertumbuhan investasi dengan bunga majemuk (compound interest), setoran bulanan, dan breakdown per tahun.',
  metaDescription:
    'Kalkulator investasi compound interest — simulasi pertumbuhan modal dengan setoran bulanan dan return tahunan. Gratis & akurat.',
  keywords: [
    'kalkulator investasi',
    'compound interest',
    'simulasi investasi',
    'bunga majemuk',
    'kalkulator reksadana',
    'return investasi',
  ],
  category: 'Investasi',
  icon: 'trending-up',
  order: 7,

  inputs: [
    {
      name: 'modalAwal',
      label: 'Modal Awal',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 10_000_000,
      min: 0,
      max: 100_000_000_000,
      helpText: 'Dana awal yang diinvestasikan',
    },
    {
      name: 'setoranBulanan',
      label: 'Setoran Bulanan',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 1_000_000,
      min: 0,
      max: 1_000_000_000,
      helpText: 'Jumlah yang diinvestasikan setiap bulan',
    },
    {
      name: 'returnTahunan',
      label: 'Return per Tahun',
      type: 'percentage',
      suffix: '%',
      inputMode: 'decimal',
      defaultValue: 10,
      min: 0,
      max: 100,
      helpText: 'Estimasi return rata-rata per tahun',
    },
    {
      name: 'tenor',
      label: 'Jangka Waktu',
      type: 'select',
      suffix: 'tahun',
      defaultValue: 10,
      options: [
        { label: '1 tahun', value: 1 },
        { label: '3 tahun', value: 3 },
        { label: '5 tahun', value: 5 },
        { label: '10 tahun', value: 10 },
        { label: '15 tahun', value: 15 },
        { label: '20 tahun', value: 20 },
        { label: '25 tahun', value: 25 },
        { label: '30 tahun', value: 30 },
      ],
    },
  ],

  calculate: (values) => {
    const modalAwal = Number(values.modalAwal) || 0;
    const setoranBulanan = Number(values.setoranBulanan) || 0;
    const returnTahunan = Number(values.returnTahunan) || 0;
    const tenor = Number(values.tenor) || 10;

    const rows = compoundInterest(modalAwal, setoranBulanan, returnTahunan, tenor);
    const lastRow = rows[rows.length - 1];

    const nilaiAkhir = lastRow?.balance ?? modalAwal;
    const totalModal = lastRow?.totalDeposited ?? modalAwal;
    const totalKeuntungan = lastRow?.interestEarned ?? 0;

    return {
      nilaiAkhir: Math.round(nilaiAkhir),
      totalModal: Math.round(totalModal),
      totalKeuntungan: Math.round(totalKeuntungan),
      returnTahunan,
      tenor,
      modalAwal,
      setoranBulanan,
    };
  },

  formatResult: (r) => ({
    primary: {
      label: 'Nilai Akhir Investasi',
      value: formatIDR(Number(r.nilaiAkhir)),
    },
    breakdown: [
      { label: 'Modal Awal', value: formatIDR(Number(r.modalAwal)) },
      { label: 'Setoran Bulanan', value: formatIDR(Number(r.setoranBulanan)) },
      { label: 'Total Modal Disetor', value: formatIDR(Number(r.totalModal)) },
      { label: 'Total Keuntungan', value: formatIDR(Number(r.totalKeuntungan)) },
      { label: 'Nilai Akhir Investasi', value: formatIDR(Number(r.nilaiAkhir)) },
      { label: 'Return per Tahun', value: `${r.returnTahunan}%` },
      { label: 'Jangka Waktu', value: `${r.tenor} tahun` },
    ],
  }),

  faqs: [
    {
      question: 'Apa itu compound interest (bunga majemuk)?',
      answer:
        'Compound interest atau bunga majemuk adalah bunga yang dihitung tidak hanya dari pokok investasi, tetapi juga dari bunga yang sudah terkumpul sebelumnya. Efeknya, pertumbuhan investasi menjadi eksponensial — semakin lama berinvestasi, semakin cepat uang Anda bertumbuh.',
    },
    {
      question: 'Berapa return investasi yang realistis?',
      answer:
        'Return investasi bergantung pada instrumen. Deposito: 3–5%/tahun. Obligasi: 6–8%/tahun. Reksa dana campuran: 8–12%/tahun. Saham (indeks): 10–15%/tahun dalam jangka panjang. Angka-angka ini adalah rata-rata historis dan bukan jaminan return di masa depan.',
    },
    {
      question: 'Lebih penting mana: modal awal besar atau setoran rutin?',
      answer:
        'Dalam jangka panjang, konsistensi setoran bulanan sering kali lebih berpengaruh daripada modal awal. Seseorang yang menyetor Rp 1 juta/bulan selama 20 tahun dengan return 10% bisa mengumpulkan lebih dari Rp 700 juta — meski modal awalnya kecil. Kunci utamanya adalah konsistensi dan waktu.',
    },
    {
      question: 'Apakah return investasi sudah pasti sesuai simulasi?',
      answer:
        'Tidak. Kalkulator ini menggunakan return tetap (fixed rate) sebagai simulasi. Pada kenyataannya, return investasi berfluktuasi setiap tahun, terutama untuk instrumen berisiko tinggi seperti saham. Simulasi ini berguna sebagai gambaran potensi, bukan jaminan hasil.',
    },
    {
      question: 'Kapan waktu terbaik untuk mulai berinvestasi?',
      answer:
        'Sekarang. Berkat compound interest, semakin cepat Anda mulai, semakin besar efek pertumbuhannya. Perbedaan memulai investasi di usia 25 vs 35 bisa sangat signifikan — walaupun jumlah setoran yang sama, 10 tahun ekstra bisa menggandakan hasil akhir.',
    },
  ],

  seoContent: `
<h2>Kekuatan Compound Interest dalam Investasi</h2>
<p>
  Albert Einstein pernah menyebut compound interest sebagai "keajaiban dunia kedelapan."
  Prinsipnya sederhana: bunga menghasilkan bunga. Uang yang Anda investasikan tidak hanya
  tumbuh dari modal awal, tetapi juga dari keuntungan yang sudah dihasilkan sebelumnya.
  Efek ini semakin kuat seiring waktu.
</p>

<h2>Cara Kerja Kalkulator Investasi Ini</h2>
<p>
  Kalkulator ini mensimulasikan pertumbuhan investasi menggunakan formula compound interest
  dengan setoran bulanan. Anda memasukkan modal awal, setoran rutin per bulan, estimasi
  return per tahun, dan jangka waktu investasi. Hasilnya menampilkan proyeksi nilai akhir
  investasi, total modal yang disetor, dan total keuntungan yang dihasilkan.
</p>

<h2>Memilih Instrumen Investasi yang Tepat</h2>
<p>
  Indonesia memiliki beragam instrumen investasi yang bisa dipilih sesuai profil risiko:
</p>
<ul>
  <li><strong>Deposito:</strong> Aman, dijamin LPS hingga Rp 2 miliar. Return 3–5%/tahun.</li>
  <li><strong>Obligasi Negara (SBN):</strong> Dijamin pemerintah, return 6–7%/tahun.</li>
  <li><strong>Reksa Dana:</strong> Dikelola manajer investasi, return bervariasi 5–15%/tahun tergantung jenis.</li>
  <li><strong>Saham:</strong> Potensi return tinggi (10–20%/tahun jangka panjang) tetapi volatil.</li>
  <li><strong>Emas:</strong> Lindung nilai terhadap inflasi, cocok untuk diversifikasi.</li>
</ul>

<h2>Pentingnya Mulai Sejak Dini</h2>
<p>
  Waktu adalah faktor paling krusial dalam investasi. Bayangkan dua orang: A mulai investasi
  Rp 1 juta/bulan di usia 25 tahun, dan B mulai jumlah yang sama di usia 35 tahun. Keduanya
  pensiun di usia 55 tahun dengan return 10%/tahun.
</p>
<p>
  A berinvestasi selama 30 tahun dan memiliki sekitar <strong>Rp 2,3 miliar</strong>.
  B berinvestasi selama 20 tahun dan memiliki sekitar <strong>Rp 760 juta</strong>.
  Perbedaannya lebih dari 3 kali lipat — padahal A hanya menambah 10 tahun lebih awal.
</p>

<h2>Tips Investasi untuk Pemula</h2>
<p>
  Pertama, sisihkan minimal 10–20% penghasilan untuk investasi setiap bulan. Kedua, diversifikasi —
  jangan taruh semua dana di satu instrumen. Ketiga, investasi secara rutin (dollar cost averaging)
  untuk mengurangi risiko timing pasar. Keempat, pahami bahwa investasi jangka panjang cenderung
  memberikan hasil yang lebih baik dan stabil dibanding spekulasi jangka pendek.
</p>
<p>
  Gunakan kalkulator investasi di atas untuk mensimulasikan berbagai skenario dan merencanakan
  target keuangan Anda, baik untuk dana pensiun, pendidikan anak, atau tujuan finansial lainnya.
</p>
`,

  methodSection: [
    {
      label: 'Literasi Keuangan dan Investasi',
      source: 'OJK — Panduan Investasi untuk Masyarakat',
      url: 'https://sikapiuangmu.ojk.go.id/FrontEnd/CMS/Category/63',
    },
  ],

  relatedCalculators: ['reksa-dana', 'zakat'],
};
