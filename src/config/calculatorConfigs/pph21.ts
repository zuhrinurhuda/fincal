import type { CalculatorConfig } from '@/types/calculator';
import { formatIDR } from '@/utils/formatCurrency';

const PTKP_VALUES: Record<number, number> = {
  0: 54_000_000, // TK/0
  1: 58_500_000, // TK/1
  2: 63_000_000, // TK/2
  3: 67_500_000, // TK/3
  4: 58_500_000, // K/0
  5: 63_000_000, // K/1
  6: 67_500_000, // K/2
  7: 72_000_000, // K/3
};

const PTKP_LABELS: Record<number, string> = {
  0: 'TK/0',
  1: 'TK/1',
  2: 'TK/2',
  3: 'TK/3',
  4: 'K/0',
  5: 'K/1',
  6: 'K/2',
  7: 'K/3',
};

function progressiveTax(pkp: number): number {
  if (pkp <= 0) return 0;
  let tax = 0;
  const brackets: [number, number][] = [
    [60_000_000, 0.05],
    [250_000_000 - 60_000_000, 0.15],
    [500_000_000 - 250_000_000, 0.25],
    [5_000_000_000 - 500_000_000, 0.3],
    [Infinity, 0.35],
  ];

  let remaining = pkp;
  for (const [limit, rate] of brackets) {
    const taxable = Math.min(remaining, limit);
    tax += taxable * rate;
    remaining -= taxable;
    if (remaining <= 0) break;
  }
  return Math.round(tax);
}

