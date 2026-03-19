import type { CalculatorConfig } from "../../types/calculator";
import { formatIDR } from "../../utils/formatCurrency";

export const reksaDana: CalculatorConfig = {
  slug: "reksa-dana",
  title: "Kalkulator Reksa Dana",
  description:
    "Hitung return reksa dana berdasarkan NAB (Nilai Aktiva Bersih), jumlah unit, dan biaya transaksi.",
  metaDescription:
    "Kalkulator reksa dana — hitung return investasi berdasarkan NAB, unit penyertaan, dan biaya pembelian/penjualan. Gratis & akurat.",
  keywords: [
    "kalkulator reksa dana",
    "hitung return reksa dana",
    "NAB reksa dana",
    "biaya reksa dana",
    "return investasi",
    "simulasi reksa dana",
  ],

  inputs: [
    {
      name: "nabAwal",
      label: "NAB per Unit Saat Beli",
      type: "amount",
      prefix: "Rp",
      defaultValue: 1_500,
      min: 1,
      max: 100_000_000,
      helpText: "Nilai Aktiva Bersih per unit saat pembelian",
    },
    {
      name: "nabSekarang",
      label: "NAB per Unit Saat Ini",
      type: "amount",
      prefix: "Rp",
      defaultValue: 1_800,
      min: 1,
      max: 100_000_000,
      helpText: "Nilai Aktiva Bersih per unit saat ini / saat jual",
    },
    {
      name: "jumlahUnit",
      label: "Jumlah Unit Penyertaan",
      type: "number",
      inputMode: "decimal",
      defaultValue: 10_000,
      min: 0.0001,
      max: 100_000_000,
      helpText: "Total unit yang Anda miliki",
    },
    {
      name: "biayaPembelian",
      label: "Biaya Pembelian (subscription fee)",
      type: "percentage",
      suffix: "%",
      inputMode: "decimal",
      defaultValue: 1,
      min: 0,
      max: 10,
      helpText: "Biaya saat membeli reksa dana, umumnya 0–2%",
    },
    {
      name: "biayaPenjualan",
      label: "Biaya Penjualan (redemption fee)",
      type: "percentage",
      suffix: "%",
      inputMode: "decimal",
      defaultValue: 0,
      min: 0,
      max: 10,
      helpText: "Biaya saat menjual/mencairkan, umumnya 0–1%",
    },
  ],

  calculate: (values) => {
    const nabAwal = Number(values.nabAwal) || 0;
    const nabSekarang = Number(values.nabSekarang) || 0;
    const jumlahUnit = Number(values.jumlahUnit) || 0;
    const feeBeli = Number(values.biayaPembelian) || 0;
    const feeJual = Number(values.biayaPenjualan) || 0;

    const nilaiAwal = nabAwal * jumlahUnit;
    const biayaBeli = nilaiAwal * (feeBeli / 100);
    const totalModalBeli = nilaiAwal + biayaBeli;

    const nilaiSekarang = nabSekarang * jumlahUnit;
    const biayaJual = nilaiSekarang * (feeJual / 100);
    const nilaiSetelahFee = nilaiSekarang - biayaJual;

    const returnKotor = nilaiSekarang - nilaiAwal;
    const returnBersih = nilaiSetelahFee - totalModalBeli;

    const returnPersenKotor = nilaiAwal > 0 ? (returnKotor / nilaiAwal) * 100 : 0;
    const returnPersenBersih = totalModalBeli > 0 ? (returnBersih / totalModalBeli) * 100 : 0;

    return {
      nilaiAwal: Math.round(nilaiAwal),
      totalModalBeli: Math.round(totalModalBeli),
      biayaBeli: Math.round(biayaBeli),
      nilaiSekarang: Math.round(nilaiSekarang),
      biayaJual: Math.round(biayaJual),
      nilaiSetelahFee: Math.round(nilaiSetelahFee),
      returnKotor: Math.round(returnKotor),
      returnBersih: Math.round(returnBersih),
      returnPersenKotor: Math.round(returnPersenKotor * 100) / 100,
      returnPersenBersih: Math.round(returnPersenBersih * 100) / 100,
    };
  },

  formatResult: (r) => ({
    primary: {
      label: "Return Bersih",
      value: `${formatIDR(Number(r.returnBersih))} (${r.returnPersenBersih}%)`,
    },
    breakdown: [
      { label: "Nilai Investasi Awal", value: formatIDR(Number(r.nilaiAwal)) },
      { label: "Biaya Pembelian", value: formatIDR(Number(r.biayaBeli)) },
      { label: "Total Modal (termasuk fee)", value: formatIDR(Number(r.totalModalBeli)) },
      { label: "Nilai Investasi Saat Ini", value: formatIDR(Number(r.nilaiSekarang)) },
      { label: "Biaya Penjualan", value: formatIDR(Number(r.biayaJual)) },
      { label: "Nilai Setelah Fee Jual", value: formatIDR(Number(r.nilaiSetelahFee)) },
      { label: "Return Kotor", value: `${formatIDR(Number(r.returnKotor))} (${r.returnPersenKotor}%)` },
      { label: "Return Bersih", value: `${formatIDR(Number(r.returnBersih))} (${r.returnPersenBersih}%)` },
    ],
  }),

  faqs: [
    {
      question: "Apa itu NAB (Nilai Aktiva Bersih)?",
      answer:
        "NAB adalah nilai total aset reksa dana dikurangi kewajiban, dibagi jumlah unit penyertaan yang beredar. NAB per unit mencerminkan harga satu unit reksa dana. NAB diperbarui setiap hari kerja oleh bank kustodian.",
    },
    {
      question: "Apa bedanya biaya pembelian dan biaya penjualan?",
      answer:
        "Biaya pembelian (subscription fee) dikenakan saat Anda membeli reksa dana, umumnya 0–2%. Biaya penjualan (redemption fee) dikenakan saat Anda mencairkan reksa dana, umumnya 0–1%. Banyak platform investasi online kini menawarkan biaya 0% untuk kedua transaksi.",
    },
    {
      question: "Bagaimana cara menghitung return reksa dana?",
      answer:
        "Return kotor = (NAB sekarang − NAB saat beli) × jumlah unit. Untuk return bersih, kurangi biaya pembelian dan penjualan dari perhitungan tersebut. Kalkulator ini menghitung kedua angka secara otomatis.",
    },
    {
      question: "Apa saja jenis reksa dana yang tersedia di Indonesia?",
      answer:
        "Ada empat jenis utama: (1) Reksa Dana Pasar Uang — risiko rendah, return 4–6%/tahun. (2) Reksa Dana Pendapatan Tetap — risiko rendah-menengah, return 6–8%/tahun. (3) Reksa Dana Campuran — risiko menengah, return 8–12%/tahun. (4) Reksa Dana Saham — risiko tinggi, potensi return 10–20%/tahun.",
    },
  ],

  seoContent: `
<h2>Memahami Investasi Reksa Dana di Indonesia</h2>
<p>
  Reksa dana adalah wadah untuk menghimpun dana dari masyarakat yang kemudian diinvestasikan
  oleh manajer investasi ke berbagai instrumen seperti saham, obligasi, dan deposito. Reksa dana
  cocok untuk investor pemula karena pengelolaannya diserahkan kepada profesional dan modal
  awalnya sangat terjangkau — mulai dari Rp 10.000 di beberapa platform.
</p>

<h2>Cara Menghitung Keuntungan Reksa Dana</h2>
<p>
  Keuntungan reksa dana dihitung dari selisih NAB (Nilai Aktiva Bersih) per unit saat pembelian
  dan saat penjualan, dikalikan jumlah unit yang Anda miliki. Misalnya, Anda membeli 10.000
  unit dengan NAB Rp 1.500/unit (modal Rp 15 juta). Jika NAB naik ke Rp 1.800/unit, nilai
  investasi menjadi Rp 18 juta — keuntungan kotor Rp 3 juta atau 20%.
</p>
<p>
  Namun, jangan lupa memperhitungkan biaya transaksi. Biaya pembelian (subscription fee) dan
  penjualan (redemption fee) akan mempengaruhi return bersih yang Anda terima.
</p>

<h2>Jenis-Jenis Reksa Dana</h2>
<ul>
  <li><strong>Reksa Dana Pasar Uang (RDPU):</strong> Diinvestasikan pada instrumen jangka pendek seperti deposito dan SBI. Risiko paling rendah, cocok untuk dana darurat.</li>
  <li><strong>Reksa Dana Pendapatan Tetap (RDPT):</strong> Mayoritas diinvestasikan pada obligasi. Risiko moderat, cocok untuk investasi 1–3 tahun.</li>
  <li><strong>Reksa Dana Campuran (RDC):</strong> Kombinasi saham dan obligasi. Risiko menengah, cocok untuk investasi 3–5 tahun.</li>
  <li><strong>Reksa Dana Saham (RDS):</strong> Mayoritas diinvestasikan pada saham. Risiko tinggi, cocok untuk investasi jangka panjang 5+ tahun.</li>
</ul>

<h2>Tips Investasi Reksa Dana</h2>
<p>
  Pertama, tentukan tujuan dan jangka waktu investasi untuk memilih jenis reksa dana yang tepat.
  Kedua, gunakan metode <em>dollar cost averaging</em> — investasi rutin setiap bulan agar tidak
  terpengaruh fluktuasi pasar. Ketiga, perhatikan track record manajer investasi dan expense
  ratio (biaya pengelolaan) sebelum memilih produk.
</p>
<p>
  Keempat, pilih platform investasi yang terdaftar di OJK dan menawarkan biaya transaksi rendah
  atau gratis. Kelima, jangan panik saat NAB turun — volatilitas adalah hal normal, terutama
  untuk reksa dana saham. Tetap konsisten dan fokus pada jangka panjang.
</p>
<p>
  Gunakan kalkulator reksa dana di atas untuk menghitung return investasi Anda secara akurat,
  termasuk biaya transaksi yang mungkin belum Anda perhitungkan.
</p>
`,

  methodSection: [
    {
      label: "Regulasi Reksa Dana",
      source:
        "POJK No. 23/POJK.04/2016 tentang Reksa Dana Berbentuk Kontrak Investasi Kolektif",
      url: "https://www.ojk.go.id/id/regulasi/otoritas-jasa-keuangan/peraturan-ojk/Pages/POJK-23-04-2016.aspx",
    },
  ],

  relatedCalculators: ["investasi", "zakat"],
};
