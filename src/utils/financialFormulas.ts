import type {
  AmortizationRow,
  CompoundRow,
  ZakatResult,
  SimulationResult,
} from '@/types/calculator';

// ---------------------------------------------------------------------------
// Loan Amortization (annuity / equal-payment method)
// ---------------------------------------------------------------------------

export function loanAmortization(
  principal: number,
  annualRate: number,
  tenorMonths: number
): AmortizationRow[] {
  const monthlyRate = annualRate / 100 / 12;
  const schedule: AmortizationRow[] = [];

  if (monthlyRate === 0) {
    const payment = principal / tenorMonths;
    let remaining = principal;
    for (let m = 1; m <= tenorMonths; m++) {
      remaining -= payment;
      schedule.push({
        month: m,
        payment,
        principal: payment,
        interest: 0,
        remainingBalance: Math.max(remaining, 0),
      });
    }
    return schedule;
  }

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenorMonths)) /
    (Math.pow(1 + monthlyRate, tenorMonths) - 1);

  let remaining = principal;

  for (let m = 1; m <= tenorMonths; m++) {
    const interest = remaining * monthlyRate;
    const princ = payment - interest;
    remaining -= princ;

    schedule.push({
      month: m,
      payment: roundTwo(payment),
      principal: roundTwo(princ),
      interest: roundTwo(interest),
      remainingBalance: Math.max(roundTwo(remaining), 0),
    });
  }

  return schedule;
}

// ---------------------------------------------------------------------------
// Compound Interest with monthly contributions (year-by-year breakdown)
// ---------------------------------------------------------------------------

export function compoundInterest(
  principal: number,
  monthlyAddition: number,
  annualRate: number,
  years: number
): CompoundRow[] {
  const monthlyRate = annualRate / 100 / 12;
  const rows: CompoundRow[] = [];
  let balance = principal;
  let totalDeposited = principal;

  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) {
      balance = balance * (1 + monthlyRate) + monthlyAddition;
      totalDeposited += monthlyAddition;
    }

    rows.push({
      year: y,
      totalDeposited: roundTwo(totalDeposited),
      interestEarned: roundTwo(balance - totalDeposited),
      balance: roundTwo(balance),
    });
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Flat → Effective Annual Rate (Newton-Raphson)
//
// Flat-rate loans quote a simple interest figure, but the actual cost to the
// borrower is higher because the outstanding principal decreases each month
// while interest is still charged on the original amount.
// ---------------------------------------------------------------------------

export function flatToEffectiveRate(flatRatePercent: number, tenorMonths: number): number {
  const flatRate = flatRatePercent / 100;
  const totalInterest = (flatRate * tenorMonths) / 12;
  const monthlyPayment = (1 + totalInterest) / tenorMonths;

  // Solve for monthly effective rate r such that:
  //   monthlyPayment = r(1+r)^n / ((1+r)^n - 1)
  let r = flatRate / 12; // initial guess
  const n = tenorMonths;

  for (let i = 0; i < 100; i++) {
    const pow = Math.pow(1 + r, n);
    const f = (r * pow) / (pow - 1) - monthlyPayment;
    const df =
      (pow * (pow - 1) -
        r * n * Math.pow(1 + r, n - 1) * (pow - 1) -
        r * pow * n * Math.pow(1 + r, n - 1)) /
      Math.pow(pow - 1, 2);

    // Simplified derivative via quotient rule
    const dPow = n * Math.pow(1 + r, n - 1);
    const numerator = r * pow;
    const denominator = pow - 1;
    const dNumerator = pow + r * dPow;
    const dDenominator = dPow;
    const derivative =
      (dNumerator * denominator - numerator * dDenominator) / (denominator * denominator);

    if (Math.abs(derivative) < 1e-15) break;

    const rNew = r - f / derivative;
    if (Math.abs(rNew - r) < 1e-10) {
      r = rNew;
      break;
    }
    r = rNew;
    if (r <= 0) r = 1e-10;
  }

  return roundTwo(r * 12 * 100);
}

// ---------------------------------------------------------------------------
// Zakat Maal
// ---------------------------------------------------------------------------

export function zakatMal(totalAssets: number, totalDebts: number, nisabValue: number): ZakatResult {
  const totalWealth = totalAssets - totalDebts;
  const isAboveNisab = totalWealth >= nisabValue;

  return {
    isAboveNisab,
    nisabValue,
    totalWealth,
    zakatAmount: isAboveNisab ? roundTwo(totalWealth * 0.025) : 0,
  };
}

// ---------------------------------------------------------------------------
// Extra Payment / Accelerated Payoff Simulation
// ---------------------------------------------------------------------------

export function extraPaymentSimulation(
  remainingPrincipal: number,
  annualRate: number,
  remainingMonths: number,
  extraPerMonth: number
): SimulationResult {
  const normalSchedule = runAmortization(remainingPrincipal, annualRate, remainingMonths, 0);
  const acceleratedSchedule = runAmortization(
    remainingPrincipal,
    annualRate,
    remainingMonths,
    extraPerMonth
  );

  const normalTotalInterest = normalSchedule.reduce((sum, r) => sum + r.interest, 0);
  const acceleratedTotalInterest = acceleratedSchedule.reduce((sum, r) => sum + r.interest, 0);

  return {
    normalTenorMonths: normalSchedule.length,
    acceleratedTenorMonths: acceleratedSchedule.length,
    normalTotalInterest: roundTwo(normalTotalInterest),
    acceleratedTotalInterest: roundTwo(acceleratedTotalInterest),
    interestSaved: roundTwo(normalTotalInterest - acceleratedTotalInterest),
    monthsSaved: normalSchedule.length - acceleratedSchedule.length,
    normalSchedule,
    acceleratedSchedule,
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function runAmortization(
  principal: number,
  annualRate: number,
  maxMonths: number,
  extraPerMonth: number
): AmortizationRow[] {
  const monthlyRate = annualRate / 100 / 12;
  const schedule: AmortizationRow[] = [];

  if (monthlyRate === 0) {
    const basePayment = principal / maxMonths;
    let remaining = principal;
    let month = 0;
    while (remaining > 0 && month < maxMonths) {
      month++;
      const payment = Math.min(basePayment + extraPerMonth, remaining);
      remaining -= payment;
      schedule.push({
        month,
        payment: roundTwo(payment),
        principal: roundTwo(payment),
        interest: 0,
        remainingBalance: Math.max(roundTwo(remaining), 0),
      });
    }
    return schedule;
  }

  const basePayment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, maxMonths)) /
    (Math.pow(1 + monthlyRate, maxMonths) - 1);

  let remaining = principal;
  let month = 0;

  while (remaining > 0.01 && month < maxMonths) {
    month++;
    const interest = remaining * monthlyRate;
    const totalPayment = Math.min(basePayment + extraPerMonth, remaining + interest);
    const princ = totalPayment - interest;
    remaining -= princ;

    schedule.push({
      month,
      payment: roundTwo(totalPayment),
      principal: roundTwo(princ),
      interest: roundTwo(interest),
      remainingBalance: Math.max(roundTwo(remaining), 0),
    });
  }

  return schedule;
}

function roundTwo(n: number): number {
  return Math.round(n * 100) / 100;
}
