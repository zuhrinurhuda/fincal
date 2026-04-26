# FinCal Workflow Guide

Dokumen ini berisi detail workflow untuk Generate Mode dan Review Mode. 
Baca sebelum mulai kerja.

## Audience & Tone Detail

- **Target:** Indonesia usia 25–40, urban, paham keuangan dasar
- **Tone:** Conversational, teman yang paham keuangan, bukan bank formal
- **Language:** Bahasa Indonesia, casual tapi credible
- **Test:** "Apakah teman saya ngomong gini di WhatsApp?"

## Categories & Intents

**Category (enum):** `Kredit` | `Investasi` | `Pajak & Zakat` | `Panduan Keuangan`

**Intent Structure:**

| Intent | Struktur |
|---|---|
| `informasional` | Definisi → Cara kerja → Contoh → Kapan relevan → FAQ |
| `komparasi` | Konteks → Tabel perbandingan → Kapan pilih A vs B → FAQ |
| `transaksional` | TL;DR → Step-by-step → Contoh kasus → CTA → FAQ |

Detail gaya intro per intent: lihat `fincal-style-guide.md` section 1.

## Generate Mode: Step-by-Step

### Step 1: Konfirmasi Input

Pastikan user kasih 4 informasi:
- Topik spesifik
- Intent (informasional/komparasi/transaksional)
- Primary keyword
- Target panjang (500-800 / 800-1200 / 1200-1500 kata)

Kalau kurang, tanyakan sebelum lanjut.

### Step 2: Propose Outline

JANGAN langsung tulis artikel. Tulis outline di artifact:

- **Angle artikel:** sudut pandang yang diambil
- **H2 Structure:** 3-5 section heading
- **FAQ Questions:** 3-5 pertanyaan real dari Google
- **Internal Link Plan:** kalkulator dan artikel relevan

Tunggu approval sebelum full draft.

### Step 3: Tulis Full MDX

Setelah outline disetujui, tulis lengkap di artifact MDX dengan 
template di bawah.

### Step 4: Self-Check Natural

Setelah selesai, tawarkan: "Sebelum kamu review, mau aku check apakah 
ada paragraf yang terasa kaku?"

Kalau user setuju, identifikasi 2-3 bagian paling bermasalah.

## Review Mode: Step-by-Step

### Step 1: Konfirmasi Scope

Tanyakan:
- **Full audit** (semua aspek)
- **Natural check** (AI vs natural)
- **Accuracy check** (angka, regulasi, fakta)
- **SEO check** (keyword, structure, internal link)

### Step 2: Baca Full Artikel

Pahami voice asli dulu sebelum kritik.

### Step 3: Deliver Feedback Terstruktur

Format:

```
## Yang Sudah Bagus
- [point spesifik]

## Yang Perlu Diperbaiki

### Prioritas Tinggi (struktural/teknis)
- [issue] → [saran]

### Prioritas Sedang (gaya/clarity)
- [issue] → [saran]

### Prioritas Rendah (polish)
- [issue] → [saran]

## Rekomendasi Action
[1-3 kalimat]
```

### Step 4: Offer Revision

"Mau aku revisi langsung, atau kamu revisi manual dan aku cek hasilnya?"

## Template MDX untuk Output

```mdx
---
title: "Judul (maks 60 karakter, ada primary keyword)"
metaDescription: "Maks 155 karakter, ada primary keyword, CTA tersirat."
publishDate: YYYY-MM-DD
author: "Tim FinCal"
category: "Kredit"
intent: "informasional"
tags: ["tag-1", "tag-2", "tag-3"]
relatedCalculators: ["slug-1", "slug-2"]
relatedArticles: [] # TODO: user validasi berdasarkan existing articles
featured: false
---

# Judul Artikel

Intro (lihat style guide section 1)...

## H2 Subjudul

Konten...

## FAQ

### Pertanyaan 1?
Jawaban.

### Pertanyaan 2?
Jawaban.

### Pertanyaan 3?
Jawaban.

---

*Artikel ini bersifat edukatif, bukan saran finansial. Keputusan keuangan 
adalah tanggung jawab pribadi. Untuk produk spesifik, konsultasikan dengan 
penyedia jasa keuangan terdaftar OJK.*

**[Hook spesifik].** Pakai [Kalkulator X](/kalkulator/slug/) di FinCal. 
Gratis, tanpa registrasi, [benefit spesifik].
```

**Disclaimer:**
- Wajib: Kredit, Investasi
- Opsional: Pajak & Zakat (jika perencanaan pribadi)
- Tidak perlu: Panduan Keuangan murni edukatif

## Soft Preferences

Boleh dilanggar kalau bikin hasil lebih natural:
- Hindari em-dash (—) sebagai penghubung
- Hindari transisi generik ("Selain itu,", "Lebih lanjut,")
- Hindari penutup bombastis
- Kalimat penting maks ~20 kata
- Ganti kata formal: tenor → jangka waktu cicilan, signifikan → cukup besar

## Available Calculators

| Slug | Nama |
|---|---|
| `kpr` | KPR |
| `pelunasan-kpr` | Pelunasan KPR Dipercepat |
| `kredit-motor` | Kredit Motor |
| `kredit-mobil` | Kredit Mobil |
| `pinjol` | Pinjaman Online |
| `kur` | KUR |
| `investasi` | Investasi Compound |
| `reksa-dana` | Reksa Dana |
| `pph21` | PPh 21 TER |
| `zakat` | Zakat Maal |

Format link: `/kalkulator/{slug}/`

## Slug Convention

- Max 5 kata, huruf kecil, pisah minus
- Tanpa tahun kecuali relevan
- Baik: `cara-hitung-kpr`, `bunga-flat-vs-efektif`
- Buruk: `panduan-lengkap-kpr-untuk-pemula-2024`

## Panjang Artikel

- Informasional/komparasi/panduan: 800-1.500 kata
- FAQ-focused/pendek: 500-800 kata

## Regulasi FinCal

- PPh 21: PMK 168/2023 (metode TER)
- Zakat: Pedoman BAZNAS
- Kredit: Bunga efektif dan flat

## Final Self-Check (Sebelum Deliver)

1. Intro match dengan intent?
2. Ada paragraf yang "AI banget"?
3. Istilah teknis dapat glossary di kemunculan pertama?
4. Format angka konsisten?
5. Disclaimer ada untuk Kredit/Investasi?

Kalau ragu, perbaiki sebelum deliver.