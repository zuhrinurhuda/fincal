import type { CalculatorConfig } from "../../types/calculator";
import { formatIDR } from "../../utils/formatCurrency";

export const pinjol: CalculatorConfig = {
  slug: "pinjol",
  title: "Kalkulator Pinjaman Online (Pinjol)",
  description:
    "Hitung total biaya pinjaman online, bunga harian, dan bandingkan bunga flat dengan bunga efektif tahunan.",
  metaDescription:
    "Kalkulator pinjol — hitung total bayar pinjaman online, bunga harian vs efektif tahunan. Kenali biaya nyata sebelum pinjam. Gratis.",
  keywords: [
    "kalkulator pinjol",
    "pinjaman online",
    "bunga pinjol",
    "hitung bunga pinjaman online",
    "pinjol legal",
    "simulasi pinjol",
  ],

  inputs: [
    {
      name: "pokokPinjaman",
      label: "Jumlah Pinjaman",
      type: "amount",
      prefix: "Rp",
      defaultValue: 2_000_000,
      min: 100_000,
      max: 20_000_000,
      helpText: "Jumlah pokok yang dipinjam",
    },
    {
      name: "jenisTenor",
      label: "Satuan Tenor",
      type: "select",
      defaultValue: 1,
      options: [
        { label: "Hari", value: 1 },
        { label: "Bulan", value: 2 },
      ],
    },
    {
      name: "tenor",
      label: "Lama Pinjaman",
      type: "number",
      inputMode: "numeric",
      defaultValue: 30,
      min: 1,
      max: 365,
      helpText: "Durasi pinjaman dalam hari atau bulan",
    },
    {
      name: "bungaHarian",
      label: "Bunga Flat Harian",
      type: "percentage",
      suffix: "% / hari",
      inputMode: "decimal",
      defaultValue: 0.4,
      min: 0,
      max: 5,
      helpText: "Bunga flat per hari yang dikenakan pinjol (maks legal 0,4%/hari)",
    },
  ],

  calculate: (values) => {
    const pokok = Number(values.pokokPinjaman) || 0;
    const jenisTenor = Number(values.jenisTenor) || 1;
    const tenorInput = Number(values.tenor) || 30;
    const bungaHarian = Number(values.bungaHarian) || 0;

    const tenorHari = jenisTenor === 2 ? tenorInput * 30 : tenorInput;

    const bungaPerHari = pokok * (bungaHarian / 100);
    const totalBunga = bungaPerHari * tenorHari;
    const totalBayar = pokok + totalBunga;

    // Effective annual rate from daily flat rate
    // Flat daily rate applied to full principal each day
    const bungaFlatTahunan = bungaHarian * 365;
    // Effective annual rate (compound): (1 + dailyRate)^365 - 1
    const bungaEfektifTahunan = (Math.pow(1 + bungaHarian / 100, 365) - 1) * 100;

    return {
      pokok,
      tenorHari,
      bungaPerHari: Math.round(bungaPerHari),
      totalBunga: Math.round(totalBunga),
      totalBayar: Math.round(totalBayar),
      bungaHarian,
      bungaFlatTahunan: Math.round(bungaFlatTahunan * 100) / 100,
      bungaEfektifTahunan: Math.round(bungaEfektifTahunan * 100) / 100,
    };
  },

  formatResult: (r) => ({
    primary: {
      label: "Total yang Harus Dibayar",
      value: formatIDR(Number(r.totalBayar)),
    },
    breakdown: [
      { label: "Pokok Pinjaman", value: formatIDR(Number(r.pokok)) },
      { label: "Tenor", value: `${r.tenorHari} hari` },
      { label: "Bunga per Hari", value: formatIDR(Number(r.bungaPerHari)) },
      { label: "Total Bunga", value: formatIDR(Number(r.totalBunga)) },
      { label: "Total Bayar", value: formatIDR(Number(r.totalBayar)) },
      { label: "Bunga Flat (tahunan)", value: `${r.bungaFlatTahunan}%` },
      { label: "Bunga Efektif (tahunan)", value: `${r.bungaEfektifTahunan}%` },
    ],
  }),

  faqs: [
    {
      question: "Berapa bunga maksimal pinjaman online yang legal?",
      answer:
        "Berdasarkan POJK No. 10/POJK.05/2022, bunga pinjaman online tidak boleh melebihi 0,4% per hari dari pokok pinjaman. Total biaya pinjaman (bunga + biaya lainnya) juga tidak boleh melebihi 100% dari pokok. Jika platform mengenakan bunga lebih dari ini, kemungkinan besar platform tersebut ilegal.",
    },
    {
      question: "Bagaimana cara membedakan pinjol legal dan ilegal?",
      answer:
        "Pinjol legal terdaftar dan diawasi OJK. Cek di website OJK atau aplikasi OJK untuk daftar terbaru perusahaan fintech lending berizin. Pinjol ilegal biasanya menawarkan proses sangat cepat tanpa verifikasi, meminta akses berlebihan ke HP, dan mengenakan bunga sangat tinggi.",
    },
    {
      question: "Apa itu bunga efektif tahunan dan mengapa penting?",
      answer:
        "Bunga efektif tahunan menunjukkan biaya nyata pinjaman jika disetarakan dalam satu tahun. Bunga harian 0,4% mungkin terlihat kecil, tetapi jika dihitung efektif tahunan bisa mencapai lebih dari 300%. Angka ini membantu Anda membandingkan biaya pinjol dengan produk kredit lain seperti KTA atau kartu kredit.",
    },
    {
      question: "Apa risiko mengambil pinjaman online?",
      answer:
        "Risiko utama: bunga yang sangat tinggi jika diperpanjang (roll over), potensi terjerat utang berbunga, dan risiko data pribadi disalahgunakan oleh pinjol ilegal. Sebaiknya gunakan pinjol hanya untuk kebutuhan darurat jangka pendek dan pastikan bisa melunasi tepat waktu.",
    },
  ],

  seoContent: `
<h2>Memahami Biaya Nyata Pinjaman Online</h2>
<p>
  Pinjaman online (pinjol) telah menjadi salah satu sumber pendanaan cepat bagi masyarakat Indonesia.
  Dengan proses yang mudah dan pencairan yang cepat, pinjol menarik jutaan pengguna. Namun, di balik
  kemudahan tersebut, banyak peminjam yang tidak menyadari betapa tingginya biaya nyata yang harus
  dibayar.
</p>

<h2>Bunga Pinjol: Kecil di Mata, Besar di Kantong</h2>
<p>
  Pinjol biasanya mengiklankan bunga dalam satuan harian, misalnya "hanya 0,3% per hari." Angka ini
  terlihat sangat kecil. Tapi coba kita hitung: bunga 0,3% per hari × 365 hari = bunga flat 109,5%
  per tahun. Dan jika dihitung secara efektif (compound), angkanya bisa mencapai hampir 200% per tahun.
</p>
<p>
  Bandingkan dengan KTA bank yang bunganya sekitar 12–24% efektif per tahun, atau kartu kredit
  dengan bunga ~24–36% per tahun. Jelas terlihat bahwa pinjol adalah salah satu produk pinjaman
  paling mahal di pasaran.
</p>

<h2>Batas Bunga Pinjol yang Diatur OJK</h2>
<p>
  Otoritas Jasa Keuangan (OJK) melalui POJK No. 10/POJK.05/2022 mengatur bahwa bunga pinjaman
  online tidak boleh melebihi <strong>0,4% per hari</strong> dari pokok pinjaman. Selain itu, total
  biaya pinjaman (bunga + administrasi + denda) <strong>tidak boleh melebihi 100% dari pokok</strong>.
  Artinya, Anda meminjam Rp 1 juta, maksimal yang harus dibayar adalah Rp 2 juta (pokok + biaya).
</p>

<h2>Tips Bijak Menggunakan Pinjaman Online</h2>
<ul>
  <li><strong>Gunakan hanya untuk darurat:</strong> Jangan jadikan pinjol sebagai sumber pendanaan rutin.</li>
  <li><strong>Pastikan platform legal:</strong> Cek di situs OJK apakah pinjol terdaftar dan berizin.</li>
  <li><strong>Hitung total biaya:</strong> Gunakan kalkulator ini untuk mengetahui berapa yang benar-benar harus Anda bayar.</li>
  <li><strong>Jangan perpanjang tenor:</strong> Roll over atau perpanjangan pinjaman membuat bunga berbunga dan utang membengkak.</li>
  <li><strong>Bandingkan alternatif:</strong> KTA, pinjaman koperasi, atau pinjaman ke kerabat sering kali jauh lebih murah.</li>
</ul>

<h2>Kenapa Kalkulator Ini Menampilkan Bunga Efektif?</h2>
<p>
  Kami menampilkan bunga efektif tahunan agar Anda bisa melihat biaya nyata pinjol dan membandingkannya
  secara adil dengan produk pinjaman lain. Bunga harian yang terlihat kecil bisa menyesatkan —
  bunga efektif tahunan memberikan gambaran yang lebih jujur tentang seberapa mahal sebuah pinjaman.
</p>
<p>
  Gunakan kalkulator di atas sebelum mengambil keputusan. Masukkan jumlah pinjaman, tenor, dan bunga
  harian yang ditawarkan, lalu lihat berapa total yang harus Anda bayar dan berapa bunga efektif
  tahunannya.
</p>
`,

  methodSection: [
    {
      label: "Regulasi Pinjaman Online (P2P Lending)",
      source:
        "POJK No. 10/POJK.05/2022 tentang Layanan Pendanaan Bersama Berbasis Teknologi Informasi",
      url: "https://www.ojk.go.id/id/regulasi/otoritas-jasa-keuangan/peraturan-ojk/Pages/POJK-10-05-2022.aspx",
    },
    {
      label: "Batas Biaya Pinjaman Online",
      source: "SE OJK No. 19/SEOJK.06/2023 tentang Tata Kelola Pendanaan Bersama",
    },
  ],

  relatedCalculators: ["kur", "kredit-motor"],
};
