import { trackCtaClick } from '@/lib/analytics';

interface Props {
  href: string;
  label: string;
  disclaimer?: string;
  calculatorSlug?: string;
}

export default function CTAButton({ href, label, disclaimer, calculatorSlug }: Readonly<Props>) {
  return (
    <div className="mt-6">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        onClick={() => trackCtaClick(calculatorSlug ?? '', label, href)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cta-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cta-700 focus:ring-2 focus:ring-cta-500 focus:ring-offset-2 focus:outline-none active:bg-cta-800 sm:w-auto dark:focus:ring-offset-gray-900"
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M7 7h10v10" />
        </svg>
      </a>
      {disclaimer && <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{disclaimer}</p>}
    </div>
  );
}
