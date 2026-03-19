import { useCallback } from 'react';
import { formatIDR, formatIDRCompact, parseIDR } from '@/utils/formatCurrency';

export function useFormatCurrency() {
  const format = useCallback((value: number) => formatIDR(value), []);
  const formatCompact = useCallback((value: number) => formatIDRCompact(value), []);
  const parse = useCallback((formatted: string) => parseIDR(formatted), []);

  return { format, formatCompact, parse };
}
