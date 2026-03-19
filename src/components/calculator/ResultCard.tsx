import { useEffect, useRef } from "react";
import type { FormattedResult } from "@/types/calculator";
import CTAButton from "@/components/ui/CTAButton";

interface Props {
  result: FormattedResult;
  partnerLink?: string;
  ctaLabel?: string;
  ctaDisclaimer?: string;
}

export default function ResultCard({
  result,
  partnerLink,
  ctaLabel,
  ctaDisclaimer,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Fade+slide animation whenever result changes
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(4px)";
    const raf = requestAnimationFrame(() => {
      el.style.transition = "opacity 200ms ease, transform 200ms ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
    return () => cancelAnimationFrame(raf);
  }, [result]);

  return (
    <div ref={cardRef} className="p-5 sm:p-6">
      {/* Primary result — most prominent */}
      <div className="mb-5 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50">
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-1">
          {result.primary.label}
        </p>
        <p className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300 tracking-tight">
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
                  ? "border-b border-gray-100 dark:border-gray-800"
                  : ""
              }`}
            >
              <dt className="text-gray-600 dark:text-gray-400 shrink-0">
                {row.label}
              </dt>
              <dd className="font-medium text-gray-900 dark:text-gray-100 text-right">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {/* Affiliate CTA — separated from result visually (Google policy) */}
      {partnerLink && ctaLabel && (
        <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
          <CTAButton
            href={partnerLink}
            label={ctaLabel}
            disclaimer={ctaDisclaimer}
          />
        </div>
      )}
    </div>
  );
}
