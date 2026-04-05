type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  var dataLayer: Record<string, unknown>[];

  var gtag: ((...args: unknown[]) => void) | undefined;
}

function pushToDataLayer(...args: unknown[]) {
  globalThis.dataLayer = globalThis.dataLayer || [];
  globalThis.dataLayer.push(Object.fromEntries(args.map((a, i) => [String(i), a])));
}

export function trackEvent(name: string, params?: EventParams) {
  if (typeof globalThis.document === 'undefined') return;
  try {
    if (globalThis.gtag) {
      globalThis.gtag('event', name, params);
    } else {
      pushToDataLayer('event', name, params);
    }
  } catch {
    // Silently fail — analytics should never break the app
  }
}

export function trackCalculatorUsed(slug: string, category: string) {
  trackEvent('calculator_used', {
    calculator_slug: slug,
    calculator_category: category,
  });
}

export function trackCtaClick(slug: string, label: string, url: string) {
  trackEvent('cta_click', {
    calculator_slug: slug,
    cta_label: label,
    destination_url: url,
  });
}

export function trackCalculatorError(slug: string, message: string) {
  trackEvent('calculator_error', {
    calculator_slug: slug,
    error_message: message.slice(0, 100),
  });
}

export function trackSearchFilter(query: string, resultsCount: number) {
  trackEvent('search_filter', {
    search_query: query.slice(0, 50),
    results_count: resultsCount,
  });
}

export function trackCategoryFilter(category: string) {
  trackEvent('category_filter', {
    category_name: category,
  });
}

export function trackFaqExpand(question: string) {
  trackEvent('faq_expand', {
    question_text: question.slice(0, 80),
  });
}
