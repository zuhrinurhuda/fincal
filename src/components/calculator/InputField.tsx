import { useId } from 'react';
import type { InputConfig } from '@/types/calculator';

interface Props {
  config: InputConfig;
  value: number | string;
  onChange: (value: number | string) => void;
  error?: string;
}

export default function InputField({ config, value, onChange, error }: Readonly<Props>) {
  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const describedBy = [error ? errorId : '', config.helpText ? helpId : '']
    .filter(Boolean)
    .join(' ');

  const baseInputClass =
    'flex-1 min-w-0 py-2.5 px-3 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none';

  const wrapperClass = `flex items-center rounded-lg border bg-white dark:bg-gray-800 transition-colors ${
    error
      ? 'border-red-400 dark:border-red-500 focus-within:ring-2 focus-within:ring-red-400'
      : 'border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-brand-500'
  }`;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {config.label}
      </label>

      {config.type === 'select' ? (
        <div className={wrapperClass}>
          <select
            id={id}
            value={value}
            onChange={(e) => {
              const n = Number(e.target.value);
              onChange(isNaN(n) ? e.target.value : n);
            }}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? 'true' : undefined}
            className={`${baseInputClass} cursor-pointer appearance-none bg-transparent pr-8`}
          >
            {config.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom chevron */}
          <svg
            className="pointer-events-none mr-3 h-4 w-4 shrink-0 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      ) : (
        <div className={wrapperClass}>
          {config.prefix && (
            <span className="shrink-0 pr-2 pl-3 text-sm text-gray-500 select-none dark:text-gray-400">
              {config.prefix}
            </span>
          )}

          <input
            id={id}
            type="text"
            inputMode={config.inputMode ?? 'numeric'}
            value={value}
            onChange={(e) => {
              const raw = e.target.value;
              const n = Number(raw);
              // Preserve the string while typing; convert empty → 0
              onChange(raw === '' ? 0 : isNaN(n) ? raw : n);
            }}
            placeholder={config.defaultValue !== undefined ? String(config.defaultValue) : '0'}
            aria-describedby={describedBy || undefined}
            aria-invalid={error ? 'true' : undefined}
            className={baseInputClass}
          />

          {config.suffix && (
            <span className="shrink-0 pr-3 pl-2 text-sm whitespace-nowrap text-gray-500 select-none dark:text-gray-400">
              {config.suffix}
            </span>
          )}
        </div>
      )}

      {config.helpText && !error && (
        <p id={helpId} className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {config.helpText}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
