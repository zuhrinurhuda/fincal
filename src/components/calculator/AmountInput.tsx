import { useState, useId } from 'react';
import type { InputConfig } from '@/types/calculator';

interface Props {
  config: InputConfig;
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

function formatDisplay(n: number): string {
  if (!n && n !== 0) return '';
  return new Intl.NumberFormat('id-ID').format(n);
}

export default function AmountInput({ config, value, onChange, error }: Readonly<Props>) {
  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  // isFocused: show raw number for easy editing
  const [isFocused, setIsFocused] = useState(false);
  const [rawInput, setRawInput] = useState('');

  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number string so the user can edit directly
    setRawInput(value === 0 ? '' : String(value));
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Parse whatever the user typed
    const digits = rawInput.replace(/[^\d]/g, '');
    const parsed = digits === '' ? 0 : parseInt(digits, 10);
    onChange(isNaN(parsed) ? 0 : parsed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits while typing
    const raw = e.target.value.replace(/[^\d]/g, '');
    setRawInput(raw);
    const parsed = raw === '' ? 0 : parseInt(raw, 10);
    if (!isNaN(parsed)) onChange(parsed);
  };

  const displayValue = isFocused ? rawInput : formatDisplay(value);

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {config.label}
      </label>

      <div
        className={`flex items-center rounded-lg border bg-white transition-colors dark:bg-gray-800 ${
          error
            ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-400 dark:border-red-500'
            : 'border-gray-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500 dark:border-gray-700'
        }`}
      >
        {config.prefix && (
          <span className="shrink-0 pr-2 pl-3 text-sm text-gray-500 select-none dark:text-gray-400">
            {config.prefix}
          </span>
        )}

        <input
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="0"
          aria-describedby={
            [error ? errorId : '', config.helpText ? helpId : ''].filter(Boolean).join(' ') ||
            undefined
          }
          aria-invalid={error ? 'true' : undefined}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none dark:text-gray-100"
        />

        {config.suffix && (
          <span className="shrink-0 pr-3 pl-2 text-sm text-gray-500 select-none dark:text-gray-400">
            {config.suffix}
          </span>
        )}
      </div>

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
