import type { CalculatorConfig, FAQItem } from "@/types/calculator";

// ---------------------------------------------------------------------------
// 1. BreadcrumbList
//    Beranda > Kalkulator > {config.title}
// ---------------------------------------------------------------------------

export function generateBreadcrumbSchema(
  config: CalculatorConfig,
  baseUrl: string,
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Beranda",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kalkulator",
        item: `${baseUrl}/kalkulator`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: config.title,
        item: `${baseUrl}/kalkulator/${config.slug}`,
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// 2. FAQPage
// ---------------------------------------------------------------------------

export function generateFAQSchema(faqs: FAQItem[]): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });
}

// ---------------------------------------------------------------------------
// 3. SoftwareApplication
// ---------------------------------------------------------------------------

export function generateSoftwareAppSchema(
  config: CalculatorConfig,
  baseUrl: string,
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: config.title,
    description: config.metaDescription,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Windows, macOS, Android, iOS",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
    },
    url: `${baseUrl}/kalkulator/${config.slug}`,
  });
}

// ---------------------------------------------------------------------------
// 4. HowTo — auto-generated from config.inputs
//    Each input field becomes one step.
// ---------------------------------------------------------------------------

export function generateHowToSchema(config: CalculatorConfig): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Cara Menggunakan ${config.title}`,
    description: config.description,
    step: config.inputs.map((input, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      name: `Masukkan ${input.label}`,
      text: input.helpText ?? `Isi kolom ${input.label} sesuai data Anda.`,
    })),
  });
}