export const pph21: CalculatorConfig = {
  slug: 'pph21',
  title: 'Kalkulator PPh 21',
  description:
    'Hitung pajak penghasilan Pasal 21 karyawan dengan metode TER sesuai PMK 168/2023. Mendukung semua status PTKP.',
  metaDescription:
    'Kalkulator PPh 21 terbaru sesuai PMK 168/2023 — hitung pajak penghasilan karyawan, PTKP, PKP, dan potongan bulanan. Gratis & akurat.',
  keywords: [
    'kalkulator pph 21',
    'hitung pajak penghasilan',
    'pph 21 karyawan',
    'tarif efektif rata-rata',
    'TER pph 21',
    'pajak gaji',
  ],
  category: 'Pajak & Zakat',
  icon: 'receipt',
  order: 2,

  inputs: [
    {
      name: 'statusPegawai',
      label: 'Status Pegawai',
      type: 'select',
      defaultValue: 1,
      options: [
        { label: 'Pegawai Tetap', value: 1 },
        { label: 'Pegawai Tidak Tetap', value: 2 },
        { label: 'Bukan Pegawai', value: 3 },
      ],
    },
    {
      name: 'gajiPokok',
      label: 'Gaji Pokok',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 10_000_000,
      min: 0,
      helpText: 'Gaji pokok per bulan sebelum potongan',
    },
    {
      name: 'tunjanganTetap',
      label: 'Tunjangan Tetap',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 2_000_000,
      min: 0,
      helpText: 'Tunjangan makan, transport, jabatan, dll.',
    },
    {
      name: 'bonusThr',
      label: 'Bonus / THR (setahun)',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 0,
      min: 0,
      helpText: 'Total bonus dan THR dalam 1 tahun',
    },
    {
      name: 'statusPtkp',
      label: 'Status PTKP',
      type: 'select',
      defaultValue: 0,
      options: [
        { label: 'TK/0 — Tidak Kawin, Tanpa Tanggungan', value: 0 },
        { label: 'TK/1 — Tidak Kawin, 1 Tanggungan', value: 1 },
        { label: 'TK/2 — Tidak Kawin, 2 Tanggungan', value: 2 },
        { label: 'TK/3 — Tidak Kawin, 3 Tanggungan', value: 3 },
        { label: 'K/0 — Kawin, Tanpa Tanggungan', value: 4 },
        { label: 'K/1 — Kawin, 1 Tanggungan', value: 5 },
        { label: 'K/2 — Kawin, 2 Tanggungan', value: 6 },
        { label: 'K/3 — Kawin, 3 Tanggungan', value: 7 },
      ],
    },
    {
      name: 'iuranBpjs',
      label: 'Iuran BPJS Ketenagakerjaan (per bulan)',
      type: 'amount',
      prefix: 'Rp',
      defaultValue: 200_000,
      min: 0,
      helpText: 'Iuran JHT yang ditanggung karyawan (2% dari gaji)',
    },
  ],

  calculate: (values) => {
    const gaji = Number(values.gajiPokok) || 0;
    const tunjangan = Number(values.tunjanganTetap) || 0;
    const bonusTahunan = Number(values.bonusThr) || 0;
    const ptkpKey = Number(values.statusPtkp) || 0;
    const bpjsBulanan = Number(values.iuranBpjs) || 0;

    const brutoBulanan = gaji + tunjangan;
    const brutoTahunan = brutoBulanan * 12 + bonusTahunan;

    // Biaya jabatan: 5% of bruto, max Rp 500.000/bulan = Rp 6.000.000/tahun
    const biayaJabatanTahunan = Math.min(brutoTahunan * 0.05, 6_000_000);

    const bpjsTahunan = bpjsBulanan * 12;

    const netoTahunan = brutoTahunan - biayaJabatanTahunan - bpjsTahunan;

    const ptkp = PTKP_VALUES[ptkpKey] ?? 54_000_000;
    const pkp = Math.max(Math.floor(netoTahunan - ptkp), 0);

    const pphTahunan = progressiveTax(pkp);
    const pphBulanan = Math.round(pphTahunan / 12);

    return {
      brutoTahunan,
      brutoBulanan,
      biayaJabatanTahunan,
      bpjsTahunan,
      netoTahunan,
      ptkp,
      ptkpLabel: PTKP_LABELS[ptkpKey] ?? 'TK/0',
      pkp,
      pphTahunan,
      pphBulanan,
    };
  },

  formatResult: (r) => ({
    primary: {
      label: 'PPh 21 per Bulan',
      value: formatIDR(Number(r.pphBulanan)),
    },
    breakdown: [
      { label: 'Penghasilan Bruto (tahunan)', value: formatIDR(Number(r.brutoTahunan)) },
      { label: 'Biaya Jabatan (tahunan)', value: formatIDR(Number(r.biayaJabatanTahunan)) },
      { label: 'Iuran BPJS (tahunan)', value: formatIDR(Number(r.bpjsTahunan)) },
      { label: 'Penghasilan Neto (tahunan)', value: formatIDR(Number(r.netoTahunan)) },
      { label: `PTKP (${r.ptkpLabel})`, value: formatIDR(Number(r.ptkp)) },
      { label: 'Penghasilan Kena Pajak', value: formatIDR(Number(r.pkp)) },
      { label: 'PPh 21 Terutang (tahunan)', value: formatIDR(Number(r.pphTahunan)) },
      { label: 'PPh 21 per Bulan', value: formatIDR(Number(r.pphBulanan)) },
    ],
  }),

  faqs: [
    {
      question: 'Apa itu metode TER pada PPh 21?',
      answer:
        'TER (Tarif Efektif Rata-rata) adalah metode pemotongan PPh 21 bulanan sesuai PMK 168/2023. Pada bulan Januari–November, pajak dihitung dengan rumus sederhana: PPh 21 = TER × Penghasilan Bruto. Di bulan Desember, dilakukan penyesuaian dengan perhitungan tahunan menggunakan tarif progresif sehingga total pajak setahun tetap sama.',
    },
    {
      question: 'Berapa tarif progresif PPh 21 terbaru?',
      answer:
        'Sesuai UU HPP, tarif progresif PPh 21 adalah: 5% untuk PKP sampai Rp 60 juta, 15% untuk Rp 60–250 juta, 25% untuk Rp 250–500 juta, 30% untuk Rp 500 juta–5 miliar, dan 35% untuk PKP di atas Rp 5 miliar.',
    },
    {
      question: 'Apa itu PTKP dan berapa besarannya?',
      answer:
        'PTKP (Penghasilan Tidak Kena Pajak) adalah batas penghasilan yang tidak dikenai pajak. Besarannya: TK/0 = Rp 54 juta/tahun, tambahan Rp 4,5 juta per tanggungan (maks 3), dan tambahan Rp 4,5 juta jika menikah (status K).',
    },
    {
      question: 'Apakah bonus dan THR dipotong PPh 21?',
      answer:
        'Ya, bonus dan THR dikenakan PPh 21. Dalam metode TER, di bulan saat bonus/THR dibayarkan, tarif TER dikalikan total bruto bulan tersebut (gaji + bonus). Dalam perhitungan tahunan, bonus digabungkan ke total penghasilan bruto setahun.',
    },
    {
      question: 'Apa itu biaya jabatan dalam perhitungan PPh 21?',
      answer:
        'Biaya jabatan adalah pengurang penghasilan bruto untuk pegawai tetap, sebesar 5% dari penghasilan bruto dengan batas maksimal Rp 500.000 per bulan atau Rp 6.000.000 per tahun. Pengurang ini berlaku otomatis tanpa perlu bukti pengeluaran.',
    },
  ],

  seoContent: `
<h2>Memahami Perhitungan PPh 21 Terbaru di Indonesia</h2>
<p>
  Pajak Penghasilan Pasal 21 (PPh 21) adalah pajak yang dipotong dari penghasilan karyawan,
  termasuk gaji, tunjangan, bonus, dan THR. Sejak Januari 2024, pemerintah menerapkan metode
  baru bernama Tarif Efektif Rata-rata (TER) melalui PMK No. 168 Tahun 2023 yang menyederhanakan
  proses pemotongan pajak bulanan.
</p>

<h2>Perubahan Utama dengan Metode TER</h2>
<p>
  Sebelum adanya TER, perusahaan harus melakukan perhitungan pajak bulanan yang cukup rumit
  menggunakan tarif progresif. Dengan TER, pemotongan pajak di bulan Januari–November menjadi
  jauh lebih sederhana: cukup kalikan penghasilan bruto bulan tersebut dengan tarif TER yang
  sudah ditentukan berdasarkan kategori PTKP dan besaran penghasilan.
</p>
<p>
  Di bulan Desember, perusahaan tetap menghitung pajak tahunan dengan metode progresif biasa,
  lalu menguranginya dengan total pajak yang sudah dipotong selama Januari–November. Hasilnya,
  total pajak setahun tetap sama — hanya metode pemotongan bulanannya yang lebih sederhana.
</p>

<h2>Langkah Perhitungan PPh 21 Tahunan</h2>
<p>
  Kalkulator ini menghitung PPh 21 secara tahunan dengan langkah berikut:
</p>
<ul>
  <li>Hitung penghasilan bruto tahunan (gaji × 12 + tunjangan × 12 + bonus).</li>
  <li>Kurangi biaya jabatan (5% dari bruto, maks Rp 6 juta/tahun).</li>
  <li>Kurangi iuran BPJS Ketenagakerjaan yang ditanggung karyawan.</li>
  <li>Hasilnya adalah penghasilan neto tahunan.</li>
  <li>Kurangi PTKP sesuai status pernikahan dan jumlah tanggungan.</li>
  <li>Hasilnya adalah PKP (Penghasilan Kena Pajak).</li>
  <li>Terapkan tarif progresif UU HPP pada PKP.</li>
  <li>Bagi PPh 21 tahunan dengan 12 untuk mendapat estimasi pemotongan bulanan.</li>
</ul>

<h2>Tarif Progresif PPh 21 (UU HPP)</h2>
<p>
  Undang-Undang Harmonisasi Peraturan Perpajakan (UU HPP) menetapkan lima lapisan tarif progresif:
  5% untuk penghasilan kena pajak sampai Rp 60 juta, 15% untuk Rp 60–250 juta, 25% untuk
  Rp 250–500 juta, 30% untuk Rp 500 juta–5 miliar, dan 35% di atas Rp 5 miliar per tahun.
</p>

<h2>Kategori PTKP</h2>
<p>
  PTKP (Penghasilan Tidak Kena Pajak) menentukan batas penghasilan bebas pajak. Untuk wajib pajak
  lajang tanpa tanggungan (TK/0), PTKP adalah Rp 54 juta per tahun. Setiap tanggungan menambah
  Rp 4,5 juta (maksimal 3 tanggungan), dan status menikah menambah Rp 4,5 juta. Artinya, seorang
  karyawan dengan status K/3 memiliki PTKP Rp 72 juta per tahun.
</p>

<h2>Tips Mengoptimalkan Pajak Secara Legal</h2>
<p>
  Ada beberapa cara legal untuk mengoptimalkan beban PPh 21. Pertama, pastikan semua pengurang
  (biaya jabatan, iuran BPJS, iuran pensiun) sudah diperhitungkan dengan benar. Kedua, manfaatkan
  fasilitas zakat sebagai pengurang penghasilan bruto jika dibayarkan melalui lembaga resmi.
  Ketiga, pahami perbedaan antara tunjangan yang dikenai pajak dan yang tidak.
</p>
<p>
  Gunakan kalkulator PPh 21 ini untuk mengetahui estimasi pajak yang harus Anda bayar setiap bulan
  dan membuat perencanaan keuangan yang lebih baik.
</p>
`,

  methodSection: [
    {
      label: 'Tarif Efektif Rata-rata PPh 21',
      source: 'PMK No. 168/PMK.010/2023 tentang Tarif Pemotongan PPh Pasal 21',
      url: 'https://jdih.kemenkeu.go.id/download/4cce2e17-7e29-4a5d-bf15-2a4cfc0c9e33/2023pmk168.pdf',
    },
    {
      label: 'Tarif Progresif PPh',
      source: 'UU No. 7 Tahun 2021 tentang Harmonisasi Peraturan Perpajakan (UU HPP)',
      url: 'https://jdih.kemenkeu.go.id/download/b8211cfc-f2ac-4037-985b-9b5a8c393027/UU7-2021.pdf',
    },
  ],

  relatedCalculators: ['kpr', 'zakat'],
};
