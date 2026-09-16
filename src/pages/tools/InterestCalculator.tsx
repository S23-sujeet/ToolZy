import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { TrendingUpIcon } from '../../components/icons';
import { calculateInterest } from '../../lib/calculators';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

const COMPOUND_OPTIONS = [
  { value: 1, label: 'Annually' },
  { value: 2, label: 'Semi-annually' },
  { value: 4, label: 'Quarterly' },
  { value: 12, label: 'Monthly' },
  { value: 365, label: 'Daily' },
];

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('6');
  const [years, setYears] = useState('5');
  const [compoundsPerYear, setCompoundsPerYear] = useState(12);

  const { simple, compound, error } = useMemo(() => {
    try {
      return {
        simple: calculateInterest(Number(principal), Number(rate), Number(years), 'simple'),
        compound: calculateInterest(Number(principal), Number(rate), Number(years), 'compound', compoundsPerYear),
        error: null,
      };
    } catch (err) {
      return { simple: null, compound: null, error: err instanceof Error ? err.message : 'Enter valid numbers.' };
    }
  }, [principal, rate, years, compoundsPerYear]);

  return (
    <ToolLayout
      title="Simple & Compound Interest Calculator"
      description="Compare simple and compound interest earned on a principal over time."
      seoDescription="Free simple and compound interest calculator. Compare how much interest a principal amount earns over time under both methods."
      path="/tools/interest-calculator"
      icon={TrendingUpIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Principal
          <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Annual interest rate (%)
          <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Years
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Compounding frequency
          <select value={compoundsPerYear} onChange={(e) => setCompoundsPerYear(Number(e.target.value))} className={inputClass}>
            {COMPOUND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-600">Simple interest</p>
          {error ? (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          ) : (
            simple && (
              <div className="mt-2 space-y-1">
                <p className="text-xl font-bold text-slate-800">{simple.total.toFixed(2)}</p>
                <p className="text-sm text-slate-500">Interest: {simple.interest.toFixed(2)}</p>
              </div>
            )
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-600">Compound interest</p>
          {error ? (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          ) : (
            compound && (
              <div className="mt-2 space-y-1">
                <p className="text-xl font-bold text-slate-800">{compound.total.toFixed(2)}</p>
                <p className="text-sm text-slate-500">Interest: {compound.interest.toFixed(2)}</p>
              </div>
            )
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
