import type { CalculatorConfig } from '@/types/calculator';
import { formatIDR } from '@/utils/formatCurrency';
import { zakatMal } from '@/utils/financialFormulas';

const GOLD_PRICE_FALLBACK = 1_100_000; // Rp per gram — static fallback
const NISAB_GOLD_GRAMS = 85;

export const zakat: CalculatorConfig = {
  slug: 'zakat',
  title: 'Kalkulator Zakat Maal',
  description:
    'Hitung zakat maal berdasarkan nisab emas 85 gram, total aset, dan utang. Sesuai Fatwa MUI dan pedoman BAZNAS.',
  metaDescription:
    'Kalkulator zakat maal online — hitung zakat harta berdasarkan nisab 85 gram emas, aset, dan utang. Sesuai fatwa MUI. Gratis & akurat.',
  keywords: [
    'kalkulator zakat',
    'zakat maal',
    'hitung zakat',
    'nisab zakat',
    'zakat harta',
    'zakat emas',
    'baznas',
  ],
  category: 'Pajak & Zakat',
  icon: 'heart',
  order: 9,

  inputs: [
    {
      name: 'emasGram',
      label: 'Emas yang Dimiliki',
      type: 'number',
      inputMode: 'decimal',
      suffix: 'gram',
      defaultValue: 0,
      min: 0,
      max: 100_000,
      helpText: 'Total berat emas yang Anda miliki',
    },
    {
      name: 'hargaEmas',
      label: 'Harga Emas per Gram',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: GOLD_PRICE_FALLBACK,
      min: 100_000,
      max: 10_000_000,
      helpText: 'Harga emas hari ini (cek harga terbaru di Antam/Pegadaian)',
    },
    {
      name: 'asetLain',
      label: 'Aset Lain (tabungan, investasi, dll.)',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 50_000_000,
      min: 0,
      helpText: 'Total tabungan, deposito, investasi, piutang, dan aset produktif lainnya',
    },
    {
      name: 'utang',
      label: 'Total Utang / Kewajiban',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 0,
      min: 0,
      helpText: 'Utang yang jatuh tempo dalam waktu dekat',
    },
  ],

  calculate: (values) => {
    const emasGram = Number(values.emasGram) || 0;
    const hargaEmas = Number(values.hargaEmas) || GOLD_PRICE_FALLBACK;
    const asetLain = Number(values.asetLain) || 0;
    const utang = Number(values.utang) || 0;

    const nilaiEmas = emasGram * hargaEmas;
    const totalAset = nilaiEmas + asetLain;
    const nisab = NISAB_GOLD_GRAMS * hargaEmas;

    const result = zakatMal(totalAset, utang, nisab);

    return {
      nilaiEmas: Math.round(nilaiEmas),
      totalAset: Math.round(totalAset),
      utang: Math.round(utang),
      nisab: Math.round(nisab),
      hartaBersih: Math.round(result.totalWealth),
      isAboveNisab: result.isAboveNisab ? 'Ya' : 'Tidak',
      zakatAmount: Math.round(result.zakatAmount),
      hargaEmas,
    };
  },

  formatResult: (r) => ({
    primary: {
      label: 'Zakat yang Harus Dibayar',
      value: formatIDR(Number(r.zakatAmount)),
    },
    breakdown: [
      { label: 'Nilai Emas', value: formatIDR(Number(r.nilaiEmas)) },
      { label: 'Aset Lain', value: formatIDR(Number(r.totalAset) - Number(r.nilaiEmas)) },
      { label: 'Total Aset', value: formatIDR(Number(r.totalAset)) },
      { label: 'Total Utang', value: formatIDR(Number(r.utang)) },
      { label: 'Harta Bersih', value: formatIDR(Number(r.hartaBersih)) },
      {
        label: `Nisab (85g × ${formatIDR(Number(r.hargaEmas))})`,
        value: formatIDR(Number(r.nisab)),
      },
      { label: 'Mencapai Nisab?', value: String(r.isAboveNisab) },
      { label: 'Zakat (2,5%)', value: formatIDR(Number(r.zakatAmount)) },
    ],
  }),

  faqs: [
    {
      question: 'Apa itu zakat maal dan siapa yang wajib membayar?',
      answer:
        'Zakat maal adalah zakat atas harta kekayaan yang wajib dikeluarkan oleh setiap Muslim yang hartanya sudah mencapai nisab (batas minimum) dan sudah dimiliki selama satu tahun (haul). Besarannya adalah 2,5% dari harta bersih setelah dikurangi utang.',
    },
    {
      question: 'Berapa nisab zakat maal?',
      answer:
        'Nisab zakat maal setara dengan 85 gram emas murni. Jika harga emas Rp 1.100.000/gram, maka nisab = 85 × Rp 1.100.000 = Rp 93.500.000. Harta bersih Anda harus mencapai atau melebihi nisab ini untuk wajib zakat.',
    },
    {
      question: 'Apa saja harta yang termasuk dalam perhitungan zakat?',
      answer:
        'Harta yang dihitung meliputi: uang tunai dan tabungan, deposito, emas dan perak, investasi (saham, reksa dana, obligasi), piutang yang dapat ditagih, barang dagangan, dan hasil usaha. Harta untuk kebutuhan pokok (rumah tinggal, kendaraan operasional) umumnya tidak dihitung.',
    },
    {
      question: 'Kemana sebaiknya menyalurkan zakat?',
      answer:
        'Zakat dapat disalurkan melalui lembaga resmi seperti BAZNAS, LAZ (Lembaga Amil Zakat) yang terdaftar, atau masjid yang terpercaya. Terdapat 8 golongan penerima zakat (asnaf): fakir, miskin, amil, muallaf, riqab, gharimin, fi sabilillah, dan ibnu sabil.',
    },
    {
      question: 'Apakah zakat bisa mengurangi pajak penghasilan?',
      answer:
        'Ya. Berdasarkan UU No. 23 Tahun 2011 tentang Pengelolaan Zakat dan PP No. 60 Tahun 2010, zakat yang dibayarkan melalui badan/lembaga resmi (BAZNAS/LAZ) dapat dijadikan pengurang penghasilan bruto dalam perhitungan PPh. Simpan bukti pembayaran zakat dari lembaga resmi.',
    },
  ],

  seoContent: `
<h2>Panduan Menghitung Zakat Maal yang Benar</h2>
<p>
  Zakat maal merupakan salah satu rukun Islam yang wajib ditunaikan oleh setiap Muslim yang
  hartanya telah mencapai nisab dan haul. Kewajiban ini bukan sekadar ritual ibadah, tetapi
  juga instrumen keadilan sosial yang membantu mendistribusikan kekayaan kepada yang membutuhkan.
</p>

<h2>Syarat Wajib Zakat Maal</h2>
<p>
  Ada dua syarat utama kewajiban zakat maal:
</p>
<ul>
  <li><strong>Nisab:</strong> Harta bersih (setelah dikurangi utang) harus mencapai atau melebihi nilai 85 gram emas murni. Nisab dihitung berdasarkan harga emas terkini.</li>
  <li><strong>Haul:</strong> Harta tersebut sudah dimiliki selama satu tahun hijriah (sekitar 354 hari) secara penuh.</li>
</ul>
<p>
  Jika kedua syarat terpenuhi, maka wajib mengeluarkan zakat sebesar <strong>2,5%</strong>
  dari total harta bersih.
</p>

<h2>Cara Menghitung Zakat Maal</h2>
<p>
  Langkah perhitungannya sederhana:
</p>
<ul>
  <li>Jumlahkan semua harta yang wajib dizakati: tabungan, deposito, emas, investasi, piutang, dan barang dagangan.</li>
  <li>Kurangi dengan utang dan kewajiban yang jatuh tempo.</li>
  <li>Bandingkan hasilnya dengan nisab (85 gram emas × harga emas hari ini).</li>
  <li>Jika harta bersih ≥ nisab, keluarkan zakat 2,5% dari harta bersih.</li>
</ul>

<h2>Harga Emas dan Nisab</h2>
<p>
  Nisab zakat maal selalu dikaitkan dengan harga emas karena emas merupakan standar yang
  stabil dan universal. Harga emas berfluktuasi, sehingga nisab juga berubah mengikuti
  harga pasar. Kalkulator ini memungkinkan Anda memasukkan harga emas terkini agar
  perhitungan lebih akurat. Anda bisa mengecek harga emas hari ini di situs Antam atau
  Pegadaian.
</p>

<h2>Zakat sebagai Pengurang Pajak</h2>
<p>
  Tahukah Anda bahwa zakat maal yang dibayarkan melalui lembaga resmi (BAZNAS atau LAZ berizin)
  dapat menjadi pengurang penghasilan bruto untuk perhitungan PPh? Ini diatur dalam UU Pengelolaan
  Zakat dan PP No. 60 Tahun 2010. Pastikan Anda meminta bukti pembayaran zakat dari lembaga
  resmi untuk dilampirkan saat pelaporan pajak.
</p>

<h2>Perbedaan Zakat Maal dan Zakat Fitrah</h2>
<p>
  Zakat maal dikeluarkan atas harta kekayaan kapan saja selama haul terpenuhi. Sedangkan zakat
  fitrah wajib dikeluarkan di bulan Ramadan sebelum shalat Idul Fitri, besarannya setara 2,5 kg
  atau 3,5 liter bahan makanan pokok. Keduanya memiliki hukum dan ketentuan yang berbeda.
</p>
<p>
  Gunakan kalkulator zakat di atas untuk menghitung zakat maal Anda secara akurat. Masukkan
  data harta dan utang, pastikan harga emas sesuai kondisi terkini, dan ketahui apakah Anda
  sudah wajib menunaikan zakat beserta besarannya.
</p>
`,

  methodSection: [
    {
      label: 'Dasar Hukum Zakat',
      source: 'Fatwa MUI No. 3 Tahun 2003 tentang Zakat Penghasilan',
      url: 'https://mui.or.id/produk/fatwa/',
    },
    {
      label: 'Panduan Zakat BAZNAS',
      source: 'BAZNAS — Badan Amil Zakat Nasional RI',
      url: 'https://baznas.go.id/zakatmaal',
    },
    {
      label: 'Zakat sebagai Pengurang Pajak',
      source: 'UU No. 23 Tahun 2011 tentang Pengelolaan Zakat & PP No. 60 Tahun 2010',
    },
  ],

  relatedCalculators: ['pph21', 'investasi'],
};
