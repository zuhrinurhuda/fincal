import { useEffect, useRef } from 'react';
import type { FormattedResult } from '@/types/calculator';
import CTAButton from '@/components/ui/CTAButton';

interface Props {
  result: FormattedResult;
  partnerLink?: string;
  ctaLabel?: string;
  ctaDisclaimer?: string;
  calculatorSlug?: string;
}

export default function ResultCard({
  result,
  partnerLink,
  ctaLabel,
  ctaDisclaimer,
  calculatorSlug,
}: Readonly<Props>) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Fade+slide animation whenever result changes
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(4px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 200ms ease, transform 200ms ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => cancelAnimationFrame(raf);
  }, [result]);

  return (
    <div ref={cardRef} className="p-5 sm:p-6">
      {/* Primary result — most prominent */}
      <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-950/40">
        <p className="mb-1 text-xs font-medium tracking-wide text-blue-600 uppercase dark:text-blue-400">
          {result.primary.label}
        </p>
        <p className="text-2xl font-bold tracking-tight text-blue-700 sm:text-3xl dark:text-blue-300">
          {result.primary.value}
        </p>
      </div>

      {/* Breakdown rows */}
      {result.breakdown.length > 0 && (
        <dl className="space-y-2">
          {result.breakdown.map((row, i) => (
            <div
              key={i}
              className={`flex items-baseline justify-between gap-4 py-2 text-sm ${
                i < result.breakdown.length - 1
                  ? 'border-b border-gray-100 dark:border-gray-800'
                  : ''
              }`}
            >
              <dt className="shrink-0 text-gray-600 dark:text-gray-400">{row.label}</dt>
              <dd className="text-right font-medium text-gray-900 dark:text-gray-100">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Affiliate CTA — separated from result visually (Google policy) */}
      {partnerLink && ctaLabel && (
        <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
          <CTAButton
            href={partnerLink}
            label={ctaLabel}
            disclaimer={ctaDisclaimer}
            calculatorSlug={calculatorSlug}
          />
        </div>
      )}
    </div>
  );
}
