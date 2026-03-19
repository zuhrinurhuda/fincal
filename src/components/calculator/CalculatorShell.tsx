import { Component, useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import type { CalculatorConfig, FormattedResult } from '@/types/calculator';
import { debounce } from '@/utils/debounce';
import AmountInput from '@/components/calculator/AmountInput';
import InputField from '@/components/calculator/InputField';
import ResultCard from '@/components/calculator/ResultCard';

// ---------------------------------------------------------------------------
// ErrorBoundary — prevents a calculator crash from breaking the whole page
// ---------------------------------------------------------------------------

interface BoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Terjadi kesalahan pada kalkulator.
          </p>
          <button
            className="mt-3 text-xs text-red-500 underline dark:text-red-400"
            onClick={() => this.setState({ hasError: false })}
          >
            Coba lagi
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function validateValues(
  config: CalculatorConfig,
  values: Record<string, number | string>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const input of config.inputs) {
    if (input.type === 'select') continue;

    const raw = values[input.name];
    const n = Number(raw);

    if (raw === '' || raw === undefined) {
      errors[input.name] = `${input.label} wajib diisi`;
      continue;
    }

    if (isNaN(n)) {
      errors[input.name] = `${input.label} harus berupa angka`;
      continue;
    }

    if (input.min !== undefined && n < input.min) {
      errors[input.name] = `Nilai minimal: ${input.min}`;
    } else if (input.max !== undefined && n > input.max) {
      errors[input.name] = `Nilai maksimal: ${input.max}`;
    }
  }

  return errors;
}

// ---------------------------------------------------------------------------
// Main calculator component
// ---------------------------------------------------------------------------

function Calculator({ config }: { config: CalculatorConfig }) {
  const initialValues = useMemo<Record<string, number | string>>(() => {
    const vals: Record<string, number | string> = {};
    for (const input of config.inputs) {
      if (input.defaultValue !== undefined) {
        vals[input.name] = input.defaultValue;
      } else if (input.type === 'select') {
        vals[input.name] = input.options?.[0]?.value ?? 0;
      } else {
        vals[input.name] = 0;
      }
    }
    return vals;
  }, [config]);

  const [values, setValues] = useState<Record<string, number | string>>(initialValues);
  const [result, setResult] = useState<FormattedResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const compute = useCallback(
    (vals: Record<string, number | string>) => {
      const errs = validateValues(config, vals);
      setErrors(errs);
      if (Object.keys(errs).length === 0) {
        try {
          const raw = config.calculate(vals);
          setResult(config.formatResult(raw));
        } catch {
          // Silently keep previous result on formula error
        }
      }
    },
    [config]
  );

  // Debounced recalculation
  const debouncedCompute = useMemo(() => debounce(compute, 300), [compute]);

  // Calculate with defaults on mount
  useEffect(() => {
    compute(initialValues);
  }, [compute, initialValues]);

  // Recalculate whenever inputs change
  useEffect(() => {
    debouncedCompute(values);
    return () => debouncedCompute.cancel();
  }, [values, debouncedCompute]);

  const handleChange = useCallback((name: string, value: number | string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Input panel */}
      <div className="space-y-5 p-5 sm:p-6">
        <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
          Data Masukan
        </h2>

        {config.inputs.map((input) =>
          input.type === 'amount' ? (
            <AmountInput
              key={input.name}
              config={input}
              value={Number(values[input.name]) || 0}
              onChange={(val) => handleChange(input.name, val)}
              error={errors[input.name]}
            />
          ) : (
            <InputField
              key={input.name}
              config={input}
              value={values[input.name]}
              onChange={(val) => handleChange(input.name, val)}
              error={errors[input.name]}
            />
          )
        )}
      </div>

      {/* Result panel — separated by border */}
      {result && (
        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="px-5 pt-4 pb-0 sm:px-6">
            <h2 className="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Hasil Kalkulasi
            </h2>
          </div>
          <ResultCard
            result={result}
            partnerLink={config.partnerLink}
            ctaLabel={config.ctaLabel}
            ctaDisclaimer={config.ctaDisclaimer}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public export — wrapped in ErrorBoundary
// ---------------------------------------------------------------------------

export default function CalculatorShell({ config }: { config: CalculatorConfig }) {
  return (
    <ErrorBoundary>
      <Calculator config={config} />
    </ErrorBoundary>
  );
}
