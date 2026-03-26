// ---------------------------------------------------------------------------
// Core calculator config types — shared across the entire app
// ---------------------------------------------------------------------------

export type InputConfig = {
  name: string;
  label: string;
  type: 'amount' | 'number' | 'select' | 'percentage';
  inputMode?: 'numeric' | 'decimal';
  options?: { label: string; value: number }[];
  prefix?: string;
  suffix?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  helpText?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type MethodSource = {
  label: string;
  source: string;
  url?: string;
};

export type CalculationResult = Record<string, number | string>;

export type FormattedResult = {
  primary: { label: string; value: string };
  breakdown: { label: string; value: string }[];
};

export type CalculatorCategory = 'Kredit' | 'Investasi' | 'Pajak & Zakat';

export type CalculatorConfig = {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  category: CalculatorCategory;
  icon: string;
  order: number;

  inputs: InputConfig[];

  calculate: (values: Record<string, number | string>) => CalculationResult;
  formatResult: (result: CalculationResult) => FormattedResult;

  faqs: FAQItem[];
  seoContent: string;
  methodSection: MethodSource[];

  relatedCalculators: string[];

  partnerLink?: string;
  ctaLabel?: string;
  ctaDisclaimer?: string;
};

// ---------------------------------------------------------------------------
// Financial formula return types
// ---------------------------------------------------------------------------

export type AmortizationRow = {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
};

export type CompoundRow = {
  year: number;
  totalDeposited: number;
  interestEarned: number;
  balance: number;
};

export type ZakatResult = {
  isAboveNisab: boolean;
  nisabValue: number;
  totalWealth: number;
  zakatAmount: number;
};

export type SimulationResult = {
  normalTenorMonths: number;
  acceleratedTenorMonths: number;
  normalTotalInterest: number;
  acceleratedTotalInterest: number;
  interestSaved: number;
  monthsSaved: number;
  normalSchedule: AmortizationRow[];
  acceleratedSchedule: AmortizationRow[];
};

// ---------------------------------------------------------------------------
// Ad slot types
// ---------------------------------------------------------------------------

export type AdSlot = 'top' | 'sidebar' | 'inArticle' | 'inFeed' | 'footer';

export type AdsConfig = {
  client: string;
  slots: Record<AdSlot, string>;
};
