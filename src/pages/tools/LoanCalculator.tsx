import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { CalculatorIcon } from '../../components/icons';
import { calculateLoanPayment } from '../../lib/calculators';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function LoanCalculator() {
  const [principal, setPrincipal] = useState('300000');
  const [rate, setRate] = useState('7.5');
  const [months, setMonths] = useState('360');

  const { result, error } = useMemo(() => {
    try {
      return { result: calculateLoanPayment(Number(principal), Number(rate), Number(months)), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Enter valid loan details.' };
    }
  }, [principal, rate, months]);

  return (
    <ToolLayout
      title="Loan / EMI Calculator"
      description="Estimate monthly payments and total interest on a loan or mortgage."
      seoDescription="Free loan and EMI calculator. Estimate your monthly payment, total interest and total repayment for any loan or mortgage."
      path="/tools/loan-calculator"
      icon={CalculatorIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Loan amount
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Annual interest rate (%)
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} min={0} step={0.01} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Term (months)
          <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className={inputClass} min={1} />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result && (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-800">
                {result.monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })} / month
              </p>
              <p className="text-sm text-slate-500">
                Total payment: {result.totalPayment.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
              <p className="text-sm text-slate-500">
                Total interest: {result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </p>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
