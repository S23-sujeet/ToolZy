export interface BmiResult {
  bmi: number;
  category: string;
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || weightKg <= 0 || heightCm <= 0) {
    throw new Error('Enter a valid weight and height.');
  }
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  let category = 'Obese';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  return { bmi: Math.round(bmi * 10) / 10, category };
}

export type PercentageMode = 'percent-of' | 'is-what-percent-of' | 'percent-change';

export function calculatePercentage(mode: PercentageMode, a: number, b: number): number {
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('Enter valid numbers.');
  switch (mode) {
    case 'percent-of':
      return (a / 100) * b;
    case 'is-what-percent-of':
      if (b === 0) throw new Error('The second number cannot be zero.');
      return (a / b) * 100;
    case 'percent-change':
      if (a === 0) throw new Error('The starting value cannot be zero.');
      return ((b - a) / Math.abs(a)) * 100;
    default:
      throw new Error('Unknown calculation mode.');
  }
}

export interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
}

export function calculateLoanPayment(principal: number, annualRatePct: number, months: number): LoanResult {
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualRatePct) ||
    !Number.isFinite(months) ||
    principal <= 0 ||
    annualRatePct < 0 ||
    months <= 0
  ) {
    throw new Error('Enter a valid loan amount, interest rate, and term.');
  }
  const monthlyRate = annualRatePct / 100 / 12;
  const monthlyPayment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
  const totalPayment = monthlyPayment * months;
  return { monthlyPayment, totalPayment, totalInterest: totalPayment - principal };
}

export interface TipSplitResult {
  tipAmount: number;
  totalAmount: number;
  perPerson: number;
}

export function calculateTipSplit(bill: number, tipPct: number, people: number): TipSplitResult {
  if (!Number.isFinite(bill) || !Number.isFinite(tipPct) || !Number.isFinite(people) || bill < 0 || tipPct < 0 || people < 1) {
    throw new Error('Enter a valid bill amount, tip percentage, and number of people.');
  }
  const tipAmount = (bill * tipPct) / 100;
  const totalAmount = bill + tipAmount;
  return { tipAmount, totalAmount, perPerson: totalAmount / people };
}
