const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a number as full IDR string — e.g. "Rp 1.500.000"
 */
export function formatIDR(value: number): string {
  return idrFormatter.format(value);
}

/**
 * Compact IDR format — e.g. "Rp 1,5 jt", "Rp 1,2 M", "Rp 3,4 T"
 */
export function formatIDRCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000_000) {
    return `${sign}Rp ${(abs / 1_000_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} T`;
  }
  if (abs >= 1_000_000_000) {
    return `${sign}Rp ${(abs / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
  }
  if (abs >= 1_000_000) {
    return `${sign}Rp ${(abs / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`;
  }
  if (abs >= 1_000) {
    return `${sign}Rp ${(abs / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} rb`;
  }

  return formatIDR(value);
}

/**
 * Parse a formatted IDR string back to a raw number.
 * Strips everything except digits, then returns the integer value.
 * e.g. "1.500.000" → 1500000, "Rp 2.000.000" → 2000000
 */
export function parseIDR(formatted: string): number {
  const cleaned = formatted.replace(/[^\d]/g, '');
  return cleaned === '' ? 0 : parseInt(cleaned, 10);
}
