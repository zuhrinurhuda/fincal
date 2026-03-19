import type { CalculatorConfig } from "@/types/calculator";
import { formatIDR } from "@/utils/formatCurrency";
import { flatToEffectiveRate } from "@/utils/financialFormulas";

export const kreditMobil: CalculatorConfig = {
  slug: "kredit-mobil",
  title: "Kalkulator Kredit Mobil",
  description:
    "Simulasi cicilan kredit mobil dengan bunga flat, perbandingan bunga efektif, opsi asuransi TLO & All Risk.",
  metaDescription:
    "Kalkulator kredit mobil online — simulasi cicilan, total bunga flat vs efektif, dan asuransi. Bandingkan tenor & DP. Gratis & akurat.",
  keywords: [
    "kalkulator kredit mobil",
    "simulasi cicilan mobil",
    "kredit mobil murah",
    "bunga flat mobil",
    "leasing mobil",
    "dp kredit mobil",
  ],

  inputs: [
    {
      name: "hargaOtr",
      label: "Harga OTR Mobil",
      type: "amount",
      prefix: "Rp",
      defaultValue: 250_000_000,
      min: 50_000_000,
      max: 5_000_000_000,
      helpText: "Harga On The Road kendaraan",
    },
    {
      name: "dpPersen",
      label: "Uang Muka (DP)",
      type: "percentage",
      suffix: "%",
      inputMode: "decimal",
      defaultValue: 20,
      min: 0,
      max: 100,
      helpText: "Minimal 20–30% untuk mobil baru",
    },
    {
      name: "tenor",
      label: "Tenor",
      type: "select",
      suffix: "bulan",
      defaultValue: 48,
      options: [
        { label: "12 bulan (1 tahun)", value: 12 },
        { label: "24 bulan (2 tahun)", value: 24 },
        { label: "36 bulan (3 tahun)", value: 36 },
        { label: "48 bulan (4 tahun)", value: 48 },
        { label: "60 bulan (5 tahun)", value: 60 },
        { label: "72 bulan (6 tahun)", value: 72 },
        { label: "84 bulan (7 tahun)", value: 84 },
      ],
    },
    {
      name: "bungaFlat",
      label: "Suku Bunga Flat",
      type: "percentage",
      suffix: "% / tahun",
      inputMode: "decimal",
      defaultValue: 5,
      min: 0,
      max: 30,
      helpText: "Bunga flat per tahun yang ditawarkan leasing",
    },
    {
      name: "asuransi",
      label: "Asuransi",
      type: "select",
      defaultValue: 2,
      options: [
        { label: "Tanpa Asuransi", value: 0 },
        { label: "TLO (Total Loss Only)", value: 1 },
        { label: "All Risk (Comprehensive)", value: 2 },
      ],
    },
  ],

  calculate: (values) => {
    const harga = Number(values.hargaOtr) || 0;
    const dpPersen = Number(values.dpPersen) || 0;
    const tenor = Number(values.tenor) || 48;
    const bungaFlat = Number(values.bungaFlat) || 0;
    const asuransiType = Number(values.asuransi) || 0;

    const dp = Math.round(harga * dpPersen / 100);
    const pokokKredit = harga - dp;

    const bungaBulanan = pokokKredit * (bungaFlat / 100) / 12;
    const totalBunga = bungaBulanan * tenor;
    const cicilanPerBulan = Math.round((pokokKredit + totalBunga) / tenor);
    const totalPembayaran = cicilanPerBulan * tenor;

    const bungaEfektif = tenor > 0 ? flatToEffectiveRate(bungaFlat, tenor) : 0;

    // Insurance: TLO ~0.5%/year, All Risk ~2.5%/year of vehicle price (mobil)
    const insuranceRates: Record<number, number> = { 0: 0, 1: 0.005, 2: 0.025 };
    const tahun = tenor / 12;
    const biayaAsuransi = Math.round(harga * (insuranceRates[asuransiType] ?? 0) * tahun);

    return {
      dp,
      pokokKredit,
      cicilanPerBulan,
      totalBunga: Math.round(totalBunga),
      totalPembayaran,
      bungaFlat,
      bungaEfektif,
      biayaAsuransi,
      totalDenganAsuransi: totalPembayaran + dp + biayaAsuransi,
      tenor,
    };
  },

  formatResult: (r) => ({
    primary: {
      label: "Cicilan per Bulan",
      value: `${formatIDR(Number(r.cicilanPerBulan))}/bulan`,
    },
    breakdown: [
      { label: "Uang Muka (DP)", value: formatIDR(Number(r.dp)) },
      { label: "Pokok Kredit", value: formatIDR(Number(r.pokokKredit)) },
      { label: "Cicilan per Bulan", value: formatIDR(Number(r.cicilanPerBulan)) },
      { label: "Total Bunga", value: formatIDR(Number(r.totalBunga)) },
      { label: "Total Pembayaran Kredit", value: formatIDR(Number(r.totalPembayaran)) },
      { label: "Bunga Flat", value: `${r.bungaFlat}% / tahun` },
      { label: "Bunga Efektif", value: `${r.bungaEfektif}% / tahun` },
      { label: "Biaya Asuransi", value: formatIDR(Number(r.biayaAsuransi)) },
      { label: "Total Biaya Keseluruhan", value: formatIDR(Number(r.totalDenganAsuransi)) },
    ],
  }),

  faqs: [
    {
      question: "Berapa DP minimal untuk kredit mobil baru?",
      answer:
        "Berdasarkan ketentuan OJK, DP minimal kredit mobil baru untuk kendaraan non-produktif adalah 20–25% dari harga OTR. Beberapa leasing menawarkan DP lebih rendah melalui program khusus, tetapi cicilan dan bunga totalnya akan lebih tinggi.",
    },
    {
      question: "Apa bedanya bunga flat dan bunga efektif pada kredit mobil?",
      answer:
        "Bunga flat menghitung bunga dari seluruh pokok pinjaman awal tanpa memperhitungkan penurunan saldo. Bunga efektif menghitung bunga dari sisa pokok yang menurun setiap bulan. Bunga flat 5%/tahun setara dengan bunga efektif sekitar 9–10%/tahun.",
    },
    {
      question: "Apakah lebih baik memilih asuransi TLO atau All Risk?",
      answer:
        "Untuk mobil baru hingga usia 3 tahun, All Risk lebih disarankan karena menanggung semua jenis kerusakan termasuk baret, penyok, dan kecelakaan ringan. Setelah usia 3 tahun, Anda bisa beralih ke TLO yang lebih murah dan hanya menanggung kehilangan atau kerusakan total.",
    },
    {
      question: "Bagaimana cara menghemat biaya kredit mobil?",
      answer:
        "Beberapa strategi: (1) Siapkan DP sebesar mungkin untuk mengurangi pokok kredit, (2) Pilih tenor sesingkat yang mampu Anda bayar, (3) Bandingkan bunga dari beberapa leasing, (4) Negosiasi bunga dan biaya admin, (5) Pertimbangkan membeli di akhir tahun saat dealer sering memberi diskon.",
    },
  ],

  seoContent: `
<h2>Panduan Memilih Kredit Mobil yang Tepat di Indonesia</h2>
<p>
  Memiliki mobil menjadi kebutuhan bagi banyak keluarga Indonesia, terutama di kota-kota besar
  dengan akses transportasi umum yang terbatas. Kredit mobil menjadi solusi untuk memiliki
  kendaraan tanpa harus menyiapkan dana tunai penuh. Namun, memilih skema kredit yang tepat
  sangat penting agar tidak membebani keuangan jangka panjang.
</p>

<h2>Cara Kerja Kredit Mobil di Indonesia</h2>
<p>
  Sebagian besar perusahaan pembiayaan (leasing) di Indonesia menggunakan sistem bunga flat
  untuk kredit kendaraan. Dengan bunga flat, cicilan Anda akan tetap sama setiap bulan selama
  masa kredit. Ini memudahkan perencanaan keuangan, tetapi penting untuk dipahami bahwa bunga
  flat bukan cerminan biaya riil pinjaman.
</p>
<p>
  Misalnya, kredit mobil Rp 200 juta dengan bunga flat 5%/tahun selama 4 tahun. Total bunga
  flat = Rp 200 juta × 5% × 4 = Rp 40 juta. Cicilan = (Rp 200 juta + Rp 40 juta) / 48 bulan
  = Rp 5 juta/bulan. Namun bunga efektifnya sekitar 9–10% per tahun.
</p>

<h2>Faktor yang Mempengaruhi Besar Cicilan</h2>
<ul>
  <li><strong>Harga OTR:</strong> Semakin mahal mobilnya, semakin besar pokok kredit dan cicilan.</li>
  <li><strong>Besaran DP:</strong> DP lebih besar berarti pokok kredit lebih kecil dan cicilan lebih ringan.</li>
  <li><strong>Tenor:</strong> Tenor panjang membuat cicilan kecil tetapi total bunga membengkak.</li>
  <li><strong>Suku bunga:</strong> Sedikit perbedaan bunga bisa berdampak jutaan rupiah pada total pembayaran.</li>
  <li><strong>Asuransi:</strong> All Risk lebih mahal tapi perlindungannya lebih lengkap.</li>
</ul>

<h2>Memahami Total Cost of Ownership</h2>
<p>
  Biaya memiliki mobil tidak hanya cicilan. Pertimbangkan juga: pajak kendaraan tahunan (PKB),
  biaya servis berkala, BBM, tol, parkir, dan perpanjangan STNK. Kalkulator ini membantu Anda
  menghitung komponen kredit — untuk total biaya kepemilikan, tambahkan estimasi biaya operasional
  bulanan.
</p>

<h2>Tenor Ideal untuk Kredit Mobil</h2>
<p>
  Idealnya, pilih tenor yang tidak lebih panjang dari usia pakai kendaraan yang Anda rencanakan.
  Jika berencana ganti mobil dalam 5 tahun, jangan ambil tenor 7 tahun. Tenor 3–5 tahun biasanya
  menjadi pilihan optimal — cukup membuat cicilan terjangkau tanpa bunga yang terlalu membengkak.
</p>
<p>
  Simulasikan berbagai skenario dengan kalkulator kredit mobil di atas untuk menemukan kombinasi
  DP, tenor, dan bunga yang paling sesuai dengan anggaran Anda.
</p>
`,

  methodSection: [
    {
      label: "Ketentuan Pembiayaan Kendaraan",
      source:
        "POJK No. 35/POJK.05/2018 tentang Penyelenggaraan Usaha Perusahaan Pembiayaan",
      url: "https://www.ojk.go.id/id/regulasi/otoritas-jasa-keuangan/peraturan-ojk/Pages/POJK-35-05-2018.aspx",
    },
    {
      label: "Ketentuan DP Kendaraan Bermotor",
      source: "SE OJK No. 47/SEOJK.05/2020 tentang Uang Muka Pembiayaan Kendaraan Bermotor",
    },
  ],

  relatedCalculators: ["kredit-motor", "kpr"],

  partnerLink: "#",
  ctaLabel: "Bandingkan Kredit Mobil",
  ctaDisclaimer: "* Produk dari mitra terpilih",
};
