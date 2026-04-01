import type { CalculatorConfig, FAQItem } from '@/types/calculator';
import type { HomeCalculatorCard } from '@/types/home';

// ---------------------------------------------------------------------------
// 0. Article — BlogPosting rich result
// ---------------------------------------------------------------------------

export type ArticleSchemaProps = {
  title: string;
  metaDescription: string;
  publishDate: Date;
  updatedDate?: Date;
  author: string;
  canonicalUrl: string;
  ogImage?: string;
  baseUrl: string;
};

export function generateArticleSchema(props: ArticleSchemaProps): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: props.title,
    description: props.metaDescription,
    author: {
      '@type': 'Organization',
      name: props.author,
      url: props.baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FinCal',
      url: props.baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${props.baseUrl}/logo.png`,
      },
    },
    datePublished: props.publishDate.toISOString(),
    dateModified: (props.updatedDate ?? props.publishDate).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': props.canonicalUrl,
    },
    ...(props.ogImage ? { image: props.ogImage } : {}),
  });
}

// ---------------------------------------------------------------------------
// 0b. BreadcrumbList (artikel index)
//     Beranda > Artikel
// ---------------------------------------------------------------------------

export function generateArtikelIndexBreadcrumbSchema(baseUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Artikel',
        item: `${baseUrl}/artikel/`,
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// 0c. BreadcrumbList (artikel detail)
//     Beranda > Artikel > {title}
// ---------------------------------------------------------------------------

export function generateArtikelBreadcrumbSchema(
  title: string,
  canonicalUrl: string,
  baseUrl: string
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Artikel',
        item: `${baseUrl}/artikel/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: canonicalUrl,
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// 1. BreadcrumbList (calculator page)
//    Beranda > Kalkulator > {config.title}
// ---------------------------------------------------------------------------

export function generateBreadcrumbSchema(config: CalculatorConfig, baseUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Kalkulator',
        item: `${baseUrl}/kalkulator/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: config.title,
        item: `${baseUrl}/kalkulator/${config.slug}/`,
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// 1b. BreadcrumbList (kalkulator index)
//     Beranda > Kalkulator
// ---------------------------------------------------------------------------

export function generateKalkulatorIndexBreadcrumbSchema(baseUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: `${baseUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Kalkulator',
        item: `${baseUrl}/kalkulator/`,
      },
    ],
  });
}

// ---------------------------------------------------------------------------
// 2. FAQPage
// ---------------------------------------------------------------------------

export function generateFAQSchema(faqs: FAQItem[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  });
}

// ---------------------------------------------------------------------------
// 3. SoftwareApplication
// ---------------------------------------------------------------------------

export function generateSoftwareAppSchema(config: CalculatorConfig, baseUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.title,
    description: config.metaDescription,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Windows, macOS, Android, iOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'IDR',
    },
    url: `${baseUrl}/kalkulator/${config.slug}/`,
  });
}

// ---------------------------------------------------------------------------
// 4. HowTo — auto-generated from config.inputs
//    Each input field becomes one step.
// ---------------------------------------------------------------------------

export function generateHowToSchema(config: CalculatorConfig): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `Cara Menggunakan ${config.title}`,
    description: config.description,
    step: config.inputs.map((input, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: `Masukkan ${input.label}`,
      text: input.helpText ?? `Isi kolom ${input.label} sesuai data Anda.`,
    })),
  });
}

// ---------------------------------------------------------------------------
// 5. WebSite — homepage with SearchAction (sitelinks search box)
// ---------------------------------------------------------------------------

export function generateWebSiteSchema(baseUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'FinCal',
    url: baseUrl,
    description: 'Kumpulan kalkulator keuangan online gratis untuk masyarakat Indonesia.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  });
}

// ---------------------------------------------------------------------------
// 6. ItemList — calculator catalog for rich results
// ---------------------------------------------------------------------------

export function generateItemListSchema(calculators: HomeCalculatorCard[], baseUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Kalkulator Keuangan Indonesia',
    numberOfItems: calculators.length,
    itemListElement: calculators.map((calc, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: calc.title,
      url: `${baseUrl}/kalkulator/${calc.slug}/`,
    })),
  });
}

// ---------------------------------------------------------------------------
// 7. Organization — brand identity
// ---------------------------------------------------------------------------

export function generateOrganizationSchema(baseUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FinCal',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'Kalkulator keuangan gratis untuk masyarakat Indonesia.',
  });
}
