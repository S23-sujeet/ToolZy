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

export interface DiscountResult {
  discountAmount: number;
  finalPrice: number;
}

export function calculateDiscount(originalPrice: number, discountPct: number): DiscountResult {
  if (!Number.isFinite(originalPrice) || !Number.isFinite(discountPct) || originalPrice < 0 || discountPct < 0 || discountPct > 100) {
    throw new Error('Enter a valid price and a discount percentage between 0 and 100.');
  }
  const discountAmount = (originalPrice * discountPct) / 100;
  return { discountAmount, finalPrice: originalPrice - discountAmount };
}

export type TaxMode = 'add' | 'extract';

export interface SalesTaxResult {
  netAmount: number;
  taxAmount: number;
  grossAmount: number;
}

/** "add": amount is tax-exclusive, tax gets added on top. "extract": amount already includes tax. */
export function calculateSalesTax(amount: number, taxPct: number, mode: TaxMode): SalesTaxResult {
  if (!Number.isFinite(amount) || !Number.isFinite(taxPct) || amount < 0 || taxPct < 0) {
    throw new Error('Enter a valid amount and tax percentage.');
  }
  if (mode === 'add') {
    const taxAmount = (amount * taxPct) / 100;
    return { netAmount: amount, taxAmount, grossAmount: amount + taxAmount };
  }
  const netAmount = amount / (1 + taxPct / 100);
  return { netAmount, taxAmount: amount - netAmount, grossAmount: amount };
}

export type InterestType = 'simple' | 'compound';

export interface InterestResult {
  interest: number;
  total: number;
}

export function calculateInterest(
  principal: number,
  annualRatePct: number,
  years: number,
  type: InterestType,
  compoundsPerYear = 1,
): InterestResult {
  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualRatePct) ||
    !Number.isFinite(years) ||
    principal <= 0 ||
    annualRatePct < 0 ||
    years <= 0
  ) {
    throw new Error('Enter a valid principal, interest rate, and number of years.');
  }
  const rate = annualRatePct / 100;
  if (type === 'simple') {
    const interest = principal * rate * years;
    return { interest, total: principal + interest };
  }
  if (!Number.isFinite(compoundsPerYear) || compoundsPerYear <= 0) {
    throw new Error('Enter a valid number of times interest compounds per year.');
  }
  const total = principal * (1 + rate / compoundsPerYear) ** (compoundsPerYear * years);
  return { interest: total - principal, total };
}

export type BiologicalSex = 'male' | 'female';

export const ACTIVITY_LEVELS: Array<{ key: string; label: string; multiplier: number }> = [
  { key: 'sedentary', label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
  { key: 'light', label: 'Lightly active (1-3 days/week)', multiplier: 1.375 },
  { key: 'moderate', label: 'Moderately active (3-5 days/week)', multiplier: 1.55 },
  { key: 'active', label: 'Very active (6-7 days/week)', multiplier: 1.725 },
  { key: 'extra', label: 'Extra active (physical job or 2x/day training)', multiplier: 1.9 },
];

export interface BmrResult {
  bmr: number;
  tdee: number;
}

/** Mifflin-St Jeor equation for basal metabolic rate, plus TDEE via activity multiplier. */
export function calculateBmr(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: BiologicalSex,
  activityKey: string,
): BmrResult {
  if (
    !Number.isFinite(weightKg) ||
    !Number.isFinite(heightCm) ||
    !Number.isFinite(age) ||
    weightKg <= 0 ||
    heightCm <= 0 ||
    age <= 0
  ) {
    throw new Error('Enter a valid weight, height, and age.');
  }
  const activity = ACTIVITY_LEVELS.find((a) => a.key === activityKey);
  if (!activity) throw new Error('Choose a valid activity level.');

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = sex === 'male' ? base + 5 : base - 161;
  return { bmr, tdee: bmr * activity.multiplier };
}

export const GRADE_POINTS: Array<{ key: string; label: string; points: number }> = [
  { key: 'A+', label: 'A+', points: 4.0 },
  { key: 'A', label: 'A', points: 4.0 },
  { key: 'A-', label: 'A-', points: 3.7 },
  { key: 'B+', label: 'B+', points: 3.3 },
  { key: 'B', label: 'B', points: 3.0 },
  { key: 'B-', label: 'B-', points: 2.7 },
  { key: 'C+', label: 'C+', points: 2.3 },
  { key: 'C', label: 'C', points: 2.0 },
  { key: 'C-', label: 'C-', points: 1.7 },
  { key: 'D+', label: 'D+', points: 1.3 },
  { key: 'D', label: 'D', points: 1.0 },
  { key: 'F', label: 'F', points: 0.0 },
];

export interface GpaCourse {
  gradeKey: string;
  credits: number;
}

export function calculateGpa(courses: GpaCourse[]): number {
  const valid = courses.filter((c) => Number.isFinite(c.credits) && c.credits > 0);
  if (valid.length === 0) throw new Error('Add at least one course with valid credits.');

  let totalPoints = 0;
  let totalCredits = 0;
  for (const course of valid) {
    const grade = GRADE_POINTS.find((g) => g.key === course.gradeKey);
    if (!grade) throw new Error(`Unknown grade "${course.gradeKey}".`);
    totalPoints += grade.points * course.credits;
    totalCredits += course.credits;
  }
  return totalPoints / totalCredits;
}
