interface Props {
  href: string;
  label: string;
  disclaimer?: string;
}

export default function CTAButton({ href, label, disclaimer }: Props) {
  return (
    <div className="mt-6">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold text-sm transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
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
      {disclaimer && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          {disclaimer}
        </p>
      )}
    </div>
  );
}
