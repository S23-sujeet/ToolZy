import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { ReceiptIcon } from '../../components/icons';
import { calculateTipSplit } from '../../lib/calculators';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function TipCalculator() {
  const [bill, setBill] = useState('80');
  const [tipPct, setTipPct] = useState('18');
  const [people, setPeople] = useState('2');

  const { result, error } = useMemo(() => {
    try {
      return { result: calculateTipSplit(Number(bill), Number(tipPct), Number(people)), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Enter valid bill details.' };
    }
  }, [bill, tipPct, people]);

  return (
    <ToolLayout
      title="Tip & Bill Split Calculator"
      description="Calculate the tip and split a bill evenly between any number of people."
      seoDescription="Free tip calculator and bill splitter. Calculate the tip amount and split the total evenly between friends."
      path="/tools/tip-calculator"
      icon={ReceiptIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Bill amount
          <input type="number" value={bill} onChange={(e) => setBill(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Tip (%)
          <input type="number" value={tipPct} onChange={(e) => setTipPct(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Number of people
          <input type="number" value={people} onChange={(e) => setPeople(e.target.value)} className={inputClass} min={1} />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result && (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-800">
                {result.perPerson.toLocaleString(undefined, { maximumFractionDigits: 2 })} / person
              </p>
              <p className="text-sm text-slate-500">Tip amount: {result.tipAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
              <p className="text-sm text-slate-500">Total (with tip): {result.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
