import type { CalculatorConfig } from "@/types/calculator";
import { formatIDR } from "@/utils/formatCurrency";
import { flatToEffectiveRate } from "@/utils/financialFormulas";

export const kreditMotor: CalculatorConfig = {
  slug: "kredit-motor",
  title: "Kalkulator Kredit Motor",
  description:
    "Simulasi cicilan kredit motor dengan perhitungan bunga flat, total pembayaran, dan konversi ke suku bunga efektif.",
  metaDescription:
    "Kalkulator kredit motor online — hitung cicilan bulanan, total bunga, dan bunga efektif. Simulasi dari berbagai tenor dan DP. Gratis.",
  keywords: [
    "kalkulator kredit motor",
    "simulasi cicilan motor",
    "kredit motor murah",
    "cicilan motor",
    "bunga flat motor",
    "leasing motor",
  ],

  inputs: [
    {
      name: "hargaOtr",
      label: "Harga OTR Motor",
      type: "amount",
      prefix: "Rp",
      defaultValue: 25_000_000,
      min: 5_000_000,
      max: 500_000_000,
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
      helpText: "Minimal 15–20% dari harga OTR",
    },
    {
      name: "tenor",
      label: "Tenor",
      type: "select",
      suffix: "bulan",
      defaultValue: 36,
      options: [
        { label: "12 bulan (1 tahun)", value: 12 },
        { label: "18 bulan (1,5 tahun)", value: 18 },
        { label: "24 bulan (2 tahun)", value: 24 },
        { label: "30 bulan (2,5 tahun)", value: 30 },
        { label: "36 bulan (3 tahun)", value: 36 },
        { label: "48 bulan (4 tahun)", value: 48 },
      ],
    },
    {
      name: "bungaFlat",
      label: "Suku Bunga Flat",
      type: "percentage",
      suffix: "% / tahun",
      inputMode: "decimal",
      defaultValue: 8,
      min: 0,
      max: 40,
      helpText: "Bunga flat per tahun yang ditawarkan leasing",
    },
    {
      name: "asuransi",
      label: "Asuransi",
      type: "select",
      defaultValue: 0,
      options: [
        { label: "Tanpa Asuransi", value: 0 },
        { label: "TLO (Total Loss Only)", value: 1 },
        { label: "All Risk", value: 2 },
      ],
    },
  ],

  calculate: (values) => {
    const harga = Number(values.hargaOtr) || 0;
    const dpPersen = Number(values.dpPersen) || 0;
    const tenor = Number(values.tenor) || 36;
    const bungaFlat = Number(values.bungaFlat) || 0;
    const asuransiType = Number(values.asuransi) || 0;

    const dp = Math.round(harga * dpPersen / 100);
    const pokokKredit = harga - dp;

    // Flat rate calculation
    const bungaBulanan = pokokKredit * (bungaFlat / 100) / 12;
    const totalBunga = bungaBulanan * tenor;
    const cicilanPokok = pokokKredit / tenor;
    const cicilanPerBulan = cicilanPokok + bungaBulanan;
    const totalPembayaran = cicilanPerBulan * tenor;

    const bungaEfektif = tenor > 0 ? flatToEffectiveRate(bungaFlat, tenor) : 0;

    // Insurance estimate: TLO ~0.8%/year, All Risk ~2.5%/year of vehicle price
    const insuranceRates: Record<number, number> = { 0: 0, 1: 0.008, 2: 0.025 };
    const tahun = tenor / 12;
    const biayaAsuransi = Math.round(harga * (insuranceRates[asuransiType] ?? 0) * tahun);

    return {
      dp,
      pokokKredit,
      cicilanPerBulan: Math.round(cicilanPerBulan),
      totalBunga: Math.round(totalBunga),
      totalPembayaran: Math.round(totalPembayaran),
      bungaFlat,
      bungaEfektif,
      biayaAsuransi,
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
      { label: "Total Pembayaran", value: formatIDR(Number(r.totalPembayaran)) },
      { label: "Bunga Flat", value: `${r.bungaFlat}% / tahun` },
      { label: "Bunga Efektif", value: `${r.bungaEfektif}% / tahun` },
      { label: "Biaya Asuransi", value: formatIDR(Number(r.biayaAsuransi)) },
    ],
  }),

  faqs: [
    {
      question: "Apa bedanya bunga flat dan bunga efektif pada kredit motor?",
      answer:
        "Bunga flat dihitung dari pokok pinjaman awal dan tidak berubah selama tenor. Bunga efektif dihitung dari sisa pokok yang terus berkurang setiap bulan. Bunga flat yang terlihat rendah sebenarnya setara dengan bunga efektif yang hampir 2 kali lipat lebih tinggi.",
    },
    {
      question: "Berapa minimal DP kredit motor?",
      answer:
        "Umumnya minimal DP untuk kredit motor baru adalah 15–20% dari harga OTR. Beberapa dealer atau leasing menawarkan DP rendah mulai 10%, tetapi konsekuensinya cicilan bulanan akan lebih besar dan total bunga lebih tinggi.",
    },
    {
      question: "Apa itu asuransi TLO dan All Risk pada kredit motor?",
      answer:
        "TLO (Total Loss Only) menanggung kerugian jika motor hilang dicuri atau rusak total (kerusakan ≥75%). All Risk menanggung semua risiko termasuk kerusakan ringan. TLO lebih murah (~0,8%/tahun) dibanding All Risk (~2,5%/tahun dari harga kendaraan).",
    },
    {
      question: "Bagaimana cara memilih tenor kredit motor yang tepat?",
      answer:
        "Pilih tenor yang sesuai kemampuan bayar bulanan. Tenor pendek (12–24 bulan) berarti cicilan lebih besar tetapi total bunga lebih kecil. Tenor panjang (36–48 bulan) membuat cicilan lebih ringan, tetapi Anda membayar bunga lebih banyak secara total.",
    },
  ],

  seoContent: `
<h2>Simulasi Kredit Motor: Panduan Lengkap Sebelum Membeli</h2>
<p>
  Motor adalah kendaraan utama bagi jutaan orang Indonesia. Tidak heran jika kredit motor menjadi
  salah satu produk pembiayaan yang paling populer. Sebelum mengambil kredit, penting untuk
  memahami berapa total biaya yang akan Anda bayar — bukan hanya cicilan per bulan, tetapi juga
  total bunga dan biaya tambahan lainnya.
</p>

<h2>Memahami Bunga Flat vs Bunga Efektif</h2>
<p>
  Leasing motor umumnya menggunakan sistem bunga flat. Artinya, bunga dihitung dari pokok pinjaman
  awal dan besarnya tetap sama setiap bulan, meskipun sisa utang Anda sudah berkurang. Ini
  berbeda dengan bunga efektif yang menghitung bunga hanya dari sisa pokok.
</p>
<p>
  Sebagai contoh, bunga flat 8% per tahun setara dengan bunga efektif sekitar 14–15%. Itulah
  mengapa penting untuk memahami kedua jenis bunga ini agar tidak tertipu oleh angka yang
  terlihat rendah. Kalkulator ini menampilkan kedua angka sebagai perbandingan.
</p>

<h2>Komponen Biaya Kredit Motor</h2>
<ul>
  <li><strong>Uang Muka (DP):</strong> Pembayaran awal, biasanya 15–20% dari harga OTR.</li>
  <li><strong>Cicilan Bulanan:</strong> Pokok + bunga yang dibayar setiap bulan selama tenor.</li>
  <li><strong>Asuransi:</strong> TLO atau All Risk, opsional tetapi sangat disarankan.</li>
  <li><strong>Biaya Admin:</strong> Biaya administrasi leasing, biasanya sudah termasuk dalam perhitungan cicilan.</li>
</ul>

<h2>Tips Memilih Kredit Motor yang Cerdas</h2>
<p>
  Pertama, bandingkan penawaran dari beberapa leasing. Jangan langsung tergiur bunga flat yang
  rendah — hitung total pembayaran keseluruhan. Kedua, pilih tenor yang seimbang antara kemampuan
  bayar dan total biaya. Tenor 24–36 bulan biasanya menjadi pilihan optimal.
</p>
<p>
  Ketiga, pertimbangkan asuransi TLO minimal untuk melindungi aset Anda dari risiko pencurian
  atau kecelakaan berat. Keempat, pastikan total cicilan bulanan (termasuk utang lain) tidak
  melebihi 30% dari penghasilan bersih Anda.
</p>

<h2>Mengapa Bunga Efektif Penting Diketahui?</h2>
<p>
  Bunga flat yang ditawarkan leasing sering kali terlihat menarik. Namun, karena bunga dihitung
  dari total pokok awal (bukan sisa pokok), biaya nyata yang Anda bayar sebenarnya lebih tinggi.
  Dengan memahami bunga efektif, Anda bisa membandingkan produk kredit motor dengan produk
  pinjaman lain secara adil — misalnya dengan KPR atau KTA yang menggunakan bunga efektif.
</p>
<p>
  Gunakan kalkulator di atas untuk simulasi berbagai skenario kredit motor dan temukan kombinasi
  DP, tenor, dan bunga yang paling sesuai dengan kemampuan finansial Anda.
</p>
`,

  methodSection: [
    {
      label: "Ketentuan Pembiayaan Kendaraan Bermotor",
      source:
        "POJK No. 35/POJK.05/2018 tentang Penyelenggaraan Usaha Perusahaan Pembiayaan",
      url: "https://www.ojk.go.id/id/regulasi/otoritas-jasa-keuangan/peraturan-ojk/Pages/POJK-35-05-2018.aspx",
    },
  ],

  relatedCalculators: ["kredit-mobil", "pinjol"],

  partnerLink: "#",
  ctaLabel: "Bandingkan Kredit Motor",
  ctaDisclaimer: "* Produk dari mitra terpilih",
};
